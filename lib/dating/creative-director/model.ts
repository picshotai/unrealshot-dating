import { GoogleGenAI, ThinkingLevel } from "@google/genai";

import {
  estimateDatingPromptCost,
  getDatingPromptPricing,
  type PromptUsage,
} from "@/lib/dating/prompt-cost";
import { DATING_CREATIVE_MODEL } from "./schemas";

export type CreativeModelResponse = {
  text: string;
  usage: PromptUsage;
};

export type CreativeModelCall = (request: {
  model: typeof DATING_CREATIVE_MODEL;
  contents: string;
  systemInstruction: string;
  responseJsonSchema: unknown;
}) => Promise<CreativeModelResponse>;

export const DATING_EMBEDDING_MODEL = "gemini-embedding-001" as const;
export const DATING_EMBEDDING_DIMENSIONS = 768 as const;

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
