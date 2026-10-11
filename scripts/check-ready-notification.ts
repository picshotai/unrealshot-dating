import { strict as assert } from "node:assert";
import { resolveDatingNotificationSender, sendDatingReadyEmail } from "../lib/dating/notification-delivery";

async function main() {
  const sender = resolveDatingNotificationSender({ RESEND_SENDER_EMAIL: "support@noreply.unrealshot.com" });
  assert.equal(sender, "support@noreply.unrealshot.com");
  assert.match(resolveDatingNotificationSender({}), /@noreply\.unrealshot\.com>/);
  assert.equal(resolveDatingNotificationSender({ RESEND_FROM_EMAIL: "  custom@example.com ", RESEND_SENDER_EMAIL: sender }), "custom@example.com");
  assert.equal(resolveDatingNotificationSender({ RESEND_FROM_EMAIL: " ", RESEND_SENDER_EMAIL: sender }), sender);
  const payload = { from: sender, to: "fixture@example.com", subject: "Ready", html: "Fixture" };
  const rejected = await sendDatingReadyEmail(async (email, options) => {
    assert.equal(email.from, sender);
    assert.equal(options?.idempotencyKey, "dating-ready:fixture-order");
    return { data: null, error: { name: "validation_error", message: "Domain not verified", statusCode: 403 }, headers: null };
  }, payload, "fixture-order");
  assert.deepEqual(rejected, { ok: false, message: "Domain not verified" });
  const accepted = await sendDatingReadyEmail(async () => ({ data: { id: "fixture-email" }, error: null, headers: null }), payload, "fixture-order");
  assert.deepEqual(accepted, { ok: true, emailId: "fixture-email" });
  await assert.rejects(sendDatingReadyEmail(async () => { throw new Error("Network failure"); }, payload, "fixture-order"), /Network failure/);
  console.log("Ready notification regressions passed (no emails sent).");
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
