import { createAdminClient } from "@/utils/supabase/admin";
import { makeDeterministicPhotoId } from "./deterministic-id";
import {
  assertDeliveryShape,
  planShootDelivery,
} from "./select-shoots";
import type { DeliveryBias } from "./interests";
import {
  deriveBias,
  dominantStyle,
  dominantVibe,
  type InterestId,
} from "./interests";
import { refundShootCredits, spendShootCredits } from "./credits-gate";
import {
  ACTIVE_ORDER_STATUSES,
  CUSTOM_CREDITS_DEFAULT,
  type ExcludableTag,
  SHOOT_CREDIT_COST,
  TOTAL_PHOTOS,
  type StylePref,
  type Vibe,
} from "./types";
import { datingPhotoshootOrchestrator } from "@/trigger/dating-shoot";

/** Refusals the API can translate into a status code, as distinct from faults. */
export class DatingOrderError extends Error {
  constructor(
    message: string,
    readonly code: "order_in_progress" | "insufficient_credits",
    readonly detail: Record<string, unknown> = {}
  ) {
    super(message);
    this.name = "DatingOrderError";
  }
}

export type CreateOrderInput = {
  userId: string;
  modelId: number;
  /** What he actually does. Drives the vibe weighting and the hobby prompts. */
  interests?: InterestId[];
  /** How he dresses, answered with pictures rather than the word "style". */
  dress?: StylePref;
  /** Content he asked us to leave out: dog, alcohol, bicycle, team sport. */
  excludeTags?: ExcludableTag[];
  /** Legacy callers may still send a locked vibe/style; both become a lean. */
  vibe?: Vibe;
  style?: StylePref;
};

/**
 * Create batch (order), pre-allocate 100 order_photos with deterministic IDs,
 * kick off parent orchestrator (exactly one parent task).
 */
