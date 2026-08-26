import type { createAdminClient } from "@/utils/supabase/admin";
import { INTEREST_IDS, type InterestId } from "@/lib/dating/types";

import {
  DATING_CREATIVE_MODEL,
  DATING_CREATIVE_THINKING_LEVEL,
  DATING_PROVIDER_REQUEST_VERSION,
  PORTFOLIO_SYSTEM_VERSION,
  SHOOT_WRITER_SYSTEM_VERSION,
  canonicalShootSummary,
  selectCraftReferences,
  customerCreativeInputSchema,
  datingShootOutputSchema,
  noveltyIdeaKey,
  type CustomerCreativeInput,
  type DatingShootIntent,
  type PortfolioCandidate,
  type PortfolioHistoryItem,
  type ShootGeneration,
  type ShootWriterRetry,
} from "@/lib/dating/creative-director";
import { getDatingPromptPricing } from "@/lib/dating/prompt-cost";

type AdminDb = ReturnType<typeof createAdminClient>;

const MAX_PORTFOLIO_CANDIDATES_PER_CALL = 30;

export function portfolioPlanningBatch(missingSlots: number) {
  if (!Number.isInteger(missingSlots) || missingSlots < 1 || missingSlots > 30) {
    throw new Error("missingSlots must be an integer from 1 to 30.");
  }
  const requestedSlots = Math.min(missingSlots, MAX_PORTFOLIO_CANDIDATES_PER_CALL);
  return {
    requestedSlots,
    candidateCount: requestedSlots,
  };
}

export type ProductionShootRow = {
  id: string;
  order_id: string;
  slot_index: number;
  idea_key: string;
  planner_version: string;
  brief: DatingShootIntent;
  concept_family: string;
  setting_family: string;
  kind: string;
  light_family: string;
  dating_signal: string;
  title: string | null;
  accepted_output: unknown;
  accepted_attempt_id: string | null;
  represented_interests: string[];
  novelty_fingerprint: string | null;
  canonical_summary: string | null;
  render_mode?: "real" | "mock";
  prompt_source?: "gemini" | "local_mock";
  contract_version?: string | null;
  status: "reserved" | "generating" | "passed" | "replanning" | "abandoned";
};

export type ProductionAttemptRow = {
  id: string;
  order_shoot_id: string;
  attempt_number: number;
  status: "running" | "passed" | "failed_validation" | "api_error";
  request_snapshot: {
    brief: DatingShootIntent;
    input: CustomerCreativeInput;
    testMode?: "off" | "sample" | "mock";
  };
  raw_output: unknown;
  validation_errors: string[];
  api_error: string | null;
  error_retryable: boolean | null;
  provider_phase: string | null;
  provider_http_status: number | null;
  provider_interaction_id: string | null;
  provider_request_version: string | null;
  input_tokens: number;
  output_tokens: number;
  reasoning_tokens: number;
  total_tokens: number;
  estimated_cost_usd: number;
  pricing_snapshot: unknown;
  created_at: string;
};

export type PortfolioAttemptRow = {
  id: string;
  order_id: string;
  attempt_number: number;
  status: "running" | "passed" | "failed_validation" | "api_error";
  requested_slots: number;
  candidate_count: number;
  request_snapshot: {
    input: CustomerCreativeInput;
    targetCount: number;
    candidateCount: number;
    interestsStillNeeded: CustomerCreativeInput["interests"];
    currentOrder: PortfolioHistoryItem[];
    customerHistory: PortfolioHistoryItem[];
    globalHistory: PortfolioHistoryItem[];
    retryProblems?: string[];
    testMode?: "off" | "sample" | "mock";
  };
  raw_output: unknown;
  validation_errors: string[];
  reservation_report: PortfolioReservationReport | null;
  api_error: string | null;
  error_retryable: boolean | null;
  provider_phase: string | null;
  provider_http_status: number | null;
  provider_interaction_id: string | null;
  provider_request_version: string | null;
  input_tokens: number;
  output_tokens: number;
  reasoning_tokens: number;
  total_tokens: number;
  estimated_cost_usd: number;
  pricing_snapshot: unknown;
  created_at: string;
};

