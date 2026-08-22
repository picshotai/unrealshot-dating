import { idempotencyKeys, logger, schedules } from "@trigger.dev/sdk";

import { getServiceDb } from "@/lib/dating/db";
import {
  verifiedDatingReferenceUrls,
  type StoredDatingReference,
} from "@/lib/dating/reference-image";
import { datingPhotoshootOrchestrator } from "@/trigger/dating-shoot";

/** Recovery net for orders whose parent exhausted retries or lost dispatch. */
export const reconcileDatingShootOrders = schedules.task({
  id: "reconcile-dating-shoot-orders",
  cron: "*/5 * * * *",
  maxDuration: 300,
  run: async () => {
    const db = getServiceDb() as any;
    const staleBefore = new Date(Date.now() - 10 * 60_000).toISOString();
    const { data: orders, error } = await db
      .from("user_shoot_orders")
      .select("id, user_id, model_id")
      .eq("pipeline_mode", "dynamic")
      .in("status", ["queued", "developing"])
      .lt("updated_at", staleBefore)
      .limit(25);
    if (error) throw new Error(`Dynamic order reconciliation failed: ${error.message}`);

    for (const order of orders ?? []) {
      const { data: model } = await db
        .from("models")
        .select("id, samples(uri, reference_sanitized)")
        .eq("id", order.model_id)
        .single();
      let referenceImageUrls: string[];
      try {
        referenceImageUrls = verifiedDatingReferenceUrls(
          ((model as any)?.samples ?? []) as StoredDatingReference[]
        );
      } catch (referenceError) {
        await db.from("user_shoot_orders").update({
          pipeline_stage: "attention_required",
          updated_at: new Date().toISOString(),
        }).eq("id", order.id);
        logger.error("Dynamic order references need attention", {
          orderId: order.id,
          error: String(referenceError),
        });
        continue;
      }

      const bucket = Math.floor(Date.now() / 300_000);
      const handle = await datingPhotoshootOrchestrator.trigger(
        {
          userId: order.user_id,
          batchId: order.id,
          modelId: order.model_id,
          referenceImageUrls,
        },
        {
          idempotencyKey: await idempotencyKeys.create(
            `dating-reconcile:${order.id}:${bucket}`,
            { scope: "global" }
          ),
          idempotencyKeyTTL: "10m",
        }
      );
      await db.from("user_shoot_orders").update({
        trigger_run_id: handle.id,
        updated_at: new Date().toISOString(),
      }).eq("id", order.id);
    }

    return { inspected: orders?.length ?? 0 };
  },
});

