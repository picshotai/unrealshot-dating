import { Resend } from "resend";
import { getServiceDb } from "./db";
import {
  CUSTOM_CREDITS_DEFAULT,
  FRAMES_PER_SHOOT,
  SHOOTS_PER_DELIVERY,
  TOTAL_PHOTOS,
} from "./types";

/**
 * Sends a transactional email when a delivery finishes.
 * Fails gracefully if RESEND_API_KEY is not configured.
 */
export async function sendDatingShootReadyNotification(
  userId: string,
  orderId: string
): Promise<{ ok: boolean; message?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[dating-shoot] RESEND_API_KEY is missing, skipping email notification");
    return { ok: false, message: "Missing RESEND_API_KEY" };
  }

  try {
    const db = getServiceDb();
    
    // Fetch user email from Supabase Auth admin
    const { data: userData, error: userError } = await (db as any).auth.admin.getUserById(userId);
    const userEmail = userData?.user?.email;

    if (userError || !userEmail) {
      console.warn("[dating-shoot] Could not fetch user email for notification", {
        userId,
        error: userError?.message,
      });
      return { ok: false, message: "User email not found" };
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://unrealshot.com");
    
    const dashboardUrl = `${appUrl}/dating-shoot?orderId=${orderId}`;

    const resend = new Resend(apiKey);
    const fromEmail = process.env.RESEND_FROM_EMAIL || "Unrealshot AI <photos@unrealshot.com>";

    await resend.emails.send({
      from: fromEmail,
      to: userEmail,
      subject: `Your ${TOTAL_PHOTOS} dating photos are ready 📸`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Dating Photoshoot is Ready</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; color: #f4f4f5; padding: 40px 20px; margin: 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
            <h1 style="font-size: 24px; font-weight: 700; color: #ffffff; margin-top: 0; margin-bottom: 16px;">
              Your ${TOTAL_PHOTOS} dating photos are ready 🎉
            </h1>
            <p style="font-size: 15px; line-height: 1.6; color: #a1a1aa; margin-bottom: 24px;">
              ${SHOOTS_PER_DELIVERY} shoots, ${FRAMES_PER_SHOOT} photos from each.
              Every shoot is a different place, a different outfit and a different
              light &mdash; and there is one person in every frame: you.
            </p>
            <div style="background-color: #27272a; border-radius: 12px; padding: 16px 20px; margin-bottom: 28px;">
              <ul style="margin: 0; padding-left: 20px; color: #e4e4e7; font-size: 14px; line-height: 1.8;">
                <li><strong>A close portrait</strong> from every shoot &mdash; that is your opener</li>
                <li><strong>A half-body</strong> for the second slot</li>
                <li><strong>A full-length</strong>, because profiles without one get read as hiding something</li>
                <li><strong>A candid</strong> &mdash; the one people actually message about</li>
              </ul>
            </div>
            <div style="text-align: center; margin-bottom: 28px;">
              <a href="${dashboardUrl}" style="display: inline-block; background-color: #ffffff; color: #09090b; font-weight: 600; font-size: 15px; padding: 14px 32px; border-radius: 10px; text-decoration: none;">
                View & Download Your Photos →
              </a>
            </div>
            <p style="font-size: 13px; color: #71717a; text-align: center; margin-bottom: 0;">
              You also have ${CUSTOM_CREDITS_DEFAULT} reshoots in your dashboard if you want to redo any frame.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("[dating-shoot] Ready email sent successfully to", userEmail);
    return { ok: true };
  } catch (err: any) {
    console.error("[dating-shoot] Error sending ready email notification:", err?.message);
    return { ok: false, message: err?.message };
  }
}
