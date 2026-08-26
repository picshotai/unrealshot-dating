import type { DatingShootIntent, DatingShootOutput, ShootWriterOutput } from "./schemas";

export const IDENTITY_SENTENCE =
  "The first supplied images all show the same man; preserve his facial geometry, skin tone, hair, beard pattern, age and natural asymmetry.";

export const ANCHOR_REFERENCE_SENTENCE =
  "The final supplied image establishes this shoot's location, outfit, light and background geometry; preserve them without adding or relocating scene elements.";

export function compileCapturePrompt(capturePrompt: string, isAnchor: boolean) {
  return [
    IDENTITY_SENTENCE,
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
      prompt: compileCapturePrompt(frame.capturePrompt, frame.isAnchor),
    })),
  };
}
