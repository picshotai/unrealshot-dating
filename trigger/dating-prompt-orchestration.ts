import { idempotencyKeys, logger } from "@trigger.dev/sdk";

import { getDatingProductConfig } from "@/lib/dating/config";
import {
  customerCreativeInputSchema,
  datingShootIntentSchema,
  isCreativeProviderBillingDepleted,
  type CustomerCreativeInput,
} from "@/lib/dating/creative-director";
import { executePortfolioAttempt } from "@/lib/dating/production-prompts/portfolio-service";
import {
  nextNoProgressCount,
  plannerCallBudget,
  planningHasStalled,
} from "@/lib/dating/production-prompts/planning-policy";
import {
  ensureProductionAttempt,
  loadProductionShoots,
  representedInterestsOfBrief,
  startPortfolioAttempt,
  type PortfolioReservationReport,
  type ProductionShootRow,
} from "@/lib/dating/production-prompts/store";
import type { ExcludableTag, InterestId } from "@/lib/dating/types";
import { generateDatingShootPrompts } from "@/trigger/dating-prompt";

type AdminDb = any;

export type DynamicPipelineOrder = {
  id: string;
  pipeline_mode: "authored" | "dynamic";
  pipeline_stage: string;
  shoots_target: number;
  creative_input: {
    interests?: InterestId[];
    excludeTags?: ExcludableTag[];
  } | null;
};

export class DynamicPromptPipelineFailure extends Error {
  constructor(
    readonly phase: string,
    readonly retryable: boolean,
    readonly safeMessage: string,
    readonly kind: "provider" | "internal",
    readonly failureCode?: string
  ) {
    super(safeMessage);
    this.name = "DynamicPromptPipelineFailure";
  }
}

function retainedShoots(shoots: readonly ProductionShootRow[]) {
  return shoots.filter((shoot) => shoot.status !== "replanning");
}

function missingShootCount(shoots: readonly ProductionShootRow[], target: number) {
  return Math.max(0, target - retainedShoots(shoots).length);
}

async function moveHistoricalBriefsToReplanning(db: AdminDb, shoots: ProductionShootRow[]) {
  const unfinished = shoots.filter(
    (shoot) => shoot.status !== "passed" && !datingShootIntentSchema.safeParse(shoot.brief).success
  );
  if (unfinished.length === 0) return false;
  const ids = unfinished.map((shoot) => shoot.id);
  await db.from("dating_prompt_attempts").update({
    status: "api_error",
    api_error: "Unfinished historical prompt moved to the current writer.",
    updated_at: new Date().toISOString(),
  }).in("order_shoot_id", ids).eq("status", "running");
  await db.from("dating_order_shoots").update({
    status: "replanning",
    updated_at: new Date().toISOString(),
  }).in("id", ids);
  return true;
}

async function preserveInterestCoverage(args: {
  db: AdminDb;
  shoots: ProductionShootRow[];
  input: CustomerCreativeInput;
}) {
  const represented = new Set(
    args.shoots.flatMap((shoot) => representedInterestsOfBrief(shoot.brief))
  );
  const uncovered = args.input.interests.filter((interest) => !represented.has(interest));
  if (uncovered.length === 0) return false;

  const counts = new Map<string, number>();
  for (const shoot of args.shoots) {
    for (const interest of representedInterestsOfBrief(shoot.brief)) {
      counts.set(interest, (counts.get(interest) ?? 0) + 1);
    }
  }
  const replaceable = args.shoots.filter((shoot) =>
    shoot.status === "reserved" &&
    (representedInterestsOfBrief(shoot.brief).length === 0 ||
      representedInterestsOfBrief(shoot.brief).every(
        (interest) => (counts.get(interest) ?? 0) > 1
      ))
  );
  if (replaceable.length < uncovered.length) {
    throw new DynamicPromptPipelineFailure(
      "idea_reservation",
      false,
      "The shoot plan could not preserve the selected parts of your life.",
      "internal",
      "internal_planning_stalled"
    );
  }
  await args.db.from("dating_order_shoots").update({
    status: "replanning",
    updated_at: new Date().toISOString(),
  }).in("id", replaceable.slice(0, uncovered.length).map((shoot) => shoot.id));
  return true;
}

