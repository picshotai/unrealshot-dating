import { queue } from "@trigger.dev/sdk";

import { getDatingProductConfig } from "@/lib/dating/config";

/** Global concurrency guard for the parallel one-shoot Gemini writer tasks. */
export const datingGeminiQueue = queue({
  name: "dating-gemini",
  concurrencyLimit: getDatingProductConfig().geminiConcurrency,
});
