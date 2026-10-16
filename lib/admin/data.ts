import "server-only";
import { cache } from "react";
import type { User } from "@supabase/supabase-js";
import { getServiceDb } from "@/lib/dating/db";
import type {
  ActivityEvent,
  AdminUserSummary,
  AuditRow,
  EmailLogRow,
  LifecycleStage,
  OrderRow,
  PaymentRow,
} from "./types";

const ORDER_COLUMNS =
  "id, user_id, status, pipeline_stage, shoots_target, photos_target, custom_credits_remaining, refund_state, credit_state, credit_amount, failure_code, failure_phase, failure_message, trigger_run_id, created_at, ready_at, updated_at";
const PAYMENT_COLUMNS =
  "id, user_id, dodo_payment_id, dodo_checkout_session_id, pricing_plan_id, amount, currency, status, credits, created_at, updated_at";

/** A checkout still pending after this long is treated as abandoned. */
const ABANDONED_AFTER_MS = 30 * 60 * 1000;
const PAGE = 1000;
const MAX_ROWS = 20_000;

/** One clock reading per request, so every row on a page agrees on "now". */
export const getRequestNow = cache(() => Date.now());

/**
 * The dating-photoshoot positioning launched on 5 Oct 2026. Everything before
 * that belongs to the old product, so the panel only counts users, payments
 * and shoots from this date on. Override with ADMIN_DATA_SINCE (any ISO date).
 */
const DEFAULT_DATA_SINCE = "2026-10-05T00:00:00Z";

export function adminDataSince(): string {
  const raw = process.env.ADMIN_DATA_SINCE?.trim();
  const parsed = raw ? new Date(raw) : null;
  return parsed && !Number.isNaN(parsed.getTime()) ? parsed.toISOString() : DEFAULT_DATA_SINCE;
}

export function adminDb() {
  return getServiceDb();
}

/** Postgres "relation does not exist" or PostgREST "table not in schema cache". */
export function isMissingTable(error: { code?: string; message?: string } | null | undefined) {
  if (!error) return false;
  return error.code === "42P01" || error.code === "PGRST205" || /does not exist|schema cache/i.test(error.message ?? "");
}

type PageQuery<T> = (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { code?: string; message?: string } | null }>;

async function fetchAllRows<T>(query: PageQuery<T>): Promise<{ rows: T[]; missing: boolean }> {
  const rows: T[] = [];
  for (let from = 0; from < MAX_ROWS; from += PAGE) {
    const { data, error } = await query(from, from + PAGE - 1);
    if (error) {
      if (isMissingTable(error)) return { rows, missing: true };
      throw new Error(error.message);
    }
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE) break;
  }
  return { rows, missing: false };
}

export function displayName(user: Pick<User, "email" | "user_metadata">) {
  const meta = user.user_metadata ?? {};
  const full = (meta.full_name || meta.name || "") as string;
  return full.trim() || user.email?.split("@")[0] || "there";
}

/** Every auth user, newest first. Cached per request so pages can call it freely. */
export const listAuthUsers = cache(async (): Promise<User[]> => {
  const db = adminDb();
  const users: User[] = [];
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: PAGE });
    if (error) throw new Error(error.message);
    users.push(...data.users);
    if (data.users.length < PAGE) break;
  }
  return users.sort((a, b) => b.created_at.localeCompare(a.created_at));
});

export const getAuthUser = cache(async (userId: string): Promise<User | null> => {
  const { data, error } = await adminDb().auth.admin.getUserById(userId);
  if (error) return null;
  return data.user;
});

type BaseData = {
  credits: Map<string, number>;
  payments: PaymentRow[];
  orders: OrderRow[];
  lastEmailed: Map<string, string>;
  emailLogMissing: boolean;
};

const loadBaseData = cache(async (): Promise<BaseData> => {
  const db = adminDb();
  const since = adminDataSince();
  const [credits, payments, orders, emails] = await Promise.all([
    fetchAllRows<{ user_id: string; credits: number }>((f, t) => db.from("credits").select("user_id, credits").range(f, t)),
    fetchAllRows<PaymentRow>((f, t) =>
      db.from("dodo_payments").select(PAYMENT_COLUMNS).gte("created_at", since).order("created_at", { ascending: false }).range(f, t)
    ),
    fetchAllRows<OrderRow>((f, t) =>
      db.from("user_shoot_orders").select(ORDER_COLUMNS).gte("created_at", since).order("created_at", { ascending: false }).range(f, t)
    ),
    fetchAllRows<{ user_id: string | null; created_at: string }>((f, t) =>
      db
        .from("admin_email_logs")
        .select("user_id, created_at")
        .eq("status", "sent")
        .order("created_at", { ascending: false })
        .range(f, t)
    ),
  ]);

  const lastEmailed = new Map<string, string>();
  for (const row of emails.rows) {
    if (row.user_id && !lastEmailed.has(row.user_id)) lastEmailed.set(row.user_id, row.created_at);
  }

  return {
    credits: new Map(credits.rows.map((row) => [row.user_id, row.credits ?? 0])),
    payments: payments.rows,
    orders: orders.rows,
    lastEmailed,
    emailLogMissing: emails.missing,
  };
});

