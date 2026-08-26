import type { DatingShootIntent, DatingShootOutput, ShootWriterOutput } from "./schemas";

export const IDENTITY_SENTENCE =
  "The first supplied images all show the same man; preserve his facial geometry, skin tone, hair, beard pattern, age and natural asymmetry.";

export const SINGLE_VISIBLE_IDENTITY_SENTENCE =
  "Only the referenced man is visible; no other face, body, hand or reflection appears in frame.";

export const OUTFIT_SENTENCE_PREFIX =
  "His complete outfit remains exactly:";

export const PHYSICAL_COHERENCE_SENTENCE =
  "Keep all body and object mechanics physically executable: no limb performs conflicting actions, and every manipulated object is supported rather than floating.";

export const ANCHOR_REFERENCE_SENTENCE =
  "The final supplied image establishes this shoot's location, outfit, light and background geometry; preserve them without adding or relocating scene elements.";

export function compileCapturePrompt(
  capturePrompt: string,
  isAnchor: boolean,
  outfit: string
) {
  return [
    IDENTITY_SENTENCE,
    SINGLE_VISIBLE_IDENTITY_SENTENCE,
    `${OUTFIT_SENTENCE_PREFIX} ${outfit.trim()}`,
    PHYSICAL_COHERENCE_SENTENCE,
    isAnchor ? null : ANCHOR_REFERENCE_SENTENCE,
    capturePrompt.trim(),
  ].filter(Boolean).join(" ");
}

export function compileShootOutput(
  output: ShootWriterOutput,
  brief: DatingShootIntent
): DatingShootOutput {
  return {
    title: brief.title,
    frames: output.frames.map((frame) => ({
      ...frame,
      prompt: compileCapturePrompt(frame.capturePrompt, frame.isAnchor, brief.outfit),
    })),
  };
}
