import { SHOOT_CATALOG, type ShootLightFamily } from "@/lib/dating/shoot-catalog";
import { SHOOT_BY_ID } from "@/lib/dating/shoots";

import type { DatingShootIntent } from "./schemas";

type Framing = "close" | "medium" | "threeQuarter";

type ReferenceManifestItem = {
  shootId: string;
  framing: Framing;
  lightFamily: ShootLightFamily;
};

/**
 * Individual craft examples, never scene recipes. Expression frames and every
 * quarantined shoot are deliberately absent.
 */
export const CRAFT_REFERENCE_MANIFEST: readonly ReferenceManifestItem[] = [
  { shootId: "kitchen-window-morning", framing: "close", lightFamily: "window" },
  { shootId: "living-room-window-afternoon", framing: "medium", lightFamily: "window" },
  { shootId: "wine-bar-late-afternoon", framing: "close", lightFamily: "window" },
  { shootId: "restaurant-terrace-afternoon", framing: "medium", lightFamily: "window" },
  { shootId: "courtyard-doorway-afternoon", framing: "close", lightFamily: "open-door" },
  { shootId: "climbing-gym-daylight", framing: "medium", lightFamily: "open-door" },
  { shootId: "cafe-doorway-square-morning", framing: "close", lightFamily: "open-door" },
  { shootId: "gym-private-daylight", framing: "threeQuarter", lightFamily: "open-door" },
  { shootId: "marina-pontoon-overcast", framing: "close", lightFamily: "overcast" },
  { shootId: "coast-path-hike-overcast", framing: "medium", lightFamily: "overcast" },
  { shootId: "park-with-the-dog-morning", framing: "close", lightFamily: "overcast" },
  { shootId: "civic-steps-afternoon", framing: "threeQuarter", lightFamily: "overcast" },
  { shootId: "hotel-forecourt-evening", framing: "close", lightFamily: "flash" },
  { shootId: "venue-entrance-evening", framing: "medium", lightFamily: "flash" },
  { shootId: "hotel-canopy-night-sharp", framing: "close", lightFamily: "flash" },
  { shootId: "dark-wall-flash-night", framing: "threeQuarter", lightFamily: "flash" },
] as const;

export type CraftReference = {
  shootId: string;
  framing: Framing;
  lightFamily: ShootLightFamily;
  prompt: string;
};

function inferLightFamily(light: string): ShootLightFamily {
  if (/flash|night|direct light|hard light/i.test(light)) return "flash";
  if (/door|entrance|threshold|open side/i.test(light)) return "open-door";
  if (/overcast|cloud|open sky|diffuse outdoor/i.test(light)) return "overcast";
  return "window";
}

function referenceFor(item: ReferenceManifestItem): CraftReference {
  const metadata = SHOOT_CATALOG[item.shootId];
  const shoot = SHOOT_BY_ID.get(item.shootId);
  const frame = shoot?.frames.find((candidate) => candidate.framing === item.framing);
  if (!metadata || metadata.availability !== "active" || !shoot || !frame) {
    throw new Error(`Invalid dating craft reference ${item.shootId}/${item.framing}.`);
  }
  return { ...item, prompt: frame.prompt };
}

function stableNumber(value: string) {
  let hash = 2166136261;
  for (const char of value) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return hash >>> 0;
}

/** Two fragments with matching light and different source shoots/framing. */
export function selectCraftReferences(brief: DatingShootIntent): CraftReference[] {
  const lightFamily = inferLightFamily(brief.light);
  const eligible = CRAFT_REFERENCE_MANIFEST.filter((item) => item.lightFamily === lightFamily);
  const start = stableNumber(`${brief.candidateId}:${brief.location}`) % eligible.length;
  const first = eligible[start];
  const second = eligible.find((item, index) =>
    index !== start && item.shootId !== first.shootId && item.framing !== first.framing
  ) ?? eligible[(start + 1) % eligible.length];
  return [referenceFor(first), referenceFor(second)];
}

export function formatCraftReferences(references: readonly CraftReference[]) {
  return references.map((reference, index) => [
    `CRAFT EXAMPLE ${index + 1} (${reference.lightFamily}, ${reference.framing})`,
    reference.prompt,
  ].join("\n")).join("\n\n");
}
