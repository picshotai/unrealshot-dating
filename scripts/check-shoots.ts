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
  type Shoot,
  type ShootFrame,
} from "../lib/dating/shoots";
import { SHOOT_CATALOG } from "../lib/dating/shoot-catalog";
import {
  EXCLUDABLE_TAGS,
  FRAMES_PER_SHOOT,
  SHOOTS_PER_DELIVERY,
  type ExcludableTag,
} from "../lib/dating/types";
import { INTEREST_CHIPS } from "../lib/dating/interests";
import {
  MAX_SHOOTS_BY_KIND,
  MAX_SHOOTS_PER_INTEREST,
  MAX_SHOOTS_PER_SETTING_FAMILY,
  MIN_SHOOTS_BY_KIND,
  MIN_SHOOTS_BY_LIGHT,
  assertDeliveryShape,
  deliveryFingerprint,
  planShootDelivery,
  shootIdsInPlan,
} from "../lib/dating/select-shoots";
// The craft rules live next to the generator that has to satisfy them, so the
// build check and the generation gate can never drift apart.
import {
  CRAFT_RULES,
  expectedRatio,
  leadGarment,
  meetsLens,
  outfitOf,
} from "../lib/dating/authoring/rules";

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
for (const catalogId of Object.keys(SHOOT_CATALOG)) {
  if (!ids.has(catalogId)) fail(catalogId, "catalog entry has no matching shoot");
}
const activeShoots = SHOOTS.filter((shoot) => shoot.availability === "active");
const quarantinedShoots = SHOOTS.filter((shoot) => shoot.availability === "quarantined");
const renderedApproved = SHOOTS.filter((shoot) => shoot.evidence === "rendered-approved");
ok(
  "structure",
  `${activeShoots.length} active + ${quarantinedShoots.length} quarantined, ` +
    `${renderedApproved.length} rendered-approved; ${FRAMES_PER_SHOOT} frames each`
);

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
  const expected = expectedRatio(frame.imageSize);
  const ratios = prompt.match(/\b\d+:\d+\b/g) ?? [];
  if (ratios.length !== 1 || ratios[0] !== expected) {
    fail(where, `names ${ratios.join(", ") || "no"} ratio; imageSize wants exactly one ${expected}`);
  }
}
ok("prompts", `${allFrames.length} complete, unique, no tokens`);

// ── Craft rules, each one paid for by a failed frame ────────────────────────
for (const rule of CRAFT_RULES) {
  const offenders = allFrames.filter(({ frame }) => !rule.test(frame.prompt));
  if (offenders.length > 0) {
    for (const { shoot, frame } of offenders) {
      fail(frameRef(shoot, frame), `${rule.name} — ${rule.why}`);
    }
  }
}
if (failures === 0) ok("craft rules", `${CRAFT_RULES.length} rules over ${allFrames.length} frames`);

// ── The outfit must be repeated verbatim in every frame of a shoot ──────────
// Two frames of shoot B abbreviated it and are exactly the two where the model
// invented the missing garment.
for (const shoot of SHOOTS) {
  const wearing = shoot.frames.map(({ prompt }) => outfitOf(prompt));
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
  const atLens = shoot.frames.filter(({ prompt }) => meetsLens(prompt)).length;
  if (atLens < 1 || atLens > FRAMES_PER_SHOOT - 1) {
    fail(shoot.id, `${atLens} of ${FRAMES_PER_SHOOT} frames meet the lens; want a mix`);
  }
}
if (failures === 0) ok("gaze", "every shoot mixes at-lens and away");

// ── Interests a chip can select must be served ─────────────────────────────
// A chip is a promise. Offering "climbing" and then delivering a generic set is
// the same broken promise the compositional library made by dropping the word
// into a template, so an unserved chip fails the build rather than logging.
const served = new Set(activeShoots.flatMap((shoot) => shoot.interests ?? []));
const unserved = INTEREST_CHIPS.filter((chip) => !served.has(chip.id));
for (const chip of unserved) {
  fail(chip.id, "interest chip has no shoot; a chip that selects nothing is a lie");
}
if (unserved.length === 0) {
  ok("interests", `all ${INTEREST_CHIPS.length} chips have at least one shoot`);
}

