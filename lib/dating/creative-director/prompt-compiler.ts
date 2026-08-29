import type {
  DatingShootIntent,
  DatingShootOutput,
  ExpressionType,
  ShootWriterOutput,
} from "./schemas";

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

export const ANCHOR_EXPRESSION_SENTENCE =
  "His expression is relaxed and natural, with lips resting together and attentive eyes.";

export const NEUTRAL_FOLLOWER_EXPRESSION_SENTENCE =
  "His expression stays calm and understated, with a natural relaxed face.";

export const WARM_FOLLOWER_EXPRESSION_SENTENCE =
  "A faint closed-mouth smile softens his expression while staying understated and natural.";

export function getDeterministicExpressionSentence(
  isAnchor: boolean,
  expressionType?: ExpressionType
): string {
  if (isAnchor) {
    return ANCHOR_EXPRESSION_SENTENCE;
  }
  if (expressionType === "warm") {
    return WARM_FOLLOWER_EXPRESSION_SENTENCE;
  }
  return NEUTRAL_FOLLOWER_EXPRESSION_SENTENCE;
}

export function compileCapturePrompt(
  capturePrompt: string,
  isAnchor: boolean,
  outfit: string,
  expressionType?: ExpressionType
) {
  const expressionSentence = getDeterministicExpressionSentence(isAnchor, expressionType);
  return [
    IDENTITY_SENTENCE,
    SINGLE_VISIBLE_IDENTITY_SENTENCE,
    `${OUTFIT_SENTENCE_PREFIX} ${outfit.trim()}`,
    PHYSICAL_COHERENCE_SENTENCE,
    isAnchor ? null : ANCHOR_REFERENCE_SENTENCE,
    capturePrompt.trim(),
    expressionSentence,
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
      prompt: compileCapturePrompt(
        frame.capturePrompt,
        frame.isAnchor,
        brief.outfit,
        frame.expressionType
      ),
    })),
  };
}
