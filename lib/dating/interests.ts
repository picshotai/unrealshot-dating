import type { ExcludableTag, InterestId, StylePref, Vibe } from "./types";

/**
 * Kept only to satisfy user_preferences.vibe / .style, which are NOT NULL with
 * check constraints. Nothing in selection reads a weighting any more: a shoot is
 * coherent when it is authored, so preferences pick whole shoots instead of
 * tuning the parts of one.
 */
export type DeliveryBias = {
  vibe: Record<Vibe, number>;
  style: Record<StylePref, number>;
};

/**
 * The activity question the production intake asks. `meaning` is deliberately
 * product semantics rather than a creative recipe: it tells the director what
 * the user's tap promises without prescribing a venue, pose or photograph.
 */

export type { InterestId };

export type InterestChip = {
  id: InterestId;
  label: string;
  emoji: string;
  /** The promise this chip makes to the buyer; it is passed to the director verbatim. */
  meaning: string;
  /** Where this interest tends to put a person. Need not sum to 1. */
  vibe: Partial<Record<Vibe, number>>;
};

export const INTEREST_CHIPS: InterestChip[] = [
  { id: "gym", label: "Gym", emoji: "🏋️", meaning: "A real gym or strength-training moment in clothing appropriate for that exact workout.", vibe: { urban: 0.7, homebody: 0.3 } },
  { id: "running", label: "Running", emoji: "🏃", meaning: "A believable running-life moment, not merely standing beside a track in fashion clothes.", vibe: { outdoorsy: 0.6, urban: 0.4 } },
  { id: "hiking", label: "Hiking", emoji: "🥾", meaning: "A genuine hike or trail-day moment with terrain- and weather-suitable clothing.", vibe: { outdoorsy: 1 } },
  { id: "climbing", label: "Climbing", emoji: "🧗", meaning: "A genuine climbing or bouldering moment with credible safety context and clothing.", vibe: { outdoorsy: 1 } },
  { id: "cycling", label: "Cycling", emoji: "🚴", meaning: "A real cycling-life moment; the bicycle supports the story but must not become a product catalogue hero.", vibe: { outdoorsy: 0.6, urban: 0.4 } },
  { id: "dogs", label: "Dogs", emoji: "🐕", meaning: "A warm, credible moment with a dog that feels like part of his actual life.", vibe: { outdoorsy: 0.5, homebody: 0.5 } },
  { id: "coffee", label: "Coffee", emoji: "☕", meaning: "An everyday coffee ritual or social coffee moment with believable photographic provenance.", vibe: { urban: 0.7, homebody: 0.3 } },
  { id: "nightlife", label: "Going out", emoji: "🌃", meaning: "A desirable evening social-life moment; alcohol is optional and must disappear when excluded.", vibe: { urban: 1 } },
  { id: "cooking", label: "Cooking", emoji: "🍳", meaning: "A credible home or social cooking moment where he is actually preparing something.", vibe: { homebody: 1 } },
  { id: "reading", label: "Reading", emoji: "📚", meaning: "A natural reading-life moment, not a staged book prop held only for the camera.", vibe: { homebody: 0.8, urban: 0.2 } },
  { id: "music", label: "Music", emoji: "🎧", meaning: "A listening, live-music, collecting or playing moment; do not invent instrument skill without a reason.", vibe: { homebody: 0.5, urban: 0.5 } },
  { id: "travel", label: "Travel", emoji: "✈️", meaning: "A lived travel moment at a destination or in transit, not generic luggage advertising.", vibe: { outdoorsy: 0.5, urban: 0.5 } },
  { id: "football", label: "Football", emoji: "⚽", meaning: "A real football-playing or match-day moment with football-appropriate clothing and context.", vibe: { outdoorsy: 0.8, urban: 0.2 } },
  { id: "motorcycles", label: "Motorcycles", emoji: "🏍️", meaning: "A genuine riding or road-life moment; never a repair garage, workshop or motorcycle catalogue pose.", vibe: { urban: 0.6, outdoorsy: 0.4 } },
  { id: "art", label: "Art & museums", emoji: "🖼️", meaning: "A credible gallery, exhibition or museum-going moment; do not invent professional artist skills.", vibe: { urban: 1 } },
  { id: "surfing", label: "Surf & swim", emoji: "🏄", meaning: "A genuine surf, swim or coastal-water day with context-appropriate clothing.", vibe: { outdoorsy: 1 } },
  // The affluent half of the list. The buyer for this pack does these things,
  // and until now could not say so.
  { id: "golf", label: "Golf", emoji: "⛳", meaning: "A genuine golf-day moment with course-appropriate clothing, not a luxury-performance costume.", vibe: { outdoorsy: 0.7, urban: 0.3 } },
  { id: "tennis", label: "Tennis & padel", emoji: "🎾", meaning: "A real tennis or padel moment in credible court clothing, during or naturally around play.", vibe: { outdoorsy: 0.5, urban: 0.5 } },
  { id: "sailing", label: "Sailing", emoji: "⛵", meaning: "A genuine day-on-the-water moment with practical sailing context and clothing.", vibe: { outdoorsy: 1 } },
  { id: "skiing", label: "Skiing", emoji: "🎿", meaning: "A genuine ski-day moment with weather- and activity-correct clothing.", vibe: { outdoorsy: 1 } },
  { id: "dining", label: "Dining & good food", emoji: "🍽️", meaning: "A desirable dining or food-life moment; wine is optional and forbidden when alcohol is excluded.", vibe: { urban: 1 } },
  { id: "boxing", label: "Boxing", emoji: "🥊", meaning: "A genuine boxing-training moment with gym- and activity-correct clothing.", vibe: { urban: 0.7, homebody: 0.3 } },
];

