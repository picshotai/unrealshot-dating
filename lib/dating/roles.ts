import { SHOOT_BY_ID } from "./shoots";
import type { Framing } from "./shoots";

/**
 * The job a photo does, which is what a buyer actually wants to know.
 *
 * This used to be derived positionally from `bucket` and `slot` — the first
 * three slots of the anchor bucket were the opener, and so on. That was a
 * convention layered over an architecture, and it stopped meaning anything the
 * moment those columns went.
 *
 * Under shoots the role falls out of two real properties: what the shoot is *of*
 * and how close the frame is. Nothing is stored, nothing is guessed.
 *
 * Roles are a *filter* now, not the grouping. The grouping is the shoot — this
 * place, these clothes, this light, four ways — because that hierarchy is the
 * product. Flattening 15 shoots back into five role sections throws it away.
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

export type RoleInput = {
  shootId: string;
  frameIndex: number;
};

export function lineupRoleFor(input: RoleInput): LineupRole {
  const shoot = SHOOT_BY_ID.get(input.shootId);
  // A row whose shoot has left the library still has to land somewhere.
  if (!shoot) return "more";

  const framing: Framing | undefined = shoot.frames[input.frameIndex - 1]?.framing;

  // The opener has to be a face, so it is the close frame and nothing else —
  // which is also the frame the whole shoot was anchored on.
  if (framing === "close") return "opener";
  if (framing === "threeQuarter") return "fullBody";
  if (shoot.kind === "activity") return "whatYouDo";
  if (shoot.kind === "outdoors" || shoot.kind === "social") return "outThere";
  return "more";
}
