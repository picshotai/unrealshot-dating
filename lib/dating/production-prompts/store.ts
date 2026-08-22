import type { createAdminClient } from "@/utils/supabase/admin";

import { getPromptLabPricing } from "@/lib/dating/prompt-lab/cost";
import { outputToRecentScene, type RetryContext } from "@/lib/dating/prompt-lab/prompt";
import { promptLabOutputSchema, type RecentScene } from "@/lib/dating/prompt-lab/schemas";
import { selectPromptLabReference } from "@/lib/dating/prompt-lab/references";
import {
  DATING_PROMPT_MODEL,
  DATING_PROMPT_SYSTEM_VERSION,
  DATING_PROMPT_THINKING_LEVEL,
} from "@/lib/dating/prompt-engine";
import {
  expandDatingSceneBrief,
  planDatingSceneBriefs,
  type DatingSceneBrief,
  type PlanRecipeInput,
} from "@/lib/dating/scene-recipes";

type AdminDb = ReturnType<typeof createAdminClient>;

export type ProductionShootRow = {
  id: string;
  order_id: string;
  slot_index: number;
  idea_key: string;
  planner_version: string;
  brief: DatingSceneBrief;
  concept_family: string;
  setting_family: string;
  kind: DatingSceneBrief["kind"];
  light_family: DatingSceneBrief["lightFamily"];
  dating_signal: DatingSceneBrief["datingSignal"];
  title: string | null;
  accepted_output: unknown;
  accepted_attempt_id: string | null;
  status: "reserved" | "generating" | "passed" | "replanning" | "abandoned";
};

export type ProductionAttemptRow = {
  id: string;
  order_shoot_id: string;
  attempt_number: number;
  status: "running" | "passed" | "failed_validation" | "api_error";
  request_snapshot: { brief: DatingSceneBrief };
  raw_output: unknown;
  validation_errors: string[];
  api_error: string | null;
  created_at: string;
};

function rowsForReservation(briefs: readonly DatingSceneBrief[], candidateRank: number) {
  return briefs.map((brief) => ({
    candidate_rank: candidateRank,
    slot_index: brief.slotIndex,
    idea_key: brief.ideaKey,
    planner_version: brief.plannerVersion,
    brief,
    concept_family: brief.conceptFamily,
    setting_family: brief.settingFamily,
    kind: brief.kind,
    light_family: brief.lightFamily,
    dating_signal: brief.datingSignal,
  }));
}

export async function previousDynamicConcepts(
  db: AdminDb,
  userId: string
): Promise<string[]> {
  const raw = db as any;
  const { data: orders, error: orderError } = await raw
    .from("user_shoot_orders")
    .select("id")
    .eq("user_id", userId)
    .eq("pipeline_mode", "dynamic")
    .order("created_at", { ascending: false })
    .limit(100);
  if (orderError) throw new Error(`Failed to load dynamic history: ${orderError.message}`);
  if (!orders?.length) return [];
  const orderRank = new Map<string, number>(
    orders.map((order: { id: string }, index: number) => [order.id, index])
  );
  const { data, error } = await raw
    .from("dating_order_shoots")
    .select("order_id, concept_family, created_at")
    .in("order_id", orders.map((order: { id: string }) => order.id))
    .eq("status", "passed");
  if (error) throw new Error(`Failed to load dynamic concepts: ${error.message}`);
  const newestFirst = [...(data ?? [])].sort(
    (left: any, right: any) =>
      (orderRank.get(String(left.order_id)) ?? 999) -
        (orderRank.get(String(right.order_id)) ?? 999) ||
      Date.parse(String(right.created_at)) - Date.parse(String(left.created_at))
  );
  return Array.from(new Set<string>(
    newestFirst.map((row: any) => String(row.concept_family))
  ));
}

export async function reserveProductionPortfolio(args: {
  db: AdminDb;
  orderId: string;
  userId: string;
  input: Omit<PlanRecipeInput, "orderId" | "previousConceptFamilies" | "salt">;
}): Promise<DatingSceneBrief[]> {
  const raw = args.db as any;
  const existing = await loadProductionShoots(args.db, args.orderId);
  if (existing.length === args.input.count) return existing.map((row) => row.brief);
  if (existing.length > 0) throw new Error("Dynamic order has a partial scene reservation.");

  const previousConceptFamilies = await previousDynamicConcepts(args.db, args.userId);
  for (let batch = 0; batch < 8; batch += 1) {
    const recipeInput: PlanRecipeInput = {
        ...args.input,
        orderId: args.orderId,
        previousConceptFamilies,
        salt: batch,
    };
    let portfolio: DatingSceneBrief[];
    try {
      portfolio = planDatingSceneBriefs(recipeInput);
    } catch {
      continue;
    }
    const candidates = portfolio.flatMap((brief) =>
      expandDatingSceneBrief(recipeInput, brief, 128).map(
        (candidate, rank) => rowsForReservation([candidate], rank)[0]
      )
    );
    const { error } = await raw.rpc("reserve_dating_order_shoots", {
      p_order_id: args.orderId,
      p_rows: candidates,
    });
    if (!error) {
      return (await loadProductionShoots(args.db, args.orderId)).map((row) => row.brief);
    }
    if (error.code === "23505") continue;
    if (/candidate pool/i.test(error.message ?? "")) continue;
    throw new Error(`Failed to reserve production scenes: ${error.message}`);
  }
  throw new Error("The scene registry is busy; the order will be retried.");
}

