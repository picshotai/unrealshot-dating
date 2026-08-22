import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { estimatePromptLabCost } from "../lib/dating/prompt-lab/cost";
import type { PromptLabModelCall } from "../lib/dating/prompt-lab/generate";
import { planPromptLabScene } from "../lib/dating/prompt-lab/planner";
import { buildPromptLabRequest } from "../lib/dating/prompt-lab/prompt";
import { selectPromptLabReference } from "../lib/dating/prompt-lab/references";
import type {
  FinishPromptLabRun,
  PromptLabRepository,
  PromptLabRun,
  StartPromptLabRun,
} from "../lib/dating/prompt-lab/run-types";
import {
  EMPTY_FEEDBACK,
  promptLabInputSchema,
  promptLabOutputSchema,
  type PromptLabInput,
  type PromptLabOutput,
  type RecentScene,
} from "../lib/dating/prompt-lab/schemas";
import { executePromptLabGeneration } from "../lib/dating/prompt-lab/service";
import { validatePromptLabOutput } from "../lib/dating/prompt-lab/validate";
import { SHOOT_CATALOG } from "../lib/dating/shoot-catalog";
import { meetsLens } from "../lib/dating/authoring/rules";
import { SCENE_ANCHOR_PROMPT_SENTENCE } from "../lib/dating/prompt-lab/system-instruction";

const identity = "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone.";
const outfit = "a moss green cotton overshirt over a cream henley, dark denim, brown leather boots and a steel watch";
const light = "A tall window filling the right edge of the frame lays broad soft daylight across him.";
const location = "a bright conservatory beside a quiet neighbourhood cafe";
const wardrobeState = "The overshirt sleeves are rolled twice to mid-forearm, every button and hem stays fixed, and all fabric edges are clean, continuous and intact.";
const environmentAnchors = [
  "floor-to-ceiling black-framed window along the right edge",
  "pale plaster wall across the rear",
];
const environment = "A floor-to-ceiling black-framed window along the right edge and a pale plaster wall across the rear remain the two fixed background landmarks.";

function prompt(framing: string, gaze: string, sceneAnchor: boolean, ratio = "3:4") {
  return `${identity} ${sceneAnchor ? `${SCENE_ANCHOR_PROMPT_SENTENCE} ` : ""}He stands in ${location}, wearing ${outfit}. ${wardrobeState} ${environment} He settles his weight onto one leg while one hand rests against his own thigh and the other hangs loose, creating different shoulder heights. ${gaze} The pale wall carries four metres behind him into soft shapes. ${light} A ${ratio} ${framing} frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/200, ISO 100. Keep visible pores across his cheeks, faint stubble along the jaw, natural eye creases and the cotton grain of the overshirt. The moment feels grounded in a relaxed pause before his morning coffee arrives.`;
}

const output: PromptLabOutput = {
  scene: {
    id: "conservatory-coffee-pause",
    title: "Conservatory coffee pause",
    conceptFamily: "neighbourhood-conservatory",
    settingFamily: "hospitality-window",
    datingSignal: "warmth",
    location,
    activity: "pausing before a morning coffee",
    activityReason: "he has arrived early and is taking in the calm room before ordering",
    outfit,
    wardrobeState,
    light,
    environment,
    environmentAnchors,
    lightFamily: "window",
    kind: "social",
    register: "casual",
    props: [],
    rationale: "The quiet public setting and relaxed body language make him feel warm, present and easy to meet.",
  },
  frames: [
    { framing: "close", width: 1728, height: 2304, prompt: prompt("close shoulders-up", "His eyes are on the lens and his mouth lifts at one corner.", false) },
    { framing: "medium", width: 1728, height: 2304, prompt: prompt("medium chest-up", "His gaze goes past the lens toward the window.", true) },
    { framing: "threeQuarter", width: 1728, height: 2304, prompt: prompt("three-quarter", "He looks directly to the lens with a quiet smile.", true) },
    { framing: "expression", width: 1728, height: 2304, prompt: prompt("close expression", "He laughs while his gaze falls away from the camera.", true) },
  ],
};