export function isAbandonedPayment(payment: PaymentRow, now = Date.now()) {
  return payment.status === "pending" && now - new Date(payment.created_at).getTime() > ABANDONED_AFTER_MS;
}

function stageFor(completed: number, pending: number, latestOrderStatus: string | null): LifecycleStage {
  if (latestOrderStatus === "ready") return "shoot_ready";
  if (latestOrderStatus === "queued" || latestOrderStatus === "developing") return "shoot_in_progress";
  if (latestOrderStatus) return "shoot_failed";
  if (completed > 0) return "customer";
  if (pending > 0) return "checkout_abandoned";
  return "signed_up";
}

export const getUserSummaries = cache(async (): Promise<AdminUserSummary[]> => {
  const [users, base] = await Promise.all([listAuthUsers(), loadBaseData()]);
  const now = Date.now();

  const paymentsByUser = new Map<string, PaymentRow[]>();
  for (const payment of base.payments) {
    const list = paymentsByUser.get(payment.user_id) ?? [];
    list.push(payment);
    paymentsByUser.set(payment.user_id, list);
  }
  const ordersByUser = new Map<string, OrderRow[]>();
  for (const order of base.orders) {
    const list = ordersByUser.get(order.user_id) ?? [];
    list.push(order);
    ordersByUser.set(order.user_id, list);
  }

  // New-positioning users, plus older accounts that paid or started a shoot since the cutoff.
  const since = adminDataSince();
  const relevant = users.filter(
    (user) => user.created_at >= since || paymentsByUser.has(user.id) || ordersByUser.has(user.id)
  );

  return relevant.map((user) => {
    const payments = paymentsByUser.get(user.id) ?? [];
    const orders = ordersByUser.get(user.id) ?? [];
    const completed = payments.filter((p) => p.status === "completed");
    const abandoned = payments.filter((p) => isAbandonedPayment(p, now));
    const latestOrderStatus = orders[0]?.status ?? null;
    return {
      id: user.id,
      email: user.email ?? "",
      name: displayName(user),
      createdAt: user.created_at,
      lastSignInAt: user.last_sign_in_at ?? null,
      provider: (user.app_metadata?.provider as string | undefined) ?? null,
      credits: base.credits.get(user.id) ?? 0,
      revenue: completed.reduce((sum, p) => sum + Number(p.amount || 0), 0),
      completedPayments: completed.length,
      pendingPayments: abandoned.length,
      orders: orders.length,
      latestOrderStatus,
      lastEmailedAt: base.lastEmailed.get(user.id) ?? null,
      stage: stageFor(completed.length, abandoned.length, latestOrderStatus),
    };
  });
});

export async function isEmailLogAvailable() {
  return !(await loadBaseData()).emailLogMissing;
}

export async function getOverview() {
  const [summaries, base] = await Promise.all([getUserSummaries(), loadBaseData()]);
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const within = (iso: string, ms: number) => now - new Date(iso).getTime() <= ms;

  const completed = base.payments.filter((p) => p.status === "completed");
  const customers = new Set(completed.map((p) => p.user_id));
  const revenue = (list: PaymentRow[]) => list.reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const ordersByStatus: Record<string, number> = {};
  for (const order of base.orders) ordersByStatus[order.status] = (ordersByStatus[order.status] ?? 0) + 1;

  const stageCounts = {} as Record<LifecycleStage, number>;
  for (const s of summaries) stageCounts[s.stage] = (stageCounts[s.stage] ?? 0) + 1;

  return {
    totalUsers: summaries.length,
    signups24h: summaries.filter((s) => within(s.createdAt, day)).length,
    signups7d: summaries.filter((s) => within(s.createdAt, 7 * day)).length,
    customers: customers.size,
    conversionRate: summaries.length ? customers.size / summaries.length : 0,
    revenueTotal: revenue(completed),
    revenue30d: revenue(completed.filter((p) => within(p.created_at, 30 * day))),
    purchases7d: completed.filter((p) => within(p.created_at, 7 * day)).length,
    abandonedCheckouts: summaries.filter((s) => s.stage === "checkout_abandoned").length,
    ordersByStatus,
    stageCounts,
    activeOrders: (ordersByStatus.queued ?? 0) + (ordersByStatus.developing ?? 0),
    failedOrders: base.orders.filter((o) => o.status !== "ready" && o.status !== "queued" && o.status !== "developing").length,
    outstandingCredits: summaries.reduce((sum, s) => sum + s.credits, 0),
  };
}

