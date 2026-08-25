export type CreativeProviderFailure = {
  safeMessage: string;
  diagnostic: string;
  retryable: boolean;
  status: number | null;
  failureCode?: "provider_billing_depleted";
};

function errorRecord(error: unknown): Record<string, unknown> {
  return error && typeof error === "object" ? error as Record<string, unknown> : {};
}

/** Keep the provider's useful reason while stripping credentials and headers. */
function sanitizeProviderMessage(message: string) {
  return message
    .replace(/AIza[\w-]+/g, "[redacted-api-key]")
    .replace(/(x-goog-api-key|api[_-]?key|authorization)\s*[:=]\s*[^\s,;}]+/gi, "$1=[redacted]")
    .replace(/Bearer\s+[^\s,;}]+/gi, "Bearer [redacted]")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 800);
}

export function isCreativeProviderBillingDepleted(message: string) {
  return /prepayment credits? (?:are|is) depleted|prepaid (?:credits?|balance).*(?:depleted|exhausted)|billing balance.*(?:depleted|exhausted)/i.test(message);
}

/** Classifies provider failures so malformed requests do not become retry storms. */
export function classifyCreativeProviderError(error: unknown): CreativeProviderFailure {
  const record = errorRecord(error);
  const nested = errorRecord(record.error);
  const statusValue = record.status ?? record.statusCode ?? nested.status ?? nested.code;
  const status = typeof statusValue === "number"
    ? statusValue
    : /^\d{3}$/.test(String(statusValue ?? ""))
      ? Number(statusValue)
      : null;
  const rawMessage = error instanceof Error
    ? error.message
    : typeof record.message === "string"
      ? record.message
      : "Unknown Gemini API error";
  const message = sanitizeProviderMessage(rawMessage);
  const retryable = status === 408 || status === 409 || status === 429 ||
    (status !== null && status >= 500) ||
    /quota|rate.?limit|timeout|timed out|unavailable|connection|network|fetch failed/i.test(message);

  // A 429 normally means short-lived rate limiting, but Gemini also uses it
  // when a prepaid project has no money left. Waiting cannot repair billing,
  // so treating this as transient creates four identical paid task attempts
  // and leaves the customer watching a retry that can never succeed.
  if (
    status === 429 &&
    isCreativeProviderBillingDepleted(message)
  ) {
    return {
      safeMessage: "Gemini billing balance is depleted.",
      diagnostic: `Gemini billing depleted (429): ${message}`,
      retryable: false,
      status,
      failureCode: "provider_billing_depleted",
    };
  }

  if (status === 401 || status === 403 || /credential|unauthori[sz]ed|permission denied/i.test(message)) {
    return {
      safeMessage: "Gemini authentication or project access failed.",
      diagnostic: `Gemini authentication failed${status ? ` (${status})` : ""}: ${message}`,
      retryable: false,
      status,
    };
  }
  if (status === 400 || status === 404 || status === 422 || /invalid.?argument|unsupported parameter|not found/i.test(message)) {
    return {
      safeMessage: "Gemini rejected the production request configuration.",
      diagnostic: `Gemini request rejected${status ? ` (${status})` : ""}: ${message}`,
      retryable: false,
      status,
    };
  }
  if (/safety|blocked/i.test(message)) {
    return {
      safeMessage: "Gemini blocked the response before returning a candidate.",
      diagnostic: `Gemini response blocked: ${message}`,
      retryable: false,
      status,
    };
  }
  if (retryable) {
    return {
      safeMessage: status === 429
        ? "Gemini quota or rate limit was reached."
        : "Gemini is temporarily unavailable.",
      diagnostic: `Gemini temporary failure${status ? ` (${status})` : ""}: ${message}`,
      retryable: true,
      status,
    };
  }
  return {
    safeMessage: "Gemini request failed with an unclassified provider error.",
    diagnostic: `Gemini unclassified failure${status ? ` (${status})` : ""}: ${message}`,
    retryable: false,
    status,
  };
}

/** Backwards-compatible concise message for call sites that do not need classification. */
export function safeCreativeProviderError(error: unknown): string {
  return classifyCreativeProviderError(error).safeMessage;
}
