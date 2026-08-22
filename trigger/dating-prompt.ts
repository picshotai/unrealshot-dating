import { logger, task } from "@trigger.dev/sdk";

import { getServiceDb } from "@/lib/dating/db";
import { getDatingProductConfig } from "@/lib/dating/config";
import {
  generateProductionPromptCandidate,
  mockProductionModelCall,
} from "@/lib/dating/prompt-engine";
import { safePromptLabApiError } from "@/lib/dating/prompt-lab/generate";
import {
  failProductionAttempt,
  finishProductionAttempt,
  loadProductionAttempt,
  previousAttemptContext,
  recentProductionScenes,
} from "@/lib/dating/production-prompts/store";

export type GenerateDatingPromptPayload = {
  userId: string;
  orderShootId: string;
  attemptNumber: number;
};

export type GenerateDatingPromptResult = {
  orderShootId: string;
  attemptNumber: number;
  passed: boolean;
  replanning: boolean;
  apiError: boolean;
};

/** Exactly one Gemini call for one persisted attempt. */
export const generateDatingShootPrompts = task({
  id: "generate-dating-shoot-prompts",
  retry: { maxAttempts: 1 },
  queue: {
    concurrencyLimit: getDatingProductConfig().geminiConcurrency,
  },
  maxDuration: 300,
  run: async (
    payload: GenerateDatingPromptPayload
  ): Promise<GenerateDatingPromptResult> => {
    const db = getServiceDb() as any;
    const attempt = await loadProductionAttempt(
      db,
      payload.orderShootId,
      payload.attemptNumber
    );
    if (attempt.status !== "running") {
      return {
        orderShootId: payload.orderShootId,
        attemptNumber: payload.attemptNumber,
        passed: attempt.status === "passed",
        replanning: false,
        apiError: attempt.status === "api_error",
      };
    }

    const [recentScenes, retry] = await Promise.all([
      recentProductionScenes(db, payload.userId),
      previousAttemptContext(db, attempt.shoot, payload.attemptNumber),
    ]);
    let generation;
    try {
      const config = getDatingProductConfig();
      generation = await generateProductionPromptCandidate({
        brief: attempt.shoot.brief,
        recentScenes,
        retry,
        modelCall: config.testMode === "mock"
          ? mockProductionModelCall(attempt.shoot.brief)
          : undefined,
      });
    } catch (error) {
      const safeError = safePromptLabApiError(error);
      await failProductionAttempt({ db, attempt, safeError });
      logger.error("Production dating prompt provider error", {
        orderShootId: payload.orderShootId,
        attemptNumber: payload.attemptNumber,
        safeError,
      });
      return {
        ...payload,
        passed: false,
        replanning: false,
        apiError: true,
      };
    }

    // Persistence failures are task failures, not provider failures. Keeping
    // that distinction avoids presenting a database incident as a Gemini
    // outage and preserves the running attempt for reconciliation.
    const result = await finishProductionAttempt({
      db,
      attempt,
      generation,
      maxInvalidAttempts: getDatingProductConfig().promptAttemptsPerIdea,
    });
    logger.info("Production dating prompt attempt completed", {
      orderShootId: payload.orderShootId,
      attemptNumber: payload.attemptNumber,
      ...result,
    });
    return { ...payload, ...result, apiError: false };
  },
});
