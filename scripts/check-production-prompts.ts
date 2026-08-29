import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  ANCHOR_EXPRESSION_SENTENCE,
  ANCHOR_REFERENCE_SENTENCE,
  CRAFT_REFERENCE_MANIFEST,
  IDENTITY_SENTENCE,
  NEUTRAL_FOLLOWER_EXPRESSION_SENTENCE,
  OUTFIT_SENTENCE_PREFIX,
  PHYSICAL_COHERENCE_SENTENCE,
  SHOOT_WRITER_SYSTEM_INSTRUCTION,
  SINGLE_VISIBLE_IDENTITY_SENTENCE,
  WARM_FOLLOWER_EXPRESSION_SENTENCE,
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
  refinePromptForRetake,
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
    includeSimpleCandids: true,
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
  assert.deepEqual(providerSchema.properties.shoots.items.required, [
    "core", "representedInterests", "continuityEssentials",
  ]);
  assert.equal(providerSchema.properties.shoots.items.properties.core.minItems, 14);
  assert.equal(providerSchema.properties.shoots.items.properties.core.maxItems, 14);
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
  assert.deepEqual(interaction.response_format, {
    type: "text",
    mime_type: "application/json",
    schema: providerSchema,
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
    subjectLedStillNeeded: 2,
    currentOrder: [], customerHistory: [], globalHistory: [],
  });
  assert.match(request, /simple|candid|broaden/i);
  assert.match(request, /No alcohol/);
  assert.match(request, /SUBJECT-LED ALLOCATION/);
  assert.match(request, /at least 2 concepts with subjectLed=true/);
  assert.doesNotMatch(request, /qualityProof|sceneBible|captureGrammar|four.?beat template as/i);

  const portfolio = await generatePortfolioCandidate({
    input, targetCount: 15, candidateCount: 15,
    interestsStillNeeded: input.interests,
    subjectLedStillNeeded: 2,
    currentOrder: [], customerHistory: [], globalHistory: [],
    modelCall: mockPortfolioModelCall(input),
  });
  assert(portfolio.output);
  assert(portfolio.validation.passed, portfolio.validation.problems.join("\n"));
  assert.equal(portfolio.output.shoots.length, 15);
  assert.equal(portfolio.output.shoots.filter((brief) => brief.subjectLed).length, 2);
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
  assert.doesNotMatch(writerRequest, /SUBJECT-LED CAPTURE EMPHASIS/);
  assert.doesNotMatch(SHOOT_WRITER_SYSTEM_INSTRUCTION, /SUBJECT-LED CAPTURE EMPHASIS/);
  const subjectLedBrief = portfolio.output.shoots.find((brief) => brief.subjectLed)!;
  const subjectLedWriterRequest = buildShootWriterRequest({ brief: subjectLedBrief, input });
  assert.match(subjectLedWriterRequest, /SUBJECT-LED CAPTURE EMPHASIS/);
  assert.match(subjectLedWriterRequest, /Do not introduce a held or operated prop/);
  assert.match(SHOOT_WRITER_SYSTEM_INSTRUCTION, /only visible person/i);
  assert.match(SHOOT_WRITER_SYSTEM_INSTRUCTION, /account for both hands/i);
  assert.match(SHOOT_WRITER_SYSTEM_INSTRUCTION, /do not force hands/i);
  assert.match(SHOOT_WRITER_SYSTEM_INSTRUCTION, /receiving glass.*stable surface/i);
  assert.match(SHOOT_WRITER_SYSTEM_INSTRUCTION, /complete locked outfit verbatim/i);

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
  assert.equal(anchor.expressionType, "neutral");
  assert(anchor.prompt.startsWith(IDENTITY_SENTENCE));
  assert(anchor.prompt.includes(SINGLE_VISIBLE_IDENTITY_SENTENCE));
  assert(anchor.prompt.includes(`${OUTFIT_SENTENCE_PREFIX} ${first.outfit}`));
  assert(anchor.prompt.includes(PHYSICAL_COHERENCE_SENTENCE));
  assert(anchor.prompt.includes(ANCHOR_EXPRESSION_SENTENCE));
  assert(!anchor.prompt.includes(ANCHOR_REFERENCE_SENTENCE));
  for (const follower of shoot.output.frames.filter((frame) => !frame.isAnchor)) {
    assert(follower.prompt.startsWith(IDENTITY_SENTENCE));
    assert(follower.prompt.includes(SINGLE_VISIBLE_IDENTITY_SENTENCE));
    assert(follower.prompt.includes(`${OUTFIT_SENTENCE_PREFIX} ${first.outfit}`));
    assert(follower.prompt.includes(PHYSICAL_COHERENCE_SENTENCE));
    assert(follower.prompt.includes(ANCHOR_REFERENCE_SENTENCE));
    if (follower.expressionType === "warm") {
      assert(follower.prompt.includes(WARM_FOLLOWER_EXPRESSION_SENTENCE));
    } else {
      assert(follower.prompt.includes(NEUTRAL_FOLLOWER_EXPRESSION_SENTENCE));
    }
  }
  assert(shoot.output.frames.every((frame) => frame.prompt.length < 1_200));

  // Verify craft references are stripped of smile/laugh/expression cues
  for (const ref of CRAFT_REFERENCE_MANIFEST) {
    const loadedRefs = selectCraftReferences({ ...first, light: ref.lightFamily });
    for (const r of loadedRefs) {
      assert.doesNotMatch(
        r.prompt,
        /\b(half-smile|faint smile|slight smile|subtle smile|subtle smirk|corners? lifted|lips just parted|parted mouth|laugh|laughing|grin|grinning|teeth)\b/i,
        `Craft reference ${r.shootId} still contains expression cues`
      );
    }
  }

  // Anchor cannot smile or have warm expression
  const smilingAnchor = structuredClone(shoot.output);
  const anchorFrame = smilingAnchor.frames.find((frame) => frame.isAnchor)!;
  anchorFrame.capturePrompt += " A subtle smile shows on his face.";
  const smilingAnchorVal = validateShootOutput({ output: smilingAnchor, brief: first, input });
  assert(!smilingAnchorVal.passed);
  assert(smilingAnchorVal.problems.some((problem) => /anchor frame must have a calm, neutral, relaxed expression/i.test(problem)));

  // Max 1 subtle smile across the shoot
  const multiSmile = structuredClone(shoot.output);
  multiSmile.frames[1].expressionType = "warm";
  multiSmile.frames[1].capturePrompt += " A subtle smile softens his face.";
  multiSmile.frames[3].expressionType = "warm";
  multiSmile.frames[3].capturePrompt += " A subtle smile softens his face.";
  const multiSmileVal = validateShootOutput({ output: multiSmile, brief: first, input });
  assert(!multiSmileVal.passed);
  assert(multiSmileVal.problems.some((problem) => /at most 1 subtle smile/i.test(problem)));

  // Laughter / teeth / grin strictly forbidden anywhere
  const laughingShoot = structuredClone(shoot.output);
  laughingShoot.frames[2].capturePrompt += " He laughs with teeth visible.";
  const laughingVal = validateShootOutput({ output: laughingShoot, brief: first, input });
  assert(!laughingVal.passed);
  assert(laughingVal.problems.some((problem) => /overt laughter/i.test(problem)));

  const invalidAnchor = structuredClone(shoot.output);
  const selected = invalidAnchor.frames.find((frame) => frame.isAnchor)!;
  selected.cameraDistance = "environmental";
  const anchorValidation = validateShootOutput({ output: invalidAnchor, brief: first, input });
  assert(!anchorValidation.passed);
  assert(anchorValidation.problems.some((problem) => /anchor must be a profile candidate/i.test(problem)));

  const secondaryIdentity = structuredClone(shoot.output);
  secondaryIdentity.frames[0].capturePrompt += " His friend reaches into frame.";
  const secondaryValidation = validateShootOutput({
    output: secondaryIdentity,
    brief: first,
    input,
  });
  assert(!secondaryValidation.passed);
  assert(secondaryValidation.problems.some((problem) => /secondary person/i.test(problem)));

  const floatingGlass = structuredClone(shoot.output);
  floatingGlass.frames[0].capturePrompt =
    "He leans one hand on the counter and pours a bottle into a glass. A 3:4 candid photograph.";
  const floatingValidation = validateShootOutput({
    output: floatingGlass,
    brief: first,
    input,
  });
  assert(!floatingValidation.passed);
  assert(floatingValidation.problems.some((problem) => /supported receiving vessel/i.test(problem)));

  floatingGlass.frames[0].capturePrompt =
    "He pours a bottle into a glass resting on the counter. A 3:4 candid photograph.";
  const supportedValidation = validateShootOutput({
    output: floatingGlass,
    brief: first,
    input,
  });
  assert(!supportedValidation.problems.some((problem) => /supported receiving vessel/i.test(problem)));

  // Test Retake Prompt Refinement
  const originalFollowerPrompt = shoot.output.frames[1].prompt;
  
  // 1. No feedback returns exact original prompt
  const unrefined = await refinePromptForRetake({
    originalPrompt: originalFollowerPrompt,
    feedback: "",
    outfit: first.outfit,
    isAnchor: false,
  });
  assert.equal(unrefined, originalFollowerPrompt);

  // 2. Refinement with mock model call produces clean compiled prompt
  const refined = await refinePromptForRetake({
    originalPrompt: originalFollowerPrompt,
    feedback: "His hand is awkwardly placed on his thigh, make both hands rest casually in his pockets",
    outfit: first.outfit,
    isAnchor: false,
    shootTitle: first.title,
    cameraDistance: "waist-up",
    modelCall: async () => ({
      text: JSON.stringify({
        revisedCapturePrompt: "He stands comfortably with both hands resting casually inside his trouser pockets, weight shifted to his back leg. A 3:4 waist-up candid photograph.",
        rationale: "Moved both hands into pockets to eliminate awkward thigh contact.",
      }),
      usage: { inputTokens: 100, outputTokens: 50, reasoningTokens: 0, totalTokens: 150 },
      interactionId: null,
    }),
  });
  assert(refined.startsWith(IDENTITY_SENTENCE));
  assert(refined.includes(SINGLE_VISIBLE_IDENTITY_SENTENCE));
  assert(refined.includes(`${OUTFIT_SENTENCE_PREFIX} ${first.outfit}`));
  assert(refined.includes(PHYSICAL_COHERENCE_SENTENCE));
  assert(refined.includes(ANCHOR_REFERENCE_SENTENCE));
  assert(refined.includes("both hands resting casually inside his trouser pockets"));
  assert(refined.includes(NEUTRAL_FOLLOWER_EXPRESSION_SENTENCE));

  // 3. Graceful fallback on model failure
  const fallback = await refinePromptForRetake({
    originalPrompt: originalFollowerPrompt,
    feedback: "Some feedback",
    modelCall: async () => {
      throw new Error("Provider rate limit");
    },
  });
  assert.equal(fallback, originalFollowerPrompt);

  const config = getDatingProductConfig();
  assert(config.promptAttemptsPerIdea <= 2);
  assert.equal(plannerCallBudget(1), 2);
  assert.equal(plannerCallBudget(15), 2);
  assert.deepEqual(portfolioPlanningBatch(15), { requestedSlots: 15, candidateCount: 15 });

  const renderCandidates = portfolio.output.shoots.map((brief, index) => ({
    shootId: `shoot-${index + 1}`,
    representedInterests: brief.representedInterests,
    subjectLed: brief.subjectLed === true,
  }));
  const sampleRenderPlan = planDatingRenderModes({
    candidates: renderCandidates,
    selectedInterests: input.interests,
    includeSimpleCandids: input.includeSimpleCandids,
    testMode: "sample",
    realShootsTarget: 2,
    seed: "sample-contract-test",
  });
  assert.equal(sampleRenderPlan.realIds.size, 2);
  assert.equal(sampleRenderPlan.mockIds.size, 13);
  assert.equal(
    renderCandidates.filter((candidate) =>
      candidate.subjectLed && sampleRenderPlan.realIds.has(candidate.shootId)
    ).length,
    1
  );
  assert(
    renderCandidates.some((candidate) =>
      !candidate.subjectLed &&
      candidate.representedInterests.length > 0 &&
      sampleRenderPlan.realIds.has(candidate.shootId)
    )
  );
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
  const threeShootSample = planDatingRenderModes({
    candidates: renderCandidates,
    selectedInterests: input.interests,
    includeSimpleCandids: true,
    testMode: "sample",
    realShootsTarget: 3,
    seed: "three-shoot-subject-led-test",
  });
  assert.equal(
    renderCandidates.filter((candidate) =>
      candidate.subjectLed && threeShootSample.realIds.has(candidate.shootId)
    ).length,
    2
  );

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

  const datingClient = readFileSync(
    resolve(process.cwd(), "app/(protected)/dating-shoot/DatingShootClient.tsx"),
    "utf8"
  );
  assert.match(datingClient, /fetchPhotoBlob\(photo\.id/);
  assert.doesNotMatch(datingClient, /fetch\(imageUrl\)/);
  assert.match(datingClient, /regenerationAttempt\.current/);
  assert.match(datingClient, /photo\.imageUrl !== attempt\.previousImageUrl/);

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