export async function loadProductionShoots(
  db: AdminDb,
  orderId: string
): Promise<ProductionShootRow[]> {
  const { data, error } = await (db as any)
    .from("dating_order_shoots")
    .select("*")
    .eq("order_id", orderId)
    .neq("status", "abandoned")
    .order("slot_index");
  if (error) throw new Error(`Failed to load production shoots: ${error.message}`);
  return (data ?? []) as ProductionShootRow[];
}

export async function replaceProductionBrief(args: {
  db: AdminDb;
  shoot: ProductionShootRow;
  recipeInput: PlanRecipeInput;
}): Promise<ProductionShootRow> {
  const raw = args.db as any;
  const siblings = await loadProductionShoots(args.db, args.shoot.order_id);
  const usedConcepts = new Set(
    siblings.filter((item) => item.id !== args.shoot.id).map((item) => item.concept_family)
  );
  for (let salt = args.shoot.slot_index * 1000; salt < args.shoot.slot_index * 1000 + 512; salt += 1) {
    const portfolio = planDatingSceneBriefs({ ...args.recipeInput, salt });
    const brief = portfolio[args.shoot.slot_index - 1];
    if (!brief || usedConcepts.has(brief.conceptFamily) || brief.ideaKey === args.shoot.idea_key) {
      continue;
    }
    const { data, error } = await raw
      .from("dating_order_shoots")
      .update({
        idea_key: brief.ideaKey,
        planner_version: brief.plannerVersion,
        brief,
        concept_family: brief.conceptFamily,
        setting_family: brief.settingFamily,
        kind: brief.kind,
        light_family: brief.lightFamily,
        dating_signal: brief.datingSignal,
        title: null,
        accepted_output: null,
        accepted_attempt_id: null,
        status: "reserved",
        updated_at: new Date().toISOString(),
      })
      .eq("id", args.shoot.id)
      .select("*")
      .single();
    if (!error && data) return data as ProductionShootRow;
    if (error?.code === "23505") continue;
    throw new Error(`Failed to replace rejected scene: ${error?.message}`);
  }
  throw new Error(`Could not reserve a replacement for slot ${args.shoot.slot_index}.`);
}

