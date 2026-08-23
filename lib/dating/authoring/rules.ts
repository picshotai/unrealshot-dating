import { FRAMINGS, ANCHOR_FRAMING, type Framing, type ShootKind } from "../shoots";
import {
  FRAMES_PER_SHOOT,
  type ExcludableTag,
  type InterestId,
  type StylePref,
} from "../types";

/**
 * The craft rules, in one place, enforced in two.
 *
 * Every one of these was paid for by a frame that failed in the format test
 * (docs/shoot-test-01.md): a step that floated into the middle of a road because
 * nothing owned it, a neck turned past breaking because the instruction had no
 * ceiling, a bilateral pose the model cannot hold, a light told to "catch" a
 * surface under flat overcast so the model invented a sun for it.
 *
 * They started as lint over hand-written prompts. They are now also the gate a
 * generated shoot has to pass before it can enter the library, which is what
 * makes generation safe: the old compositional system's fatal flaw was that
 * nothing ever read its output, and this reads every line of it.
 *
 * `scripts/check-shoots.ts` runs these over the committed library.
 * `scripts/generate-shoots.ts` runs them over model output and retries on fail.
 */

/** The shape a candidate must have. Structurally identical to `Shoot`. */
export type CandidateFrame = {
  framing: Framing;
  imageSize: { width: number; height: number };
  prompt: string;
};

export type CandidateShoot = {
  id: string;
  title: string;
  kind: ShootKind;
  register: StylePref;
  interests?: readonly InterestId[];
  tags?: readonly ExcludableTag[];
  frames: readonly CandidateFrame[];
};

export type CraftRule = {
  name: string;
  why: string;
  test: (prompt: string) => boolean;
};

export const CRAFT_RULES: CraftRule[] = [
  {
    name: "negation",
    why: "the model reads a forbidden noun as a requested one",
    test: (p) =>
      !/\b(no|not|never|avoid|without|nor|cannot|neither|none|nothing|lack|instead of|rather than|free of)\b|n't\b/i.test(p),
  },
  {
    name: "second person",
    why: "an undescribed person is rendered with his face",
    test: (p) =>
      !/\b(people|someone|somebody|friends?|companions?|guests?|visitors?|figures|crowds?|passers-by|diners|commuters|photographer)\b/i.test(p),
  },
  {
    name: "text objects",
    why: "rendered as gibberish writing",
    test: (p) =>
      !/\b(sign|signs|signage|menu|menus|map|maps|label|labels|poster|posters|timetable|noticeboard|newspaper)\b/i.test(p),
  },
  {
    name: "gaze target",
    why: "a frame with no stated gaze drifts",
    test: (p) => /\b(lens|camera)\b/.test(p),
  },
  {
    name: "hands placed",
    why: "unplaced hands are where anatomy fails",
    test: (p) =>
      /\b(hand|hands|palm|palms|forearm|forearms|finger|fingers|elbow|elbows|wrist|knuckles|grip|grips)\b/.test(p),
  },
  {
    name: "subject distance",
    why: "without a stated distance the background competes with him",
    // Singular counts. A bare wall right behind him is "half a metre", and the
    // plural-only version of this rejected three otherwise valid attempts at a
    // shoot whose whole point was that the background is close.
    test: (p) => /\bmetres?\b/.test(p),
  },
  {
    name: "skin texture",
    why: "the plastic-skin look is what makes a photo read as generated",
    test: (p) => /\b(pores?|texture|grain|stubble|creases)\b/i.test(p),
  },
  {
    name: "one light source placed",
    why: "C5 placed the light three times and the model invented a sun for each",
    // Counts sentences that *place* a source, not every mention of it. A texture
    // clause saying "forearm hair catching the daylight" describes what to keep,
    // not where the light is, and the frame that did that scored usable.
    test: (p) =>
      p
        .split(/(?<=\.)\s+/)
        .filter(
          (sentence) =>
            /\b(daylight|flash|sunlight|window light)\b/i.test(sentence) &&
            /\b(fills?|filling|lays|laying|falls?|reaches?|strikes?|arrives?|comes from)\b/i.test(sentence)
        ).length <= 1,
  },
  {
    name: "frame-relative light",
    why: '"a window to his left" rendered on frame-left, which is his right',
    test: (p) => !/\b(window|light|flash)[^.]{0,40}\bto his (left|right)\b/i.test(p),
  },
  {
    name: "no bilateral pose",
    why: "symmetry is on the model's weak list and it produced a floating pose",
    test: (p) =>
      !/\bboth (palms|hands) (set |resting |flat )?(flat )?(on|across)\b[^.]{0,40}\b(shoulder-width|either side|between them)\b/i.test(p),
  },
  {
    name: "no tipped-back head",
    why: "it foreshortens the face and is where identity drifted twice",
    test: (p) => !/\bhead (tipped|tilted) back\b/i.test(p),
  },
  {
    name: "body-relative side",
    why: 'the model reads "his left" as frame-left, which is his right, so the pose comes out mirrored',
    // The same failure as the light rule, on a different noun. The first
    // generated batch used it thirteen times across five shoots; the eighteen
    // hand-written shoots use it zero times, saying "one shoulder sits lower
    // than the other" instead.
    test: (p) => !/\bhis (left|right)\b/i.test(p),
  },
  {
    name: "no repeated phrase",
    why: "a prompt that restates its own location came back as broken English",
    // "He leans against the parapet of the bridge with his weight on one hip on
    // a stone bridge over a wide slow river…" — the model varied the opening
    // clause and then appended the canonical one anyway.
    test: (prompt) => {
      const words = prompt
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, " ")
        .split(/[ ]+/)
        .filter(Boolean);
      const seen = new Set<string>();
      for (let i = 0; i + 6 <= words.length; i += 1) {
        const gram = words.slice(i, i + 6).join(" ");
        if (seen.has(gram)) return false;
        seen.add(gram);
      }
      return true;
    },
  },
];