const baseInput: PromptLabInput = {
  clientRequestId: "52ec6022-c51e-4cbb-a79a-783d619aa50a",
  interests: ["coffee", "reading"],
  dress: "casual",
  exclusions: ["alcohol"],
  kind: "social",
  light: "window",
};

class MemoryRepository implements PromptLabRepository {
  runs: PromptLabRun[] = [];

  async findByRequest(userId: string, clientRequestId: string) {
    return this.runs.find((run) => run.userId === userId && run.clientRequestId === clientRequestId) ?? null;
  }
  async findById(userId: string, id: string) {
    return this.runs.find((run) => run.userId === userId && run.id === id) ?? null;
  }
  async recentScenes(userId: string, limit: number): Promise<RecentScene[]> {
    return this.runs.filter((run) => run.userId === userId).slice(-limit).flatMap((run) => {
      const parsed = promptLabOutputSchema.safeParse(run.output);
      return parsed.success ? [{
        id: parsed.data.scene.id,
        title: parsed.data.scene.title,
        conceptFamily: parsed.data.scene.conceptFamily,
        settingFamily: parsed.data.scene.settingFamily,
        location: parsed.data.scene.location,
        activity: parsed.data.scene.activity,
        kind: parsed.data.scene.kind,
        lightFamily: parsed.data.scene.lightFamily,
      }] : [];
    });
  }
  async start(start: StartPromptLabRun) {
    const duplicate = await this.findByRequest(start.userId, start.clientRequestId);
    if (duplicate) return { run: duplicate, inserted: false };
    const now = new Date().toISOString();
    const run: PromptLabRun = {
      ...start,
      id: `run-${this.runs.length + 1}`,
      output: null,
      validationErrors: [],
      sceneDensity: [],
      usage: { inputTokens: 0, outputTokens: 0, reasoningTokens: 0, totalTokens: 0 },
      estimatedCostUsd: 0,
      apiError: null,
      createdAt: now,
      updatedAt: now,
    };
    this.runs.push(run);
    return { run, inserted: true };
  }
  async finish(userId: string, id: string, patch: FinishPromptLabRun) {
    const index = this.runs.findIndex((run) => run.userId === userId && run.id === id);
    assert.notEqual(index, -1);
    this.runs[index] = { ...this.runs[index], ...patch, updatedAt: new Date().toISOString() };
    return this.runs[index];
  }
}

function filesUnder(root: string): string[] {
  return readdirSync(root).flatMap((name) => {
    const path = join(root, name);
    return statSync(path).isDirectory() ? filesUnder(path) : [path];
  });
}

