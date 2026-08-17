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
