import { FRAMES_PER_SHOOT, type ExcludableTag, type InterestId, type StylePref } from "./types";
import {
  SHOOT_CATALOG,
  type ShootCatalogMetadata,
} from "./shoot-catalog";

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

type ShootDefinition = {
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

/** A selectable shoot plus the human-reviewed meaning used by diversity rules. */
export type Shoot = ShootDefinition & ShootCatalogMetadata;

const PORTRAIT_3_4 = { width: 1728, height: 2304 } as const;
const LANDSCAPE_4_3 = { width: 2304, height: 1728 } as const;

const SHOOT_DEFINITIONS: readonly ShootDefinition[] = [
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

  // ───────────────────────────────────────────────────────────────────────────
  // The nine below were drafted by an LLM against the rules in
  // lib/dating/authoring/rules.ts and every one of them passed. They are kept
  // because they are good and because they were expensive; the generator that
  // wrote them is gone. Everything after this point is hand-written again.
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "deli-counter-morning",
    title: "Deli counter, morning",
    kind: "home",
    register: "casual",
    interests: ["cooking","dining"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands at a bright neighbourhood deli counter, wearing a navy blue fine-knit cotton crewneck jumper, tan chino trousers and a steel watch. He has turned his head about twenty-five degrees toward the lens having just looked up from the timber counter, so the turn shows in his neck. His eyes are on the lens with a faint smile. One hand rests on the edge of the timber counter and the other hand hangs at his side, so one shoulder sits lower than the other. The room falls away four metres behind him into soft pale shapes. A large window filling the right edge of the frame lays broad soft daylight across him. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 100. Keep pore structure across the nose, the faint shadow of stubble along the jaw, and the soft weave of the navy cotton jumper.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands at a bright neighbourhood deli counter, wearing a navy blue fine-knit cotton crewneck jumper, tan chino trousers and a steel watch. He looks past the lens about fifteen degrees as if deciding on a choice from the display. One hand hovers just above the timber counter and the other hand rests on one hip, so that shoulder sits higher than the other. The space behind him stretches five metres and stays soft. A large window filling the right edge of the frame lays broad soft daylight across him. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 100. Keep visible pores, the fine grain of the skin, and the crisp edge of the watch face.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He leans against a bright neighbourhood deli counter, wearing a navy blue fine-knit cotton crewneck jumper, tan chino trousers and a steel watch. He looks straight to the lens with an easy expression while waiting for his selection to be wrapped. One hand is flat on the surface of the timber counter and the other hand holds a small brown paper bag, with the weight shifted so one shoulder is lower. The shop interior goes six metres back and is very soft. A large window filling the right edge of the frame lays broad soft daylight across him. A 4:3 three-quarter frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/200, ISO 100. Keep skin pores, the matte texture of the brown paper bag, and the weave of the tan chino trousers.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands at a bright neighbourhood deli counter, wearing a navy blue fine-knit cotton crewneck jumper, tan chino trousers and a steel watch. He laughs with his eyes narrowing and his gaze dropping past the lens as if reacting to a joke. One hand holds a small brown paper bag while the other hand is raised to touch the back of his neck, with that shoulder lifted about ten degrees. The background is four metres away and soft. A large window filling the right edge of the frame lays broad soft daylight across him. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 100. Keep the creases at the outer corners of the eyes, real pores across the cheeks, and the soft tension in the jumper where the arm is raised.",
      },
    ],
  },

  {
    id: "window-seat-reading-afternoon",
    title: "Window seat, afternoon",
    kind: "home",
    register: "casual",
    interests: ["reading","coffee"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on a deep oak window seat built into a plain white plaster wall wearing a navy lambswool crewneck jumper, light grey brushed cotton trousers and a steel watch. He has turned his head about twenty-five degrees toward the lens so the muscles of his neck are slightly visible, and his eyes are on the lens. One hand rests flat on the oak seat and the other is curled around the base of a stoneware mug, with one shoulder held slightly higher than the other. The room extends four metres behind him into soft dark shapes. A large window filling the right edge of the frame lays broad soft daylight across him. A 3:4 close frame from the chest up, iPhone 15 Pro, 35mm, f/1.8, 1/200, ISO 100. Keep visible pore structure on the cheeks, the fine fuzzy texture of the lambswool, and the metallic sheen of the watch face.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on a deep oak window seat built into a plain white plaster wall wearing a navy lambswool crewneck jumper, light grey brushed cotton trousers and a steel watch. His face is turned about ten degrees away from the lens as he looks out toward the daylight, having just set his mug down. One hand rests on the edge of the oak seat and the other is wrapped around the stoneware mug, so one shoulder sits lower than the other. The background is five metres deep and entirely soft. A large window filling the right edge of the frame lays broad soft daylight across him. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/160, ISO 100. Keep the faint shadow of stubble along the jawline, the weave of the cotton trousers at the thigh, and the grain of the oak wood.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on a deep oak window seat built into a plain white plaster wall wearing a navy lambswool crewneck jumper, light grey brushed cotton trousers and a steel watch. He looks up to the lens with his head tilted about five degrees, pausing his movement. One foot is tucked up onto the seat, one hand is resting on his raised knee and the other hand is flat on the timber beside his hip. The room falls away six metres behind him into soft pale bands. A large window filling the right edge of the frame lays broad soft daylight across him. A 4:3 three-quarter frame, iPhone 15 Pro, 24mm, f/2.0, 1/125, ISO 100. Keep individual hairs at the brow, the soft texture of the lambswool at the shoulder, and the crease of the trousers at the knee.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on a deep oak window seat built into a plain white plaster wall wearing a navy lambswool crewneck jumper, light grey brushed cotton trousers and a steel watch. He is laughing with his head turned about fifteen degrees and his gaze dropping away from the lens toward the floor. One hand has come up to touch his own collarbone with the fingers slightly spread, and the other hand remains wrapped around the stoneware mug. The room behind him is four metres deep and soft. A large window filling the right edge of the frame lays broad soft daylight across him. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/200, ISO 100. Keep the deep creases at the corners of the eyes, the matte texture of the stoneware mug, and the visible pores across the bridge of the nose.",
      },
    ],
  },

  {
    id: "stone-bridge-hills-overcast",
    title: "Stone bridge, hills",
    kind: "outdoors",
    register: "casual",
    interests: ["travel","hiking"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on a stone bridge over a wide slow river with bare hills beyond, wearing a mustard yellow fleece pullover over a charcoal base layer, olive green cargo trousers, dark hiking boots and a steel watch. Having just reached the midpoint of the crossing, he turns his head about twenty degrees toward the lens with his chin level and his eyes are on the lens. One hand holds the nylon strap of a backpack on one shoulder while the other hand rests on a stone parapet, and one shoulder sits slightly higher than the other. The bare hills sit four hundred metres behind him in soft grey-green shapes. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/2.0, 1/800, ISO 64. Keep skin pores, the fuzzy pile of the fleece, and the fine metal links of the watch.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on a stone bridge over a wide slow river with bare hills beyond, wearing a mustard yellow fleece pullover over a charcoal base layer, olive green cargo trousers, dark hiking boots and a steel watch. He is checking his position, his head turned about forty-five degrees away from the lens to look down the river, and his weight has shifted so one hip is higher. One hand holds a small brass compass and the other hand is flat against a stone parapet, and his shoulders sit at different heights. The hills are about five hundred metres in the distance and are soft. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/2.0, 1/800, ISO 64. Keep visible pores, the knurled edge of the compass, and the weave of the cargo trousers.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on a stone bridge over a wide slow river with bare hills beyond, wearing a mustard yellow fleece pullover over a charcoal base layer, olive green cargo trousers, dark hiking boots and a steel watch. Having stopped to rest, he looks up to the lens with a slight smile and his head tilted about ten degrees. One hand is braced on the stone parapet behind him and the other hand rests on his knee, so his shoulders are at different heights. The far bank of the river is seventy metres away and remains soft. Broad overcast daylight fills his face evenly from above and slightly in front. A 4:3 three-quarter frame, iPhone 15 Pro, 24mm, f/1.8, 1/1000, ISO 64. Keep pore structure, the grain of the masonry, and the heavy leather texture of the boots.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on a stone bridge over a wide slow river with bare hills beyond, wearing a mustard yellow fleece pullover over a charcoal base layer, olive green cargo trousers, dark hiking boots and a steel watch. He has been caught mid-thought and his gaze falls away from the lens toward the water, his mouth slightly open and eyes narrowed as he thinks. One hand is tucked into a trouser pocket and the other hand rests on the stone parapet, with one shoulder slumped lower than the other. The hills are six hundred metres back and show as soft shapes. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/2.0, 1/800, ISO 64. Keep the skin grain, the fine hairs of his beard, and the zip detail at his neck.",
      },
    ],
  },

  {
    id: "venue-entrance-evening",
    title: "Venue entrance, evening",
    kind: "social",
    register: "street",
    interests: ["nightlife","music"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in the recessed doorway of a small music venue at night, wearing a black oversized denim jacket over a white cotton t-shirt, baggy charcoal cargo trousers, white high-top trainers and a steel watch. His chin is tucked down about ten degrees and his eyes are on the lens, with a subtle smirk lifting one side of his mouth as he checks his look in the glass. One hand is adjusting the collar of the jacket while the other rests against the metal door frame, with one shoulder held higher than the other. The dark floor runs two metres back behind him into soft dark shapes. Direct on-camera flash reaches him frontally, metered for his face so the skin holds detail and the fall-off happens behind him. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/125, ISO 500. Keep visible pores on the nose, the heavy grain of the denim, and individual stubble hairs.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in the recessed doorway of a small music venue at night, wearing a black oversized denim jacket over a white cotton t-shirt, baggy charcoal cargo trousers, white high-top trainers and a steel watch. He has one hand buried deep in a jacket pocket while the other hand grips the edge of the metal door frame, with his weight shifted so one shoulder sits lower than the other while he waits for the bass to drop. His head is turned about fifteen degrees and his eyes go off to the side, caught by movement on the street. The doorway interior carries four metres behind him as soft dark shapes. Direct on-camera flash reaches him frontally, metered for his face so the skin holds detail and the fall-off happens behind him. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/1.8, 1/120, ISO 500. Keep the crisp cotton of the t-shirt, the metallic shine of the door frame, and natural skin texture.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on a low concrete ledge outside a small music venue at night, wearing a black oversized denim jacket over a white cotton t-shirt, baggy charcoal cargo trousers, white high-top trainers and a steel watch. One hand rests on his knee while the other is planted on the concrete surface behind his hip, taking his weight so his shoulders sit at different heights as he takes a breather from the loud music. He looks up to the lens with his brow slightly raised. The pavement stretches six metres past him into soft dark bands. Direct on-camera flash reaches him frontally, metered for his face so the skin holds detail and the fall-off happens behind him. A 4:3 three-quarter frame taken from standing height, iPhone 15 Pro, 24mm, f/1.8, 1/120, ISO 450. Keep the grain of the concrete, the canvas of the trainers, and the fine lines at the corners of his eyes.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in the recessed doorway of a small music venue at night, wearing a black oversized denim jacket over a white cotton t-shirt, baggy charcoal cargo trousers, white high-top trainers and a steel watch. He laughs with his head tilted about twenty degrees toward one shoulder, eyes squinting and teeth visible, his gaze falling away from the lens after hearing a funny remark. One hand is pressed flat against the denim of his chest while the other hand rests on the metal door, with one shoulder higher than the other. The entrance blurs into soft dark shapes three metres behind him. Direct on-camera flash reaches him frontally, metered for his face so the laugh lines read sharply. A 3:4 close frame from the shoulders up, framed low so there is headroom above him, iPhone 15 Pro, 24mm, f/1.8, 1/125, ISO 500. Keep the wetness of the eyes, the weave of the denim fabric, and real skin pores.",
      },
    ],
  },

  {
    id: "ceramics-studio-afternoon",
    title: "Ceramics studio, afternoon",
    kind: "activity",
    register: "sharp",
    interests: ["art","travel"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in a high-ceilinged ceramics studio beside a heavy timber workbench, wearing a charcoal grey boiled wool chore jacket over a black mock-neck jumper, navy wool trousers, black leather boots and a steel watch. He has turned his head about twenty degrees toward the lens ahead of his shoulders, mouth closed in a slight smile, and his eyes are on the lens. One hand rests on the rim of a tall ceramic vase on the bench, while the other hand is planted on the timber surface, and one shoulder sits lower than the other. The studio runs four metres back behind him into soft dark shapes. Broad daylight through a large open loading door fills his face evenly from the front and slightly above. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 160. Keep pore structure across the nose, the weave of the wool chore jacket, and the matte glaze of the vase.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He leans over a heavy timber workbench in a high-ceilinged ceramics studio, wearing a charcoal grey boiled wool chore jacket over a black mock-neck jumper, navy wool trousers, black leather boots and a steel watch. His head is turned about forty degrees away from the lens as he inspects his work, having just set a tool down. One hand is braced on the workbench with the fingers splayed, the other hand is picking up a piece of wire from the wood, and one shoulder is dropped forward. The studio carries six metres behind him into soft dark shapes. Broad daylight through a large open loading door fills his face evenly from the front and slightly above. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/2.0, 1/200, ISO 125. Keep visible pores, the stubble along his jaw, and the rough grain of the timber workbench.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on a low timber stool in a high-ceilinged ceramics studio, wearing a charcoal grey boiled wool chore jacket over a black mock-neck jumper, navy wool trousers, black leather boots and a steel watch. One hand rests on his thigh and the other hand holds a wooden modeling tool against his knee, so his shoulders sit at different heights. He looks up to the lens with his head tilted about ten degrees. The open yard beyond the door sits eight metres past him in soft pale light. Broad daylight through a large open loading door fills his face evenly from the front and slightly above. A 4:3 three-quarter frame from a standing height looking down at him, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 100. Keep the texture of the mock-neck jumper at the neck, the grain of the boot leather, and visible pores.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in a high-ceilinged ceramics studio beside a heavy timber workbench, wearing a charcoal grey boiled wool chore jacket over a black mock-neck jumper, navy wool trousers, black leather boots and a steel watch. He is laughing at a sudden thought, his head turned about fifteen degrees and his gaze falling away from the lens to the workbench, eyes narrowing to creases. One hand is buried in his jacket pocket and the other hand is dusting a patch of dry clay from his own opposite forearm, and his shoulders have risen with the laugh. The studio wall lies five metres behind him in soft dark shapes. Broad daylight through a large open loading door fills his face evenly from the front and slightly above. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/320, ISO 200. Keep the creases at the corners of his eyes, the texture of the chore jacket, and a smudge of clay on one sleeve.",
      },
    ],
  },

  {
    id: "minimalist-kitchen-morning",
    title: "Minimalist kitchen, morning",
    kind: "home",
    register: "casual",
    interests: ["coffee","cooking"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands beside a long pale timber kitchen island in a minimalist open-plan room, wearing a forest green waffle-knit cotton sweatshirt, dark grey chinos and a steel watch. He looks straight to the lens with his head turned about twenty degrees from his chest. One hand rests its palm flat on the timber surface of the island and the other hand holds the rim of a ceramic coffee cup, so one shoulder sits slightly lower than the other. The room stretches six metres behind him into soft pale bands. A large window filling the right edge of the frame lays broad soft daylight across him. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/200, ISO 100. Keep the fine grid of the waffle-knit fabric, individual pores on the bridge of the nose, and the faint texture of his stubble.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands beside a long pale timber kitchen island in a minimalist open-plan room, wearing a forest green waffle-knit cotton sweatshirt, dark grey chinos and a steel watch. He looks away from the lens, his eyes fixed on the window about fifteen degrees off-centre, as if listening for a sound. One hand is curled around the base of a ceramic coffee cup on the island and the other hand is tucked into a trouser pocket, which pulls one shoulder down. The space behind him extends five metres and remains soft. A large window filling the right edge of the frame lays broad soft daylight across him. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/200, ISO 100. Keep visible skin pores, the way the light catches the weave of the green sweatshirt, and the soft creases at the elbow.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He leans against a long pale timber kitchen island in a minimalist open-plan room, wearing a forest green waffle-knit cotton sweatshirt, dark grey chinos and a steel watch. He looks up to the lens with a faint, knowing smile, his head tilted about five degrees, having just finished a sip of his drink. He leans with one forearm resting on the wood and the other hand loosely gripping the edge of the island counter, making one shoulder sit higher. The far wall of the room is seven metres back and is a blur of soft shapes. A large window filling the right edge of the frame lays broad soft daylight across him. A 4:3 three-quarter frame, iPhone 15 Pro, 35mm, f/2.0, 1/160, ISO 125. Keep the grain of the timber island, real pore structure on the forehead, and the distinct threads of the cotton chinos.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands beside a long pale timber kitchen island in a minimalist open-plan room, wearing a forest green waffle-knit cotton sweatshirt, dark grey chinos and a steel watch. He is mid-laugh, his eyes nearly closed and his gaze falling toward the island about forty degrees down and away from the lens, having just thought of something funny while prepping a meal. One hand is pressed against the island for support and the other hand is raised to his chest, with one shoulder hunched higher than the other. The room continues four metres behind him, fading into soft pale tones. A large window filling the right edge of the frame lays broad soft daylight across him. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/200, ISO 100. Keep the deep creases at the corners of his eyes, the visible pores across his cheeks, and the soft pilling of the waffle-knit cotton.",
      },
    ],
  },

  {
    id: "minimalist-study-afternoon",
    title: "Minimalist study, afternoon",
    kind: "home",
    register: "casual",
    interests: ["reading","music"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in a high-ceilinged room with a tall sash window and bare floorboards, wearing a burgundy cashmere crewneck jumper, charcoal wool flannel trousers and a steel watch. He has turned his head about fifteen degrees toward the lens, and his eyes are on the lens. One hand rests against the side of his neck with the thumb hooked under the jawline, and the other hand is placed flat against the sash window frame, so one shoulder sits lower than the other. The room extends three metres behind him into soft neutral shapes. A large window filling the right edge of the frame lays broad soft daylight across him. A 3:4 close frame from the chest up, iPhone 15 Pro, 24mm, f/1.8, 1/200, ISO 100. Keep pore structure across the bridge of the nose, the soft halo of cashmere fibres, and the grain of the steel watch case.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands beside a vintage record player on a low timber plinth in a high-ceilinged room, wearing a burgundy cashmere crewneck jumper, charcoal wool flannel trousers and a steel watch. His face is turned about twenty-five degrees away from the lens as he checks the needle, his gaze fixed on the record. One hand rests on the timber plinth for balance and the other hand holds the edge of the record player's lid, having just lifted it. The back of the room is four metres away and remains soft shapes. A large window filling the right edge of the frame lays broad soft daylight across him. A 3:4 medium frame at waist height, iPhone 15 Pro, 24mm, f/2.0, 1/160, ISO 125. Keep stubble along the jaw, the wood grain of the plinth, and the fine knit of the jumper.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits in a deep leather armchair in a high-ceilinged room while holding a hardback book, wearing a burgundy cashmere crewneck jumper, charcoal wool flannel trousers and a steel watch. His head is tilted about ten degrees as he looks up to the lens with a faint smile, having just closed the book. One hand is wrapped around the spine of the book resting on his lap, and the other hand is draped over the leather arm of the chair, so his torso is slightly turned. The far side of the room is five metres distant and soft. A large window filling the right edge of the frame lays broad soft daylight across him. A 4:3 three-quarter frame, iPhone 15 Pro, 24mm, f/2.2, 1/125, ISO 160. Keep the cracked texture of the leather, the clean edge of the book pages, and the individual hairs of his beard.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits in a deep leather armchair in a high-ceilinged room, wearing a burgundy cashmere crewneck jumper, charcoal wool flannel trousers and a steel watch. He is mid-laugh with his mouth open and his eyes creased, and his gaze is directed toward the window about forty degrees away from the lens, having just recalled a forgotten lyric. One hand is pressed against his own thigh and the other hand is raised with the palm open as he makes a point. The room stretches four metres back into soft pale bands. A large window filling the right edge of the frame lays broad soft daylight across him. A 3:4 chest-up frame, iPhone 15 Pro, 24mm, f/1.8, 1/200, ISO 100. Keep the deep creases at the corners of the eyes, the weave of the wool trousers, and the texture of the skin on his neck.",
      },
    ],
  },

  {
    id: "guitar-brick-wall-home",
    title: "Guitar at home, afternoon",
    kind: "home",
    register: "street",
    interests: ["music"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in a high-ceilinged room with a bare red brick wall behind him, wearing a sand-coloured oversized cotton hoodie, vintage-wash black denim jeans and a steel watch. As he checks the pitch of a string, his head is turned about twenty degrees toward the lens and his eyes are on the lens. One hand pinches a tuning peg on the guitar headstock while the other hand supports the neck, and one shoulder sits lower than the other. The brick wall is one metre behind him and is soft. A large window filling the left edge of the frame lays broad soft daylight across him, and the room falls about a stop darker away from it. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 35mm, f/2.0, 1/125, ISO 160. Keep pore structure across the nose, the faint shadow of stubble along the jaw, and the heavy knit of the hoodie strings.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in a high-ceilinged room with a bare red brick wall behind him, wearing a sand-coloured oversized cotton hoodie, vintage-wash black denim jeans and a steel watch. Lost in the rhythm of a chord, his head is tilted down about five degrees and his eyes go past the lens to the floor. One hand frets a chord on the guitar neck while the other hand rests its palm against the strings near the bridge, with one shoulder pulled slightly forward. The brick wall is two metres behind him and is soft. A large window filling the left edge of the frame lays broad soft daylight across him, and the room falls about a stop darker away from it. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 100. Keep visible pores, the fine metallic texture of the guitar strings, and the coarse surface of the bricks.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in a high-ceilinged room with a bare red brick wall behind him, wearing a sand-coloured oversized cotton hoodie, vintage-wash black denim jeans and a steel watch. Pausing for a second between songs, he looks straight to the lens with his shoulders angled about thirty-five degrees away from it. One hand rests on the upper curve of the guitar body while the other hand is tucked into a pocket of the jeans, so one shoulder drops lower than the other. The brick wall is three metres behind him and very soft. A large window filling the left edge of the frame lays broad soft daylight across him, and the room falls about a stop darker away from it. A 4:3 three-quarter frame, iPhone 15 Pro, 24mm, f/1.8, 1/200, ISO 100. Keep visible pores, the way the denim creases at the hip, and the soft loopback texture of the hoodie fabric.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in a high-ceilinged room with a bare red brick wall behind him, wearing a sand-coloured oversized cotton hoodie, vintage-wash black denim jeans and a steel watch. Having just hit a wrong note, he laughs with his eyes creased and his head turned about forty degrees away from the lens. One hand is flat against the brick wall for balance while the other hand holds the guitar neck, and his shoulders have risen as he laughs. The brick wall is one metre behind him and stays soft. A large window filling the left edge of the frame lays broad soft daylight across him, and the room falls about a stop darker away from it. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 100. Keep the creases at the outer corners of the eyes, real pores across the cheeks, and the matte finish of the electric guitar body.",
      },
    ],
  },

  {
    id: "minimalist-cafe-morning",
    title: "Minimalist cafe, morning",
    kind: "social",
    register: "sharp",
    interests: ["coffee","reading"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands at a long white marble counter along a plain plaster wall in a minimalist cafe, wearing a camel wool overcoat over a cream cashmere turtleneck, dark brown corduroy trousers and a steel watch. He has turned his chin about fifteen degrees toward the lens, and his eyes are on the lens. One hand rests flat on the marble counter while the other holds a closed hardcover book against the side of the counter, so one shoulder sits slightly lower than the other. The wall continues three metres behind him, reduced to soft pale shapes. A large window filling the right edge of the frame lays broad soft daylight across him, and the room falls about a stop darker away from it. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/200, ISO 100. Keep pore structure across the bridge of the nose, the heavy grain of the camel wool, and the soft pile of the turtleneck.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He leans against a long white marble counter along a plain plaster wall in a minimalist cafe, wearing a camel wool overcoat over a cream cashmere turtleneck, dark brown corduroy trousers and a steel watch. His head is turned about forty degrees away from the lens as he looks toward the window with a neutral expression. One hand is wrapped around a small ceramic espresso cup on the counter and the other hand rests in his coat pocket, causing one shoulder to sit higher than the other. The room carries on five metres behind him, the far end soft and a stop darker. A large window filling the right edge of the frame lays broad soft daylight across him, and the room falls about a stop darker away from it. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/200, ISO 100. Keep visible pores on the cheek, steam rising from the cup, and the ribbed texture of the corduroy trousers.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on a high timber stool at a long white marble counter along a plain plaster wall in a minimalist cafe, wearing a camel wool overcoat over a cream cashmere turtleneck, dark brown corduroy trousers and a steel watch. He leans forward about twenty degrees and looks up to the lens with his lips just parted. One hand is splayed on the marble surface and the other hand rests on his own thigh, creating an asymmetrical line in his shoulders. The cafe runs six metres behind him, stool and far wall soft and darker. A large window filling the right edge of the frame lays broad soft daylight across him, and the room falls about a stop darker away from it. A 4:3 three-quarter frame at seated eye level, iPhone 15 Pro, 35mm, f/2.2, 1/125, ISO 100. Keep visible pores, the polished reflection on the marble counter, and the brushed finish of the steel watch links.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands at a long white marble counter along a plain plaster wall in a minimalist cafe, wearing a camel wool overcoat over a cream cashmere turtleneck, dark brown corduroy trousers and a steel watch. He is mid-laugh with his eyes narrowed and his gaze directed down toward the marble counter about forty degrees away from the lens. One hand is pressed into the marble for support and the other is raised to his own chest, with one shoulder hunched higher than the other. The room sits four metres behind him and stays soft. A large window filling the right edge of the frame lays broad soft daylight across him, and the room falls about a stop darker away from it. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/200, ISO 100. Keep the laugh lines at the outer corners of the eyes, real pores across the forehead, and the soft fuzzy texture of the cashmere where it meets the neck.",
      },
    ],
  },

  {
    id: "courtyard-doorway-afternoon",
    title: "Courtyard, afternoon",
    kind: "home",
    register: "casual",
    interests: ["cooking"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in a stone-flagged courtyard doorway beside a large terracotta pot of herbs, wearing a sage green cotton sweatshirt, navy chino trousers and a steel watch. Having just pinched a leaf of the herbs to check the scent, he has turned his head about fifteen degrees toward the lens and his eyes are on the lens. One hand touches a leaf of the basil while the other hand rests against his own forearm so one shoulder sits lower than the other by a few degrees. The kitchen interior is three metres behind him and is soft. Broad daylight through a large opening fills his face evenly from the front and slightly above. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/100, ISO 400. Keep pore structure, the sweatshirt weave and a trace of moisture on the herb leaf.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in a stone-flagged courtyard doorway beside a large terracotta pot of herbs, wearing a sage green cotton sweatshirt, navy chino trousers and a steel watch. Checking the contents of a heavy ceramic bowl, his head is bowed about twenty degrees and his gaze falls away from the lens to the bowl. One hand holds the side of the bowl while the other hand rests against the rim of the terracotta pot so that one shoulder is dropped lower. The kitchen interior is four metres behind him and is soft. Broad daylight through a large opening fills his face evenly from the front and slightly above. A 3:4 medium frame from the waist up, iPhone 15 Pro, 24mm, f/1.8, 1/100, ISO 400. Keep visible pores, the glazed ceramic surface and the sweatshirt's soft cotton grain.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in a stone-flagged courtyard doorway beside a large terracotta pot of herbs, wearing a sage green cotton sweatshirt, navy chino trousers and a steel watch. Waiting for a pan to heat inside, he looks up to the lens with his head turned about five degrees and his mouth neutral. One hand is tucked into a trouser pocket and the other hand rests on the edge of the terracotta pot, so one shoulder sits lower than the other by about five degrees. The kitchen interior is five metres behind him and is soft. Broad daylight through a large opening fills his face evenly from the front and slightly above. A 4:3 three-quarter frame taken from standing height, iPhone 15 Pro, 24mm, f/1.8, 1/125, ISO 400. Keep the twill of the trousers, pore structure across his nose and the grain of the terracotta.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in a stone-flagged courtyard doorway beside a large terracotta pot of herbs, wearing a sage green cotton sweatshirt, navy chino trousers and a steel watch. Reacting to a joke from inside, he laughs with his head tilted about ten degrees and his gaze falls away from the lens to the stone floor. One hand is touching the back of his neck and the other hand is tucked into a trouser pocket, with his shoulders slightly raised about ten degrees. The kitchen interior is three metres behind him and is soft. Broad daylight through a large opening fills his face evenly from the front and slightly above. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/100, ISO 400. Keep eye creases, the sweatshirt's knitted texture and real pore structure on the cheeks.",
      },
    ],
  },

  {
    id: "mountain-pass-overcast-midday",
    title: "Mountain pass, midday",
    kind: "outdoors",
    register: "casual",
    interests: ["hiking","travel"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands at a timber fence rail on a high mountain pass under a flat bright overcast sky, wearing a brick red technical puffer jacket over a charcoal thermal henley, olive green ripstop trousers, dark brown leather hiking boots and a steel watch. Having just reached the summit, his chin is level and his eyes are on the lens. One hand has reached up to adjust the zip of the jacket about three inches from the top, while the other hand rests on the timber rail. One shoulder sits about five degrees lower than the other. The far slopes sit twenty metres behind him and remain soft. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/500, ISO 64. Keep visible pores, the quilted stitching of the jacket, and the fine weave of the henley.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands at a timber fence rail on a high mountain pass under a flat bright overcast sky, wearing a brick red technical puffer jacket over a charcoal thermal henley, olive green ripstop trousers, dark brown leather hiking boots and a steel watch. Checking the weather ahead, his head is turned about thirty degrees away from the lens and his gaze follows the line of the distant peaks. One hand is tucked into a jacket pocket and the other hand is flat on the timber rail. One shoulder is angled about ten degrees forward toward the lens. The valley floor is forty metres behind him and reduced to soft green shapes. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/2.2, 1/640, ISO 64. Keep the matte texture of the jacket, individual hairs in the beard, and the grain of the timber rail.",
      },
      {
        framing: "threeQuarter",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He leans against a timber fence rail on a high mountain pass under a flat bright overcast sky, wearing a brick red technical puffer jacket over a charcoal thermal henley, olive green ripstop trousers, dark brown leather hiking boots and a steel watch. Taking a moment to appreciate the view, his chin is level and his eyes look straight to the lens. One forearm rests on the timber rail and the other hand is resting on his hip, so the shoulders are unevenly set. The distant peaks are thirty metres behind him and are soft. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 three-quarter frame, 1728x2304, iPhone 15 Pro, 24mm, f/2.8, 1/800, ISO 64. Keep the ripstop grid on the trousers, leather grain on the boots, and skin pores.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands at a timber fence rail on a high mountain pass under a flat bright overcast sky, wearing a brick red technical puffer jacket over a charcoal thermal henley, olive green ripstop trousers, dark brown leather hiking boots and a steel watch. He laughs at a sudden gust of wind, his head tilted about fifteen degrees to one side and his eyes narrowed as his gaze falls to the side of the lens. One hand is pushed into a jacket pocket and the other hand is gripped onto the timber rail. His shoulders have shrugged upward with the laugh. The far terrain lies twenty-five metres behind him and is soft. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/2.0, 1/500, ISO 64. Keep the creases around the eyes, skin texture on the forehead, and the fabric grain of the jacket.",
      },
    ],
  },

  {
    id: "moorland-ridge-overcast",
    title: "Moorland ridge, morning",
    kind: "outdoors",
    register: "casual",
    interests: ["hiking","running"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on an open moorland ridge under a flat bright overcast sky, expanse of tall grass and a pale horizon beyond, wearing a navy technical fleece jacket over a heather grey base layer, dark charcoal hiking trousers, black waterproof trail shoes and a steel watch. He has turned his head about fifteen degrees toward the lens as if checking the wind, mouth closed with a slight lift, and his eyes are on the lens. One hand adjusts the zip at his throat while the other hand rests on the opposite forearm, and one shoulder is dropped about two inches. The ridge slopes away six metres behind him into soft green-brown shapes. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 35mm, f/1.8, 1/1000, ISO 50. Keep pore structure across the nose, the fine weave of the technical fleece, and visible stubble.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on an open moorland ridge under a flat bright overcast sky, expanse of tall grass and a pale horizon beyond, wearing a navy technical fleece jacket over a heather grey base layer, dark charcoal hiking trousers, black waterproof trail shoes and a steel watch. He looks away from the lens toward the distant skyline with his chin tilted up about ten degrees, his expression focused having just checked his route. One hand is tucked into a jacket pocket while the other hand rests flat against the side of his thigh, and his weight is shifted onto one leg so that his hip drops about five degrees. The moorland opens for twenty-five metres beyond him in soft muted bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 half-body frame at chest height, iPhone 15 Pro, 28mm, f/2.2, 1/1000, ISO 64. Keep visible pores, skin creases across the knuckles, and the fabric grain of the trousers.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He leans against a weathered wooden fence post on an open moorland ridge under a flat bright overcast sky, expanse of tall grass and a pale horizon beyond, wearing a navy technical fleece jacket over a heather grey base layer, dark charcoal hiking trousers, black waterproof trail shoes and a steel watch. He looks straight to the lens while catching his breath from the climb, his head held level. One hand rests on the flat top of the timber post while the other is hooked into his waistband, and one shoulder sits three inches lower than the other. The grass extends thirty metres behind the post into soft pale shapes. Broad overcast daylight fills his face evenly from above and slightly in front. A 4:3 three-quarter frame taken from standing height looking slightly down, iPhone 15 Pro, 24mm, f/2.8, 1/800, ISO 100. Keep skin pores on the forehead, the weathered wood grain of the post, and creases in the fleece fabric.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on an open moorland ridge under a flat bright overcast sky, expanse of tall grass and a pale horizon beyond, wearing a navy technical fleece jacket over a heather grey base layer, dark charcoal hiking trousers, black waterproof trail shoes and a steel watch. He laughs with his face turned about forty degrees away from the lens, his eyes crinkling into small folds and his gaze falling away from the lens. One hand is raised to rub the back of his own neck while the other hand is pressed into the small of his back, and his shoulders have tensed with the laugh. The landscape drops away ten metres behind him into soft grey-green blur. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 50mm, f/2.0, 1/640, ISO 125. Keep crow's feet at the eyes, real pore structure on the cheeks, and the weave of the grey base layer.",
      },
    ],
  },

  {
    id: "riverside-path-morning-run",
    title: "Riverside path, morning run",
    kind: "activity",
    register: "street",
    interests: ["running"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on an empty asphalt riverside path at first light with low mist on the water, wearing a black hooded technical windbreaker over a charcoal marl running t-shirt, dark grey tapered performance joggers, black running trainers with white soles and a steel watch. He is still catching his breath after a segment with his head turned about fifteen degrees toward the lens, and his eyes are on the lens. One hand wipes condensation from his forehead while the other hand grips the lapel of the windbreaker, and one shoulder sits lower than the other. The mist on the water is eight metres back and is soft. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/2.2, 1/320, ISO 125. Keep sweat beads on the brow, pore structure on the nose, and the synthetic sheen of the windbreaker.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on an empty asphalt riverside path at first light with low mist on the water, wearing a black hooded technical windbreaker over a charcoal marl running t-shirt, dark grey tapered performance joggers, black running trainers with white soles and a steel watch. He is checking the line of the river with his body angled about forty degrees away from the lens, and his gaze goes past the lens toward the distant path. One hand rests on the steel watch on the opposite wrist while the other hand is placed firmly on his hip, causing one shoulder to sit higher than the other. The soft shapes of trees are eleven metres back and lose detail. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/2.2, 1/400, ISO 100. Keep visible pores, the fine texture of the charcoal marl t-shirt, and the damp surface of the path.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He leans against a timber railing belonging to the path on an empty asphalt riverside path at first light with low mist on the water, wearing a black hooded technical windbreaker over a charcoal marl running t-shirt, dark grey tapered performance joggers, black running trainers with white soles and a steel watch. He has paused his pace with his torso leaning about twenty degrees toward the railing, and he looks up to the lens with a neutral expression. One hand grips the timber railing while the other hand rests flat on his own thigh, and one shoulder is dropped lower than the other. The water surface is six metres back and is soft. Broad overcast daylight fills his face evenly from above and slightly in front. A 4:3 three-quarter frame taken from standing height, iPhone 15 Pro, 24mm, f/2.4, 1/250, ISO 160. Keep the grain of the timber railing, skin texture on the hands, and creases in the performance joggers.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on an empty asphalt riverside path at first light with low mist on the water, wearing a black hooded technical windbreaker over a charcoal marl running t-shirt, dark grey tapered performance joggers, black running trainers with white soles and a steel watch. He has lost the thread of the workout and laughs with his head tilted about ten degrees, and his gaze falling away from the lens toward the mist. One hand is tucked into a pocket of the windbreaker while the other hand rubs the back of his neck, and one shoulder is rolled forward. The path stretches fourteen metres back into soft grey shapes. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/2.0, 1/500, ISO 80. Keep laugh lines at the corners of the eyes, stubble on the jaw, and damp hair at the temple.",
      },
    ],
  },

  {
    id: "shoreline-rippled-sand-midday",
    title: "Shoreline, midday",
    kind: "outdoors",
    register: "casual",
    interests: ["surfing","travel"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on a wide expanse of rippled sand at low tide under a flat bright overcast sky, wearing a burnt orange zip-up technical jacket over a cream organic cotton t-shirt, navy blue ripstop trousers and a steel watch. His chin is level and he looks straight to the lens, head turned about three degrees, mouth closed with a slight lift at the corner as he checks the weather before he sets off. One hand has come up to adjust the zip of the jacket about five centimetres, the other hand rests against the side of the thigh, so one shoulder sits lower than the other. The horizon sits twelve metres behind him, dissolved to a soft grey band. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/2.0, 1/500, ISO 64. Keep visible pores, the fine ripstop grid of the jacket, and salt-blown hair at the temple.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on a wide expanse of rippled sand at low tide under a flat bright overcast sky, wearing a burnt orange zip-up technical jacket over a cream organic cotton t-shirt, navy blue ripstop trousers and a steel watch. He has turned his head about thirty-five degrees to one side, looking past the lens toward the horizon as he watches the tide turn. One hand is tucked into a jacket pocket, the other hand holds a smooth dark stone, so one shoulder is tilted toward the lens. The distant shoreline is fifteen metres away and is a soft blur. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/2.0, 1/500, ISO 64. Keep skin grain, the texture of the organic cotton at the collar, and the dull surface of the stone.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on a wide expanse of rippled sand at low tide under a flat bright overcast sky, wearing a burnt orange zip-up technical jacket over a cream organic cotton t-shirt, navy blue ripstop trousers and a steel watch. He looks up to the lens with his head tilted about ten degrees, having just paused his walk. One hand is hooked by a thumb into a trouser pocket, the other hand rests flat against the front of the thigh, so his shoulders sit at different heights. The sea mist starts twenty metres behind him, rendered as soft pale shapes. Broad overcast daylight fills his face evenly from above and slightly in front. A 4:3 three-quarter frame taken from standing height looking slightly down, iPhone 15 Pro, 24mm, f/2.8, 1/400, ISO 64. Keep stubble detail, the heavy weave of the ripstop trousers, and the damp texture of the sand.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on a wide expanse of rippled sand at low tide under a flat bright overcast sky, wearing a burnt orange zip-up technical jacket over a cream organic cotton t-shirt, navy blue ripstop trousers and a steel watch. He looks away from the lens, laughing with his head turned about twenty degrees as he recalls a travel story, eyes squinting in the bright flat light. One hand is raised to rub the skin at the back of the neck, the other hand rests against the hip, so one shoulder is hunched slightly. The expanse of sand stretches twelve metres back into a soft hazy distance. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/2.0, 1/640, ISO 64. Keep laughter lines around the eye corners, real pore structure on the cheekbones, and the steel watch's brushed finish.",
      },
    ],
  },

  {
    id: "sailing-yacht-foredeck-morning",
    title: "Sailing yacht, morning",
    kind: "outdoors",
    register: "sharp",
    interests: ["sailing","travel"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on the open foredeck of a moored sailing yacht with the sea beyond, wearing a midnight-grey merino wool quarter-zip jumper over a white piqué polo shirt, off-white cotton drill trousers, dark brown leather deck shoes and a steel watch. He has turned his head about twenty degrees toward the lens, mouth closed in a slight smile, and his eyes are on the lens. One hand rests on a polished steel deck rail and the other hand is tucked into a trouser pocket, making one shoulder sit higher than the other. The water runs thirty metres back behind him into soft blue-grey bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/2.0, 1/800, ISO 64. Keep pore structure on the nose, the fine knit of the wool jumper, and salt-crusted eyebrows.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on the open foredeck of a moored sailing yacht with the sea beyond, wearing a midnight-grey merino wool quarter-zip jumper over a white piqué polo shirt, off-white cotton drill trousers, dark brown leather deck shoes and a steel watch. Having just checked the horizon, his gaze goes past the lens to the distant shoreline while his shoulders are angled about forty degrees from the camera. One hand adjusts the zip at his neck and the other hand rests on the polished steel deck rail, causing his shoulders to sit at different heights. The sea opens forty metres beyond him in soft grey shapes. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/2.0, 1/800, ISO 64. Keep visible pores, the piqué texture of the polo collar, and the matte finish of the metal zip.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on the timber deck of a moored sailing yacht with the sea beyond, wearing a midnight-grey merino wool quarter-zip jumper over a white piqué polo shirt, off-white cotton drill trousers, dark brown leather deck shoes and a steel watch. He looks straight to the lens with his head tilted about ten degrees while resting after a morning sail. One forearm rests across a raised knee with the hand hanging loose and the other palm is flat on the timber deck beside his hip, so one shoulder is pushed up. Soft white shapes reach five metres past him. Broad overcast daylight fills his face evenly from above and slightly in front. A 4:3 three-quarter frame taken from standing height looking slightly down, iPhone 15 Pro, 24mm, f/2.4, 1/500, ISO 100. Keep visible pores, the grain of the timber deck, and the leather texture of the shoes.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on the open foredeck of a moored sailing yacht with the sea beyond, wearing a midnight-grey merino wool quarter-zip jumper over a white piqué polo shirt, off-white cotton drill trousers, dark brown leather deck shoes and a steel watch. He laughs with his head dropped toward one shoulder by about fifteen degrees and his gaze falling away from the lens to the deck, eyes narrowed to creases. One hand has come up to rub the temple and the other hand grips the polished steel deck rail, and one shoulder has risen higher than the other with the laugh. The sea lies fifty metres behind him in soft pale bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/2.0, 1/800, ISO 64. Keep the creases at the eye corners, real pore structure on the cheeks, and individual hairs in the beard.",
      },
    ],
  },

  {
    id: "snowfield-ridge-midday",
    title: "Snow field, midday",
    kind: "outdoors",
    register: "sharp",
    interests: ["skiing","travel"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on a bare snow field above the treeline under a flat bright overcast sky, wearing a graphite grey technical parka over a white merino roll-neck, navy wool trousers, black leather alpine boots and a steel watch. He has turned his head about twenty-five degrees toward the lens ahead of his shoulders, checking his position, and his eyes are on the lens. One gloved hand rests on the grip of a ski pole planted in the snow beside him, the other hand is tucked into his parka pocket, and one shoulder sits lower than the other. The snow field runs forty metres back behind him into a soft white shape of a ridge. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/2.2, 1/1000, ISO 50. Keep pore structure across the bridge of the nose, the fine knit of the roll-neck, and individual snowflakes caught in his hair.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on a bare snow field above the treeline under a flat bright overcast sky, wearing a graphite grey technical parka over a white merino roll-neck, navy wool trousers, black leather alpine boots and a steel watch. He looks straight to the lens, having just adjusted the fit of his collar, with his mouth closed. Both hands are at the front of his parka as if gripping the zip, with one hand about ten centimetres higher than the other, and his weight is on one hip so it drops slightly lower. The background is a soft pale band forty-five metres away. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/2.2, 1/1000, ISO 50. Keep visible skin pores, the texture of the technical fabric on the parka, and the metal sheen of the watch links.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on a low outcrop of dark rock in a bare snow field above the treeline under a flat bright overcast sky, wearing a graphite grey technical parka over a white merino roll-neck, navy wool trousers, black leather alpine boots and a steel watch. He looks up to the lens from his seat, having paused to catch the view, with his head tilted about fifteen degrees to the side. One hand rests on his knee, the other palm is flat on the rock beside his hip, and his shoulders are set at different heights. A soft shape on the horizon is fifty metres behind him. Broad overcast daylight fills his face evenly from above and slightly in front. A 4:3 three-quarter frame taken from standing height looking down at him, iPhone 15 Pro, 24mm, f/2.2, 1/1000, ISO 50. Keep the grain of the rock outcrop, the weave of the wool trousers, and the natural skin texture under the flat light.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on a bare snow field above the treeline under a flat bright overcast sky, wearing a graphite grey technical parka over a white merino roll-neck, navy wool trousers, black leather alpine boots and a steel watch. He laughs with his head turned about forty-five degrees to the side and his gaze falling away from the lens toward the distant ridge, eyes narrowed to small creases, having just heard a joke. One hand is raised to adjust his parka hood with the fingers curled, the other hand rests against his thigh, and his shoulders have risen with the laugh. The white background is soft and distant at sixty metres. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/2.2, 1/1000, ISO 50. Keep the smile lines at the corners of the eyes, real pore structure on the cheeks, and the matte finish of the parka shell.",
      },
    ],
  },

  {
    id: "granite-slab-midday",
    title: "Granite slab, midday",
    kind: "activity",
    register: "street",
    interests: ["climbing","hiking"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands at the foot of a clean granite slab in a high-altitude national park under a flat bright overcast sky, wearing a cobalt blue technical puffer gilet over a charcoal grey heavyweight hoodie, black canvas workwear trousers, tan suede approach shoes and a steel watch. Still catching his breath after the approach, his chin is level and he looks straight to the lens with a calm, closed-mouth expression. One hand has reached up to adjust the drawstring of the hood while the other hand rests flat against the zip of the gilet. The textured surface of the stone sits two metres behind him and is soft. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/2.0, 1/500, ISO 64. Keep visible pores, coarse stubble on the jaw, and the heavy weave of the charcoal hoodie.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands at the foot of a clean granite slab in a high-altitude national park under a flat bright overcast sky, wearing a cobalt blue technical puffer gilet over a charcoal grey heavyweight hoodie, black canvas workwear trousers, tan suede approach shoes and a steel watch. Checking the line before he starts, he has turned his head about twenty-five degrees away from the camera, and his gaze travels past the lens toward the upper section of the rock. One hand is pressed against a protrusion of the stone while the other hand is hooked by the thumb into a trouser pocket, causing one shoulder to sit lower. Distant shapes sit six metres behind him and are soft. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/2.2, 1/400, ISO 64. Keep skin grain, the matte texture of the granite, and the cobalt blue fabric of the gilet.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on a flat stone at the foot of a clean granite slab in a high-altitude national park under a flat bright overcast sky, wearing a cobalt blue technical puffer gilet over a charcoal grey heavyweight hoodie, black canvas workwear trousers, tan suede approach shoes and a steel watch. Taking a moment to rest, his eyes are on the lens and his head is turned about five degrees to the side. One hand is flat on the stone surface next to one hip and the other hand rests on the opposite knee, so his shoulders are at different heights. The base of the cliff sits four metres behind him, dissolved into soft grey shapes. Broad overcast daylight fills his face evenly from above and slightly in front. A 4:3 three-quarter frame taken from standing height looking down, iPhone 15 Pro, 24mm, f/2.8, 1/250, ISO 64. Keep the creases in the canvas trousers, the suede texture of the shoes, and skin that holds its texture in the flat light.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands at the foot of a clean granite slab in a high-altitude national park under a flat bright overcast sky, wearing a cobalt blue technical puffer gilet over a charcoal grey heavyweight hoodie, black canvas workwear trousers, tan suede approach shoes and a steel watch. Reacting to a joke, he laughs with his head turned about fifteen degrees toward one shoulder, and his gaze is directed away from the lens toward the ground. One hand is touching the back of the neck while the other hand rests on the front of one thigh, and his shoulders have shifted with the movement. Dark grey shapes sit five metres behind him and are soft. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/2.0, 1/640, ISO 64. Keep the fine creases at the corners of the eyes, real pore structure on the nose, and the fine fibres of the charcoal hoodie.",
      },
    ],
  },

  {
    id: "beach-run-retriever-morning",
    title: "Beach run with dog, morning",
    kind: "outdoors",
    register: "casual",
    interests: ["dogs","running"],
    tags: ["dog"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on a wide expanse of flat wet sand on an empty beach under a flat bright overcast sky, wearing a pine green technical quarter-zip sweatshirt over a charcoal grey marl performance t-shirt, black moisture-wicking running shorts, dark grey compression leggings, neon-soled trail running shoes and a steel watch. He has turned his head about fifteen degrees toward the lens with a closed-mouth smile, and his eyes are on the lens. One hand rests on the head of a golden retriever standing beside him, the other hand holds a yellow tennis ball at his chest, and one shoulder sits slightly lower than the other. The shoreline runs twenty metres back behind him into soft grey-white bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/2.2, 1/1000, ISO 50. Keep pore structure across the nose, the fine fleece texture of the sweatshirt collar, and the damp hair on the dog's coat.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on a wide expanse of flat wet sand on an empty beach under a flat bright overcast sky, wearing a pine green technical quarter-zip sweatshirt over a charcoal grey marl performance t-shirt, black moisture-wicking running shorts, dark grey compression leggings, neon-soled trail running shoes and a steel watch. Both hands work at the clasp of a dog lead, one holding the metal clip while the other pulls the webbing, and his weight has settled onto one leg so that hip drops. His gaze goes past the lens toward the dunes, having just finished a sprint. The flat sand opens forty metres beyond him in soft grey shapes. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 half-body frame at waist height, iPhone 15 Pro, 24mm, f/2.2, 1/1000, ISO 50. Keep visible pores, the knitted weave of the sweatshirt cuff, and the grit of wet sand on the dog's paws.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He crouches on a wide expanse of flat wet sand on an empty beach under a flat bright overcast sky, wearing a pine green technical quarter-zip sweatshirt over a charcoal grey marl performance t-shirt, black moisture-wicking running shorts, dark grey compression leggings, neon-soled trail running shoes and a steel watch. One hand rests on a raised knee while the other hand is flat on the sand to steady himself as he looks at the golden retriever, so his shoulders sit at different heights. He looks straight to the lens with his chin level. The dunes rise twenty-five metres away in soft tan bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 4:3 three-quarter frame from a low angle, iPhone 15 Pro, 24mm, f/2.2, 1/1000, ISO 50. Keep real pore structure, the ribbed texture of the quarter-zip hem, and the matted texture of the sand beneath his palm.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on a wide expanse of flat wet sand on an empty beach under a flat bright overcast sky, wearing a pine green technical quarter-zip sweatshirt over a charcoal grey marl performance t-shirt, black moisture-wicking running shorts, dark grey compression leggings, neon-soled trail running shoes and a steel watch. He laughs with his head turned about thirty-five degrees and his gaze falling away from the lens to the sand, eyes narrowed to creases. One hand has come up to adjust the collar of his sweatshirt and the other hand is tucked into his pocket, and his shoulders have risen with the laugh. The hazy horizon lies thirty metres behind him in soft bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/2.2, 1/1000, ISO 50. Keep the creases at the eye corners, stubble on the jawline, and the synthetic sheen of the running shorts.",
      },
    ],
  },

  {
    id: "hillside-gate-afternoon",
    title: "Hillside gate, afternoon",
    kind: "outdoors",
    register: "casual",
    interests: ["dogs","hiking"],
    tags: ["dog"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands by a timber gate on a bare hillside at the edge of a private estate, wearing a tobacco-coloured waxed cotton field jacket with a corduroy collar, a cream heavy-knit wool jumper, dark olive moleskin trousers, brown leather hiking boots and a steel watch. He has turned his head about fifteen degrees toward the lens having just paused the walk to check the view, chin level, mouth closed with a slight smile, and his eyes are on the lens. One hand rests on the weathered timber of the gate, the other hand is placed on the neck of a spaniel sitting at his feet, so one shoulder sits lower than the other. The moorland stretches eight metres behind him into soft green and brown shapes. A large window filling the right edge of the frame lays broad soft daylight across him, and the hillside falls about a stop darker away from it. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 100. Keep pore structure across the nose, the stubble along his jaw, and the grain of the gate's wood.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands by a timber gate on a bare hillside at the edge of a private estate, wearing a tobacco-coloured waxed cotton field jacket with a corduroy collar, a cream heavy-knit wool jumper, dark olive moleskin trousers, brown leather hiking boots and a steel watch. One hand is tucked into a jacket pocket and the other hand is resting on the timber gate's latch, causing one shoulder to be pushed slightly higher than the other. His head is turned away about forty degrees as he tracks the movement of a bird in the distance, his gaze going past the lens toward the horizon. The hillside carries twelve metres behind him in soft dark shapes. A large window filling the right edge of the frame lays broad soft daylight across him, and the hillside falls about a stop darker away from it. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/1.8, 1/200, ISO 100. Keep visible pores, the jumper's wool weave, and the spaniel's silky fur catching the light.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He leans his weight on one hip against a timber gate on a bare hillside at the edge of a private estate, wearing a tobacco-coloured waxed cotton field jacket with a corduroy collar, a cream heavy-knit wool jumper, dark olive moleskin trousers, brown leather hiking boots and a steel watch. One arm is propped on the top rail of the gate and the other hand rests on his own thigh as he takes a breather, one boot slightly ahead of the other so his shoulders sit at different heights. He looks straight to the lens with his head angled about ten degrees. The valley opens fifteen metres past him in soft pale shapes. A large window filling the right edge of the frame lays broad soft daylight across him, and the hillside falls about a stop darker away from it. A 4:3 three-quarter frame at eye level, iPhone 15 Pro, 24mm, f/2.0, 1/160, ISO 100. Keep visible pores, the sheen of the waxed cotton, and the dried soil on the boots.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands by a timber gate on a bare hillside at the edge of a private estate, wearing a tobacco-coloured waxed cotton field jacket with a corduroy collar, a cream heavy-knit wool jumper, dark olive moleskin trousers, brown leather hiking boots and a steel watch. He laughs with his head dropped about twenty-five degrees toward one shoulder as he reacts to the spaniel jumping up, eyes creased, his gaze going away from the lens toward the ground. One hand is lifted in a small gesture of surprise and the other hand grips the gate's post for balance, and his shoulders have risen unevenly. The grass sits six metres behind him in soft green shapes. A large window filling the right edge of the frame lays broad soft daylight across him, and the hillside falls about a stop darker away from it. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 100. Keep crow's feet at the eyes, skin texture across the cheekbones, and the corduroy's texture at the collar.",
      },
    ],
  },

  {
    id: "high-fell-hiking-afternoon",
    title: "High fell, afternoon",
    kind: "outdoors",
    register: "casual",
    interests: ["hiking"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands beside a moss-covered dry-stone wall on a high fell under a flat bright overcast sky, wearing a plum-coloured technical softshell jacket over a black microfleece quarter-zip, pewter grey walking trousers, dark brown nubuck boots and a steel watch. He turns his head about fifteen degrees toward the lens, chin level, and his eyes are on the lens. One hand holds the neck of a plain metal water bottle, the other hand rests on a stone of the wall, and one shoulder is slightly higher than the other. The cloud sits five metres behind him and appears as soft grey bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the chest up, iPhone 15 Pro, 24mm, f/2.0, 1/1000, ISO 100. Keep pore structure on the bridge of the nose, the fine weave of the softshell jacket, and moisture on the metal bottle.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands beside a moss-covered dry-stone wall on a high fell under a flat bright overcast sky, wearing a plum-coloured technical softshell jacket over a black microfleece quarter-zip, pewter grey walking trousers, dark brown nubuck boots and a steel watch. He tilts his head about ten degrees away from the lens, looking toward the horizon, having just paused to check the path ahead. One hand adjusts the padded strap of a rucksack on his shoulder, the other hand rests on the waistband of his trousers, and his weight shifted to one side makes one hip drop. The landscape rolls twelve metres back into soft green and grey shapes. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 half-body frame at waist height, iPhone 15 Pro, 24mm, f/2.2, 1/800, ISO 100. Keep visible pores, the matte texture of the rucksack strap, and stubble along the jawline.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on a moss-covered dry-stone wall on a high fell under a flat bright overcast sky, wearing a plum-coloured technical softshell jacket over a black microfleece quarter-zip, pewter grey walking trousers, dark brown nubuck boots and a steel watch. He looks up to the lens with a calm expression, his head turned about twelve degrees. One palm is flat on a stone of the wall beside him, the other hand rests on a thigh, and one shoulder sits lower than the other. The fell falls away twenty metres behind him into soft misty bands. A 4:3 three-quarter frame taken from chest height, iPhone 15 Pro, 24mm, f/2.4, 1/640, ISO 100. Broad overcast daylight fills his face evenly from above and slightly in front. Keep lichen on the stone of the wall, the grain of the nubuck boots, and real skin texture.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands beside a moss-covered dry-stone wall on a high fell under a flat bright overcast sky, wearing a plum-coloured technical softshell jacket over a black microfleece quarter-zip, pewter grey walking trousers, dark brown nubuck boots and a steel watch. He laughs with his chin tucked toward one shoulder and his gaze falling away from the lens, eyes narrowed, having just reached the summit. Both hands rest on his knees as he leans his torso forward about twenty degrees, and one shoulder has risen higher than the other with the breath. The low cloud sits eight metres behind him and remains soft. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/2.0, 1/1250, ISO 100. Keep the creases at the eye corners, pore structure across the cheekbones, and the synthetic grain of the jacket fabric.",
      },
    ],
  },

  {
    id: "running-track-overcast",
    title: "Running track, midday",
    kind: "activity",
    register: "street",
    interests: ["running","gym"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on an empty synthetic running track under a flat bright overcast sky, red lanes and white markings curving away behind him, wearing a teal green technical shell jacket over a slate grey marl zip-neck base layer, dark charcoal performance joggers, white and grey lightweight trainers and a steel watch. Still catching his breath after a sprint, one hand has come up to pull the zip of his jacket about five centimetres towards his chin, the other hand resting against his hip. His chin is level and his eyes are on the lens, mouth slightly parted. The red lanes of the track sit four metres behind him, dissolved to soft horizontal bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/2.2, 1/400, ISO 64. Keep visible pores, fine sweat beads at the temple, and the technical weave of the teal shell.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on an empty synthetic running track under a flat bright overcast sky, red lanes and white markings curving away behind him, wearing a teal green technical shell jacket over a slate grey marl zip-neck base layer, dark charcoal performance joggers, white and grey lightweight trainers and a steel watch. He is checking the line before he starts another lap, head turned about thirty degrees away while his torso stays angled toward the lane. One hand is adjusting the strap of his steel watch and the other hand holds the hem of his teal jacket, so one shoulder sits lower than the other. His gaze goes past the lens toward the far curve of the track. The concrete stand behind the track sits six metres away and loses all detail. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/2.0, 1/500, ISO 64. Keep skin grain, the marl texture of the base layer at his neck, and damp hair moving at the crown.",
      },
      {
        framing: "threeQuarter",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on a low concrete step of an empty stand beside a running track under a flat bright overcast sky, red lanes and white markings curving away behind him, wearing a teal green technical shell jacket over a slate grey marl zip-neck base layer, dark charcoal performance joggers, white and grey lightweight trainers and a steel watch. One hand is flat on the concrete step beside his hip and the other hand is resting on his knee, his shoulders tilted about ten degrees. His chin is level and he looks straight to the lens. The track surface opens seven metres behind him, reduced to soft red and white bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 three-quarter frame taken from standing height looking slightly down, iPhone 15 Pro, 24mm, f/2.8, 1/320, ISO 64. Keep the fabric weave of the joggers, the matte finish of the trainers, and skin that holds its grain in the flat light.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on an empty synthetic running track under a flat bright overcast sky, red lanes and white markings curving away behind him, wearing a teal green technical shell jacket over a slate grey marl zip-neck base layer, dark charcoal performance joggers, white and grey lightweight trainers and a steel watch. He has lost the thread of it during a cool down, a spontaneous laugh lifting his shoulders and narrowing his eyes. One hand is wiping his forehead with the back of a wrist and the other hand is tucked by the thumb into a pocket. His head is tilted about twelve degrees and his gaze falls past the lens to the track surface. The concrete stand lies five metres behind him in soft grey shapes. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/640, ISO 64. Keep the creases at the eye corners, real pore structure across the cheekbones, and the dull technical sheen of the teal shell.",
      },
    ],
  },

  {
    id: "tennis-baseline-midday",
    title: "Tennis baseline, midday",
    kind: "activity",
    register: "casual",
    interests: ["tennis"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on the orange clay baseline of a tennis court with high green hedging far behind him, wearing a white piqué tennis polo shirt with a navy collar, navy cotton shorts, white crew socks, white leather tennis shoes and a steel watch. Still catching his breath, he has turned his head about fifteen degrees toward the lens, chin level, and his eyes are on the lens. One hand is at his forehead wiping sweat with his wrist, the other resting on the end of a racket handle. The clay runs twelve metres back behind him into a soft green wall. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/2.0, 1/800, ISO 64. Keep pore structure on the nose, sweat sheen on the forehead, and the piqué weave of the polo.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on the orange clay baseline of a tennis court with high green hedging far behind him, wearing a white piqué tennis polo shirt with a navy collar, navy cotton shorts, white crew socks, white leather tennis shoes and a steel watch. He is checking the strings before a serve with his head tipped down about twenty degrees, and his gaze goes away from the lens. One hand holds the racket by the handle, the other hand's fingertips touch the strings, and one shoulder is held higher than the other. The hedging sits fifteen metres behind him and loses detail. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/1.8, 1/1000, ISO 64. Keep visible pores, the fine texture of the racket strings, and the soft cotton of the shorts.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on the orange clay baseline of a tennis court with high green hedging far behind him, wearing a white piqué tennis polo shirt with a navy collar, navy cotton shorts, white crew socks, white leather tennis shoes and a steel watch. Having just set a ball down by his feet, he looks up to the lens with his chin dropped about ten degrees and his brow slightly relaxed. One hand grips the racket throat, the other hand rests on a hip so that his weight settles to one side. The court opens twenty metres past him in soft orange and green bands. A 4:3 three-quarter frame, iPhone 15 Pro, 24mm, f/2.8, 1/500, ISO 100. Broad overcast daylight fills his face evenly from above and slightly in front. Keep skin grain, orange clay dust on the shoe leather, and the ribbing of the socks.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on the orange clay baseline of a tennis court with high green hedging far behind him, wearing a white piqué tennis polo shirt with a navy collar, navy cotton shorts, white crew socks, white leather tennis shoes and a steel watch. Having lost the thread of the score, he laughs with his head turned about twenty degrees away from the lens and his gaze falling away to the ground. One hand is at the back of his neck with the elbow flared, the other hand holds the racket loosely by the grip at his side, and his shoulders have risen with the laugh. The background lies ten metres behind him in a soft green texture. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/2.0, 1/800, ISO 64. Keep the creases at the eyes, real pore structure on the temple, and the texture of the racket grip tape.",
      },
    ],
  },

  {
    id: "padel-court-afternoon",
    title: "Padel court, afternoon",
    kind: "activity",
    register: "street",
    interests: ["tennis","gym"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in the open doorway of a padel court beside a thick glass wall, wearing a clay-coloured oversized technical hoodie, black ripstop performance joggers, white designer trainers and a steel watch. He has turned his head about fifteen degrees toward the lens with a calm mouth, and his eyes are on the lens. One hand grips the edge of the metal doorframe while the other rests against his thigh, with one shoulder sitting lower than the other. The empty blue court stretches six metres behind him into soft shapes. Broad daylight through a large opening fills his face evenly from the front and slightly above. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 160. Keep the fine pore structure on his nose, the individual hairs of his stubble, and the matte texture of the hoodie fabric.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He leans against a thick glass wall of a padel court having just finished a set, wearing a clay-coloured oversized technical hoodie, black ripstop performance joggers, white designer trainers and a steel watch. His head is tilted about ten degrees and his gaze looks away from the lens toward the floor as he catches his breath. One hand is pressed flat against the surface of the glass wall and the other hand is tucked into a pocket, making one shoulder drop lower than the other. The court's metal fencing is three metres away in soft dark shapes. Broad daylight through a large opening fills his face evenly from the front and slightly above. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 160. Keep visible skin pores, the silver brushed texture of the watch, and the slight dampness of the hair at his temples.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on a low concrete bench outside the glass wall of a padel court, wearing a clay-coloured oversized technical hoodie, black ripstop performance joggers, white designer trainers and a steel watch. One hand is planted on the bench beside his hip and the other hand rests loosely on a knee, so his shoulders sit at different heights. He looks up to the lens with his brow slightly raised and his head turned about twenty-five degrees. The court interior is eight metres past him in soft pale bands. Broad daylight through a large opening fills his face evenly from the front and slightly above. A 4:3 three-quarter frame taken from standing height looking down at him, iPhone 15 Pro, 24mm, f/1.8, 1/200, ISO 160. Keep visible pores, the pebbled leather grain of the trainers, and the clean knit of the hoodie cuffs.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in a padel court doorway beside a thick glass wall having lost the thread of a joke, wearing a clay-coloured oversized technical hoodie, black ripstop performance joggers, white designer trainers and a steel watch. He laughs with his head dropped about ten degrees toward one shoulder and his gaze falling away from the lens, eyes narrowed to creases. One hand is rubbing the back of his neck while the other hand grips the metal doorframe, and his shoulders have risen with the laugh. The court surface lies five metres behind him in soft dark shapes. Broad daylight through a large opening fills his face evenly from the front and slightly above. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 160. Keep the fine lines around his eyes, the real pore structure of his cheekbones, and the weave of the technical fabric.",
      },
    ],
  },

  {
    id: "boxing-warehouse-daylight",
    title: "Boxing warehouse, daylight",
    kind: "activity",
    register: "street",
    interests: ["boxing","gym"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands against a lime-washed brick wall in a warehouse gym, wearing a black sleeveless oversized cotton hoodie, charcoal grey marl performance shorts, black hand wraps and a steel watch. He has turned his head about twenty degrees toward the lens ahead of his shoulders, breathing through a slightly parted mouth, and his eyes are on the lens. One wrapped hand is pressed against the side of his own head to wipe sweat, and the other wrapped hand rests on the surface of a heavy leather boxing bag, making one shoulder sit higher than the other. The brick wall is three metres behind him and is soft. Broad daylight through a large opening fills his face evenly from the front and slightly above, with the interior behind him falling into soft dark shapes. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/500, ISO 100. Keep pore structure on the nose, the matte texture of the hand wraps, and the fine sheen on the skin.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands against a lime-washed brick wall in a warehouse gym, wearing a black sleeveless oversized cotton hoodie, charcoal grey marl performance shorts, black hand wraps and a steel watch. His chin is tucked down about ten degrees and his gaze goes past the lens to one side, catching his breath. One wrapped hand rests high on the heavy leather boxing bag while the other hand presses against his own hip, which drops that shoulder lower. The brick wall is five metres back and remains soft. Broad daylight through a large opening fills his face evenly from the front and slightly above, with the interior behind him falling into soft dark shapes. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/1.8, 1/500, ISO 100. Keep visible pores, the weave of the heavy cotton hoodie, and the glint of the steel watch.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands against a lime-washed brick wall in a warehouse gym, wearing a black sleeveless oversized cotton hoodie, charcoal grey marl performance shorts, black hand wraps and a steel watch. He looks up to the lens with a neutral expression and his head tipped about five degrees to one side, checking the tension of the fabric. One hand pulls at the fastening of the wrap on the other hand, so his shoulders are rounded and sit at different heights. The interior space extends seven metres behind him into soft shapes. Broad daylight through a large opening fills his face evenly from the front and slightly above, with the interior behind him falling into soft dark shapes. A 4:3 three-quarter frame taken from standing height, iPhone 15 Pro, 24mm, f/1.8, 1/500, ISO 100. Keep the grain of the brickwork, real pore structure on the cheeks, and the frayed edges of the hand wraps.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands against a lime-washed brick wall in a warehouse gym, wearing a black sleeveless oversized cotton hoodie, charcoal grey marl performance shorts, black hand wraps and a steel watch. He laughs with his head tilted about fifteen degrees toward one shoulder, his eyes narrowing into creases, and his gaze goes away from the lens toward the ceiling. One wrapped hand is clenched into a loose fist against his own chest, and the other hand is flat against the heavy leather boxing bag. The brick wall is four metres behind him and is soft. Broad daylight through a large opening fills his face evenly from the front and slightly above, with the interior behind him falling into soft dark shapes. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/500, ISO 100. Keep the laughter lines around the eyes, the skin pores, and the damp texture of the hoodie at the neck.",
      },
    ],
  },

  {
    id: "gym-private-daylight",
    title: "Private gym, afternoon",
    kind: "activity",
    register: "street",
    interests: ["gym"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on the rubber-matted floor of a private gym beside a single barbell, wearing a heavyweight black cotton oversized t-shirt, graphite grey nylon track pants, chunky white technical trainers and a steel watch. Having just finished a heavy set, he has turned his head about twenty degrees toward the lens, mouth slightly open as he catches his breath, and his eyes are on the lens. One hand rests on the bar of the barbell, the other sits on his own hip, and one shoulder is held slightly higher than the other. The room extends four metres behind him into soft dark shapes. Broad daylight through a large window fills his face evenly from the front and slightly above. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/200, ISO 100. Keep pore structure across the nose, a few fine beads of sweat on his forehead, and the heavy weave of the cotton shirt.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stoops over a single barbell on the rubber-matted floor of a private gym while checking the weights, wearing a heavyweight black cotton oversized t-shirt, graphite grey nylon track pants, chunky white technical trainers and a steel watch. One hand is adjusting a weight plate on the bar while the other hand rests on his knee for support, and one shoulder sits significantly lower than the other. His head is angled down about fifteen degrees and his gaze is fixed on the barbell, away from the lens. The background is five metres away and consists of soft dark shapes. Broad daylight through a large window fills his face evenly from the front and slightly above. A 3:4 half-body frame at chest height, iPhone 15 Pro, 35mm, f/2.0, 1/250, ISO 100. Keep visible pores, the knurled texture of the steel bar, and the matte finish of the track pants.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on a low weight bench on the rubber-matted floor of a private gym taking a moment between exercises, wearing a heavyweight black cotton oversized t-shirt, graphite grey nylon track pants, chunky white technical trainers and a steel watch. One hand rests on the bench beside his hip and the other hand is open on his thigh, so his shoulders sit at different heights. He looks up to the lens with a calm expression, his head tilted about ten degrees. The gym floor stretches six metres behind him into soft dark shapes. Broad daylight through a large window fills his face evenly from the front and slightly above. A 4:3 three-quarter frame from a standing height looking down at him, iPhone 15 Pro, 24mm, f/1.8, 1/160, ISO 200. Keep visible pores, the brushed steel of the watch links, and the fabric grain of the trainers.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on the rubber-matted floor of a private gym beside a single barbell, wearing a heavyweight black cotton oversized t-shirt, graphite grey nylon track pants, chunky white technical trainers and a steel watch. He is grinning having just completed a personal best lift, his head turned about thirty-five degrees away from the lens and his gaze directed toward the floor. One hand is raised to wipe his brow with the back of his wrist, and the other hand hangs at his side with a shrug in one shoulder. The space runs four metres back into soft dark shapes. Broad daylight through a large window fills his face evenly from the front and slightly above. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 100. Keep the narrow creases at the corners of his eyes, pore structure along the cheek, and the damp texture of his hair at the temple.",
      },
    ],
  },

  {
    id: "boxing-gym-daylight",
    title: "Boxing gym, daylight",
    kind: "activity",
    register: "street",
    interests: ["boxing"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in the bare corner of an industrial boxing gym, wearing a deep violet heavyweight cotton sweatshirt, black nylon athletic shorts, black compression leggings and a steel watch. He has turned his head about twenty degrees toward the lens ahead of his shoulders, which stay angled to the wall, so the turn shows in his neck. His mouth is closed with one corner lifted and he looks straight to the lens. One hand is braced against the plain wall and the other hand holds the handle of a skipping rope, with one shoulder sitting lower than the other. The wall is three metres behind him and is soft. A large window filling the right edge of the frame lays broad soft daylight across him, and the room falls about a stop darker away from it. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 100. Keep pore structure across the nose, the faint shadow of stubble along the jaw, and the weave of the sweatshirt fabric where the light fills the fabric.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in the bare corner of an industrial boxing gym, wearing a deep violet heavyweight cotton sweatshirt, black nylon athletic shorts, black compression leggings and a steel watch. One hand is adjusting the steel watch and the other hand holds the skipping rope handle, taking a little of his weight so that shoulder sits lower. His chin is turned about five degrees and his eyes go past the lens to the window, still catching his breath. The space carries on five metres behind him, its far corners soft and a stop darker. A large window filling the right edge of the frame lays broad soft daylight across him, and the room falls about a stop darker away from it. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 100. Keep visible pores, forearm hair catching the daylight, and the metallic texture of the watch.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He leans against a plain wall in the bare corner of an industrial boxing gym, wearing a deep violet heavyweight cotton sweatshirt, black nylon athletic shorts, black compression leggings and a steel watch. He rests one hand on the plain wall and lets the other hand hold the skipping rope against his thigh, so one shoulder drops lower than the other. His back is easy and he looks up to the lens with his lips just parted. The space stretches six metres back in soft dark shapes. A large window filling the right edge of the frame lays broad soft daylight across him, and the room falls about a stop darker away from it. A 4:3 three-quarter frame at eye level, iPhone 15 Pro, 24mm, f/2.0, 1/125, ISO 200. Keep visible pores, individual hairs at his hairline, and the soft folds of the sweatshirt where the sleeve gathers at the elbow.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in the bare corner of an industrial boxing gym, wearing a deep violet heavyweight cotton sweatshirt, black nylon athletic shorts, black compression leggings and a steel watch. He laughs with his eyes creased and his gaze dropping past the lens to the skipping rope, having just tangled the cord. One hand has lifted to rest at the back of his own neck with the elbow out, and the other hand holds the skipping rope handle. The wall sits four metres behind him and stays soft. A large window filling the right edge of the frame lays broad soft daylight across him, and the room falls about a stop darker away from it. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 100. Keep the creases at the outer corners of the eyes, real pores across the cheeks, and the fine texture of the sweatshirt where it pulls at the shoulder.",
      },
    ],
  },

  {
    id: "football-pitch-touchline-overcast",
    title: "Football pitch, touchline",
    kind: "activity",
    register: "street",
    interests: ["football"],
    tags: ["teamSport"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on the white touchline of an empty grass football pitch under a flat bright overcast sky, a bare goalmouth behind, wearing an emerald green technical track jacket with white side-taping over a black oversized organic cotton t-shirt, dark navy nylon cargo joggers, white and emerald green terrace-style trainers and a steel watch. He has turned his head about twenty degrees toward the lens, mouth closed with a slight lift at the edges, and his eyes are on the lens as if he has just arrived at the pitch edge. One hand adjusts the zip at his collar while the other hand rests on the jacket hem, causing one shoulder to sit slightly lower than the other. The goalpost of the goalmouth sits eight metres behind him as a soft white vertical. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/2.2, 1/1000, ISO 100. Keep pore structure across the nose, the weave of the jacket fabric, and fine stubble on the jaw.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on the white touchline of an empty grass football pitch under a flat bright overcast sky, a bare goalmouth behind, wearing an emerald green technical track jacket with white side-taping over a black oversized organic cotton t-shirt, dark navy nylon cargo joggers, white and emerald green terrace-style trainers and a steel watch. One hand is tucked into his jacket pocket and the other hand holds a leather football against his hip, having just stopped his walk. He looks away from the lens toward the far end of the pitch at an angle of forty degrees. The goalpost stands twelve metres away in the soft background. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/2.2, 1/1000, ISO 100. Keep visible pores, the pebbled texture of the leather football, and the nylon sheen of the joggers.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on the white touchline of an empty grass football pitch under a flat bright overcast sky, a bare goalmouth behind, wearing an emerald green technical track jacket with white side-taping over a black oversized organic cotton t-shirt, dark navy nylon cargo joggers, white and emerald green terrace-style trainers and a steel watch. One foot rests on top of a leather football and his weight shifts to the other leg so that hip drops, while one hand rests on his thigh and the other hangs naturally as he waits for a game to begin. He looks straight to the lens with a neutral, calm expression. The grass of the pitch extends twenty metres behind him into soft green shapes. Broad overcast daylight fills his face evenly from above and slightly in front. A 4:3 three-quarter frame taken from chest height, iPhone 15 Pro, 24mm, f/2.2, 1/1000, ISO 100. Keep skin pores, the stitched seams of the ball, and the fabric grain of the white side-taping.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on the white touchline of an empty grass football pitch under a flat bright overcast sky, a bare goalmouth behind, wearing an emerald green technical track jacket with white side-taping over a black oversized organic cotton t-shirt, dark navy nylon cargo joggers, white and emerald green terrace-style trainers and a steel watch. He laughs with his head tilted about fifteen degrees to the side, his gaze falling away from the lens toward the grass while reacting to a joke. One hand is raised to rub the back of his neck and the other hand is loosely balled in a jacket pocket, his shoulders slightly hunched with the motion. The goalpost is visible ten metres back as a soft shape. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/2.2, 1/1000, ISO 100. Keep laughter lines around the eyes, pore detail on the forehead, and the creased texture of the jacket sleeve.",
      },
    ],
  },

  {
    id: "football-cage-dusk",
    title: "Football cage, dusk",
    kind: "activity",
    register: "casual",
    interests: ["football","running"],
    tags: ["teamSport"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in an empty five-a-side football cage at dusk, wearing a lemon-yellow breathable technical training shirt with a black crew neck, charcoal grey athletic shorts, black compression leggings, white football boots and a steel watch. He has turned his head about twenty degrees toward the lens, still catching his breath with his lips slightly parted, and his eyes are on the lens. One hand grips the metal mesh of the fence at chest height, the other hand rests on his own hip, so one shoulder is pulled forward about ten degrees. The fence runs three metres back behind him into soft dark shapes. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/2.0, 1/125, ISO 400. Keep pore structure across the nose, sweat beads at the temple, and the micro-mesh texture of the yellow shirt.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in an empty five-a-side football cage at dusk, wearing a lemon-yellow breathable technical training shirt with a black crew neck, charcoal grey athletic shorts, black compression leggings, white football boots and a steel watch. He holds a football against his hip with one hand, checking the line of the goal after a drill, and his head is turned about fifteen degrees as his gaze falls away from the lens. The other hand rests against a white metal goal post, and his weight has settled onto one leg so that hip drops lower than the other. The far boundary is eight metres behind him and is soft. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/2.2, 1/125, ISO 400. Keep visible pores, the pebbled texture of the football, and the synthetic sheen of the leggings.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He crouches on one knee in an empty five-a-side football cage at dusk, wearing a lemon-yellow breathable technical training shirt with a black crew neck, charcoal grey athletic shorts, black compression leggings, white football boots and a steel watch. He looks up to the lens with his brow raised about three millimetres, having just finished adjusting his boot. One hand is pressed into the blue hard-court surface for balance, the other hand rests on his raised knee with the fingers loose, so the shoulders sit at different heights. The chain-link fence stands ten metres away in the background and is soft. A 4:3 three-quarter frame taken from standing height looking down at him, iPhone 15 Pro, 24mm, f/2.4, 1/100, ISO 500. Broad overcast daylight fills his face evenly from above and slightly in front. Keep visible pores, the scuff marks on the white boots, and the knit pattern of the compression layer.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in an empty five-a-side football cage at dusk, wearing a lemon-yellow breathable technical training shirt with a black crew neck, charcoal grey athletic shorts, black compression leggings, white football boots and a steel watch. He laughs at a missed shot with his head tilted about fifteen degrees and his eyes narrowed, having lost the thread of the game for a moment, and his gaze is away from the lens. One hand is placed flat against the back of his own neck, the other hand hangs at his side with the thumb hooked into his waistband, and his shoulders have risen about two centimetres with the laugh. The goal net sits six metres behind him in soft pale bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/2.0, 1/125, ISO 400. Keep the deep creases at the eye corners, real pore structure on the forehead, and the fine weave of the training shirt.",
      },
    ],
  },

  {
    id: "hilltop-cycling-overcast",
    title: "Hilltop cycling, midday",
    kind: "activity",
    register: "street",
    interests: ["cycling"],
    tags: ["bicycle"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on the tarmac of a bare hilltop lane with soft green verges under a flat bright overcast sky, holding a matte black road bike, wearing a copper-coloured oversized technical shell jacket over a black mesh performance vest, dark charcoal ripstop utility shorts, black mid-calf socks, white platform trainers and a steel watch. One hand is raised to his neck to adjust the zip of the jacket about two centimetres, while the other hand rests on the rubber grip of the bike's handlebar. His head is turned about ten degrees to the side but his eyes are on the lens, his mouth set in a faint smile. The grassy slope of the hill sits twelve metres behind him, dissolved into soft green shapes. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/400, ISO 100. Keep the fine pore structure, the technical weave of the jacket, and individual hairs at the brow.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on the tarmac of a bare hilltop lane with soft green verges under a flat bright overcast sky, holding a matte black road bike, wearing a copper-coloured oversized technical shell jacket over a black mesh performance vest, dark charcoal ripstop utility shorts, black mid-calf socks, white platform trainers and a steel watch. He has turned his head about thirty-five degrees to look out over the valley, his chin held level while he takes in the view. One hand is placed firmly on the saddle of the bike and the other hand grips the top tube of the frame, with one shoulder dropped about five degrees lower than the other. His gaze travels past the lens to the horizon. The next ridge is twenty metres behind him and is a soft grey blur. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 35mm, f/2.2, 1/500, ISO 80. Keep the matte texture of the bike frame, the visible skin grain, and the soft sheen on the jacket sleeves.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He leans against the matte black road bike on the tarmac of a bare hilltop lane with soft green verges under a flat bright overcast sky, wearing a copper-coloured oversized technical shell jacket over a black mesh performance vest, dark charcoal ripstop utility shorts, black mid-calf socks, white platform trainers and a steel watch. One hand is tucked into a jacket pocket and the other hand rests on the handlebar, with his weight shifted so one hip is pushed out about ten degrees. His chin is level and he looks straight to the lens, having just finished a long climb. The lane curves away fifteen metres behind him into soft dark shapes. Broad overcast daylight fills his face evenly from above and slightly in front. A 4:3 three-quarter frame, iPhone 15 Pro, 24mm, f/2.8, 1/640, ISO 64. Keep the crisp edges of the utility shorts, the texture of the tarmac, and the clear detail of the watch face.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on the tarmac of a bare hilltop lane with soft green verges under a flat bright overcast sky, holding a matte black road bike, wearing a copper-coloured oversized technical shell jacket over a black mesh performance vest, dark charcoal ripstop utility shorts, black mid-calf socks, white platform trainers and a steel watch. He is grinning and his gaze falls past the lens to the ground about three metres ahead, his head tilted about fifteen degrees toward one shoulder. One hand is brushing a stray hair from his forehead and the other hand holds the bike by the stem, his shoulders relaxed after the effort. The grassy verge sits eight metres behind him and is a soft green band. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/2.0, 1/800, ISO 100. Keep the narrow creases at the corners of his eyes, the damp texture of hair at his temples, and the detailed fabric grain of the jacket.",
      },
    ],
  },

  {
    id: "bouldering-gym-afternoon",
    title: "Bouldering gym, afternoon",
    kind: "activity",
    register: "street",
    interests: ["climbing","gym"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands before a plain bouldering wall in an industrial gym, wearing a heavyweight ochre cotton oversized t-shirt, graphite grey ripstop joggers, black rubber-soled climbing shoes and a steel watch. His head is turned about twenty degrees to the side and his eyes are on the lens. One hand rests flat against his own sternum while the other hand touches the textured surface of the wall, and one shoulder sits slightly higher than the other. The wall sits three metres behind him in soft dark shapes. Broad daylight through a large opening fills his face evenly from the front and slightly above. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 200. Keep pore structure on the bridge of the nose, the matte grain of the wall, and fine white chalk dust in the creases of his palms.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands before a plain bouldering wall in an industrial gym, wearing a heavyweight ochre cotton oversized t-shirt, graphite grey ripstop joggers, black rubber-soled climbing shoes and a steel watch. He looks up to the lens with his head tilted about fifteen degrees to one side, catching his breath. One hand grips a large resin climbing hold at chest height while the other hand brushes against the outer seam of his joggers, and his weight shifts so one shoulder is notably lower. The climbing wall is five metres behind him in soft dark shapes. Broad daylight through a large opening fills his face evenly from the front and slightly above. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/1.8, 1/200, ISO 200. Keep visible pores, the dry texture of chalk on his fingers, and the heavy weave of the t-shirt fabric.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on the edge of a thick safety mat in an industrial bouldering gym, wearing a heavyweight ochre cotton oversized t-shirt, graphite grey ripstop joggers, black rubber-soled climbing shoes and a steel watch. He looks away from the lens toward the ceiling at an angle of about forty degrees, having just finished a difficult route. One hand is flat on the mat behind his hip and the other hand rests on a raised knee, so his shoulders sit at different angles. The grey wall is seven metres away in soft dark shapes. Broad daylight through a large opening fills his face evenly from the front and slightly above. A 4:3 three-quarter frame from a standing height looking down at him, iPhone 15 Pro, 24mm, f/2.0, 1/160, ISO 400. Keep the scuffed rubber on the toes of the climbing shoes, the ripstop texture of the joggers, and visible skin pores.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands before a plain bouldering wall in an industrial gym, wearing a heavyweight ochre cotton oversized t-shirt, graphite grey ripstop joggers, black rubber-soled climbing shoes and a steel watch. He smiles broadly with his head turned about twenty-five degrees away from the lens, his gaze following a line of holds high on the wall. One hand is pressed to his thigh and the other hand is cupped near his mouth as he blows chalk from his fingers, and one shoulder is raised toward his ear. The plain wall is four metres behind him in soft dark shapes. Broad daylight through a large opening fills his face evenly from the front and slightly above. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 200. Keep the fine lines around his eyes, a dusting of chalk on the fabric of his shirt, and the visible grain of the cotton.",
      },
    ],
  },

  {
    id: "mountain-piste-midday",
    title: "Mountain piste, midday",
    kind: "activity",
    register: "street",
    interests: ["skiing"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands next to a pair of skis planted in the snow at the edge of an empty snow-covered piste on a high mountain ridge, wearing a sky-blue oversized technical anorak with a cream fleece-lined hood, charcoal grey wide-leg snow trousers, black technical ski boots and a steel watch. He has turned his head about twenty degrees toward the lens having just paused for a breath, mouth closed with a neutral expression, and his eyes are on the lens. One hand is adjusting a pair of goggles on his forehead while the other hand rests on the top of a ski. One shoulder sits lower than the other as he leans into the pose. The mountain ridge falls away thirty metres back into soft white peaks. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the chest up, iPhone 15 Pro, 24mm, f/2.8, 1/1250, ISO 50. Keep pore structure across the nose, frost on the fleece hood, and the fabric weave of the anorak.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands next to a pair of skis planted in the snow at the edge of an empty snow-covered piste on a high mountain ridge, wearing a sky-blue oversized technical anorak with a cream fleece-lined hood, charcoal grey wide-leg snow trousers, black technical ski boots and a steel watch. He looks past the lens down the slope with his chin dropped about five degrees as he checks the line for his next run. One hand brushes a dusting of snow off the other forearm while that other hand rests on his hip. One shoulder is turned about fifteen degrees away from the lens. The snow surface extends fifteen metres behind him into soft white shapes. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/2.8, 1/1250, ISO 50. Keep visible pores, a stray snowflake on his shoulder, and the matte finish of the ski boots.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on a wooden bench at the edge of an empty snow-covered piste on a high mountain ridge with a pair of skis planted in the snow beside him, wearing a sky-blue oversized technical anorak with a cream fleece-lined hood, charcoal grey wide-leg snow trousers, black technical ski boots and a steel watch. He looks straight to the lens with his head held level and a calm expression. One hand rests on the wood of the bench and the other hand sits on his thigh near the knee, creating an asymmetrical line in his shoulders. The mountain horizon opens forty metres behind him in soft pale bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 4:3 three-quarter frame from waist up, iPhone 15 Pro, 24mm, f/2.8, 1/1250, ISO 50. Keep pores, the grain of the bench wood, and the metal buckles on the boots.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands next to a pair of skis planted in the snow at the edge of an empty snow-covered piste on a high mountain ridge, wearing a sky-blue oversized technical anorak with a cream fleece-lined hood, charcoal grey wide-leg snow trousers, black technical ski boots and a steel watch. He laughs with his head tilted about ten degrees and his gaze falling away from the lens toward the ground, having lost the thread of a thought. One hand reaches up to rub the back of his neck and the other hand grips the edge of the anorak hem. One shoulder is hitched higher than the other during the laugh. The snowy ridge runs twelve metres back into soft light shapes. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/2.8, 1/1250, ISO 50. Keep the eye-corner creases, skin texture on the cheekbones, and the knit of the hood lining.",
      },
    ],
  },

  {
    id: "jetty-morning-sailing",
    title: "Jetty, morning",
    kind: "activity",
    register: "casual",
    interests: ["sailing"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on a bare timber jetty under a flat bright overcast sky, wearing a rust-coloured cable-knit wool jumper, navy heavy-duty cotton trousers, brown leather boat shoes and a steel watch. Still catching the morning air, he has turned his head about thirty degrees toward the lens with his chin level, and his eyes are on the lens. One hand rests on the thick coiled rope resting on the wood beside him, the other hand touches his own hip, so that one shoulder sits five degrees lower than the other. The open water stretches fifteen metres back in soft grey-blue bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/2.0, 1/500, ISO 100. Keep pore structure across the nose, the thick weave of the cable-knit jumper, and fine stubble at the jaw.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on a bare timber jetty under a flat bright overcast sky, wearing a rust-coloured cable-knit wool jumper, navy heavy-duty cotton trousers, brown leather boat shoes and a steel watch. Checking the horizon for a change in the wind, he has turned his head about twenty degrees away from the lens with his chin slightly lifted, and his gaze goes past the lens toward the far distance. One hand is tucked into a trouser pocket with the thumb visible, the other hand rests flat on the timber surface, and his weight has shifted so one hip is higher than the other. The open water extends twenty metres behind him into soft shapes. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 half-body frame at waist height, iPhone 15 Pro, 24mm, f/2.2, 1/640, ISO 100. Keep skin grain on the forehead, the polished steel of the watch, and the heavy texture of the cotton trousers.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on the edge of a bare timber jetty under a flat bright overcast sky, wearing a rust-coloured cable-knit wool jumper, navy heavy-duty cotton trousers, brown leather boat shoes and a steel watch. Having just finished securing the line, he has turned his head about forty degrees and he looks up to the lens with his brow slightly raised. One hand is braced against the planks behind him while the other hand rests on his raised knee, so that one shoulder is raised about eight degrees higher than the other. The water surface opens twenty-five metres past him in soft pale bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 4:3 three-quarter frame taken from a standing height looking down at him, iPhone 15 Pro, 24mm, f/2.8, 1/800, ISO 100. Keep visible pores, the grain of the wooden jetty planks, and the ribbing at the jumper cuffs.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on a bare timber jetty under a flat bright overcast sky, wearing a rust-coloured cable-knit wool jumper, navy heavy-duty cotton trousers, brown leather boat shoes and a steel watch. Laughing at a sudden thought, his head tilts about fifteen degrees toward one shoulder, his eyes narrowing as his gaze falls away from the lens to the coiled rope at his feet. One hand is pressed against his own chest and the other hand is open and gesturing toward the rope, while his shoulders have risen about two centimetres with the laugh. The water stretches ten metres behind him in soft dark shapes. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/2.0, 1/500, ISO 100. Keep the creases at the outer corners of the eyes, real pore structure on the cheeks, and the twisted strands of the hemp rope.",
      },
    ],
  },

  {
    id: "workshop-motorcycle-daylight",
    title: "Workshop, daylight",
    kind: "activity",
    register: "street",
    interests: ["motorcycles"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in the wide metal doorway of a concrete-floored workshop beside a classic silver motorcycle, wearing a black leather biker jacket over a charcoal grey marl t-shirt, indigo selvedge denim, black leather engineering boots and a steel watch. He has turned his head about twenty degrees toward the lens, mouth closed in a neutral expression, and his eyes are on the lens. One hand rests on the leather seat with fingers curled, the other hand is placed flat against the fuel tank, and one shoulder sits slightly lower than the other. The workshop interior stretches six metres behind him into soft dark shapes. Broad daylight through the large opening fills his face evenly from the front and slightly above. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/200, ISO 100. Keep pore structure on the bridge of the nose, the fine grain of the leather jacket, and the stubble on his chin.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He crouches on the floor of a concrete-floored workshop beside a classic silver motorcycle, wearing a black leather biker jacket over a charcoal grey marl t-shirt, indigo selvedge denim, black leather engineering boots and a steel watch. He is checking the tension of the chain with his head turned about ten degrees away from the lens, eyes focused on the work. One hand pulls the chain tight while the other hand is braced against the swingarm, and his weight is shifted so one shoulder is higher. The far wall of the workshop is five metres behind him in soft dark shapes. Broad daylight through the large opening fills his face evenly from the front and slightly above. A 3:4 half-body frame at chest height, iPhone 15 Pro, 35mm, f/1.8, 1/250, ISO 100. Keep the fabric weave of the t-shirt, the raised veins on the back of his hand, and creases in the leather at his waist.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He leans against a heavy metal doorframe beside a classic silver motorcycle in a concrete-floored workshop, wearing a black leather biker jacket over a charcoal grey marl t-shirt, indigo selvedge denim, black leather engineering boots and a steel watch. He looks straight to the lens with a faint smile, his head tilted about five degrees. One hand is tucked into a jacket pocket and the other hand is flat against the doorframe at shoulder height, which makes his shoulders sit at a sharp angle. Soft pale bands of light are visible on the floor eight metres behind him. Broad daylight through the large opening fills his face evenly from the front and slightly above. A 4:3 three-quarter frame taken from standing height, iPhone 15 Pro, 24mm, f/2.8, 1/160, ISO 200. Keep the texture of the concrete, the heavy denim weave, and pores across his forehead.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in a concrete-floored workshop beside a classic silver motorcycle, wearing a black leather biker jacket over a charcoal grey marl t-shirt, indigo selvedge denim, black leather engineering boots and a steel watch. He laughs as he has lost the thread of what he was doing, head dropped about fifteen degrees toward one shoulder and his gaze falling away from the lens to the ground. One hand is braced on the handlebar and the other hand has come up to wipe the back of his wrist across his brow. The workshop runs seven metres back into soft dark shapes. Broad daylight through the large opening fills his face evenly from the front and slightly above. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 50mm, f/1.8, 1/200, ISO 100. Keep the laughter lines around his eyes, real pore structure on the cheeks, and the scuffed grain on the toe of his boot.",
      },
    ],
  },

  {
    id: "mountain-layby-motorcycle",
    title: "Mountain lay-by, afternoon",
    kind: "outdoors",
    register: "street",
    interests: ["motorcycles","travel"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in a bare mountain lay-by beside a parked motorcycle under a flat bright overcast sky, wearing a dark olive green technical flight jacket over a charcoal grey waffle-knit henley, black slim-fit denim jeans, dark brown leather riding boots and a steel watch. Having just removed his helmet, he has turned his head about fifteen degrees toward the lens, and his eyes are on the lens. One hand rests on the metal zip of his jacket while the other hand touches the skin of his own jaw, and one shoulder sits slightly higher than the other. A rocky ridge runs seven metres back behind him into soft grey shapes. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/1000, ISO 50. Keep pore structure across the cheeks, the waffle-knit pattern of the henley, and the metal teeth of the jacket zip.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in a bare mountain lay-by beside a parked motorcycle under a flat bright overcast sky, wearing a dark olive green technical flight jacket over a charcoal grey waffle-knit henley, black slim-fit denim jeans, dark brown leather riding boots and a steel watch. Checking the line of the road before he starts, he looks down toward the fuel tank, his face turned about forty degrees away from the lens. One hand rests on the pebbled leather seat of the motorcycle and the other hand grips the handlebar, with his weight shifted onto one leg so that hip drops. The asphalt curves twelve metres into the distance behind him into soft dark bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 half-body frame at chest height, iPhone 15 Pro, 35mm, f/2.0, 1/800, ISO 64. Keep visible pores, the fine grain of the motorcycle seat, and the faded weave of the black denim.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on the saddle of a motorcycle in a bare mountain lay-by under a flat bright overcast sky, wearing a dark olive green technical flight jacket over a charcoal grey waffle-knit henley, black slim-fit denim jeans, dark brown leather riding boots and a steel watch. Still catching his breath after the climb, he has turned his head about eighteen degrees to the lens, and he looks straight to the lens. One hand rests flat on his own thigh and the other hand grips the edge of the motorcycle saddle, so one shoulder is pulled forward of the other. A mountain peak rises thirty metres behind him in soft pale shapes. Broad overcast daylight fills his face evenly from above and slightly in front. A 4:3 three-quarter frame taken from waist height, iPhone 15 Pro, 24mm, f/2.2, 1/1200, ISO 100. Keep the grain of the leather boots, the heavy stitching on the jacket seams, and real pore structure on the forehead.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in a bare mountain lay-by beside a parked motorcycle under a flat bright overcast sky, wearing a dark olive green technical flight jacket over a charcoal grey waffle-knit henley, black slim-fit denim jeans, dark brown leather riding boots and a steel watch. Caught in a moment of amusement, he laughs with his face turned about twenty-five degrees away from the lens, his eyes squinting into narrow creases as his gaze falls away from the lens. One hand holds a black motorcycle helmet against his hip and the other hand reaches up to touch the back of his own neck, and one shoulder rises higher than the other with the laugh. The landscape extends twenty metres back in soft grey-green bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/1000, ISO 50. Keep the fine lines around the eyes, the matte plastic shell of the helmet, and the texture of his short stubble.",
      },
    ],
  },

  {
    id: "hotel-canopy-night-sharp",
    title: "Hotel entrance, night",
    kind: "social",
    register: "sharp",
    interests: ["dining","nightlife"],
    tags: ["alcohol"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands beside a square stone pillar of a hotel entrance at night, wearing a dark-grey tailored velvet blazer over a black silk-cotton polo shirt, black wool trousers, polished black leather oxfords and a steel watch. His head is turned about fifteen degrees and his eyes are on the lens, with a calm expression. One hand is tucked into a trouser pocket while the other hand rests its thumb against the strap of his watch, causing one shoulder to sit slightly lower than the other. The stone surface behind him is three metres away and soft. Direct on-camera flash reaches him frontally, metered for his face so the skin holds detail and the fall-off happens behind him. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/125, ISO 400. Keep visible pores, the fine nap of the velvet blazer, and individual beard hairs.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands under the stone canopy of a hotel entrance at night, wearing a dark-grey tailored velvet blazer over a black silk-cotton polo shirt, black wool trousers, polished black leather oxfords and a steel watch. His chin is lowered a few degrees and his gaze goes off to the side as if watching a car arrive, caught in a moment of anticipation. One palm is flat against a stone pillar at shoulder height while the other hand rests on his hip, creating a diagonal line across his torso. The dark background is five metres deep and soft. Direct on-camera flash reaches him frontally, metered for his face so the skin holds detail and the fall-off happens behind him. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/1.8, 1/120, ISO 400. Keep the texture of the silk-cotton weave, skin grain on the hand, and the sharp edge of the blazer lapel.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He leans against a stone balustrade outside a hotel entrance at night, wearing a dark-grey tailored velvet blazer over a black silk-cotton polo shirt, black wool trousers, polished black leather oxfords and a steel watch. He looks up to the lens with a slight, knowing smile. One forearm rests on the stone top with the hand closed, and the other hand holds the opposite wrist, leaving one shoulder pulled forward and down. The architecture blurs into soft shapes eight metres behind him. Direct on-camera flash reaches him frontally, metered for his face so the skin holds detail and the fall-off happens behind him. A 4:3 three-quarter frame taken from standing height, iPhone 15 Pro, 24mm, f/1.8, 1/120, ISO 400. Keep the grain of the stone balustrade, the sheen of the velvet, and fine lines around his eyes.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in the centre of a stone hotel porch at night, wearing a dark-grey tailored velvet blazer over a black silk-cotton polo shirt, black wool trousers, polished black leather oxfords and a steel watch. He is mid-smirk with one corner of his mouth pulled high, his head tilted about ten degrees and his gaze falls away from the lens as if dismissing a joke. One hand is lifting to adjust a blazer button while the other hand is flat against his thigh. The background is four metres away and dissolves into soft dark bands. Direct on-camera flash reaches him frontally, metered for his face so the laugh lines read sharply. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/125, ISO 400. Keep natural skin texture, the subtle shine on the silk-cotton collar, and the crease of his smile.",
      },
    ],
  },

  {
    id: "club-doorway-night",
    title: "Club doorway, night",
    kind: "social",
    register: "sharp",
    interests: ["nightlife"],
    tags: ["alcohol"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in the deep-set doorway of a members' club on a quiet street at night, wearing a chocolate brown suede bomber jacket over a cream silk-cotton crewneck, navy wool-gabardine trousers, dark brown leather Chelsea boots and a steel watch. He has just paused to check the doorbell with his chin level and his eyes are on the lens. One hand adjusts the metal strap of the watch on the other wrist, and one shoulder sits about four centimetres lower than the other. The space behind him runs three metres and blurs into soft dark shapes. Direct on-camera flash reaches him frontally, metered for his face so the skin holds detail and the fall-off happens behind him. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/125, ISO 400. Keep the nap of the suede, visible pores on the nose, and individual eyebrow hairs.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in the deep-set doorway of a members' club on a quiet street at night, wearing a chocolate brown suede bomber jacket over a cream silk-cotton crewneck, navy wool-gabardine trousers, dark brown leather Chelsea boots and a steel watch. He is waiting for the door to be opened, his head turned about fifteen degrees and his eyes look away from the lens. One hand rests flat against the matte black door frame while the other hand is tucked into a trouser pocket, which drops one hip lower than the other. The dark street behind him stretches five metres into soft dark shapes. Direct on-camera flash reaches him frontally, metered for his face so the skin holds detail and the fall-off happens behind him. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/1.8, 1/120, ISO 400. Keep the silk-cotton weave, fine skin grain, and the texture of the door frame.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in the deep-set doorway of a members' club on a quiet street at night, wearing a chocolate brown suede bomber jacket over a cream silk-cotton crewneck, navy wool-gabardine trousers, dark brown leather Chelsea boots and a steel watch. He has just reached for the entrance, so he looks up to the lens with his head straight and a slight tilt of three degrees. One hand grips the large brass handle of the door, and the other hand hangs relaxed at his side with the thumb hooked into a pocket to keep one shoulder lower. The pavement runs six metres and is soft. Direct on-camera flash reaches him frontally, metered for his face so the skin holds detail and the fall-off happens behind him. A 4:3 three-quarter frame taken from standing height, 2304x1728, iPhone 15 Pro, 24mm, f/1.8, 1/100, ISO 500. Keep the grain of the leather boots, clear pore structure, and the metallic sheen of the handle.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in the deep-set doorway of a members' club on a quiet street at night, wearing a chocolate brown suede bomber jacket over a cream silk-cotton crewneck, navy wool-gabardine trousers, dark brown leather Chelsea boots and a steel watch. He is mid-laugh as the door opens, his head tilted about ten degrees to one side and his gaze falling away from the lens. One hand has come up to touch the collar of the jacket while the other hand rests against the door frame, keeping his shoulders at different heights. The interior behind him is four metres deep and soft. Direct on-camera flash reaches him frontally, metered for his face so the laugh lines read sharply. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/125, ISO 400. Keep crow's feet, the texture of the suede, and the fine stubble of his beard.",
      },
    ],
  },

  {
    id: "restaurant-terrace-afternoon",
    title: "Restaurant terrace, afternoon",
    kind: "social",
    register: "sharp",
    interests: ["dining"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on the stone terrace of an empty restaurant before service, wearing a deep charcoal-grey unstructured wool blazer over a light-grey merino wool turtleneck, black wool-flannel trousers and a steel watch. He has turned his head about fifteen degrees toward the lens, chin held level, and his eyes are on the lens. One hand rests on a table, and the other hand is down at his hip, so one shoulder sits lower than the other. The background extends four metres behind him into soft dark shapes. A large window filling the right edge of the frame lays broad soft daylight across him, and the room falls about a stop darker away from it. A 3:4 close frame from the chest up, iPhone 15 Pro, 35mm, f/1.8, 1/200, ISO 100. Keep pore structure across the nose, the fine weave of the wool, and the metal finish of the watch.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands beside a small table on the stone terrace of an empty restaurant before service, wearing a deep charcoal-grey unstructured wool blazer over a light-grey merino wool turtleneck, black wool-flannel trousers and a steel watch. Having just set a glass down, his head is turned about twenty degrees away from the lens, his gaze going past it toward the empty space with a neutral expression. One hand is still touching a glass of water, and the other hand rests on the table, so one shoulder is dropped lower than the other. The room behind him stretches six metres into soft pale bands. A large window filling the right edge of the frame lays broad soft daylight across him, and the room falls about a stop darker away from it. A 3:4 half-body frame, iPhone 15 Pro, 24mm, f/1.8, 1/160, ISO 100. Keep visible pores, the condensation on the glass, and the wool-flannel texture.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits at a table on the stone terrace of an empty restaurant before service, wearing a deep charcoal-grey unstructured wool blazer over a light-grey merino wool turtleneck, black wool-flannel trousers and a steel watch. Still catching his breath after arriving, he looks straight to the lens with his head turned about ten degrees, leaning forward slightly. One hand rests on his knee while the other hand is flat on the table next to a glass of water, and his shoulders are uneven. The ground extends eight metres past him into soft grey shapes. A large window filling the right edge of the frame lays broad soft daylight across him, and the room falls about a stop darker away from it. A 4:3 three-quarter frame at eye level, iPhone 15 Pro, 24mm, f/2.2, 1/125, ISO 100. Keep skin texture, the soft blur of the background shapes, and the sharp lines of the blazer’s lapel.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on the stone terrace of an empty restaurant before service, wearing a deep charcoal-grey unstructured wool blazer over a light-grey merino wool turtleneck, black wool-flannel trousers and a steel watch. Having lost the thread of a thought, he looks away from the lens with a faint smile, his head tilted about five degrees toward one shoulder. One hand holds a glass of water, and the other hand rests on his own lap, making one shoulder higher than the other. The background is five metres away and soft. A large window filling the right edge of the frame lays broad soft daylight across him, and the room falls about a stop darker away from it. A 3:4 chest-up frame, iPhone 15 Pro, 35mm, f/1.8, 1/200, ISO 100. Keep the fine creases at the corners of his eyes, individual hairs at his brow, and the texture of the merino wool.",
      },
    ],
  },

  {
    id: "minimalist-art-studio-daylight",
    title: "Art studio, daylight",
    kind: "activity",
    register: "casual",
    interests: ["art","reading"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in a minimalist high-ceilinged art studio beside a light oak drawing board, wearing a navy cotton worker jacket over a charcoal grey marl t-shirt, off-white heavy canvas trousers and a steel watch. He has turned his head about twenty degrees toward the lens ahead of his shoulders, looking for the right angle. His mouth is closed and his eyes are on the lens. One hand rests on the top edge of the drawing board with the fingers curled, the other hand holds the edge of his jacket, so one shoulder sits lower than the other. The room runs three metres back behind him, reduced to soft pale shapes. A large window filling the right edge of the frame lays broad soft daylight across him. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 100. Keep pore structure across the nose, the visible grain of the cotton jacket, and the faint shadow of stubble along the jaw.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in a minimalist high-ceilinged art studio beside a light oak drawing board, wearing a navy cotton worker jacket over a charcoal grey marl t-shirt, off-white heavy canvas trousers and a steel watch. He has just stepped back a pace, his chin tilted about ten degrees as his gaze goes past the lens toward the far wall, mid-thought. One hand rests on his hip and the other hand touches the back of his neck, which causes one shoulder to sit higher than the other. The room carries on five metres behind him, the far corner soft and a stop darker. A large window filling the right edge of the frame lays broad soft daylight across him. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 100. Keep visible pores, the fine marl texture of the t-shirt, and the way the light catches the watch glass.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He leans against the edge of a light oak drawing board in a minimalist high-ceilinged art studio, wearing a navy cotton worker jacket over a charcoal grey marl t-shirt, off-white heavy canvas trousers and a steel watch. His body is angled about fifteen degrees from the board and he looks straight to the lens with a calm expression, having just paused his work. One hand rests on the tilted surface of the drawing board and the other hand is tucked into a trouser pocket with the thumb visible, creating an asymmetrical line through his shoulders. The studio floor runs six metres behind him into soft grey shapes. A large window filling the right edge of the frame lays broad soft daylight across him. A 4:3 three-quarter frame, iPhone 15 Pro, 28mm, f/2.0, 1/125, ISO 100. Keep the heavy weave of the canvas trousers, individual hairs at the temple, and skin texture on the back of the hand.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in a minimalist high-ceilinged art studio beside a light oak drawing board, wearing a navy cotton worker jacket over a charcoal grey marl t-shirt, off-white heavy canvas trousers and a steel watch. He is laughing at a sudden thought, his head turned nearly forty degrees and his gaze dropping away from the lens toward the floor. One hand has come up to grip the opposite forearm while the other hand rests against the side of the drawing board, his shoulders hunched slightly with the laugh. The room sits four metres behind him and remains soft. A large window filling the right edge of the frame lays broad soft daylight across him. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 100. Keep the creases at the outer corners of the eyes, real pores across the cheeks, and the way the jacket fabric bunches at the elbow.",
      },
    ],
  },

  {
    id: "hotel-corridor-sharp",
    title: "Hotel corridor, evening",
    kind: "portrait",
    register: "sharp",
    interests: ["travel","dining"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands against a plain painted wall in a hotel corridor, wearing a deep-burgundy wool-cashmere overcoat over a dark pewter silk-cotton polo, midnight-blue tailored trousers and a steel watch. He has turned his head about twenty degrees toward the lens ahead of his shoulders, and his eyes are on the lens. One hand adjusts the notch lapel of the overcoat while the other hand rests flat against the wall, with one shoulder held higher than the other. The space stretches three metres behind him, fading into soft dark shapes. A large window filling the right edge of the frame lays broad soft daylight across him, and the room falls about a stop darker away from it. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/125, ISO 160. Keep pore structure on the bridge of the nose, the fine weave of the burgundy wool, and the subtle sheen of the silk-cotton collar.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands against a plain painted wall in a hotel corridor, wearing a deep-burgundy wool-cashmere overcoat over a dark pewter silk-cotton polo, midnight-blue tailored trousers and a steel watch. His chin is lowered about five degrees and he looks away from the lens toward the light, caught in a moment of quiet reflection. One hand is submerged in a coat pocket and the other hand rests against his own thigh, with one shoulder dropped lower than the other. The background is five metres distant and soft. A large window filling the right edge of the frame lays broad soft daylight across him, and the room falls about a stop darker away from it. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 35mm, f/2.0, 1/100, ISO 200. Keep visible skin pores, the dense texture of the coat fabric, and the sharp line of the watch face.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He leans against a plain painted wall in a hotel corridor, wearing a deep-burgundy wool-cashmere overcoat over a dark pewter silk-cotton polo, midnight-blue tailored trousers and a steel watch. He looks straight to the lens with a faint, steady smile and his head tilted about ten degrees. One hand is tucked into a trouser pocket while the other hand rests on the opposite forearm, with the shoulder nearest the wall pushed slightly forward. The hallway extends six metres behind him into soft shapes. A large window filling the right edge of the frame lays broad soft daylight across him, and the room falls about a stop darker away from it. A 4:3 three-quarter frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/125, ISO 160. Keep the grain of the painted wall, the distinct stitches on the coat seams, and clear pores across the forehead.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands against a plain painted wall in a hotel corridor, wearing a deep-burgundy wool-cashmere overcoat over a dark pewter silk-cotton polo, midnight-blue tailored trousers and a steel watch. He is laughing, his eyes crinkled and his gaze directed about forty-five degrees away from the lens toward the floor, having just recalled a private joke. One hand rests on the back of his neck and the other hand holds the open edge of the overcoat, with his chest angled away from the camera. The area behind him is four metres deep and soft. A large window filling the right edge of the frame lays broad soft daylight across him, and the room falls about a stop darker away from it. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 35mm, f/2.0, 1/200, ISO 250. Keep the creases at the corners of the eyes, the texture of the facial hair, and the soft highlights on the silk-cotton knit.",
      },
    ],
  },

  {
    id: "minimalist-boxing-daylight",
    title: "Minimalist boxing studio, daylight",
    kind: "portrait",
    register: "street",
    interests: ["gym","boxing"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands against a plain concrete wall inside a minimalist boxing studio, wearing a stone-coloured oversized cotton hoodie, dark forest green nylon track pants and a steel watch. His head is turned about fifteen degrees toward the lens and his eyes are on the lens, as he cools down from training. One hand is raised to adjust the edge of the hood while the other hand rests against his own chest, and one shoulder is hitched slightly higher than the other. The background is eight metres behind him and appears as soft pale bands. Broad daylight through a large opening fills his face evenly from the front and slightly above. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/400, ISO 160. Keep visible pore structure on the nose, the fine weave of the cotton hoodie, and the individual hairs of his eyebrows.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands against a plain concrete wall inside a minimalist boxing studio, wearing a stone-coloured oversized cotton hoodie, dark forest green nylon track pants and a steel watch. His chin is tucked about ten degrees toward his chest as he looks away from the lens, focused on his own knuckles. One hand holds the end of a black cotton hand wrap and pulls it across the knuckles of the other hand, which is held open in a claw shape, and one shoulder is rolled forward more than the other. The background is ten metres behind him into soft dark shapes. Broad daylight through a large opening fills his face evenly from the front and slightly above. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/1.8, 1/400, ISO 160. Keep the skin texture on his hands, the fine grain of the concrete wall, and the crisp edges of the hand wraps.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He leans against a plain concrete wall inside a minimalist boxing studio, wearing a stone-coloured oversized cotton hoodie, dark forest green nylon track pants and a steel watch. He looks up to the lens with his head tilted about five degrees to one side, catching his breath after a session. One hand is pressed flat against the concrete wall and the other hand rests inside a pocket of the track pants, lowering that shoulder. The background is twelve metres deep and consists of soft shapes. Broad daylight through a large opening fills his face evenly from the front and slightly above. A 4:3 three-quarter frame taken from standing height, iPhone 15 Pro, 24mm, f/1.8, 1/400, ISO 160. Keep the creases in the nylon fabric, the pore structure of the cheeks, and the faint moisture on his forehead.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands against a plain concrete wall inside a minimalist boxing studio, wearing a stone-coloured oversized cotton hoodie, dark forest green nylon track pants and a steel watch. He laughs with his face turned about forty degrees away from the lens, his eyes narrowed into creases, his gaze going away from the lens across the studio. One hand is lifted to touch the lower half of his face and the other hand hangs at his side with the fingers curled slightly, while one shoulder sits higher than the other. The background is six metres deep and very soft. Broad daylight through a large opening fills his face evenly from the front and slightly above. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/400, ISO 160. Keep the laughter lines at the corners of his eyes, the stubble on his chin, and the soft pile of the hoodie fabric.",
      },
    ],
  },

  {
    id: "minimalist-kitchen-morning-coffee",
    title: "Minimalist kitchen, morning",
    kind: "portrait",
    register: "casual",
    interests: ["cooking","coffee"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in a minimalist kitchen with a plain tiled wall, wearing a slate grey waffle-knit crewneck jumper, charcoal chinos, white leather trainers and a steel watch. Having just taken a sip of coffee, he looks straight to the lens with his head turned about fifteen degrees and his chin held level. One hand holds the handle of a ceramic mug, the other rests on the edge of the counter, and one shoulder sits slightly lower than the other. The tiled wall is three metres behind him, reduced to soft pale shapes. A large window filling the right edge of the frame lays broad soft daylight across him, and the room falls about a stop darker away from it. A 3:4 close frame from the chest up, iPhone 15 Pro, 24mm, f/1.8, 1/200, ISO 100. Keep pore structure across the nose, the deep texture of the waffle-knit, and the glossy finish of the ceramic mug.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in a minimalist kitchen with a plain tiled wall, wearing a slate grey waffle-knit crewneck jumper, charcoal chinos, white leather trainers and a steel watch. While waiting for the kettle to finish, he has turned his head about twenty degrees and his gaze goes away from the lens toward the window. One hand is adjusting the steel watch on the opposite wrist and the other hand rests flat on the counter, so the shoulders sit at different heights. The far end of the kitchen is four metres back, showing soft dark shapes. A large window filling the right edge of the frame lays broad soft daylight across him, and the room falls about a stop darker away from it. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/2.0, 1/200, ISO 100. Keep visible pores, the fine hairs on his arm catching the light, and the stubble along his jawline.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He leans against the counter in a minimalist kitchen with a plain tiled wall, wearing a slate grey waffle-knit crewneck jumper, charcoal chinos, white leather trainers and a steel watch. Leaning at an angle of about ten degrees after finishing the food prep, his eyes are on the lens with a faint smile. One hand rests on a wooden cutting board on the counter, the other hand is tucked into a trouser pocket, causing one shoulder to rise above the other. The room extends six metres behind him in soft pale shapes. A large window filling the right edge of the frame lays broad soft daylight across him, and the room falls about a stop darker away from it. A 4:3 three-quarter frame at eye level, iPhone 15 Pro, 24mm, f/2.8, 1/125, ISO 160. Keep the grain of the wooden board, the weave of the chino fabric, and real pore structure.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in a minimalist kitchen with a plain tiled wall, wearing a slate grey waffle-knit crewneck jumper, charcoal chinos, white leather trainers and a steel watch. Having just caught a stray thought, he laughs with his head tilted about twelve degrees toward one shoulder and he looks up and away from the lens. One hand is rubbing the back of his neck, the other hand rests on the counter, and his shoulders have tensed upward. The wall is two metres behind him in soft dark shapes. A large window filling the right edge of the frame lays broad soft daylight across him, and the room falls about a stop darker away from it. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 100. Keep crow's feet, the texture of individual hairs, and the way the jumper pulls at the shoulder.",
      },
    ],
  },

  {
    id: "surf-dune-overcast",
    title: "Surf beach, dunes",
    kind: "portrait",
    register: "casual",
    interests: ["surfing","skiing"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on a sandy dune ridge overlooking a wide surf beach under a flat bright overcast sky, wearing a terracotta-orange oversized heavy cotton hoodie over a white organic cotton t-shirt, dark teal board shorts, and a steel watch. He has turned his head about fifteen degrees toward the lens, mouth closed with a neutral expression, and his eyes are on the lens. One hand grips the edge of a surfboard resting against his own shoulder, the other hand is tucked into the front pocket of the hoodie. One shoulder sits significantly higher than the other due to the weight of the board. The horizon line runs ten metres back behind him into soft pale bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/1000, ISO 50. Keep visible pores, salt-crusted texture in his hair, and the heavy weave of the cotton hoodie.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on a sandy dune ridge overlooking a wide surf beach under a flat bright overcast sky, wearing a terracotta-orange oversized heavy cotton hoodie over a white organic cotton t-shirt, dark teal board shorts, and a steel watch. His gaze is fixed on the distant water away from the lens, his chin lowered about ten degrees as if checking the swell. Both hands are holding a surfboard vertically; one hand grips the rail at waist height while the other hand rests on the nose of the board. One hip is cocked so that one shoulder drops lower than the other. The shoreline opens fifteen metres beyond him in soft grey-blue. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/1.8, 1/1000, ISO 50. Keep skin pores, the matte finish of the surfboard rail, and fine creases at the corner of his eye.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He leans against a weathered wooden fence post on a sandy dune ridge overlooking a wide surf beach under a flat bright overcast sky, wearing a terracotta-orange oversized heavy cotton hoodie over a white organic cotton t-shirt, dark teal board shorts, and a steel watch. He looks straight to the lens with a slight, relaxed smile. One hand is flat on the top of the fence post while the other hand rests on his own thigh, creating an asymmetrical lean in his torso. The sea horizon lies twenty metres past him in soft dark shapes. Broad overcast daylight fills his face evenly from above and slightly in front. A 4:3 three-quarter frame taken from standing height, iPhone 15 Pro, 24mm, f/1.8, 1/1000, ISO 50. Keep the grain of the silvered wood post, visible pores, and the frayed edges of the board short hem.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on a sandy dune ridge overlooking a wide surf beach under a flat bright overcast sky, wearing a terracotta-orange oversized heavy cotton hoodie over a white organic cotton t-shirt, dark teal board shorts, and a steel watch. He is in the middle of a laugh, his head tilted about twenty-five degrees toward one shoulder and his gaze directed down toward the sand away from the lens. One hand is brushing a stray hair from his own forehead and the other hand grips the rail of a surfboard standing in the sand. His shoulders are raised and uneven with the motion of the laugh. The background dunes fade twelve metres behind him into soft shapes. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/1000, ISO 50. Keep the deep creases of the laugh, real pore structure, and the sun-bleached texture of the t-shirt collar.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // The last ten briefs, written by hand. Object counts kept at one or two,
  // which is what the rendered frames said separates a shoot that holds from
  // one that rearranges itself.
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "coastal-terrace-wall-midday",
    title: "Coastal terrace, midday",
    kind: "outdoors",
    register: "sharp",
    interests: ["travel"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on a whitewashed terrace above the open sea under a flat bright overcast sky, wearing a bone linen overshirt over a white cotton t-shirt, stone cotton trousers, tan leather boots and a steel watch. He has turned his head about twenty-five degrees toward the lens ahead of his shoulders, mouth closed with one corner lifted, and his eyes are on the lens. One hand rests along the top of the terrace wall with the fingers spread on the render, the other hangs at his side. The sea opens twenty metres beyond him in soft pale bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/2.0, 1/800, ISO 64. Keep pore structure across the nose, the stubble along his jaw, and the open weave of the linen at his collar.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands at the low wall of a whitewashed sea terrace under a flat bright overcast sky, wearing a bone linen overshirt over a white cotton t-shirt, stone cotton trousers, tan leather boots and a steel watch. Both forearms are folded along the top of the wall with one hand loosely over the opposite wrist, and his weight has settled onto one leg so that hip drops. His chin is level and his gaze goes past the lens out along the water, still thinking. The horizon sits forty metres beyond him and loses all detail. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/2.0, 1/640, ISO 64. Keep visible pores, salt haze softening the far water, and the chalky texture of the painted render under his forearms.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on the low wall of a whitewashed sea terrace under a flat bright overcast sky, wearing a bone linen overshirt over a white cotton t-shirt, stone cotton trousers, tan leather boots and a steel watch. One forearm lies across a raised knee with the hand hanging easy, and the other palm is flat on the render beside his hip, so his shoulders sit at different heights. He looks straight to the lens with his chin a little down. The sea opens thirty metres past him in soft grey-blue bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 4:3 three-quarter frame taken from standing height looking slightly down, iPhone 15 Pro, 24mm, f/2.0, 1/640, ISO 64. Keep visible pores, the scuffed grain of the boot leather, and the crumbling edge of the whitewash under his palm.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands at the edge of a whitewashed sea terrace under a flat bright overcast sky, wearing a bone linen overshirt over a white cotton t-shirt, stone cotton trousers, tan leather boots and a steel watch. He laughs with his head dropped toward one shoulder and his gaze falling away from the lens to the tiles, eyes narrowed to creases, caught out by the wind. One hand has come up to push the hair back off his own forehead and the other grips the wall beside him. The water lies twenty-five metres behind him in flat pale grey. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/2.0, 1/800, ISO 64. Keep the creases at the eye corners, real pore structure across the cheekbones, and the linen crumpling where the wind pushes it.",
      },
    ],
  },

  {
    id: "civic-steps-afternoon",
    title: "Stone steps, afternoon",
    kind: "outdoors",
    register: "sharp",
    interests: ["travel", "art"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on the wide stone steps of a plain civic building under a flat bright overcast sky, wearing a putty coloured cotton field jacket over a charcoal merino roll-neck, dark grey trousers, black leather boots and a steel watch. He has turned his head about twenty degrees toward the lens ahead of his shoulders, chin level, and his eyes are on the lens with the mouth closed. One hand is pushed into a jacket pocket to the knuckle and the other rests against the stone balustrade beside him. The building front rises eight metres behind him in soft pale planes. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/2.0, 1/500, ISO 64. Keep pore structure across the nose, the stubble along his jaw, and the dry cotton texture at the jacket collar.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He climbs the wide stone steps of a plain civic building under a flat bright overcast sky, wearing a putty coloured cotton field jacket over a charcoal merino roll-neck, dark grey trousers, black leather boots and a steel watch. He has stopped a step up with one hand trailing on the balustrade and the other adjusting the cuff at his opposite wrist, his weight on the higher foot so one hip lifts. His head is turned away and his gaze goes past the lens back down the steps. The stonework carries ten metres behind him and stays soft. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/2.0, 1/500, ISO 64. Keep visible pores, the raised tendons on the back of the trailing hand, and the pitted grain of the worn stone.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on the wide stone steps of a plain civic building under a flat bright overcast sky, wearing a putty coloured cotton field jacket over a charcoal merino roll-neck, dark grey trousers, black leather boots and a steel watch. One forearm rests across a raised knee with the fingers loose, and the other hand is planted flat on the step behind his hip taking some weight, so his shoulders sit at clearly different heights. He looks up to the lens with his brow slightly raised. The steps run twelve metres past him in soft pale bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 4:3 three-quarter frame taken from standing height, iPhone 15 Pro, 24mm, f/2.0, 1/400, ISO 64. Keep visible pores, individual hairs at his hairline, and the cold grain of the stone under his palm.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands part way up the wide stone steps of a plain civic building under a flat bright overcast sky, wearing a putty coloured cotton field jacket over a charcoal merino roll-neck, dark grey trousers, black leather boots and a steel watch. He laughs with his eyes creased almost shut and his gaze dropping away from the lens to the step below him, having misjudged the last one. One hand is braced on the balustrade and the other has come up flat against his own chest. The frontage sits nine metres behind him in soft pale shapes. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/2.0, 1/500, ISO 64. Keep crow's feet, real pore structure across the cheekbones, and the fine nap of the merino at his throat.",
      },
    ],
  },

  {
    id: "cafe-window-bicycle-morning",
    title: "Cafe window, morning",
    kind: "activity",
    register: "casual",
    interests: ["cycling", "coffee"],
    tags: ["bicycle"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits at the counter along the window of a plain cafe, a road bike propped on the pavement outside, wearing a cherry red merino cycling jersey under a grey cotton overshirt, black cycling shorts, dark trainers and a steel watch. He has turned his head about thirty degrees toward the lens ahead of his shoulders, and his eyes are on the lens with the mouth closed and one corner lifted. One hand is wrapped around a small espresso cup and the other rests flat on the counter beside it. The room runs three metres back behind him in soft pale shapes. A tall window filling the right edge of the frame lays broad soft daylight across him. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/200, ISO 100. Keep pore structure across the nose, damp hair at the temple, and the fine rib of the merino at his collar.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits at the counter along the window of a plain cafe with a road bike propped outside, wearing a cherry red merino cycling jersey under a grey cotton overshirt, black cycling shorts, dark trainers and a steel watch. One elbow is up on the counter with the knuckles resting against his own cheek and the other hand turns the cup slowly by its rim, so one shoulder sits higher. His head is angled away and his gaze goes past the lens out to the bike, still catching his breath. The counter runs four metres along behind him and softens. A tall window filling the right edge of the frame lays broad soft daylight across him. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/200, ISO 100. Keep visible pores, the raised veins along the forearm, and road grit dulling the toe of one trainer.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits side-on at the window counter of a plain cafe with a road bike propped outside, wearing a cherry red merino cycling jersey under a grey cotton overshirt, black cycling shorts, dark trainers and a steel watch. One arm is hooked over the back of the stool and the other hand rests on his thigh, one heel up on the footrail, so his shoulders sit at different heights. He looks straight to the lens with his lips just parted. The room opens five metres past him in soft pale shapes. A tall window filling the right edge of the frame lays broad soft daylight across him. A 4:3 three-quarter frame at seated eye level, iPhone 15 Pro, 24mm, f/1.8, 1/160, ISO 100. Keep visible pores, tan lines at the upper arm, and the worn timber grain of the counter edge.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits at the window counter of a plain cafe with a road bike propped outside, wearing a cherry red merino cycling jersey under a grey cotton overshirt, black cycling shorts, dark trainers and a steel watch. He laughs with his eyes creased and his gaze dropping away from the lens to the counter, having spilled a little of the coffee. One hand is spread flat over his own mouth for a moment and the other steadies the cup, and his shoulders have risen with it. The room sits three metres behind him and stays soft. A tall window filling the right edge of the frame lays broad soft daylight across him. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/200, ISO 100. Keep the creases at the outer corners of the eyes, real pores across the cheeks, and the flushed skin high on his face.",
      },
    ],
  },

  {
    id: "dune-path-board-midday",
    title: "Dune path, midday",
    kind: "activity",
    register: "casual",
    interests: ["surfing"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on a sand path through the dunes under a flat bright overcast sky, marram grass either side, wearing a faded indigo cotton hoodie over navy swim shorts and a steel watch, feet bare. He has turned his head about twenty degrees toward the lens, and his eyes are on the lens with his mouth open on a breath. One hand grips the rail of a surfboard carried under the opposite arm, and that shoulder sits higher with the weight of it. The dunes run twelve metres back behind him in soft pale bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/2.0, 1/1000, ISO 64. Keep pore structure across the nose, salt drying pale at his temple, and the loop-back texture of the hoodie at his collar.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He walks a sand path through the dunes under a flat bright overcast sky, marram grass either side, wearing a faded indigo cotton hoodie over navy swim shorts and a steel watch, feet bare. He carries a surfboard flat on one shoulder with that hand hooked over the nose of it, the other arm swinging low, so one shoulder rides much higher than the other. His head is turned away and his gaze goes past the lens up the path ahead. The grass runs fifteen metres behind him and loses detail. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/2.0, 1/1000, ISO 64. Keep visible pores, dry sand clinging along one calf, and the waxed texture across the board deck.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He crouches on a sand path through the dunes under a flat bright overcast sky, marram grass either side, wearing a faded indigo cotton hoodie over navy swim shorts and a steel watch, feet bare. He is down on one knee beside a surfboard laid flat, one forearm across the raised knee and the other hand pressed into the sand, so his shoulders sit at different heights. He looks up to the lens with his brow slightly raised. The dune line opens eighteen metres past him in soft pale bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 4:3 three-quarter frame taken from standing height looking down at him, iPhone 15 Pro, 24mm, f/2.0, 1/800, ISO 64. Keep visible pores, sand grains stuck to the side of one foot, and the fine ribbed cuff at his wrist.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on a sand path through the dunes under a flat bright overcast sky, marram grass either side, wearing a faded indigo cotton hoodie over navy swim shorts and a steel watch, feet bare. He laughs with his eyes narrowed to creases and his gaze dropping away from the lens to the sand, the board slipping in his grip. One hand snatches at the rail to catch it and the other is thrown out for balance, and his shoulders have risen with the movement. The dunes lie ten metres behind him in soft pale bands. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/2.0, 1/1000, ISO 64. Keep the creases at the eye corners, real pore structure across the cheekbones, and salt-stiffened hair standing where his fingers left it.",
      },
    ],
  },

  {
    id: "hotel-breakfast-terrace-morning",
    title: "Breakfast terrace, morning",
    kind: "social",
    register: "sharp",
    interests: ["dining", "travel"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits at a small table on a plain hotel terrace above a hazy city, wearing a pale caramel cotton overshirt over a white crew-neck t-shirt, stone tailored trousers, brown leather boots and a steel watch. He has turned his head about twenty-five degrees toward the lens ahead of his shoulders, and his eyes are on the lens with the mouth closed and the corners lifted. One hand rests around a small white cup and the other lies open on the tabletop beside it. The rooftops sit thirty metres beyond him in soft pale haze. Broad morning daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/2.0, 1/640, ISO 64. Keep pore structure across the nose, the stubble along his jaw, and the brushed texture of the cotton at his collar.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits at a small table on a plain hotel terrace above a hazy city, wearing a pale caramel cotton overshirt over a white crew-neck t-shirt, stone tailored trousers, brown leather boots and a steel watch. One forearm is laid along the tabletop with the fingers curled loosely and the other elbow rests on the arm of the chair, so one shoulder drops lower. His chin is turned a few degrees and his gaze goes past the lens out over the rooftops, half awake. The terrace runs six metres behind him and stays soft. Broad morning daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/2.0, 1/640, ISO 64. Keep visible pores, forearm hair catching the light, and the cool grain of the tabletop under his wrist.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits back at a small table on a plain hotel terrace above a hazy city, wearing a pale caramel cotton overshirt over a white crew-neck t-shirt, stone tailored trousers, brown leather boots and a steel watch. One ankle is crossed over the opposite knee and one arm is hooked over the chair back while the other hand rests on his shin, so his shoulders sit at clearly different heights. He looks straight to the lens with his lips just parted. The city opens forty metres past him in soft pale haze. Broad morning daylight fills his face evenly from above and slightly in front. A 4:3 three-quarter frame taken from standing height looking slightly down, iPhone 15 Pro, 24mm, f/2.0, 1/500, ISO 64. Keep visible pores, individual hairs at his hairline, and the creased leather across the boot instep.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits at a small table on a plain hotel terrace above a hazy city, wearing a pale caramel cotton overshirt over a white crew-neck t-shirt, stone tailored trousers, brown leather boots and a steel watch. He laughs with his head dropped a few degrees toward one shoulder and his gaze going away from the lens across the terrace, eyes creased almost shut. One hand has come up to rub the corner of his own eye and the other stays around the cup. The rooftops lie thirty-five metres behind him in flat pale haze. Broad morning daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/2.0, 1/640, ISO 64. Keep the creases at the outer corners of the eyes, real pores across the cheeks, and the soft rumple of the overshirt at his elbow.",
      },
    ],
  },

  {
    id: "pottery-doorway-afternoon",
    title: "Pottery doorway, afternoon",
    kind: "activity",
    register: "sharp",
    interests: ["art"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in the open doorway of a working pottery with bare plaster walls behind him, wearing a flax coloured heavy linen work shirt over a charcoal cotton vest, dark canvas trousers, brown leather boots and a steel watch. He has turned his head about fifteen degrees toward the lens, and his eyes are on the lens with the mouth closed and one corner lifted. One hand rests high on the door frame above his shoulder and the other hangs with clay drying on the fingers. The room runs four metres back behind him into soft dark shapes. Broad daylight through the open doorway fills his face evenly from the front and slightly above. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/320, ISO 160. Keep pore structure across the nose, the stubble along his jaw, and dried clay cracking in the creases of his knuckles.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands at a potter's wheel just inside the open doorway of a working pottery, wearing a flax coloured heavy linen work shirt over a charcoal cotton vest, dark canvas trousers, brown leather boots and a steel watch. Both hands are cupped around a rising cylinder of wet clay with one wrist braced against the other, and his head is bowed about ten degrees, his gaze going past the lens down into the work. The room carries five metres behind him in soft dark shapes. Broad daylight through the open doorway fills his face evenly from the front and slightly above. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/1.8, 1/320, ISO 160. Keep visible pores, the wet sheen across the clay, and slip drying to a matte film up his forearms.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on the low sill of the open doorway of a working pottery, wearing a flax coloured heavy linen work shirt over a charcoal cotton vest, dark canvas trousers, brown leather boots and a steel watch. One forearm rests across a raised knee with the fingers hanging loose and the other palm is flat on the sill beside his hip, so his shoulders sit at different heights. He looks up to the lens with his chin level. The yard opens seven metres past him in soft pale light. Broad daylight through the open doorway fills his face evenly from the front and slightly above. A 4:3 three-quarter frame taken from standing height, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 160. Keep visible pores, clay dust greying the knee of his trousers, and the split grain of the old timber sill.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in the open doorway of a working pottery with bare plaster walls behind him, wearing a flax coloured heavy linen work shirt over a charcoal cotton vest, dark canvas trousers, brown leather boots and a steel watch. He laughs with his eyes creased almost shut and his gaze falling away from the lens to the floor, the cylinder having collapsed under his hands. One clay-covered hand is held up clear of his clothes and the other braces on the door frame. The interior sits four metres behind him in soft dark shapes. Broad daylight through the open doorway fills his face evenly from the front and slightly above. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/320, ISO 160. Keep the creases at the eye corners, real pore structure across the cheekbones, and a smear of grey slip along one cheek.",
      },
    ],
  },

  {
    id: "cafe-doorway-square-morning",
    title: "Cafe doorway, morning",
    kind: "social",
    register: "casual",
    interests: ["coffee", "travel"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in the open doorway of a small cafe onto a quiet square, wearing a moss green cotton chore jacket over an ecru waffle-knit long-sleeve, washed black denim, brown leather boots and a steel watch. He has turned his head about twenty-five degrees toward the lens ahead of his shoulders, and his eyes are on the lens with a closed-mouth half-smile. One hand holds a paper cup at chest height and the other rests against the door frame beside him. The square opens nine metres beyond him in soft pale shapes. Broad daylight through the open doorway fills his face evenly from the front and slightly above. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/400, ISO 100. Keep pore structure across the nose, the stubble along his jaw, and the waffle texture at his cuff.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He leans in the open doorway of a small cafe onto a quiet square, wearing a moss green cotton chore jacket over an ecru waffle-knit long-sleeve, washed black denim, brown leather boots and a steel watch. One shoulder is set against the frame and that hand holds the cup low at his hip while the other is pushed into a jacket pocket, dropping the opposite shoulder. His head is turned away and his gaze goes past the lens across the square, following something. The paving runs twelve metres behind him and softens. Broad daylight through the open doorway fills his face evenly from the front and slightly above. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/1.8, 1/400, ISO 100. Keep visible pores, the heavy cotton grain of the chore jacket, and steam lifting off the cup.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on the step of the open doorway of a small cafe onto a quiet square, wearing a moss green cotton chore jacket over an ecru waffle-knit long-sleeve, washed black denim, brown leather boots and a steel watch. One forearm is draped over a raised knee with the cup hanging from the fingers and the other hand is flat on the step beside his hip, so his shoulders sit at different heights. He looks straight to the lens with his lips just parted. The square opens fourteen metres past him in soft pale shapes. Broad daylight through the open doorway fills his face evenly from the front and slightly above. A 4:3 three-quarter frame taken from standing height looking down at him, iPhone 15 Pro, 24mm, f/1.8, 1/320, ISO 100. Keep visible pores, the scuffed grain of the boot leather, and worn paint flaking on the door frame.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in the open doorway of a small cafe onto a quiet square, wearing a moss green cotton chore jacket over an ecru waffle-knit long-sleeve, washed black denim, brown leather boots and a steel watch. He laughs with his head dropped toward one shoulder and his gaze falling away from the lens to the step, eyes narrowed to creases, the coffee far too hot. One hand holds the cup out away from him and the other has come up to his own mouth. The square lies eight metres behind him in soft pale shapes. Broad daylight through the open doorway fills his face evenly from the front and slightly above. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/400, ISO 100. Keep crow's feet, real pore structure across the cheekbones, and the fine knit texture pulling at his shoulder.",
      },
    ],
  },

  {
    id: "pale-wall-portrait-afternoon",
    title: "Pale wall, afternoon",
    kind: "portrait",
    register: "sharp",
    interests: ["reading", "art"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands against a bare pale wall in an empty room, wearing an ink blue lambswool crewneck jumper, dark grey wool trousers and a steel watch. He has turned his head about twenty degrees toward the lens ahead of his shoulders, chin level, and his eyes are on the lens with the mouth closed. One hand is raised to rest against the wall at shoulder height and the other hangs easy at his side. The plaster runs one metre back behind him, smooth and softly lit. A tall window filling the left edge of the frame lays broad soft daylight across him. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/160, ISO 100. Keep pore structure across the nose, the faint shadow of stubble along the jaw, and the fine fibres standing off the lambswool at his shoulder.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands against a bare pale wall in an empty room, wearing an ink blue lambswool crewneck jumper, dark grey wool trousers and a steel watch. He has both forearms folded across his chest with one hand tucked under the opposite upper arm, and his weight has settled onto one leg so that hip drops. His chin is turned a few degrees and his gaze goes past the lens toward the light, mid-thought. The plaster sits half a metre behind him and holds an even tone. A tall window filling the left edge of the frame lays broad soft daylight across him. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/160, ISO 100. Keep visible pores, individual hairs at his hairline, and the soft roll of the jumper cuff at his wrist.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on the bare floorboards with his back against a pale wall in an empty room, wearing an ink blue lambswool crewneck jumper, dark grey wool trousers and a steel watch. One knee is drawn up with a forearm draped over it and the other leg stretches out, that hand resting palm-down on the boards, so his shoulders sit at different heights. He looks up to the lens with his brow slightly raised. The wall rises two metres past him in even soft tone. A tall window filling the left edge of the frame lays broad soft daylight across him. A 4:3 three-quarter frame taken from standing height looking down at him, iPhone 15 Pro, 24mm, f/1.8, 1/125, ISO 100. Keep visible pores, the worn grain of the floorboards under his palm, and the wool pilling slightly at his elbow.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands against a bare pale wall in an empty room, wearing an ink blue lambswool crewneck jumper, dark grey wool trousers and a steel watch. He laughs with his eyes creased almost shut and his gaze dropping away from the lens to the floor, having lost the thread of what he was saying. One hand is pressed flat against the wall behind him and the other has come up to the back of his own neck, lifting that shoulder. The plaster stays one metre behind him and even. A tall window filling the left edge of the frame lays broad soft daylight across him. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/160, ISO 100. Keep the creases at the outer corners of the eyes, real pores across the cheeks, and the knit texture stretching where the arm lifts.",
      },
    ],
  },

  {
    id: "dark-wall-flash-night",
    title: "Dark wall, night",
    kind: "portrait",
    register: "street",
    interests: ["music", "nightlife"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands against a plain dark wall at night, wearing an oxblood leather bomber jacket over a black cotton t-shirt, dark indigo denim, black canvas high-tops and a steel watch. He has turned his head about fifteen degrees toward the lens, chin a touch down, and his eyes are on the lens from under the brow. One hand is lifted to the zip pull at his chest and the other hangs at his side. The wall sits one metre behind him and falls away into black. Direct on-camera flash reaches him frontally, metered for his face so the skin holds detail and the fall-off happens behind him. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/125, ISO 400. Keep the fine lines at the corners of his eyes, pores across the cheeks, and the creased grain of the leather at his shoulder.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands against a plain dark wall at night, wearing an oxblood leather bomber jacket over a black cotton t-shirt, dark indigo denim, black canvas high-tops and a steel watch. One shoulder is set back against the wall with that hand pushed into a jacket pocket while the other rests against the brick at hip height, dropping the opposite shoulder. His head is turned away and his gaze goes past the lens down the dark, hearing something. The wall runs two metres behind him into black. Direct on-camera flash reaches him frontally, metered for his face so the skin holds detail and the fall-off happens behind him. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/1.8, 1/120, ISO 400. Keep visible pores, the weave of the cotton at his chest, and the hard specular edge along the zip teeth.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He crouches on his heels against a plain dark wall at night, wearing an oxblood leather bomber jacket over a black cotton t-shirt, dark indigo denim, black canvas high-tops and a steel watch. One forearm rests across a raised knee with the fingers hanging and the other hand is braced on the ground beside his shoe, so his shoulders sit at different heights. He looks straight to the lens with his chin level. The wall rises three metres past him and goes to black. Direct on-camera flash reaches him frontally, metered for his face so the skin holds detail and the fall-off happens behind him. A 4:3 three-quarter frame taken from standing height looking down at him, iPhone 15 Pro, 24mm, f/1.8, 1/120, ISO 400. Keep visible pores, the rubber grain of the shoe sole, and the hard highlight the flash raises on his knuckles.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands against a plain dark wall at night, wearing an oxblood leather bomber jacket over a black cotton t-shirt, dark indigo denim, black canvas high-tops and a steel watch. He laughs with his head dropped a few degrees toward one shoulder, teeth showing and his gaze going away from the lens along the wall, caught mid-sentence. One hand has come up flat against his own chest and the other stays loose at his side. The brick lies one metre behind him and falls to black. Direct on-camera flash reaches him frontally, metered for his face so the laugh lines read sharply. A 3:4 chest-up frame from the shoulders up, framed low so there is headroom above him, iPhone 15 Pro, 24mm, f/1.8, 1/125, ISO 400. Keep crow's feet, real pore structure, and the shine the flash raises across the forehead.",
      },
    ],
  },

  {
    id: "clubhouse-wall-overcast",
    title: "Clubhouse wall, midday",
    kind: "portrait",
    register: "sharp",
    interests: ["golf", "sailing"],
    frames: [
      {
        framing: "close",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands against the plain painted wall of a clubhouse under a flat bright overcast sky, wearing a buttermilk cotton cable knit over a pale blue collared shirt, navy cotton trousers, brown leather boots and a steel watch. He has turned his head about twenty degrees toward the lens ahead of his shoulders, and his eyes are on the lens with the mouth closed and the corners lifted. One hand is hooked by the thumb into a trouser pocket and the other rests back against the boards behind him. The wall sits one metre behind him in even flat tone. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/2.0, 1/500, ISO 64. Keep pore structure across the nose, the stubble along his jaw, and the raised cable texture running over his shoulder.",
      },
      {
        framing: "medium",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands against the plain painted wall of a clubhouse under a flat bright overcast sky, wearing a buttermilk cotton cable knit over a pale blue collared shirt, navy cotton trousers, brown leather boots and a steel watch. One hand works at the rolled cuff on the opposite forearm while that arm hangs across his front, and his weight rests on one leg so the other hip lifts. His chin is turned a few degrees and his gaze goes past the lens along the frontage, waiting on a tee time. The boards run two metres behind him and stay even. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/2.0, 1/500, ISO 64. Keep visible pores, wind-lifted hair at the crown, and the crisp collar edge sitting above the knit.",
      },
      {
        framing: "threeQuarter",
        imageSize: LANDSCAPE_4_3,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on a low painted step at the foot of a clubhouse wall under a flat bright overcast sky, wearing a buttermilk cotton cable knit over a pale blue collared shirt, navy cotton trousers, brown leather boots and a steel watch. One forearm lies across a raised knee with the fingers curled and the other hand is flat on the step beside his hip, so his shoulders sit at different heights. He looks up to the lens with his lips just parted. The boarding rises three metres past him in even soft tone. Broad overcast daylight fills his face evenly from above and slightly in front. A 4:3 three-quarter frame taken from standing height looking slightly down, iPhone 15 Pro, 24mm, f/2.0, 1/400, ISO 64. Keep visible pores, the flaking grain of the painted timber, and salt-dulled leather at the boot toe.",
      },
      {
        framing: "expression",
        imageSize: PORTRAIT_3_4,
        prompt:
          "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands against the plain painted wall of a clubhouse under a flat bright overcast sky, wearing a buttermilk cotton cable knit over a pale blue collared shirt, navy cotton trousers, brown leather boots and a steel watch. He laughs with his eyes narrowed to creases and his gaze dropping away from the lens to the grass at his feet, shaking his head at something said. One hand grips the opposite forearm across his body and his shoulders have risen with the laugh. The wall stays one metre behind him and even. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/2.0, 1/500, ISO 64. Keep the creases at the eye corners, real pore structure across the cheekbones, and the fine halo of fibres standing off the cable knit.",
      },
    ],
  },
];

/**
 * Join prompt prose to its explicit semantic review.
 *
 * Missing metadata is a startup/build error. Silently deriving a family from an
 * id would recreate the exact loophole this layer exists to close.
 */
export const SHOOTS: readonly Shoot[] = SHOOT_DEFINITIONS.map((definition) => {
  const metadata = SHOOT_CATALOG[definition.id];
  if (!metadata) {
    throw new Error(`Shoot ${definition.id} is missing shoot-catalog metadata`);
  }
  return { ...definition, ...metadata };
});

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
