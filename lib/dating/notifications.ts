import { Resend } from "resend";
import { getServiceDb } from "./db";

/**
 * Sends a transactional email when a 100-photo dating photoshoot is completed.
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
      subject: "Your 100 Dating Photos Are Ready! 📸",
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
              Your 100 Dating Photos Are Ready! 🎉
            </h1>
            <p style="font-size: 15px; line-height: 1.6; color: #a1a1aa; margin-bottom: 24px;">
              A hundred photos, sorted into the lineup a profile actually needs.
              No two share an outfit or a light, and there is one person in every
              frame &mdash; you.
            </p>
            <div style="background-color: #27272a; border-radius: 12px; padding: 16px 20px; margin-bottom: 28px;">
              <ul style="margin: 0; padding-left: 20px; color: #e4e4e7; font-size: 14px; line-height: 1.8;">
                <li><strong>Your opener:</strong> the clear, straight-to-camera shots to lead with</li>
                <li><strong>Your full body:</strong> the ones people scroll for</li>
                <li><strong>What you do:</strong> built around what you told us you are into</li>
                <li><strong>Out in the world:</strong> a life happening outside the flat</li>
                <li><strong>The rest:</strong> every one a different place, outfit and light</li>
              </ul>
            </div>
            <div style="text-align: center; margin-bottom: 28px;">
              <a href="${dashboardUrl}" style="display: inline-block; background-color: #ffffff; color: #09090b; font-weight: 600; font-size: 15px; padding: 14px 32px; border-radius: 10px; text-decoration: none;">
                View & Download Your Photos →
              </a>
            </div>
            <p style="font-size: 13px; color: #71717a; text-align: center; margin-bottom: 0;">
              You also have 30 custom regeneration credits in your dashboard if you want to tweak any shot.
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
