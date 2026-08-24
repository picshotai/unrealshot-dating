import { queue } from "@trigger.dev/sdk";

import { getDatingProductConfig } from "@/lib/dating/config";

/** One global provider lane shared by portfolio, embedding and shoot-writing work. */
export const datingGeminiQueue = queue({
  name: "dating-gemini",
  concurrencyLimit: getDatingProductConfig().geminiConcurrency,
});

