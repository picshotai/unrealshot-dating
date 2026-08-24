import { createHash } from "node:crypto";

const STOP_WORDS = new Set([
  "a", "an", "and", "at", "by", "for", "from", "he", "his", "in", "is",
  "of", "on", "one", "the", "to", "with",
]);

export function normalizeNoveltyText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token))
    .join(" ")
    .trim();
}

export function noveltyIdeaKey(fingerprint: string): string {
  return createHash("sha256")
    .update(normalizeNoveltyText(fingerprint))
    .digest("hex");
}

/** Token-set overlap is a final local guard; PostgreSQL pg_trgm is the atomic global guard. */
export function noveltySimilarity(left: string, right: string): number {
  const a = new Set(normalizeNoveltyText(left).split(" ").filter(Boolean));
  const b = new Set(normalizeNoveltyText(right).split(" ").filter(Boolean));
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const token of a) if (b.has(token)) intersection += 1;
  return (2 * intersection) / (a.size + b.size);
}

