import { createAdminClient } from "@/utils/supabase/admin";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { Receiver } from "@upstash/qstash";
import { adminEmailSender } from "@/lib/admin/email/send";

// --- Email Templates ---

function getEmailTemplate30Min() {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
      <p style="margin-bottom: 16px;">Hey,</p>

      <p style="margin-bottom: 16px;">I'm Harvansh. I’m the solo founder building Unrealshot AI.</p>

      <p style="margin-bottom: 16px;">I saw you created an account a little while ago but didn't start your dating photoshoot yet.</p>

      <p style="margin-bottom: 16px;">To be honest, since I'm a one-person team, I'm constantly stressing over whether the onboarding is too confusing or if the pricing is scary.</p>

      <p style="margin-bottom: 16px;">Did you get stuck somewhere? Or were you just looking around?</p>

      <p style="margin-bottom: 16px;">If you have a specific worry about how the photos will turn out, just reply to this email. I read every single one and I'd love to help you out personally.</p>

      <p style="margin-top: 32px;">Best,</p>
      <p>Harvansh<br>Founder, Unrealshot.com</p>
    </div>
  `;
}

function getEmailTemplate4Hour() {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
      <p style="margin-bottom: 16px;">Hey,</p>

      <p style="margin-bottom: 16px;">You didn't reply to my last note, so I’m guessing you’re either super busy (totally get it) or the pricing felt a little steep for something you haven't tried yet.</p>

      <p style="margin-bottom: 16px;">I really want you to see the quality of the dating photos it makes. I’m confident that once you see the results, you’ll love them.</p>

      <p style="margin-bottom: 16px;">So, I created a hidden code to lower the barrier for you:</p>

      <div style="background: #f0f0f0; padding: 12px; border-radius: 6px; text-align: center; margin: 20px 0;">
        <strong>Code: WELCOME20</strong> (Save 20%)
      </div>

      <p style="margin-bottom: 16px;">You can use this at checkout: <a href="https://unrealshot.com/buy-credits" style="color: #007bff;">unrealshot.com/buy-credits</a></p>

      <p style="margin-bottom: 16px;">My only ask: If you like the photos, would you mind sending me a quick reply? I'm desperately looking for feedbacks.</p>

      <p style="margin-top: 32px;">Cheers,</p>
      <p>Harvansh</p>
    </div>
  `;
}

type FollowupStage = {
  type: "30min" | "4hour";
  startOffset: string;
  endOffset: string;
  subject: string;
  html: () => string;
};

const STAGES: FollowupStage[] = [
  // Signed up 30m - 1.5h ago
  { type: "30min", startOffset: "30 minutes", endOffset: "1 hour 30 minutes", subject: "quick question?", html: getEmailTemplate30Min },
  // Signed up 4h - 6h ago
  { type: "4hour", startOffset: "4 hours", endOffset: "6 hours", subject: "I have a small idea", html: getEmailTemplate4Hour },
];

type StageResult = { eligible: number; sent: number; failed: number; error?: string };

async function runStage(
  stage: FollowupStage,
  supabase: ReturnType<typeof createAdminClient>,
  resend: Resend
): Promise<StageResult> {
  const { data: users, error } = await supabase.rpc("get_eligible_users_for_followup", {
    start_offset: stage.startOffset,
    end_offset: stage.endOffset,
    target_email_type: stage.type,
  });
  if (error) {
    console.error(`[followup] eligibility query failed for ${stage.type}:`, error.message);
    return { eligible: 0, sent: 0, failed: 0, error: error.message };
  }

  const { from, replyTo } = adminEmailSender();
  const result: StageResult = { eligible: users?.length ?? 0, sent: 0, failed: 0 };

  for (const user of users ?? []) {
    // Resend reports rejections as a returned { error }, not a throw. The
    // idempotency key stops a duplicate if the log insert below fails and the
    // next run picks the same user up again.
    const { data, error: sendError } = await resend.emails.send(
      { from, to: user.email, replyTo, subject: stage.subject, html: stage.html() },
      { idempotencyKey: `followup:${stage.type}:${user.id}` }
    );
    if (sendError || !data?.id) {
      result.failed++;
      console.error(`[followup] ${stage.type} email rejected for ${user.id}:`, sendError?.message ?? "no email id");
      continue;
    }

    result.sent++;
    const { error: logError } = await supabase
      .from("followup_email_logs")
      .insert({ user_id: user.id, email_type: stage.type });
    if (logError && logError.code !== "23505") {
      console.error(`[followup] failed to log ${stage.type} email for ${user.id}:`, logError.message);
    }
  }

  return result;
}

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("Upstash-Signature") || "";
    const body = await request.text();

    // verify() is async and throws on a bad signature; an un-awaited call is
    // always truthy and would let any caller trigger these sends.
    const receiver = new Receiver({
      currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY || "",
      nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY || "",
    });
    const valid = await receiver.verify({ body, signature }).catch(() => false);
    if (!valid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "RESEND_API_KEY is not configured" }, { status: 500 });
    }

    const supabase = createAdminClient();
    const resend = new Resend(apiKey);

    const results: Record<string, StageResult> = {};
    for (const stage of STAGES) {
      results[stage.type] = await runStage(stage, supabase, resend);
    }

    return NextResponse.json({ message: "Emails processed", results }, { status: 200 });
  } catch (error) {
    console.error("[followup] failed:", error);
    return NextResponse.json(
      { error: "Failed to process emails", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
