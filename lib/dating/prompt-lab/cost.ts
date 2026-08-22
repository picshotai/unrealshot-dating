export type PromptLabUsage = {
  inputTokens: number;
  outputTokens: number;
  reasoningTokens: number;
  totalTokens: number;
};

export type PricingSnapshot = {
  currency: "USD";
  inputUsdPerMillion: number;
  outputAndReasoningUsdPerMillion: number;
};

function positiveRate(raw: string | undefined, fallback: number): number {
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

export function getPromptLabPricing(): PricingSnapshot {
  return {
    currency: "USD",
    inputUsdPerMillion: positiveRate(
      process.env.GEMINI_37_FLASH_INPUT_USD_PER_MILLION,
      0.75
    ),
    outputAndReasoningUsdPerMillion: positiveRate(
      process.env.GEMINI_37_FLASH_OUTPUT_USD_PER_MILLION,
      3.75
    ),
  };
}

export function estimatePromptLabCost(
  usage: PromptLabUsage,
  pricing = getPromptLabPricing()
): number {
  const input = usage.inputTokens * pricing.inputUsdPerMillion;
  const output = (usage.outputTokens + usage.reasoningTokens) * pricing.outputAndReasoningUsdPerMillion;
  return Number(((input + output) / 1_000_000).toFixed(8));
}

