import { createAdminClient } from "@/utils/supabase/admin";
import {
  verifiedDatingReferenceUrls,
  type StoredDatingReference,
} from "./reference-image";
import type { DeliveryBias } from "./interests";
import {
  conflictingExclusion,
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
} from "./types";
import { datingPhotoshootOrchestrator } from "@/trigger/dating-shoot";
import { getDatingProductConfig } from "./config";
import {
  PORTFOLIO_SYSTEM_VERSION,
  SHOOT_WRITER_SYSTEM_VERSION,
} from "./creative-director";

/** Refusals the API can translate into a status code, as distinct from faults. */
export class DatingOrderError extends Error {
  constructor(
    message: string,
    readonly code:
      | "order_in_progress"
      | "insufficient_credits"
      | "references_need_reupload"
      | "invalid_input",
    readonly detail: Record<string, unknown> = {}
  ) {
    super(message);
    this.name = "DatingOrderError";
  }
}

export type CreateOrderInput = {
  userId: string;
  clientRequestId: string;
  modelId: number;
  /** What he actually does. Each selection is a visible delivery promise. */
  interests?: InterestId[];
  /** Content he asked us to leave out: dog, alcohol, bicycle, team sport. */
  excludeTags?: ExcludableTag[];
};

/**
 * Create the immutable order snapshot and kick off exactly one parent task.
 * Photo rows are allocated only after all free-form shoot prompts pass.
 */
