/**
 * Run the watermark detector over real photographs and print what it measured.
 *
 * The thresholds in lib/dating/watermark.ts are the kind of numbers that should
 * be set against actual files rather than guessed at, and the two failure modes
 * are not symmetric: missing a watermark costs one bad delivery, while a false
 * reject stops a paying customer at the upload step. So tune for zero false
 * positives on clean photos first, and accept misses.
 *
 *   npx tsx scripts/check-watermark.ts photo1.jpg photo2.png …
 *   npx tsx scripts/check-watermark.ts ./folder-of-samples
 *
 * A file whose name contains "watermark" is treated as a known positive, so a
 * folder of labelled samples reports a pass/fail summary.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname, basename } from "node:path";
import sharp from "sharp";
import { detectWatermark } from "../lib/dating/watermark";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

function collect(paths: string[]): string[] {
  const files: string[] = [];
  for (const path of paths) {
    const stat = statSync(path);
    if (stat.isDirectory()) {
      for (const entry of readdirSync(path)) {
        const full = join(path, entry);
        if (statSync(full).isFile() && IMAGE_EXTENSIONS.has(extname(entry).toLowerCase())) {
          files.push(full);
        }
      }
    } else {
      files.push(path);
    }
  }
  return files;
}

async function main() {
  const args = process.argv.slice(2);
  const cases =
    args.length > 0
      ? collect(args).map((file) => ({
          name: basename(file),
          expected: /watermark/i.test(basename(file)),
          buffer: readFileSync(file),
        }))
      : await syntheticCases();

  if (cases.length === 0) {
    console.error("no images found");
    process.exit(2);
  }

  console.log(
    `
checking ${cases.length} image${cases.length === 1 ? "" : "s"}` +
      `${args.length === 0 ? " (synthetic — pass file paths to check real photos)" : ""}
`
  );

  let falsePositives = 0;
  let misses = 0;

  for (const { name: file, expected, buffer } of cases) {
    const verdict = await detectWatermark(buffer);

    const mark = verdict.found ? "WATERMARK" : "clean    ";
    let line = `  ${mark}  ${file}`;

    if (verdict.detail) {
      const d = verdict.detail;
      line +=
        `\n              band=${verdict.band} height=${(d.runHeight * 100).toFixed(1)}%` +
        ` energy=${d.runEnergy.toFixed(1)} gutter=${d.gutterEnergy.toFixed(1)}` +
        ` ink=${(d.inkFraction * 100).toFixed(1)}% span=${(d.inkSpan * 100).toFixed(0)}%`;
    }

    if (expected && !verdict.found) {
      misses += 1;
      line += "\n              MISS — filename says this one has a watermark";
    }
    if (!expected && verdict.found) {
      falsePositives += 1;
      line += "\n              FALSE POSITIVE — this would block a real upload";
    }

    console.log(line);
  }

  console.log(
    `\n${falsePositives} false positive${falsePositives === 1 ? "" : "s"}, ` +
      `${misses} miss${misses === 1 ? "" : "es"}\n`
  );

  // Only false positives fail the run on real photos. On the synthetic set a
  // miss fails too, because those two are the exact stamp the format test
  // reproduced and the detector exists for them.
  if (falsePositives > 0 || (args.length === 0 && misses > 0)) process.exit(1);
}

/* ── Synthetic set ────────────────────────────────────────────────────────── *
 * So `npm run check:watermark` is a regression test with no arguments. The two
 * positives are the stamp the format test reproduced; the three negatives are
 * the shapes a naive detector mistakes for one — a hard horizontal edge low in
 * frame, a busy texture across the bottom, and a plain photo.
 * ------------------------------------------------------------------------- */

const W = 900;
const H = 1200;

function backdrop(): Buffer {
  const px = Buffer.alloc(W * H * 3);
  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      const i = (y * W + x) * 3;
      const v = 90 + Math.round(70 * (y / H)) + Math.round(Math.random() * 6);
      px[i] = v;
      px[i + 1] = v - 4;
      px[i + 2] = v - 10;
    }
  }
  return px;
}

function stampSvg(text: string, subtitle: string): string {
  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <text x="${W / 2}" y="${H - 70}" font-family="Arial" font-size="26" font-weight="bold"
        fill="white" text-anchor="middle" opacity="0.95">${text}</text>
  <text x="${W / 2}" y="${H - 40}" font-family="Arial" font-size="18"
        fill="white" text-anchor="middle" opacity="0.85">${subtitle}</text>
</svg>`;
}

async function render(
  paint?: (px: Buffer) => void,
  overlay?: string
): Promise<Buffer> {
  const px = backdrop();
  if (paint) paint(px);
  const raw = sharp(px, { raw: { width: W, height: H, channels: 3 } });
  if (!overlay) return raw.jpeg({ quality: 92 }).toBuffer();
  return sharp(await raw.png().toBuffer())
    .composite([{ input: Buffer.from(overlay), top: 0, left: 0 }])
    .jpeg({ quality: 92 })
    .toBuffer();
}

async function syntheticCases() {
  return [
    {
      name: "redmi-watermark",
      expected: true,
      buffer: await render(undefined, stampSvg("SHOT ON REDMI K20", "AI TRIPLE CAMERA")),
    },
    {
      name: "oneplus-watermark",
      expected: true,
      buffer: await render(undefined, stampSvg("SHOT ON ONEPLUS", "HASSELBLAD")),
    },
    { name: "clean-plain", expected: false, buffer: await render() },
    {
      name: "clean-hard-edge",
      expected: false,
      buffer: await render((px) => {
        for (let y = 1050; y < H; y += 1) {
          for (let x = 0; x < W; x += 1) {
            const i = (y * W + x) * 3;
            px[i] = 40;
            px[i + 1] = 38;
            px[i + 2] = 36;
          }
        }
      }),
    },
    {
      name: "clean-busy-texture",
      expected: false,
      buffer: await render((px) => {
        for (let y = 1000; y < H; y += 1) {
          for (let x = 0; x < W; x += 1) {
            const i = (y * W + x) * 3;
            const v = ((x >> 2) + (y >> 2)) % 2 ? 200 : 60;
            px[i] = v;
            px[i + 1] = v;
            px[i + 2] = v;
          }
        }
      }),
    },
  ];
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
