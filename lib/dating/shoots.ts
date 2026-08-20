import { FRAMES_PER_SHOOT, type ExcludableTag, type InterestId, type StylePref } from "./types";

/**
 * The shoot library.
 *
 * Replaces the compositional prompt system, in which each prompt was assembled
 * at generation time from independent location, backdrop, outfit and hobby
 * values. Nothing ever read the assembled result, and 147 of the 1,170
 * combinations put formal wardrobe into an action scene — which is how a navy
 * topcoat and leather dress shoes ended up running up a forest trail.
 *
 * A shoot is one location, one outfit, one light, and four frames of it. Because
 * those three are fixed inside every prompt string, a frame *cannot* contradict
 * them: there is nothing left to combine. The strings below are sent verbatim.
 *
 * Frame design follows what the three test shoots measured (docs/shoot-test-01.md):
 *
 * - Exactly one of each framing. Five frames forced two mediums, and frames that
 *   competed at the same distance are where the weakest results appeared — and
 *   where the model rendered one frame as another with a small edit.
 * - The `close` frame is the anchor. It is generated first and its output is
 *   passed as a scene reference for the other three, which is what carries the
 *   room, the clothes and the light direction across a shoot.
 * - Two frames meet the lens, two look away. Four of five test frames met the
 *   lens and the only one with any warmth did not.
 * - The full outfit is repeated verbatim in every frame. The two frames that
 *   abbreviated it are the two where the model invented the rest.
 */

export type Framing = "close" | "medium" | "threeQuarter" | "expression";

/** What a shoot is *of*, which is how a frame earns its user-facing role. */
export type ShootKind = "portrait" | "home" | "outdoors" | "social" | "activity";

export const FRAMINGS: readonly Framing[] = [
  "close",
  "medium",
  "threeQuarter",
  "expression",
];

/** The anchor is generated first; the rest reference its output. */
export const ANCHOR_FRAMING: Framing = "close";

export type ShootFrame = {
  framing: Framing;
  /** Authored per frame. The prompt names the matching ratio in words. */
  imageSize: { width: number; height: number };
  /** Complete and self-contained. No tokens, nothing substituted. */
  prompt: string;
};

export type Shoot = {
  id: string;
  /** Shown to the user, and used for the ZIP folder name. */
  title: string;
  kind: ShootKind;
  /** Which wardrobe register this shoot's outfit sits in, for the lead question. */
  register: StylePref;
  /** Interests this shoot genuinely serves, so a chip selects real scenes. */
  interests?: readonly InterestId[];
  /**
   * Content a user can exclude. Authored, never inferred — a shoot carrying a
   * tag is dropped whole, because the outfit and location are fixed and there is
   * no variant to fall back to.
   */
  tags?: readonly ExcludableTag[];
  frames: readonly ShootFrame[];
};

const PORTRAIT_3_4 = { width: 1728, height: 2304 } as const;
const LANDSCAPE_4_3 = { width: 2304, height: 1728 } as const;