export type PortfolioReservationRejection = {
  candidateId: string;
  fingerprint: string | null;
  reason: "exact_complete_idea" | "invalid_candidate";
  conflictingShootId: string | null;
  similarity?: number;
};

export type PortfolioSemanticWarning = {
  candidateId: string;
  scope: "same_order" | "repeat_customer" | "global";
  nearestShootId: string;
  similarity: number;
};

export type PortfolioReservationReport = {
  acceptedCount: number;
  acceptedCandidateIds: string[];
  rejected: PortfolioReservationRejection[];
  semanticWarnings: PortfolioSemanticWarning[];
  plannerWarnings?: string[];
};

const EMPTY_RESERVATION_REPORT: PortfolioReservationReport = {
  acceptedCount: 0,
  acceptedCandidateIds: [],
  rejected: [],
  semanticWarnings: [],
};

export function representedInterestsOfBrief(brief: unknown): InterestId[] {
  if (!brief || typeof brief !== "object") return [];
  const value = brief as {
    representedInterests?: unknown;
    representedInterest?: unknown;
  };
  const candidates = Array.isArray(value.representedInterests)
    ? value.representedInterests
    : value.representedInterest ? [value.representedInterest] : [];
  return candidates.filter(
    (interest): interest is InterestId =>
      typeof interest === "string" &&
      (INTEREST_IDS as readonly string[]).includes(interest)
  );
}

function historyItem(row: any): PortfolioHistoryItem | null {
  const fingerprint = String(row.novelty_fingerprint ?? "").trim();
  if (!fingerprint) return null;
  return {
    title: String(row.title ?? row.brief?.title ?? "Previous shoot"),
    canonicalSummary: String(row.canonical_summary ?? row.concept_family ?? fingerprint),
    noveltyFingerprint: fingerprint,
  };
}

function reservationFeedback(report: PortfolioReservationReport | null | undefined): string[] {
  if (!report) return [];
  const rejected = report.rejected.map((item) =>
    `Rejected ${item.candidateId} (${item.reason}): ${item.fingerprint ?? "missing fingerprint"}`
  );
  return [...rejected, ...(report.plannerWarnings ?? [])];
}

export async function loadProductionShoots(db: AdminDb, orderId: string) {
  const { data, error } = await (db as any).from("dating_order_shoots")
    .select("*").eq("order_id", orderId).neq("status", "abandoned").order("slot_index");
  if (error) throw new Error(`Failed to load production shoots: ${error.message}`);
  return (data ?? []) as ProductionShootRow[];
}

async function portfolioHistories(args: { db: AdminDb; orderId: string; userId: string }) {
  const raw = args.db as any;
  const currentRows = await loadProductionShoots(args.db, args.orderId);
  const currentOrder = currentRows.flatMap((row) => {
    const item = historyItem(row);
    return item ? [item] : [];
  });
  const { data: customerOrders, error: ordersError } = await raw.from("user_shoot_orders")
    .select("id").eq("user_id", args.userId).neq("id", args.orderId)
    .order("created_at", { ascending: false }).limit(30);
  if (ordersError) throw new Error(`Failed to load customer history: ${ordersError.message}`);
  const orderIds = (customerOrders ?? []).map((row: any) => row.id);
  const { data: customerRows, error: customerError } = orderIds.length
    ? await raw.from("dating_order_shoots")
        .select("title, brief, canonical_summary, concept_family, novelty_fingerprint")
        .in("order_id", orderIds).eq("status", "passed")
        .not("novelty_fingerprint", "is", null).limit(180)
    : { data: [], error: null };
  if (customerError) throw new Error(`Failed to load customer scenes: ${customerError.message}`);
  const customerHistory = (customerRows ?? []).flatMap((row: any) => {
    const item = historyItem(row);
    return item ? [item] : [];
  });
  const { data: globalRows, error: globalError } = await raw.from("dating_order_shoots")
    .select("title, brief, canonical_summary, concept_family, novelty_fingerprint, created_at")
    .neq("order_id", args.orderId).in("status", ["reserved", "generating", "passed"])
    .not("novelty_fingerprint", "is", null)
    .order("created_at", { ascending: false }).limit(250);
  if (globalError) throw new Error(`Failed to load global scene memory: ${globalError.message}`);
  const globalHistory = (globalRows ?? []).flatMap((row: any) => {
    const item = historyItem(row);
    return item ? [item] : [];
  });
  return { currentRows, currentOrder, customerHistory, globalHistory };
}