function reportSummary(report: PortfolioReservationReport | undefined) {
  return {
    accepted: report?.acceptedCount ?? 0,
    rejected: report?.rejected.reduce<Record<string, number>>((counts, item) => {
      counts[item.reason] = (counts[item.reason] ?? 0) + 1;
      return counts;
    }, {}) ?? {},
    semanticWarnings: report?.semanticWarnings.length ?? 0,
  };
}

async function reserveCompletePortfolio(args: {
  db: AdminDb;
  order: DynamicPipelineOrder;
  userId: string;
  input: CustomerCreativeInput;
  budget: { remaining: number; consecutiveNoProgress: number };
}) {
  while (true) {
    let shoots = await loadProductionShoots(args.db, args.order.id);
    if (await moveHistoricalBriefsToReplanning(args.db, shoots)) {
      shoots = await loadProductionShoots(args.db, args.order.id);
    }

    if (missingShootCount(shoots, args.order.shoots_target) === 0) {
      if (await preserveInterestCoverage({ db: args.db, shoots, input: args.input })) continue;
      return shoots;
    }
    if (planningHasStalled(args.budget.remaining, args.budget.consecutiveNoProgress)) {
      throw new DynamicPromptPipelineFailure(
        "idea_reservation",
        false,
        "The shoot planner could not complete a sufficiently distinct portfolio.",
        "internal",
        "internal_planning_stalled"
      );
    }

    const planningAttempt = await startPortfolioAttempt({
      db: args.db,
      orderId: args.order.id,
      userId: args.userId,
      targetCount: args.order.shoots_target,
      input: args.input,
    });
    if (!planningAttempt) continue;
    args.budget.remaining -= 1;
    const result = await executePortfolioAttempt({
      db: args.db,
      orderId: args.order.id,
      attemptNumber: planningAttempt.attempt_number,
    });
    if (result.apiError) {
      throw new DynamicPromptPipelineFailure(
        result.phase,
        result.retryable,
        result.safeMessage ?? "Gemini portfolio planning failed.",
        "provider",
        result.failureCode
      );
    }
    args.budget.consecutiveNoProgress = nextNoProgressCount(
      args.budget.consecutiveNoProgress,
      result.reservedCount
    );
    logger.info("Dating portfolio reservation completed", {
      orderId: args.order.id,
      attemptNumber: planningAttempt.attempt_number,
      budgetRemaining: args.budget.remaining,
      consecutiveNoProgress: args.budget.consecutiveNoProgress,
      ...reportSummary(result.reservationReport),
    });
  }
}