export async function createDatingShootOrder(input: CreateOrderInput) {
  const db = createAdminClient();
  const { userId, modelId } = input;
  const interests = [...new Set(input.interests ?? [])];
  const excludeTags = [...new Set(input.excludeTags ?? [])];
  const productConfig = getDatingProductConfig();

  // Browser retries and double-clicks return the original order before any
  // model lookup, credit spend, planning or Trigger dispatch.
  const { data: priorRequest } = await (db as any)
    .from("user_shoot_orders")
    .select("id, trigger_run_id, photos_target")
    .eq("user_id", userId)
    .eq("client_request_id", input.clientRequestId)
    .maybeSingle();
  if (priorRequest) {
    return {
      orderId: priorRequest.id as string,
      batchId: priorRequest.id as string,
      triggerRunId: priorRequest.trigger_run_id as string | null,
      photosAllocated: Number(priorRequest.photos_target ?? 0),
      reused: true,
    };
  }

  const interestLimit = Math.min(6, productConfig.shootsPerDelivery);
  if (interests.length < 1 || interests.length > interestLimit) {
    throw new DatingOrderError(
      `Choose between 1 and ${interestLimit} interests`,
      "invalid_input"
    );
  }
  const conflict = excludeTags.find((tag) => conflictingExclusion(interests, tag));
  if (conflict) {
    throw new DatingOrderError(
      `Your selected activities conflict with the ${conflict} exclusion.`,
      "invalid_input"
    );
  }

  // These two columns are historical NOT NULL preference fields. They are kept
  // for schema compatibility only; neither value enters the new creative plan.
  const bias: DeliveryBias = deriveBias(interests, "casual");

  const vibe = dominantVibe(bias);
  const style = dominantStyle(bias);

  const { data: model, error: modelErr } = await db
    .from("models")
    .select("id, user_id, samples(uri, reference_sanitized)")
    .eq("id", modelId)
    .single();

  if (modelErr || !model || model.user_id !== userId) {
    throw new Error("Model not found or forbidden");
  }

  const samples = ((model as any).samples || []) as StoredDatingReference[];
  let referenceImageUrls: string[];
  try {
    referenceImageUrls = verifiedDatingReferenceUrls(samples, 4);
  } catch (error) {
    throw new DatingOrderError(
      error instanceof Error ? error.message : "Re-upload your reference photos",
      "references_need_reupload"
    );
  }

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

  // History is loaded before charging. A second purchase uses unseen semantic
  // concepts first, then unseen exact shoots, then least-recently-used shoots.
  // Failing to read history must never quietly degrade into a repeat-heavy pack.
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
  let createdOrderId: string | null = null;
  let dispatchAttempted = false;
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
    const { data: order, error: orderErr } = await (db as any)
      .from("user_shoot_orders")
      .insert({
        user_id: userId,
        model_id: modelId,
        preferences_id: prefs?.id ?? null,
        status: "queued",
        custom_credits_remaining: CUSTOM_CREDITS_DEFAULT,
        photos_target: productConfig.photosPerDelivery,
        shoots_target: productConfig.shootsPerDelivery,
        client_request_id: input.clientRequestId,
        creative_input: { interests, excludeTags },
        pipeline_mode: "dynamic",
        pipeline_stage: "planning",
        planner_version: PORTFOLIO_SYSTEM_VERSION,
        prompt_system_version: SHOOT_WRITER_SYSTEM_VERSION,
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
        const { data: duplicate } = await (db as any)
          .from("user_shoot_orders")
          .select("id, trigger_run_id, photos_target")
          .eq("user_id", userId)
          .eq("client_request_id", input.clientRequestId)
          .maybeSingle();
        if (duplicate) {
          await refundShootCredits(userId, SHOOT_CREDIT_COST);
          return {
            orderId: duplicate.id as string,
            batchId: duplicate.id as string,
            triggerRunId: duplicate.trigger_run_id as string | null,
            photosAllocated: Number(duplicate.photos_target ?? 0),
            reused: true,
          };
        }
        throw new DatingOrderError(
          "A shoot is already running. Wait for it to finish before starting another.",
          "order_in_progress"
        );
      }
      throw new Error(`Failed to create order: ${orderErr?.message}`);
    }

    const batchId = order.id as string;
    createdOrderId = batchId;

    // Kick off PARENT orchestrator only (children spawned inside)
    // After this point a network failure is ambiguous: Trigger.dev may have
    // accepted the run even if the client did not receive the handle. Keep the
    // snapshotted order for audit/recovery instead of deleting work in flight.
    dispatchAttempted = true;
    const handle = await datingPhotoshootOrchestrator.trigger({
      userId,
      batchId,
      modelId,
      referenceImageUrls,
    });

    await (db as any)
      .from("user_shoot_orders")
      .update({
        trigger_run_id: handle.id,
        status: "queued",
        updated_at: new Date().toISOString(),
      })
      .eq("id", batchId);

    return {
      orderId: batchId,
      batchId,
      triggerRunId: handle.id,
      photosAllocated: productConfig.photosPerDelivery,
      reused: false,
    };
  } catch (error) {
    if (createdOrderId && !dispatchAttempted) {
      const { error: cleanupError } = await db
        .from("user_shoot_orders")
        .delete()
        .eq("id", createdOrderId);
      if (cleanupError) {
        console.error("Failed to clean up an undispatched dating order:", cleanupError);
      }
    }
    if (createdOrderId && dispatchAttempted) {
      await (db as any)
        .from("user_shoot_orders")
        .update({
          status: "queued",
          pipeline_stage: "attention_required",
          updated_at: new Date().toISOString(),
        })
        .eq("id", createdOrderId);
      // Trigger acceptance is ambiguous after dispatch begins. The persisted
      // dynamic order will be reconciled and delivered, so refunding here would
      // both fulfill the order and return its payment.
      throw error;
    }
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

  const { data: order } = await (db as any)
    .from("user_shoot_orders")
    .select("id, user_id, model_id, status, pipeline_mode, pipeline_stage")
    .eq("id", orderId)
    .eq("user_id", userId)
    .single();

  if (!order) throw new Error("Order not found");

  const { data: model } = await db
    .from("models")
    .select("id, samples(uri, reference_sanitized)")
    .eq("id", order.model_id)
    .single();

  const referenceImageUrls = verifiedDatingReferenceUrls(
    ((model as any)?.samples || []) as StoredDatingReference[]
  );

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

  const { count: allocatedPhotos } = await db
    .from("order_photos")
    .select("id", { count: "exact", head: true })
    .eq("order_id", orderId);

  const handle = await datingPhotoshootOrchestrator.trigger({
    userId: order.user_id,
    batchId: order.id,
    modelId: order.model_id,
    referenceImageUrls,
  });

  const promptOnly = order.pipeline_mode === "dynamic" && (allocatedPhotos ?? 0) === 0;
  await (db as any)
    .from("user_shoot_orders")
    .update({
      trigger_run_id: handle.id,
      status: promptOnly ? "queued" : "developing",
      pipeline_stage: promptOnly ? "writing_prompts" : order.pipeline_stage,
      provider_blocked: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  return { orderId, triggerRunId: handle.id };
}
