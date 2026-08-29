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

/**
 * Strips expression-bearing text and smile/laugh cues from craft reference prompts
 * while preserving framing, body mechanics, light, lens/camera parameters, and scene coherence.
 */
export function cleanCraftReferencePrompt(prompt: string): string {
  return prompt
    // Standalone expression sentences
    .replace(/His mouth is closed with (?:one|the) corners? lifted\.?\s*/gi, "")
    .replace(/His mouth is closed in a slight smile\.?\s*/gi, "")
    // Clauses with half-smile, faint smile, slight smile, subtle smile, subtle smirk
    .replace(/,\s*with a (?:closed-mouth )?(?:half-smile|faint smile|slight smile|subtle smile|subtle smirk)(?: pulling one cheek higher)?/gi, "")
    .replace(/\bwith a (?:closed-mouth )?(?:half-smile|faint smile|slight smile|subtle smile|subtle smirk)(?: pulling one cheek higher)?\b/gi, "")
    // Clauses with corners lifted / mouth closed
    .replace(/,\s*mouth closed with (?:the|one) corners? lifted/gi, "")
    .replace(/\bmouth closed with (?:the|one) corners? lifted,?\s*/gi, "")
    .replace(/\bmouth closed in a slight smile,?\s*/gi, "")
    .replace(/,\s*mouth closed in a slight smile/gi, "")
    // Faint / slight smile phrases
    .replace(/,\s*with a faint(?:, knowing)? smile/gi, "")
    .replace(/\bwith a faint(?:, knowing)? smile,?\s*/gi, "")
    .replace(/with a slight smile and his head tilted/gi, "with his head tilted")
    .replace(/,\s*with a slight smile/gi, "")
    .replace(/\bwith a slight smile,?\s*/gi, "")
    // Smirks
    .replace(/,\s*with a subtle smirk lifting one side of his mouth(?: as he checks his look in the glass)?/gi, "")
    .replace(/\bwith a subtle smirk lifting one side of his mouth(?: as he checks his look in the glass)?\b/gi, "")
    // Parted mouth / lips
    .replace(/,\s*breathing through a parted mouth/gi, "")
    .replace(/\bbreathing through a parted mouth,?\s*/gi, "")
    .replace(/,\s*with his lips just parted/gi, "")
    .replace(/\bwith his lips just parted\b/gi, "")
    // Laughter
    .replace(/He laughs with[^\.]*\.\s*/gi, "")
    .replace(/\bmid-laugh,\s*/gi, "")
    // Fix grammar and punctuation artifacts
    .replace(/chin level,\s*and his eyes are on the lens/gi, "chin level and his eyes are on the lens")
    .replace(/,\s*,/g, ",")
    .replace(/\s+,/g, ",")
    .replace(/\s+\./g, ".")
    .replace(/\s{2,}/g, " ")
    .trim();
}

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
  return { ...item, prompt: cleanCraftReferencePrompt(frame.prompt) };
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
