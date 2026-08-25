import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  ANCHOR_REFERENCE_SENTENCE,
  buildPortfolioRequest,
  buildShootWriterRequest,
  buildDatingInteractionRequest,
  classifyCreativeProviderError,
  customerCreativeInputSchema,
  embedDatingSceneMeanings,
  generatePortfolioCandidate,
  generateShootCandidate,
  noveltyIdeaKey,
  noveltySimilarity,
  extractDatingInteractionResponse,
  portfolioCandidateToTransport,
  portfolioJsonSchema,
  parsePortfolioTransport,
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
import {
  nextNoProgressCount,
  plannerCallBudget,
  planningHasStalled,
} from "../lib/dating/production-prompts/planning-policy";

async function main() {
const input = customerCreativeInputSchema.parse({
  interests: ["gym", "tennis", "dining"],
  exclusions: ["alcohol"],
});
assert.throws(() => customerCreativeInputSchema.parse({ ...input, dress: "sharp" }));

const badRequest = Object.assign(new Error("400 INVALID_ARGUMENT: temperature is not supported"), {
  status: 400,
});
const badRequestFailure = classifyCreativeProviderError(badRequest);
assert.equal(badRequestFailure.retryable, false);
assert.match(badRequestFailure.diagnostic, /temperature is not supported/);
const outageFailure = classifyCreativeProviderError(
  Object.assign(new Error("service unavailable"), { status: 503 })
);
assert.equal(outageFailure.retryable, true);

const providerSchema = portfolioJsonSchema(7);
assert.equal(providerSchema.properties.shoots.minItems, 7);
assert.equal(providerSchema.properties.shoots.maxItems, 7);
assert(JSON.stringify(providerSchema).length < 2_000);
assert(!("enum" in providerSchema.properties.shoots.items.properties.representedInterests.items));
assert.equal(providerSchema.properties.shoots.items.properties.provenance.minItems, 5);
assert.equal(providerSchema.properties.shoots.items.properties.qualityProof.maxItems, 6);
const interactionRequest = buildDatingInteractionRequest({
  model: "gemini-3.7-flash",
  contents: "customer input",
  systemInstruction: "system instruction",
  responseJsonSchema: providerSchema,
  maxOutputTokens: 32_768,
});
assert.deepEqual(interactionRequest, {
  model: "gemini-3.7-flash",
  input: "customer input",
  system_instruction: "system instruction",
  store: false,
  generation_config: { thinking_level: "low", max_output_tokens: 32_768 },
  response_format: { type: "text", mime_type: "application/json", schema: providerSchema },
});
const serializedInteractionRequest = JSON.stringify(interactionRequest);
for (const forbidden of ["temperature", "top_p", "topP", "response_mime_type", "models/"]) {
  assert(!serializedInteractionRequest.includes(forbidden), `forbidden provider field: ${forbidden}`);
}
assert.deepEqual(
  extractDatingInteractionResponse({
    id: "interaction-1",
    output_text: '{"ok":true}',
    usage: {
      total_input_tokens: 11,
      total_output_tokens: 7,
      total_thought_tokens: 3,
      total_tokens: 21,
    },
  }),
  {
    interactionId: "interaction-1",
    text: '{"ok":true}',
    usage: { inputTokens: 11, outputTokens: 7, reasoningTokens: 3, totalTokens: 21 },
  }
);

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
assert.match(request, /candidateId must contain only lowercase letters, numbers and hyphens/);
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
const roundTrip = parsePortfolioTransport(portfolioCandidateToTransport(portfolio.output));
assert(roundTrip.success);
assert.deepEqual(roundTrip.data, portfolio.output);
const longRationale = portfolioCandidateToTransport(portfolio.output);
longRationale.portfolioRationale = "A specific portfolio explanation. ".repeat(50);
assert(parsePortfolioTransport(longRationale).success);
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

const historicalSimilarity = validatePortfolioCandidate({
  output: {
    portfolioRationale: portfolio.output.portfolioRationale,
    shoots: [portfolio.output.shoots[0]],
  },
  input,
  candidateCount: 1,
  interestsStillNeeded: [],
  history: [{
    title: "Previously delivered scene",
    canonicalSummary: portfolio.output.shoots[0].canonicalSummary,
    noveltyFingerprint: portfolio.output.shoots[0].noveltyFingerprint,
  }],
});
assert(historicalSimilarity.passed);
assert(historicalSimilarity.warnings.some((warning) => /semantically close/i.test(warning)));

const writerRequest = buildShootWriterRequest({ brief: first, input });
assert.match(writerRequest, /LOCKED SHOOT INTENT/);
assert.match(writerRequest, /scene-anchor image/);
assert.match(writerRequest, /frameId must contain only lowercase letters, numbers and hyphens/);
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
assert.equal(plannerCallBudget(5), 3);
assert.equal(plannerCallBudget(15), 5);
assert.equal(plannerCallBudget(30), 7);
assert.equal(nextNoProgressCount(1, 0), 2);
assert.equal(nextNoProgressCount(1, 3), 0);
assert(planningHasStalled(3, 2));
assert(planningHasStalled(0, 0));
assert(!planningHasStalled(1, 1));

const productionFiles = [
  "lib/dating/create-order.ts",
  "lib/dating/production-prompts/store.ts",
  "lib/dating/prompt-engine/production.ts",
  "trigger/dating-prompt.ts",
  "lib/dating/production-prompts/portfolio-service.ts",
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
assert.match(createOrderSource, /createReservedDatingOrder/);
assert.match(createOrderSource, /idempotencyKeys\.create\(`dating-order:/);
assert.match(createOrderSource, /const resumeStage = reservation\.stage/);
assert.doesNotMatch(createOrderSource, /const promptOnly =/);
assert.doesNotMatch(createOrderSource, /planUniqueOrderDelivery|dynamicPromptsEnabled|creative_input: \{[^}]*dress/);

const productionStoreSource = readFileSync(
  resolve(process.cwd(), "lib/dating/production-prompts/store.ts"),
  "utf8"
);
assert.match(productionStoreSource, /MAX_PORTFOLIO_CANDIDATES_PER_CALL = 8/);
assert.match(productionStoreSource, /reservationFeedback\(last\?\.reservation_report/);
assert.match(productionStoreSource, /reserve_intelligent_dating_shoots_v2/);
assert.doesNotMatch(productionStoreSource, /previousCandidateWarnings/);
assert.match(productionStoreSource, /provider_phase === "portfolio_embedding" && running\.raw_output/);
assert.match(productionStoreSource, /Failed to resume portfolio embedding/);

const creativeModelSource = readFileSync(
  resolve(process.cwd(), "lib/dating/creative-director/model.ts"),
  "utf8"
);
assert.doesNotMatch(creativeModelSource, /temperature\s*:/);

const dashboardSource = readFileSync(
  resolve(process.cwd(), "app/(protected)/dating-shoot/DatingShootClient.tsx"),
  "utf8"
);
assert.doesNotMatch(dashboardSource, /Array\.from\(\{\s*length:\s*10\s*\}\)/);
assert.match(dashboardSource, /PortfolioProgressPanel/);
assert.match(dashboardSource, /status\?\.order\.status === 'failed'/);
assert.match(dashboardSource, /if \(terminal && !regenLoadingId\) return/);

const runStatusSource = readFileSync(
  resolve(process.cwd(), "app/api/dating-shoot/run-status/route.ts"),
  "utf8"
);
assert.doesNotMatch(runStatusSource, /Delayed, still retrying/);
assert.match(runStatusSource, /Shoot stopped — your pack was returned/);

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
assert.doesNotMatch(orchestratorSource, /datingPortfolioTask\.batchTriggerAndWait/);
assert.match(orchestratorSource, /error\.kind === "internal"/);

const promptOrchestrationSource = readFileSync(
  resolve(process.cwd(), "trigger/dating-prompt-orchestration.ts"),
  "utf8"
);
assert.match(promptOrchestrationSource, /plannerCallBudget/);
assert.match(promptOrchestrationSource, /planningHasStalled/);
assert.match(promptOrchestrationSource, /internal_planning_stalled/);
assert.doesNotMatch(promptOrchestrationSource, /cycle < 16/);
assert(
  promptOrchestrationSource.indexOf("reserveCompletePortfolio") <
    promptOrchestrationSource.indexOf("writeReservedPortfolio")
);

for (const removedTask of ["trigger/dating-portfolio.ts", "trigger/dating-reconcile.ts"]) {
  assert.throws(() => readFileSync(resolve(process.cwd(), removedTask), "utf8"));
}

const creditMigration = readFileSync(
  resolve(process.cwd(), "supabase/migrations/039_dating_order_credit_reservations.sql"),
  "utf8"
);
assert.match(creditMigration, /create_reserved_dating_order/);
assert.match(creditMigration, /release_dating_order_credit/);
assert.match(creditMigration, /reserve_dating_order_retry/);
assert.match(creditMigration, /capture_dating_order_credit/);
assert.match(creditMigration, /Captured\/Ready is terminal/);
assert.match(creditMigration, /dynamic dating order is not a complete delivery/);

const packageJson = JSON.parse(readFileSync(resolve(process.cwd(), "package.json"), "utf8"));
assert.equal(packageJson.dependencies["@google/genai"], "2.18.0");

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

const simplifiedReservationMigration = readFileSync(
  resolve(process.cwd(), "supabase/migrations/040_simplified_dating_idea_reservation.sql"),
  "utf8"
);
assert.match(simplifiedReservationMigration, /reserve_intelligent_dating_shoots_v2/);
assert.match(simplifiedReservationMigration, /reservation_report jsonb/);
assert.match(simplifiedReservationMigration, /exact_complete_idea/);
assert.match(simplifiedReservationMigration, /within_order_near_duplicate/);
assert.match(simplifiedReservationMigration, /p_within_order_threshold real default 0\.92/);
assert.match(simplifiedReservationMigration, /Embedding similarity is diagnostic feedback only/);
assert.match(simplifiedReservationMigration, /'stage', v_stage/);
assert.match(
  simplifiedReservationMigration,
  /count\(\*\)[\s\S]*status <> 'abandoned'\)[\s\S]*< v_order\.shoots_target[\s\S]*then 'planning'/
);

console.log("Intelligent dating portfolio and context-led writer checks passed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
