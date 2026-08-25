import { createAdminClient } from "@/utils/supabase/admin";

/** Transactional reserve → capture/release lifecycle for production orders. */

export type ReservedOrderResult = {
  result: "created" | "existing" | "order_in_progress" | "insufficient";
  orderId: string | null;
  balance: number | null;
  reused: boolean;
};

export async function createReservedDatingOrder(args: {
  userId: string;
  clientRequestId: string;
  creditAmount: number;
  order: Record<string, unknown>;
}): Promise<ReservedOrderResult> {
  const db = createAdminClient() as any;
  const { data, error } = await db.rpc("create_reserved_dating_order", {
    p_user_id: args.userId,
    p_client_request_id: args.clientRequestId,
    p_credit_amount: args.creditAmount,
    p_order: args.order,
  });
  if (error) throw new Error(`Dating order reservation failed: ${error.message}`);
  return data as ReservedOrderResult;
}

export async function releaseDatingOrderCredit(args: {
  orderId: string;
  failureCode: string;
  failurePhase: string;
  failureMessage: string;
}) {
  const db = createAdminClient() as any;
  const { data, error } = await db.rpc("release_dating_order_credit", {
    p_order_id: args.orderId,
    p_failure_code: args.failureCode,
    p_failure_phase: args.failurePhase,
    p_failure_message: args.failureMessage,
  });
  if (error) throw new Error(`Dating order credit release failed: ${error.message}`);
  return data as { released: boolean; creditState: string; balance: number };
}

export async function reserveDatingOrderRetry(orderId: string, userId: string) {
  const db = createAdminClient() as any;
  const { data, error } = await db.rpc("reserve_dating_order_retry", {
    p_order_id: orderId,
    p_user_id: userId,
  });
  if (error) throw new Error(`Dating order retry reservation failed: ${error.message}`);
  return data as {
    result: "reserved" | "insufficient" | "not_retryable";
    balance: number | null;
    stage?: "planning" | "writing_prompts" | "rendering_photos";
  };
}

export async function captureDatingOrderCredit(orderId: string) {
  const db = createAdminClient() as any;
  const { data, error } = await db.rpc("capture_dating_order_credit", {
    p_order_id: orderId,
  });
  if (error) throw new Error(`Dating order credit capture failed: ${error.message}`);
  return String(data);
}