async function main() {
  assert(promptLabInputSchema.safeParse(baseInput).success, "valid input should parse");
  assert(!promptLabInputSchema.safeParse({ ...baseInput, interests: [] }).success, "zero interests must fail");
  assert(!promptLabInputSchema.safeParse({ ...baseInput, interests: ["coffee", "gym", "art", "music", "travel", "reading", "golf"] }).success, "seven interests must fail");
  assert(promptLabOutputSchema.safeParse(output).success, "four-frame structured output should parse");
  assert(!promptLabOutputSchema.safeParse({ ...output, frames: output.frames.slice(0, 3) }).success, "three frames must fail");
  const detailedProp = "a heavy rocks glass holding an amber drink with a large ice cube";
  assert(detailedProp.length > 60);
  assert(promptLabOutputSchema.safeParse({ ...output, scene: { ...output.scene, props: [detailedProp] } }).success, "normal detailed props must not fail an arbitrary 60-character limit");
  const dottedOutfit = promptLabOutputSchema.parse({ ...output, scene: { ...output.scene, outfit: `${outfit}.` } });
  assert.equal(dottedOutfit.scene.outfit, outfit, "trailing outfit punctuation must be normalised before exact-clause validation");
  assert(meetsLens("His eyes are looking directly into the lens with a relaxed expression."), "natural direct-gaze wording must be recognised");
  const legacyScene = { ...output.scene } as Record<string, unknown>;
  delete legacyScene.environment;
  delete legacyScene.environmentAnchors;
  delete legacyScene.wardrobeState;
  const legacyParsed = promptLabOutputSchema.safeParse({ ...output, scene: legacyScene });
  assert(legacyParsed.success, "saved v1 candidates must remain readable in history");
  if (legacyParsed.success) {
    const legacyCheck = validatePromptLabOutput({ output: legacyParsed.data, input: baseInput, plan: { kind: "social", light: "window" } });
    assert(legacyCheck.problems.some((problem) => problem.includes("scene.environment is missing")), "legacy candidates must be clearly marked as missing the new continuity contract");
  }

  const recent: RecentScene[] = [{
    id: "old", title: "Old", conceptFamily: "old-family", settingFamily: "home",
    location: "old room", activity: "reading", lightFamily: "window", kind: "home",
  }];
  const auto = promptLabInputSchema.parse({ ...baseInput, kind: "auto", light: "auto" });
  const firstPlan = planPromptLabScene(auto, recent);
  const secondPlan = planPromptLabScene(auto, recent);
  assert.deepEqual(firstPlan, secondPlan, "auto planning must be deterministic for one request id");

  for (const lightFamily of ["window", "open-door", "overcast", "flash"] as const) {
    const reference = selectPromptLabReference(lightFamily);
    assert.equal(SHOOT_CATALOG[reference.id].availability, "active", "reference must never be quarantined");
    assert.equal(reference.shoot.frames.length, 4);
  }

  const request = buildPromptLabRequest({
    input: { ...baseInput, parentRunId: "c13f86b6-e2dd-4530-8ec8-5b163948078d", revisionInstructions: "Make the location warmer." },
    plan: { kind: "social", light: "window" },
    reference: selectPromptLabReference("window"),
    recentScenes: recent,
    retry: { previousOutput: output, validationErrors: ["old failure"], feedback: { ...EMPTY_FEEDBACK, notes: "too cold" } },
  });
  assert.match(request, /Make the location warmer/);
  assert.match(request, /old failure/);
  assert.match(request, /too cold/);
  assert.match(request, /Do not copy its location/);

  assert.equal(estimatePromptLabCost(
    { inputTokens: 1_000_000, outputTokens: 500_000, reasoningTokens: 500_000, totalTokens: 2_000_000 },
    { currency: "USD", inputUsdPerMillion: 0.75, outputAndReasoningUsdPerMillion: 3.75 }
  ), 4.5);

  const forbidden = structuredClone(output);
  forbidden.scene.location = "an old motorcycle workshop";
  forbidden.frames = forbidden.frames.map((frame) => ({ ...frame, prompt: frame.prompt.replace(location, forbidden.scene.location) })) as PromptLabOutput["frames"];
  const forbiddenCheck = validatePromptLabOutput({ output: forbidden, input: baseInput, plan: { kind: "social", light: "window" } });
  assert(forbiddenCheck.problems.some((problem) => problem.includes("garage, workshop")), "workshop concept must fail the scene contract");

  const inventedFurniture = structuredClone(output);
  inventedFurniture.frames[2].prompt += " A timber bench now fills the centre of the floor.";
  const continuityCheck = validatePromptLabOutput({ output: inventedFurniture, input: baseInput, plan: { kind: "social", light: "window" } });
  assert(continuityCheck.problems.some((problem) => problem.includes("undeclared scene object: bench") || problem.includes("undeclared bench")), "a frame-only bench must fail continuity validation");
  const changedWardrobe = structuredClone(output);
  changedWardrobe.frames[3].prompt = changedWardrobe.frames[3].prompt.replace(wardrobeState, "The overshirt hangs with a loose sleeve edge.");
  const wardrobeCheck = validatePromptLabOutput({ output: changedWardrobe, input: baseInput, plan: { kind: "social", light: "window" } });
  assert(wardrobeCheck.problems.some((problem) => problem.includes("does not repeat the exact scene.wardrobeState")), "a changed sleeve or fabric state must fail continuity validation");

  const repository = new MemoryRepository();
  let calls = 0;
  let latestContents = "";
  const modelCall: PromptLabModelCall = async (call) => {
    calls += 1;
    latestContents = call.contents;
    return {
      text: JSON.stringify(output),
      usage: { inputTokens: 1_000, outputTokens: 2_000, reasoningTokens: 300, totalTokens: 3_300 },
    };
  };
  const first = await executePromptLabGeneration({ userId: "user-a", input: baseInput, repository, modelCall });
  assert.equal(calls, 1, "a click must make exactly one model call");
  assert.equal(first.reused, false);
  assert.notEqual(first.run.status, "running");
  assert.equal(first.run.output !== null, true, "invalid candidates must still be saved");

  const duplicate = await executePromptLabGeneration({ userId: "user-a", input: baseInput, repository, modelCall });
  assert.equal(duplicate.reused, true, "duplicate idempotency key must return existing run");
  assert.equal(calls, 1, "duplicate request must not call the model");

  const retryInput: PromptLabInput = {
    ...baseInput,
    clientRequestId: "125872e8-41a5-48a7-af04-d2c9689a7e51",
    parentRunId: first.run.id,
    revisionInstructions: "Use a brighter, more social location.",
  };
  const retry = await executePromptLabGeneration({ userId: "user-a", input: retryInput, repository, modelCall });
  assert.equal(retry.run.parentRunId, first.run.id, "revision must link to its original");
  assert.match(latestContents, /Use a brighter, more social location/);
  assert.equal(calls, 2, "manual revision gets one new call");

  const failingCall: PromptLabModelCall = async () => { throw new Error("provider unavailable"); };
  const originalConsoleError = console.error;
  console.error = () => undefined;
  const apiFailure = await executePromptLabGeneration({
    userId: "user-a",
    input: { ...baseInput, clientRequestId: "0142ae97-c5fd-4ded-9514-9c3bb4429346" },
    repository,
    modelCall: failingCall,
  }).finally(() => { console.error = originalConsoleError; });
  assert.equal(apiFailure.run.status, "api_error", "provider errors must be persisted");
  assert.match(apiFailure.run.apiError || "", /temporarily unavailable/);

  const roots = [
    join(process.cwd(), "lib", "dating", "prompt-lab"),
    join(process.cwd(), "app", "api", "prompt-lab"),
    join(process.cwd(), "app", "(protected)", "prompt-lab"),
  ];
  const importLines = roots.flatMap(filesUnder).filter((path) => /\.(ts|tsx)$/.test(path))
    .flatMap((path) => readFileSync(path, "utf8").split(/\r?\n/).filter((line) => /^import\s/.test(line)).map((line) => `${path}: ${line}`));
  assert.equal(importLines.filter((line) => /@fal-ai|trigger|create-order|credits-gate|image-generation/i.test(line)).length, 0, "prompt lab must stay isolated from generation, orders and credits");

  const generateRoute = readFileSync(join(process.cwd(), "app", "api", "prompt-lab", "generate", "route.ts"), "utf8");
  const feedbackRoute = readFileSync(join(process.cwd(), "app", "api", "prompt-lab", "runs", "[id]", "route.ts"), "utf8");
  assert.match(generateRoute, /auth\.getUser\(\)/, "generation API must authenticate");
  assert.match(feedbackRoute, /\.eq\("user_id", user\.id\)/, "feedback API must enforce ownership");

  const clientUi = readFileSync(join(process.cwd(), "app", "(protected)", "prompt-lab", "PromptLabClient.tsx"), "utf8");
  const resultUi = readFileSync(join(process.cwd(), "app", "(protected)", "prompt-lab", "PromptLabResult.tsx"), "utf8");
  const historyUi = readFileSync(join(process.cwd(), "app", "(protected)", "prompt-lab", "PromptLabHistory.tsx"), "utf8");
  assert.match(clientUi, /\/api\/prompt-lab\/generate/, "UI must call only the prompt generation API");
  assert.match(clientUi, /method: "PATCH"/, "UI must persist feedback");
  assert.match(resultUi, /navigator\.clipboard\.writeText/, "prompt cards must support copying");
  assert.match(resultUi, /Retry with fixes/, "UI must expose linked manual revisions");
  assert.match(historyUi, /onSelect\(run\)/, "saved history must reopen a run");

  console.log("Prompt lab checks passed: schemas, planning, references, prompt/retry assembly, validation, cost, idempotency, one-call behavior, API errors, revision links and isolation.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
