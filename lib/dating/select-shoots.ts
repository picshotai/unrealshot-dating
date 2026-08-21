import {
  SHOOTS,
  SHOOT_BY_ID,
  ANCHOR_FRAMING,
  type Shoot,
  type ShootFrame,
  type ShootKind,
} from "./shoots";
import {
  FRAMES_PER_SHOOT,
  SHOOTS_PER_DELIVERY,
  type ExcludableTag,
  type InterestId,
  type StylePref,
} from "./types";
import type { ShootLightFamily } from "./shoot-catalog";

/** FNV-1a. Selection stays reproducible for retries of the same order. */
export function stableHash(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export type PlannedFrame = {
  shootId: string;
  /** 1-based, and the frame's position within its shoot. */
  frameIndex: number;
  framing: ShootFrame["framing"];
  prompt: string;
  imageSize: ShootFrame["imageSize"];
  /** Generated in wave one; its output becomes the scene reference for the rest. */
  isAnchor: boolean;
};

export type PlanShootsOptions = {
  interests?: readonly InterestId[];
  excludeTags?: readonly ExcludableTag[];
  /** Which wardrobe register to lean toward. Never a lock. */
  dress?: StylePref;
  /** Shoot ids from newest use to oldest use for this customer. */
  previousShootIds?: readonly string[];
  /** Recent global frequency by concept family, used to spread inventory. */
  globalConceptUsage?: Readonly<Record<string, number>>;
};

/** Two distinct concepts can show an interest; semantic-family repeats cannot. */
export const MAX_SHOOTS_PER_INTEREST = 2;
export const MAX_SHOOTS_PER_SETTING_FAMILY = 2;

export const MIN_SHOOTS_BY_KIND: Readonly<Record<ShootKind, number>> = {
  portrait: 1,
  home: 2,
  outdoors: 3,
  social: 3,
  activity: 2,
};

/** Fill scarce dating-profile categories before flexible portrait/activity slots. */
const KIND_FILL_ORDER: readonly ShootKind[] = [
  "home",
  "social",
  "outdoors",
  "activity",
  "portrait",
];

export const MAX_SHOOTS_BY_KIND: Readonly<Record<ShootKind, number>> = {
  portrait: 2,
  home: 3,
  outdoors: 5,
  social: 4,
  activity: 5,
};

/** Avoid a delivery made entirely from flat overcast or empty window rooms. */
export const MIN_SHOOTS_BY_LIGHT: Readonly<Record<ShootLightFamily, number>> = {
  window: 3,
  "open-door": 1,
  overcast: 3,
  // There are three approved flash concepts today. Requiring two would make a
  // concept-fresh second purchase mathematically impossible.
  flash: 1,
};

const INTEREST_MATCH = 100;
const REGISTER_MATCH = 40;
const JITTER = 60;
// Inventory rotation outranks a soft preference match. Otherwise identical
// answers keep drawing the same popular concepts even when their complete
// fingerprints differ.
const GLOBAL_USAGE_PENALTY = 120;

function isBlocked(shoot: Shoot, excluded: readonly ExcludableTag[]): boolean {
  return (shoot.tags ?? []).some((tag) => excluded.includes(tag));
}

function matchedInterests(
  shoot: Shoot,
  interests: readonly InterestId[]
): InterestId[] {
  return (shoot.interests ?? []).filter((id) => interests.includes(id));
}

type SelectionState = {
  chosen: Shoot[];
  concepts: Set<string>;
  settings: Map<string, number>;
  representedInterests: Set<InterestId>;
  interests: Map<InterestId, number>;
  kinds: Map<ShootKind, number>;
  lights: Map<ShootLightFamily, number>;
};

function emptyState(): SelectionState {
  return {
    chosen: [],
    concepts: new Set(),
    settings: new Map(),
    representedInterests: new Set(),
    interests: new Map(),
    kinds: new Map(),
    lights: new Map(),
  };
}

function count<K>(map: ReadonlyMap<K, number>, key: K): number {
  return map.get(key) ?? 0;
}

function canTake(
  state: SelectionState,
  shoot: Shoot,
  requestedInterests: readonly InterestId[],
  enforceKindMaximums: boolean
): boolean {
  if (state.concepts.has(shoot.conceptFamily)) return false;
  if (count(state.settings, shoot.settingFamily) >= MAX_SHOOTS_PER_SETTING_FAMILY) {
    return false;
  }
  if (
    enforceKindMaximums &&
    count(state.kinds, shoot.kind) >= MAX_SHOOTS_BY_KIND[shoot.kind]
  ) {
    return false;
  }
  // Only three active flash concepts exist. Keeping at least one in reserve is
  // what lets a repeat buyer receive a fully concept-fresh second portfolio.
  if (shoot.lightFamily === "flash" && count(state.lights, "flash") >= 2) {
    return false;
  }

  const matches = matchedInterests(shoot, requestedInterests);
  const cappedKind = shoot.kind === "activity" || shoot.kind === "outdoors";
  if (
    cappedKind &&
    matches.some((id) => count(state.interests, id) >= MAX_SHOOTS_PER_INTEREST)
  ) {
    return false;
  }
  return true;
}

function take(
  state: SelectionState,
  shoot: Shoot,
  requestedInterests: readonly InterestId[]
): void {
  state.chosen.push(shoot);
  state.concepts.add(shoot.conceptFamily);
  state.settings.set(shoot.settingFamily, count(state.settings, shoot.settingFamily) + 1);
  state.kinds.set(shoot.kind, count(state.kinds, shoot.kind) + 1);
  state.lights.set(shoot.lightFamily, count(state.lights, shoot.lightFamily) + 1);
  for (const id of matchedInterests(shoot, requestedInterests)) {
    state.representedInterests.add(id);
    if (shoot.kind === "activity" || shoot.kind === "outdoors") {
      state.interests.set(id, count(state.interests, id) + 1);
    }
  }
}

function copyState(state: SelectionState): SelectionState {
  return {
    chosen: [...state.chosen],
    concepts: new Set(state.concepts),
    settings: new Map(state.settings),
    representedInterests: new Set(state.representedInterests),
    interests: new Map(state.interests),
    kinds: new Map(state.kinds),
    lights: new Map(state.lights),
  };
}

/** Fast necessary-capacity check used to keep a fresh second portfolio viable. */
function hasPortfolioCapacity(pool: readonly Shoot[]): boolean {
  if (new Set(pool.map((shoot) => shoot.conceptFamily)).size < SHOOTS_PER_DELIVERY) {
    return false;
  }
  for (const kind of KIND_FILL_ORDER) {
    const concepts = new Set(
      pool.filter((shoot) => shoot.kind === kind).map((shoot) => shoot.conceptFamily)
    );
    if (concepts.size < MIN_SHOOTS_BY_KIND[kind]) return false;
  }
  for (const [light, minimum] of Object.entries(MIN_SHOOTS_BY_LIGHT) as Array<
    [ShootLightFamily, number]
  >) {
    const concepts = new Set(
      pool
        .filter((shoot) => shoot.lightFamily === light)
        .map((shoot) => shoot.conceptFamily)
    );
    if (concepts.size < minimum) return false;
  }

  const settings = new Map<string, Set<string>>();
  for (const shoot of pool) {
    const concepts = settings.get(shoot.settingFamily) ?? new Set<string>();
    concepts.add(shoot.conceptFamily);
    settings.set(shoot.settingFamily, concepts);
  }
  const settingCapacity = [...settings.values()].reduce(
    (sum, concepts) => sum + Math.min(concepts.size, MAX_SHOOTS_PER_SETTING_FAMILY),
    0
  );
  return settingCapacity >= SHOOTS_PER_DELIVERY;
}

function selectFromPool(
  pool: readonly Shoot[],
  ordered: readonly Shoot[],
  interests: readonly InterestId[],
  reserveForNext?: readonly Shoot[]
): Shoot[] | null {
  const allowed = new Set(pool.map((shoot) => shoot.id));
  const candidates = ordered.filter((shoot) => allowed.has(shoot.id));
  let visited = 0;

  const search = (state: SelectionState): Shoot[] | null => {
    visited += 1;
    if (state.chosen.length === SHOOTS_PER_DELIVERY) {
      const kindsPass = KIND_FILL_ORDER.every(
        (kind) => count(state.kinds, kind) >= MIN_SHOOTS_BY_KIND[kind]
      );
      const lightsPass = (
        Object.entries(MIN_SHOOTS_BY_LIGHT) as Array<[ShootLightFamily, number]>
      ).every(([light, minimum]) => count(state.lights, light) >= minimum);
      return kindsPass && lightsPass ? state.chosen : null;
    }

    const remainingSlots = SHOOTS_PER_DELIVERY - state.chosen.length;
    const eligible = candidates.filter(
      (candidate) => {
        if (
          state.chosen.some((chosen) => chosen.id === candidate.id) ||
          !canTake(state, candidate, interests, true)
        ) {
          return false;
        }
        if (!reserveForNext) return true;
        const usedConcepts = new Set(state.concepts);
        usedConcepts.add(candidate.conceptFamily);
        return hasPortfolioCapacity(
          reserveForNext.filter(
            (shoot) => !usedConcepts.has(shoot.conceptFamily)
          )
        );
      }
    );

    // These cheap bounds stop the search before it walks a branch whose
    // remaining concepts cannot possibly satisfy a portfolio minimum.
    if (new Set(eligible.map((shoot) => shoot.conceptFamily)).size < remainingSlots) {
      return null;
    }

    type Requirement = {
      gap: number;
      candidates: Shoot[];
    };
    const requirements: Requirement[] = [];
    let totalKindGap = 0;
    for (const kind of KIND_FILL_ORDER) {
      const gap = Math.max(0, MIN_SHOOTS_BY_KIND[kind] - count(state.kinds, kind));
      totalKindGap += gap;
      if (gap > 0) {
        requirements.push({ gap, candidates: eligible.filter((shoot) => shoot.kind === kind) });
      }
    }
    if (totalKindGap > remainingSlots) return null;

    let totalLightGap = 0;
    for (const [light, minimum] of Object.entries(MIN_SHOOTS_BY_LIGHT) as Array<
      [ShootLightFamily, number]
    >) {
      const gap = Math.max(0, minimum - count(state.lights, light));
      totalLightGap += gap;
      if (gap > 0) {
        requirements.push({
          gap,
          candidates: eligible.filter((shoot) => shoot.lightFamily === light),
        });
      }
    }
    if (totalLightGap > remainingSlots) return null;
    if (requirements.some((requirement) => requirement.candidates.length < requirement.gap)) {
      return null;
    }

    // Branch on the scarcest unmet requirement first. Candidate order still
    // carries interest, wardrobe, global-usage and deterministic jitter scores.
    const requirement = requirements.sort(
      (left, right) =>
        left.candidates.length / left.gap - right.candidates.length / right.gap
    )[0];
    const branches = requirement?.candidates ?? eligible;

    for (const shoot of branches) {
      const next = copyState(state);
      take(next, shoot, interests);
      const result = search(next);
      if (result) return result;
    }
    return null;
  };

  const result = search(emptyState());
  if (!result && process.env.DATING_DEBUG_SELECTION === "1") {
    console.error("selection constraint search failed", {
      pool: pool.length,
      candidates: candidates.length,
      visited,
    });
  }
  return result;
}

/**
 * Chooses a coherent portfolio rather than independently taking the top scores.
 *
 * Novelty priority is strict: first try concepts the customer has never seen,
 * then exact shoots they have never seen, then the whole library with oldest
 * prior uses ranked first. Each attempt still enforces semantic uniqueness and
 * portfolio balance. If those constraints cannot fill a delivery, creation
 * fails loudly instead of silently shipping duplicates.
 */
export function planShootDelivery(
  selectionSeed: string,
  options: PlanShootsOptions = {}
): PlannedFrame[] {
  const interests = options.interests ?? [];
  const excluded = options.excludeTags ?? [];
  const previousShootIds = [...new Set(options.previousShootIds ?? [])];
  const globalConceptUsage = options.globalConceptUsage ?? {};
  const previousSet = new Set(previousShootIds);
  const previousConcepts = new Set(
    previousShootIds
      .map((id) => SHOOT_BY_ID.get(id)?.conceptFamily)
      .filter((value): value is string => Boolean(value))
  );
  const historyRank = new Map(previousShootIds.map((id, index) => [id, index]));

  const available = SHOOTS.filter(
    (shoot) => shoot.availability === "active" && !isBlocked(shoot, excluded)
  );

  if (available.length < SHOOTS_PER_DELIVERY) {
    throw new Error(
      `Only ${available.length} active shoots are usable after exclusions [${excluded.join(", ") || "none"}]; ` +
        `a delivery needs ${SHOOTS_PER_DELIVERY}.`
    );
  }

  const baseScore = (shoot: Shoot): number => {
    let value = 0;
    if (matchedInterests(shoot, interests).length > 0) value += INTEREST_MATCH;
    if (options.dress && shoot.register === options.dress) value += REGISTER_MATCH;
    value -= (globalConceptUsage[shoot.conceptFamily] ?? 0) * GLOBAL_USAGE_PENALTY;
    value += stableHash(`${selectionSeed}:${shoot.id}`) % JITTER;
    return value;
  };

  const ordered = [...available].sort((a, b) => {
    const aHistory = historyRank.get(a.id);
    const bHistory = historyRank.get(b.id);
    if (aHistory === undefined && bHistory !== undefined) return -1;
    if (aHistory !== undefined && bHistory === undefined) return 1;
    // History is newest-first, so the larger index is the older and safer reuse.
    if (aHistory !== undefined && bHistory !== undefined && aHistory !== bHistory) {
      return bHistory - aHistory;
    }
    return baseScore(b) - baseScore(a) || a.id.localeCompare(b.id);
  });

  const neverSeenConcept = available.filter(
    (shoot) => !previousSet.has(shoot.id) && !previousConcepts.has(shoot.conceptFamily)
  );
  const neverSeenShoot = available.filter((shoot) => !previousSet.has(shoot.id));
  const attempts = [
    neverSeenConcept,
    neverSeenShoot,
    available,
  ];

  let chosen: Shoot[] | null = null;
  for (const pool of attempts) {
    if (pool.length < SHOOTS_PER_DELIVERY) continue;
    const activeConceptCount = new Set(
      available.map((shoot) => shoot.conceptFamily)
    ).size;
    const preserveConceptFreshSecondPurchase =
      previousShootIds.length === 0 &&
      activeConceptCount >= SHOOTS_PER_DELIVERY * 2;

    // A valid first portfolio can still consume the only concepts that make a
    // balanced second portfolio possible. Preserve enough kind/light/setting
    // capacity in the complement while the constraint search is choosing it.
    chosen = selectFromPool(
      pool,
      ordered,
      interests,
      preserveConceptFreshSecondPurchase ? available : undefined
    );
    if (chosen) break;
  }

  if (!chosen) {
    throw new Error(
      "The active shoot library cannot satisfy semantic diversity and portfolio balance for this order"
    );
  }

  return chosen.flatMap((shoot) =>
    shoot.frames.map((frame, position) => ({
      shootId: shoot.id,
      frameIndex: position + 1,
      framing: frame.framing,
      prompt: frame.prompt,
      imageSize: frame.imageSize,
      isAnchor: frame.framing === ANCHOR_FRAMING,
    }))
  );
}

export function shootIdsInPlan(plan: readonly PlannedFrame[]): string[] {
  return [...new Set(plan.map((frame) => frame.shootId))];
}

export function deliveryConcepts(plan: readonly PlannedFrame[]): string[] {
  return [
    ...new Set(
      shootIdsInPlan(plan).map((id) => {
        const shoot = SHOOT_BY_ID.get(id);
        if (!shoot) throw new Error(`Cannot resolve concept for missing shoot ${id}`);
        return shoot.conceptFamily;
      })
    ),
  ].sort();
}

/**
 * Stable semantic input for the database's global unique index.
 *
 * Exact ids are too weak: two lineups made from different variants of the same
 * concepts still look like the same product. Version the value so a future
 * catalog taxonomy can coexist with reservations made under this one.
 */
export function deliveryFingerprint(plan: readonly PlannedFrame[]): string {
  return `semantic-v1:${deliveryConcepts(plan).join("|")}`;
}

export function assertDeliveryShape(plan: PlannedFrame[]): void {
  const byShoot = new Map<string, PlannedFrame[]>();
  for (const frame of plan) {
    const list = byShoot.get(frame.shootId) ?? [];
    list.push(frame);
    byShoot.set(frame.shootId, list);
  }

  if (byShoot.size !== SHOOTS_PER_DELIVERY) {
    throw new Error(`Delivery has ${byShoot.size} shoots; expected ${SHOOTS_PER_DELIVERY}`);
  }

  const concepts = new Set<string>();
  for (const [shootId, frames] of byShoot) {
    if (frames.length !== FRAMES_PER_SHOOT) {
      throw new Error(
        `Shoot ${shootId} contributed ${frames.length} frames; expected ${FRAMES_PER_SHOOT}`
      );
    }
    const shoot = SHOOT_BY_ID.get(shootId);
    if (!shoot || shoot.availability !== "active") {
      throw new Error(`Delivery contains missing or quarantined shoot ${shootId}`);
    }
    if (concepts.has(shoot.conceptFamily)) {
      throw new Error(`Delivery repeats concept family ${shoot.conceptFamily}`);
    }
    concepts.add(shoot.conceptFamily);

    const anchors = frames.filter((frame) => frame.isAnchor);
    if (anchors.length !== 1) {
      throw new Error(`Shoot ${shootId} has ${anchors.length} anchors; expected exactly 1`);
    }
    if (new Set(frames.map((frame) => frame.frameIndex)).size !== frames.length) {
      throw new Error(`Shoot ${shootId} repeats a frame index`);
    }
  }
}
