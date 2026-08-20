import sharp from "sharp";

/**
 * Rejects reference photos with a camera watermark printed into the pixels.
 *
 * Seedream copies whatever is burned into a reference into its output, as
 * garbled lettering, and it does so unpredictably — two shoots in the format
 * test came back with "SHOT ON REDMI K20 / AI TRIPLE CAMERA" reproduced across
 * frames as nonsense text. Negation cannot fix it: the model reads a forbidden
 * noun as a requested one, so "no watermark" asks for a watermark. The only
 * place to solve it is before the file is ever used.
 *
 * ── What this looks for ────────────────────────────────────────────────────
 *
 * A phone watermark has a shape no photograph has: a thin horizontal band of
 * small high-contrast strokes, sitting in an otherwise flat gutter at the very
 * top or bottom of the frame, covering a small fraction of the pixels in it.
 *
 * So the test is four conditions at once, and the conjunction is what keeps it
 * off real photographs:
 *
 *   1. a contiguous run of rows with high horizontal gradient energy — strokes;
 *   2. the run is short — text height, not a subject;
 *   3. flat gutters immediately above and below it — the text floats;
 *   4. the ink covers a minority of the run — letters, not an edge or a fabric.
 *
 * A shoulder crossing the bottom of the frame fails 3. A table edge or a
 * horizon fails 1 and 4 (one row, and it spans everything). A patterned jumper
 * fails 2 and 3.
 *
 * It is deliberately conservative. A false reject stops a paying customer at
 * the step that matters most, so the thresholds are set to fire on the obvious
 * stamped-text case and let everything ambiguous through.
 *
 * `npm run check:watermark <files…>` prints the measurements for real photos,
 * which is how these numbers should be re-tuned rather than by guessing.
 */

export type WatermarkVerdict = {
  found: boolean;
  /** Which end of the frame it was found in. */
  band: "top" | "bottom" | null;
  /** What was measured, for logs and for the tuning script. */
  detail: {
    /** Height of the high-gradient run, as a fraction of image height. */
    runHeight: number;
    /** Mean horizontal gradient energy inside the run. */
    runEnergy: number;
    /** Mean energy in the flat gutters around it. */
    gutterEnergy: number;
    /** Fraction of pixels in the run that are ink. */
    inkFraction: number;
    /** How wide the ink spans, as a fraction of image width. */
    inkSpan: number;
  } | null;
};

/** Analysis width. Small enough to be fast, large enough that text still reads. */
const ANALYSIS_WIDTH = 640;

/** How much of each end of the frame is searched. */
const BAND_FRACTION = 0.18;

/** A row counts as stroked above this mean absolute horizontal gradient. */
const ROW_ENERGY_ON = 6;

/** Gutters must be at least this much quieter than the run. */
const GUTTER_RATIO = 3.5;

/** A watermark is text-height: at least this many rows, at most this fraction. */
const MIN_RUN_ROWS = 4;
const MAX_RUN_FRACTION = 0.06;

/** Ink coverage inside the run. Letters are sparse; an edge or a fabric is not. */
const MIN_INK_FRACTION = 0.01;
const MAX_INK_FRACTION = 0.3;

/** A stamp spans a readable part of the width, and never the entire frame. */
const MIN_INK_SPAN = 0.08;
const MAX_INK_SPAN = 0.95;

/** A pixel is ink when it deviates this far from its row's own median. */
const INK_DEVIATION = 38;

