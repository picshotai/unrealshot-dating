import { leadGarment, outfitOf } from "@/lib/dating/authoring/rules";
import type { DatingSceneBrief } from "@/lib/dating/scene-recipes";
import { SHOOTS } from "@/lib/dating/shoots";
import type { PromptLabModelCall } from "@/lib/dating/prompt-lab/generate";
import {
  SCENE_ANCHOR_FRAMING,
  SCENE_ANCHOR_PROMPT_SENTENCE,
} from "@/lib/dating/prompt-lab/system-instruction";

const IDENTITY = "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone.";
const OUTFITS = [
  "a muted teal brushed-cotton overshirt over a soft ecru crew neck, charcoal trousers, clean brown boots and a plain steel watch",
  "a rust twill chore jacket over a stone crew neck, deep indigo trousers, clean suede boots and a plain steel watch",
  "a forest green textured overshirt over a pale grey crew neck, dark trousers, clean leather boots and a plain steel watch",
  "a tobacco canvas field shirt over an ivory crew neck, slate trousers, clean brown boots and a plain steel watch",
] as const;

function mockOutfit(brief: DatingSceneBrief): string {
  if (brief.kind === "activity") {
    if (brief.representedInterest === "tennis") {
      return "a fitted muted-blue breathable tennis polo, tapered technical tennis trousers, clean white court trainers and a plain steel watch";
    }
    return "a fitted forest-green breathable performance top, tapered charcoal technical training trousers, clean low-profile trainers and a plain steel watch";
  }
  const used = new Set(
    SHOOTS.flatMap((shoot) => shoot.frames)
      .map((frame) => outfitOf(frame.prompt))
      .filter((outfit): outfit is string => Boolean(outfit))
      .map(leadGarment)
  );
  return OUTFITS.find((outfit) => !used.has(leadGarment(outfit))) ?? OUTFITS[0];
}

function lightSentence(brief: DatingSceneBrief): string {
  if (brief.lightFamily === "flash") {
    return "A single direct flash beside the camera lays crisp evening light across his face and clothes.";
  }
  if (brief.lightFamily === "overcast") {
    return "Broad open-sky daylight fills the frame and lays soft even light across his face and clothes.";
  }
  if (brief.lightFamily === "open-door") {
    return "Broad daylight from the open doorway at the frame-left edge lays soft directional light across him.";
  }
  return "Soft window light from the frame-right edge lays broad natural light across his face and clothes.";
}

/** A zero-provider fixture used only when the complete pipeline is in mock mode. */
export function mockProductionModelCall(brief: DatingSceneBrief): PromptLabModelCall {
  return async () => {
    const outfit = mockOutfit(brief);
    const wardrobeState = brief.kind === "activity"
      ? "The top sleeves, trouser hems, fastenings and watch position stay fixed, and all fabric edges are clean, continuous and intact."
      : "The overshirt sleeves stay rolled twice at mid-forearm, every fastening and hem stays fixed, and all fabric edges are clean, continuous and intact.";
    const light = lightSentence(brief);
    const environment = `The ${brief.environmentAnchors[0]} and the ${brief.environmentAnchors[1]} remain the two fixed background landmarks.`;
    const propClause = brief.props.length > 0
      ? ` The reserved scene includes ${brief.props.join(" and ")}.`
      : "";
    const shared = `${IDENTITY} He is photographed at ${brief.location}, wearing ${outfit}. ${wardrobeState} ${environment}${propClause} The background remains three metres behind him. ${light}`;
    const anchored = (framing: string) =>
      framing === SCENE_ANCHOR_FRAMING ? "" : ` ${SCENE_ANCHOR_PROMPT_SENTENCE}`;
    const technical = "iPhone 15 Pro, 24mm lens, f/1.8, 1/200 second and ISO 100. Preserve visible cheek pores, natural jaw stubble, eye creases and the grain of every fabric.";
    const frames = [
      {
        framing: "close",
        width: 1728,
        height: 2304,
        prompt: `${shared}${anchored("close")} His shoulders turn twenty degrees while one hand settles the edge of his own collar and the other arm falls beyond the crop. His eyes are on the lens with a calm half-smile. A 3:4 shoulders-up opener photographed at eye level on ${technical}`,
      },
      {
        framing: "medium",
        width: 1728,
        height: 2304,
        prompt: `${shared}${anchored("medium")} He takes one measured step during ${brief.activity}, with the nearer hand brushing his own cuff and the far arm swinging naturally. His gaze settles toward open space beside the camera. A 3:4 chest-up candid photographed slightly below eye level on ${technical}`,
      },
      {
        framing: "threeQuarter",
        width: 1728,
        height: 2304,
        prompt: `${shared}${anchored("threeQuarter")} He pauses with his weight carried through one straight leg, the other knee relaxed, one hand loose near his thigh and the far hand resting at his own hip. He looks directly into the lens with quiet confidence. A 3:4 three-quarter portrait photographed at waist height on ${technical}`,
      },
      {
        framing: "expression",
        width: 1728,
        height: 2304,
        prompt: `${shared}${anchored("expression")} A small remembered detail from ${brief.activityReason} brings out a spontaneous laugh as his fingers touch his own sternum and the other hand hangs loosely. His gaze drops below the camera. A 3:4 close expression frame photographed just above eye level on ${technical}`,
      },
    ];
    return {
      text: JSON.stringify({
        scene: {
          id: brief.sceneId,
          title: `${brief.venue} — ${brief.datingSignal}`,
          conceptFamily: brief.conceptFamily,
          settingFamily: brief.settingFamily,
          datingSignal: brief.datingSignal,
          location: brief.location,
          activity: brief.activity,
          activityReason: brief.activityReason,
          outfit,
          wardrobeState,
          light,
          environment,
          environmentAnchors: [...brief.environmentAnchors],
          lightFamily: brief.lightFamily,
          kind: brief.kind,
          register: brief.register,
          props: [...brief.props],
          rationale: `This reserved scene presents ${brief.datingSignal} through a believable personal moment while keeping the man visually dominant.`,
        },
        frames,
      }),
      usage: { inputTokens: 0, outputTokens: 0, reasoningTokens: 0, totalTokens: 0 },
    };
  };
}
