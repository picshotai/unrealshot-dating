import type { ExcludableTag, InterestId, StylePref } from "@/lib/dating/types";
import type {
  PromptLabKind,
  PromptLabLight,
} from "@/lib/dating/prompt-lab/schemas";

export const RECIPE_PLANNER_VERSION = "dating-recipes-v2" as const;

export type DatingSignal = "warmth" | "competence" | "adventure" | "social-ease";

export type VenueRecipe = {
  id: string;
  label: string;
  location: string;
  conceptFamily: string;
  settingFamily: string;
  kind: PromptLabKind;
  interests: readonly InterestId[];
  lights: readonly PromptLabLight[];
  signals: readonly DatingSignal[];
  zones: readonly { id: string; direction: string }[];
  topologyIds: readonly string[];
  excludedTags?: readonly ExcludableTag[];
};

export type ActivityRecipe = {
  id: string;
  activity: string;
  interest?: InterestId;
  kinds: readonly PromptLabKind[];
  signals: readonly DatingSignal[];
  propIds: readonly string[];
  excludedTags?: readonly ExcludableTag[];
};

export type ReasonRecipe = {
  id: string;
  reason: string;
  signals: readonly DatingSignal[];
};

export type EnvironmentTopology = {
  id: string;
  direction: string;
  anchors: readonly [string, string];
  supportSurface: string | null;
};

export type SceneMomentPlan = {
  /** Stable creative direction, not another uniqueness dimension. */
  profileId: string;
  overallTone: string;
  frames: {
    close: string;
    medium: string;
    threeQuarter: string;
    expression: string;
  };
  /** Full laughter is rejected unless the reserved scene explicitly earns it. */
  allowsFullLaugh: boolean;
};

export type DatingSceneBrief = {
  plannerVersion: typeof RECIPE_PLANNER_VERSION;
  ideaKey: string;
  sceneId: string;
  slotIndex: number;
  conceptFamily: string;
  settingFamily: string;
  kind: PromptLabKind;
  lightFamily: PromptLabLight;
  datingSignal: DatingSignal;
  /** The customer's broad taste; it may influence only compatible details. */
  stylePreference?: StylePref;
  /** The scene-resolved register Gemini must actually dress for. */
  register: StylePref;
  wardrobeContract: string;
  venueId: string;
  venue: string;
  location: string;
  zoneId: string;
  shootingZone: string;
  activityId: string;
  activity: string;
  reasonId: string;
  activityReason: string;
  topologyId: string;
  environmentRequirement: string;
  environmentAnchors: readonly [string, string];
  supportSurface: string | null;
  props: readonly string[];
  representedInterest: InterestId | null;
  /** Scene-derived face and gaze direction for all four moments. */
  momentPlan?: SceneMomentPlan;
  interests: readonly InterestId[];
  exclusions: readonly ExcludableTag[];
  geometryContract: readonly string[];
};

export type PlanRecipeInput = {
  orderId: string;
  count: number;
  interests: readonly InterestId[];
  dress: StylePref;
  exclusions: readonly ExcludableTag[];
  previousConceptFamilies?: readonly string[];
  salt?: number;
};
