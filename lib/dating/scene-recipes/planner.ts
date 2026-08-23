import type { PromptLabKind, PromptLabLight } from "@/lib/dating/prompt-lab/schemas";

import {
  ACTIVITIES,
  PROPS,
  REASONS,
  TOPOLOGY_BY_ID,
  VENUES,
} from "./ingredients";
import {
  RECIPE_PLANNER_VERSION,
  type DatingSceneBrief,
  type DatingSignal,
  type PlanRecipeInput,
  type VenueRecipe,
} from "./types";
import { resolveSceneWardrobe } from "./wardrobe";
import { resolveSceneMomentPlan } from "./moments";

const KIND_WEIGHTS: Readonly<Record<PromptLabKind, number>> = {
  portrait: 0.1,
  home: 0.2,
  outdoors: 0.25,
  social: 0.25,
  activity: 0.2,
};

const LIGHT_WEIGHTS: Readonly<Record<PromptLabLight, number>> = {
  window: 0.4,
  overcast: 0.35,
  "open-door": 0.2,
  flash: 0.05,
};

const GENERIC_ACTIVITY_VENUES = new Set([
  "city-park-walk",
  "coastal-steps-walk",
  "arcade-weekend-walk",
  "glasshouse-weekend-walk",
  "seafront-colonnade-walk",
  "museum-atrium-weekend",
  "covered-garden-passage",
]);

function activityFitsVenue(
  venue: VenueRecipe,
  activity: (typeof ACTIVITIES)[number],
  input: PlanRecipeInput
): boolean {
  if (!activity.kinds.includes(venue.kind)) return false;
  if (activity.excludedTags?.some((tag) => input.exclusions.includes(tag))) return false;
  if (activity.interest) {
    return input.interests.includes(activity.interest) &&
      venue.interests.includes(activity.interest);
  }
  if (venue.kind !== "activity") return true;
  return GENERIC_ACTIVITY_VENUES.has(venue.id) && activity.id === "unhurried-walk";
}

function venueRepresentsInterest(
  venue: VenueRecipe,
  interest: PlanRecipeInput["interests"][number],
  input: PlanRecipeInput
): boolean {
  return venue.interests.includes(interest) && ACTIVITIES.some(
    (activity) =>
      activity.interest === interest &&
      activityFitsVenue(venue, activity, input) &&
      activity.signals.some((signal) => venue.signals.includes(signal))
  );
}

