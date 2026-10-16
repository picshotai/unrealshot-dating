import "server-only";
import { randomUUID } from "crypto";
import { Resend } from "resend";
import { adminDb } from "@/lib/admin/data";
import { appUrl, fillPlaceholders, renderEmailHtml } from "./render";

export type AdminEmailRecipient = {
  userId: string | null;
  email: string;
  name: string;
  credits: number;
};

export type AdminEmailDraft = {
  subject: string;
  body: string;
  templateKey: string | null;
  /** One key per compose form; makes double-submits and retries safe. */
  idempotencyKey: string;
};

export type AdminEmailOutcome = { sent: number; failed: number; errors: string[] };

const BATCH_SIZE = 100;

export function adminEmailSender() {
  return {
    from:
      process.env.ADMIN_EMAIL_FROM?.trim() ||
      "Harvansh from Unrealshot <harvansh@noreply.unrealshot.com>",
    replyTo: process.env.ADMIN_EMAIL_REPLY_TO?.trim() || "support@unrealshot.com",
  };
}

/** What the client composer needs to show sender details and render previews. */
export function adminEmailContext() {
  return { sender: adminEmailSender(), appUrl: appUrl() };
}

function personalize(draft: AdminEmailDraft, recipient: AdminEmailRecipient) {
  const vars = { name: recipient.name, email: recipient.email, credits: recipient.credits, app_url: appUrl() };
  const subject = fillPlaceholders(draft.subject, vars).trim();
  const text = fillPlaceholders(draft.body, vars).trim();
  return { subject, text, html: renderEmailHtml(text) };
}

/**
 * Sends one personalized email per recipient through Resend and logs every
 * attempt to admin_email_logs. A single recipient uses emails.send; more use
 * the batch API (permissive, so one bad address doesn't sink the batch).
 */
export async function sendAdminEmails(
  recipients: AdminEmailRecipient[],
  draft: AdminEmailDraft,
  actorEmail: string
): Promise<AdminEmailOutcome> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured");

  const resend = new Resend(apiKey);
  const { from, replyTo } = adminEmailSender();
  const batchId = recipients.length > 1 ? randomUUID() : null;
  const logs: Record<string, unknown>[] = [];
  const outcome: AdminEmailOutcome = { sent: 0, failed: 0, errors: [] };

  const record = (recipient: AdminEmailRecipient, content: ReturnType<typeof personalize>, resendId: string | null, error: string | null) => {
    if (error) {
      outcome.failed++;
      if (outcome.errors.length < 5) outcome.errors.push(`${recipient.email}: ${error}`);
    } else {
      outcome.sent++;
    }
    logs.push({
      user_id: recipient.userId,
      to_email: recipient.email,
      from_email: from,
      reply_to: replyTo,
      subject: content.subject,
      body_text: content.text,
      template_key: draft.templateKey,
      batch_id: batchId,
      resend_id: resendId,
      status: error ? "failed" : "sent",
      error,
      sent_by: actorEmail,
    });
  };

  if (recipients.length === 1) {
    const recipient = recipients[0];
    const content = personalize(draft, recipient);
    const { data, error } = await resend.emails.send(
      { from, to: recipient.email, replyTo, subject: content.subject, html: content.html, text: content.text },
      { idempotencyKey: `admin-email:${draft.idempotencyKey}` }
    );
    record(recipient, content, data?.id ?? null, error ? error.message : data?.id ? null : "No email ID returned");
  } else {
    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      const chunk = recipients.slice(i, i + BATCH_SIZE);
      const contents = chunk.map((r) => personalize(draft, r));
      const { data, error } = await resend.batch.send(
        chunk.map((r, j) => ({
          from,
          to: r.email,
          replyTo,
          subject: contents[j].subject,
          html: contents[j].html,
          text: contents[j].text,
        })),
        { idempotencyKey: `admin-batch:${draft.idempotencyKey}:${i}`, batchValidation: "permissive" }
      );
      if (error || !data) {
        chunk.forEach((r, j) => record(r, contents[j], null, error?.message ?? "Batch rejected"));
        continue;
      }
      // Permissive batches return ids for accepted emails, in order, skipping the failed indexes.
      const failedAt = new Map((data.errors ?? []).map((e) => [e.index, e.message]));
      let idCursor = 0;
      chunk.forEach((r, j) => {
        const failure = failedAt.get(j);
        if (failure) record(r, contents[j], null, failure);
        else record(r, contents[j], data.data[idCursor++]?.id ?? null, null);
      });
    }
  }

  const { error: logError } = await adminDb().from("admin_email_logs").insert(logs);
  if (logError) console.error("[superpanel] failed to log admin emails", logError.message);

  return outcome;
}
