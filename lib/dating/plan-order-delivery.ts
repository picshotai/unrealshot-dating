import { createAdminClient } from "@/utils/supabase/admin";
import {
  assertDeliveryShape,
  deliveryConcepts,
  deliveryFingerprint,
  planShootDelivery,
  type PlanShootsOptions,
  type PlannedFrame,
} from "./select-shoots";

type AdminClient = ReturnType<typeof createAdminClient>;

const MAX_GLOBAL_COLLISION_ATTEMPTS = 32;

/**
 * Claims a globally unique 15-shoot combination for an order.
 *
 * The database unique index is the concurrency boundary: two orders choosing
 * the same set at the same time cannot both claim it. A collision changes only
 * the selection salt; retries of the resulting order still use snapshotted rows.
 */
export async function planUniqueOrderDelivery(
  db: AdminClient,
  batchId: string,
  options: PlanShootsOptions
): Promise<PlannedFrame[]> {
  for (let attempt = 0; attempt < MAX_GLOBAL_COLLISION_ATTEMPTS; attempt += 1) {
    const plan = planShootDelivery(`${batchId}:selection:${attempt}`, options);
    assertDeliveryShape(plan);

    const { error } = await db
      .from("user_shoot_orders")
      .update({
        selection_fingerprint: deliveryFingerprint(plan),
        selection_concepts: deliveryConcepts(plan),
      })
      .eq("id", batchId);

    if (!error) return plan;
    if (error.code === "23505") continue;
    throw new Error(`Failed to reserve a unique delivery: ${error.message}`);
  }

  throw new Error(
    `Could not reserve a globally unique delivery after ${MAX_GLOBAL_COLLISION_ATTEMPTS} plans`
  );
}
