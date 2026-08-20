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
import { GENERATED_SHOOTS } from "../lib/dating/shoots.generated";
import { sceneDensity, type CandidateShoot } from "../lib/dating/authoring/rules";

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

/**
 * Writes the file. Called after EVERY accepted shoot, not once at the end.
 *
 * The first long run wrote only on completion, and stopping it partway threw
 * away thirty-one shoots that had already been paid for. A generation run is a
 * sequence of purchases; each one gets saved the moment it is made.
 */
function save(shoots: CandidateShoot[]) {
  if (shoots.length === 0) return;
  writeFileSync(
    OUTPUT,
    `/**
 * GENERATED — not hand-written.
 *
 * Written by scripts/generate-shoots.ts and already past every mechanical
 * check: the craft rules, wardrobe verbatim across four frames, the gaze mix,
 * the aspect ratio, and no collision with anything else in the library.
 *
 * What no machine checked is whether the place reads as somewhere a man would
 * want to be photographed, and whether the poses are physically plausible.
 *
 * Rewritten after every accepted shoot, so an interrupted run keeps its work.
 * Last written ${new Date().toISOString()}
 */
import type { Shoot } from "./shoots";

const PORTRAIT_3_4 = { width: 1728, height: 2304 } as const;
const LANDSCAPE_4_3 = { width: 2304, height: 1728 } as const;

export const GENERATED_SHOOTS: readonly Shoot[] = [
${shoots.map(toSource).join("\n\n")}
];
`,
    "utf-8"
  );
}

async function main() {
  const only = Number(arg("only") ?? BRIEFS.length);
  const limit = Number(arg("limit") ?? Infinity);
  const append = has("append");

  // Append keeps what is already generated and skips the briefs that produced
  // it, so a large batch can run in several sittings without losing work or
  // writing the same shoot twice. A brief counts as done when its exact
  // `serves` list matches a shoot in the file, which is what the generator
  // records on every shoot it writes.
  const done = new Set(
    append ? GENERATED_SHOOTS.map((s) => (s.interests ?? []).join(",")) : []
  );

  const briefs: ShootBrief[] = BRIEFS.slice(0, only)
    .filter((b) => !done.has(b.serves.join(",")))
    .slice(0, limit);

  if (has("dry")) {
    const context = libraryContext();
    const brief = briefs[0];
    console.log(buildUserPrompt(brief, pickReference(brief.light, 0), context));
    return;
  }

  console.log(`\ngenerating ${briefs.length} shoot${briefs.length === 1 ? "" : "s"}\n`);

  // Existing shoots are carried as context so a new batch cannot collide with
  // an older one — the same reason a batch accumulates against itself.
  const accepted: CandidateShoot[] = append
    ? (GENERATED_SHOOTS as unknown as CandidateShoot[]).slice()
    : [];
  const carriedOver = accepted.length;

  // Spend is tracked and printed per shoot, because the first long run cost
  // roughly ten times what was estimated and nothing on screen said so until
  // the bill did. Rates are per million tokens; override if they change.
  const IN_RATE = Number(arg("in-rate") ?? 0.5);
  const OUT_RATE = Number(arg("out-rate") ?? 3.0);
  const totals = { input: 0, output: 0, thinking: 0 };
  let spend = 0;
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

    totals.input += result.usage.input;
    totals.output += result.usage.output;
    totals.thinking += result.usage.thinking;
    spend =
      (totals.input / 1_000_000) * IN_RATE +
      ((totals.output + totals.thinking) / 1_000_000) * OUT_RATE;

    if (result.shoot) {
      accepted.push(result.shoot);
      // Object count is the strongest predictor of a shoot rendering badly, so
      // it is printed on every acceptance even though it never blocks.
      const objects = sceneDensity(result.shoot);
      const flag = objects.length > 3 ? "   <-- dense, read this one" : "";
      console.log(`     -> ${result.shoot.id}  [${objects.length} object(s)]${flag}`);
      // Save immediately. Every shoot in this file has been paid for.
      save(accepted);
      console.log(
        `        saved (${accepted.length - carriedOver} new)   ` +
          `spend so far $${spend.toFixed(3)}\n`
      );
    } else {
      rejected.push({ brief, problems: result.problems });
      console.log(`     -> gave up after ${result.attempts} attempts\n`);
    }
  }

  save(accepted);

  console.log(
    `${accepted.length - carriedOver} new, ${carriedOver} carried over, ` +
      `${rejected.length} rejected -> ${accepted.length} shoots in ${OUTPUT}`
  );
  console.log(
    `
tokens: ${totals.input.toLocaleString()} in, ${totals.output.toLocaleString()} out, ` +
      `${totals.thinking.toLocaleString()} thinking  ->  about $${spend.toFixed(3)}`
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
