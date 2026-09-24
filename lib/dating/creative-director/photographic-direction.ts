/** Shared craft guidance; the writer chooses views from the occasion, never a pose menu. */
export const PHOTOGRAPHIC_DIRECTION_VERSION = "dating-photographic-direction-v3" as const;

export const FRAME_DIRECTION_INSTRUCTION = `
Choose camera position, head orientation relative to the lens, eye target and crop independently. Begin capturePrompt with the camera's physical position and viewing direction, explicit face view, and crop. Make the face view executable: describe where the nose points in the image, the relative visibility of the nearer and farther cheek or eye, and whether the head is level or tilted. Use only the cues needed to remove ambiguity; "slightly turned", "looking away" and "three-quarter view" alone are insufficient. Keep likeness readable; extreme profiles are not necessary.
Frame dating photographs close, chest-up or waist-up, with a prominent face, modest headroom and an explicit lower crop boundary matching cameraDistance. A wider crop is justified only when an essential physical action in the brief cannot be understood within waist-up framing. Walking, standing, pausing, clothing and background scenery never require a wider crop. Clothing and limbs beyond the chosen boundary stay off-frame.
Locate the camera relative to a physical feature and state the direction it looks through the subject. That sightline must explain which part of the SAME location appears behind him. Preserve architecture and light source; allow their apparent alignment, overlap and visibility to change. A wider view of the same backdrop is not a new perspective. Put the visible instructions in capturePrompt, not only private planning.`.trim();

export const SHOOT_DIRECTION_INSTRUCTION = `
PHOTOGRAPHIC DIRECTION (${PHOTOGRAPHIC_DIRECTION_VERSION}):
Design the four photographs together from the occasion, without an angle schedule, numerical angle bands or a standard framing sequence.
${FRAME_DIRECTION_INSTRUCTION}
Use physicalPlan for the concise camera/head/crop decision as well as necessary mechanics. Before returning, compare the four views THROUGH THE LENS: revise repeated face turns and tilts, even if eyes, hands or crops differ. Moving the camera with the head can leave the face view unchanged. Revise repeated camera sightlines and resulting backgrounds. Write four complete new exposures with scene-driven choices, not an angle menu or a sequence of edits to the anchor.`.trim();

export const CROP_PRIORITY_SENTENCE =
  "The stated crop is mandatory; keep all garments and body parts beyond its boundaries outside the image.";
