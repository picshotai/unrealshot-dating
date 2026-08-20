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

  // ───────────────────────────────────────────────────────────────────────────
  // The winning configuration again, moved one room over: soft window light, an
  // interior the model does not have to invent, one unambiguous garment.
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "living-room-window-afternoon",
    title: "Living room, afternoon",
    kind: "home",
    register: "casual",
    interests: ["reading", "coffee"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in the corner of a bright apartment living room beside a low walnut bookshelf and a pale linen armchair, wearing a charcoal merino henley with the sleeves pushed to the forearm, dark indigo denim and a steel watch. He has turned his head about thirty degrees toward the lens ahead of his shoulders, which stay angled to the shelf, so the turn shows in his neck. His mouth is closed with one corner lifted and his eyes are on the lens. One hand rests along the top edge of the bookshelf with the fingers hooked over it, the other loose at his side. The room runs four metres back behind him, reduced to soft pale shapes. A tall window filling the left edge of the frame lays broad soft daylight across him. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/200, ISO 100. Keep pore structure across the nose, the faint shadow of stubble along the jaw, and the ribbed texture at the henley placket.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on the rolled arm of a pale linen armchair in a bright apartment living room beside a low walnut bookshelf, wearing a charcoal merino henley with the sleeves pushed to the forearm, dark indigo denim and a steel watch. One hand is wrapped around a stoneware mug held at chest height and the other rests palm-down on his thigh, so one shoulder sits lower than the other. His chin is turned a few degrees and his gaze goes past the lens toward the window, mid-thought. The room carries on five metres behind him, the far wall soft and a stop darker. A tall window filling the left edge of the frame lays broad soft daylight across him. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/200, ISO 100. Keep visible pores, forearm hair catching the daylight, and the fine knit texture where the sleeve gathers at the elbow.",
      },
      {
        framing: "threeQuarter",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits low in a pale linen armchair in a bright apartment living room beside a low walnut bookshelf, wearing a charcoal merino henley with the sleeves pushed to the forearm, dark indigo denim and a steel watch. One ankle is crossed over the opposite knee, one forearm lies along the arm of the chair and the other hand hangs off the far side, so his shoulders sit at different heights. His back is easy and he looks up to the lens with his lips just parted. The room runs five metres behind him, bookshelf and far wall soft and darker. A tall window filling the left edge of the frame lays broad soft daylight across him. A 3:4 three-quarter frame at seated eye level, iPhone 15 Pro, 24mm, f/1.8, 1/160, ISO 100. Keep visible pores, individual hairs at his hairline, and the slub weave of the linen under his forearm.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on the rolled arm of a pale linen armchair in a bright apartment living room beside a low walnut bookshelf, wearing a charcoal merino henley with the sleeves pushed to the forearm, dark indigo denim and a steel watch. He laughs with his eyes creased almost shut and his gaze dropping away from the lens to the rug in front of him. One hand has come up to cover his own mouth for a moment with the elbow tucked in, and his shoulders have risen with it. The room sits four metres behind him and stays soft. A tall window filling the left edge of the frame lays broad soft daylight across him. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/200, ISO 100. Keep the creases at the outer corners of the eyes, real pores across the cheeks, and the fine texture of the merino where it pulls at the shoulder.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Training, shot in daylight rather than the usual gym gloom. The model is
  // weak at warm dim interiors and strong at bright neutral light, so the room
  // is chosen for its glazing. Serves football too: a pitch would be a team
  // sport tag and the wrong status signal, and this is where that man trains.
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "gym-glass-wall-morning",
    title: "Training floor, morning",
    kind: "activity",
    register: "street",
    interests: ["gym", "boxing", "football"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on the training floor of a bright gym with a full-height glass wall and matte black racks, wearing a heather grey performance t-shirt, black training shorts and a steel watch. He has turned his head about thirty degrees toward the lens ahead of his shoulders, breathing through a parted mouth, and his eyes are on the lens. One hand is lifted to the towel draped over his own shoulder, gripping it near the collarbone, and the other hangs loose. The racks run four metres back behind him into soft dark shapes. Broad daylight through the glass wall fills his face evenly from the front and slightly above. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/320, ISO 200. Keep pore structure across the nose and forehead, the faint sheen of effort on the skin, and the stubble along his jaw.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on the training floor of a bright gym with a full-height glass wall and matte black racks, wearing a heather grey performance t-shirt, black training shorts and a steel watch. One hand is closed around the knurled end of a barbell resting in the rack beside him and the other rests on his own hip, which drops that shoulder lower. His chin is level and his gaze goes past the lens to one side, still counting the set. The racks carry on six metres behind him and lose detail. Broad daylight through the glass wall fills his face evenly from the front and slightly above. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/1.8, 1/320, ISO 200. Keep visible pores, the raised vein along the forearm, and the damp texture of the cotton across his chest.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on a flat black bench on the training floor of a bright gym with a full-height glass wall, wearing a heather grey performance t-shirt, black training shorts and a steel watch. He leans forward with one forearm braced across a knee and the other hand hanging between his legs, so his shoulders round and sit at different heights. He looks up to the lens with his brow slightly raised, still catching his breath. The racks run seven metres past him into soft shapes. Broad daylight through the glass wall fills his face evenly from the front and slightly above. A 4:3 three-quarter frame taken from standing height, iPhone 15 Pro, 24mm, f/1.8, 1/320, ISO 200. Keep visible pores, the texture of chalk dust on his palms, and the grain of the rubber flooring beneath the bench.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on the training floor of a bright gym with a full-height glass wall and matte black racks, wearing a heather grey performance t-shirt, black training shorts and a steel watch. He laughs with his head dropped a few degrees toward one shoulder, eyes narrowed to creases, his gaze going away from the lens across the room. One hand has come up to grip the back of his own neck with the elbow out, and his shoulders have risen with it. The racks sit five metres behind him in soft dark shapes. Broad daylight through the glass wall fills his face evenly from the front and slightly above. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/320, ISO 200. Keep the creases at the eye corners, real pore structure across the cheekbones, and the damp hair at his temple.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Status without a night scene. A hotel roof terrace at breakfast reads as a
  // man who travels well, and the light is the bright flat kind the model
  // handles best rather than the dim ambient of a bar.
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "roof-terrace-breakfast",
    title: "Roof terrace, breakfast",
    kind: "social",
    register: "sharp",
    interests: ["travel", "dining", "coffee"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands at the glass balustrade of a hotel roof terrace above a hazy city skyline under a flat bright morning sky, wearing an oatmeal linen shirt with the sleeves rolled to the forearm, stone cotton trousers, tan leather loafers and a steel watch. He has turned his head about thirty degrees toward the lens ahead of his shoulders, chin level, mouth closed with the corners lifted, and his eyes are on the lens. One hand rests along the top rail of the balustrade with the fingers curled over it, the other loose at his side. The skyline sits twelve metres beyond him, dissolved to soft pale bands. Broad morning daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/2.0, 1/800, ISO 64. Keep pore structure across the nose, the stubble along his jaw, and the open weave of the linen at his collar.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands at a small marble table on a hotel roof terrace above a hazy city skyline under a flat bright morning sky, wearing an oatmeal linen shirt with the sleeves rolled to the forearm, stone cotton trousers, tan leather loafers and a steel watch. One hand is around a small white espresso cup on the table and the other is flat on the marble beside it, taking a little of his weight so that shoulder sits lower. His chin is turned a few degrees and his gaze goes past the lens out over the roofline. The terrace runs six metres behind him to the balustrade. Broad morning daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/2.0, 1/800, ISO 64. Keep visible pores, forearm hair catching the daylight, and the creased texture of the linen at the rolled cuff.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits in a low rattan chair on a hotel roof terrace above a hazy city skyline under a flat bright morning sky, wearing an oatmeal linen shirt with the sleeves rolled to the forearm, stone cotton trousers, tan leather loafers and a steel watch. One ankle rests on the opposite knee, one forearm lies along the chair arm and the other hand hangs over the side, so his shoulders sit at different heights. He looks straight to the lens with his lips just parted. The skyline opens fourteen metres past him in soft pale bands. Broad morning daylight fills his face evenly from above and slightly in front. A 4:3 three-quarter frame taken from standing height looking slightly down, iPhone 15 Pro, 24mm, f/2.0, 1/800, ISO 64. Keep visible pores, individual hairs at his hairline, and the woven texture of the rattan under his forearm.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands at a small marble table on a hotel roof terrace above a hazy city skyline under a flat bright morning sky, wearing an oatmeal linen shirt with the sleeves rolled to the forearm, stone cotton trousers, tan leather loafers and a steel watch. He laughs with his head dropped toward one shoulder and his gaze falling away from the lens to the table, eyes creased almost shut. One hand grips the opposite forearm across his body and his shoulders have risen with the laugh. The terrace lies seven metres behind him under an open sky. Broad morning daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/2.0, 1/800, ISO 64. Keep the creases at the eye corners, real pore structure across the cheekbones, and the fine wrinkles the linen holds at the shoulder seam.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Clay is the reason this one is here: an unambiguous surface colour the model
  // renders consistently, and a court reads as a club rather than a park.
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "tennis-clay-court-morning",
    title: "Clay court, morning",
    kind: "activity",
    register: "casual",
    interests: ["tennis"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands at the baseline of a terracotta clay tennis court under a flat bright overcast sky, dark green hedging behind the fence, wearing a white cotton polo, cream shorts, white leather court shoes and a steel watch. He has turned his head about thirty degrees toward the lens ahead of his shoulders, mouth closed with one corner lifted, and his eyes are on the lens. One hand holds a racket by the throat with the head resting against his shoulder, the other hangs loose. The court runs eight metres back behind him into soft bands of clay and green. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/2.0, 1/1000, ISO 64. Keep pore structure across the nose, the damp hair at his temple, and the piqué texture of the polo at his collar.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands at the baseline of a terracotta clay tennis court under a flat bright overcast sky, dark green hedging behind the fence, wearing a white cotton polo, cream shorts, white leather court shoes and a steel watch. He has a ball held against the racket strings with one hand while the other grips the handle low, elbows soft, about to serve, and his weight has settled onto the back foot so one hip drops. His gaze goes past the lens down the length of the court. The far baseline sits eleven metres behind him and loses detail. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/2.0, 1/1000, ISO 64. Keep visible pores, clay dust dulling the toe of one shoe, and the raised texture of the racket grip tape under his fingers.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on a courtside bench beside a terracotta clay tennis court under a flat bright overcast sky, dark green hedging behind the fence, wearing a white cotton polo, cream shorts, white leather court shoes and a steel watch. He leans back with one arm laid along the bench rail and the other hand resting on his thigh, one ankle drawn in, so his shoulders sit at different heights. He looks straight to the lens with his chin level. The court opens nine metres past him in soft bands of clay and green. Broad overcast daylight fills his face evenly from above and slightly in front. A 4:3 three-quarter frame taken from standing height looking slightly down, iPhone 15 Pro, 24mm, f/2.0, 1/800, ISO 64. Keep visible pores, the fine clay grain across the bench slats, and sweat-darkened cotton at the collar.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands at the baseline of a terracotta clay tennis court under a flat bright overcast sky, dark green hedging behind the fence, wearing a white cotton polo, cream shorts, white leather court shoes and a steel watch. He laughs with his eyes creased almost shut and his gaze dropping away from the lens to the clay at his feet. One hand rests on top of the racket head planted against the ground and the other has come up to his own forehead, and his shoulders have risen with it. The court lies seven metres behind him in soft bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/2.0, 1/1000, ISO 64. Keep the creases at the eye corners, real pore structure across the cheekbones, and clay dust on the back of one hand.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // The quarter-zip is named to one referent. "Golf jumper" spans four garments
  // and shoot B proved the model will render all of them across one shoot.
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "golf-fairway-overcast",
    title: "Fairway, morning",
    kind: "activity",
    register: "sharp",
    interests: ["golf"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on the mown fairway of a links golf course under a flat bright overcast sky, low dunes and marram grass behind him, wearing a navy merino quarter-zip over a white collared shirt, stone tailored trousers, brown leather golf shoes and a steel watch. He has turned his head about thirty degrees toward the lens ahead of his shoulders, chin level, mouth closed with the corners lifted, and his eyes are on the lens. One hand rests on the grip of a club planted head-down in the turf beside him, the other loose at his side. The fairway runs fifteen metres back behind him into soft green bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/2.0, 1/800, ISO 64. Keep pore structure across the nose, wind-lifted hair at the crown, and the fine rib of the merino at his collar.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on the mown fairway of a links golf course under a flat bright overcast sky, low dunes and marram grass behind him, wearing a navy merino quarter-zip over a white collared shirt, stone tailored trousers, brown leather golf shoes and a steel watch. He holds a club across his body with one hand at the grip and the other at the shaft, checking the face, and his weight has settled onto one leg so that hip drops lower. His gaze goes past the lens down the line of the hole. The dunes sit eighteen metres behind him and lose detail. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/2.0, 1/800, ISO 64. Keep visible pores, the leather grain of the glove tucked at his waistband, and dew darkening the toe of one shoe.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He crouches on one knee on the mown fairway of a links golf course under a flat bright overcast sky, low dunes and marram grass behind him, wearing a navy merino quarter-zip over a white collared shirt, stone tailored trousers, brown leather golf shoes and a steel watch. One forearm rests across the raised knee with the hand hanging loose, the other palm is flat on the turf beside him, so his shoulders sit at different heights. He looks up to the lens with his brow slightly raised. The fairway opens sixteen metres past him in soft green bands. A 4:3 three-quarter frame taken from standing height looking down at him, iPhone 15 Pro, 24mm, f/2.0, 1/800, ISO 64. Broad overcast daylight fills his face evenly from above and slightly in front. Keep visible pores, the cut grass clinging to his trouser cuff, and skin that holds its own grain in the flat light.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on the mown fairway of a links golf course under a flat bright overcast sky, low dunes and marram grass behind him, wearing a navy merino quarter-zip over a white collared shirt, stone tailored trousers, brown leather golf shoes and a steel watch. He laughs with his head dropped toward one shoulder and his gaze falling away from the lens to the turf, eyes narrowed to creases. One hand has come up to shield his own eyes with the elbow high and the other holds a club loosely at his side, and his shoulders have risen with the laugh. The dunes lie fourteen metres behind him in soft bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/2.0, 1/800, ISO 64. Keep the creases at the eye corners, real pore structure across the cheekbones, and wind-lifted hair at the temple.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Coast path rather than forest: open sky keeps the light flat and even, and
  // a treeline is where the model started inventing dappled sun.
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "coast-path-hike-overcast",
    title: "Coast path, morning",
    kind: "outdoors",
    register: "casual",
    interests: ["hiking", "running"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on a grass coast path along the top of a headland under a flat bright overcast sky, open sea and low cliffs beyond, wearing a slate blue softshell jacket over a charcoal marl long-sleeve, dark trekking trousers, brown leather walking boots and a steel watch. He has turned his head about thirty degrees toward the lens ahead of his shoulders, mouth closed with the corners lifted, and his eyes are on the lens. One hand is hooked under the shoulder strap of his pack at the chest, the other hangs loose. The headland runs twelve metres back behind him into soft grey-green bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/2.0, 1/800, ISO 64. Keep pore structure across the nose, wind-lifted hair at the temple, and the ripstop texture of the jacket at his shoulder.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on a grass coast path along the top of a headland under a flat bright overcast sky, open sea and low cliffs beyond, wearing a slate blue softshell jacket over a charcoal marl long-sleeve, dark trekking trousers, brown leather walking boots and a steel watch. Both hands work at the sternum strap of his pack, one holding the webbing taut while the other pulls the buckle, and his weight has settled onto one leg so that hip drops. His gaze goes past the lens along the path ahead. The sea opens twenty metres beyond him in flat grey. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/2.0, 1/800, ISO 64. Keep visible pores, the frayed weave of the webbing under his fingers, and salt haze softening the far cliffs.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on a flat rock at the edge of a grass coast path on a headland under a flat bright overcast sky, open sea and low cliffs beyond, wearing a slate blue softshell jacket over a charcoal marl long-sleeve, dark trekking trousers, brown leather walking boots and a steel watch. One forearm rests across a raised knee with the hand hanging loose and the other palm is flat on the rock beside his hip, so his shoulders sit at different heights. He looks straight to the lens with his chin level. The headland opens eighteen metres past him in soft grey-green bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 4:3 three-quarter frame taken from standing height looking slightly down, iPhone 15 Pro, 24mm, f/2.0, 1/800, ISO 64. Keep visible pores, the scuffed grain of the boot leather, and lichen texture on the rock beneath his palm.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on a grass coast path along the top of a headland under a flat bright overcast sky, open sea and low cliffs beyond, wearing a slate blue softshell jacket over a charcoal marl long-sleeve, dark trekking trousers, brown leather walking boots and a steel watch. He laughs with his head dropped toward one shoulder and his gaze falling away from the lens to the grass, eyes narrowed to creases. One hand has come up to push the wind-blown hair off his own forehead and the other grips the pack strap at his chest, and his shoulders have risen with the laugh. The headland lies ten metres behind him in soft bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/2.0, 1/800, ISO 64. Keep the creases at the eye corners, real pore structure across the cheekbones, and the wind-reddened skin at the tip of his ear.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Bouldering, so the wall is close behind him and the frame stays tight. A
  // roped route puts him at distance, and distance is where identity drifts.
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "climbing-gym-daylight",
    title: "Bouldering wall, afternoon",
    kind: "activity",
    register: "street",
    interests: ["climbing", "gym"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands at the base of a plywood bouldering wall set with coloured resin holds in a bright climbing gym, wearing a faded olive cotton t-shirt, dark grey climbing trousers and a steel watch. He has turned his head about thirty degrees toward the lens ahead of his shoulders, mouth closed with one corner lifted, and his eyes are on the lens. One hand is raised to a hold at head height with the fingers crimped over it, the other hangs loose with chalk still on the knuckles. The wall carries five metres back behind him into soft shapes. Broad daylight from a high clerestory window fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 200. Keep pore structure across the nose, chalk dust caught in the creases of his fingers, and the stubble along his jaw.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands at the base of a plywood bouldering wall set with coloured resin holds in a bright climbing gym, wearing a faded olive cotton t-shirt, dark grey climbing trousers and a steel watch. One hand is deep in the chalk bag at his hip and the other hangs shaking out at his side, and his weight has settled onto one leg so that hip drops lower. He tips his chin up and his gaze goes past the lens to the top of the wall, reading the line. The wall runs six metres behind him and loses detail. Broad daylight from a high clerestory window fills his face evenly from above and slightly in front. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 200. Keep visible pores, the raised veins along the forearm, and the worn cotton texture across his chest.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on the thick matting at the base of a plywood bouldering wall in a bright climbing gym, wearing a faded olive cotton t-shirt, dark grey climbing trousers and a steel watch. He leans back on one straightened arm with the palm flat on the mat and rests the other forearm across a raised knee, so his shoulders sit at clearly different heights. He looks up to the lens with his brow slightly raised. The wall rises seven metres past him in soft shapes of plywood and resin. Broad daylight from a high clerestory window fills his face evenly from above and slightly in front. A 4:3 three-quarter frame taken from standing height looking down at him, iPhone 15 Pro, 24mm, f/1.8, 1/200, ISO 200. Keep visible pores, chalk smeared across one thigh, and the rubber grain of the climbing shoes beside him.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands at the base of a plywood bouldering wall set with coloured resin holds in a bright climbing gym, wearing a faded olive cotton t-shirt, dark grey climbing trousers and a steel watch. He laughs with his eyes creased almost shut and his gaze dropping away from the lens to the matting, having come off the wall. One hand is clapped against the back of his own head with the elbow out and the other hangs loose, and his shoulders have risen with it. The wall sits four metres behind him in soft shapes. Broad daylight from a high clerestory window fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 200. Keep the creases at the eye corners, real pore structure across the cheekbones, and chalk white against the skin of his palm.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // The guitar is held rather than played in three of four frames: hands on
  // strings mid-chord is where finger anatomy fails.
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "home-studio-guitar-evening",
    title: "At home with the guitar",
    kind: "home",
    register: "casual",
    interests: ["music", "reading"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on the edge of a bed in a bright apartment bedroom with a plain plaster wall behind him, wearing a washed black cotton t-shirt, faded indigo denim and a steel watch. He has turned his head about thirty degrees toward the lens ahead of his shoulders, mouth closed with one corner lifted, and his eyes are on the lens. One hand rests over the upper bout of an acoustic guitar standing on his knee, fingers spread on the wood, the other loose at his side. The wall sits three metres back behind him in soft even tone. A tall window filling the left edge of the frame lays broad soft daylight across him. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/160, ISO 200. Keep pore structure across the nose, the stubble along his jaw, and the grain of the spruce top under his hand.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on the edge of a bed in a bright apartment bedroom with a plain plaster wall behind him, wearing a washed black cotton t-shirt, faded indigo denim and a steel watch. An acoustic guitar rests across his thigh with one hand curled loosely around the neck near the headstock and the other forearm laid over the body, so one shoulder sits lower than the other. His head is bowed a few degrees and his gaze goes past the lens down to the strings. The room carries four metres behind him, the far corner soft and a stop darker. A tall window filling the left edge of the frame lays broad soft daylight across him. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/160, ISO 200. Keep visible pores, the ridged texture of the wound strings under his fingers, and forearm hair catching the daylight.",
      },
      {
        framing: "threeQuarter",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on the floor with his back against the bed in a bright apartment bedroom with a plain plaster wall behind him, wearing a washed black cotton t-shirt, faded indigo denim and a steel watch. One knee is drawn up with a forearm draped across it and the other leg is stretched out, the free hand flat on the floorboards beside his hip, so his shoulders sit at different heights. He looks up to the lens with his lips just parted. The room runs five metres past him, the far wall soft and darker. A tall window filling the left edge of the frame lays broad soft daylight across him. A 3:4 three-quarter frame taken from standing height looking down at him, iPhone 15 Pro, 24mm, f/1.8, 1/125, ISO 200. Keep visible pores, individual hairs at his hairline, and the worn grain of the floorboards under his palm.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on the edge of a bed in a bright apartment bedroom with a plain plaster wall behind him, wearing a washed black cotton t-shirt, faded indigo denim and a steel watch. He laughs with his eyes creased almost shut and his gaze dropping away from the lens to the guitar across his lap, having lost the chord. One hand is flat against his own forehead with the elbow out and the other steadies the guitar neck, and his shoulders have risen with it. The wall sits three metres behind him in soft even tone. A tall window filling the left edge of the frame lays broad soft daylight across him. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/160, ISO 200. Keep the creases at the outer corners of the eyes, real pores across the cheeks, and the soft nap of the washed cotton at his shoulder.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // A gallery without wall text: labels, captions and titles render as gibberish
  // writing, so the room is described by its architecture and one large canvas.
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "gallery-atrium-daylight",
    title: "Gallery, afternoon",
    kind: "social",
    register: "sharp",
    interests: ["art", "travel"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in the tall pale atrium of a modern art gallery with a wide abstract canvas of muted colour on the far wall, wearing a black wool crewneck jumper, slate grey tailored trousers, black leather derbies and a steel watch. He has turned his head about thirty degrees toward the lens ahead of his shoulders, chin level, mouth closed with the corners lifted, and his eyes are on the lens. One hand is pushed into a trouser pocket to the knuckle and the other rests at his side. The atrium runs eight metres back behind him into soft pale planes. Broad daylight from the glazed roof fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/200, ISO 100. Keep pore structure across the nose, the stubble along his jaw, and the fine wool nap at his shoulder.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in the tall pale atrium of a modern art gallery with a wide abstract canvas of muted colour on the far wall, wearing a black wool crewneck jumper, slate grey tailored trousers, black leather derbies and a steel watch. He has stopped with one hand cupping his own elbow across his body and the other hand at his chin, two fingers along the jaw, and his weight has settled onto one leg so that hip drops lower. His head is turned away and his gaze goes past the lens to the canvas. The atrium carries ten metres behind him in soft pale planes. Broad daylight from the glazed roof fills his face evenly from above and slightly in front. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/1.8, 1/200, ISO 100. Keep visible pores, the knit texture of the crewneck at the cuff, and the matte grain of the polished concrete floor.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on a long pale bench in the tall atrium of a modern art gallery with a wide abstract canvas of muted colour on the far wall, wearing a black wool crewneck jumper, slate grey tailored trousers, black leather derbies and a steel watch. He leans forward with both forearms crossed over one raised knee, one hand hanging and the other tucked under the opposite arm, so his shoulders round and sit at different heights. He looks straight to the lens with his chin slightly down. The atrium opens twelve metres past him in soft pale planes. Broad daylight from the glazed roof fills his face evenly from above and slightly in front. A 4:3 three-quarter frame taken from standing height looking slightly down, iPhone 15 Pro, 24mm, f/1.8, 1/160, ISO 100. Keep visible pores, individual hairs at his hairline, and the grain of the bench timber under his shoe.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in the tall pale atrium of a modern art gallery with a wide abstract canvas of muted colour on the far wall, wearing a black wool crewneck jumper, slate grey tailored trousers, black leather derbies and a steel watch. He laughs with his head dropped a few degrees toward one shoulder, eyes creased almost shut, his gaze going away from the lens across the room. One hand has come up to rest flat against his own chest and the other stays in a trouser pocket, and his shoulders have risen with it. The atrium sits seven metres behind him in soft pale planes. Broad daylight from the glazed roof fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/200, ISO 100. Keep crow's feet, real pore structure across the cheekbones, and the fine wool texture where the jumper pulls at the shoulder.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // The roller door is the light source and the reason this works: a closed
  // workshop is warm dim tungsten, which is where the mannequin faces came from.
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "garage-motorcycle-daylight",
    title: "Garage, afternoon",
    kind: "activity",
    register: "street",
    interests: ["motorcycles"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in a concrete-floored garage beside a matte black cafe racer motorcycle with the roller door rolled fully open, wearing a dark brown waxed cotton jacket over a white cotton t-shirt, black selvedge denim, brown leather boots and a steel watch. He has turned his head about thirty degrees toward the lens ahead of his shoulders, mouth closed with one corner lifted, and his eyes are on the lens. One hand rests on the seat of the bike with the fingers spread, the other holds a folded rag at his side. The garage runs four metres back behind him into soft dark shapes. Broad daylight through the open roller door fills his face evenly from the front and slightly above. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 200. Keep pore structure across the nose, the stubble along his jaw, and a trace of oil in the creases of one knuckle.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He crouches beside a matte black cafe racer motorcycle in a concrete-floored garage with the roller door rolled fully open, wearing a dark brown waxed cotton jacket over a white cotton t-shirt, black selvedge denim, brown leather boots and a steel watch. One hand steadies the frame rail of the bike while the other turns a small spanner at the engine casing, and his weight is on one heel so that shoulder drops lower. His head is bowed and his gaze goes past the lens to the work in his hands. The garage carries five metres behind him into soft dark shapes. Broad daylight through the open roller door fills his face evenly from the front and slightly above. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 200. Keep visible pores, the raised tendons on the back of the working hand, and the waxed cotton's dull creased sheen at his elbow.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on an upturned crate beside a matte black cafe racer motorcycle in a concrete-floored garage with the roller door rolled fully open, wearing a dark brown waxed cotton jacket over a white cotton t-shirt, black selvedge denim, brown leather boots and a steel watch. One forearm rests across a raised knee with a rag hanging from the fingers and the other palm is flat on the crate beside his hip, so his shoulders sit at different heights. He looks up to the lens with his brow slightly raised. The open doorway sits six metres past him in soft pale light. Broad daylight through the open roller door fills his face evenly from the front and slightly above. A 4:3 three-quarter frame taken from standing height looking down at him, iPhone 15 Pro, 24mm, f/1.8, 1/200, ISO 200. Keep visible pores, the scuffed grain of the boot leather, and oil-darkened texture across the rag.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in a concrete-floored garage beside a matte black cafe racer motorcycle with the roller door rolled fully open, wearing a dark brown waxed cotton jacket over a white cotton t-shirt, black selvedge denim, brown leather boots and a steel watch. He laughs with his head dropped toward one shoulder and his gaze falling away from the lens to the floor, eyes narrowed to creases. One hand is braced on the bike seat and the other has come up to wipe the back of his wrist across his own brow, and his shoulders have risen with the laugh. The garage lies four metres behind him in soft dark shapes. Broad daylight through the open roller door fills his face evenly from the front and slightly above. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 200. Keep the creases at the eye corners, real pore structure across the cheekbones, and a smear of grease along one forearm.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Board carried, never ridden. Water is the one place the model cannot hold a
  // face, so the whole shoot happens on the sand with the sea behind him.
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "beach-after-surf-overcast",
    title: "Beach, after the surf",
    kind: "outdoors",
    register: "casual",
    interests: ["surfing", "running"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on wet sand at the top of a wide empty beach under a flat bright overcast sky, low grey surf breaking behind him, wearing a heavyweight ecru cotton hoodie over navy board shorts and a steel watch, feet bare. He has turned his head about thirty degrees toward the lens ahead of his shoulders, mouth closed with the corners lifted, and his eyes are on the lens. One hand is raised to push his soaked hair back off his forehead, fingers spread through it, and the other hangs loose. The surf runs fifteen metres back behind him into soft grey bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/2.0, 1/1000, ISO 64. Keep pore structure across the nose, salt water beaded on the skin of his temple, and the loop-back texture of the hoodie at his collar.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on wet sand at the top of a wide empty beach under a flat bright overcast sky, low grey surf breaking behind him, wearing a heavyweight ecru cotton hoodie over navy board shorts and a steel watch, feet bare. A pale surfboard is tucked under one arm with that hand gripping the rail, and the other hand rests on his own hip, which drops that shoulder lower. His chin is level and his gaze goes past the lens back out to the water. The surf carries eighteen metres behind him and loses detail. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/2.0, 1/1000, ISO 64. Keep visible pores, sand dried pale across one forearm, and the waxed texture of the board deck under his fingers.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on the dry sand at the top of a wide empty beach under a flat bright overcast sky, low grey surf breaking beyond, wearing a heavyweight ecru cotton hoodie over navy board shorts and a steel watch, feet bare. One knee is drawn up with a forearm draped over it and the other leg is stretched out, the free hand pressed flat into the sand beside his hip, so his shoulders sit at different heights. He looks straight to the lens with his chin level. The surf opens twenty metres past him in soft grey bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 4:3 three-quarter frame taken from standing height looking down at him, iPhone 15 Pro, 24mm, f/2.0, 1/1000, ISO 64. Keep visible pores, sand grains clinging to the side of one calf, and the heavy ribbed cuff of the hoodie at his wrist.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on wet sand at the top of a wide empty beach under a flat bright overcast sky, low grey surf breaking behind him, wearing a heavyweight ecru cotton hoodie over navy board shorts and a steel watch, feet bare. He laughs with his eyes narrowed to creases and his gaze dropping away from the lens to the sand, still catching his breath from the water. One hand grips the opposite forearm across his body and his shoulders have risen with the laugh. The surf lies twelve metres behind him in soft grey bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/2.0, 1/1000, ISO 64. Keep the creases at the eye corners, real pore structure across the cheekbones, and wet hair standing where his fingers left it.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Snow under overcast is the brightest, flattest light available anywhere in
  // the library. Bare head throughout: a helmet takes the hair, and the hair is
  // half of what makes a reference face recognisable.
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "mountain-terrace-snow",
    title: "Mountain terrace, midday",
    kind: "outdoors",
    register: "sharp",
    interests: ["skiing", "travel"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on the timber sun terrace of an alpine restaurant under a flat bright overcast sky, snow-covered peaks beyond the rail, wearing a black technical ski jacket unzipped over a charcoal merino roll-neck, black ski trousers and a steel watch. He has turned his head about thirty degrees toward the lens ahead of his shoulders, chin level, mouth closed with the corners lifted, and his eyes are on the lens. One hand rests on the timber rail with the fingers curled over it, the other holds a pair of goggles loose at his side. The peaks sit forty metres beyond him, dissolved to soft white bands. Broad overcast daylight fills his face evenly from above and slightly in front, bounced back off the snow. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/2.0, 1/1250, ISO 64. Keep pore structure across the nose, the wind-reddened skin at his cheekbones, and the fine rib of the roll-neck at his throat.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands at the timber rail of an alpine restaurant sun terrace under a flat bright overcast sky, snow-covered peaks beyond, wearing a black technical ski jacket unzipped over a charcoal merino roll-neck, black ski trousers and a steel watch. Both forearms are folded along the top of the rail with one hand loosely over the other wrist, and his weight has settled onto one leg so that hip drops lower. His head is turned away and his gaze goes past the lens down the valley. The peaks carry fifty metres beyond him in soft white bands. Broad overcast daylight fills his face evenly from above and slightly in front, bounced back off the snow. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/2.0, 1/1250, ISO 64. Keep visible pores, the matte technical texture of the jacket sleeve, and melted snow beaded along the rail under his forearm.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits at a timber table on the sun terrace of an alpine restaurant under a flat bright overcast sky, snow-covered peaks beyond the rail, wearing a black technical ski jacket unzipped over a charcoal merino roll-neck, black ski trousers and a steel watch. He is turned side-on in the chair with one arm hooked over its back and the other hand around a mug on the table, so his shoulders sit at clearly different heights. He looks straight to the lens with his lips just parted. The peaks open forty-five metres past him in soft white bands. Broad overcast daylight fills his face evenly from above and slightly in front, bounced back off the snow. A 4:3 three-quarter frame taken from standing height looking slightly down, iPhone 15 Pro, 24mm, f/2.0, 1/1000, ISO 64. Keep visible pores, the weathered grain of the timber under his elbow, and steam texture lifting off the mug.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on the timber sun terrace of an alpine restaurant under a flat bright overcast sky, snow-covered peaks beyond the rail, wearing a black technical ski jacket unzipped over a charcoal merino roll-neck, black ski trousers and a steel watch. He laughs with his head dropped toward one shoulder and his gaze falling away from the lens to the decking, eyes creased almost shut. One hand has come up to the back of his own neck with the elbow out and the other rests on the rail, and his shoulders have risen with the laugh. The peaks lie thirty-five metres beyond him in soft white bands. Broad overcast daylight fills his face evenly from above and slightly in front, bounced back off the snow. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/2.0, 1/1250, ISO 64. Keep the creases at the eye corners, real pore structure across the cheekbones, and the cold flush across the bridge of his nose.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Carries the dog tag, so the whole shoot drops for anyone who excluded dogs.
  // Nothing here is separable: the animal is in three of the four frames and the
  // fourth is about having just let go of the lead.
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "park-with-the-dog-morning",
    title: "Park, early morning",
    kind: "outdoors",
    register: "casual",
    interests: ["dogs", "running"],
    tags: ["dog"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on a wide mown lawn in a city park under a flat bright overcast sky, bare plane trees along the far edge, wearing a rust brown corduroy overshirt over a cream waffle-knit long-sleeve, dark denim, brown leather boots and a steel watch. He has turned his head about thirty degrees toward the lens ahead of his shoulders, mouth closed with one corner lifted, and his eyes are on the lens. One hand holds a rolled leather lead against his chest and the other hangs loose. The lawn runs twenty metres back behind him into soft green bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/2.0, 1/640, ISO 64. Keep pore structure across the nose, the stubble along his jaw, and the wide wale of the corduroy at his shoulder.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on a wide mown lawn in a city park under a flat bright overcast sky, bare plane trees along the far edge, wearing a rust brown corduroy overshirt over a cream waffle-knit long-sleeve, dark denim, brown leather boots and a steel watch. A tan retriever leans against his leg and he has one hand down in its ruff, scratching, while the other holds the coiled lead, so one shoulder drops lower. His head is bowed a few degrees and his gaze goes past the lens down to the dog. The lawn carries twenty-five metres behind him and loses detail. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/2.0, 1/640, ISO 64. Keep visible pores, individual coarse hairs in the dog's coat under his fingers, and the worn nap of the corduroy at his cuff.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He crouches on the mown lawn of a city park under a flat bright overcast sky, bare plane trees along the far edge, wearing a rust brown corduroy overshirt over a cream waffle-knit long-sleeve, dark denim, brown leather boots and a steel watch. He is down on one knee with a tan retriever standing at his side, one forearm across the raised knee and the other hand flat on the grass, so his shoulders sit at different heights. He looks up to the lens with his brow slightly raised. The lawn opens thirty metres past him in soft green bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 4:3 three-quarter frame taken from standing height looking down at him, iPhone 15 Pro, 24mm, f/2.0, 1/640, ISO 64. Keep visible pores, dew darkening the knee of his denim, and the scuffed grain of the boot leather.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on a wide mown lawn in a city park under a flat bright overcast sky, bare plane trees along the far edge, wearing a rust brown corduroy overshirt over a cream waffle-knit long-sleeve, dark denim, brown leather boots and a steel watch. He laughs with his eyes creased almost shut and his gaze dropping away from the lens to the grass, a tan retriever bounding past his knee. One hand is thrown out for balance and the other still holds the lead, and his shoulders have risen with the laugh. The lawn lies eighteen metres behind him in soft green bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/2.0, 1/640, ISO 64. Keep the creases at the eye corners, real pore structure across the cheekbones, and hair lifted at the crown by the movement.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Carries the alcohol tag. Late afternoon rather than night: the model renders
  // warm dim tungsten as mannequin skin, and a window at five o'clock gives the
  // same social read with light it can actually hold.
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "wine-bar-late-afternoon",
    title: "Wine bar, late afternoon",
    kind: "social",
    register: "sharp",
    interests: ["dining", "nightlife"],
    tags: ["alcohol"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits at the marble counter of a bright wine bar with pale timber shelving behind it, wearing a deep green corduroy shirt buttoned to the second button, dark charcoal trousers, black leather boots and a steel watch. He has turned his head about thirty degrees toward the lens ahead of his shoulders, chin level, mouth closed with the corners lifted, and his eyes are on the lens. One hand rests on the counter with the fingers loosely around the stem of a glass, the other is down at his knee. The bar runs five metres back behind him, reduced to soft pale shapes. A tall window filling the left edge of the frame lays broad soft daylight across him. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/160, ISO 200. Keep pore structure across the nose, the stubble along his jaw, and the fine wale of the corduroy at his collar.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits at the marble counter of a bright wine bar with pale timber shelving behind it, wearing a deep green corduroy shirt buttoned to the second button, dark charcoal trousers, black leather boots and a steel watch. One forearm is laid along the marble with the hand turning a glass slowly by its base, and the other elbow is up on the counter with the knuckles against his own cheek, so his shoulders sit at different heights. His head is turned away and his gaze goes past the lens along the counter. The bar carries six metres behind him in soft pale shapes. A tall window filling the left edge of the frame lays broad soft daylight across him. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/1.8, 1/160, ISO 200. Keep visible pores, forearm hair catching the daylight, and the cool grain of the marble under his wrist.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits side-on at a small round table in a bright wine bar with pale timber shelving behind it, wearing a deep green corduroy shirt buttoned to the second button, dark charcoal trousers, black leather boots and a steel watch. One arm is hooked over the back of the bentwood chair and the other hand rests on the table beside a glass, one ankle crossed over the opposite knee, so his shoulders sit at clearly different heights. He looks straight to the lens with his chin slightly down. The bar opens seven metres past him in soft pale shapes. A tall window filling the left edge of the frame lays broad soft daylight across him. A 4:3 three-quarter frame at seated eye level, iPhone 15 Pro, 24mm, f/1.8, 1/125, ISO 200. Keep visible pores, individual hairs at his hairline, and the bentwood's polished grain under his forearm.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits at the marble counter of a bright wine bar with pale timber shelving behind it, wearing a deep green corduroy shirt buttoned to the second button, dark charcoal trousers, black leather boots and a steel watch. He laughs with his head dropped a few degrees toward one shoulder, eyes creased almost shut, his gaze going away from the lens along the counter. One hand has come up to rest flat against his own chest and the other stays around the glass, and his shoulders have risen with it. The bar sits four metres behind him in soft pale shapes. A tall window filling the left edge of the frame lays broad soft daylight across him. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/160, ISO 200. Keep crow's feet, real pore structure across the cheekbones, and the corduroy's texture where it pulls at the shoulder.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Carries the bicycle tag. He is always beside or astride a stationary bike,
  // never riding: a moving rider means a blurred face and a leg geometry the
  // model gets wrong more often than it gets right.
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "reservoir-road-ride-overcast",
    title: "Reservoir road, morning",
    kind: "activity",
    register: "street",
    interests: ["cycling", "running"],
    tags: ["bicycle"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on a quiet tarmac lane above a reservoir under a flat bright overcast sky, open water and bare hills beyond, wearing a black long-sleeve cycling jersey under a slate grey gilet, black bib shorts and a steel watch. He has turned his head about thirty degrees toward the lens ahead of his shoulders, breathing through a parted mouth, and his eyes are on the lens. One hand rests on the top of the handlebar of a road bike held upright beside him, the other is lifted to unzip the gilet at his throat. The lane runs fifteen metres back behind him into soft grey bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/2.0, 1/800, ISO 64. Keep pore structure across the nose, sweat at his temple, and the flat matte weave of the jersey at his collar.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands astride a stationary road bike on a quiet tarmac lane above a reservoir under a flat bright overcast sky, open water and bare hills beyond, wearing a black long-sleeve cycling jersey under a slate grey gilet, black bib shorts and a steel watch. Both feet are down and one hand is on the bar hood while the other holds a bottle at his hip, his weight settled onto one leg so that hip drops. His chin is level and his gaze goes past the lens up the road. The reservoir opens thirty metres beyond him in flat grey. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/2.0, 1/800, ISO 64. Keep visible pores, the raised veins along the forearm, and road grit dulling the bike's down tube.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on a low drystone wall beside a quiet tarmac lane above a reservoir under a flat bright overcast sky, a road bike leaning against the wall beside him, wearing a black long-sleeve cycling jersey under a slate grey gilet, black bib shorts and a steel watch. One forearm rests across a raised knee with the hand hanging loose and the other palm is flat on the stone beside his hip, so his shoulders sit at different heights. He looks up to the lens with his brow slightly raised. The reservoir opens twenty-five metres past him in soft grey bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 4:3 three-quarter frame taken from standing height looking slightly down, iPhone 15 Pro, 24mm, f/2.0, 1/800, ISO 64. Keep visible pores, the lichen texture of the drystone under his palm, and tan lines at his forearm.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on a quiet tarmac lane above a reservoir under a flat bright overcast sky, open water and bare hills beyond, wearing a black long-sleeve cycling jersey under a slate grey gilet, black bib shorts and a steel watch. He laughs with his head dropped toward one shoulder and his gaze falling away from the lens to the tarmac, eyes narrowed to creases, still short of breath. One hand is braced on the handlebar of a road bike beside him and the other has come up to his own chest, and his shoulders have risen with the laugh. The lane lies twelve metres behind him in soft grey bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/2.0, 1/800, ISO 64. Keep the creases at the eye corners, real pore structure across the cheekbones, and damp hair pushed back off the forehead.",
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