/**
 * Movable things the prompt asks the model to place somewhere.
 *
 * This is not a pass/fail rule, and deliberately so: it is the strongest signal
 * in the render data but it rests on eight rendered shoots, and a hard cap tuned
 * to eight data points would fail two shoots in the hand-written library that
 * have never been rendered. So it is reported, and the generator is instructed
 * to keep it low.
 *
 * The correlation it comes from:
 *
 *   8 objects named -> 0 of 3 usable   (a sofa replaced a bookshelf; a table
 *                                       landed where a man has to stand)
 *   3 objects named -> 2 of 3 usable
 *   1 object named  -> 2 of 2 usable   (the best frames of the batch)
 *
 * Every named object is one the model re-places from scratch in every frame,
 * because the anchor carries wardrobe, light and identity but NOT geometry.
 */
const PLACED_OBJECT =
  /\b(sofa|armchair|chair|stool|bench|table|desk|lectern|cabinet|cabinets|shelf|shelves|shelving|bookshelf|lamp|rack|racks|crate|counter|parapet|railing|rail|balustrade|workbench|display case)\b/gi;

export function placedObjects(prompt: string): string[] {
  return [...new Set((prompt.match(PLACED_OBJECT) ?? []).map((w) => w.toLowerCase()))];
}

/** The distinct objects a whole shoot asks the model to keep track of. */
export function sceneDensity(shoot: CandidateShoot): string[] {
  return [...new Set(shoot.frames.flatMap((f) => placedObjects(f.prompt ?? "")))];
}

/** The ratio a set of pixels reduces to, as the prompt must name it in words. */
export function expectedRatio({
  width,
  height,
}: {
  width: number;
  height: number;
}): string {
  const greatestCommonDivisor = (first: number, second: number): number =>
    second === 0 ? first : greatestCommonDivisor(second, first % second);
  const divisor = greatestCommonDivisor(width, height);
  return `${width / divisor}:${height / divisor}`;
}