// ── Every combination of exclusions must still fill a delivery ─────────────
// An excluded tag drops a shoot whole — its location, outfit and light are
// fixed, so there is no variant to fall back to. With too few spare shoots a
// user who excludes dogs and alcohol gets an exception at checkout.
{
  const tags = [...EXCLUDABLE_TAGS];
  let worst = { excluded: [] as ExcludableTag[], available: activeShoots.length };
  for (let mask = 0; mask < 1 << tags.length; mask += 1) {
    const excluded = tags.filter((_, index) => mask & (1 << index));
    const available = activeShoots.filter(
      (shoot) => !(shoot.tags ?? []).some((tag) => excluded.includes(tag))
    ).length;
    if (available < worst.available) worst = { excluded, available };
    try {
      assertDeliveryShape(
        planShootDelivery(`check-exclusions-${mask}`, { excludeTags: excluded })
      );
    } catch (error) {
      fail(
        `exclusions:${excluded.join(",") || "none"}`,
        error instanceof Error ? error.message : String(error)
      );
    }
  }
  if (worst.available < SHOOTS_PER_DELIVERY) {
    fail(
      "exclusions",
      `excluding [${worst.excluded.join(", ")}] leaves ${worst.available} shoots; ` +
        `a delivery needs ${SHOOTS_PER_DELIVERY}. Author more untagged shoots.`
    );
  } else {
    ok(
      "exclusions",
      `all ${1 << tags.length} combinations plan; worst leaves ${worst.available} active shoots`
    );
  }
}

function inspectPlan(
  label: string,
  plan: ReturnType<typeof planShootDelivery>,
  requestedInterests: readonly string[] = []
) {
  assertDeliveryShape(plan);
  const selected = shootIdsInPlan(plan).map((id) => {
    const shoot = SHOOTS.find((candidate) => candidate.id === id);
    if (!shoot) throw new Error(`Missing selected shoot ${id}`);
    return shoot;
  });

  const settings = new Map<string, number>();
  const kinds = new Map<string, number>();
  const lights = new Map<string, number>();
  const activityInterests = new Map<string, number>();
  for (const shoot of selected) {
    settings.set(shoot.settingFamily, (settings.get(shoot.settingFamily) ?? 0) + 1);
    kinds.set(shoot.kind, (kinds.get(shoot.kind) ?? 0) + 1);
    lights.set(shoot.lightFamily, (lights.get(shoot.lightFamily) ?? 0) + 1);
    if (shoot.kind === "activity" || shoot.kind === "outdoors") {
      for (const interest of shoot.interests ?? []) {
        if (!requestedInterests.includes(interest)) continue;
        activityInterests.set(interest, (activityInterests.get(interest) ?? 0) + 1);
      }
    }
  }

  for (const [setting, total] of settings) {
    if (total > MAX_SHOOTS_PER_SETTING_FAMILY) {
      fail(label, `${total} shoots use setting family ${setting}`);
    }
  }
  for (const [kind, minimum] of Object.entries(MIN_SHOOTS_BY_KIND)) {
    const total = kinds.get(kind) ?? 0;
    if (total < minimum || total > MAX_SHOOTS_BY_KIND[kind as keyof typeof MAX_SHOOTS_BY_KIND]) {
      fail(label, `${kind} count ${total} is outside the portfolio bounds`);
    }
  }
  for (const [light, minimum] of Object.entries(MIN_SHOOTS_BY_LIGHT)) {
    if ((lights.get(light) ?? 0) < minimum) {
      fail(label, `${light} light count is below ${minimum}`);
    }
  }
  for (const [interest, total] of activityInterests) {
    if (total > MAX_SHOOTS_PER_INTEREST) {
      fail(label, `${interest} owns ${total} activity/outdoor shoots`);
    }
  }
}

// ── Deliveries actually plan ───────────────────────────────────────────────
// The old library's equivalent of this ran inside createDatingShootOrder, after
// a customer's credits had been spent. Same coverage, moved to the terminal.
{
  const cases: {
    label: string;
    options: NonNullable<Parameters<typeof planShootDelivery>[1]>;
  }[] = [
    { label: "no answers", options: {} },
    { label: "one interest", options: { interests: ["climbing"], dress: "street" } },
    {
      label: "many interests",
      options: {
        interests: ["golf", "sailing", "dining", "art", "skiing"],
        dress: "sharp",
      },
    },
    {
      label: "everything excluded",
      options: { excludeTags: [...EXCLUDABLE_TAGS], dress: "casual" },
    },
  ];

  for (const { label, options } of cases) {
    try {
      const plan = planShootDelivery(`check-${label}`, options);
      inspectPlan(label, plan, options.interests ?? []);
      if (plan.length !== SHOOTS_PER_DELIVERY * FRAMES_PER_SHOOT) {
        fail(label, `planned ${plan.length} frames`);
      }
    } catch (error) {
      fail(label, error instanceof Error ? error.message : String(error));
    }
  }
  if (failures === 0) ok("planning", `${cases.length} preference sets plan cleanly`);
}

