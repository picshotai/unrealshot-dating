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
import {
  createReservedDatingOrder,
  releaseDatingOrderCredit,
  reserveDatingOrderRetry,
} from "./credits-gate";
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
import { idempotencyKeys } from "@trigger.dev/sdk";

/** Refusals the API can translate into a status code, as distinct from faults. */
export class DatingOrderError extends Error {
  constructor(
    message: string,
    readonly code:
      | "order_in_progress"
      | "insufficient_credits"
      | "references_need_reupload"
      | "legacy_order"
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

  // Preference storage is outside the reservation transaction because it does
  // not spend money. The RPC below atomically reserves the pack and creates the
  // immutable order, so neither operation can survive without the other.
  let createdOrderId: string | null = null;
  let reservationCreated = false;
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

    const reservation = await createReservedDatingOrder({
      userId,
      clientRequestId: input.clientRequestId,
      creditAmount: SHOOT_CREDIT_COST,
      order: {
        modelId,
        preferencesId: prefs?.id ?? null,
        customCreditsRemaining: CUSTOM_CREDITS_DEFAULT,
        photosTarget: productConfig.photosPerDelivery,
        shootsTarget: productConfig.shootsPerDelivery,
        creativeInput: { interests, excludeTags },
        plannerVersion: PORTFOLIO_SYSTEM_VERSION,
        promptSystemVersion: SHOOT_WRITER_SYSTEM_VERSION,
        testMode: productConfig.testMode,
        realShootsTarget: productConfig.testMode === "mock"
          ? 0
          : productConfig.testMode === "sample"
            ? productConfig.sampleShoots
            : productConfig.shootsPerDelivery,
      },
    });
    if (reservation.result === "insufficient") {
      throw new DatingOrderError(
        "You don't have a pack yet — grab one to start your shoot.",
        "insufficient_credits",
        { required: SHOOT_CREDIT_COST, balance: reservation.balance ?? 0 }
      );
    }
    if (reservation.result === "order_in_progress") {
      throw new DatingOrderError(
        "A shoot is already running. Wait for it to finish before starting another.",
        "order_in_progress",
        { orderId: reservation.orderId }
      );
    }
    if (!reservation.orderId) throw new Error("Dating order reservation returned no order.");
    if (reservation.result === "existing") {
      const { data: existing } = await (db as any).from("user_shoot_orders")
        .select("id, trigger_run_id, photos_target").eq("id", reservation.orderId).single();
      return {
        orderId: reservation.orderId,
        batchId: reservation.orderId,
        triggerRunId: existing?.trigger_run_id ?? null,
        photosAllocated: Number(existing?.photos_target ?? productConfig.photosPerDelivery),
        reused: true,
      };
    }

    const batchId = reservation.orderId;
    createdOrderId = batchId;
    reservationCreated = true;

    const dispatchKey = await idempotencyKeys.create(`dating-order:${batchId}`, {
      scope: "global",
    });
    let handle: Awaited<ReturnType<typeof datingPhotoshootOrchestrator.trigger>> | null = null;
    let lastDispatchError: unknown;
    for (let attempt = 0; attempt < 3 && !handle; attempt += 1) {
      try {
        handle = await datingPhotoshootOrchestrator.trigger(
          { userId, batchId, modelId, referenceImageUrls },
          { idempotencyKey: dispatchKey, idempotencyKeyTTL: "30d" }
        );
      } catch (error) {
        lastDispatchError = error;
      }
    }
    if (!handle) throw lastDispatchError ?? new Error("Trigger dispatch failed.");

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
    if (createdOrderId && reservationCreated) {
      await releaseDatingOrderCredit({
        orderId: createdOrderId,
        failureCode: "dispatch_failed",
        failurePhase: "orchestration_dispatch",
        failureMessage: "The shoot could not be queued. Its reserved pack was returned.",
      });
    }
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
    .select("id, user_id, model_id, status, pipeline_mode, pipeline_stage, prompt_system_version, trigger_run_id, updated_at")
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

  const reservation = await reserveDatingOrderRetry(orderId, userId);
  if (reservation.result === "insufficient") {
    throw new DatingOrderError(
      "You need an available pack before retrying this shoot.",
      "insufficient_credits",
      { required: SHOOT_CREDIT_COST, balance: reservation.balance ?? 0 }
    );
  }
  if (reservation.result === "not_retryable") {
    throw new DatingOrderError("This completed shoot cannot be retried.", "invalid_input");
  }
  if (reservation.result === "legacy_incompatible") {
    throw new DatingOrderError(
      "This shoot used the retired prompt system. Its pack remains returned; start a fresh shoot with the rebuilt system.",
      "legacy_order"
    );
  }
  if (reservation.result === "already_running") {
    return {
      orderId,
      triggerRunId: reservation.triggerRunId ?? order.trigger_run_id ?? null,
      reused: true,
    };
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

  const retryKey = await idempotencyKeys.create(
    `dating-resume:${order.id}:${order.updated_at}`,
    { scope: "global" }
  );
  let handle: Awaited<ReturnType<typeof datingPhotoshootOrchestrator.trigger>> | null = null;
  let lastDispatchError: unknown;
  for (let attempt = 0; attempt < 3 && !handle; attempt += 1) {
    try {
      handle = await datingPhotoshootOrchestrator.trigger(
        {
          userId: order.user_id,
          batchId: order.id,
          modelId: order.model_id,
          referenceImageUrls,
        },
        { idempotencyKey: retryKey, idempotencyKeyTTL: "30d" }
      );
    } catch (error) {
      lastDispatchError = error;
    }
  }
  if (!handle) {
    await releaseDatingOrderCredit({
      orderId,
      failureCode: "retry_dispatch_failed",
      failurePhase: "orchestration_dispatch",
      failureMessage: "The retry could not be queued. Its reserved pack was returned.",
    });
    throw lastDispatchError ?? new Error("Retry dispatch failed.");
  }

  const resumeStage = reservation.stage ?? (
    order.pipeline_mode === "dynamic" ? "planning" : "rendering_photos"
  );
  const isRendering = resumeStage === "rendering_photos";
  await (db as any)
    .from("user_shoot_orders")
    .update({
      trigger_run_id: handle.id,
      status: isRendering ? "developing" : "queued",
      pipeline_stage: resumeStage,
      provider_blocked: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  return { orderId, triggerRunId: handle.id };
}
