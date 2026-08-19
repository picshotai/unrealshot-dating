export const DATING_BUCKETS = [
  "anchor",
  "social",
  "travel",
  "active",
  "street",
] as const;

export type DatingBucket = (typeof DATING_BUCKETS)[number];

export const BUCKET_LABELS: Record<DatingBucket, string> = {
  anchor: "The Anchor Portrait",
  social: "The Social Candid",
  travel: "The Travel Lifestyle",
  active: "The Active Vitality",
  street: "The Casual Streetwear",
};

export const BUCKET_DESCRIPTIONS: Record<DatingBucket, string> = {
  anchor: "Trust + facial clarity — your primary profile photo",
  social: "Extraversion + social proof — mid-shot café energy",
  travel: "Value + worldliness — golden hour lifestyle",
  active: "Fitness + momentum — no gym-mirror ego",
  street: "Authenticity — organic city candid",
};

export type Vibe = "urban" | "outdoorsy" | "homebody";
export type StylePref = "casual" | "sharp" | "street";

export type OrderStatus =
  | "queued"
  | "developing"
  | "ready"
  | "partial_failed"
  | "failed";

export type PhotoStatus = "pending" | "in_progress" | "completed" | "failed";

/**
 * The library holds more slots than a delivery uses. The surplus is what lets
 * an exclusion ("no dog photos", "no alcohol") drop a slot and refill from an
 * unused one, so the delivery keeps 100 photos in 100 different locations
 * instead of repeating a place or quietly shrinking.
 */
export const SLOTS_PER_BUCKET = 26;
export const PHOTOS_PER_BUCKET = 20;
export const TOTAL_PHOTOS = 100;
/**
 * What one shoot costs the user. A shoot commits ~100 GPU generations, so this
 * is the number that stops the pipeline being free. Override per environment
 * with DATING_SHOOT_CREDIT_COST when pricing changes, without a code change.
 */
export const SHOOT_CREDIT_COST = Number(
  process.env.DATING_SHOOT_CREDIT_COST ?? 100
);

/** Free regenerations included with a delivered shoot. */
export const CUSTOM_CREDITS_DEFAULT = 30;

/**
 * Real photos per bucket in sample mode — 4 × 5 buckets = 20 per run.
 *
 * One per bucket was too few to judge anything: wardrobe range and scene
 * variety are properties of the spread, not of five images. Override with
 * DATING_SAMPLE_PER_BUCKET when a cheaper or wider run is wanted.
 */
export const SAMPLE_PHOTOS_PER_BUCKET = Number(
  process.env.DATING_SAMPLE_PER_BUCKET ?? 4
);

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
export const MIN_COMPLETE_THRESHOLD = 85;
export const FAL_BATCH_SIZE = 5;
export const FAL_BATCH_GAP_MS = 3000;
export const MAX_PHOTO_ATTEMPTS = 3;