async function writeReservedPortfolio(args: {
  db: AdminDb;
  order: DynamicPipelineOrder;
  userId: string;
  input: CustomerCreativeInput;
}) {
  const maxRounds = getDatingProductConfig().promptAttemptsPerIdea;
  for (let round = 0; round < maxRounds; round += 1) {
    const shoots = await loadProductionShoots(args.db, args.order.id);
    if (shoots.some((shoot) => shoot.status === "replanning")) return false;
    if (shoots.every((shoot) => shoot.status === "passed")) return true;

    const runnable = shoots.filter(
      (shoot) => shoot.status === "reserved" || shoot.status === "generating"
    );
    if (runnable.length === 0) {
      throw new DynamicPromptPipelineFailure(
        "prompt_validation",
        false,
        "The saved shoot ideas could not be completed into valid prompts.",
        "internal",
        "internal_prompt_validation"
      );
    }
    const attempts = await Promise.all(
      runnable.map((shoot) => ensureProductionAttempt(args.db, shoot, args.input))
    );
    const items = await Promise.all(
      attempts.map(async (attempt) => ({
        payload: {
          userId: args.userId,
          orderShootId: attempt.order_shoot_id,
          attemptNumber: attempt.attempt_number,
        },
        options: {
          idempotencyKey: await idempotencyKeys.create(
            `dating-prompt:${attempt.id}`,
            { scope: "global" }
          ),
          idempotencyKeyTTL: "30d" as const,
        },
      }))
    );
    const results = await generateDatingShootPrompts.batchTriggerAndWait(items);
    const failedAttemptIds = results.runs.flatMap((run: any, index) =>
      run.ok ? [] : [attempts[index].id]
    );
    if (failedAttemptIds.length === 0) continue;

    const { data: failedRows, error } = await args.db
      .from("dating_prompt_attempts")
      .select("id, status, api_error, error_retryable, provider_phase")
      .in("id", failedAttemptIds);
    if (error) throw new Error(`Prompt failure audit failed: ${error.message}`);
    const providerRows = (failedRows ?? []).filter((row: any) => row.status === "api_error");
    if (providerRows.length !== failedAttemptIds.length) {
      throw new Error(`Prompt persistence failed for order ${args.order.id}.`);
    }
    const billingDepleted = providerRows.find((row: any) =>
      isCreativeProviderBillingDepleted(String(row.api_error ?? ""))
    );
    const permanent = providerRows.find((row: any) => row.error_retryable === false);
    const representative = billingDepleted ?? permanent ?? providerRows[0];
    logger.error("Dating prompt provider phase failed", {
      orderId: args.order.id,
      phase: representative?.provider_phase,
      diagnostic: representative?.api_error,
      retryable: !permanent,
    });
    throw new DynamicPromptPipelineFailure(
      representative?.provider_phase ?? "shoot_generation",
      !(billingDepleted || permanent),
      billingDepleted
        ? "The shoot service is temporarily unavailable."
        : "Gemini could not complete shoot prompt generation.",
      "provider",
      billingDepleted ? "provider_billing_depleted" : undefined
    );
  }

  const shoots = await loadProductionShoots(args.db, args.order.id);
  if (shoots.some((shoot) => shoot.status === "replanning")) return false;
  if (shoots.every((shoot) => shoot.status === "passed")) return true;
  throw new DynamicPromptPipelineFailure(
    "prompt_validation",
    false,
    "Prompt validation could not complete the saved shoot ideas.",
    "internal",
    "internal_prompt_validation"
  );
}

export async function prepareDynamicOrder(args: {
  db: AdminDb;
  order: DynamicPipelineOrder;
  userId: string;
}): Promise<boolean> {
  const creative = args.order.creative_input ?? {};
  const input = customerCreativeInputSchema.parse({
    interests: creative.interests ?? [],
    exclusions: creative.excludeTags ?? [],
  });
  let shoots = await loadProductionShoots(args.db, args.order.id);
  if (await moveHistoricalBriefsToReplanning(args.db, shoots)) {
    shoots = await loadProductionShoots(args.db, args.order.id);
  }
  const missingAtStart = missingShootCount(shoots, args.order.shoots_target);
  const budget = {
    remaining: plannerCallBudget(Math.max(1, missingAtStart)),
    consecutiveNoProgress: 0,
  };

  while (true) {
    await reserveCompletePortfolio({ ...args, input, budget });
    await args.db.from("user_shoot_orders").update({
      pipeline_stage: "writing_prompts",
      updated_at: new Date().toISOString(),
    }).eq("id", args.order.id);
    if (await writeReservedPortfolio({ ...args, input })) {
      const { error } = await args.db.rpc("materialize_dynamic_order_photos", {
        p_order_id: args.order.id,
      });
      if (error) throw new Error(`Failed to allocate dynamic photos: ${error.message}`);
      return true;
    }
  }
}
