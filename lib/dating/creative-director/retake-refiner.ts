import { z } from "zod";
import {
  callDatingCreativeModel,
  type CreativeModelCall,
} from "./model";
import {
  compileCapturePrompt,
} from "./prompt-compiler";
import {
  DATING_CREATIVE_MODEL,
  type ExpressionType,
} from "./schemas";

export const retakeRefinementOutputSchema = z.object({
  revisedCapturePrompt: z.string().trim().min(30).max(1_200),
  rationale: z.string().trim().max(300).optional(),
}).strict();

export type RetakeRefinementOutput = z.infer<typeof retakeRefinementOutputSchema>;

export const RETAKE_REFINEMENT_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["revisedCapturePrompt"],
  properties: {
    revisedCapturePrompt: { type: "string" },
    rationale: { type: "string" },
  },
} as const;

export const RETAKE_REFINER_SYSTEM_INSTRUCTION = `
You are the photographic retake director for UnrealShot dating profile photography.
Your job is to rewrite an existing single-photo capture instruction to address customer feedback (e.g. awkward hand placement, unnatural posture, weird angle, unwanted gesture, or stiff pose).

CRITICAL DIRECTIVES:
1. POSITIVE ACTION ONLY: Describe what the man IS physically doing using executable photographic mechanics (e.g., "Both hands rest casually inside his trouser pockets" or "His left hand rests flat on the concrete balustrade"). NEVER use negative phrases like "no hand on leg", "without touching his thigh", or "don't put hands".
2. PRESERVE SCENE TRUTH & CONTINUITY: Keep the exact same location, lighting, background, camera distance, and perspective. Do NOT invent new architecture, do NOT change garments, and do NOT add props.
3. SINGLE PERSON ONLY: The referenced man must be the only person in the frame.
4. HAND & LIMB ANATOMY: Account for both visible hands naturally. No hand performs conflicting actions or floats unnaturally.
5. EXPRESSION: Keep his face relaxed and natural. Strictly NO laughter, grinning, open-mouth smiles, or visible teeth.
6. ASPECT RATIO: Preserve the exact aspect ratio (e.g. 3:4, 4:3, 9:16) stated in the original prompt.
7. OUTPUT: Return only the required JSON containing the revised photographic capture instruction.
`.trim();

export function buildRetakeRefineRequest(args: {
  originalPrompt: string;
  feedback: string;
  shootTitle?: string | null;
  cameraDistance?: string | null;
  isAnchor?: boolean;
}) {
  return [
    "REWRITE THIS PHOTOGRAPHIC CAPTURE INSTRUCTION TO RESOLVE CUSTOMER FEEDBACK.",
    "",
    "EXISTING COMPILED PROMPT:",
    args.originalPrompt,
    "",
    "FRAME CONTEXT:",
    `- Shoot: ${args.shootTitle || "Dating photoshoot"}`,
    `- Camera Distance: ${args.cameraDistance || "standard"}`,
    `- Is Anchor Frame: ${args.isAnchor ? "Yes" : "No"}`,
    "",
    "CUSTOMER FEEDBACK / ADJUSTMENT REQUEST:",
    `"${args.feedback.trim()}"`,
    "",
    "Rewrite the capture instruction with natural, physically plausible body mechanics and clean positive phrasing.",
  ].join("\n");
}

export async function refinePromptForRetake(args: {
  originalPrompt: string;
  feedback: string;
  outfit?: string;
  isAnchor?: boolean;
  expressionType?: ExpressionType;
  shootTitle?: string | null;
  cameraDistance?: string | null;
  modelCall?: CreativeModelCall;
}): Promise<string> {
  const cleanFeedback = args.feedback?.trim();
  if (!cleanFeedback) {
    return args.originalPrompt;
  }

  try {
    const caller = args.modelCall ?? callDatingCreativeModel;
    const response = await caller({
      model: DATING_CREATIVE_MODEL,
      systemInstruction: RETAKE_REFINER_SYSTEM_INSTRUCTION,
      contents: buildRetakeRefineRequest({
        originalPrompt: args.originalPrompt,
        feedback: cleanFeedback,
        shootTitle: args.shootTitle,
        cameraDistance: args.cameraDistance,
        isAnchor: args.isAnchor,
      }),
      responseJsonSchema: RETAKE_REFINEMENT_JSON_SCHEMA,
      maxOutputTokens: 1_024,
    });

    const parsed = retakeRefinementOutputSchema.safeParse(JSON.parse(response.text));
    if (!parsed.success) {
      console.warn("Retake prompt refinement parse failed, falling back to original prompt:", parsed.error);
      return args.originalPrompt;
    }

    const revisedCapture = parsed.data.revisedCapturePrompt;

    // If outfit is provided, recompile cleanly using compileCapturePrompt
    if (args.outfit) {
      return compileCapturePrompt(
        revisedCapture,
        Boolean(args.isAnchor),
        args.outfit,
        args.expressionType ?? (args.isAnchor ? "neutral" : undefined)
      );
    }

    // If outfit not separately supplied, extract from originalPrompt:
    // "His complete outfit remains exactly: <outfit> Keep all body..."
    const outfitMatch = args.originalPrompt.match(/His complete outfit remains exactly:\s*([^\.]+?\.)\s*Keep all body/i);
    if (outfitMatch && outfitMatch[1]) {
      return compileCapturePrompt(
        revisedCapture,
        Boolean(args.isAnchor),
        outfitMatch[1],
        args.expressionType ?? (args.isAnchor ? "neutral" : undefined)
      );
    }

    // Otherwise return revised capture prompt
    return revisedCapture;
  } catch (error) {
    console.error("Retake prompt refinement call failed, safely falling back to original prompt:", error);
    return args.originalPrompt;
  }
}