function stableNumber(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function orderBySeed<T>(items: readonly T[], seed: string, id: (item: T) => string): T[] {
  return [...items].sort(
    (left, right) =>
      stableNumber(`${seed}:${id(left)}`) - stableNumber(`${seed}:${id(right)}`)
  );
}

function weightedTargets<T extends string>(
  count: number,
  weights: Readonly<Record<T, number>>,
  requireEvery: boolean
): T[] {
  const keys = Object.keys(weights) as T[];
  const allocation = new Map<T, number>(keys.map((key) => [key, 0]));
  let remaining = count;
  if (requireEvery && count >= keys.length) {
    for (const key of keys) allocation.set(key, 1);
    remaining -= keys.length;
  }

  const exact = keys.map((key) => ({ key, value: weights[key] * remaining }));
  let assigned = 0;
  for (const item of exact) {
    const whole = Math.floor(item.value);
    allocation.set(item.key, (allocation.get(item.key) ?? 0) + whole);
    assigned += whole;
  }
  const leftovers = remaining - assigned;
  exact
    .sort((a, b) => (b.value % 1) - (a.value % 1) || a.key.localeCompare(b.key))
    .slice(0, leftovers)
    .forEach(({ key }) => allocation.set(key, (allocation.get(key) ?? 0) + 1));

  return keys.flatMap((key) => Array.from({ length: allocation.get(key) ?? 0 }, () => key));
}

function targetKinds(count: number, seed: string): PromptLabKind[] {
  return orderBySeed(
    weightedTargets(count, KIND_WEIGHTS, count >= 5).map((kind, index) => ({ kind, index })),
    `${seed}:kind-order`,
    (item) => `${item.kind}:${item.index}`
  ).map((item) => item.kind);
}

function targetLights(count: number, seed: string): PromptLabLight[] {
  const targets = weightedTargets(count, LIGHT_WEIGHTS, false);
  if (count >= 10 && !targets.includes("flash")) {
    const replace = targets.lastIndexOf("window") >= 0
      ? targets.lastIndexOf("window")
      : targets.length - 1;
    targets[replace] = "flash";
  }
  return orderBySeed(
    targets.map((light, index) => ({ light, index })),
    `${seed}:light-order`,
    (item) => `${item.light}:${item.index}`
  ).map((item) => item.light);
}

function assignCompatibleLights(
  kinds: readonly PromptLabKind[],
  targets: readonly PromptLabLight[],
  seed: string,
  input: PlanRecipeInput
): PromptLabLight[] | null {
  const counts = new Map<PromptLabLight, number>();
  for (const light of targets) counts.set(light, (counts.get(light) ?? 0) + 1);
  const result: Array<PromptLabLight | undefined> = Array(kinds.length);
  const assignedPairCounts = new Map<string, number>();
  const slots = kinds.map((kind, index) => ({
    index,
    kind,
    compatible: (Object.keys(LIGHT_WEIGHTS) as PromptLabLight[]).filter((light) =>
      VENUES.some((venue) => venue.kind === kind && venue.lights.includes(light))
    ),
  })).sort((left, right) =>
    left.compatible.length - right.compatible.length ||
    stableNumber(`${seed}:light-slot:${left.index}`) -
      stableNumber(`${seed}:light-slot:${right.index}`)
  );

  const visit = (position: number): boolean => {
    if (position === slots.length) {
      return input.interests.every((interest) =>
        kinds.some((kind, index) => VENUES.some((venue) =>
          venue.kind === kind &&
          venue.lights.includes(result[index]!) &&
          venueRepresentsInterest(venue, interest, input)
        ))
      );
    }
    const slot = slots[position];
    const lights = orderBySeed(
      slot.compatible.filter((light) => (counts.get(light) ?? 0) > 0),
      `${seed}:light-choice:${slot.index}`,
      (light) => light
    ).sort((left, right) =>
      (left === "flash" ? -1 : 0) - (right === "flash" ? -1 : 0) ||
      (counts.get(left) ?? 0) - (counts.get(right) ?? 0)
    );
    for (const light of lights) {
      const pairKey = `${slot.kind}:${light}`;
      const venueCapacity = VENUES.filter(
        (venue) => venue.kind === slot.kind && venue.lights.includes(light)
      ).length;
      if ((assignedPairCounts.get(pairKey) ?? 0) >= venueCapacity) continue;
      counts.set(light, (counts.get(light) ?? 0) - 1);
      assignedPairCounts.set(pairKey, (assignedPairCounts.get(pairKey) ?? 0) + 1);
      result[slot.index] = light;
      const futureSlots = slots.slice(position + 1);
      const feasible = (Object.keys(LIGHT_WEIGHTS) as PromptLabLight[]).every(
        (remainingLight) =>
          futureSlots.filter((future) => future.compatible.includes(remainingLight)).length >=
            (counts.get(remainingLight) ?? 0)
      );
      if (feasible && visit(position + 1)) return true;
      counts.set(light, (counts.get(light) ?? 0) + 1);
      assignedPairCounts.set(pairKey, (assignedPairCounts.get(pairKey) ?? 1) - 1);
      result[slot.index] = undefined;
    }
    return false;
  };

  return visit(0) ? result as PromptLabLight[] : null;
}

function assignInterestSlots(
  kinds: readonly PromptLabKind[],
  lights: readonly PromptLabLight[],
  input: PlanRecipeInput
): Map<number, { interest: PlanRecipeInput["interests"][number]; venueId: string }> {
  const compatibleSlots = (interest: PlanRecipeInput["interests"][number]) =>
    kinds.flatMap((kind, index) => VENUES.filter((venue) =>
        venue.kind === kind &&
        venue.lights.includes(lights[index]) &&
        venueRepresentsInterest(venue, interest, input)
      ).map((venue) => ({ index, venue })));
  const interests = [...input.interests].sort(
    (left, right) => compatibleSlots(left).length - compatibleSlots(right).length
  );
  const assigned = new Map<number, { interest: PlanRecipeInput["interests"][number]; venueId: string }>();
  const usedVenues = new Set<string>();
  const settingCounts = new Map<string, number>();
  const maxSetting = Math.max(1, Math.ceil(input.count / 8));
  const visit = (position: number): boolean => {
    if (position === interests.length) return true;
    const interest = interests[position];
    for (const { index: slot, venue } of compatibleSlots(interest)) {
      if (assigned.has(slot) || usedVenues.has(venue.id)) continue;
      if ((settingCounts.get(venue.settingFamily) ?? 0) >= maxSetting) continue;
      assigned.set(slot, { interest, venueId: venue.id });
      usedVenues.add(venue.id);
      settingCounts.set(venue.settingFamily, (settingCounts.get(venue.settingFamily) ?? 0) + 1);
      if (visit(position + 1)) return true;
      assigned.delete(slot);
      usedVenues.delete(venue.id);
      settingCounts.set(venue.settingFamily, (settingCounts.get(venue.settingFamily) ?? 1) - 1);
    }
    return false;
  };
  return visit(0) ? assigned : new Map();
}

function blockedVenue(venue: VenueRecipe, exclusions: PlanRecipeInput["exclusions"]): boolean {
  return Boolean(venue.excludedTags?.some((tag) => exclusions.includes(tag)));
}

function activityCandidates(
  venue: VenueRecipe,
  signal: DatingSignal,
  input: PlanRecipeInput
) {
  const allowed = ACTIVITIES.filter(
    (activity) =>
      activityFitsVenue(venue, activity, input) &&
      activity.signals.includes(signal) &&
      !activity.excludedTags?.some((tag) => input.exclusions.includes(tag))
  );
  return [...allowed].sort((left, right) => {
    const leftMatch = left.interest && input.interests.includes(left.interest) ? 1 : 0;
    const rightMatch = right.interest && input.interests.includes(right.interest) ? 1 : 0;
    return rightMatch - leftMatch;
  });
}

function makeBrief(args: {
  input: PlanRecipeInput;
  slotIndex: number;
  venue: VenueRecipe;
  light: PromptLabLight;
  seed: string;
  preferredInterest?: PlanRecipeInput["interests"][number];
  signal?: DatingSignal;
  zone?: VenueRecipe["zones"][number];
  topologyId?: string;
  activity?: (typeof ACTIVITIES)[number];
  reason?: (typeof REASONS)[number];
}): DatingSceneBrief {
  const { input, slotIndex, venue, light, seed, preferredInterest } = args;
  const preferredSignals = preferredInterest
    ? venue.signals.filter((signal) => activityCandidates(venue, signal, input)
      .some((activity) => activity.interest === preferredInterest))
    : [];
  const signal = args.signal ?? orderBySeed(
    preferredSignals.length > 0 ? preferredSignals : venue.signals,
    `${seed}:signal`,
    (item) => item
  )[0];
  const zone = args.zone ?? orderBySeed(venue.zones, `${seed}:zone`, (item) => item.id)[0];
  const topologyId = args.topologyId ?? orderBySeed(
    venue.topologyIds,
    `${seed}:topology`,
    (item) => item
  )[0];
  const topology = TOPOLOGY_BY_ID.get(topologyId);
  if (!topology) throw new Error(`Unknown recipe topology ${topologyId}.`);

  const compatibleActivities = activityCandidates(venue, signal, input);
  const preferredActivities = preferredInterest
    ? compatibleActivities.filter((item) => item.interest === preferredInterest)
    : [];
  const activity = args.activity ?? orderBySeed(
    preferredActivities.length > 0 ? preferredActivities : compatibleActivities,
    `${seed}:activity`,
    (item) => item.id
  )[0];
  if (!activity) throw new Error(`No compatible activity for ${venue.id}/${signal}.`);
  const reason = args.reason ?? orderBySeed(
    REASONS.filter((item) => item.signals.includes(signal)),
    `${seed}:reason`,
    (item) => item.id
  )[0];
  if (!reason) throw new Error(`No compatible reason for ${signal}.`);

  const location = `${venue.location}, specifically ${zone.direction}`;
  const ideaParts = [
    RECIPE_PLANNER_VERSION,
    venue.id,
    zone.id,
    activity.id,
    reason.id,
    topology.id,
    signal,
    light,
  ];
  const ideaKey = ideaParts.join(":");
  const sceneId = `${venue.id}-${zone.id}-${activity.id}-${reason.id}`;
  const wardrobe = resolveSceneWardrobe({
    kind: venue.kind,
    representedInterest: activity.interest ?? null,
    customerStyle: input.dress,
  });

  const momentPlan = resolveSceneMomentPlan({
    activity: activity.activity,
    activityReason: reason.reason,
    datingSignal: signal,
    kind: venue.kind,
    representedInterest: activity.interest ?? null,
  });

  return {
    plannerVersion: RECIPE_PLANNER_VERSION,
    ideaKey,
    sceneId,
    slotIndex,
    conceptFamily: venue.conceptFamily,
    settingFamily: venue.settingFamily,
    kind: venue.kind,
    lightFamily: light,
    datingSignal: signal,
    stylePreference: input.dress,
    register: wardrobe.register,
    wardrobeContract: wardrobe.contract,
    venueId: venue.id,
    venue: venue.label,
    location,
    zoneId: zone.id,
    shootingZone: zone.direction,
    activityId: activity.id,
    activity: activity.activity,
    reasonId: reason.id,
    activityReason: reason.reason,
    topologyId: topology.id,
    environmentRequirement: topology.direction,
    environmentAnchors: topology.anchors,
    supportSurface: topology.supportSurface,
    props: activity.propIds.map((id) => PROPS[id]).filter(Boolean),
    representedInterest: activity.interest ?? null,
    momentPlan,
    interests: input.interests,
    exclusions: input.exclusions,
    geometryContract: [
      "Use one small shooting zone and face the same general background in every frame.",
      "The architecture and permanent surfaces are passive background and remain unchanged.",
      "The subject changes his own action and position; the environment never changes to support a pose.",
      "Every movable prop is present from the opener and remains portable; no later frame introduces furniture or a support surface.",
      topology.supportSurface
        ? `The only body-support surface is ${topology.supportSurface}, established in the opener.`
        : "The subject never leans, sits, or places an object on architecture, furniture, a railing, a wall, or a counter.",
    ],
  };
}

export function planDatingSceneBriefs(input: PlanRecipeInput): DatingSceneBrief[] {
  if (!Number.isInteger(input.count) || input.count < 1 || input.count > 30) {
    throw new Error("Recipe planner count must be from 1 to 30.");
  }
  const salt = input.salt ?? 0;
  const allocationSeed = input.orderId;
  const rootSeed = `${input.orderId}:${salt}`;
  const kinds = targetKinds(input.count, allocationSeed);
  const lightTargets = targetLights(input.count, allocationSeed);
  const compatibleLightPlan = input.count === 15
    ? assignCompatibleLights(kinds, lightTargets, allocationSeed, input)
    : null;
  const requiredInterestBySlot = compatibleLightPlan
    ? assignInterestSlots(kinds, compatibleLightPlan, input)
    : new Map<number, { interest: PlanRecipeInput["interests"][number]; venueId: string }>();
  const reservedInterestVenues = new Set(
    [...requiredInterestBySlot.values()].map((item) => item.venueId)
  );
  const remainingLights = new Map<PromptLabLight, number>();
  for (const light of lightTargets) {
    remainingLights.set(light, (remainingLights.get(light) ?? 0) + 1);
  }
  const previousRank = new Map(
    (input.previousConceptFamilies ?? []).map((family, index) => [family, index])
  );
  const selected: DatingSceneBrief[] = [];
  const usedConcepts = new Set<string>();
  const usedIdeas = new Set<string>();
  const uncoveredInterests = new Set(input.interests);
  const interestScarcity = new Map(input.interests.map((interest) => [
    interest,
    VENUES.filter((venue) =>
      venue.interests.includes(interest) &&
      venueRepresentsInterest(venue, interest, input)
    ).length,
  ]));
  const settingCounts = new Map<string, number>();
  const maxPerSetting = Math.max(1, Math.ceil(input.count / 8));

  let furthestSlot = 0;
  const fillSlot = (slot: number): boolean => {
    if (slot === input.count) {
      return input.count < 15 || uncoveredInterests.size === 0;
    }
    furthestSlot = Math.max(furthestSlot, slot);
    const kind = kinds[slot];
    const requiredAssignment = requiredInterestBySlot.get(slot);
    const requiredInterest = requiredAssignment?.interest;
    const requiredLight = compatibleLightPlan?.[slot];
    const flashMustBePlaced = requiredLight === "flash" || (input.count >= 10 &&
      (remainingLights.get("flash") ?? 0) > 0 &&
      (kind === "social" || kind === "portrait"));
    const lightPreference = (Object.keys(LIGHT_WEIGHTS) as PromptLabLight[]).sort(
      (left, right) =>
        (requiredLight === left ? -1 : 0) - (requiredLight === right ? -1 : 0) ||
        (flashMustBePlaced && left === "flash" ? -1 : 0) -
          (flashMustBePlaced && right === "flash" ? -1 : 0) ||
        (remainingLights.get(right) ?? 0) - (remainingLights.get(left) ?? 0) ||
        stableNumber(`${rootSeed}:slot:${slot}:light:${left}`) -
          stableNumber(`${rootSeed}:slot:${slot}:light:${right}`)
    );
    const candidates = orderBySeed(
      VENUES.filter(
        (item) =>
          item.kind === kind &&
          (requiredAssignment
            ? item.id === requiredAssignment.venueId
            : !reservedInterestVenues.has(item.id)) &&
          !blockedVenue(item, input.exclusions) &&
          !usedConcepts.has(item.conceptFamily) &&
          (settingCounts.get(item.settingFamily) ?? 0) < maxPerSetting
      ),
      `${rootSeed}:slot:${slot}`,
      (item) => item.id
    ).sort((left, right) => {
      const leftUncovered = left.interests.some((id) => uncoveredInterests.has(id)) ? 1 : 0;
      const rightUncovered = right.interests.some((id) => uncoveredInterests.has(id)) ? 1 : 0;
      if (!flashMustBePlaced && leftUncovered !== rightUncovered) {
        return rightUncovered - leftUncovered;
      }
      const scarcity = (venue: VenueRecipe) => Math.min(
        ...venue.interests.filter((id) => uncoveredInterests.has(id))
          .map((id) => interestScarcity.get(id) ?? Number.MAX_SAFE_INTEGER),
        Number.MAX_SAFE_INTEGER
      );
      if (leftUncovered && rightUncovered && scarcity(left) !== scarcity(right)) {
        return scarcity(left) - scarcity(right);
      }
      const leftPreferred = left.lights.includes(lightPreference[0]) ? 1 : 0;
      const rightPreferred = right.lights.includes(lightPreference[0]) ? 1 : 0;
      if (leftPreferred !== rightPreferred) return rightPreferred - leftPreferred;
      const leftLightNeed = Math.max(
        ...left.lights.map((light) => remainingLights.get(light) ?? 0)
      );
      const rightLightNeed = Math.max(
        ...right.lights.map((light) => remainingLights.get(light) ?? 0)
      );
      if (leftLightNeed !== rightLightNeed) return rightLightNeed - leftLightNeed;
      const leftInterest = left.interests.some((id) => input.interests.includes(id)) ? 1 : 0;
      const rightInterest = right.interests.some((id) => input.interests.includes(id)) ? 1 : 0;
      if (leftUncovered !== rightUncovered) return rightUncovered - leftUncovered;
      if (leftInterest !== rightInterest) return rightInterest - leftInterest;
      const leftSeen = previousRank.has(left.conceptFamily) ? 1 : 0;
      const rightSeen = previousRank.has(right.conceptFamily) ? 1 : 0;
      if (leftSeen !== rightSeen) return leftSeen - rightSeen;
      if (leftSeen && rightSeen) {
        return (previousRank.get(right.conceptFamily) ?? 0) -
          (previousRank.get(left.conceptFamily) ?? 0);
      }
      return 0;
    });

    for (let candidateIndex = 0; candidateIndex < candidates.length; candidateIndex += 1) {
      const venueLight = lightPreference.find((light) =>
        candidates[candidateIndex].lights.includes(light)
      );
      if (requiredLight && venueLight !== requiredLight) continue;
      if (!venueLight) continue;
      let candidate: DatingSceneBrief;
      try {
        candidate = makeBrief({
          input,
          slotIndex: slot + 1,
          venue: candidates[candidateIndex],
          light: venueLight,
          seed: `${rootSeed}:slot:${slot}:candidate:${candidateIndex}`,
          preferredInterest: requiredInterest ?? [...candidates[candidateIndex].interests]
            .filter((interest) => uncoveredInterests.has(interest))
            .sort((left, right) =>
              (interestScarcity.get(left) ?? Number.MAX_SAFE_INTEGER) -
              (interestScarcity.get(right) ?? Number.MAX_SAFE_INTEGER)
            )[0],
        });
      } catch {
        continue;
      }
      if (usedIdeas.has(candidate.ideaKey)) continue;

      const restoresInterest = Boolean(
        candidate.representedInterest && uncoveredInterests.has(candidate.representedInterest)
      );
      selected.push(candidate);
      usedIdeas.add(candidate.ideaKey);
      usedConcepts.add(candidate.conceptFamily);
      if (candidate.representedInterest) uncoveredInterests.delete(candidate.representedInterest);
      settingCounts.set(
        candidate.settingFamily,
        (settingCounts.get(candidate.settingFamily) ?? 0) + 1
      );
      remainingLights.set(
        candidate.lightFamily,
        Math.max(0, (remainingLights.get(candidate.lightFamily) ?? 0) - 1)
      );

      if (fillSlot(slot + 1)) return true;

      selected.pop();
      usedIdeas.delete(candidate.ideaKey);
      usedConcepts.delete(candidate.conceptFamily);
      if (restoresInterest && candidate.representedInterest) {
        uncoveredInterests.add(candidate.representedInterest);
      }
      settingCounts.set(
        candidate.settingFamily,
        (settingCounts.get(candidate.settingFamily) ?? 1) - 1
      );
      remainingLights.set(
        candidate.lightFamily,
        (remainingLights.get(candidate.lightFamily) ?? 0) + 1
      );
    }
    return false;
  };

  if (!fillSlot(0)) {
    throw new Error(
      `Recipe inventory cannot fill a compatible ${input.count}-shoot portfolio; stopped at slot ${furthestSlot + 1} (${kinds[furthestSlot]} / ${compatibleLightPlan?.[furthestSlot] ?? "compatible light"}).`
    );
  }

  return selected;
}

/**
 * Enumerate canonical alternatives inside one already-planned venue contract.
 * Every candidate changes real scene DNA, never a title, outfit or prose-only
 * detail, while retaining the portfolio's kind/light/interest allocation.
 */
export function expandDatingSceneBrief(
  input: PlanRecipeInput,
  base: DatingSceneBrief,
  limit = 128
): DatingSceneBrief[] {
  const venue = VENUES.find((item) => item.id === base.venueId);
  if (!venue) throw new Error(`Unknown planned venue ${base.venueId}.`);
  const variants: DatingSceneBrief[] = [];
  const expansionSeed = `${input.orderId}:expand:${base.slotIndex}`;
  for (const signal of orderBySeed(venue.signals, expansionSeed, (item) => item)) {
    const activities = orderBySeed(activityCandidates(venue, signal, input).filter(
      (activity) => !base.representedInterest || activity.interest === base.representedInterest
    ), expansionSeed, (activity) => activity.id);
    for (const zone of orderBySeed(venue.zones, expansionSeed, (item) => item.id)) {
      for (const topologyId of orderBySeed(venue.topologyIds, expansionSeed, (item) => item)) {
        for (const activity of activities) {
          for (const reason of orderBySeed(
            REASONS.filter((item) => item.signals.includes(signal)),
            expansionSeed,
            (item) => item.id
          )) {
            variants.push(makeBrief({
              input,
              slotIndex: base.slotIndex,
              venue,
              light: base.lightFamily,
              seed: `${input.orderId}:expand:${base.slotIndex}`,
              preferredInterest: base.representedInterest ?? undefined,
              signal,
              zone,
              topologyId,
              activity,
              reason,
            }));
            if (variants.length >= limit) return variants;
          }
        }
      }
    }
  }
  return variants;
}

export function recipePortfolioSummary(briefs: readonly DatingSceneBrief[]) {
  const countBy = (read: (brief: DatingSceneBrief) => string) =>
    briefs.reduce<Record<string, number>>((result, brief) => {
      const key = read(brief);
      result[key] = (result[key] ?? 0) + 1;
      return result;
    }, {});
  return {
    kinds: countBy((brief) => brief.kind),
    lights: countBy((brief) => brief.lightFamily),
    settings: countBy((brief) => brief.settingFamily),
    ideas: new Set(briefs.map((brief) => brief.ideaKey)).size,
    concepts: new Set(briefs.map((brief) => brief.conceptFamily)).size,
  };
}
