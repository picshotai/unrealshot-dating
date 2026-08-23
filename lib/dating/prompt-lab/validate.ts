import {
  leadGarment,
  outfitOf,
  sceneDensity,
  validateShoot,
  type CandidateShoot,
} from "@/lib/dating/authoring/rules";
import { SHOOTS } from "@/lib/dating/shoots";

import type { PromptLabInput, PromptLabOutput, RecentScene } from "./schemas";
import type { PromptLabPlan } from "./planner";
import {
  SCENE_ANCHOR_FRAMING,
  SCENE_ANCHOR_PROMPT_SENTENCE,
} from "./system-instruction";
import type { DatingSceneBrief } from "@/lib/dating/scene-recipes/types";
import { activityWardrobeProblems } from "@/lib/dating/scene-recipes/wardrobe";

export type PromptLabValidation = {
  passed: boolean;
  problems: string[];
  sceneDensity: string[];
};

const FORBIDDEN_SCENE =
  /\b(garage|workshop|warehouse|loading bay|storage unit|repair shop|repairing|maintenance|servicing|showroom|factory floor|industrial unit|mechanic|ceramics studio|pottery studio|pottery workshop|craft workshop|barn|farmhouse|lay-?by)\b/i;

const EXCLUSION_TERMS: Record<string, RegExp> = {
  alcohol: /\b(wine|beer|cocktail|whisky|whiskey|champagne|alcohol|pint)\b/i,
  dog: /\b(dog|puppy|retriever|hound|canine)\b/i,
  bicycle: /\b(bicycle|bike|cycling|cyclist)\b/i,
  teamSport: /\b(football|soccer|team sport|teammate|pitch touchline)\b/i,
};

const CONTINUITY_ELEMENTS: Readonly<Record<string, RegExp>> = {
  wall: /\bwalls?\b/i,
  bench: /\bbenches?\b/i,
  chair: /\bchairs?\b|\barmchairs?\b/i,
  stool: /\bstools?\b/i,
  table: /\btables?\b/i,
  counter: /\bcounters?\b/i,
  railing: /\brailings?\b|\bbalustrades?\b|\bparapets?\b/i,
  window: /\bwindows?\b|\bglazing\b/i,
  doorway: /\bdoorways?\b|\bdoor frames?\b/i,
  planter: /\bplanters?\b/i,
  column: /\bcolumns?\b|\bpillars?\b/i,
  steps: /\b(?:stone|concrete|broad|fixed|stair) steps\b|\bstaircases?\b/i,
  floor: /\bfloors?\b|\bdecking\b|\bboards?\b/i,
  shelf: /\bshelves?\b|\bshelving\b|\bbookshelves?\b/i,
};

function normalise(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}

function significantTokens(value: string): Set<string> {
  const stop = new Set(["the", "a", "an", "of", "at", "in", "on", "and", "with", "to", "his", "one"]);
  return new Set(normalise(value).split(" ").filter((word) => word.length > 2 && !stop.has(word)));
}

function similarity(first: string, second: string): number {
  const a = significantTokens(first);
  const b = significantTokens(second);
  if (!a.size || !b.size) return 0;
  const shared = [...a].filter((token) => b.has(token)).length;
  return shared / new Set([...a, ...b]).size;
}

function continuityElements(value: string): string[] {
  return Object.entries(CONTINUITY_ELEMENTS)
    .filter(([, pattern]) => pattern.test(value))
    .map(([name]) => name);
}

function libraryContext() {
  const outfits = SHOOTS.flatMap((shoot) => shoot.frames.map((frame) => outfitOf(frame.prompt))).filter(Boolean) as string[];
  return {
    takenIds: new Set(SHOOTS.map((shoot) => shoot.id)),
    takenPrompts: new Set(SHOOTS.flatMap((shoot) => shoot.frames.map((frame) => frame.prompt))),
    takenOutfits: new Set(outfits.map((outfit) => outfit.toLowerCase())),
    takenLeadGarments: new Set(outfits.map(leadGarment)),
  };
}

function expectedDimensions(framing: PromptLabOutput["frames"][number]["framing"]) {
  if (framing === "threeQuarter") return ["1728x2304", "2304x1728"];
  return ["1728x2304"];
}