export async function recentProductionScenes(
  db: AdminDb,
  userId: string,
  limit = 60
): Promise<RecentScene[]> {
  const raw = db as any;
  const { data: orders } = await raw
    .from("user_shoot_orders")
    .select("id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (!orders?.length) return [];
  const { data, error } = await raw
    .from("dating_order_shoots")
    .select("accepted_output")
    .in("order_id", orders.map((order: { id: string }) => order.id))
    .eq("status", "passed")
    .limit(limit);
  if (error) throw new Error(`Failed to load recent prompt scenes: ${error.message}`);
  return (data ?? []).flatMap((row: any) => {
    const parsed = promptLabOutputSchema.safeParse(row.accepted_output);
    return parsed.success ? [outputToRecentScene(parsed.data)] : [];
  });
}

export async function startProductionAttempt(
  db: AdminDb,
  shoot: ProductionShootRow
): Promise<ProductionAttemptRow> {
  const raw = db as any;
  const { data: last } = await raw
    .from("dating_prompt_attempts")
    .select("attempt_number")
    .eq("order_shoot_id", shoot.id)
    .order("attempt_number", { ascending: false })
    .limit(1)
    .maybeSingle();
  const attemptNumber = Number(last?.attempt_number ?? 0) + 1;
  const reference = selectPromptLabReference(shoot.brief.lightFamily);
  const { data, error } = await raw
    .from("dating_prompt_attempts")
    .insert({
      order_shoot_id: shoot.id,
      attempt_number: attemptNumber,
      status: "running",
      model: DATING_PROMPT_MODEL,
      thinking_level: DATING_PROMPT_THINKING_LEVEL,
      prompt_system_version: DATING_PROMPT_SYSTEM_VERSION,
      reference_shoot_id: reference.id,
      request_snapshot: { brief: shoot.brief },
      pricing_snapshot: getPromptLabPricing(),
    })
    .select("*")
    .single();
  if (error?.code === "23505") {
    const { data: concurrent } = await raw
      .from("dating_prompt_attempts")
      .select("*")
      .eq("order_shoot_id", shoot.id)
      .eq("attempt_number", attemptNumber)
      .single();
    if (concurrent) return concurrent as ProductionAttemptRow;
  }
  if (error || !data) throw new Error(`Failed to start prompt attempt: ${error?.message}`);
  await raw
    .from("dating_order_shoots")
    .update({ status: "generating", updated_at: new Date().toISOString() })
    .eq("id", shoot.id);
  return data as ProductionAttemptRow;
}

export async function ensureProductionAttempt(
  db: AdminDb,
  shoot: ProductionShootRow
): Promise<ProductionAttemptRow> {
  if (shoot.status === "generating") {
    const { data } = await (db as any)
      .from("dating_prompt_attempts")
      .select("*")
      .eq("order_shoot_id", shoot.id)
      .eq("status", "running")
      .order("attempt_number", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data) {
      const running = data as ProductionAttemptRow;
      const stale = Date.parse(running.created_at) < Date.now() - 10 * 60_000;
      if (!stale) return running;
      await failProductionAttempt({
        db,
        attempt: running,
        safeError: "Prompt worker stopped before it could persist a result; retrying.",
      });
    }
  }
  return startProductionAttempt(db, shoot);
}

export async function loadProductionAttempt(
  db: AdminDb,
  orderShootId: string,
  attemptNumber: number
): Promise<ProductionAttemptRow & { shoot: ProductionShootRow }> {
  const raw = db as any;
  const [{ data: attempt, error }, { data: shoot, error: shootError }] = await Promise.all([
    raw.from("dating_prompt_attempts").select("*")
      .eq("order_shoot_id", orderShootId).eq("attempt_number", attemptNumber).single(),
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
): Promise<RetryContext | undefined> {
  if (attemptNumber <= 1) return undefined;
  const { data } = await (db as any)
    .from("dating_prompt_attempts")
    .select("raw_output, validation_errors")
    .eq("order_shoot_id", shoot.id)
    .lt("attempt_number", attemptNumber)
    .order("attempt_number", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!data) return undefined;
  return {
    previousOutput: data.raw_output,
    validationErrors: data.validation_errors ?? [],
    feedback: {
      rating: null,
      decision: "revise",
      issueTags: [],
      notes: "Production validator requested a corrected version of the same reserved scene.",
      frameNotes: { close: "", medium: "", threeQuarter: "", expression: "" },
    },
  };
}

export async function finishProductionAttempt(args: {
  db: AdminDb;
  attempt: ProductionAttemptRow;
  generation: {
    rawOutput: unknown;
    output: unknown;
    validation: { passed: boolean; problems: string[]; sceneDensity: string[] };
    usage: { inputTokens: number; outputTokens: number; reasoningTokens: number; totalTokens: number };
    estimatedCostUsd: number;
    pricingSnapshot: unknown;
  };
  maxInvalidAttempts: number;
}): Promise<{ passed: boolean; replanning: boolean }> {
  const raw = args.db as any;
  const status = args.generation.validation.passed ? "passed" : "failed_validation";
  let parsed = null;
  let replanning = false;
  if (args.generation.validation.passed) {
    parsed = promptLabOutputSchema.parse(args.generation.output);
  } else {
    const ideaKey = args.attempt.request_snapshot.brief.ideaKey;
    const { data: attempts, error: attemptsError } = await raw
      .from("dating_prompt_attempts")
      .select("request_snapshot")
      .eq("order_shoot_id", args.attempt.order_shoot_id)
      .eq("status", "failed_validation");
    if (attemptsError) throw new Error(`Failed to audit invalid prompt attempts: ${attemptsError.message}`);
    const previousInvalidForIdea = (attempts ?? []).filter(
      (item: any) => item.request_snapshot?.brief?.ideaKey === ideaKey
    ).length;
    replanning = previousInvalidForIdea + 1 >= args.maxInvalidAttempts;
  }

  const { error } = await raw.rpc("complete_dating_prompt_attempt", {
    p_attempt_id: args.attempt.id,
    p_attempt_status: status,
    p_shoot_status: parsed ? "passed" : replanning ? "replanning" : "reserved",
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
    p_title: parsed?.scene.title ?? null,
  });
  if (error) throw new Error(`Failed to commit prompt attempt: ${error.message}`);
  return { passed: Boolean(parsed), replanning };
}

export async function failProductionAttempt(args: {
  db: AdminDb;
  attempt: ProductionAttemptRow;
  safeError: string;
}) {
  const raw = args.db as any;
  const { error } = await raw.rpc("complete_dating_prompt_attempt", {
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
}
