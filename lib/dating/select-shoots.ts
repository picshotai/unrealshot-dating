import { SHOOTS, ANCHOR_FRAMING, type Shoot, type ShootFrame } from "./shoots";
import {
  FRAMES_PER_SHOOT,
  SHOOTS_PER_DELIVERY,
  type ExcludableTag,
  type InterestId,
  type StylePref,
} from "./types";

/**
 * Chooses which shoots a delivery contains.
 *
 * The old planner composed each photo from independent parts, which is what let
 * a topcoat land on a forest trail. This one never composes anything: a shoot is
 * already coherent when it is authored, so preferences only decide *which*
 * authored shoots a man receives. That single change is what makes an interest
 * chip a promise — pick hiking and you get shoots written around hiking, rather
 * than a generic venue with the word dropped into it.
 */

/** FNV-1a. Same construction the old planner used, so orders stay reproducible. */
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
};

/**
 * How many shoots one interest may claim.
 *
 * Without a ceiling a man who taps a single chip gets a delivery entirely of
 * that one thing. With it, his interests show up alongside the ordinary shoots
 * rather than replacing them.
 */
const MAX_SHOOTS_PER_INTEREST = 3;

const INTEREST_MATCH = 100;
const REGISTER_MATCH = 40;

function isBlocked(shoot: Shoot, excluded: readonly ExcludableTag[]): boolean {
  if (excluded.length === 0) return false;
  return (shoot.tags ?? []).some((tag) => excluded.includes(tag));
}

function matchedInterests(
  shoot: Shoot,
  interests: readonly InterestId[]
): InterestId[] {
  if (interests.length === 0) return [];
  return (shoot.interests ?? []).filter((id) => interests.includes(id));
}

export function planShootDelivery(
  batchId: string,
  options: PlanShootsOptions = {}
): PlannedFrame[] {
  const interests = options.interests ?? [];
  const excluded = options.excludeTags ?? [];

  const available = SHOOTS.filter((shoot) => !isBlocked(shoot, excluded));

  if (available.length < SHOOTS_PER_DELIVERY) {
    // Loud rather than quiet: a short delivery is a broken promise, and with a
    // hand-authored library the fix is to write more shoots, not to repeat one.
    throw new Error(
      `Only ${available.length} shoots are usable after exclusions [${excluded.join(", ") || "none"}]; ` +
        `a delivery needs ${SHOOTS_PER_DELIVERY}. Author more shoots or lower SHOOTS_PER_DELIVERY.`
    );
  }

  const ranked = [...available].sort((a, b) => score(b) - score(a));

  function score(shoot: Shoot): number {
    let value = 0;
    if (matchedInterests(shoot, interests).length > 0) value += INTEREST_MATCH;
    if (options.dress && shoot.register === options.dress) value += REGISTER_MATCH;
    // Seeded jitter, so two men with identical answers still get different sets
    // and the same man ordering twice does too.
    value += stableHash(`${batchId}:${shoot.id}`) % 25;
    return value;
  }

  // Take in ranked order, but stop one interest owning the delivery. A shoot
  // over its interest's cap drops to the back rather than out, so the delivery
  // still fills.
  const claimed = new Map<InterestId, number>();
  const taken: Shoot[] = [];
  const deferred: Shoot[] = [];

  for (const shoot of ranked) {
    const matches = matchedInterests(shoot, interests);
    const atCap = matches.some(
      (id) => (claimed.get(id) ?? 0) >= MAX_SHOOTS_PER_INTEREST
    );
    if (atCap) {
      deferred.push(shoot);
      continue;
    }
    for (const id of matches) claimed.set(id, (claimed.get(id) ?? 0) + 1);
    taken.push(shoot);
  }

  const chosen = [...taken, ...deferred].slice(0, SHOOTS_PER_DELIVERY);

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

/**
 * Every delivery must contain exactly one anchor per shoot and a full set of
 * frames. Called at order creation, before any GPU work is dispatched, because
 * a shoot missing its anchor cannot carry its own scene.
 */
export function assertDeliveryShape(plan: PlannedFrame[]): void {
  const byShoot = new Map<string, PlannedFrame[]>();
  for (const frame of plan) {
    const list = byShoot.get(frame.shootId) ?? [];
    list.push(frame);
    byShoot.set(frame.shootId, list);
  }

  if (byShoot.size !== SHOOTS_PER_DELIVERY) {
    throw new Error(
      `Delivery has ${byShoot.size} shoots; expected ${SHOOTS_PER_DELIVERY}`
    );
  }

  for (const [shootId, frames] of byShoot) {
    if (frames.length !== FRAMES_PER_SHOOT) {
      throw new Error(
        `Shoot ${shootId} contributed ${frames.length} frames; expected ${FRAMES_PER_SHOOT}`
      );
    }
    const anchors = frames.filter((frame) => frame.isAnchor);
    if (anchors.length !== 1) {
      throw new Error(
        `Shoot ${shootId} has ${anchors.length} anchors; expected exactly 1`
      );
    }
    const indices = new Set(frames.map((frame) => frame.frameIndex));
    if (indices.size !== frames.length) {
      throw new Error(`Shoot ${shootId} repeats a frame index`);
    }
  }
}
