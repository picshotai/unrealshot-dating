/**
 * Pre-flight check for the shoot library.
 *
 * The compositional library was enforced by assertLibraryComplete() running
 * inside createDatingShootOrder — that is, at checkout, after a customer's
 * credits had been spent. A bad edit failed a paying user's order rather than a
 * build. This moves that to the terminal and to CI.
 *
 * It also encodes the craft rules the three test shoots produced
 * (docs/shoot-test-01.md) as lint. Every one of them came from a frame that
 * failed: a step that floated into the middle of a road because nothing owned
 * it, a neck turned past breaking because the instruction had no ceiling, a
 * bilateral pose the model cannot hold, a light told to "catch" a surface under
 * flat overcast so it invented a sun.
 *
 *   npm run check:shoots
 */
import {
  SHOOTS,
  FRAMINGS,
  ANCHOR_FRAMING,
  FRAMES_PER_SHOOT,
  type Shoot,
  type ShootFrame,
} from "../lib/dating/shoots";
import { INTEREST_CHIPS } from "../lib/dating/interests";

let failures = 0;

function fail(where: string, message: string) {
  console.error(`  FAIL  ${where}: ${message}`);
  failures += 1;
}

const ok = (label: string, detail = "") =>
  console.log(`  ok    ${label}${detail ? `  ${detail}` : ""}`);

const frameRef = (shoot: Shoot, frame: ShootFrame) =>
  `${shoot.id}/${frame.framing}`;

console.log("\nchecking shoot library\n");

// ── Structure ───────────────────────────────────────────────────────────────
const ids = new Set<string>();
for (const shoot of SHOOTS) {
  if (ids.has(shoot.id)) fail(shoot.id, "duplicate shoot id");
  ids.add(shoot.id);

  if (shoot.frames.length !== FRAMES_PER_SHOOT) {
    fail(shoot.id, `has ${shoot.frames.length} frames; expected ${FRAMES_PER_SHOOT}`);
  }

  // One of each framing. Two frames at the same distance is where the model
  // rendered one as the other with a small edit.
  const seen = shoot.frames.map((frame) => frame.framing);
  for (const framing of FRAMINGS) {
    const count = seen.filter((value) => value === framing).length;
    if (count !== 1) fail(shoot.id, `has ${count} "${framing}" frames; expected exactly 1`);
  }

  if (seen.filter((f) => f === ANCHOR_FRAMING).length !== 1) {
    fail(shoot.id, `must have exactly one ${ANCHOR_FRAMING} frame to anchor on`);
  }
}
ok("structure", `${SHOOTS.length} shoots x ${FRAMES_PER_SHOOT} frames`);

// ── Every prompt is complete and unique ─────────────────────────────────────
const texts = new Map<string, string>();
const allFrames: { shoot: Shoot; frame: ShootFrame }[] = SHOOTS.flatMap((shoot) =>
  shoot.frames.map((frame) => ({ shoot, frame }))
);

for (const { shoot, frame } of allFrames) {
  const where = frameRef(shoot, frame);
  const prompt = frame.prompt;

  // The whole point of the rewrite: nothing is substituted at generation time.
  if (/\{\{|\}\}/.test(prompt)) fail(where, "contains a substitution token");

  const previous = texts.get(prompt);
  if (previous) fail(where, `is identical to ${previous}`);
  texts.set(prompt, where);

  // The ratio named in words must match the authored pixels, or the model is
  // told one shape and handed another.
  const expected =
    frame.imageSize.width === frame.imageSize.height
      ? "1:1"
      : frame.imageSize.width < frame.imageSize.height
        ? "3:4"
        : "4:3";
  const ratios = prompt.match(/\b\d+:\d+\b/g) ?? [];
  if (ratios.length !== 1 || ratios[0] !== expected) {
    fail(where, `names ${ratios.join(", ") || "no"} ratio; imageSize wants exactly one ${expected}`);
  }
}
ok("prompts", `${allFrames.length} complete, unique, no tokens`);

// ── Craft rules, each one paid for by a failed frame ────────────────────────
const RULES: {
  name: string;
  why: string;
  test: (prompt: string) => boolean;
}[] = [
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
    test: (p) => /\bmetres\b/.test(p),
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
];

for (const rule of RULES) {
  const offenders = allFrames.filter(({ frame }) => !rule.test(frame.prompt));
  if (offenders.length > 0) {
    for (const { shoot, frame } of offenders) {
      fail(frameRef(shoot, frame), `${rule.name} — ${rule.why}`);
    }
  }
}
if (failures === 0) ok("craft rules", `${RULES.length} rules over ${allFrames.length} frames`);

// ── The outfit must be repeated verbatim in every frame of a shoot ──────────
// Two frames of shoot B abbreviated it and are exactly the two where the model
// invented the missing garment.
for (const shoot of SHOOTS) {
  const wearing = shoot.frames.map(({ prompt }) => {
    const match = prompt.match(/wearing ([^.]+)\./);
    return match ? match[1].trim() : null;
  });
  if (wearing.some((value) => value === null)) {
    fail(shoot.id, "a frame never names the outfit");
    continue;
  }
  const distinct = new Set(wearing as string[]);
  if (distinct.size !== 1) {
    fail(
      shoot.id,
      `describes the outfit ${distinct.size} different ways; it must be verbatim in all ${FRAMES_PER_SHOOT}`
    );
  }
}
if (failures === 0) ok("wardrobe", "identical in every frame of a shoot");

// ── Gaze balance: two frames meet the lens, two look away ──────────────────
for (const shoot of SHOOTS) {
  const atLens = shoot.frames.filter(({ prompt }) =>
    /\b(eyes are on the lens|looks? (up |straight |directly )?to the lens|eyes? (are )?direct to the lens|to the lens with)\b/i.test(prompt)
  ).length;
  if (atLens < 1 || atLens > FRAMES_PER_SHOOT - 1) {
    fail(shoot.id, `${atLens} of ${FRAMES_PER_SHOOT} frames meet the lens; want a mix`);
  }
}
if (failures === 0) ok("gaze", "every shoot mixes at-lens and away");

// ── Interests a chip can select must be served ─────────────────────────────
const served = new Set(SHOOTS.flatMap((shoot) => shoot.interests ?? []));
const unserved = INTEREST_CHIPS.filter((chip) => !served.has(chip.id));
console.log(
  `  note  ${served.size} of ${INTEREST_CHIPS.length} interests have a shoot; ` +
    `${unserved.length} still unserved (${unserved.slice(0, 6).map((c) => c.id).join(", ")}${unserved.length > 6 ? "…" : ""})`
);

// ── Verdict ────────────────────────────────────────────────────────────────
if (failures > 0) {
  console.error(`\n${failures} failure${failures === 1 ? "" : "s"}\n`);
  process.exit(1);
}
console.log(`\nall checks passed\n`);