/**
 * The outfit clause, which must be byte-identical in all four frames.
 *
 * Two frames of shoot B abbreviated it — "in the olive waxed jacket" instead of
 * the full sentence — and those are exactly the two frames where the model
 * invented the missing knit. Every generation stands alone, so every prompt has
 * to carry the whole outfit.
 */
export function outfitOf(prompt: string): string | null {
  const match = prompt.match(/wearing ([^.]+)\./);
  return match ? match[1].trim() : null;
}

/** Frames whose gaze meets the lens. A shoot wants a mix, never all four. */
export function meetsLens(prompt: string): boolean {
  return /\b(eyes are on the lens|looks? (up |straight |directly )?to the lens|looks? (straight |directly )?into the lens|eyes? (are )?direct to the lens|eyes? (?:are )?(look(?:ing)?|meet(?:s|ing)?) directly (into )?the lens|eyes? meet(?:ing|s)? the lens directly|meet(?:s|ing)? the (camera|lens) directly|to the lens with)\b/i.test(
    prompt
  );
}

/**
 * Tailoring that reads as an office rather than a date.
 *
 * A generated library shoot put him in a navy blazer and a business shirt to
 * read a book, and the verdict was immediate: "looks like I am going to a
 * corporate office, I am not here to read books." The same batch put a blazer
 * and leather loafers in a working ceramics studio.
 *
 * The register a customer picks is "sharp", which the model hears as corporate.
 * Sharp means well made — a heavy knit, wool trousers, a good overcoat. Only a
 * bar, a hotel or an evening venue earns tailoring, which is why this is keyed
 * on the shoot's kind rather than banned outright.
 */
const CORPORATE_TAILORING = /\b(blazer|suit|tie|loafers|dress shoes|oxfords)\b/i;

/**
 * The lead garment — the first two words of the outfit, which is the colour and
 * the material or cut of the top layer.
 *
 * Comparing whole outfits for similarity does not work: every one of them ends
 * in "and a steel watch" and most contain "dark", "trousers" and "leather", so
 * a word-overlap test fires on almost every pair. The top layer is what a
 * viewer actually registers, and it separates cleanly — all eighteen authored
 * shoots have a distinct one.
 */
export function leadGarment(outfit: string): string {
  const stop = new Set(["a", "an", "the", "over", "under", "with"]);
  return outfit
    .toLowerCase()
    .replace(/[^a-z ]/g, " ")
    .split(/[ ]+/)
    .filter((word) => word && !stop.has(word))
    .slice(0, 2)
    .join(" ");
}

export type ValidationContext = {
  /** Prompts already in the library. A generated shoot may not reproduce one. */
  takenPrompts?: ReadonlySet<string>;
  /** Outfits already in use, lowercased. Two shoots in one outfit read as one. */
  takenOutfits?: ReadonlySet<string>;
  /** Lead garments already in use — catches the near-duplicate an exact match misses. */
  takenLeadGarments?: ReadonlySet<string>;
  /** Shoot ids already in use. */
  takenIds?: ReadonlySet<string>;
};

/**
 * Every failure in one candidate, as sentences a model can act on.
 *
 * The strings are written to be fed straight back into a retry, which is why
 * they say what to do rather than only what is wrong.
 */
