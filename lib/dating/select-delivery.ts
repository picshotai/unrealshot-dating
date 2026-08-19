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
  /**
   * Which of his interests this photo shows, when it landed on a slot that
   * offers a hobby alternative. Undefined means the general beat is used.
   */
  hobby?: string;
};

const VIBES: readonly Vibe[] = ["urban", "outdoorsy", "homebody"];
const STYLES: readonly StylePref[] = ["casual", "sharp", "street"];
const VARIANTS: readonly DatingPromptVariant[] = ["a", "b", "c"];

/** FNV-1a. Same construction the prompt library uses for variant selection. */
export function stableHash(value: string): number {
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

export type PlanOptions = {
  /** Content the user asked us to leave out. */
  excludeTags?: readonly string[];
  /** What he is into, one per hobby photo rather than all crammed together. */
  hobbies?: readonly string[];
};

/**
 * How many photos one interest may claim.
 *
 * Without a ceiling a man who taps a single chip gets every hobby slot filled
 * with it — ten photos of chess — which is the flooding problem. With it, the
 * remaining hobby slots fall back to their general beats, so his interests show
 * up alongside the ordinary shots rather than replacing them.
 */
const MAX_PHOTOS_PER_HOBBY = 3;

function offersHobby(bucket: DatingBucket, slot: number): boolean {
  return getPromptVariants(bucket, slot).some((p) =>
    Boolean(p.hobbyPromptTemplate)
  );
}

/** True when every variant of a slot carries something the user excluded. */
function slotIsBlocked(
  bucket: DatingBucket,
  slot: number,
  excluded: readonly string[]
): boolean {
  if (excluded.length === 0) return false;
  return getPromptVariants(bucket, slot).every((p) =>
    p.tags.some((tag) => excluded.includes(tag))
  );
}

export function planDelivery(
  batchId: string,
  bias: DeliveryBias,
  options: PlanOptions = {}
): DeliverySlot[] {
  const excluded = options.excludeTags ?? [];
  const hobbies = (options.hobbies ?? []).filter((h) => h.trim().length > 0);
  const hobbyBudget = hobbies.length * MAX_PHOTOS_PER_HOBBY;
  const vibeOrder = byWeight(VIBES, bias.vibe);
  const styleOrder = byWeight(STYLES, bias.style);

  type Candidate = { bucket: DatingBucket; slot: number; vibe: Vibe };
  const selected: Candidate[] = [];
  /** Usable candidates a bucket did not need, kept to cover another's shortfall. */
  const spare: Candidate[] = [];
  let shortfall = 0;

  for (const bucket of DATING_BUCKETS) {
    // Every slot in a group takes a different vibe, which is what makes the
    // locations unique. That yields up to 26 candidates per bucket, of which the
    // delivery uses 20 — and the surplus is what lets the user's preference
    // show. When all 26 had to be used, the vibe mix was forced almost even no
    // matter what he asked for.
    const candidates: Candidate[] = [];
    for (const group of locationGroups(bucket)) {
      const rotation = stableHash(`${batchId}:${bucket}:${group[0]}`) % 2;
      const remaining = vibeOrder.slice(1);
      if (rotation === 1) remaining.reverse();
      const groupVibes = [vibeOrder[0], ...remaining];
      group.forEach((slot, indexInGroup) => {
        // A slot whose every variant carries excluded content is unavailable.
        // Dropping it here is what keeps a dog out of the delivery of a man who
        // told us he has no dog.
        if (slotIsBlocked(bucket, slot, excluded)) return;
        candidates.push({ bucket, slot, vibe: groupVibes[indexInGroup] });
      });
    }

    // When he told us what he is into, the slots that can show it are picked
    // first, up to the budget his choices earn. Without this the hobby count
    // drifted between seven and nine purely on which slots the vibe weighting
    // happened to favour, so the answer he gave produced a different amount of
    // evidence every time.
    const ranked = candidates.sort((a, b) => {
      const aHobby = hobbyBudget > 0 && offersHobby(bucket, a.slot) ? 1 : 0;
      const bHobby = hobbyBudget > 0 && offersHobby(bucket, b.slot) ? 1 : 0;
      if (aHobby !== bHobby) return bHobby - aHobby;
      const weight = (bias.vibe[b.vibe] ?? 0) - (bias.vibe[a.vibe] ?? 0);
      if (weight !== 0) return weight;
      // stable, batch-dependent tie-break so two orders differ
      return (
        (stableHash(`${batchId}:${bucket}:${a.slot}`) % 1000) -
        (stableHash(`${batchId}:${bucket}:${b.slot}`) % 1000)
      );
    });

    selected.push(...ranked.slice(0, PHOTOS_PER_BUCKET));
    spare.push(...ranked.slice(PHOTOS_PER_BUCKET));
    shortfall += Math.max(0, PHOTOS_PER_BUCKET - ranked.length);
  }

  // Exclusions do not fall evenly. Dog and team sport both land in `active`,
  // which can take it from 26 usable slots to 18, so a filtered delivery is made
  // whole from whichever buckets had slots to spare. The bucket balance drifts —
  // a man who excludes dogs gets a few more street and travel photos — which is
  // the honest trade for keeping 100 photos in 100 different places.
  if (shortfall > 0) {
    const backfill = spare
      .sort((a, b) => {
        const weight = (bias.vibe[b.vibe] ?? 0) - (bias.vibe[a.vibe] ?? 0);
        if (weight !== 0) return weight;
        return (
          (stableHash(`${batchId}:fill:${a.bucket}:${a.slot}`) % 1000) -
          (stableHash(`${batchId}:fill:${b.bucket}:${b.slot}`) % 1000)
        );
      })
      .slice(0, shortfall);

    if (backfill.length < shortfall) {
      throw new Error(
        `Exclusions [${excluded.join(", ")}] leave only ${
          selected.length + backfill.length
        } usable slots; a delivery needs ${TOTAL_PHOTOS}`
      );
    }
    selected.push(...backfill);
  }

  // Style and variant are resolved last, once the final set of slots is known,
  // so outfit uniqueness holds across backfilled entries too.
  const plan: DeliverySlot[] = [];
  const usedOutfits = new Set<string>();

  const ordered = selected.sort(
    (a, b) =>
      DATING_BUCKETS.indexOf(a.bucket) - DATING_BUCKETS.indexOf(b.bucket) ||
      a.slot - b.slot
  );

  for (const { bucket, slot, vibe } of ordered) {
    // Style is drawn per photo from the weighting, so a 65/20/15 preference
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

    const allowed = pairings.filter(
      ({ variant }) =>
        !definitionFor(bucket, slot, variant).tags.some((tag) =>
          excluded.includes(tag)
        )
    );
    const usable = allowed.length > 0 ? allowed : pairings;

    const choice =
      usable.find(
        (pairing) =>
          !usedOutfits.has(
            definitionFor(bucket, slot, pairing.variant).outfits[pairing.style]
          )
      ) ?? usable[0];

    usedOutfits.add(
      definitionFor(bucket, slot, choice.variant).outfits[choice.style]
    );
    plan.push({ bucket, slot, variant: choice.variant, vibe, style: choice.style });
  }

  // One interest per hobby photo, dealt round-robin, so four chips produce four
  // different activities across the shoot rather than one compound string
  // repeated on every hobby slot. Slots beyond the budget keep their general
  // beat, which is what stops a single interest taking over the delivery.
  if (hobbies.length > 0) {
    const dealt = new Map<string, number>();
    let next = 0;
    for (const entry of plan) {
      if (!offersHobby(entry.bucket, entry.slot)) continue;
      // find the next interest that still has room
      let picked: string | undefined;
      for (let step = 0; step < hobbies.length; step += 1) {
        const candidate = hobbies[(next + step) % hobbies.length];
        if ((dealt.get(candidate) ?? 0) < MAX_PHOTOS_PER_HOBBY) {
          picked = candidate;
          next = (next + step + 1) % hobbies.length;
          break;
        }
      }
      if (!picked) break; // every interest has had its share
      dealt.set(picked, (dealt.get(picked) ?? 0) + 1);
      entry.hobby = picked;
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

/**
 * Picks a replacement shot for one photo the user asked to redo.
 *
 * Regeneration used to re-send the stored prompt, so a man who disliked a photo
 * spent a credit and received the same shot back. The surplus slots exist for
 * exactly this: the replacement comes from a slot in the same bucket that this
 * delivery has not used, so he gets a different place, outfit and light rather
 * than another roll of the same dice.
 *
 * Returns null when the bucket has nothing unused left, which the caller should
 * treat as "reuse the original" rather than as a failure.
 */
export function planReplacement(
  batchId: string,
  bias: DeliveryBias,
  bucket: DatingBucket,
  usedSlots: readonly number[],
  attempt: number,
  options: PlanOptions = {}
): DeliverySlot | null {
  const excluded = options.excludeTags ?? [];
  const vibeOrder = byWeight(VIBES, bias.vibe);
  const styleOrder = byWeight(STYLES, bias.style);

  const available: Array<{ slot: number; vibe: Vibe }> = [];
  for (const group of locationGroups(bucket)) {
    const rotation = stableHash(`${batchId}:${bucket}:${group[0]}`) % 2;
    const remaining = vibeOrder.slice(1);
    if (rotation === 1) remaining.reverse();
    const groupVibes = [vibeOrder[0], ...remaining];
    group.forEach((slot, indexInGroup) => {
      if (usedSlots.includes(slot)) return;
      if (slotIsBlocked(bucket, slot, excluded)) return;
      available.push({ slot, vibe: groupVibes[indexInGroup] });
    });
  }

  if (available.length === 0) return null;

  // `attempt` walks the list so a second regeneration of the same photo lands
  // somewhere new again rather than repeating the first replacement.
  const seed = stableHash(`${batchId}:${bucket}:replace:${attempt}`);
  const pick = available[seed % available.length];

  const styleSeed = stableHash(`${batchId}:${bucket}:${pick.slot}:${attempt}`);
  const style = weightedPick(styleSeed, styleOrder, bias.style);
  const clean = VARIANTS.filter(
    (v) =>
      !definitionFor(bucket, pick.slot, v).tags.some((t) => excluded.includes(t))
  );
  // Index within the surviving variants, not within three — fewer than three
  // survive whenever the slot carries excluded content on some of them.
  const variant =
    clean.length > 0
      ? clean[styleSeed % clean.length]
      : VARIANTS[styleSeed % VARIANTS.length];

  return { bucket, slot: pick.slot, variant, vibe: pick.vibe, style };
}