export async function startPortfolioAttempt(args: {
  db: AdminDb;
  orderId: string;
  userId: string;
  targetCount: number;
  input: CustomerCreativeInput;
  testMode?: "off" | "sample" | "mock";
}): Promise<PortfolioAttemptRow | null> {
  const raw = args.db as any;
  const histories = await portfolioHistories(args);
  const retained = histories.currentRows.filter((row) => row.status !== "replanning");
  const missingSlots = args.targetCount - retained.length;
  if (missingSlots <= 0) return null;
  const { requestedSlots, candidateCount } = portfolioPlanningBatch(missingSlots);
  const covered = new Set(retained.flatMap((row) => row.represented_interests ?? []));
  const interestsStillNeeded = args.input.interests.filter((interest) => !covered.has(interest));
  // A small candidate surplus lets the atomic novelty gate skip a collision
  // while the request-specific schema stays comfortably bounded.
  const { data: running } = await raw.from("dating_portfolio_attempts")
    .select("*").eq("order_id", args.orderId).eq("status", "running")
    .order("attempt_number", { ascending: false }).limit(1).maybeSingle();
  if (running) {
    const isFresh = Date.parse(running.created_at) >= Date.now() - 10 * 60_000;
    if (isFresh) return running as PortfolioAttemptRow;
    await raw.from("dating_portfolio_attempts").update({
      status: "api_error",
      api_error: "Portfolio worker stopped before it persisted a result; retrying.",
      error_retryable: true,
      updated_at: new Date().toISOString(),
    }).eq("id", running.id).eq("status", "running");
  }
  const { data: last } = await raw.from("dating_portfolio_attempts")
    .select("*").eq("order_id", args.orderId)
    .order("attempt_number", { ascending: false }).limit(1).maybeSingle();
  const attemptNumber = Number(last?.attempt_number ?? 0) + 1;
  const requestSnapshot = {
    input: args.input,
    targetCount: requestedSlots,
    candidateCount,
    interestsStillNeeded,
    currentOrder: histories.currentOrder,
    customerHistory: histories.customerHistory,
    globalHistory: histories.globalHistory,
    retryProblems: [
      ...((last?.validation_errors ?? []) as string[]),
      ...reservationFeedback(last?.reservation_report as PortfolioReservationReport | null),
    ],
    testMode: args.testMode,
  };
  const { data, error } = await raw.from("dating_portfolio_attempts").insert({
    order_id: args.orderId,
    attempt_number: attemptNumber,
    status: "running",
    model: DATING_CREATIVE_MODEL,
    thinking_level: DATING_CREATIVE_THINKING_LEVEL,
    planner_system_version: PORTFOLIO_SYSTEM_VERSION,
    requested_slots: requestedSlots,
    candidate_count: candidateCount,
    request_snapshot: requestSnapshot,
    pricing_snapshot: getDatingPromptPricing(),
    provider_phase: "portfolio_generation",
    provider_request_version: DATING_PROVIDER_REQUEST_VERSION,
  }).select("*").single();
  if (error?.code === "23505") {
    const { data: concurrent } = await raw.from("dating_portfolio_attempts").select("*")
      .eq("order_id", args.orderId).eq("status", "running")
      .order("attempt_number", { ascending: false }).limit(1).single();
    if (concurrent) return concurrent as PortfolioAttemptRow;
  }
  if (error || !data) throw new Error(`Failed to start portfolio attempt: ${error?.message}`);
  await raw.from("user_shoot_orders").update({
    pipeline_stage: "planning", updated_at: new Date().toISOString(),
  }).eq("id", args.orderId);
  return data as PortfolioAttemptRow;
}

export async function loadPortfolioAttempt(db: AdminDb, orderId: string, attemptNumber: number) {
  const { data, error } = await (db as any).from("dating_portfolio_attempts")
    .select("*").eq("order_id", orderId).eq("attempt_number", attemptNumber).single();
  if (error || !data) throw new Error(`Portfolio attempt not found: ${error?.message}`);
  return data as PortfolioAttemptRow;
}

