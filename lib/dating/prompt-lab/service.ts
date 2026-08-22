import { getPromptLabPricing } from "./cost";
import { generatePromptLabCandidate, safePromptLabApiError, type PromptLabModelCall } from "./generate";
import { planPromptLabScene } from "./planner";
import type { RetryContext } from "./prompt";
import { outputToRecentScene } from "./prompt";
import { selectPromptLabReference } from "./references";
import type { PromptLabRepository, PromptLabRun } from "./run-types";
import {
  EMPTY_FEEDBACK,
  PROMPT_LAB_MODEL,
  PROMPT_LAB_THINKING_LEVEL,
  PROMPT_SYSTEM_VERSION,
  promptLabOutputSchema,
  type PromptLabInput,
} from "./schemas";

export class PromptLabServiceError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
  }
}

export async function executePromptLabGeneration(args: {
  userId: string;
  input: PromptLabInput;
  repository: PromptLabRepository;
  modelCall?: PromptLabModelCall;
}): Promise<{ run: PromptLabRun; reused: boolean }> {
  const { userId, input, repository } = args;
  const existing = await repository.findByRequest(userId, input.clientRequestId);
  if (existing) return { run: existing, reused: true };

  const parent = input.parentRunId
    ? await repository.findById(userId, input.parentRunId)
    : null;
  if (input.parentRunId && !parent) {
    throw new PromptLabServiceError("The revision parent was not found.", 404);
  }

  const recentScenes = await repository.recentScenes(userId, 30);
  const plan = planPromptLabScene(input, recentScenes);
  const reference = selectPromptLabReference(plan.light);
  const pricingSnapshot = getPromptLabPricing();
  const started = await repository.start({
    userId,
    clientRequestId: input.clientRequestId,
    parentRunId: input.parentRunId ?? null,
    status: "running",
    model: PROMPT_LAB_MODEL,
    thinkingLevel: PROMPT_LAB_THINKING_LEVEL,
    promptSystemVersion: PROMPT_SYSTEM_VERSION,
    referenceShootId: reference.id,
    referenceEvidence: reference.evidence,
    input: { request: input, plan },
    pricingSnapshot,
    feedback: EMPTY_FEEDBACK,
  });
  if (!started.inserted) return { run: started.run, reused: true };

  const retry: RetryContext | undefined = parent
    ? {
        previousOutput: parent.output,
        validationErrors: parent.validationErrors,
        feedback: parent.feedback,
      }
    : undefined;

  try {
    const generation = await generatePromptLabCandidate({
      input,
      plan,
      reference,
      recentScenes,
      retry,
      modelCall: args.modelCall,
    });
    const run = await repository.finish(userId, started.run.id, {
      status: generation.validation.passed ? "passed" : "failed_validation",
      output: generation.rawOutput,
      validationErrors: generation.validation.problems,
      sceneDensity: generation.validation.sceneDensity,
      usage: generation.usage,
      estimatedCostUsd: generation.estimatedCostUsd,
      pricingSnapshot: generation.pricingSnapshot,
      apiError: null,
    });
    return { run, reused: false };
  } catch (error) {
    console.error("prompt-lab Gemini request failed", error);
    const run = await repository.finish(userId, started.run.id, {
      status: "api_error",
      output: null,
      validationErrors: [],
      sceneDensity: [],
      usage: { inputTokens: 0, outputTokens: 0, reasoningTokens: 0, totalTokens: 0 },
      estimatedCostUsd: 0,
      pricingSnapshot,
      apiError: safePromptLabApiError(error),
    });
    return { run, reused: false };
  }
}

export function recentSceneFromRun(run: PromptLabRun) {
  const parsed = promptLabOutputSchema.safeParse(run.output);
  return parsed.success ? outputToRecentScene(parsed.data) : null;
}
