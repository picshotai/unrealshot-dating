import assert from "node:assert/strict";

import {
  ACTIVITIES,
  REASONS,
  VENUES,
} from "../lib/dating/scene-recipes/ingredients";
import {
  expandDatingSceneBrief,
  planDatingSceneBriefs,
  recipePortfolioSummary,
} from "../lib/dating/scene-recipes/planner";
import { RECIPE_PLANNER_VERSION } from "../lib/dating/scene-recipes/types";
import type { InterestId } from "../lib/dating/types";

const interests: InterestId[] = ["coffee", "reading", "hiking", "art", "tennis", "music"];
const lightWeights = { window: 0.4, overcast: 0.35, "open-door": 0.2, flash: 0.05 } as const;

function expectedLights(count: number): Record<string, number> {
  const entries = Object.entries(lightWeights).map(([key, weight]) => ({ key, exact: weight * count }));
  const result: Record<string, number> = Object.fromEntries(entries.map(({ key, exact }) => [key, Math.floor(exact)]));
  let left = count - Object.values(result).reduce((sum, value) => sum + value, 0);
  for (const { key } of [...entries].sort((a, b) => (b.exact % 1) - (a.exact % 1) || a.key.localeCompare(b.key))) {
    if (left-- <= 0) break;
    result[key] += 1;
  }
  if (count >= 10 && result.flash === 0) {
    result.window -= 1;
    result.flash = 1;
  }
  return Object.fromEntries(Object.entries(result).filter(([, value]) => value > 0));
}

function compatibleIdeaKeys(): string[] {
  const keys = new Set<string>();
  for (const venue of VENUES) {
    for (const zone of venue.zones) {
      for (const activity of ACTIVITIES) {
        if (!activity.kinds.includes(venue.kind)) continue;
        for (const signal of venue.signals) {
          if (!activity.signals.includes(signal)) continue;
          for (const reason of REASONS) {
            if (!reason.signals.includes(signal)) continue;
            for (const topology of venue.topologyIds) {
              for (const light of venue.lights) {
                keys.add([
                  RECIPE_PLANNER_VERSION,
                  venue.id,
                  zone.id,
                  activity.id,
                  reason.id,
                  topology,
                  signal,
                  light,
                ].join(":"));
              }
            }
          }
        }
      }
    }
  }
  return [...keys];
}

function assertPortfolio(count: number, salt: number) {
  const briefs = planDatingSceneBriefs({
    orderId: `capacity-order-${count}-${salt}`,
    count,
    interests,
    dress: "casual",
    exclusions: [],
    previousConceptFamilies: salt % 2 === 0 ? ["conservatory-morning", "coastal-promenade"] : [],
    salt,
  });
  const summary = recipePortfolioSummary(briefs);
  assert.equal(briefs.length, count);
  assert.equal(summary.ideas, count, "one portfolio cannot repeat an idea");
  assert.equal(summary.concepts, count, "one portfolio cannot repeat a concept family");
  assert(Math.max(...Object.values(summary.settings)) <= Math.max(1, Math.ceil(count / 8)));
  if (count === 15) {
    assert.deepEqual(summary.lights, expectedLights(count));
  }
  if (count >= 5) {
    assert.deepEqual(new Set(briefs.map((brief) => brief.kind)), new Set([
      "portrait", "home", "outdoors", "social", "activity",
    ]));
  }
  if (count >= 10) assert(briefs.some((brief) => brief.lightFamily === "flash"));
  if (count >= 15) {
    const represented = new Set(briefs.map((brief) => brief.representedInterest).filter(Boolean));
    for (const interest of interests) {
      assert(represented.has(interest), `15+ shoots should represent selected interest ${interest}`);
    }
    assert(
      new Set(briefs.map((brief) => brief.momentPlan?.profileId)).size >= 4,
      "a full portfolio must not reuse one emotional sequence"
    );
  }
  assert(briefs.every((brief) => brief.props.length <= 2));
  assert(briefs.every((brief) => brief.environmentAnchors.length === 2));
  assert(briefs.every((brief) =>
    !brief.representedInterest || interests.includes(brief.representedInterest)
  ), "a recipe may not portray an unselected customer interest");
  assert(briefs.every((brief) =>
    !/ceramic|pottery|garage|workshop|warehouse|farmhouse|barn|lay-?by/i.test(
      `${brief.venue} ${brief.location}`
    )
  ), "quarantined low-dating-value settings may not enter the recipe portfolio");
}

const gymPortfolio = planDatingSceneBriefs({
  orderId: "selected-gym-regression",
  count: 15,
  interests: ["gym"],
  dress: "sharp",
  exclusions: [],
});
const gymBrief = gymPortfolio.find((brief) => brief.representedInterest === "gym");
assert(gymBrief, "a selected gym chip must reserve a real gym-related shoot");
assert.equal(gymBrief.momentPlan?.profileId, "focused-recovery");

for (let count = 1; count <= 30; count += 1) {
  const saltsToCheck = count === 15 ? 10 : 1;
  for (let salt = 0; salt < saltsToCheck; salt += 1) {
    try {
      assertPortfolio(count, salt);
    } catch (error) {
      throw new Error(`portfolio count=${count} salt=${salt}: ${String(error)}`);
    }
  }
}

const capacity = compatibleIdeaKeys();
const required = 10_000 * 15;
assert(capacity.length >= required, `recipe capacity ${capacity.length} is below ${required}`);

// Simulate atomic global reservation: each sequential order consumes fifteen
// previously unused canonical keys, never title/outfit/prose variants.
const globallyReserved = new Set<string>();
for (let order = 0; order < 10_000; order += 1) {
  const portfolio = capacity.slice(order * 15, order * 15 + 15);
  assert.equal(portfolio.length, 15);
  for (const ideaKey of portfolio) {
    assert(!globallyReserved.has(ideaKey));
    globallyReserved.add(ideaKey);
  }
}
assert.equal(globallyReserved.size, required);

// Exercise the same salted whole-portfolio retry strategy used by the service.
// This catches a planner that has enough theoretical combinations but keeps
// returning a narrow, collision-heavy subset in practice.
const serviceReserved = new Set<string>();
for (let order = 0; order < 25; order += 1) {
  let claimed: ReturnType<typeof planDatingSceneBriefs> | null = null;
  for (let salt = 0; salt < 8; salt += 1) {
    const recipeInput = {
      orderId: `service-order-${order}`,
      count: 15,
      interests,
      dress: "casual",
      exclusions: [],
      salt,
    } as const;
    let base: ReturnType<typeof planDatingSceneBriefs>;
    try {
      base = planDatingSceneBriefs(recipeInput);
    } catch {
      continue;
    }
    const candidate: typeof base = [];
    for (const brief of base) {
      const available = expandDatingSceneBrief(recipeInput, brief, 128)
        .find((variant) => !serviceReserved.has(variant.ideaKey) &&
          !candidate.some((selected) => selected.ideaKey === variant.ideaKey));
      if (!available) break;
      candidate.push(available);
    }
    if (candidate.length === 15) {
      claimed = candidate;
      break;
    }
  }
  assert(claimed, `service reservation strategy exhausted at sequential order ${order + 1}`);
  for (const brief of claimed) serviceReserved.add(brief.ideaKey);
}
assert.equal(serviceReserved.size, 25 * 15);

console.log(`Recipe checks passed: counts 1-30 and 10,000 sequential 15-shoot orders (${capacity.length.toLocaleString()} compatible canonical ideas).`);
