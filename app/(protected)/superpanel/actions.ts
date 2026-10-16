"use server";

import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/admin/guard";
import { recordAudit } from "@/lib/admin/audit";
import { adminDb, displayName, getAuthUser, getUserSummaries } from "@/lib/admin/data";
import { sendAdminEmails, type AdminEmailRecipient } from "@/lib/admin/email/send";
import { filterSegment, isSegmentKey } from "@/lib/admin/segments";
import type { ActionResult } from "@/lib/admin/types";

const REFUND_STATES = ["none", "requested", "refunded"] as const;
const MAX_SEGMENT_RECIPIENTS = 1000;

function readDraft(formData: FormData) {
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const templateKey = String(formData.get("templateKey") ?? "") || null;
  const idempotencyKey = String(formData.get("idempotencyKey") ?? "");
  if (!subject) return { error: "Subject is required." } as const;
  if (!body) return { error: "Message body is required." } as const;
  if (subject.length > 200) return { error: "Subject is too long." } as const;
  if (!/^[\w-]{8,100}$/.test(idempotencyKey)) return { error: "Form expired. Reload and try again." } as const;
  return { draft: { subject, body, templateKey, idempotencyKey } } as const;
}

function errorMessage(err: unknown) {
  return err instanceof Error ? err.message : String(err);
}

async function creditsFor(userId: string) {
  const { data } = await adminDb().from("credits").select("credits").eq("user_id", userId).maybeSingle();
  return (data?.credits as number | undefined) ?? 0;
}

/** Sends to one user — or, with intent=test, renders it for that user but delivers to the admin. */
export async function sendUserEmailAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    const actor = await requireAdminAction();
    const parsed = readDraft(formData);
    if ("error" in parsed) return { ok: false, message: parsed.error! };

    const userId = String(formData.get("userId") ?? "");
    const user = await getAuthUser(userId);
    if (!user?.email) return { ok: false, message: "User not found or has no email." };

    const isTest = formData.get("intent") === "test";
    const recipient: AdminEmailRecipient = {
      userId: isTest ? null : user.id,
      email: isTest ? actor.email : user.email,
      name: displayName(user),
      credits: await creditsFor(user.id),
    };
    const draft = isTest
      ? { ...parsed.draft, subject: `[TEST] ${parsed.draft.subject}`, idempotencyKey: `${parsed.draft.idempotencyKey}-test-${Date.now()}` }
      : parsed.draft;

    const outcome = await sendAdminEmails([recipient], draft, actor.email);
    if (outcome.failed) return { ok: false, message: outcome.errors[0] ?? "Resend rejected the email." };

    if (!isTest) {
      await recordAudit(actor.email, "email.sent", user.id, { subject: draft.subject, template: draft.templateKey });
      revalidatePath("/superpanel", "layout");
    }
    return { ok: true, message: isTest ? `Test sent to ${actor.email}.` : `Email sent to ${user.email}.` };
  } catch (err) {
    return { ok: false, message: errorMessage(err) };
  }
}

