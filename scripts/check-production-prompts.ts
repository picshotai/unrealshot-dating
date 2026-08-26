import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  ANCHOR_REFERENCE_SENTENCE,
  CRAFT_REFERENCE_MANIFEST,
  IDENTITY_SENTENCE,
  buildDatingInteractionRequest,
  buildPortfolioRequest,
  buildShootWriterRequest,
  classifyCreativeProviderError,
  customerCreativeInputSchema,
  extractDatingInteractionResponse,
  generatePortfolioCandidate,
  generateShootCandidate,
  noveltyIdeaKey,
  parsePortfolioTransport,
  portfolioCandidateToTransport,
  portfolioJsonSchema,
  selectCraftReferences,
  validatePortfolioCandidate,
  validateShootOutput,
  type DatingShootIntent,
} from "../lib/dating/creative-director";
import { getDatingProductConfig } from "../lib/dating/config";
import { mockPortfolioModelCall, mockProductionModelCall } from "../lib/dating/prompt-engine";
import { plannerCallBudget } from "../lib/dating/production-prompts/planning-policy";
import { portfolioPlanningBatch } from "../lib/dating/production-prompts/store";
import { createLocalMockShoot } from "../lib/dating/production-prompts/mock-manifest";
import { planDatingRenderModes } from "../lib/dating/production-prompts/render-plan";

