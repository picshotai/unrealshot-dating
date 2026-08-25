import { GoogleGenAI } from "@google/genai";

import {
  estimateDatingPromptCost,
  getDatingPromptPricing,
  type PromptUsage,
} from "@/lib/dating/prompt-cost";
import { DATING_CREATIVE_MODEL } from "./schemas";

export type CreativeModelResponse = {
  text: string;
  usage: PromptUsage;
  interactionId: string | null;
};

export type CreativeModelCall = (request: {
  model: typeof DATING_CREATIVE_MODEL;
  contents: string;
  systemInstruction: string;
  responseJsonSchema: unknown;
  maxOutputTokens?: number;
}) => Promise<CreativeModelResponse>;

export const DATING_PROVIDER_REQUEST_VERSION = "gemini-interactions-v1" as const;
export const PORTFOLIO_MAX_OUTPUT_TOKENS = 32_768 as const;
export const SHOOT_MAX_OUTPUT_TOKENS = 16_384 as const;

export const DATING_EMBEDDING_MODEL = "gemini-embedding-001" as const;
export const DATING_EMBEDDING_DIMENSIONS = 768 as const;

export function buildDatingInteractionRequest(
  request: Parameters<CreativeModelCall>[0]
) {
  return {
    model: request.model,
    input: request.contents,
    system_instruction: request.systemInstruction,
    store: false,
    generation_config: {
      thinking_level: "low" as const,
      max_output_tokens: request.maxOutputTokens ?? SHOOT_MAX_OUTPUT_TOKENS,
    },
    response_format: {
      type: "text" as const,
      mime_type: "application/json",
      schema: request.responseJsonSchema,
    },
  };
}

export function extractDatingInteractionResponse(response: {
  id?: string | null;
  output_text?: string | null;
  usage?: {
    total_input_tokens?: number | null;
    total_output_tokens?: number | null;
    total_thought_tokens?: number | null;
    total_tokens?: number | null;
  } | null;
}): CreativeModelResponse {
  return {
    text: response.output_text || "",
    usage: {
      inputTokens: response.usage?.total_input_tokens ?? 0,
      outputTokens: response.usage?.total_output_tokens ?? 0,
      reasoningTokens: response.usage?.total_thought_tokens ?? 0,
      totalTokens: response.usage?.total_tokens ?? 0,
    },
    interactionId: response.id ?? null,
  };
}

export type CreativeEmbeddingResponse = {
  vectors: number[][];
  billableCharacters: number;
};

export type CreativeEmbeddingCall = (
  texts: readonly string[]
) => Promise<CreativeEmbeddingResponse>;

export async function callDatingCreativeModel(
  request: Parameters<CreativeModelCall>[0]
): Promise<CreativeModelResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");

  const client = new GoogleGenAI({ apiKey });
  const response = await client.interactions.create(
    buildDatingInteractionRequest(request)
  );
  return extractDatingInteractionResponse(response);
}

function unitNormalize(values: readonly number[]): number[] {
  const magnitude = Math.sqrt(values.reduce((sum, value) => sum + value * value, 0));
  if (!Number.isFinite(magnitude) || magnitude === 0) {
    throw new Error("Gemini returned an invalid semantic embedding.");
  }
  return values.map((value) => value / magnitude);
}

export async function embedDatingSceneMeanings(
  texts: readonly string[],
  embeddingCall?: CreativeEmbeddingCall
): Promise<CreativeEmbeddingResponse> {
  if (embeddingCall) return embeddingCall(texts);
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");
  const client = new GoogleGenAI({ apiKey });
  const response = await client.models.embedContent({
    model: DATING_EMBEDDING_MODEL,
    contents: texts.map((text) => ({ role: "user", parts: [{ text }] })),
    config: {
      taskType: "SEMANTIC_SIMILARITY",
      outputDimensionality: DATING_EMBEDDING_DIMENSIONS,
    },
  });
  const vectors = response.embeddings?.map((embedding) =>
    unitNormalize(embedding.values ?? [])
  ) ?? [];
  if (
    vectors.length !== texts.length ||
    vectors.some((vector) => vector.length !== DATING_EMBEDDING_DIMENSIONS)
  ) {
    throw new Error("Gemini returned incomplete semantic embeddings.");
  }
  return {
    vectors,
    billableCharacters: response.metadata?.billableCharacterCount ??
      texts.reduce((sum, text) => sum + text.length, 0),
  };
}

export function creativeCost(usage: PromptUsage) {
  const pricingSnapshot = getDatingPromptPricing();
  return {
    pricingSnapshot,
    estimatedCostUsd: estimateDatingPromptCost(usage, pricingSnapshot),
  };
}
