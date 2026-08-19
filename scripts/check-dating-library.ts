/**
 * Pre-flight check for the dating prompt library.
 *
 * Everything the library must satisfy is enforced by `assertLibraryComplete()`,
 * which today runs in exactly one place: `createDatingShootOrder`, at checkout.
 * That means a bad edit to a prompt does not fail a build or a test — it fails
 * a paying customer's order, after their credits have been spent.
 *
 * This script moves that failure to the terminal. It runs the library guard,
 * then plans real deliveries across every exclusion combination and every
 * wardrobe lead, proving the three no-repeat promises still hold and that
 * exclusions cannot starve a delivery.
 *
 *   npm run check:dating
 */
import {
  assertLibraryComplete,
  DATING_PROMPTS,
  getPromptVariants,
} from "../lib/dating/prompt-library";
import {
  assertDeliveryUnique,
  planDelivery,
} from "../lib/dating/select-delivery";
import { deriveBias, resolveHobbies, INTEREST_CHIPS } from "../lib/dating/interests";
import { compileDatingPrompt } from "../lib/dating/prompt-params";
import {
  EXCLUDABLE_TAGS,
  TOTAL_PHOTOS,
  type ExcludableTag,
  type StylePref,
} from "../lib/dating/types";

const STYLES: StylePref[] = ["casual", "sharp", "street"];

function fail(message: string): never {
  console.error(`\n  FAIL  ${message}\n`);
  process.exit(1);
}

let checks = 0;
const ok = (label: string, detail = "") => {
  checks += 1;
  console.log(`  ok    ${label}${detail ? `  ${detail}` : ""}`);
};

console.log("\nchecking dating library\n");

// 1. Every authoring invariant.
try {
  assertLibraryComplete();
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
ok("library guard", `${DATING_PROMPTS.length} prompts`);

// 2. Every compiled prompt resolves. compileDatingPrompt throws on an unknown or
//    unresolved token, so this catches a template that lost a token in an edit.
let compiled = 0;
for (const prompt of DATING_PROMPTS) {
  for (const vibe of ["urban", "outdoorsy", "homebody"] as const) {
    for (const style of STYLES) {
      try {
        const text = compileDatingPrompt(prompt, { vibe, style, hobby: null });
        if (text.includes("{{")) fail(`${prompt.id} left a token unresolved`);
        compiled += 1;
      } catch (error) {
        fail(`${prompt.id} (${vibe}/${style}): ${(error as Error).message}`);
      }
    }
  }
  // `as const` on the library makes every entry its own literal type, so the
  // optional field needs the same `in` narrowing the library guard uses.
  if ("hobbyPromptTemplate" in prompt && prompt.hobbyPromptTemplate) {
    for (const chip of INTEREST_CHIPS) {
      const text = compileDatingPrompt(prompt, {
        vibe: "urban",
        style: "casual",
        hobby: chip.activity,
      });
      if (!text.includes(chip.activity)) {
        fail(`${prompt.id} dropped the activity "${chip.activity}"`);
      }
      compiled += 1;
    }
  }
}
ok("compiled combinations", `${compiled}`);

// 3. A delivery must survive every exclusion subset, for every wardrobe lead.
//    This is the check that catches "exclusions leave too few usable slots"
//    before a user meets it as a failed checkout.
const tags = [...EXCLUDABLE_TAGS];
let deliveries = 0;
for (let mask = 0; mask < 1 << tags.length; mask += 1) {
  const excludeTags = tags.filter((_, i) => mask & (1 << i)) as ExcludableTag[];
  for (const dress of STYLES) {
    const batchId = `check-${mask}-${dress}`;
    const interests = INTEREST_CHIPS.slice(0, 3).map((chip) => chip.id);
    const plan = planDelivery(batchId, deriveBias(interests, dress), {
      excludeTags,
      hobbies: resolveHobbies(interests, null),
    });
    if (plan.length !== TOTAL_PHOTOS) {
      fail(`[${excludeTags.join(",") || "none"}]/${dress} planned ${plan.length}`);
    }
    try {
      assertDeliveryUnique(plan);
    } catch (error) {
      fail(`[${excludeTags.join(",") || "none"}]/${dress}: ${(error as Error).message}`);
    }
    // An excluded tag must never reach the delivery.
    for (const entry of plan) {
      const definition = getPromptVariants(entry.bucket, entry.slot).find(
        (candidate) => candidate.variant === entry.variant
      );
      if (definition?.tags.some((tag) => excludeTags.includes(tag as ExcludableTag))) {
        fail(`${definition.id} carries an excluded tag but was delivered`);
      }
    }
    deliveries += 1;
  }
}
ok("deliveries planned", `${deliveries} (16 exclusion subsets x 3 leads)`);

// 4. Every chip a user can tap must produce photos that mention it. This is what
//    stops a selectable interest with nothing behind it shipping again.
const missing: string[] = [];
for (const chip of INTEREST_CHIPS) {
  const plan = planDelivery(`check-interest-${chip.id}`, deriveBias([chip.id], "casual"), {
    excludeTags: [],
    hobbies: resolveHobbies([chip.id], null),
  });
  const dealt = plan.filter((entry) => entry.hobby === chip.activity).length;
  if (dealt === 0) missing.push(chip.id);
}
if (missing.length > 0) {
  fail(`interests reach no photo: ${missing.join(", ")}`);
}
ok("interest coverage", `${INTEREST_CHIPS.length} chips all reach photos`);

// 5. An interest backed by real scenes must actually land those scenes, and must
//    not run away with the delivery. This is the difference between a chip that
//    nudges the vibe weighting and a chip that is a promise.
const depicted = new Map<string, number>();
for (const prompt of DATING_PROMPTS) {
  const list = "depicts" in prompt ? (prompt.depicts as readonly string[]) : [];
  for (const id of list) depicted.set(id, (depicted.get(id) ?? 0) + 1);
}

let proven = 0;
for (const chip of INTEREST_CHIPS) {
  if (!depicted.has(chip.id)) continue; // served by the hobby route only
  const plan = planDelivery(`check-depicts-${chip.id}`, deriveBias([chip.id], "casual"), {
    excludeTags: [],
    hobbies: resolveHobbies([chip.id], null),
    interests: [chip.id],
  });
  const shown = plan.filter((entry) => {
    const definition = getPromptVariants(entry.bucket, entry.slot).find(
      (candidate) => candidate.variant === entry.variant
    );
    const list =
      definition && "depicts" in definition
        ? (definition.depicts as readonly string[])
        : [];
    return list.includes(chip.id);
  }).length;

  // The promise is presence, not an exact count. The cap of 3 bounds the
  // *boost*; beyond it a depicting slot competes normally, and a bucket still
  // takes 20 of its 26 candidates — so an interest with many scenes will land a
  // few more on ordinary vibe weighting. That is a man getting more of what he
  // said he likes, which is fine. A runaway is not.
  if (shown === 0) fail(`"${chip.id}" has ${depicted.get(chip.id)} scenes but landed none`);
  if (shown > 15) fail(`"${chip.id}" flooded the delivery with ${shown} photos`);
  proven += 1;
}
ok("interest guarantee", `${proven} interests land dedicated scenes`);

console.log(`\n${checks} checks passed\n`);
