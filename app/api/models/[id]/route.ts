import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { deleteR2Objects } from "@/lib/r2";
import { clearStage } from "@/lib/auth/stage";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Helper to extract R2 key from full URI
function extractR2Key(uri: string): string | null {
    const r2BaseUrl = process.env.R2_PUBLIC_URL || "";
    if (uri.startsWith(r2BaseUrl)) {
        return uri.replace(`${r2BaseUrl}/`, "");
    }
    // Try to extract key from URI pattern
    const match = uri.match(/\/(models\/[^?]+)/);
    return match ? match[1] : null;
}

// PATCH: Update model fields (status, name)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    const supabase = await createClient();
    const { id: modelId } = await params;

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
        const body = await request.json();
        const updates: Record<string, string> = {};
        if (typeof body.status === "string") updates.status = body.status;
        if (typeof body.name === "string") updates.name = body.name;

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ error: "No valid fields" }, { status: 400 });
        }

        const { data: updated, error: updateError } = await supabase
            .from("models")
            .update(updates)
            .eq("id", modelId)
            .select()
            .single();

        if (updateError) {
            return NextResponse.json({ error: "Failed to update model" }, { status: 500 });
        }

        return NextResponse.json({ model: updated });
    } catch {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}

// DELETE: Delete a model and all associated data
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    const supabase = await createClient();
    const { id: modelId } = await params;

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the model belongs to the user
    const { data: model, error: modelError } = await supabase
        .from("models")
        .select("id, user_id, name")
        .eq("id", modelId)
        .single();

    if (modelError || !model) {
        return NextResponse.json({ error: "Model not found" }, { status: 404 });
    }

    if (model.user_id !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        // 1. Fetch all sample image URIs
        const { data: samples } = await supabase
            .from("samples")
            .select("uri")
            .eq("modelId", parseInt(modelId));

        // 2. Fetch all generated image URIs
        const { data: images } = await supabase
            .from("images")
            .select("uri")
            .eq("modelId", parseInt(modelId));

        // 3. Collect all R2 keys to delete
        const r2Keys: string[] = [];

        if (samples) {
            samples.forEach((s) => {
                const key = extractR2Key(s.uri);
                if (key) r2Keys.push(key);
            });
        }

        if (images) {
            images.forEach((img) => {
                const key = extractR2Key(img.uri);
                if (key) r2Keys.push(key);
            });
        }

        // 4. Delete all files from R2
        if (r2Keys.length > 0) {
            const { deleted, failed } = await deleteR2Objects(r2Keys);
            console.log(`Deleted ${deleted.length} R2 objects, ${failed.length} failed`);
        }

        // 5. Delete generated images from DB
        const { error: imagesError } = await supabase
            .from("images")
            .delete()
            .eq("modelId", parseInt(modelId));

        if (imagesError) {
            console.error("Error deleting images:", imagesError);
        }

        // 6. Delete samples from DB (may cascade, but explicit is safer)
        const { error: samplesError } = await supabase
            .from("samples")
            .delete()
            .eq("modelId", parseInt(modelId));

        if (samplesError) {
            console.error("Error deleting samples:", samplesError);
        }

        // 7. Delete the model from DB
        const { error: deleteError } = await supabase
            .from("models")
            .delete()
            .eq("id", modelId);

        if (deleteError) {
            console.error("Error deleting model:", deleteError);
            return NextResponse.json({ error: "Failed to delete model" }, { status: 500 });
        }

        const response = NextResponse.json({
            success: true,
            message: `Model "${model.name}" deleted successfully`,
            deletedR2Objects: r2Keys.length,
        });

        // Drop the cached routing hint — this user may no longer have a usable
        // model, and the edge gate must re-resolve rather than keep sending them
        // to a studio that cannot work.
        clearStage(response);

        return response;
    } catch (error) {
        console.error("Error deleting model:", error);
        return NextResponse.json(
            { error: "Failed to delete model", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
