import type { CreateEmailOptions, Resend } from "resend";

type SenderEnvironment = {
  RESEND_FROM_EMAIL?: string;
  RESEND_SENDER_EMAIL?: string;
};

export function resolveDatingNotificationSender(env: SenderEnvironment = {
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
  RESEND_SENDER_EMAIL: process.env.RESEND_SENDER_EMAIL,
}): string {
  return env.RESEND_FROM_EMAIL?.trim() || env.RESEND_SENDER_EMAIL?.trim() ||
    "Unrealshot AI <support@noreply.unrealshot.com>";
}

export type DatingNotificationResult =
  | { ok: true; emailId: string }
  | { ok: false; message: string };

/** Resend returns API rejections as values; awaiting send alone is not success. */
export async function sendDatingReadyEmail(
  send: Resend["emails"]["send"],
  payload: CreateEmailOptions,
  orderId: string
): Promise<DatingNotificationResult> {
  const { data, error } = await send(payload, { idempotencyKey: `dating-ready:${orderId}` });
  if (error) return { ok: false, message: error.message };
  if (!data?.id) return { ok: false, message: "Resend did not return an email ID" };
  return { ok: true, emailId: data.id };
}
