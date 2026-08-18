import {
  DATING_PROMPTS,
  getPromptVariants,
  type DatingPromptDefinition,
  type DatingPromptVariant,
} from "./prompt-library";
import {
  DATING_BUCKETS,
  PHOTOS_PER_BUCKET,
  SLOTS_PER_BUCKET,
  TOTAL_PHOTOS,
  type DatingBucket,
  type StylePref,
  type Vibe,
} from "./types";

/**
 * Plans the 100 photos of one delivery.
 *
 * The old allocation locked a single vibe and a single style for the whole
 * order, so a user saw 35 of the library's 105 locations and 100 of its 300
 * outfits — 3.7% of what exists. This picks a vibe, style and variant per photo
 * instead, and guarantees the delivery contains no repeated location, outfit or
 * lighting setup.
 *
 * Variety and preference used to be in direct conflict. Each location group
 * holds exactly one location per vibe, so when a bucket had 20 slots for 20
 * photos, covering them all forced every vibe into play at roughly equal counts
 * — a man who said "urban" still got a third of his photos on a mountain, and
 * nothing in the weighting could change it.
 *
 * Growing each bucket to 26 slots resolved it. The delivery now picks the best
 * 20 of 26 candidates, so six can be dropped, and dropping the least-preferred
 * vibes is what makes the preference visible: an outdoorsy answer lands around
 * 45 outdoorsy photos against 12 urban, rather than 35 against 33. The surplus
 * is also what absorbs content exclusions without repeating a location.
 */

export type DeliveryBias = {
  vibe: Record<Vibe, number>;
  style: Record<StylePref, number>;
};

export type DeliverySlot = {
  bucket: DatingBucket;
  slot: number;
  variant: DatingPromptVariant;
  vibe: Vibe;
  style: StylePref;
};

const VIBES: readonly Vibe[] = ["urban", "outdoorsy", "homebody"];
const STYLES: readonly StylePref[] = ["casual", "sharp", "street"];
const VARIANTS: readonly DatingPromptVariant[] = ["a", "b", "c"];

