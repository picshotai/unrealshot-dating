/**
 * Measures customer-to-customer overlap and enforces repeat-buyer guarantees.
 *
 * Exact ids alone are not enough: a garage and a workshop can be different ids
 * while looking identical. This report therefore measures both shoot ids and
 * human-authored concept families.
 */
import { SHOOTS, SHOOT_BY_ID } from "../lib/dating/shoots";
import { planShootDelivery, shootIdsInPlan } from "../lib/dating/select-shoots";
import { SHOOTS_PER_DELIVERY } from "../lib/dating/types";
import { INTEREST_CHIPS } from "../lib/dating/interests";
import type { InterestId, StylePref } from "../lib/dating/types";

const REGISTERS: StylePref[] = ["casual", "sharp", "street"];
const SAMPLE = 60;

type Delivery = { ids: Set<string>; concepts: Set<string> };

function deliveryFor(
  seed: string,
  interests: InterestId[],
  dress: StylePref,
  previousShootIds: readonly string[] = [],
  globalConceptUsage: Readonly<Record<string, number>> = {}
): Delivery {
  const ids = new Set(
    shootIdsInPlan(
      planShootDelivery(seed, {
        interests,
        dress,
        previousShootIds,
        globalConceptUsage,
      })
    )
  );
  return {
    ids,
    concepts: new Set(
      [...ids].map((id) => {
        const shoot = SHOOT_BY_ID.get(id);
        if (!shoot) throw new Error(`Missing shoot ${id}`);
        return shoot.conceptFamily;
      })
    ),
  };
}

const shared = (a: Set<string>, b: Set<string>) =>
  [...a].filter((value) => b.has(value)).length;

function stats(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  return {
    mean: values.reduce((sum, value) => sum + value, 0) / values.length,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    p90: sorted[Math.floor(sorted.length * 0.9)],
  };
}

function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function randomAnswers(rand: () => number) {
  const total = 1 + Math.floor(rand() * 6);
  const interests: InterestId[] = [];
  while (interests.length < total) {
    const chip = INTEREST_CHIPS[Math.floor(rand() * INTEREST_CHIPS.length)];
    if (!interests.includes(chip.id)) interests.push(chip.id);
  }
  return { interests, dress: REGISTERS[Math.floor(rand() * REGISTERS.length)] };
}

const rand = seeded(20260821);
const active = SHOOTS.filter((shoot) => shoot.availability === "active");
console.log(`\n${active.length} active shoots, ${SHOOTS_PER_DELIVERY} per delivery\n`);

const recordUsage = (usage: Record<string, number>, delivery: Delivery) => {
  for (const concept of delivery.concepts) {
    usage[concept] = (usage[concept] ?? 0) + 1;
  }
};

const strangerUsage: Record<string, number> = {};
const strangers = Array.from({ length: SAMPLE }, (_, index) => {
  const answers = randomAnswers(rand);
  const delivery = deliveryFor(
    `stranger-${index}`,
    answers.interests,
    answers.dress,
    [],
    strangerUsage
  );
  recordUsage(strangerUsage, delivery);
  return delivery;
});

const twinUsage: Record<string, number> = {};
const twins = Array.from({ length: SAMPLE }, (_, index) => {
  const delivery = deliveryFor(
    `twin-${index}`,
    ["gym", "travel", "coffee"],
    "casual",
    [],
    twinUsage
  );
  recordUsage(twinUsage, delivery);
  return delivery;
});

function pairwise(deliveries: Delivery[], key: keyof Delivery): number[] {
  const values: number[] = [];
  for (let left = 0; left < deliveries.length; left += 1) {
    for (let right = left + 1; right < deliveries.length; right += 1) {
      values.push(shared(deliveries[left][key], deliveries[right][key]));
    }
  }
  return values;
}

const report = (label: string, values: number[]) => {
  const result = stats(values);
  console.log(
    `  ${label.padEnd(38)} mean ${result.mean.toFixed(1)}   ` +
      `range ${result.min}-${result.max}   p90 ${result.p90}`
  );
};

console.log("customer-to-customer overlap out of 15:\n");
let failures = 0;
const strangerExactOverlap = pairwise(strangers, "ids");
const strangerConceptOverlap = pairwise(strangers, "concepts");
const twinExactOverlap = pairwise(twins, "ids");
const twinConceptOverlap = pairwise(twins, "concepts");
report("strangers — exact shoots", strangerExactOverlap);
report("strangers — semantic concepts", strangerConceptOverlap);
report("identical answers — exact shoots", twinExactOverlap);
report("identical answers — semantic concepts", twinConceptOverlap);

// With 37 semantic families and 15 slots, about 6.1 shared concepts is the
// random-inventory baseline. A mean over 7 means preference scoring has once
// again overwhelmed global rotation and customers are receiving a house pack.
if (stats(strangerConceptOverlap).mean > 7 || stats(twinConceptOverlap).mean > 7) {
  console.error("\nFAIL customer-to-customer semantic overlap exceeds the commercial gate");
  failures += 1;
}

const secondExact: number[] = [];
const secondConcepts: number[] = [];
const thirdExact: number[] = [];

for (let index = 0; index < SAMPLE; index += 1) {
  const answers = randomAnswers(rand);
  const first = deliveryFor(`repeat-${index}-1`, answers.interests, answers.dress);
  const second = deliveryFor(
    `repeat-${index}-2`,
    answers.interests,
    answers.dress,
    [...first.ids]
  );
  const exact = shared(first.ids, second.ids);
  const concepts = shared(first.concepts, second.concepts);
  const third = deliveryFor(
    `repeat-${index}-3`,
    answers.interests,
    answers.dress,
    [...second.ids, ...first.ids]
  );
  const exactOnThird = [...third.ids].filter(
    (id) => first.ids.has(id) || second.ids.has(id)
  ).length;
  secondExact.push(exact);
  secondConcepts.push(concepts);
  thirdExact.push(exactOnThird);
  // The authored catalogue is now a bounded rollback/legacy path. Rejected
  // concepts stay quarantined even when that means a rare second legacy order
  // must revisit a broad semantic family. Exact shoots may never repeat. The
  // production recipe registry owns the stronger global semantic guarantee.
  if (exact !== 0 || exactOnThird !== 0) {
    console.error(
      `repeat sample ${index} failed for [${answers.interests.join(", ")}] / ${answers.dress}: ` +
        `order 2 ${exact} exact / ${concepts} concepts; order 3 ${exactOnThird} exact\n` +
        `  first: ${[...first.concepts].join(", ")}\n` +
        `  second: ${[...second.concepts].join(", ")}`
    );
    failures += 1;
  }
}

console.log("\nrepeat purchase overlap:\n");
report("second order — exact shoots", secondExact);
report("second order — semantic concepts", secondConcepts);
report("third order — exact shoots vs history", thirdExact);

const everUsed = new Set([...strangers, ...twins].flatMap((delivery) => [...delivery.ids]));
const selectedQuarantined = SHOOTS.filter(
  (shoot) => shoot.availability === "quarantined" && everUsed.has(shoot.id)
);
if (selectedQuarantined.length > 0) {
  console.error(`\nFAIL quarantined shoots selected: ${selectedQuarantined.map((s) => s.id).join(", ")}`);
  failures += selectedQuarantined.length;
}

console.log(
  `\n  ${everUsed.size} of ${active.length} active shoots appeared across ${SAMPLE * 2} deliveries`
);

if (failures > 0) {
  console.error(`\nFAIL ${failures} repeat-purchase samples repeated an exact authored shoot\n`);
  process.exit(1);
}

console.log("\nall authored fallback exact-repeat guarantees passed\n");
