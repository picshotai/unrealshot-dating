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

export type PromptLabValidation = {
  passed: boolean;
  problems: string[];
  sceneDensity: string[];
};

const FORBIDDEN_SCENE =
  /\b(garage|workshop|warehouse|loading bay|storage unit|repair shop|repairing|maintenance|servicing|showroom|factory floor|industrial unit|mechanic)\b/i;

const EXCLUSION_TERMS: Record<string, RegExp> = {
  alcohol: /\b(wine|beer|cocktail|whisky|whiskey|champagne|alcohol|pint)\b/i,
  dog: /\b(dog|puppy|retriever|hound|canine)\b/i,
  bicycle: /\b(bicycle|bike|cycling|cyclist)\b/i,
  teamSport: /\b(football|soccer|team sport|teammate|pitch touchline)\b/i,
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
}): PromptLabValidation {
  const { output, input, plan, recentScenes = [] } = args;
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
  if (output.scene.register !== input.dress) {
    problems.push(`dress register is "${output.scene.register}"; it must be "${input.dress}"`);
  }

  const sceneText = [
    output.scene.title,
    output.scene.conceptFamily,
    output.scene.settingFamily,
    output.scene.location,
    output.scene.activity,
    output.scene.activityReason,
    output.scene.rationale,
    ...output.frames.map((frame) => frame.prompt),
  ].join(" ");

  if (FORBIDDEN_SCENE.test(sceneText)) {
    problems.push("the candidate uses a quarantined garage, workshop, repair, warehouse or industrial-service concept");
  }
  if (output.scene.props.length > 2 || density.length > 2) {
    problems.push(`the scene asks the image model to track ${Math.max(output.scene.props.length, density.length)} props; use at most two`);
  }
  if (new Set(output.scene.props.map(normalise)).size !== output.scene.props.length) {
    problems.push("the props list contains duplicates");
  }

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
    if (!normalise(frame.prompt).includes(normalise(output.scene.location))) {
      problems.push(`frame "${frame.framing}" does not name the exact scene location`);
    }
  }

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

  return { passed: problems.length === 0, problems: [...new Set(problems)], sceneDensity: density };
}

