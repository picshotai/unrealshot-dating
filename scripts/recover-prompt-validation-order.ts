import { strict as assert } from "node:assert";
import { getServiceDb } from "../lib/dating/db";
import { generateShootCandidate } from "../lib/dating/creative-director";
import {
  finishProductionAttempt,
  loadProductionShoots,
  startProductionAttempt,
  type ProductionAttemptRow,
} from "../lib/dating/production-prompts/store";
import { tasks } from "@trigger.dev/sdk";
import { verifiedDatingReferenceUrls } from "../lib/dating/reference-image";

// Dry-run by default. Revalidate saved provider output with the current full
// contract before creating zero-cost recovery attempts. Keep original failed
// attempts and their diagnostics intact for the incident audit.
async function main() {
  const orderId = process.argv.find((arg) => /^[a-f0-9-]{36}$/.test(arg));
  assert(orderId, "Supply an order UUID, optionally followed by --apply --resume.");
  const db = getServiceDb();
  const { data: order, error } = await db.from("user_shoot_orders")
    .select("id,user_id,model_id,status,credit_state,failure_code,prompt_system_version,updated_at")
    .eq("id", orderId).single();
  if (error) throw error;
  assert(order?.status === "failed" && order.failure_code === "internal_prompt_validation",
    "Recovery requires an order stopped by prompt validation.");
  assert.equal(order.prompt_system_version, "dating-shoot-writer-v7");
  const shoots = await loadProductionShoots(db, orderId);
  const candidates = [];
  for (const shoot of shoots.filter((row) => row.status !== "passed")) {
    assert.equal(shoot.status, "reserved");
    const { data: saved, error: attemptError } = await db.from("dating_prompt_attempts")
      .select("*").eq("order_shoot_id", shoot.id).eq("status", "failed_validation")
      .order("attempt_number", { ascending: false }).limit(1).single();
    if (attemptError) throw attemptError;
    const source = saved as ProductionAttemptRow;
    const generation = await generateShootCandidate({
      brief: shoot.brief,
      input: source.request_snapshot.input,
      modelCall: async () => ({
        text: JSON.stringify(source.raw_output),
        usage: { inputTokens: 0, outputTokens: 0, reasoningTokens: 0, totalTokens: 0 },
        interactionId: source.provider_interaction_id,
      }),
    });
    console.log(JSON.stringify({ shootId: shoot.id, sourceAttempt: source.attempt_number,
      title: shoot.brief.title, passed: generation.validation.passed,
      problems: generation.validation.problems }));
    assert(generation.validation.passed, "Saved candidate still violates the current contract; no recovery applied.");
    candidates.push({ shoot, source, generation });
  }
  if (!process.argv.includes("--apply")) {
    console.log(`Dry run: ${candidates.length} saved shoots can be recovered without provider calls.`);
    return;
  }
  const { data: current, error: currentError } = await db.from("user_shoot_orders")
    .select("status,updated_at").eq("id", orderId).single();
  if (currentError) throw currentError;
  assert(current.status === "failed" && current.updated_at === order.updated_at,
    "Order changed during the recovery audit; rerun after checking its state.");
  for (const { shoot, source, generation } of candidates) {
    const attempt = await startProductionAttempt(db, shoot, source.request_snapshot.input, source.request_snapshot.testMode);
    const { error: auditError } = await db.from("dating_prompt_attempts").update({
      request_snapshot: { ...attempt.request_snapshot, recoverySourceAttemptId: source.id,
        recoveryReason: "expression_negation_false_positive", providerCallMade: false },
    }).eq("id", attempt.id);
    if (auditError) throw auditError;
    const result = await finishProductionAttempt({ db, attempt, generation });
    assert(result.passed);
  }
  console.log(`Recovered ${candidates.length} saved shoots; original failure records retained.`);
  if (!process.argv.includes("--resume")) return;
  const { data: model, error: modelError } = await db.from("models")
    .select("id,samples(uri,reference_sanitized)").eq("id", order.model_id).single();
  if (modelError) throw modelError;
  const referenceImageUrls = verifiedDatingReferenceUrls(model.samples ?? []);
  const { data: reservation, error: reservationError } = await db.rpc("reserve_dating_order_retry", {
    p_order_id: orderId, p_user_id: order.user_id,
  });
  if (reservationError) throw reservationError;
  if (reservation.result === "already_running") {
    console.log(JSON.stringify({ resumed: true, reused: true, runId: reservation.triggerRunId }));
    return;
  }
  assert.equal(reservation.result, "reserved", `Resume unavailable: ${reservation.result}`);
  let run;
  try {
    run = await tasks.trigger("dating-photoshoot-orchestrator", {
      userId: order.user_id, batchId: orderId, modelId: order.model_id, referenceImageUrls,
    }, { idempotencyKey: `dating-incident-resume:${orderId}:${order.updated_at}`, idempotencyKeyTTL: "30d" });
  } catch (dispatchError) {
    const { error: releaseError } = await db.rpc("release_dating_order_credit", {
      p_order_id: orderId, p_failure_code: "retry_dispatch_failed",
      p_failure_phase: "orchestration_dispatch",
      p_failure_message: "Recovery dispatch failed. The reserved pack was returned.",
    });
    if (releaseError) throw releaseError;
    throw dispatchError;
  }
  const { error: runError } = await db.from("user_shoot_orders")
    .update({ trigger_run_id: run.id }).eq("id", orderId);
  if (runError) throw runError;
  console.log(JSON.stringify({ resumed: true, runId: run.id }));
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
