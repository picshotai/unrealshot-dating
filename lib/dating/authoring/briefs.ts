import type { ExcludableTag, InterestId, StylePref } from "../types";
import type { ShootKind } from "../shoots";

/**
 * A brief is the destination. Everything else is left to the model.
 *
 * Asking for "a different shoot" does not work: models pick the median, so
 * fifty calls return café, park, rooftop, library, café, park. The brief pins
 * what the shoot has to serve and how it is lit; the model invents the place,
 * the clothes, the poses and the beats.
 *
 * It is also what keeps a promise the checker enforces — every interest chip
 * must have at least one shoot behind it. If the model chose the activity
 * freely, coverage would stop being guaranteed.
 *
 * A brief is thirty seconds of work. A hand-written shoot is twenty minutes.
 * That ratio is the whole reason this scales.
 */

/**
 * Which light the shoot is under.
 *
 * This is the axis the craft rules split on, which is why it is a field rather
 * than something the model picks. Flat overcast has no direction, so asking it
 * to "catch" the underside of a chin makes the model invent a sun — but that
 * same instruction is correct under a window. The reference shoot shown to the
 * model is chosen by matching this.
 */
export type LightFamily = "window" | "overcast" | "flash" | "openDoor";

export const LIGHT_GUIDANCE: Record<LightFamily, string> = {
  window:
    "A large window filling one edge of the frame lays broad soft daylight across him, and the room falls about a stop darker away from it. Name the window's position relative to the FRAME, never relative to his body.",
  overcast:
    "Broad overcast daylight fills his face evenly from above and slightly in front. Flat light has no direction, so it fills and never catches, strikes or rakes anything.",
  flash:
    "Direct on-camera flash reaches him frontally, metered for his face so the skin holds detail and the fall-off happens behind him.",
  openDoor:
    "Broad daylight through a large opening fills his face evenly from the front and slightly above, with the interior behind him falling into soft dark shapes.",
};

export type ShootBrief = {
  /** Which interest chips this shoot answers. At least one. */
  serves: readonly InterestId[];
  register: StylePref;
  kind: ShootKind;
  light: LightFamily;
  /**
   * One line of steer, optional. Enough to stop two briefs converging on the
   * same idea, and never so much that it becomes the shoot.
   */
  hint?: string;
  /** Content this shoot will unavoidably contain, if any. */
  tags?: readonly ExcludableTag[];
};

/**
 * The first batch, written to test the generator rather than to fill the
 * library. Five briefs, deliberately spread across all four light families and
 * three registers so a bad result points at something specific.
 */
export const BRIEFS: ShootBrief[] = [
  {
    serves: ["cooking", "dining"],
    register: "casual",
    kind: "home",
    light: "window",
    hint: "a bright neighbourhood bakery or deli counter, mid-morning",
  },
  {
    serves: ["reading", "coffee"],
    register: "sharp",
    kind: "social",
    light: "window",
    hint: "a tall-windowed reading room with dark timber and green shaded lamps",
  },
  {
    serves: ["travel", "hiking"],
    register: "casual",
    kind: "outdoors",
    light: "overcast",
    hint: "a stone bridge over a wide slow river, bare hills beyond",
  },
  {
    serves: ["nightlife", "music"],
    register: "street",
    kind: "social",
    light: "flash",
    hint: "the covered entrance of a small live-music venue, late evening",
  },
  {
    serves: ["art", "travel"],
    register: "sharp",
    kind: "activity",
    light: "openDoor",
    hint: "a working ceramics studio with the loading doors open to a yard",
  },
];
