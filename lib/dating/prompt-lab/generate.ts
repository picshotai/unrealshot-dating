import { GoogleGenAI, ThinkingLevel } from "@google/genai";

import { estimatePromptLabCost, getPromptLabPricing, type PromptLabUsage } from "./cost";
import { buildPromptLabRequest, type RetryContext } from "./prompt";
import type { PromptLabPlan } from "./planner";
import type { PromptLabReference } from "./references";
import {
  GEMINI_OUTPUT_JSON_SCHEMA,
  PROMPT_LAB_MODEL,
  promptLabOutputSchema,
  type PromptLabInput,
  type PromptLabOutput,
  type RecentScene,
} from "./schemas";
import { DATING_SCENE_SYSTEM_INSTRUCTION } from "./system-instruction";
import { validatePromptLabOutput, type PromptLabValidation } from "./validate";
import type { DatingSceneBrief } from "@/lib/dating/scene-recipes/types";

export type ModelResponse = {
  text: string;
  usage: PromptLabUsage;
};

export type PromptLabModelCall = (request: {
  model: typeof PROMPT_LAB_MODEL;
  contents: string;
  systemInstruction: string;
  responseJsonSchema: unknown;
}) => Promise<ModelResponse>;

export type PromptLabGeneration = {
  output: PromptLabOutput | null;
  rawOutput: unknown;
  validation: PromptLabValidation;
  usage: PromptLabUsage;
  estimatedCostUsd: number;
  pricingSnapshot: ReturnType<typeof getPromptLabPricing>;
};

function emptyUsage(): PromptLabUsage {
  return { inputTokens: 0, outputTokens: 0, reasoningTokens: 0, totalTokens: 0 };
}

async function callGemini(request: Parameters<PromptLabModelCall>[0]): Promise<ModelResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");

  const client = new GoogleGenAI({ apiKey });
  const response = await client.models.generateContent({
    model: request.model,
    contents: request.contents,
    config: {
      systemInstruction: request.systemInstruction,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
      responseJsonSchema: request.responseJsonSchema,
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
    },
  });
  const usage = response.usageMetadata;
  return {
    text: response.text || "",
    usage: {
      inputTokens: usage?.promptTokenCount ?? 0,
      outputTokens: usage?.candidatesTokenCount ?? 0,
      reasoningTokens: usage?.thoughtsTokenCount ?? 0,
      totalTokens: usage?.totalTokenCount ?? 0,
    },
  };
}

export async function generatePromptLabCandidate(args: {
  input: PromptLabInput;
  plan: PromptLabPlan;
  reference: PromptLabReference;
  recentScenes: readonly RecentScene[];
  retry?: RetryContext;
  lockedBrief?: DatingSceneBrief;
  modelCall?: PromptLabModelCall;
}): Promise<PromptLabGeneration> {
  const contents = buildPromptLabRequest(args);
  const response = await (args.modelCall ?? callGemini)({
    model: PROMPT_LAB_MODEL,
    contents,
    systemInstruction: DATING_SCENE_SYSTEM_INSTRUCTION,
    responseJsonSchema: GEMINI_OUTPUT_JSON_SCHEMA,
  });

  let rawOutput: unknown = response.text;
  try {
    rawOutput = JSON.parse(response.text);
  } catch {
    // The exact invalid response is returned and persisted for manual diagnosis.
  }

  const parsed = promptLabOutputSchema.safeParse(rawOutput);
  const validation = parsed.success
    ? validatePromptLabOutput({
        output: parsed.data,
        input: args.input,
        plan: args.plan,
        recentScenes: args.recentScenes,
        lockedBrief: args.lockedBrief,
      })
    : {
        passed: false,
        problems: parsed.error.issues.map((issue) =>
          `${issue.path.join(".") || "response"}: ${issue.message}`
        ),
        sceneDensity: [],
      };
  const pricingSnapshot = getPromptLabPricing();

  return {
    output: parsed.success ? parsed.data : null,
    rawOutput,
    validation,
    usage: response.usage ?? emptyUsage(),
    estimatedCostUsd: estimatePromptLabCost(response.usage ?? emptyUsage(), pricingSnapshot),
    pricingSnapshot,
  };
}

export function safePromptLabApiError(error: unknown): string {
  const message = error instanceof Error ? error.message : "Unknown Gemini API error";
  if (/api[_ -]?key|credential|token|permission|unauthori[sz]ed/i.test(message)) {
    return "Gemini authentication or configuration failed.";
  }
  if (/429|quota|rate.?limit/i.test(message)) return "Gemini quota or rate limit was reached.";
  if (/timeout|timed out/i.test(message)) return "The Gemini request timed out.";
  if (/unavailable|503|502|connection|network/i.test(message)) return "Gemini is temporarily unavailable.";
  if (/safety|blocked/i.test(message)) return "Gemini blocked the response before returning a candidate.";
  return "Gemini request failed. Check the server log for provider details.";
}
