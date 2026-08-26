import {
  DATING_CREATIVE_MODEL,
  PORTFOLIO_MAX_OUTPUT_TOKENS,
  SHOOT_MAX_OUTPUT_TOKENS,
  generatePortfolioCandidate,
  generateShootCandidate,
  type CustomerCreativeInput,
} from "../lib/dating/creative-director";
import { mockPortfolioModelCall } from "../lib/dating/prompt-engine";

function safeProviderError(error: unknown) {
  const record = error && typeof error === "object"
    ? error as Record<string, any>
    : {};
  const response = record.response && typeof record.response === "object"
    ? record.response as Record<string, any>
    : {};
  return {
    name: error instanceof Error ? error.name : typeof error,
    message: error instanceof Error ? error.message : String(error),
    status: record.status ?? record.statusCode ?? response.status ?? null,
    code: record.code ?? record.error?.code ?? null,
    providerBody: response.data ?? record.body ?? record.error ?? null,
    cause: record.cause instanceof Error
      ? { name: record.cause.name, message: record.cause.message }
      : record.cause ?? null,
  };
}

async function checkPlanner() {
  const input: CustomerCreativeInput = {
    interests: ["gym", "coffee", "dining"],
    exclusions: [],
  };
  const generation = await generatePortfolioCandidate({
    input,
    targetCount: 15,
    candidateCount: 15,
    interestsStillNeeded: input.interests,
    currentOrder: [],
    customerHistory: [],
    globalHistory: [],
  });
  console.log("Production planner result", {
    model: DATING_CREATIVE_MODEL,
    thinkingLevel: "low",
    maxOutputTokens: PORTFOLIO_MAX_OUTPUT_TOKENS,
    providerAccepted: true,
    mechanicallyValid: generation.validation.passed,
    interactionId: generation.interactionId,
    usage: generation.usage,
    candidateCount: generation.output?.shoots.length ?? 0,
    titles: generation.output?.shoots.map((shoot) => shoot.title) ?? [],
    problems: generation.validation.problems,
  });
  if (!generation.validation.passed) process.exitCode = 2;
}

async function checkWriter() {
  const input: CustomerCreativeInput = {
    interests: ["gym"],
    exclusions: [],
  };
  const mockPortfolio = await generatePortfolioCandidate({
    input,
    targetCount: 1,
    candidateCount: 1,
    interestsStillNeeded: input.interests,
    currentOrder: [],
    customerHistory: [],
    globalHistory: [],
    modelCall: mockPortfolioModelCall(input),
  });
  if (!mockPortfolio.output) throw new Error("Mock planner did not produce a writer brief.");
  const generation = await generateShootCandidate({
    brief: mockPortfolio.output.shoots[0],
    input,
  });
  console.log("Production writer result", {
    model: DATING_CREATIVE_MODEL,
    thinkingLevel: "low",
    maxOutputTokens: SHOOT_MAX_OUTPUT_TOKENS,
    providerAccepted: true,
    mechanicallyValid: generation.validation.passed,
    interactionId: generation.interactionId,
    usage: generation.usage,
    title: generation.output?.title ?? null,
    frameCount: generation.output?.frames.length ?? 0,
    problems: generation.validation.problems,
  });
  if (!generation.validation.passed) process.exitCode = 2;
}

async function main() {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured.");
  if (process.argv.includes("--writer")) await checkWriter();
  else await checkPlanner();
}

main().catch((error) => {
  console.error("Gemini production diagnostic failed", safeProviderError(error));
  process.exitCode = 1;
});
