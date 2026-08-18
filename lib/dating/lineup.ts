import type { DatingBucket } from "./types";

/**
 * How a finished delivery is presented.
 *
 * The five buckets are internal architecture. Showing them as tabs told a buyer
 * the tool has five ideas and capped perceived value at five, regardless of the
 * 105 locations behind them — and it answered the wrong question. Nobody wants
 * to know how many "Travel Lifestyle" photos they got; they want to know which
 * photo goes first on Hinge.
 *
 * So the delivery is grouped by the job each photo does instead. The library is
 * already ordered by editorial intent, which makes this a static mapping with no
 * scoring model behind it.
 */

export const LINEUP_ROLES = [
  "opener",
  "fullBody",
  "whatYouDo",
  "outThere",
  "more",
] as const;

export type LineupRole = (typeof LINEUP_ROLES)[number];

export const LINEUP_LABELS: Record<LineupRole, string> = {
  opener: "Your opener",
  fullBody: "Your full body",
  whatYouDo: "What you do",
  outThere: "Out in the world",
  more: "The rest",
};

export const LINEUP_HINTS: Record<LineupRole, string> = {
  opener: "Lead with one of these. Clear face, eye contact, nothing in the way.",
  fullBody: "Profiles without a full body get read as hiding something.",
  whatYouDo: "The photo that gives someone a reason to message you.",
  outThere: "Shows a life happening outside your flat.",
  more: "Every one different — a different place, outfit and light.",
};

export type LineupInput = {
  bucket: DatingBucket;
  slot: number;
  imageWidth?: number | null;
  imageHeight?: number | null;
};

/** A 9:16 frame is the library's full-length shot. */
function isFullLength(input: LineupInput): boolean {
  if (!input.imageWidth || !input.imageHeight) return false;
  return input.imageHeight / input.imageWidth > 1.5;
}

export function lineupRoleFor(input: LineupInput): LineupRole {
  // The opener has to be a face, so it is never a full-length frame.
  if (input.bucket === "anchor" && input.slot <= 3) return "opener";
  if (isFullLength(input)) return "fullBody";
  if (input.bucket === "active") return "whatYouDo";
  if (input.bucket === "travel" || input.bucket === "street") return "outThere";
  return "more";
}

export function groupByLineup<T extends LineupInput>(
  photos: T[]
): Array<{ role: LineupRole; label: string; hint: string; photos: T[] }> {
  return LINEUP_ROLES.map((role) => ({
    role,
    label: LINEUP_LABELS[role],
    hint: LINEUP_HINTS[role],
    photos: photos.filter((photo) => lineupRoleFor(photo) === role),
  })).filter((section) => section.photos.length > 0);
}
