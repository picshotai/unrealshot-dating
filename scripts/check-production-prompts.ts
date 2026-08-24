import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  ANCHOR_REFERENCE_SENTENCE,
  buildPortfolioRequest,
  buildShootWriterRequest,
  customerCreativeInputSchema,
  embedDatingSceneMeanings,
  generatePortfolioCandidate,
  generateShootCandidate,
  noveltyIdeaKey,
  noveltySimilarity,
  validatePortfolioCandidate,
  validateShootOutput,
  type DatingShootIntent,
} from "../lib/dating/creative-director";
import {
  mockPortfolioModelCall,
  mockProductionModelCall,
  mockCreativeEmbeddingCall,
} from "../lib/dating/prompt-engine";
import { getDatingProductConfig } from "../lib/dating/config";
import { portfolioPlanningBatch } from "../lib/dating/production-prompts/store";

async function main() {
const input = customerCreativeInputSchema.parse({
  interests: ["gym", "tennis", "dining"],
  exclusions: ["alcohol"],
});
assert.throws(() => customerCreativeInputSchema.parse({ ...input, dress: "sharp" }));

const request = buildPortfolioRequest({
  input,
  targetCount: 15,
  candidateCount: 20,
  interestsStillNeeded: input.interests,
  currentOrder: [],
  customerHistory: [],
  globalHistory: [],
});
assert.match(request, /Gym|gym/i);
assert.match(request, /No alcohol/);
assert.doesNotMatch(request, /customer style|dress preference|captureGrammar/i);

const portfolio = await generatePortfolioCandidate({
  input,
  targetCount: 15,
  candidateCount: 20,
  interestsStillNeeded: input.interests,
  currentOrder: [],
  customerHistory: [],
  globalHistory: [],
  modelCall: mockPortfolioModelCall(input),
});
assert(portfolio.output);
assert(portfolio.validation.passed, portfolio.validation.problems.join("\n"));
assert.equal(portfolio.output.shoots.length, 20);
const embedded = await embedDatingSceneMeanings(
  portfolio.output.shoots.map((shoot) => shoot.noveltyFingerprint),
  mockCreativeEmbeddingCall
);
assert.equal(embedded.vectors.length, 20);
assert(embedded.vectors.every((vector) => vector.length === 768));
const represented = new Set(portfolio.output.shoots.flatMap((shoot) => shoot.representedInterests));
for (const interest of input.interests) assert(represented.has(interest));

const first = portfolio.output.shoots[0] as DatingShootIntent;
assert.equal(noveltyIdeaKey(first.noveltyFingerprint).length, 64);
assert(noveltySimilarity(first.noveltyFingerprint, first.noveltyFingerprint) === 1);
assert(noveltySimilarity(first.noveltyFingerprint, "underwater coral expedition") < 0.3);

const duplicated = {
  portfolioRationale: portfolio.output.portfolioRationale,
  shoots: [portfolio.output.shoots[0], {
    ...portfolio.output.shoots[1],
    noveltyFingerprint: portfolio.output.shoots[0].noveltyFingerprint,
  }],
};
const duplicateValidation = validatePortfolioCandidate({
  output: duplicated,
  input,
  candidateCount: 2,
  interestsStillNeeded: [],
  history: [],
});
assert(!duplicateValidation.passed);
assert(duplicateValidation.problems.some((problem) => /too similar/i.test(problem)));

const writerRequest = buildShootWriterRequest({ brief: first, input });
assert.match(writerRequest, /LOCKED SHOOT INTENT/);
assert.match(writerRequest, /scene-anchor image/);
assert.doesNotMatch(writerRequest, /close[\s\S]*medium[\s\S]*three.?quarter[\s\S]*expression/i);

const shoot = await generateShootCandidate({
  brief: first,
  input,
  modelCall: mockProductionModelCall(first),
});
assert(shoot.output);
assert(shoot.validation.passed, shoot.validation.problems.join("\n"));
assert.equal(shoot.output.frames.length, 4);
assert.equal(shoot.output.frames.filter((frame) => frame.isAnchor).length, 1);
assert(shoot.output.frames.some((frame) => frame.isProfileCandidate));
for (const frame of shoot.output.frames) {
  assert.equal(frame.width, 1728);
  assert.equal(frame.height, 2304);
  if (frame.isAnchor) assert(!frame.prompt.includes(ANCHOR_REFERENCE_SENTENCE));
  else assert(frame.prompt.includes(ANCHOR_REFERENCE_SENTENCE));
}
const anchor = shoot.output.frames.find((frame) => frame.isAnchor)!;
assert.equal(anchor.visibleSceneFacts.length, first.sceneBible.immutableFacts.length);
assert.equal(anchor.visiblePortableProps.length, first.sceneBible.portableProps.length);

const corrupted = structuredClone(shoot.output);
corrupted.frames[1].visibleSceneFacts = ["a wall invented only for this pose"];
const corruptedValidation = validateShootOutput({ output: corrupted, brief: first, input });
assert(!corruptedValidation.passed);
assert(corruptedValidation.problems.some((problem) => /undeclared scene fact/i.test(problem)));

const incompleteAnchor = structuredClone(shoot.output);
incompleteAnchor.frames.find((frame) => frame.isAnchor)!.visibleSceneFacts = [first.sceneBible.immutableFacts[0]];
const incompleteAnchorValidation = validateShootOutput({ output: incompleteAnchor, brief: first, input });
assert(!incompleteAnchorValidation.passed);
assert(incompleteAnchorValidation.problems.some((problem) => /anchor does not establish scene fact/i.test(problem)));

const config = getDatingProductConfig();
assert(!("pipelineMode" in config));
assert(!("pipelineUserIds" in config));
for (let missing = 1; missing <= 30; missing += 1) {
  const batch = portfolioPlanningBatch(missing);
  assert(batch.requestedSlots <= 7);
  assert(batch.candidateCount <= 8);
  assert(batch.candidateCount > batch.requestedSlots);
}

const productionFiles = [
  "lib/dating/create-order.ts",
  "lib/dating/production-prompts/store.ts",
  "lib/dating/prompt-engine/production.ts",
  "trigger/dating-prompt.ts",
  "trigger/dating-portfolio.ts",
];
for (const relative of productionFiles) {
  const source = readFileSync(resolve(process.cwd(), relative), "utf8");
  assert.doesNotMatch(source, /scene-recipes|planDatingSceneBriefs|selectPromptLabReference/);
}

for (const relative of [
  "lib/dating/creative-director/portfolio.ts",
  "lib/dating/creative-director/writer.ts",
  "lib/dating/prompt-engine/production.ts",
]) {
  const source = readFileSync(resolve(process.cwd(), relative), "utf8");
  assert.doesNotMatch(source, /@fal-ai|trigger\/|credits-gate|order_photos/);
}

const createOrderSource = readFileSync(
  resolve(process.cwd(), "lib/dating/create-order.ts"),
  "utf8"
);
assert.match(createOrderSource, /pipeline_mode: "dynamic"/);
assert.doesNotMatch(createOrderSource, /planUniqueOrderDelivery|dynamicPromptsEnabled|creative_input: \{[^}]*dress/);

const productionStoreSource = readFileSync(
  resolve(process.cwd(), "lib/dating/production-prompts/store.ts"),
  "utf8"
);
assert.match(productionStoreSource, /MAX_PORTFOLIO_CANDIDATES_PER_CALL = 8/);
assert.match(productionStoreSource, /previousCandidateWarnings\(last\?\.raw_output\)/);

const orchestratorSource = readFileSync(
  resolve(process.cwd(), "trigger/dating-shoot.ts"),
  "utf8"
);
const anchorWave = orchestratorSource.indexOf("WRITER-SELECTED SCENE ANCHORS");
const anchorReread = orchestratorSource.indexOf("ANCHOR STATE, RE-READ FROM THE DATABASE");
const followerWave = orchestratorSource.indexOf("THE FRAMES THAT REFERENCE THEM");
assert(anchorWave >= 0 && anchorWave < anchorReread && anchorReread < followerWave);
assert.match(orchestratorSource, /toPayload\(row, anchor\?\.image_url \?\? null\)/);
assert.match(orchestratorSource, /\[\.\.\.referenceImageUrls, anchorImageUrl as string\]/);

const migration = readFileSync(
  resolve(process.cwd(), "supabase/migrations/037_intelligent_dating_portfolio.sql"),
  "utf8"
);
assert.match(migration, /novelty_embedding extensions\.vector\(768\)/);
assert.match(migration, /pg_advisory_xact_lock/);
assert.match(migration, /jsonb_array_length\(accepted_output->'frames'\) <> 4/);
assert.match(migration, /frame\.value->>'isAnchor'/);
assert.match(migration, /frame\.value \? 'isAnchor'/);
assert.match(migration, /claimed\.order_id = p_order_id[\s\S]*>= 0\.82/);
assert.match(migration, /owner_order\.user_id = v_user_id[\s\S]*>= 0\.86/);
assert.match(migration, /nearest\.semantic_similarity >= 0\.90/);

console.log("Intelligent dating portfolio and context-led writer checks passed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
