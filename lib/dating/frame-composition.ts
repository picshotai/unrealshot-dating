import type { Framing, ShootKind } from "./shoots";

export const PORTRAIT_3_4 = {
  aspectRatio: "3:4",
  width: 1728,
  height: 2304,
} as const;

export const TALL_9_16 = {
  aspectRatio: "9:16",
  width: 1512,
  height: 2688,
} as const;

export const LANDSCAPE_4_3 = {
  aspectRatio: "4:3",
  width: 2304,
  height: 1728,
} as const;

export type DynamicFrameAspectRatio =
  | typeof PORTRAIT_3_4.aspectRatio
  | typeof TALL_9_16.aspectRatio
  | typeof LANDSCAPE_4_3.aspectRatio;

export type DynamicFrameDimensions = {
  aspectRatio: DynamicFrameAspectRatio;
  width: number;
  height: number;
};

export type DatingSceneCompositionPolicy = {
  defaultAspectRatio: typeof PORTRAIT_3_4.aspectRatio;
  threeQuarterAspectRatios: readonly DynamicFrameAspectRatio[];
};

export const DEFAULT_SCENE_COMPOSITION_POLICY: DatingSceneCompositionPolicy = {
  defaultAspectRatio: PORTRAIT_3_4.aspectRatio,
  threeQuarterAspectRatios: [PORTRAIT_3_4.aspectRatio],
};

export const TALL_ELIGIBLE_SCENE_COMPOSITION_POLICY: DatingSceneCompositionPolicy = {
  defaultAspectRatio: PORTRAIT_3_4.aspectRatio,
  threeQuarterAspectRatios: [PORTRAIT_3_4.aspectRatio, TALL_9_16.aspectRatio],
};

export const LANDSCAPE_ELIGIBLE_SCENE_COMPOSITION_POLICY: DatingSceneCompositionPolicy = {
  defaultAspectRatio: PORTRAIT_3_4.aspectRatio,
  threeQuarterAspectRatios: [PORTRAIT_3_4.aspectRatio, LANDSCAPE_4_3.aspectRatio],
};

const DIMENSIONS_BY_RATIO: Readonly<Record<DynamicFrameAspectRatio, DynamicFrameDimensions>> = {
  "3:4": PORTRAIT_3_4,
  "9:16": TALL_9_16,
  "4:3": LANDSCAPE_4_3,
};

/**
 * New dynamic shoots are portrait-first dating assets. All roles use 3:4;
 * only the scene anchor may receive a portfolio-budgeted 4:3 or 9:16 option.
 * The writer can decline either option and retain 3:4.
 */
export function allowedDynamicFrameDimensions(
  framing: Framing,
  policy: DatingSceneCompositionPolicy = DEFAULT_SCENE_COMPOSITION_POLICY
): readonly DynamicFrameDimensions[] {
  const ratios = framing === "threeQuarter"
    ? policy.threeQuarterAspectRatios
    : [policy.defaultAspectRatio];
  return ratios.map((ratio) => DIMENSIONS_BY_RATIO[ratio]);
}

type PortfolioScene = {
  ideaKey: string;
  kind: ShootKind;
};

const KIND_VERTICAL_PRIORITY: Readonly<Record<ShootKind, number>> = {
  activity: 5,
  outdoors: 4,
  social: 3,
  portrait: 2,
  home: 1,
};

const KIND_HORIZONTAL_PRIORITY: Readonly<Record<ShootKind, number>> = {
  outdoors: 5,
  activity: 4,
  social: 3,
  home: 2,
  portrait: 1,
};

function stableNumber(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/**
 * 9:16 is deliberately the least-used dynamic format: at most one scene in
 * every fifteen receives permission to use it. This function grants an option,
 * not a target; Gemini still defaults to 3:4 when the exact frame fits it.
 */
export function tallAspectEligibleIdeaKeys(
  scenes: readonly PortfolioScene[]
): ReadonlySet<string> {
  const allowance = Math.floor(scenes.length / 15);
  if (allowance === 0) return new Set();

  return new Set(
    [...scenes]
      .sort((left, right) =>
        KIND_VERTICAL_PRIORITY[right.kind] - KIND_VERTICAL_PRIORITY[left.kind] ||
        stableNumber(left.ideaKey) - stableNumber(right.ideaKey)
      )
      .slice(0, allowance)
      .map((scene) => scene.ideaKey)
  );
}

/**
 * 4:3 is an occasional environmental option, capped at two scenes in a
 * standard fifteen-shoot delivery. Tall-eligible scenes are excluded so one
 * prompt never receives two competing exceptional formats.
 */
export function landscapeAspectEligibleIdeaKeys(
  scenes: readonly PortfolioScene[],
  excludedIdeaKeys: ReadonlySet<string> = new Set()
): ReadonlySet<string> {
  const allowance = Math.floor(scenes.length / 6);
  if (allowance === 0) return new Set();

  return new Set(
    [...scenes]
      .filter((scene) => !excludedIdeaKeys.has(scene.ideaKey))
      .sort((left, right) =>
        KIND_HORIZONTAL_PRIORITY[right.kind] - KIND_HORIZONTAL_PRIORITY[left.kind] ||
        stableNumber(left.ideaKey) - stableNumber(right.ideaKey)
      )
      .slice(0, allowance)
      .map((scene) => scene.ideaKey)
  );
}

export function compositionPolicyAllowsTall(
  policy: DatingSceneCompositionPolicy
): boolean {
  return policy.threeQuarterAspectRatios.includes(TALL_9_16.aspectRatio);
}

export function compositionPolicyAllowsLandscape(
  policy: DatingSceneCompositionPolicy
): boolean {
  return policy.threeQuarterAspectRatios.includes(LANDSCAPE_4_3.aspectRatio);
}
