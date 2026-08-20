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
 * The two questions the shoot screen asks.
 *
 * The old screen asked for a "vibe" and a "style" — internal jargon that makes a
 * buyer feel he is choosing a smaller product, and that people cannot answer
 * honestly about themselves anyway. These replace it with what he actually does
 * and how he actually dresses, and the weighting is derived from that.
 */

export type { InterestId };

export type InterestChip = {
  id: InterestId;
  label: string;
  emoji: string;
  /** Where this interest tends to put a person. Need not sum to 1. */
  vibe: Partial<Record<Vibe, number>>;
  /**
   * The activity as the prompt says it, which is not the chip label.
   *
   * All 30 hobby templates frame it as an ongoing pursuit — "a run of {{hobby}}",
   * "a session of {{hobby}}", "the middle of {{hobby}}", "he sets up for
   * {{hobby}}", "whatever {{hobby}} has him working at". That grammar takes an
   * uncountable activity noun and nothing else: the chip label gave "the next
   * part of coffee", an article gives "a session of a hike", and a preposition
   * gives "low in working on the bike". The model renders broken English badly,
   * so every value here is a bare gerund that survives all 30 frames.
   */
  activity: string;
};

export const INTEREST_CHIPS: InterestChip[] = [
  { id: "gym", label: "Gym", emoji: "🏋️", activity: "training", vibe: { urban: 0.7, homebody: 0.3 } },
  { id: "running", label: "Running", emoji: "🏃", activity: "running", vibe: { outdoorsy: 0.6, urban: 0.4 } },
  { id: "hiking", label: "Hiking", emoji: "🥾", activity: "hiking", vibe: { outdoorsy: 1 } },
  { id: "climbing", label: "Climbing", emoji: "🧗", activity: "climbing", vibe: { outdoorsy: 1 } },
  { id: "cycling", label: "Cycling", emoji: "🚴", activity: "cycling", vibe: { outdoorsy: 0.6, urban: 0.4 } },
  { id: "dogs", label: "Dogs", emoji: "🐕", activity: "dog walking", vibe: { outdoorsy: 0.5, homebody: 0.5 } },
  { id: "coffee", label: "Coffee", emoji: "☕", activity: "coffee brewing", vibe: { urban: 0.7, homebody: 0.3 } },
  { id: "nightlife", label: "Going out", emoji: "🍸", activity: "cocktail making", vibe: { urban: 1 } },
  { id: "cooking", label: "Cooking", emoji: "🍳", activity: "cooking", vibe: { homebody: 1 } },
  { id: "reading", label: "Reading", emoji: "📚", activity: "reading", vibe: { homebody: 0.8, urban: 0.2 } },
  { id: "music", label: "Music", emoji: "🎸", activity: "guitar practice", vibe: { homebody: 0.5, urban: 0.5 } },
  { id: "travel", label: "Travel", emoji: "✈️", activity: "packing", vibe: { outdoorsy: 0.5, urban: 0.5 } },
  { id: "football", label: "Football", emoji: "⚽", activity: "football training", vibe: { outdoorsy: 0.8, urban: 0.2 } },
  { id: "motorcycles", label: "Motorcycles", emoji: "🏍️", activity: "bike maintenance", vibe: { urban: 0.6, outdoorsy: 0.4 } },
  { id: "art", label: "Art & museums", emoji: "🖼️", activity: "sketching", vibe: { urban: 1 } },
  { id: "surfing", label: "Surf & swim", emoji: "🏄", activity: "surfing", vibe: { outdoorsy: 1 } },
  // The affluent half of the list. The buyer for a $59 pack does these things,
  // and until now could not say so.
  { id: "golf", label: "Golf", emoji: "⛳", activity: "golf", vibe: { outdoorsy: 0.7, urban: 0.3 } },
  { id: "tennis", label: "Tennis & padel", emoji: "🎾", activity: "tennis", vibe: { outdoorsy: 0.5, urban: 0.5 } },
  { id: "sailing", label: "Sailing", emoji: "⛵", activity: "sailing", vibe: { outdoorsy: 1 } },
  { id: "skiing", label: "Skiing", emoji: "🎿", activity: "skiing", vibe: { outdoorsy: 1 } },
  { id: "dining", label: "Good food & wine", emoji: "🍷", activity: "wine tasting", vibe: { urban: 1 } },
  { id: "boxing", label: "Boxing", emoji: "🥊", activity: "boxing", vibe: { urban: 0.7, homebody: 0.3 } },
];

/**
 * The second question, and the wording matters more than the weighting did.
 *
 * Asking "how do you dress?" reads as a description of him, so he expects every
 * photo to match and 65% is a broken promise. The screen now states that a shoot
 * covers all three looks and asks only which to lead with, which is both true
 * and the better product: a hundred photos in one outfit reads flat, so the
 * range is the point rather than a shortfall to apologise for.
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
  { id: "alcohol", label: "Drinks in hand", emoji: "🍷" },
  { id: "dog", label: "Dogs", emoji: "🐕" },
  { id: "bicycle", label: "Bikes", emoji: "🚲" },
  { id: "teamSport", label: "Team sport", emoji: "⚽" },
];

const CHIP_BY_ID = new Map(INTEREST_CHIPS.map((chip) => [chip.id, chip]));

export function isInterestId(value: unknown): value is InterestId {
  return typeof value === "string" && CHIP_BY_ID.has(value as InterestId);
}

const VIBES: readonly Vibe[] = ["urban", "outdoorsy", "homebody"];
const STYLES: readonly StylePref[] = ["casual", "sharp", "street"];

/**
 * Preference is a lean, never a lock. The screen tells him every shoot covers
 * all three looks and asks only which to lead with, so 65% comfortably
 * over-delivers on "lead with" while the rest keeps the range that makes a
 * profile read as a life rather than a uniform.
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
 * Turns the two on-screen answers into the weighting `planDelivery` consumes.
 * With no interests selected the vibe weighting is even, which is a perfectly
 * good delivery — it just leans nowhere.
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

/**
 * His interests as a list, one per hobby photo.
 *
 * This used to join the first two chips into "hiking and climbing" and hand the
 * same compound string to every hobby slot, so tapping four things silently
 * discarded two and produced one repeated activity. Selection deals from this
 * list instead, which is what makes four chips read as four different photos.
 *
 * Free text is split on commas so "bouldering, film photography" counts as two.
 */
export function resolveHobbies(
  interests: InterestId[],
  freeText?: string | null
): string[] {
  const typed = (freeText ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const fromChips = interests
    .map((id) => CHIP_BY_ID.get(id)?.activity)
    .filter((activity): activity is string => Boolean(activity));

  // Typed answers lead, chips fill in behind them, duplicates collapse.
  return [...new Set([...typed, ...fromChips])];
}

/** The single value stored on the preferences row for display and regeneration. */
export function resolveHobbyText(
  interests: InterestId[],
  freeText?: string | null
): string | null {
  const list = resolveHobbies(interests, freeText);
  return list.length > 0 ? list.join(", ") : null;
}
