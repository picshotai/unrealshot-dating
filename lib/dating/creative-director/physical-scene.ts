/**
 * Private planning guidance for the shoot writer. The planning fields it
 * describes are deliberately removed before a prompt reaches the image model.
 * This gives the language model room to solve the scene once without turning
 * every final prompt into a physics checklist.
 */
export const PHYSICAL_SCENE_REASONING_INSTRUCTION = `
PHYSICAL SCENE PASS — SOLVE THIS BEFORE WRITING CAPTURE PROSE:
Match the depth of planning to the mechanical difficulty; apply the checks silently rather than narrating every one:
- For an ordinary, stable standing or seated moment with obvious support and no meaningful motion, tension or object handling, keep physicalScene to one brief sentence and each physicalPlan to one brief sentence. Name only the primary support, body orientation and visible consequence that matter.
- For a moving, elevated, sloped, load-bearing, tensioned or object-manipulation moment, use two to four compact sentences as needed. Resolve only the surfaces, contacts, forces and body responses that affect the visible photograph.

Return physicalScene as the private working model shared by all four frames. Resolve ambiguity in the brief into one mechanically coherent scene rather than treating an activity label as a pose. Never manufacture complexity to make the plan sound rigorous.

For each frame, return physicalPlan as the private account of the exact captured instant. Use the following checks only where relevant, working from cause to visible consequence:
- Place the instant inside a real action sequence: what has just happened, what he is doing now, and where the motion or rest would naturally go next.
- Keep that instant inside the brief's centralMoment and fourFrameOpportunity; together they are the allowed action boundary, not loose inspiration. While you may preserve it across more than one camera view or adjacent phase, across the four frames vary his physical moment, body orientation, and gaze naturally according to the setting (e.g. standing comfortably, shifting weight naturally, mid-stride, or seated if seating authentically exists in the location) and vary the camera's angle and distance around him. Never freeze him in an identical stance or simply crop in/out from the same spot. Keep wearables, clothing, equipment and nearby objects passive unless centralMoment or fourFrameOpportunity explicitly calls for an interaction; never infer device-checking, grooming or adjustment business merely from their presence.
- Close the load path. Identify the contacts carrying his weight, the forces that matter, and where his center of mass sits relative to his base of support. Account for momentum, friction, tension or counterbalance only when present.
- Let ankles, knees, hips, spine, shoulders and head respond to that load. Use task-caused asymmetry and small transitional imbalance, not decorative pose variation.
- Account for both hands, whether visible or cropped, without forcing them into the composition. Give each visible hand one compatible job. Let clothing, loose gear and handled objects hang, pull, compress or make contact according to gravity and the action.

Reject a plan that would still describe the same photograph after replacing the stated activity with an unrelated one. Generic standing, looking, accessory use or clothing adjustment is not a lived event by itself; the arrangement must visibly result from this moment.

Then derive capturePrompt from physicalScene and physicalPlan. After establishing the camera, face view and crop, describe the causal instant and its visible mechanics: supporting contacts, weight distribution, hand/object state and gaze. Include only mechanics visible within the chosen crop. A relaxed posture still needs an unambiguous face-to-camera relationship; follow the photographic direction guidance. Never invent artificial furniture, props, or obstacles merely to support a pose; standing naturally without support is completely normal. If the intended instant cannot be made coherent in the established scene, simplify the action before writing the prompt.`.trim();