export async function createDatingShootOrder(input: CreateOrderInput) {
  const db = createAdminClient();
  const {
    userId,
    modelId,
    interests = [],
    dress,
    excludeTags = [],
  } = input;

  // A locked vibe/style from an older client is honoured as a strong lean so
  // in-flight sessions keep working, but nothing locks the delivery any more.
  const bias: DeliveryBias = input.vibe
    ? {
        ...deriveBias(interests, dress ?? input.style ?? "casual"),
        vibe: {
          urban: input.vibe === "urban" ? 0.5 : 0.25,
          outdoorsy: input.vibe === "outdoorsy" ? 0.5 : 0.25,
          homebody: input.vibe === "homebody" ? 0.5 : 0.25,
        },
      }
    : deriveBias(interests, dress ?? input.style ?? "casual");

  const vibe = dominantVibe(bias);
  const style = dominantStyle(bias);

  const { data: model, error: modelErr } = await db
    .from("models")
    .select("id, user_id, samples(uri)")
    .eq("id", modelId)
    .single();

  if (modelErr || !model || model.user_id !== userId) {
    throw new Error("Model not found or forbidden");
  }

  const samples = ((model as any).samples || []) as { uri: string }[];
  if (samples.length < 4) {
    throw new Error("Upload at least 4 reference photos before ordering");
  }

  const referenceImageUrls = samples.map((s) => s.uri).filter(Boolean);

  // One shoot at a time. Without this a double-click or a second tab starts two
  // hundred-photo runs and charges twice.
  const { data: running } = await db
    .from("user_shoot_orders")
    .select("id, status")
    .eq("user_id", userId)
    .in("status", [...ACTIVE_ORDER_STATUSES])
    .limit(1);

  if (running && running.length > 0) {
    throw new DatingOrderError(
      "A shoot is already running. Wait for it to finish before starting another.",
      "order_in_progress",
      { orderId: running[0].id as string }
    );
  }

  // Charge before any GPU work is dispatched. Charging afterwards means a crash
  // between allocation and dispatch gives away a shoot. Every failure path from
  // here on refunds.
  const spend = await spendShootCredits(userId, SHOOT_CREDIT_COST);
  if (!spend.ok) {
    // Phrased in packs, not credits — the buyer never sees the wallet figure,
    // so quoting it here would be the only place a raw number appears.
    throw new DatingOrderError(
      "You don't have a pack yet — grab one to start your shoot.",
      "insufficient_credits",
      { required: SHOOT_CREDIT_COST, balance: spend.balance }
    );
  }

  // Everything past the charge runs inside a refund boundary. If allocation or
  // dispatch fails the user must not be left paying for a shoot that never ran.
  try {
    const { data: prefs, error: prefsErr } = await db
      .from("user_preferences")
      .upsert(
        {
          user_id: userId,
          vibe,
          style,
          interests: interests.length > 0 ? interests : null,
        exclude_tags: excludeTags.length > 0 ? excludeTags : null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (prefsErr) {
      throw new Error(`Failed to save preferences: ${prefsErr.message}`);
    }

    // Create batch / order
    const { data: order, error: orderErr } = await db
      .from("user_shoot_orders")
      .insert({
        user_id: userId,
        model_id: modelId,
        preferences_id: prefs?.id ?? null,
        status: "queued",
        custom_credits_remaining: CUSTOM_CREDITS_DEFAULT,
        photos_target: TOTAL_PHOTOS,
      })
      .select()
      .single();

    if (orderErr || !order) {
      // 23505 is the partial unique index from migration 029, which allows one
      // order per user in 'queued' or 'developing'. Reaching it means a second
      // request slipped past the check above — two taps landing together, or a
      // retry — and it is a refusal rather than a fault. Throwing the typed
      // error hands the client the same 409 it already knows how to render,
      // and the surrounding catch refunds the credits this request just spent.
      if ((orderErr as { code?: string } | null)?.code === "23505") {
        throw new DatingOrderError(
          "A shoot is already running. Wait for it to finish before starting another.",
          "order_in_progress"
        );
      }
      throw new Error(`Failed to create order: ${orderErr?.message}`);
    }

    const batchId = order.id as string;

    // Pick which authored shoots this delivery contains. Nothing is composed:
    // a shoot already fixes its location, outfit and light, so preferences only
    // decide which ones he receives. Seeded from batchId, so retries and paid
    // reshoots are stable.
    const plan = planShootDelivery(batchId, {
      interests,
      excludeTags,
      dress: dress ?? input.style ?? "casual",
    });
    assertDeliveryShape(plan);

    const finalRows = plan.map((frame) => ({
      order_id: batchId,
      shoot_id: frame.shootId,
      frame_index: frame.frameIndex,
      is_anchor: frame.isAnchor,
      // The authored string, stored verbatim. There is nothing left to compile,
      // and snapshotting it means a later library edit cannot change a retry.
      prompt_template: frame.prompt,
      image_width: frame.imageSize.width,
      image_height: frame.imageSize.height,
      status: "pending" as const,
      deterministic_id: makeDeterministicPhotoId(
        batchId,
        frame.shootId,
        frame.frameIndex
      ),
    }));

    if (finalRows.length !== TOTAL_PHOTOS) {
      await db.from("user_shoot_orders").delete().eq("id", batchId);
      throw new Error(`Expected ${TOTAL_PHOTOS} rows, got ${finalRows.length}`);
    }

    const { error: photosErr } = await db.from("order_photos").insert(finalRows);
    if (photosErr) {
      await db.from("user_shoot_orders").delete().eq("id", batchId);
      throw new Error(`Failed to allocate photos: ${photosErr.message}`);
    }

    // Kick off PARENT orchestrator only (children spawned inside)
    const handle = await datingPhotoshootOrchestrator.trigger({
      userId,
      batchId,
      modelId,
      referenceImageUrls,
    });

    await db
      .from("user_shoot_orders")
      .update({
        trigger_run_id: handle.id,
        status: "developing",
        updated_at: new Date().toISOString(),
      })
      .eq("id", batchId);

    return {
      orderId: batchId,
      batchId,
      triggerRunId: handle.id,
      photosAllocated: finalRows.length,
    };
  } catch (error) {
    await refundShootCredits(userId, SHOOT_CREDIT_COST);
    throw error;
  }
}

/**
 * Re-run parent orchestrator for a batch.
 * Parent audits DB and only re-dispatches incomplete children.
 * No third task — API just re-triggers the parent.
 */
export async function resumeDatingShootOrder(orderId: string, userId: string) {
  const db = createAdminClient();

  const { data: order } = await db
    .from("user_shoot_orders")
    .select("id, user_id, model_id, status")
    .eq("id", orderId)
    .eq("user_id", userId)
    .single();

  if (!order) throw new Error("Order not found");

  const { data: model } = await db
    .from("models")
    .select("id, samples(uri)")
    .eq("id", order.model_id)
    .single();

  const referenceImageUrls = (((model as any)?.samples || []) as { uri: string }[])
    .map((s) => s.uri)
    .filter(Boolean);

  if (!referenceImageUrls.length) {
    throw new Error("Model has no sample images");
  }

  // Reset failed → pending so parent will pick them up
  await db
    .from("order_photos")
    .update({
      status: "pending",
      failed_reason: null,
      updated_at: new Date().toISOString(),
    })
    .eq("order_id", orderId)
    .eq("status", "failed");

  // Also re-queue stuck in_progress (parent crash mid-child)
  await db
    .from("order_photos")
    .update({
      status: "pending",
      updated_at: new Date().toISOString(),
    })
    .eq("order_id", orderId)
    .eq("status", "in_progress");

  const handle = await datingPhotoshootOrchestrator.trigger({
    userId: order.user_id,
    batchId: order.id,
    modelId: order.model_id,
    referenceImageUrls,
  });

  await db
    .from("user_shoot_orders")
    .update({
      trigger_run_id: handle.id,
      status: "developing",
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  return { orderId, triggerRunId: handle.id };
}