// ── Repeat buyers get fresh concepts, not merely a different shuffle ───────
{
  const options = { interests: ["motorcycles", "coffee", "travel"] as const, dress: "street" as const };
  let history: string[] = [];
  let firstConcepts = new Set<string>();
  for (let order = 1; order <= 3; order += 1) {
    const plan = planShootDelivery(`repeat-${order}`, {
      ...options,
      previousShootIds: history,
    });
    const ids = shootIdsInPlan(plan);
    const repeatedIds = ids.filter((id) => history.includes(id));
    if (repeatedIds.length > 0) {
      fail(`repeat buyer order ${order}`, `reused shoots: ${repeatedIds.join(", ")}`);
    }
    if (order === 1) {
      firstConcepts = new Set(
        ids.map((id) => SHOOTS.find((shoot) => shoot.id === id)?.conceptFamily).filter(Boolean) as string[]
      );
    }
    if (order === 2) {
      const repeatedConcepts = ids.filter((id) =>
        firstConcepts.has(SHOOTS.find((shoot) => shoot.id === id)?.conceptFamily ?? "")
      );
      if (repeatedConcepts.length > 0) {
        fail("repeat buyer order 2", `reused concepts through: ${repeatedConcepts.join(", ")}`);
      }
    }
    history = [...ids, ...history];
  }
  if (failures === 0) {
    ok("repeat buyer", "3 orders have 0 repeated shoots; order 2 also has 0 repeated concepts");
  }
}

// ── Complete lineups are unique across a representative global sample ──────
{
  const fingerprints = new Set<string>();
  for (let index = 0; index < 500; index += 1) {
    let claimed = false;
    for (let attempt = 0; attempt < 32; attempt += 1) {
      const plan = planShootDelivery(`global-${index}:selection:${attempt}`, {
        interests: ["gym", "travel", "coffee"],
        dress: "casual",
      });
      const fingerprint = deliveryFingerprint(plan);
      if (fingerprints.has(fingerprint)) continue;
      fingerprints.add(fingerprint);
      claimed = true;
      break;
    }
    if (!claimed) {
      fail("global uniqueness", `could not claim a new lineup at sample ${index}`);
      break;
    }
  }
  if (fingerprints.size === 500) ok("global uniqueness", "500 distinct complete lineups");
}

// ── No two shoots wear the same clothes ────────────────────────────────────
// The delivery's whole claim is that every shoot is a different place, outfit
// and light. Two shoots in the same outfit make eight photos read as one shoot.
{
  const outfits = new Map<string, string>();
  const leads = new Map<string, string>();
  for (const shoot of SHOOTS) {
    const outfit = outfitOf(shoot.frames[0].prompt)?.toLowerCase() ?? shoot.id;
    const previous = outfits.get(outfit);
    if (previous) fail(shoot.id, `wears the same outfit as ${previous}`);
    outfits.set(outfit, shoot.id);

    // An exact match misses the case that matters: two shoots in a navy
    // lambswool jumper differ by a word and read as the same photograph.
    const lead = leadGarment(outfit);
    const wornBy = leads.get(lead);
    if (wornBy) fail(shoot.id, `top layer "${lead}" is already worn by ${wornBy}`);
    leads.set(lead, shoot.id);

    // "Sharp" pulls the model to corporate tailoring, which is the opposite of
    // a dating photograph everywhere except a bar or a hotel.
    const corporate = outfit.match(/(blazer|suit|tie|loafers|dress shoes|oxfords)/i);
    if (corporate && shoot.kind !== "social") {
      fail(shoot.id, `a ${corporate[0]} in a "${shoot.kind}" shoot reads as the office`);
    }
  }
  if (failures === 0) ok("variety", `${outfits.size} distinct outfits, all distinct top layers`);
}

// ── Verdict ────────────────────────────────────────────────────────────────
if (failures > 0) {
  console.error(`\n${failures} failure${failures === 1 ? "" : "s"}\n`);
  process.exit(1);
}
console.log(`\nall checks passed\n`);
