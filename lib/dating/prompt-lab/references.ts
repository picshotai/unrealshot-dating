import { SHOOT_CATALOG, type ShootEvidence } from "@/lib/dating/shoot-catalog";
import { SHOOT_BY_ID, type Shoot } from "@/lib/dating/shoots";

import type { PromptLabLight } from "./schemas";

const REFERENCE_BY_LIGHT: Record<PromptLabLight, string> = {
  window: "kitchen-window-morning",
  "open-door": "climbing-gym-daylight",
  overcast: "marina-pontoon-overcast",
  flash: "hotel-forecourt-evening",
};

export type PromptLabReference = {
  id: string;
  evidence: ShootEvidence;
  shoot: Shoot;
};

export function selectPromptLabReference(light: PromptLabLight): PromptLabReference {
  const id = REFERENCE_BY_LIGHT[light];
  const metadata = SHOOT_CATALOG[id];
  const shoot = SHOOT_BY_ID.get(id);
  if (!metadata || metadata.availability !== "active" || !shoot) {
    throw new Error(`Approved prompt-lab reference is unavailable for ${light}.`);
  }
  return { id, evidence: metadata.evidence, shoot };
}

export function formatReference(reference: PromptLabReference): string {
  return [
    `Reference shoot: ${reference.shoot.title} (${reference.id})`,
    "Copy its completeness, consistency and four-frame craft only. Do not copy its location, outfit, activity, title, props or concept.",
    ...reference.shoot.frames.map((frame) =>
      `\n[${frame.framing} ${frame.imageSize.width}x${frame.imageSize.height}]\n${frame.prompt}`
    ),
  ].join("\n");
}

