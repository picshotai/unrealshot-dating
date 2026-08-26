import {
  compileShootOutput,
  datingShootOutputSchema,
  type DatingShootIntent,
} from "@/lib/dating/creative-director";

/**
 * Sample-only gallery scaffolding. These strings are never sent to Gemini or
 * Fal; they only let the normal 15-shoot/60-row dashboard contract stay intact.
 */
export function createLocalMockShoot(brief: DatingShootIntent) {
  return datingShootOutputSchema.parse(compileShootOutput({
    title: brief.title,
    frames: [
      ["mock-anchor", "Scene preview", "The companion first notices the moment.", "chest-up", true, true],
      ["mock-observation", "In the moment", "He continues the real occasion.", "waist-up", false, false],
      ["mock-context", "Life around him", "A second point of view reveals more context.", "three-quarter", false, false],
      ["mock-connection", "Companion's view", "He briefly reconnects with the photographer.", "close", false, true],
    ].map(([frameId, roleLabel, moment, cameraDistance, isAnchor, isProfileCandidate]) => ({
      frameId: String(frameId),
      roleLabel: String(roleLabel),
      moment: String(moment),
      cameraDistance: cameraDistance as "close" | "chest-up" | "waist-up" | "three-quarter",
      width: 1728,
      height: 2304,
      isAnchor: Boolean(isAnchor),
      isProfileCandidate: Boolean(isProfileCandidate),
      capturePrompt: `Local sample placeholder for ${brief.title}. A 3:4 preview; never send this text to an image provider.`,
    })),
  }, brief));
}
