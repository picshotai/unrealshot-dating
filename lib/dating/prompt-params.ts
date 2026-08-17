import type { DatingPromptDefinition } from "./prompt-library";
import type { StylePref, Vibe } from "./types";

const PLACEHOLDER_PATTERN = /\{\{([^}]+)\}\}/g;
const ALLOWED_PLACEHOLDERS = new Set(["location", "outfit", "hobby"]);
const MAX_HOBBY_LENGTH = 80;

export type DatingPromptPreferences = {
  vibe: Vibe;
  style: StylePref;
  hobby?: string | null;
};

function normalizeHobby(value?: string | null): string | null {
  if (!value) return null;

  const normalized = value
    .replace(/[{}]/g, "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_HOBBY_LENGTH)
    .trim();

  return normalized || null;
}

export function compileDatingPrompt(
  definition: DatingPromptDefinition,
  preferences: DatingPromptPreferences
): string {
  const hobby = normalizeHobby(preferences.hobby);
  const template =
    hobby && definition.hobbyPromptTemplate
      ? definition.hobbyPromptTemplate
      : definition.promptTemplate;

  const tokens = [...template.matchAll(PLACEHOLDER_PATTERN)].map(
    (match) => match[1]
  );
  for (const token of tokens) {
    if (!ALLOWED_PLACEHOLDERS.has(token)) {
      throw new Error(`Unknown prompt token {{${token}}} in ${definition.id}`);
    }
    if (token === "hobby" && !hobby) {
      throw new Error(`Prompt ${definition.id} requires a hobby value`);
    }
  }

  const compiled = template
    .replaceAll("{{location}}", definition.locations[preferences.vibe])
    .replaceAll("{{outfit}}", definition.outfits[preferences.style])
    .replaceAll("{{hobby}}", hobby ?? "")
    .replace(/\s+/g, " ")
    .trim();

  const unresolved = [...compiled.matchAll(PLACEHOLDER_PATTERN)];
  if (unresolved.length > 0) {
    throw new Error(
      `Unresolved prompt token ${unresolved[0][0]} in ${definition.id}`
    );
  }

  return compiled;
}
