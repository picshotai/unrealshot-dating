import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { dynamicPromptsEnabled, type DatingProductConfig } from "../lib/dating/config";
import {
  generateProductionPromptCandidate,
  mockProductionModelCall,
} from "../lib/dating/prompt-engine";
import { buildPromptLabRequest } from "../lib/dating/prompt-lab/prompt";
import { selectPromptLabReference } from "../lib/dating/prompt-lab/references";
import { PROMPT_LAB_MODEL, PROMPT_LAB_THINKING_LEVEL } from "../lib/dating/prompt-lab/schemas";
import { planDatingSceneBriefs } from "../lib/dating/scene-recipes";
import { activityWardrobeProblems } from "../lib/dating/scene-recipes/wardrobe";
import { selectSampleShootIds } from "../lib/dating/sample-selection";

function filesUnder(root: string): string[] {
  return readdirSync(root).flatMap((name) => {
    const path = join(root, name);
    return statSync(path).isDirectory() ? filesUnder(path) : [path];
  });
}

const brief = planDatingSceneBriefs({
  orderId: "d43b5192-b033-4cdc-b794-376d31a67e87",
  count: 1,
  interests: ["coffee", "reading"],
  dress: "casual",
  exclusions: ["alcohol"],
})[0];
const request = buildPromptLabRequest({
  input: {
    clientRequestId: "52ec6022-c51e-4cbb-a79a-783d619aa50a",
    interests: ["coffee", "reading"],
    dress: "casual",
    exclusions: ["alcohol"],
    kind: brief.kind,
    light: brief.lightFamily,
  },
  plan: { kind: brief.kind, light: brief.lightFamily },
  reference: selectPromptLabReference(brief.lightFamily),
  recentScenes: [],
  lockedBrief: brief,
});
assert.match(request, new RegExp(`scene\\.id \\(exact\\): ${brief.sceneId}`));
assert(request.includes(`scene.conceptFamily (exact): ${brief.conceptFamily}`));
assert(request.includes(`scene.settingFamily (exact): ${brief.settingFamily}`));
assert(request.includes(brief.environmentAnchors[0]));
assert(request.includes(brief.wardrobeContract));
assert.equal(PROMPT_LAB_MODEL, "gemini-3.7-flash");
assert.equal(PROMPT_LAB_THINKING_LEVEL, "low");

const sample = selectSampleShootIds({
  candidates: [
    { shootId: "unrelated-a", representedInterests: ["coffee"] },
    { shootId: "selected-tennis", representedInterests: ["tennis"] },
    { shootId: "unrelated-b", representedInterests: ["reading"] },
  ],
  selectedInterests: ["tennis"],
  count: 1,
  seed: "sample-regression",
});
assert.deepEqual([...sample], ["selected-tennis"]);
assert(activityWardrobeProblems({
  kind: "activity",
  representedInterest: "tennis",
  outfit: "a brown hoodie, black cargo trousers, leather boots and a steel watch",
}).length >= 2);
assert.deepEqual(activityWardrobeProblems({
  kind: "activity",
  representedInterest: "tennis",
  outfit: "a fitted breathable tennis polo, tapered technical trousers, white court trainers and a steel watch",
}), []);

const baseConfig: DatingProductConfig = {
  pipelineMode: "off",
  pipelineUserIds: new Set(["allowlisted"]),
  shootsPerDelivery: 15,
  framesPerShoot: 4,
  photosPerDelivery: 60,
  testMode: "mock",
  sampleShoots: 2,
  geminiConcurrency: 4,
  promptAttemptsPerIdea: 3,
};
assert(!dynamicPromptsEnabled({ userId: "owner", isOwner: true, config: baseConfig }));
assert(dynamicPromptsEnabled({ userId: "owner", isOwner: true, config: { ...baseConfig, pipelineMode: "owner" } }));
assert(dynamicPromptsEnabled({ userId: "allowlisted", isOwner: false, config: { ...baseConfig, pipelineMode: "owner" } }));
assert(dynamicPromptsEnabled({ userId: "customer", isOwner: false, config: { ...baseConfig, pipelineMode: "all" } }));

const isolatedRoots = [
  join(process.cwd(), "lib", "dating", "scene-recipes"),
  join(process.cwd(), "lib", "dating", "prompt-engine"),
  join(process.cwd(), "lib", "dating", "production-prompts"),
  join(process.cwd(), "trigger", "dating-prompt.ts"),
];
const productionPromptSource = isolatedRoots.flatMap((path) =>
  statSync(path).isDirectory() ? filesUnder(path) : [path]
).filter((path) => /\.tsx?$/.test(path)).map((path) => readFileSync(path, "utf8")).join("\n");
assert(!/@fal-ai|generateSingleDatingImage|spendShootCredits|order_photos/.test(productionPromptSource),
  "recipe and prompt generation modules must not import Fal, image workers, credits or photo allocation");

const orchestrator = readFileSync(join(process.cwd(), "trigger", "dating-shoot.ts"), "utf8");
assert(orchestrator.indexOf("prepareDynamicOrder") < orchestrator.indexOf("loadPhotoRows(db, batchId)"));
assert(orchestrator.indexOf("anchorsToRun") < orchestrator.indexOf("dispatchable"));
assert.match(orchestrator, /anchorImageUrl: anchorImageUrl \?\? null/);

const migration = readFileSync(
  join(process.cwd(), "supabase", "migrations", "033_dynamic_dating_prompt_pipeline.sql"),
  "utf8"
);
assert.match(migration, /dating_order_shoots_active_idea_unique/);
assert.match(migration, /unique\(order_id, slot_index\)/);
assert.match(migration, /complete_dating_prompt_attempt/);
assert.match(migration, /v_allocated <> v_target \* 4/);
assert.match(migration, /dating-scene-v3[\s\S]*threeQuarter/);

generateProductionPromptCandidate({
  brief,
  recentScenes: [],
  modelCall: mockProductionModelCall(brief),
}).then((generation) => {
  assert(generation.validation.passed, generation.validation.problems.join("\n"));
  assert.equal(generation.usage.totalTokens, 0);
  console.log("Production prompt checks passed: locked briefs, zero-provider mock, rollout modes, isolation, atomic acceptance, exact allocation and anchor-first ordering.");
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