export async function sendSegmentEmailAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    const actor = await requireAdminAction();
    const parsed = readDraft(formData);
    if ("error" in parsed) return { ok: false, message: parsed.error! };

    const segment = String(formData.get("segment") ?? "");
    if (!isSegmentKey(segment)) return { ok: false, message: "Pick a segment." };

    const users = filterSegment(await getUserSummaries(), segment);
    if (users.length === 0) return { ok: false, message: "That segment has no recipients." };
    if (users.length > MAX_SEGMENT_RECIPIENTS) {
      return { ok: false, message: `Segment has ${users.length} people; the limit per send is ${MAX_SEGMENT_RECIPIENTS}.` };
    }

    const isTest = formData.get("intent") === "test";
    if (isTest) {
      const sample = users[0];
      const outcome = await sendAdminEmails(
        [{ userId: null, email: actor.email, name: sample.name, credits: sample.credits }],
        { ...parsed.draft, subject: `[TEST] ${parsed.draft.subject}`, idempotencyKey: `${parsed.draft.idempotencyKey}-test-${Date.now()}` },
        actor.email
      );
      return outcome.failed
        ? { ok: false, message: outcome.errors[0] ?? "Resend rejected the email." }
        : { ok: true, message: `Test sent to ${actor.email} (rendered for ${sample.email}).` };
    }

    const confirmCount = Number(formData.get("confirmCount") ?? NaN);
    if (confirmCount !== users.length) {
      return { ok: false, message: `Type ${users.length} to confirm sending to the whole segment.` };
    }

    const outcome = await sendAdminEmails(
      users.map((u) => ({ userId: u.id, email: u.email, name: u.name, credits: u.credits })),
      parsed.draft,
      actor.email
    );
    await recordAudit(actor.email, "email.segment_sent", null, {
      segment,
      subject: parsed.draft.subject,
      sent: outcome.sent,
      failed: outcome.failed,
    });
    revalidatePath("/superpanel", "layout");

    const summary = `Sent ${outcome.sent} of ${users.length}.`;
    return outcome.failed
      ? { ok: false, message: `${summary} ${outcome.failed} failed: ${outcome.errors.join("; ")}` }
      : { ok: true, message: summary };
  } catch (err) {
    return { ok: false, message: errorMessage(err) };
  }
}

export async function adjustCreditsAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    const actor = await requireAdminAction();
    const userId = String(formData.get("userId") ?? "");
    const mode = String(formData.get("mode") ?? "add");
    const amount = Number(formData.get("amount") ?? NaN);
    const reason = String(formData.get("reason") ?? "").trim();

    if (!(await getAuthUser(userId))) return { ok: false, message: "User not found." };
    if (!Number.isInteger(amount) || amount < 0 || amount > 100_000) {
      return { ok: false, message: "Amount must be a whole number between 0 and 100000." };
    }
    if (mode !== "set" && amount === 0) return { ok: false, message: "Amount must be greater than 0." };
    if (!reason) return { ok: false, message: "Add a short reason. It goes in the audit log." };

    const db = adminDb();
    const before = await creditsFor(userId);
    let after: number;

    if (mode === "add") {
      const { data, error } = await db.rpc("refund_credits", { p_user_id: userId, p_amount: amount });
      if (error) return { ok: false, message: error.message };
      after = data as number;
    } else if (mode === "remove") {
      const { data, error } = await db.rpc("spend_credits", { p_user_id: userId, p_amount: amount });
      if (error) return { ok: false, message: error.message };
      if (data === null) return { ok: false, message: `User only has ${before} credits.` };
      after = data as number;
    } else if (mode === "set") {
      const { error } = await db.from("credits").upsert({ user_id: userId, credits: amount }, { onConflict: "user_id" });
      if (error) return { ok: false, message: error.message };
      after = amount;
    } else {
      return { ok: false, message: "Unknown mode." };
    }

    await recordAudit(actor.email, `credits.${mode}`, userId, { amount, before, after, reason });
    revalidatePath("/superpanel", "layout");
    return { ok: true, message: `Credits ${before} → ${after}.` };
  } catch (err) {
    return { ok: false, message: errorMessage(err) };
  }
}

export async function updateRefundStateAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    const actor = await requireAdminAction();
    const orderId = String(formData.get("orderId") ?? "");
    const refundState = String(formData.get("refundState") ?? "");
    if (!REFUND_STATES.includes(refundState as (typeof REFUND_STATES)[number])) {
      return { ok: false, message: "Invalid refund state." };
    }
    const { data, error } = await adminDb()
      .from("user_shoot_orders")
      .update({ refund_state: refundState })
      .eq("id", orderId)
      .select("user_id")
      .maybeSingle();
    if (error) return { ok: false, message: error.message };
    if (!data) return { ok: false, message: "Order not found." };

    await recordAudit(actor.email, "order.refund_state", data.user_id as string, { orderId, refundState });
    revalidatePath("/superpanel", "layout");
    return { ok: true, message: `Refund state set to ${refundState}.` };
  } catch (err) {
    return { ok: false, message: errorMessage(err) };
  }
}
