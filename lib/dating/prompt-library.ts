import { deriveRatioLabel } from "./aspect-ratio";
import { DATING_BUCKETS, type DatingBucket, type StylePref, type Vibe } from "./types";

/**
 * Feeds `selectDatingPromptVariant`, so bumping this reshuffles which variant a
 * new batch draws for each slot. Orders already allocated are unaffected: their
 * compiled prompts are snapshotted per row at creation time.
 */
export const DATING_PROMPT_LIBRARY_VERSION = 4;
export type DatingPromptVariant = "a" | "b" | "c";

export type DatingImageSize = { width: number; height: number };

export type DatingPromptDefinition = {
  id: string;
  version: 4;
  bucket: DatingBucket;
  slot: number;
  variant: DatingPromptVariant;
  /** Authored output dimensions, chosen per shot type. */
  imageSize: DatingImageSize;
  promptTemplate: string;
  /** Stands alone with no scene tokens: the venue depends on the hobby. */
  hobbyPromptTemplate?: string;
  locations: Record<Vibe, string>;
  /** What sits behind him, per vibe, for the depth-staging clause. */
  backdrops: Record<Vibe, string>;
  outfits: Record<StylePref, string>;
};

/**
 * V4 production library: three independently directed variants for every
 * delivered slot, across five buckets.
 *
 * The architecture, in clause order: a positive identity statement, the scene
 * and wardrobe, his hands and the action beat with an explicit gaze target,
 * staged background depth via `{{backdrop}}`, the light, the framing and camera,
 * and a texture close. Nothing is phrased as a negative anywhere in the library —
 * Seedream reads negation as affirmation, so v3's "no smoothing" and "do not
 * alter his face" were requesting the very look they were written to prevent.
 *
 * Runtime compilation substitutes only preference values.
 */
export const DATING_PROMPTS = [
  {
    "id": "anchor-01-a",
    "version": 4,
    "bucket": "anchor",
    "slot": 1,
    "variant": "a",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. A takeaway coffee sits in one hand and the other stays loose at his side. A friend calls his name as he walks out; his body keeps moving forward while his face turns back to the lens and a small smile starts to break. He is four metres clear of {{backdrop}}, all of it receding into soft warm bokeh. Broad indirect daylight gives soft highlight rolloff and clean separation between him and the depth behind. A 3:4 chest-up frame at eye level with relaxed headroom, Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights, with skin that keeps its own grain.",
    "locations": {
      "urban": "a pale-stone city colonnade",
      "outdoorsy": "a shaded park pavilion",
      "homebody": "a bright apartment balcony doorway"
    },
    "backdrops": {
      "urban": "repeating stone arches, a lit shopfront and one blurred passer-by",
      "outdoorsy": "pavilion posts, a slatted bench and a bank of green foliage",
      "homebody": "an open living room, a floor lamp and the soft edge of a bookshelf"
    },
    "outfits": {
      "casual": "an oatmeal waffle henley with the sleeves pushed to mid-forearm and dark jeans",
      "sharp": "a charcoal blazer over a white crew-neck tee with dark trousers",
      "street": "a washed-indigo denim jacket over a white tee"
    }
  },
  {
    "id": "anchor-01-b",
    "version": 4,
    "bucket": "anchor",
    "slot": 1,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He keeps one shoulder against the wall with both hands loose in front of him. He finishes answering a question, pauses, and holds the photographer's eyes with an attentive expression before the next sentence. Three metres behind him, {{backdrop}} soften into gentle blur. Soft side light and wall bounce keep both eyes clear and hold the modelling across his face. A 3:4 waist-up frame from just beside the photographer's conversation line, Canon R5, 85mm, f/2, 1/320, ISO 400. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff, with pores and fine lines intact.",
    "locations": {
      "urban": "a pale-stone city colonnade",
      "outdoorsy": "a shaded park pavilion",
      "homebody": "a bright apartment balcony doorway"
    },
    "backdrops": {
      "urban": "repeating stone arches, a lit shopfront and one blurred passer-by",
      "outdoorsy": "pavilion posts, a slatted bench and a bank of green foliage",
      "homebody": "an open living room, a floor lamp and the soft edge of a bookshelf"
    },
    "outfits": {
      "casual": "a rust corduroy overshirt open over a cream tee with dark denim",
      "sharp": "a camel overcoat over a black fine-knit",
      "street": "a black bomber over a heather-grey tee"
    }
  },
  {
    "id": "anchor-01-c",
    "version": 4,
    "bucket": "anchor",
    "slot": 1,
    "variant": "c",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He settles a coffee into one hand and hooks his thumb into a pocket. Someone behind the camera makes him laugh and he looks straight down the lens as it lands. Five metres back, {{backdrop}} fall away into an easy wash of light and shape. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. A 3:4 friend-taken medium portrait with slightly imperfect but intentional framing, iPhone 15 Pro at 48mm equivalent, standard photo mode. Show distance-appropriate facial detail, flyaway hairs, and fabric creases, letting the lens render depth on its own.",
    "locations": {
      "urban": "a pale-stone city colonnade",
      "outdoorsy": "a shaded park pavilion",
      "homebody": "a bright apartment balcony doorway"
    },
    "backdrops": {
      "urban": "repeating stone arches, a lit shopfront and one blurred passer-by",
      "outdoorsy": "pavilion posts, a slatted bench and a bank of green foliage",
      "homebody": "an open living room, a floor lamp and the soft edge of a bookshelf"
    },
    "outfits": {
      "casual": "a forest-green crewneck pushed up at the cuffs over a white tee",
      "sharp": "a light-blue oxford with the sleeves rolled and navy chinos",
      "street": "a sand canvas chore jacket over a black tee"
    }
  },
  {
    "id": "anchor-02-a",
    "version": 4,
    "bucket": "anchor",
    "slot": 2,
    "variant": "a",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He has just set his phone face down beside him and rests both forearms on the ledge. He turns from the view and smiles as the conversation picks up again, eyes coming back to the lens. Six metres of open air separate him from {{backdrop}}, which reads as soft graded light. Broad indirect daylight gives soft highlight rolloff and clean separation between him and the depth behind. A 3:4 waist-up frame from seated eye height with both hands visible, Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights, with skin that keeps its own grain.",
    "locations": {
      "urban": "a pale-stone city colonnade",
      "outdoorsy": "a shaded park pavilion",
      "homebody": "a bright apartment balcony doorway"
    },
    "backdrops": {
      "urban": "stone piers, deep shadow and a bright street mouth at the far end",
      "outdoorsy": "dappled parkland and a gravel path curving out of frame",
      "homebody": "balcony railings and a hazy row of rooftops"
    },
    "outfits": {
      "casual": "a sand henley under a washed-indigo chore jacket with dark jeans",
      "sharp": "a bottle-green knit polo with charcoal tailored trousers",
      "street": "a rust hooded overshirt over a cream tee"
    }
  },
  {
    "id": "anchor-02-b",
    "version": 4,
    "bucket": "anchor",
    "slot": 2,
    "variant": "b",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. One hand rests on the stone edge while the other holds a folded jacket. He leans forward to hear the photographer over the noise, then eases back with his attention still on the lens. Four metres behind him, {{backdrop}} drop into a quiet blur. Soft side light and wall bounce keep both eyes clear and hold the modelling across his face. A 3:4 chest-up frame with his face on the upper third, Canon R5, 85mm, f/2, 1/320, ISO 400. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff, with pores and fine lines intact.",
    "locations": {
      "urban": "a pale-stone city colonnade",
      "outdoorsy": "a shaded park pavilion",
      "homebody": "a bright apartment balcony doorway"
    },
    "backdrops": {
      "urban": "stone piers, deep shadow and a bright street mouth at the far end",
      "outdoorsy": "dappled parkland and a gravel path curving out of frame",
      "homebody": "balcony railings and a hazy row of rooftops"
    },
    "outfits": {
      "casual": "a burgundy waffle henley with dark chinos and the sleeves at three-quarter",
      "sharp": "a stone linen blazer over a white tee",
      "street": "a faded army-green field jacket over a white tee"
    }
  },
  {
    "id": "anchor-02-c",
    "version": 4,
    "bucket": "anchor",
    "slot": 2,
    "variant": "c",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He shifts toward the daylight with one hand still on the doorframe. He answers the photographer and looks off to his left as he finishes the thought, expression open. Behind him at eight metres, {{backdrop}} melt into haze. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. A 3:4 knee-up frame from a natural conversational distance, iPhone 15 Pro at 48mm equivalent, standard photo mode. Show distance-appropriate facial detail, flyaway hairs, and fabric creases, letting the lens render depth on its own.",
    "locations": {
      "urban": "a pale-stone city colonnade",
      "outdoorsy": "a shaded park pavilion",
      "homebody": "a bright apartment balcony doorway"
    },
    "backdrops": {
      "urban": "stone piers, deep shadow and a bright street mouth at the far end",
      "outdoorsy": "dappled parkland and a gravel path curving out of frame",
      "homebody": "balcony railings and a hazy row of rooftops"
    },
    "outfits": {
      "casual": "a faded olive sweatshirt with straight-leg grey denim",
      "sharp": "a burgundy fine-knit under a grey wool jacket",
      "street": "a cream boxy overshirt over a charcoal tee"
    }
  },
  {
    "id": "anchor-03-a",
    "version": 4,
    "bucket": "anchor",
    "slot": 3,
    "variant": "a",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He pushes away from the wall with one palm, a bag strap over the other shoulder. A comment catches him before the first step and lifts his expression as he looks back at the lens. Five metres out, {{backdrop}} dissolve into warm points of light. Broad indirect daylight gives soft highlight rolloff and clean separation between him and the depth behind. A 3:4 chest-up frame at eye level, Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights, with skin that keeps its own grain.",
    "locations": {
      "urban": "a pale-stone city colonnade",
      "outdoorsy": "a shaded park pavilion",
      "homebody": "a bright apartment balcony doorway"
    },
    "backdrops": {
      "urban": "wet pavement catching shopfront light and a row of parked bicycles",
      "outdoorsy": "tall trees, a low stone wall and drifting leaf shadow",
      "homebody": "sheer curtains lifting and warm interior lamplight"
    },
    "outfits": {
      "casual": "a cream fisherman knit with dark jeans",
      "sharp": "a crisp white shirt open at the collar with dark trousers",
      "street": "a brown suede trucker over a white tee"
    }
  },
  {
    "id": "anchor-03-b",
    "version": 4,
    "bucket": "anchor",
    "slot": 3,
    "variant": "b",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He finishes fastening one cuff and lowers both hands. A follow-up question catches him and he gives the photographer an easy half-smile straight into the lens. The scene opens back seven metres to {{backdrop}}, held in soft focus. Soft side light and wall bounce keep both eyes clear and hold the modelling across his face. A 4:3 wide environmental frame at eye level with him set left of centre, Canon R5, 85mm, f/2, 1/320, ISO 400. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff, with pores and fine lines intact.",
    "locations": {
      "urban": "a pale-stone city colonnade",
      "outdoorsy": "a shaded park pavilion",
      "homebody": "a bright apartment balcony doorway"
    },
    "backdrops": {
      "urban": "wet pavement catching shopfront light and a row of parked bicycles",
      "outdoorsy": "tall trees, a low stone wall and drifting leaf shadow",
      "homebody": "sheer curtains lifting and warm interior lamplight"
    },
    "outfits": {
      "casual": "a charcoal marl tee under an open brown flannel",
      "sharp": "a navy unstructured blazer over an ecru tee",
      "street": "a slate windbreaker over a black tee"
    }
  },
  {
    "id": "anchor-03-c",
    "version": 4,
    "bucket": "anchor",
    "slot": 3,
    "variant": "c",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. Both hands are pushed into his jacket pockets. He glances toward the street, hears a joke from behind the camera, and turns back to the lens with a restrained genuine smile. Four metres behind, {{backdrop}} sit clearly out of focus. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. A 3:4 friend-taken chest-up portrait held slightly off-centre, iPhone 15 Pro at 48mm equivalent, standard photo mode. Show distance-appropriate facial detail, flyaway hairs, and fabric creases, letting the lens render depth on its own.",
    "locations": {
      "urban": "a pale-stone city colonnade",
      "outdoorsy": "a shaded park pavilion",
      "homebody": "a bright apartment balcony doorway"
    },
    "backdrops": {
      "urban": "wet pavement catching shopfront light and a row of parked bicycles",
      "outdoorsy": "tall trees, a low stone wall and drifting leaf shadow",
      "homebody": "sheer curtains lifting and warm interior lamplight"
    },
    "outfits": {
      "casual": "a slate-blue linen shirt worn open over a white tee",
      "sharp": "a slate merino roll-neck with charcoal trousers",
      "street": "a burgundy varsity-cut jacket over a grey tee"
    }
  },
  {
    "id": "anchor-04-a",
    "version": 4,
    "bucket": "anchor",
    "slot": 4,
    "variant": "a",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. One forearm rests on the table beside a half-finished flat white, the other hand curled round the cup. He stops mid-thought and looks directly at the photographer as his expression softens. Three metres back, {{backdrop}} fall into warm bokeh. Broad indirect daylight gives soft highlight rolloff and clean separation between him and the depth behind. A 3:4 waist-up frame at seated eye level, Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights, with skin that keeps its own grain.",
    "locations": {
      "urban": "a quiet design café window",
      "outdoorsy": "a lodge reading corner",
      "homebody": "a tidy living-room window"
    },
    "backdrops": {
      "urban": "a café counter, backlit bottles on a shelf and a low pendant lamp",
      "outdoorsy": "timber lodge shelving, a stone hearth and stacked books",
      "homebody": "a lived-in sofa, a trailing plant and a warm side lamp"
    },
    "outfits": {
      "casual": "a heather-grey henley with black jeans",
      "sharp": "a tobacco suede jacket over a white shirt",
      "street": "a stone utility vest over a long-sleeve black tee"
    }
  },
  {
    "id": "anchor-04-b",
    "version": 4,
    "bucket": "anchor",
    "slot": 4,
    "variant": "b",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He turns from a small card he was reading and lets it drop flat under one hand. He holds the photographer's gaze for a quiet beat. Behind him at four metres, {{backdrop}} soften while keeping their shape. Soft side light and wall bounce keep both eyes clear and hold the modelling across his face. A 3:4 chest-up frame at eye level, Canon R5, 85mm, f/2, 1/320, ISO 400. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff, with pores and fine lines intact.",
    "locations": {
      "urban": "a quiet design café window",
      "outdoorsy": "a lodge reading corner",
      "homebody": "a tidy living-room window"
    },
    "backdrops": {
      "urban": "a café counter, backlit bottles on a shelf and a low pendant lamp",
      "outdoorsy": "timber lodge shelving, a stone hearth and stacked books",
      "homebody": "a lived-in sofa, a trailing plant and a warm side lamp"
    },
    "outfits": {
      "casual": "a mustard-flecked knit polo with stone chinos",
      "sharp": "a black knit polo with stone tailored trousers",
      "street": "an ecru linen overshirt over a washed-black tee"
    }
  },
  {
    "id": "anchor-04-c",
    "version": 4,
    "bucket": "anchor",
    "slot": 4,
    "variant": "c",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He carries a jacket folded over one forearm and slows as his name is called. He looks back over his shoulder at the lens while his body stays angled away. Six metres beyond him, {{backdrop}} blur into an ordinary lived-in wash. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. A 3:4 friend-taken medium portrait with slightly imperfect but intentional framing, iPhone 15 Pro at 48mm equivalent, standard photo mode. Show distance-appropriate facial detail, flyaway hairs, and fabric creases, letting the lens render depth on its own.",
    "locations": {
      "urban": "a quiet design café window",
      "outdoorsy": "a lodge reading corner",
      "homebody": "a tidy living-room window"
    },
    "backdrops": {
      "urban": "a café counter, backlit bottles on a shelf and a low pendant lamp",
      "outdoorsy": "timber lodge shelving, a stone hearth and stacked books",
      "homebody": "a lived-in sofa, a trailing plant and a warm side lamp"
    },
    "outfits": {
      "casual": "a washed-black tee under an ecru canvas overshirt",
      "sharp": "a rust silk-blend shirt with black trousers",
      "street": "a forest quilted jacket over a cream tee"
    }
  },
  {
    "id": "anchor-05-a",
    "version": 4,
    "bucket": "anchor",
    "slot": 5,
    "variant": "a",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He adjusts the cuff of his sleeve after sitting down, hands still working as he speaks. He looks up into the lens while the photographer is still talking. Four metres behind him, {{backdrop}} settle into soft graded tone. Broad indirect daylight gives soft highlight rolloff and clean separation between him and the depth behind. A 3:4 waist-up frame at seated eye level, Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights, with skin that keeps its own grain.",
    "locations": {
      "urban": "a quiet design café window",
      "outdoorsy": "a lodge reading corner",
      "homebody": "a tidy living-room window"
    },
    "backdrops": {
      "urban": "the window's bright street edge, a menu board and blurred pedestrians",
      "outdoorsy": "a tall lodge window, pine shadow and a worn leather chair",
      "homebody": "a framed print, an open doorway and a strip of hall light"
    },
    "outfits": {
      "casual": "a terracotta long-sleeve tee with indigo jeans",
      "sharp": "a chalk-striped grey jacket over a black tee",
      "street": "a charcoal hoodie under a washed denim jacket"
    }
  },
  {
    "id": "anchor-05-b",
    "version": 4,
    "bucket": "anchor",
    "slot": 5,
    "variant": "b",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He sets a cup down below the frame and keeps one forearm on the table. A remark from across the table pulls a real smile as he looks into the lens. Three metres out, {{backdrop}} render as warm shapes and lifted highlights. Soft side light and wall bounce keep both eyes clear and hold the modelling across his face. A 3:4 chest-up frame from across the table, Canon R5, 85mm, f/2, 1/320, ISO 400. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff, with pores and fine lines intact.",
    "locations": {
      "urban": "a quiet design café window",
      "outdoorsy": "a lodge reading corner",
      "homebody": "a tidy living-room window"
    },
    "backdrops": {
      "urban": "the window's bright street edge, a menu board and blurred pedestrians",
      "outdoorsy": "a tall lodge window, pine shadow and a worn leather chair",
      "homebody": "a framed print, an open doorway and a strip of hall light"
    },
    "outfits": {
      "casual": "a plum merino crewneck with dark denim",
      "sharp": "a forest wool overshirt over a white oxford",
      "street": "a mustard corduroy trucker over a white tee"
    }
  },
  {
    "id": "anchor-05-c",
    "version": 4,
    "bucket": "anchor",
    "slot": 5,
    "variant": "c",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He steps away from the window, smooths the front of his jacket once with a flat hand, and turns to the lens when the photographer calls to him, weight still on his back foot. Seven metres of room open up behind him to {{backdrop}}, all softly out of focus. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. A 9:16 friend-taken full-length frame from a low natural height, iPhone 15 Pro at 48mm equivalent, standard photo mode. Show distance-appropriate facial detail, flyaway hairs, and fabric creases, letting the lens render depth on its own.",
    "locations": {
      "urban": "a quiet design café window",
      "outdoorsy": "a lodge reading corner",
      "homebody": "a tidy living-room window"
    },
    "backdrops": {
      "urban": "the window's bright street edge, a menu board and blurred pedestrians",
      "outdoorsy": "a tall lodge window, pine shadow and a worn leather chair",
      "homebody": "a framed print, an open doorway and a strip of hall light"
    },
    "outfits": {
      "casual": "a chocolate-brown corduroy shirt with faded jeans",
      "sharp": "a cream shawl-collar knit with dark trousers",
      "street": "a navy coach jacket over an oatmeal tee"
    }
  },
  {
    "id": "anchor-06-a",
    "version": 4,
    "bucket": "anchor",
    "slot": 6,
    "variant": "a",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He walks past at an easy pace with a cup in one hand. A familiar voice reaches him and he looks over to the lens while his stride carries on. Five metres behind, {{backdrop}} compress into a warm blur. Broad indirect daylight gives soft highlight rolloff and clean separation between him and the depth behind. A 3:4 chest-up frame at eye level with room ahead of him, Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights, with skin that keeps its own grain.",
    "locations": {
      "urban": "a quiet design café window",
      "outdoorsy": "a lodge reading corner",
      "homebody": "a tidy living-room window"
    },
    "backdrops": {
      "urban": "espresso machine steam, hanging bulbs and dark timber panelling",
      "outdoorsy": "a reading lamp, a stone chimney breast and a wool throw",
      "homebody": "a kitchen doorway, a shelf of mugs and morning light on the wall"
    },
    "outfits": {
      "casual": "a bone-white waffle henley with olive chinos",
      "sharp": "a mid-brown corduroy blazer over a sand knit",
      "street": "a terracotta fleece half-zip over a white tee"
    }
  },
  {
    "id": "anchor-06-b",
    "version": 4,
    "bucket": "anchor",
    "slot": 6,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He waits with both hands relaxed in his pockets, then leans forward slightly to reply, eyes staying on the photographer. Four metres back, {{backdrop}} lose detail into soft tone. Soft side light and wall bounce keep both eyes clear and hold the modelling across his face. A 3:4 waist-up frame at eye level, Canon R5, 85mm, f/2, 1/320, ISO 400. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff, with pores and fine lines intact.",
    "locations": {
      "urban": "a quiet design café window",
      "outdoorsy": "a lodge reading corner",
      "homebody": "a tidy living-room window"
    },
    "backdrops": {
      "urban": "espresso machine steam, hanging bulbs and dark timber panelling",
      "outdoorsy": "a reading lamp, a stone chimney breast and a wool throw",
      "homebody": "a kitchen doorway, a shelf of mugs and morning light on the wall"
    },
    "outfits": {
      "casual": "a chambray shirt with the sleeves rolled and dark chinos",
      "sharp": "an ink-blue shirt buttoned to the collar with grey trousers",
      "street": "a black waxed-cotton jacket over a bone tee"
    }
  },
  {
    "id": "anchor-06-c",
    "version": 4,
    "bucket": "anchor",
    "slot": 6,
    "variant": "c",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He slows at the corner with one hand on a chair back and lets someone pass. He gives the photographer an amused side glance from the corner of his eye. Six metres beyond him, {{backdrop}} sit fully soft. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. A 3:4 friend-taken chest-up portrait with casual headroom, iPhone 15 Pro at 48mm equivalent, standard photo mode. Show distance-appropriate facial detail, flyaway hairs, and fabric creases, letting the lens render depth on its own.",
    "locations": {
      "urban": "a quiet design café window",
      "outdoorsy": "a lodge reading corner",
      "homebody": "a tidy living-room window"
    },
    "backdrops": {
      "urban": "espresso machine steam, hanging bulbs and dark timber panelling",
      "outdoorsy": "a reading lamp, a stone chimney breast and a wool throw",
      "homebody": "a kitchen doorway, a shelf of mugs and morning light on the wall"
    },
    "outfits": {
      "casual": "a rust-flecked wool overshirt over a cream tee",
      "sharp": "a taupe field jacket over a fine black knit",
      "street": "a grey marl hoodie under a stone canvas overshirt"
    }
  },
  {
    "id": "anchor-07-a",
    "version": 4,
    "bucket": "anchor",
    "slot": 7,
    "variant": "a",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. His hands are loosely clasped in front of him. He looks down while considering the question, then raises his eyes to the lens as a genuine answer forms. Three metres behind him, {{backdrop}} hold texture while dropping softly out of focus. Broad indirect daylight gives soft highlight rolloff and clean separation between him and the depth behind. A 3:4 chest-up frame at eye level, Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights, with skin that keeps its own grain.",
    "locations": {
      "urban": "a warm brick side-street wall",
      "outdoorsy": "a weathered visitor-center wall",
      "homebody": "a simple home courtyard wall"
    },
    "backdrops": {
      "urban": "warm brick coursing, a downpipe and a slice of bright street beyond",
      "outdoorsy": "weathered timber cladding, an interpretive sign and open sky",
      "homebody": "rendered wall, a climbing plant and a painted door"
    },
    "outfits": {
      "casual": "a deep-teal crewneck with stone-grey jeans",
      "sharp": "a soft-grey flannel jacket over a white tee",
      "street": "a teal windbreaker over a heather tee"
    }
  },
  {
    "id": "anchor-07-b",
    "version": 4,
    "bucket": "anchor",
    "slot": 7,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He straightens after checking the fit of his sleeve and lowers both hands to his sides. He meets the lens in the pause that follows. Two metres back, {{backdrop}} stay legible under a gentle blur. Soft side light and wall bounce keep both eyes clear and hold the modelling across his face. A 3:4 waist-up frame at eye level, Canon R5, 85mm, f/2, 1/320, ISO 400. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff, with pores and fine lines intact.",
    "locations": {
      "urban": "a warm brick side-street wall",
      "outdoorsy": "a weathered visitor-center wall",
      "homebody": "a simple home courtyard wall"
    },
    "backdrops": {
      "urban": "warm brick coursing, a downpipe and a slice of bright street beyond",
      "outdoorsy": "weathered timber cladding, an interpretive sign and open sky",
      "homebody": "rendered wall, a climbing plant and a painted door"
    },
    "outfits": {
      "casual": "an oat cardigan over a white tee with dark jeans",
      "sharp": "a deep-olive blazer over a cream shirt",
      "street": "a chocolate shearling-collar trucker over a cream tee"
    }
  },
  {
    "id": "anchor-07-c",
    "version": 4,
    "bucket": "anchor",
    "slot": 7,
    "variant": "c",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. One shoulder rests on the wall with a phone loose in the near hand. He listens with his head slightly turned toward the photographer, then smiles into the lens while his stance stays relaxed. Four metres out, {{backdrop}} recede into an unremarkable soft field. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. A 3:4 friend-taken medium portrait with slightly imperfect but intentional framing, iPhone 15 Pro at 48mm equivalent, standard photo mode. Show distance-appropriate facial detail, flyaway hairs, and fabric creases, letting the lens render depth on its own.",
    "locations": {
      "urban": "a warm brick side-street wall",
      "outdoorsy": "a weathered visitor-center wall",
      "homebody": "a simple home courtyard wall"
    },
    "backdrops": {
      "urban": "warm brick coursing, a downpipe and a slice of bright street beyond",
      "outdoorsy": "weathered timber cladding, an interpretive sign and open sky",
      "homebody": "rendered wall, a climbing plant and a painted door"
    },
    "outfits": {
      "casual": "an oatmeal waffle henley with the sleeves pushed to mid-forearm and dark jeans",
      "sharp": "a charcoal blazer over a white crew-neck tee with dark trousers",
      "street": "a washed-indigo denim jacket over a white tee"
    }
  },
  {
    "id": "anchor-08-a",
    "version": 4,
    "bucket": "anchor",
    "slot": 8,
    "variant": "a",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He sits forward on a low ledge telling a short story, hands moving with it. He finishes the last line and holds the photographer's gaze as his hands settle on his knees. Five metres behind him, {{backdrop}} go quietly soft. Broad indirect daylight gives soft highlight rolloff and clean separation between him and the depth behind. A 3:4 knee-up frame from a low seated height, Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights, with skin that keeps its own grain.",
    "locations": {
      "urban": "a warm brick side-street wall",
      "outdoorsy": "a weathered visitor-center wall",
      "homebody": "a simple home courtyard wall"
    },
    "backdrops": {
      "urban": "a brick alcove, a shuttered doorway and pooled shade",
      "outdoorsy": "a low wall, seed heads moving and a treeline",
      "homebody": "courtyard paving, a terracotta pot and a garden chair"
    },
    "outfits": {
      "casual": "a rust corduroy overshirt open over a cream tee with dark denim",
      "sharp": "a camel overcoat over a black fine-knit",
      "street": "a black bomber over a heather-grey tee"
    }
  },
  {
    "id": "anchor-08-b",
    "version": 4,
    "bucket": "anchor",
    "slot": 8,
    "variant": "b",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He slides along the bench to make room, one hand braced on the seat. He looks up with an open, attentive expression directed at the lens. The frame opens back six metres to {{backdrop}}, held in soft focus. Soft side light and wall bounce keep both eyes clear and hold the modelling across his face. A 4:3 wide environmental frame at seated height with him right of centre, Canon R5, 85mm, f/2, 1/320, ISO 400. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff, with pores and fine lines intact.",
    "locations": {
      "urban": "a warm brick side-street wall",
      "outdoorsy": "a weathered visitor-center wall",
      "homebody": "a simple home courtyard wall"
    },
    "backdrops": {
      "urban": "a brick alcove, a shuttered doorway and pooled shade",
      "outdoorsy": "a low wall, seed heads moving and a treeline",
      "homebody": "courtyard paving, a terracotta pot and a garden chair"
    },
    "outfits": {
      "casual": "a forest-green crewneck pushed up at the cuffs over a white tee",
      "sharp": "a light-blue oxford with the sleeves rolled and navy chinos",
      "street": "a sand canvas chore jacket over a black tee"
    }
  },
  {
    "id": "anchor-08-c",
    "version": 4,
    "bucket": "anchor",
    "slot": 8,
    "variant": "c",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. His forearms rest loosely on his thighs with fingers laced. A quiet joke from the photographer pulls a laugh and he looks straight into the lens through it. Four metres back, {{backdrop}} carry gentle blur and a little ambient colour. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. A 3:4 friend-taken waist-up portrait from slightly above, iPhone 15 Pro at 48mm equivalent, standard photo mode. Show distance-appropriate facial detail, flyaway hairs, and fabric creases, letting the lens render depth on its own.",
    "locations": {
      "urban": "a warm brick side-street wall",
      "outdoorsy": "a weathered visitor-center wall",
      "homebody": "a simple home courtyard wall"
    },
    "backdrops": {
      "urban": "a brick alcove, a shuttered doorway and pooled shade",
      "outdoorsy": "a low wall, seed heads moving and a treeline",
      "homebody": "courtyard paving, a terracotta pot and a garden chair"
    },
    "outfits": {
      "casual": "a sand henley under a washed-indigo chore jacket with dark jeans",
      "sharp": "a bottle-green knit polo with charcoal tailored trousers",
      "street": "a rust hooded overshirt over a cream tee"
    }
  },
  {
    "id": "anchor-09-a",
    "version": 4,
    "bucket": "anchor",
    "slot": 9,
    "variant": "a",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. A breeze moves his hair and he lifts one hand to clear it from his eyes. The smile that follows arrives while he is still looking at the lens. Four metres behind him, {{backdrop}} break into soft moving light. Broad indirect daylight gives soft highlight rolloff and clean separation between him and the depth behind. A 3:4 chest-up frame at eye level, Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights, with skin that keeps its own grain.",
    "locations": {
      "urban": "a warm brick side-street wall",
      "outdoorsy": "a weathered visitor-center wall",
      "homebody": "a simple home courtyard wall"
    },
    "backdrops": {
      "urban": "brick coursing, deepening shade and a bright corner beyond",
      "outdoorsy": "birch trunks, moving leaf shadow and open ground",
      "homebody": "a sunlit courtyard corner and a wall of ivy"
    },
    "outfits": {
      "casual": "a burgundy waffle henley with dark chinos and the sleeves at three-quarter",
      "sharp": "a stone linen blazer over a white tee",
      "street": "a faded army-green field jacket over a white tee"
    }
  },
  {
    "id": "anchor-09-b",
    "version": 4,
    "bucket": "anchor",
    "slot": 9,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He lowers his hand after pushing his hair back and turns toward the speaker beside the camera. He listens with a relaxed expression, eyes off to his right. Three metres out, {{backdrop}} fall away gently. Soft side light and wall bounce keep both eyes clear and hold the modelling across his face. A 3:4 waist-up frame at eye level, Canon R5, 85mm, f/2, 1/320, ISO 400. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff, with pores and fine lines intact.",
    "locations": {
      "urban": "a warm brick side-street wall",
      "outdoorsy": "a weathered visitor-center wall",
      "homebody": "a simple home courtyard wall"
    },
    "backdrops": {
      "urban": "brick coursing, deepening shade and a bright corner beyond",
      "outdoorsy": "birch trunks, moving leaf shadow and open ground",
      "homebody": "a sunlit courtyard corner and a wall of ivy"
    },
    "outfits": {
      "casual": "a faded olive sweatshirt with straight-leg grey denim",
      "sharp": "a burgundy fine-knit under a grey wool jacket",
      "street": "a cream boxy overshirt over a charcoal tee"
    }
  },
  {
    "id": "anchor-09-c",
    "version": 4,
    "bucket": "anchor",
    "slot": 9,
    "variant": "c",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He brushes one loose strand back with a thumb and laughs when the wind immediately moves it again, eyes coming back to the lens. Six metres beyond him, {{backdrop}} sit soft and unhurried. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. A 3:4 friend-taken chest-up portrait with casual headroom, iPhone 15 Pro at 48mm equivalent, standard photo mode. Show distance-appropriate facial detail, flyaway hairs, and fabric creases, letting the lens render depth on its own.",
    "locations": {
      "urban": "a warm brick side-street wall",
      "outdoorsy": "a weathered visitor-center wall",
      "homebody": "a simple home courtyard wall"
    },
    "backdrops": {
      "urban": "brick coursing, deepening shade and a bright corner beyond",
      "outdoorsy": "birch trunks, moving leaf shadow and open ground",
      "homebody": "a sunlit courtyard corner and a wall of ivy"
    },
    "outfits": {
      "casual": "a cream fisherman knit with dark jeans",
      "sharp": "a crisp white shirt open at the collar with dark trousers",
      "street": "a brown suede trucker over a white tee"
    }
  },
  {
    "id": "anchor-10-a",
    "version": 4,
    "bucket": "anchor",
    "slot": 10,
    "variant": "a",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He pauses just inside the bright edge of the space with a folded paper in one hand. He looks toward the lens while his eyes adjust, expression settling into interest. Eight metres of depth run back to {{backdrop}}, everything past him softening. Broad indirect daylight gives soft highlight rolloff and clean separation between him and the depth behind. A 3:4 waist-up frame at eye level, Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights, with skin that keeps its own grain.",
    "locations": {
      "urban": "a modern museum courtyard",
      "outdoorsy": "a botanical-garden path",
      "homebody": "a covered residential stoop"
    },
    "backdrops": {
      "urban": "a broad courtyard, a pale sculpture and glass walls carrying reflections",
      "outdoorsy": "glasshouse framing, banked planting and a gravel walk",
      "homebody": "a stoop rail, a street tree and parked cars going soft"
    },
    "outfits": {
      "casual": "a charcoal marl tee under an open brown flannel",
      "sharp": "a navy unstructured blazer over an ecru tee",
      "street": "a slate windbreaker over a black tee"
    }
  },
  {
    "id": "anchor-10-b",
    "version": 4,
    "bucket": "anchor",
    "slot": 10,
    "variant": "b",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He rests one hand on a ledge and turns his shoulders back toward the camera. He replies to something the photographer has just said, eyes on the lens. Five metres behind him, {{backdrop}} render soft with clean highlight shapes. Soft side light and wall bounce keep both eyes clear and hold the modelling across his face. A 3:4 chest-up frame at eye level, Canon R5, 85mm, f/2, 1/320, ISO 400. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff, with pores and fine lines intact.",
    "locations": {
      "urban": "a modern museum courtyard",
      "outdoorsy": "a botanical-garden path",
      "homebody": "a covered residential stoop"
    },
    "backdrops": {
      "urban": "a broad courtyard, a pale sculpture and glass walls carrying reflections",
      "outdoorsy": "glasshouse framing, banked planting and a gravel walk",
      "homebody": "a stoop rail, a street tree and parked cars going soft"
    },
    "outfits": {
      "casual": "a slate-blue linen shirt worn open over a white tee",
      "sharp": "a slate merino roll-neck with charcoal trousers",
      "street": "a burgundy varsity-cut jacket over a grey tee"
    }
  },
  {
    "id": "anchor-10-c",
    "version": 4,
    "bucket": "anchor",
    "slot": 10,
    "variant": "c",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He slows beside the glass with a bag strap in one fist. He looks back at the lens when the photographer points out the light, body still turned to walk on. Ten metres of open space fall away behind him to {{backdrop}}, all of it soft. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. A 9:16 friend-taken full-length frame from a low natural height, iPhone 15 Pro at 48mm equivalent, standard photo mode. Show distance-appropriate facial detail, flyaway hairs, and fabric creases, letting the lens render depth on its own.",
    "locations": {
      "urban": "a modern museum courtyard",
      "outdoorsy": "a botanical-garden path",
      "homebody": "a covered residential stoop"
    },
    "backdrops": {
      "urban": "a broad courtyard, a pale sculpture and glass walls carrying reflections",
      "outdoorsy": "glasshouse framing, banked planting and a gravel walk",
      "homebody": "a stoop rail, a street tree and parked cars going soft"
    },
    "outfits": {
      "casual": "a heather-grey henley with black jeans",
      "sharp": "a tobacco suede jacket over a white shirt",
      "street": "a stone utility vest over a long-sleeve black tee"
    }
  },
  {
    "id": "anchor-11-a",
    "version": 4,
    "bucket": "anchor",
    "slot": 11,
    "variant": "a",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He starts to walk on with a coat over his forearm, remembers one last comment, and turns back to the lens before his trailing foot has settled. Seven metres back, {{backdrop}} compress into soft blur. Broad indirect daylight gives soft highlight rolloff and clean separation between him and the depth behind. A 3:4 knee-up frame at eye level with room ahead of him, Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights, with skin that keeps its own grain.",
    "locations": {
      "urban": "a modern museum courtyard",
      "outdoorsy": "a botanical-garden path",
      "homebody": "a covered residential stoop"
    },
    "backdrops": {
      "urban": "an open arcade, distant visitors and a bright far doorway",
      "outdoorsy": "an avenue of trees, a bench and a bright clearing",
      "homebody": "the front door, a porch light and a hedge line"
    },
    "outfits": {
      "casual": "a mustard-flecked knit polo with stone chinos",
      "sharp": "a black knit polo with stone tailored trousers",
      "street": "an ecru linen overshirt over a washed-black tee"
    }
  },
  {
    "id": "anchor-11-b",
    "version": 4,
    "bucket": "anchor",
    "slot": 11,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He steps out with both hands loose, hears the photographer behind him, and rotates only enough to reconnect, eyes finding the lens. Six metres behind him, {{backdrop}} lose their edges. Soft side light and wall bounce keep both eyes clear and hold the modelling across his face. A 3:4 waist-up frame from a three-quarter angle, Canon R5, 85mm, f/2, 1/320, ISO 400. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff, with pores and fine lines intact.",
    "locations": {
      "urban": "a modern museum courtyard",
      "outdoorsy": "a botanical-garden path",
      "homebody": "a covered residential stoop"
    },
    "backdrops": {
      "urban": "an open arcade, distant visitors and a bright far doorway",
      "outdoorsy": "an avenue of trees, a bench and a bright clearing",
      "homebody": "the front door, a porch light and a hedge line"
    },
    "outfits": {
      "casual": "a washed-black tee under an ecru canvas overshirt",
      "sharp": "a rust silk-blend shirt with black trousers",
      "street": "a forest quilted jacket over a cream tee"
    }
  },
  {
    "id": "anchor-11-c",
    "version": 4,
    "bucket": "anchor",
    "slot": 11,
    "variant": "c",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He passes through with a coffee in one hand and glances back, the smile arriving before his body stops. His eyes go off to his left, past the camera. Nine metres out, {{backdrop}} sit as soft tone and light. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. A 3:4 friend-taken chest-up portrait held slightly off-centre, iPhone 15 Pro at 48mm equivalent, standard photo mode. Show distance-appropriate facial detail, flyaway hairs, and fabric creases, letting the lens render depth on its own.",
    "locations": {
      "urban": "a modern museum courtyard",
      "outdoorsy": "a botanical-garden path",
      "homebody": "a covered residential stoop"
    },
    "backdrops": {
      "urban": "an open arcade, distant visitors and a bright far doorway",
      "outdoorsy": "an avenue of trees, a bench and a bright clearing",
      "homebody": "the front door, a porch light and a hedge line"
    },
    "outfits": {
      "casual": "a terracotta long-sleeve tee with indigo jeans",
      "sharp": "a chalk-striped grey jacket over a black tee",
      "street": "a charcoal hoodie under a washed denim jacket"
    }
  },
  {
    "id": "anchor-12-a",
    "version": 4,
    "bucket": "anchor",
    "slot": 12,
    "variant": "a",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He rests a knuckle near his chin while listening, then lowers the hand as he answers and looks straight at the lens. Four metres behind him, {{backdrop}} drop into soft depth. Broad indirect daylight gives soft highlight rolloff and clean separation between him and the depth behind. A 3:4 chest-up frame at eye level, Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights, with skin that keeps its own grain.",
    "locations": {
      "urban": "a modern museum courtyard",
      "outdoorsy": "a botanical-garden path",
      "homebody": "a covered residential stoop"
    },
    "backdrops": {
      "urban": "a lit vitrine, a bench and a receding gallery wall",
      "outdoorsy": "a fern bed, a curving path and a glasshouse edge",
      "homebody": "steps down to the street and warm brick opposite"
    },
    "outfits": {
      "casual": "a plum merino crewneck with dark denim",
      "sharp": "a forest wool overshirt over a white oxford",
      "street": "a mustard corduroy trucker over a white tee"
    }
  },
  {
    "id": "anchor-12-b",
    "version": 4,
    "bucket": "anchor",
    "slot": 12,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He sits near a warm lamp, one hand keeping a book closed over a finger. He considers the question, then smiles into the lens before beginning his reply. Three metres back, {{backdrop}} glow softly out of focus. Soft side light and wall bounce keep both eyes clear and hold the modelling across his face. A 3:4 waist-up frame at seated eye level, Canon R5, 85mm, f/2, 1/320, ISO 400. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff, with pores and fine lines intact.",
    "locations": {
      "urban": "a modern museum courtyard",
      "outdoorsy": "a botanical-garden path",
      "homebody": "a covered residential stoop"
    },
    "backdrops": {
      "urban": "a lit vitrine, a bench and a receding gallery wall",
      "outdoorsy": "a fern bed, a curving path and a glasshouse edge",
      "homebody": "steps down to the street and warm brick opposite"
    },
    "outfits": {
      "casual": "a chocolate-brown corduroy shirt with faded jeans",
      "sharp": "a cream shawl-collar knit with dark trousers",
      "street": "a navy coach jacket over an oatmeal tee"
    }
  },
  {
    "id": "anchor-12-c",
    "version": 4,
    "bucket": "anchor",
    "slot": 12,
    "variant": "c",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He turns from the light, props one forearm on a rail, and meets the lens with an unforced thoughtful expression. Five metres beyond him, {{backdrop}} carry an easy blur. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. A 3:4 friend-taken medium portrait with slightly imperfect but intentional framing, iPhone 15 Pro at 48mm equivalent, standard photo mode. Show distance-appropriate facial detail, flyaway hairs, and fabric creases, letting the lens render depth on its own.",
    "locations": {
      "urban": "a modern museum courtyard",
      "outdoorsy": "a botanical-garden path",
      "homebody": "a covered residential stoop"
    },
    "backdrops": {
      "urban": "a lit vitrine, a bench and a receding gallery wall",
      "outdoorsy": "a fern bed, a curving path and a glasshouse edge",
      "homebody": "steps down to the street and warm brick opposite"
    },
    "outfits": {
      "casual": "a bone-white waffle henley with olive chinos",
      "sharp": "a mid-brown corduroy blazer over a sand knit",
      "street": "a terracotta fleece half-zip over a white tee"
    }
  },
  {
    "id": "anchor-13-a",
    "version": 4,
    "bucket": "anchor",
    "slot": 13,
    "variant": "a",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. Both forearms rest on the counter edge either side of a cup. The photographer says something as they arrive and he turns his head to the lens while his arms stay put. Four metres behind him, {{backdrop}} fall into warm bokeh. Broad indirect daylight gives soft highlight rolloff and clean separation between him and the depth behind. A 3:4 waist-up frame at seated eye level, Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights, with skin that keeps its own grain.",
    "locations": {
      "urban": "a quiet city coffee-bar window",
      "outdoorsy": "a mountain-town bakery window",
      "homebody": "a sunlit kitchen breakfast nook"
    },
    "backdrops": {
      "urban": "a coffee bar, backlit bottles and a low pendant over the counter",
      "outdoorsy": "a bakery counter, trays of bread and a chalkboard",
      "homebody": "a kitchen window, a kettle and a wooden shelf"
    },
    "outfits": {
      "casual": "a chambray shirt with the sleeves rolled and dark chinos",
      "sharp": "an ink-blue shirt buttoned to the collar with grey trousers",
      "street": "a black waxed-cotton jacket over a bone tee"
    }
  },
  {
    "id": "anchor-13-b",
    "version": 4,
    "bucket": "anchor",
    "slot": 13,
    "variant": "b",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He finishes pointing at something outside, lowers his hand to the table, and smiles back toward his companion beside the camera, eyes off to his left. Three metres out, {{backdrop}} soften into shape and glow. Soft side light and wall bounce keep both eyes clear and hold the modelling across his face. A 3:4 chest-up frame from across the table, Canon R5, 85mm, f/2, 1/320, ISO 400. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff, with pores and fine lines intact.",
    "locations": {
      "urban": "a quiet city coffee-bar window",
      "outdoorsy": "a mountain-town bakery window",
      "homebody": "a sunlit kitchen breakfast nook"
    },
    "backdrops": {
      "urban": "a coffee bar, backlit bottles and a low pendant over the counter",
      "outdoorsy": "a bakery counter, trays of bread and a chalkboard",
      "homebody": "a kitchen window, a kettle and a wooden shelf"
    },
    "outfits": {
      "casual": "a rust-flecked wool overshirt over a cream tee",
      "sharp": "a taupe field jacket over a fine black knit",
      "street": "a grey marl hoodie under a stone canvas overshirt"
    }
  },
  {
    "id": "anchor-13-c",
    "version": 4,
    "bucket": "anchor",
    "slot": 13,
    "variant": "c",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He sits back with one hand around a mug and looks over his shoulder into the lens when the photographer asks what he can see. Five metres back, {{backdrop}} sit soft and warm. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. A 3:4 friend-taken chest-up portrait with casual headroom, iPhone 15 Pro at 48mm equivalent, standard photo mode. Show distance-appropriate facial detail, flyaway hairs, and fabric creases, letting the lens render depth on its own.",
    "locations": {
      "urban": "a quiet city coffee-bar window",
      "outdoorsy": "a mountain-town bakery window",
      "homebody": "a sunlit kitchen breakfast nook"
    },
    "backdrops": {
      "urban": "a coffee bar, backlit bottles and a low pendant over the counter",
      "outdoorsy": "a bakery counter, trays of bread and a chalkboard",
      "homebody": "a kitchen window, a kettle and a wooden shelf"
    },
    "outfits": {
      "casual": "a deep-teal crewneck with stone-grey jeans",
      "sharp": "a soft-grey flannel jacket over a white tee",
      "street": "a teal windbreaker over a heather tee"
    }
  },
  {
    "id": "anchor-14-a",
    "version": 4,
    "bucket": "anchor",
    "slot": 14,
    "variant": "a",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He steps into the late light with a jacket hooked on one hand over his shoulder. His eyes narrow briefly and the smile lands as he looks at the lens. Seven metres beyond him, {{backdrop}} burn softly out of focus. Broad indirect daylight gives soft highlight rolloff and clean separation between him and the depth behind. A 3:4 waist-up frame at eye level, Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights, with skin that keeps its own grain.",
    "locations": {
      "urban": "a quiet city coffee-bar window",
      "outdoorsy": "a mountain-town bakery window",
      "homebody": "a sunlit kitchen breakfast nook"
    },
    "backdrops": {
      "urban": "the window's bright street, passing traffic and a lit sign",
      "outdoorsy": "a mountain street, a parked truck and pines beyond",
      "homebody": "a garden through glass and a hanging plant"
    },
    "outfits": {
      "casual": "an oat cardigan over a white tee with dark jeans",
      "sharp": "a deep-olive blazer over a cream shirt",
      "street": "a chocolate shearling-collar trucker over a cream tee"
    }
  },
  {
    "id": "anchor-14-b",
    "version": 4,
    "bucket": "anchor",
    "slot": 14,
    "variant": "b",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He turns his face into the softer side of the light with one hand flat on the table. He settles into an easy expression aimed at the lens. Four metres back, {{backdrop}} render as warm haze and light shapes. Soft side light and wall bounce keep both eyes clear and hold the modelling across his face. A 3:4 chest-up frame at eye level, Canon R5, 85mm, f/2, 1/320, ISO 400. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff, with pores and fine lines intact.",
    "locations": {
      "urban": "a quiet city coffee-bar window",
      "outdoorsy": "a mountain-town bakery window",
      "homebody": "a sunlit kitchen breakfast nook"
    },
    "backdrops": {
      "urban": "the window's bright street, passing traffic and a lit sign",
      "outdoorsy": "a mountain street, a parked truck and pines beyond",
      "homebody": "a garden through glass and a hanging plant"
    },
    "outfits": {
      "casual": "an oatmeal waffle henley with the sleeves pushed to mid-forearm and dark jeans",
      "sharp": "a charcoal blazer over a white crew-neck tee with dark trousers",
      "street": "a washed-indigo denim jacket over a white tee"
    }
  },
  {
    "id": "anchor-14-c",
    "version": 4,
    "bucket": "anchor",
    "slot": 14,
    "variant": "c",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He pauses where the warm light reaches his jacket, thumbs hooked in his pockets, and lets a small smile unfold while looking down the lens. Six metres out, {{backdrop}} fall into an ordinary soft wash. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. A 3:4 friend-taken medium portrait with slightly imperfect but intentional framing, iPhone 15 Pro at 48mm equivalent, standard photo mode. Show distance-appropriate facial detail, flyaway hairs, and fabric creases, letting the lens render depth on its own.",
    "locations": {
      "urban": "a quiet city coffee-bar window",
      "outdoorsy": "a mountain-town bakery window",
      "homebody": "a sunlit kitchen breakfast nook"
    },
    "backdrops": {
      "urban": "the window's bright street, passing traffic and a lit sign",
      "outdoorsy": "a mountain street, a parked truck and pines beyond",
      "homebody": "a garden through glass and a hanging plant"
    },
    "outfits": {
      "casual": "a rust corduroy overshirt open over a cream tee with dark denim",
      "sharp": "a camel overcoat over a black fine-knit",
      "street": "a black bomber over a heather-grey tee"
    }
  },
  {
    "id": "anchor-15-a",
    "version": 4,
    "bucket": "anchor",
    "slot": 15,
    "variant": "a",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He has just greeted the photographer and brings his hands loosely together after the handshake, keeping a warm direct gaze on the lens. Four metres behind him, {{backdrop}} sit softly out of focus. Broad indirect daylight gives soft highlight rolloff and clean separation between him and the depth behind. A 3:4 chest-up frame at eye level, Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights, with skin that keeps its own grain.",
    "locations": {
      "urban": "a quiet city coffee-bar window",
      "outdoorsy": "a mountain-town bakery window",
      "homebody": "a sunlit kitchen breakfast nook"
    },
    "backdrops": {
      "urban": "café stools, a mirrored back bar and hanging bulbs",
      "outdoorsy": "a bakery doorway, a menu board and the morning street",
      "homebody": "the nook's bench seat, cushions and a bowl of fruit"
    },
    "outfits": {
      "casual": "a forest-green crewneck pushed up at the cuffs over a white tee",
      "sharp": "a light-blue oxford with the sleeves rolled and navy chinos",
      "street": "a sand canvas chore jacket over a black tee"
    }
  },
  {
    "id": "anchor-15-b",
    "version": 4,
    "bucket": "anchor",
    "slot": 15,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He stops with one hand resting on a chair back and listens with his head slightly angled. The smile arrives while his eyes are still off to his right, past the camera. Five metres back, {{backdrop}} soften into quiet tone. Soft side light and wall bounce keep both eyes clear and hold the modelling across his face. A 3:4 waist-up frame at eye level, Canon R5, 85mm, f/2, 1/320, ISO 400. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff, with pores and fine lines intact.",
    "locations": {
      "urban": "a quiet city coffee-bar window",
      "outdoorsy": "a mountain-town bakery window",
      "homebody": "a sunlit kitchen breakfast nook"
    },
    "backdrops": {
      "urban": "café stools, a mirrored back bar and hanging bulbs",
      "outdoorsy": "a bakery doorway, a menu board and the morning street",
      "homebody": "the nook's bench seat, cushions and a bowl of fruit"
    },
    "outfits": {
      "casual": "a sand henley under a washed-indigo chore jacket with dark jeans",
      "sharp": "a bottle-green knit polo with charcoal tailored trousers",
      "street": "a rust hooded overshirt over a cream tee"
    }
  },
  {
    "id": "anchor-15-c",
    "version": 4,
    "bucket": "anchor",
    "slot": 15,
    "variant": "c",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He steps out of the doorway with a paper bag in one hand, recognises the photographer, and smiles into the lens as he keeps walking toward them. Eight metres behind him, {{backdrop}} compress into soft street light. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. A 9:16 friend-taken full-length frame from a low natural height, iPhone 15 Pro at 48mm equivalent, standard photo mode. Show distance-appropriate facial detail, flyaway hairs, and fabric creases, letting the lens render depth on its own.",
    "locations": {
      "urban": "a quiet city coffee-bar window",
      "outdoorsy": "a mountain-town bakery window",
      "homebody": "a sunlit kitchen breakfast nook"
    },
    "backdrops": {
      "urban": "café stools, a mirrored back bar and hanging bulbs",
      "outdoorsy": "a bakery doorway, a menu board and the morning street",
      "homebody": "the nook's bench seat, cushions and a bowl of fruit"
    },
    "outfits": {
      "casual": "a burgundy waffle henley with dark chinos and the sleeves at three-quarter",
      "sharp": "a stone linen blazer over a white tee",
      "street": "a faded army-green field jacket over a white tee"
    }
  },
  {
    "id": "anchor-16-a",
    "version": 4,
    "bucket": "anchor",
    "slot": 16,
    "variant": "a",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He sits on a low wall having just retied one shoe, hands still resting on his ankle. He stays there a moment and looks up into the lens. Six metres behind him, {{backdrop}} fall away softly. Broad indirect daylight gives soft highlight rolloff and clean separation between him and the depth behind. A 3:4 knee-up frame from a low seated height, Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights, with skin that keeps its own grain.",
    "locations": {
      "urban": "a glass-and-stone city walkway",
      "outdoorsy": "a riverside promenade",
      "homebody": "a calm neighborhood sidewalk"
    },
    "backdrops": {
      "urban": "a glass wall carrying sky reflection and a stone bench",
      "outdoorsy": "the river, a moored boat and the far bank",
      "homebody": "a low garden wall, a parked car and a row of houses"
    },
    "outfits": {
      "casual": "a faded olive sweatshirt with straight-leg grey denim",
      "sharp": "a burgundy fine-knit under a grey wool jacket",
      "street": "a cream boxy overshirt over a charcoal tee"
    }
  },
  {
    "id": "anchor-16-b",
    "version": 4,
    "bucket": "anchor",
    "slot": 16,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He shifts along the wall to make space and crosses one ankle naturally, one palm flat beside him. Something said off camera pulls his eyes to his left and a smile with it. Five metres out, {{backdrop}} sit gently blurred. Soft side light and wall bounce keep both eyes clear and hold the modelling across his face. A 3:4 waist-up frame at seated height, Canon R5, 85mm, f/2, 1/320, ISO 400. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff, with pores and fine lines intact.",
    "locations": {
      "urban": "a glass-and-stone city walkway",
      "outdoorsy": "a riverside promenade",
      "homebody": "a calm neighborhood sidewalk"
    },
    "backdrops": {
      "urban": "a glass wall carrying sky reflection and a stone bench",
      "outdoorsy": "the river, a moored boat and the far bank",
      "homebody": "a low garden wall, a parked car and a row of houses"
    },
    "outfits": {
      "casual": "a cream fisherman knit with dark jeans",
      "sharp": "a crisp white shirt open at the collar with dark trousers",
      "street": "a brown suede trucker over a white tee"
    }
  },
  {
    "id": "anchor-16-c",
    "version": 4,
    "bucket": "anchor",
    "slot": 16,
    "variant": "c",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He rests on a step after walking, both hands planted beside him. He turns toward the continuing conversation and looks into the lens. Seven metres back, {{backdrop}} lose their detail. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. A 3:4 friend-taken waist-up portrait from slightly above, iPhone 15 Pro at 48mm equivalent, standard photo mode. Show distance-appropriate facial detail, flyaway hairs, and fabric creases, letting the lens render depth on its own.",
    "locations": {
      "urban": "a glass-and-stone city walkway",
      "outdoorsy": "a riverside promenade",
      "homebody": "a calm neighborhood sidewalk"
    },
    "backdrops": {
      "urban": "a glass wall carrying sky reflection and a stone bench",
      "outdoorsy": "the river, a moored boat and the far bank",
      "homebody": "a low garden wall, a parked car and a row of houses"
    },
    "outfits": {
      "casual": "a charcoal marl tee under an open brown flannel",
      "sharp": "a navy unstructured blazer over an ecru tee",
      "street": "a slate windbreaker over a black tee"
    }
  },
  {
    "id": "anchor-17-a",
    "version": 4,
    "bucket": "anchor",
    "slot": 17,
    "variant": "a",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He finishes speaking with one hand resting on a rail and holds the residual half-smile while the photographer answers, eyes steady on the lens. Six metres behind him, {{backdrop}} go soft and luminous. Broad indirect daylight gives soft highlight rolloff and clean separation between him and the depth behind. A 3:4 chest-up frame at eye level, Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights, with skin that keeps its own grain.",
    "locations": {
      "urban": "a glass-and-stone city walkway",
      "outdoorsy": "a riverside promenade",
      "homebody": "a calm neighborhood sidewalk"
    },
    "backdrops": {
      "urban": "a tall window, the street beyond and a pale stone floor",
      "outdoorsy": "promenade railings, water light and distant walkers",
      "homebody": "a hedge, a gate and pavement running out of frame"
    },
    "outfits": {
      "casual": "a slate-blue linen shirt worn open over a white tee",
      "sharp": "a slate merino roll-neck with charcoal trousers",
      "street": "a burgundy varsity-cut jacket over a grey tee"
    }
  },
  {
    "id": "anchor-17-b",
    "version": 4,
    "bucket": "anchor",
    "slot": 17,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He looks out past the glass for a moment, one thumb hooked in a pocket, then turns back to answer and keeps his attention on the lens. Five metres out, {{backdrop}} settle into gentle blur. Soft side light and wall bounce keep both eyes clear and hold the modelling across his face. A 3:4 waist-up frame at eye level, Canon R5, 85mm, f/2, 1/320, ISO 400. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff, with pores and fine lines intact.",
    "locations": {
      "urban": "a glass-and-stone city walkway",
      "outdoorsy": "a riverside promenade",
      "homebody": "a calm neighborhood sidewalk"
    },
    "backdrops": {
      "urban": "a tall window, the street beyond and a pale stone floor",
      "outdoorsy": "promenade railings, water light and distant walkers",
      "homebody": "a hedge, a gate and pavement running out of frame"
    },
    "outfits": {
      "casual": "a heather-grey henley with black jeans",
      "sharp": "a tobacco suede jacket over a white shirt",
      "street": "a stone utility vest over a long-sleeve black tee"
    }
  },
  {
    "id": "anchor-17-c",
    "version": 4,
    "bucket": "anchor",
    "slot": 17,
    "variant": "c",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He pauses with a phone loose in one hand, laughs softly at a correction, and lets his shoulders drop as the moment passes, eyes still on the lens. Eight metres beyond him, {{backdrop}} carry ordinary soft detail. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. A 3:4 friend-taken chest-up portrait held slightly off-centre, iPhone 15 Pro at 48mm equivalent, standard photo mode. Show distance-appropriate facial detail, flyaway hairs, and fabric creases, letting the lens render depth on its own.",
    "locations": {
      "urban": "a glass-and-stone city walkway",
      "outdoorsy": "a riverside promenade",
      "homebody": "a calm neighborhood sidewalk"
    },
    "backdrops": {
      "urban": "a tall window, the street beyond and a pale stone floor",
      "outdoorsy": "promenade railings, water light and distant walkers",
      "homebody": "a hedge, a gate and pavement running out of frame"
    },
    "outfits": {
      "casual": "a mustard-flecked knit polo with stone chinos",
      "sharp": "a black knit polo with stone tailored trousers",
      "street": "an ecru linen overshirt over a washed-black tee"
    }
  },
  {
    "id": "anchor-18-a",
    "version": 4,
    "bucket": "anchor",
    "slot": 18,
    "variant": "a",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. A light breeze catches his open jacket and he draws one side closer with a fist. He looks toward the lens before letting the fabric go. Nine metres behind him, {{backdrop}} recede into layered soft tone. Broad indirect daylight gives soft highlight rolloff and clean separation between him and the depth behind. A 3:4 waist-up frame at eye level, Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights, with skin that keeps its own grain.",
    "locations": {
      "urban": "a glass-and-stone city walkway",
      "outdoorsy": "a riverside promenade",
      "homebody": "a calm neighborhood sidewalk"
    },
    "backdrops": {
      "urban": "a covered walkway, moving figures and bright glass",
      "outdoorsy": "open water, wind on the surface and a bridge in haze",
      "homebody": "street trees, a postbox and quiet parked cars"
    },
    "outfits": {
      "casual": "a washed-black tee under an ecru canvas overshirt",
      "sharp": "a rust silk-blend shirt with black trousers",
      "street": "a forest quilted jacket over a cream tee"
    }
  },
  {
    "id": "anchor-18-b",
    "version": 4,
    "bucket": "anchor",
    "slot": 18,
    "variant": "b",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He steps out, checks the sky with a quick glance, and smiles at the photographer's reaction with both hands in his pockets. The scene runs back twelve metres to {{backdrop}}, held in soft focus. Soft side light and wall bounce keep both eyes clear and hold the modelling across his face. A 4:3 wide environmental frame at eye level with him left of centre, Canon R5, 85mm, f/2, 1/320, ISO 400. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff, with pores and fine lines intact.",
    "locations": {
      "urban": "a glass-and-stone city walkway",
      "outdoorsy": "a riverside promenade",
      "homebody": "a calm neighborhood sidewalk"
    },
    "backdrops": {
      "urban": "a covered walkway, moving figures and bright glass",
      "outdoorsy": "open water, wind on the surface and a bridge in haze",
      "homebody": "street trees, a postbox and quiet parked cars"
    },
    "outfits": {
      "casual": "a terracotta long-sleeve tee with indigo jeans",
      "sharp": "a chalk-striped grey jacket over a black tee",
      "street": "a charcoal hoodie under a washed denim jacket"
    }
  },
  {
    "id": "anchor-18-c",
    "version": 4,
    "bucket": "anchor",
    "slot": 18,
    "variant": "c",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He turns into the wind and holds his collar briefly clear of his face with one hand, walking on as the photograph is made. His eyes stay ahead, off to his right. Ten metres out, {{backdrop}} blur into moving light. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. A 3:4 friend-taken medium portrait with slightly imperfect but intentional framing, iPhone 15 Pro at 48mm equivalent, standard photo mode. Show distance-appropriate facial detail, flyaway hairs, and fabric creases, letting the lens render depth on its own.",
    "locations": {
      "urban": "a glass-and-stone city walkway",
      "outdoorsy": "a riverside promenade",
      "homebody": "a calm neighborhood sidewalk"
    },
    "backdrops": {
      "urban": "a covered walkway, moving figures and bright glass",
      "outdoorsy": "open water, wind on the surface and a bridge in haze",
      "homebody": "street trees, a postbox and quiet parked cars"
    },
    "outfits": {
      "casual": "a plum merino crewneck with dark denim",
      "sharp": "a forest wool overshirt over a white oxford",
      "street": "a mustard corduroy trucker over a white tee"
    }
  },
  {
    "id": "anchor-19-a",
    "version": 4,
    "bucket": "anchor",
    "slot": 19,
    "variant": "a",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He waits with one elbow on the back of a chair and a cup in the other hand. He turns from the window and gives the lens a quietly amused look. Five metres behind him, {{backdrop}} soften into warm shapes. Broad indirect daylight gives soft highlight rolloff and clean separation between him and the depth behind. A 3:4 chest-up frame at eye level, Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights, with skin that keeps its own grain.",
    "locations": {
      "urban": "a minimalist hotel-lobby alcove",
      "outdoorsy": "a bright nature-center interior",
      "homebody": "a clean apartment entry"
    },
    "backdrops": {
      "urban": "a lobby alcove, a low table and a warm floor lamp",
      "outdoorsy": "a bright interior, exhibit panels and tall windows",
      "homebody": "a hallway, hung coats and a strip of daylight"
    },
    "outfits": {
      "casual": "a chocolate-brown corduroy shirt with faded jeans",
      "sharp": "a cream shawl-collar knit with dark trousers",
      "street": "a navy coach jacket over an oatmeal tee"
    }
  },
  {
    "id": "anchor-19-b",
    "version": 4,
    "bucket": "anchor",
    "slot": 19,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He leans back only long enough to hear the end of a story, hands loose in his lap. He comes forward again with a contained smile aimed at the lens. Four metres out, {{backdrop}} fall into soft interior tone. Soft side light and wall bounce keep both eyes clear and hold the modelling across his face. A 3:4 waist-up frame at seated eye level, Canon R5, 85mm, f/2, 1/320, ISO 400. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff, with pores and fine lines intact.",
    "locations": {
      "urban": "a minimalist hotel-lobby alcove",
      "outdoorsy": "a bright nature-center interior",
      "homebody": "a clean apartment entry"
    },
    "backdrops": {
      "urban": "a lobby alcove, a low table and a warm floor lamp",
      "outdoorsy": "a bright interior, exhibit panels and tall windows",
      "homebody": "a hallway, hung coats and a strip of daylight"
    },
    "outfits": {
      "casual": "a bone-white waffle henley with olive chinos",
      "sharp": "a mid-brown corduroy blazer over a sand knit",
      "street": "a terracotta fleece half-zip over a white tee"
    }
  },
  {
    "id": "anchor-19-c",
    "version": 4,
    "bucket": "anchor",
    "slot": 19,
    "variant": "c",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He steps back from the glass after checking outside, keys still in one hand, and meets the lens with relaxed self-awareness. Six metres behind him, {{backdrop}} sit comfortably out of focus. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. A 3:4 friend-taken chest-up portrait with casual headroom, iPhone 15 Pro at 48mm equivalent, standard photo mode. Show distance-appropriate facial detail, flyaway hairs, and fabric creases, letting the lens render depth on its own.",
    "locations": {
      "urban": "a minimalist hotel-lobby alcove",
      "outdoorsy": "a bright nature-center interior",
      "homebody": "a clean apartment entry"
    },
    "backdrops": {
      "urban": "a lobby alcove, a low table and a warm floor lamp",
      "outdoorsy": "a bright interior, exhibit panels and tall windows",
      "homebody": "a hallway, hung coats and a strip of daylight"
    },
    "outfits": {
      "casual": "a chambray shirt with the sleeves rolled and dark chinos",
      "sharp": "an ink-blue shirt buttoned to the collar with grey trousers",
      "street": "a black waxed-cotton jacket over a bone tee"
    }
  },
  {
    "id": "anchor-20-a",
    "version": 4,
    "bucket": "anchor",
    "slot": 20,
    "variant": "a",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He walks toward the photographer with a bag in one hand, begins to answer someone beside them, and looks back to the lens mid-step. Eight metres behind him, {{backdrop}} compress into soft depth. Broad indirect daylight gives soft highlight rolloff and clean separation between him and the depth behind. A 3:4 knee-up frame at eye level, Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights, with skin that keeps its own grain.",
    "locations": {
      "urban": "a minimalist hotel-lobby alcove",
      "outdoorsy": "a bright nature-center interior",
      "homebody": "a clean apartment entry"
    },
    "backdrops": {
      "urban": "a lobby corridor, brushed metal and a lit reception desk",
      "outdoorsy": "a glazed wall, treetops beyond and pale timber",
      "homebody": "an open front door and daylight on the threshold"
    },
    "outfits": {
      "casual": "a rust-flecked wool overshirt over a cream tee",
      "sharp": "a taupe field jacket over a fine black knit",
      "street": "a grey marl hoodie under a stone canvas overshirt"
    }
  },
  {
    "id": "anchor-20-b",
    "version": 4,
    "bucket": "anchor",
    "slot": 20,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He reaches the end of the path and slows into a natural stop, one hand adjusting a cuff. He smiles at the photographer's final comment, eyes on the lens. Six metres out, {{backdrop}} drop into quiet blur. Soft side light and wall bounce keep both eyes clear and hold the modelling across his face. A 3:4 waist-up frame at eye level, Canon R5, 85mm, f/2, 1/320, ISO 400. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff, with pores and fine lines intact.",
    "locations": {
      "urban": "a minimalist hotel-lobby alcove",
      "outdoorsy": "a bright nature-center interior",
      "homebody": "a clean apartment entry"
    },
    "backdrops": {
      "urban": "a lobby corridor, brushed metal and a lit reception desk",
      "outdoorsy": "a glazed wall, treetops beyond and pale timber",
      "homebody": "an open front door and daylight on the threshold"
    },
    "outfits": {
      "casual": "a deep-teal crewneck with stone-grey jeans",
      "sharp": "a soft-grey flannel jacket over a white tee",
      "street": "a teal windbreaker over a heather tee"
    }
  },
  {
    "id": "anchor-20-c",
    "version": 4,
    "bucket": "anchor",
    "slot": 20,
    "variant": "c",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He turns away to keep walking, hears one last joke, and looks back over his shoulder into the lens with easy confidence, a jacket hooked over one hand. Eleven metres of depth open behind him to {{backdrop}}, all softly rendered. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. A 9:16 friend-taken full-length frame from a low natural height, iPhone 15 Pro at 48mm equivalent, standard photo mode. Show distance-appropriate facial detail, flyaway hairs, and fabric creases, letting the lens render depth on its own.",
    "locations": {
      "urban": "a minimalist hotel-lobby alcove",
      "outdoorsy": "a bright nature-center interior",
      "homebody": "a clean apartment entry"
    },
    "backdrops": {
      "urban": "a lobby corridor, brushed metal and a lit reception desk",
      "outdoorsy": "a glazed wall, treetops beyond and pale timber",
      "homebody": "an open front door and daylight on the threshold"
    },
    "outfits": {
      "casual": "an oat cardigan over a white tee with dark jeans",
      "sharp": "a deep-olive blazer over a cream shirt",
      "street": "a chocolate shearling-collar trucker over a cream tee"
    }
  },
  {
    "id": "social-01-a",
    "version": 4,
    "bucket": "social",
    "slot": 1,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He leans back with one hand still resting on the table after delivering the punch line. He looks across to the lens as the laughter lands. Two companions sit turned away at the near edge, shoulders and backs only, softening as {{backdrop}} fall off eight metres behind, leaving him the one face in focus. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. A 4:3 waist-up documentary frame from across the table, Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Retain distance-appropriate facial detail, warm venue colour across his skin, fabric folds, and grain carried through shadow and background alike.",
    "locations": {
      "urban": "a lively city bistro terrace",
      "outdoorsy": "a lodge restaurant deck",
      "homebody": "a neighborhood dinner patio"
    },
    "backdrops": {
      "urban": "warm bistro lamps, a wine shelf and blurred diners",
      "outdoorsy": "timber deck posts, hanging lanterns and a dark treeline",
      "homebody": "string lights, a garden fence and lit windows"
    },
    "outfits": {
      "casual": "a burgundy waffle henley with dark denim",
      "sharp": "a bottle-green knit polo with charcoal trousers",
      "street": "a rust bomber over a cream tee"
    }
  },
  {
    "id": "social-01-b",
    "version": 4,
    "bucket": "social",
    "slot": 1,
    "variant": "b",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He listens to a story with both forearms on the table, trying to keep a straight face, and gives in. The laugh breaks as he turns to the lens. Companions read as turned backs and blurred movement at the frame edges, with {{backdrop}} seven metres beyond, leaving him the one face in focus. Modest direct flash lifts the face while darker ambient light keeps crisp natural shadows. A 3:4 chest-up frame from a neighbouring seat, Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Flash reveals honest texture, modest shine at the forehead, fabric creases, and one natural shadow behind him.",
    "locations": {
      "urban": "a lively city bistro terrace",
      "outdoorsy": "a lodge restaurant deck",
      "homebody": "a neighborhood dinner patio"
    },
    "backdrops": {
      "urban": "warm bistro lamps, a wine shelf and blurred diners",
      "outdoorsy": "timber deck posts, hanging lanterns and a dark treeline",
      "homebody": "string lights, a garden fence and lit windows"
    },
    "outfits": {
      "casual": "a charcoal merino crewneck with black jeans",
      "sharp": "a navy unstructured blazer over a white tee",
      "street": "a black leather-trim trucker over a white tee"
    }
  },
  {
    "id": "social-01-c",
    "version": 4,
    "bucket": "social",
    "slot": 1,
    "variant": "c",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He passes a shared plate across with one hand, the other steadying his own. He looks off to his left, past the lens, as the table breaks into laughter. Two turned backs frame him loosely at four metres and {{backdrop}} dissolve nine metres further off, leaving him the one face in focus. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. A 4:3 friend-taken medium shot from conversational distance, friend-taken iPhone 15 Pro at 35mm equivalent, standard photo mode. Preserve distance-appropriate facial detail, slight gesture motion, and ordinary phone texture with true venue colour.",
    "locations": {
      "urban": "a lively city bistro terrace",
      "outdoorsy": "a lodge restaurant deck",
      "homebody": "a neighborhood dinner patio"
    },
    "backdrops": {
      "urban": "warm bistro lamps, a wine shelf and blurred diners",
      "outdoorsy": "timber deck posts, hanging lanterns and a dark treeline",
      "homebody": "string lights, a garden fence and lit windows"
    },
    "outfits": {
      "casual": "an ecru overshirt over a dark tee",
      "sharp": "a burgundy fine-knit under a charcoal jacket",
      "street": "a sand canvas overshirt over a charcoal tee"
    }
  },
  {
    "id": "social-02-a",
    "version": 4,
    "bucket": "social",
    "slot": 2,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He lowers a coffee after a sip and keeps one hand around the cup. He looks up to the lens as someone new reaches the table. A companion's shoulder crosses the near corner out of focus and {{backdrop}} sit six metres back, leaving him the one face in focus. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. A 4:3 medium frame from the edge of the conversation, Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Retain distance-appropriate facial detail, warm venue colour across his skin, fabric folds, and grain carried through shadow and background alike.",
    "locations": {
      "urban": "a lively city bistro terrace",
      "outdoorsy": "a lodge restaurant deck",
      "homebody": "a neighborhood dinner patio"
    },
    "backdrops": {
      "urban": "a bar back, stacked glassware and a lit doorway",
      "outdoorsy": "lodge windows, a stone chimney and pine shadow",
      "homebody": "patio heaters, potted herbs and a neighbour's lit kitchen"
    },
    "outfits": {
      "casual": "a forest-green corduroy shirt with dark chinos",
      "sharp": "a stone linen blazer over an ecru shirt",
      "street": "an indigo denim jacket over a black tee"
    }
  },
  {
    "id": "social-02-b",
    "version": 4,
    "bucket": "social",
    "slot": 2,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He pulls a chair out with one hand and stays half standing to greet an arrival. The smile arrives as he glances back to the lens. The table's other guests face away into soft shape, and {{backdrop}} settle five metres behind them, leaving him the one face in focus. Modest direct flash lifts the face while darker ambient light keeps crisp natural shadows. A 3:4 knee-up flash photograph with easy space around him, Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Flash reveals honest texture, modest shine at the forehead, fabric creases, and one natural shadow behind him.",
    "locations": {
      "urban": "a lively city bistro terrace",
      "outdoorsy": "a lodge restaurant deck",
      "homebody": "a neighborhood dinner patio"
    },
    "backdrops": {
      "urban": "a bar back, stacked glassware and a lit doorway",
      "outdoorsy": "lodge windows, a stone chimney and pine shadow",
      "homebody": "patio heaters, potted herbs and a neighbour's lit kitchen"
    },
    "outfits": {
      "casual": "a rust knit polo with dark denim",
      "sharp": "a black shawl-collar knit with dark trousers",
      "street": "a forest coach jacket over an oat tee"
    }
  },
  {
    "id": "social-02-c",
    "version": 4,
    "bucket": "social",
    "slot": 2,
    "variant": "c",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He sets his cup down to answer a question, one hand still near the saucer. His attention stays off to his right, on whoever asked. A companion stands away from the lens as a soft silhouette, with {{backdrop}} ten metres back, leaving him the one face in focus. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. A 4:3 waist-up snapshot with the venue still readable, friend-taken iPhone 15 Pro at 35mm equivalent, standard photo mode. Preserve distance-appropriate facial detail, slight gesture motion, and ordinary phone texture with true venue colour.",
    "locations": {
      "urban": "a lively city bistro terrace",
      "outdoorsy": "a lodge restaurant deck",
      "homebody": "a neighborhood dinner patio"
    },
    "backdrops": {
      "urban": "a bar back, stacked glassware and a lit doorway",
      "outdoorsy": "lodge windows, a stone chimney and pine shadow",
      "homebody": "patio heaters, potted herbs and a neighbour's lit kitchen"
    },
    "outfits": {
      "casual": "a stone linen shirt with the sleeves rolled and dark jeans",
      "sharp": "a camel sport coat over a cream shirt",
      "street": "a cream boxy overshirt over a washed-black tee"
    }
  },
  {
    "id": "social-03-a",
    "version": 4,
    "bucket": "social",
    "slot": 3,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He raises a small glass with one hand and rests the other on the table edge. He holds brief eye contact with the lens before drinking. Companions read as turned backs and blurred movement at the frame edges, with {{backdrop}} seven metres beyond, leaving him the one face in focus. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. A 4:3 three-quarter frame at seated height, Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Retain distance-appropriate facial detail, warm venue colour across his skin, fabric folds, and grain carried through shadow and background alike.",
    "locations": {
      "urban": "a lively city bistro terrace",
      "outdoorsy": "a lodge restaurant deck",
      "homebody": "a neighborhood dinner patio"
    },
    "backdrops": {
      "urban": "café awnings, passing headlights and a bright street",
      "outdoorsy": "deck railings, dark water and distant slope lights",
      "homebody": "trellis vines, a side gate and warm porch light"
    },
    "outfits": {
      "casual": "a slate-blue henley with charcoal chinos",
      "sharp": "a slate merino roll-neck with grey trousers",
      "street": "a burgundy varsity jacket over a grey tee"
    }
  },
  {
    "id": "social-03-b",
    "version": 4,
    "bucket": "social",
    "slot": 3,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He answers a toast by lifting his glass a little, keeping the gesture small and unhurried. He smiles toward the lens as he lowers his hand. Two turned backs frame him loosely at four metres and {{backdrop}} dissolve nine metres further off, leaving him the one face in focus. Modest direct flash lifts the face while darker ambient light keeps crisp natural shadows. A 3:4 waist-up snapshot with his face near the visual centre, Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Flash reveals honest texture, modest shine at the forehead, fabric creases, and one natural shadow behind him.",
    "locations": {
      "urban": "a lively city bistro terrace",
      "outdoorsy": "a lodge restaurant deck",
      "homebody": "a neighborhood dinner patio"
    },
    "backdrops": {
      "urban": "café awnings, passing headlights and a bright street",
      "outdoorsy": "deck railings, dark water and distant slope lights",
      "homebody": "trellis vines, a side gate and warm porch light"
    },
    "outfits": {
      "casual": "a cream cable knit with dark denim",
      "sharp": "a rust silk-blend shirt with black trousers",
      "street": "a slate windbreaker over a white tee"
    }
  },
  {
    "id": "social-03-c",
    "version": 4,
    "bucket": "social",
    "slot": 3,
    "variant": "c",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He sets one drink beside his plate and laughs, both hands still on the table. His eyes go to his left, past the lens, to whoever caused it. Two companions sit turned away at the near edge, shoulders and backs only, softening as {{backdrop}} fall off eight metres behind, leaving him the one face in focus. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. A 4:3 three-quarter candid at seated height, friend-taken iPhone 15 Pro at 35mm equivalent, standard photo mode. Preserve distance-appropriate facial detail, slight gesture motion, and ordinary phone texture with true venue colour.",
    "locations": {
      "urban": "a lively city bistro terrace",
      "outdoorsy": "a lodge restaurant deck",
      "homebody": "a neighborhood dinner patio"
    },
    "backdrops": {
      "urban": "café awnings, passing headlights and a bright street",
      "outdoorsy": "deck railings, dark water and distant slope lights",
      "homebody": "trellis vines, a side gate and warm porch light"
    },
    "outfits": {
      "casual": "a chocolate suede-trim overshirt over a black tee",
      "sharp": "a chalk-grey blazer over a black knit polo",
      "street": "a chocolate corduroy trucker over a cream tee"
    }
  },
  {
    "id": "social-04-a",
    "version": 4,
    "bucket": "social",
    "slot": 4,
    "variant": "a",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He rests one forearm on the counter while a story finishes beside him. He turns to the lens with the residual smile still there. The table's other guests face away into soft shape, and {{backdrop}} settle five metres behind them, leaving him the one face in focus. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. A 3:4 chest-up frame through a little foreground context, Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Retain distance-appropriate facial detail, warm venue colour across his skin, fabric folds, and grain carried through shadow and background alike.",
    "locations": {
      "urban": "a sidewalk coffee patio",
      "outdoorsy": "a trail-town café terrace",
      "homebody": "a local bakery patio"
    },
    "backdrops": {
      "urban": "a coffee counter, a chalkboard and pavement traffic",
      "outdoorsy": "a terrace rail, mountain haze and parked bikes",
      "homebody": "a bakery window, bread trays and the morning street"
    },
    "outfits": {
      "casual": "an olive flannel worn open over a grey tee",
      "sharp": "an ink-blue shirt open at the collar with charcoal trousers",
      "street": "an olive field jacket over a black tee"
    }
  },
  {
    "id": "social-04-b",
    "version": 4,
    "bucket": "social",
    "slot": 4,
    "variant": "b",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He takes two drinks from the counter and passes one across with his free hand. He looks back to the lens when his name is said. A companion stands away from the lens as a soft silhouette, with {{backdrop}} ten metres back, leaving him the one face in focus. Modest direct flash lifts the face while darker ambient light keeps crisp natural shadows. A 4:3 medium photograph with hands and table objects fully supported, Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Flash reveals honest texture, modest shine at the forehead, fabric creases, and one natural shadow behind him.",
    "locations": {
      "urban": "a sidewalk coffee patio",
      "outdoorsy": "a trail-town café terrace",
      "homebody": "a local bakery patio"
    },
    "backdrops": {
      "urban": "a coffee counter, a chalkboard and pavement traffic",
      "outdoorsy": "a terrace rail, mountain haze and parked bikes",
      "homebody": "a bakery window, bread trays and the morning street"
    },
    "outfits": {
      "casual": "a plum lambswool crewneck with dark chinos",
      "sharp": "a taupe corduroy blazer over a white oxford",
      "street": "a stone utility overshirt over a heather tee"
    }
  },
  {
    "id": "social-04-c",
    "version": 4,
    "bucket": "social",
    "slot": 4,
    "variant": "c",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He steps away from the counter with a cup in each hand to rejoin the table. He reacts to a comment, eyes on the lens before he arrives. A companion's shoulder crosses the near corner out of focus and {{backdrop}} sit six metres back, leaving him the one face in focus. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. A 3:4 chest-up candid with one soft foreground shoulder, friend-taken iPhone 15 Pro at 35mm equivalent, standard photo mode. Preserve distance-appropriate facial detail, slight gesture motion, and ordinary phone texture with true venue colour.",
    "locations": {
      "urban": "a sidewalk coffee patio",
      "outdoorsy": "a trail-town café terrace",
      "homebody": "a local bakery patio"
    },
    "backdrops": {
      "urban": "a coffee counter, a chalkboard and pavement traffic",
      "outdoorsy": "a terrace rail, mountain haze and parked bikes",
      "homebody": "a bakery window, bread trays and the morning street"
    },
    "outfits": {
      "casual": "a sand waffle henley with black jeans",
      "sharp": "a forest velvet-trim jacket over a black tee",
      "street": "a charcoal hoodie under a black bomber"
    }
  },
  {
    "id": "social-05-a",
    "version": 4,
    "bucket": "social",
    "slot": 5,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He sits at the end of the bench with one hand loose on his knee. He laughs at something off to his right, past the camera. Two turned backs frame him loosely at four metres and {{backdrop}} dissolve nine metres further off, leaving him the one face in focus. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. A 4:3 environmental frame that explains the gathering, Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Retain distance-appropriate facial detail, warm venue colour across his skin, fabric folds, and grain carried through shadow and background alike.",
    "locations": {
      "urban": "a sidewalk coffee patio",
      "outdoorsy": "a trail-town café terrace",
      "homebody": "a local bakery patio"
    },
    "backdrops": {
      "urban": "outdoor tables, planters and a bright shopfront",
      "outdoorsy": "café umbrellas, gravel and open sky",
      "homebody": "patio chairs, a bicycle and a low wall"
    },
    "outfits": {
      "casual": "a teal knit polo with dark denim",
      "sharp": "a cream shawl knit with dark trousers",
      "street": "a mustard fleece half-zip over a white tee"
    }
  },
  {
    "id": "social-05-b",
    "version": 4,
    "bucket": "social",
    "slot": 5,
    "variant": "b",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He shifts along the bench to make room, one palm flat on the seat. The smile stays on the lens as the conversation resumes. Two companions sit turned away at the near edge, shoulders and backs only, softening as {{backdrop}} fall off eight metres behind, leaving him the one face in focus. Modest direct flash lifts the face while darker ambient light keeps crisp natural shadows. A 9:16 full-body flash photograph with room at the edges, Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Flash reveals honest texture, modest shine at the forehead, fabric creases, and one natural shadow behind him.",
    "locations": {
      "urban": "a sidewalk coffee patio",
      "outdoorsy": "a trail-town café terrace",
      "homebody": "a local bakery patio"
    },
    "backdrops": {
      "urban": "outdoor tables, planters and a bright shopfront",
      "outdoorsy": "café umbrellas, gravel and open sky",
      "homebody": "patio chairs, a bicycle and a low wall"
    },
    "outfits": {
      "casual": "a mustard corduroy shirt with charcoal chinos",
      "sharp": "a tobacco suede blazer over a sand knit",
      "street": "an ecru linen overshirt over a grey tee"
    }
  },
  {
    "id": "social-05-c",
    "version": 4,
    "bucket": "social",
    "slot": 5,
    "variant": "c",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He leans forward with forearms on his thighs to hear over the noise. He looks up to the lens with an open, amused expression. Companions read as turned backs and blurred movement at the frame edges, with {{backdrop}} seven metres beyond, leaving him the one face in focus. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. A 9:16 full-body candid that keeps ordinary movement, friend-taken iPhone 15 Pro at 35mm equivalent, standard photo mode. Preserve distance-appropriate facial detail, slight gesture motion, and ordinary phone texture with true venue colour.",
    "locations": {
      "urban": "a sidewalk coffee patio",
      "outdoorsy": "a trail-town café terrace",
      "homebody": "a local bakery patio"
    },
    "backdrops": {
      "urban": "outdoor tables, planters and a bright shopfront",
      "outdoorsy": "café umbrellas, gravel and open sky",
      "homebody": "patio chairs, a bicycle and a low wall"
    },
    "outfits": {
      "casual": "a bone linen overshirt over a washed grey tee",
      "sharp": "a charcoal double-breasted jacket over a white tee",
      "street": "a teal coach jacket over a bone tee"
    }
  },
  {
    "id": "social-06-a",
    "version": 4,
    "bucket": "social",
    "slot": 6,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He gestures with one hand while speaking and keeps a glass low in the other. His eye contact stays with a friend just past the lens. A companion stands away from the lens as a soft silhouette, with {{backdrop}} ten metres back, leaving him the one face in focus. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. A 4:3 waist-up documentary frame from across the table, Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Retain distance-appropriate facial detail, warm venue colour across his skin, fabric folds, and grain carried through shadow and background alike.",
    "locations": {
      "urban": "a sidewalk coffee patio",
      "outdoorsy": "a trail-town café terrace",
      "homebody": "a local bakery patio"
    },
    "backdrops": {
      "urban": "a service hatch, hanging cups and a busy pavement",
      "outdoorsy": "a terrace step, wildflowers and pale peaks",
      "homebody": "a bakery doorway, a menu board and quiet houses"
    },
    "outfits": {
      "casual": "a chambray shirt buttoned low over a white tee",
      "sharp": "a plum knit polo with grey trousers",
      "street": "a brown suede trucker over a black tee"
    }
  },
  {
    "id": "social-06-b",
    "version": 4,
    "bucket": "social",
    "slot": 6,
    "variant": "b",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He finishes explaining something and lowers both hands to the table as the answers come back. He turns to the lens in the pause. A companion's shoulder crosses the near corner out of focus and {{backdrop}} sit six metres back, leaving him the one face in focus. Modest direct flash lifts the face while darker ambient light keeps crisp natural shadows. A 3:4 chest-up frame from a neighbouring seat, Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Flash reveals honest texture, modest shine at the forehead, fabric creases, and one natural shadow behind him.",
    "locations": {
      "urban": "a sidewalk coffee patio",
      "outdoorsy": "a trail-town café terrace",
      "homebody": "a local bakery patio"
    },
    "backdrops": {
      "urban": "a service hatch, hanging cups and a busy pavement",
      "outdoorsy": "a terrace step, wildflowers and pale peaks",
      "homebody": "a bakery doorway, a menu board and quiet houses"
    },
    "outfits": {
      "casual": "a terracotta merino crewneck with dark denim",
      "sharp": "an olive sport coat over a cream shirt",
      "street": "a terracotta hooded overshirt over a cream tee"
    }
  },
  {
    "id": "social-06-c",
    "version": 4,
    "bucket": "social",
    "slot": 6,
    "variant": "c",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He turns from one side of the table to the other mid-story, one hand raised a little. The engaged expression catches the lens between sentences. The table's other guests face away into soft shape, and {{backdrop}} settle five metres behind them, leaving him the one face in focus. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. A 4:3 friend-taken medium shot from conversational distance, friend-taken iPhone 15 Pro at 35mm equivalent, standard photo mode. Preserve distance-appropriate facial detail, slight gesture motion, and ordinary phone texture with true venue colour.",
    "locations": {
      "urban": "a sidewalk coffee patio",
      "outdoorsy": "a trail-town café terrace",
      "homebody": "a local bakery patio"
    },
    "backdrops": {
      "urban": "a service hatch, hanging cups and a busy pavement",
      "outdoorsy": "a terrace step, wildflowers and pale peaks",
      "homebody": "a bakery doorway, a menu board and quiet houses"
    },
    "outfits": {
      "casual": "a grey marl henley with black chinos",
      "sharp": "a mid-brown blazer over a light-blue shirt",
      "street": "a navy bomber over an oat tee"
    }
  },
  {
    "id": "social-07-a",
    "version": 4,
    "bucket": "social",
    "slot": 7,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He stands from the table with one hand on its edge to greet an arrival. He looks back to the lens when the others call after him. Two companions sit turned away at the near edge, shoulders and backs only, softening as {{backdrop}} fall off eight metres behind, leaving him the one face in focus. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. A 4:3 medium frame from the edge of the conversation, Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Retain distance-appropriate facial detail, warm venue colour across his skin, fabric folds, and grain carried through shadow and background alike.",
    "locations": {
      "urban": "a rooftop dinner table",
      "outdoorsy": "a lakeside restaurant deck",
      "homebody": "a backyard supper table"
    },
    "backdrops": {
      "urban": "roof parapets, string lights and a lit skyline",
      "outdoorsy": "deck posts, dark water and far shore lights",
      "homebody": "garden fencing, a barbecue and lit windows"
    },
    "outfits": {
      "casual": "an oat brushed-cotton shirt with dark jeans",
      "sharp": "a black band-collar shirt with dark trousers",
      "street": "a grey marl hoodie under a stone chore jacket"
    }
  },
  {
    "id": "social-07-b",
    "version": 4,
    "bucket": "social",
    "slot": 7,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He comes back carrying one small plate, steadying it with both hands. He smiles toward the lens as he reaches the table. Companions read as turned backs and blurred movement at the frame edges, with {{backdrop}} seven metres beyond, leaving him the one face in focus. Modest direct flash lifts the face while darker ambient light keeps crisp natural shadows. A 3:4 knee-up flash photograph with easy space around him, Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Flash reveals honest texture, modest shine at the forehead, fabric creases, and one natural shadow behind him.",
    "locations": {
      "urban": "a rooftop dinner table",
      "outdoorsy": "a lakeside restaurant deck",
      "homebody": "a backyard supper table"
    },
    "backdrops": {
      "urban": "roof parapets, string lights and a lit skyline",
      "outdoorsy": "deck posts, dark water and far shore lights",
      "homebody": "garden fencing, a barbecue and lit windows"
    },
    "outfits": {
      "casual": "an indigo overshirt over a cream tee",
      "sharp": "a soft-grey flannel jacket over an oat knit",
      "street": "a black waxed trucker over a white tee"
    }
  },
  {
    "id": "social-07-c",
    "version": 4,
    "bucket": "social",
    "slot": 7,
    "variant": "c",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He holds a door with one hand and steps through after the others. He reacts to something said behind him, eyes off to the left of the lens. Two turned backs frame him loosely at four metres and {{backdrop}} dissolve nine metres further off, leaving him the one face in focus. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. A 4:3 waist-up snapshot with the venue still readable, friend-taken iPhone 15 Pro at 35mm equivalent, standard photo mode. Preserve distance-appropriate facial detail, slight gesture motion, and ordinary phone texture with true venue colour.",
    "locations": {
      "urban": "a rooftop dinner table",
      "outdoorsy": "a lakeside restaurant deck",
      "homebody": "a backyard supper table"
    },
    "backdrops": {
      "urban": "roof parapets, string lights and a lit skyline",
      "outdoorsy": "deck posts, dark water and far shore lights",
      "homebody": "garden fencing, a barbecue and lit windows"
    },
    "outfits": {
      "casual": "a burgundy waffle henley with dark denim",
      "sharp": "a bottle-green knit polo with charcoal trousers",
      "street": "a rust bomber over a cream tee"
    }
  },
  {
    "id": "social-08-a",
    "version": 4,
    "bucket": "social",
    "slot": 8,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He settles into his seat after making room, one hand along the chair back. He smiles across the table into the lens. A companion's shoulder crosses the near corner out of focus and {{backdrop}} sit six metres back, leaving him the one face in focus. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. A 4:3 three-quarter frame at seated height, Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Retain distance-appropriate facial detail, warm venue colour across his skin, fabric folds, and grain carried through shadow and background alike.",
    "locations": {
      "urban": "a rooftop dinner table",
      "outdoorsy": "a lakeside restaurant deck",
      "homebody": "a backyard supper table"
    },
    "backdrops": {
      "urban": "rooftop planters, a bar cart and city glow",
      "outdoorsy": "a boat dock, reeds and a low moon",
      "homebody": "a garden table, a hedge and a back door"
    },
    "outfits": {
      "casual": "a charcoal merino crewneck with black jeans",
      "sharp": "a navy unstructured blazer over a white tee",
      "street": "a black leather-trim trucker over a white tee"
    }
  },
  {
    "id": "social-08-b",
    "version": 4,
    "bucket": "social",
    "slot": 8,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He rests one forearm along the back of the bench while listening. He turns to the lens with an easy expression. The table's other guests face away into soft shape, and {{backdrop}} settle five metres behind them, leaving him the one face in focus. Modest direct flash lifts the face while darker ambient light keeps crisp natural shadows. A 3:4 waist-up snapshot with his face near the visual centre, Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Flash reveals honest texture, modest shine at the forehead, fabric creases, and one natural shadow behind him.",
    "locations": {
      "urban": "a rooftop dinner table",
      "outdoorsy": "a lakeside restaurant deck",
      "homebody": "a backyard supper table"
    },
    "backdrops": {
      "urban": "rooftop planters, a bar cart and city glow",
      "outdoorsy": "a boat dock, reeds and a low moon",
      "homebody": "a garden table, a hedge and a back door"
    },
    "outfits": {
      "casual": "an ecru overshirt over a dark tee",
      "sharp": "a burgundy fine-knit under a charcoal jacket",
      "street": "a sand canvas overshirt over a charcoal tee"
    }
  },
  {
    "id": "social-08-c",
    "version": 4,
    "bucket": "social",
    "slot": 8,
    "variant": "c",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He slides a menu across with one hand and leans back as it is argued with. The laugh goes to his right, toward whoever objected. A companion stands away from the lens as a soft silhouette, with {{backdrop}} ten metres back, leaving him the one face in focus. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. A 4:3 three-quarter candid at seated height, friend-taken iPhone 15 Pro at 35mm equivalent, standard photo mode. Preserve distance-appropriate facial detail, slight gesture motion, and ordinary phone texture with true venue colour.",
    "locations": {
      "urban": "a rooftop dinner table",
      "outdoorsy": "a lakeside restaurant deck",
      "homebody": "a backyard supper table"
    },
    "backdrops": {
      "urban": "rooftop planters, a bar cart and city glow",
      "outdoorsy": "a boat dock, reeds and a low moon",
      "homebody": "a garden table, a hedge and a back door"
    },
    "outfits": {
      "casual": "a forest-green corduroy shirt with dark chinos",
      "sharp": "a stone linen blazer over an ecru shirt",
      "street": "an indigo denim jacket over a black tee"
    }
  },
  {
    "id": "social-09-a",
    "version": 4,
    "bucket": "social",
    "slot": 9,
    "variant": "a",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He walks between tables with one hand steadying a glass. He turns his head to the lens as his name is called. Companions read as turned backs and blurred movement at the frame edges, with {{backdrop}} seven metres beyond, leaving him the one face in focus. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. A 3:4 chest-up frame through a little foreground context, Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Retain distance-appropriate facial detail, warm venue colour across his skin, fabric folds, and grain carried through shadow and background alike.",
    "locations": {
      "urban": "a rooftop dinner table",
      "outdoorsy": "a lakeside restaurant deck",
      "homebody": "a backyard supper table"
    },
    "backdrops": {
      "urban": "roof-edge railings, aerials and distant towers",
      "outdoorsy": "lakeside decking, moored boats and dark hills",
      "homebody": "a garden path, a shed and a leaning tree"
    },
    "outfits": {
      "casual": "a rust knit polo with dark denim",
      "sharp": "a black shawl-collar knit with dark trousers",
      "street": "a forest coach jacket over an oat tee"
    }
  },
  {
    "id": "social-09-b",
    "version": 4,
    "bucket": "social",
    "slot": 9,
    "variant": "b",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He carries two cups carefully, one in each hand, and spots the table. He smiles at the lens before setting them down. Two turned backs frame him loosely at four metres and {{backdrop}} dissolve nine metres further off, leaving him the one face in focus. Modest direct flash lifts the face while darker ambient light keeps crisp natural shadows. A 4:3 medium photograph with hands and table objects fully supported, Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Flash reveals honest texture, modest shine at the forehead, fabric creases, and one natural shadow behind him.",
    "locations": {
      "urban": "a rooftop dinner table",
      "outdoorsy": "a lakeside restaurant deck",
      "homebody": "a backyard supper table"
    },
    "backdrops": {
      "urban": "roof-edge railings, aerials and distant towers",
      "outdoorsy": "lakeside decking, moored boats and dark hills",
      "homebody": "a garden path, a shed and a leaning tree"
    },
    "outfits": {
      "casual": "a stone linen shirt with the sleeves rolled and dark jeans",
      "sharp": "a camel sport coat over a cream shirt",
      "street": "a cream boxy overshirt over a washed-black tee"
    }
  },
  {
    "id": "social-09-c",
    "version": 4,
    "bucket": "social",
    "slot": 9,
    "variant": "c",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He steps around an occupied chair, one hand out for balance, still talking. His attention stays beside him, off to the left of the lens. Two companions sit turned away at the near edge, shoulders and backs only, softening as {{backdrop}} fall off eight metres behind, leaving him the one face in focus. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. A 3:4 chest-up candid with one soft foreground shoulder, friend-taken iPhone 15 Pro at 35mm equivalent, standard photo mode. Preserve distance-appropriate facial detail, slight gesture motion, and ordinary phone texture with true venue colour.",
    "locations": {
      "urban": "a rooftop dinner table",
      "outdoorsy": "a lakeside restaurant deck",
      "homebody": "a backyard supper table"
    },
    "backdrops": {
      "urban": "roof-edge railings, aerials and distant towers",
      "outdoorsy": "lakeside decking, moored boats and dark hills",
      "homebody": "a garden path, a shed and a leaning tree"
    },
    "outfits": {
      "casual": "a slate-blue henley with charcoal chinos",
      "sharp": "a slate merino roll-neck with grey trousers",
      "street": "a burgundy varsity jacket over a grey tee"
    }
  },
  {
    "id": "social-10-a",
    "version": 4,
    "bucket": "social",
    "slot": 10,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He keeps a drink low near the table with one hand and laughs at a comment. He looks to the lens as it lands. The table's other guests face away into soft shape, and {{backdrop}} settle five metres behind them, leaving him the one face in focus. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. A 4:3 environmental frame that explains the gathering, Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Retain distance-appropriate facial detail, warm venue colour across his skin, fabric folds, and grain carried through shadow and background alike.",
    "locations": {
      "urban": "a restrained cocktail lounge",
      "outdoorsy": "a lodge common-room bar",
      "homebody": "a neighborhood pub counter"
    },
    "backdrops": {
      "urban": "a lounge bar, backlit bottles and low booth lamps",
      "outdoorsy": "a timber bar, hung snowshoes and a fire glow",
      "homebody": "pub taps, a chalkboard and a dim corner"
    },
    "outfits": {
      "casual": "a cream cable knit with dark denim",
      "sharp": "a rust silk-blend shirt with black trousers",
      "street": "a slate windbreaker over a white tee"
    }
  },
  {
    "id": "social-10-b",
    "version": 4,
    "bucket": "social",
    "slot": 10,
    "variant": "b",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He reaches across to return a bottle opener and draws his hand back. He smiles toward the lens as he settles again. A companion stands away from the lens as a soft silhouette, with {{backdrop}} ten metres back, leaving him the one face in focus. Modest direct flash lifts the face while darker ambient light keeps crisp natural shadows. A 9:16 full-body flash photograph with room at the edges, Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Flash reveals honest texture, modest shine at the forehead, fabric creases, and one natural shadow behind him.",
    "locations": {
      "urban": "a restrained cocktail lounge",
      "outdoorsy": "a lodge common-room bar",
      "homebody": "a neighborhood pub counter"
    },
    "backdrops": {
      "urban": "a lounge bar, backlit bottles and low booth lamps",
      "outdoorsy": "a timber bar, hung snowshoes and a fire glow",
      "homebody": "pub taps, a chalkboard and a dim corner"
    },
    "outfits": {
      "casual": "a chocolate suede-trim overshirt over a black tee",
      "sharp": "a chalk-grey blazer over a black knit polo",
      "street": "a chocolate corduroy trucker over a cream tee"
    }
  },
  {
    "id": "social-10-c",
    "version": 4,
    "bucket": "social",
    "slot": 10,
    "variant": "c",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He stands at the bar with one elbow on it, a glass in the other hand. He reacts with a soft real laugh, eyes on the lens. A companion's shoulder crosses the near corner out of focus and {{backdrop}} sit six metres back, leaving him the one face in focus. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. A 9:16 full-body candid that keeps ordinary movement, friend-taken iPhone 15 Pro at 35mm equivalent, standard photo mode. Preserve distance-appropriate facial detail, slight gesture motion, and ordinary phone texture with true venue colour.",
    "locations": {
      "urban": "a restrained cocktail lounge",
      "outdoorsy": "a lodge common-room bar",
      "homebody": "a neighborhood pub counter"
    },
    "backdrops": {
      "urban": "a lounge bar, backlit bottles and low booth lamps",
      "outdoorsy": "a timber bar, hung snowshoes and a fire glow",
      "homebody": "pub taps, a chalkboard and a dim corner"
    },
    "outfits": {
      "casual": "an olive flannel worn open over a grey tee",
      "sharp": "an ink-blue shirt open at the collar with charcoal trousers",
      "street": "an olive field jacket over a black tee"
    }
  },
  {
    "id": "social-11-a",
    "version": 4,
    "bucket": "social",
    "slot": 11,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He leans in with one hand on the bar to hear over the room. He turns back with an animated reply aimed at the lens. Two turned backs frame him loosely at four metres and {{backdrop}} dissolve nine metres further off, leaving him the one face in focus. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. A 4:3 waist-up documentary frame from across the table, Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Retain distance-appropriate facial detail, warm venue colour across his skin, fabric folds, and grain carried through shadow and background alike.",
    "locations": {
      "urban": "a restrained cocktail lounge",
      "outdoorsy": "a lodge common-room bar",
      "homebody": "a neighborhood pub counter"
    },
    "backdrops": {
      "urban": "a bar mirror, hanging stems and dark panelling",
      "outdoorsy": "lodge beams, a stone hearth and worn armchairs",
      "homebody": "beer pumps, framed photographs and a low doorway"
    },
    "outfits": {
      "casual": "a plum lambswool crewneck with dark chinos",
      "sharp": "a taupe corduroy blazer over a white oxford",
      "street": "a stone utility overshirt over a heather tee"
    }
  },
  {
    "id": "social-11-b",
    "version": 4,
    "bucket": "social",
    "slot": 11,
    "variant": "b",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He joins the edge of a conversation, both hands loose in front of him. He smiles to the lens before adding his own line. Two companions sit turned away at the near edge, shoulders and backs only, softening as {{backdrop}} fall off eight metres behind, leaving him the one face in focus. Modest direct flash lifts the face while darker ambient light keeps crisp natural shadows. A 3:4 chest-up frame from a neighbouring seat, Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Flash reveals honest texture, modest shine at the forehead, fabric creases, and one natural shadow behind him.",
    "locations": {
      "urban": "a restrained cocktail lounge",
      "outdoorsy": "a lodge common-room bar",
      "homebody": "a neighborhood pub counter"
    },
    "backdrops": {
      "urban": "a bar mirror, hanging stems and dark panelling",
      "outdoorsy": "lodge beams, a stone hearth and worn armchairs",
      "homebody": "beer pumps, framed photographs and a low doorway"
    },
    "outfits": {
      "casual": "a sand waffle henley with black jeans",
      "sharp": "a forest velvet-trim jacket over a black tee",
      "street": "a charcoal hoodie under a black bomber"
    }
  },
  {
    "id": "social-11-c",
    "version": 4,
    "bucket": "social",
    "slot": 11,
    "variant": "c",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He turns his stool toward the group, one hand flat on the counter. He listens with an amused expression, eyes off to the right of the lens. Companions read as turned backs and blurred movement at the frame edges, with {{backdrop}} seven metres beyond, leaving him the one face in focus. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. A 4:3 friend-taken medium shot from conversational distance, friend-taken iPhone 15 Pro at 35mm equivalent, standard photo mode. Preserve distance-appropriate facial detail, slight gesture motion, and ordinary phone texture with true venue colour.",
    "locations": {
      "urban": "a restrained cocktail lounge",
      "outdoorsy": "a lodge common-room bar",
      "homebody": "a neighborhood pub counter"
    },
    "backdrops": {
      "urban": "a bar mirror, hanging stems and dark panelling",
      "outdoorsy": "lodge beams, a stone hearth and worn armchairs",
      "homebody": "beer pumps, framed photographs and a low doorway"
    },
    "outfits": {
      "casual": "a teal knit polo with dark denim",
      "sharp": "a cream shawl knit with dark trousers",
      "street": "a mustard fleece half-zip over a white tee"
    }
  },
  {
    "id": "social-12-a",
    "version": 4,
    "bucket": "social",
    "slot": 12,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He sits near the doorway after the rush, forearms loose on his knees. He looks up to the lens with a tired, happy grin. A companion stands away from the lens as a soft silhouette, with {{backdrop}} ten metres back, leaving him the one face in focus. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. A 4:3 medium frame from the edge of the conversation, Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Retain distance-appropriate facial detail, warm venue colour across his skin, fabric folds, and grain carried through shadow and background alike.",
    "locations": {
      "urban": "a restrained cocktail lounge",
      "outdoorsy": "a lodge common-room bar",
      "homebody": "a neighborhood pub counter"
    },
    "backdrops": {
      "urban": "a lounge doorway, a coat rail and street light beyond",
      "outdoorsy": "a common-room window, cold blue dusk and log stacks",
      "homebody": "a pub window, wet pavement and passing cars"
    },
    "outfits": {
      "casual": "a mustard corduroy shirt with charcoal chinos",
      "sharp": "a tobacco suede blazer over a sand knit",
      "street": "an ecru linen overshirt over a grey tee"
    }
  },
  {
    "id": "social-12-b",
    "version": 4,
    "bucket": "social",
    "slot": 12,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He lowers himself onto the step with one hand braced beside him. The laugh goes off to the left of the lens, at somebody's recap. A companion's shoulder crosses the near corner out of focus and {{backdrop}} sit six metres back, leaving him the one face in focus. Modest direct flash lifts the face while darker ambient light keeps crisp natural shadows. A 3:4 knee-up flash photograph with easy space around him, Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Flash reveals honest texture, modest shine at the forehead, fabric creases, and one natural shadow behind him.",
    "locations": {
      "urban": "a restrained cocktail lounge",
      "outdoorsy": "a lodge common-room bar",
      "homebody": "a neighborhood pub counter"
    },
    "backdrops": {
      "urban": "a lounge doorway, a coat rail and street light beyond",
      "outdoorsy": "a common-room window, cold blue dusk and log stacks",
      "homebody": "a pub window, wet pavement and passing cars"
    },
    "outfits": {
      "casual": "a bone linen overshirt over a washed grey tee",
      "sharp": "a charcoal double-breasted jacket over a white tee",
      "street": "a teal coach jacket over a bone tee"
    }
  },
  {
    "id": "social-12-c",
    "version": 4,
    "bucket": "social",
    "slot": 12,
    "variant": "c",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He waits by the doorway with both hands in his pockets, watching for the others. He smiles to the lens when they finally appear. The table's other guests face away into soft shape, and {{backdrop}} settle five metres behind them, leaving him the one face in focus. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. A 4:3 waist-up snapshot with the venue still readable, friend-taken iPhone 15 Pro at 35mm equivalent, standard photo mode. Preserve distance-appropriate facial detail, slight gesture motion, and ordinary phone texture with true venue colour.",
    "locations": {
      "urban": "a restrained cocktail lounge",
      "outdoorsy": "a lodge common-room bar",
      "homebody": "a neighborhood pub counter"
    },
    "backdrops": {
      "urban": "a lounge doorway, a coat rail and street light beyond",
      "outdoorsy": "a common-room window, cold blue dusk and log stacks",
      "homebody": "a pub window, wet pavement and passing cars"
    },
    "outfits": {
      "casual": "a chambray shirt buttoned low over a white tee",
      "sharp": "a plum knit polo with grey trousers",
      "street": "a brown suede trucker over a black tee"
    }
  },
  {
    "id": "social-13-a",
    "version": 4,
    "bucket": "social",
    "slot": 13,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He brings his hands together in one short clap at the end of a story. The laugh comes back forward to the lens. Two companions sit turned away at the near edge, shoulders and backs only, softening as {{backdrop}} fall off eight metres behind, leaving him the one face in focus. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. A 4:3 three-quarter frame at seated height, Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Retain distance-appropriate facial detail, warm venue colour across his skin, fabric folds, and grain carried through shadow and background alike.",
    "locations": {
      "urban": "an urban park café bench",
      "outdoorsy": "a scenic picnic overlook bench",
      "homebody": "a shared courtyard bench"
    },
    "backdrops": {
      "urban": "park trees, a café kiosk and a lit path",
      "outdoorsy": "an overlook rail, a valley and far ridgelines",
      "homebody": "courtyard planters, brick walls and lit windows"
    },
    "outfits": {
      "casual": "a terracotta merino crewneck with dark denim",
      "sharp": "an olive sport coat over a cream shirt",
      "street": "a terracotta hooded overshirt over a cream tee"
    }
  },
  {
    "id": "social-13-b",
    "version": 4,
    "bucket": "social",
    "slot": 13,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He reacts to an unexpected joke with both hands still near the bench. The open laugh goes straight to the lens. Companions read as turned backs and blurred movement at the frame edges, with {{backdrop}} seven metres beyond, leaving him the one face in focus. Modest direct flash lifts the face while darker ambient light keeps crisp natural shadows. A 3:4 waist-up snapshot with his face near the visual centre, Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Flash reveals honest texture, modest shine at the forehead, fabric creases, and one natural shadow behind him.",
    "locations": {
      "urban": "an urban park café bench",
      "outdoorsy": "a scenic picnic overlook bench",
      "homebody": "a shared courtyard bench"
    },
    "backdrops": {
      "urban": "park trees, a café kiosk and a lit path",
      "outdoorsy": "an overlook rail, a valley and far ridgelines",
      "homebody": "courtyard planters, brick walls and lit windows"
    },
    "outfits": {
      "casual": "a grey marl henley with black chinos",
      "sharp": "a mid-brown blazer over a light-blue shirt",
      "street": "a navy bomber over an oat tee"
    }
  },
  {
    "id": "social-13-c",
    "version": 4,
    "bucket": "social",
    "slot": 13,
    "variant": "c",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He turns toward the person beside him, one hand on the bench between them. He shares the laughter off to his right, past the camera. Two turned backs frame him loosely at four metres and {{backdrop}} dissolve nine metres further off, leaving him the one face in focus. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. A 4:3 three-quarter candid at seated height, friend-taken iPhone 15 Pro at 35mm equivalent, standard photo mode. Preserve distance-appropriate facial detail, slight gesture motion, and ordinary phone texture with true venue colour.",
    "locations": {
      "urban": "an urban park café bench",
      "outdoorsy": "a scenic picnic overlook bench",
      "homebody": "a shared courtyard bench"
    },
    "backdrops": {
      "urban": "park trees, a café kiosk and a lit path",
      "outdoorsy": "an overlook rail, a valley and far ridgelines",
      "homebody": "courtyard planters, brick walls and lit windows"
    },
    "outfits": {
      "casual": "an oat brushed-cotton shirt with dark jeans",
      "sharp": "a black band-collar shirt with dark trousers",
      "street": "a grey marl hoodie under a stone chore jacket"
    }
  },
  {
    "id": "social-14-a",
    "version": 4,
    "bucket": "social",
    "slot": 14,
    "variant": "a",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He reaches for a paper cup and pauses with his hand on it when a question comes. He looks up to the lens with an interested smile. A companion's shoulder crosses the near corner out of focus and {{backdrop}} sit six metres back, leaving him the one face in focus. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. A 3:4 chest-up frame through a little foreground context, Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Retain distance-appropriate facial detail, warm venue colour across his skin, fabric folds, and grain carried through shadow and background alike.",
    "locations": {
      "urban": "an urban park café bench",
      "outdoorsy": "a scenic picnic overlook bench",
      "homebody": "a shared courtyard bench"
    },
    "backdrops": {
      "urban": "a bench back, passing joggers and a bright kiosk",
      "outdoorsy": "picnic tables, long grass and open sky",
      "homebody": "a courtyard gate, bicycles and a stairwell light"
    },
    "outfits": {
      "casual": "an indigo overshirt over a cream tee",
      "sharp": "a soft-grey flannel jacket over an oat knit",
      "street": "a black waxed trucker over a white tee"
    }
  },
  {
    "id": "social-14-b",
    "version": 4,
    "bucket": "social",
    "slot": 14,
    "variant": "b",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He passes a bag of pastries across and keeps one hand on the bench. He listens to the answer with his eyes on the lens. The table's other guests face away into soft shape, and {{backdrop}} settle five metres behind them, leaving him the one face in focus. Modest direct flash lifts the face while darker ambient light keeps crisp natural shadows. A 4:3 medium photograph with hands and table objects fully supported, Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Flash reveals honest texture, modest shine at the forehead, fabric creases, and one natural shadow behind him.",
    "locations": {
      "urban": "an urban park café bench",
      "outdoorsy": "a scenic picnic overlook bench",
      "homebody": "a shared courtyard bench"
    },
    "backdrops": {
      "urban": "a bench back, passing joggers and a bright kiosk",
      "outdoorsy": "picnic tables, long grass and open sky",
      "homebody": "a courtyard gate, bicycles and a stairwell light"
    },
    "outfits": {
      "casual": "a burgundy waffle henley with dark denim",
      "sharp": "a bottle-green knit polo with charcoal trousers",
      "street": "a rust bomber over a cream tee"
    }
  },
  {
    "id": "social-14-c",
    "version": 4,
    "bucket": "social",
    "slot": 14,
    "variant": "c",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He folds a paper bag closed, sets it aside, and brushes crumbs from his palm. He rejoins the conversation, eyes to the lens. A companion stands away from the lens as a soft silhouette, with {{backdrop}} ten metres back, leaving him the one face in focus. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. A 3:4 chest-up candid with one soft foreground shoulder, friend-taken iPhone 15 Pro at 35mm equivalent, standard photo mode. Preserve distance-appropriate facial detail, slight gesture motion, and ordinary phone texture with true venue colour.",
    "locations": {
      "urban": "an urban park café bench",
      "outdoorsy": "a scenic picnic overlook bench",
      "homebody": "a shared courtyard bench"
    },
    "backdrops": {
      "urban": "a bench back, passing joggers and a bright kiosk",
      "outdoorsy": "picnic tables, long grass and open sky",
      "homebody": "a courtyard gate, bicycles and a stairwell light"
    },
    "outfits": {
      "casual": "a charcoal merino crewneck with black jeans",
      "sharp": "a navy unstructured blazer over a white tee",
      "street": "a black leather-trim trucker over a white tee"
    }
  },
  {
    "id": "social-15-a",
    "version": 4,
    "bucket": "social",
    "slot": 15,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He stands beside the bench, one hand shaping a point as he explains something. His attention stays with a friend just left of the lens. Companions read as turned backs and blurred movement at the frame edges, with {{backdrop}} seven metres beyond, leaving him the one face in focus. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. A 4:3 environmental frame that explains the gathering, Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Retain distance-appropriate facial detail, warm venue colour across his skin, fabric folds, and grain carried through shadow and background alike.",
    "locations": {
      "urban": "an urban park café bench",
      "outdoorsy": "a scenic picnic overlook bench",
      "homebody": "a shared courtyard bench"
    },
    "backdrops": {
      "urban": "park railings, a bandstand and evening haze",
      "outdoorsy": "a stone parapet, pines and low cloud",
      "homebody": "a shared bench, washing lines and warm windows"
    },
    "outfits": {
      "casual": "an ecru overshirt over a dark tee",
      "sharp": "a burgundy fine-knit under a charcoal jacket",
      "street": "a sand canvas overshirt over a charcoal tee"
    }
  },
  {
    "id": "social-15-b",
    "version": 4,
    "bucket": "social",
    "slot": 15,
    "variant": "b",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He moves a bag aside with one hand to clear space on the bench. He turns to the lens with an animated expression. Two turned backs frame him loosely at four metres and {{backdrop}} dissolve nine metres further off, leaving him the one face in focus. Modest direct flash lifts the face while darker ambient light keeps crisp natural shadows. A 9:16 full-body flash photograph with room at the edges, Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Flash reveals honest texture, modest shine at the forehead, fabric creases, and one natural shadow behind him.",
    "locations": {
      "urban": "an urban park café bench",
      "outdoorsy": "a scenic picnic overlook bench",
      "homebody": "a shared courtyard bench"
    },
    "backdrops": {
      "urban": "park railings, a bandstand and evening haze",
      "outdoorsy": "a stone parapet, pines and low cloud",
      "homebody": "a shared bench, washing lines and warm windows"
    },
    "outfits": {
      "casual": "a forest-green corduroy shirt with dark chinos",
      "sharp": "a stone linen blazer over an ecru shirt",
      "street": "an indigo denim jacket over a black tee"
    }
  },
  {
    "id": "social-15-c",
    "version": 4,
    "bucket": "social",
    "slot": 15,
    "variant": "c",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He arrives, places his phone face down beside him, and rests both hands on his knees. He smiles to the lens as the group brings him in. Two companions sit turned away at the near edge, shoulders and backs only, softening as {{backdrop}} fall off eight metres behind, leaving him the one face in focus. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. A 9:16 full-body candid that keeps ordinary movement, friend-taken iPhone 15 Pro at 35mm equivalent, standard photo mode. Preserve distance-appropriate facial detail, slight gesture motion, and ordinary phone texture with true venue colour.",
    "locations": {
      "urban": "an urban park café bench",
      "outdoorsy": "a scenic picnic overlook bench",
      "homebody": "a shared courtyard bench"
    },
    "backdrops": {
      "urban": "park railings, a bandstand and evening haze",
      "outdoorsy": "a stone parapet, pines and low cloud",
      "homebody": "a shared bench, washing lines and warm windows"
    },
    "outfits": {
      "casual": "a rust knit polo with dark denim",
      "sharp": "a black shawl-collar knit with dark trousers",
      "street": "a forest coach jacket over an oat tee"
    }
  },
  {
    "id": "social-16-a",
    "version": 4,
    "bucket": "social",
    "slot": 16,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He lifts a glass in one hand toward the far end of the table and lowers it naturally. The brief eye contact goes to the lens. The table's other guests face away into soft shape, and {{backdrop}} settle five metres behind them, leaving him the one face in focus. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. A 4:3 waist-up documentary frame from across the table, Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Retain distance-appropriate facial detail, warm venue colour across his skin, fabric folds, and grain carried through shadow and background alike.",
    "locations": {
      "urban": "a modern restaurant lounge",
      "outdoorsy": "a rustic lodge common room",
      "homebody": "an apartment dinner gathering"
    },
    "backdrops": {
      "urban": "a restaurant bar, pendant lamps and a service pass",
      "outdoorsy": "roof beams, a stone fireplace and a hung rug",
      "homebody": "an apartment kitchen, open shelves and a hallway light"
    },
    "outfits": {
      "casual": "a stone linen shirt with the sleeves rolled and dark jeans",
      "sharp": "a camel sport coat over a cream shirt",
      "street": "a cream boxy overshirt over a washed-black tee"
    }
  },
  {
    "id": "social-16-b",
    "version": 4,
    "bucket": "social",
    "slot": 16,
    "variant": "b",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He joins a small toast, the glass in one hand close to his chest. He smiles at the person opposite, just past the lens. A companion stands away from the lens as a soft silhouette, with {{backdrop}} ten metres back, leaving him the one face in focus. Modest direct flash lifts the face while darker ambient light keeps crisp natural shadows. A 3:4 chest-up frame from a neighbouring seat, Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Flash reveals honest texture, modest shine at the forehead, fabric creases, and one natural shadow behind him.",
    "locations": {
      "urban": "a modern restaurant lounge",
      "outdoorsy": "a rustic lodge common room",
      "homebody": "an apartment dinner gathering"
    },
    "backdrops": {
      "urban": "a restaurant bar, pendant lamps and a service pass",
      "outdoorsy": "roof beams, a stone fireplace and a hung rug",
      "homebody": "an apartment kitchen, open shelves and a hallway light"
    },
    "outfits": {
      "casual": "a slate-blue henley with charcoal chinos",
      "sharp": "a slate merino roll-neck with grey trousers",
      "street": "a burgundy varsity jacket over a grey tee"
    }
  },
  {
    "id": "social-16-c",
    "version": 4,
    "bucket": "social",
    "slot": 16,
    "variant": "c",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He passes a glass across with one hand and keeps his own near the table. He laughs at the thanks, eyes coming to the lens. A companion's shoulder crosses the near corner out of focus and {{backdrop}} sit six metres back, leaving him the one face in focus. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. A 4:3 friend-taken medium shot from conversational distance, friend-taken iPhone 15 Pro at 35mm equivalent, standard photo mode. Preserve distance-appropriate facial detail, slight gesture motion, and ordinary phone texture with true venue colour.",
    "locations": {
      "urban": "a modern restaurant lounge",
      "outdoorsy": "a rustic lodge common room",
      "homebody": "an apartment dinner gathering"
    },
    "backdrops": {
      "urban": "a restaurant bar, pendant lamps and a service pass",
      "outdoorsy": "roof beams, a stone fireplace and a hung rug",
      "homebody": "an apartment kitchen, open shelves and a hallway light"
    },
    "outfits": {
      "casual": "a cream cable knit with dark denim",
      "sharp": "a rust silk-blend shirt with black trousers",
      "street": "a slate windbreaker over a white tee"
    }
  },
  {
    "id": "social-17-a",
    "version": 4,
    "bucket": "social",
    "slot": 17,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He sits back on the sofa with his phone face down and both hands still. He listens closely, eyes fixed just beside the lens. Two turned backs frame him loosely at four metres and {{backdrop}} dissolve nine metres further off, leaving him the one face in focus. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. A 4:3 medium frame from the edge of the conversation, Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Retain distance-appropriate facial detail, warm venue colour across his skin, fabric folds, and grain carried through shadow and background alike.",
    "locations": {
      "urban": "a modern restaurant lounge",
      "outdoorsy": "a rustic lodge common room",
      "homebody": "an apartment dinner gathering"
    },
    "backdrops": {
      "urban": "banquette seating, wall sconces and a lit corridor",
      "outdoorsy": "log walls, a card table and a reading lamp",
      "homebody": "a dining table, a sideboard and a lit doorway"
    },
    "outfits": {
      "casual": "a chocolate suede-trim overshirt over a black tee",
      "sharp": "a chalk-grey blazer over a black knit polo",
      "street": "a chocolate corduroy trucker over a cream tee"
    }
  },
  {
    "id": "social-17-b",
    "version": 4,
    "bucket": "social",
    "slot": 17,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He shifts one leg and drops a hand to the cushion to make room. He stays in the conversation, looking to the lens. Two companions sit turned away at the near edge, shoulders and backs only, softening as {{backdrop}} fall off eight metres behind, leaving him the one face in focus. Modest direct flash lifts the face while darker ambient light keeps crisp natural shadows. A 3:4 knee-up flash photograph with easy space around him, Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Flash reveals honest texture, modest shine at the forehead, fabric creases, and one natural shadow behind him.",
    "locations": {
      "urban": "a modern restaurant lounge",
      "outdoorsy": "a rustic lodge common room",
      "homebody": "an apartment dinner gathering"
    },
    "backdrops": {
      "urban": "banquette seating, wall sconces and a lit corridor",
      "outdoorsy": "log walls, a card table and a reading lamp",
      "homebody": "a dining table, a sideboard and a lit doorway"
    },
    "outfits": {
      "casual": "an olive flannel worn open over a grey tee",
      "sharp": "an ink-blue shirt open at the collar with charcoal trousers",
      "street": "an olive field jacket over a black tee"
    }
  },
  {
    "id": "social-17-c",
    "version": 4,
    "bucket": "social",
    "slot": 17,
    "variant": "c",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He rests both hands away from his phone and turns toward the speaker. The smile arrives with his eyes on the lens. Companions read as turned backs and blurred movement at the frame edges, with {{backdrop}} seven metres beyond, leaving him the one face in focus. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. A 4:3 waist-up snapshot with the venue still readable, friend-taken iPhone 15 Pro at 35mm equivalent, standard photo mode. Preserve distance-appropriate facial detail, slight gesture motion, and ordinary phone texture with true venue colour.",
    "locations": {
      "urban": "a modern restaurant lounge",
      "outdoorsy": "a rustic lodge common room",
      "homebody": "an apartment dinner gathering"
    },
    "backdrops": {
      "urban": "banquette seating, wall sconces and a lit corridor",
      "outdoorsy": "log walls, a card table and a reading lamp",
      "homebody": "a dining table, a sideboard and a lit doorway"
    },
    "outfits": {
      "casual": "a plum lambswool crewneck with dark chinos",
      "sharp": "a taupe corduroy blazer over a white oxford",
      "street": "a stone utility overshirt over a heather tee"
    }
  },
  {
    "id": "social-18-a",
    "version": 4,
    "bucket": "social",
    "slot": 18,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He waits against the wall with one thumb hooked in a pocket. He looks left as somebody approaches laughing. A companion stands away from the lens as a soft silhouette, with {{backdrop}} ten metres back, leaving him the one face in focus. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. A 4:3 three-quarter frame at standing height, Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Retain distance-appropriate facial detail, warm venue colour across his skin, fabric folds, and grain carried through shadow and background alike.",
    "locations": {
      "urban": "a modern restaurant lounge",
      "outdoorsy": "a rustic lodge common room",
      "homebody": "an apartment dinner gathering"
    },
    "backdrops": {
      "urban": "a restaurant entrance, hung coats and a bright street",
      "outdoorsy": "a common-room door, stacked boots and dark trees",
      "homebody": "an apartment hallway, shoes and a coat hook"
    },
    "outfits": {
      "casual": "a sand waffle henley with black jeans",
      "sharp": "a forest velvet-trim jacket over a black tee",
      "street": "a charcoal hoodie under a black bomber"
    }
  },
  {
    "id": "social-18-b",
    "version": 4,
    "bucket": "social",
    "slot": 18,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He pushes off the wall with one hand to meet an arriving friend. He reacts to the lens before the handshake finishes. A companion's shoulder crosses the near corner out of focus and {{backdrop}} sit six metres back, leaving him the one face in focus. Modest direct flash lifts the face while darker ambient light keeps crisp natural shadows. A 3:4 waist-up snapshot with his face near the visual centre, Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Flash reveals honest texture, modest shine at the forehead, fabric creases, and one natural shadow behind him.",
    "locations": {
      "urban": "a modern restaurant lounge",
      "outdoorsy": "a rustic lodge common room",
      "homebody": "an apartment dinner gathering"
    },
    "backdrops": {
      "urban": "a restaurant entrance, hung coats and a bright street",
      "outdoorsy": "a common-room door, stacked boots and dark trees",
      "homebody": "an apartment hallway, shoes and a coat hook"
    },
    "outfits": {
      "casual": "a teal knit polo with dark denim",
      "sharp": "a cream shawl knit with dark trousers",
      "street": "a mustard fleece half-zip over a white tee"
    }
  },
  {
    "id": "social-18-c",
    "version": 4,
    "bucket": "social",
    "slot": 18,
    "variant": "c",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He stands near the entrance with both hands relaxed and hears the group behind him. He turns to the lens with a broad smile. The table's other guests face away into soft shape, and {{backdrop}} settle five metres behind them, leaving him the one face in focus. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. A 4:3 three-quarter candid at standing height, friend-taken iPhone 15 Pro at 35mm equivalent, standard photo mode. Preserve distance-appropriate facial detail, slight gesture motion, and ordinary phone texture with true venue colour.",
    "locations": {
      "urban": "a modern restaurant lounge",
      "outdoorsy": "a rustic lodge common room",
      "homebody": "an apartment dinner gathering"
    },
    "backdrops": {
      "urban": "a restaurant entrance, hung coats and a bright street",
      "outdoorsy": "a common-room door, stacked boots and dark trees",
      "homebody": "an apartment hallway, shoes and a coat hook"
    },
    "outfits": {
      "casual": "a mustard corduroy shirt with charcoal chinos",
      "sharp": "a tobacco suede blazer over a sand knit",
      "street": "an ecru linen overshirt over a grey tee"
    }
  },
  {
    "id": "social-19-a",
    "version": 4,
    "bucket": "social",
    "slot": 19,
    "variant": "a",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He lowers a small plate after a first taste, one hand under it. He looks up to the lens at the amused reaction. Two companions sit turned away at the near edge, shoulders and backs only, softening as {{backdrop}} fall off eight metres behind, leaving him the one face in focus. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. A 3:4 chest-up frame through a little foreground context, Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Retain distance-appropriate facial detail, warm venue colour across his skin, fabric folds, and grain carried through shadow and background alike.",
    "locations": {
      "urban": "an indoor-outdoor dinner party",
      "outdoorsy": "a sheltered campground barbecue",
      "homebody": "an apartment balcony gathering"
    },
    "backdrops": {
      "urban": "open doors, a garden strip and a lit interior",
      "outdoorsy": "a canvas shelter, a fire pit and dark pines",
      "homebody": "balcony railings, plant pots and city glow"
    },
    "outfits": {
      "casual": "a bone linen overshirt over a washed grey tee",
      "sharp": "a charcoal double-breasted jacket over a white tee",
      "street": "a teal coach jacket over a bone tee"
    }
  },
  {
    "id": "social-19-b",
    "version": 4,
    "bucket": "social",
    "slot": 19,
    "variant": "b",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He offers the next bite across, then draws the plate back carefully with both hands. He laughs at the answer, eyes to the lens. Companions read as turned backs and blurred movement at the frame edges, with {{backdrop}} seven metres beyond, leaving him the one face in focus. Modest direct flash lifts the face while darker ambient light keeps crisp natural shadows. A 4:3 medium photograph with hands and table objects fully supported, Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Flash reveals honest texture, modest shine at the forehead, fabric creases, and one natural shadow behind him.",
    "locations": {
      "urban": "an indoor-outdoor dinner party",
      "outdoorsy": "a sheltered campground barbecue",
      "homebody": "an apartment balcony gathering"
    },
    "backdrops": {
      "urban": "open doors, a garden strip and a lit interior",
      "outdoorsy": "a canvas shelter, a fire pit and dark pines",
      "homebody": "balcony railings, plant pots and city glow"
    },
    "outfits": {
      "casual": "a chambray shirt buttoned low over a white tee",
      "sharp": "a plum knit polo with grey trousers",
      "street": "a brown suede trucker over a black tee"
    }
  },
  {
    "id": "social-19-c",
    "version": 4,
    "bucket": "social",
    "slot": 19,
    "variant": "c",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He waits beside the table with a plate balanced on one palm. He reacts as the food arrives, looking off to the right of the lens. Two turned backs frame him loosely at four metres and {{backdrop}} dissolve nine metres further off, leaving him the one face in focus. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. A 3:4 chest-up candid with one soft foreground shoulder, friend-taken iPhone 15 Pro at 35mm equivalent, standard photo mode. Preserve distance-appropriate facial detail, slight gesture motion, and ordinary phone texture with true venue colour.",
    "locations": {
      "urban": "an indoor-outdoor dinner party",
      "outdoorsy": "a sheltered campground barbecue",
      "homebody": "an apartment balcony gathering"
    },
    "backdrops": {
      "urban": "open doors, a garden strip and a lit interior",
      "outdoorsy": "a canvas shelter, a fire pit and dark pines",
      "homebody": "balcony railings, plant pots and city glow"
    },
    "outfits": {
      "casual": "a terracotta merino crewneck with dark denim",
      "sharp": "an olive sport coat over a cream shirt",
      "street": "a terracotta hooded overshirt over a cream tee"
    }
  },
  {
    "id": "social-20-a",
    "version": 4,
    "bucket": "social",
    "slot": 20,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He steps out ahead of the others with a jacket over one forearm. He looks back to the lens at somebody's last joke. A companion's shoulder crosses the near corner out of focus and {{backdrop}} sit six metres back, leaving him the one face in focus. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. A 4:3 environmental frame that explains the gathering, Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Retain distance-appropriate facial detail, warm venue colour across his skin, fabric folds, and grain carried through shadow and background alike.",
    "locations": {
      "urban": "an indoor-outdoor dinner party",
      "outdoorsy": "a sheltered campground barbecue",
      "homebody": "an apartment balcony gathering"
    },
    "backdrops": {
      "urban": "a party doorway, a lit hallway and the street",
      "outdoorsy": "a camp table, lanterns and a dark treeline",
      "homebody": "a balcony door, drawn curtains and rooftops"
    },
    "outfits": {
      "casual": "a grey marl henley with black chinos",
      "sharp": "a mid-brown blazer over a light-blue shirt",
      "street": "a navy bomber over an oat tee"
    }
  },
  {
    "id": "social-20-b",
    "version": 4,
    "bucket": "social",
    "slot": 20,
    "variant": "b",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He holds the door with one hand while the others pass, then follows. He is still smiling toward the lens as he releases it. The table's other guests face away into soft shape, and {{backdrop}} settle five metres behind them, leaving him the one face in focus. Modest direct flash lifts the face while darker ambient light keeps crisp natural shadows. A 9:16 full-body flash photograph with room at the edges, Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Flash reveals honest texture, modest shine at the forehead, fabric creases, and one natural shadow behind him.",
    "locations": {
      "urban": "an indoor-outdoor dinner party",
      "outdoorsy": "a sheltered campground barbecue",
      "homebody": "an apartment balcony gathering"
    },
    "backdrops": {
      "urban": "a party doorway, a lit hallway and the street",
      "outdoorsy": "a camp table, lanterns and a dark treeline",
      "homebody": "a balcony door, drawn curtains and rooftops"
    },
    "outfits": {
      "casual": "an oat brushed-cotton shirt with dark jeans",
      "sharp": "a black band-collar shirt with dark trousers",
      "street": "a grey marl hoodie under a stone chore jacket"
    }
  },
  {
    "id": "social-20-c",
    "version": 4,
    "bucket": "social",
    "slot": 20,
    "variant": "c",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He walks away from the entrance with both hands in his pockets, keeping pace with the group. He turns to the lens while everyone keeps moving. A companion stands away from the lens as a soft silhouette, with {{backdrop}} ten metres back, leaving him the one face in focus. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. A 9:16 full-body candid that keeps ordinary movement, friend-taken iPhone 15 Pro at 35mm equivalent, standard photo mode. Preserve distance-appropriate facial detail, slight gesture motion, and ordinary phone texture with true venue colour.",
    "locations": {
      "urban": "an indoor-outdoor dinner party",
      "outdoorsy": "a sheltered campground barbecue",
      "homebody": "an apartment balcony gathering"
    },
    "backdrops": {
      "urban": "a party doorway, a lit hallway and the street",
      "outdoorsy": "a camp table, lanterns and a dark treeline",
      "homebody": "a balcony door, drawn curtains and rooftops"
    },
    "outfits": {
      "casual": "an indigo overshirt over a cream tee",
      "sharp": "a soft-grey flannel jacket over an oat knit",
      "street": "a black waxed trucker over a white tee"
    }
  },
  {
    "id": "travel-01-a",
    "version": 4,
    "bucket": "travel",
    "slot": 1,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He comes down the station steps with a weekender in one hand, checking the platform number once before pocketing his phone. He looks up to the lens as he reaches the landing. The ground opens fifteen metres to a middle distance and carries on to {{backdrop}} some sixty metres out, softening by layers. Documentary perspective keeps the place legible and the available light honest. A 4:3 environmental portrait with him holding roughly half the frame, Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Keep distance-appropriate facial detail, fabric wear, accurate hands, and real weather in the air.",
    "locations": {
      "urban": "a broad station stair in a capital city",
      "outdoorsy": "a mountain railway stair",
      "homebody": "a regional station stair"
    },
    "backdrops": {
      "urban": "a vaulted concourse, departure boards and small distant travellers",
      "outdoorsy": "a timber station canopy, sleepers and a bare ridge",
      "homebody": "a brick platform building, a footbridge and low rooftops"
    },
    "outfits": {
      "casual": "a sand overshirt over a white tee with dark jeans",
      "sharp": "a camel overcoat over a fine black knit",
      "street": "an olive field jacket over a white tee"
    }
  },
  {
    "id": "travel-01-b",
    "version": 4,
    "bucket": "travel",
    "slot": 1,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He stops below the departure board, bag handle in one fist, and finds his route. He turns back to the lens with the answer. Twenty metres behind him {{backdrop}} sit in gentle haze, the ground between them holding just enough detail to read. Directional daylight gives clean facial detail and moderate separation from the distance. A 3:4 waist-up lifestyle portrait at eye level, Canon R5, 50mm, f/2.8, 1/320, ISO 200. Retain complexion variation, beard detail, clothing folds, and believable focus falloff toward the distance.",
    "locations": {
      "urban": "a broad station stair in a capital city",
      "outdoorsy": "a mountain railway stair",
      "homebody": "a regional station stair"
    },
    "backdrops": {
      "urban": "a vaulted concourse, departure boards and small distant travellers",
      "outdoorsy": "a timber station canopy, sleepers and a bare ridge",
      "homebody": "a brick platform building, a footbridge and low rooftops"
    },
    "outfits": {
      "casual": "a charcoal merino crewneck with straight indigo denim",
      "sharp": "a navy field jacket over a white oxford",
      "street": "a black shell jacket over a heather tee"
    }
  },
  {
    "id": "travel-01-c",
    "version": 4,
    "bucket": "travel",
    "slot": 1,
    "variant": "c",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He reaches the bottom of the stair and shifts the bag from one hand to the other. He turns toward the lens as his name is called. {{backdrop}} lie thirty metres past him, dropping into pale atmospheric distance while the near ground stays legible. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. A 4:3 environmental portrait with layered foreground, subject and distance, Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Preserve gentle skin texture, tonal variation, accurate scale between him and the place, and honest environmental detail.",
    "locations": {
      "urban": "a broad station stair in a capital city",
      "outdoorsy": "a mountain railway stair",
      "homebody": "a regional station stair"
    },
    "backdrops": {
      "urban": "a vaulted concourse, departure boards and small distant travellers",
      "outdoorsy": "a timber station canopy, sleepers and a bare ridge",
      "homebody": "a brick platform building, a footbridge and low rooftops"
    },
    "outfits": {
      "casual": "an olive field shirt worn open over a grey tee",
      "sharp": "a charcoal overcoat over a cream crewneck",
      "street": "a sand canvas trucker over a charcoal tee"
    }
  },
  {
    "id": "travel-02-a",
    "version": 4,
    "bucket": "travel",
    "slot": 2,
    "variant": "a",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He waits partway up the steps with one hand on the rail and a coat folded over his forearm. His eyes stay on the concourse below, past the lens. He stands eight metres clear of the nearest edge, with {{backdrop}} stacked forty metres beyond and losing contrast with depth. Documentary perspective keeps the place legible and the available light honest. A 9:16 full-body documentary frame with straight architectural lines, Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Keep distance-appropriate facial detail, fabric wear, accurate hands, and real weather in the air.",
    "locations": {
      "urban": "a broad station stair in a capital city",
      "outdoorsy": "a mountain railway stair",
      "homebody": "a regional station stair"
    },
    "backdrops": {
      "urban": "arched windows, a ticket hall and moving crowds",
      "outdoorsy": "a signal post, pine slopes and a pale sky",
      "homebody": "a waiting shelter, a car park and a line of trees"
    },
    "outfits": {
      "casual": "a cream fisherman knit with dark chinos",
      "sharp": "a stone trench over a slate knit",
      "street": "an indigo denim jacket over a cream tee"
    }
  },
  {
    "id": "travel-02-b",
    "version": 4,
    "bucket": "travel",
    "slot": 2,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He sets the bag down beside him and pushes both sleeves back off his forearms. He looks to the lens as the announcement finishes. The view runs back from him through twelve metres of open ground to {{backdrop}}, all of it softening toward the horizon. Directional daylight gives clean facial detail and moderate separation from the distance. A 3:4 three-quarter portrait with moderate environmental separation, Canon R5, 50mm, f/2.8, 1/320, ISO 200. Retain complexion variation, beard detail, clothing folds, and believable focus falloff toward the distance.",
    "locations": {
      "urban": "a broad station stair in a capital city",
      "outdoorsy": "a mountain railway stair",
      "homebody": "a regional station stair"
    },
    "backdrops": {
      "urban": "arched windows, a ticket hall and moving crowds",
      "outdoorsy": "a signal post, pine slopes and a pale sky",
      "homebody": "a waiting shelter, a car park and a line of trees"
    },
    "outfits": {
      "casual": "a rust flannel over a washed-black tee",
      "sharp": "a bottle-green wool overshirt over a white shirt",
      "street": "a rust anorak over a black tee"
    }
  },
  {
    "id": "travel-02-c",
    "version": 4,
    "bucket": "travel",
    "slot": 2,
    "variant": "c",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He climbs two steps at an unhurried pace, one hand loose at his side. He glances back over his shoulder toward the lens. Ten metres of foreground lead the eye to him, and {{backdrop}} settle fifty metres further into soft blue depth. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. A 4:3 half-body portrait with the setting rendered in quiet detail, Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Preserve gentle skin texture, tonal variation, accurate scale between him and the place, and honest environmental detail.",
    "locations": {
      "urban": "a broad station stair in a capital city",
      "outdoorsy": "a mountain railway stair",
      "homebody": "a regional station stair"
    },
    "backdrops": {
      "urban": "arched windows, a ticket hall and moving crowds",
      "outdoorsy": "a signal post, pine slopes and a pale sky",
      "homebody": "a waiting shelter, a car park and a line of trees"
    },
    "outfits": {
      "casual": "a slate-blue chambray shirt with the sleeves rolled and dark jeans",
      "sharp": "a tobacco suede jacket over a sand knit",
      "street": "a cream boxy overshirt over a grey tee"
    }
  },
  {
    "id": "travel-03-a",
    "version": 4,
    "bucket": "travel",
    "slot": 3,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He walks the length of the platform with the bag strap across one shoulder and a thumb hooked under it. He watches the far end of the line, off past the lens. Twenty metres behind him {{backdrop}} sit in gentle haze, the ground between them holding just enough detail to read. Documentary perspective keeps the place legible and the available light honest. A 4:3 knee-up frame that keeps the horizon and travel context, Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Keep distance-appropriate facial detail, fabric wear, accurate hands, and real weather in the air.",
    "locations": {
      "urban": "a broad station stair in a capital city",
      "outdoorsy": "a mountain railway stair",
      "homebody": "a regional station stair"
    },
    "backdrops": {
      "urban": "the stair sweeping down to a lit hall and street doors",
      "outdoorsy": "rails curving into a cutting and snow-lined firs",
      "homebody": "a level crossing, hedgerows and a quiet road"
    },
    "outfits": {
      "casual": "a forest-green quarter-zip with stone chinos",
      "sharp": "a black tailored topcoat over a grey roll-neck",
      "street": "a brown suede trucker over a bone tee"
    }
  },
  {
    "id": "travel-03-b",
    "version": 4,
    "bucket": "travel",
    "slot": 3,
    "variant": "b",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He waits at the marked boarding point, hands loose, and shifts his weight once. He smiles to the lens as the train appears. {{backdrop}} lie thirty metres past him, dropping into pale atmospheric distance while the near ground stays legible. Directional daylight gives clean facial detail and moderate separation from the distance. A 9:16 full-body portrait at natural perspective, Canon R5, 50mm, f/2.8, 1/320, ISO 200. Retain complexion variation, beard detail, clothing folds, and believable focus falloff toward the distance.",
    "locations": {
      "urban": "a broad station stair in a capital city",
      "outdoorsy": "a mountain railway stair",
      "homebody": "a regional station stair"
    },
    "backdrops": {
      "urban": "the stair sweeping down to a lit hall and street doors",
      "outdoorsy": "rails curving into a cutting and snow-lined firs",
      "homebody": "a level crossing, hedgerows and a quiet road"
    },
    "outfits": {
      "casual": "an oat waffle henley under a light grey shell",
      "sharp": "a light-blue oxford under a taupe field coat",
      "street": "a slate packable windbreaker over a white tee"
    }
  },
  {
    "id": "travel-03-c",
    "version": 4,
    "bucket": "travel",
    "slot": 3,
    "variant": "c",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He steps aside from the open door with one hand on the frame to let a passenger out. He looks to the lens before boarding. The ground opens fifteen metres to a middle distance and carries on to {{backdrop}} some sixty metres out, softening by layers. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. A 9:16 full-body composition that preserves natural scale, Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Preserve gentle skin texture, tonal variation, accurate scale between him and the place, and honest environmental detail.",
    "locations": {
      "urban": "a broad station stair in a capital city",
      "outdoorsy": "a mountain railway stair",
      "homebody": "a regional station stair"
    },
    "backdrops": {
      "urban": "the stair sweeping down to a lit hall and street doors",
      "outdoorsy": "rails curving into a cutting and snow-lined firs",
      "homebody": "a level crossing, hedgerows and a quiet road"
    },
    "outfits": {
      "casual": "a burgundy lambswool crewneck with dark denim",
      "sharp": "a burgundy fine-knit under a charcoal wool jacket",
      "street": "a forest quilted vest over a charcoal long-sleeve"
    }
  },
  {
    "id": "travel-04-a",
    "version": 4,
    "bucket": "travel",
    "slot": 4,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He rests both forearms on the sea rail and follows a boat across the water. His attention stays out on the bay, past the lens. The view runs back from him through twelve metres of open ground to {{backdrop}}, all of it softening toward the horizon. Documentary perspective keeps the place legible and the available light honest. A 4:3 waist-up portrait with one useful foreground detail, Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Keep distance-appropriate facial detail, fabric wear, accurate hands, and real weather in the air.",
    "locations": {
      "urban": "a coastal promenade on a city break",
      "outdoorsy": "a cliff path near a seaside town",
      "homebody": "a breezy local lakeside path"
    },
    "backdrops": {
      "urban": "a curved sea wall, pastel terraces and open water",
      "outdoorsy": "a grass headland, a chalk drop and a wide bay",
      "homebody": "reed beds, a jetty and the far shore"
    },
    "outfits": {
      "casual": "a chocolate corduroy shirt with faded jeans",
      "sharp": "a cream shawl-collar coat over a dark knit",
      "street": "a burgundy hooded overshirt over a white tee"
    }
  },
  {
    "id": "travel-04-b",
    "version": 4,
    "bucket": "travel",
    "slot": 4,
    "variant": "b",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He finishes pointing at the far shoreline and lowers his hand back to the rail. He turns to the lens with the smile still there. Ten metres of foreground lead the eye to him, and {{backdrop}} settle fifty metres further into soft blue depth. Directional daylight gives clean facial detail and moderate separation from the distance. A 3:4 chest-up portrait with the destination softly recognisable, Canon R5, 50mm, f/2.8, 1/320, ISO 200. Retain complexion variation, beard detail, clothing folds, and believable focus falloff toward the distance.",
    "locations": {
      "urban": "a coastal promenade on a city break",
      "outdoorsy": "a cliff path near a seaside town",
      "homebody": "a breezy local lakeside path"
    },
    "backdrops": {
      "urban": "a curved sea wall, pastel terraces and open water",
      "outdoorsy": "a grass headland, a chalk drop and a wide bay",
      "homebody": "reed beds, a jetty and the far shore"
    },
    "outfits": {
      "casual": "a bone linen shirt over a charcoal tee",
      "sharp": "an olive waxed jacket over a white shirt",
      "street": "a stone utility jacket over a black tee"
    }
  },
  {
    "id": "travel-04-c",
    "version": 4,
    "bucket": "travel",
    "slot": 4,
    "variant": "c",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He pauses into the wind with one hand keeping his collar down. He looks back over his shoulder to the lens. He stands eight metres clear of the nearest edge, with {{backdrop}} stacked forty metres beyond and losing contrast with depth. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. A 3:4 waist-up portrait with gentle medium-format separation, Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Preserve gentle skin texture, tonal variation, accurate scale between him and the place, and honest environmental detail.",
    "locations": {
      "urban": "a coastal promenade on a city break",
      "outdoorsy": "a cliff path near a seaside town",
      "homebody": "a breezy local lakeside path"
    },
    "backdrops": {
      "urban": "a curved sea wall, pastel terraces and open water",
      "outdoorsy": "a grass headland, a chalk drop and a wide bay",
      "homebody": "reed beds, a jetty and the far shore"
    },
    "outfits": {
      "casual": "a teal packable jacket over a white tee",
      "sharp": "a mid-brown corduroy blazer over an ecru knit",
      "street": "a charcoal hoodie under a washed denim jacket"
    }
  },
  {
    "id": "travel-05-a",
    "version": 4,
    "bucket": "travel",
    "slot": 5,
    "variant": "a",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He walks the promenade with both hands in his pockets and his jacket moving in the wind. He hears a comment and turns his head to the lens while his body carries on. {{backdrop}} lie thirty metres past him, dropping into pale atmospheric distance while the near ground stays legible. Documentary perspective keeps the place legible and the available light honest. A 3:4 three-quarter frame from a companion's walking distance, Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Keep distance-appropriate facial detail, fabric wear, accurate hands, and real weather in the air.",
    "locations": {
      "urban": "a coastal promenade on a city break",
      "outdoorsy": "a cliff path near a seaside town",
      "homebody": "a breezy local lakeside path"
    },
    "backdrops": {
      "urban": "promenade lamps, a bandstand and a working harbour",
      "outdoorsy": "a coastal footpath, gorse and stacked cliffs",
      "homebody": "moored dinghies, willows and a low hill"
    },
    "outfits": {
      "casual": "a mustard knit polo with dark chinos",
      "sharp": "an ink-blue overcoat over a black tee",
      "street": "a teal cagoule over an oat tee"
    }
  },
  {
    "id": "travel-05-b",
    "version": 4,
    "bucket": "travel",
    "slot": 5,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He stops at the rail to let a cyclist through, one hand on the metal. He looks to the lens with an amused expression. The ground opens fifteen metres to a middle distance and carries on to {{backdrop}} some sixty metres out, softening by layers. Directional daylight gives clean facial detail and moderate separation from the distance. A 3:4 knee-up portrait that keeps hands and carried objects clear, Canon R5, 50mm, f/2.8, 1/320, ISO 200. Retain complexion variation, beard detail, clothing folds, and believable focus falloff toward the distance.",
    "locations": {
      "urban": "a coastal promenade on a city break",
      "outdoorsy": "a cliff path near a seaside town",
      "homebody": "a breezy local lakeside path"
    },
    "backdrops": {
      "urban": "promenade lamps, a bandstand and a working harbour",
      "outdoorsy": "a coastal footpath, gorse and stacked cliffs",
      "homebody": "moored dinghies, willows and a low hill"
    },
    "outfits": {
      "casual": "a stone chore jacket over a heather tee",
      "sharp": "a chalk-grey wool jacket over a white crewneck",
      "street": "an ecru linen overshirt over a washed-black tee"
    }
  },
  {
    "id": "travel-05-c",
    "version": 4,
    "bucket": "travel",
    "slot": 5,
    "variant": "c",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He walks a few steps ahead, notices he has outpaced everyone, and comes back with one hand raised in apology. He is still looking to the lens as he turns. Twenty metres behind him {{backdrop}} sit in gentle haze, the ground between them holding just enough detail to read. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. A 3:4 three-quarter portrait with balanced negative space, Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Preserve gentle skin texture, tonal variation, accurate scale between him and the place, and honest environmental detail.",
    "locations": {
      "urban": "a coastal promenade on a city break",
      "outdoorsy": "a cliff path near a seaside town",
      "homebody": "a breezy local lakeside path"
    },
    "backdrops": {
      "urban": "promenade lamps, a bandstand and a working harbour",
      "outdoorsy": "a coastal footpath, gorse and stacked cliffs",
      "homebody": "moored dinghies, willows and a low hill"
    },
    "outfits": {
      "casual": "an ecru cable knit with indigo jeans",
      "sharp": "a plum merino roll-neck under a stone coat",
      "street": "a mustard fleece half-zip over a white tee"
    }
  },
  {
    "id": "travel-06-a",
    "version": 4,
    "bucket": "travel",
    "slot": 6,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He sits on the warm stone of the sea wall with both palms flat beside him. He studies the water, off to the left of the lens. Ten metres of foreground lead the eye to him, and {{backdrop}} settle fifty metres further into soft blue depth. Documentary perspective keeps the place legible and the available light honest. A 4:3 environmental portrait with him holding roughly half the frame, Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Keep distance-appropriate facial detail, fabric wear, accurate hands, and real weather in the air.",
    "locations": {
      "urban": "a coastal promenade on a city break",
      "outdoorsy": "a cliff path near a seaside town",
      "homebody": "a breezy local lakeside path"
    },
    "backdrops": {
      "urban": "a pier, gulls and a hazy horizon line",
      "outdoorsy": "a cliff edge, spray and a distant lighthouse",
      "homebody": "a boathouse, poplars and flat water"
    },
    "outfits": {
      "casual": "a plum brushed-cotton shirt with dark denim",
      "sharp": "a forest quilted jacket over a light-blue shirt",
      "street": "a navy coach jacket over a grey tee"
    }
  },
  {
    "id": "travel-06-b",
    "version": 4,
    "bucket": "travel",
    "slot": 6,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He shifts along the wall to make room and rests one forearm on his knee. He smiles to the lens as the conversation restarts. He stands eight metres clear of the nearest edge, with {{backdrop}} stacked forty metres beyond and losing contrast with depth. Directional daylight gives clean facial detail and moderate separation from the distance. A 3:4 waist-up lifestyle portrait at eye level, Canon R5, 50mm, f/2.8, 1/320, ISO 200. Retain complexion variation, beard detail, clothing folds, and believable focus falloff toward the distance.",
    "locations": {
      "urban": "a coastal promenade on a city break",
      "outdoorsy": "a cliff path near a seaside town",
      "homebody": "a breezy local lakeside path"
    },
    "backdrops": {
      "urban": "a pier, gulls and a hazy horizon line",
      "outdoorsy": "a cliff edge, spray and a distant lighthouse",
      "homebody": "a boathouse, poplars and flat water"
    },
    "outfits": {
      "casual": "a terracotta sweatshirt with stone-grey jeans",
      "sharp": "a rust wool overshirt over a cream knit",
      "street": "a terracotta windbreaker over a cream tee"
    }
  },
  {
    "id": "travel-06-c",
    "version": 4,
    "bucket": "travel",
    "slot": 6,
    "variant": "c",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He folds a paper map away with both hands and stays seated. He looks out along the front, past the lens. The view runs back from him through twelve metres of open ground to {{backdrop}}, all of it softening toward the horizon. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. A 4:3 environmental portrait with layered foreground, subject and distance, Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Preserve gentle skin texture, tonal variation, accurate scale between him and the place, and honest environmental detail.",
    "locations": {
      "urban": "a coastal promenade on a city break",
      "outdoorsy": "a cliff path near a seaside town",
      "homebody": "a breezy local lakeside path"
    },
    "backdrops": {
      "urban": "a pier, gulls and a hazy horizon line",
      "outdoorsy": "a cliff edge, spray and a distant lighthouse",
      "homebody": "a boathouse, poplars and flat water"
    },
    "outfits": {
      "casual": "a grey marl crewneck under an olive shell",
      "sharp": "a soft-grey topcoat over a black polo",
      "street": "a grey marl hoodie under a stone chore coat"
    }
  },
  {
    "id": "travel-07-a",
    "version": 4,
    "bucket": "travel",
    "slot": 7,
    "variant": "a",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He crosses the street at an easy pace, one hand raised to point out a detail above the shopfronts. He looks back to the lens as he lowers it. The ground opens fifteen metres to a middle distance and carries on to {{backdrop}} some sixty metres out, softening by layers. Documentary perspective keeps the place legible and the available light honest. A 9:16 full-body documentary frame with straight architectural lines, Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Keep distance-appropriate facial detail, fabric wear, accurate hands, and real weather in the air.",
    "locations": {
      "urban": "a walkable old-city street",
      "outdoorsy": "a small alpine-town street",
      "homebody": "a nearby heritage-district street"
    },
    "backdrops": {
      "urban": "shuttered facades, hanging signs and a receding street",
      "outdoorsy": "painted chalets, window boxes and a peak above the roofline",
      "homebody": "sash windows, iron railings and a church spire"
    },
    "outfits": {
      "casual": "a chambray overshirt over a cream tee",
      "sharp": "a sand safari jacket over a white tee",
      "street": "a chocolate corduroy trucker over a white tee"
    }
  },
  {
    "id": "travel-07-b",
    "version": 4,
    "bucket": "travel",
    "slot": 7,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He stops at a corner with both thumbs in his pockets and scans the unfamiliar block. He smiles to the lens when the others catch up. Twenty metres behind him {{backdrop}} sit in gentle haze, the ground between them holding just enough detail to read. Directional daylight gives clean facial detail and moderate separation from the distance. A 3:4 three-quarter portrait with moderate environmental separation, Canon R5, 50mm, f/2.8, 1/320, ISO 200. Retain complexion variation, beard detail, clothing folds, and believable focus falloff toward the distance.",
    "locations": {
      "urban": "a walkable old-city street",
      "outdoorsy": "a small alpine-town street",
      "homebody": "a nearby heritage-district street"
    },
    "backdrops": {
      "urban": "shuttered facades, hanging signs and a receding street",
      "outdoorsy": "painted chalets, window boxes and a peak above the roofline",
      "homebody": "sash windows, iron railings and a church spire"
    },
    "outfits": {
      "casual": "a black merino half-zip with dark jeans",
      "sharp": "a slate peacoat over a bone knit",
      "street": "a black waxed parka over an oat tee"
    }
  },
  {
    "id": "travel-07-c",
    "version": 4,
    "bucket": "travel",
    "slot": 7,
    "variant": "c",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He walks toward the camera through the lane, one hand steadying a small bag, and steps around another visitor. He glances aside with quiet curiosity, past the lens. {{backdrop}} lie thirty metres past him, dropping into pale atmospheric distance while the near ground stays legible. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. A 4:3 half-body portrait with the setting rendered in quiet detail, Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Preserve gentle skin texture, tonal variation, accurate scale between him and the place, and honest environmental detail.",
    "locations": {
      "urban": "a walkable old-city street",
      "outdoorsy": "a small alpine-town street",
      "homebody": "a nearby heritage-district street"
    },
    "backdrops": {
      "urban": "shuttered facades, hanging signs and a receding street",
      "outdoorsy": "painted chalets, window boxes and a peak above the roofline",
      "homebody": "sash windows, iron railings and a church spire"
    },
    "outfits": {
      "casual": "a sand overshirt over a white tee with dark jeans",
      "sharp": "a camel overcoat over a fine black knit",
      "street": "an olive field jacket over a white tee"
    }
  },
  {
    "id": "travel-08-a",
    "version": 4,
    "bucket": "travel",
    "slot": 8,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He slows where the lane opens out, one hand on a doorway edge, and takes in the change of light. His eyes go up the facade, off past the lens. He stands eight metres clear of the nearest edge, with {{backdrop}} stacked forty metres beyond and losing contrast with depth. Documentary perspective keeps the place legible and the available light honest. A 4:3 knee-up frame that keeps the horizon and travel context, Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Keep distance-appropriate facial detail, fabric wear, accurate hands, and real weather in the air.",
    "locations": {
      "urban": "a walkable old-city street",
      "outdoorsy": "a small alpine-town street",
      "homebody": "a nearby heritage-district street"
    },
    "backdrops": {
      "urban": "a narrowing lane, awnings and a bright square beyond",
      "outdoorsy": "a timber balcony, stacked logs and a wooded slope",
      "homebody": "a cobbled kerb, lamp posts and shopfronts"
    },
    "outfits": {
      "casual": "a charcoal merino crewneck with straight indigo denim",
      "sharp": "a navy field jacket over a white oxford",
      "street": "a black shell jacket over a heather tee"
    }
  },
  {
    "id": "travel-08-b",
    "version": 4,
    "bucket": "travel",
    "slot": 8,
    "variant": "b",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He steps from sun into the covered walkway and lets his hand fall from his brow. He smiles to the lens at the sudden relief. The view runs back from him through twelve metres of open ground to {{backdrop}}, all of it softening toward the horizon. Directional daylight gives clean facial detail and moderate separation from the distance. A 9:16 full-body portrait at natural perspective, Canon R5, 50mm, f/2.8, 1/320, ISO 200. Retain complexion variation, beard detail, clothing folds, and believable focus falloff toward the distance.",
    "locations": {
      "urban": "a walkable old-city street",
      "outdoorsy": "a small alpine-town street",
      "homebody": "a nearby heritage-district street"
    },
    "backdrops": {
      "urban": "a narrowing lane, awnings and a bright square beyond",
      "outdoorsy": "a timber balcony, stacked logs and a wooded slope",
      "homebody": "a cobbled kerb, lamp posts and shopfronts"
    },
    "outfits": {
      "casual": "an olive field shirt worn open over a grey tee",
      "sharp": "a charcoal overcoat over a cream crewneck",
      "street": "a sand canvas trucker over a charcoal tee"
    }
  },
  {
    "id": "travel-08-c",
    "version": 4,
    "bucket": "travel",
    "slot": 8,
    "variant": "c",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He pauses beneath an archway to check the direction, folding the map against one palm. He continues toward the lens. Ten metres of foreground lead the eye to him, and {{backdrop}} settle fifty metres further into soft blue depth. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. A 9:16 full-body composition that preserves natural scale, Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Preserve gentle skin texture, tonal variation, accurate scale between him and the place, and honest environmental detail.",
    "locations": {
      "urban": "a walkable old-city street",
      "outdoorsy": "a small alpine-town street",
      "homebody": "a nearby heritage-district street"
    },
    "backdrops": {
      "urban": "a narrowing lane, awnings and a bright square beyond",
      "outdoorsy": "a timber balcony, stacked logs and a wooded slope",
      "homebody": "a cobbled kerb, lamp posts and shopfronts"
    },
    "outfits": {
      "casual": "a cream fisherman knit with dark chinos",
      "sharp": "a stone trench over a slate knit",
      "street": "an indigo denim jacket over a cream tee"
    }
  },
  {
    "id": "travel-09-a",
    "version": 4,
    "bucket": "travel",
    "slot": 9,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He walks the shaded side with a small bag over one shoulder, fingers hooked in the strap. He looks back to the lens near the bright end of the street. Twenty metres behind him {{backdrop}} sit in gentle haze, the ground between them holding just enough detail to read. Documentary perspective keeps the place legible and the available light honest. A 4:3 waist-up portrait with one useful foreground detail, Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Keep distance-appropriate facial detail, fabric wear, accurate hands, and real weather in the air.",
    "locations": {
      "urban": "a walkable old-city street",
      "outdoorsy": "a small alpine-town street",
      "homebody": "a nearby heritage-district street"
    },
    "backdrops": {
      "urban": "a stone archway, laundry lines and washed walls",
      "outdoorsy": "a fountain trough, a bakery sign and firs",
      "homebody": "a brick terrace, a corner pub and parked cars"
    },
    "outfits": {
      "casual": "a rust flannel over a washed-black tee",
      "sharp": "a bottle-green wool overshirt over a white shirt",
      "street": "a rust anorak over a black tee"
    }
  },
  {
    "id": "travel-09-b",
    "version": 4,
    "bucket": "travel",
    "slot": 9,
    "variant": "b",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He stops to read a hand-painted sign, one hand resting on the wall beside it. He turns to the lens to share what it says. {{backdrop}} lie thirty metres past him, dropping into pale atmospheric distance while the near ground stays legible. Directional daylight gives clean facial detail and moderate separation from the distance. A 3:4 chest-up portrait with the destination softly recognisable, Canon R5, 50mm, f/2.8, 1/320, ISO 200. Retain complexion variation, beard detail, clothing folds, and believable focus falloff toward the distance.",
    "locations": {
      "urban": "a walkable old-city street",
      "outdoorsy": "a small alpine-town street",
      "homebody": "a nearby heritage-district street"
    },
    "backdrops": {
      "urban": "a stone archway, laundry lines and washed walls",
      "outdoorsy": "a fountain trough, a bakery sign and firs",
      "homebody": "a brick terrace, a corner pub and parked cars"
    },
    "outfits": {
      "casual": "a slate-blue chambray shirt with the sleeves rolled and dark jeans",
      "sharp": "a tobacco suede jacket over a sand knit",
      "street": "a cream boxy overshirt over a grey tee"
    }
  },
  {
    "id": "travel-09-c",
    "version": 4,
    "bucket": "travel",
    "slot": 9,
    "variant": "c",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He steps into a patch of warm light and puts a hand out to feel it. He looks off to his right, past the lens. The ground opens fifteen metres to a middle distance and carries on to {{backdrop}} some sixty metres out, softening by layers. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. A 3:4 waist-up portrait with gentle medium-format separation, Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Preserve gentle skin texture, tonal variation, accurate scale between him and the place, and honest environmental detail.",
    "locations": {
      "urban": "a walkable old-city street",
      "outdoorsy": "a small alpine-town street",
      "homebody": "a nearby heritage-district street"
    },
    "backdrops": {
      "urban": "a stone archway, laundry lines and washed walls",
      "outdoorsy": "a fountain trough, a bakery sign and firs",
      "homebody": "a brick terrace, a corner pub and parked cars"
    },
    "outfits": {
      "casual": "a forest-green quarter-zip with stone chinos",
      "sharp": "a black tailored topcoat over a grey roll-neck",
      "street": "a brown suede trucker over a bone tee"
    }
  },
  {
    "id": "travel-10-a",
    "version": 4,
    "bucket": "travel",
    "slot": 10,
    "variant": "a",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He stands at the overlook rail with one hand resting on it and the other in a pocket. He watches the view, off to the right of the lens. The view runs back from him through twelve metres of open ground to {{backdrop}}, all of it softening toward the horizon. Documentary perspective keeps the place legible and the available light honest. A 3:4 three-quarter frame from a companion's walking distance, Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Keep distance-appropriate facial detail, fabric wear, accurate hands, and real weather in the air.",
    "locations": {
      "urban": "a harbor overlook railing",
      "outdoorsy": "a valley-view railing",
      "homebody": "a local riverside overlook"
    },
    "backdrops": {
      "urban": "moored boats, cranes and a working waterfront",
      "outdoorsy": "a green valley floor, a river thread and layered ridges",
      "homebody": "a slow river, a stone bridge and willows"
    },
    "outfits": {
      "casual": "an oat waffle henley under a light grey shell",
      "sharp": "a light-blue oxford under a taupe field coat",
      "street": "a slate packable windbreaker over a white tee"
    }
  },
  {
    "id": "travel-10-b",
    "version": 4,
    "bucket": "travel",
    "slot": 10,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He moves aside to give someone room and returns one hand to the rail. He looks to the lens as he settles again. Ten metres of foreground lead the eye to him, and {{backdrop}} settle fifty metres further into soft blue depth. Directional daylight gives clean facial detail and moderate separation from the distance. A 3:4 knee-up portrait that keeps hands and carried objects clear, Canon R5, 50mm, f/2.8, 1/320, ISO 200. Retain complexion variation, beard detail, clothing folds, and believable focus falloff toward the distance.",
    "locations": {
      "urban": "a harbor overlook railing",
      "outdoorsy": "a valley-view railing",
      "homebody": "a local riverside overlook"
    },
    "backdrops": {
      "urban": "moored boats, cranes and a working waterfront",
      "outdoorsy": "a green valley floor, a river thread and layered ridges",
      "homebody": "a slow river, a stone bridge and willows"
    },
    "outfits": {
      "casual": "a burgundy lambswool crewneck with dark denim",
      "sharp": "a burgundy fine-knit under a charcoal wool jacket",
      "street": "a forest quilted vest over a charcoal long-sleeve"
    }
  },
  {
    "id": "travel-10-c",
    "version": 4,
    "bucket": "travel",
    "slot": 10,
    "variant": "c",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He crosses to the far end of the railing, steadying himself with one hand as the wind takes his jacket. He smiles to the lens. He stands eight metres clear of the nearest edge, with {{backdrop}} stacked forty metres beyond and losing contrast with depth. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. A 3:4 three-quarter portrait with balanced negative space, Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Preserve gentle skin texture, tonal variation, accurate scale between him and the place, and honest environmental detail.",
    "locations": {
      "urban": "a harbor overlook railing",
      "outdoorsy": "a valley-view railing",
      "homebody": "a local riverside overlook"
    },
    "backdrops": {
      "urban": "moored boats, cranes and a working waterfront",
      "outdoorsy": "a green valley floor, a river thread and layered ridges",
      "homebody": "a slow river, a stone bridge and willows"
    },
    "outfits": {
      "casual": "a chocolate corduroy shirt with faded jeans",
      "sharp": "a cream shawl-collar coat over a dark knit",
      "street": "a burgundy hooded overshirt over a white tee"
    }
  },
  {
    "id": "travel-11-a",
    "version": 4,
    "bucket": "travel",
    "slot": 11,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He leans both forearms on the rail beside a coffee and lets the steam go. His eyes stay out on the water, past the lens. {{backdrop}} lie thirty metres past him, dropping into pale atmospheric distance while the near ground stays legible. Documentary perspective keeps the place legible and the available light honest. A 4:3 environmental portrait with him holding roughly half the frame, Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Keep distance-appropriate facial detail, fabric wear, accurate hands, and real weather in the air.",
    "locations": {
      "urban": "a harbor overlook railing",
      "outdoorsy": "a valley-view railing",
      "homebody": "a local riverside overlook"
    },
    "backdrops": {
      "urban": "a marina, masts and a low city skyline",
      "outdoorsy": "terraced fields, a farm track and blue distance",
      "homebody": "a weir, a footpath and allotments"
    },
    "outfits": {
      "casual": "a bone linen shirt over a charcoal tee",
      "sharp": "an olive waxed jacket over a white shirt",
      "street": "a stone utility jacket over a black tee"
    }
  },
  {
    "id": "travel-11-b",
    "version": 4,
    "bucket": "travel",
    "slot": 11,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He turns from the view with one elbow still on the rail to answer a question. He holds the lens while he speaks. The ground opens fifteen metres to a middle distance and carries on to {{backdrop}} some sixty metres out, softening by layers. Directional daylight gives clean facial detail and moderate separation from the distance. A 3:4 waist-up lifestyle portrait at eye level, Canon R5, 50mm, f/2.8, 1/320, ISO 200. Retain complexion variation, beard detail, clothing folds, and believable focus falloff toward the distance.",
    "locations": {
      "urban": "a harbor overlook railing",
      "outdoorsy": "a valley-view railing",
      "homebody": "a local riverside overlook"
    },
    "backdrops": {
      "urban": "a marina, masts and a low city skyline",
      "outdoorsy": "terraced fields, a farm track and blue distance",
      "homebody": "a weir, a footpath and allotments"
    },
    "outfits": {
      "casual": "a teal packable jacket over a white tee",
      "sharp": "a mid-brown corduroy blazer over an ecru knit",
      "street": "a charcoal hoodie under a washed denim jacket"
    }
  },
  {
    "id": "travel-11-c",
    "version": 4,
    "bucket": "travel",
    "slot": 11,
    "variant": "c",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He straightens up from the railing, one hand still on it, and pushes both sleeves back. He looks to the lens before walking on. Twenty metres behind him {{backdrop}} sit in gentle haze, the ground between them holding just enough detail to read. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. A 4:3 environmental portrait with layered foreground, subject and distance, Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Preserve gentle skin texture, tonal variation, accurate scale between him and the place, and honest environmental detail.",
    "locations": {
      "urban": "a harbor overlook railing",
      "outdoorsy": "a valley-view railing",
      "homebody": "a local riverside overlook"
    },
    "backdrops": {
      "urban": "a marina, masts and a low city skyline",
      "outdoorsy": "terraced fields, a farm track and blue distance",
      "homebody": "a weir, a footpath and allotments"
    },
    "outfits": {
      "casual": "a mustard knit polo with dark chinos",
      "sharp": "an ink-blue overcoat over a black tee",
      "street": "a teal cagoule over an oat tee"
    }
  },
  {
    "id": "travel-12-a",
    "version": 4,
    "bucket": "travel",
    "slot": 12,
    "variant": "a",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He rests one boot on the rail's low bar with a hand on his knee, taking a breath after the climb up. He looks across the valley, off past the lens. Ten metres of foreground lead the eye to him, and {{backdrop}} settle fifty metres further into soft blue depth. Documentary perspective keeps the place legible and the available light honest. A 9:16 full-body documentary frame with straight architectural lines, Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Keep distance-appropriate facial detail, fabric wear, accurate hands, and real weather in the air.",
    "locations": {
      "urban": "a harbor overlook railing",
      "outdoorsy": "a valley-view railing",
      "homebody": "a local riverside overlook"
    },
    "backdrops": {
      "urban": "a ferry wake, a breakwater and open sea",
      "outdoorsy": "a wooded gorge, a waterfall line and cloud shadow",
      "homebody": "a mill building, reeds and a road bridge"
    },
    "outfits": {
      "casual": "a stone chore jacket over a heather tee",
      "sharp": "a chalk-grey wool jacket over a white crewneck",
      "street": "an ecru linen overshirt over a washed-black tee"
    }
  },
  {
    "id": "travel-12-b",
    "version": 4,
    "bucket": "travel",
    "slot": 12,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He unfolds a small map against the rail with both hands and finds the next stop. He looks up to the lens with the decision made. He stands eight metres clear of the nearest edge, with {{backdrop}} stacked forty metres beyond and losing contrast with depth. Directional daylight gives clean facial detail and moderate separation from the distance. A 3:4 three-quarter portrait with moderate environmental separation, Canon R5, 50mm, f/2.8, 1/320, ISO 200. Retain complexion variation, beard detail, clothing folds, and believable focus falloff toward the distance.",
    "locations": {
      "urban": "a harbor overlook railing",
      "outdoorsy": "a valley-view railing",
      "homebody": "a local riverside overlook"
    },
    "backdrops": {
      "urban": "a ferry wake, a breakwater and open sea",
      "outdoorsy": "a wooded gorge, a waterfall line and cloud shadow",
      "homebody": "a mill building, reeds and a road bridge"
    },
    "outfits": {
      "casual": "an ecru cable knit with indigo jeans",
      "sharp": "a plum merino roll-neck under a stone coat",
      "street": "a mustard fleece half-zip over a white tee"
    }
  },
  {
    "id": "travel-12-c",
    "version": 4,
    "bucket": "travel",
    "slot": 12,
    "variant": "c",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He waits with one forearm on the rail, watching people pass behind him. He turns back to the lens as the conversation resumes. The view runs back from him through twelve metres of open ground to {{backdrop}}, all of it softening toward the horizon. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. A 4:3 half-body portrait with the setting rendered in quiet detail, Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Preserve gentle skin texture, tonal variation, accurate scale between him and the place, and honest environmental detail.",
    "locations": {
      "urban": "a harbor overlook railing",
      "outdoorsy": "a valley-view railing",
      "homebody": "a local riverside overlook"
    },
    "backdrops": {
      "urban": "a ferry wake, a breakwater and open sea",
      "outdoorsy": "a wooded gorge, a waterfall line and cloud shadow",
      "homebody": "a mill building, reeds and a road bridge"
    },
    "outfits": {
      "casual": "a plum brushed-cotton shirt with dark denim",
      "sharp": "a forest quilted jacket over a light-blue shirt",
      "street": "a navy coach jacket over a grey tee"
    }
  },
  {
    "id": "travel-13-a",
    "version": 4,
    "bucket": "travel",
    "slot": 13,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He picks his way across the uneven setts, one hand out for balance, and checks the others are following. He looks back to the lens. The ground opens fifteen metres to a middle distance and carries on to {{backdrop}} some sixty metres out, softening by layers. Documentary perspective keeps the place legible and the available light honest. A 4:3 knee-up frame that keeps the horizon and travel context, Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Keep distance-appropriate facial detail, fabric wear, accurate hands, and real weather in the air.",
    "locations": {
      "urban": "a preserved cobblestone lane",
      "outdoorsy": "a mountain-village lane",
      "homebody": "a nearby historic-town lane"
    },
    "backdrops": {
      "urban": "worn setts, painted doors and a lit corner shop",
      "outdoorsy": "dry-stone walls, a chapel and a snowfield above",
      "homebody": "a cobbled slope, sash windows and chimney pots"
    },
    "outfits": {
      "casual": "a terracotta sweatshirt with stone-grey jeans",
      "sharp": "a rust wool overshirt over a cream knit",
      "street": "a terracotta windbreaker over a cream tee"
    }
  },
  {
    "id": "travel-13-b",
    "version": 4,
    "bucket": "travel",
    "slot": 13,
    "variant": "b",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He pauses where the lane bends, adjusts one bag strap, and points ahead. His eyes follow his own hand, past the lens. Twenty metres behind him {{backdrop}} sit in gentle haze, the ground between them holding just enough detail to read. Directional daylight gives clean facial detail and moderate separation from the distance. A 9:16 full-body portrait at natural perspective, Canon R5, 50mm, f/2.8, 1/320, ISO 200. Retain complexion variation, beard detail, clothing folds, and believable focus falloff toward the distance.",
    "locations": {
      "urban": "a preserved cobblestone lane",
      "outdoorsy": "a mountain-village lane",
      "homebody": "a nearby historic-town lane"
    },
    "backdrops": {
      "urban": "worn setts, painted doors and a lit corner shop",
      "outdoorsy": "dry-stone walls, a chapel and a snowfield above",
      "homebody": "a cobbled slope, sash windows and chimney pots"
    },
    "outfits": {
      "casual": "a grey marl crewneck under an olive shell",
      "sharp": "a soft-grey topcoat over a black polo",
      "street": "a grey marl hoodie under a stone chore coat"
    }
  },
  {
    "id": "travel-13-c",
    "version": 4,
    "bucket": "travel",
    "slot": 13,
    "variant": "c",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He walks up the slope at an ordinary pace, one hand trailing along a wall. He smiles back to the lens on the flatter section. {{backdrop}} lie thirty metres past him, dropping into pale atmospheric distance while the near ground stays legible. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. A 9:16 full-body composition that preserves natural scale, Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Preserve gentle skin texture, tonal variation, accurate scale between him and the place, and honest environmental detail.",
    "locations": {
      "urban": "a preserved cobblestone lane",
      "outdoorsy": "a mountain-village lane",
      "homebody": "a nearby historic-town lane"
    },
    "backdrops": {
      "urban": "worn setts, painted doors and a lit corner shop",
      "outdoorsy": "dry-stone walls, a chapel and a snowfield above",
      "homebody": "a cobbled slope, sash windows and chimney pots"
    },
    "outfits": {
      "casual": "a chambray overshirt over a cream tee",
      "sharp": "a sand safari jacket over a white tee",
      "street": "a chocolate corduroy trucker over a white tee"
    }
  },
  {
    "id": "travel-14-a",
    "version": 4,
    "bucket": "travel",
    "slot": 14,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He rests one shoulder on the old stone wall with both hands loose while the route is checked. He looks up to the lens when everyone is ready. He stands eight metres clear of the nearest edge, with {{backdrop}} stacked forty metres beyond and losing contrast with depth. Documentary perspective keeps the place legible and the available light honest. A 4:3 waist-up portrait with one useful foreground detail, Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Keep distance-appropriate facial detail, fabric wear, accurate hands, and real weather in the air.",
    "locations": {
      "urban": "a preserved cobblestone lane",
      "outdoorsy": "a mountain-village lane",
      "homebody": "a nearby historic-town lane"
    },
    "backdrops": {
      "urban": "a lane bending out of sight past shuttered fronts",
      "outdoorsy": "hay barns, a track and pastured slopes",
      "homebody": "an archway, a courtyard and pantiled roofs"
    },
    "outfits": {
      "casual": "a black merino half-zip with dark jeans",
      "sharp": "a slate peacoat over a bone knit",
      "street": "a black waxed parka over an oat tee"
    }
  },
  {
    "id": "travel-14-b",
    "version": 4,
    "bucket": "travel",
    "slot": 14,
    "variant": "b",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He stops at a painted doorway, one palm flat on the frame, and looks up at the ironwork. His attention stays high, past the lens. The view runs back from him through twelve metres of open ground to {{backdrop}}, all of it softening toward the horizon. Directional daylight gives clean facial detail and moderate separation from the distance. A 3:4 chest-up portrait with the destination softly recognisable, Canon R5, 50mm, f/2.8, 1/320, ISO 200. Retain complexion variation, beard detail, clothing folds, and believable focus falloff toward the distance.",
    "locations": {
      "urban": "a preserved cobblestone lane",
      "outdoorsy": "a mountain-village lane",
      "homebody": "a nearby historic-town lane"
    },
    "backdrops": {
      "urban": "a lane bending out of sight past shuttered fronts",
      "outdoorsy": "hay barns, a track and pastured slopes",
      "homebody": "an archway, a courtyard and pantiled roofs"
    },
    "outfits": {
      "casual": "a sand overshirt over a white tee with dark jeans",
      "sharp": "a camel overcoat over a fine black knit",
      "street": "an olive field jacket over a white tee"
    }
  },
  {
    "id": "travel-14-c",
    "version": 4,
    "bucket": "travel",
    "slot": 14,
    "variant": "c",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He steps down off a worn kerb, one hand steadying a paper bag. He turns to the lens with an easy expression. Ten metres of foreground lead the eye to him, and {{backdrop}} settle fifty metres further into soft blue depth. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. A 3:4 waist-up portrait with gentle medium-format separation, Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Preserve gentle skin texture, tonal variation, accurate scale between him and the place, and honest environmental detail.",
    "locations": {
      "urban": "a preserved cobblestone lane",
      "outdoorsy": "a mountain-village lane",
      "homebody": "a nearby historic-town lane"
    },
    "backdrops": {
      "urban": "a lane bending out of sight past shuttered fronts",
      "outdoorsy": "hay barns, a track and pastured slopes",
      "homebody": "an archway, a courtyard and pantiled roofs"
    },
    "outfits": {
      "casual": "a charcoal merino crewneck with straight indigo denim",
      "sharp": "a navy field jacket over a white oxford",
      "street": "a black shell jacket over a heather tee"
    }
  },
  {
    "id": "travel-15-a",
    "version": 4,
    "bucket": "travel",
    "slot": 15,
    "variant": "a",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He walks the lane with both hands in his coat pockets, jacket open. He glances into a shop window, off to the left of the lens. Twenty metres behind him {{backdrop}} sit in gentle haze, the ground between them holding just enough detail to read. Documentary perspective keeps the place legible and the available light honest. A 3:4 three-quarter frame from a companion's walking distance, Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Keep distance-appropriate facial detail, fabric wear, accurate hands, and real weather in the air.",
    "locations": {
      "urban": "a preserved cobblestone lane",
      "outdoorsy": "a mountain-village lane",
      "homebody": "a nearby historic-town lane"
    },
    "backdrops": {
      "urban": "bunting, a wine-shop window and cafe chairs",
      "outdoorsy": "a village pump, log piles and dark firs",
      "homebody": "a bookshop front, planters and old brick"
    },
    "outfits": {
      "casual": "an olive field shirt worn open over a grey tee",
      "sharp": "a charcoal overcoat over a cream crewneck",
      "street": "a sand canvas trucker over a charcoal tee"
    }
  },
  {
    "id": "travel-15-b",
    "version": 4,
    "bucket": "travel",
    "slot": 15,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He stops beside a wine-shop front with one hand on the glass edge to read a label. He turns to the lens grinning at the price. {{backdrop}} lie thirty metres past him, dropping into pale atmospheric distance while the near ground stays legible. Directional daylight gives clean facial detail and moderate separation from the distance. A 3:4 knee-up portrait that keeps hands and carried objects clear, Canon R5, 50mm, f/2.8, 1/320, ISO 200. Retain complexion variation, beard detail, clothing folds, and believable focus falloff toward the distance.",
    "locations": {
      "urban": "a preserved cobblestone lane",
      "outdoorsy": "a mountain-village lane",
      "homebody": "a nearby historic-town lane"
    },
    "backdrops": {
      "urban": "bunting, a wine-shop window and cafe chairs",
      "outdoorsy": "a village pump, log piles and dark firs",
      "homebody": "a bookshop front, planters and old brick"
    },
    "outfits": {
      "casual": "a cream fisherman knit with dark chinos",
      "sharp": "a stone trench over a slate knit",
      "street": "an indigo denim jacket over a cream tee"
    }
  },
  {
    "id": "travel-15-c",
    "version": 4,
    "bucket": "travel",
    "slot": 15,
    "variant": "c",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He reaches a level stretch, relaxes his hands, and looks back along the way they came, past the lens. The ground opens fifteen metres to a middle distance and carries on to {{backdrop}} some sixty metres out, softening by layers. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. A 3:4 three-quarter portrait with balanced negative space, Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Preserve gentle skin texture, tonal variation, accurate scale between him and the place, and honest environmental detail.",
    "locations": {
      "urban": "a preserved cobblestone lane",
      "outdoorsy": "a mountain-village lane",
      "homebody": "a nearby historic-town lane"
    },
    "backdrops": {
      "urban": "bunting, a wine-shop window and cafe chairs",
      "outdoorsy": "a village pump, log piles and dark firs",
      "homebody": "a bookshop front, planters and old brick"
    },
    "outfits": {
      "casual": "a rust flannel over a washed-black tee",
      "sharp": "a bottle-green wool overshirt over a white shirt",
      "street": "a rust anorak over a black tee"
    }
  },
  {
    "id": "travel-16-a",
    "version": 4,
    "bucket": "travel",
    "slot": 16,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He sits on the wide stone step with a folded jacket across one forearm. He looks up to the lens as the photographer sits down beside him. The view runs back from him through twelve metres of open ground to {{backdrop}}, all of it softening toward the horizon. Documentary perspective keeps the place legible and the available light honest. A 4:3 environmental portrait with him holding roughly half the frame, Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Keep distance-appropriate facial detail, fabric wear, accurate hands, and real weather in the air.",
    "locations": {
      "urban": "a museum-courtyard stone step",
      "outdoorsy": "a visitor-center terrace step",
      "homebody": "a regional cultural-center step"
    },
    "backdrops": {
      "urban": "a colonnaded courtyard, a fountain and pale stone",
      "outdoorsy": "a timber terrace, interpretive boards and a wooded slope",
      "homebody": "a civic facade, banners and a paved forecourt"
    },
    "outfits": {
      "casual": "a slate-blue chambray shirt with the sleeves rolled and dark jeans",
      "sharp": "a tobacco suede jacket over a sand knit",
      "street": "a cream boxy overshirt over a grey tee"
    }
  },
  {
    "id": "travel-16-b",
    "version": 4,
    "bucket": "travel",
    "slot": 16,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He stands from the step, brushing his palm once down his thigh. He smiles to the lens as he straightens. Ten metres of foreground lead the eye to him, and {{backdrop}} settle fifty metres further into soft blue depth. Directional daylight gives clean facial detail and moderate separation from the distance. A 3:4 waist-up lifestyle portrait at eye level, Canon R5, 50mm, f/2.8, 1/320, ISO 200. Retain complexion variation, beard detail, clothing folds, and believable focus falloff toward the distance.",
    "locations": {
      "urban": "a museum-courtyard stone step",
      "outdoorsy": "a visitor-center terrace step",
      "homebody": "a regional cultural-center step"
    },
    "backdrops": {
      "urban": "a colonnaded courtyard, a fountain and pale stone",
      "outdoorsy": "a timber terrace, interpretive boards and a wooded slope",
      "homebody": "a civic facade, banners and a paved forecourt"
    },
    "outfits": {
      "casual": "a forest-green quarter-zip with stone chinos",
      "sharp": "a black tailored topcoat over a grey roll-neck",
      "street": "a brown suede trucker over a bone tee"
    }
  },
  {
    "id": "travel-16-c",
    "version": 4,
    "bucket": "travel",
    "slot": 16,
    "variant": "c",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He waits at the top of the steps with one hand on the balustrade. His eyes go across the courtyard, past the lens. He stands eight metres clear of the nearest edge, with {{backdrop}} stacked forty metres beyond and losing contrast with depth. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. A 4:3 environmental portrait with layered foreground, subject and distance, Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Preserve gentle skin texture, tonal variation, accurate scale between him and the place, and honest environmental detail.",
    "locations": {
      "urban": "a museum-courtyard stone step",
      "outdoorsy": "a visitor-center terrace step",
      "homebody": "a regional cultural-center step"
    },
    "backdrops": {
      "urban": "a colonnaded courtyard, a fountain and pale stone",
      "outdoorsy": "a timber terrace, interpretive boards and a wooded slope",
      "homebody": "a civic facade, banners and a paved forecourt"
    },
    "outfits": {
      "casual": "an oat waffle henley under a light grey shell",
      "sharp": "a light-blue oxford under a taupe field coat",
      "street": "a slate packable windbreaker over a white tee"
    }
  },
  {
    "id": "travel-17-a",
    "version": 4,
    "bucket": "travel",
    "slot": 17,
    "variant": "a",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He walks in beneath the tall glass with one hand shading his eyes and looks up through the roof structure. His gaze stays overhead, past the lens. {{backdrop}} lie thirty metres past him, dropping into pale atmospheric distance while the near ground stays legible. Documentary perspective keeps the place legible and the available light honest. A 9:16 full-body documentary frame with straight architectural lines, Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Keep distance-appropriate facial detail, fabric wear, accurate hands, and real weather in the air.",
    "locations": {
      "urban": "a museum-courtyard stone step",
      "outdoorsy": "a visitor-center terrace step",
      "homebody": "a regional cultural-center step"
    },
    "backdrops": {
      "urban": "a glass roof, gallery doors and distant visitors",
      "outdoorsy": "a viewing deck, binocular posts and open moorland",
      "homebody": "a lawn, a sculpture and a car park edge"
    },
    "outfits": {
      "casual": "a burgundy lambswool crewneck with dark denim",
      "sharp": "a burgundy fine-knit under a charcoal wool jacket",
      "street": "a forest quilted vest over a charcoal long-sleeve"
    }
  },
  {
    "id": "travel-17-b",
    "version": 4,
    "bucket": "travel",
    "slot": 17,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He stops beside a low sign, one hand resting on its edge while he reads. He turns to the lens to share it. The ground opens fifteen metres to a middle distance and carries on to {{backdrop}} some sixty metres out, softening by layers. Directional daylight gives clean facial detail and moderate separation from the distance. A 3:4 three-quarter portrait with moderate environmental separation, Canon R5, 50mm, f/2.8, 1/320, ISO 200. Retain complexion variation, beard detail, clothing folds, and believable focus falloff toward the distance.",
    "locations": {
      "urban": "a museum-courtyard stone step",
      "outdoorsy": "a visitor-center terrace step",
      "homebody": "a regional cultural-center step"
    },
    "backdrops": {
      "urban": "a glass roof, gallery doors and distant visitors",
      "outdoorsy": "a viewing deck, binocular posts and open moorland",
      "homebody": "a lawn, a sculpture and a car park edge"
    },
    "outfits": {
      "casual": "a chocolate corduroy shirt with faded jeans",
      "sharp": "a cream shawl-collar coat over a dark knit",
      "street": "a burgundy hooded overshirt over a white tee"
    }
  },
  {
    "id": "travel-17-c",
    "version": 4,
    "bucket": "travel",
    "slot": 17,
    "variant": "c",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He steps from shade into a brighter walkway and pushes a hand back through his hair. He smiles to the lens at the change. Twenty metres behind him {{backdrop}} sit in gentle haze, the ground between them holding just enough detail to read. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. A 4:3 half-body portrait with the setting rendered in quiet detail, Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Preserve gentle skin texture, tonal variation, accurate scale between him and the place, and honest environmental detail.",
    "locations": {
      "urban": "a museum-courtyard stone step",
      "outdoorsy": "a visitor-center terrace step",
      "homebody": "a regional cultural-center step"
    },
    "backdrops": {
      "urban": "a glass roof, gallery doors and distant visitors",
      "outdoorsy": "a viewing deck, binocular posts and open moorland",
      "homebody": "a lawn, a sculpture and a car park edge"
    },
    "outfits": {
      "casual": "a bone linen shirt over a charcoal tee",
      "sharp": "an olive waxed jacket over a white shirt",
      "street": "a stone utility jacket over a black tee"
    }
  },
  {
    "id": "travel-18-a",
    "version": 4,
    "bucket": "travel",
    "slot": 18,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He sits beside a compact weekender with one hand on its handle, checking the time. He looks up to the lens as the others return. Ten metres of foreground lead the eye to him, and {{backdrop}} settle fifty metres further into soft blue depth. Documentary perspective keeps the place legible and the available light honest. A 4:3 knee-up frame that keeps the horizon and travel context, Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Keep distance-appropriate facial detail, fabric wear, accurate hands, and real weather in the air.",
    "locations": {
      "urban": "a museum-courtyard stone step",
      "outdoorsy": "a visitor-center terrace step",
      "homebody": "a regional cultural-center step"
    },
    "backdrops": {
      "urban": "wide steps falling to a plaza and a lit portico",
      "outdoorsy": "a boardwalk running out to reed beds and hills",
      "homebody": "a stepped entrance, a bike stand and street trees"
    },
    "outfits": {
      "casual": "a teal packable jacket over a white tee",
      "sharp": "a mid-brown corduroy blazer over an ecru knit",
      "street": "a charcoal hoodie under a washed denim jacket"
    }
  },
  {
    "id": "travel-18-b",
    "version": 4,
    "bucket": "travel",
    "slot": 18,
    "variant": "b",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He stands and settles the bag handle into one fist after the call to move. He turns to the lens as he lifts it. He stands eight metres clear of the nearest edge, with {{backdrop}} stacked forty metres beyond and losing contrast with depth. Directional daylight gives clean facial detail and moderate separation from the distance. A 9:16 full-body portrait at natural perspective, Canon R5, 50mm, f/2.8, 1/320, ISO 200. Retain complexion variation, beard detail, clothing folds, and believable focus falloff toward the distance.",
    "locations": {
      "urban": "a museum-courtyard stone step",
      "outdoorsy": "a visitor-center terrace step",
      "homebody": "a regional cultural-center step"
    },
    "backdrops": {
      "urban": "wide steps falling to a plaza and a lit portico",
      "outdoorsy": "a boardwalk running out to reed beds and hills",
      "homebody": "a stepped entrance, a bike stand and street trees"
    },
    "outfits": {
      "casual": "a mustard knit polo with dark chinos",
      "sharp": "an ink-blue overcoat over a black tee",
      "street": "a teal cagoule over an oat tee"
    }
  },
  {
    "id": "travel-18-c",
    "version": 4,
    "bucket": "travel",
    "slot": 18,
    "variant": "c",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He waits near the bright doorway with luggage beside him and one hand in a pocket. He watches the entrance, off to the right of the lens. The view runs back from him through twelve metres of open ground to {{backdrop}}, all of it softening toward the horizon. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. A 9:16 full-body composition that preserves natural scale, Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Preserve gentle skin texture, tonal variation, accurate scale between him and the place, and honest environmental detail.",
    "locations": {
      "urban": "a museum-courtyard stone step",
      "outdoorsy": "a visitor-center terrace step",
      "homebody": "a regional cultural-center step"
    },
    "backdrops": {
      "urban": "wide steps falling to a plaza and a lit portico",
      "outdoorsy": "a boardwalk running out to reed beds and hills",
      "homebody": "a stepped entrance, a bike stand and street trees"
    },
    "outfits": {
      "casual": "a stone chore jacket over a heather tee",
      "sharp": "a chalk-grey wool jacket over a white crewneck",
      "street": "an ecru linen overshirt over a washed-black tee"
    }
  },
  {
    "id": "travel-19-a",
    "version": 4,
    "bucket": "travel",
    "slot": 19,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He walks the boards with one hand keeping his jacket closed against the wind and laughs into it. He looks to the lens as it drops. The ground opens fifteen metres to a middle distance and carries on to {{backdrop}} some sixty metres out, softening by layers. Documentary perspective keeps the place legible and the available light honest. A 4:3 waist-up portrait with one useful foreground detail, Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Keep distance-appropriate facial detail, fabric wear, accurate hands, and real weather in the air.",
    "locations": {
      "urban": "a waterfront boardwalk",
      "outdoorsy": "a timber boardwalk near dunes",
      "homebody": "a lakeside boardwalk"
    },
    "backdrops": {
      "urban": "a timber walkway, warehouse conversions and open dock water",
      "outdoorsy": "marram grass, shifting dunes and a pale sea",
      "homebody": "a jetty, upturned boats and the far bank"
    },
    "outfits": {
      "casual": "an ecru cable knit with indigo jeans",
      "sharp": "a plum merino roll-neck under a stone coat",
      "street": "a mustard fleece half-zip over a white tee"
    }
  },
  {
    "id": "travel-19-b",
    "version": 4,
    "bucket": "travel",
    "slot": 19,
    "variant": "b",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He stops at the boardwalk rail and rests both forearms on the timber. He watches the water, past the lens. Twenty metres behind him {{backdrop}} sit in gentle haze, the ground between them holding just enough detail to read. Directional daylight gives clean facial detail and moderate separation from the distance. A 3:4 chest-up portrait with the destination softly recognisable, Canon R5, 50mm, f/2.8, 1/320, ISO 200. Retain complexion variation, beard detail, clothing folds, and believable focus falloff toward the distance.",
    "locations": {
      "urban": "a waterfront boardwalk",
      "outdoorsy": "a timber boardwalk near dunes",
      "homebody": "a lakeside boardwalk"
    },
    "backdrops": {
      "urban": "a timber walkway, warehouse conversions and open dock water",
      "outdoorsy": "marram grass, shifting dunes and a pale sea",
      "homebody": "a jetty, upturned boats and the far bank"
    },
    "outfits": {
      "casual": "a plum brushed-cotton shirt with dark denim",
      "sharp": "a forest quilted jacket over a light-blue shirt",
      "street": "a navy coach jacket over a grey tee"
    }
  },
  {
    "id": "travel-19-c",
    "version": 4,
    "bucket": "travel",
    "slot": 19,
    "variant": "c",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He steps around a damp section of planking, one hand out, and picks his pace back up. He smiles to the lens at the manoeuvre. {{backdrop}} lie thirty metres past him, dropping into pale atmospheric distance while the near ground stays legible. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. A 3:4 waist-up portrait with gentle medium-format separation, Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Preserve gentle skin texture, tonal variation, accurate scale between him and the place, and honest environmental detail.",
    "locations": {
      "urban": "a waterfront boardwalk",
      "outdoorsy": "a timber boardwalk near dunes",
      "homebody": "a lakeside boardwalk"
    },
    "backdrops": {
      "urban": "a timber walkway, warehouse conversions and open dock water",
      "outdoorsy": "marram grass, shifting dunes and a pale sea",
      "homebody": "a jetty, upturned boats and the far bank"
    },
    "outfits": {
      "casual": "a terracotta sweatshirt with stone-grey jeans",
      "sharp": "a rust wool overshirt over a cream knit",
      "street": "a terracotta windbreaker over a cream tee"
    }
  },
  {
    "id": "travel-20-a",
    "version": 4,
    "bucket": "travel",
    "slot": 20,
    "variant": "a",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He reaches the end of the boards where the light goes long, both hands in his coat pockets. He looks from the distance back to the lens. He stands eight metres clear of the nearest edge, with {{backdrop}} stacked forty metres beyond and losing contrast with depth. Documentary perspective keeps the place legible and the available light honest. A 3:4 three-quarter frame from a companion's walking distance, Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Keep distance-appropriate facial detail, fabric wear, accurate hands, and real weather in the air.",
    "locations": {
      "urban": "a waterfront boardwalk",
      "outdoorsy": "a timber boardwalk near dunes",
      "homebody": "a lakeside boardwalk"
    },
    "backdrops": {
      "urban": "boardwalk rails, a container crane and evening water",
      "outdoorsy": "a dune ridge, beach huts and breaking surf",
      "homebody": "a lake path, birches and a wooden hide"
    },
    "outfits": {
      "casual": "a grey marl crewneck under an olive shell",
      "sharp": "a soft-grey topcoat over a black polo",
      "street": "a grey marl hoodie under a stone chore coat"
    }
  },
  {
    "id": "travel-20-b",
    "version": 4,
    "bucket": "travel",
    "slot": 20,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He turns away from the rail into the last of the light, one hand still resting on it. He smiles to the lens. The view runs back from him through twelve metres of open ground to {{backdrop}}, all of it softening toward the horizon. Directional daylight gives clean facial detail and moderate separation from the distance. A 3:4 knee-up portrait that keeps hands and carried objects clear, Canon R5, 50mm, f/2.8, 1/320, ISO 200. Retain complexion variation, beard detail, clothing folds, and believable focus falloff toward the distance.",
    "locations": {
      "urban": "a waterfront boardwalk",
      "outdoorsy": "a timber boardwalk near dunes",
      "homebody": "a lakeside boardwalk"
    },
    "backdrops": {
      "urban": "boardwalk rails, a container crane and evening water",
      "outdoorsy": "a dune ridge, beach huts and breaking surf",
      "homebody": "a lake path, birches and a wooden hide"
    },
    "outfits": {
      "casual": "a chambray overshirt over a cream tee",
      "sharp": "a sand safari jacket over a white tee",
      "street": "a chocolate corduroy trucker over a white tee"
    }
  },
  {
    "id": "travel-20-c",
    "version": 4,
    "bucket": "travel",
    "slot": 20,
    "variant": "c",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He walks back along the boardwalk as the lights come on, one hand loose at his side. He looks back at the water, past the lens. Ten metres of foreground lead the eye to him, and {{backdrop}} settle fifty metres further into soft blue depth. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. A 3:4 three-quarter portrait with balanced negative space, Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Preserve gentle skin texture, tonal variation, accurate scale between him and the place, and honest environmental detail.",
    "locations": {
      "urban": "a waterfront boardwalk",
      "outdoorsy": "a timber boardwalk near dunes",
      "homebody": "a lakeside boardwalk"
    },
    "backdrops": {
      "urban": "boardwalk rails, a container crane and evening water",
      "outdoorsy": "a dune ridge, beach huts and breaking surf",
      "homebody": "a lake path, birches and a wooden hide"
    },
    "outfits": {
      "casual": "a black merino half-zip with dark jeans",
      "sharp": "a slate peacoat over a bone knit",
      "street": "a black waxed parka over an oat tee"
    }
  },
  {
    "id": "active-01-a",
    "version": 4,
    "bucket": "active",
    "slot": 1,
    "variant": "a",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He walks a dog at an easy pace, gathering the lead shorter in one hand as another walker comes past. He looks down to the dog as it checks in, off past the lens. The path opens twelve metres behind him to {{backdrop}}, which soften as the ground falls away. The fast shutter freezes his face and core movement while daylight keeps colour believable. A 9:16 full-body action frame from sideline height, Sony A1, 50mm, f/2.8, 1/1000, auto ISO. Keep joints, hands, feet, equipment and ground contact credible, with mild real warmth across his skin and damp hair at the temple.",
    "locations": {
      "urban": "a broad urban park path",
      "outdoorsy": "a lakeside trail",
      "homebody": "a leafy neighborhood greenway"
    },
    "backdrops": {
      "urban": "an avenue of planes, a bin and joggers going small",
      "outdoorsy": "reed margins, a boat rack and open water",
      "homebody": "clipped hedges, a park gate and low houses"
    },
    "outfits": {
      "casual": "a slate technical tee with tapered charcoal joggers",
      "sharp": "a black technical half-zip with tailored charcoal trousers",
      "street": "a teal windbreaker over a white training tee"
    }
  },
  {
    "id": "active-01-b",
    "version": 4,
    "bucket": "active",
    "slot": 1,
    "variant": "b",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He waits while the dog investigates the verge, the loop of lead hanging from one hand. He glances to the lens with an affectionate expression. {{backdrop}} sit twenty-five metres beyond him, dropping into soft outdoor depth. His face stays coherent while clothing and extremities keep small real movement. A 9:16 friend-taken full-body frame from a safe practical distance, friend-taken iPhone 15 Pro burst, 35mm equivalent, standard photo mode. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture.",
    "locations": {
      "urban": "a broad urban park path",
      "outdoorsy": "a lakeside trail",
      "homebody": "a leafy neighborhood greenway"
    },
    "backdrops": {
      "urban": "an avenue of planes, a bin and joggers going small",
      "outdoorsy": "reed margins, a boat rack and open water",
      "homebody": "clipped hedges, a park gate and low houses"
    },
    "outfits": {
      "casual": "a heather-grey training top with black shorts",
      "sharp": "a navy performance polo with stone trousers",
      "street": "a black hooded shell over a grey tee"
    }
  },
  {
    "id": "active-01-c",
    "version": 4,
    "bucket": "active",
    "slot": 1,
    "variant": "c",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He starts walking again as the dog catches up, letting the lead run loose through his fingers. He laughs to the lens as it pulls briefly ahead. The ground runs back ten metres to {{backdrop}}, held just out of focus. Natural contrast and modest depth create a grounded recreational documentary look. A 9:16 full-body documentary photograph with balanced ground contact, Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Keep natural posture, accurate equipment, modest skin warmth, real breathing effort, and honest contrast.",
    "locations": {
      "urban": "a broad urban park path",
      "outdoorsy": "a lakeside trail",
      "homebody": "a leafy neighborhood greenway"
    },
    "backdrops": {
      "urban": "an avenue of planes, a bin and joggers going small",
      "outdoorsy": "reed margins, a boat rack and open water",
      "homebody": "clipped hedges, a park gate and low houses"
    },
    "outfits": {
      "casual": "an olive long-sleeve base layer with dark trail trousers",
      "sharp": "a charcoal merino quarter-zip with dark trousers",
      "street": "a sand cagoule over a charcoal long-sleeve"
    }
  },
  {
    "id": "active-02-a",
    "version": 4,
    "bucket": "active",
    "slot": 2,
    "variant": "a",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He steps up onto a solid rock in the path, one hand dropping to it for balance, and settles his weight. His eyes stay on his footing, past the lens. Eighteen metres back, {{backdrop}} lose their edges while the ground between stays readable. The fast shutter freezes his face and core movement while daylight keeps colour believable. A 9:16 three-quarter action frame with the face fully visible, Sony A1, 50mm, f/2.8, 1/1000, auto ISO. Keep joints, hands, feet, equipment and ground contact credible, with mild real warmth across his skin and damp hair at the temple.",
    "locations": {
      "urban": "a broad urban park path",
      "outdoorsy": "a lakeside trail",
      "homebody": "a leafy neighborhood greenway"
    },
    "backdrops": {
      "urban": "a park kiosk, benches and a bright open lawn",
      "outdoorsy": "a shingle beach, birches and a far shore",
      "homebody": "a cycle path, bollards and garden fences"
    },
    "outfits": {
      "casual": "a cream cotton tee under a light stone shell",
      "sharp": "a stone softshell over a white performance tee",
      "street": "an indigo track jacket over a cream tee"
    }
  },
  {
    "id": "active-02-b",
    "version": 4,
    "bucket": "active",
    "slot": 2,
    "variant": "b",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He reaches a flatter stretch and loosens one pack strap with his thumb. He smiles to the lens while his breathing settles. Fifteen metres behind him, {{backdrop}} blur gently with the movement of the air. His face stays coherent while clothing and extremities keep small real movement. A 9:16 three-quarter burst photograph with ordinary perspective, friend-taken iPhone 15 Pro burst, 35mm equivalent, standard photo mode. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture.",
    "locations": {
      "urban": "a broad urban park path",
      "outdoorsy": "a lakeside trail",
      "homebody": "a leafy neighborhood greenway"
    },
    "backdrops": {
      "urban": "a park kiosk, benches and a bright open lawn",
      "outdoorsy": "a shingle beach, birches and a far shore",
      "homebody": "a cycle path, bollards and garden fences"
    },
    "outfits": {
      "casual": "a rust merino tee with charcoal joggers",
      "sharp": "a bottle-green quarter-zip with charcoal trousers",
      "street": "a rust half-zip fleece over a black tee"
    }
  },
  {
    "id": "active-02-c",
    "version": 4,
    "bucket": "active",
    "slot": 2,
    "variant": "c",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He pauses at the bend and lifts one hand to point out the route ahead, then lets it drop. He follows his own gesture, off past the lens. Thirty metres out, {{backdrop}} settle into pale distance while his own footing stays sharp. Natural contrast and modest depth create a grounded recreational documentary look. A 9:16 three-quarter photograph with activity context behind him, Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Keep natural posture, accurate equipment, modest skin warmth, real breathing effort, and honest contrast.",
    "locations": {
      "urban": "a broad urban park path",
      "outdoorsy": "a lakeside trail",
      "homebody": "a leafy neighborhood greenway"
    },
    "backdrops": {
      "urban": "a park kiosk, benches and a bright open lawn",
      "outdoorsy": "a shingle beach, birches and a far shore",
      "homebody": "a cycle path, bollards and garden fences"
    },
    "outfits": {
      "casual": "a black training half-zip with grey shorts",
      "sharp": "a camel technical overshirt over a black base layer",
      "street": "a cream hooded overshirt over a slate tee"
    }
  },
  {
    "id": "active-03-a",
    "version": 4,
    "bucket": "active",
    "slot": 3,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He stops in the open, links both hands overhead and stretches out the carry, then lowers his arms. He looks to the lens as the photographer catches up. {{backdrop}} sit twenty-five metres beyond him, dropping into soft outdoor depth. The fast shutter freezes his face and core movement while daylight keeps colour believable. A 4:3 environmental action frame that explains the activity, Sony A1, 50mm, f/2.8, 1/1000, auto ISO. Keep joints, hands, feet, equipment and ground contact credible, with mild real warmth across his skin and damp hair at the temple.",
    "locations": {
      "urban": "a broad urban park path",
      "outdoorsy": "a lakeside trail",
      "homebody": "a leafy neighborhood greenway"
    },
    "backdrops": {
      "urban": "a bandstand, railings and a distant treeline",
      "outdoorsy": "a wooden jetty, moored dinghies and hills",
      "homebody": "a footbridge, brambles and a quiet lane"
    },
    "outfits": {
      "casual": "a forest-green tee with sand hiking trousers",
      "sharp": "a slate merino crew with tailored grey trousers",
      "street": "a burgundy track top with black joggers"
    }
  },
  {
    "id": "active-03-b",
    "version": 4,
    "bucket": "active",
    "slot": 3,
    "variant": "b",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He rolls one shoulder with a hand on the opposite elbow while waiting at the marker. He turns to the lens with an easy smile. The ground runs back ten metres to {{backdrop}}, held just out of focus. His face stays coherent while clothing and extremities keep small real movement. A 4:3 environmental snapshot that includes the path, friend-taken iPhone 15 Pro burst, 35mm equivalent, standard photo mode. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture.",
    "locations": {
      "urban": "a broad urban park path",
      "outdoorsy": "a lakeside trail",
      "homebody": "a leafy neighborhood greenway"
    },
    "backdrops": {
      "urban": "a bandstand, railings and a distant treeline",
      "outdoorsy": "a wooden jetty, moored dinghies and hills",
      "homebody": "a footbridge, brambles and a quiet lane"
    },
    "outfits": {
      "casual": "an oat sweatshirt with dark track pants",
      "sharp": "a rust performance polo with dark trousers",
      "street": "a slate anorak over a white tee"
    }
  },
  {
    "id": "active-03-c",
    "version": 4,
    "bucket": "active",
    "slot": 3,
    "variant": "c",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He reaches back with one hand to shorten a low pack strap and finishes the adjustment. His attention stays on the buckle, past the lens. The path opens twelve metres behind him to {{backdrop}}, which soften as the ground falls away. Natural contrast and modest depth create a grounded recreational documentary look. A 4:3 environmental portrait with natural outdoor depth, Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Keep natural posture, accurate equipment, modest skin warmth, real breathing effort, and honest contrast.",
    "locations": {
      "urban": "a broad urban park path",
      "outdoorsy": "a lakeside trail",
      "homebody": "a leafy neighborhood greenway"
    },
    "backdrops": {
      "urban": "a bandstand, railings and a distant treeline",
      "outdoorsy": "a wooden jetty, moored dinghies and hills",
      "homebody": "a footbridge, brambles and a quiet lane"
    },
    "outfits": {
      "casual": "a burgundy technical tee with black trail trousers",
      "sharp": "a chalk-grey windshirt over a black tee",
      "street": "a chocolate fleece over an oat tee"
    }
  },
  {
    "id": "active-04-a",
    "version": 4,
    "bucket": "active",
    "slot": 4,
    "variant": "a",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He runs at a conversational pace with loose fists and relaxed shoulders, form unchanged. He smiles to the lens as he passes. Fifteen metres behind him, {{backdrop}} blur gently with the movement of the air. The fast shutter freezes his face and core movement while daylight keeps colour believable. A 3:4 knee-up frame with hands and kit inside the image, Sony A1, 50mm, f/2.8, 1/1000, auto ISO. Keep joints, hands, feet, equipment and ground contact credible, with mild real warmth across his skin and damp hair at the temple.",
    "locations": {
      "urban": "a marked hill trail",
      "outdoorsy": "a wooded mountain path",
      "homebody": "a regional-park loop"
    },
    "backdrops": {
      "urban": "a gravelled path, waymarkers and a city edge below",
      "outdoorsy": "pine trunks, root steps and a bright gap ahead",
      "homebody": "a mown verge, a bench and open parkland"
    },
    "outfits": {
      "casual": "a chocolate-brown tee under a light olive gilet",
      "sharp": "an ink-blue merino half-zip with stone trousers",
      "street": "an olive coach jacket over a charcoal tee"
    }
  },
  {
    "id": "active-04-b",
    "version": 4,
    "bucket": "active",
    "slot": 4,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He comes round the bend with compact strides, arms driving lightly, hands loose. His eyes stay on the path ahead, past the lens. Thirty metres out, {{backdrop}} settle into pale distance while his own footing stays sharp. His face stays coherent while clothing and extremities keep small real movement. A 3:4 knee-up candid with small natural movement at the edges, friend-taken iPhone 15 Pro burst, 35mm equivalent, standard photo mode. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture.",
    "locations": {
      "urban": "a marked hill trail",
      "outdoorsy": "a wooded mountain path",
      "homebody": "a regional-park loop"
    },
    "backdrops": {
      "urban": "a gravelled path, waymarkers and a city edge below",
      "outdoorsy": "pine trunks, root steps and a bright gap ahead",
      "homebody": "a mown verge, a bench and open parkland"
    },
    "outfits": {
      "casual": "a bone tee with slate running shorts",
      "sharp": "a taupe softshell over a cream base layer",
      "street": "a stone gilet over a heather long-sleeve"
    }
  },
  {
    "id": "active-04-c",
    "version": 4,
    "bucket": "active",
    "slot": 4,
    "variant": "c",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He slows past the marker, hands dropping to his hips as his stride shortens. He looks back to the lens with calm satisfaction. Eighteen metres back, {{backdrop}} lose their edges while the ground between stays readable. Natural contrast and modest depth create a grounded recreational documentary look. A 3:4 knee-up photograph that keeps kit and hands coherent, Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Keep natural posture, accurate equipment, modest skin warmth, real breathing effort, and honest contrast.",
    "locations": {
      "urban": "a marked hill trail",
      "outdoorsy": "a wooded mountain path",
      "homebody": "a regional-park loop"
    },
    "backdrops": {
      "urban": "a gravelled path, waymarkers and a city edge below",
      "outdoorsy": "pine trunks, root steps and a bright gap ahead",
      "homebody": "a mown verge, a bench and open parkland"
    },
    "outfits": {
      "casual": "a teal training top with charcoal joggers",
      "sharp": "a forest technical gilet over a white long-sleeve",
      "street": "a charcoal hoodie under a black windbreaker"
    }
  },
  {
    "id": "active-05-a",
    "version": 4,
    "bucket": "active",
    "slot": 5,
    "variant": "a",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He sits on the bench to retie one shoe, pulling the knot firm with both hands. He looks up to the lens before standing. The ground runs back ten metres to {{backdrop}}, held just out of focus. The fast shutter freezes his face and core movement while daylight keeps colour believable. A 3:4 medium action frame that keeps active joints whole, Sony A1, 50mm, f/2.8, 1/1000, auto ISO. Keep joints, hands, feet, equipment and ground contact credible, with mild real warmth across his skin and damp hair at the temple.",
    "locations": {
      "urban": "a marked hill trail",
      "outdoorsy": "a wooded mountain path",
      "homebody": "a regional-park loop"
    },
    "backdrops": {
      "urban": "switchbacks, scrub and a hazy skyline",
      "outdoorsy": "a mossy bank, fallen timber and dappled canopy",
      "homebody": "a loop path, a dog-waste bin and playing fields"
    },
    "outfits": {
      "casual": "a mustard long-sleeve with dark shorts",
      "sharp": "a cream merino crew with charcoal trousers",
      "street": "a mustard shell over a white tee"
    }
  },
  {
    "id": "active-05-b",
    "version": 4,
    "bucket": "active",
    "slot": 5,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He rests one foot on the bench and works the lace through his fingers. He smiles to the lens at the photographer's comment. The path opens twelve metres behind him to {{backdrop}}, which soften as the ground falls away. His face stays coherent while clothing and extremities keep small real movement. A 3:4 medium snapshot that keeps the face identifiable, friend-taken iPhone 15 Pro burst, 35mm equivalent, standard photo mode. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture.",
    "locations": {
      "urban": "a marked hill trail",
      "outdoorsy": "a wooded mountain path",
      "homebody": "a regional-park loop"
    },
    "backdrops": {
      "urban": "switchbacks, scrub and a hazy skyline",
      "outdoorsy": "a mossy bank, fallen timber and dappled canopy",
      "homebody": "a loop path, a dog-waste bin and playing fields"
    },
    "outfits": {
      "casual": "a stone-grey hoodie with black joggers",
      "sharp": "a tobacco technical overshirt over a sand tee",
      "street": "an ecru hooded fleece over a grey tee"
    }
  },
  {
    "id": "active-05-c",
    "version": 4,
    "bucket": "active",
    "slot": 5,
    "variant": "c",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He turns a shoe over in one hand to check the sole, sets his foot back down, and stays seated. His eyes stay on the shoe, past the lens. {{backdrop}} sit twenty-five metres beyond him, dropping into soft outdoor depth. Natural contrast and modest depth create a grounded recreational documentary look. A 3:4 medium portrait taken during the activity, Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Keep natural posture, accurate equipment, modest skin warmth, real breathing effort, and honest contrast.",
    "locations": {
      "urban": "a marked hill trail",
      "outdoorsy": "a wooded mountain path",
      "homebody": "a regional-park loop"
    },
    "backdrops": {
      "urban": "switchbacks, scrub and a hazy skyline",
      "outdoorsy": "a mossy bank, fallen timber and dappled canopy",
      "homebody": "a loop path, a dog-waste bin and playing fields"
    },
    "outfits": {
      "casual": "an ecru tee under a light navy windshirt",
      "sharp": "a black merino roll-neck with grey trousers",
      "street": "a forest track jacket over a bone tee"
    }
  },
  {
    "id": "active-06-a",
    "version": 4,
    "bucket": "active",
    "slot": 6,
    "variant": "a",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He climbs with a slight working lean, one hand brushing the bank for balance, and reaches a level patch. He looks back to the lens while recovering. Thirty metres out, {{backdrop}} settle into pale distance while his own footing stays sharp. The fast shutter freezes his face and core movement while daylight keeps colour believable. A 9:16 full-body action frame from sideline height, Sony A1, 50mm, f/2.8, 1/1000, auto ISO. Keep joints, hands, feet, equipment and ground contact credible, with mild real warmth across his skin and damp hair at the temple.",
    "locations": {
      "urban": "a marked hill trail",
      "outdoorsy": "a wooded mountain path",
      "homebody": "a regional-park loop"
    },
    "backdrops": {
      "urban": "a fence line, dry grass and rooftops far below",
      "outdoorsy": "a stream crossing, ferns and dark conifers",
      "homebody": "a hedgerow, a stile and grazing land"
    },
    "outfits": {
      "casual": "a plum training tee with grey trail trousers",
      "sharp": "a plum quarter-zip with dark trousers",
      "street": "a brown fleece half-zip over a black tee"
    }
  },
  {
    "id": "active-06-b",
    "version": 4,
    "bucket": "active",
    "slot": 6,
    "variant": "b",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He stops to tighten a shoulder strap, testing the fit with a thumb under the webbing. His eyes go up the slope, past the lens. Eighteen metres back, {{backdrop}} lose their edges while the ground between stays readable. His face stays coherent while clothing and extremities keep small real movement. A 9:16 friend-taken full-body frame from a safe practical distance, friend-taken iPhone 15 Pro burst, 35mm equivalent, standard photo mode. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture.",
    "locations": {
      "urban": "a marked hill trail",
      "outdoorsy": "a wooded mountain path",
      "homebody": "a regional-park loop"
    },
    "backdrops": {
      "urban": "a fence line, dry grass and rooftops far below",
      "outdoorsy": "a stream crossing, ferns and dark conifers",
      "homebody": "a hedgerow, a stile and grazing land"
    },
    "outfits": {
      "casual": "a terracotta merino tee with dark joggers",
      "sharp": "an olive softshell over a bone tee",
      "street": "a terracotta windshirt over a cream tee"
    }
  },
  {
    "id": "active-06-c",
    "version": 4,
    "bucket": "active",
    "slot": 6,
    "variant": "c",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He takes the next few steps steadily, one hand steadying on a rail. He glances to the lens and smiles at the honest effort. Fifteen metres behind him, {{backdrop}} blur gently with the movement of the air. Natural contrast and modest depth create a grounded recreational documentary look. A 9:16 full-body documentary photograph with balanced ground contact, Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Keep natural posture, accurate equipment, modest skin warmth, real breathing effort, and honest contrast.",
    "locations": {
      "urban": "a marked hill trail",
      "outdoorsy": "a wooded mountain path",
      "homebody": "a regional-park loop"
    },
    "backdrops": {
      "urban": "a fence line, dry grass and rooftops far below",
      "outdoorsy": "a stream crossing, ferns and dark conifers",
      "homebody": "a hedgerow, a stile and grazing land"
    },
    "outfits": {
      "casual": "a charcoal base layer with olive shorts",
      "sharp": "a mid-brown technical shirt with stone trousers",
      "street": "a navy hooded shell over an oat tee"
    }
  },
  {
    "id": "active-07-a",
    "version": 4,
    "bucket": "active",
    "slot": 7,
    "variant": "a",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He sends a ball low along the grass, arm following through, and watches it go. His eyes track the throw, off past the lens. The path opens twelve metres behind him to {{backdrop}}, which soften as the ground falls away. The fast shutter freezes his face and core movement while daylight keeps colour believable. A 9:16 three-quarter action frame with the face fully visible, Sony A1, 50mm, f/2.8, 1/1000, auto ISO. Keep joints, hands, feet, equipment and ground contact credible, with mild real warmth across his skin and damp hair at the temple.",
    "locations": {
      "urban": "a forest exercise clearing",
      "outdoorsy": "a lodge deck beside trees",
      "homebody": "a quiet local park lawn"
    },
    "backdrops": {
      "urban": "a chipped-bark clearing, a pull-up frame and close trees",
      "outdoorsy": "deck boards, a railing and a wall of firs",
      "homebody": "an open lawn, a goalmouth and a hedge"
    },
    "outfits": {
      "casual": "a chambray-blue training tee with black trousers",
      "sharp": "a light-blue performance oxford with charcoal trousers",
      "street": "a grey marl hoodie under a stone gilet"
    }
  },
  {
    "id": "active-07-b",
    "version": 4,
    "bucket": "active",
    "slot": 7,
    "variant": "b",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He takes the returned ball, wipes it once against his thigh, and holds it in one hand beside his leg. He looks to the lens before the next throw. {{backdrop}} sit twenty-five metres beyond him, dropping into soft outdoor depth. His face stays coherent while clothing and extremities keep small real movement. A 9:16 three-quarter burst photograph with ordinary perspective, friend-taken iPhone 15 Pro burst, 35mm equivalent, standard photo mode. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture.",
    "locations": {
      "urban": "a forest exercise clearing",
      "outdoorsy": "a lodge deck beside trees",
      "homebody": "a quiet local park lawn"
    },
    "backdrops": {
      "urban": "a chipped-bark clearing, a pull-up frame and close trees",
      "outdoorsy": "deck boards, a railing and a wall of firs",
      "homebody": "an open lawn, a goalmouth and a hedge"
    },
    "outfits": {
      "casual": "an indigo long-sleeve with stone shorts",
      "sharp": "a soft-grey merino half-zip with black trousers",
      "street": "a black track jacket over a white tee"
    }
  },
  {
    "id": "active-07-c",
    "version": 4,
    "bucket": "active",
    "slot": 7,
    "variant": "c",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He bends just enough to pick the ball up, straightens with it in one hand, and finds the dog already waiting. He laughs to the lens at its impatience. The ground runs back ten metres to {{backdrop}}, held just out of focus. Natural contrast and modest depth create a grounded recreational documentary look. A 9:16 three-quarter photograph with activity context behind him, Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Keep natural posture, accurate equipment, modest skin warmth, real breathing effort, and honest contrast.",
    "locations": {
      "urban": "a forest exercise clearing",
      "outdoorsy": "a lodge deck beside trees",
      "homebody": "a quiet local park lawn"
    },
    "backdrops": {
      "urban": "a chipped-bark clearing, a pull-up frame and close trees",
      "outdoorsy": "deck boards, a railing and a wall of firs",
      "homebody": "an open lawn, a goalmouth and a hedge"
    },
    "outfits": {
      "casual": "a slate technical tee with tapered charcoal joggers",
      "sharp": "a black technical half-zip with tailored charcoal trousers",
      "street": "a teal windbreaker over a white training tee"
    }
  },
  {
    "id": "active-08-a",
    "version": 4,
    "bucket": "active",
    "slot": 8,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He stands with both hands braced above his knees after the effort, then straightens as his breathing settles. He looks up to the lens smiling. Eighteen metres back, {{backdrop}} lose their edges while the ground between stays readable. The fast shutter freezes his face and core movement while daylight keeps colour believable. A 4:3 environmental action frame that explains the activity, Sony A1, 50mm, f/2.8, 1/1000, auto ISO. Keep joints, hands, feet, equipment and ground contact credible, with mild real warmth across his skin and damp hair at the temple.",
    "locations": {
      "urban": "a forest exercise clearing",
      "outdoorsy": "a lodge deck beside trees",
      "homebody": "a quiet local park lawn"
    },
    "backdrops": {
      "urban": "log seating, a trail sign and thick woodland",
      "outdoorsy": "a lodge wall, stacked wood and a dark treeline",
      "homebody": "a park path, litter bins and a play area"
    },
    "outfits": {
      "casual": "a heather-grey training top with black shorts",
      "sharp": "a navy performance polo with stone trousers",
      "street": "a black hooded shell over a grey tee"
    }
  },
  {
    "id": "active-08-b",
    "version": 4,
    "bucket": "active",
    "slot": 8,
    "variant": "b",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He walks out the last stretch with his hands laced behind his head. He slows beside the lens with a relaxed post-run expression. Fifteen metres behind him, {{backdrop}} blur gently with the movement of the air. His face stays coherent while clothing and extremities keep small real movement. A 4:3 environmental snapshot that includes the path, friend-taken iPhone 15 Pro burst, 35mm equivalent, standard photo mode. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture.",
    "locations": {
      "urban": "a forest exercise clearing",
      "outdoorsy": "a lodge deck beside trees",
      "homebody": "a quiet local park lawn"
    },
    "backdrops": {
      "urban": "log seating, a trail sign and thick woodland",
      "outdoorsy": "a lodge wall, stacked wood and a dark treeline",
      "homebody": "a park path, litter bins and a play area"
    },
    "outfits": {
      "casual": "an olive long-sleeve base layer with dark trail trousers",
      "sharp": "a charcoal merino quarter-zip with dark trousers",
      "street": "a sand cagoule over a charcoal long-sleeve"
    }
  },
  {
    "id": "active-08-c",
    "version": 4,
    "bucket": "active",
    "slot": 8,
    "variant": "c",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He lowers a bottle after a drink and screws the cap back on with both hands. He grins to the lens at the question about the run. Thirty metres out, {{backdrop}} settle into pale distance while his own footing stays sharp. Natural contrast and modest depth create a grounded recreational documentary look. A 4:3 environmental portrait with natural outdoor depth, Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Keep natural posture, accurate equipment, modest skin warmth, real breathing effort, and honest contrast.",
    "locations": {
      "urban": "a forest exercise clearing",
      "outdoorsy": "a lodge deck beside trees",
      "homebody": "a quiet local park lawn"
    },
    "backdrops": {
      "urban": "log seating, a trail sign and thick woodland",
      "outdoorsy": "a lodge wall, stacked wood and a dark treeline",
      "homebody": "a park path, litter bins and a play area"
    },
    "outfits": {
      "casual": "a cream cotton tee under a light stone shell",
      "sharp": "a stone softshell over a white performance tee",
      "street": "an indigo track jacket over a cream tee"
    }
  },
  {
    "id": "active-09-a",
    "version": 4,
    "bucket": "active",
    "slot": 9,
    "variant": "a",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He follows the marked path with a compact pack, one hand on the sternum strap, and steps over a root. He watches the ground, past the lens. {{backdrop}} sit twenty-five metres beyond him, dropping into soft outdoor depth. The fast shutter freezes his face and core movement while daylight keeps colour believable. A 3:4 knee-up frame with hands and kit inside the image, Sony A1, 50mm, f/2.8, 1/1000, auto ISO. Keep joints, hands, feet, equipment and ground contact credible, with mild real warmth across his skin and damp hair at the temple.",
    "locations": {
      "urban": "a forest exercise clearing",
      "outdoorsy": "a lodge deck beside trees",
      "homebody": "a quiet local park lawn"
    },
    "backdrops": {
      "urban": "a fitness post, wood chips and shafted light",
      "outdoorsy": "a deck corner, a bench and mountain shadow",
      "homebody": "goalposts, a mown stripe and distant trees"
    },
    "outfits": {
      "casual": "a rust merino tee with charcoal joggers",
      "sharp": "a bottle-green quarter-zip with charcoal trousers",
      "street": "a rust half-zip fleece over a black tee"
    }
  },
  {
    "id": "active-09-b",
    "version": 4,
    "bucket": "active",
    "slot": 9,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He stops at the junction with a hand flat on the signpost while he reads it. He turns to the lens with the route chosen. The ground runs back ten metres to {{backdrop}}, held just out of focus. His face stays coherent while clothing and extremities keep small real movement. A 3:4 knee-up candid with small natural movement at the edges, friend-taken iPhone 15 Pro burst, 35mm equivalent, standard photo mode. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture.",
    "locations": {
      "urban": "a forest exercise clearing",
      "outdoorsy": "a lodge deck beside trees",
      "homebody": "a quiet local park lawn"
    },
    "backdrops": {
      "urban": "a fitness post, wood chips and shafted light",
      "outdoorsy": "a deck corner, a bench and mountain shadow",
      "homebody": "goalposts, a mown stripe and distant trees"
    },
    "outfits": {
      "casual": "a black training half-zip with grey shorts",
      "sharp": "a camel technical overshirt over a black base layer",
      "street": "a cream hooded overshirt over a slate tee"
    }
  },
  {
    "id": "active-09-c",
    "version": 4,
    "bucket": "active",
    "slot": 9,
    "variant": "c",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He adjusts a strap as he walks and lets his hand fall naturally back to his side. He smiles off to the right of the lens at something said behind him. The path opens twelve metres behind him to {{backdrop}}, which soften as the ground falls away. Natural contrast and modest depth create a grounded recreational documentary look. A 3:4 knee-up photograph that keeps kit and hands coherent, Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Keep natural posture, accurate equipment, modest skin warmth, real breathing effort, and honest contrast.",
    "locations": {
      "urban": "a forest exercise clearing",
      "outdoorsy": "a lodge deck beside trees",
      "homebody": "a quiet local park lawn"
    },
    "backdrops": {
      "urban": "a fitness post, wood chips and shafted light",
      "outdoorsy": "a deck corner, a bench and mountain shadow",
      "homebody": "goalposts, a mown stripe and distant trees"
    },
    "outfits": {
      "casual": "a forest-green tee with sand hiking trousers",
      "sharp": "a slate merino crew with tailored grey trousers",
      "street": "a burgundy track top with black joggers"
    }
  },
  {
    "id": "active-10-a",
    "version": 4,
    "bucket": "active",
    "slot": 10,
    "variant": "a",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He runs the riverside stretch into the low light, hands loose and shoulders down. He looks to the lens as he draws level. Fifteen metres behind him, {{backdrop}} blur gently with the movement of the air. The fast shutter freezes his face and core movement while daylight keeps colour believable. A 3:4 medium action frame that keeps active joints whole, Sony A1, 50mm, f/2.8, 1/1000, auto ISO. Keep joints, hands, feet, equipment and ground contact credible, with mild real warmth across his skin and damp hair at the temple.",
    "locations": {
      "urban": "a riverside running route",
      "outdoorsy": "a golden-hour trail path",
      "homebody": "a familiar park loop"
    },
    "backdrops": {
      "urban": "an embankment wall, a bridge span and river light",
      "outdoorsy": "a ridge path, low sun and a valley beyond",
      "homebody": "a tarmac loop, lamp posts and open grass"
    },
    "outfits": {
      "casual": "an oat sweatshirt with dark track pants",
      "sharp": "a rust performance polo with dark trousers",
      "street": "a slate anorak over a white tee"
    }
  },
  {
    "id": "active-10-b",
    "version": 4,
    "bucket": "active",
    "slot": 10,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He eases to a walk and rests both hands on top of his head, elbows wide. His eyes go out over the water, past the lens. Thirty metres out, {{backdrop}} settle into pale distance while his own footing stays sharp. His face stays coherent while clothing and extremities keep small real movement. A 3:4 medium snapshot that keeps the face identifiable, friend-taken iPhone 15 Pro burst, 35mm equivalent, standard photo mode. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture.",
    "locations": {
      "urban": "a riverside running route",
      "outdoorsy": "a golden-hour trail path",
      "homebody": "a familiar park loop"
    },
    "backdrops": {
      "urban": "an embankment wall, a bridge span and river light",
      "outdoorsy": "a ridge path, low sun and a valley beyond",
      "homebody": "a tarmac loop, lamp posts and open grass"
    },
    "outfits": {
      "casual": "a burgundy technical tee with black trail trousers",
      "sharp": "a chalk-grey windshirt over a black tee",
      "street": "a chocolate fleece over an oat tee"
    }
  },
  {
    "id": "active-10-c",
    "version": 4,
    "bucket": "active",
    "slot": 10,
    "variant": "c",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He stops at the wall, plants one palm on it and rolls an ankle out. He looks up to the lens between breaths. Eighteen metres back, {{backdrop}} lose their edges while the ground between stays readable. Natural contrast and modest depth create a grounded recreational documentary look. A 3:4 medium portrait taken during the activity, Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Keep natural posture, accurate equipment, modest skin warmth, real breathing effort, and honest contrast.",
    "locations": {
      "urban": "a riverside running route",
      "outdoorsy": "a golden-hour trail path",
      "homebody": "a familiar park loop"
    },
    "backdrops": {
      "urban": "an embankment wall, a bridge span and river light",
      "outdoorsy": "a ridge path, low sun and a valley beyond",
      "homebody": "a tarmac loop, lamp posts and open grass"
    },
    "outfits": {
      "casual": "a chocolate-brown tee under a light olive gilet",
      "sharp": "an ink-blue merino half-zip with stone trousers",
      "street": "an olive coach jacket over a charcoal tee"
    }
  },
  {
    "id": "active-11-a",
    "version": 4,
    "bucket": "active",
    "slot": 11,
    "variant": "a",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He runs the long straight with the light behind him, arms swinging economically. His focus stays down the path, past the lens. The ground runs back ten metres to {{backdrop}}, held just out of focus. The fast shutter freezes his face and core movement while daylight keeps colour believable. A 9:16 full-body action frame from sideline height, Sony A1, 50mm, f/2.8, 1/1000, auto ISO. Keep joints, hands, feet, equipment and ground contact credible, with mild real warmth across his skin and damp hair at the temple.",
    "locations": {
      "urban": "a riverside running route",
      "outdoorsy": "a golden-hour trail path",
      "homebody": "a familiar park loop"
    },
    "backdrops": {
      "urban": "a towpath, moored barges and warehouse fronts",
      "outdoorsy": "long grass, a fence line and gold hillside",
      "homebody": "park railings, a café hut and playing fields"
    },
    "outfits": {
      "casual": "a bone tee with slate running shorts",
      "sharp": "a taupe softshell over a cream base layer",
      "street": "a stone gilet over a heather long-sleeve"
    }
  },
  {
    "id": "active-11-b",
    "version": 4,
    "bucket": "active",
    "slot": 11,
    "variant": "b",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He slows to a jog and pulls the hem of his top up to wipe his forehead with one hand. He looks to the lens as he lets it fall. The path opens twelve metres behind him to {{backdrop}}, which soften as the ground falls away. His face stays coherent while clothing and extremities keep small real movement. A 9:16 friend-taken full-body frame from a safe practical distance, friend-taken iPhone 15 Pro burst, 35mm equivalent, standard photo mode. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture.",
    "locations": {
      "urban": "a riverside running route",
      "outdoorsy": "a golden-hour trail path",
      "homebody": "a familiar park loop"
    },
    "backdrops": {
      "urban": "a towpath, moored barges and warehouse fronts",
      "outdoorsy": "long grass, a fence line and gold hillside",
      "homebody": "park railings, a café hut and playing fields"
    },
    "outfits": {
      "casual": "a teal training top with charcoal joggers",
      "sharp": "a forest technical gilet over a white long-sleeve",
      "street": "a charcoal hoodie under a black windbreaker"
    }
  },
  {
    "id": "active-11-c",
    "version": 4,
    "bucket": "active",
    "slot": 11,
    "variant": "c",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He stops to check a watch on his wrist, thumb on the bezel, then drops the arm. He smiles to the lens at the split. {{backdrop}} sit twenty-five metres beyond him, dropping into soft outdoor depth. Natural contrast and modest depth create a grounded recreational documentary look. A 9:16 full-body documentary photograph with balanced ground contact, Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Keep natural posture, accurate equipment, modest skin warmth, real breathing effort, and honest contrast.",
    "locations": {
      "urban": "a riverside running route",
      "outdoorsy": "a golden-hour trail path",
      "homebody": "a familiar park loop"
    },
    "backdrops": {
      "urban": "a towpath, moored barges and warehouse fronts",
      "outdoorsy": "long grass, a fence line and gold hillside",
      "homebody": "park railings, a café hut and playing fields"
    },
    "outfits": {
      "casual": "a mustard long-sleeve with dark shorts",
      "sharp": "a cream merino crew with charcoal trousers",
      "street": "a mustard shell over a white tee"
    }
  },
  {
    "id": "active-12-a",
    "version": 4,
    "bucket": "active",
    "slot": 12,
    "variant": "a",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He walks through long grass letting one hand brush the seed heads. His eyes follow his own hand, off past the lens. Thirty metres out, {{backdrop}} settle into pale distance while his own footing stays sharp. The fast shutter freezes his face and core movement while daylight keeps colour believable. A 9:16 three-quarter action frame with the face fully visible, Sony A1, 50mm, f/2.8, 1/1000, auto ISO. Keep joints, hands, feet, equipment and ground contact credible, with mild real warmth across his skin and damp hair at the temple.",
    "locations": {
      "urban": "a riverside running route",
      "outdoorsy": "a golden-hour trail path",
      "homebody": "a familiar park loop"
    },
    "backdrops": {
      "urban": "a river bend, a distant footbridge and city rooftops",
      "outdoorsy": "a rocky crest, scattered pines and open sky",
      "homebody": "a tree line, a bench and a car park edge"
    },
    "outfits": {
      "casual": "a stone-grey hoodie with black joggers",
      "sharp": "a tobacco technical overshirt over a sand tee",
      "street": "an ecru hooded fleece over a grey tee"
    }
  },
  {
    "id": "active-12-b",
    "version": 4,
    "bucket": "active",
    "slot": 12,
    "variant": "b",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He stops where the path opens and turns into the warm light, thumbs hooked in his waistband. He smiles to the lens before going on. Eighteen metres back, {{backdrop}} lose their edges while the ground between stays readable. His face stays coherent while clothing and extremities keep small real movement. A 9:16 three-quarter burst photograph with ordinary perspective, friend-taken iPhone 15 Pro burst, 35mm equivalent, standard photo mode. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture.",
    "locations": {
      "urban": "a riverside running route",
      "outdoorsy": "a golden-hour trail path",
      "homebody": "a familiar park loop"
    },
    "backdrops": {
      "urban": "a river bend, a distant footbridge and city rooftops",
      "outdoorsy": "a rocky crest, scattered pines and open sky",
      "homebody": "a tree line, a bench and a car park edge"
    },
    "outfits": {
      "casual": "an ecru tee under a light navy windshirt",
      "sharp": "a black merino roll-neck with grey trousers",
      "street": "a forest track jacket over a bone tee"
    }
  },
  {
    "id": "active-12-c",
    "version": 4,
    "bucket": "active",
    "slot": 12,
    "variant": "c",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He follows the narrow line of the path and steps wide around a rough patch, one hand out. He looks back to the lens to share the view. Fifteen metres behind him, {{backdrop}} blur gently with the movement of the air. Natural contrast and modest depth create a grounded recreational documentary look. A 9:16 three-quarter photograph with activity context behind him, Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Keep natural posture, accurate equipment, modest skin warmth, real breathing effort, and honest contrast.",
    "locations": {
      "urban": "a riverside running route",
      "outdoorsy": "a golden-hour trail path",
      "homebody": "a familiar park loop"
    },
    "backdrops": {
      "urban": "a river bend, a distant footbridge and city rooftops",
      "outdoorsy": "a rocky crest, scattered pines and open sky",
      "homebody": "a tree line, a bench and a car park edge"
    },
    "outfits": {
      "casual": "a plum training tee with grey trail trousers",
      "sharp": "a plum quarter-zip with dark trousers",
      "street": "a brown fleece half-zip over a black tee"
    }
  },
  {
    "id": "active-13-a",
    "version": 4,
    "bucket": "active",
    "slot": 13,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He fills a bottle at the fountain, closes it firmly with both hands, and slides it into a side pocket. His eyes stay on the pocket, past the lens. The path opens twelve metres behind him to {{backdrop}}, which soften as the ground falls away. The fast shutter freezes his face and core movement while daylight keeps colour believable. A 4:3 environmental action frame that explains the activity, Sony A1, 50mm, f/2.8, 1/1000, auto ISO. Keep joints, hands, feet, equipment and ground contact credible, with mild real warmth across his skin and damp hair at the temple.",
    "locations": {
      "urban": "a shaded city-park bench",
      "outdoorsy": "a trailhead rest bench",
      "homebody": "a neighborhood park bench"
    },
    "backdrops": {
      "urban": "a plane-tree canopy, a drinking fountain and a lit path",
      "outdoorsy": "a trail board, a boot brush and rising woodland",
      "homebody": "a hedge, a swing frame and low rooftops"
    },
    "outfits": {
      "casual": "a terracotta merino tee with dark joggers",
      "sharp": "an olive softshell over a bone tee",
      "street": "a terracotta windshirt over a cream tee"
    }
  },
  {
    "id": "active-13-b",
    "version": 4,
    "bucket": "active",
    "slot": 13,
    "variant": "b",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He waits for the bottle to fill with one hand under it, reading the route board beside him. He smiles to the lens. {{backdrop}} sit twenty-five metres beyond him, dropping into soft outdoor depth. His face stays coherent while clothing and extremities keep small real movement. A 4:3 environmental snapshot that includes the path, friend-taken iPhone 15 Pro burst, 35mm equivalent, standard photo mode. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture.",
    "locations": {
      "urban": "a shaded city-park bench",
      "outdoorsy": "a trailhead rest bench",
      "homebody": "a neighborhood park bench"
    },
    "backdrops": {
      "urban": "a plane-tree canopy, a drinking fountain and a lit path",
      "outdoorsy": "a trail board, a boot brush and rising woodland",
      "homebody": "a hedge, a swing frame and low rooftops"
    },
    "outfits": {
      "casual": "a charcoal base layer with olive shorts",
      "sharp": "a mid-brown technical shirt with stone trousers",
      "street": "a navy hooded shell over an oat tee"
    }
  },
  {
    "id": "active-13-c",
    "version": 4,
    "bucket": "active",
    "slot": 13,
    "variant": "c",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He finishes drinking, wipes his mouth on the back of one wrist, and caps the bottle. He looks to the lens before rejoining the path. The ground runs back ten metres to {{backdrop}}, held just out of focus. Natural contrast and modest depth create a grounded recreational documentary look. A 4:3 environmental portrait with natural outdoor depth, Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Keep natural posture, accurate equipment, modest skin warmth, real breathing effort, and honest contrast.",
    "locations": {
      "urban": "a shaded city-park bench",
      "outdoorsy": "a trailhead rest bench",
      "homebody": "a neighborhood park bench"
    },
    "backdrops": {
      "urban": "a plane-tree canopy, a drinking fountain and a lit path",
      "outdoorsy": "a trail board, a boot brush and rising woodland",
      "homebody": "a hedge, a swing frame and low rooftops"
    },
    "outfits": {
      "casual": "a chambray-blue training tee with black trousers",
      "sharp": "a light-blue performance oxford with charcoal trousers",
      "street": "a grey marl hoodie under a stone gilet"
    }
  },
  {
    "id": "active-14-a",
    "version": 4,
    "bucket": "active",
    "slot": 14,
    "variant": "a",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He sits on the bench after the effort with both forearms loose on his thighs. He looks off to the left of the lens, still catching up with his breathing. Eighteen metres back, {{backdrop}} lose their edges while the ground between stays readable. The fast shutter freezes his face and core movement while daylight keeps colour believable. A 3:4 knee-up frame with hands and kit inside the image, Sony A1, 50mm, f/2.8, 1/1000, auto ISO. Keep joints, hands, feet, equipment and ground contact credible, with mild real warmth across his skin and damp hair at the temple.",
    "locations": {
      "urban": "a shaded city-park bench",
      "outdoorsy": "a trailhead rest bench",
      "homebody": "a neighborhood park bench"
    },
    "backdrops": {
      "urban": "park chairs, a kiosk and passing cyclists",
      "outdoorsy": "a gravel car park, a gate and open fell",
      "homebody": "a bin, a lamp post and a row of gardens"
    },
    "outfits": {
      "casual": "an indigo long-sleeve with stone shorts",
      "sharp": "a soft-grey merino half-zip with black trousers",
      "street": "a black track jacket over a white tee"
    }
  },
  {
    "id": "active-14-b",
    "version": 4,
    "bucket": "active",
    "slot": 14,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He drapes a small towel round his neck and keeps one hand on each end. He smiles to the lens as the conversation restarts. Fifteen metres behind him, {{backdrop}} blur gently with the movement of the air. His face stays coherent while clothing and extremities keep small real movement. A 3:4 knee-up candid with small natural movement at the edges, friend-taken iPhone 15 Pro burst, 35mm equivalent, standard photo mode. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture.",
    "locations": {
      "urban": "a shaded city-park bench",
      "outdoorsy": "a trailhead rest bench",
      "homebody": "a neighborhood park bench"
    },
    "backdrops": {
      "urban": "park chairs, a kiosk and passing cyclists",
      "outdoorsy": "a gravel car park, a gate and open fell",
      "homebody": "a bin, a lamp post and a row of gardens"
    },
    "outfits": {
      "casual": "a slate technical tee with tapered charcoal joggers",
      "sharp": "a black technical half-zip with tailored charcoal trousers",
      "street": "a teal windbreaker over a white training tee"
    }
  },
  {
    "id": "active-14-c",
    "version": 4,
    "bucket": "active",
    "slot": 14,
    "variant": "c",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He shifts along the bench, sets a bottle down beside him with one hand, and settles into the pause. He looks to the lens. Thirty metres out, {{backdrop}} settle into pale distance while his own footing stays sharp. Natural contrast and modest depth create a grounded recreational documentary look. A 3:4 knee-up photograph that keeps kit and hands coherent, Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Keep natural posture, accurate equipment, modest skin warmth, real breathing effort, and honest contrast.",
    "locations": {
      "urban": "a shaded city-park bench",
      "outdoorsy": "a trailhead rest bench",
      "homebody": "a neighborhood park bench"
    },
    "backdrops": {
      "urban": "park chairs, a kiosk and passing cyclists",
      "outdoorsy": "a gravel car park, a gate and open fell",
      "homebody": "a bin, a lamp post and a row of gardens"
    },
    "outfits": {
      "casual": "a heather-grey training top with black shorts",
      "sharp": "a navy performance polo with stone trousers",
      "street": "a black hooded shell over a grey tee"
    }
  },
  {
    "id": "active-15-a",
    "version": 4,
    "bucket": "active",
    "slot": 15,
    "variant": "a",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He rides past at a controlled pace, both hands on the bars and his weight easy. He smiles to the lens and holds his line. {{backdrop}} sit twenty-five metres beyond him, dropping into soft outdoor depth. The fast shutter freezes his face and core movement while daylight keeps colour believable. A 3:4 medium action frame that keeps active joints whole, Sony A1, 50mm, f/2.8, 1/1000, auto ISO. Keep joints, hands, feet, equipment and ground contact credible, with mild real warmth across his skin and damp hair at the temple.",
    "locations": {
      "urban": "a shaded city-park bench",
      "outdoorsy": "a trailhead rest bench",
      "homebody": "a neighborhood park bench"
    },
    "backdrops": {
      "urban": "iron railings, a bandstand and dappled shade",
      "outdoorsy": "a stile, a waymarker and a bare ridge",
      "homebody": "a bike rack, a wall and quiet houses"
    },
    "outfits": {
      "casual": "an olive long-sleeve base layer with dark trail trousers",
      "sharp": "a charcoal merino quarter-zip with dark trousers",
      "street": "a sand cagoule over a charcoal long-sleeve"
    }
  },
  {
    "id": "active-15-b",
    "version": 4,
    "bucket": "active",
    "slot": 15,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He slows to a stop and puts one foot down, a hand still on the brake hood. His eyes go back along the route, past the lens. The ground runs back ten metres to {{backdrop}}, held just out of focus. His face stays coherent while clothing and extremities keep small real movement. A 3:4 medium snapshot that keeps the face identifiable, friend-taken iPhone 15 Pro burst, 35mm equivalent, standard photo mode. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture.",
    "locations": {
      "urban": "a shaded city-park bench",
      "outdoorsy": "a trailhead rest bench",
      "homebody": "a neighborhood park bench"
    },
    "backdrops": {
      "urban": "iron railings, a bandstand and dappled shade",
      "outdoorsy": "a stile, a waymarker and a bare ridge",
      "homebody": "a bike rack, a wall and quiet houses"
    },
    "outfits": {
      "casual": "a cream cotton tee under a light stone shell",
      "sharp": "a stone softshell over a white performance tee",
      "street": "an indigo track jacket over a cream tee"
    }
  },
  {
    "id": "active-15-c",
    "version": 4,
    "bucket": "active",
    "slot": 15,
    "variant": "c",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He walks the bicycle beside him with one hand on the saddle and one on the bar. He looks to the lens as he passes. The path opens twelve metres behind him to {{backdrop}}, which soften as the ground falls away. Natural contrast and modest depth create a grounded recreational documentary look. A 3:4 medium portrait taken during the activity, Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Keep natural posture, accurate equipment, modest skin warmth, real breathing effort, and honest contrast.",
    "locations": {
      "urban": "a shaded city-park bench",
      "outdoorsy": "a trailhead rest bench",
      "homebody": "a neighborhood park bench"
    },
    "backdrops": {
      "urban": "iron railings, a bandstand and dappled shade",
      "outdoorsy": "a stile, a waymarker and a bare ridge",
      "homebody": "a bike rack, a wall and quiet houses"
    },
    "outfits": {
      "casual": "a rust merino tee with charcoal joggers",
      "sharp": "a bottle-green quarter-zip with charcoal trousers",
      "street": "a rust half-zip fleece over a black tee"
    }
  },
  {
    "id": "active-16-a",
    "version": 4,
    "bucket": "active",
    "slot": 16,
    "variant": "a",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He works up the stepped path with one hand on the handrail and a steady rhythm. His focus stays a few steps ahead, past the lens. Fifteen metres behind him, {{backdrop}} blur gently with the movement of the air. The fast shutter freezes his face and core movement while daylight keeps colour believable. A 9:16 full-body action frame from sideline height, Sony A1, 50mm, f/2.8, 1/1000, auto ISO. Keep joints, hands, feet, equipment and ground contact credible, with mild real warmth across his skin and damp hair at the temple.",
    "locations": {
      "urban": "a landscaped hill path",
      "outdoorsy": "a moderate mountain trail",
      "homebody": "a sloped local greenway"
    },
    "backdrops": {
      "urban": "terraced planting, a handrail and the city spread below",
      "outdoorsy": "a rock step, heather and a long ridge",
      "homebody": "a grass bank, a fence and back gardens"
    },
    "outfits": {
      "casual": "a black training half-zip with grey shorts",
      "sharp": "a camel technical overshirt over a black base layer",
      "street": "a cream hooded overshirt over a slate tee"
    }
  },
  {
    "id": "active-16-b",
    "version": 4,
    "bucket": "active",
    "slot": 16,
    "variant": "b",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He reaches the top, drops both hands to his hips, and turns to face the way he came. He looks to the lens as his breathing comes back. Thirty metres out, {{backdrop}} settle into pale distance while his own footing stays sharp. His face stays coherent while clothing and extremities keep small real movement. A 9:16 friend-taken full-body frame from a safe practical distance, friend-taken iPhone 15 Pro burst, 35mm equivalent, standard photo mode. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture.",
    "locations": {
      "urban": "a landscaped hill path",
      "outdoorsy": "a moderate mountain trail",
      "homebody": "a sloped local greenway"
    },
    "backdrops": {
      "urban": "terraced planting, a handrail and the city spread below",
      "outdoorsy": "a rock step, heather and a long ridge",
      "homebody": "a grass bank, a fence and back gardens"
    },
    "outfits": {
      "casual": "a forest-green tee with sand hiking trousers",
      "sharp": "a slate merino crew with tailored grey trousers",
      "street": "a burgundy track top with black joggers"
    }
  },
  {
    "id": "active-16-c",
    "version": 4,
    "bucket": "active",
    "slot": 16,
    "variant": "c",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He pauses on the rise, rests one forearm across the rail and shakes out the other hand. He smiles to the lens. Eighteen metres back, {{backdrop}} lose their edges while the ground between stays readable. Natural contrast and modest depth create a grounded recreational documentary look. A 9:16 full-body documentary photograph with balanced ground contact, Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Keep natural posture, accurate equipment, modest skin warmth, real breathing effort, and honest contrast.",
    "locations": {
      "urban": "a landscaped hill path",
      "outdoorsy": "a moderate mountain trail",
      "homebody": "a sloped local greenway"
    },
    "backdrops": {
      "urban": "terraced planting, a handrail and the city spread below",
      "outdoorsy": "a rock step, heather and a long ridge",
      "homebody": "a grass bank, a fence and back gardens"
    },
    "outfits": {
      "casual": "an oat sweatshirt with dark track pants",
      "sharp": "a rust performance polo with dark trousers",
      "street": "a slate anorak over a white tee"
    }
  },
  {
    "id": "active-17-a",
    "version": 4,
    "bucket": "active",
    "slot": 17,
    "variant": "a",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He braces one hand against a tree and takes a calf stretch, holding it for a breath before releasing. He looks to the lens as he comes off it. The ground runs back ten metres to {{backdrop}}, held just out of focus. The fast shutter freezes his face and core movement while daylight keeps colour believable. A 9:16 three-quarter action frame with the face fully visible, Sony A1, 50mm, f/2.8, 1/1000, auto ISO. Keep joints, hands, feet, equipment and ground contact credible, with mild real warmth across his skin and damp hair at the temple.",
    "hobbyPromptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At a plausible real-world venue he concentrates on {{hobby}}, completing one recognisable step with his hands doing the actual work. He looks to the lens with quiet satisfaction as it finishes. The venue runs fifteen metres back behind him into soft depth, its own equipment and surfaces legible but out of focus. The fast shutter freezes his face and core movement while daylight keeps colour believable. A 9:16 three-quarter action frame with the face fully visible, Sony A1, 50mm, f/2.8, 1/1000, auto ISO. Keep joints, hands, feet, equipment and ground contact credible, with mild real warmth across his skin and damp hair at the temple.",
    "locations": {
      "urban": "a landscaped hill path",
      "outdoorsy": "a moderate mountain trail",
      "homebody": "a sloped local greenway"
    },
    "backdrops": {
      "urban": "a stepped path, low walls and distant towers",
      "outdoorsy": "scree, a cairn and cloud shadow on the slope",
      "homebody": "a tarmac rise, hedging and a bus stop below"
    },
    "outfits": {
      "casual": "a burgundy technical tee with black trail trousers",
      "sharp": "a chalk-grey windshirt over a black tee",
      "street": "a chocolate fleece over an oat tee"
    }
  },
  {
    "id": "active-17-b",
    "version": 4,
    "bucket": "active",
    "slot": 17,
    "variant": "b",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He finishes a simple wall stretch with both palms flat against it and steps back onto the path. He smiles to the lens. The path opens twelve metres behind him to {{backdrop}}, which soften as the ground falls away. His face stays coherent while clothing and extremities keep small real movement. A 9:16 three-quarter burst photograph with ordinary perspective, friend-taken iPhone 15 Pro burst, 35mm equivalent, standard photo mode. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture.",
    "hobbyPromptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. A friend photographs him taking part in {{hobby}}; he completes a small action and checks the result in his hands. He reacts with his eyes coming up to the lens. Ten metres of the venue open up behind him, the activity's surroundings softening into ordinary blur. His face stays coherent while clothing and extremities keep small real movement. A 9:16 three-quarter burst photograph with ordinary perspective, friend-taken iPhone 15 Pro burst, 35mm equivalent, standard photo mode. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture.",
    "locations": {
      "urban": "a landscaped hill path",
      "outdoorsy": "a moderate mountain trail",
      "homebody": "a sloped local greenway"
    },
    "backdrops": {
      "urban": "a stepped path, low walls and distant towers",
      "outdoorsy": "scree, a cairn and cloud shadow on the slope",
      "homebody": "a tarmac rise, hedging and a bus stop below"
    },
    "outfits": {
      "casual": "a chocolate-brown tee under a light olive gilet",
      "sharp": "an ink-blue merino half-zip with stone trousers",
      "street": "an olive coach jacket over a charcoal tee"
    }
  },
  {
    "id": "active-17-c",
    "version": 4,
    "bucket": "active",
    "slot": 17,
    "variant": "c",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He extends one leg to the bench, rests a hand on the knee, and comes out of the stretch naturally. His eyes stay on his footing, past the lens. {{backdrop}} sit twenty-five metres beyond him, dropping into soft outdoor depth. Natural contrast and modest depth create a grounded recreational documentary look. A 9:16 three-quarter photograph with activity context behind him, Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Keep natural posture, accurate equipment, modest skin warmth, real breathing effort, and honest contrast.",
    "hobbyPromptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. During an ordinary session of {{hobby}} he uses just the equipment the activity needs, pausing at a natural transition with both hands still on it. He acknowledges the photographer with a glance to the lens. The working space carries on twelve metres behind him, its detail present and gently out of focus. Natural contrast and modest depth create a grounded recreational documentary look. A 9:16 three-quarter photograph with activity context behind him, Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Keep natural posture, accurate equipment, modest skin warmth, real breathing effort, and honest contrast.",
    "locations": {
      "urban": "a landscaped hill path",
      "outdoorsy": "a moderate mountain trail",
      "homebody": "a sloped local greenway"
    },
    "backdrops": {
      "urban": "a stepped path, low walls and distant towers",
      "outdoorsy": "scree, a cairn and cloud shadow on the slope",
      "homebody": "a tarmac rise, hedging and a bus stop below"
    },
    "outfits": {
      "casual": "a bone tee with slate running shorts",
      "sharp": "a taupe softshell over a cream base layer",
      "street": "a stone gilet over a heather long-sleeve"
    }
  },
  {
    "id": "active-18-a",
    "version": 4,
    "bucket": "active",
    "slot": 18,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He links both hands behind his back and opens his chest for a moment at the top of the climb. He looks to the lens as he lets go. Thirty metres out, {{backdrop}} settle into pale distance while his own footing stays sharp. The fast shutter freezes his face and core movement while daylight keeps colour believable. A 4:3 environmental action frame that explains the activity, Sony A1, 50mm, f/2.8, 1/1000, auto ISO. Keep joints, hands, feet, equipment and ground contact credible, with mild real warmth across his skin and damp hair at the temple.",
    "hobbyPromptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At a plausible real-world venue he works through {{hobby}} at his own pace, both hands occupied with the real task. He glances to the lens between steps. The venue falls away eighteen metres behind him, its fittings and floor softening with distance. The fast shutter freezes his face and core movement while daylight keeps colour believable. A 4:3 environmental action frame that explains the activity, Sony A1, 50mm, f/2.8, 1/1000, auto ISO. Keep joints, hands, feet, equipment and ground contact credible, with mild real warmth across his skin and damp hair at the temple.",
    "locations": {
      "urban": "a landscaped hill path",
      "outdoorsy": "a moderate mountain trail",
      "homebody": "a sloped local greenway"
    },
    "backdrops": {
      "urban": "a viewing platform, benches and a hazy skyline",
      "outdoorsy": "a saddle, wind-bent grass and far peaks",
      "homebody": "a green corridor, saplings and a footbridge"
    },
    "outfits": {
      "casual": "a teal training top with charcoal joggers",
      "sharp": "a forest technical gilet over a white long-sleeve",
      "street": "a charcoal hoodie under a black windbreaker"
    }
  },
  {
    "id": "active-18-b",
    "version": 4,
    "bucket": "active",
    "slot": 18,
    "variant": "b",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He rolls his wrists out one at a time after the descent, shaking the tension off. His attention stays on his hands, past the lens. Eighteen metres back, {{backdrop}} lose their edges while the ground between stays readable. His face stays coherent while clothing and extremities keep small real movement. A 4:3 environmental snapshot that includes the path, friend-taken iPhone 15 Pro burst, 35mm equivalent, standard photo mode. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture.",
    "hobbyPromptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. A friend catches him mid-session at {{hobby}}; he adjusts something with his fingers and sets it back down. He looks up to the lens, keeping the posture he was already in. Fourteen metres of the space sit behind him, everyday clutter reading softly out of focus. His face stays coherent while clothing and extremities keep small real movement. A 4:3 environmental snapshot that includes the path, friend-taken iPhone 15 Pro burst, 35mm equivalent, standard photo mode. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture.",
    "locations": {
      "urban": "a landscaped hill path",
      "outdoorsy": "a moderate mountain trail",
      "homebody": "a sloped local greenway"
    },
    "backdrops": {
      "urban": "a viewing platform, benches and a hazy skyline",
      "outdoorsy": "a saddle, wind-bent grass and far peaks",
      "homebody": "a green corridor, saplings and a footbridge"
    },
    "outfits": {
      "casual": "a mustard long-sleeve with dark shorts",
      "sharp": "a cream merino crew with charcoal trousers",
      "street": "a mustard shell over a white tee"
    }
  },
  {
    "id": "active-18-c",
    "version": 4,
    "bucket": "active",
    "slot": 18,
    "variant": "c",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He crouches to retie a lace with both hands, then rises and settles his weight. He looks to the lens as he straightens. Fifteen metres behind him, {{backdrop}} blur gently with the movement of the air. Natural contrast and modest depth create a grounded recreational documentary look. A 4:3 environmental portrait with natural outdoor depth, Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Keep natural posture, accurate equipment, modest skin warmth, real breathing effort, and honest contrast.",
    "hobbyPromptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. In the middle of {{hobby}} he steadies the equipment with one hand and finishes the movement with the other. He turns to the photographer as it ends, eyes to the lens. The room or ground behind him opens out sixteen metres and holds soft, honest detail. Natural contrast and modest depth create a grounded recreational documentary look. A 4:3 environmental portrait with natural outdoor depth, Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Keep natural posture, accurate equipment, modest skin warmth, real breathing effort, and honest contrast.",
    "locations": {
      "urban": "a landscaped hill path",
      "outdoorsy": "a moderate mountain trail",
      "homebody": "a sloped local greenway"
    },
    "backdrops": {
      "urban": "a viewing platform, benches and a hazy skyline",
      "outdoorsy": "a saddle, wind-bent grass and far peaks",
      "homebody": "a green corridor, saplings and a footbridge"
    },
    "outfits": {
      "casual": "a stone-grey hoodie with black joggers",
      "sharp": "a tobacco technical overshirt over a sand tee",
      "street": "an ecru hooded fleece over a grey tee"
    }
  },
  {
    "id": "active-19-a",
    "version": 4,
    "bucket": "active",
    "slot": 19,
    "variant": "a",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He crosses the field carrying a folded jacket in one hand after the game. He looks off to the right of the lens at somebody calling. The path opens twelve metres behind him to {{backdrop}}, which soften as the ground falls away. The fast shutter freezes his face and core movement while daylight keeps colour believable. A 3:4 knee-up frame with hands and kit inside the image, Sony A1, 50mm, f/2.8, 1/1000, auto ISO. Keep joints, hands, feet, equipment and ground contact credible, with mild real warmth across his skin and damp hair at the temple.",
    "hobbyPromptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At a plausible real-world venue he sets up for {{hobby}}, positioning the gear with both hands before starting. He looks to the lens once it is right. The venue stretches twenty metres behind him, its background shapes soft and unremarkable. The fast shutter freezes his face and core movement while daylight keeps colour believable. A 3:4 knee-up frame with hands and kit inside the image, Sony A1, 50mm, f/2.8, 1/1000, auto ISO. Keep joints, hands, feet, equipment and ground contact credible, with mild real warmth across his skin and damp hair at the temple.",
    "locations": {
      "urban": "an open city-park lawn",
      "outdoorsy": "a meadow near a lodge",
      "homebody": "a broad neighborhood recreation field"
    },
    "backdrops": {
      "urban": "a wide lawn, picnic groups going soft and a tree line",
      "outdoorsy": "long meadow grass, a lodge roof and dark firs",
      "homebody": "a marked pitch, a fence and a row of houses"
    },
    "outfits": {
      "casual": "an ecru tee under a light navy windshirt",
      "sharp": "a black merino roll-neck with grey trousers",
      "street": "a forest track jacket over a bone tee"
    }
  },
  {
    "id": "active-19-b",
    "version": 4,
    "bucket": "active",
    "slot": 19,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He carries a ball loosely under one arm, the other hand swinging free as he walks off. He smiles to the lens. {{backdrop}} sit twenty-five metres beyond him, dropping into soft outdoor depth. His face stays coherent while clothing and extremities keep small real movement. A 3:4 knee-up candid with small natural movement at the edges, friend-taken iPhone 15 Pro burst, 35mm equivalent, standard photo mode. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture.",
    "hobbyPromptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. A friend photographs a quiet moment in {{hobby}}; his hands rest on the equipment while he thinks the next part through. He glances to the lens. Eleven metres behind him the space carries on, softening into plain background tone. His face stays coherent while clothing and extremities keep small real movement. A 3:4 knee-up candid with small natural movement at the edges, friend-taken iPhone 15 Pro burst, 35mm equivalent, standard photo mode. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture.",
    "locations": {
      "urban": "an open city-park lawn",
      "outdoorsy": "a meadow near a lodge",
      "homebody": "a broad neighborhood recreation field"
    },
    "backdrops": {
      "urban": "a wide lawn, picnic groups going soft and a tree line",
      "outdoorsy": "long meadow grass, a lodge roof and dark firs",
      "homebody": "a marked pitch, a fence and a row of houses"
    },
    "outfits": {
      "casual": "a plum training tee with grey trail trousers",
      "sharp": "a plum quarter-zip with dark trousers",
      "street": "a brown fleece half-zip over a black tee"
    }
  },
  {
    "id": "active-19-c",
    "version": 4,
    "bucket": "active",
    "slot": 19,
    "variant": "c",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He stops to pull his sleeves down over his forearms as the air cools. His eyes go across the field, past the lens. The ground runs back ten metres to {{backdrop}}, held just out of focus. Natural contrast and modest depth create a grounded recreational documentary look. A 3:4 knee-up photograph that keeps kit and hands coherent, Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Keep natural posture, accurate equipment, modest skin warmth, real breathing effort, and honest contrast.",
    "hobbyPromptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. Partway through {{hobby}} he wipes his palms on his thighs and takes hold again. He looks up to the lens with an unforced expression. The working area runs thirteen metres back, its surfaces and fittings gently blurred. Natural contrast and modest depth create a grounded recreational documentary look. A 3:4 knee-up photograph that keeps kit and hands coherent, Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Keep natural posture, accurate equipment, modest skin warmth, real breathing effort, and honest contrast.",
    "locations": {
      "urban": "an open city-park lawn",
      "outdoorsy": "a meadow near a lodge",
      "homebody": "a broad neighborhood recreation field"
    },
    "backdrops": {
      "urban": "a wide lawn, picnic groups going soft and a tree line",
      "outdoorsy": "long meadow grass, a lodge roof and dark firs",
      "homebody": "a marked pitch, a fence and a row of houses"
    },
    "outfits": {
      "casual": "a terracotta merino tee with dark joggers",
      "sharp": "an olive softshell over a bone tee",
      "street": "a terracotta windshirt over a cream tee"
    }
  },
  {
    "id": "active-20-a",
    "version": 4,
    "bucket": "active",
    "slot": 20,
    "variant": "a",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He reaches the top of the field and lets both arms hang while the wind moves his hair. He looks out across it, past the lens. Eighteen metres back, {{backdrop}} lose their edges while the ground between stays readable. The fast shutter freezes his face and core movement while daylight keeps colour believable. A 3:4 medium action frame that keeps active joints whole, Sony A1, 50mm, f/2.8, 1/1000, auto ISO. Keep joints, hands, feet, equipment and ground contact credible, with mild real warmth across his skin and damp hair at the temple.",
    "hobbyPromptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At a plausible real-world venue he finishes a round of {{hobby}}, lowering the equipment with both hands. He looks to the lens as he lets it rest. Seventeen metres of venue sit behind him, its depth reading clearly and softly at once. The fast shutter freezes his face and core movement while daylight keeps colour believable. A 3:4 medium action frame that keeps active joints whole, Sony A1, 50mm, f/2.8, 1/1000, auto ISO. Keep joints, hands, feet, equipment and ground contact credible, with mild real warmth across his skin and damp hair at the temple.",
    "locations": {
      "urban": "an open city-park lawn",
      "outdoorsy": "a meadow near a lodge",
      "homebody": "a broad neighborhood recreation field"
    },
    "backdrops": {
      "urban": "park trees, a distant bandstand and open sky",
      "outdoorsy": "wildflowers, a track and a wooded ridge",
      "homebody": "goalposts, a clubhouse and parked cars"
    },
    "outfits": {
      "casual": "a charcoal base layer with olive shorts",
      "sharp": "a mid-brown technical shirt with stone trousers",
      "street": "a navy hooded shell over an oat tee"
    }
  },
  {
    "id": "active-20-b",
    "version": 4,
    "bucket": "active",
    "slot": 20,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He claps the dust off his palms once and pushes his hair back. He turns to the lens as the group breaks up. Fifteen metres behind him, {{backdrop}} blur gently with the movement of the air. His face stays coherent while clothing and extremities keep small real movement. A 3:4 medium snapshot that keeps the face identifiable, friend-taken iPhone 15 Pro burst, 35mm equivalent, standard photo mode. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture.",
    "hobbyPromptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. A friend catches the end of a session of {{hobby}}; he packs one item away with both hands and pauses. He smiles to the lens. The place opens nine metres behind him into a soft, ordinary middle ground. His face stays coherent while clothing and extremities keep small real movement. A 3:4 medium snapshot that keeps the face identifiable, friend-taken iPhone 15 Pro burst, 35mm equivalent, standard photo mode. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture.",
    "locations": {
      "urban": "an open city-park lawn",
      "outdoorsy": "a meadow near a lodge",
      "homebody": "a broad neighborhood recreation field"
    },
    "backdrops": {
      "urban": "park trees, a distant bandstand and open sky",
      "outdoorsy": "wildflowers, a track and a wooded ridge",
      "homebody": "goalposts, a clubhouse and parked cars"
    },
    "outfits": {
      "casual": "a chambray-blue training tee with black trousers",
      "sharp": "a light-blue performance oxford with charcoal trousers",
      "street": "a grey marl hoodie under a stone gilet"
    }
  },
  {
    "id": "active-20-c",
    "version": 4,
    "bucket": "active",
    "slot": 20,
    "variant": "c",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He picks up a water bottle from the grass, straightens with it in one hand, and starts back. He glances to the lens on the way past. Thirty metres out, {{backdrop}} settle into pale distance while his own footing stays sharp. Natural contrast and modest depth create a grounded recreational documentary look. A 3:4 medium portrait taken during the activity, Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Keep natural posture, accurate equipment, modest skin warmth, real breathing effort, and honest contrast.",
    "hobbyPromptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. During {{hobby}} he holds the position his hands are actually in and takes one steady breath. He meets the lens and leaves everything exactly as it was. Behind him the venue recedes nineteen metres, its own furniture softening as it goes. Natural contrast and modest depth create a grounded recreational documentary look. A 3:4 medium portrait taken during the activity, Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Keep natural posture, accurate equipment, modest skin warmth, real breathing effort, and honest contrast.",
    "locations": {
      "urban": "an open city-park lawn",
      "outdoorsy": "a meadow near a lodge",
      "homebody": "a broad neighborhood recreation field"
    },
    "backdrops": {
      "urban": "park trees, a distant bandstand and open sky",
      "outdoorsy": "wildflowers, a track and a wooded ridge",
      "homebody": "goalposts, a clubhouse and parked cars"
    },
    "outfits": {
      "casual": "an indigo long-sleeve with stone shorts",
      "sharp": "a soft-grey merino half-zip with black trousers",
      "street": "a black track jacket over a white tee"
    }
  },
  {
    "id": "street-01-a",
    "version": 4,
    "bucket": "street",
    "slot": 1,
    "variant": "a",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He steps off the kerb with the signal, both hands free and his pace unbroken. He notices the camera across the road and looks up to the lens. Six metres behind him, {{backdrop}} break into soft discs of practical light. Documentary framing keeps street context, natural perspective, and available-light colour. A 9:16 full-body street frame with straight surrounding lines, Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light colour exactly as the street gives it.",
    "locations": {
      "urban": "a calm downtown crosswalk",
      "outdoorsy": "a scenic-town crossing",
      "homebody": "a leafy neighborhood crossing"
    },
    "backdrops": {
      "urban": "signal lights, a lit shopfront and slow-moving traffic",
      "outdoorsy": "a wide main street, mountain dusk and parked pickups",
      "homebody": "street trees, a pillar box and lit front windows"
    },
    "outfits": {
      "casual": "a chocolate corduroy overshirt over a cream tee with dark jeans",
      "sharp": "a stone linen blazer over a black crew-neck tee",
      "street": "a mustard corduroy trucker over a white tee"
    }
  },
  {
    "id": "street-01-b",
    "version": 4,
    "bucket": "street",
    "slot": 1,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He waits at the kerb with his phone already pocketed and one thumb in a jacket pocket. He steps forward as the traffic stops, smiling to the lens. The street runs back nine metres to {{backdrop}}, everything past him going soft and warm. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. A 3:4 waist-up night portrait with available street context, Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Spread grain through shadows and background as well as skin, keeping mixed colour temperature and natural highlights.",
    "locations": {
      "urban": "a calm downtown crosswalk",
      "outdoorsy": "a scenic-town crossing",
      "homebody": "a leafy neighborhood crossing"
    },
    "backdrops": {
      "urban": "signal lights, a lit shopfront and slow-moving traffic",
      "outdoorsy": "a wide main street, mountain dusk and parked pickups",
      "homebody": "street trees, a pillar box and lit front windows"
    },
    "outfits": {
      "casual": "a charcoal hoodie under an open black overshirt",
      "sharp": "a charcoal overcoat over a white tee",
      "street": "a black waxed trucker over a grey tee"
    }
  },
  {
    "id": "street-01-c",
    "version": 4,
    "bucket": "street",
    "slot": 1,
    "variant": "c",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He reaches the far side with a paper bag in one hand and turns at a comment behind him. His eyes go off to the left of the lens as he keeps walking. He stands four metres clear of {{backdrop}}, which fall away into grainy shadow and lit edges. His face freezes cleanly while ambient light and slight background movement stay in the frame. A 9:16 full-body flash snapshot at believable street distance, compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. Flash reveals honest texture, modest shine, fabric creases, and one natural shadow cast behind him.",
    "locations": {
      "urban": "a calm downtown crosswalk",
      "outdoorsy": "a scenic-town crossing",
      "homebody": "a leafy neighborhood crossing"
    },
    "backdrops": {
      "urban": "signal lights, a lit shopfront and slow-moving traffic",
      "outdoorsy": "a wide main street, mountain dusk and parked pickups",
      "homebody": "street trees, a pillar box and lit front windows"
    },
    "outfits": {
      "casual": "a sand waffle henley with washed indigo denim",
      "sharp": "a camel sport coat over a fine navy knit",
      "street": "a sand canvas chore coat over a charcoal tee"
    }
  },
  {
    "id": "street-02-a",
    "version": 4,
    "bucket": "street",
    "slot": 2,
    "variant": "a",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. A gust catches his jacket mid-crossing, so he settles the collar back down with one hand. He keeps moving toward the lens. {{backdrop}} sit twelve metres back, their lamps and signs blooming gently out of focus. Documentary framing keeps street context, natural perspective, and available-light colour. A 3:4 knee-up documentary frame from across the road, Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light colour exactly as the street gives it.",
    "locations": {
      "urban": "a calm downtown crosswalk",
      "outdoorsy": "a scenic-town crossing",
      "homebody": "a leafy neighborhood crossing"
    },
    "backdrops": {
      "urban": "zebra stripes, a bus flank and neon spill",
      "outdoorsy": "a general store, timber verandas and a dark ridge",
      "homebody": "a school railing, hedges and a quiet junction"
    },
    "outfits": {
      "casual": "an olive flannel over a grey tee with black jeans",
      "sharp": "a bottle-green wool overshirt over a white oxford",
      "street": "an indigo denim jacket over a cream tee"
    }
  },
  {
    "id": "street-02-b",
    "version": 4,
    "bucket": "street",
    "slot": 2,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He steps out of the sheltered corner into the wind and closes the front of his coat with one hand. He looks down the street, past the lens. Fifteen metres beyond him, {{backdrop}} smear into slow ambient movement. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. A 3:4 three-quarter portrait through a little foreground light, Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Spread grain through shadows and background as well as skin, keeping mixed colour temperature and natural highlights.",
    "locations": {
      "urban": "a calm downtown crosswalk",
      "outdoorsy": "a scenic-town crossing",
      "homebody": "a leafy neighborhood crossing"
    },
    "backdrops": {
      "urban": "zebra stripes, a bus flank and neon spill",
      "outdoorsy": "a general store, timber verandas and a dark ridge",
      "homebody": "a school railing, hedges and a quiet junction"
    },
    "outfits": {
      "casual": "a cream heavyweight tee under a slate overshirt",
      "sharp": "a black band-collar shirt with dark trousers",
      "street": "a rust bomber over a black tee"
    }
  },
  {
    "id": "street-02-c",
    "version": 4,
    "bucket": "street",
    "slot": 2,
    "variant": "c",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He rounds the corner, frees one hand from a pocket to steady the jacket, and laughs at the weather. He looks to the lens through it. Twenty metres out, {{backdrop}} reduce to shape and glow while the pavement near him stays sharp. His face freezes cleanly while ambient light and slight background movement stay in the frame. A 3:4 knee-up flash photograph with a clean shadow behind him, compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. Flash reveals honest texture, modest shine, fabric creases, and one natural shadow cast behind him.",
    "locations": {
      "urban": "a calm downtown crosswalk",
      "outdoorsy": "a scenic-town crossing",
      "homebody": "a leafy neighborhood crossing"
    },
    "backdrops": {
      "urban": "zebra stripes, a bus flank and neon spill",
      "outdoorsy": "a general store, timber verandas and a dark ridge",
      "homebody": "a school railing, hedges and a quiet junction"
    },
    "outfits": {
      "casual": "a rust knit polo with dark denim",
      "sharp": "a burgundy fine-knit under a grey wool jacket",
      "street": "a cream boxy overshirt over a washed-black tee"
    }
  },
  {
    "id": "street-03-a",
    "version": 4,
    "bucket": "street",
    "slot": 3,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He waits on the kerb with both hands in his pockets, rocking forward as the lights change. He glances to the lens before stepping out. The street runs back nine metres to {{backdrop}}, everything past him going soft and warm. Documentary framing keeps street context, natural perspective, and available-light colour. A 4:3 environmental portrait with reflections kept secondary, Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light colour exactly as the street gives it.",
    "locations": {
      "urban": "a calm downtown crosswalk",
      "outdoorsy": "a scenic-town crossing",
      "homebody": "a leafy neighborhood crossing"
    },
    "backdrops": {
      "urban": "a kerb, headlights and a bright corner unit",
      "outdoorsy": "a crossing sign, gravel verges and pine shadow",
      "homebody": "a garden wall, a lamp post and low roofs"
    },
    "outfits": {
      "casual": "a forest-green sweatshirt with stone-grey jeans",
      "sharp": "a light-grey blazer over an ink-blue tee",
      "street": "a forest coach jacket over an oat tee"
    }
  },
  {
    "id": "street-03-b",
    "version": 4,
    "bucket": "street",
    "slot": 3,
    "variant": "b",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He watches the last car clear, one hand adjusting a bag strap on his shoulder. He turns to the lens for a beat and begins crossing. He stands four metres clear of {{backdrop}}, which fall away into grainy shadow and lit edges. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. A 9:16 full-body night photograph with the face still readable, Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Spread grain through shadows and background as well as skin, keeping mixed colour temperature and natural highlights.",
    "locations": {
      "urban": "a calm downtown crosswalk",
      "outdoorsy": "a scenic-town crossing",
      "homebody": "a leafy neighborhood crossing"
    },
    "backdrops": {
      "urban": "a kerb, headlights and a bright corner unit",
      "outdoorsy": "a crossing sign, gravel verges and pine shadow",
      "homebody": "a garden wall, a lamp post and low roofs"
    },
    "outfits": {
      "casual": "an oat brushed-cotton shirt over a white tee",
      "sharp": "a rust silk-blend shirt with charcoal trousers",
      "street": "a slate windbreaker over a white tee"
    }
  },
  {
    "id": "street-03-c",
    "version": 4,
    "bucket": "street",
    "slot": 3,
    "variant": "c",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He reaches the corner early and slows into an easy stop, hands loose. He smiles off to the right of the lens at whoever he is meeting. Six metres behind him, {{backdrop}} break into soft discs of practical light. His face freezes cleanly while ambient light and slight background movement stay in the frame. A 3:4 waist-up compact-camera frame at direct eye level, compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. Flash reveals honest texture, modest shine, fabric creases, and one natural shadow cast behind him.",
    "locations": {
      "urban": "a calm downtown crosswalk",
      "outdoorsy": "a scenic-town crossing",
      "homebody": "a leafy neighborhood crossing"
    },
    "backdrops": {
      "urban": "a kerb, headlights and a bright corner unit",
      "outdoorsy": "a crossing sign, gravel verges and pine shadow",
      "homebody": "a garden wall, a lamp post and low roofs"
    },
    "outfits": {
      "casual": "a burgundy waffle henley with black jeans",
      "sharp": "a cream shawl-collar knit with dark trousers",
      "street": "a burgundy varsity jacket over a heather tee"
    }
  },
  {
    "id": "street-04-a",
    "version": 4,
    "bucket": "street",
    "slot": 4,
    "variant": "a",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He walks the glazed frontage with a coffee held low in one hand. He looks to the lens as he draws level. Fifteen metres beyond him, {{backdrop}} smear into slow ambient movement. Documentary framing keeps street context, natural perspective, and available-light colour. A 3:4 waist-up frame from an ordinary pedestrian distance, Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light colour exactly as the street gives it.",
    "locations": {
      "urban": "a glass-and-stone city sidewalk",
      "outdoorsy": "a breezy trail-town street",
      "homebody": "a residential high street"
    },
    "backdrops": {
      "urban": "a glazed frontage, sky reflection and passing figures",
      "outdoorsy": "an outfitter window, a bike rack and open hills",
      "homebody": "a bakery front, an awning and parked cars"
    },
    "outfits": {
      "casual": "a bone tee under an open chambray shirt",
      "sharp": "a taupe field coat over a black roll-neck",
      "street": "a stone utility overshirt over a black tee"
    }
  },
  {
    "id": "street-04-b",
    "version": 4,
    "bucket": "street",
    "slot": 4,
    "variant": "b",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He stops at the glass, one palm resting on it, to look at something inside. His attention stays through the window, past the lens. Twenty metres out, {{backdrop}} reduce to shape and glow while the pavement near him stays sharp. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. A 3:4 chest-up portrait with mixed light falling across the face, Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Spread grain through shadows and background as well as skin, keeping mixed colour temperature and natural highlights.",
    "locations": {
      "urban": "a glass-and-stone city sidewalk",
      "outdoorsy": "a breezy trail-town street",
      "homebody": "a residential high street"
    },
    "backdrops": {
      "urban": "a glazed frontage, sky reflection and passing figures",
      "outdoorsy": "an outfitter window, a bike rack and open hills",
      "homebody": "a bakery front, an awning and parked cars"
    },
    "outfits": {
      "casual": "a teal crewneck with dark denim",
      "sharp": "an olive blazer over a sand knit",
      "street": "a brown suede trucker over a bone tee"
    }
  },
  {
    "id": "street-04-c",
    "version": 4,
    "bucket": "street",
    "slot": 4,
    "variant": "c",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He steps aside to let two people past, one hand raised briefly in apology. He turns back to the lens with a small smile. {{backdrop}} sit twelve metres back, their lamps and signs blooming gently out of focus. His face freezes cleanly while ambient light and slight background movement stay in the frame. A 3:4 three-quarter snapshot with slight ambient movement behind him, compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. Flash reveals honest texture, modest shine, fabric creases, and one natural shadow cast behind him.",
    "locations": {
      "urban": "a glass-and-stone city sidewalk",
      "outdoorsy": "a breezy trail-town street",
      "homebody": "a residential high street"
    },
    "backdrops": {
      "urban": "a glazed frontage, sky reflection and passing figures",
      "outdoorsy": "an outfitter window, a bike rack and open hills",
      "homebody": "a bakery front, an awning and parked cars"
    },
    "outfits": {
      "casual": "a mustard corduroy shirt with charcoal jeans",
      "sharp": "a slate merino roll-neck with charcoal trousers",
      "street": "a charcoal hoodie under a black leather-trim jacket"
    }
  },
  {
    "id": "street-05-a",
    "version": 4,
    "bucket": "street",
    "slot": 5,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He walks the pavement at a brisk ordinary pace and clears windblown hair from his eyes with one hand. He looks to the lens as it settles. He stands four metres clear of {{backdrop}}, which fall away into grainy shadow and lit edges. Documentary framing keeps street context, natural perspective, and available-light colour. A 4:3 three-quarter frame that keeps pavement and storefront context, Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light colour exactly as the street gives it.",
    "locations": {
      "urban": "a glass-and-stone city sidewalk",
      "outdoorsy": "a breezy trail-town street",
      "homebody": "a residential high street"
    },
    "backdrops": {
      "urban": "a stone plinth, revolving doors and a lit lobby",
      "outdoorsy": "a timber shopfront, flapping flags and a bare slope",
      "homebody": "a launderette, a bin store and terraced houses"
    },
    "outfits": {
      "casual": "a plum merino crewneck with washed-black denim",
      "sharp": "a tobacco suede blazer over a white shirt",
      "street": "an olive field jacket over a white tee"
    }
  },
  {
    "id": "street-05-b",
    "version": 4,
    "bucket": "street",
    "slot": 5,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He slows to let a cyclist through, one hand out to steady himself, then picks his pace back up. He smiles off to his left of the lens. Six metres behind him, {{backdrop}} break into soft discs of practical light. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. A 3:4 knee-up photograph with background lights softly present, Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Spread grain through shadows and background as well as skin, keeping mixed colour temperature and natural highlights.",
    "locations": {
      "urban": "a glass-and-stone city sidewalk",
      "outdoorsy": "a breezy trail-town street",
      "homebody": "a residential high street"
    },
    "backdrops": {
      "urban": "a stone plinth, revolving doors and a lit lobby",
      "outdoorsy": "a timber shopfront, flapping flags and a bare slope",
      "homebody": "a launderette, a bin store and terraced houses"
    },
    "outfits": {
      "casual": "a stone linen overshirt over a heather tee",
      "sharp": "a navy peacoat over a cream crewneck",
      "street": "an ecru linen overshirt over a grey tee"
    }
  },
  {
    "id": "street-05-c",
    "version": 4,
    "bucket": "street",
    "slot": 5,
    "variant": "c",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He leaves the shopfronts with one hand in a pocket, notices the camera waiting, and changes his line toward it. He holds the lens as he comes. The street runs back nine metres to {{backdrop}}, everything past him going soft and warm. His face freezes cleanly while ambient light and slight background movement stay in the frame. A 3:4 medium flash frame with ordinary edge falloff, compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. Flash reveals honest texture, modest shine, fabric creases, and one natural shadow cast behind him.",
    "locations": {
      "urban": "a glass-and-stone city sidewalk",
      "outdoorsy": "a breezy trail-town street",
      "homebody": "a residential high street"
    },
    "backdrops": {
      "urban": "a stone plinth, revolving doors and a lit lobby",
      "outdoorsy": "a timber shopfront, flapping flags and a bare slope",
      "homebody": "a launderette, a bin store and terraced houses"
    },
    "outfits": {
      "casual": "an ecru cable knit with indigo jeans",
      "sharp": "a plum knit polo with grey trousers",
      "street": "a teal coach jacket over a cream tee"
    }
  },
  {
    "id": "street-06-a",
    "version": 4,
    "bucket": "street",
    "slot": 6,
    "variant": "a",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He waits under the awning with a bag hooked over one wrist while the shower passes. He watches the street, off past the lens. Twenty metres out, {{backdrop}} reduce to shape and glow while the pavement near him stays sharp. Documentary framing keeps street context, natural perspective, and available-light colour. A 9:16 full-body street frame with straight surrounding lines, Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light colour exactly as the street gives it.",
    "locations": {
      "urban": "a glass-and-stone city sidewalk",
      "outdoorsy": "a breezy trail-town street",
      "homebody": "a residential high street"
    },
    "backdrops": {
      "urban": "a mirrored column, escalator light and blurred commuters",
      "outdoorsy": "a coffee hut, a trail map and moving cloud",
      "homebody": "a barber's pole, a postbox and low walls"
    },
    "outfits": {
      "casual": "a terracotta long-sleeve tee with dark chinos",
      "sharp": "a mid-brown corduroy blazer over an ecru tee",
      "street": "a chocolate shearling-collar trucker over a black tee"
    }
  },
  {
    "id": "street-06-b",
    "version": 4,
    "bucket": "street",
    "slot": 6,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He shakes a few drops from one sleeve and pushes both hands back into his pockets. He looks to the lens as he steps out. {{backdrop}} sit twelve metres back, their lamps and signs blooming gently out of focus. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. A 3:4 waist-up night portrait with available street context, Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Spread grain through shadows and background as well as skin, keeping mixed colour temperature and natural highlights.",
    "locations": {
      "urban": "a glass-and-stone city sidewalk",
      "outdoorsy": "a breezy trail-town street",
      "homebody": "a residential high street"
    },
    "backdrops": {
      "urban": "a mirrored column, escalator light and blurred commuters",
      "outdoorsy": "a coffee hut, a trail map and moving cloud",
      "homebody": "a barber's pole, a postbox and low walls"
    },
    "outfits": {
      "casual": "a grey marl henley with black denim",
      "sharp": "a chalk-striped grey jacket over a black tee",
      "street": "a terracotta hooded overshirt over a white tee"
    }
  },
  {
    "id": "street-06-c",
    "version": 4,
    "bucket": "street",
    "slot": 6,
    "variant": "c",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He moves from one covered doorway to the next, shoulders naturally drawn in, one hand holding his collar. He looks to the lens on the way. Fifteen metres beyond him, {{backdrop}} smear into slow ambient movement. His face freezes cleanly while ambient light and slight background movement stay in the frame. A 9:16 full-body flash snapshot at believable street distance, compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. Flash reveals honest texture, modest shine, fabric creases, and one natural shadow cast behind him.",
    "locations": {
      "urban": "a glass-and-stone city sidewalk",
      "outdoorsy": "a breezy trail-town street",
      "homebody": "a residential high street"
    },
    "backdrops": {
      "urban": "a mirrored column, escalator light and blurred commuters",
      "outdoorsy": "a coffee hut, a trail map and moving cloud",
      "homebody": "a barber's pole, a postbox and low walls"
    },
    "outfits": {
      "casual": "an indigo overshirt over a washed white tee",
      "sharp": "a forest velvet-trim jacket over a white tee",
      "street": "a navy bomber over an oat tee"
    }
  },
  {
    "id": "street-07-a",
    "version": 4,
    "bucket": "street",
    "slot": 7,
    "variant": "a",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He waits beside the shelter glass with one forearm resting on its edge, watching the route display. He turns to the lens when it updates. Six metres behind him, {{backdrop}} break into soft discs of practical light. Documentary framing keeps street context, natural perspective, and available-light colour. A 3:4 knee-up documentary frame from across the road, Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light colour exactly as the street gives it.",
    "locations": {
      "urban": "a clean tram shelter",
      "outdoorsy": "a timber shuttle shelter",
      "homebody": "a neighborhood bus shelter"
    },
    "backdrops": {
      "urban": "shelter glass, a route map and a lit tram approaching",
      "outdoorsy": "timber posts, a hand-painted timetable and dark firs",
      "homebody": "a shelter panel, an advert light and a quiet road"
    },
    "outfits": {
      "casual": "a black waffle henley with faded jeans",
      "sharp": "a soft-grey topcoat over a bone knit",
      "street": "a grey marl hoodie under a stone chore jacket"
    }
  },
  {
    "id": "street-07-b",
    "version": 4,
    "bucket": "street",
    "slot": 7,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He steps aside for another passenger, one hand on the shelter frame, then settles back. His eyes go up the road, past the lens. The street runs back nine metres to {{backdrop}}, everything past him going soft and warm. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. A 3:4 three-quarter portrait through a little foreground light, Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Spread grain through shadows and background as well as skin, keeping mixed colour temperature and natural highlights.",
    "locations": {
      "urban": "a clean tram shelter",
      "outdoorsy": "a timber shuttle shelter",
      "homebody": "a neighborhood bus shelter"
    },
    "backdrops": {
      "urban": "shelter glass, a route map and a lit tram approaching",
      "outdoorsy": "timber posts, a hand-painted timetable and dark firs",
      "homebody": "a shelter panel, an advert light and a quiet road"
    },
    "outfits": {
      "casual": "a slate-blue flannel over a cream tee",
      "sharp": "an ink-blue overshirt over a charcoal knit",
      "street": "a black quilted jacket over a cream tee"
    }
  },
  {
    "id": "street-07-c",
    "version": 4,
    "bucket": "street",
    "slot": 7,
    "variant": "c",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He spots the approaching service, folds a ticket into one hand, and pockets it. He looks to the lens before it arrives. He stands four metres clear of {{backdrop}}, which fall away into grainy shadow and lit edges. His face freezes cleanly while ambient light and slight background movement stay in the frame. A 3:4 knee-up flash photograph with a clean shadow behind him, compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. Flash reveals honest texture, modest shine, fabric creases, and one natural shadow cast behind him.",
    "locations": {
      "urban": "a clean tram shelter",
      "outdoorsy": "a timber shuttle shelter",
      "homebody": "a neighborhood bus shelter"
    },
    "backdrops": {
      "urban": "shelter glass, a route map and a lit tram approaching",
      "outdoorsy": "timber posts, a hand-painted timetable and dark firs",
      "homebody": "a shelter panel, an advert light and a quiet road"
    },
    "outfits": {
      "casual": "a chocolate corduroy overshirt over a cream tee with dark jeans",
      "sharp": "a stone linen blazer over a black crew-neck tee",
      "street": "a mustard corduroy trucker over a white tee"
    }
  },
  {
    "id": "street-08-a",
    "version": 4,
    "bucket": "street",
    "slot": 8,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He sits on the shelter bench with both forearms on his knees and a bag between his feet. He looks up to the lens as the conversation carries on. {{backdrop}} sit twelve metres back, their lamps and signs blooming gently out of focus. Documentary framing keeps street context, natural perspective, and available-light colour. A 4:3 environmental portrait with reflections kept secondary, Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light colour exactly as the street gives it.",
    "locations": {
      "urban": "a clean tram shelter",
      "outdoorsy": "a timber shuttle shelter",
      "homebody": "a neighborhood bus shelter"
    },
    "backdrops": {
      "urban": "rails set into the street, overhead wires and shopfronts",
      "outdoorsy": "a gravel turning circle, a minibus and a wooded bank",
      "homebody": "a bus flag, a hedge and semi-detached houses"
    },
    "outfits": {
      "casual": "a charcoal hoodie under an open black overshirt",
      "sharp": "a charcoal overcoat over a white tee",
      "street": "a black waxed trucker over a grey tee"
    }
  },
  {
    "id": "street-08-b",
    "version": 4,
    "bucket": "street",
    "slot": 8,
    "variant": "b",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He checks the printed timetable with a finger on the line he wants. His attention stays on the board, past the lens. Fifteen metres beyond him, {{backdrop}} smear into slow ambient movement. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. A 9:16 full-body night photograph with the face still readable, Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Spread grain through shadows and background as well as skin, keeping mixed colour temperature and natural highlights.",
    "locations": {
      "urban": "a clean tram shelter",
      "outdoorsy": "a timber shuttle shelter",
      "homebody": "a neighborhood bus shelter"
    },
    "backdrops": {
      "urban": "rails set into the street, overhead wires and shopfronts",
      "outdoorsy": "a gravel turning circle, a minibus and a wooded bank",
      "homebody": "a bus flag, a hedge and semi-detached houses"
    },
    "outfits": {
      "casual": "a sand waffle henley with washed indigo denim",
      "sharp": "a camel sport coat over a fine navy knit",
      "street": "a sand canvas chore coat over a charcoal tee"
    }
  },
  {
    "id": "street-08-c",
    "version": 4,
    "bucket": "street",
    "slot": 8,
    "variant": "c",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He stands from the bench, hooks a bag over one shoulder with his free hand, and steps to the kerb edge. He glances to the lens. Twenty metres out, {{backdrop}} reduce to shape and glow while the pavement near him stays sharp. His face freezes cleanly while ambient light and slight background movement stay in the frame. A 3:4 waist-up compact-camera frame at direct eye level, compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. Flash reveals honest texture, modest shine, fabric creases, and one natural shadow cast behind him.",
    "locations": {
      "urban": "a clean tram shelter",
      "outdoorsy": "a timber shuttle shelter",
      "homebody": "a neighborhood bus shelter"
    },
    "backdrops": {
      "urban": "rails set into the street, overhead wires and shopfronts",
      "outdoorsy": "a gravel turning circle, a minibus and a wooded bank",
      "homebody": "a bus flag, a hedge and semi-detached houses"
    },
    "outfits": {
      "casual": "an olive flannel over a grey tee with black jeans",
      "sharp": "a bottle-green wool overshirt over a white oxford",
      "street": "an indigo denim jacket over a cream tee"
    }
  },
  {
    "id": "street-09-a",
    "version": 4,
    "bucket": "street",
    "slot": 9,
    "variant": "a",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He leans on the shelter's upright with headphones resting around his neck and one hand on the strap of his bag. He turns to the lens. The street runs back nine metres to {{backdrop}}, everything past him going soft and warm. Documentary framing keeps street context, natural perspective, and available-light colour. A 3:4 waist-up frame from an ordinary pedestrian distance, Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light colour exactly as the street gives it.",
    "locations": {
      "urban": "a clean tram shelter",
      "outdoorsy": "a timber shuttle shelter",
      "homebody": "a neighborhood bus shelter"
    },
    "backdrops": {
      "urban": "a platform edge, ticket machine glow and passing cars",
      "outdoorsy": "a log bench, a noticeboard and mountain dark",
      "homebody": "a kerbside puddle, a lamp post and lit windows"
    },
    "outfits": {
      "casual": "a cream heavyweight tee under a slate overshirt",
      "sharp": "a black band-collar shirt with dark trousers",
      "street": "a rust bomber over a black tee"
    }
  },
  {
    "id": "street-09-b",
    "version": 4,
    "bucket": "street",
    "slot": 9,
    "variant": "b",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He takes one earbud out before the conversation starts and closes it into his palm. He looks up to the lens attentively. He stands four metres clear of {{backdrop}}, which fall away into grainy shadow and lit edges. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. A 3:4 chest-up portrait with mixed light falling across the face, Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Spread grain through shadows and background as well as skin, keeping mixed colour temperature and natural highlights.",
    "locations": {
      "urban": "a clean tram shelter",
      "outdoorsy": "a timber shuttle shelter",
      "homebody": "a neighborhood bus shelter"
    },
    "backdrops": {
      "urban": "a platform edge, ticket machine glow and passing cars",
      "outdoorsy": "a log bench, a noticeboard and mountain dark",
      "homebody": "a kerbside puddle, a lamp post and lit windows"
    },
    "outfits": {
      "casual": "a rust knit polo with dark denim",
      "sharp": "a burgundy fine-knit under a grey wool jacket",
      "street": "a cream boxy overshirt over a washed-black tee"
    }
  },
  {
    "id": "street-09-c",
    "version": 4,
    "bucket": "street",
    "slot": 9,
    "variant": "c",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He shifts along the bench to make space, resting both hands beside him. He smiles at the passing street, off to the right of the lens. Six metres behind him, {{backdrop}} break into soft discs of practical light. His face freezes cleanly while ambient light and slight background movement stay in the frame. A 3:4 three-quarter snapshot with slight ambient movement behind him, compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. Flash reveals honest texture, modest shine, fabric creases, and one natural shadow cast behind him.",
    "locations": {
      "urban": "a clean tram shelter",
      "outdoorsy": "a timber shuttle shelter",
      "homebody": "a neighborhood bus shelter"
    },
    "backdrops": {
      "urban": "a platform edge, ticket machine glow and passing cars",
      "outdoorsy": "a log bench, a noticeboard and mountain dark",
      "homebody": "a kerbside puddle, a lamp post and lit windows"
    },
    "outfits": {
      "casual": "a forest-green sweatshirt with stone-grey jeans",
      "sharp": "a light-grey blazer over an ink-blue tee",
      "street": "a forest coach jacket over an oat tee"
    }
  },
  {
    "id": "street-10-a",
    "version": 4,
    "bucket": "street",
    "slot": 10,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He sits on the broad step to retie one sneaker, pulling the knot firm with both hands. He looks up to the lens before standing. Fifteen metres beyond him, {{backdrop}} smear into slow ambient movement. Documentary framing keeps street context, natural perspective, and available-light colour. A 4:3 three-quarter frame that keeps pavement and storefront context, Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light colour exactly as the street gives it.",
    "locations": {
      "urban": "a broad civic-building step",
      "outdoorsy": "a visitor-center stair",
      "homebody": "a low brownstone step"
    },
    "backdrops": {
      "urban": "stone columns, a lit portico and a wide plaza",
      "outdoorsy": "timber decking, an interpretive board and dark trees",
      "homebody": "a painted front door, iron railings and a street lamp"
    },
    "outfits": {
      "casual": "an oat brushed-cotton shirt over a white tee",
      "sharp": "a rust silk-blend shirt with charcoal trousers",
      "street": "a slate windbreaker over a white tee"
    }
  },
  {
    "id": "street-10-b",
    "version": 4,
    "bucket": "street",
    "slot": 10,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He rests on the step after walking with both palms flat beside him. He reacts to something the photographer says, eyes to the lens. Twenty metres out, {{backdrop}} reduce to shape and glow while the pavement near him stays sharp. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. A 3:4 knee-up photograph with background lights softly present, Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Spread grain through shadows and background as well as skin, keeping mixed colour temperature and natural highlights.",
    "locations": {
      "urban": "a broad civic-building step",
      "outdoorsy": "a visitor-center stair",
      "homebody": "a low brownstone step"
    },
    "backdrops": {
      "urban": "stone columns, a lit portico and a wide plaza",
      "outdoorsy": "timber decking, an interpretive board and dark trees",
      "homebody": "a painted front door, iron railings and a street lamp"
    },
    "outfits": {
      "casual": "a burgundy waffle henley with black jeans",
      "sharp": "a cream shawl-collar knit with dark trousers",
      "street": "a burgundy varsity jacket over a heather tee"
    }
  },
  {
    "id": "street-10-c",
    "version": 4,
    "bucket": "street",
    "slot": 10,
    "variant": "c",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He moves along the step for somebody coming down, one hand braced. He turns back toward the conversation, past the lens. {{backdrop}} sit twelve metres back, their lamps and signs blooming gently out of focus. His face freezes cleanly while ambient light and slight background movement stay in the frame. A 3:4 medium flash frame with ordinary edge falloff, compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. Flash reveals honest texture, modest shine, fabric creases, and one natural shadow cast behind him.",
    "locations": {
      "urban": "a broad civic-building step",
      "outdoorsy": "a visitor-center stair",
      "homebody": "a low brownstone step"
    },
    "backdrops": {
      "urban": "stone columns, a lit portico and a wide plaza",
      "outdoorsy": "timber decking, an interpretive board and dark trees",
      "homebody": "a painted front door, iron railings and a street lamp"
    },
    "outfits": {
      "casual": "a bone tee under an open chambray shirt",
      "sharp": "a taupe field coat over a black roll-neck",
      "street": "a stone utility overshirt over a black tee"
    }
  },
  {
    "id": "street-11-a",
    "version": 4,
    "bucket": "street",
    "slot": 11,
    "variant": "a",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He comes down the steps two at a time with one hand skimming the rail. He looks to the lens as he reaches the bottom. He stands four metres clear of {{backdrop}}, which fall away into grainy shadow and lit edges. Documentary framing keeps street context, natural perspective, and available-light colour. A 9:16 full-body street frame with straight surrounding lines, Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light colour exactly as the street gives it.",
    "locations": {
      "urban": "a broad civic-building step",
      "outdoorsy": "a visitor-center stair",
      "homebody": "a low brownstone step"
    },
    "backdrops": {
      "urban": "civic steps falling to the pavement and passing traffic",
      "outdoorsy": "a ramped stair, a gravel path and a valley beyond",
      "homebody": "a stoop rail, bin bags and a row of houses"
    },
    "outfits": {
      "casual": "a teal crewneck with dark denim",
      "sharp": "an olive blazer over a sand knit",
      "street": "a brown suede trucker over a bone tee"
    }
  },
  {
    "id": "street-11-b",
    "version": 4,
    "bucket": "street",
    "slot": 11,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He stops halfway down to answer something, one hand still on the handrail. He holds the lens while he replies. Six metres behind him, {{backdrop}} break into soft discs of practical light. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. A 3:4 waist-up night portrait with available street context, Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Spread grain through shadows and background as well as skin, keeping mixed colour temperature and natural highlights.",
    "locations": {
      "urban": "a broad civic-building step",
      "outdoorsy": "a visitor-center stair",
      "homebody": "a low brownstone step"
    },
    "backdrops": {
      "urban": "civic steps falling to the pavement and passing traffic",
      "outdoorsy": "a ramped stair, a gravel path and a valley beyond",
      "homebody": "a stoop rail, bin bags and a row of houses"
    },
    "outfits": {
      "casual": "a mustard corduroy shirt with charcoal jeans",
      "sharp": "a slate merino roll-neck with charcoal trousers",
      "street": "a charcoal hoodie under a black leather-trim jacket"
    }
  },
  {
    "id": "street-11-c",
    "version": 4,
    "bucket": "street",
    "slot": 11,
    "variant": "c",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He waits at the top with a jacket over one forearm, scanning the pavement below. His eyes stay down there, past the lens. The street runs back nine metres to {{backdrop}}, everything past him going soft and warm. His face freezes cleanly while ambient light and slight background movement stay in the frame. A 9:16 full-body flash snapshot at believable street distance, compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. Flash reveals honest texture, modest shine, fabric creases, and one natural shadow cast behind him.",
    "locations": {
      "urban": "a broad civic-building step",
      "outdoorsy": "a visitor-center stair",
      "homebody": "a low brownstone step"
    },
    "backdrops": {
      "urban": "civic steps falling to the pavement and passing traffic",
      "outdoorsy": "a ramped stair, a gravel path and a valley beyond",
      "homebody": "a stoop rail, bin bags and a row of houses"
    },
    "outfits": {
      "casual": "a plum merino crewneck with washed-black denim",
      "sharp": "a tobacco suede blazer over a white shirt",
      "street": "an olive field jacket over a white tee"
    }
  },
  {
    "id": "street-12-a",
    "version": 4,
    "bucket": "street",
    "slot": 12,
    "variant": "a",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He reaches the door and checks a jacket pocket for the keys with one hand until he finds them. He looks back to the lens with mild relief. Twenty metres out, {{backdrop}} reduce to shape and glow while the pavement near him stays sharp. Documentary framing keeps street context, natural perspective, and available-light colour. A 3:4 knee-up documentary frame from across the road, Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light colour exactly as the street gives it.",
    "locations": {
      "urban": "a broad civic-building step",
      "outdoorsy": "a visitor-center stair",
      "homebody": "a low brownstone step"
    },
    "backdrops": {
      "urban": "brass handrails, banner poles and a bright entrance",
      "outdoorsy": "a viewing platform, a boot scraper and a wooded slope",
      "homebody": "a basement gate, a bicycle and lit sash windows"
    },
    "outfits": {
      "casual": "a stone linen overshirt over a heather tee",
      "sharp": "a navy peacoat over a cream crewneck",
      "street": "an ecru linen overshirt over a grey tee"
    }
  },
  {
    "id": "street-12-b",
    "version": 4,
    "bucket": "street",
    "slot": 12,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He holds the key to the lock between finger and thumb and pauses when somebody speaks. He turns to the lens with an amused expression. {{backdrop}} sit twelve metres back, their lamps and signs blooming gently out of focus. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. A 3:4 three-quarter portrait through a little foreground light, Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Spread grain through shadows and background as well as skin, keeping mixed colour temperature and natural highlights.",
    "locations": {
      "urban": "a broad civic-building step",
      "outdoorsy": "a visitor-center stair",
      "homebody": "a low brownstone step"
    },
    "backdrops": {
      "urban": "brass handrails, banner poles and a bright entrance",
      "outdoorsy": "a viewing platform, a boot scraper and a wooded slope",
      "homebody": "a basement gate, a bicycle and lit sash windows"
    },
    "outfits": {
      "casual": "an ecru cable knit with indigo jeans",
      "sharp": "a plum knit polo with grey trousers",
      "street": "a teal coach jacket over a cream tee"
    }
  },
  {
    "id": "street-12-c",
    "version": 4,
    "bucket": "street",
    "slot": 12,
    "variant": "c",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He steps under the doorway light and shifts a small bag into his other hand to free the first. His attention stays on the lock, past the lens. Fifteen metres beyond him, {{backdrop}} smear into slow ambient movement. His face freezes cleanly while ambient light and slight background movement stay in the frame. A 3:4 knee-up flash photograph with a clean shadow behind him, compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. Flash reveals honest texture, modest shine, fabric creases, and one natural shadow cast behind him.",
    "locations": {
      "urban": "a broad civic-building step",
      "outdoorsy": "a visitor-center stair",
      "homebody": "a low brownstone step"
    },
    "backdrops": {
      "urban": "brass handrails, banner poles and a bright entrance",
      "outdoorsy": "a viewing platform, a boot scraper and a wooded slope",
      "homebody": "a basement gate, a bicycle and lit sash windows"
    },
    "outfits": {
      "casual": "a terracotta long-sleeve tee with dark chinos",
      "sharp": "a mid-brown corduroy blazer over an ecru tee",
      "street": "a chocolate shearling-collar trucker over a black tee"
    }
  },
  {
    "id": "street-13-a",
    "version": 4,
    "bucket": "street",
    "slot": 13,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He crosses the open paving at an ordinary pace with both hands in his pockets. He turns his head to the lens as he passes. Six metres behind him, {{backdrop}} break into soft discs of practical light. Documentary framing keeps street context, natural perspective, and available-light colour. A 4:3 environmental portrait with reflections kept secondary, Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light colour exactly as the street gives it.",
    "locations": {
      "urban": "a modern pedestrian plaza",
      "outdoorsy": "a small-town market square",
      "homebody": "a neighborhood shopping lane"
    },
    "backdrops": {
      "urban": "a paved expanse, a lit sculpture and glass towers",
      "outdoorsy": "a market cross, stall frames and low stone buildings",
      "homebody": "shop awnings, a bike rack and hanging baskets"
    },
    "outfits": {
      "casual": "a grey marl henley with black denim",
      "sharp": "a chalk-striped grey jacket over a black tee",
      "street": "a terracotta hooded overshirt over a white tee"
    }
  },
  {
    "id": "street-13-b",
    "version": 4,
    "bucket": "street",
    "slot": 13,
    "variant": "b",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He pauses to point out one detail across the square, then lets his hand fall. His eyes follow where he pointed, past the lens. The street runs back nine metres to {{backdrop}}, everything past him going soft and warm. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. A 9:16 full-body night photograph with the face still readable, Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Spread grain through shadows and background as well as skin, keeping mixed colour temperature and natural highlights.",
    "locations": {
      "urban": "a modern pedestrian plaza",
      "outdoorsy": "a small-town market square",
      "homebody": "a neighborhood shopping lane"
    },
    "backdrops": {
      "urban": "a paved expanse, a lit sculpture and glass towers",
      "outdoorsy": "a market cross, stall frames and low stone buildings",
      "homebody": "shop awnings, a bike rack and hanging baskets"
    },
    "outfits": {
      "casual": "an indigo overshirt over a washed white tee",
      "sharp": "a forest velvet-trim jacket over a white tee",
      "street": "a navy bomber over an oat tee"
    }
  },
  {
    "id": "street-13-c",
    "version": 4,
    "bucket": "street",
    "slot": 13,
    "variant": "c",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He catches a faint reflection in a window, one hand on the glass surround, and looks for the real thing. He smiles to the lens at the coincidence. He stands four metres clear of {{backdrop}}, which fall away into grainy shadow and lit edges. His face freezes cleanly while ambient light and slight background movement stay in the frame. A 3:4 waist-up compact-camera frame at direct eye level, compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. Flash reveals honest texture, modest shine, fabric creases, and one natural shadow cast behind him.",
    "locations": {
      "urban": "a modern pedestrian plaza",
      "outdoorsy": "a small-town market square",
      "homebody": "a neighborhood shopping lane"
    },
    "backdrops": {
      "urban": "a paved expanse, a lit sculpture and glass towers",
      "outdoorsy": "a market cross, stall frames and low stone buildings",
      "homebody": "shop awnings, a bike rack and hanging baskets"
    },
    "outfits": {
      "casual": "a black waffle henley with faded jeans",
      "sharp": "a soft-grey topcoat over a bone knit",
      "street": "a grey marl hoodie under a stone chore jacket"
    }
  },
  {
    "id": "street-14-a",
    "version": 4,
    "bucket": "street",
    "slot": 14,
    "variant": "a",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He sits on the low wall at the edge of the square with both hands resting beside him. He turns to the lens as the noise carries on around him. {{backdrop}} sit twelve metres back, their lamps and signs blooming gently out of focus. Documentary framing keeps street context, natural perspective, and available-light colour. A 3:4 waist-up frame from an ordinary pedestrian distance, Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light colour exactly as the street gives it.",
    "locations": {
      "urban": "a modern pedestrian plaza",
      "outdoorsy": "a small-town market square",
      "homebody": "a neighborhood shopping lane"
    },
    "backdrops": {
      "urban": "plaza benches, a fountain and office windows",
      "outdoorsy": "a town hall clock, cobbles and dark hillside",
      "homebody": "a greengrocer's display, crates and a narrow pavement"
    },
    "outfits": {
      "casual": "a slate-blue flannel over a cream tee",
      "sharp": "an ink-blue overshirt over a charcoal knit",
      "street": "a black quilted jacket over a cream tee"
    }
  },
  {
    "id": "street-14-b",
    "version": 4,
    "bucket": "street",
    "slot": 14,
    "variant": "b",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He unwraps something from a paper bag with both hands and takes a first bite. He looks off to the left of the lens at whoever is queueing. Fifteen metres beyond him, {{backdrop}} smear into slow ambient movement. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. A 3:4 chest-up portrait with mixed light falling across the face, Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Spread grain through shadows and background as well as skin, keeping mixed colour temperature and natural highlights.",
    "locations": {
      "urban": "a modern pedestrian plaza",
      "outdoorsy": "a small-town market square",
      "homebody": "a neighborhood shopping lane"
    },
    "backdrops": {
      "urban": "plaza benches, a fountain and office windows",
      "outdoorsy": "a town hall clock, cobbles and dark hillside",
      "homebody": "a greengrocer's display, crates and a narrow pavement"
    },
    "outfits": {
      "casual": "a chocolate corduroy overshirt over a cream tee with dark jeans",
      "sharp": "a stone linen blazer over a black crew-neck tee",
      "street": "a mustard corduroy trucker over a white tee"
    }
  },
  {
    "id": "street-14-c",
    "version": 4,
    "bucket": "street",
    "slot": 14,
    "variant": "c",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He stands up from the wall and brushes his palms together once. He looks to the lens as he shoulders his bag. Twenty metres out, {{backdrop}} reduce to shape and glow while the pavement near him stays sharp. His face freezes cleanly while ambient light and slight background movement stay in the frame. A 3:4 three-quarter snapshot with slight ambient movement behind him, compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. Flash reveals honest texture, modest shine, fabric creases, and one natural shadow cast behind him.",
    "locations": {
      "urban": "a modern pedestrian plaza",
      "outdoorsy": "a small-town market square",
      "homebody": "a neighborhood shopping lane"
    },
    "backdrops": {
      "urban": "plaza benches, a fountain and office windows",
      "outdoorsy": "a town hall clock, cobbles and dark hillside",
      "homebody": "a greengrocer's display, crates and a narrow pavement"
    },
    "outfits": {
      "casual": "a charcoal hoodie under an open black overshirt",
      "sharp": "a charcoal overcoat over a white tee",
      "street": "a black waxed trucker over a grey tee"
    }
  },
  {
    "id": "street-15-a",
    "version": 4,
    "bucket": "street",
    "slot": 15,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He walks the shopping lane settling the hem of his jacket with one hand, then lets both arms fall naturally. He looks ahead, past the lens. The street runs back nine metres to {{backdrop}}, everything past him going soft and warm. Documentary framing keeps street context, natural perspective, and available-light colour. A 4:3 three-quarter frame that keeps pavement and storefront context, Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light colour exactly as the street gives it.",
    "locations": {
      "urban": "a modern pedestrian plaza",
      "outdoorsy": "a small-town market square",
      "homebody": "a neighborhood shopping lane"
    },
    "backdrops": {
      "urban": "an open crossing, bollards and a distant lit atrium",
      "outdoorsy": "a war memorial, parked estate cars and firs",
      "homebody": "a corner shop, a lottery sign and a quiet turning"
    },
    "outfits": {
      "casual": "a sand waffle henley with washed indigo denim",
      "sharp": "a camel sport coat over a fine navy knit",
      "street": "a sand canvas chore coat over a charcoal tee"
    }
  },
  {
    "id": "street-15-b",
    "version": 4,
    "bucket": "street",
    "slot": 15,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He steps into a cooler patch of shade and closes the jacket halfway with one hand. He glances to the lens. He stands four metres clear of {{backdrop}}, which fall away into grainy shadow and lit edges. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. A 3:4 knee-up photograph with background lights softly present, Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Spread grain through shadows and background as well as skin, keeping mixed colour temperature and natural highlights.",
    "locations": {
      "urban": "a modern pedestrian plaza",
      "outdoorsy": "a small-town market square",
      "homebody": "a neighborhood shopping lane"
    },
    "backdrops": {
      "urban": "an open crossing, bollards and a distant lit atrium",
      "outdoorsy": "a war memorial, parked estate cars and firs",
      "homebody": "a corner shop, a lottery sign and a quiet turning"
    },
    "outfits": {
      "casual": "an olive flannel over a grey tee with black jeans",
      "sharp": "a bottle-green wool overshirt over a white oxford",
      "street": "an indigo denim jacket over a cream tee"
    }
  },
  {
    "id": "street-15-c",
    "version": 4,
    "bucket": "street",
    "slot": 15,
    "variant": "c",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He leaves the covered walkway and pulls one cuff down over his wrist against the breeze. He continues at an easy pace, eyes to the lens. Six metres behind him, {{backdrop}} break into soft discs of practical light. His face freezes cleanly while ambient light and slight background movement stay in the frame. A 3:4 medium flash frame with ordinary edge falloff, compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. Flash reveals honest texture, modest shine, fabric creases, and one natural shadow cast behind him.",
    "locations": {
      "urban": "a modern pedestrian plaza",
      "outdoorsy": "a small-town market square",
      "homebody": "a neighborhood shopping lane"
    },
    "backdrops": {
      "urban": "an open crossing, bollards and a distant lit atrium",
      "outdoorsy": "a war memorial, parked estate cars and firs",
      "homebody": "a corner shop, a lottery sign and a quiet turning"
    },
    "outfits": {
      "casual": "a cream heavyweight tee under a slate overshirt",
      "sharp": "a black band-collar shirt with dark trousers",
      "street": "a rust bomber over a black tee"
    }
  },
  {
    "id": "street-16-a",
    "version": 4,
    "bucket": "street",
    "slot": 16,
    "variant": "a",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He waits behind the platform line with both hands in his pockets as the train comes in. He looks to the lens over the noise. Fifteen metres beyond him, {{backdrop}} smear into slow ambient movement. Documentary framing keeps street context, natural perspective, and available-light colour. A 9:16 full-body street frame with straight surrounding lines, Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light colour exactly as the street gives it.",
    "locations": {
      "urban": "a clean metro platform",
      "outdoorsy": "a regional rail platform",
      "homebody": "a local light-rail station"
    },
    "backdrops": {
      "urban": "tiled walls, a platform edge and a lit tunnel mouth",
      "outdoorsy": "a timber canopy, a hanging basket and a bare ridge",
      "homebody": "a shelter, a ticket machine and a level crossing"
    },
    "outfits": {
      "casual": "a rust knit polo with dark denim",
      "sharp": "a burgundy fine-knit under a grey wool jacket",
      "street": "a cream boxy overshirt over a washed-black tee"
    }
  },
  {
    "id": "street-16-b",
    "version": 4,
    "bucket": "street",
    "slot": 16,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He steps back from the doors, one hand on a bag strap, to let passengers off. He watches them go, past the lens. Twenty metres out, {{backdrop}} reduce to shape and glow while the pavement near him stays sharp. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. A 3:4 waist-up night portrait with available street context, Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Spread grain through shadows and background as well as skin, keeping mixed colour temperature and natural highlights.",
    "locations": {
      "urban": "a clean metro platform",
      "outdoorsy": "a regional rail platform",
      "homebody": "a local light-rail station"
    },
    "backdrops": {
      "urban": "tiled walls, a platform edge and a lit tunnel mouth",
      "outdoorsy": "a timber canopy, a hanging basket and a bare ridge",
      "homebody": "a shelter, a ticket machine and a level crossing"
    },
    "outfits": {
      "casual": "a forest-green sweatshirt with stone-grey jeans",
      "sharp": "a light-grey blazer over an ink-blue tee",
      "street": "a forest coach jacket over an oat tee"
    }
  },
  {
    "id": "street-16-c",
    "version": 4,
    "bucket": "street",
    "slot": 16,
    "variant": "c",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He stands near the platform column with a coffee in one hand while a service passes. He meets the lens once it clears. {{backdrop}} sit twelve metres back, their lamps and signs blooming gently out of focus. His face freezes cleanly while ambient light and slight background movement stay in the frame. A 9:16 full-body flash snapshot at believable street distance, compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. Flash reveals honest texture, modest shine, fabric creases, and one natural shadow cast behind him.",
    "locations": {
      "urban": "a clean metro platform",
      "outdoorsy": "a regional rail platform",
      "homebody": "a local light-rail station"
    },
    "backdrops": {
      "urban": "tiled walls, a platform edge and a lit tunnel mouth",
      "outdoorsy": "a timber canopy, a hanging basket and a bare ridge",
      "homebody": "a shelter, a ticket machine and a level crossing"
    },
    "outfits": {
      "casual": "an oat brushed-cotton shirt over a white tee",
      "sharp": "a rust silk-blend shirt with charcoal trousers",
      "street": "a slate windbreaker over a white tee"
    }
  },
  {
    "id": "street-17-a",
    "version": 4,
    "bucket": "street",
    "slot": 17,
    "variant": "a",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He walks the platform reading the overhead display, one hand steadying the bag on his shoulder. He looks to the lens as he finds his carriage. He stands four metres clear of {{backdrop}}, which fall away into grainy shadow and lit edges. Documentary framing keeps street context, natural perspective, and available-light colour. A 3:4 knee-up documentary frame from across the platform, Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light colour exactly as the street gives it.",
    "locations": {
      "urban": "a clean metro platform",
      "outdoorsy": "a regional rail platform",
      "homebody": "a local light-rail station"
    },
    "backdrops": {
      "urban": "an information display, benches and a departing train",
      "outdoorsy": "a station house, a footbridge and dark fields",
      "homebody": "a platform stripe, a bin and a car park"
    },
    "outfits": {
      "casual": "a burgundy waffle henley with black jeans",
      "sharp": "a cream shawl-collar knit with dark trousers",
      "street": "a burgundy varsity jacket over a heather tee"
    }
  },
  {
    "id": "street-17-b",
    "version": 4,
    "bucket": "street",
    "slot": 17,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He sits on the platform bench with a bag beside him and both forearms on his knees. His eyes go down the track, past the lens. Six metres behind him, {{backdrop}} break into soft discs of practical light. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. A 3:4 three-quarter portrait through a little foreground light, Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Spread grain through shadows and background as well as skin, keeping mixed colour temperature and natural highlights.",
    "locations": {
      "urban": "a clean metro platform",
      "outdoorsy": "a regional rail platform",
      "homebody": "a local light-rail station"
    },
    "backdrops": {
      "urban": "an information display, benches and a departing train",
      "outdoorsy": "a station house, a footbridge and dark fields",
      "homebody": "a platform stripe, a bin and a car park"
    },
    "outfits": {
      "casual": "a bone tee under an open chambray shirt",
      "sharp": "a taupe field coat over a black roll-neck",
      "street": "a stone utility overshirt over a black tee"
    }
  },
  {
    "id": "street-17-c",
    "version": 4,
    "bucket": "street",
    "slot": 17,
    "variant": "c",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He stands as the announcement finishes, lifting the bag by its handle in one hand. He turns to the lens before boarding. The street runs back nine metres to {{backdrop}}, everything past him going soft and warm. His face freezes cleanly while ambient light and slight background movement stay in the frame. A 3:4 knee-up flash photograph with a clean shadow behind him, compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. Flash reveals honest texture, modest shine, fabric creases, and one natural shadow cast behind him.",
    "locations": {
      "urban": "a clean metro platform",
      "outdoorsy": "a regional rail platform",
      "homebody": "a local light-rail station"
    },
    "backdrops": {
      "urban": "an information display, benches and a departing train",
      "outdoorsy": "a station house, a footbridge and dark fields",
      "homebody": "a platform stripe, a bin and a car park"
    },
    "outfits": {
      "casual": "a teal crewneck with dark denim",
      "sharp": "an olive blazer over a sand knit",
      "street": "a brown suede trucker over a bone tee"
    }
  },
  {
    "id": "street-18-a",
    "version": 4,
    "bucket": "street",
    "slot": 18,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He stands beside a bicycle with one foot down and a hand on the bar, finishing a conversation. He looks to the lens as he rolls it forward. Twenty metres out, {{backdrop}} reduce to shape and glow while the pavement near him stays sharp. Documentary framing keeps street context, natural perspective, and available-light colour. A 4:3 environmental portrait with reflections kept secondary, Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light colour exactly as the street gives it.",
    "locations": {
      "urban": "a clean metro platform",
      "outdoorsy": "a regional rail platform",
      "homebody": "a local light-rail station"
    },
    "backdrops": {
      "urban": "advertising light boxes, a stairwell and moving passengers",
      "outdoorsy": "a signal box, gravel ballast and low cloud",
      "homebody": "a stop sign, a cycle rack and back gardens"
    },
    "outfits": {
      "casual": "a mustard corduroy shirt with charcoal jeans",
      "sharp": "a slate merino roll-neck with charcoal trousers",
      "street": "a charcoal hoodie under a black leather-trim jacket"
    }
  },
  {
    "id": "street-18-b",
    "version": 4,
    "bucket": "street",
    "slot": 18,
    "variant": "b",
    "imageSize": {
      "width": 1512,
      "height": 2688
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He puts a lock back into a small bag and checks the wheel once with his fingers. He looks up to the lens. {{backdrop}} sit twelve metres back, their lamps and signs blooming gently out of focus. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. A 9:16 full-body night photograph with the face still readable, Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Spread grain through shadows and background as well as skin, keeping mixed colour temperature and natural highlights.",
    "locations": {
      "urban": "a clean metro platform",
      "outdoorsy": "a regional rail platform",
      "homebody": "a local light-rail station"
    },
    "backdrops": {
      "urban": "advertising light boxes, a stairwell and moving passengers",
      "outdoorsy": "a signal box, gravel ballast and low cloud",
      "homebody": "a stop sign, a cycle rack and back gardens"
    },
    "outfits": {
      "casual": "a plum merino crewneck with washed-black denim",
      "sharp": "a tobacco suede blazer over a white shirt",
      "street": "an olive field jacket over a white tee"
    }
  },
  {
    "id": "street-18-c",
    "version": 4,
    "bucket": "street",
    "slot": 18,
    "variant": "c",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He pauses at the bike rack with one hand on the saddle while somebody talks. He smiles off to the right of the lens at the comment. Fifteen metres beyond him, {{backdrop}} smear into slow ambient movement. His face freezes cleanly while ambient light and slight background movement stay in the frame. A 3:4 waist-up compact-camera frame at direct eye level, compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. Flash reveals honest texture, modest shine, fabric creases, and one natural shadow cast behind him.",
    "locations": {
      "urban": "a clean metro platform",
      "outdoorsy": "a regional rail platform",
      "homebody": "a local light-rail station"
    },
    "backdrops": {
      "urban": "advertising light boxes, a stairwell and moving passengers",
      "outdoorsy": "a signal box, gravel ballast and low cloud",
      "homebody": "a stop sign, a cycle rack and back gardens"
    },
    "outfits": {
      "casual": "a stone linen overshirt over a heather tee",
      "sharp": "a navy peacoat over a cream crewneck",
      "street": "an ecru linen overshirt over a grey tee"
    }
  },
  {
    "id": "street-19-a",
    "version": 4,
    "bucket": "street",
    "slot": 19,
    "variant": "a",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He lowers a street-food tray after a bite, holding it level on one palm. He looks to the lens with a tired late-night grin. Six metres behind him, {{backdrop}} break into soft discs of practical light. Documentary framing keeps street context, natural perspective, and available-light colour. A 3:4 waist-up frame from an ordinary pedestrian distance, Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light colour exactly as the street gives it.",
    "locations": {
      "urban": "a late-night food-market curb",
      "outdoorsy": "a mountain-town evening stall",
      "homebody": "a neighborhood night-market edge"
    },
    "backdrops": {
      "urban": "stall canopies, hanging bulbs and steam in the light",
      "outdoorsy": "a wooden stall, a gas lamp and a black treeline",
      "homebody": "a trestle table, fairy lights and lit house windows"
    },
    "outfits": {
      "casual": "an ecru cable knit with indigo jeans",
      "sharp": "a plum knit polo with grey trousers",
      "street": "a teal coach jacket over a cream tee"
    }
  },
  {
    "id": "street-19-b",
    "version": 4,
    "bucket": "street",
    "slot": 19,
    "variant": "b",
    "imageSize": {
      "width": 1536,
      "height": 2048
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He waits at the stall while the order is finished and takes the small bag in one hand. He turns to the lens as he steps back. The street runs back nine metres to {{backdrop}}, everything past him going soft and warm. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. A 3:4 chest-up portrait with mixed light falling across the face, Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Spread grain through shadows and background as well as skin, keeping mixed colour temperature and natural highlights.",
    "locations": {
      "urban": "a late-night food-market curb",
      "outdoorsy": "a mountain-town evening stall",
      "homebody": "a neighborhood night-market edge"
    },
    "backdrops": {
      "urban": "stall canopies, hanging bulbs and steam in the light",
      "outdoorsy": "a wooden stall, a gas lamp and a black treeline",
      "homebody": "a trestle table, fairy lights and lit house windows"
    },
    "outfits": {
      "casual": "a terracotta long-sleeve tee with dark chinos",
      "sharp": "a mid-brown corduroy blazer over an ecru tee",
      "street": "a chocolate shearling-collar trucker over a black tee"
    }
  },
  {
    "id": "street-19-c",
    "version": 4,
    "bucket": "street",
    "slot": 19,
    "variant": "c",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He offers the next bite across, then draws the tray back with both hands. He laughs at the refusal, eyes off to the left of the lens. He stands four metres clear of {{backdrop}}, which fall away into grainy shadow and lit edges. His face freezes cleanly while ambient light and slight background movement stay in the frame. A 3:4 three-quarter snapshot with slight ambient movement behind him, compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. Flash reveals honest texture, modest shine, fabric creases, and one natural shadow cast behind him.",
    "locations": {
      "urban": "a late-night food-market curb",
      "outdoorsy": "a mountain-town evening stall",
      "homebody": "a neighborhood night-market edge"
    },
    "backdrops": {
      "urban": "stall canopies, hanging bulbs and steam in the light",
      "outdoorsy": "a wooden stall, a gas lamp and a black treeline",
      "homebody": "a trestle table, fairy lights and lit house windows"
    },
    "outfits": {
      "casual": "a grey marl henley with black denim",
      "sharp": "a chalk-striped grey jacket over a black tee",
      "street": "a terracotta hooded overshirt over a white tee"
    }
  },
  {
    "id": "street-20-a",
    "version": 4,
    "bucket": "street",
    "slot": 20,
    "variant": "a",
    "imageSize": {
      "width": 2304,
      "height": 1728
    },
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He walks out of the market lane through the sidewalk traffic with a bag in one hand. He notices the camera by a stall and turns to the lens with easy confidence. {{backdrop}} sit twelve metres back, their lamps and signs blooming gently out of focus. Documentary framing keeps street context, natural perspective, and available-light colour. A 4:3 three-quarter frame that keeps pavement and storefront context, Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light colour exactly as the street gives it.",
    "locations": {
      "urban": "a late-night food-market curb",
      "outdoorsy": "a mountain-town evening stall",
      "homebody": "a neighborhood night-market edge"
    },
    "backdrops": {
      "urban": "a griddle glow, queueing figures and wet tarmac",
      "outdoorsy": "a fire drum, folding chairs and mountain dark",
      "homebody": "a stall awning, a parked van and a garden fence"
    },
    "outfits": {
      "casual": "an indigo overshirt over a washed white tee",
      "sharp": "a forest velvet-trim jacket over a white tee",
      "street": "a navy bomber over an oat tee"
    }
  },
  {
    "id": "street-20-b",
    "version": 4,
    "bucket": "street",
    "slot": 20,
    "variant": "b",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He slows near the corner at the end of the row, one hand adjusting his collar. He looks back at the last comment, past the lens. Fifteen metres beyond him, {{backdrop}} smear into slow ambient movement. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. A 3:4 knee-up photograph with background lights softly present, Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Spread grain through shadows and background as well as skin, keeping mixed colour temperature and natural highlights.",
    "locations": {
      "urban": "a late-night food-market curb",
      "outdoorsy": "a mountain-town evening stall",
      "homebody": "a neighborhood night-market edge"
    },
    "backdrops": {
      "urban": "a griddle glow, queueing figures and wet tarmac",
      "outdoorsy": "a fire drum, folding chairs and mountain dark",
      "homebody": "a stall awning, a parked van and a garden fence"
    },
    "outfits": {
      "casual": "a black waffle henley with faded jeans",
      "sharp": "a soft-grey topcoat over a bone knit",
      "street": "a grey marl hoodie under a stone chore jacket"
    }
  },
  {
    "id": "street-20-c",
    "version": 4,
    "bucket": "street",
    "slot": 20,
    "variant": "c",
    "imageSize": {
      "width": 1728,
      "height": 2304
    },
    "promptTemplate": "Use the supplied photographs for identity. Keep his face shape, skin tone, hair, beard pattern, age, and asymmetry exactly as they appear. At {{location}}, wearing {{outfit}}. He crosses a pool of stall light into the darker stretch, both hands in his pockets. He smiles to the lens as he goes by. Twenty metres out, {{backdrop}} reduce to shape and glow while the pavement near him stays sharp. His face freezes cleanly while ambient light and slight background movement stay in the frame. A 3:4 medium flash frame with ordinary edge falloff, compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. Flash reveals honest texture, modest shine, fabric creases, and one natural shadow cast behind him.",
    "locations": {
      "urban": "a late-night food-market curb",
      "outdoorsy": "a mountain-town evening stall",
      "homebody": "a neighborhood night-market edge"
    },
    "backdrops": {
      "urban": "a griddle glow, queueing figures and wet tarmac",
      "outdoorsy": "a fire drum, folding chairs and mountain dark",
      "homebody": "a stall awning, a parked van and a garden fence"
    },
    "outfits": {
      "casual": "a slate-blue flannel over a cream tee",
      "sharp": "an ink-blue overshirt over a charcoal knit",
      "street": "a black quilted jacket over a cream tee"
    }
  }
] as const satisfies readonly DatingPromptDefinition[];

export function getPromptVariants(
  bucket: DatingBucket,
  slot: number
): readonly DatingPromptDefinition[] {
  return DATING_PROMPTS.filter(
    (prompt) => prompt.bucket === bucket && prompt.slot === slot
  );
}

function stablePromptHash(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function selectDatingPromptVariant(
  batchId: string,
  bucket: DatingBucket,
  slot: number
): DatingPromptDefinition {
  const variants = getPromptVariants(bucket, slot);
  if (variants.length !== 3) {
    throw new Error(
      `Expected 3 prompt variants for ${bucket}:${slot}; found ${variants.length}`
    );
  }
  const index =
    stablePromptHash(
      `v${DATING_PROMPT_LIBRARY_VERSION}:${batchId}:${bucket}:${slot}`
    ) % variants.length;
  return variants[index];
}

/**
 * Seedream reads negation as affirmation, so a v4 template states everything it
 * wants rendered and states nothing it wants withheld. Enforced on v4 entries
 * only — v3 buckets still carry the legacy negative clauses until migrated.
 */
const NEGATION_PATTERN =
  /\b(no|not|never|avoid|avoids|avoiding|without|nor|cannot|neither|none|nothing|lack|lacks|instead of|rather than|free of)\b|n't\b/i;

const COLOUR_FAMILIES = [
  "navy", "blue", "indigo", "chambray", "charcoal", "grey", "black", "white",
  "bone", "cream", "ecru", "oat", "oatmeal", "sand", "stone", "camel", "tan",
  "taupe", "brown", "chocolate", "tobacco", "rust", "terracotta", "mustard",
  "burgundy", "plum", "olive", "forest", "green", "teal", "slate",
];

/**
 * Counts eye contact only. Deliberately excludes the off-camera constructions
 * ("past the lens", "off to the left of the lens") and the texture clause's
 * "letting the lens render depth", none of which describe where he is looking.
 */
const LENS_GAZE_PATTERN =
  /\b(?:to|at|into|down|on|toward|towards) the lens\b|\b(?:meets|holds|finds) the lens\b/;

/**
 * How often each bucket should look down the lens. `anchor` carries the profile's
 * eye-contact load, so it is held highest. The supporting buckets are deliberately
 * lower: a man mid-run, mid-conversation, or looking at the view he travelled to
 * see is what makes those photographs read as unposed rather than staged.
 */
const V4_MIN_LENS_GAZE_SHARE: Record<DatingBucket, number> = {
  anchor: 0.65,
  social: 0.5,
  travel: 0.45,
  active: 0.4,
  street: 0.45,
};

/**
 * Bucket-specific phrases that must survive any future edit. `social` is the one
 * that matters: an edit model handed a single reference face and asked for
 * "friends" will happily paint that same face onto them, so every social prompt
 * has to keep companions turned away and name him as the only resolved face.
 */
const V4_REQUIRED_PHRASE: Partial<Record<DatingBucket, string>> = {
  social: "the one face in focus",
};

const V4_MAX_OUTFIT_REPEATS = 4;
const V4_MAX_COLOUR_SHARE = 0.2;

/**
 * The colour a photo actually reads as is its outermost, first-named garment —
 * a white tee under a rust overshirt reads rust. Only that lead colour counts
 * toward the distribution cap, so neutral base layers stay free to repeat.
 */
function leadColourFamily(outfit: string): string | null {
  const lower = outfit.toLowerCase();
  let lead: { colour: string; at: number } | null = null;
  for (const colour of COLOUR_FAMILIES) {
    const at = lower.search(new RegExp(`\\b${colour}\\b`));
    if (at >= 0 && (lead === null || at < lead.at)) {
      lead = { colour, at };
    }
  }
  return lead?.colour ?? null;
}

function assertBucketV4(
  bucket: DatingBucket,
  prompts: readonly DatingPromptDefinition[]
): void {
  let lensGaze = 0;

  for (const prompt of prompts) {
    const templates = [prompt.promptTemplate, prompt.hobbyPromptTemplate].filter(
      (template): template is string => Boolean(template)
    );

    for (const template of templates) {
      const negation = template.match(NEGATION_PATTERN);
      if (negation) {
        throw new Error(
          `v4 prompt ${prompt.id} uses negation "${negation[0]}"; state the wanted result instead`
        );
      }
      if (!/\bmetres\b/.test(template)) {
        throw new Error(
          `v4 prompt ${prompt.id} must state a subject-to-background distance`
        );
      }
      if (
        !/\b(hand|hands|forearm|forearms|thumb|thumbs|palm|palms|finger|fingers|elbow|elbows|knuckle|fist|fists|grip|wrist|wrists)\b/.test(
          template
        )
      ) {
        throw new Error(`v4 prompt ${prompt.id} must place his hands`);
      }
      if (!/\b(lens|camera|photographer)\b/.test(template)) {
        throw new Error(`v4 prompt ${prompt.id} must name a gaze target`);
      }
    }

    // Only the main template stages a backdrop. Hobby alternatives stand alone
    // because the venue depends on whatever activity the user typed.
    if (!prompt.promptTemplate.includes("{{backdrop}}")) {
      throw new Error(`v4 prompt ${prompt.id} must stage its background`);
    }
    if (
      prompt.hobbyPromptTemplate &&
      /\{\{(location|outfit|backdrop)\}\}/.test(prompt.hobbyPromptTemplate)
    ) {
      throw new Error(
        `v4 prompt ${prompt.id} hobby alternative must stand alone without scene tokens`
      );
    }

    const requiredPhrase = V4_REQUIRED_PHRASE[bucket];
    if (requiredPhrase && !prompt.promptTemplate.includes(requiredPhrase)) {
      throw new Error(
        `v4 prompt ${prompt.id} must keep the phrase "${requiredPhrase}"`
      );
    }

    if (LENS_GAZE_PATTERN.test(prompt.promptTemplate)) {
      lensGaze += 1;
    }
  }

  const minGazeShare = V4_MIN_LENS_GAZE_SHARE[bucket];
  const gazeShare = lensGaze / prompts.length;
  if (gazeShare < minGazeShare) {
    throw new Error(
      `Bucket ${bucket} directs only ${Math.round(
        gazeShare * 100
      )}% of gazes at the lens; expected at least ${minGazeShare * 100}%`
    );
  }

  for (const style of ["casual", "sharp", "street"] as const) {
    const outfits = prompts.map((prompt) => prompt.outfits[style]);

    const repeats = new Map<string, number>();
    for (const outfit of outfits) {
      repeats.set(outfit, (repeats.get(outfit) ?? 0) + 1);
    }
    for (const [outfit, count] of repeats) {
      if (count > V4_MAX_OUTFIT_REPEATS) {
        throw new Error(
          `Bucket ${bucket} repeats ${style} outfit "${outfit}" ${count} times; cap is ${V4_MAX_OUTFIT_REPEATS}`
        );
      }
    }

    const colours = new Map<string, number>();
    for (const outfit of outfits) {
      const colour = leadColourFamily(outfit);
      if (colour) colours.set(colour, (colours.get(colour) ?? 0) + 1);
    }
    const cap = Math.ceil(outfits.length * V4_MAX_COLOUR_SHARE);
    for (const [colour, count] of colours) {
      if (count > cap) {
        throw new Error(
          `Bucket ${bucket} uses ${colour} in ${count} of ${outfits.length} ${style} outfits; cap is ${cap}`
        );
      }
    }
  }
}

export function assertLibraryComplete(): void {
  if (DATING_PROMPTS.length !== 300) {
    throw new Error(
      `Prompt library has ${DATING_PROMPTS.length} entries; expected 300`
    );
  }

  const ids = new Set<string>();
  const promptTexts = new Set<string>();
  const allowedTokens = new Set(["location", "backdrop", "outfit", "hobby"]);
  let hobbyPromptCount = 0;
  const bannedPhrases = [
    "--style raw",
    "aggressively sharp",
    "high-value",
    "social proof energy",
    "catfish paranoia",
    "he is mid-",
    "he is weight shifted",
    "he is hands",
    "he is one hand",
    "he is chin",
  ];

  for (const bucket of DATING_BUCKETS) {
    const bucketPrompts = DATING_PROMPTS.filter(
      (prompt) => prompt.bucket === bucket
    );
    if (bucketPrompts.length !== 60) {
      throw new Error(
        `Bucket ${bucket} has ${bucketPrompts.length} prompts; expected 60`
      );
    }

    for (let slot = 1; slot <= 20; slot += 1) {
      const variants = getPromptVariants(bucket, slot);
      if (
        variants.length !== 3 ||
        variants.map((prompt) => prompt.variant).join("") !== "abc"
      ) {
        throw new Error(
          `Bucket ${bucket} slot ${slot} must contain variants a, b, c`
        );
      }

      for (const prompt of variants) {
        if (ids.has(prompt.id)) throw new Error(`Duplicate prompt id: ${prompt.id}`);
        if (promptTexts.has(prompt.promptTemplate)) {
          throw new Error(`Duplicate prompt text: ${prompt.id}`);
        }
        ids.add(prompt.id);
        promptTexts.add(prompt.promptTemplate);
        if (prompt.hobbyPromptTemplate) hobbyPromptCount += 1;

        if (!prompt.imageSize) {
          throw new Error(`Prompt ${prompt.id} is missing imageSize`);
        }

        const expectedRatio = deriveRatioLabel(prompt.imageSize);

        const templates = [
          prompt.promptTemplate,
          prompt.hobbyPromptTemplate,
        ].filter((template): template is string => Boolean(template));
        for (const template of templates) {
          const aspectRatios = [
            ...template.matchAll(/\b(?:9:16|3:4|4:3)\b/g),
          ].map((match) => match[0]);
          if (aspectRatios.length !== 1 || aspectRatios[0] !== expectedRatio) {
            throw new Error(
              `Prompt ${prompt.id} must contain exactly one ${expectedRatio} composition`
            );
          }

          const tokens = [...template.matchAll(/\{\{([^}]+)\}\}/g)].map(
            (match) => match[1]
          );
          for (const token of tokens) {
            if (!allowedTokens.has(token)) {
              throw new Error(`Unknown token {{${token}}} in ${prompt.id}`);
            }
          }
          for (const phrase of bannedPhrases) {
            if (template.toLowerCase().includes(phrase.toLowerCase())) {
              throw new Error(`Banned phrase "${phrase}" in ${prompt.id}`);
            }
          }
        }
      }
    }

    assertBucketV4(bucket, bucketPrompts);
  }

  if (hobbyPromptCount !== 12) {
    throw new Error(
      `Prompt library has ${hobbyPromptCount} hobby alternatives; expected 12`
    );
  }
}
