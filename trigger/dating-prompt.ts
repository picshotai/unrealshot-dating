import { AbortTaskRunError, logger, task } from "@trigger.dev/sdk";

import { getServiceDb } from "@/lib/dating/db";
import { getDatingProductConfig } from "@/lib/dating/config";
import {
  generateProductionPromptCandidate,
  mockProductionModelCall,
} from "@/lib/dating/prompt-engine";
import { classifyCreativeProviderError } from "@/lib/dating/creative-director";
import {
  failProductionAttempt,
  finishProductionAttempt,
  loadProductionAttempt,
  previousAttemptContext,
} from "@/lib/dating/production-prompts/store";
import { datingGeminiQueue } from "@/trigger/queues";

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
  retryable: boolean;
};

/** Exactly one Gemini call for one persisted attempt. */
export const generateDatingShootPrompts = task({
  id: "generate-dating-shoot-prompts",
  retry: { maxAttempts: 1 },
  queue: datingGeminiQueue,
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
      if (attempt.status === "api_error") {
        const message = attempt.api_error ?? "Gemini prompt generation failed.";
        if (attempt.error_retryable === false) throw new AbortTaskRunError(message);
        throw new Error(message);
      }
      return {
        orderShootId: payload.orderShootId,
        attemptNumber: payload.attemptNumber,
        passed: attempt.status === "passed",
        replanning: false,
        apiError: false,
        retryable: attempt.error_retryable ?? true,
      };
    }

    const retry = await previousAttemptContext(
      db,
      attempt.shoot,
      payload.attemptNumber
    );
    let generation;
    try {
      const config = getDatingProductConfig();
      const testMode = attempt.request_snapshot.testMode ?? config.testMode;
      generation = await generateProductionPromptCandidate({
        brief: attempt.shoot.brief,
        input: attempt.request_snapshot.input,
        retry,
        modelCall: testMode === "mock"
          ? mockProductionModelCall(attempt.shoot.brief)
          : undefined,
      });
    } catch (error) {
      const failure = classifyCreativeProviderError(error);
      await failProductionAttempt({
        db,
        attempt,
        safeError: failure.diagnostic,
        retryable: failure.retryable,
        phase: "shoot_generation",
        httpStatus: failure.status,
      });
      logger.error("Production dating prompt provider error", {
        orderShootId: payload.orderShootId,
        attemptNumber: payload.attemptNumber,
        ...failure,
      });
      if (!failure.retryable) throw new AbortTaskRunError(failure.safeMessage);
      throw new Error(failure.safeMessage);
    }

    // Persistence failures are task failures, not provider failures. Keeping
    // that distinction avoids presenting a database incident as a Gemini
    // outage and preserves the running attempt for reconciliation.
    const result = await finishProductionAttempt({
      db,
      attempt,
      generation,
    });
    logger.info("Production dating prompt attempt completed", {
      orderShootId: payload.orderShootId,
      attemptNumber: payload.attemptNumber,
      ...result,
    });
    return { ...payload, ...result, apiError: false, retryable: false };
  },
});