export function validateShoot(
  shoot: CandidateShoot,
  context: ValidationContext = {}
): string[] {
  const problems: string[] = [];
  const at = (frame: CandidateFrame) => `frame "${frame.framing}"`;

  // ── Structure ─────────────────────────────────────────────────────────────
  if (!shoot.id || !/^[a-z0-9-]+$/.test(shoot.id)) {
    problems.push(`id "${shoot.id}" must be lowercase words joined by hyphens`);
  }
  if (context.takenIds?.has(shoot.id)) {
    problems.push(`id "${shoot.id}" is already used; choose another`);
  }
  if (!shoot.title) problems.push("title is missing");

  if (shoot.frames.length !== FRAMES_PER_SHOOT) {
    problems.push(
      `there are ${shoot.frames.length} frames; produce exactly ${FRAMES_PER_SHOOT}`
    );
  }

  // One of each framing. Two frames at the same distance is where the model
  // rendered one as the other with a small edit.
  for (const framing of FRAMINGS) {
    const count = shoot.frames.filter((f) => f.framing === framing).length;
    if (count !== 1) {
      problems.push(
        `there are ${count} "${framing}" frames; produce exactly one of each of ${FRAMINGS.join(", ")}`
      );
    }
  }

  // ── Per-frame ─────────────────────────────────────────────────────────────
  const seen = new Set<string>();
  for (const frame of shoot.frames) {
    const prompt = frame.prompt ?? "";

    if (/\{\{|\}\}/.test(prompt)) {
      problems.push(`${at(frame)} contains a {{token}}; write the words out`);
    }

    if (seen.has(prompt)) {
      problems.push(`${at(frame)} repeats another frame word for word`);
    }
    seen.add(prompt);

    if (context.takenPrompts?.has(prompt)) {
      problems.push(`${at(frame)} reproduces a prompt already in the library`);
    }

    const wanted = expectedRatio(frame.imageSize);
    const ratios = prompt.match(/\b\d+:\d+\b/g) ?? [];
    if (ratios.length !== 1 || ratios[0] !== wanted) {
      problems.push(
        `${at(frame)} names ${ratios.join(", ") || "no"} aspect ratio but its imageSize is ` +
          `${frame.imageSize.width}x${frame.imageSize.height}; the prompt must say "${wanted}" exactly once`
      );
    }

    for (const rule of CRAFT_RULES) {
      if (!rule.test(prompt)) {
        problems.push(`${at(frame)} breaks the "${rule.name}" rule — ${rule.why}`);
      }
    }
  }

  // ── Wardrobe: verbatim across the shoot ───────────────────────────────────
  const outfits = shoot.frames.map((f) => outfitOf(f.prompt ?? ""));
  if (outfits.some((o) => o === null)) {
    problems.push(
      'a frame never says "wearing …"; every frame must name the full outfit in one sentence ending in a full stop'
    );
  } else {
    const distinct = new Set(outfits as string[]);
    if (distinct.size !== 1) {
      problems.push(
        `the outfit is described ${distinct.size} different ways; it must be the identical clause in all ${FRAMES_PER_SHOOT} frames`
      );
    } else {
      const outfit = [...distinct][0].toLowerCase();
      if (context.takenOutfits?.has(outfit)) {
        problems.push(
          `this outfit is already worn by another shoot in the library; choose different garments`
        );
      }

      const lead = leadGarment(outfit);
      if (context.takenLeadGarments?.has(lead)) {
        problems.push(
          `the top layer "${lead}" is already worn by another shoot; change the colour and the material, not just the trousers`
        );
      }

      const corporate = outfit.match(CORPORATE_TAILORING);
      if (corporate && shoot.kind !== "social") {
        problems.push(
          `a ${corporate[0]} in a "${shoot.kind}" shoot reads as going to the office rather than on a date; ` +
            `dress him for the activity — a knit, a jacket, boots. Only a bar or a hotel earns tailoring`
        );
      }
    }
  }

  // ── Gaze: a mix, never all four ───────────────────────────────────────────
  const atLens = shoot.frames.filter((f) => meetsLens(f.prompt ?? "")).length;
  if (atLens < 1 || atLens > FRAMES_PER_SHOOT - 1) {
    problems.push(
      `${atLens} of ${FRAMES_PER_SHOOT} frames meet the lens; two should meet it and two should look away`
    );
  }

  // The anchor is generated first and the rest reference its output, so it has
  // to exist.
  if (!shoot.frames.some((f) => f.framing === ANCHOR_FRAMING)) {
    problems.push(`there is no "${ANCHOR_FRAMING}" frame; it is the anchor and is required`);
  }

  return problems;
}