export async function finishPortfolioAttempt(args: {
  db: AdminDb;
  attempt: PortfolioAttemptRow;
  generation: {
    output: PortfolioCandidate | null;
    rawOutput: unknown;
    validation: { passed: boolean; problems: string[]; warnings: string[] };
    usage: { inputTokens: number; outputTokens: number; reasoningTokens: number; totalTokens: number };
    estimatedCostUsd: number;
    pricingSnapshot: unknown;
    interactionId: string | null;
  };
}) {
  const raw = args.db as any;
  let reservedCount = 0;
  let reservationReport: PortfolioReservationReport = {
    ...EMPTY_RESERVATION_REPORT,
    plannerWarnings: args.generation.validation.warnings,
  };
  if (args.generation.validation.passed && args.generation.output) {
    const needed = new Set(args.attempt.request_snapshot.interestsStillNeeded);
    const orderedShoots = [...args.generation.output.shoots].sort((left, right) =>
      Number(right.representedInterests.some((interest) => needed.has(interest))) -
      Number(left.representedInterests.some((interest) => needed.has(interest)))
    );
    const candidates = orderedShoots.map((brief) => ({
        ideaKey: noveltyIdeaKey(brief.noveltyFingerprint),
        plannerVersion: PORTFOLIO_SYSTEM_VERSION,
        canonicalSummary: canonicalShootSummary(brief),
        noveltyFingerprint: brief.noveltyFingerprint,
        brief,
      }));
    const { data, error } = await raw.rpc("reserve_intelligent_dating_shoots_v3", {
      p_order_id: args.attempt.order_id,
      p_planner_attempt_id: args.attempt.id,
      p_candidates: candidates,
    });
    if (error) throw new Error(`Failed to reserve intelligent scenes: ${error.message}`);
    const report = data && typeof data === "object"
      ? data as PortfolioReservationReport
      : EMPTY_RESERVATION_REPORT;
    reservationReport = {
      acceptedCount: Number(report.acceptedCount ?? 0),
      acceptedCandidateIds: Array.isArray(report.acceptedCandidateIds)
        ? report.acceptedCandidateIds
        : [],
      rejected: Array.isArray(report.rejected) ? report.rejected : [],
      semanticWarnings: Array.isArray(report.semanticWarnings) ? report.semanticWarnings : [],
      plannerWarnings: args.generation.validation.warnings,
    };
    reservedCount = reservationReport.acceptedCount;
  }
  const status = args.generation.validation.passed ? "passed" : "failed_validation";
  const { error } = await raw.from("dating_portfolio_attempts").update({
    status,
    raw_output: args.generation.rawOutput,
    validation_errors: args.generation.validation.problems,
    reservation_report: reservationReport,
    reserved_count: reservedCount,
    input_tokens: args.generation.usage.inputTokens,
    output_tokens: args.generation.usage.outputTokens,
    reasoning_tokens: args.generation.usage.reasoningTokens,
    total_tokens: args.generation.usage.totalTokens,
    estimated_cost_usd: args.generation.estimatedCostUsd,
    pricing_snapshot: args.generation.pricingSnapshot,
    provider_phase: "portfolio_complete",
    provider_http_status: null,
    provider_interaction_id: args.generation.interactionId,
    provider_request_version: DATING_PROVIDER_REQUEST_VERSION,
    api_error: null,
    error_retryable: false,
    embedding_model: null,
    embedding_dimensions: null,
    embedding_billable_characters: 0,
    updated_at: new Date().toISOString(),
  }).eq("id", args.attempt.id).eq("status", "running");
  if (error) throw new Error(`Failed to complete portfolio attempt: ${error.message}`);
  await raw.from("user_shoot_orders").update({ provider_blocked: false })
    .eq("id", args.attempt.order_id);
  return {
    passed: args.generation.validation.passed,
    reservedCount,
    reservationReport,
  };
}

