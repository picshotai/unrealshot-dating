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

export const PHOTOS_PER_BUCKET = 20;
export const TOTAL_PHOTOS = 100;
export const CUSTOM_CREDITS_DEFAULT = 30;
export const MIN_COMPLETE_THRESHOLD = 85;
export const FAL_BATCH_SIZE = 5;
export const FAL_BATCH_GAP_MS = 3000;
export const MAX_PHOTO_ATTEMPTS = 3;
