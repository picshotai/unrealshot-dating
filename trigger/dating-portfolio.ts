import { logger, task } from "@trigger.dev/sdk";

import { getDatingProductConfig } from "@/lib/dating/config";
import {
  embedDatingSceneMeanings,
  generatePortfolioCandidate,
  safeCreativeProviderError,
} from "@/lib/dating/creative-director";
import { getServiceDb } from "@/lib/dating/db";
import {
  mockCreativeEmbeddingCall,
  mockPortfolioModelCall,
} from "@/lib/dating/prompt-engine";
import {
  failPortfolioAttempt,
  finishPortfolioAttempt,
  loadPortfolioAttempt,
} from "@/lib/dating/production-prompts/store";
import { datingGeminiQueue } from "@/trigger/queues";

export type GenerateDatingPortfolioPayload = {
  orderId: string;
  attemptNumber: number;
};

export const generateDatingPortfolio = task({
  id: "generate-dating-portfolio",
  retry: { maxAttempts: 1 },
  queue: datingGeminiQueue,
  maxDuration: 300,
  run: async (payload: GenerateDatingPortfolioPayload) => {
    const db = getServiceDb() as any;
    const attempt = await loadPortfolioAttempt(db, payload.orderId, payload.attemptNumber);
    if (attempt.status !== "running") {
      return {
        ...payload,
        passed: attempt.status === "passed",
        reservedCount: 0,
        apiError: attempt.status === "api_error",
      };
    }
    const snapshot = attempt.request_snapshot;
    let generation;
    let embeddings: Record<string, number[] | undefined>;
    let embeddingBillableCharacters: number;
    try {
      const config = getDatingProductConfig();
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
      const embeddingResult = generation.validation.passed && generation.output
        ? await embedDatingSceneMeanings(
            generation.output.shoots.map((shoot) => shoot.noveltyFingerprint),
            config.testMode === "mock" ? mockCreativeEmbeddingCall : undefined
          )
        : { vectors: [], billableCharacters: 0 };
      embeddings = Object.fromEntries(
        (generation.output?.shoots ?? []).map((shoot, index) => [
          shoot.candidateId,
          embeddingResult.vectors[index],
        ])
      );
      embeddingBillableCharacters = embeddingResult.billableCharacters;
    } catch (error) {
      const safeError = safeCreativeProviderError(error);
      await failPortfolioAttempt({ db, attempt, safeError });
      logger.error("Dating portfolio provider error", { ...payload, safeError });
      return { ...payload, passed: false, reservedCount: 0, apiError: true };
    }

    // Database failures are task failures, not Gemini failures. Leave the
    // running attempt recoverable so reconciliation can audit and resume it.
    const result = await finishPortfolioAttempt({
      db,
      attempt,
      generation,
      embeddings,
      embeddingBillableCharacters,
    });
    logger.info("Dating portfolio planning attempt completed", { ...payload, ...result });
    return { ...payload, ...result, apiError: false };
  },
});
