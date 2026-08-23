import type { DatingSceneBrief, SceneMomentPlan } from "./types";

type MomentContext = Pick<
  DatingSceneBrief,
  "activity" | "activityReason" | "datingSignal" | "kind" | "representedInterest"
>;

function plan(
  profileId: string,
  overallTone: string,
  frames: SceneMomentPlan["frames"],
  allowsFullLaugh = false
): SceneMomentPlan {
  return { profileId, overallTone, frames, allowsFullLaugh };
}

/**
 * Turns scene meaning into four facial/gaze beats. Framing stays predictable for
 * product usefulness; emotional rhythm does not. This keeps Gemini from using
 * the same neutral → candid → composed → laugh sequence for every shoot.
 */
export function resolveSceneMomentPlan(scene: MomentContext): SceneMomentPlan {
  const activity = scene.activity;
  const reason = scene.activityReason;
  const interest = scene.representedInterest;

  if (interest === "gym" || interest === "running" || interest === "boxing" || interest === "cycling") {
    return plan("focused-recovery", "Grounded post-effort focus that relaxes into earned satisfaction.", {
      close: "His eyes are on the lens with alert post-effort composure, an even breath and naturally settled lips.",
      medium: `His attention stays on ${activity} past the camera; his brow is lightly engaged and his mouth remains relaxed.`,
      threeQuarter: "He is absorbed in the physical reset, gaze following his next movement while the camera sits outside his attention.",
      expression: `Because ${reason}, a slow exhale softens his face into restrained satisfaction as his gaze drops below the camera.`,
    });
  }

  if (interest === "tennis" || interest === "football" || interest === "golf") {
    return plan("playful-competition", "Easy competitive energy with concentration and a compact, earned grin.", {
      close: "His eyes are on the lens with bright, ready attention and the beginning of a confident grin.",
      medium: `His eyes track the next part of ${activity} beyond the camera, with focused brows and relaxed jaw muscles.`,
      threeQuarter: "He looks past the camera toward the playing area with poised anticipation, expression concentrated and energetic.",
      expression: `Because ${reason}, the concentration releases into one quick satisfied grin with his gaze still on the activity beside the camera.`,
    });
  }

  if (["climbing", "hiking", "skiing", "sailing", "surfing", "travel", "motorcycles"].includes(interest ?? "")) {
    return plan("alert-curiosity", "Observant adventure: alert to the place, quietly pleased to be there.", {
      close: "His eyes are on the lens with calm alertness, bright focus and a mouth resting just short of a smile.",
      medium: `His gaze studies the next part of ${activity} past the camera, with attentive eyes and a quietly curious expression.`,
      threeQuarter: "He looks beyond the camera into the distance with composed readiness, face open and absorbed by the surroundings.",
      expression: `Because ${reason}, recognition warms his eyes and lifts one corner of his mouth in a private smile as he looks below the camera.`,
    });
  }

  if (["reading", "art", "music", "cooking"].includes(interest ?? "")) {
    return plan("absorbed-interest", "Quiet absorption that reveals taste, curiosity and understated pleasure.", {
      close: "His eyes are on the lens with thoughtful warmth and a softly settled mouth.",
      medium: `His attention returns to ${activity}; his expression is focused, curious and unaware of the camera.`,
      threeQuarter: "He pauses mid-thought with his gaze held on the activity beyond the camera, face composed and genuinely absorbed.",
      expression: `Because ${reason}, a small discovery softens his brow and produces a subtle closed-mouth smile while the camera stays outside his attention.`,
    });
  }

  if (interest === "coffee" || scene.kind === "home") {
    return plan("quiet-contentment", "Unhurried everyday ease, rested rather than performatively cheerful.", {
      close: "His eyes are on the lens with rested warmth, relaxed eyelids and a faint closed-mouth smile.",
      medium: `His gaze settles on ${activity} beside the camera, expression calm and comfortably occupied.`,
      threeQuarter: "He looks past the camera through the room with loose, unhurried attention and a naturally neutral mouth.",
      expression: `Because ${reason}, his face eases into a brief private smile while his gaze remains below the camera.`,
    });
  }

  if (interest === "dogs") {
    return plan("warm-companionship", "Responsive warmth prompted by the companion already present in the scene.", {
      close: "His eyes are on the lens with open warmth and an easy smile that reaches his expression.",
      medium: `His attention follows ${activity} beside the camera, eyebrows lifting with affectionate amusement.`,
      threeQuarter: "He watches the companion beyond the camera with relaxed fondness and an unguarded face.",
      expression: `Because ${reason}, his face opens into a genuine broad smile directed toward the companion beside the camera.`,
    });
  }

  if (interest === "nightlife" || interest === "dining" || scene.kind === "social") {
    return plan("social-anticipation", "Warm anticipation before a social plan, confident but never posed like an advert.", {
      close: "His eyes are on the lens with a welcoming, self-assured half-smile and attentive focus.",
      medium: `His gaze moves past the camera toward where ${activity} will continue, expression interested and socially at ease.`,
      threeQuarter: "He takes in the entrance or open route beyond the camera with composed anticipation and a relaxed mouth.",
      expression: `Because ${reason}, a remembered detail produces a brief crooked grin and softened eyes looking below the camera.`,
    });
  }

  if (scene.datingSignal === "competence" || scene.kind === "portrait") {
    return plan("composed-confidence", "Quiet self-possession with small changes in attention rather than a staged smile cycle.", {
      close: "His eyes are on the lens with steady, self-possessed attention and a relaxed neutral mouth.",
      medium: `His gaze follows ${activity} past the camera, brows calm and expression purposeful.`,
      threeQuarter: "He looks just beyond the camera with settled confidence and an unforced face.",
      expression: `Because ${reason}, the seriousness releases into a slight knowing smile at one corner of his mouth as he looks below the camera.`,
    });
  }

  return plan("open-ease", "Approachable ease shaped by the scene rather than a standard portrait sequence.", {
    close: "His eyes are on the lens with attentive warmth and a naturally relaxed mouth.",
    medium: `His attention follows ${activity} past the camera, expression curious and present.`,
    threeQuarter: "He looks beyond the camera toward the open part of the scene with calm interest and loose facial muscles.",
    expression: `Because ${reason}, his eyes soften and a small spontaneous closed-mouth smile appears as he looks below the camera.`,
  });
}