export async function failPortfolioAttempt(args: {
  db: AdminDb;
  attempt: PortfolioAttemptRow;
  safeError: string;
  retryable: boolean;
  phase: "portfolio_generation";
  httpStatus?: number | null;
  interactionId?: string | null;
}) {
  const { error } = await (args.db as any).from("dating_portfolio_attempts").update({
    status: "api_error",
    api_error: args.safeError,
    error_retryable: args.retryable,
    provider_phase: args.phase,
    provider_http_status: args.httpStatus ?? null,
    provider_interaction_id: args.interactionId ?? null,
    provider_request_version: DATING_PROVIDER_REQUEST_VERSION,
    updated_at: new Date().toISOString(),
  }).eq("id", args.attempt.id).eq("status", "running");
  if (error) throw new Error(`Failed to persist portfolio provider error: ${error.message}`);
}

export async function startProductionAttempt(
  db: AdminDb,
  shoot: ProductionShootRow,
  input?: CustomerCreativeInput,
  testMode?: "off" | "sample" | "mock"
): Promise<ProductionAttemptRow> {
  const raw = db as any;
  const { data: order } = input ? { data: null } : await raw.from("user_shoot_orders")
    .select("creative_input").eq("id", shoot.order_id).single();
  const creativeInput = input ?? customerCreativeInputSchema.parse({
    interests: order?.creative_input?.interests ?? [],
    exclusions: order?.creative_input?.excludeTags ?? [],
  });
  const { data: last } = await raw.from("dating_prompt_attempts")
    .select("attempt_number").eq("order_shoot_id", shoot.id)
    .order("attempt_number", { ascending: false }).limit(1).maybeSingle();
  const attemptNumber = Number(last?.attempt_number ?? 0) + 1;
  const referenceIds = selectCraftReferences(shoot.brief)
    .map((reference) => `${reference.shootId}:${reference.framing}`)
    .join(",");
  const { data, error } = await raw.from("dating_prompt_attempts").insert({
    order_shoot_id: shoot.id,
    attempt_number: attemptNumber,
    status: "running",
    model: DATING_CREATIVE_MODEL,
    thinking_level: DATING_CREATIVE_THINKING_LEVEL,
    prompt_system_version: SHOOT_WRITER_SYSTEM_VERSION,
    reference_shoot_id: referenceIds,
    request_snapshot: { brief: shoot.brief, input: creativeInput, testMode },
    pricing_snapshot: getDatingPromptPricing(),
    provider_phase: "shoot_generation",
    provider_request_version: DATING_PROVIDER_REQUEST_VERSION,
  }).select("*").single();
  if (error?.code === "23505") {
    const { data: concurrent } = await raw.from("dating_prompt_attempts").select("*")
      .eq("order_shoot_id", shoot.id).eq("attempt_number", attemptNumber).single();
    return concurrent as ProductionAttemptRow;
  }
  if (error || !data) throw new Error(`Failed to start prompt attempt: ${error?.message}`);
  await raw.from("dating_order_shoots").update({
    status: "generating", updated_at: new Date().toISOString(),
  }).eq("id", shoot.id);
  return data as ProductionAttemptRow;
}

export async function ensureProductionAttempt(
  db: AdminDb,
  shoot: ProductionShootRow,
  input?: CustomerCreativeInput,
  testMode?: "off" | "sample" | "mock"
) {
  if (shoot.status === "generating") {
    const { data } = await (db as any).from("dating_prompt_attempts").select("*")
      .eq("order_shoot_id", shoot.id).eq("status", "running")
      .order("attempt_number", { ascending: false }).limit(1).maybeSingle();
    if (data) {
      const running = data as ProductionAttemptRow;
      if (Date.parse(running.created_at) >= Date.now() - 10 * 60_000) return running;
      await failProductionAttempt({
        db, attempt: running,
        safeError: "Prompt worker stopped before it persisted a result; retrying.",
        retryable: true,
      });
    }
  }
  return startProductionAttempt(db, shoot, input, testMode);
}

export async function loadProductionAttempt(
  db: AdminDb,
  orderShootId: string,
  attemptNumber: number
): Promise<ProductionAttemptRow & { shoot: ProductionShootRow }> {
  const raw = db as any;
  const [{ data: attempt, error }, { data: shoot, error: shootError }] = await Promise.all([
    raw.from("dating_prompt_attempts").select("*").eq("order_shoot_id", orderShootId)
      .eq("attempt_number", attemptNumber).single(),
    raw.from("dating_order_shoots").select("*").eq("id", orderShootId).single(),
  ]);
  if (error || !attempt) throw new Error(`Prompt attempt not found: ${error?.message}`);
  if (shootError || !shoot) throw new Error(`Order shoot not found: ${shootError?.message}`);
  return { ...(attempt as ProductionAttemptRow), shoot: shoot as ProductionShootRow };
}

