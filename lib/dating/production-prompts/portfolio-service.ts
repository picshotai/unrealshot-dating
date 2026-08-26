import {
  classifyCreativeProviderError,
  generatePortfolioCandidate,
  type PortfolioGeneration,
} from "@/lib/dating/creative-director";
import { getDatingProductConfig } from "@/lib/dating/config";
import { mockPortfolioModelCall } from "@/lib/dating/prompt-engine";
import {
  failPortfolioAttempt,
  finishPortfolioAttempt,
  loadPortfolioAttempt,
} from "./store";

type AdminDb = any;

export type PortfolioServiceResult = {
  passed: boolean;
  reservedCount: number;
  reservationReport?: import("./store").PortfolioReservationReport;
  apiError: boolean;
  retryable: boolean;
  phase: "portfolio_generation" | "portfolio_complete";
  safeMessage?: string;
  failureCode?: "provider_billing_depleted";
};

/** One provider call and one exact-reservation transaction; no embedding phase. */
export async function executePortfolioAttempt(args: {
  db: AdminDb;
  orderId: string;
  attemptNumber: number;
}): Promise<PortfolioServiceResult> {
  const attempt = await loadPortfolioAttempt(args.db, args.orderId, args.attemptNumber);
  if (attempt.status !== "running") {
    return {
      passed: attempt.status === "passed",
      reservedCount: Number((attempt as any).reserved_count ?? 0),
      reservationReport: attempt.reservation_report ?? undefined,
      apiError: attempt.status === "api_error",
      retryable: attempt.error_retryable ?? false,
      phase: "portfolio_complete",
      safeMessage: attempt.api_error ?? undefined,
    };
  }

  const snapshot = attempt.request_snapshot;
  const testMode = snapshot.testMode ?? getDatingProductConfig().testMode;
  let generation: PortfolioGeneration;
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
      modelCall: testMode === "mock" ? mockPortfolioModelCall(snapshot.input) : undefined,
    });
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
      failureCode: failure.failureCode,
    };
  }

  const result = await finishPortfolioAttempt({ db: args.db, attempt, generation });
  return {
    ...result,
    apiError: false,
    retryable: false,
    phase: "portfolio_complete",
  };
}
