export type Vibe = "urban" | "outdoorsy" | "homebody";
export type StylePref = "casual" | "sharp" | "street";

export type OrderStatus =
  | "queued"
  | "developing"
  | "ready"
  | "partial_failed"
  | "failed"
  // Thrown by finalizeBatch since the pipeline was written, but missing from
  // this union until now, so anything narrowing on status silently missed it.
  | "failed_components_present";

export type PhotoStatus = "pending" | "in_progress" | "completed" | "failed";

export {
  FRAMES_PER_SHOOT,
  SAMPLE_SHOOTS,
  SHOOTS_PER_DELIVERY,
  SUBJECT_LED_SHOOTS_PER_DELIVERY,
  TOTAL_PHOTOS,
} from "./product-settings";
import {
  SHOOTS_PER_DELIVERY,
} from "./product-settings";

/**
 * A delivery is SHOOTS_PER_DELIVERY shoots of FRAMES_PER_SHOOT frames.
 *
 * Four frames, not five: five forced two mediums into every shoot, and frames
 * competing at the same distance are where the model rendered one as another.
 * TOTAL_PHOTOS is derived so the three numbers cannot drift apart.
 */

/**
 * What one delivery costs the user. Override per environment with
 * DATING_SHOOT_CREDIT_COST when pricing changes, without a code change.
 */
export const SHOOT_CREDIT_COST = Number(
  process.env.DATING_SHOOT_CREDIT_COST ?? 60
);

/** Free regenerations included with a delivered shoot. */
export const CUSTOM_CREDITS_DEFAULT = 30;

/**
 * Whole shoots rendered for real in sample mode.
 *
 * Sampling individual frames cannot answer the only question worth asking of
 * this library — whether a shoot holds together across its frames. So a sample
 * run renders complete shoots and mocks the rest.
 */

/**
 * How many shoots the balance can pay for.
 *
 * Credits are an implementation detail of the wallet. A buyer thinks in packs
 * ("I bought one shoot"), and showing a raw figure invites the wrong question —
 * a balance of 100 reads as either a lot or nothing depending on whether you
 * happen to know the price. Every user-facing surface goes through this.
 */
export function packsFromCredits(balance: number): number {
  if (!Number.isFinite(balance) || balance <= 0) return 0;
  return Math.floor(balance / SHOOT_CREDIT_COST);
}

/** Statuses that mean a shoot is already running for this user. */
export const ACTIVE_ORDER_STATUSES = ["queued", "developing"] as const;

/** Content a user can ask us to leave out of their delivery. */
export const EXCLUDABLE_TAGS = ["alcohol", "dog", "bicycle", "teamSport"] as const;
export type ExcludableTag = (typeof EXCLUDABLE_TAGS)[number];

/**
 * The things a man can say he does.
 *
 * Lives here rather than in interests.ts because the prompt library needs it to
 * declare what a scene depicts, and interests.ts already imports from the
 * selection module — putting it there would close a cycle.
 */
export const INTEREST_IDS = [
  "gym",
  "running",
  "hiking",
  "climbing",
  "cycling",
  "dogs",
  "coffee",
  "nightlife",
  "cooking",
  "reading",
  "music",
  "travel",
  "football",
  "motorcycles",
  "art",
  "surfing",
  // Added for the buyer this product is actually for.
  "golf",
  "tennis",
  "sailing",
  "skiing",
  "dining",
  "boxing",
] as const;
export type InterestId = (typeof INTEREST_IDS)[number];
/**
 * How many whole shoots must survive for a delivery to count as delivered.
 *
 * The old threshold was a flat photo count, which at 60 photos was unreachable —
 * `completed < 85` was true of every possible delivery, so a single failure sent
 * the order to failed_components_present. Counting shoots is also the more
 * honest measure: 11 broken shoots is a worse set than 12 whole ones.
 */
export const MIN_COMPLETE_SHOOTS = 10;
