/** Provider errors are persisted without leaking credentials or raw internals. */
export function safeCreativeProviderError(error: unknown): string {
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

