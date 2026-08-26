import { selectSampleShootIds } from "@/lib/dating/sample-selection";
import type { InterestId } from "@/lib/dating/types";

export type DatingRenderPlanCandidate = {
  shootId: string;
  representedInterests: InterestId[];
  subjectLed?: boolean;
};

/**
 * Freezes which complete shoots are real before any writer or image work runs.
 * Selection is shoot-level so an anchor and its three followers can never be
 * split across real and local rendering.
 */
export function planDatingRenderModes(args: {
  candidates: DatingRenderPlanCandidate[];
  selectedInterests: InterestId[];
  includeSimpleCandids?: boolean;
  testMode: "off" | "sample" | "mock";
  realShootsTarget: number;
  seed: string;
}) {
  const requestedRealCount = args.testMode === "off"
    ? args.candidates.length
    : args.testMode === "mock"
      ? 0
      : Math.min(args.realShootsTarget, args.candidates.length);
  const realIds = requestedRealCount === args.candidates.length
    ? new Set(args.candidates.map((candidate) => candidate.shootId))
    : requestedRealCount === 0
      ? new Set<string>()
      : selectSampleShootIds({
          candidates: args.candidates,
          selectedInterests: args.selectedInterests,
          includeSimpleCandids: args.includeSimpleCandids,
          count: requestedRealCount,
          seed: args.seed,
        });
  const mockIds = new Set(
    args.candidates
      .map((candidate) => candidate.shootId)
      .filter((shootId) => !realIds.has(shootId))
  );
  return { realIds, mockIds };
}
