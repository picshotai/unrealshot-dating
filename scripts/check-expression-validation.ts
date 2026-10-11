import { strict as assert } from "node:assert";
import { generateShootCandidate, validateShootOutput } from "../lib/dating/creative-director";
import { mockProductionModelCall } from "../lib/dating/prompt-engine";
import briefFixture from "./fixtures/pier-direction-brief.json";
import { datingShootIntentSchema } from "../lib/dating/creative-director/schemas";

async function main() {
  const brief = datingShootIntentSchema.parse(briefFixture);
  const input = { interests: brief.representedInterests, exclusions: [] };
  const generation = await generateShootCandidate({ brief, input, modelCall: mockProductionModelCall(brief) });
  assert(generation.output);
  assert(generation.validation.passed, generation.validation.problems.join("\n"));
  for (const prohibition of [
    "No teeth show.", "with no teeth visible.",
    "entirely without smiling, grinning, or showing teeth.",
    "with no smile, grin, or teeth visible.",
    "with no grin, no chuckle, no laughter, and no visible teeth.",
    "completely without visible teeth, grins, or an open-mouthed smile.",
    "without any grin, smirk, or visible teeth.",
    "His teeth are not visible.", "He is not smiling.",
  ]) {
    const output = structuredClone(generation.output);
    output.frames.forEach((frame) => { frame.capturePrompt += ` ${prohibition}`; });
    const validation = validateShootOutput({ output, brief, input });
    assert(validation.passed, `${prohibition}: ${validation.problems.join("\n")}`);
  }
  for (const instruction of [
    "No teeth visible, but he laughs.",
    "No teeth visible, laughing softly.",
    "Without smiling, he grins broadly.",
    "No smile and he laughs.",
    "No teeth. He is laughing.",
    "No teeth, with a broad smile.",
    "He laughs without showing teeth.",
  ]) {
    const output = structuredClone(generation.output);
    output.frames[0].capturePrompt += ` ${instruction}`;
    const validation = validateShootOutput({ output, brief, input });
    assert(!validation.passed, `Affirmative expression escaped validation: ${instruction}`);
  }
  const output = structuredClone(generation.output);
  output.frames.filter((frame) => !frame.isAnchor).forEach((frame) => {
    frame.expressionType = "warm";
    frame.capturePrompt += " No teeth visible.";
  });
  assert(validateShootOutput({ output, brief, input }).problems.some((problem) => /at most 1/.test(problem)));
  console.log("Expression validation regressions passed.");
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
