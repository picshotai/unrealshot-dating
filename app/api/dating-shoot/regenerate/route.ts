import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { generateSingleDatingImage } from "@/trigger/dating-shoot";
import { makeDeterministicPhotoId, slotToIndex } from "@/lib/dating/deterministic-id";
import type { DatingBucket } from "@/lib/dating/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Spend 1 custom credit → single child-task run (not a third task definition).
 * Uses the same generate-single-dating-image child worker.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { orderId, photoId } = await request.json();
    if (!orderId || !photoId) {
      return NextResponse.json(
        { error: "orderId and photoId required" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    const { data: order } = await admin
      .from("user_shoot_orders")
      .select("id, user_id, model_id, custom_credits_remaining")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if ((order.custom_credits_remaining ?? 0) < 1) {
      return NextResponse.json(
        { error: "No custom credits remaining" },
        { status: 402 }
      );
    }

    const { data: photo } = await admin
      .from("order_photos")
      .select("id, bucket, slot, prompt_template, deterministic_id")
      .eq("id", photoId)
      .eq("order_id", orderId)
      .single();

    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    const { data: model } = await admin
      .from("models")
      .select("id, samples(uri)")
      .eq("id", order.model_id)
      .single();

    const referenceImageUrls = (((model as any)?.samples || []) as { uri: string }[])
      .map((s) => s.uri)
      .filter(Boolean);

    if (!referenceImageUrls.length) {
      return NextResponse.json(
        { error: "Model has no sample images" },
        { status: 400 }
      );
    }

    const { error: creditErr } = await admin
      .from("user_shoot_orders")
      .update({
        custom_credits_remaining: order.custom_credits_remaining - 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .eq("custom_credits_remaining", order.custom_credits_remaining);

    if (creditErr) {
      return NextResponse.json(
        { error: "Failed to deduct custom credit" },
        { status: 500 }
      );
    }

    const index = slotToIndex(photo.slot);
    const deterministicId =
      photo.deterministic_id ||
      makeDeterministicPhotoId(orderId, photo.bucket, index);

    // Clear completed so child re-generates (upsert will overwrite)
    await admin
      .from("order_photos")
      .update({
        status: "pending",
        image_url: null,
        fal_request_id: null,
        failed_reason: null,
        aesthetic_score: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", photoId);

    // Unique idempotency key per regen attempt
    const handle = await generateSingleDatingImage.trigger(
      {
        userId: user.id,
        batchId: orderId,
        modelId: order.model_id,
        bucket: photo.bucket as DatingBucket,
        index,
        prompt: photo.prompt_template,
        referenceImageUrls,
      },
      {
        idempotencyKey: `${deterministicId}_regen_${Date.now()}`,
      }
    );

    return NextResponse.json({
      success: true,
      triggerRunId: handle.id,
      deterministicId,
      customCreditsRemaining: order.custom_credits_remaining - 1,
    });
  } catch (error) {
    console.error("regenerate failed:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Regenerate failed",
      },
      { status: 500 }
    );
  }
}
