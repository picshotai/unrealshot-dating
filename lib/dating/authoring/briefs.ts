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
 * The production brief set.
 *
 * Written against what the rendered frames taught us, so the shape of this list
 * is itself a finding:
 *
 * - **Sparse locations.** Object count was the strongest predictor of a shoot
 *   failing: eight named objects scored 0 of 3, one named object scored 2 of 2.
 *   Every hint here names a place with almost nothing in it — a wall, a
 *   parapet, a shoreline, a doorway, an empty counter. Rooms full of furniture
 *   are deliberately absent.
 * - **Light weighted toward what works.** Window and overcast dominate. Flash is
 *   rationed, because low night ambient is on the model's weak list. openDoor is
 *   the compromise for interiors that have to read as workspaces.
 * - **Registers matched to the activity, not to a mood.** The single brief that
 *   paired reading with "sharp" produced a man in a blazer going to the office.
 *
 * Every interest chip appears at least twice, so no chip depends on one shoot
 * surviving review.
 */
export const BRIEFS: ShootBrief[] = [
  // ── Home and quiet ────────────────────────────────────────────────────────
  { serves: ["reading", "coffee"], register: "casual", kind: "home", light: "window",
    hint: "a plain window seat against a bare plaster wall, one mug, nothing else in the room" },
  { serves: ["coffee", "cooking"], register: "casual", kind: "home", light: "window",
    hint: "a long empty kitchen island in a pale room, one cup on it" },
  { serves: ["cooking", "dining"], register: "casual", kind: "social", light: "window",
    hint: "a bright deli counter, mid-morning, bare tiled wall behind" },
  { serves: ["reading", "music"], register: "casual", kind: "home", light: "window",
    hint: "a bare-boarded room with one armchair and a tall sash window" },
  { serves: ["music"], register: "street", kind: "home", light: "window",
    hint: "against a bare brick wall with an electric guitar on a strap, nothing else" },
  { serves: ["coffee", "reading"], register: "sharp", kind: "social", light: "window",
    hint: "a marble cafe counter along a plain wall, morning, one espresso cup" },
  { serves: ["cooking"], register: "casual", kind: "home", light: "openDoor",
    hint: "a courtyard doorway off a plain kitchen, herbs in one pot" },

  // ── Outdoors, open and sparse ─────────────────────────────────────────────
  { serves: ["hiking", "travel"], register: "casual", kind: "outdoors", light: "overcast",
    hint: "a stone bridge over a wide slow river, bare hills beyond" },
  { serves: ["hiking", "running"], register: "casual", kind: "outdoors", light: "overcast",
    hint: "an open moorland ridge, nothing but grass and sky" },
  { serves: ["running"], register: "street", kind: "activity", light: "overcast",
    hint: "an empty riverside path at first light, low mist on the water" },
  { serves: ["surfing", "travel"], register: "casual", kind: "outdoors", light: "overcast",
    hint: "a long empty shoreline at low tide, wet sand to the horizon" },
  { serves: ["sailing", "travel"], register: "sharp", kind: "outdoors", light: "overcast",
    hint: "the open foredeck of a moored sailing yacht, sea beyond" },
  { serves: ["skiing", "travel"], register: "sharp", kind: "outdoors", light: "overcast",
    hint: "a bare snow field above the treeline, one ridge behind" },
  { serves: ["climbing", "hiking"], register: "street", kind: "activity", light: "overcast",
    hint: "the foot of a clean granite slab, nothing else in frame" },
  { serves: ["dogs", "running"], register: "casual", kind: "outdoors", light: "overcast",
    hint: "an empty wide beach with a retriever, flat sand", tags: ["dog"] },
  { serves: ["dogs", "hiking"], register: "casual", kind: "outdoors", light: "window",
    hint: "a bare hillside gate in low afternoon sun with a spaniel", tags: ["dog"] },
  { serves: ["travel"], register: "sharp", kind: "outdoors", light: "overcast",
    hint: "a whitewashed coastal terrace wall, sea and sky, nothing else" },
  { serves: ["travel", "art"], register: "sharp", kind: "outdoors", light: "overcast",
    hint: "the wide stone steps of a plain civic building, empty" },
  { serves: ["hiking"], register: "casual", kind: "outdoors", light: "overcast",
    hint: "a dry-stone wall on a high fell, low cloud behind" },
  { serves: ["running", "gym"], register: "street", kind: "activity", light: "overcast",
    hint: "an empty running track, painted lanes, bare stand behind" },

  // ── Sport and activity, kept sparse ───────────────────────────────────────
  { serves: ["golf"], register: "sharp", kind: "activity", light: "overcast",
    hint: "an open links fairway, dunes far behind, one club in hand" },
  { serves: ["tennis"], register: "casual", kind: "activity", light: "overcast",
    hint: "a clay baseline, hedging far behind, one racket" },
  { serves: ["tennis", "gym"], register: "street", kind: "activity", light: "openDoor",
    hint: "a padel court doorway, glass wall, empty court behind" },
  { serves: ["boxing", "gym"], register: "street", kind: "activity", light: "openDoor",
    hint: "a plain gym wall with one heavy bag, wraps on his hands" },
  { serves: ["gym"], register: "street", kind: "activity", light: "openDoor",
    hint: "an empty weights floor by a full-height window, one barbell" },
  { serves: ["boxing"], register: "street", kind: "activity", light: "window",
    hint: "a bare corner of a boxing gym, a skipping rope and a plain wall" },
  { serves: ["football"], register: "street", kind: "activity", light: "overcast",
    hint: "the touchline of an empty pitch, bare goalmouth behind", tags: ["teamSport"] },
  { serves: ["football", "running"], register: "casual", kind: "activity", light: "overcast",
    hint: "an empty five-a-side cage at dusk, one ball", tags: ["teamSport"] },
  { serves: ["cycling"], register: "street", kind: "activity", light: "overcast",
    hint: "a bare hilltop lane with a road bike held upright", tags: ["bicycle"] },
  { serves: ["cycling", "coffee"], register: "casual", kind: "activity", light: "window",
    hint: "a plain cafe window with a bike propped outside", tags: ["bicycle"] },
  { serves: ["climbing", "gym"], register: "street", kind: "activity", light: "openDoor",
    hint: "a plain bouldering wall, two holds, chalk on his hands" },
  { serves: ["surfing"], register: "casual", kind: "activity", light: "overcast",
    hint: "a bare dune path carrying a board, marram grass" },
  { serves: ["skiing"], register: "street", kind: "activity", light: "overcast",
    hint: "an empty piste edge, skis planted in snow" },
  { serves: ["sailing"], register: "casual", kind: "activity", light: "overcast",
    hint: "a bare timber jetty, one coiled rope, open water" },
  { serves: ["motorcycles"], register: "street", kind: "activity", light: "openDoor",
    hint: "an empty workshop doorway with one motorcycle, bare concrete" },
  { serves: ["motorcycles", "travel"], register: "street", kind: "outdoors", light: "overcast",
    hint: "a bare mountain lay-by beside a parked motorcycle" },

  // ── Social, and the few places that earn tailoring ────────────────────────
  { serves: ["dining", "travel"], register: "sharp", kind: "social", light: "window",
    hint: "a plain hotel breakfast terrace, one table, city haze beyond" },
  { serves: ["dining", "nightlife"], register: "sharp", kind: "social", light: "flash",
    hint: "under a hotel entrance canopy at night, plain stone", tags: ["alcohol"] },
  { serves: ["nightlife", "music"], register: "street", kind: "social", light: "flash",
    hint: "the covered entrance of a small live-music venue, plain shutter behind" },
  { serves: ["nightlife"], register: "sharp", kind: "social", light: "flash",
    hint: "a plain lit doorway on a quiet street at night", tags: ["alcohol"] },
  { serves: ["dining"], register: "sharp", kind: "social", light: "window",
    hint: "an empty restaurant terrace before service, one glass of water" },
  { serves: ["art", "travel"], register: "sharp", kind: "social", light: "window",
    hint: "a tall bare gallery wall with one large canvas, polished floor" },
  { serves: ["art"], register: "sharp", kind: "activity", light: "openDoor",
    hint: "a working ceramics studio doorway, one wheel, bare walls" },
  { serves: ["art", "reading"], register: "casual", kind: "activity", light: "window",
    hint: "a bare studio wall with one drawing board and daylight" },
  { serves: ["coffee", "travel"], register: "casual", kind: "social", light: "openDoor",
    hint: "an open cafe doorway onto a quiet square, one cup" },

  // ── Portrait-led, where the place barely matters ──────────────────────────
  { serves: ["travel", "dining"], register: "sharp", kind: "portrait", light: "window",
    hint: "a plain painted wall in a hotel corridor, nothing else at all" },
  { serves: ["reading", "art"], register: "sharp", kind: "portrait", light: "window",
    hint: "a bare pale wall beside a tall window, empty room" },
  { serves: ["gym", "boxing"], register: "street", kind: "portrait", light: "openDoor",
    hint: "a plain concrete wall in daylight, nothing else" },
  { serves: ["music", "nightlife"], register: "street", kind: "portrait", light: "flash",
    hint: "a plain dark wall at night, flash only" },
  { serves: ["hiking", "travel"], register: "casual", kind: "portrait", light: "overcast",
    hint: "open sky behind him on a bare hilltop, no landmarks" },
  { serves: ["cooking", "coffee"], register: "casual", kind: "portrait", light: "window",
    hint: "a plain tiled wall, morning light, an empty counter" },
  { serves: ["golf", "sailing"], register: "sharp", kind: "portrait", light: "overcast",
    hint: "a plain clubhouse wall in flat daylight" },
  { serves: ["surfing", "skiing"], register: "casual", kind: "portrait", light: "overcast",
    hint: "bare sky and one horizon line behind him" },
];

