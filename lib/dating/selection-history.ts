import { createAdminClient } from "@/utils/supabase/admin";

type AdminClient = ReturnType<typeof createAdminClient>;

/**
 * Returns unique shoot ids ordered by their most recent use for this customer.
 * Four photo rows represent one shoot, so both levels are deliberately deduped.
 */
export async function loadPreviousShootIds(
  db: AdminClient,
  userId: string
): Promise<string[]> {
  const { data: orders, error: ordersError } = await db
    .from("user_shoot_orders")
    .select("id, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (ordersError) {
    throw new Error(`Failed to load shoot history: ${ordersError.message}`);
  }
  if (!orders || orders.length === 0) return [];

  const orderIds = orders.map((order) => order.id);
  const { data: photos, error: photosError } = await db
    .from("order_photos")
    .select("order_id, shoot_id")
    .in("order_id", orderIds);

  if (photosError) {
    throw new Error(`Failed to load previous shoot ids: ${photosError.message}`);
  }

  const shootsByOrder = new Map<string, Set<string>>();
  for (const photo of photos ?? []) {
    const ids = shootsByOrder.get(photo.order_id) ?? new Set<string>();
    ids.add(photo.shoot_id);
    shootsByOrder.set(photo.order_id, ids);
  }

  const newestFirst: string[] = [];
  const seen = new Set<string>();
  for (const orderId of orderIds) {
    for (const shootId of shootsByOrder.get(orderId) ?? []) {
      if (seen.has(shootId)) continue;
      seen.add(shootId);
      newestFirst.push(shootId);
    }
  }
  return newestFirst;
}

/**
 * Counts concept families across recent orders so new customers are steered
 * toward underused inventory instead of every identical answer seeing the same
 * popular subset. The semantic fingerprint remains the hard concurrency guard.
 */
export async function loadRecentGlobalConceptUsage(
  db: AdminClient,
  recentOrders = 500
): Promise<Record<string, number>> {
  const { data, error } = await db
    .from("user_shoot_orders")
    .select("selection_concepts")
    .not("selection_concepts", "is", null)
    .order("created_at", { ascending: false })
    .limit(recentOrders);

  if (error) {
    throw new Error(`Failed to load global shoot usage: ${error.message}`);
  }

  const usage: Record<string, number> = {};
  for (const order of data ?? []) {
    for (const concept of order.selection_concepts ?? []) {
      usage[concept] = (usage[concept] ?? 0) + 1;
    }
  }
  return usage;
}
