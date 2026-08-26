import { idempotencyKeys, logger } from "@trigger.dev/sdk";

import { getDatingProductConfig } from "@/lib/dating/config";
import {
  customerCreativeInputSchema,
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
import { createLocalMockShoot } from "@/lib/dating/production-prompts/mock-manifest";
import { planDatingRenderModes } from "@/lib/dating/production-prompts/render-plan";
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
  prompt_system_version: string | null;
  test_mode_snapshot: "off" | "sample" | "mock";
  real_shoots_target: number;
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

  throw new DynamicPromptPipelineFailure(
    "idea_reservation",
    false,
    "The shoot plan did not cover every selected part of your life.",
    "internal",
    "internal_planning_stalled"
  );
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
    const shoots = await loadProductionShoots(args.db, args.order.id);

    if (missingShootCount(shoots, args.order.shoots_target) === 0) {
      await preserveInterestCoverage({ db: args.db, shoots, input: args.input });
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
      testMode: args.order.test_mode_snapshot,
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

async function configureShootModes(args: {
  db: AdminDb;
  order: DynamicPipelineOrder;
  shoots: ProductionShootRow[];
  input: CustomerCreativeInput;
}) {
  const { realIds, mockIds: mockIdSet } = planDatingRenderModes({
    candidates: args.shoots.map((shoot) => ({
      shootId: shoot.id,
      representedInterests: representedInterestsOfBrief(shoot.brief),
    })),
    selectedInterests: args.input.interests,
    testMode: args.order.test_mode_snapshot,
    realShootsTarget: args.order.real_shoots_target,
    seed: `${args.order.id}:sample-v3`,
  });
  const mockIds = [...mockIdSet];
  if (realIds.size > 0) {
    const { error } = await args.db.from("dating_order_shoots").update({
      render_mode: "real", prompt_source: "gemini", contract_version: "dating-capture-v3",
      updated_at: new Date().toISOString(),
    }).in("id", [...realIds]);
    if (error) throw new Error(`Failed to persist real sample shoots: ${error.message}`);
  }
  if (mockIds.length > 0) {
    const { error } = await args.db.from("dating_order_shoots").update({
      render_mode: "mock", prompt_source: "local_mock", contract_version: "dating-capture-v3",
      updated_at: new Date().toISOString(),
    }).in("id", mockIds);
    if (error) throw new Error(`Failed to persist mock sample shoots: ${error.message}`);
  }
  return { realIds, mockIds };
}

async function completeLocalMockShoots(db: AdminDb, shoots: ProductionShootRow[]) {
  for (const shoot of shoots.filter((item) => item.render_mode === "mock" && item.status !== "passed")) {
    const acceptedOutput = createLocalMockShoot(shoot.brief);
    const { error } = await db.from("dating_order_shoots").update({
      status: "passed",
      title: shoot.brief.title,
      accepted_output: acceptedOutput,
      prompt_source: "local_mock",
      updated_at: new Date().toISOString(),
    }).eq("id", shoot.id).in("status", ["reserved", "generating"]);
    if (error) throw new Error(`Failed to complete local sample manifest: ${error.message}`);
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
      (shoot) => shoot.render_mode === "real" &&
        (shoot.status === "reserved" || shoot.status === "generating")
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
      runnable.map((shoot) => ensureProductionAttempt(
        args.db,
        shoot,
        args.input,
        args.order.test_mode_snapshot
      ))
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
  if (args.order.prompt_system_version !== "dating-shoot-writer-v7") {
    throw new DynamicPromptPipelineFailure(
      "legacy_contract",
      false,
      "This earlier shoot cannot resume after the prompt-system upgrade.",
      "internal",
      "legacy_prompt_contract"
    );
  }
  const creative = args.order.creative_input ?? {};
  const input = customerCreativeInputSchema.parse({
    interests: creative.interests ?? [],
    exclusions: creative.excludeTags ?? [],
  });
  let shoots = await loadProductionShoots(args.db, args.order.id);
  const missingAtStart = missingShootCount(shoots, args.order.shoots_target);
  const budget = {
    remaining: plannerCallBudget(Math.max(1, missingAtStart)),
    consecutiveNoProgress: 0,
  };

  while (true) {
    shoots = await reserveCompletePortfolio({ ...args, input, budget });
    await configureShootModes({ db: args.db, order: args.order, shoots, input });
    shoots = await loadProductionShoots(args.db, args.order.id);
    await completeLocalMockShoots(args.db, shoots);
    await args.db.from("user_shoot_orders").update({
      pipeline_stage: "writing_prompts",
      updated_at: new Date().toISOString(),
    }).eq("id", args.order.id);
    if (await writeReservedPortfolio({ ...args, input })) {
      const { error } = await args.db.rpc("materialize_dynamic_order_photos_v3", {
        p_order_id: args.order.id,
      });
      if (error) throw new Error(`Failed to allocate dynamic photos: ${error.message}`);
      return true;
    }
  }
}
