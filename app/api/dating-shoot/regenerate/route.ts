import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { generateSingleDatingImage } from "@/trigger/dating-shoot";
import { makeDeterministicPhotoId, slotToIndex } from "@/lib/dating/deterministic-id";
import { planReplacement } from "@/lib/dating/select-delivery";
import { deriveBias } from "@/lib/dating/interests";
import { compileDatingPrompt } from "@/lib/dating/prompt-params";
import { getPromptVariants } from "@/lib/dating/prompt-library";
import type { ExcludableTag, StylePref } from "@/lib/dating/types";
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
      .select(
        "id, bucket, slot, prompt_template, image_width, image_height, deterministic_id"
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

    // Regeneration used to re-send the stored prompt, so a user who disliked a
    // photo paid a credit and received the same shot. Draw a shot this delivery
    // has not used instead: different place, outfit and light.
    const { data: prefs } = await admin
      .from("user_preferences")
      .select("interests, style, exclude_tags, hobby_text")
      .eq("user_id", user.id)
      .maybeSingle();

    const { data: siblings } = await admin
      .from("order_photos")
      .select("slot")
      .eq("order_id", orderId)
      .eq("bucket", photo.bucket);

    const excludeTags = (prefs?.exclude_tags ?? []) as ExcludableTag[];
    const bias = deriveBias(
      (prefs?.interests ?? []) as never,
      (prefs?.style ?? "casual") as StylePref
    );
    const usedSlots = (siblings ?? []).map((row) => row.slot as number);
    // Attempts differ so a second redo of the same photo lands somewhere new.
    const attempt = Date.now();
    const replacement = planReplacement(
      orderId,
      bias,
      photo.bucket as DatingBucket,
      usedSlots,
      attempt,
      { excludeTags }
    );

    let prompt = photo.prompt_template as string;
    let imageWidth = photo.image_width as number | null;
    let imageHeight = photo.image_height as number | null;

    if (replacement) {
      const definition = getPromptVariants(
        replacement.bucket,
        replacement.slot
      ).find((candidate) => candidate.variant === replacement.variant);
      if (definition) {
        // Keep his interest on the replacement. Dropping it meant a redo of a
        // hobby photo came back as the generic version of that scene.
        const hobbies = (prefs?.hobby_text ?? "")
          .split(",")
          .map((part: string) => part.trim())
          .filter(Boolean);
        prompt = compileDatingPrompt(definition, {
          vibe: replacement.vibe,
          style: replacement.style,
          hobby:
            definition.hobbyPromptTemplate && hobbies.length > 0
              ? hobbies[attempt % hobbies.length]
              : null,
        });
        imageWidth = definition.imageSize.width;
        imageHeight = definition.imageSize.height;
      }
    }

    // Clear completed so child re-generates (upsert will overwrite).
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
        // The row records the shot it will actually be, so a retry of the
        // regeneration reproduces the replacement rather than the original.
        prompt_template: prompt,
        image_width: imageWidth,
        image_height: imageHeight,
        slot: replacement?.slot ?? photo.slot,
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

    // Unique idempotency key per regen attempt
    const handle = await generateSingleDatingImage.trigger(
      {
        userId: user.id,
        batchId: orderId,
        modelId: order.model_id,
        bucket: photo.bucket as DatingBucket,
        index,
        prompt,
        referenceImageUrls,
        imageWidth,
        imageHeight,
        // A reshoot costs the user something, so it must never be served by the
        // mock path. Under DATING_TEST_MODE=mock the placeholder is a pure
        // function of (bucket, slot) and comes back byte-identical, which is
        // exactly the "regenerate does nothing" the user reported.
        useMock: false,
        // Forces a fresh R2 object. The key is otherwise derived from
        // (bucket, index) alone, so a regenerated photo overwrote the same path
        // and the CDN kept serving the old image.
        variantKey: `r${Date.now().toString(36)}`,
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
