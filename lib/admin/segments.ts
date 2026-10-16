import type { ActivityEvent, AdminUserSummary, LifecycleStage } from "./types";

/** The template that usually fits someone at this point in their journey. */
export const STAGE_TEMPLATE: Record<LifecycleStage, string> = {
  signed_up: "welcome",
  checkout_abandoned: "abandoned_checkout",
  customer: "paid_no_shoot",
  shoot_in_progress: "purchase_thanks",
  shoot_ready: "shoot_feedback",
  shoot_failed: "shoot_failed",
};

export const ACTIVITY_TEMPLATE: Record<ActivityEvent["kind"], string> = {
  signup: "welcome",
  purchase: "purchase_thanks",
  checkout_abandoned: "abandoned_checkout",
  shoot_ready: "shoot_feedback",
  shoot_failed: "shoot_failed",
};

export type SegmentKey =
  | "all"
  | "never_paid"
  | "checkout_abandoned"
  | "customers"
  | "paid_no_shoot"
  | "shoot_ready"
  | "shoot_failed"
  | "signed_up_7d";

export const SEGMENTS: { key: SegmentKey; label: string; template: string }[] = [
  { key: "checkout_abandoned", label: "Abandoned checkout (never paid)", template: "abandoned_checkout" },
  { key: "never_paid", label: "Signed up, never paid", template: "welcome" },
  { key: "signed_up_7d", label: "Signed up in the last 7 days", template: "welcome" },
  { key: "paid_no_shoot", label: "Paid, shoot not started", template: "paid_no_shoot" },
  { key: "shoot_ready", label: "Shoot delivered", template: "shoot_feedback" },
  { key: "shoot_failed", label: "Latest shoot failed", template: "shoot_failed" },
  { key: "customers", label: "All paying customers", template: "blank" },
  { key: "all", label: "Everyone", template: "blank" },
];

export function isSegmentKey(value: string | null | undefined): value is SegmentKey {
  return SEGMENTS.some((s) => s.key === value);
}

export function filterSegment(users: AdminUserSummary[], key: SegmentKey, now = Date.now()) {
  const withEmail = users.filter((u) => u.email);
  switch (key) {
    case "all":
      return withEmail;
    case "never_paid":
      return withEmail.filter((u) => u.completedPayments === 0);
    case "checkout_abandoned":
      return withEmail.filter((u) => u.stage === "checkout_abandoned");
    case "customers":
      return withEmail.filter((u) => u.completedPayments > 0);
    case "paid_no_shoot":
      return withEmail.filter((u) => u.stage === "customer");
    case "shoot_ready":
      return withEmail.filter((u) => u.stage === "shoot_ready");
    case "shoot_failed":
      return withEmail.filter((u) => u.stage === "shoot_failed");
    case "signed_up_7d":
      return withEmail.filter((u) => now - new Date(u.createdAt).getTime() <= 7 * 24 * 60 * 60 * 1000);
  }
}
