export type LifecycleStage =
  | "signed_up"
  | "checkout_abandoned"
  | "customer"
  | "shoot_in_progress"
  | "shoot_ready"
  | "shoot_failed";

export const LIFECYCLE_LABELS: Record<LifecycleStage, string> = {
  signed_up: "Signed up",
  checkout_abandoned: "Abandoned checkout",
  customer: "Paid, no shoot yet",
  shoot_in_progress: "Shoot in progress",
  shoot_ready: "Shoot delivered",
  shoot_failed: "Shoot failed",
};

export type AdminUserSummary = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  lastSignInAt: string | null;
  provider: string | null;
  credits: number;
  revenue: number;
  completedPayments: number;
  pendingPayments: number;
  orders: number;
  latestOrderStatus: string | null;
  lastEmailedAt: string | null;
  stage: LifecycleStage;
};

export type PaymentRow = {
  id: string;
  user_id: string;
  dodo_payment_id: string | null;
  dodo_checkout_session_id: string | null;
  pricing_plan_id: string | null;
  amount: number;
  currency: string;
  status: string;
  credits: number | null;
  created_at: string;
  updated_at: string;
};

export type OrderRow = {
  id: string;
  user_id: string;
  status: string;
  pipeline_stage: string | null;
  shoots_target: number | null;
  photos_target: number;
  custom_credits_remaining: number;
  refund_state: string;
  credit_state: string | null;
  credit_amount: number | null;
  failure_code: string | null;
  failure_phase: string | null;
  failure_message: string | null;
  trigger_run_id: string | null;
  created_at: string;
  ready_at: string | null;
  updated_at: string;
};

export type EmailLogRow = {
  id: string;
  user_id: string | null;
  to_email: string;
  from_email: string;
  subject: string;
  body_text: string;
  template_key: string | null;
  batch_id: string | null;
  resend_id: string | null;
  status: "sent" | "failed";
  error: string | null;
  sent_by: string;
  created_at: string;
};

export type AuditRow = {
  id: string;
  actor_email: string;
  action: string;
  target_user_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
};

export type ActivityEvent = {
  key: string;
  kind: "signup" | "purchase" | "checkout_abandoned" | "shoot_ready" | "shoot_failed";
  at: string;
  userId: string;
  email: string;
  detail: string;
  lastEmailedAt: string | null;
};

/** Result shape for server actions driven by useActionState. */
export type ActionResult = { ok: boolean; message: string } | null;