export async function detectWatermark(
  input: Buffer
): Promise<WatermarkVerdict> {
  const { data, info } = await sharp(input)
    // Honour the EXIF orientation first: a watermark is at the bottom of the
    // image as displayed, which is not the bottom of the stored pixels.
    .rotate()
    .greyscale()
    .resize({ width: ANALYSIS_WIDTH, withoutEnlargement: true })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  if (width < 64 || height < 64) return { found: false, band: null, detail: null };

  const rowEnergy = new Float64Array(height);
  for (let y = 0; y < height; y += 1) {
    let sum = 0;
    const offset = y * width;
    for (let x = 1; x < width; x += 1) {
      sum += Math.abs(data[offset + x] - data[offset + x - 1]);
    }
    rowEnergy[y] = sum / (width - 1);
  }

  const bandRows = Math.max(MIN_RUN_ROWS * 3, Math.round(height * BAND_FRACTION));

  for (const band of ["bottom", "top"] as const) {
    const start = band === "top" ? 0 : height - bandRows;
    const end = band === "top" ? bandRows : height;

    const run = longestRun(rowEnergy, start, end, ROW_ENERGY_ON);
    if (!run) continue;

    const runRows = run.end - run.start;
    if (runRows < MIN_RUN_ROWS) continue;
    if (runRows > height * MAX_RUN_FRACTION) continue;

    // Condition 3: the text has to float. Measure the rows just outside the run
    // rather than the whole band, so a busy photo with a quiet corner cannot
    // pass by averaging.
    const gutter = gutterEnergy(rowEnergy, run, height);
    if (gutter === null) continue;

    const runMean = mean(rowEnergy, run.start, run.end);
    if (runMean < gutter * GUTTER_RATIO) continue;

    const ink = measureInk(data, width, run.start, run.end);
    if (ink.fraction < MIN_INK_FRACTION || ink.fraction > MAX_INK_FRACTION) continue;
    if (ink.span < MIN_INK_SPAN || ink.span > MAX_INK_SPAN) continue;

    return {
      found: true,
      band,
      detail: {
        runHeight: runRows / height,
        runEnergy: runMean,
        gutterEnergy: gutter,
        inkFraction: ink.fraction,
        inkSpan: ink.span,
      },
    };
  }

  return { found: false, band: null, detail: null };
}

function longestRun(
  energy: Float64Array,
  start: number,
  end: number,
  threshold: number
): { start: number; end: number } | null {
  let best: { start: number; end: number } | null = null;
  let current = -1;

  for (let y = start; y <= end; y += 1) {
    const on = y < end && energy[y] > threshold;
    if (on && current < 0) current = y;
    if (!on && current >= 0) {
      if (!best || y - current > best.end - best.start) best = { start: current, end: y };
      current = -1;
    }
  }
  return best;
}

/**
 * The quiet rows on both sides of the run. Returns null when the run touches an
 * edge with no room to measure, which is the ambiguous case and so is let past.
 */
function gutterEnergy(
  energy: Float64Array,
  run: { start: number; end: number },
  height: number
): number | null {
  const margin = 4;
  const aboveStart = run.start - margin;
  const belowEnd = run.end + margin;
  if (aboveStart < 0 || belowEnd > height) return null;

  const above = mean(energy, aboveStart, run.start);
  const below = mean(energy, run.end, belowEnd);
  return Math.max((above + below) / 2, 0.5);
}

function mean(values: Float64Array, start: number, end: number): number {
  if (end <= start) return 0;
  let sum = 0;
  for (let i = start; i < end; i += 1) sum += values[i];
  return sum / (end - start);
}

/**
 * How much of the run is ink, and how far across the frame it reaches.
 *
 * Measured against each row's own median so a stamp reads the same whether it
 * is light text on a dark sky or dark text on a pale wall.
 */
function measureInk(
  data: Buffer,
  width: number,
  start: number,
  end: number
): { fraction: number; span: number } {
  let inkPixels = 0;
  let total = 0;
  let leftmost = width;
  let rightmost = -1;

  const row: number[] = new Array(width);
  for (let y = start; y < end; y += 1) {
    const offset = y * width;
    for (let x = 0; x < width; x += 1) row[x] = data[offset + x];
    const median = [...row].sort((a, b) => a - b)[width >> 1];

    for (let x = 0; x < width; x += 1) {
      total += 1;
      if (Math.abs(row[x] - median) > INK_DEVIATION) {
        inkPixels += 1;
        if (x < leftmost) leftmost = x;
        if (x > rightmost) rightmost = x;
      }
    }
  }

  return {
    fraction: total > 0 ? inkPixels / total : 0,
    span: rightmost >= leftmost ? (rightmost - leftmost + 1) / width : 0,
  };
}

/** What the user is told. Names the cause, because the fix is on their side. */
export const WATERMARK_REJECTION_MESSAGE =
  "This photo has a camera watermark printed on it (the “Shot on…” stamp some phones add). " +
  "The AI copies anything printed into a reference photo across every shot, as garbled text. " +
  "Turn the watermark off in your camera settings, or pick a different photo.";
