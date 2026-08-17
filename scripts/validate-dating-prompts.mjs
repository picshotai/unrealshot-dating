import { readFile } from "node:fs/promises";

const sourceUrl = new URL("../lib/dating/prompt-library.ts", import.meta.url);
const source = await readFile(sourceUrl, "utf8");
const libraryMatch = source.match(
  /export const DATING_PROMPTS = (\[[\s\S]*\]) as const satisfies readonly DatingPromptDefinition\[\];/
);

if (!libraryMatch) {
  throw new Error("Could not read DATING_PROMPTS from prompt-library.ts");
}

const prompts = JSON.parse(libraryMatch[1]);
const buckets = ["anchor", "social", "travel", "active", "street"];
const variants = ["a", "b", "c"];
const aspectRatios = ["9:16", "3:4", "4:3"];
const expectedAspectRatioCounts = {
  "9:16": 60,
  "3:4": 160,
  "4:3": 80,
};
const vibes = ["urban", "outdoorsy", "homebody"];
const styles = ["casual", "sharp", "street"];
const hobbies = [null, "rock climbing and landscape photography"];
const allowedTokens = new Set(["location", "outfit", "hobby"]);
const cameraFamilies = [
  "Fujifilm GFX 100S",
  "Canon R5",
  "iPhone 15 Pro",
  "Sony A7S III",
  "Fujifilm X100V",
  "Leica Q2",
  "Sony A1",
  "Fujifilm X-T5",
  "Compact 35mm camera",
];
const bannedPhrases = [
  "--style",
  "aggressively sharp",
  "high-value",
  "social proof energy",
  "catfish paranoia",
  "dating-profile energy",
  "he is mid-",
  "he is weight shifted",
  "he is hands",
  "he is one hand",
  "he is chin",
  "he is caught",
  "he is looking",
  "he is walking",
  "he is standing",
  "he is sitting",
  "he is leaning",
];
const failures = [];
const ids = new Set();
const completeTexts = new Set();
let compiledCount = 0;
let hobbyPromptCount = 0;
const aspectRatioCounts = { "9:16": 0, "3:4": 0, "4:3": 0 };
let minWords = Number.POSITIVE_INFINITY;
let maxWords = 0;

function fail(message) {
  failures.push(message);
}

function getPromptVariants(bucket, slot) {
  return prompts.filter(
    (prompt) => prompt.bucket === bucket && prompt.slot === slot
  );
}

function stablePromptHash(value) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function selectPromptVariant(batchId, bucket, slot) {
  const slotVariants = getPromptVariants(bucket, slot);
  if (slotVariants.length !== 3) {
    throw new Error(
      `Cannot select ${bucket}:${slot}; expected 3 variants, found ${slotVariants.length}`
    );
  }
  const index =
    stablePromptHash(`v3:${batchId}:${bucket}:${slot}`) % slotVariants.length;
  return slotVariants[index];
}

