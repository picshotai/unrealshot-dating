import { createAdminClient } from "@/utils/supabase/admin";

/**
 * The money gate for a dating shoot.
 *
 * A shoot commits roughly 100 GPU generations, so this has to be right in ways
 * ordinary product code does not. Two properties matter:
 *
 * 1. The spend is atomic. `deductCredits` in lib/credits.ts reads the balance
 *    and writes back a new one in a separate statement, so two requests landing
 *    together both pass the check and both write — a user with one shoot's worth
 *    of credits can start two. The `spend_credits` function does the check and
 *    the decrement in a single statement so the row lock serialises callers.
 *
 * 2. A failed start always refunds. The order is charged before the orchestrator
 *    is dispatched, because charging afterwards means a crash mid-dispatch gives
 *    away a shoot. Every failure path after the spend refunds.
 */

export type SpendResult =
  | { ok: true; balance: number }
  | { ok: false; reason: "insufficient"; balance: number };

export async function spendShootCredits(
  userId: string,
  amount: number
): Promise<SpendResult> {
  const db = createAdminClient();

  const { data, error } = await db.rpc("spend_credits", {
    p_user_id: userId,
    p_amount: amount,
  });

  if (error) {
    throw new Error(`Credit spend failed: ${error.message}`);
  }

  // The function returns NULL when the balance was too low. That is a refusal,
  // not a fault, so it is reported rather than thrown.
  if (data === null || data === undefined) {
    const { data: row } = await db
      .from("credits")
      .select("credits")
      .eq("user_id", userId)
      .maybeSingle();
    return { ok: false, reason: "insufficient", balance: row?.credits ?? 0 };
  }

  return { ok: true, balance: Number(data) };
}

export async function refundShootCredits(
  userId: string,
  amount: number
): Promise<void> {
  const db = createAdminClient();
  const { error } = await db.rpc("refund_credits", {
    p_user_id: userId,
    p_amount: amount,
  });
  if (error) {
    // A failed refund must be loud: the user has been charged for nothing.
    console.error("[dating] refund failed", { userId, amount, error });
    throw new Error(`Credit refund failed: ${error.message}`);
  }
}
