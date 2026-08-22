import type { PromptLabInput, PromptLabKind, PromptLabLight, RecentScene } from "./schemas";
import { LIGHT_FAMILIES, SHOOT_KINDS } from "./schemas";

export type PromptLabPlan = { kind: PromptLabKind; light: PromptLabLight };

function stableNumber(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function leastUsed<T extends string>(
  choices: readonly T[],
  recent: readonly RecentScene[],
  read: (scene: RecentScene) => T,
  seed: string
): T {
  const counts = new Map(choices.map((choice) => [choice, 0]));
  for (const scene of recent) counts.set(read(scene), (counts.get(read(scene)) ?? 0) + 1);
  const minimum = Math.min(...choices.map((choice) => counts.get(choice) ?? 0));
  const candidates = choices.filter((choice) => counts.get(choice) === minimum);
  return candidates[stableNumber(seed) % candidates.length];
}

export function planPromptLabScene(
  input: PromptLabInput,
  recent: readonly RecentScene[]
): PromptLabPlan {
  return {
    kind: input.kind === "auto"
      ? leastUsed(SHOOT_KINDS, recent, (scene) => scene.kind, `${input.clientRequestId}:kind`)
      : input.kind,
    light: input.light === "auto"
      ? leastUsed(LIGHT_FAMILIES, recent, (scene) => scene.lightFamily, `${input.clientRequestId}:light`)
      : input.light,
  };
}