function validateTemplate(prompt, template, label) {
  if (completeTexts.has(template)) {
    fail(`${prompt.id}/${label}: duplicate complete prompt text`);
  }
  completeTexts.add(template);

  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(template)) {
    fail(`${prompt.id}/${label}: contains a control character`);
  }
  if (template !== template.trim() || /\s{2,}/.test(template)) {
    fail(`${prompt.id}/${label}: malformed whitespace`);
  }
  if (/[âÃ][^\s]*/.test(template)) {
    fail(`${prompt.id}/${label}: appears to contain mojibake`);
  }

  const ratios = [...template.matchAll(/\b(?:9:16|3:4|4:3)\b/g)].map(
    (match) => match[0]
  );
  if (ratios.length !== 1 || ratios[0] !== prompt.aspectRatio) {
    fail(
      `${prompt.id}/${label}: expected exactly one authored ${prompt.aspectRatio} ratio`
    );
  }
  if (prompt.aspectRatio === "4:3" && /\bvertical\b/i.test(template)) {
    fail(`${prompt.id}/${label}: landscape 4:3 conflicts with vertical framing`);
  }

  const tokens = [...template.matchAll(/\{\{([^}]+)\}\}/g)].map(
    (match) => match[1]
  );
  for (const token of tokens) {
    if (!allowedTokens.has(token)) {
      fail(`${prompt.id}/${label}: unknown token {{${token}}}`);
    }
  }

  for (const phrase of bannedPhrases) {
    if (template.toLowerCase().includes(phrase.toLowerCase())) {
      fail(`${prompt.id}/${label}: banned phrase "${phrase}"`);
    }
  }

  const captureFamilies = cameraFamilies.filter((camera) =>
    template.includes(camera)
  );
  if (captureFamilies.length === 0) {
    fail(`${prompt.id}/${label}: missing a supported camera/capture grammar`);
  }
  if (captureFamilies.length > 1) {
    fail(
      `${prompt.id}/${label}: multiple capture grammars (${captureFamilies.join(
        ", "
      )})`
    );
  }
  if (!/\bf\/(?:2|2\.8|4)\b|no Portrait Mode/i.test(template)) {
    fail(`${prompt.id}/${label}: missing coherent aperture or phone capture`);
  }

  const lower = template.toLowerCase();
  if (lower.includes("monochrom") && /\bcolou?r\b/.test(lower)) {
    fail(`${prompt.id}/${label}: Monochrom/color contradiction`);
  }
  if (
    (lower.includes("1/500") || lower.includes("1/1000")) &&
    lower.includes("motion blur")
  ) {
    fail(`${prompt.id}/${label}: high-shutter/motion-blur contradiction`);
  }
  if (
    (lower.includes("hasselblad") || lower.includes("fujifilm gfx")) &&
    lower.includes("disposable")
  ) {
    fail(`${prompt.id}/${label}: medium-format/disposable contradiction`);
  }
  if (/--[a-z]/i.test(template)) {
    fail(`${prompt.id}/${label}: unsupported prompt flag`);
  }
}

if (prompts.length !== 300) {
  fail(`Expected 300 prompts; found ${prompts.length}`);
}

for (const bucket of buckets) {
  const bucketPrompts = prompts.filter((prompt) => prompt.bucket === bucket);
  if (bucketPrompts.length !== 60) {
    fail(`${bucket}: expected 60 prompts; found ${bucketPrompts.length}`);
  }

  for (let slot = 1; slot <= 20; slot += 1) {
    const slotPrompts = getPromptVariants(bucket, slot);
    const foundVariants = slotPrompts.map((prompt) => prompt.variant).sort();
    if (
      slotPrompts.length !== 3 ||
      foundVariants.join(",") !== variants.join(",")
    ) {
      fail(
        `${bucket}:${slot}: expected variants a,b,c; found ${
          foundVariants.join(",") || "none"
        }`
      );
    }
  }
}

for (const prompt of prompts) {
  if (prompt.version !== 3) fail(`${prompt.id}: expected library version 3`);
  if (!buckets.includes(prompt.bucket)) {
    fail(`${prompt.id}: unknown bucket "${prompt.bucket}"`);
  }
  if (!variants.includes(prompt.variant)) {
    fail(`${prompt.id}: unknown variant "${prompt.variant}"`);
  }
  if (!aspectRatios.includes(prompt.aspectRatio)) {
    fail(`${prompt.id}: unknown aspect ratio "${prompt.aspectRatio}"`);
  } else {
    aspectRatioCounts[prompt.aspectRatio] += 1;
  }
  if (!Number.isInteger(prompt.slot) || prompt.slot < 1 || prompt.slot > 20) {
    fail(`${prompt.id}: slot is outside 1-20`);
  }
  if (ids.has(prompt.id)) fail(`Duplicate prompt id: ${prompt.id}`);
  ids.add(prompt.id);

  if (
    !prompt.promptTemplate.includes("{{location}}") ||
    !prompt.promptTemplate.includes("{{outfit}}")
  ) {
    fail(`${prompt.id}: base template must use location and outfit`);
  }

  validateTemplate(prompt, prompt.promptTemplate, "base");
  if (prompt.hobbyPromptTemplate) {
    hobbyPromptCount += 1;
    if (
      prompt.bucket !== "active" ||
      prompt.slot < 17 ||
      !prompt.hobbyPromptTemplate.includes("{{hobby}}")
    ) {
      fail(`${prompt.id}: invalid hobby-template placement or token`);
    }
    if (
      prompt.hobbyPromptTemplate.includes("{{location}}") ||
      prompt.hobbyPromptTemplate.includes("{{outfit}}")
    ) {
      fail(`${prompt.id}: hobby template must be a complete hobby alternative`);
    }
    validateTemplate(prompt, prompt.hobbyPromptTemplate, "hobby");
  } else if (prompt.bucket === "active" && prompt.slot >= 17) {
    fail(`${prompt.id}: active slots 17-20 require a hobby alternative`);
  }

  for (const vibe of vibes) {
    if (!prompt.locations?.[vibe]) {
      fail(`${prompt.id}: missing ${vibe} location`);
    }
  }
  for (const style of styles) {
    if (!prompt.outfits?.[style]) {
      fail(`${prompt.id}: missing ${style} outfit`);
    }
  }

  for (const vibe of vibes) {
    for (const style of styles) {
      for (const hobby of hobbies) {
        const template =
          hobby && prompt.hobbyPromptTemplate
            ? prompt.hobbyPromptTemplate
            : prompt.promptTemplate;
        const compiled = template
          .replaceAll("{{location}}", prompt.locations[vibe])
          .replaceAll("{{outfit}}", prompt.outfits[style])
          .replaceAll("{{hobby}}", hobby ?? "")
          .replace(/\s+/g, " ")
          .trim();
        compiledCount += 1;

        const combination = `${prompt.id}/${vibe}/${style}/${
          hobby ? "hobby" : "fallback"
        }`;
        if (/\{\{[^}]+\}\}/.test(compiled)) {
          fail(`${combination}: unresolved placeholder`);
        }
        if (
          compiled.includes("undefined") ||
          compiled !== compiled.trim() ||
          /\s{2,}/.test(compiled)
        ) {
          fail(`${combination}: malformed compiled prompt`);
        }

        const wordCount = compiled.split(/\s+/).length;
        minWords = Math.min(minWords, wordCount);
        maxWords = Math.max(maxWords, wordCount);
        if (wordCount < 65 || wordCount > 110) {
          fail(`${combination}: ${wordCount} words; expected 65-110`);
        }
      }
    }
  }
}