async function main() {
  const input = customerCreativeInputSchema.parse({
    interests: ["gym", "tennis", "dining"],
    exclusions: ["alcohol"],
  });
  assert.throws(() => customerCreativeInputSchema.parse({ ...input, dress: "sharp" }));

  const billing = classifyCreativeProviderError(Object.assign(
    new Error("Your prepayment credits are depleted."), { status: 429 }
  ));
  assert.equal(billing.retryable, false);
  assert.doesNotMatch(billing.safeMessage, /gemini|billing|credit|balance/i);

  const providerSchema = portfolioJsonSchema(15);
  assert.equal(providerSchema.properties.shoots.minItems, 15);
  assert.equal(providerSchema.properties.shoots.maxItems, 15);
  const schemaText = JSON.stringify(providerSchema);
  for (const removed of ["qualityProof", "sceneBible", "immutableFacts", "portableProps", "portfolioRationale"]) {
    assert(!schemaText.includes(removed), `removed planner field leaked: ${removed}`);
  }
  assert(schemaText.length < 3_500);

  const interaction = buildDatingInteractionRequest({
    model: "gemini-3.7-flash",
    contents: "input",
    systemInstruction: "system",
    responseJsonSchema: providerSchema,
    maxOutputTokens: 16_384,
  });
  assert.deepEqual(interaction.generation_config, {
    thinking_level: "low", max_output_tokens: 16_384,
  });
  for (const forbidden of ["temperature", "top_p", "topP", "response_mime_type", "models/"]) {
    assert(!JSON.stringify(interaction).includes(forbidden));
  }
  assert.deepEqual(extractDatingInteractionResponse({
    id: "interaction-1", output_text: "{}",
    usage: { total_input_tokens: 2, total_output_tokens: 3, total_thought_tokens: 1, total_tokens: 6 },
  }).usage, { inputTokens: 2, outputTokens: 3, reasoningTokens: 1, totalTokens: 6 });

  const request = buildPortfolioRequest({
    input, targetCount: 15, candidateCount: 15,
    interestsStillNeeded: input.interests,
    currentOrder: [], customerHistory: [], globalHistory: [],
  });
  assert.match(request, /simple|candid|broaden/i);
  assert.match(request, /No alcohol/);
  assert.doesNotMatch(request, /qualityProof|sceneBible|captureGrammar|four.?beat template as/i);

  const portfolio = await generatePortfolioCandidate({
    input, targetCount: 15, candidateCount: 15,
    interestsStillNeeded: input.interests,
    currentOrder: [], customerHistory: [], globalHistory: [],
    modelCall: mockPortfolioModelCall(input),
  });
  assert(portfolio.output);
  assert(portfolio.validation.passed, portfolio.validation.problems.join("\n"));
  assert.equal(portfolio.output.shoots.length, 15);
  assert(parsePortfolioTransport(portfolioCandidateToTransport(portfolio.output)).success);
  const first = portfolio.output.shoots[0] as DatingShootIntent;
  assert.equal(noveltyIdeaKey(first.noveltyFingerprint).length, 64);
  assert(!("sceneBible" in first));
  assert(!("qualityProof" in first));

  const exactDuplicate = validatePortfolioCandidate({
    output: { shoots: [first, { ...portfolio.output.shoots[1], noveltyFingerprint: first.noveltyFingerprint }] },
    input, candidateCount: 2, interestsStillNeeded: [], history: [],
  });
  assert(!exactDuplicate.passed);
  assert(exactDuplicate.problems.some((problem) => /exactly repeats/i.test(problem)));

  assert.equal(CRAFT_REFERENCE_MANIFEST.length, 16);
  assert(CRAFT_REFERENCE_MANIFEST.every((item) => item.framing !== ("expression" as never)));
  const references = selectCraftReferences(first);
  assert.equal(references.length, 2);
  assert.notEqual(references[0].shootId, references[1].shootId);
  const writerRequest = buildShootWriterRequest({ brief: first, input });
  assert.match(writerRequest, /AUTHORED PHOTOGRAPHIC-CRAFT FRAGMENTS/);
  assert.match(writerRequest, /Learn only their causal camera\/body\/light writing/);
  assert.doesNotMatch(writerRequest, /Every frame prompt must contain|visibleSceneFacts|portableProps/);

  const shoot = await generateShootCandidate({
    brief: first,
    input,
    modelCall: mockProductionModelCall(first),
  });
  assert(shoot.output);
  assert(shoot.validation.passed, shoot.validation.problems.join("\n"));
  assert.equal(shoot.output.frames.length, 4);
  const anchor = shoot.output.frames.find((frame) => frame.isAnchor)!;
  assert(anchor.isProfileCandidate);
  assert(["close", "chest-up", "waist-up"].includes(anchor.cameraDistance));
  assert(anchor.prompt.startsWith(IDENTITY_SENTENCE));
  assert(!anchor.prompt.includes(ANCHOR_REFERENCE_SENTENCE));
  for (const follower of shoot.output.frames.filter((frame) => !frame.isAnchor)) {
    assert(follower.prompt.startsWith(IDENTITY_SENTENCE));
    assert(follower.prompt.includes(ANCHOR_REFERENCE_SENTENCE));
  }
  assert(shoot.output.frames.every((frame) => frame.prompt.length < 1_200));

  const invalidAnchor = structuredClone(shoot.output);
  const selected = invalidAnchor.frames.find((frame) => frame.isAnchor)!;
  selected.cameraDistance = "environmental";
  const anchorValidation = validateShootOutput({ output: invalidAnchor, brief: first, input });
  assert(!anchorValidation.passed);
  assert(anchorValidation.problems.some((problem) => /anchor must be a profile candidate/i.test(problem)));

  const config = getDatingProductConfig();
  assert(config.promptAttemptsPerIdea <= 2);
  assert.equal(plannerCallBudget(1), 2);
  assert.equal(plannerCallBudget(15), 2);
  assert.deepEqual(portfolioPlanningBatch(15), { requestedSlots: 15, candidateCount: 15 });

  const renderCandidates = portfolio.output.shoots.map((brief, index) => ({
    shootId: `shoot-${index + 1}`,
    representedInterests: brief.representedInterests,
  }));
  const sampleRenderPlan = planDatingRenderModes({
    candidates: renderCandidates,
    selectedInterests: input.interests,
    testMode: "sample",
    realShootsTarget: 2,
    seed: "sample-contract-test",
  });
  assert.equal(sampleRenderPlan.realIds.size, 2);
  assert.equal(sampleRenderPlan.mockIds.size, 13);
  assert.equal([...sampleRenderPlan.realIds].filter((id) => sampleRenderPlan.mockIds.has(id)).length, 0);
  assert.equal(
    portfolio.output.shoots.slice(2).flatMap((brief) => createLocalMockShoot(brief).frames).length,
    52
  );
  assert.equal(planDatingRenderModes({
    candidates: renderCandidates,
    selectedInterests: input.interests,
    testMode: "off",
    realShootsTarget: 15,
    seed: "full-contract-test",
  }).realIds.size, 15);

  const storeSource = readFileSync(resolve(process.cwd(), "lib/dating/production-prompts/store.ts"), "utf8");
  assert.match(storeSource, /reserve_intelligent_dating_shoots_v3/);
  assert.doesNotMatch(storeSource, /embedDatingSceneMeanings|reserve_intelligent_dating_shoots_v2/);
  const serviceSource = readFileSync(resolve(process.cwd(), "lib/dating/production-prompts/portfolio-service.ts"), "utf8");
  assert.doesNotMatch(serviceSource, /embedDatingSceneMeanings|portfolio_embedding/);

  const orchestration = readFileSync(resolve(process.cwd(), "trigger/dating-prompt-orchestration.ts"), "utf8");
  assert.match(orchestration, /planDatingRenderModes/);
  assert.match(orchestration, /createLocalMockShoot/);
  assert.match(orchestration, /render_mode === "real"/);
  assert.match(orchestration, /materialize_dynamic_order_photos_v3/);
  const shootOrchestration = readFileSync(resolve(process.cwd(), "trigger/dating-shoot.ts"), "utf8");
  assert.match(shootOrchestration, /completeLocalMockPhotos/);
  assert.match(shootOrchestration, /row\.render_mode === "mock"/);
  assert.match(shootOrchestration, /\[\.\.\.referenceImageUrls, anchorImageUrl as string\]/);

  const createOrder = readFileSync(resolve(process.cwd(), "lib/dating/create-order.ts"), "utf8");
  assert.match(createOrder, /testMode: productConfig\.testMode/);
  assert.match(createOrder, /realShootsTarget/);
  assert.match(createOrder, /legacy_incompatible/);

  const migration = readFileSync(resolve(process.cwd(), "supabase/migrations/041_dating_capture_pipeline_v3.sql"), "utf8");
  assert.match(migration, /test_mode_snapshot/);
  assert.match(migration, /reserve_intelligent_dating_shoots_v3/);
  assert.match(migration, /materialize_dynamic_order_photos_v3/);
  assert.match(migration, /legacy_incompatible/);
  assert.match(migration, /already_running/);
  assert.doesNotMatch(migration, /update public\.credits[\s\S]{0,250}legacy_incompatible/);

  console.log("Dating capture pipeline v3 checks passed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
