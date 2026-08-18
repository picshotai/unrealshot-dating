export const DATING_ASPECT_RATIOS = ["9:16", "3:4", "4:3"] as const;

export type DatingAspectRatio = (typeof DATING_ASPECT_RATIOS)[number];
export type DatingFalImageSize =
  | "portrait_16_9"
  | "portrait_4_3"
  | "landscape_4_3";

const FAL_IMAGE_SIZE_BY_RATIO: Record<
  DatingAspectRatio,
  DatingFalImageSize
> = {
  "9:16": "portrait_16_9",
  "3:4": "portrait_4_3",
  "4:3": "landscape_4_3",
};

const ASPECT_RATIO_PATTERN = /\b(?:9:16|3:4|4:3)\b/g;

/**
 * The authored ratio is part of the snapshotted compiled prompt. That keeps
 * generation, resumes, and paid regenerations stable without a database field.
 * Prompts from older orders did not carry a ratio and retain their 9:16 shape.
 */
export function resolveDatingAspectRatio(prompt: string): DatingAspectRatio {
  const matches = [...prompt.matchAll(ASPECT_RATIO_PATTERN)].map(
    (match) => match[0] as DatingAspectRatio
  );
  const unique = [...new Set(matches)];

  if (unique.length === 0) return "9:16";
  if (unique.length > 1) {
    throw new Error(
      `Prompt contains conflicting aspect ratios: ${unique.join(", ")}`
    );
  }

  return unique[0];
}

export function resolveDatingFalImageSize(
  prompt: string
): DatingFalImageSize {
  return FAL_IMAGE_SIZE_BY_RATIO[resolveDatingAspectRatio(prompt)];
}

export type DatingImageDimensions = { width: number; height: number };

/**
 * Dimensions used when a photo carries no authored size — legacy v3 rows and
 * any order allocated before per-prompt sizing shipped.
 */
const DEFAULT_DIMENSIONS_BY_RATIO: Record<
  DatingAspectRatio,
  DatingImageDimensions
> = {
  "9:16": { width: 1512, height: 2688 },
  "3:4": { width: 1536, height: 2048 },
  "4:3": { width: 2304, height: 1728 },
};

function greatestCommonDivisor(a: number, b: number): number {
  return b === 0 ? a : greatestCommonDivisor(b, a % b);
}

/**
 * The ratio label a set of dimensions reduces to. v4 prompts state this label
 * in their framing sentence, so it doubles as the library's consistency check.
 */
export function deriveRatioLabel({
  width,
  height,
}: DatingImageDimensions): string {
  const divisor = greatestCommonDivisor(width, height);
  return `${width / divisor}:${height / divisor}`;
}

/**
 * Output dimensions for a photo. v4 rows snapshot their authored size at
 * allocation time; anything without one falls back to the ratio parsed out of
 * its stored prompt text, which keeps historical orders resumable.
 */
export function resolveDatingImageDimensions(
  prompt: string,
  authored?: { width?: number | null; height?: number | null } | null
): DatingImageDimensions {
  if (authored?.width && authored?.height) {
    return { width: authored.width, height: authored.height };
  }
  return DEFAULT_DIMENSIONS_BY_RATIO[resolveDatingAspectRatio(prompt)];
}
