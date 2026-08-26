import type { InterestId } from "./types";

function stableNumber(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export type SampleShootCandidate = {
  shootId: string;
  /** Only interests this exact scene genuinely depicts. */
  representedInterests: readonly InterestId[];
  subjectLed?: boolean;
};

/**
 * Chooses the paid sample shoots that tell the owner something useful.
 *
 * A seeded random slice can easily render two unrelated scenes while every
 * selected activity remains mocked. This greedy pass maximises distinct
 * selected-interest coverage first, then fills spare sample slots stably.
 */
export function selectSampleShootIds(args: {
  candidates: readonly SampleShootCandidate[];
  selectedInterests: readonly InterestId[];
  includeSimpleCandids?: boolean;
  count: number;
  seed: string;
}): Set<string> {
  const limit = Math.max(0, Math.min(args.count, args.candidates.length));
  const selected = new Set(args.selectedInterests);
  const uncovered = new Set(args.selectedInterests);
  const chosen = new Set<string>();
  const ordered = [...args.candidates].sort(
    (left, right) =>
      stableNumber(`${args.seed}:${left.shootId}`) -
        stableNumber(`${args.seed}:${right.shootId}`) ||
      left.shootId.localeCompare(right.shootId)
  );

  // A two-shoot sample shows one requested candid and one activity-led shoot.
  // Larger samples may show both candid allocations while retaining room for
  // selected-interest QA. This affects sample choice only, never prompt craft.
  const subjectSampleTarget = args.includeSimpleCandids && limit > 0
    ? Math.min(2, Math.max(1, limit - 1))
    : 0;
  const subjectCandidates = ordered
    .filter((candidate) => candidate.subjectLed)
    .sort((left, right) => {
      const leftCoverage = left.representedInterests.filter((interest) => uncovered.has(interest)).length;
      const rightCoverage = right.representedInterests.filter((interest) => uncovered.has(interest)).length;
      return rightCoverage - leftCoverage;
    });
  for (const candidate of subjectCandidates.slice(0, subjectSampleTarget)) {
    chosen.add(candidate.shootId);
    for (const interest of candidate.representedInterests) uncovered.delete(interest);
  }

  while (chosen.size < limit && uncovered.size > 0) {
    const best = ordered
      .filter((candidate) => !chosen.has(candidate.shootId))
      .map((candidate) => ({
        candidate,
        coverage: new Set(
          candidate.representedInterests.filter(
            (interest) => selected.has(interest) && uncovered.has(interest)
          )
        ).size,
      }))
      .sort((left, right) => right.coverage - left.coverage)[0];

    if (!best || best.coverage === 0) break;
    chosen.add(best.candidate.shootId);
    for (const interest of best.candidate.representedInterests) {
      uncovered.delete(interest);
    }
  }

  for (const candidate of ordered) {
    if (chosen.size >= limit) break;
    chosen.add(candidate.shootId);
  }

  return chosen;
}