if (hobbyPromptCount !== 12) {
  fail(`Expected 12 hobby alternatives; found ${hobbyPromptCount}`);
}
if (compiledCount !== 5400) {
  fail(`Expected 5,400 compiled combinations; found ${compiledCount}`);
}
for (const aspectRatio of aspectRatios) {
  if (
    aspectRatioCounts[aspectRatio] !==
    expectedAspectRatioCounts[aspectRatio]
  ) {
    fail(
      `${aspectRatio}: expected ${expectedAspectRatioCounts[aspectRatio]} prompts; ` +
        `found ${aspectRatioCounts[aspectRatio]}`
    );
  }
}

const fixtureBatchIds = Array.from(
  { length: 256 },
  (_, index) => `fixture-batch-${index}`
);
for (const bucket of buckets) {
  for (let slot = 1; slot <= 20; slot += 1) {
    const batchId = "fixture-stability";
    const first = selectPromptVariant(batchId, bucket, slot);
    const second = selectPromptVariant(batchId, bucket, slot);
    if (first.id !== second.id) {
      fail(`${bucket}:${slot}: deterministic selection is not stable`);
    }

    const reachable = new Set(
      fixtureBatchIds.map(
        (fixtureId) => selectPromptVariant(fixtureId, bucket, slot).variant
      )
    );
    if (reachable.size !== 3) {
      fail(
        `${bucket}:${slot}: only ${[...reachable].join(
          ","
        )} reachable across fixture batch IDs`
      );
    }
  }
}

const selectedOrder = buckets.flatMap((bucket) =>
  Array.from({ length: 20 }, (_, index) =>
    selectPromptVariant("fixture-order", bucket, index + 1)
  )
);
if (
  selectedOrder.length !== 100 ||
  buckets.some(
    (bucket) =>
      selectedOrder.filter((prompt) => prompt.bucket === bucket).length !== 20
  )
) {
  fail("Fixture order does not select exactly 20 prompts per bucket and 100 total");
}

if (failures.length > 0) {
  throw new Error(
    `Dating prompt validation failed:\n${failures
      .slice(0, 80)
      .map((failure) => `- ${failure}`)
      .join("\n")}${
      failures.length > 80 ? `\n- ...and ${failures.length - 80} more` : ""
    }`
  );
}

console.log(
  `Validated ${prompts.length} V3 prompts, ${hobbyPromptCount} hobby alternatives, ` +
    `${compiledCount} compiled combinations (${minWords}-${maxWords} words), ` +
    `a 60/160/80 aspect-ratio mix, and deterministic 100-photo selection.`
);
