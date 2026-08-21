import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { putR2Object } from "@/lib/r2";
import { apiRateLimit, checkRateLimit } from "@/utils/rate-limit";
import { REQUIRED_SAMPLES, setStage } from "@/lib/auth/stage";
import { sanitizeDatingReferenceImage } from "@/lib/dating/reference-image";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function sanitizeFilename(name: string) {
    const base = name?.split("/").pop() || "file";
    return base.replace(/[^a-zA-Z0-9._-]/g, "-");
}

// POST: Upload a single sample image for a model
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    const supabase = await createClient();
    const { id: modelId } = await params;

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Non-blocking rate-limit instrumentation: logs when exceeded
    const rl = await checkRateLimit(`sample-upload:user:${user.id}`, apiRateLimit);
    if (!rl.success) {
        console.warn("Rate limit exceeded on sample-upload", {
            userId: user.id,
            modelId,
            limit: rl.limit,
            remaining: rl.remaining,
            reset: rl.reset,
        });
    }
    // Verify the model belongs to the user
    const { data: model, error: modelError } = await supabase
        .from("models")
        .select("id, user_id")
        .eq("id", modelId)
        .single();

    if (modelError || !model) {
        return NextResponse.json({ error: "Model not found" }, { status: 404 });
    }

    if (model.user_id !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const providedName = (formData.get("filename") as string) || file?.name || "image.jpg";

        if (!file) {
            return NextResponse.json({ error: "Missing file" }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);
        const contentType = file.type || "application/octet-stream";
        if (!allowedTypes.has(contentType)) {
            return NextResponse.json({ error: "Unsupported file type" }, { status: 415 });
        }

        // Validate file size (10MB max per file)
        const maxSizeBytes = 10 * 1024 * 1024;
        const size = file.size;
        if (typeof size === "number" && size > maxSizeBytes) {
            return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 413 });
        }

        // Generate unique key for R2
        const sanitized = sanitizeFilename(providedName).replace(/\.[^.]+$/, "") || "reference";
        const unique = `${Date.now()}-${crypto.randomUUID()}`;
        const key = `models/${user.id}/${modelId}/samples/${unique}-${sanitized}.jpg`;

        // Normalize orientation, strip metadata and remove the bottom camera-stamp
        // edge before this file can ever become a generation reference. The old
        // detector missed real "Shot on…" watermarks; deterministic sanitation
        // closes that failure mode without false-positive upload rejections.
        const arrayBuffer = await file.arrayBuffer();
        const body = await sanitizeDatingReferenceImage(Buffer.from(arrayBuffer));
        await putR2Object(key, body, "image/jpeg");

        // Construct the public URL
        const r2BaseUrl = process.env.R2_PUBLIC_URL || "";
        const uri = `${r2BaseUrl}/${key}`;

        // Save to samples table
        const { data: sample, error: sampleError } = await supabase
            .from("samples")
            .insert({
                uri,
                modelId: parseInt(modelId),
                reference_sanitized: true,
            })
            .select()
            .single();

        if (sampleError) {
            console.error("Error saving sample to DB:", sampleError);
            return NextResponse.json({ error: "Failed to save sample" }, { status: 500 });
        }

        // Check how many samples exist for this model
        const { count } = await supabase
            .from("samples")
            .select("*", { count: "exact", head: true })
            .eq("modelId", parseInt(modelId));

        // A model is only 'ready' once it has enough samples to actually shoot
        // with. This threshold used to be 3 while createDatingShootOrder demanded
        // 4, so a 3-sample user was routed into the studio and then refused.
        const isReady = Boolean(count && count >= REQUIRED_SAMPLES);
        if (isReady) {
            await supabase
                .from("models")
                .update({ status: "ready" })
                .eq("id", modelId);
        }

        const response = NextResponse.json({
            sample,
            key,
            uri,
        });

        // The edge gate routes off this cookie. Update it the moment the model
        // becomes usable so the next navigation already knows.
        if (isReady) {
            setStage(response, "ready");
        }

        return response;
    } catch (error) {
        console.error("R2 upload failed:", error);
        return NextResponse.json(
            { error: "Upload failed", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
