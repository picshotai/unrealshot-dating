import type { DatingSceneBrief } from "@/lib/dating/scene-recipes/types";
import {
  generatePromptLabCandidate,
  type PromptLabGeneration,
  type PromptLabModelCall,
} from "@/lib/dating/prompt-lab/generate";
import type { RetryContext } from "@/lib/dating/prompt-lab/prompt";
import type { RecentScene } from "@/lib/dating/prompt-lab/schemas";
import { selectPromptLabReference } from "@/lib/dating/prompt-lab/references";

export type ProductionPromptInput = {
  brief: DatingSceneBrief;
  recentScenes: readonly RecentScene[];
  retry?: RetryContext;
  modelCall?: PromptLabModelCall;
};

/** One reserved idea in, one four-frame structured candidate out. */
export async function generateProductionPromptCandidate(
  input: ProductionPromptInput
): Promise<PromptLabGeneration> {
  const { brief } = input;
  return generatePromptLabCandidate({
    input: {
      clientRequestId: crypto.randomUUID(),
      interests: [...brief.interests],
      dress: brief.register,
      exclusions: [...brief.exclusions],
      kind: brief.kind,
      light: brief.lightFamily,
    },
    plan: { kind: brief.kind, light: brief.lightFamily },
    reference: selectPromptLabReference(brief.lightFamily),
    recentScenes: input.recentScenes.filter(
      (scene) => scene.conceptFamily !== brief.conceptFamily
    ),
    retry: input.retry,
    lockedBrief: brief,
    modelCall: input.modelCall,
  });
}
