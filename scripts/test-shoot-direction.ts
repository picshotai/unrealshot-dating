/**
 * Paid live evaluation: production writer -> compiler -> Sunburst anchor + followers.
 * Usage: pnpm test:shoot-direction photo1.jpg photo2.jpg [--brief=brief.json]
 * Writes private local results; never creates orders or changes customer credits.
 */
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { extname, resolve, join } from "node:path";
import { loadEnvConfig } from "@next/env";
import { fal } from "@fal-ai/client";
import sharp from "sharp";
import { generateShootCandidate } from "../lib/dating/creative-director/writer";
import {
  datingShootIntentSchema,
  SHOOT_WRITER_SYSTEM_VERSION,
  DATING_CREATIVE_MODEL,
  type DatingShootOutput,
} from "../lib/dating/creative-director/schemas";
import { DATING_IMAGE_MODEL, buildDatingImageInput } from "../lib/dating/image-provider";
import { PHOTOGRAPHIC_DIRECTION_VERSION } from "../lib/dating/creative-director/photographic-direction";

async function main() {
  const args = process.argv.slice(2);
  const referenceFiles = args.filter((arg) => !arg.startsWith("--")).map((file) => resolve(file));
  if (!referenceFiles.length) throw new Error("Supply local identity reference photo paths.");
  loadEnvConfig(process.cwd());
  if (!process.env.FAL_KEY || !process.env.GEMINI_API_KEY) {
    throw new Error("FAL_KEY and GEMINI_API_KEY are required.");
  }
  fal.config({ credentials: process.env.FAL_KEY });
  const briefFile = args.find((arg) => arg.startsWith("--brief="))?.slice(8)
    ?? "scripts/fixtures/pier-direction-brief.json";
  const brief = datingShootIntentSchema.parse(JSON.parse(await readFile(resolve(briefFile), "utf8")));
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outputDir = resolve("docs/generated/shoot-direction-test", stamp);
  await mkdir(outputDir, { recursive: true });
  const refs = await Promise.all(referenceFiles.map(async (file) => {
    const suffix = extname(file).toLowerCase();
    const mime = suffix === ".png" ? "image/png" : suffix === ".webp" ? "image/webp" : "image/jpeg";
    return `data:${mime};base64,${(await readFile(file)).toString("base64")}`;
  }));
  const input = { interests: brief.representedInterests, exclusions: [], includeSimpleCandids: true };
  console.log(`Writing four frames with ${DATING_CREATIVE_MODEL}. Results: ${outputDir}`);
  let generation = await generateShootCandidate({ brief, input });
  await writeFile(join(outputDir, "writer-attempt-1.json"), JSON.stringify(generation, null, 2));
  if (!generation.output || !generation.validation.passed) {
    generation = await generateShootCandidate({
      brief, input,
      retry: { previousOutput: generation.rawOutput, validationErrors: generation.validation.problems },
    });
    await writeFile(join(outputDir, "writer-attempt-2.json"), JSON.stringify(generation, null, 2));
  }
  if (!generation.output || !generation.validation.passed) {
    throw new Error(`Writer validation failed: ${generation.validation.problems.join("; ")}`);
  }
  const frames = generation.output.frames;
  await writeFile(join(outputDir, "prompts.json"), JSON.stringify({
    writerVersion: SHOOT_WRITER_SYSTEM_VERSION, directionVersion: PHOTOGRAPHIC_DIRECTION_VERSION,
    imageModel: DATING_IMAGE_MODEL,
    brief, frames, referenceFiles,
  }, null, 2));

  async function render(frame: DatingShootOutput["frames"][number], anchorUrl?: string) {
    console.log(`Rendering ${frame.frameId} (${frame.cameraDistance}, anchor=${frame.isAnchor})`);
    const providerInput = buildDatingImageInput({
      prompt: frame.prompt,
      imageUrls: anchorUrl ? [...refs, anchorUrl] : refs,
      imageSize: { width: frame.width, height: frame.height },
    });
    const result = await fal.subscribe(DATING_IMAGE_MODEL, { input: providerInput, logs: false });
    const url = result.data.images[0]?.url;
    if (!url) throw new Error(`Missing image for ${frame.frameId}`);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Image download failed: ${response.status}`);
    const file = join(outputDir, `${frame.frameId}.png`);
    await writeFile(file, Buffer.from(await response.arrayBuffer()));
    const record = { frameId: frame.frameId, file, anchored: Boolean(anchorUrl), requestId: result.requestId, imageSize: providerInput.image_size };
    await writeFile(join(outputDir, `${frame.frameId}.json`), JSON.stringify(record, null, 2));
    console.log(`Saved ${file}`);
    return { ...record, url };
  }

  const anchor = frames.find((frame) => frame.isAnchor)!;
  const anchorResult = await render(anchor);
  const followers = await Promise.all(frames.filter((frame) => !frame.isAnchor).map((frame) => render(frame, anchorResult.url)));
  const results = [anchorResult, ...followers];
  const tiles = await Promise.all(frames.map(async (frame, index) => {
    const item = results.find((result) => result.frameId === frame.frameId)!;
    return {
      input: await sharp(item.file).resize(576, 768, { fit: "contain", background: "white" }).toBuffer(),
      left: (index % 2) * 576, top: Math.floor(index / 2) * 768,
    };
  }));
  await sharp({ create: { width: 1152, height: 1536, channels: 3, background: "white" } })
    .composite(tiles).png().toFile(join(outputDir, "contact-sheet.png"));
  console.log(`Complete: ${join(outputDir, "contact-sheet.png")}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Live evaluation failed.");
  process.exitCode = 1;
});
