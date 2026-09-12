/**
 * Private planning guidance for the shoot writer. The planning fields it
 * describes are deliberately removed before a prompt reaches the image model.
 * This gives the language model room to solve the scene once without turning
 * every final prompt into a physics checklist.
 */
export const PHYSICAL_SCENE_REASONING_INSTRUCTION = `
PHYSICAL SCENE PASS — SOLVE THIS BEFORE WRITING CAPTURE PROSE:
Return physicalScene as a concise private working model shared by all four frames. Establish the orientation and usable extent of the nearby surfaces, which contacts can genuinely bear weight, the direction of gravity, and the behavior of any active equipment. Resolve ambiguity in the brief into one mechanically coherent scene rather than treating an activity label as a pose.

For each frame, return physicalPlan as a concise private account of the exact captured instant. Work from cause to visible consequence:
- Place the instant inside a real action sequence: what has just happened, what he is doing now, and where the motion or rest would naturally go next.
- Keep that instant inside the brief's centralMoment and fourFrameOpportunity; together they are the allowed action boundary, not loose inspiration. When the central action is already visually strong, preserve it across more than one camera view or adjacent phase instead of manufacturing secondary business for variety. Keep wearables, clothing, equipment and nearby objects passive unless centralMoment or fourFrameOpportunity explicitly calls for an interaction; never infer device-checking, grooming or adjustment business merely from their presence.
- Close the load path. Identify the contacts carrying his weight, the forces that matter, and where his center of mass sits relative to his base of support. Account for momentum, friction, tension or counterbalance only when present.
- Let ankles, knees, hips, spine, shoulders and head respond to that load. Use task-caused asymmetry and small transitional imbalance, not decorative pose variation.
- Account for both hands, whether visible or cropped, without forcing them into the composition. Give each visible hand one compatible job. Let clothing, loose gear and handled objects hang, pull, compress or make contact according to gravity and the action.

Reject a plan that would still describe the same photograph after replacing the stated activity with an unrelated one. Generic standing, looking, accessory use or clothing adjustment is not a lived event by itself; the arrangement must visibly result from this moment.

Then derive capturePrompt from physicalScene and physicalPlan. Begin with the causal, photographable instant and state the visible evidence the image model must render: supporting contacts, weight distribution, consequential body angles, hand/object state and gaze. Include only mechanics that can be seen at the chosen crop. Use plain photographic language rather than physics jargon or generic claims such as "physically plausible." If the intended instant cannot be made coherent in the established scene, simplify the action before writing the prompt.`.trim();
