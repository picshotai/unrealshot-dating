import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import {
  DATING_PROMPTS,
  DATING_PROMPT_LIBRARY_VERSION,
  getPromptVariants,
  selectDatingPromptVariant,
  type DatingPromptDefinition,
} from "../lib/dating/prompt-library";
import {
  deriveRatioLabel,
  resolveDatingAspectRatio,
  resolveDatingImageDimensions,
} from "../lib/dating/aspect-ratio";
import { compileDatingPrompt } from "../lib/dating/prompt-params";
import {
  assertDeliveryUnique,
  planDelivery,
  summariseDelivery,
} from "../lib/dating/select-delivery";
import { deriveBias, isInterestId } from "../lib/dating/interests";
import {
  DATING_BUCKETS,
  PHOTOS_PER_BUCKET,
  SLOTS_PER_BUCKET,
  TOTAL_PHOTOS,
  type StylePref,
  type Vibe,
} from "../lib/dating/types";

type ExportArguments = {
  batchId: string;
  vibe: Vibe;
  style: StylePref;
  hobby: string;
  output: string;
};

const VIBES = new Set<Vibe>(["urban", "outdoorsy", "homebody"]);
const STYLES = new Set<StylePref>(["casual", "sharp", "street"]);

function readArgument(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function parseArguments(): ExportArguments {
  const vibe = (readArgument("vibe") ?? "urban") as Vibe;
  const style = (readArgument("style") ?? "sharp") as StylePref;

  if (!VIBES.has(vibe)) {
    throw new Error(`Invalid --vibe "${vibe}"`);
  }
  if (!STYLES.has(style)) {
    throw new Error(`Invalid --style "${style}"`);
  }

  return {
    batchId: readArgument("batch-id") ?? "prompt-quality-review-2026-07-18",
    vibe,
    style,
    hobby:
      readArgument("hobby") ?? "rock climbing and landscape photography",
    output:
      readArgument("output") ??
      "docs/generated/dating-prompts-v5.json",
  };
}

function compileForExport(
  definition: DatingPromptDefinition,
  args: ExportArguments
) {
  const prompt = compileDatingPrompt(definition, {
    vibe: args.vibe,
    style: args.style,
    hobby: args.hobby,
  });
  const aspectRatio = resolveDatingAspectRatio(prompt);
  const authoredRatio = deriveRatioLabel(definition.imageSize);

  if (aspectRatio !== authoredRatio) {
    throw new Error(
      `${definition.id}: compiled ratio ${aspectRatio} does not match ${authoredRatio}`
    );
  }

  return {
    id: definition.id,
    version: definition.version,
    bucket: definition.bucket,
    slot: definition.slot,
    variant: definition.variant,
    aspectRatio,
    imageSize: resolveDatingImageDimensions(prompt, definition.imageSize),
    usesHobbyAlternative: Boolean(definition.hobbyPromptTemplate),
    wordCount: prompt.split(/\s+/).length,
    prompt,
  };
}

/**
 * `--delivery` plans one real order and proves the guarantee the product makes:
 * 100 photos with no repeated location, outfit or lighting setup.
 */
async function reportDelivery() {
  const interestArg = readArgument("interests") ?? "";
  const interests = interestArg
    .split(",")
    .map((value) => value.trim())
    .filter(isInterestId);
  const dress = (readArgument("dress") ?? "casual") as StylePref;
  const batchId = readArgument("batch-id") ?? "delivery-preview";

  const bias = deriveBias(interests, dress);
  const plan = planDelivery(batchId, bias);
  assertDeliveryUnique(plan);

  console.log(`batch      ${batchId}`);
  console.log(`interests  ${interests.length ? interests.join(", ") : "(none)"}`);
  console.log(`dress      ${dress}`);
  console.log(JSON.stringify(summariseDelivery(plan), null, 2));

  for (const entry of plan) {
    const definition = getPromptVariants(entry.bucket, entry.slot).find(
      (candidate) => candidate.variant === entry.variant
    )!;
    console.log(
      `${entry.bucket}-${String(entry.slot).padStart(2, "0")}-${entry.variant}` +
        `  ${entry.vibe.padEnd(9)} ${entry.style.padEnd(6)} ` +
        `| ${definition.locations[entry.vibe]}`
    );
  }
  console.log("\nassertDeliveryUnique: PASS");
}

async function main() {
  if (process.argv.includes("--delivery")) {
    await reportDelivery();
    return;
  }
  const args = parseArguments();
  const selectedOrderPrompts = DATING_BUCKETS.flatMap((bucket) =>
    Array.from({ length: PHOTOS_PER_BUCKET }, (_, index) => {
      const definition = selectDatingPromptVariant(
        args.batchId,
        bucket,
        index + 1
      );
      return compileForExport(definition, args);
    })
  );
  const allVariantPrompts = DATING_PROMPTS.map((definition) =>
    compileForExport(definition, args)
  );

  const expectedVariants = DATING_BUCKETS.length * SLOTS_PER_BUCKET * 3;
  if (
    selectedOrderPrompts.length !== TOTAL_PHOTOS ||
    allVariantPrompts.length !== expectedVariants
  ) {
    throw new Error(
      `Unexpected export size: ${selectedOrderPrompts.length} selected, ` +
        `${allVariantPrompts.length} variants`
    );
  }

  const outputPath = resolve(args.output);
  const document = {
    generatedAt: new Date().toISOString(),
    libraryVersion: DATING_PROMPT_LIBRARY_VERSION,
    note:
      "The prompt field is the exact compiled string sent to fal. No action, pose, camera, lighting, realism, or composition fragments are added after this export.",
    preferences: {
      batchId: args.batchId,
      vibe: args.vibe,
      style: args.style,
      hobby: args.hobby,
    },
    counts: {
      selectedOrderPrompts: selectedOrderPrompts.length,
      allVariantPrompts: allVariantPrompts.length,
    },
    selectedOrderPrompts,
    allVariantPrompts,
  };

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(document, null, 2)}\n`, "utf8");

  console.log(`Exported exact fal prompts to ${outputPath}`);
  console.log(
    `${selectedOrderPrompts.length} selected-order prompts and ` +
      `${allVariantPrompts.length} compiled variants.`
  );
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