/** FNV-1a. Same construction the prompt library uses for variant selection. */
function stableHash(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** Highest weight first; ties broken by the fixed order so it stays deterministic. */
function byWeight<T extends string>(
  options: readonly T[],
  weights: Record<T, number>
): T[] {
  return [...options].sort((a, b) => {
    const diff = (weights[b] ?? 0) - (weights[a] ?? 0);
    return diff !== 0 ? diff : options.indexOf(a) - options.indexOf(b);
  });
}

/** Draws one option from a weighting, deterministically from `seed`. */
function weightedPick<T extends string>(
  seed: number,
  order: readonly T[],
  weights: Record<T, number>
): T {
  const total = order.reduce((sum, key) => sum + Math.max(0, weights[key] ?? 0), 0);
  if (total <= 0) return order[0];
  const point = ((seed % 10000) / 10000) * total;
  let running = 0;
  for (const key of order) {
    running += Math.max(0, weights[key] ?? 0);
    if (point < running) return key;
  }
  return order[order.length - 1];
}

/** Slots sharing one `locations` object, in slot order. */
function locationGroups(bucket: DatingBucket): number[][] {
  const groups = new Map<string, number[]>();
  for (let slot = 1; slot <= SLOTS_PER_BUCKET; slot += 1) {
    const [definition] = getPromptVariants(bucket, slot);
    const key = JSON.stringify(definition.locations);
    const existing = groups.get(key);
    if (existing) existing.push(slot);
    else groups.set(key, [slot]);
  }
  return [...groups.values()];
}

function definitionFor(
  bucket: DatingBucket,
  slot: number,
  variant: DatingPromptVariant
): DatingPromptDefinition {
  const found = getPromptVariants(bucket, slot).find(
    (prompt) => prompt.variant === variant
  );
  if (!found) {
    throw new Error(`No ${bucket}:${slot} variant ${variant}`);
  }
  return found;
}

export function planDelivery(
  batchId: string,
  bias: DeliveryBias
): DeliverySlot[] {
  const vibeOrder = byWeight(VIBES, bias.vibe);
  const styleOrder = byWeight(STYLES, bias.style);
  const plan: DeliverySlot[] = [];
  const usedOutfits = new Set<string>();

  for (const bucket of DATING_BUCKETS) {
    // Every slot in a group takes a different vibe, which is what makes the
    // locations unique. That yields 26 candidates per bucket, of which the
    // delivery uses 20 — and the six-slot surplus is what finally lets the
    // user's preference show. When all 26 had to be used, the vibe mix was
    // forced almost even no matter what he asked for.
    const candidates: Array<{ slot: number; vibe: Vibe }> = [];
    for (const group of locationGroups(bucket)) {
      const rotation = stableHash(`${batchId}:${bucket}:${group[0]}`) % 2;
      const remaining = vibeOrder.slice(1);
      if (rotation === 1) remaining.reverse();
      const groupVibes = [vibeOrder[0], ...remaining];
      group.forEach((slot, indexInGroup) => {
        candidates.push({ slot, vibe: groupVibes[indexInGroup] });
      });
    }

    const chosen = [...candidates]
      .sort((a, b) => {
        const weight = (bias.vibe[b.vibe] ?? 0) - (bias.vibe[a.vibe] ?? 0);
        if (weight !== 0) return weight;
        // stable, batch-dependent tie-break so two orders differ
        return (
          (stableHash(`${batchId}:${bucket}:${a.slot}`) % 1000) -
          (stableHash(`${batchId}:${bucket}:${b.slot}`) % 1000)
        );
      })
      .slice(0, PHOTOS_PER_BUCKET)
      .sort((a, b) => a.slot - b.slot);

    for (const { slot, vibe } of chosen) {
      // Style is drawn per photo from the weighting, so a 50/30/20 preference
      // produces roughly that mix rather than collapsing onto the favourite.
      const seed = stableHash(`${batchId}:${bucket}:${slot}`);
      const target = weightedPick(seed, styleOrder, bias.style);
      const pairings: Array<{ style: StylePref; variant: DatingPromptVariant }> = [];
      for (const style of [target, ...styleOrder.filter((s) => s !== target)]) {
        for (let offset = 0; offset < VARIANTS.length; offset += 1) {
          pairings.push({
            style,
            variant: VARIANTS[(seed + offset) % VARIANTS.length],
          });
        }
      }

      const choice =
        pairings.find(
          (pairing) =>
            !usedOutfits.has(
              definitionFor(bucket, slot, pairing.variant).outfits[pairing.style]
            )
        ) ?? pairings[0];

      usedOutfits.add(
        definitionFor(bucket, slot, choice.variant).outfits[choice.style]
      );
      plan.push({ bucket, slot, variant: choice.variant, vibe, style: choice.style });
    }
  }

  if (plan.length !== TOTAL_PHOTOS) {
    throw new Error(`Planned ${plan.length} photos; expected ${TOTAL_PHOTOS}`);
  }
  return plan;
}

/**
 * The promise the product makes: no two photos in a delivery share a location,
 * an outfit or a lighting setup.
 */
export function assertDeliveryUnique(plan: DeliverySlot[]): void {
  const locations = new Set<string>();
  const outfits = new Set<string>();
  const lights = new Set<string>();

  for (const entry of plan) {
    const definition = definitionFor(entry.bucket, entry.slot, entry.variant);
    const location = definition.locations[entry.vibe];
    const outfit = definition.outfits[entry.style];
    const light = definition.light;

    if (locations.has(location)) {
      throw new Error(`Delivery repeats location "${location}"`);
    }
    if (outfits.has(outfit)) {
      throw new Error(`Delivery repeats outfit "${outfit}"`);
    }
    if (lights.has(light)) {
      throw new Error(`Delivery repeats lighting setup on ${entry.bucket}:${entry.slot}`);
    }
    locations.add(location);
    outfits.add(outfit);
    lights.add(light);
  }

  if (plan.length !== TOTAL_PHOTOS) {
    throw new Error(`Delivery has ${plan.length} photos; expected ${TOTAL_PHOTOS}`);
  }
}

/** Reporting helper for the export script and tests. */
export function summariseDelivery(plan: DeliverySlot[]) {
  const count = <T extends string>(values: T[]) =>
    values.reduce<Record<string, number>>((acc, value) => {
      acc[value] = (acc[value] ?? 0) + 1;
      return acc;
    }, {});

  return {
    photos: plan.length,
    distinctLocations: new Set(
      plan.map((e) => definitionFor(e.bucket, e.slot, e.variant).locations[e.vibe])
    ).size,
    distinctOutfits: new Set(
      plan.map((e) => definitionFor(e.bucket, e.slot, e.variant).outfits[e.style])
    ).size,
    distinctLighting: new Set(
      plan.map((e) => definitionFor(e.bucket, e.slot, e.variant).light)
    ).size,
    vibeMix: count(plan.map((e) => e.vibe)),
    styleMix: count(plan.map((e) => e.style)),
    /** Share of the library's distinct locations this one delivery reaches. */
    locationCoverage: `${(
      (new Set(
        plan.map((e) => definitionFor(e.bucket, e.slot, e.variant).locations[e.vibe])
      ).size /
        new Set(DATING_PROMPTS.flatMap((p) => Object.values(p.locations))).size) *
      100
    ).toFixed(0)}%`,
  };
}
