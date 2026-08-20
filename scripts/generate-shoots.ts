/**
 * Writes new shoots with an LLM, gated by the same rules that lint the
 * hand-written ones.
 *
 *   npm run generate:shoots              # every brief in briefs.ts
 *   npm run generate:shoots -- --only 2  # just the first two
 *   npm run generate:shoots -- --dry     # show the prompt, call nothing
 *
 * Output goes to lib/dating/shoots.generated.ts, which nothing imports. It is a
 * staging area on purpose: a generated shoot is not in the product until a
 * person has read it and moved it into shoots.ts. That review is the one thing
 * the old compositional library never had, and its absence is why 147 of its
 * 1,170 combinations were incoherent.
 *
 * Every candidate is validated before it is written, and a failure is fed back
 * to the model as a retry, so what lands in the file has already passed the
 * craft rules, the wardrobe-verbatim check, the gaze mix and the ratio match.
 * What it has NOT passed is a human deciding whether the place reads as an
 * alley — that part is yours.
 */
import { writeFileSync } from "node:fs";
import { config } from "dotenv";
import { BRIEFS, type ShootBrief } from "../lib/dating/authoring/briefs";
import {
  buildUserPrompt,
  generateShoot,
  libraryContext,
  pickReference,
} from "../lib/dating/authoring/generate";
import type { CandidateShoot } from "../lib/dating/authoring/rules";

config({ path: ".env.local" });

const OUTPUT = "lib/dating/shoots.generated.ts";

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}
const has = (name: string) => process.argv.includes(`--${name}`);

/** Renders a candidate as source that can be pasted straight into shoots.ts. */
function toSource(shoot: CandidateShoot): string {
  const frames = shoot.frames
    .map((frame) => {
      const size =
        frame.imageSize.width < frame.imageSize.height
          ? "PORTRAIT_3_4"
          : "LANDSCAPE_4_3";
      return `      {
        framing: ${JSON.stringify(frame.framing)},
        imageSize: ${size},
        prompt:
          ${JSON.stringify(frame.prompt)},
      },`;
    })
    .join("\n");

  return `  {
    id: ${JSON.stringify(shoot.id)},
    title: ${JSON.stringify(shoot.title)},
    kind: ${JSON.stringify(shoot.kind)},
    register: ${JSON.stringify(shoot.register)},
    interests: ${JSON.stringify(shoot.interests ?? [])},${
      shoot.tags?.length ? `\n    tags: ${JSON.stringify(shoot.tags)},` : ""
    }
    frames: [
${frames}
    ],
  },`;
}

async function main() {
  const only = Number(arg("only") ?? BRIEFS.length);
  const briefs: ShootBrief[] = BRIEFS.slice(0, only);

  if (has("dry")) {
    const context = libraryContext();
    const brief = briefs[0];
    console.log(buildUserPrompt(brief, pickReference(brief.light, 0), context));
    return;
  }

  console.log(`\ngenerating ${briefs.length} shoot${briefs.length === 1 ? "" : "s"}\n`);

  const accepted: CandidateShoot[] = [];
  const rejected: { brief: ShootBrief; problems: string[] }[] = [];

  for (const [index, brief] of briefs.entries()) {
    const reference = pickReference(brief.light, index);
    process.stdout.write(
      `  ${index + 1}. ${brief.serves.join("/")} · ${brief.light} · ref ${reference.id}\n`
    );

    const result = await generateShoot(brief, {
      referenceIndex: index,
      model: arg("model"),
      // Everything accepted so far this run, so the batch cannot repeat itself.
      alreadyGenerated: accepted,
      onAttempt: (attempt, problems) => {
        if (problems.length === 0) {
          console.log(`     attempt ${attempt}: passed`);
        } else {
          console.log(`     attempt ${attempt}: ${problems.length} problem(s)`);
          for (const problem of problems.slice(0, 4)) {
            console.log(`       - ${problem}`);
          }
          if (problems.length > 4) console.log(`       … and ${problems.length - 4} more`);
        }
      },
    });

    if (result.shoot) {
      accepted.push(result.shoot);
      console.log(`     -> ${result.shoot.id} ("${result.shoot.title}")\n`);
    } else {
      rejected.push({ brief, problems: result.problems });
      console.log(`     -> gave up after ${result.attempts} attempts\n`);
    }
  }

  if (accepted.length > 0) {
    const body = `/**
 * GENERATED — not in the product yet.
 *
 * Written by scripts/generate-shoots.ts and already passed every mechanical
 * check: craft rules, wardrobe verbatim across four frames, gaze mix, aspect
 * ratio, no duplicates against the committed library.
 *
 * What no machine checked is whether the place reads as somewhere a man would
 * want to be photographed, and whether the poses are physically plausible.
 * Read them, cut what fails, and move the rest into shoots.ts.
 *
 * Generated ${new Date().toISOString()}
 */
import type { Shoot } from "./shoots";

const PORTRAIT_3_4 = { width: 1728, height: 2304 } as const;
const LANDSCAPE_4_3 = { width: 2304, height: 1728 } as const;

export const GENERATED_SHOOTS: readonly Shoot[] = [
${accepted.map(toSource).join("\n\n")}
];
`;
    writeFileSync(OUTPUT, body, "utf-8");
  }

  console.log(
    `${accepted.length} accepted, ${rejected.length} rejected` +
      (accepted.length > 0 ? ` -> ${OUTPUT}` : "")
  );
  for (const { brief, problems } of rejected) {
    console.log(`\n  rejected ${brief.serves.join("/")}:`);
    for (const problem of problems) console.log(`    - ${problem}`);
  }
  console.log();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