/**
 * Retained for the owner-only historical prompt lab and authored-order tooling.
 * Production intake no longer asks for a global style; the portfolio director
 * selects context-correct clothing independently for every occasion.
 */
export type DressOption = {
  id: StylePref;
  label: string;
  hint: string;
};

export const DRESS_OPTIONS: DressOption[] = [
  { id: "casual", label: "Casual", hint: "Henleys, knits, denim, boots" },
  { id: "sharp", label: "Sharp", hint: "Tailoring, coats, collars, leather" },
  { id: "street", label: "Street", hint: "Jackets, layers, modern sneakers" },
];

/** The four things a user can ask us to keep out of his delivery. */
export type ExclusionChip = { id: ExcludableTag; label: string; emoji: string };

export const EXCLUSION_CHIPS: ExclusionChip[] = [
  { id: "alcohol", label: "No alcohol", emoji: "🍷" },
  { id: "dog", label: "No dogs", emoji: "🐕" },
  { id: "bicycle", label: "No bicycles", emoji: "🚲" },
  { id: "teamSport", label: "No team sports", emoji: "⚽" },
];

const CHIP_BY_ID = new Map(INTEREST_CHIPS.map((chip) => [chip.id, chip]));

export function interestMeaning(id: InterestId): string {
  return CHIP_BY_ID.get(id)?.meaning ?? id;
}

export const EXCLUSION_CONFLICTS: Readonly<Partial<Record<ExcludableTag, InterestId>>> = {
  dog: "dogs",
  bicycle: "cycling",
  teamSport: "football",
};

export function conflictingExclusion(
  interests: readonly InterestId[],
  exclusion: ExcludableTag
): InterestId | null {
  const interest = EXCLUSION_CONFLICTS[exclusion];
  return interest && interests.includes(interest) ? interest : null;
}

export function isInterestId(value: unknown): value is InterestId {
  return typeof value === "string" && CHIP_BY_ID.has(value as InterestId);
}

const VIBES: readonly Vibe[] = ["urban", "outdoorsy", "homebody"];
const STYLES: readonly StylePref[] = ["casual", "sharp", "street"];

/**
 * Historical weighting used only to satisfy legacy preference rows/tooling.
 */
const PREFERRED = 0.65;
const SECOND = 0.2;
const THIRD = 0.15;

function normalise<T extends string>(
  keys: readonly T[],
  raw: Record<T, number>
): Record<T, number> {
  const total = keys.reduce((sum, key) => sum + Math.max(0, raw[key] ?? 0), 0);
  const out = {} as Record<T, number>;
  for (const key of keys) {
    out[key] = total > 0 ? Math.max(0, raw[key] ?? 0) / total : 1 / keys.length;
  }
  return out;
}

/**
 * Legacy authored-delivery weighting. The intelligent director never receives it.
 */
export function deriveBias(
  interests: InterestId[],
  dress: StylePref
): DeliveryBias {
  const vibeRaw = { urban: 0, outdoorsy: 0, homebody: 0 } as Record<Vibe, number>;
  for (const id of interests) {
    const chip = CHIP_BY_ID.get(id);
    if (!chip) continue;
    for (const vibe of VIBES) {
      vibeRaw[vibe] += chip.vibe[vibe] ?? 0;
    }
  }

  const others = STYLES.filter((style) => style !== dress);
  const styleRaw = {
    [dress]: PREFERRED,
    [others[0]]: SECOND,
    [others[1]]: THIRD,
  } as Record<StylePref, number>;

  return {
    vibe: normalise(VIBES, vibeRaw),
    style: normalise(STYLES, styleRaw),
  };
}

/**
 * `user_preferences.vibe` and `.style` are NOT NULL with check constraints, so
 * the strongest lean is stored there while the full weighting drives selection.
 */
export function dominantVibe(bias: DeliveryBias): Vibe {
  return [...VIBES].sort((a, b) => bias.vibe[b] - bias.vibe[a])[0];
}

export function dominantStyle(bias: DeliveryBias): StylePref {
  return [...STYLES].sort((a, b) => bias.style[b] - bias.style[a])[0];
}
