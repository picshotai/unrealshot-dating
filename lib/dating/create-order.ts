import { createAdminClient } from "@/utils/supabase/admin";
import { compileDatingPrompt } from "./prompt-params";
import {
  assertLibraryComplete,
  selectDatingPromptVariant,
} from "./prompt-library";
import { makeDeterministicPhotoId, slotToIndex } from "./deterministic-id";
import {
  CUSTOM_CREDITS_DEFAULT,
  DATING_BUCKETS,
  PHOTOS_PER_BUCKET,
  TOTAL_PHOTOS,
  type StylePref,
  type Vibe,
} from "./types";
import { datingPhotoshootOrchestrator } from "@/trigger/dating-shoot";

export type CreateOrderInput = {
  userId: string;
  modelId: number;
  vibe: Vibe;
  style: StylePref;
  hobbyText?: string | null;
};

/**
 * Create batch (order), pre-allocate 100 order_photos with deterministic IDs,
 * kick off parent orchestrator (exactly one parent task).
 */
export async function createDatingShootOrder(input: CreateOrderInput) {
  const db = createAdminClient();
  const { userId, modelId, vibe, style, hobbyText } = input;

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

  const { data: prefs, error: prefsErr } = await db
    .from("user_preferences")
    .upsert(
      {
        user_id: userId,
        vibe,
        style,
        hobby_text: hobbyText || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )
    .select()
    .single();

  if (prefsErr) {
    throw new Error(`Failed to save preferences: ${prefsErr.message}`);
  }

  // Code is the prompt source of truth. Each order snapshots the exact compiled
  // prompt into order_photos, so later library updates cannot change retries.
  assertLibraryComplete();

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
    throw new Error(`Failed to create order: ${orderErr?.message}`);
  }

  const batchId = order.id as string;

  // Pre-allocate 100 rows with deterministic IDs. The batch id makes prompt
  // selection stable for retries while giving each new order a new shot mix.
  const finalRows = [];
  for (const bucket of DATING_BUCKETS) {
    for (let slot = 1; slot <= PHOTOS_PER_BUCKET; slot++) {
      const index = slotToIndex(slot);
      const prompt = selectDatingPromptVariant(batchId, bucket, slot);
      const filled = compileDatingPrompt(prompt, {
        vibe,
        style,
        hobby: hobbyText,
      });

      finalRows.push({
        order_id: batchId,
        bucket,
        slot,
        prompt_template: filled,
        // Snapshot the authored size so the shot renders at the resolution it
        // was written for, and stays stable across retries and regenerations.
        image_width: prompt.imageSize?.width ?? null,
        image_height: prompt.imageSize?.height ?? null,
        status: "pending" as const,
        deterministic_id: makeDeterministicPhotoId(batchId, bucket, index),
      });
    }
  }

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
