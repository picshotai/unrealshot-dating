import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { generateSingleDatingImage } from "@/trigger/dating-shoot";
import { makeDeterministicPhotoId } from "@/lib/dating/deterministic-id";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Spend 1 reshoot → a single run of the same child worker.
 *
 * A reshoot now regenerates the frame **in place**: same shoot, same prompt,
 * same anchor. Under the compositional library that would have been pointless —
 * the prompt was deterministic, so re-sending it returned the same photo, and
 * the route had to draw a *different* shot from the library to give the user
 * anything new. Two things changed that:
 *
 *   1. The model is not reproducible in edit mode. Identical prompt, identical
 *      references and an identical seed return a different image, which testing
 *      confirmed repeatedly. Re-sending the prompt is a real second take.
 *   2. A shoot is the unit of coherence. Swapping in a scene from elsewhere
 *      would put a marina frame inside the kitchen shoot, which is exactly the
 *      incoherence the whole rewrite exists to remove.
 *
 * So the replacement planner, the prompt compiler and the used-slot bookkeeping
 * are all gone, along with the bug where this route wrote the replacement's slot
 * while the child wrote the original one back from its payload.
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
        { error: "No reshoots remaining" },
        { status: 402 }
      );
    }

    const { data: photo } = await admin
      .from("order_photos")
      .select(
        "id, shoot_id, frame_index, is_anchor, anchor_photo_id, prompt_template, image_width, image_height, deterministic_id"
      )
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

    // The frame this one was anchored on when the delivery ran. Read from the
    // stored id rather than recomputed, so a reshoot lands in the same room,
    // the same clothes and the same light as its three siblings.
    //
    // Reshooting the anchor itself deliberately leaves the siblings pointing at
    // its row: they keep referencing whatever that frame is, and since a reshot
    // anchor re-runs the same authored prompt it is the same scene either way.
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
        { error: "Failed to deduct reshoot" },
        { status: 500 }
      );
    }

    const deterministicId =
      photo.deterministic_id ||
      makeDeterministicPhotoId(orderId, photo.shoot_id, photo.frame_index);

    // Clear completed so the child re-generates (its upsert will overwrite).
    //
    // This error used to be discarded. When the update failed the row kept its
    // old status and image_url, the child then hit its "already completed" fast
    // path and skipped the GPU entirely — so the user paid a reshoot and got the
    // same photo back, silently. Refund and refuse instead.
    const { error: resetErr } = await admin
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
        { error: "Could not start the reshoot. Your reshoot was not used." },
        { status: 500 }
      );
    }

    const handle = await generateSingleDatingImage.trigger(
      {
        userId: user.id,
        batchId: orderId,
        modelId: order.model_id,
        shootId: photo.shoot_id,
        frameIndex: photo.frame_index,
        prompt: photo.prompt_template,
        referenceImageUrls,
        anchorImageUrl,
        imageWidth: photo.image_width,
        imageHeight: photo.image_height,
        // A reshoot costs the user something, so it must never be served by the
        // mock path. Under DATING_TEST_MODE=mock the placeholder is a pure
        // function of (shootId, frameIndex) and comes back byte-identical, which
        // is exactly the "regenerate does nothing" the user reported.
        useMock: false,
        // Forces a fresh R2 object. The key is otherwise derived from
        // (shootId, frameIndex) alone, so a regenerated photo overwrote the same
        // path and the CDN kept serving the old image.
        variantKey: `r${Date.now().toString(36)}`,
      },
      {
        // Unique per attempt. A raw-string key is run-scoped on this SDK, and a
        // reused one returns the earlier run's result — including its failure.
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