export async function getActivity(limit = 2000): Promise<ActivityEvent[]> {
  const [summaries, base] = await Promise.all([getUserSummaries(), loadBaseData()]);
  const byId = new Map(summaries.map((s) => [s.id, s]));
  const events: ActivityEvent[] = [];
  const now = Date.now();
  const push = (event: Omit<ActivityEvent, "email" | "lastEmailedAt">) => {
    const user = byId.get(event.userId);
    if (!user) return;
    events.push({ ...event, email: user.email, lastEmailedAt: user.lastEmailedAt });
  };

  for (const s of summaries) {
    push({ key: `signup:${s.id}`, kind: "signup", at: s.createdAt, userId: s.id, detail: s.provider ? `via ${s.provider}` : "" });
  }
  for (const p of base.payments) {
    if (p.status === "completed") {
      push({ key: `pay:${p.id}`, kind: "purchase", at: p.updated_at || p.created_at, userId: p.user_id, detail: `${p.currency} ${p.amount}` });
    } else if (isAbandonedPayment(p, now) && byId.get(p.user_id)?.completedPayments === 0) {
      push({ key: `abandon:${p.id}`, kind: "checkout_abandoned", at: p.created_at, userId: p.user_id, detail: `${p.currency} ${p.amount}` });
    }
  }
  for (const o of base.orders) {
    if (o.status === "ready") {
      push({ key: `ready:${o.id}`, kind: "shoot_ready", at: o.ready_at || o.updated_at, userId: o.user_id, detail: `${o.photos_target} photos` });
    } else if (o.status !== "queued" && o.status !== "developing") {
      push({ key: `fail:${o.id}`, kind: "shoot_failed", at: o.updated_at, userId: o.user_id, detail: o.failure_code || o.status });
    }
  }

  return events.sort((a, b) => b.at.localeCompare(a.at)).slice(0, limit);
}

export async function listPayments(status?: string) {
  const base = await loadBaseData();
  const now = Date.now();
  if (!status) return base.payments;
  if (status === "abandoned") return base.payments.filter((p) => isAbandonedPayment(p, now));
  return base.payments.filter((p) => p.status === status);
}

export async function listOrders(status?: string) {
  const base = await loadBaseData();
  if (!status) return base.orders;
  if (status === "failed") return base.orders.filter((o) => !["ready", "queued", "developing"].includes(o.status));
  if (status === "active") return base.orders.filter((o) => o.status === "queued" || o.status === "developing");
  return base.orders.filter((o) => o.status === status);
}

export async function emailMapForUsers(): Promise<Map<string, string>> {
  const summaries = await getUserSummaries();
  return new Map(summaries.map((s) => [s.id, s.email]));
}

export async function getUserDetail(userId: string) {
  const user = await getAuthUser(userId);
  if (!user) return null;
  const db = adminDb();
  const since = adminDataSince();
  const [credits, payments, orders, preferences, emails, audit] = await Promise.all([
    db.from("credits").select("credits").eq("user_id", userId).maybeSingle(),
    db.from("dodo_payments").select(PAYMENT_COLUMNS).eq("user_id", userId).gte("created_at", since).order("created_at", { ascending: false }),
    db.from("user_shoot_orders").select(ORDER_COLUMNS).eq("user_id", userId).gte("created_at", since).order("created_at", { ascending: false }),
    db.from("user_preferences").select("vibe, style, hobby_text, interests, exclude_tags, updated_at").eq("user_id", userId).maybeSingle(),
    db.from("admin_email_logs").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(50),
    db.from("admin_audit_log").select("*").eq("target_user_id", userId).order("created_at", { ascending: false }).limit(50),
  ]);

  return {
    user,
    name: displayName(user),
    credits: (credits.data?.credits as number | undefined) ?? 0,
    payments: (payments.data ?? []) as PaymentRow[],
    orders: (orders.data ?? []) as OrderRow[],
    preferences: preferences.data as Record<string, unknown> | null,
    emails: (emails.data ?? []) as EmailLogRow[],
    audit: (audit.data ?? []) as AuditRow[],
    emailLogMissing: isMissingTable(emails.error),
  };
}

export async function listEmailLogs(limit = 200) {
  const { data, error } = await adminDb()
    .from("admin_email_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return { rows: [] as EmailLogRow[], missing: isMissingTable(error) };
  return { rows: (data ?? []) as EmailLogRow[], missing: false };
}

export async function listAuditLog(limit = 200) {
  const { data, error } = await adminDb()
    .from("admin_audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return { rows: [] as AuditRow[], missing: isMissingTable(error) };
  return { rows: (data ?? []) as AuditRow[], missing: false };
}
