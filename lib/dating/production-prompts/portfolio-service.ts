import {
  classifyCreativeProviderError,
  embedDatingSceneMeanings,
  generatePortfolioCandidate,
  parsePortfolioTransport,
  validatePortfolioCandidate,
  type PortfolioGeneration,
} from "@/lib/dating/creative-director";
import { getDatingProductConfig } from "@/lib/dating/config";
import {
  mockCreativeEmbeddingCall,
  mockPortfolioModelCall,
} from "@/lib/dating/prompt-engine";
import {
  failPortfolioAttempt,
  finishPortfolioAttempt,
  loadPortfolioAttempt,
  recordPortfolioEmbeddingFailure,
  savePortfolioGeneration,
} from "./store";

type AdminDb = any;

export type PortfolioServiceResult = {
  passed: boolean;
  reservedCount: number;
  apiError: boolean;
  retryable: boolean;
  phase: "portfolio_generation" | "portfolio_embedding" | "portfolio_complete";
  safeMessage?: string;
};

function restoreGeneration(attempt: Awaited<ReturnType<typeof loadPortfolioAttempt>>): PortfolioGeneration {
  const parsed = parsePortfolioTransport(attempt.raw_output);
  const snapshot = attempt.request_snapshot;
  const history = [
    ...snapshot.currentOrder,
    ...snapshot.customerHistory,
    ...snapshot.globalHistory,
  ];
  const validation = parsed.success
    ? validatePortfolioCandidate({
        output: parsed.data,
        input: snapshot.input,
        candidateCount: snapshot.candidateCount,
        interestsStillNeeded: snapshot.interestsStillNeeded,
        history,
      })
    : {
        passed: false,
        problems: parsed.error.issues.map(
          (issue) => `${issue.path.join(".") || "response"}: ${issue.message}`
        ),
      };
  return {
    output: parsed.success ? parsed.data : null,
    rawOutput: attempt.raw_output,
    validation,
    usage: {
      inputTokens: attempt.input_tokens ?? 0,
      outputTokens: attempt.output_tokens ?? 0,
      reasoningTokens: attempt.reasoning_tokens ?? 0,
      totalTokens: attempt.total_tokens ?? 0,
    },
    estimatedCostUsd: Number(attempt.estimated_cost_usd ?? 0),
    pricingSnapshot: attempt.pricing_snapshot ?? {},
    interactionId: attempt.provider_interaction_id,
  };
}

/** One persisted portfolio attempt. Generation and embedding fail independently. */
export async function executePortfolioAttempt(args: {
  db: AdminDb;
  orderId: string;
  attemptNumber: number;
}): Promise<PortfolioServiceResult> {
  const attempt = await loadPortfolioAttempt(args.db, args.orderId, args.attemptNumber);
  if (attempt.status !== "running") {
    return {
      passed: attempt.status === "passed",
      reservedCount: 0,
      apiError: attempt.status === "api_error",
      retryable: attempt.error_retryable ?? false,
      phase: attempt.provider_phase === "portfolio_embedding"
        ? "portfolio_embedding"
        : "portfolio_complete",
      safeMessage: attempt.api_error ?? undefined,
    };
  }

  const snapshot = attempt.request_snapshot;
  const config = getDatingProductConfig();
  let generation: PortfolioGeneration;
  if (attempt.provider_phase === "portfolio_embedding" && attempt.raw_output) {
    generation = restoreGeneration(attempt);
  } else {
    try {
      generation = await generatePortfolioCandidate({
        input: snapshot.input,
        targetCount: snapshot.targetCount,
        candidateCount: snapshot.candidateCount,
        interestsStillNeeded: snapshot.interestsStillNeeded,
        currentOrder: snapshot.currentOrder,
        customerHistory: snapshot.customerHistory,
        globalHistory: snapshot.globalHistory,
        retryProblems: snapshot.retryProblems,
        modelCall: config.testMode === "mock"
          ? mockPortfolioModelCall(snapshot.input)
          : undefined,
      });
      await savePortfolioGeneration({ db: args.db, attempt, generation });
    } catch (error) {
      const failure = classifyCreativeProviderError(error);
      await failPortfolioAttempt({
        db: args.db,
        attempt,
        safeError: failure.diagnostic,
        retryable: failure.retryable,
        phase: "portfolio_generation",
        httpStatus: failure.status,
      });
      return {
        passed: false,
        reservedCount: 0,
        apiError: true,
        retryable: failure.retryable,
        phase: "portfolio_generation",
        safeMessage: failure.safeMessage,
      };
    }
  }

  if (!generation.validation.passed || !generation.output) {
    const result = await finishPortfolioAttempt({
      db: args.db,
      attempt,
      generation,
      embeddings: {},
      embeddingBillableCharacters: 0,
    });
    return {
      ...result,
      apiError: false,
      retryable: false,
      phase: "portfolio_complete",
    };
  }

  try {
    const embeddingResult = await embedDatingSceneMeanings(
      generation.output.shoots.map((shoot) => shoot.noveltyFingerprint),
      config.testMode === "mock" ? mockCreativeEmbeddingCall : undefined
    );
    const embeddings = Object.fromEntries(
      generation.output.shoots.map((shoot, index) => [
        shoot.candidateId,
        embeddingResult.vectors[index],
      ])
    );
    const result = await finishPortfolioAttempt({
      db: args.db,
      attempt,
      generation,
      embeddings,
      embeddingBillableCharacters: embeddingResult.billableCharacters,
    });
    return {
      ...result,
      apiError: false,
      retryable: false,
      phase: "portfolio_complete",
    };
  } catch (error) {
    const failure = classifyCreativeProviderError(error);
    await recordPortfolioEmbeddingFailure({
      db: args.db,
      attempt,
      safeError: failure.diagnostic,
      retryable: failure.retryable,
      httpStatus: failure.status,
    });
    return {
      passed: false,
      reservedCount: 0,
      apiError: true,
      retryable: failure.retryable,
      phase: "portfolio_embedding",
      safeMessage: failure.safeMessage,
    };
  }
}
