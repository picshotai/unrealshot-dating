import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { generateSingleDatingImage } from "@/trigger/dating-shoot";
import { makeDeterministicPhotoId } from "@/lib/dating/deterministic-id";
import {
  verifiedDatingReferenceUrls,
  type StoredDatingReference,
} from "@/lib/dating/reference-image";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Spend 1 Photo Retake → a single run of the same child worker.
 *
 * A Photo Retake regenerates exactly 1 individual existing photo in place:
 * same shoot, same prompt, same anchor, keeping it inside its original shoot.
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
    const { orderId, photoId, feedback } = await request.json();
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
        { error: "No Photo Retakes remaining" },
        { status: 402 }
      );
    }

    const { data: photo } = await admin
      .from("order_photos")
      .select(
        "id, order_shoot_id, shoot_id, frame_index, framing, role_label, moment_summary, is_anchor, anchor_photo_id, prompt_template, image_width, image_height, deterministic_id, status, image_url"
      )
      .eq("id", photoId)
      .eq("order_id", orderId)
      .single();

    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    const { data: model } = await admin
      .from("models")
      .select("id, samples(uri, reference_sanitized)")
      .eq("id", order.model_id)
      .single();

    let referenceImageUrls: string[];
    try {
      referenceImageUrls = verifiedDatingReferenceUrls(
        ((model as any)?.samples || []) as StoredDatingReference[]
      );
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Reference photos are not usable" },
        { status: 400 }
      );
    }

    // The frame this one was anchored on when the delivery ran.
    let anchorImageUrl: string | null = null;
    if (!photo.is_anchor && photo.anchor_photo_id) {
      const { data: anchor } = await admin
        .from("order_photos")
        .select("image_url, status")
        .eq("id", photo.anchor_photo_id)
        .maybeSingle();
      if (anchor?.image_url && !anchor.image_url.startsWith("data:")) {
        anchorImageUrl = anchor.image_url;
      }
    }

    // Handle optional user feedback to refine the prompt before re-generating
    let targetPrompt = photo.prompt_template;
    const cleanFeedback = typeof feedback === "string" ? feedback.trim() : "";
    if (cleanFeedback) {
      let shootIntent: any = null;
      if (photo.order_shoot_id) {
        const { data: shootRow } = await (admin as any)
          .from("dating_order_shoots")
          .select("shoot_intent")
          .eq("id", photo.order_shoot_id)
          .maybeSingle();
        shootIntent = shootRow?.shoot_intent;
      }

      const { refinePromptForRetake } = await import("@/lib/dating/creative-director");
      targetPrompt = await refinePromptForRetake({
        originalPrompt: photo.prompt_template,
        feedback: cleanFeedback,
        outfit: shootIntent?.outfit,
        isAnchor: photo.is_anchor,
        cameraDistance: photo.framing,
        shootTitle: shootIntent?.title || photo.role_label,
      });
    }

    // Optimistically deduct 1 Photo Retake
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
        { error: "Failed to deduct Photo Retake" },
        { status: 500 }
      );
    }

    const deterministicId =
      photo.deterministic_id ||
      makeDeterministicPhotoId(orderId, photo.shoot_id, photo.frame_index);

    // Clear completed so the child re-generates
    const { error: resetErr } = await admin
      .from("order_photos")
      .update({
        status: "pending",
        image_url: null,
        prompt_template: targetPrompt,
        fal_request_id: null,
        failed_reason: null,
        aesthetic_score: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", photoId);

    if (resetErr) {
      console.error("regenerate: failed to reset photo row:", resetErr.message);
      await admin
        .from("user_shoot_orders")
        .update({
          custom_credits_remaining: order.custom_credits_remaining,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      return NextResponse.json(
        { error: "Could not start the Photo Retake. Your Photo Retake was not used." },
        { status: 500 }
      );
    }

    let handle;
    try {
      handle = await generateSingleDatingImage.trigger(
        {
          userId: user.id,
          batchId: orderId,
          modelId: order.model_id,
          shootId: photo.shoot_id,
          frameIndex: photo.frame_index,
          prompt: targetPrompt,
          referenceImageUrls,
          anchorImageUrl,
          imageWidth: photo.image_width,
          imageHeight: photo.image_height,
          useMock: false,
          variantKey: `r${Date.now().toString(36)}`,
        },
        {
          idempotencyKey: `${deterministicId}_regen_${Date.now()}`,
        }
      );
    } catch (dispatchErr) {
      console.error("regenerate: trigger dispatch failed, refunding retake:", dispatchErr);
      // Refund the 1 Photo Retake
      await admin
        .from("user_shoot_orders")
        .update({
          custom_credits_remaining: order.custom_credits_remaining,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      // Restore the photo row so it is not stuck in pending
      await admin
        .from("order_photos")
        .update({
          status: photo.status || "completed",
          image_url: photo.image_url,
          failed_reason: "Photo Retake dispatch failed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", photoId);

      return NextResponse.json(
        { error: "Could not dispatch Photo Retake. Your Photo Retake was refunded." },
        { status: 500 }
      );
    }

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
        error: error instanceof Error ? error.message : "Photo Retake failed",
      },
      { status: 500 }
    );
  }
}
