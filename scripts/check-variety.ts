/**
 * How different are two customers' deliveries?
 *
 * The hand-written library could not answer this well: eighteen shoots against a
 * fifteen-shoot delivery guarantees twelve shared, whatever the selection logic
 * does. `2 x 15 - 18 = 12`. No amount of scoring cleverness escapes that, which
 * is why the library had to grow before this script was worth writing.
 *
 * It measures three things that matter for different reasons:
 *
 *   - two strangers with different answers  — the Reddit screenshot case
 *   - two men with identical answers        — the "same city, same app" case
 *   - the same man ordering twice           — the repeat-purchase case
 *
 *   npm run check:variety
 */
import { SHOOTS } from "../lib/dating/shoots";
import { planShootDelivery } from "../lib/dating/select-shoots";
import { SHOOTS_PER_DELIVERY } from "../lib/dating/types";
import { INTEREST_CHIPS } from "../lib/dating/interests";
import type { InterestId, StylePref } from "../lib/dating/types";

const REGISTERS: StylePref[] = ["casual", "sharp", "street"];

function shootIdsFor(orderId: string, interests: InterestId[], dress: StylePref) {
  return new Set(
    planShootDelivery(orderId, { interests, dress }).map((f) => f.shootId)
  );
}

const shared = (a: Set<string>, b: Set<string>) =>
  [...a].filter((id) => b.has(id)).length;

function stats(values: number[]) {
  const sorted = [...values].sort((x, y) => x - y);
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  return {
    mean,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    p90: sorted[Math.floor(sorted.length * 0.9)],
  };
}

/** A deterministic pseudo-random pick, so the report does not move run to run. */
function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function randomAnswers(rand: () => number) {
  const count = 1 + Math.floor(rand() * 6);
  const interests: InterestId[] = [];
  while (interests.length < count) {
    const chip = INTEREST_CHIPS[Math.floor(rand() * INTEREST_CHIPS.length)];
    if (!interests.includes(chip.id)) interests.push(chip.id);
  }
  return { interests, dress: REGISTERS[Math.floor(rand() * REGISTERS.length)] };
}

const SAMPLE = 60;
const rand = seeded(20260820);

console.log(
  `\n${SHOOTS.length} shoots, ${SHOOTS_PER_DELIVERY} per delivery\n` +
    `floor set by library size: ${Math.max(0, 2 * SHOOTS_PER_DELIVERY - SHOOTS.length)} shared, unavoidable\n`
);

// ── Different men, different answers ────────────────────────────────────────
const strangers = Array.from({ length: SAMPLE }, (_, i) => {
  const { interests, dress } = randomAnswers(rand);
  return shootIdsFor(`stranger-${i}`, interests, dress);
});
const strangerOverlap: number[] = [];
for (let i = 0; i < strangers.length; i += 1)
  for (let j = i + 1; j < strangers.length; j += 1)
    strangerOverlap.push(shared(strangers[i], strangers[j]));

// ── Two men who answered identically ────────────────────────────────────────
const twins = Array.from({ length: SAMPLE }, (_, i) =>
  shootIdsFor(`twin-${i}`, ["gym", "travel", "coffee"], "casual")
);
const twinOverlap: number[] = [];
for (let i = 0; i < twins.length; i += 1)
  for (let j = i + 1; j < twins.length; j += 1)
    twinOverlap.push(shared(twins[i], twins[j]));

// ── The same man, ordering again ────────────────────────────────────────────
const repeats: number[] = [];
for (let i = 0; i < SAMPLE; i += 1) {
  const { interests, dress } = randomAnswers(rand);
  repeats.push(
    shared(
      shootIdsFor(`order-${i}-a`, interests, dress),
      shootIdsFor(`order-${i}-b`, interests, dress)
    )
  );
}

const report = (label: string, values: number[]) => {
  const s = stats(values);
  const pct = (n: number) => `${((n / SHOOTS_PER_DELIVERY) * 100).toFixed(0)}%`;
  console.log(
    `  ${label.padEnd(34)} mean ${s.mean.toFixed(1)} (${pct(s.mean)})   ` +
      `range ${s.min}-${s.max}   90th pct ${s.p90}`
  );
};

console.log("shared shoots out of " + SHOOTS_PER_DELIVERY + ":\n");
report("two strangers", strangerOverlap);
report("two men, identical answers", twinOverlap);
report("same man, ordering twice", repeats);

// ── How much of the library ever gets used ──────────────────────────────────
const everUsed = new Set<string>();
for (const set of [...strangers, ...twins]) for (const id of set) everUsed.add(id);
console.log(
  `\n  ${everUsed.size} of ${SHOOTS.length} shoots appeared across ${SAMPLE * 2} simulated deliveries`
);

const unused = SHOOTS.filter((s) => !everUsed.has(s.id));
if (unused.length > 0) {
  console.log(`  never selected: ${unused.map((s) => s.id).join(", ")}`);
}
console.log();