export const SHOOTS: readonly Shoot[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // Scored 4/5 in testing and was the strongest configuration found: one soft
  // source, one unambiguous garment, and an interior the model does not have to
  // invent. All four frames below were rated usable.
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "kitchen-window-morning",
    title: "Kitchen, morning",
    kind: "home",
    register: "sharp",
    interests: ["coffee", "cooking"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands at the stone counter of a bright apartment kitchen, wearing a white oxford shirt with the sleeves rolled to the forearm, charcoal wool trousers and a steel watch. He has turned his head about thirty degrees toward the lens ahead of his shoulders, which stay angled to the counter, so the turn shows in his neck. His mouth is closed with one corner lifted. One hand is braced on the counter edge, fingers over the lip of the stone, the other loose at his side. The room runs four metres back behind him, reduced to soft pale shapes. A large window filling the left edge of the frame lays broad soft daylight across him. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 100. Keep pore structure across the nose, the faint shadow of stubble along the jaw, and the shirt's collar edge holding a hard line of light.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands at the stone counter of a bright apartment kitchen, wearing a white oxford shirt with the sleeves rolled to the forearm, charcoal wool trousers and a steel watch. One hand rests around a coffee cup on the counter and the other is flat on the stone beside it, taking a little of his weight so that shoulder sits lower. His chin is turned a few degrees and his eyes go past the lens to the window, mid-thought. The kitchen carries on five metres behind him, its far cabinets soft and a stop darker. A large window filling the left edge of the frame lays broad soft daylight across him. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 100. Keep visible pores, forearm hair catching the daylight, and the crisp weave of the oxford cotton.",
      },
      {
        framing: "threeQuarter",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on a stool at the stone counter of a bright apartment kitchen, wearing a white oxford shirt with the sleeves rolled to the forearm, charcoal wool trousers and a steel watch. He rests one forearm along the stone and lets the other hand hang between his knees, so one shoulder drops lower than the other. His back is easy and he looks to the lens with his lips just parted. The kitchen runs five metres behind him, cabinets soft and darker. A large window filling the left edge of the frame lays broad soft daylight across him. A 3:4 three-quarter frame at seated eye level, iPhone 15 Pro, 24mm, f/1.8, 1/200, ISO 100. Keep visible pores, individual hairs at his hairline, and the soft folds where the rolled sleeve gathers at the elbow.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands at the stone counter of a bright apartment kitchen, wearing a white oxford shirt with the sleeves rolled to the forearm, charcoal wool trousers and a steel watch. He laughs with his eyes creased and his gaze dropping past the lens to the counter in front of him. One hand has lifted to rest at the back of his own neck with the elbow out, and his shoulders have risen with it. The kitchen sits four metres behind him and stays soft. A large window filling the left edge of the frame lays broad soft daylight across him. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 100. Keep the creases at the outer corners of the eyes, real pores across the cheeks, and the fine texture of the shirt where it pulls at the shoulder.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Relocated. The original read as an alley, which is the wrong signal for a
  // man buying photographs to look like he is doing well. Flash stays: it is the
  // model's strongest light and nothing else in the library uses it.
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "hotel-forecourt-evening",
    title: "Hotel forecourt, evening",
    kind: "social",
    register: "sharp",
    interests: ["nightlife", "dining", "travel"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on the lit forecourt of a hotel entrance under its stone canopy at night, wearing a navy wool overcoat over a grey fine-gauge merino crew, dark charcoal trousers, black leather chelsea boots and a steel watch. One hand has come up to the lapel of the coat and holds it between two fingers, the other arm hanging loose. His chin is level and his eyes are on the lens, with a closed-mouth half-smile pulling one cheek higher. The forecourt runs four metres back behind him into soft dark shapes. Direct on-camera flash reaches him frontally, metered for his face so the skin holds detail and the fall-off happens behind him. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/125, ISO 400. Keep the fine lines at the corners of his eyes, pores across the cheeks, and the wool nap of the coat collar.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on the lit forecourt of a hotel entrance at night, wearing a navy wool overcoat over a grey fine-gauge merino crew, dark charcoal trousers, black leather chelsea boots and a steel watch. He has both hands pushed into the coat pockets and his weight settled onto his back leg, which drops one hip lower than the other. His chin is tipped down a few degrees and his eyes go off to one side along the forecourt, caught by movement out of frame. The paving carries five metres behind him, damp enough to hold a smeared reflection. Direct on-camera flash reaches him frontally, metered for his face so the skin holds detail and the fall-off happens behind him. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/1.8, 1/120, ISO 400. Keep the weave of the merino, individual hairs lifting at the crown, and skin that holds its own texture under the flash.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on the low stone wall of a planter beside a hotel entrance at night, wearing a navy wool overcoat over a grey fine-gauge merino crew, dark charcoal trousers, black leather chelsea boots and a steel watch. One forearm rests across a raised knee with the hand hanging loose, while the other palm is flat on the wall beside his hip taking his weight, so his shoulders sit at different heights. He looks up to the lens with his brow slightly raised. The hotel frontage runs six metres past him into darkness. Direct on-camera flash reaches him frontally, metered for his face so the skin holds detail and the fall-off happens behind him. A 4:3 three-quarter frame taken from standing height, iPhone 15 Pro, 24mm, f/1.8, 1/120, ISO 400. Keep visible pores, the texture of the wool across his shoulders, and the grain of the stone under his palm.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on the lit forecourt of a hotel entrance at night, wearing a navy wool overcoat over a grey fine-gauge merino crew, dark charcoal trousers, black leather chelsea boots and a steel watch. He laughs with his head dropped a few degrees toward one shoulder, eyes creased almost shut and teeth showing, his gaze falling away from the lens. One hand has come up to rest flat against his own chest while the other stays at his side. The forecourt behind him runs three metres and blurs into dark shapes. Direct on-camera flash reaches him frontally, metered for his face so the laugh lines read sharply. A 3:4 close frame from the shoulders up, framed low so there is headroom above him, iPhone 15 Pro, 24mm, f/1.8, 1/125, ISO 400. Keep crow's feet, real pore structure, and the shine the flash raises across the forehead.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // "A stone harbour wall above moored boats" returned an industrial dock with
  // cranes and a working fishing port with a car park. The words now exclude the
  // wrong version, and the jacket is named so only one garment satisfies it.
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "marina-pontoon-overcast",
    title: "Marina, midday",
    kind: "outdoors",
    register: "casual",
    interests: ["sailing", "travel"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on the timber pontoon walkway of a yacht marina under a flat bright overcast sky, white hulls and tall masts moored either side, wearing a cream fisherman knit under a waxed cotton field jacket with a corduroy collar, dark denim, brown leather boots and a steel watch. One hand has come up to fold the corduroy collar down against his neck with two fingers, the other loose at his side. His chin is level and his eyes are on the lens, mouth closed with the corners lifted. The moored hulls sit eight metres behind him, dissolved to soft pale bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/2.0, 1/500, ISO 64. Keep visible pores, wind-lifted hair at the temple, and the waxed cotton's dull sheen along the shoulder.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on the timber pontoon walkway of a yacht marina under a flat bright overcast sky, white hulls and tall masts moored either side, wearing a cream fisherman knit under a waxed cotton field jacket with a corduroy collar, dark denim, brown leather boots and a steel watch. He has turned his head about forty degrees over one shoulder while his torso stays angled out to the water, so the turn shows in his neck and one shoulder reads closer. One hand rests on the pontoon rail beside him, fingers curled over it, and his gaze goes past the lens down the line of masts. The moored hulls sit nine metres behind him and lose detail. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/2.0, 1/500, ISO 64. Keep visible pores, the cable texture of the knit at his collar, and hair moving at the crown.",
      },
      {
        framing: "threeQuarter",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on the edge of the timber pontoon walkway of a yacht marina under a flat bright overcast sky, white hulls and tall masts moored either side, wearing a cream fisherman knit under a waxed cotton field jacket with a corduroy collar, dark denim, brown leather boots and a steel watch. One forearm is laid across a raised knee and the other hand is flat on the boards beside his hip, so his shoulders sit at different heights. His chin is level and his eyes are direct to the lens. The marina opens ten metres behind him, hulls and far shore reduced to soft grey bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 three-quarter frame taken from standing height looking slightly down, iPhone 15 Pro, 24mm, f/2.0, 1/500, ISO 64. Keep the cable texture of the knit, salt-dulled leather on the boots, and skin that holds its grain in the flat light.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on the timber pontoon walkway of a yacht marina under a flat bright overcast sky, white hulls and tall masts moored either side, wearing a cream fisherman knit under a waxed cotton field jacket with a corduroy collar, dark denim, brown leather boots and a steel watch. He laughs with his head dropped toward one shoulder and his gaze falling past the lens to the boards, eyes narrowed to creases. One hand grips the opposite forearm across his body and his shoulders have risen with the laugh. The marina lies nine metres behind him in soft pale bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/2.0, 1/640, ISO 64. Keep the creases at the eye corners, real pore structure across the cheekbones, and the fine fibres standing off the cream knit at his shoulder.",
      },
    ],
  },
];

export function getShoot(id: string): Shoot | undefined {
  return SHOOTS.find((shoot) => shoot.id === id);
}

export function anchorFrameOf(shoot: Shoot): ShootFrame {
  const anchor = shoot.frames.find((frame) => frame.framing === ANCHOR_FRAMING);
  if (!anchor) throw new Error(`Shoot ${shoot.id} has no ${ANCHOR_FRAMING} frame`);
  return anchor;
}

/** Lookup by id, for the many places that hold only a stored `shoot_id`. */
export const SHOOT_BY_ID: ReadonlyMap<string, Shoot> = new Map(
  SHOOTS.map((shoot) => [shoot.id, shoot])
);

/** The 1-based position of a framing within a shoot, matching `frame_index`. */
export function frameAt(shoot: Shoot, frameIndex: number): ShootFrame | undefined {
  return shoot.frames[frameIndex - 1];
}

/**
 * The title to show for a stored row whose shoot has since been retired from the
 * library. A delivered order keeps its photos, so this must never throw.
 */
export function shootTitle(shootId: string): string {
  return SHOOT_BY_ID.get(shootId)?.title ?? shootId;
}