export async function previousAttemptContext(
  db: AdminDb,
  shoot: ProductionShootRow,
  attemptNumber: number
): Promise<ShootWriterRetry | undefined> {
  if (attemptNumber <= 1) return undefined;
  const { data } = await (db as any).from("dating_prompt_attempts")
    .select("raw_output, validation_errors").eq("order_shoot_id", shoot.id)
    .lt("attempt_number", attemptNumber).order("attempt_number", { ascending: false })
    .limit(1).maybeSingle();
  return data ? { previousOutput: data.raw_output, validationErrors: data.validation_errors ?? [] } : undefined;
}

export async function finishProductionAttempt(args: {
  db: AdminDb;
  attempt: ProductionAttemptRow;
  generation: ShootGeneration;
}): Promise<{ passed: boolean; replanning: boolean }> {
  const raw = args.db as any;
  const parsed = args.generation.validation.passed
    ? datingShootOutputSchema.parse(args.generation.output)
    : null;
  const { error } = await raw.rpc("complete_dating_prompt_attempt", {
    p_attempt_id: args.attempt.id,
    p_attempt_status: parsed ? "passed" : "failed_validation",
    p_shoot_status: parsed ? "passed" : "reserved",
    p_raw_output: args.generation.rawOutput,
    p_validation_errors: args.generation.validation.problems,
    p_scene_density: args.generation.validation.sceneDensity,
    p_input_tokens: args.generation.usage.inputTokens,
    p_output_tokens: args.generation.usage.outputTokens,
    p_reasoning_tokens: args.generation.usage.reasoningTokens,
    p_total_tokens: args.generation.usage.totalTokens,
    p_estimated_cost_usd: args.generation.estimatedCostUsd,
    p_pricing_snapshot: args.generation.pricingSnapshot,
    p_api_error: null,
    p_accepted_output: parsed,
    p_title: parsed?.title ?? null,
  });
  if (error) throw new Error(`Failed to commit prompt attempt: ${error.message}`);
  await raw.from("dating_prompt_attempts").update({
    provider_phase: "shoot_complete",
    provider_http_status: null,
    provider_interaction_id: args.generation.interactionId,
    provider_request_version: DATING_PROVIDER_REQUEST_VERSION,
    error_retryable: false,
  }).eq("id", args.attempt.id);
  return { passed: Boolean(parsed), replanning: false };
}

export async function failProductionAttempt(args: {
  db: AdminDb;
  attempt: ProductionAttemptRow;
  safeError: string;
  retryable?: boolean;
  phase?: string;
  httpStatus?: number | null;
  interactionId?: string | null;
}) {
  const { error } = await (args.db as any).rpc("complete_dating_prompt_attempt", {
    p_attempt_id: args.attempt.id,
    p_attempt_status: "api_error",
    p_shoot_status: "reserved",
    p_raw_output: args.attempt.raw_output ?? null,
    p_validation_errors: args.attempt.validation_errors ?? [],
    p_scene_density: [],
    p_input_tokens: 0,
    p_output_tokens: 0,
    p_reasoning_tokens: 0,
    p_total_tokens: 0,
    p_estimated_cost_usd: 0,
    p_pricing_snapshot: null,
    p_api_error: args.safeError,
    p_accepted_output: null,
    p_title: null,
  });
  if (error) throw new Error(`Failed to persist prompt provider error: ${error.message}`);
  const { error: retryError } = await (args.db as any).from("dating_prompt_attempts")
    .update({
      error_retryable: args.retryable ?? true,
      provider_phase: args.phase ?? "shoot_generation",
      provider_http_status: args.httpStatus ?? null,
      provider_interaction_id: args.interactionId ?? null,
      provider_request_version: DATING_PROVIDER_REQUEST_VERSION,
    })
    .eq("id", args.attempt.id);
  if (retryError) throw new Error(`Failed to classify prompt provider error: ${retryError.message}`);
}
