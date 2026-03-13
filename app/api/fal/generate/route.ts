import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { fal } from "@fal-ai/client";
import { enhancePrompt, enhanceCouplePrompt } from "@/lib/genai";
import { hasCredits, deductCredits } from "@/lib/credits";
import { apiRateLimit, checkRateLimit } from "@/utils/rate-limit";

const FAL_KEY = process.env.FAL_KEY;
const WEBHOOK_URL = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/fal/webhook`
    : null;

if (!FAL_KEY) {
    console.warn("MISSING FAL_KEY env variable");
}

fal.config({ credentials: FAL_KEY || "" });

const CREDIT_COST = 1;

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST: Submit image generation job to fal.ai queue
export async function POST(request: NextRequest) {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit check
    const rl = await checkRateLimit(`fal-generate:${user.id}`, apiRateLimit);
    if (!rl.success) {
        console.warn("Rate limit exceeded on fal-generate", { userId: user.id });
    }

    try {
        const body = await request.json();
        const { modelId, prompt, mode, gender, lighting, aspectRatio } = body;

        if (!modelId || !prompt) {
            return NextResponse.json({ error: "modelId and prompt are required" }, { status: 400 });
        }

        // Check credits
        const { hasCredits: hasSufficientCredits, currentBalance } = await hasCredits(user.id, CREDIT_COST);
        if (!hasSufficientCredits) {
            return NextResponse.json({
                error: "Insufficient credits",
                currentBalance
            }, { status: 402 });
        }

        // Verify model belongs to user
        const { data: model, error: modelError } = await supabase
            .from("models")
            .select("id, user_id, type, mode, samples(uri)")
            .eq("id", modelId)
            .single();

        if (modelError || !model || model.user_id !== user.id) {
            return NextResponse.json({ error: "Model not found or forbidden" }, { status: 404 });
        }

        // Get sample image URLs for reference
        const referenceImageUrls = (model.samples || []).map((s: any) => s.uri);
        if (referenceImageUrls.length === 0) {
            return NextResponse.json({ error: "Model has no sample images" }, { status: 400 });
        }

        // Enhance prompt - use couple prompt enhancer for couple models
        const isCouple = model.mode === 'couple';
        const enhancedPrompt = isCouple
            ? await enhanceCouplePrompt(prompt, mode || "FLASH", lighting || "DAYLIGHT")
            : await enhancePrompt(prompt, mode || "FLASH", gender || model.type || "Male", lighting || "DAYLIGHT");

        // Deduct credits upfront (optimistic)
        const { success: deducted } = await deductCredits(user.id, CREDIT_COST);
        if (!deducted) {
            return NextResponse.json({ error: "Failed to deduct credits" }, { status: 500 });
        }

        // Map aspect ratio to fal.ai supported sizes
        // Fal supports: portrait_4_3, portrait_16_9, landscape_4_3, landscape_16_9, or custom { width, height }
        let imageSize: string | { width: number; height: number };

        switch (aspectRatio) {
            case "9:16":
                imageSize = "portrait_16_9";  // Tall portrait (phone screen)
                break;
            case "16:9":
                imageSize = "landscape_16_9"; // Wide landscape
                break;
            case "3:4":
                imageSize = "portrait_4_3";   // Standard portrait
                break;
            case "4:5":
                imageSize = { width: 1080, height: 1350 };  // Instagram portrait (not natively supported)
                break;
            case "4:3":
                imageSize = "landscape_4_3";  // Standard landscape
                break;
            case "5:4":
                imageSize = { width: 1350, height: 1080 };  // Slightly wide (not natively supported)
                break;
            default:
                imageSize = "portrait_16_9";  // Default to 9:16
        }

        // Submit to fal.ai queue with webhook
        const { request_id } = await fal.queue.submit("fal-ai/bytedance/seedream/v4.5/edit", {
            input: {
                prompt: enhancedPrompt,
                image_urls: referenceImageUrls,
                image_size: imageSize,
                num_images: 1,
                enable_safety_checker: true,
            },
            webhookUrl: WEBHOOK_URL || undefined,
        });

        // Save job to database
        const { data: job, error: jobError } = await supabase
            .from("generation_jobs")
            .insert({
                user_id: user.id,
                model_id: parseInt(modelId),
                fal_request_id: request_id,
                prompt,
                enhanced_prompt: enhancedPrompt,
                status: "pending",
                credits_deducted: CREDIT_COST,
            })
            .select()
            .single();

        if (jobError) {
            console.error("Failed to save job:", jobError);
            // Still return success since fal job was submitted
        }

        return NextResponse.json({
            success: true,
            jobId: job?.id,
            requestId: request_id,
            status: "pending",
        });

    } catch (error) {
        console.error("Error submitting fal job:", error);
        return NextResponse.json({
            error: "Failed to submit generation job",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