export function validatePromptLabOutput(args: {
  output: PromptLabOutput;
  input: PromptLabInput;
  plan: PromptLabPlan;
  recentScenes?: readonly RecentScene[];
  lockedBrief?: DatingSceneBrief;
}): PromptLabValidation {
  const { output, input, plan, recentScenes = [], lockedBrief } = args;
  const candidate: CandidateShoot = {
    id: output.scene.id,
    title: output.scene.title,
    kind: output.scene.kind,
    register: output.scene.register,
    interests: input.interests,
    tags: input.exclusions,
    frames: output.frames.map((frame) => ({
      framing: frame.framing,
      imageSize: { width: frame.width, height: frame.height },
      prompt: frame.prompt,
    })),
  };

  const problems = validateShoot(candidate, libraryContext());
  const density = sceneDensity(candidate);

  if (output.scene.kind !== plan.kind) {
    problems.push(`scene kind is "${output.scene.kind}"; it must be the planned "${plan.kind}"`);
  }
  if (output.scene.lightFamily !== plan.light) {
    problems.push(`light family is "${output.scene.lightFamily}"; it must be the planned "${plan.light}"`);
  }
  const expectedRegister = lockedBrief?.register ?? input.dress;
  if (output.scene.register !== expectedRegister) {
    problems.push(`scene wardrobe register is "${output.scene.register}"; it must be "${expectedRegister}"`);
  }

  if (lockedBrief) {
    const exactFields: Array<[string, string, string]> = [
      ["scene.id", output.scene.id, lockedBrief.sceneId],
      ["scene.conceptFamily", output.scene.conceptFamily, lockedBrief.conceptFamily],
      ["scene.settingFamily", output.scene.settingFamily, lockedBrief.settingFamily],
      ["scene.location", output.scene.location, lockedBrief.location],
      ["scene.activity", output.scene.activity, lockedBrief.activity],
      ["scene.activityReason", output.scene.activityReason, lockedBrief.activityReason],
      ["scene.datingSignal", output.scene.datingSignal, lockedBrief.datingSignal],
      ["scene.kind", output.scene.kind, lockedBrief.kind],
      ["scene.lightFamily", output.scene.lightFamily, lockedBrief.lightFamily],
    ];
    for (const [field, actual, expected] of exactFields) {
      if (actual !== expected) {
        problems.push(`${field} changed the reserved brief; expected "${expected}"`);
      }
    }
    const actualProps = output.scene.props.map(normalise).sort();
    const expectedProps = lockedBrief.props.map(normalise).sort();
    if (JSON.stringify(actualProps) !== JSON.stringify(expectedProps)) {
      problems.push("scene.props changed the reserved brief's movable-prop list");
    }
    for (const anchor of lockedBrief.environmentAnchors) {
      if (!normalise(output.scene.environment).includes(normalise(anchor))) {
        problems.push(`scene.environment omits reserved environment anchor "${anchor}"`);
      }
    }
    if (!lockedBrief.supportSurface) {
      const bodySupport =
        /\b(leans?|sits?|seated|perches?|rests? (?:his |one )?(?:hand|palm|forearm|elbow|body) (?:on|against)|places? .{0,40} (?:on|against))\b/i;
      for (const frame of output.frames) {
        if (bodySupport.test(frame.prompt)) {
          problems.push(
            `frame "${frame.framing}" makes the body or a prop depend on undeclared scene geometry`
          );
        }
      }
    }
    for (const wardrobeProblem of activityWardrobeProblems({
      kind: lockedBrief.kind,
      representedInterest: lockedBrief.representedInterest,
      outfit: output.scene.outfit,
    })) {
      problems.push(wardrobeProblem);
    }
  }

  const sceneText = [
    output.scene.title,
    output.scene.conceptFamily,
    output.scene.settingFamily,
    output.scene.location,
    output.scene.activity,
    output.scene.activityReason,
    output.scene.environment,
    output.scene.wardrobeState,
    output.scene.rationale,
    ...output.frames.map((frame) => frame.prompt),
  ].join(" ");

  if (FORBIDDEN_SCENE.test(sceneText)) {
    problems.push("the candidate uses a quarantined garage, workshop, repair, warehouse or industrial-service concept");
  }
  if (output.scene.props.length > 2) {
    problems.push(`the scene asks the image model to track ${output.scene.props.length} movable props; use at most two`);
  }
  if (new Set(output.scene.props.map(normalise)).size !== output.scene.props.length) {
    problems.push("the props list contains duplicates");
  }
  if (!output.scene.environment) {
    problems.push("scene.environment is missing; lock two permanent background landmarks across all four frames");
  }
  if (output.scene.environmentAnchors.length < 2) {
    problems.push("scene.environmentAnchors must name at least two permanent landmarks");
  }
  for (const anchor of output.scene.environmentAnchors) {
    if (!normalise(output.scene.environment).includes(normalise(anchor))) {
      problems.push(`environment anchor "${anchor}" is not written verbatim inside scene.environment`);
    }
  }
  if (!output.scene.wardrobeState) {
    problems.push("scene.wardrobeState is missing; lock sleeves, fastenings, hems and accessories across all frames");
  } else {
    for (const term of ["clean", "continuous", "intact"]) {
      if (!normalise(output.scene.wardrobeState).includes(term)) {
        problems.push(`scene.wardrobeState must describe fabric edges as ${term}`);
      }
    }
  }

  const declaredSceneObjects = normalise(
    `${output.scene.environment} ${output.scene.props.join(" ")}`
  );
  for (const object of density) {
    if (!declaredSceneObjects.includes(normalise(object))) {
      problems.push(`the prompts introduce an undeclared scene object: ${object}; establish fixed geometry in scene.environment or movable objects in scene.props`);
    }
  }
  const declaredContinuity = new Set(continuityElements(
    `${output.scene.environment} ${output.scene.props.join(" ")}`
  ));

  for (const exclusion of input.exclusions) {
    if (EXCLUSION_TERMS[exclusion]?.test(sceneText)) {
      problems.push(`the candidate contains excluded content: ${exclusion}`);
    }
  }

  for (const frame of output.frames) {
    const actual = `${frame.width}x${frame.height}`;
    if (!expectedDimensions(frame.framing).includes(actual)) {
      problems.push(`frame "${frame.framing}" uses ${actual}; use ${expectedDimensions(frame.framing).join(" or ")}`);
    }
    if (outfitOf(frame.prompt) !== output.scene.outfit) {
      problems.push(`frame "${frame.framing}" does not repeat scene.outfit exactly after "wearing"`);
    }
    if (!frame.prompt.includes(output.scene.light)) {
      problems.push(`frame "${frame.framing}" does not repeat the exact scene.light sentence`);
    }
    if (output.scene.environment && !frame.prompt.includes(output.scene.environment)) {
      problems.push(`frame "${frame.framing}" does not repeat the exact scene.environment sentence`);
    }
    if (output.scene.wardrobeState && !frame.prompt.includes(output.scene.wardrobeState)) {
      problems.push(`frame "${frame.framing}" does not repeat the exact scene.wardrobeState sentence`);
    }
    if (frame.framing !== SCENE_ANCHOR_FRAMING && !frame.prompt.includes(SCENE_ANCHOR_PROMPT_SENTENCE)) {
      problems.push(`frame "${frame.framing}" is missing the exact scene-anchor instruction`);
    }
    for (const element of continuityElements(frame.prompt)) {
      if (!declaredContinuity.has(element)) {
        problems.push(`frame "${frame.framing}" invents an undeclared ${element}; establish every fixed element in scene.environment`);
      }
    }
    if (!normalise(frame.prompt).includes(normalise(output.scene.location))) {
      problems.push(`frame "${frame.framing}" does not name the exact scene location`);
    }
  }

  if (!lockedBrief) {
    const priorFamily = recentScenes.find((scene) =>
      normalise(scene.conceptFamily) === normalise(output.scene.conceptFamily)
    );
    if (priorFamily) {
      problems.push(`concept family "${output.scene.conceptFamily}" repeats recent scene "${priorFamily.title}"`);
    }
    const semanticDuplicate = recentScenes.find((scene) =>
      similarity(
        `${scene.location} ${scene.activity}`,
        `${output.scene.location} ${output.scene.activity}`
      ) >= 0.55
    );
    if (semanticDuplicate) {
      problems.push(`location and activity are too similar to recent scene "${semanticDuplicate.title}"`);
    }
  }

  return { passed: problems.length === 0, problems: [...new Set(problems)], sceneDensity: density };
}
