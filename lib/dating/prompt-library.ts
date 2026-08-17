import type { DatingAspectRatio } from "./aspect-ratio";
import { DATING_BUCKETS, type DatingBucket, type StylePref, type Vibe } from "./types";

export const DATING_PROMPT_LIBRARY_VERSION = 3;
export type DatingPromptVariant = "a" | "b" | "c";

export type DatingPromptDefinition = {
  id: string;
  version: typeof DATING_PROMPT_LIBRARY_VERSION;
  bucket: DatingBucket;
  slot: number;
  variant: DatingPromptVariant;
  aspectRatio: DatingAspectRatio;
  promptTemplate: string;
  hobbyPromptTemplate?: string;
  locations: Record<Vibe, string>;
  outfits: Record<StylePref, string>;
};

/**
 * V3 production library: three complete, independently directed variants for
 * every delivered slot. Runtime compilation substitutes only preference values.
 */
export const DATING_PROMPTS = [
  {
    "id": "anchor-01-a",
    "version": 3,
    "bucket": "anchor",
    "slot": 1,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. A friend says his name as he leaves the colonnade; his body continues forward while his face turns back and a small smile begins. Compose a 3:4 chest-up portrait at eye level with relaxed headroom. Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Broad indirect daylight gives soft highlight rolloff and restrained background separation. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights; no smoothing, reshaping, or sharpened pores.",
    "locations": {
      "urban": "a pale-stone city colonnade",
      "outdoorsy": "a shaded park pavilion",
      "homebody": "a bright apartment balcony doorway"
    },
    "outfits": {
      "casual": "a navy henley with dark jeans",
      "sharp": "a charcoal blazer over a white crew-neck tee",
      "street": "a dark suede bomber over a cream tee"
    }
  },
  {
    "id": "anchor-01-b",
    "version": 3,
    "bucket": "anchor",
    "slot": 1,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He finishes answering a question, pauses beside the wall, and meets the photographer with an attentive expression before the next sentence. Frame a 3:4 waist-up portrait from just beside the photographer's conversation line. Canon R5, 85mm, f/2, 1/320, ISO 400. Soft side light and wall bounce keep both eyes clear without flattening the face. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff; avoid beauty filters and waxy retouching.",
    "locations": {
      "urban": "a pale-stone city colonnade",
      "outdoorsy": "a shaded park pavilion",
      "homebody": "a bright apartment balcony doorway"
    },
    "outfits": {
      "casual": "a navy henley with dark jeans",
      "sharp": "a charcoal blazer over a white crew-neck tee",
      "street": "a dark suede bomber over a cream tee"
    }
  },
  {
    "id": "anchor-01-c",
    "version": 3,
    "bucket": "anchor",
    "slot": 1,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He steps out from the doorway, settles a coffee into one hand, and looks up when the photographer makes him laugh. Use a 3:4 friend-taken medium portrait with slightly imperfect but intentional framing. Friend-taken iPhone 15 Pro, 48mm equivalent, no Portrait Mode. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. Show distance-appropriate facial detail, flyaway hairs, and fabric creases; no synthetic blur, glamour glow, or facial reshaping.",
    "locations": {
      "urban": "a pale-stone city colonnade",
      "outdoorsy": "a shaded park pavilion",
      "homebody": "a bright apartment balcony doorway"
    },
    "outfits": {
      "casual": "a navy henley with dark jeans",
      "sharp": "a charcoal blazer over a white crew-neck tee",
      "street": "a dark suede bomber over a cream tee"
    }
  },
  {
    "id": "anchor-02-a",
    "version": 3,
    "bucket": "anchor",
    "slot": 2,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He sits near the window after placing his phone face down, turns from the view, and smiles as the conversation resumes. Compose a 3:4 waist-up portrait from seated eye height, keeping both hands visible. Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Broad indirect daylight gives soft highlight rolloff and restrained background separation. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights; no smoothing, reshaping, or sharpened pores.",
    "locations": {
      "urban": "a pale-stone city colonnade",
      "outdoorsy": "a shaded park pavilion",
      "homebody": "a bright apartment balcony doorway"
    },
    "outfits": {
      "casual": "a navy henley with dark jeans",
      "sharp": "a charcoal blazer over a white crew-neck tee",
      "street": "a dark suede bomber over a cream tee"
    }
  },
  {
    "id": "anchor-02-b",
    "version": 3,
    "bucket": "anchor",
    "slot": 2,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He leans forward to hear the photographer over the room, then eases back with his hands still loosely together. Frame a 3:4 chest-up portrait with his face on the upper third. Canon R5, 85mm, f/2, 1/320, ISO 400. Soft side light and wall bounce keep both eyes clear without flattening the face. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff; avoid beauty filters and waxy retouching.",
    "locations": {
      "urban": "a pale-stone city colonnade",
      "outdoorsy": "a shaded park pavilion",
      "homebody": "a bright apartment balcony doorway"
    },
    "outfits": {
      "casual": "a navy henley with dark jeans",
      "sharp": "a charcoal blazer over a white crew-neck tee",
      "street": "a dark suede bomber over a cream tee"
    }
  },
  {
    "id": "anchor-02-c",
    "version": 3,
    "bucket": "anchor",
    "slot": 2,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He shifts his chair toward the daylight, answers the photographer, and leaves one hand resting on the chair arm. Use a 3:4 knee-up portrait from a natural conversational distance. Friend-taken iPhone 15 Pro, 48mm equivalent, no Portrait Mode. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. Show distance-appropriate facial detail, flyaway hairs, and fabric creases; no synthetic blur, glamour glow, or facial reshaping.",
    "locations": {
      "urban": "a pale-stone city colonnade",
      "outdoorsy": "a shaded park pavilion",
      "homebody": "a bright apartment balcony doorway"
    },
    "outfits": {
      "casual": "a navy henley with dark jeans",
      "sharp": "a charcoal blazer over a white crew-neck tee",
      "street": "a dark suede bomber over a cream tee"
    }
  },
  {
    "id": "anchor-03-a",
    "version": 3,
    "bucket": "anchor",
    "slot": 3,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He has just pushed away from the wall to continue walking, but a comment catches him before the first step and lifts his expression. Compose a 3:4 half-body portrait with his torso angled slightly through the frame. Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Broad indirect daylight gives soft highlight rolloff and restrained background separation. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights; no smoothing, reshaping, or sharpened pores.",
    "locations": {
      "urban": "a pale-stone city colonnade",
      "outdoorsy": "a shaded park pavilion",
      "homebody": "a bright apartment balcony doorway"
    },
    "outfits": {
      "casual": "a navy henley with dark jeans",
      "sharp": "a charcoal blazer over a white crew-neck tee",
      "street": "a dark suede bomber over a cream tee"
    }
  },
  {
    "id": "anchor-03-b",
    "version": 3,
    "bucket": "anchor",
    "slot": 3,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He pauses after fastening one cuff, lowers both hands, and gives the photographer an easy half-smile when a follow-up question catches him. Frame a 3:4 three-quarter portrait from waist height without elongating the body. Canon R5, 85mm, f/2, 1/320, ISO 400. Soft side light and wall bounce keep both eyes clear without flattening the face. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff; avoid beauty filters and waxy retouching.",
    "locations": {
      "urban": "a pale-stone city colonnade",
      "outdoorsy": "a shaded park pavilion",
      "homebody": "a bright apartment balcony doorway"
    },
    "outfits": {
      "casual": "a navy henley with dark jeans",
      "sharp": "a charcoal blazer over a white crew-neck tee",
      "street": "a dark suede bomber over a cream tee"
    }
  },
  {
    "id": "anchor-03-c",
    "version": 3,
    "bucket": "anchor",
    "slot": 3,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He glances toward the street, hears a joke from behind the camera, and turns back with a restrained genuine smile. Use a 3:4 waist-up snapshot with ordinary depth throughout the setting. Friend-taken iPhone 15 Pro, 48mm equivalent, no Portrait Mode. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. Show distance-appropriate facial detail, flyaway hairs, and fabric creases; no synthetic blur, glamour glow, or facial reshaping.",
    "locations": {
      "urban": "a pale-stone city colonnade",
      "outdoorsy": "a shaded park pavilion",
      "homebody": "a bright apartment balcony doorway"
    },
    "outfits": {
      "casual": "a navy henley with dark jeans",
      "sharp": "a charcoal blazer over a white crew-neck tee",
      "street": "a dark suede bomber over a cream tee"
    }
  },
  {
    "id": "anchor-04-a",
    "version": 3,
    "bucket": "anchor",
    "slot": 4,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He stops at the edge of the courtyard to finish a thought, then looks directly at the photographer as his expression softens. Compose a 3:4 head-and-shoulders portrait with the face unobstructed. Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Broad indirect daylight gives soft highlight rolloff and restrained background separation. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights; no smoothing, reshaping, or sharpened pores.",
    "locations": {
      "urban": "a quiet design café window",
      "outdoorsy": "a lodge reading corner",
      "homebody": "a tidy living-room window"
    },
    "outfits": {
      "casual": "a cream textured crewneck and dark denim",
      "sharp": "a light-blue oxford with sleeves rolled",
      "street": "a black knit polo with tailored trousers"
    }
  },
  {
    "id": "anchor-04-b",
    "version": 3,
    "bucket": "anchor",
    "slot": 4,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He turns from reading a small exhibition card and holds the photographer's gaze for a quiet beat. Frame a 3:4 close portrait at eye level with ears and hairline intact. Canon R5, 85mm, f/2, 1/320, ISO 400. Soft side light and wall bounce keep both eyes clear without flattening the face. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff; avoid beauty filters and waxy retouching.",
    "locations": {
      "urban": "a quiet design café window",
      "outdoorsy": "a lodge reading corner",
      "homebody": "a tidy living-room window"
    },
    "outfits": {
      "casual": "a cream textured crewneck and dark denim",
      "sharp": "a light-blue oxford with sleeves rolled",
      "street": "a black knit polo with tailored trousers"
    }
  },
  {
    "id": "anchor-04-c",
    "version": 3,
    "bucket": "anchor",
    "slot": 4,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He walks beneath the covered entrance, slows when his name is called, and looks back without squaring his body to the camera. Use a 3:4 chest-up snapshot with a little breathing room beside him. Friend-taken iPhone 15 Pro, 48mm equivalent, no Portrait Mode. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. Show distance-appropriate facial detail, flyaway hairs, and fabric creases; no synthetic blur, glamour glow, or facial reshaping.",
    "locations": {
      "urban": "a quiet design café window",
      "outdoorsy": "a lodge reading corner",
      "homebody": "a tidy living-room window"
    },
    "outfits": {
      "casual": "a cream textured crewneck and dark denim",
      "sharp": "a light-blue oxford with sleeves rolled",
      "street": "a black knit polo with tailored trousers"
    }
  },
  {
    "id": "anchor-05-a",
    "version": 3,
    "bucket": "anchor",
    "slot": 5,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He adjusts the cuff of his overshirt after sitting down, then looks up while the photographer is still speaking. Compose a 3:4 three-quarter portrait that shows natural posture and clothing fit. Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Broad indirect daylight gives soft highlight rolloff and restrained background separation. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights; no smoothing, reshaping, or sharpened pores.",
    "locations": {
      "urban": "a quiet design café window",
      "outdoorsy": "a lodge reading corner",
      "homebody": "a tidy living-room window"
    },
    "outfits": {
      "casual": "a cream textured crewneck and dark denim",
      "sharp": "a light-blue oxford with sleeves rolled",
      "street": "a black knit polo with tailored trousers"
    }
  },
  {
    "id": "anchor-05-b",
    "version": 3,
    "bucket": "anchor",
    "slot": 5,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He sets a cup below the frame, keeps one forearm on the table, and smiles at a remark from across the table. Frame a 3:4 half-body portrait with modest environmental context. Canon R5, 85mm, f/2, 1/320, ISO 400. Soft side light and wall bounce keep both eyes clear without flattening the face. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff; avoid beauty filters and waxy retouching.",
    "locations": {
      "urban": "a quiet design café window",
      "outdoorsy": "a lodge reading corner",
      "homebody": "a tidy living-room window"
    },
    "outfits": {
      "casual": "a cream textured crewneck and dark denim",
      "sharp": "a light-blue oxford with sleeves rolled",
      "street": "a black knit polo with tailored trousers"
    }
  },
  {
    "id": "anchor-05-c",
    "version": 3,
    "bucket": "anchor",
    "slot": 5,
    "variant": "c",
    "aspectRatio": "9:16",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He steps away from the café window, smooths the front of his jacket once, and turns when the photographer calls to him. Use a 9:16 full-body portrait without wide-angle stretching. Friend-taken iPhone 15 Pro, 48mm equivalent, no Portrait Mode. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. Show distance-appropriate facial detail, flyaway hairs, and fabric creases; no synthetic blur, glamour glow, or facial reshaping.",
    "locations": {
      "urban": "a quiet design café window",
      "outdoorsy": "a lodge reading corner",
      "homebody": "a tidy living-room window"
    },
    "outfits": {
      "casual": "a cream textured crewneck and dark denim",
      "sharp": "a light-blue oxford with sleeves rolled",
      "street": "a black knit polo with tailored trousers"
    }
  },
  {
    "id": "anchor-06-a",
    "version": 3,
    "bucket": "anchor",
    "slot": 6,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He crosses the walkway at an easy pace, hears a familiar voice, and looks over without interrupting his stride. Compose a 3:4 chest-up portrait at eye level with relaxed headroom. Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Broad indirect daylight gives soft highlight rolloff and restrained background separation. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights; no smoothing, reshaping, or sharpened pores.",
    "locations": {
      "urban": "a quiet design café window",
      "outdoorsy": "a lodge reading corner",
      "homebody": "a tidy living-room window"
    },
    "outfits": {
      "casual": "a cream textured crewneck and dark denim",
      "sharp": "a light-blue oxford with sleeves rolled",
      "street": "a black knit polo with tailored trousers"
    }
  },
  {
    "id": "anchor-06-b",
    "version": 3,
    "bucket": "anchor",
    "slot": 6,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He waits beside the path with both hands relaxed in his pockets, then leans forward slightly to respond. Frame a 3:4 waist-up portrait from just beside the photographer's conversation line. Canon R5, 85mm, f/2, 1/320, ISO 400. Soft side light and wall bounce keep both eyes clear without flattening the face. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff; avoid beauty filters and waxy retouching.",
    "locations": {
      "urban": "a quiet design café window",
      "outdoorsy": "a lodge reading corner",
      "homebody": "a tidy living-room window"
    },
    "outfits": {
      "casual": "a cream textured crewneck and dark denim",
      "sharp": "a light-blue oxford with sleeves rolled",
      "street": "a black knit polo with tailored trousers"
    }
  },
  {
    "id": "anchor-06-c",
    "version": 3,
    "bucket": "anchor",
    "slot": 6,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He slows near the corner, lets another pedestrian pass, and gives the photographer an amused side glance. Use a 3:4 friend-taken medium portrait with slightly imperfect but intentional framing. Friend-taken iPhone 15 Pro, 48mm equivalent, no Portrait Mode. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. Show distance-appropriate facial detail, flyaway hairs, and fabric creases; no synthetic blur, glamour glow, or facial reshaping.",
    "locations": {
      "urban": "a quiet design café window",
      "outdoorsy": "a lodge reading corner",
      "homebody": "a tidy living-room window"
    },
    "outfits": {
      "casual": "a cream textured crewneck and dark denim",
      "sharp": "a light-blue oxford with sleeves rolled",
      "street": "a black knit polo with tailored trousers"
    }
  },
  {
    "id": "anchor-07-a",
    "version": 3,
    "bucket": "anchor",
    "slot": 7,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He looks down while considering the question, then raises his eyes as a genuine answer begins to form. Compose a 3:4 waist-up portrait from seated eye height, keeping both hands visible. Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Broad indirect daylight gives soft highlight rolloff and restrained background separation. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights; no smoothing, reshaping, or sharpened pores.",
    "locations": {
      "urban": "a warm brick side-street wall",
      "outdoorsy": "a weathered visitor-center wall",
      "homebody": "a simple home courtyard wall"
    },
    "outfits": {
      "casual": "an olive overshirt over a charcoal tee",
      "sharp": "a fitted navy polo with chinos",
      "street": "a washed black denim jacket over a white tee"
    }
  },
  {
    "id": "anchor-07-b",
    "version": 3,
    "bucket": "anchor",
    "slot": 7,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He straightens after checking the fit of his sleeve and meets the camera before lowering his hands. Frame a 3:4 chest-up portrait with his face on the upper third. Canon R5, 85mm, f/2, 1/320, ISO 400. Soft side light and wall bounce keep both eyes clear without flattening the face. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff; avoid beauty filters and waxy retouching.",
    "locations": {
      "urban": "a warm brick side-street wall",
      "outdoorsy": "a weathered visitor-center wall",
      "homebody": "a simple home courtyard wall"
    },
    "outfits": {
      "casual": "an olive overshirt over a charcoal tee",
      "sharp": "a fitted navy polo with chinos",
      "street": "a washed black denim jacket over a white tee"
    }
  },
  {
    "id": "anchor-07-c",
    "version": 3,
    "bucket": "anchor",
    "slot": 7,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He listens with his head slightly turned toward the photographer, then smiles without changing his relaxed stance. Use a 3:4 knee-up portrait from a natural conversational distance. Friend-taken iPhone 15 Pro, 48mm equivalent, no Portrait Mode. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. Show distance-appropriate facial detail, flyaway hairs, and fabric creases; no synthetic blur, glamour glow, or facial reshaping.",
    "locations": {
      "urban": "a warm brick side-street wall",
      "outdoorsy": "a weathered visitor-center wall",
      "homebody": "a simple home courtyard wall"
    },
    "outfits": {
      "casual": "an olive overshirt over a charcoal tee",
      "sharp": "a fitted navy polo with chinos",
      "street": "a washed black denim jacket over a white tee"
    }
  },
  {
    "id": "anchor-08-a",
    "version": 3,
    "bucket": "anchor",
    "slot": 8,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He sits forward while telling a short story, finishes the last line, and holds the photographer's gaze as his hands settle. Compose a 3:4 half-body portrait with his torso angled slightly through the frame. Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Broad indirect daylight gives soft highlight rolloff and restrained background separation. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights; no smoothing, reshaping, or sharpened pores.",
    "locations": {
      "urban": "a warm brick side-street wall",
      "outdoorsy": "a weathered visitor-center wall",
      "homebody": "a simple home courtyard wall"
    },
    "outfits": {
      "casual": "an olive overshirt over a charcoal tee",
      "sharp": "a fitted navy polo with chinos",
      "street": "a washed black denim jacket over a white tee"
    }
  },
  {
    "id": "anchor-08-b",
    "version": 3,
    "bucket": "anchor",
    "slot": 8,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He moves to the edge of the bench to make room, then looks up with an open, attentive expression. Frame a 3:4 three-quarter portrait from waist height without elongating the body. Canon R5, 85mm, f/2, 1/320, ISO 400. Soft side light and wall bounce keep both eyes clear without flattening the face. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff; avoid beauty filters and waxy retouching.",
    "locations": {
      "urban": "a warm brick side-street wall",
      "outdoorsy": "a weathered visitor-center wall",
      "homebody": "a simple home courtyard wall"
    },
    "outfits": {
      "casual": "an olive overshirt over a charcoal tee",
      "sharp": "a fitted navy polo with chinos",
      "street": "a washed black denim jacket over a white tee"
    }
  },
  {
    "id": "anchor-08-c",
    "version": 3,
    "bucket": "anchor",
    "slot": 8,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He rests his forearms loosely on his thighs after sitting, then reacts to a quiet joke from the photographer. Use a 3:4 waist-up snapshot with ordinary depth throughout the setting. Friend-taken iPhone 15 Pro, 48mm equivalent, no Portrait Mode. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. Show distance-appropriate facial detail, flyaway hairs, and fabric creases; no synthetic blur, glamour glow, or facial reshaping.",
    "locations": {
      "urban": "a warm brick side-street wall",
      "outdoorsy": "a weathered visitor-center wall",
      "homebody": "a simple home courtyard wall"
    },
    "outfits": {
      "casual": "an olive overshirt over a charcoal tee",
      "sharp": "a fitted navy polo with chinos",
      "street": "a washed black denim jacket over a white tee"
    }
  },
  {
    "id": "anchor-09-a",
    "version": 3,
    "bucket": "anchor",
    "slot": 9,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. A breeze moves his hair as he lifts one hand to clear it from his eyes, and the photographer catches the smile that follows. Compose a 3:4 head-and-shoulders portrait with the face unobstructed. Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Broad indirect daylight gives soft highlight rolloff and restrained background separation. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights; no smoothing, reshaping, or sharpened pores.",
    "locations": {
      "urban": "a warm brick side-street wall",
      "outdoorsy": "a weathered visitor-center wall",
      "homebody": "a simple home courtyard wall"
    },
    "outfits": {
      "casual": "an olive overshirt over a charcoal tee",
      "sharp": "a fitted navy polo with chinos",
      "street": "a washed black denim jacket over a white tee"
    }
  },
  {
    "id": "anchor-09-b",
    "version": 3,
    "bucket": "anchor",
    "slot": 9,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He lowers his hand after adjusting his hair, turns back toward the speaker, and listens with a relaxed expression. Frame a 3:4 close portrait at eye level with ears and hairline intact. Canon R5, 85mm, f/2, 1/320, ISO 400. Soft side light and wall bounce keep both eyes clear without flattening the face. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff; avoid beauty filters and waxy retouching.",
    "locations": {
      "urban": "a warm brick side-street wall",
      "outdoorsy": "a weathered visitor-center wall",
      "homebody": "a simple home courtyard wall"
    },
    "outfits": {
      "casual": "an olive overshirt over a charcoal tee",
      "sharp": "a fitted navy polo with chinos",
      "street": "a washed black denim jacket over a white tee"
    }
  },
  {
    "id": "anchor-09-c",
    "version": 3,
    "bucket": "anchor",
    "slot": 9,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He steps beneath the trees, brushes one loose strand back, and laughs when the wind immediately moves it again. Use a 3:4 chest-up snapshot with a little breathing room beside him. Friend-taken iPhone 15 Pro, 48mm equivalent, no Portrait Mode. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. Show distance-appropriate facial detail, flyaway hairs, and fabric creases; no synthetic blur, glamour glow, or facial reshaping.",
    "locations": {
      "urban": "a warm brick side-street wall",
      "outdoorsy": "a weathered visitor-center wall",
      "homebody": "a simple home courtyard wall"
    },
    "outfits": {
      "casual": "an olive overshirt over a charcoal tee",
      "sharp": "a fitted navy polo with chinos",
      "street": "a washed black denim jacket over a white tee"
    }
  },
  {
    "id": "anchor-10-a",
    "version": 3,
    "bucket": "anchor",
    "slot": 10,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He pauses inside the bright interior after entering from the street and looks toward the photographer while his eyes adjust. Compose a 3:4 three-quarter portrait that shows natural posture and clothing fit. Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Broad indirect daylight gives soft highlight rolloff and restrained background separation. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights; no smoothing, reshaping, or sharpened pores.",
    "locations": {
      "urban": "a modern museum courtyard",
      "outdoorsy": "a botanical-garden path",
      "homebody": "a covered residential stoop"
    },
    "outfits": {
      "casual": "a soft grey sweatshirt and dark jeans",
      "sharp": "a camel field jacket over a black knit",
      "street": "a vintage navy chore coat over a plain tee"
    }
  },
  {
    "id": "anchor-10-b",
    "version": 3,
    "bucket": "anchor",
    "slot": 10,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He turns away from the window, rests one hand on its ledge, and replies to something the photographer has just said. Frame a 3:4 half-body portrait with modest environmental context. Canon R5, 85mm, f/2, 1/320, ISO 400. Soft side light and wall bounce keep both eyes clear without flattening the face. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff; avoid beauty filters and waxy retouching.",
    "locations": {
      "urban": "a modern museum courtyard",
      "outdoorsy": "a botanical-garden path",
      "homebody": "a covered residential stoop"
    },
    "outfits": {
      "casual": "a soft grey sweatshirt and dark jeans",
      "sharp": "a camel field jacket over a black knit",
      "street": "a vintage navy chore coat over a plain tee"
    }
  },
  {
    "id": "anchor-10-c",
    "version": 3,
    "bucket": "anchor",
    "slot": 10,
    "variant": "c",
    "aspectRatio": "9:16",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He crosses the atrium, slows beside the glass, and looks back when the photographer points out the light. Use a 9:16 full-body portrait without wide-angle stretching. Friend-taken iPhone 15 Pro, 48mm equivalent, no Portrait Mode. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. Show distance-appropriate facial detail, flyaway hairs, and fabric creases; no synthetic blur, glamour glow, or facial reshaping.",
    "locations": {
      "urban": "a modern museum courtyard",
      "outdoorsy": "a botanical-garden path",
      "homebody": "a covered residential stoop"
    },
    "outfits": {
      "casual": "a soft grey sweatshirt and dark jeans",
      "sharp": "a camel field jacket over a black knit",
      "street": "a vintage navy chore coat over a plain tee"
    }
  },
  {
    "id": "anchor-11-a",
    "version": 3,
    "bucket": "anchor",
    "slot": 11,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He begins to walk toward the exit, remembers one last comment, and turns back before his trailing foot has settled. Compose a 3:4 chest-up portrait at eye level with relaxed headroom. Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Broad indirect daylight gives soft highlight rolloff and restrained background separation. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights; no smoothing, reshaping, or sharpened pores.",
    "locations": {
      "urban": "a modern museum courtyard",
      "outdoorsy": "a botanical-garden path",
      "homebody": "a covered residential stoop"
    },
    "outfits": {
      "casual": "a soft grey sweatshirt and dark jeans",
      "sharp": "a camel field jacket over a black knit",
      "street": "a vintage navy chore coat over a plain tee"
    }
  },
  {
    "id": "anchor-11-b",
    "version": 3,
    "bucket": "anchor",
    "slot": 11,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He steps into the courtyard, hears the photographer behind him, and rotates only enough to reconnect with the conversation. Frame a 3:4 waist-up portrait from just beside the photographer's conversation line. Canon R5, 85mm, f/2, 1/320, ISO 400. Soft side light and wall bounce keep both eyes clear without flattening the face. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff; avoid beauty filters and waxy retouching.",
    "locations": {
      "urban": "a modern museum courtyard",
      "outdoorsy": "a botanical-garden path",
      "homebody": "a covered residential stoop"
    },
    "outfits": {
      "casual": "a soft grey sweatshirt and dark jeans",
      "sharp": "a camel field jacket over a black knit",
      "street": "a vintage navy chore coat over a plain tee"
    }
  },
  {
    "id": "anchor-11-c",
    "version": 3,
    "bucket": "anchor",
    "slot": 11,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He passes through the pale arcade and glances back with a smile that arrives before his body stops. Use a 3:4 friend-taken medium portrait with slightly imperfect but intentional framing. Friend-taken iPhone 15 Pro, 48mm equivalent, no Portrait Mode. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. Show distance-appropriate facial detail, flyaway hairs, and fabric creases; no synthetic blur, glamour glow, or facial reshaping.",
    "locations": {
      "urban": "a modern museum courtyard",
      "outdoorsy": "a botanical-garden path",
      "homebody": "a covered residential stoop"
    },
    "outfits": {
      "casual": "a soft grey sweatshirt and dark jeans",
      "sharp": "a camel field jacket over a black knit",
      "street": "a vintage navy chore coat over a plain tee"
    }
  },
  {
    "id": "anchor-12-a",
    "version": 3,
    "bucket": "anchor",
    "slot": 12,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He rests one hand near his chin while listening, then lowers it as he answers and looks directly at the photographer. Compose a 3:4 waist-up portrait from seated eye height, keeping both hands visible. Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Broad indirect daylight gives soft highlight rolloff and restrained background separation. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights; no smoothing, reshaping, or sharpened pores.",
    "locations": {
      "urban": "a modern museum courtyard",
      "outdoorsy": "a botanical-garden path",
      "homebody": "a covered residential stoop"
    },
    "outfits": {
      "casual": "a soft grey sweatshirt and dark jeans",
      "sharp": "a camel field jacket over a black knit",
      "street": "a vintage navy chore coat over a plain tee"
    }
  },
  {
    "id": "anchor-12-b",
    "version": 3,
    "bucket": "anchor",
    "slot": 12,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He sits beside the warm lamp, considers the question for a moment, and smiles before beginning his reply. Frame a 3:4 chest-up portrait with his face on the upper third. Canon R5, 85mm, f/2, 1/320, ISO 400. Soft side light and wall bounce keep both eyes clear without flattening the face. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff; avoid beauty filters and waxy retouching.",
    "locations": {
      "urban": "a modern museum courtyard",
      "outdoorsy": "a botanical-garden path",
      "homebody": "a covered residential stoop"
    },
    "outfits": {
      "casual": "a soft grey sweatshirt and dark jeans",
      "sharp": "a camel field jacket over a black knit",
      "street": "a vintage navy chore coat over a plain tee"
    }
  },
  {
    "id": "anchor-12-c",
    "version": 3,
    "bucket": "anchor",
    "slot": 12,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He turns from the window, props one forearm lightly on the table, and meets the camera with an unforced thoughtful expression. Use a 3:4 knee-up portrait from a natural conversational distance. Friend-taken iPhone 15 Pro, 48mm equivalent, no Portrait Mode. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. Show distance-appropriate facial detail, flyaway hairs, and fabric creases; no synthetic blur, glamour glow, or facial reshaping.",
    "locations": {
      "urban": "a modern museum courtyard",
      "outdoorsy": "a botanical-garden path",
      "homebody": "a covered residential stoop"
    },
    "outfits": {
      "casual": "a soft grey sweatshirt and dark jeans",
      "sharp": "a camel field jacket over a black knit",
      "street": "a vintage navy chore coat over a plain tee"
    }
  },
  {
    "id": "anchor-13-a",
    "version": 3,
    "bucket": "anchor",
    "slot": 13,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He leans on the railing to take in the view, hears the photographer approach, and turns his head while both forearms remain supported. Compose a 3:4 half-body portrait with his torso angled slightly through the frame. Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Broad indirect daylight gives soft highlight rolloff and restrained background separation. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights; no smoothing, reshaping, or sharpened pores.",
    "locations": {
      "urban": "a quiet city coffee-bar window",
      "outdoorsy": "a mountain-town bakery window",
      "homebody": "a sunlit kitchen breakfast nook"
    },
    "outfits": {
      "casual": "a white tee beneath a relaxed flannel",
      "sharp": "a crisp white shirt with sleeves rolled",
      "street": "a boxy dark chore jacket over a fitted tee"
    }
  },
  {
    "id": "anchor-13-b",
    "version": 3,
    "bucket": "anchor",
    "slot": 13,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He finishes pointing out something in the distance, lowers his hand to the rail, and smiles back toward his companion. Frame a 3:4 three-quarter portrait from waist height without elongating the body. Canon R5, 85mm, f/2, 1/320, ISO 400. Soft side light and wall bounce keep both eyes clear without flattening the face. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff; avoid beauty filters and waxy retouching.",
    "locations": {
      "urban": "a quiet city coffee-bar window",
      "outdoorsy": "a mountain-town bakery window",
      "homebody": "a sunlit kitchen breakfast nook"
    },
    "outfits": {
      "casual": "a white tee beneath a relaxed flannel",
      "sharp": "a crisp white shirt with sleeves rolled",
      "street": "a boxy dark chore jacket over a fitted tee"
    }
  },
  {
    "id": "anchor-13-c",
    "version": 3,
    "bucket": "anchor",
    "slot": 13,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He rests at the overlook for a moment, then looks over one shoulder when the photographer asks what he sees. Use a 3:4 waist-up snapshot with ordinary depth throughout the setting. Friend-taken iPhone 15 Pro, 48mm equivalent, no Portrait Mode. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. Show distance-appropriate facial detail, flyaway hairs, and fabric creases; no synthetic blur, glamour glow, or facial reshaping.",
    "locations": {
      "urban": "a quiet city coffee-bar window",
      "outdoorsy": "a mountain-town bakery window",
      "homebody": "a sunlit kitchen breakfast nook"
    },
    "outfits": {
      "casual": "a white tee beneath a relaxed flannel",
      "sharp": "a crisp white shirt with sleeves rolled",
      "street": "a boxy dark chore jacket over a fitted tee"
    }
  },
  {
    "id": "anchor-14-a",
    "version": 3,
    "bucket": "anchor",
    "slot": 14,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He steps into the late light, narrows his eyes briefly, and smiles when the photographer moves into the shade. Compose a 3:4 head-and-shoulders portrait with the face unobstructed. Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Broad indirect daylight gives soft highlight rolloff and restrained background separation. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights; no smoothing, reshaping, or sharpened pores.",
    "locations": {
      "urban": "a quiet city coffee-bar window",
      "outdoorsy": "a mountain-town bakery window",
      "homebody": "a sunlit kitchen breakfast nook"
    },
    "outfits": {
      "casual": "a white tee beneath a relaxed flannel",
      "sharp": "a crisp white shirt with sleeves rolled",
      "street": "a boxy dark chore jacket over a fitted tee"
    }
  },
  {
    "id": "anchor-14-b",
    "version": 3,
    "bucket": "anchor",
    "slot": 14,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He turns his face away from the brightest edge of the sun and relaxes into an easy expression. Frame a 3:4 close portrait at eye level with ears and hairline intact. Canon R5, 85mm, f/2, 1/320, ISO 400. Soft side light and wall bounce keep both eyes clear without flattening the face. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff; avoid beauty filters and waxy retouching.",
    "locations": {
      "urban": "a quiet city coffee-bar window",
      "outdoorsy": "a mountain-town bakery window",
      "homebody": "a sunlit kitchen breakfast nook"
    },
    "outfits": {
      "casual": "a white tee beneath a relaxed flannel",
      "sharp": "a crisp white shirt with sleeves rolled",
      "street": "a boxy dark chore jacket over a fitted tee"
    }
  },
  {
    "id": "anchor-14-c",
    "version": 3,
    "bucket": "anchor",
    "slot": 14,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He pauses where the warm light reaches his jacket, listens to a comment, and lets a small smile unfold. Use a 3:4 chest-up snapshot with a little breathing room beside him. Friend-taken iPhone 15 Pro, 48mm equivalent, no Portrait Mode. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. Show distance-appropriate facial detail, flyaway hairs, and fabric creases; no synthetic blur, glamour glow, or facial reshaping.",
    "locations": {
      "urban": "a quiet city coffee-bar window",
      "outdoorsy": "a mountain-town bakery window",
      "homebody": "a sunlit kitchen breakfast nook"
    },
    "outfits": {
      "casual": "a white tee beneath a relaxed flannel",
      "sharp": "a crisp white shirt with sleeves rolled",
      "street": "a boxy dark chore jacket over a fitted tee"
    }
  },
  {
    "id": "anchor-15-a",
    "version": 3,
    "bucket": "anchor",
    "slot": 15,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He has just greeted the photographer, brings his hands loosely together after the handshake, and keeps a warm direct gaze. Compose a 3:4 three-quarter portrait that shows natural posture and clothing fit. Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Broad indirect daylight gives soft highlight rolloff and restrained background separation. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights; no smoothing, reshaping, or sharpened pores.",
    "locations": {
      "urban": "a quiet city coffee-bar window",
      "outdoorsy": "a mountain-town bakery window",
      "homebody": "a sunlit kitchen breakfast nook"
    },
    "outfits": {
      "casual": "a white tee beneath a relaxed flannel",
      "sharp": "a crisp white shirt with sleeves rolled",
      "street": "a boxy dark chore jacket over a fitted tee"
    }
  },
  {
    "id": "anchor-15-b",
    "version": 3,
    "bucket": "anchor",
    "slot": 15,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He stops near the garden entrance, listens with his head slightly angled, and smiles without arranging his body for the camera. Frame a 3:4 half-body portrait with modest environmental context. Canon R5, 85mm, f/2, 1/320, ISO 400. Soft side light and wall bounce keep both eyes clear without flattening the face. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff; avoid beauty filters and waxy retouching.",
    "locations": {
      "urban": "a quiet city coffee-bar window",
      "outdoorsy": "a mountain-town bakery window",
      "homebody": "a sunlit kitchen breakfast nook"
    },
    "outfits": {
      "casual": "a white tee beneath a relaxed flannel",
      "sharp": "a crisp white shirt with sleeves rolled",
      "street": "a boxy dark chore jacket over a fitted tee"
    }
  },
  {
    "id": "anchor-15-c",
    "version": 3,
    "bucket": "anchor",
    "slot": 15,
    "variant": "c",
    "aspectRatio": "9:16",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He steps out of the courtyard doorway, recognizes the photographer, and smiles before continuing toward him. Use a 9:16 full-body portrait without wide-angle stretching. Friend-taken iPhone 15 Pro, 48mm equivalent, no Portrait Mode. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. Show distance-appropriate facial detail, flyaway hairs, and fabric creases; no synthetic blur, glamour glow, or facial reshaping.",
    "locations": {
      "urban": "a quiet city coffee-bar window",
      "outdoorsy": "a mountain-town bakery window",
      "homebody": "a sunlit kitchen breakfast nook"
    },
    "outfits": {
      "casual": "a white tee beneath a relaxed flannel",
      "sharp": "a crisp white shirt with sleeves rolled",
      "street": "a boxy dark chore jacket over a fitted tee"
    }
  },
  {
    "id": "anchor-16-a",
    "version": 3,
    "bucket": "anchor",
    "slot": 16,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He sits on the low wall to retie one shoe, finishes, and remains there for a moment while looking up at the photographer. Compose a 3:4 chest-up portrait at eye level with relaxed headroom. Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Broad indirect daylight gives soft highlight rolloff and restrained background separation. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights; no smoothing, reshaping, or sharpened pores.",
    "locations": {
      "urban": "a glass-and-stone city walkway",
      "outdoorsy": "a riverside promenade",
      "homebody": "a calm neighborhood sidewalk"
    },
    "outfits": {
      "casual": "a cream knit sweater with dark jeans",
      "sharp": "a charcoal overshirt over a fine knit",
      "street": "a dark bomber over a grey tee"
    }
  },
  {
    "id": "anchor-16-b",
    "version": 3,
    "bucket": "anchor",
    "slot": 16,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He shifts along the wall to make space, crosses one ankle naturally, and reacts to something said off camera. Frame a 3:4 waist-up portrait from just beside the photographer's conversation line. Canon R5, 85mm, f/2, 1/320, ISO 400. Soft side light and wall bounce keep both eyes clear without flattening the face. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff; avoid beauty filters and waxy retouching.",
    "locations": {
      "urban": "a glass-and-stone city walkway",
      "outdoorsy": "a riverside promenade",
      "homebody": "a calm neighborhood sidewalk"
    },
    "outfits": {
      "casual": "a cream knit sweater with dark jeans",
      "sharp": "a charcoal overshirt over a fine knit",
      "street": "a dark bomber over a grey tee"
    }
  },
  {
    "id": "anchor-16-c",
    "version": 3,
    "bucket": "anchor",
    "slot": 16,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He rests on the step after walking, places both hands beside him for support, and turns toward the continuing conversation. Use a 3:4 friend-taken medium portrait with slightly imperfect but intentional framing. Friend-taken iPhone 15 Pro, 48mm equivalent, no Portrait Mode. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. Show distance-appropriate facial detail, flyaway hairs, and fabric creases; no synthetic blur, glamour glow, or facial reshaping.",
    "locations": {
      "urban": "a glass-and-stone city walkway",
      "outdoorsy": "a riverside promenade",
      "homebody": "a calm neighborhood sidewalk"
    },
    "outfits": {
      "casual": "a cream knit sweater with dark jeans",
      "sharp": "a charcoal overshirt over a fine knit",
      "street": "a dark bomber over a grey tee"
    }
  },
  {
    "id": "anchor-17-a",
    "version": 3,
    "bucket": "anchor",
    "slot": 17,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He finishes speaking beside the tall window and holds the residual half-smile while the photographer responds. Compose a 3:4 waist-up portrait from seated eye height, keeping both hands visible. Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Broad indirect daylight gives soft highlight rolloff and restrained background separation. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights; no smoothing, reshaping, or sharpened pores.",
    "locations": {
      "urban": "a glass-and-stone city walkway",
      "outdoorsy": "a riverside promenade",
      "homebody": "a calm neighborhood sidewalk"
    },
    "outfits": {
      "casual": "a cream knit sweater with dark jeans",
      "sharp": "a charcoal overshirt over a fine knit",
      "street": "a dark bomber over a grey tee"
    }
  },
  {
    "id": "anchor-17-b",
    "version": 3,
    "bucket": "anchor",
    "slot": 17,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He looks through the glass for a moment, turns back to answer a question, and keeps his attention on the photographer. Frame a 3:4 chest-up portrait with his face on the upper third. Canon R5, 85mm, f/2, 1/320, ISO 400. Soft side light and wall bounce keep both eyes clear without flattening the face. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff; avoid beauty filters and waxy retouching.",
    "locations": {
      "urban": "a glass-and-stone city walkway",
      "outdoorsy": "a riverside promenade",
      "homebody": "a calm neighborhood sidewalk"
    },
    "outfits": {
      "casual": "a cream knit sweater with dark jeans",
      "sharp": "a charcoal overshirt over a fine knit",
      "street": "a dark bomber over a grey tee"
    }
  },
  {
    "id": "anchor-17-c",
    "version": 3,
    "bucket": "anchor",
    "slot": 17,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He pauses near the atrium window, laughs softly at a correction, and lets his shoulders settle as the moment passes. Use a 3:4 knee-up portrait from a natural conversational distance. Friend-taken iPhone 15 Pro, 48mm equivalent, no Portrait Mode. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. Show distance-appropriate facial detail, flyaway hairs, and fabric creases; no synthetic blur, glamour glow, or facial reshaping.",
    "locations": {
      "urban": "a glass-and-stone city walkway",
      "outdoorsy": "a riverside promenade",
      "homebody": "a calm neighborhood sidewalk"
    },
    "outfits": {
      "casual": "a cream knit sweater with dark jeans",
      "sharp": "a charcoal overshirt over a fine knit",
      "street": "a dark bomber over a grey tee"
    }
  },
  {
    "id": "anchor-18-a",
    "version": 3,
    "bucket": "anchor",
    "slot": 18,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. A light breeze catches his open jacket, so he draws one side closer and looks toward the photographer before releasing it. Compose a 3:4 half-body portrait with his torso angled slightly through the frame. Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Broad indirect daylight gives soft highlight rolloff and restrained background separation. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights; no smoothing, reshaping, or sharpened pores.",
    "locations": {
      "urban": "a glass-and-stone city walkway",
      "outdoorsy": "a riverside promenade",
      "homebody": "a calm neighborhood sidewalk"
    },
    "outfits": {
      "casual": "a cream knit sweater with dark jeans",
      "sharp": "a charcoal overshirt over a fine knit",
      "street": "a dark bomber over a grey tee"
    }
  },
  {
    "id": "anchor-18-b",
    "version": 3,
    "bucket": "anchor",
    "slot": 18,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He steps out onto the terrace, checks the weather with a quick glance, and smiles at the photographer's reaction. Frame a 3:4 three-quarter portrait from waist height without elongating the body. Canon R5, 85mm, f/2, 1/320, ISO 400. Soft side light and wall bounce keep both eyes clear without flattening the face. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff; avoid beauty filters and waxy retouching.",
    "locations": {
      "urban": "a glass-and-stone city walkway",
      "outdoorsy": "a riverside promenade",
      "homebody": "a calm neighborhood sidewalk"
    },
    "outfits": {
      "casual": "a cream knit sweater with dark jeans",
      "sharp": "a charcoal overshirt over a fine knit",
      "street": "a dark bomber over a grey tee"
    }
  },
  {
    "id": "anchor-18-c",
    "version": 3,
    "bucket": "anchor",
    "slot": 18,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He turns into the wind, holds the collar briefly away from his face, and keeps walking as the photograph is made. Use a 3:4 waist-up snapshot with ordinary depth throughout the setting. Friend-taken iPhone 15 Pro, 48mm equivalent, no Portrait Mode. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. Show distance-appropriate facial detail, flyaway hairs, and fabric creases; no synthetic blur, glamour glow, or facial reshaping.",
    "locations": {
      "urban": "a glass-and-stone city walkway",
      "outdoorsy": "a riverside promenade",
      "homebody": "a calm neighborhood sidewalk"
    },
    "outfits": {
      "casual": "a cream knit sweater with dark jeans",
      "sharp": "a charcoal overshirt over a fine knit",
      "street": "a dark bomber over a grey tee"
    }
  },
  {
    "id": "anchor-19-a",
    "version": 3,
    "bucket": "anchor",
    "slot": 19,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He waits near the window before the café opens, turns from the street, and gives the photographer a quietly amused look. Compose a 3:4 head-and-shoulders portrait with the face unobstructed. Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Broad indirect daylight gives soft highlight rolloff and restrained background separation. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights; no smoothing, reshaping, or sharpened pores.",
    "locations": {
      "urban": "a minimalist hotel-lobby alcove",
      "outdoorsy": "a bright nature-center interior",
      "homebody": "a clean apartment entry"
    },
    "outfits": {
      "casual": "a dark green henley and black jeans",
      "sharp": "a navy merino polo with tailored trousers",
      "street": "a clean black hoodie under a denim jacket"
    }
  },
  {
    "id": "anchor-19-b",
    "version": 3,
    "bucket": "anchor",
    "slot": 19,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He leans back only long enough to hear the end of a story, then looks forward with a contained smile. Frame a 3:4 close portrait at eye level with ears and hairline intact. Canon R5, 85mm, f/2, 1/320, ISO 400. Soft side light and wall bounce keep both eyes clear without flattening the face. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff; avoid beauty filters and waxy retouching.",
    "locations": {
      "urban": "a minimalist hotel-lobby alcove",
      "outdoorsy": "a bright nature-center interior",
      "homebody": "a clean apartment entry"
    },
    "outfits": {
      "casual": "a dark green henley and black jeans",
      "sharp": "a navy merino polo with tailored trousers",
      "street": "a clean black hoodie under a denim jacket"
    }
  },
  {
    "id": "anchor-19-c",
    "version": 3,
    "bucket": "anchor",
    "slot": 19,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He steps away from the glass after checking outside and meets the camera with relaxed self-awareness. Use a 3:4 chest-up snapshot with a little breathing room beside him. Friend-taken iPhone 15 Pro, 48mm equivalent, no Portrait Mode. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. Show distance-appropriate facial detail, flyaway hairs, and fabric creases; no synthetic blur, glamour glow, or facial reshaping.",
    "locations": {
      "urban": "a minimalist hotel-lobby alcove",
      "outdoorsy": "a bright nature-center interior",
      "homebody": "a clean apartment entry"
    },
    "outfits": {
      "casual": "a dark green henley and black jeans",
      "sharp": "a navy merino polo with tailored trousers",
      "street": "a clean black hoodie under a denim jacket"
    }
  },
  {
    "id": "anchor-20-a",
    "version": 3,
    "bucket": "anchor",
    "slot": 20,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He crosses the square toward the photographer, begins to respond to someone beside them, and looks back mid-step. Compose a 3:4 three-quarter portrait that shows natural posture and clothing fit. Fujifilm GFX 100S, 80mm, f/2.8, 1/250, ISO 200. Broad indirect daylight gives soft highlight rolloff and restrained background separation. Retain tonal variation, faint under-eye texture, varied beard density, and natural highlights; no smoothing, reshaping, or sharpened pores.",
    "locations": {
      "urban": "a minimalist hotel-lobby alcove",
      "outdoorsy": "a bright nature-center interior",
      "homebody": "a clean apartment entry"
    },
    "outfits": {
      "casual": "a dark green henley and black jeans",
      "sharp": "a navy merino polo with tailored trousers",
      "street": "a clean black hoodie under a denim jacket"
    }
  },
  {
    "id": "anchor-20-b",
    "version": 3,
    "bucket": "anchor",
    "slot": 20,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He reaches the end of the courtyard path, slows rather than posing, and smiles at the photographer's final comment. Frame a 3:4 half-body portrait with modest environmental context. Canon R5, 85mm, f/2, 1/320, ISO 400. Soft side light and wall bounce keep both eyes clear without flattening the face. Keep real skin microtexture, grooming irregularities, soft highlight rolloff, and believable focus falloff; avoid beauty filters and waxy retouching.",
    "locations": {
      "urban": "a minimalist hotel-lobby alcove",
      "outdoorsy": "a bright nature-center interior",
      "homebody": "a clean apartment entry"
    },
    "outfits": {
      "casual": "a dark green henley and black jeans",
      "sharp": "a navy merino polo with tailored trousers",
      "street": "a clean black hoodie under a denim jacket"
    }
  },
  {
    "id": "anchor-20-c",
    "version": 3,
    "bucket": "anchor",
    "slot": 20,
    "variant": "c",
    "aspectRatio": "9:16",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He turns away to continue walking, hears one last joke, and looks back over his shoulder with easy confidence. Use a 9:16 full-body portrait without wide-angle stretching. Friend-taken iPhone 15 Pro, 48mm equivalent, no Portrait Mode. Restrained HDR, slight exposure variation, and ordinary background detail keep it believable. Show distance-appropriate facial detail, flyaway hairs, and fabric creases; no synthetic blur, glamour glow, or facial reshaping.",
    "locations": {
      "urban": "a minimalist hotel-lobby alcove",
      "outdoorsy": "a bright nature-center interior",
      "homebody": "a clean apartment entry"
    },
    "outfits": {
      "casual": "a dark green henley and black jeans",
      "sharp": "a navy merino polo with tailored trousers",
      "street": "a clean black hoodie under a denim jacket"
    }
  },
  {
    "id": "social-01-a",
    "version": 3,
    "bucket": "social",
    "slot": 1,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He leans back after delivering the punch line while two visibly different friends react around the table. Compose a 4:3 waist-up documentary frame from across the table. Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. Spread grain across the frame, not only skin. Keep companions distinct, fingers believable, natural shine, and no beauty-filter smoothing.",
    "locations": {
      "urban": "a lively city bistro terrace",
      "outdoorsy": "a lodge restaurant deck",
      "homebody": "a neighborhood dinner patio"
    },
    "outfits": {
      "casual": "a navy henley and dark jeans",
      "sharp": "a light-blue oxford with sleeves rolled",
      "street": "a dark bomber over a white tee"
    }
  },
  {
    "id": "social-01-b",
    "version": 3,
    "bucket": "social",
    "slot": 1,
    "variant": "b",
    "aspectRatio": "4:3",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He listens to a friend across the table, tries not to laugh, and finally gives in as the photographer raises the camera. Frame a 4:3 compact-camera snapshot from a neighboring seat. Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Modest direct flash lifts the face while darker ambient light leaves crisp natural shadows. Direct flash reveals honest texture and small highlights. Keep hands, glasses, and companion identities coherent without glamour retouching.",
    "locations": {
      "urban": "a lively city bistro terrace",
      "outdoorsy": "a lodge restaurant deck",
      "homebody": "a neighborhood dinner patio"
    },
    "outfits": {
      "casual": "a navy henley and dark jeans",
      "sharp": "a light-blue oxford with sleeves rolled",
      "street": "a dark bomber over a white tee"
    }
  },
  {
    "id": "social-01-c",
    "version": 3,
    "bucket": "social",
    "slot": 1,
    "variant": "c",
    "aspectRatio": "4:3",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He passes a shared plate to one friend and looks toward another as the conversation breaks into laughter. Use a 4:3 friend-taken medium shot from conversational distance. Friend-taken iPhone 15 Pro, 35mm equivalent, no Portrait Mode. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. Preserve distance-appropriate facial detail, slight gesture motion, distinct companions, and ordinary phone texture without plastic sharpening.",
    "locations": {
      "urban": "a lively city bistro terrace",
      "outdoorsy": "a lodge restaurant deck",
      "homebody": "a neighborhood dinner patio"
    },
    "outfits": {
      "casual": "a navy henley and dark jeans",
      "sharp": "a light-blue oxford with sleeves rolled",
      "street": "a dark bomber over a white tee"
    }
  },
  {
    "id": "social-02-a",
    "version": 3,
    "bucket": "social",
    "slot": 2,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He lowers his coffee after taking a sip and looks toward a friend who has just arrived at the patio. Compose a 4:3 medium frame from the edge of the conversation. Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. Spread grain across the frame, not only skin. Keep companions distinct, fingers believable, natural shine, and no beauty-filter smoothing.",
    "locations": {
      "urban": "a lively city bistro terrace",
      "outdoorsy": "a lodge restaurant deck",
      "homebody": "a neighborhood dinner patio"
    },
    "outfits": {
      "casual": "a navy henley and dark jeans",
      "sharp": "a light-blue oxford with sleeves rolled",
      "street": "a dark bomber over a white tee"
    }
  },
  {
    "id": "social-02-b",
    "version": 3,
    "bucket": "social",
    "slot": 2,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He slides a chair out for a visibly different friend, remains half standing, and smiles at their greeting. Frame a 3:4 knee-up flash photograph with comfortable space around each person. Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Modest direct flash lifts the face while darker ambient light leaves crisp natural shadows. Direct flash reveals honest texture and small highlights. Keep hands, glasses, and companion identities coherent without glamour retouching.",
    "locations": {
      "urban": "a lively city bistro terrace",
      "outdoorsy": "a lodge restaurant deck",
      "homebody": "a neighborhood dinner patio"
    },
    "outfits": {
      "casual": "a navy henley and dark jeans",
      "sharp": "a light-blue oxford with sleeves rolled",
      "street": "a dark bomber over a white tee"
    }
  },
  {
    "id": "social-02-c",
    "version": 3,
    "bucket": "social",
    "slot": 2,
    "variant": "c",
    "aspectRatio": "4:3",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He sets his cup down to answer a question, one hand still near the saucer while the group listens. Use a 4:3 waist-up snapshot with the social setting still readable. Friend-taken iPhone 15 Pro, 35mm equivalent, no Portrait Mode. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. Preserve distance-appropriate facial detail, slight gesture motion, distinct companions, and ordinary phone texture without plastic sharpening.",
    "locations": {
      "urban": "a lively city bistro terrace",
      "outdoorsy": "a lodge restaurant deck",
      "homebody": "a neighborhood dinner patio"
    },
    "outfits": {
      "casual": "a navy henley and dark jeans",
      "sharp": "a light-blue oxford with sleeves rolled",
      "street": "a dark bomber over a white tee"
    }
  },
  {
    "id": "social-03-a",
    "version": 3,
    "bucket": "social",
    "slot": 3,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He raises a small glass toward two distinct friends, makes brief eye contact with them, and smiles before taking a sip. Compose a 4:3 three-quarter frame that keeps companions secondary. Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. Spread grain across the frame, not only skin. Keep companions distinct, fingers believable, natural shine, and no beauty-filter smoothing.",
    "locations": {
      "urban": "a lively city bistro terrace",
      "outdoorsy": "a lodge restaurant deck",
      "homebody": "a neighborhood dinner patio"
    },
    "outfits": {
      "casual": "a navy henley and dark jeans",
      "sharp": "a light-blue oxford with sleeves rolled",
      "street": "a dark bomber over a white tee"
    }
  },
  {
    "id": "social-03-b",
    "version": 3,
    "bucket": "social",
    "slot": 3,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He responds to a toast by lifting his glass only slightly, keeping the gathering relaxed rather than performative. Frame a 3:4 waist-up snapshot with his face nearest the visual center. Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Modest direct flash lifts the face while darker ambient light leaves crisp natural shadows. Direct flash reveals honest texture and small highlights. Keep hands, glasses, and companion identities coherent without glamour retouching.",
    "locations": {
      "urban": "a lively city bistro terrace",
      "outdoorsy": "a lodge restaurant deck",
      "homebody": "a neighborhood dinner patio"
    },
    "outfits": {
      "casual": "a navy henley and dark jeans",
      "sharp": "a light-blue oxford with sleeves rolled",
      "street": "a dark bomber over a white tee"
    }
  },
  {
    "id": "social-03-c",
    "version": 3,
    "bucket": "social",
    "slot": 3,
    "variant": "c",
    "aspectRatio": "4:3",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He sets one drink beside his plate and laughs at a friend whose shoulder remains softly in the foreground. Use a 4:3 three-quarter candid with companions placed naturally around him. Friend-taken iPhone 15 Pro, 35mm equivalent, no Portrait Mode. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. Preserve distance-appropriate facial detail, slight gesture motion, distinct companions, and ordinary phone texture without plastic sharpening.",
    "locations": {
      "urban": "a lively city bistro terrace",
      "outdoorsy": "a lodge restaurant deck",
      "homebody": "a neighborhood dinner patio"
    },
    "outfits": {
      "casual": "a navy henley and dark jeans",
      "sharp": "a light-blue oxford with sleeves rolled",
      "street": "a dark bomber over a white tee"
    }
  },
  {
    "id": "social-04-a",
    "version": 3,
    "bucket": "social",
    "slot": 4,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He rests one forearm on the bar while a different-looking friend finishes a story, then turns with a residual smile. Compose a 3:4 chest-up frame through a small amount of foreground context. Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. Spread grain across the frame, not only skin. Keep companions distinct, fingers believable, natural shine, and no beauty-filter smoothing.",
    "locations": {
      "urban": "a sidewalk coffee patio",
      "outdoorsy": "a trail-town café terrace",
      "homebody": "a local bakery patio"
    },
    "outfits": {
      "casual": "an olive overshirt over a grey tee",
      "sharp": "a relaxed charcoal blazer over a white tee",
      "street": "a washed denim jacket over a black knit"
    }
  },
  {
    "id": "social-04-b",
    "version": 3,
    "bucket": "social",
    "slot": 4,
    "variant": "b",
    "aspectRatio": "4:3",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He receives two drinks from the server, passes one to a friend, and looks back when the photographer says his name. Frame a 4:3 medium photograph with hands and table objects fully supported. Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Modest direct flash lifts the face while darker ambient light leaves crisp natural shadows. Direct flash reveals honest texture and small highlights. Keep hands, glasses, and companion identities coherent without glamour retouching.",
    "locations": {
      "urban": "a sidewalk coffee patio",
      "outdoorsy": "a trail-town café terrace",
      "homebody": "a local bakery patio"
    },
    "outfits": {
      "casual": "an olive overshirt over a grey tee",
      "sharp": "a relaxed charcoal blazer over a white tee",
      "street": "a washed denim jacket over a black knit"
    }
  },
  {
    "id": "social-04-c",
    "version": 3,
    "bucket": "social",
    "slot": 4,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He steps away from the counter to rejoin the group and reacts to a comment before he reaches the table. Use a 3:4 chest-up candid with one soft foreground shoulder for context. Friend-taken iPhone 15 Pro, 35mm equivalent, no Portrait Mode. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. Preserve distance-appropriate facial detail, slight gesture motion, distinct companions, and ordinary phone texture without plastic sharpening.",
    "locations": {
      "urban": "a sidewalk coffee patio",
      "outdoorsy": "a trail-town café terrace",
      "homebody": "a local bakery patio"
    },
    "outfits": {
      "casual": "an olive overshirt over a grey tee",
      "sharp": "a relaxed charcoal blazer over a white tee",
      "street": "a washed denim jacket over a black knit"
    }
  },
  {
    "id": "social-05-a",
    "version": 3,
    "bucket": "social",
    "slot": 5,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He sits at the edge of the patio bench, looks toward a friend outside the frame, and laughs before settling back. Compose a 4:3 environmental frame that clearly explains the gathering. Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. Spread grain across the frame, not only skin. Keep companions distinct, fingers believable, natural shine, and no beauty-filter smoothing.",
    "locations": {
      "urban": "a sidewalk coffee patio",
      "outdoorsy": "a trail-town café terrace",
      "homebody": "a local bakery patio"
    },
    "outfits": {
      "casual": "an olive overshirt over a grey tee",
      "sharp": "a relaxed charcoal blazer over a white tee",
      "street": "a washed denim jacket over a black knit"
    }
  },
  {
    "id": "social-05-b",
    "version": 3,
    "bucket": "social",
    "slot": 5,
    "variant": "b",
    "aspectRatio": "9:16",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He shifts along the bench to make space for a distinct companion and keeps smiling as their conversation resumes. Frame a 9:16 full-body flash photograph without crowding the edges. Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Modest direct flash lifts the face while darker ambient light leaves crisp natural shadows. Direct flash reveals honest texture and small highlights. Keep hands, glasses, and companion identities coherent without glamour retouching.",
    "locations": {
      "urban": "a sidewalk coffee patio",
      "outdoorsy": "a trail-town café terrace",
      "homebody": "a local bakery patio"
    },
    "outfits": {
      "casual": "an olive overshirt over a grey tee",
      "sharp": "a relaxed charcoal blazer over a white tee",
      "street": "a washed denim jacket over a black knit"
    }
  },
  {
    "id": "social-05-c",
    "version": 3,
    "bucket": "social",
    "slot": 5,
    "variant": "c",
    "aspectRatio": "9:16",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He leans forward to hear a story over the patio noise, then looks up with an open amused expression. Use a 9:16 full-body candid that preserves ordinary movement. Friend-taken iPhone 15 Pro, 35mm equivalent, no Portrait Mode. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. Preserve distance-appropriate facial detail, slight gesture motion, distinct companions, and ordinary phone texture without plastic sharpening.",
    "locations": {
      "urban": "a sidewalk coffee patio",
      "outdoorsy": "a trail-town café terrace",
      "homebody": "a local bakery patio"
    },
    "outfits": {
      "casual": "an olive overshirt over a grey tee",
      "sharp": "a relaxed charcoal blazer over a white tee",
      "street": "a washed denim jacket over a black knit"
    }
  },
  {
    "id": "social-06-a",
    "version": 3,
    "bucket": "social",
    "slot": 6,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He gestures naturally with one hand while speaking, keeps a small glass low in the other, and maintains eye contact with a friend. Compose a 4:3 waist-up documentary frame from across the table. Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. Spread grain across the frame, not only skin. Keep companions distinct, fingers believable, natural shine, and no beauty-filter smoothing.",
    "locations": {
      "urban": "a sidewalk coffee patio",
      "outdoorsy": "a trail-town café terrace",
      "homebody": "a local bakery patio"
    },
    "outfits": {
      "casual": "an olive overshirt over a grey tee",
      "sharp": "a relaxed charcoal blazer over a white tee",
      "street": "a washed denim jacket over a black knit"
    }
  },
  {
    "id": "social-06-b",
    "version": 3,
    "bucket": "social",
    "slot": 6,
    "variant": "b",
    "aspectRatio": "4:3",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He finishes explaining something to two distinct companions and lowers both hands as they respond. Frame a 4:3 compact-camera snapshot from a neighboring seat. Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Modest direct flash lifts the face while darker ambient light leaves crisp natural shadows. Direct flash reveals honest texture and small highlights. Keep hands, glasses, and companion identities coherent without glamour retouching.",
    "locations": {
      "urban": "a sidewalk coffee patio",
      "outdoorsy": "a trail-town café terrace",
      "homebody": "a local bakery patio"
    },
    "outfits": {
      "casual": "an olive overshirt over a grey tee",
      "sharp": "a relaxed charcoal blazer over a white tee",
      "street": "a washed denim jacket over a black knit"
    }
  },
  {
    "id": "social-06-c",
    "version": 3,
    "bucket": "social",
    "slot": 6,
    "variant": "c",
    "aspectRatio": "4:3",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He turns from one friend to another while telling a story, and the photographer catches the engaged expression between sentences. Use a 4:3 friend-taken medium shot from conversational distance. Friend-taken iPhone 15 Pro, 35mm equivalent, no Portrait Mode. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. Preserve distance-appropriate facial detail, slight gesture motion, distinct companions, and ordinary phone texture without plastic sharpening.",
    "locations": {
      "urban": "a sidewalk coffee patio",
      "outdoorsy": "a trail-town café terrace",
      "homebody": "a local bakery patio"
    },
    "outfits": {
      "casual": "an olive overshirt over a grey tee",
      "sharp": "a relaxed charcoal blazer over a white tee",
      "street": "a washed denim jacket over a black knit"
    }
  },
  {
    "id": "social-07-a",
    "version": 3,
    "bucket": "social",
    "slot": 7,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He leaves the table to greet someone arriving through the open doors and looks back when his friends call after him. Compose a 4:3 medium frame from the edge of the conversation. Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. Spread grain across the frame, not only skin. Keep companions distinct, fingers believable, natural shine, and no beauty-filter smoothing.",
    "locations": {
      "urban": "a rooftop dinner table",
      "outdoorsy": "a lakeside restaurant deck",
      "homebody": "a backyard supper table"
    },
    "outfits": {
      "casual": "a dark knit polo",
      "sharp": "a white open-collar shirt beneath a navy jacket",
      "street": "a black suede jacket over a cream tee"
    }
  },
  {
    "id": "social-07-b",
    "version": 3,
    "bucket": "social",
    "slot": 7,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He returns from the counter carrying one small plate, turns toward the table, and smiles at the ongoing conversation. Frame a 3:4 knee-up flash photograph with comfortable space around each person. Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Modest direct flash lifts the face while darker ambient light leaves crisp natural shadows. Direct flash reveals honest texture and small highlights. Keep hands, glasses, and companion identities coherent without glamour retouching.",
    "locations": {
      "urban": "a rooftop dinner table",
      "outdoorsy": "a lakeside restaurant deck",
      "homebody": "a backyard supper table"
    },
    "outfits": {
      "casual": "a dark knit polo",
      "sharp": "a white open-collar shirt beneath a navy jacket",
      "street": "a black suede jacket over a cream tee"
    }
  },
  {
    "id": "social-07-c",
    "version": 3,
    "bucket": "social",
    "slot": 7,
    "variant": "c",
    "aspectRatio": "4:3",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He steps onto the patio after holding the door for a visibly different friend and reacts to something said behind him. Use a 4:3 waist-up snapshot with the social setting still readable. Friend-taken iPhone 15 Pro, 35mm equivalent, no Portrait Mode. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. Preserve distance-appropriate facial detail, slight gesture motion, distinct companions, and ordinary phone texture without plastic sharpening.",
    "locations": {
      "urban": "a rooftop dinner table",
      "outdoorsy": "a lakeside restaurant deck",
      "homebody": "a backyard supper table"
    },
    "outfits": {
      "casual": "a dark knit polo",
      "sharp": "a white open-collar shirt beneath a navy jacket",
      "street": "a black suede jacket over a cream tee"
    }
  },
  {
    "id": "social-08-a",
    "version": 3,
    "bucket": "social",
    "slot": 8,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He settles comfortably into the booth after making room for two friends and smiles across the table. Compose a 4:3 three-quarter frame that keeps companions secondary. Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. Spread grain across the frame, not only skin. Keep companions distinct, fingers believable, natural shine, and no beauty-filter smoothing.",
    "locations": {
      "urban": "a rooftop dinner table",
      "outdoorsy": "a lakeside restaurant deck",
      "homebody": "a backyard supper table"
    },
    "outfits": {
      "casual": "a dark knit polo",
      "sharp": "a white open-collar shirt beneath a navy jacket",
      "street": "a black suede jacket over a cream tee"
    }
  },
  {
    "id": "social-08-b",
    "version": 3,
    "bucket": "social",
    "slot": 8,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He rests one arm along the back of the booth while listening, then looks toward the photographer with an easy expression. Frame a 3:4 waist-up snapshot with his face nearest the visual center. Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Modest direct flash lifts the face while darker ambient light leaves crisp natural shadows. Direct flash reveals honest texture and small highlights. Keep hands, glasses, and companion identities coherent without glamour retouching.",
    "locations": {
      "urban": "a rooftop dinner table",
      "outdoorsy": "a lakeside restaurant deck",
      "homebody": "a backyard supper table"
    },
    "outfits": {
      "casual": "a dark knit polo",
      "sharp": "a white open-collar shirt beneath a navy jacket",
      "street": "a black suede jacket over a cream tee"
    }
  },
  {
    "id": "social-08-c",
    "version": 3,
    "bucket": "social",
    "slot": 8,
    "variant": "c",
    "aspectRatio": "4:3",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He slides a menu toward a friend, leans back after the gesture, and laughs when they object to his recommendation. Use a 4:3 three-quarter candid with companions placed naturally around him. Friend-taken iPhone 15 Pro, 35mm equivalent, no Portrait Mode. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. Preserve distance-appropriate facial detail, slight gesture motion, distinct companions, and ordinary phone texture without plastic sharpening.",
    "locations": {
      "urban": "a rooftop dinner table",
      "outdoorsy": "a lakeside restaurant deck",
      "homebody": "a backyard supper table"
    },
    "outfits": {
      "casual": "a dark knit polo",
      "sharp": "a white open-collar shirt beneath a navy jacket",
      "street": "a black suede jacket over a cream tee"
    }
  },
  {
    "id": "social-09-a",
    "version": 3,
    "bucket": "social",
    "slot": 9,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He walks between tables toward a group of distinct friends and turns his head as one of them calls to him. Compose a 3:4 chest-up frame through a small amount of foreground context. Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. Spread grain across the frame, not only skin. Keep companions distinct, fingers believable, natural shine, and no beauty-filter smoothing.",
    "locations": {
      "urban": "a rooftop dinner table",
      "outdoorsy": "a lakeside restaurant deck",
      "homebody": "a backyard supper table"
    },
    "outfits": {
      "casual": "a dark knit polo",
      "sharp": "a white open-collar shirt beneath a navy jacket",
      "street": "a black suede jacket over a cream tee"
    }
  },
  {
    "id": "social-09-b",
    "version": 3,
    "bucket": "social",
    "slot": 9,
    "variant": "b",
    "aspectRatio": "4:3",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He carries two coffees carefully through the terrace, spots the table, and smiles before setting them down. Frame a 4:3 medium photograph with hands and table objects fully supported. Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Modest direct flash lifts the face while darker ambient light leaves crisp natural shadows. Direct flash reveals honest texture and small highlights. Keep hands, glasses, and companion identities coherent without glamour retouching.",
    "locations": {
      "urban": "a rooftop dinner table",
      "outdoorsy": "a lakeside restaurant deck",
      "homebody": "a backyard supper table"
    },
    "outfits": {
      "casual": "a dark knit polo",
      "sharp": "a white open-collar shirt beneath a navy jacket",
      "street": "a black suede jacket over a cream tee"
    }
  },
  {
    "id": "social-09-c",
    "version": 3,
    "bucket": "social",
    "slot": 9,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He steps around an occupied chair while continuing a conversation with a friend walking beside him. Use a 3:4 chest-up candid with one soft foreground shoulder for context. Friend-taken iPhone 15 Pro, 35mm equivalent, no Portrait Mode. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. Preserve distance-appropriate facial detail, slight gesture motion, distinct companions, and ordinary phone texture without plastic sharpening.",
    "locations": {
      "urban": "a rooftop dinner table",
      "outdoorsy": "a lakeside restaurant deck",
      "homebody": "a backyard supper table"
    },
    "outfits": {
      "casual": "a dark knit polo",
      "sharp": "a white open-collar shirt beneath a navy jacket",
      "street": "a black suede jacket over a cream tee"
    }
  },
  {
    "id": "social-10-a",
    "version": 3,
    "bucket": "social",
    "slot": 10,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He keeps one drink low near the table and laughs at a friend's comment while city lights remain behind the group. Compose a 4:3 environmental frame that clearly explains the gathering. Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. Spread grain across the frame, not only skin. Keep companions distinct, fingers believable, natural shine, and no beauty-filter smoothing.",
    "locations": {
      "urban": "a restrained cocktail lounge",
      "outdoorsy": "a lodge common-room bar",
      "homebody": "a neighborhood pub counter"
    },
    "outfits": {
      "casual": "a textured cream crewneck",
      "sharp": "a fitted navy shirt with sleeves rolled",
      "street": "a vintage dark chore coat over a tee"
    }
  },
  {
    "id": "social-10-b",
    "version": 3,
    "bucket": "social",
    "slot": 10,
    "variant": "b",
    "aspectRatio": "9:16",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He reaches across to return a bottle opener, draws his hand back, and smiles toward the conversation. Frame a 9:16 full-body flash photograph without crowding the edges. Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Modest direct flash lifts the face while darker ambient light leaves crisp natural shadows. Direct flash reveals honest texture and small highlights. Keep hands, glasses, and companion identities coherent without glamour retouching.",
    "locations": {
      "urban": "a restrained cocktail lounge",
      "outdoorsy": "a lodge common-room bar",
      "homebody": "a neighborhood pub counter"
    },
    "outfits": {
      "casual": "a textured cream crewneck",
      "sharp": "a fitted navy shirt with sleeves rolled",
      "street": "a vintage dark chore coat over a tee"
    }
  },
  {
    "id": "social-10-c",
    "version": 3,
    "bucket": "social",
    "slot": 10,
    "variant": "c",
    "aspectRatio": "9:16",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He stands beside the rooftop table, listens to a distinct friend, and reacts with a genuine soft laugh. Use a 9:16 full-body candid that preserves ordinary movement. Friend-taken iPhone 15 Pro, 35mm equivalent, no Portrait Mode. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. Preserve distance-appropriate facial detail, slight gesture motion, distinct companions, and ordinary phone texture without plastic sharpening.",
    "locations": {
      "urban": "a restrained cocktail lounge",
      "outdoorsy": "a lodge common-room bar",
      "homebody": "a neighborhood pub counter"
    },
    "outfits": {
      "casual": "a textured cream crewneck",
      "sharp": "a fitted navy shirt with sleeves rolled",
      "street": "a vintage dark chore coat over a tee"
    }
  },
  {
    "id": "social-11-a",
    "version": 3,
    "bucket": "social",
    "slot": 11,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He leans closer to hear one friend while another continues speaking, then turns with an animated but natural response. Compose a 4:3 waist-up documentary frame from across the table. Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. Spread grain across the frame, not only skin. Keep companions distinct, fingers believable, natural shine, and no beauty-filter smoothing.",
    "locations": {
      "urban": "a restrained cocktail lounge",
      "outdoorsy": "a lodge common-room bar",
      "homebody": "a neighborhood pub counter"
    },
    "outfits": {
      "casual": "a textured cream crewneck",
      "sharp": "a fitted navy shirt with sleeves rolled",
      "street": "a vintage dark chore coat over a tee"
    }
  },
  {
    "id": "social-11-b",
    "version": 3,
    "bucket": "social",
    "slot": 11,
    "variant": "b",
    "aspectRatio": "4:3",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He joins the edge of a group conversation, recognizes the subject, and smiles before adding his own comment. Frame a 4:3 compact-camera snapshot from a neighboring seat. Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Modest direct flash lifts the face while darker ambient light leaves crisp natural shadows. Direct flash reveals honest texture and small highlights. Keep hands, glasses, and companion identities coherent without glamour retouching.",
    "locations": {
      "urban": "a restrained cocktail lounge",
      "outdoorsy": "a lodge common-room bar",
      "homebody": "a neighborhood pub counter"
    },
    "outfits": {
      "casual": "a textured cream crewneck",
      "sharp": "a fitted navy shirt with sleeves rolled",
      "street": "a vintage dark chore coat over a tee"
    }
  },
  {
    "id": "social-11-c",
    "version": 3,
    "bucket": "social",
    "slot": 11,
    "variant": "c",
    "aspectRatio": "4:3",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He shifts his chair toward two visibly different companions and listens with an attentive, amused expression. Use a 4:3 friend-taken medium shot from conversational distance. Friend-taken iPhone 15 Pro, 35mm equivalent, no Portrait Mode. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. Preserve distance-appropriate facial detail, slight gesture motion, distinct companions, and ordinary phone texture without plastic sharpening.",
    "locations": {
      "urban": "a restrained cocktail lounge",
      "outdoorsy": "a lodge common-room bar",
      "homebody": "a neighborhood pub counter"
    },
    "outfits": {
      "casual": "a textured cream crewneck",
      "sharp": "a fitted navy shirt with sleeves rolled",
      "street": "a vintage dark chore coat over a tee"
    }
  },
  {
    "id": "social-12-a",
    "version": 3,
    "bucket": "social",
    "slot": 12,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He sits outside after the event with two friends, looks up from catching his breath, and shares a tired happy grin. Compose a 4:3 medium frame from the edge of the conversation. Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. Spread grain across the frame, not only skin. Keep companions distinct, fingers believable, natural shine, and no beauty-filter smoothing.",
    "locations": {
      "urban": "a restrained cocktail lounge",
      "outdoorsy": "a lodge common-room bar",
      "homebody": "a neighborhood pub counter"
    },
    "outfits": {
      "casual": "a textured cream crewneck",
      "sharp": "a fitted navy shirt with sleeves rolled",
      "street": "a vintage dark chore coat over a tee"
    }
  },
  {
    "id": "social-12-b",
    "version": 3,
    "bucket": "social",
    "slot": 12,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He lowers himself onto the curb beside a distinct friend and laughs at their recap of what just happened. Frame a 3:4 knee-up flash photograph with comfortable space around each person. Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Modest direct flash lifts the face while darker ambient light leaves crisp natural shadows. Direct flash reveals honest texture and small highlights. Keep hands, glasses, and companion identities coherent without glamour retouching.",
    "locations": {
      "urban": "a restrained cocktail lounge",
      "outdoorsy": "a lodge common-room bar",
      "homebody": "a neighborhood pub counter"
    },
    "outfits": {
      "casual": "a textured cream crewneck",
      "sharp": "a fitted navy shirt with sleeves rolled",
      "street": "a vintage dark chore coat over a tee"
    }
  },
  {
    "id": "social-12-c",
    "version": 3,
    "bucket": "social",
    "slot": 12,
    "variant": "c",
    "aspectRatio": "4:3",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He waits outside the venue for the group, checks the doorway, and smiles when his friends finally appear. Use a 4:3 waist-up snapshot with the social setting still readable. Friend-taken iPhone 15 Pro, 35mm equivalent, no Portrait Mode. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. Preserve distance-appropriate facial detail, slight gesture motion, distinct companions, and ordinary phone texture without plastic sharpening.",
    "locations": {
      "urban": "a restrained cocktail lounge",
      "outdoorsy": "a lodge common-room bar",
      "homebody": "a neighborhood pub counter"
    },
    "outfits": {
      "casual": "a textured cream crewneck",
      "sharp": "a fitted navy shirt with sleeves rolled",
      "street": "a vintage dark chore coat over a tee"
    }
  },
  {
    "id": "social-13-a",
    "version": 3,
    "bucket": "social",
    "slot": 13,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He begins clapping at a friend's story, stops after one beat, and laughs with his head returning naturally forward. Compose a 4:3 three-quarter frame that keeps companions secondary. Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. Spread grain across the frame, not only skin. Keep companions distinct, fingers believable, natural shine, and no beauty-filter smoothing.",
    "locations": {
      "urban": "an urban park café bench",
      "outdoorsy": "a scenic picnic overlook bench",
      "homebody": "a shared courtyard bench"
    },
    "outfits": {
      "casual": "a grey crewneck and clean sneakers",
      "sharp": "a navy polo with tailored chinos",
      "street": "a bomber jacket over a black tee"
    }
  },
  {
    "id": "social-13-b",
    "version": 3,
    "bucket": "social",
    "slot": 13,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He reacts to an unexpected joke with both hands still near the table and a genuine open laugh. Frame a 3:4 waist-up snapshot with his face nearest the visual center. Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Modest direct flash lifts the face while darker ambient light leaves crisp natural shadows. Direct flash reveals honest texture and small highlights. Keep hands, glasses, and companion identities coherent without glamour retouching.",
    "locations": {
      "urban": "an urban park café bench",
      "outdoorsy": "a scenic picnic overlook bench",
      "homebody": "a shared courtyard bench"
    },
    "outfits": {
      "casual": "a grey crewneck and clean sneakers",
      "sharp": "a navy polo with tailored chinos",
      "street": "a bomber jacket over a black tee"
    }
  },
  {
    "id": "social-13-c",
    "version": 3,
    "bucket": "social",
    "slot": 13,
    "variant": "c",
    "aspectRatio": "4:3",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He turns from the speaker toward a friend beside him and shares the laughter without looking for the camera. Use a 4:3 three-quarter candid with companions placed naturally around him. Friend-taken iPhone 15 Pro, 35mm equivalent, no Portrait Mode. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. Preserve distance-appropriate facial detail, slight gesture motion, distinct companions, and ordinary phone texture without plastic sharpening.",
    "locations": {
      "urban": "an urban park café bench",
      "outdoorsy": "a scenic picnic overlook bench",
      "homebody": "a shared courtyard bench"
    },
    "outfits": {
      "casual": "a grey crewneck and clean sneakers",
      "sharp": "a navy polo with tailored chinos",
      "street": "a bomber jacket over a black tee"
    }
  },
  {
    "id": "social-14-a",
    "version": 3,
    "bucket": "social",
    "slot": 14,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He reaches for the menu, pauses when a friend asks a question, and looks up with an interested smile. Compose a 3:4 chest-up frame through a small amount of foreground context. Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. Spread grain across the frame, not only skin. Keep companions distinct, fingers believable, natural shine, and no beauty-filter smoothing.",
    "locations": {
      "urban": "an urban park café bench",
      "outdoorsy": "a scenic picnic overlook bench",
      "homebody": "a shared courtyard bench"
    },
    "outfits": {
      "casual": "a grey crewneck and clean sneakers",
      "sharp": "a navy polo with tailored chinos",
      "street": "a bomber jacket over a black tee"
    }
  },
  {
    "id": "social-14-b",
    "version": 3,
    "bucket": "social",
    "slot": 14,
    "variant": "b",
    "aspectRatio": "4:3",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He passes the menu to a distinct companion, keeps one hand on the table, and listens to their choice. Frame a 4:3 medium photograph with hands and table objects fully supported. Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Modest direct flash lifts the face while darker ambient light leaves crisp natural shadows. Direct flash reveals honest texture and small highlights. Keep hands, glasses, and companion identities coherent without glamour retouching.",
    "locations": {
      "urban": "an urban park café bench",
      "outdoorsy": "a scenic picnic overlook bench",
      "homebody": "a shared courtyard bench"
    },
    "outfits": {
      "casual": "a grey crewneck and clean sneakers",
      "sharp": "a navy polo with tailored chinos",
      "street": "a bomber jacket over a black tee"
    }
  },
  {
    "id": "social-14-c",
    "version": 3,
    "bucket": "social",
    "slot": 14,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He closes the menu after deciding, sets it aside, and rejoins the conversation across the brunch table. Use a 3:4 chest-up candid with one soft foreground shoulder for context. Friend-taken iPhone 15 Pro, 35mm equivalent, no Portrait Mode. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. Preserve distance-appropriate facial detail, slight gesture motion, distinct companions, and ordinary phone texture without plastic sharpening.",
    "locations": {
      "urban": "an urban park café bench",
      "outdoorsy": "a scenic picnic overlook bench",
      "homebody": "a shared courtyard bench"
    },
    "outfits": {
      "casual": "a grey crewneck and clean sneakers",
      "sharp": "a navy polo with tailored chinos",
      "street": "a bomber jacket over a black tee"
    }
  },
  {
    "id": "social-15-a",
    "version": 3,
    "bucket": "social",
    "slot": 15,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He stands at the high-top table, uses one hand to clarify a story, and keeps his attention on two distinct friends. Compose a 4:3 environmental frame that clearly explains the gathering. Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. Spread grain across the frame, not only skin. Keep companions distinct, fingers believable, natural shine, and no beauty-filter smoothing.",
    "locations": {
      "urban": "an urban park café bench",
      "outdoorsy": "a scenic picnic overlook bench",
      "homebody": "a shared courtyard bench"
    },
    "outfits": {
      "casual": "a grey crewneck and clean sneakers",
      "sharp": "a navy polo with tailored chinos",
      "street": "a bomber jacket over a black tee"
    }
  },
  {
    "id": "social-15-b",
    "version": 3,
    "bucket": "social",
    "slot": 15,
    "variant": "b",
    "aspectRatio": "9:16",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He shifts a small plate aside to make room, then turns toward a companion with an animated expression. Frame a 9:16 full-body flash photograph without crowding the edges. Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Modest direct flash lifts the face while darker ambient light leaves crisp natural shadows. Direct flash reveals honest texture and small highlights. Keep hands, glasses, and companion identities coherent without glamour retouching.",
    "locations": {
      "urban": "an urban park café bench",
      "outdoorsy": "a scenic picnic overlook bench",
      "homebody": "a shared courtyard bench"
    },
    "outfits": {
      "casual": "a grey crewneck and clean sneakers",
      "sharp": "a navy polo with tailored chinos",
      "street": "a bomber jacket over a black tee"
    }
  },
  {
    "id": "social-15-c",
    "version": 3,
    "bucket": "social",
    "slot": 15,
    "variant": "c",
    "aspectRatio": "9:16",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He arrives at the high-top, places his phone face down, and smiles as the group brings him into the conversation. Use a 9:16 full-body candid that preserves ordinary movement. Friend-taken iPhone 15 Pro, 35mm equivalent, no Portrait Mode. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. Preserve distance-appropriate facial detail, slight gesture motion, distinct companions, and ordinary phone texture without plastic sharpening.",
    "locations": {
      "urban": "an urban park café bench",
      "outdoorsy": "a scenic picnic overlook bench",
      "homebody": "a shared courtyard bench"
    },
    "outfits": {
      "casual": "a grey crewneck and clean sneakers",
      "sharp": "a navy polo with tailored chinos",
      "street": "a bomber jacket over a black tee"
    }
  },
  {
    "id": "social-16-a",
    "version": 3,
    "bucket": "social",
    "slot": 16,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He lifts a glass toward a friend in the last warm light, holds the brief eye contact, and lowers it naturally. Compose a 4:3 waist-up documentary frame from across the table. Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. Spread grain across the frame, not only skin. Keep companions distinct, fingers believable, natural shine, and no beauty-filter smoothing.",
    "locations": {
      "urban": "a modern restaurant lounge",
      "outdoorsy": "a rustic lodge common room",
      "homebody": "an apartment dinner gathering"
    },
    "outfits": {
      "casual": "a soft grey henley",
      "sharp": "a pale-blue oxford with sleeves rolled",
      "street": "a dark chore jacket over a white tee"
    }
  },
  {
    "id": "social-16-b",
    "version": 3,
    "bucket": "social",
    "slot": 16,
    "variant": "b",
    "aspectRatio": "4:3",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He joins a small toast without extending his arm toward the lens and smiles at the person opposite him. Frame a 4:3 compact-camera snapshot from a neighboring seat. Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Modest direct flash lifts the face while darker ambient light leaves crisp natural shadows. Direct flash reveals honest texture and small highlights. Keep hands, glasses, and companion identities coherent without glamour retouching.",
    "locations": {
      "urban": "a modern restaurant lounge",
      "outdoorsy": "a rustic lodge common room",
      "homebody": "an apartment dinner gathering"
    },
    "outfits": {
      "casual": "a soft grey henley",
      "sharp": "a pale-blue oxford with sleeves rolled",
      "street": "a dark chore jacket over a white tee"
    }
  },
  {
    "id": "social-16-c",
    "version": 3,
    "bucket": "social",
    "slot": 16,
    "variant": "c",
    "aspectRatio": "4:3",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He passes a glass to a distinct friend, keeps his own near the table, and laughs at their thanks. Use a 4:3 friend-taken medium shot from conversational distance. Friend-taken iPhone 15 Pro, 35mm equivalent, no Portrait Mode. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. Preserve distance-appropriate facial detail, slight gesture motion, distinct companions, and ordinary phone texture without plastic sharpening.",
    "locations": {
      "urban": "a modern restaurant lounge",
      "outdoorsy": "a rustic lodge common room",
      "homebody": "an apartment dinner gathering"
    },
    "outfits": {
      "casual": "a soft grey henley",
      "sharp": "a pale-blue oxford with sleeves rolled",
      "street": "a dark chore jacket over a white tee"
    }
  },
  {
    "id": "social-17-a",
    "version": 3,
    "bucket": "social",
    "slot": 17,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He sits comfortably on the outdoor sofa with his phone face down, listening closely to a friend beside the photographer. Compose a 4:3 medium frame from the edge of the conversation. Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. Spread grain across the frame, not only skin. Keep companions distinct, fingers believable, natural shine, and no beauty-filter smoothing.",
    "locations": {
      "urban": "a modern restaurant lounge",
      "outdoorsy": "a rustic lodge common room",
      "homebody": "an apartment dinner gathering"
    },
    "outfits": {
      "casual": "a soft grey henley",
      "sharp": "a pale-blue oxford with sleeves rolled",
      "street": "a dark chore jacket over a white tee"
    }
  },
  {
    "id": "social-17-b",
    "version": 3,
    "bucket": "social",
    "slot": 17,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He shifts one leg to make room for a distinct companion and remains engaged in the conversation. Frame a 3:4 knee-up flash photograph with comfortable space around each person. Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Modest direct flash lifts the face while darker ambient light leaves crisp natural shadows. Direct flash reveals honest texture and small highlights. Keep hands, glasses, and companion identities coherent without glamour retouching.",
    "locations": {
      "urban": "a modern restaurant lounge",
      "outdoorsy": "a rustic lodge common room",
      "homebody": "an apartment dinner gathering"
    },
    "outfits": {
      "casual": "a soft grey henley",
      "sharp": "a pale-blue oxford with sleeves rolled",
      "street": "a dark chore jacket over a white tee"
    }
  },
  {
    "id": "social-17-c",
    "version": 3,
    "bucket": "social",
    "slot": 17,
    "variant": "c",
    "aspectRatio": "4:3",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He rests both hands away from his phone, turns toward the speaker, and smiles at the unfolding story. Use a 4:3 waist-up snapshot with the social setting still readable. Friend-taken iPhone 15 Pro, 35mm equivalent, no Portrait Mode. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. Preserve distance-appropriate facial detail, slight gesture motion, distinct companions, and ordinary phone texture without plastic sharpening.",
    "locations": {
      "urban": "a modern restaurant lounge",
      "outdoorsy": "a rustic lodge common room",
      "homebody": "an apartment dinner gathering"
    },
    "outfits": {
      "casual": "a soft grey henley",
      "sharp": "a pale-blue oxford with sleeves rolled",
      "street": "a dark chore jacket over a white tee"
    }
  },
  {
    "id": "social-18-a",
    "version": 3,
    "bucket": "social",
    "slot": 18,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He waits against the wall while friends gather outside the venue and looks left as one of them approaches laughing. Compose a 4:3 three-quarter frame that keeps companions secondary. Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. Spread grain across the frame, not only skin. Keep companions distinct, fingers believable, natural shine, and no beauty-filter smoothing.",
    "locations": {
      "urban": "a modern restaurant lounge",
      "outdoorsy": "a rustic lodge common room",
      "homebody": "an apartment dinner gathering"
    },
    "outfits": {
      "casual": "a soft grey henley",
      "sharp": "a pale-blue oxford with sleeves rolled",
      "street": "a dark chore jacket over a white tee"
    }
  },
  {
    "id": "social-18-b",
    "version": 3,
    "bucket": "social",
    "slot": 18,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He steps away from the brick wall to greet a distinct friend and reacts before their handshake finishes. Frame a 3:4 waist-up snapshot with his face nearest the visual center. Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Modest direct flash lifts the face while darker ambient light leaves crisp natural shadows. Direct flash reveals honest texture and small highlights. Keep hands, glasses, and companion identities coherent without glamour retouching.",
    "locations": {
      "urban": "a modern restaurant lounge",
      "outdoorsy": "a rustic lodge common room",
      "homebody": "an apartment dinner gathering"
    },
    "outfits": {
      "casual": "a soft grey henley",
      "sharp": "a pale-blue oxford with sleeves rolled",
      "street": "a dark chore jacket over a white tee"
    }
  },
  {
    "id": "social-18-c",
    "version": 3,
    "bucket": "social",
    "slot": 18,
    "variant": "c",
    "aspectRatio": "4:3",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He stands near the entrance with both hands relaxed, hears the group behind him, and turns with a broad smile. Use a 4:3 three-quarter candid with companions placed naturally around him. Friend-taken iPhone 15 Pro, 35mm equivalent, no Portrait Mode. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. Preserve distance-appropriate facial detail, slight gesture motion, distinct companions, and ordinary phone texture without plastic sharpening.",
    "locations": {
      "urban": "a modern restaurant lounge",
      "outdoorsy": "a rustic lodge common room",
      "homebody": "an apartment dinner gathering"
    },
    "outfits": {
      "casual": "a soft grey henley",
      "sharp": "a pale-blue oxford with sleeves rolled",
      "street": "a dark chore jacket over a white tee"
    }
  },
  {
    "id": "social-19-a",
    "version": 3,
    "bucket": "social",
    "slot": 19,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He lowers a small serving of street food after tasting it and looks up at a friend's amused reaction. Compose a 3:4 chest-up frame through a small amount of foreground context. Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. Spread grain across the frame, not only skin. Keep companions distinct, fingers believable, natural shine, and no beauty-filter smoothing.",
    "locations": {
      "urban": "an indoor-outdoor dinner party",
      "outdoorsy": "a sheltered campground barbecue",
      "homebody": "an apartment balcony gathering"
    },
    "outfits": {
      "casual": "a navy henley and dark jeans",
      "sharp": "a light-blue oxford with sleeves rolled",
      "street": "a dark bomber over a white tee"
    }
  },
  {
    "id": "social-19-b",
    "version": 3,
    "bucket": "social",
    "slot": 19,
    "variant": "b",
    "aspectRatio": "4:3",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He offers the next bite to a distinct companion, draws the tray back carefully, and laughs at their answer. Frame a 4:3 medium photograph with hands and table objects fully supported. Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Modest direct flash lifts the face while darker ambient light leaves crisp natural shadows. Direct flash reveals honest texture and small highlights. Keep hands, glasses, and companion identities coherent without glamour retouching.",
    "locations": {
      "urban": "an indoor-outdoor dinner party",
      "outdoorsy": "a sheltered campground barbecue",
      "homebody": "an apartment balcony gathering"
    },
    "outfits": {
      "casual": "a navy henley and dark jeans",
      "sharp": "a light-blue oxford with sleeves rolled",
      "street": "a dark bomber over a white tee"
    }
  },
  {
    "id": "social-19-c",
    "version": 3,
    "bucket": "social",
    "slot": 19,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He waits beside the market stall with two friends and reacts when the vendor hands over the order. Use a 3:4 chest-up candid with one soft foreground shoulder for context. Friend-taken iPhone 15 Pro, 35mm equivalent, no Portrait Mode. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. Preserve distance-appropriate facial detail, slight gesture motion, distinct companions, and ordinary phone texture without plastic sharpening.",
    "locations": {
      "urban": "an indoor-outdoor dinner party",
      "outdoorsy": "a sheltered campground barbecue",
      "homebody": "an apartment balcony gathering"
    },
    "outfits": {
      "casual": "a navy henley and dark jeans",
      "sharp": "a light-blue oxford with sleeves rolled",
      "street": "a dark bomber over a white tee"
    }
  },
  {
    "id": "social-20-a",
    "version": 3,
    "bucket": "social",
    "slot": 20,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He exits the venue with a small group, takes two steps ahead, and looks back at a friend's final joke. Compose a 4:3 environmental frame that clearly explains the gathering. Sony A7S III, 35mm, f/2, 1/160, ISO 3200. Available venue light leaves fine grain, gentle shadow noise, and an honest evening atmosphere. Spread grain across the frame, not only skin. Keep companions distinct, fingers believable, natural shine, and no beauty-filter smoothing.",
    "locations": {
      "urban": "an indoor-outdoor dinner party",
      "outdoorsy": "a sheltered campground barbecue",
      "homebody": "an apartment balcony gathering"
    },
    "outfits": {
      "casual": "a navy henley and dark jeans",
      "sharp": "a light-blue oxford with sleeves rolled",
      "street": "a dark bomber over a white tee"
    }
  },
  {
    "id": "social-20-b",
    "version": 3,
    "bucket": "social",
    "slot": 20,
    "variant": "b",
    "aspectRatio": "9:16",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He holds the door while distinct friends pass, releases it, and follows them onto the sidewalk smiling. Frame a 9:16 full-body flash photograph without crowding the edges. Fujifilm X100V, 23mm, f/4, 1/125, ISO 800. Modest direct flash lifts the face while darker ambient light leaves crisp natural shadows. Direct flash reveals honest texture and small highlights. Keep hands, glasses, and companion identities coherent without glamour retouching.",
    "locations": {
      "urban": "an indoor-outdoor dinner party",
      "outdoorsy": "a sheltered campground barbecue",
      "homebody": "an apartment balcony gathering"
    },
    "outfits": {
      "casual": "a navy henley and dark jeans",
      "sharp": "a light-blue oxford with sleeves rolled",
      "street": "a dark bomber over a white tee"
    }
  },
  {
    "id": "social-20-c",
    "version": 3,
    "bucket": "social",
    "slot": 20,
    "variant": "c",
    "aspectRatio": "9:16",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He walks away from the entrance beside two companions and turns toward the photographer as the group keeps moving. Use a 9:16 full-body candid that preserves ordinary movement. Friend-taken iPhone 15 Pro, 35mm equivalent, no Portrait Mode. Restrained sharpening, slight hand motion, and visible venue context keep it socially real. Preserve distance-appropriate facial detail, slight gesture motion, distinct companions, and ordinary phone texture without plastic sharpening.",
    "locations": {
      "urban": "an indoor-outdoor dinner party",
      "outdoorsy": "a sheltered campground barbecue",
      "homebody": "an apartment balcony gathering"
    },
    "outfits": {
      "casual": "a navy henley and dark jeans",
      "sharp": "a light-blue oxford with sleeves rolled",
      "street": "a dark bomber over a white tee"
    }
  },
  {
    "id": "travel-01-a",
    "version": 3,
    "bucket": "travel",
    "slot": 1,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He descends the station steps, checks the platform number once, and looks toward his companion before putting the phone away. Compose a 4:3 environmental portrait with him occupying roughly half the frame. Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Documentary perspective keeps the place legible and available light natural rather than polished. Keep distance-appropriate facial detail, fabric wear, accurate hands, and plausible weather; avoid smoothing, travel-ad gloss, and artificial haze.",
    "locations": {
      "urban": "a broad station stair in a capital city",
      "outdoorsy": "a mountain railway stair",
      "homebody": "a regional station stair"
    },
    "outfits": {
      "casual": "a navy overshirt with dark jeans",
      "sharp": "a camel coat over a black knit",
      "street": "a dark bomber over a plain tee"
    }
  },
  {
    "id": "travel-01-b",
    "version": 3,
    "bucket": "travel",
    "slot": 1,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He pauses beside the departure board with a compact weekender, finds the route, and smiles back toward the photographer. Frame a 3:4 waist-up lifestyle portrait at eye level. Canon R5, 50mm, f/2.8, 1/320, ISO 200. Directional daylight gives clean facial detail and moderate separation without postcard gloss. Retain complexion variation, beard detail, clothing folds, and believable focus falloff without beauty retouching or excessive blur.",
    "locations": {
      "urban": "a broad station stair in a capital city",
      "outdoorsy": "a mountain railway stair",
      "homebody": "a regional station stair"
    },
    "outfits": {
      "casual": "a navy overshirt with dark jeans",
      "sharp": "a camel coat over a black knit",
      "street": "a dark bomber over a plain tee"
    }
  },
  {
    "id": "travel-01-c",
    "version": 3,
    "bucket": "travel",
    "slot": 1,
    "variant": "c",
    "aspectRatio": "4:3",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He reaches the bottom of the station stair, shifts the bag in one hand, and turns when his name is called. Use a 4:3 environmental portrait with layered foreground, subject, and distance. Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. Preserve gentle skin texture, tonal variation, accurate scale, and environmental detail; avoid luxury-ad surfaces and facial reshaping.",
    "locations": {
      "urban": "a broad station stair in a capital city",
      "outdoorsy": "a mountain railway stair",
      "homebody": "a regional station stair"
    },
    "outfits": {
      "casual": "a navy overshirt with dark jeans",
      "sharp": "a camel coat over a black knit",
      "street": "a dark bomber over a plain tee"
    }
  },
  {
    "id": "travel-02-a",
    "version": 3,
    "bucket": "travel",
    "slot": 2,
    "variant": "a",
    "aspectRatio": "9:16",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He walks along the coastal path, raises one hand against the low sun, and laughs when the wind defeats the gesture. Compose a 9:16 full-body documentary frame with straight architectural lines. Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Documentary perspective keeps the place legible and available light natural rather than polished. Keep distance-appropriate facial detail, fabric wear, accurate hands, and plausible weather; avoid smoothing, travel-ad gloss, and artificial haze.",
    "locations": {
      "urban": "a broad station stair in a capital city",
      "outdoorsy": "a mountain railway stair",
      "homebody": "a regional station stair"
    },
    "outfits": {
      "casual": "a navy overshirt with dark jeans",
      "sharp": "a camel coat over a black knit",
      "street": "a dark bomber over a plain tee"
    }
  },
  {
    "id": "travel-02-b",
    "version": 3,
    "bucket": "travel",
    "slot": 2,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He stops where the path opens to the water, turns from the view, and shares the discovery with the photographer. Frame a 3:4 three-quarter portrait with moderate environmental separation. Canon R5, 50mm, f/2.8, 1/320, ISO 200. Directional daylight gives clean facial detail and moderate separation without postcard gloss. Retain complexion variation, beard detail, clothing folds, and believable focus falloff without beauty retouching or excessive blur.",
    "locations": {
      "urban": "a broad station stair in a capital city",
      "outdoorsy": "a mountain railway stair",
      "homebody": "a regional station stair"
    },
    "outfits": {
      "casual": "a navy overshirt with dark jeans",
      "sharp": "a camel coat over a black knit",
      "street": "a dark bomber over a plain tee"
    }
  },
  {
    "id": "travel-02-c",
    "version": 3,
    "bucket": "travel",
    "slot": 2,
    "variant": "c",
    "aspectRatio": "4:3",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He continues beside the shoreline with his jacket moving in the wind and looks back without breaking stride. Use a 4:3 half-body portrait with the setting rendered in quiet detail. Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. Preserve gentle skin texture, tonal variation, accurate scale, and environmental detail; avoid luxury-ad surfaces and facial reshaping.",
    "locations": {
      "urban": "a broad station stair in a capital city",
      "outdoorsy": "a mountain railway stair",
      "homebody": "a regional station stair"
    },
    "outfits": {
      "casual": "a navy overshirt with dark jeans",
      "sharp": "a camel coat over a black knit",
      "street": "a dark bomber over a plain tee"
    }
  },
  {
    "id": "travel-03-a",
    "version": 3,
    "bucket": "travel",
    "slot": 3,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He crosses the old-city street at an easy pace, notices a detail above the shops, and points it out before continuing. Compose a 4:3 knee-up frame that preserves the horizon and travel context. Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Documentary perspective keeps the place legible and available light natural rather than polished. Keep distance-appropriate facial detail, fabric wear, accurate hands, and plausible weather; avoid smoothing, travel-ad gloss, and artificial haze.",
    "locations": {
      "urban": "a broad station stair in a capital city",
      "outdoorsy": "a mountain railway stair",
      "homebody": "a regional station stair"
    },
    "outfits": {
      "casual": "a navy overshirt with dark jeans",
      "sharp": "a camel coat over a black knit",
      "street": "a dark bomber over a plain tee"
    }
  },
  {
    "id": "travel-03-b",
    "version": 3,
    "bucket": "travel",
    "slot": 3,
    "variant": "b",
    "aspectRatio": "9:16",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He waits at the corner for his companion, scans the unfamiliar block, and smiles when they catch up. Frame a 9:16 full-body portrait without wide-angle distortion. Canon R5, 50mm, f/2.8, 1/320, ISO 200. Directional daylight gives clean facial detail and moderate separation without postcard gloss. Retain complexion variation, beard detail, clothing folds, and believable focus falloff without beauty retouching or excessive blur.",
    "locations": {
      "urban": "a broad station stair in a capital city",
      "outdoorsy": "a mountain railway stair",
      "homebody": "a regional station stair"
    },
    "outfits": {
      "casual": "a navy overshirt with dark jeans",
      "sharp": "a camel coat over a black knit",
      "street": "a dark bomber over a plain tee"
    }
  },
  {
    "id": "travel-03-c",
    "version": 3,
    "bucket": "travel",
    "slot": 3,
    "variant": "c",
    "aspectRatio": "9:16",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He walks toward the photographer through the lane, steps around another visitor, and glances aside with quiet curiosity. Use a 9:16 full-body composition that preserves natural scale. Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. Preserve gentle skin texture, tonal variation, accurate scale, and environmental detail; avoid luxury-ad surfaces and facial reshaping.",
    "locations": {
      "urban": "a broad station stair in a capital city",
      "outdoorsy": "a mountain railway stair",
      "homebody": "a regional station stair"
    },
    "outfits": {
      "casual": "a navy overshirt with dark jeans",
      "sharp": "a camel coat over a black knit",
      "street": "a dark bomber over a plain tee"
    }
  },
  {
    "id": "travel-04-a",
    "version": 3,
    "bucket": "travel",
    "slot": 4,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He rests both forearms on the harbor rail, follows a boat across the view, and turns when the photographer approaches. Compose a 4:3 waist-up portrait with one useful foreground detail. Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Documentary perspective keeps the place legible and available light natural rather than polished. Keep distance-appropriate facial detail, fabric wear, accurate hands, and plausible weather; avoid smoothing, travel-ad gloss, and artificial haze.",
    "locations": {
      "urban": "a coastal promenade on a city break",
      "outdoorsy": "a cliff path near a seaside town",
      "homebody": "a breezy local lakeside path"
    },
    "outfits": {
      "casual": "a cream crewneck with dark chinos",
      "sharp": "a navy field jacket over a white oxford",
      "street": "a faded black chore coat over a grey tee"
    }
  },
  {
    "id": "travel-04-b",
    "version": 3,
    "bucket": "travel",
    "slot": 4,
    "variant": "b",
    "aspectRatio": "4:3",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He finishes pointing toward the distant shoreline, lowers his hand to the railing, and smiles at his companion. Frame a 4:3 chest-up portrait with the destination softly recognizable. Canon R5, 50mm, f/2.8, 1/320, ISO 200. Directional daylight gives clean facial detail and moderate separation without postcard gloss. Retain complexion variation, beard detail, clothing folds, and believable focus falloff without beauty retouching or excessive blur.",
    "locations": {
      "urban": "a coastal promenade on a city break",
      "outdoorsy": "a cliff path near a seaside town",
      "homebody": "a breezy local lakeside path"
    },
    "outfits": {
      "casual": "a cream crewneck with dark chinos",
      "sharp": "a navy field jacket over a white oxford",
      "street": "a faded black chore coat over a grey tee"
    }
  },
  {
    "id": "travel-04-c",
    "version": 3,
    "bucket": "travel",
    "slot": 4,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He pauses at the overlook to catch the wind, keeps one hand on the rail, and looks back over his shoulder. Use a 3:4 waist-up portrait with gentle medium-format separation. Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. Preserve gentle skin texture, tonal variation, accurate scale, and environmental detail; avoid luxury-ad surfaces and facial reshaping.",
    "locations": {
      "urban": "a coastal promenade on a city break",
      "outdoorsy": "a cliff path near a seaside town",
      "homebody": "a breezy local lakeside path"
    },
    "outfits": {
      "casual": "a cream crewneck with dark chinos",
      "sharp": "a navy field jacket over a white oxford",
      "street": "a faded black chore coat over a grey tee"
    }
  },
  {
    "id": "travel-05-a",
    "version": 3,
    "bucket": "travel",
    "slot": 5,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He crosses the cobblestones, hears a comment behind him, and turns his head while his body continues down the lane. Compose a 3:4 three-quarter frame from a companion's walking distance. Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Documentary perspective keeps the place legible and available light natural rather than polished. Keep distance-appropriate facial detail, fabric wear, accurate hands, and plausible weather; avoid smoothing, travel-ad gloss, and artificial haze.",
    "locations": {
      "urban": "a coastal promenade on a city break",
      "outdoorsy": "a cliff path near a seaside town",
      "homebody": "a breezy local lakeside path"
    },
    "outfits": {
      "casual": "a cream crewneck with dark chinos",
      "sharp": "a navy field jacket over a white oxford",
      "street": "a faded black chore coat over a grey tee"
    }
  },
  {
    "id": "travel-05-b",
    "version": 3,
    "bucket": "travel",
    "slot": 5,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He stops beside a shop entrance to let a group pass, then looks toward the photographer with an amused expression. Frame a 3:4 knee-up portrait that keeps hands and carried objects clear. Canon R5, 50mm, f/2.8, 1/320, ISO 200. Directional daylight gives clean facial detail and moderate separation without postcard gloss. Retain complexion variation, beard detail, clothing folds, and believable focus falloff without beauty retouching or excessive blur.",
    "locations": {
      "urban": "a coastal promenade on a city break",
      "outdoorsy": "a cliff path near a seaside town",
      "homebody": "a breezy local lakeside path"
    },
    "outfits": {
      "casual": "a cream crewneck with dark chinos",
      "sharp": "a navy field jacket over a white oxford",
      "street": "a faded black chore coat over a grey tee"
    }
  },
  {
    "id": "travel-05-c",
    "version": 3,
    "bucket": "travel",
    "slot": 5,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He walks a few steps ahead, notices that his companion has stopped, and doubles back with a relaxed smile. Use a 3:4 three-quarter portrait with balanced negative space. Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. Preserve gentle skin texture, tonal variation, accurate scale, and environmental detail; avoid luxury-ad surfaces and facial reshaping.",
    "locations": {
      "urban": "a coastal promenade on a city break",
      "outdoorsy": "a cliff path near a seaside town",
      "homebody": "a breezy local lakeside path"
    },
    "outfits": {
      "casual": "a cream crewneck with dark chinos",
      "sharp": "a navy field jacket over a white oxford",
      "street": "a faded black chore coat over a grey tee"
    }
  },
  {
    "id": "travel-06-a",
    "version": 3,
    "bucket": "travel",
    "slot": 6,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He sits on the warm stone step after walking, studies the square for a moment, and looks up when the photographer joins him. Compose a 4:3 environmental portrait with him occupying roughly half the frame. Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Documentary perspective keeps the place legible and available light natural rather than polished. Keep distance-appropriate facial detail, fabric wear, accurate hands, and plausible weather; avoid smoothing, travel-ad gloss, and artificial haze.",
    "locations": {
      "urban": "a coastal promenade on a city break",
      "outdoorsy": "a cliff path near a seaside town",
      "homebody": "a breezy local lakeside path"
    },
    "outfits": {
      "casual": "a cream crewneck with dark chinos",
      "sharp": "a navy field jacket over a white oxford",
      "street": "a faded black chore coat over a grey tee"
    }
  },
  {
    "id": "travel-06-b",
    "version": 3,
    "bucket": "travel",
    "slot": 6,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He shifts along the step to make room, places both hands beside him, and smiles as the conversation resumes. Frame a 3:4 waist-up lifestyle portrait at eye level. Canon R5, 50mm, f/2.8, 1/320, ISO 200. Directional daylight gives clean facial detail and moderate separation without postcard gloss. Retain complexion variation, beard detail, clothing folds, and believable focus falloff without beauty retouching or excessive blur.",
    "locations": {
      "urban": "a coastal promenade on a city break",
      "outdoorsy": "a cliff path near a seaside town",
      "homebody": "a breezy local lakeside path"
    },
    "outfits": {
      "casual": "a cream crewneck with dark chinos",
      "sharp": "a navy field jacket over a white oxford",
      "street": "a faded black chore coat over a grey tee"
    }
  },
  {
    "id": "travel-06-c",
    "version": 3,
    "bucket": "travel",
    "slot": 6,
    "variant": "c",
    "aspectRatio": "4:3",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He finishes checking the map, folds it away, and remains seated while looking toward the scene ahead. Use a 4:3 environmental portrait with layered foreground, subject, and distance. Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. Preserve gentle skin texture, tonal variation, accurate scale, and environmental detail; avoid luxury-ad surfaces and facial reshaping.",
    "locations": {
      "urban": "a coastal promenade on a city break",
      "outdoorsy": "a cliff path near a seaside town",
      "homebody": "a breezy local lakeside path"
    },
    "outfits": {
      "casual": "a cream crewneck with dark chinos",
      "sharp": "a navy field jacket over a white oxford",
      "street": "a faded black chore coat over a grey tee"
    }
  },
  {
    "id": "travel-07-a",
    "version": 3,
    "bucket": "travel",
    "slot": 7,
    "variant": "a",
    "aspectRatio": "9:16",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He walks the boardwalk with one hand securing his jacket, laughs into the wind, and looks toward his companion. Compose a 9:16 full-body documentary frame with straight architectural lines. Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Documentary perspective keeps the place legible and available light natural rather than polished. Keep distance-appropriate facial detail, fabric wear, accurate hands, and plausible weather; avoid smoothing, travel-ad gloss, and artificial haze.",
    "locations": {
      "urban": "a walkable old-city street",
      "outdoorsy": "a small alpine-town street",
      "homebody": "a nearby heritage-district street"
    },
    "outfits": {
      "casual": "an olive jacket over a navy henley",
      "sharp": "a charcoal overshirt over a cream knit",
      "street": "a washed denim jacket over a black tee"
    }
  },
  {
    "id": "travel-07-b",
    "version": 3,
    "bucket": "travel",
    "slot": 7,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He stops at the boardwalk rail to watch the water, turns back, and resumes walking beside the photographer. Frame a 3:4 three-quarter portrait with moderate environmental separation. Canon R5, 50mm, f/2.8, 1/320, ISO 200. Directional daylight gives clean facial detail and moderate separation without postcard gloss. Retain complexion variation, beard detail, clothing folds, and believable focus falloff without beauty retouching or excessive blur.",
    "locations": {
      "urban": "a walkable old-city street",
      "outdoorsy": "a small alpine-town street",
      "homebody": "a nearby heritage-district street"
    },
    "outfits": {
      "casual": "an olive jacket over a navy henley",
      "sharp": "a charcoal overshirt over a cream knit",
      "street": "a washed denim jacket over a black tee"
    }
  },
  {
    "id": "travel-07-c",
    "version": 3,
    "bucket": "travel",
    "slot": 7,
    "variant": "c",
    "aspectRatio": "4:3",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He steps around a damp section of timber, regains his pace, and smiles at the careful maneuver. Use a 4:3 half-body portrait with the setting rendered in quiet detail. Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. Preserve gentle skin texture, tonal variation, accurate scale, and environmental detail; avoid luxury-ad surfaces and facial reshaping.",
    "locations": {
      "urban": "a walkable old-city street",
      "outdoorsy": "a small alpine-town street",
      "homebody": "a nearby heritage-district street"
    },
    "outfits": {
      "casual": "an olive jacket over a navy henley",
      "sharp": "a charcoal overshirt over a cream knit",
      "street": "a washed denim jacket over a black tee"
    }
  },
  {
    "id": "travel-08-a",
    "version": 3,
    "bucket": "travel",
    "slot": 8,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He reaches the viewpoint, loosens one backpack strap, and looks across the distance while his breathing settles. Compose a 4:3 knee-up frame that preserves the horizon and travel context. Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Documentary perspective keeps the place legible and available light natural rather than polished. Keep distance-appropriate facial detail, fabric wear, accurate hands, and plausible weather; avoid smoothing, travel-ad gloss, and artificial haze.",
    "locations": {
      "urban": "a walkable old-city street",
      "outdoorsy": "a small alpine-town street",
      "homebody": "a nearby heritage-district street"
    },
    "outfits": {
      "casual": "an olive jacket over a navy henley",
      "sharp": "a charcoal overshirt over a cream knit",
      "street": "a washed denim jacket over a black tee"
    }
  },
  {
    "id": "travel-08-b",
    "version": 3,
    "bucket": "travel",
    "slot": 8,
    "variant": "b",
    "aspectRatio": "9:16",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He takes a drink below the frame, replaces the bottle in his pack, and turns toward the photographer with quiet satisfaction. Frame a 9:16 full-body portrait without wide-angle distortion. Canon R5, 50mm, f/2.8, 1/320, ISO 200. Directional daylight gives clean facial detail and moderate separation without postcard gloss. Retain complexion variation, beard detail, clothing folds, and believable focus falloff without beauty retouching or excessive blur.",
    "locations": {
      "urban": "a walkable old-city street",
      "outdoorsy": "a small alpine-town street",
      "homebody": "a nearby heritage-district street"
    },
    "outfits": {
      "casual": "an olive jacket over a navy henley",
      "sharp": "a charcoal overshirt over a cream knit",
      "street": "a washed denim jacket over a black tee"
    }
  },
  {
    "id": "travel-08-c",
    "version": 3,
    "bucket": "travel",
    "slot": 8,
    "variant": "c",
    "aspectRatio": "9:16",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He arrives at the overlook a step ahead, rests one hand on the strap, and points out the route they followed. Use a 9:16 full-body composition that preserves natural scale. Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. Preserve gentle skin texture, tonal variation, accurate scale, and environmental detail; avoid luxury-ad surfaces and facial reshaping.",
    "locations": {
      "urban": "a walkable old-city street",
      "outdoorsy": "a small alpine-town street",
      "homebody": "a nearby heritage-district street"
    },
    "outfits": {
      "casual": "an olive jacket over a navy henley",
      "sharp": "a charcoal overshirt over a cream knit",
      "street": "a washed denim jacket over a black tee"
    }
  },
  {
    "id": "travel-09-a",
    "version": 3,
    "bucket": "travel",
    "slot": 9,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He crosses the shaded arcade with a small bag over one shoulder, slows near the bright plaza, and looks back toward his companion. Compose a 4:3 waist-up portrait with one useful foreground detail. Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Documentary perspective keeps the place legible and available light natural rather than polished. Keep distance-appropriate facial detail, fabric wear, accurate hands, and plausible weather; avoid smoothing, travel-ad gloss, and artificial haze.",
    "locations": {
      "urban": "a walkable old-city street",
      "outdoorsy": "a small alpine-town street",
      "homebody": "a nearby heritage-district street"
    },
    "outfits": {
      "casual": "an olive jacket over a navy henley",
      "sharp": "a charcoal overshirt over a cream knit",
      "street": "a washed denim jacket over a black tee"
    }
  },
  {
    "id": "travel-09-b",
    "version": 3,
    "bucket": "travel",
    "slot": 9,
    "variant": "b",
    "aspectRatio": "4:3",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He steps from the sun into the covered walkway, lets his eyes adjust, and smiles at the sudden relief. Frame a 4:3 chest-up portrait with the destination softly recognizable. Canon R5, 50mm, f/2.8, 1/320, ISO 200. Directional daylight gives clean facial detail and moderate separation without postcard gloss. Retain complexion variation, beard detail, clothing folds, and believable focus falloff without beauty retouching or excessive blur.",
    "locations": {
      "urban": "a walkable old-city street",
      "outdoorsy": "a small alpine-town street",
      "homebody": "a nearby heritage-district street"
    },
    "outfits": {
      "casual": "an olive jacket over a navy henley",
      "sharp": "a charcoal overshirt over a cream knit",
      "street": "a washed denim jacket over a black tee"
    }
  },
  {
    "id": "travel-09-c",
    "version": 3,
    "bucket": "travel",
    "slot": 9,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He pauses beneath the arch to check the direction, folds the map, and continues toward the photographer. Use a 3:4 waist-up portrait with gentle medium-format separation. Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. Preserve gentle skin texture, tonal variation, accurate scale, and environmental detail; avoid luxury-ad surfaces and facial reshaping.",
    "locations": {
      "urban": "a walkable old-city street",
      "outdoorsy": "a small alpine-town street",
      "homebody": "a nearby heritage-district street"
    },
    "outfits": {
      "casual": "an olive jacket over a navy henley",
      "sharp": "a charcoal overshirt over a cream knit",
      "street": "a washed denim jacket over a black tee"
    }
  },
  {
    "id": "travel-10-a",
    "version": 3,
    "bucket": "travel",
    "slot": 10,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He stands at the public ferry rail, watches the wake for a moment, and half-turns when his companion speaks. Compose a 3:4 three-quarter frame from a companion's walking distance. Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Documentary perspective keeps the place legible and available light natural rather than polished. Keep distance-appropriate facial detail, fabric wear, accurate hands, and plausible weather; avoid smoothing, travel-ad gloss, and artificial haze.",
    "locations": {
      "urban": "a harbor overlook railing",
      "outdoorsy": "a valley-view railing",
      "homebody": "a local riverside overlook"
    },
    "outfits": {
      "casual": "a charcoal sweatshirt under a light jacket",
      "sharp": "a navy oxford beneath a camel field coat",
      "street": "a black utility jacket over a white tee"
    }
  },
  {
    "id": "travel-10-b",
    "version": 3,
    "bucket": "travel",
    "slot": 10,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He moves aside to give another passenger room, returns one hand to the rail, and looks toward the photographer. Frame a 3:4 knee-up portrait that keeps hands and carried objects clear. Canon R5, 50mm, f/2.8, 1/320, ISO 200. Directional daylight gives clean facial detail and moderate separation without postcard gloss. Retain complexion variation, beard detail, clothing folds, and believable focus falloff without beauty retouching or excessive blur.",
    "locations": {
      "urban": "a harbor overlook railing",
      "outdoorsy": "a valley-view railing",
      "homebody": "a local riverside overlook"
    },
    "outfits": {
      "casual": "a charcoal sweatshirt under a light jacket",
      "sharp": "a navy oxford beneath a camel field coat",
      "street": "a black utility jacket over a white tee"
    }
  },
  {
    "id": "travel-10-c",
    "version": 3,
    "bucket": "travel",
    "slot": 10,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He crosses the deck as the ferry slows, steadies himself naturally, and smiles at the approaching shore. Use a 3:4 three-quarter portrait with balanced negative space. Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. Preserve gentle skin texture, tonal variation, accurate scale, and environmental detail; avoid luxury-ad surfaces and facial reshaping.",
    "locations": {
      "urban": "a harbor overlook railing",
      "outdoorsy": "a valley-view railing",
      "homebody": "a local riverside overlook"
    },
    "outfits": {
      "casual": "a charcoal sweatshirt under a light jacket",
      "sharp": "a navy oxford beneath a camel field coat",
      "street": "a black utility jacket over a white tee"
    }
  },
  {
    "id": "travel-11-a",
    "version": 3,
    "bucket": "travel",
    "slot": 11,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He walks through the brick alley, studies the old masonry, and turns to share a detail with the photographer. Compose a 4:3 environmental portrait with him occupying roughly half the frame. Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Documentary perspective keeps the place legible and available light natural rather than polished. Keep distance-appropriate facial detail, fabric wear, accurate hands, and plausible weather; avoid smoothing, travel-ad gloss, and artificial haze.",
    "locations": {
      "urban": "a harbor overlook railing",
      "outdoorsy": "a valley-view railing",
      "homebody": "a local riverside overlook"
    },
    "outfits": {
      "casual": "a charcoal sweatshirt under a light jacket",
      "sharp": "a navy oxford beneath a camel field coat",
      "street": "a black utility jacket over a white tee"
    }
  },
  {
    "id": "travel-11-b",
    "version": 3,
    "bucket": "travel",
    "slot": 11,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He pauses beneath a weathered sign without readable text, checks the lane ahead, and continues with an interested expression. Frame a 3:4 waist-up lifestyle portrait at eye level. Canon R5, 50mm, f/2.8, 1/320, ISO 200. Directional daylight gives clean facial detail and moderate separation without postcard gloss. Retain complexion variation, beard detail, clothing folds, and believable focus falloff without beauty retouching or excessive blur.",
    "locations": {
      "urban": "a harbor overlook railing",
      "outdoorsy": "a valley-view railing",
      "homebody": "a local riverside overlook"
    },
    "outfits": {
      "casual": "a charcoal sweatshirt under a light jacket",
      "sharp": "a navy oxford beneath a camel field coat",
      "street": "a black utility jacket over a white tee"
    }
  },
  {
    "id": "travel-11-c",
    "version": 3,
    "bucket": "travel",
    "slot": 11,
    "variant": "c",
    "aspectRatio": "4:3",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He steps into a patch of warm light, notices the change, and looks back toward his companion. Use a 4:3 environmental portrait with layered foreground, subject, and distance. Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. Preserve gentle skin texture, tonal variation, accurate scale, and environmental detail; avoid luxury-ad surfaces and facial reshaping.",
    "locations": {
      "urban": "a harbor overlook railing",
      "outdoorsy": "a valley-view railing",
      "homebody": "a local riverside overlook"
    },
    "outfits": {
      "casual": "a charcoal sweatshirt under a light jacket",
      "sharp": "a navy oxford beneath a camel field coat",
      "street": "a black utility jacket over a white tee"
    }
  },
  {
    "id": "travel-12-a",
    "version": 3,
    "bucket": "travel",
    "slot": 12,
    "variant": "a",
    "aspectRatio": "9:16",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He lowers the espresso after a sip, watches the street beyond the awning, and smiles at something his companion says. Compose a 9:16 full-body documentary frame with straight architectural lines. Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Documentary perspective keeps the place legible and available light natural rather than polished. Keep distance-appropriate facial detail, fabric wear, accurate hands, and plausible weather; avoid smoothing, travel-ad gloss, and artificial haze.",
    "locations": {
      "urban": "a harbor overlook railing",
      "outdoorsy": "a valley-view railing",
      "homebody": "a local riverside overlook"
    },
    "outfits": {
      "casual": "a charcoal sweatshirt under a light jacket",
      "sharp": "a navy oxford beneath a camel field coat",
      "street": "a black utility jacket over a white tee"
    }
  },
  {
    "id": "travel-12-b",
    "version": 3,
    "bucket": "travel",
    "slot": 12,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He slides the cup aside to unfold a small map, finds the next stop, and looks up with a decided expression. Frame a 3:4 three-quarter portrait with moderate environmental separation. Canon R5, 50mm, f/2.8, 1/320, ISO 200. Directional daylight gives clean facial detail and moderate separation without postcard gloss. Retain complexion variation, beard detail, clothing folds, and believable focus falloff without beauty retouching or excessive blur.",
    "locations": {
      "urban": "a harbor overlook railing",
      "outdoorsy": "a valley-view railing",
      "homebody": "a local riverside overlook"
    },
    "outfits": {
      "casual": "a charcoal sweatshirt under a light jacket",
      "sharp": "a navy oxford beneath a camel field coat",
      "street": "a black utility jacket over a white tee"
    }
  },
  {
    "id": "travel-12-c",
    "version": 3,
    "bucket": "travel",
    "slot": 12,
    "variant": "c",
    "aspectRatio": "4:3",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He waits for the bill with one forearm on the table, turns from people-watching, and rejoins the conversation. Use a 4:3 half-body portrait with the setting rendered in quiet detail. Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. Preserve gentle skin texture, tonal variation, accurate scale, and environmental detail; avoid luxury-ad surfaces and facial reshaping.",
    "locations": {
      "urban": "a harbor overlook railing",
      "outdoorsy": "a valley-view railing",
      "homebody": "a local riverside overlook"
    },
    "outfits": {
      "casual": "a charcoal sweatshirt under a light jacket",
      "sharp": "a navy oxford beneath a camel field coat",
      "street": "a black utility jacket over a white tee"
    }
  },
  {
    "id": "travel-13-a",
    "version": 3,
    "bucket": "travel",
    "slot": 13,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He steps onto a stable rock in the marked trail, checks his footing, and looks back to make sure his companion is following. Compose a 4:3 knee-up frame that preserves the horizon and travel context. Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Documentary perspective keeps the place legible and available light natural rather than polished. Keep distance-appropriate facial detail, fabric wear, accurate hands, and plausible weather; avoid smoothing, travel-ad gloss, and artificial haze.",
    "locations": {
      "urban": "a preserved cobblestone lane",
      "outdoorsy": "a mountain-village lane",
      "homebody": "a nearby historic-town lane"
    },
    "outfits": {
      "casual": "a navy knit sweater",
      "sharp": "a tailored charcoal overcoat over a black crewneck",
      "street": "a dark bomber over a cream tee"
    }
  },
  {
    "id": "travel-13-b",
    "version": 3,
    "bucket": "travel",
    "slot": 13,
    "variant": "b",
    "aspectRatio": "9:16",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He pauses where the trail bends, adjusts one pack strap, and points toward the route ahead. Frame a 9:16 full-body portrait without wide-angle distortion. Canon R5, 50mm, f/2.8, 1/320, ISO 200. Directional daylight gives clean facial detail and moderate separation without postcard gloss. Retain complexion variation, beard detail, clothing folds, and believable focus falloff without beauty retouching or excessive blur.",
    "locations": {
      "urban": "a preserved cobblestone lane",
      "outdoorsy": "a mountain-village lane",
      "homebody": "a nearby historic-town lane"
    },
    "outfits": {
      "casual": "a navy knit sweater",
      "sharp": "a tailored charcoal overcoat over a black crewneck",
      "street": "a dark bomber over a cream tee"
    }
  },
  {
    "id": "travel-13-c",
    "version": 3,
    "bucket": "travel",
    "slot": 13,
    "variant": "c",
    "aspectRatio": "9:16",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He walks uphill at an ordinary pace, reaches a flatter section, and smiles back while catching his breath. Use a 9:16 full-body composition that preserves natural scale. Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. Preserve gentle skin texture, tonal variation, accurate scale, and environmental detail; avoid luxury-ad surfaces and facial reshaping.",
    "locations": {
      "urban": "a preserved cobblestone lane",
      "outdoorsy": "a mountain-village lane",
      "homebody": "a nearby historic-town lane"
    },
    "outfits": {
      "casual": "a navy knit sweater",
      "sharp": "a tailored charcoal overcoat over a black crewneck",
      "street": "a dark bomber over a cream tee"
    }
  },
  {
    "id": "travel-14-a",
    "version": 3,
    "bucket": "travel",
    "slot": 14,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He rests one shoulder against the old stone wall while his companion checks the route, then looks up when they are ready. Compose a 4:3 waist-up portrait with one useful foreground detail. Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Documentary perspective keeps the place legible and available light natural rather than polished. Keep distance-appropriate facial detail, fabric wear, accurate hands, and plausible weather; avoid smoothing, travel-ad gloss, and artificial haze.",
    "locations": {
      "urban": "a preserved cobblestone lane",
      "outdoorsy": "a mountain-village lane",
      "homebody": "a nearby historic-town lane"
    },
    "outfits": {
      "casual": "a navy knit sweater",
      "sharp": "a tailored charcoal overcoat over a black crewneck",
      "street": "a dark bomber over a cream tee"
    }
  },
  {
    "id": "travel-14-b",
    "version": 3,
    "bucket": "travel",
    "slot": 14,
    "variant": "b",
    "aspectRatio": "4:3",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He steps out from the wall to let residents pass, returns to the conversation, and smiles at the interruption. Frame a 4:3 chest-up portrait with the destination softly recognizable. Canon R5, 50mm, f/2.8, 1/320, ISO 200. Directional daylight gives clean facial detail and moderate separation without postcard gloss. Retain complexion variation, beard detail, clothing folds, and believable focus falloff without beauty retouching or excessive blur.",
    "locations": {
      "urban": "a preserved cobblestone lane",
      "outdoorsy": "a mountain-village lane",
      "homebody": "a nearby historic-town lane"
    },
    "outfits": {
      "casual": "a navy knit sweater",
      "sharp": "a tailored charcoal overcoat over a black crewneck",
      "street": "a dark bomber over a cream tee"
    }
  },
  {
    "id": "travel-14-c",
    "version": 3,
    "bucket": "travel",
    "slot": 14,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He studies the square from the shaded edge, shifts away from the warm stone, and turns toward the photographer. Use a 3:4 waist-up portrait with gentle medium-format separation. Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. Preserve gentle skin texture, tonal variation, accurate scale, and environmental detail; avoid luxury-ad surfaces and facial reshaping.",
    "locations": {
      "urban": "a preserved cobblestone lane",
      "outdoorsy": "a mountain-village lane",
      "homebody": "a nearby historic-town lane"
    },
    "outfits": {
      "casual": "a navy knit sweater",
      "sharp": "a tailored charcoal overcoat over a black crewneck",
      "street": "a dark bomber over a cream tee"
    }
  },
  {
    "id": "travel-15-a",
    "version": 3,
    "bucket": "travel",
    "slot": 15,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He crosses the safe rock walkway with both arms naturally free for balance and looks toward the photographer after the difficult step. Compose a 3:4 three-quarter frame from a companion's walking distance. Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Documentary perspective keeps the place legible and available light natural rather than polished. Keep distance-appropriate facial detail, fabric wear, accurate hands, and plausible weather; avoid smoothing, travel-ad gloss, and artificial haze.",
    "locations": {
      "urban": "a preserved cobblestone lane",
      "outdoorsy": "a mountain-village lane",
      "homebody": "a nearby historic-town lane"
    },
    "outfits": {
      "casual": "a navy knit sweater",
      "sharp": "a tailored charcoal overcoat over a black crewneck",
      "street": "a dark bomber over a cream tee"
    }
  },
  {
    "id": "travel-15-b",
    "version": 3,
    "bucket": "travel",
    "slot": 15,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He pauses beside the water to check the next dry foothold, then smiles at his own caution. Frame a 3:4 knee-up portrait that keeps hands and carried objects clear. Canon R5, 50mm, f/2.8, 1/320, ISO 200. Directional daylight gives clean facial detail and moderate separation without postcard gloss. Retain complexion variation, beard detail, clothing folds, and believable focus falloff without beauty retouching or excessive blur.",
    "locations": {
      "urban": "a preserved cobblestone lane",
      "outdoorsy": "a mountain-village lane",
      "homebody": "a nearby historic-town lane"
    },
    "outfits": {
      "casual": "a navy knit sweater",
      "sharp": "a tailored charcoal overcoat over a black crewneck",
      "street": "a dark bomber over a cream tee"
    }
  },
  {
    "id": "travel-15-c",
    "version": 3,
    "bucket": "travel",
    "slot": 15,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He reaches a level section of the shore, relaxes his hands, and looks back toward the path they crossed. Use a 3:4 three-quarter portrait with balanced negative space. Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. Preserve gentle skin texture, tonal variation, accurate scale, and environmental detail; avoid luxury-ad surfaces and facial reshaping.",
    "locations": {
      "urban": "a preserved cobblestone lane",
      "outdoorsy": "a mountain-village lane",
      "homebody": "a nearby historic-town lane"
    },
    "outfits": {
      "casual": "a navy knit sweater",
      "sharp": "a tailored charcoal overcoat over a black crewneck",
      "street": "a dark bomber over a cream tee"
    }
  },
  {
    "id": "travel-16-a",
    "version": 3,
    "bucket": "travel",
    "slot": 16,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He waits on the platform with one hand on his bag, looks down the tracks, and turns when the announcement ends. Compose a 4:3 environmental portrait with him occupying roughly half the frame. Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Documentary perspective keeps the place legible and available light natural rather than polished. Keep distance-appropriate facial detail, fabric wear, accurate hands, and plausible weather; avoid smoothing, travel-ad gloss, and artificial haze.",
    "locations": {
      "urban": "a museum-courtyard stone step",
      "outdoorsy": "a visitor-center terrace step",
      "homebody": "a regional cultural-center step"
    },
    "outfits": {
      "casual": "a soft grey crewneck and dark jeans",
      "sharp": "a light-blue shirt beneath a navy jacket",
      "street": "a black denim overshirt over a white tee"
    }
  },
  {
    "id": "travel-16-b",
    "version": 3,
    "bucket": "travel",
    "slot": 16,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He steps toward the marked carriage position, checks that his companion is following, and smiles before the train arrives. Frame a 3:4 waist-up lifestyle portrait at eye level. Canon R5, 50mm, f/2.8, 1/320, ISO 200. Directional daylight gives clean facial detail and moderate separation without postcard gloss. Retain complexion variation, beard detail, clothing folds, and believable focus falloff without beauty retouching or excessive blur.",
    "locations": {
      "urban": "a museum-courtyard stone step",
      "outdoorsy": "a visitor-center terrace step",
      "homebody": "a regional cultural-center step"
    },
    "outfits": {
      "casual": "a soft grey crewneck and dark jeans",
      "sharp": "a light-blue shirt beneath a navy jacket",
      "street": "a black denim overshirt over a white tee"
    }
  },
  {
    "id": "travel-16-c",
    "version": 3,
    "bucket": "travel",
    "slot": 16,
    "variant": "c",
    "aspectRatio": "4:3",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He stands beside the open carriage door, lets another passenger exit, and looks toward the photographer before boarding. Use a 4:3 environmental portrait with layered foreground, subject, and distance. Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. Preserve gentle skin texture, tonal variation, accurate scale, and environmental detail; avoid luxury-ad surfaces and facial reshaping.",
    "locations": {
      "urban": "a museum-courtyard stone step",
      "outdoorsy": "a visitor-center terrace step",
      "homebody": "a regional cultural-center step"
    },
    "outfits": {
      "casual": "a soft grey crewneck and dark jeans",
      "sharp": "a light-blue shirt beneath a navy jacket",
      "street": "a black denim overshirt over a white tee"
    }
  },
  {
    "id": "travel-17-a",
    "version": 3,
    "bucket": "travel",
    "slot": 17,
    "variant": "a",
    "aspectRatio": "9:16",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He walks beneath the tall greenhouse palms, looks up through the leaves, and laughs at the unexpected indoor breeze. Compose a 9:16 full-body documentary frame with straight architectural lines. Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Documentary perspective keeps the place legible and available light natural rather than polished. Keep distance-appropriate facial detail, fabric wear, accurate hands, and plausible weather; avoid smoothing, travel-ad gloss, and artificial haze.",
    "locations": {
      "urban": "a museum-courtyard stone step",
      "outdoorsy": "a visitor-center terrace step",
      "homebody": "a regional cultural-center step"
    },
    "outfits": {
      "casual": "a soft grey crewneck and dark jeans",
      "sharp": "a light-blue shirt beneath a navy jacket",
      "street": "a black denim overshirt over a white tee"
    }
  },
  {
    "id": "travel-17-b",
    "version": 3,
    "bucket": "travel",
    "slot": 17,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He stops beside the shaded path to read a plant card, turns from it, and shares the discovery with his companion. Frame a 3:4 three-quarter portrait with moderate environmental separation. Canon R5, 50mm, f/2.8, 1/320, ISO 200. Directional daylight gives clean facial detail and moderate separation without postcard gloss. Retain complexion variation, beard detail, clothing folds, and believable focus falloff without beauty retouching or excessive blur.",
    "locations": {
      "urban": "a museum-courtyard stone step",
      "outdoorsy": "a visitor-center terrace step",
      "homebody": "a regional cultural-center step"
    },
    "outfits": {
      "casual": "a soft grey crewneck and dark jeans",
      "sharp": "a light-blue shirt beneath a navy jacket",
      "street": "a black denim overshirt over a white tee"
    }
  },
  {
    "id": "travel-17-c",
    "version": 3,
    "bucket": "travel",
    "slot": 17,
    "variant": "c",
    "aspectRatio": "4:3",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He steps from dense greenery into a brighter walkway, blinks at the change, and smiles toward the photographer. Use a 4:3 half-body portrait with the setting rendered in quiet detail. Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. Preserve gentle skin texture, tonal variation, accurate scale, and environmental detail; avoid luxury-ad surfaces and facial reshaping.",
    "locations": {
      "urban": "a museum-courtyard stone step",
      "outdoorsy": "a visitor-center terrace step",
      "homebody": "a regional cultural-center step"
    },
    "outfits": {
      "casual": "a soft grey crewneck and dark jeans",
      "sharp": "a light-blue shirt beneath a navy jacket",
      "street": "a black denim overshirt over a white tee"
    }
  },
  {
    "id": "travel-18-a",
    "version": 3,
    "bucket": "travel",
    "slot": 18,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He sits beside his compact weekender at the terminal, checks the time, and looks up as his companion returns. Compose a 4:3 knee-up frame that preserves the horizon and travel context. Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Documentary perspective keeps the place legible and available light natural rather than polished. Keep distance-appropriate facial detail, fabric wear, accurate hands, and plausible weather; avoid smoothing, travel-ad gloss, and artificial haze.",
    "locations": {
      "urban": "a museum-courtyard stone step",
      "outdoorsy": "a visitor-center terrace step",
      "homebody": "a regional cultural-center step"
    },
    "outfits": {
      "casual": "a soft grey crewneck and dark jeans",
      "sharp": "a light-blue shirt beneath a navy jacket",
      "street": "a black denim overshirt over a white tee"
    }
  },
  {
    "id": "travel-18-b",
    "version": 3,
    "bucket": "travel",
    "slot": 18,
    "variant": "b",
    "aspectRatio": "9:16",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He stands after the boarding call, settles the bag handle into one hand, and turns toward the photographer. Frame a 9:16 full-body portrait without wide-angle distortion. Canon R5, 50mm, f/2.8, 1/320, ISO 200. Directional daylight gives clean facial detail and moderate separation without postcard gloss. Retain complexion variation, beard detail, clothing folds, and believable focus falloff without beauty retouching or excessive blur.",
    "locations": {
      "urban": "a museum-courtyard stone step",
      "outdoorsy": "a visitor-center terrace step",
      "homebody": "a regional cultural-center step"
    },
    "outfits": {
      "casual": "a soft grey crewneck and dark jeans",
      "sharp": "a light-blue shirt beneath a navy jacket",
      "street": "a black denim overshirt over a white tee"
    }
  },
  {
    "id": "travel-18-c",
    "version": 3,
    "bucket": "travel",
    "slot": 18,
    "variant": "c",
    "aspectRatio": "9:16",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He waits near the bright window with his luggage beside him, watches the entrance, and smiles when his companion appears. Use a 9:16 full-body composition that preserves natural scale. Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. Preserve gentle skin texture, tonal variation, accurate scale, and environmental detail; avoid luxury-ad surfaces and facial reshaping.",
    "locations": {
      "urban": "a museum-courtyard stone step",
      "outdoorsy": "a visitor-center terrace step",
      "homebody": "a regional cultural-center step"
    },
    "outfits": {
      "casual": "a soft grey crewneck and dark jeans",
      "sharp": "a light-blue shirt beneath a navy jacket",
      "street": "a black denim overshirt over a white tee"
    }
  },
  {
    "id": "travel-19-a",
    "version": 3,
    "bucket": "travel",
    "slot": 19,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He slows at a market stall to inspect unfamiliar produce, thanks the vendor, and looks toward his companion with curiosity. Compose a 4:3 waist-up portrait with one useful foreground detail. Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Documentary perspective keeps the place legible and available light natural rather than polished. Keep distance-appropriate facial detail, fabric wear, accurate hands, and plausible weather; avoid smoothing, travel-ad gloss, and artificial haze.",
    "locations": {
      "urban": "a waterfront boardwalk",
      "outdoorsy": "a timber boardwalk near dunes",
      "homebody": "a lakeside boardwalk"
    },
    "outfits": {
      "casual": "a navy overshirt with dark jeans",
      "sharp": "a camel coat over a black knit",
      "street": "a dark bomber over a plain tee"
    }
  },
  {
    "id": "travel-19-b",
    "version": 3,
    "bucket": "travel",
    "slot": 19,
    "variant": "b",
    "aspectRatio": "4:3",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He carries a small paper bag through the aisle, steps aside for another shopper, and smiles at the photographer. Frame a 4:3 chest-up portrait with the destination softly recognizable. Canon R5, 50mm, f/2.8, 1/320, ISO 200. Directional daylight gives clean facial detail and moderate separation without postcard gloss. Retain complexion variation, beard detail, clothing folds, and believable focus falloff without beauty retouching or excessive blur.",
    "locations": {
      "urban": "a waterfront boardwalk",
      "outdoorsy": "a timber boardwalk near dunes",
      "homebody": "a lakeside boardwalk"
    },
    "outfits": {
      "casual": "a navy overshirt with dark jeans",
      "sharp": "a camel coat over a black knit",
      "street": "a dark bomber over a plain tee"
    }
  },
  {
    "id": "travel-19-c",
    "version": 3,
    "bucket": "travel",
    "slot": 19,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He waits while the vendor wraps one item, watches the process, and turns when his companion asks what he chose. Use a 3:4 waist-up portrait with gentle medium-format separation. Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. Preserve gentle skin texture, tonal variation, accurate scale, and environmental detail; avoid luxury-ad surfaces and facial reshaping.",
    "locations": {
      "urban": "a waterfront boardwalk",
      "outdoorsy": "a timber boardwalk near dunes",
      "homebody": "a lakeside boardwalk"
    },
    "outfits": {
      "casual": "a navy overshirt with dark jeans",
      "sharp": "a camel coat over a black knit",
      "street": "a dark bomber over a plain tee"
    }
  },
  {
    "id": "travel-20-a",
    "version": 3,
    "bucket": "travel",
    "slot": 20,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He reaches the rooftop edge, keeps both hands in his coat pockets against the wind, and looks from the skyline toward the photographer. Compose a 3:4 three-quarter frame from a companion's walking distance. Leica Q2, 28mm, f/2.8, 1/250, ISO 400. Documentary perspective keeps the place legible and available light natural rather than polished. Keep distance-appropriate facial detail, fabric wear, accurate hands, and plausible weather; avoid smoothing, travel-ad gloss, and artificial haze.",
    "locations": {
      "urban": "a waterfront boardwalk",
      "outdoorsy": "a timber boardwalk near dunes",
      "homebody": "a lakeside boardwalk"
    },
    "outfits": {
      "casual": "a navy overshirt with dark jeans",
      "sharp": "a camel coat over a black knit",
      "street": "a dark bomber over a plain tee"
    }
  },
  {
    "id": "travel-20-b",
    "version": 3,
    "bucket": "travel",
    "slot": 20,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He steps away from the rail after taking in the view, turns into the last light, and smiles at his companion. Frame a 3:4 knee-up portrait that keeps hands and carried objects clear. Canon R5, 50mm, f/2.8, 1/320, ISO 200. Directional daylight gives clean facial detail and moderate separation without postcard gloss. Retain complexion variation, beard detail, clothing folds, and believable focus falloff without beauty retouching or excessive blur.",
    "locations": {
      "urban": "a waterfront boardwalk",
      "outdoorsy": "a timber boardwalk near dunes",
      "homebody": "a lakeside boardwalk"
    },
    "outfits": {
      "casual": "a navy overshirt with dark jeans",
      "sharp": "a camel coat over a black knit",
      "street": "a dark bomber over a plain tee"
    }
  },
  {
    "id": "travel-20-c",
    "version": 3,
    "bucket": "travel",
    "slot": 20,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He walks across the terrace as the city lights appear, slows beside the photographer, and looks back toward the skyline. Use a 3:4 three-quarter portrait with balanced negative space. Fujifilm GFX 100S, 45mm, f/4, 1/250, ISO 200. Medium-format tonality preserves environmental detail, fabric texture, and gentle highlight rolloff. Preserve gentle skin texture, tonal variation, accurate scale, and environmental detail; avoid luxury-ad surfaces and facial reshaping.",
    "locations": {
      "urban": "a waterfront boardwalk",
      "outdoorsy": "a timber boardwalk near dunes",
      "homebody": "a lakeside boardwalk"
    },
    "outfits": {
      "casual": "a navy overshirt with dark jeans",
      "sharp": "a camel coat over a black knit",
      "street": "a dark bomber over a plain tee"
    }
  },
  {
    "id": "active-01-a",
    "version": 3,
    "bucket": "active",
    "slot": 1,
    "variant": "a",
    "aspectRatio": "9:16",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He walks one dog at an easy pace, shortens the leash before another walker passes, and smiles down when the dog checks in. Compose a 9:16 full-body action frame from sideline height. Sony A1, 50mm, f/2.8, 1/1000, auto ISO. The fast shutter freezes his face and core movement while daylight keeps color believable. Keep joints, hands, feet, equipment, and ground contact credible. Allow mild warmth, never fake sweat, sculpted muscles, or smoothing.",
    "locations": {
      "urban": "a broad urban park path",
      "outdoorsy": "a lakeside trail",
      "homebody": "a leafy neighborhood greenway"
    },
    "outfits": {
      "casual": "a breathable navy tee with tapered joggers",
      "sharp": "a fitted charcoal quarter-zip with technical trousers",
      "street": "a dark windbreaker over a plain tee"
    }
  },
  {
    "id": "active-01-b",
    "version": 3,
    "bucket": "active",
    "slot": 1,
    "variant": "b",
    "aspectRatio": "9:16",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He pauses beside the path while the dog investigates the grass, then looks toward his companion with an affectionate expression. Use a 9:16 friend-taken full-body frame from a safe practical distance. Friend-taken iPhone 15 Pro burst, 35mm equivalent, no Portrait Mode. His face stays coherent while clothing and extremities retain small movement. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture without athletic-ad polish.",
    "locations": {
      "urban": "a broad urban park path",
      "outdoorsy": "a lakeside trail",
      "homebody": "a leafy neighborhood greenway"
    },
    "outfits": {
      "casual": "a breathable navy tee with tapered joggers",
      "sharp": "a fitted charcoal quarter-zip with technical trousers",
      "street": "a dark windbreaker over a plain tee"
    }
  },
  {
    "id": "active-01-c",
    "version": 3,
    "bucket": "active",
    "slot": 1,
    "variant": "c",
    "aspectRatio": "9:16",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He resumes walking after the dog catches up, keeps the leash loose, and laughs when it pulls briefly ahead. Frame a 9:16 full-body documentary photograph with balanced ground contact. Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Natural contrast and modest depth create a grounded recreational documentary look. Keep natural posture, accurate equipment, modest skin warmth, and real contrast; avoid flexing, impossible motion, filters, and exaggerated physique.",
    "locations": {
      "urban": "a broad urban park path",
      "outdoorsy": "a lakeside trail",
      "homebody": "a leafy neighborhood greenway"
    },
    "outfits": {
      "casual": "a breathable navy tee with tapered joggers",
      "sharp": "a fitted charcoal quarter-zip with technical trousers",
      "street": "a dark windbreaker over a plain tee"
    }
  },
  {
    "id": "active-02-a",
    "version": 3,
    "bucket": "active",
    "slot": 2,
    "variant": "a",
    "aspectRatio": "9:16",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He steps onto a stable rock in the trail, checks his footing, and looks back to confirm his companion is comfortable. Compose a 9:16 three-quarter action frame with the face fully visible. Sony A1, 50mm, f/2.8, 1/1000, auto ISO. The fast shutter freezes his face and core movement while daylight keeps color believable. Keep joints, hands, feet, equipment, and ground contact credible. Allow mild warmth, never fake sweat, sculpted muscles, or smoothing.",
    "locations": {
      "urban": "a broad urban park path",
      "outdoorsy": "a lakeside trail",
      "homebody": "a leafy neighborhood greenway"
    },
    "outfits": {
      "casual": "a breathable navy tee with tapered joggers",
      "sharp": "a fitted charcoal quarter-zip with technical trousers",
      "street": "a dark windbreaker over a plain tee"
    }
  },
  {
    "id": "active-02-b",
    "version": 3,
    "bucket": "active",
    "slot": 2,
    "variant": "b",
    "aspectRatio": "9:16",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He reaches a flatter section, loosens one backpack strap, and smiles while his breathing settles. Use a 9:16 three-quarter burst photograph with ordinary perspective. Friend-taken iPhone 15 Pro burst, 35mm equivalent, no Portrait Mode. His face stays coherent while clothing and extremities retain small movement. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture without athletic-ad polish.",
    "locations": {
      "urban": "a broad urban park path",
      "outdoorsy": "a lakeside trail",
      "homebody": "a leafy neighborhood greenway"
    },
    "outfits": {
      "casual": "a breathable navy tee with tapered joggers",
      "sharp": "a fitted charcoal quarter-zip with technical trousers",
      "street": "a dark windbreaker over a plain tee"
    }
  },
  {
    "id": "active-02-c",
    "version": 3,
    "bucket": "active",
    "slot": 2,
    "variant": "c",
    "aspectRatio": "9:16",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He pauses at the bend to point out the route ahead, lowers his hand, and continues walking naturally. Frame a 9:16 three-quarter photograph with activity context behind him. Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Natural contrast and modest depth create a grounded recreational documentary look. Keep natural posture, accurate equipment, modest skin warmth, and real contrast; avoid flexing, impossible motion, filters, and exaggerated physique.",
    "locations": {
      "urban": "a broad urban park path",
      "outdoorsy": "a lakeside trail",
      "homebody": "a leafy neighborhood greenway"
    },
    "outfits": {
      "casual": "a breathable navy tee with tapered joggers",
      "sharp": "a fitted charcoal quarter-zip with technical trousers",
      "street": "a dark windbreaker over a plain tee"
    }
  },
  {
    "id": "active-03-a",
    "version": 3,
    "bucket": "active",
    "slot": 3,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He stops in a quiet clearing, stretches both arms after carrying his pack, and relaxes them as the photographer catches up. Compose a 4:3 environmental action frame that clearly explains the activity. Sony A1, 50mm, f/2.8, 1/1000, auto ISO. The fast shutter freezes his face and core movement while daylight keeps color believable. Keep joints, hands, feet, equipment, and ground contact credible. Allow mild warmth, never fake sweat, sculpted muscles, or smoothing.",
    "locations": {
      "urban": "a broad urban park path",
      "outdoorsy": "a lakeside trail",
      "homebody": "a leafy neighborhood greenway"
    },
    "outfits": {
      "casual": "a breathable navy tee with tapered joggers",
      "sharp": "a fitted charcoal quarter-zip with technical trousers",
      "street": "a dark windbreaker over a plain tee"
    }
  },
  {
    "id": "active-03-b",
    "version": 3,
    "bucket": "active",
    "slot": 3,
    "variant": "b",
    "aspectRatio": "4:3",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He rolls one shoulder while waiting at the trail marker, then looks toward his companion with an easy smile. Use a 4:3 environmental snapshot that includes the path or playing area. Friend-taken iPhone 15 Pro burst, 35mm equivalent, no Portrait Mode. His face stays coherent while clothing and extremities retain small movement. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture without athletic-ad polish.",
    "locations": {
      "urban": "a broad urban park path",
      "outdoorsy": "a lakeside trail",
      "homebody": "a leafy neighborhood greenway"
    },
    "outfits": {
      "casual": "a breathable navy tee with tapered joggers",
      "sharp": "a fitted charcoal quarter-zip with technical trousers",
      "street": "a dark windbreaker over a plain tee"
    }
  },
  {
    "id": "active-03-c",
    "version": 3,
    "bucket": "active",
    "slot": 3,
    "variant": "c",
    "aspectRatio": "4:3",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He reaches overhead to adjust a low pack strap, finishes the movement, and resumes the conversation. Frame a 4:3 environmental portrait with natural outdoor depth. Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Natural contrast and modest depth create a grounded recreational documentary look. Keep natural posture, accurate equipment, modest skin warmth, and real contrast; avoid flexing, impossible motion, filters, and exaggerated physique.",
    "locations": {
      "urban": "a broad urban park path",
      "outdoorsy": "a lakeside trail",
      "homebody": "a leafy neighborhood greenway"
    },
    "outfits": {
      "casual": "a breathable navy tee with tapered joggers",
      "sharp": "a fitted charcoal quarter-zip with technical trousers",
      "street": "a dark windbreaker over a plain tee"
    }
  },
  {
    "id": "active-04-a",
    "version": 3,
    "bucket": "active",
    "slot": 4,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He jogs at a conversational pace, recognizes the photographer beside the path, and smiles without changing his running form. Compose a 3:4 knee-up frame with hands and equipment inside the image. Sony A1, 50mm, f/2.8, 1/1000, auto ISO. The fast shutter freezes his face and core movement while daylight keeps color believable. Keep joints, hands, feet, equipment, and ground contact credible. Allow mild warmth, never fake sweat, sculpted muscles, or smoothing.",
    "locations": {
      "urban": "a marked hill trail",
      "outdoorsy": "a wooded mountain path",
      "homebody": "a regional-park loop"
    },
    "outfits": {
      "casual": "a navy performance polo with dark shorts",
      "sharp": "a charcoal merino tee with technical pants",
      "street": "a black lightweight shell over a plain tee"
    }
  },
  {
    "id": "active-04-b",
    "version": 3,
    "bucket": "active",
    "slot": 4,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He rounds the bend with compact natural strides, looks briefly toward his companion, and keeps moving through the frame. Use a 3:4 knee-up candid with small natural movement at the frame edges. Friend-taken iPhone 15 Pro burst, 35mm equivalent, no Portrait Mode. His face stays coherent while clothing and extremities retain small movement. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture without athletic-ad polish.",
    "locations": {
      "urban": "a marked hill trail",
      "outdoorsy": "a wooded mountain path",
      "homebody": "a regional-park loop"
    },
    "outfits": {
      "casual": "a navy performance polo with dark shorts",
      "sharp": "a charcoal merino tee with technical pants",
      "street": "a black lightweight shell over a plain tee"
    }
  },
  {
    "id": "active-04-c",
    "version": 3,
    "bucket": "active",
    "slot": 4,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He slows after reaching the marked point, lowers his arms naturally, and looks back with calm satisfaction. Frame a 3:4 knee-up photograph that keeps props and hands coherent. Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Natural contrast and modest depth create a grounded recreational documentary look. Keep natural posture, accurate equipment, modest skin warmth, and real contrast; avoid flexing, impossible motion, filters, and exaggerated physique.",
    "locations": {
      "urban": "a marked hill trail",
      "outdoorsy": "a wooded mountain path",
      "homebody": "a regional-park loop"
    },
    "outfits": {
      "casual": "a navy performance polo with dark shorts",
      "sharp": "a charcoal merino tee with technical pants",
      "street": "a black lightweight shell over a plain tee"
    }
  },
  {
    "id": "active-05-a",
    "version": 3,
    "bucket": "active",
    "slot": 5,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He sits on the park bench to retie one shoe, pulls the knot firm, and looks up before standing. Compose a 3:4 medium action frame without cropping active joints. Sony A1, 50mm, f/2.8, 1/1000, auto ISO. The fast shutter freezes his face and core movement while daylight keeps color believable. Keep joints, hands, feet, equipment, and ground contact credible. Allow mild warmth, never fake sweat, sculpted muscles, or smoothing.",
    "locations": {
      "urban": "a marked hill trail",
      "outdoorsy": "a wooded mountain path",
      "homebody": "a regional-park loop"
    },
    "outfits": {
      "casual": "a navy performance polo with dark shorts",
      "sharp": "a charcoal merino tee with technical pants",
      "street": "a black lightweight shell over a plain tee"
    }
  },
  {
    "id": "active-05-b",
    "version": 3,
    "bucket": "active",
    "slot": 5,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He places one foot on the bench to adjust the lace, finishes, and smiles at the photographer's comment. Use a 3:4 medium snapshot that keeps the face identifiable. Friend-taken iPhone 15 Pro burst, 35mm equivalent, no Portrait Mode. His face stays coherent while clothing and extremities retain small movement. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture without athletic-ad polish.",
    "locations": {
      "urban": "a marked hill trail",
      "outdoorsy": "a wooded mountain path",
      "homebody": "a regional-park loop"
    },
    "outfits": {
      "casual": "a navy performance polo with dark shorts",
      "sharp": "a charcoal merino tee with technical pants",
      "street": "a black lightweight shell over a plain tee"
    }
  },
  {
    "id": "active-05-c",
    "version": 3,
    "bucket": "active",
    "slot": 5,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He checks the sole after a run, sets his foot down, and remains seated for one relaxed breath. Frame a 3:4 medium portrait taken during the activity rather than after posing. Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Natural contrast and modest depth create a grounded recreational documentary look. Keep natural posture, accurate equipment, modest skin warmth, and real contrast; avoid flexing, impossible motion, filters, and exaggerated physique.",
    "locations": {
      "urban": "a marked hill trail",
      "outdoorsy": "a wooded mountain path",
      "homebody": "a regional-park loop"
    },
    "outfits": {
      "casual": "a navy performance polo with dark shorts",
      "sharp": "a charcoal merino tee with technical pants",
      "street": "a black lightweight shell over a plain tee"
    }
  },
  {
    "id": "active-06-a",
    "version": 3,
    "bucket": "active",
    "slot": 6,
    "variant": "a",
    "aspectRatio": "9:16",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He walks uphill with a slight practical lean, reaches a level patch, and looks back toward his companion while recovering. Compose a 9:16 full-body action frame from sideline height. Sony A1, 50mm, f/2.8, 1/1000, auto ISO. The fast shutter freezes his face and core movement while daylight keeps color believable. Keep joints, hands, feet, equipment, and ground contact credible. Allow mild warmth, never fake sweat, sculpted muscles, or smoothing.",
    "locations": {
      "urban": "a marked hill trail",
      "outdoorsy": "a wooded mountain path",
      "homebody": "a regional-park loop"
    },
    "outfits": {
      "casual": "a navy performance polo with dark shorts",
      "sharp": "a charcoal merino tee with technical pants",
      "street": "a black lightweight shell over a plain tee"
    }
  },
  {
    "id": "active-06-b",
    "version": 3,
    "bucket": "active",
    "slot": 6,
    "variant": "b",
    "aspectRatio": "9:16",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He pauses beside the path to tighten one shoulder strap, tests the fit, and continues upward. Use a 9:16 friend-taken full-body frame from a safe practical distance. Friend-taken iPhone 15 Pro burst, 35mm equivalent, no Portrait Mode. His face stays coherent while clothing and extremities retain small movement. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture without athletic-ad polish.",
    "locations": {
      "urban": "a marked hill trail",
      "outdoorsy": "a wooded mountain path",
      "homebody": "a regional-park loop"
    },
    "outfits": {
      "casual": "a navy performance polo with dark shorts",
      "sharp": "a charcoal merino tee with technical pants",
      "street": "a black lightweight shell over a plain tee"
    }
  },
  {
    "id": "active-06-c",
    "version": 3,
    "bucket": "active",
    "slot": 6,
    "variant": "c",
    "aspectRatio": "9:16",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He takes the next few steps steadily, glances toward the photographer, and smiles without pretending the climb is effortless. Frame a 9:16 full-body documentary photograph with balanced ground contact. Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Natural contrast and modest depth create a grounded recreational documentary look. Keep natural posture, accurate equipment, modest skin warmth, and real contrast; avoid flexing, impossible motion, filters, and exaggerated physique.",
    "locations": {
      "urban": "a marked hill trail",
      "outdoorsy": "a wooded mountain path",
      "homebody": "a regional-park loop"
    },
    "outfits": {
      "casual": "a navy performance polo with dark shorts",
      "sharp": "a charcoal merino tee with technical pants",
      "street": "a black lightweight shell over a plain tee"
    }
  },
  {
    "id": "active-07-a",
    "version": 3,
    "bucket": "active",
    "slot": 7,
    "variant": "a",
    "aspectRatio": "9:16",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He throws one ball along the grass for the dog, follows the movement with his eyes, and laughs as it runs after it. Compose a 9:16 three-quarter action frame with the face fully visible. Sony A1, 50mm, f/2.8, 1/1000, auto ISO. The fast shutter freezes his face and core movement while daylight keeps color believable. Keep joints, hands, feet, equipment, and ground contact credible. Allow mild warmth, never fake sweat, sculpted muscles, or smoothing.",
    "locations": {
      "urban": "a forest exercise clearing",
      "outdoorsy": "a lodge deck beside trees",
      "homebody": "a quiet local park lawn"
    },
    "outfits": {
      "casual": "a clean navy athletic tee with tailored shorts",
      "sharp": "a white performance polo with dark shorts",
      "street": "a black technical tee with simple grey shorts"
    }
  },
  {
    "id": "active-07-b",
    "version": 3,
    "bucket": "active",
    "slot": 7,
    "variant": "b",
    "aspectRatio": "9:16",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He receives the returned ball, lowers it beside his leg, and looks toward his companion before the next throw. Use a 9:16 three-quarter burst photograph with ordinary perspective. Friend-taken iPhone 15 Pro burst, 35mm equivalent, no Portrait Mode. His face stays coherent while clothing and extremities retain small movement. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture without athletic-ad polish.",
    "locations": {
      "urban": "a forest exercise clearing",
      "outdoorsy": "a lodge deck beside trees",
      "homebody": "a quiet local park lawn"
    },
    "outfits": {
      "casual": "a clean navy athletic tee with tailored shorts",
      "sharp": "a white performance polo with dark shorts",
      "street": "a black technical tee with simple grey shorts"
    }
  },
  {
    "id": "active-07-c",
    "version": 3,
    "bucket": "active",
    "slot": 7,
    "variant": "c",
    "aspectRatio": "9:16",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He bends only enough to collect the ball, straightens as the dog waits, and smiles at its impatience. Frame a 9:16 three-quarter photograph with activity context behind him. Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Natural contrast and modest depth create a grounded recreational documentary look. Keep natural posture, accurate equipment, modest skin warmth, and real contrast; avoid flexing, impossible motion, filters, and exaggerated physique.",
    "locations": {
      "urban": "a forest exercise clearing",
      "outdoorsy": "a lodge deck beside trees",
      "homebody": "a quiet local park lawn"
    },
    "outfits": {
      "casual": "a clean navy athletic tee with tailored shorts",
      "sharp": "a white performance polo with dark shorts",
      "street": "a black technical tee with simple grey shorts"
    }
  },
  {
    "id": "active-08-a",
    "version": 3,
    "bucket": "active",
    "slot": 8,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He rests with both hands above his knees after the run, straightens as his breathing settles, and looks up smiling. Compose a 4:3 environmental action frame that clearly explains the activity. Sony A1, 50mm, f/2.8, 1/1000, auto ISO. The fast shutter freezes his face and core movement while daylight keeps color believable. Keep joints, hands, feet, equipment, and ground contact credible. Allow mild warmth, never fake sweat, sculpted muscles, or smoothing.",
    "locations": {
      "urban": "a forest exercise clearing",
      "outdoorsy": "a lodge deck beside trees",
      "homebody": "a quiet local park lawn"
    },
    "outfits": {
      "casual": "a clean navy athletic tee with tailored shorts",
      "sharp": "a white performance polo with dark shorts",
      "street": "a black technical tee with simple grey shorts"
    }
  },
  {
    "id": "active-08-b",
    "version": 3,
    "bucket": "active",
    "slot": 8,
    "variant": "b",
    "aspectRatio": "4:3",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He walks the last few meters of the route, slows beside the photographer, and shares a relaxed post-run expression. Use a 4:3 environmental snapshot that includes the path or playing area. Friend-taken iPhone 15 Pro burst, 35mm equivalent, no Portrait Mode. His face stays coherent while clothing and extremities retain small movement. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture without athletic-ad polish.",
    "locations": {
      "urban": "a forest exercise clearing",
      "outdoorsy": "a lodge deck beside trees",
      "homebody": "a quiet local park lawn"
    },
    "outfits": {
      "casual": "a clean navy athletic tee with tailored shorts",
      "sharp": "a white performance polo with dark shorts",
      "street": "a black technical tee with simple grey shorts"
    }
  },
  {
    "id": "active-08-c",
    "version": 3,
    "bucket": "active",
    "slot": 8,
    "variant": "c",
    "aspectRatio": "4:3",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He takes a drink below the frame, replaces the bottle, and grins when his companion asks how the run went. Frame a 4:3 environmental portrait with natural outdoor depth. Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Natural contrast and modest depth create a grounded recreational documentary look. Keep natural posture, accurate equipment, modest skin warmth, and real contrast; avoid flexing, impossible motion, filters, and exaggerated physique.",
    "locations": {
      "urban": "a forest exercise clearing",
      "outdoorsy": "a lodge deck beside trees",
      "homebody": "a quiet local park lawn"
    },
    "outfits": {
      "casual": "a clean navy athletic tee with tailored shorts",
      "sharp": "a white performance polo with dark shorts",
      "street": "a black technical tee with simple grey shorts"
    }
  },
  {
    "id": "active-09-a",
    "version": 3,
    "bucket": "active",
    "slot": 9,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He follows the marked trail with a compact backpack, steps around a root, and looks back toward his companion. Compose a 3:4 knee-up frame with hands and equipment inside the image. Sony A1, 50mm, f/2.8, 1/1000, auto ISO. The fast shutter freezes his face and core movement while daylight keeps color believable. Keep joints, hands, feet, equipment, and ground contact credible. Allow mild warmth, never fake sweat, sculpted muscles, or smoothing.",
    "locations": {
      "urban": "a forest exercise clearing",
      "outdoorsy": "a lodge deck beside trees",
      "homebody": "a quiet local park lawn"
    },
    "outfits": {
      "casual": "a clean navy athletic tee with tailored shorts",
      "sharp": "a white performance polo with dark shorts",
      "street": "a black technical tee with simple grey shorts"
    }
  },
  {
    "id": "active-09-b",
    "version": 3,
    "bucket": "active",
    "slot": 9,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He pauses at the junction to read the marker, chooses the route, and continues with an assured expression. Use a 3:4 knee-up candid with small natural movement at the frame edges. Friend-taken iPhone 15 Pro burst, 35mm equivalent, no Portrait Mode. His face stays coherent while clothing and extremities retain small movement. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture without athletic-ad polish.",
    "locations": {
      "urban": "a forest exercise clearing",
      "outdoorsy": "a lodge deck beside trees",
      "homebody": "a quiet local park lawn"
    },
    "outfits": {
      "casual": "a clean navy athletic tee with tailored shorts",
      "sharp": "a white performance polo with dark shorts",
      "street": "a black technical tee with simple grey shorts"
    }
  },
  {
    "id": "active-09-c",
    "version": 3,
    "bucket": "active",
    "slot": 9,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He adjusts one pack strap while walking, lets his hand fall naturally, and smiles at something said behind him. Frame a 3:4 knee-up photograph that keeps props and hands coherent. Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Natural contrast and modest depth create a grounded recreational documentary look. Keep natural posture, accurate equipment, modest skin warmth, and real contrast; avoid flexing, impossible motion, filters, and exaggerated physique.",
    "locations": {
      "urban": "a forest exercise clearing",
      "outdoorsy": "a lodge deck beside trees",
      "homebody": "a quiet local park lawn"
    },
    "outfits": {
      "casual": "a clean navy athletic tee with tailored shorts",
      "sharp": "a white performance polo with dark shorts",
      "street": "a black technical tee with simple grey shorts"
    }
  },
  {
    "id": "active-10-a",
    "version": 3,
    "bucket": "active",
    "slot": 10,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He steadies one paddleboard at the water's edge, checks the leash attachment, and looks toward the photographer before launching. Compose a 3:4 medium action frame without cropping active joints. Sony A1, 50mm, f/2.8, 1/1000, auto ISO. The fast shutter freezes his face and core movement while daylight keeps color believable. Keep joints, hands, feet, equipment, and ground contact credible. Allow mild warmth, never fake sweat, sculpted muscles, or smoothing.",
    "locations": {
      "urban": "a riverside running route",
      "outdoorsy": "a golden-hour trail path",
      "homebody": "a familiar park loop"
    },
    "outfits": {
      "casual": "a muted blue running tee with black shorts",
      "sharp": "a charcoal long-sleeve running top",
      "street": "a black lightweight running layer with grey shorts"
    }
  },
  {
    "id": "active-10-b",
    "version": 3,
    "bucket": "active",
    "slot": 10,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He carries one paddle beside the board, reaches the shoreline, and smiles at the calm conditions. Use a 3:4 medium snapshot that keeps the face identifiable. Friend-taken iPhone 15 Pro burst, 35mm equivalent, no Portrait Mode. His face stays coherent while clothing and extremities retain small movement. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture without athletic-ad polish.",
    "locations": {
      "urban": "a riverside running route",
      "outdoorsy": "a golden-hour trail path",
      "homebody": "a familiar park loop"
    },
    "outfits": {
      "casual": "a muted blue running tee with black shorts",
      "sharp": "a charcoal long-sleeve running top",
      "street": "a black lightweight running layer with grey shorts"
    }
  },
  {
    "id": "active-10-c",
    "version": 3,
    "bucket": "active",
    "slot": 10,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He stands near the board after returning to shore, lowers the paddle safely, and turns toward his companion. Frame a 3:4 medium portrait taken during the activity rather than after posing. Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Natural contrast and modest depth create a grounded recreational documentary look. Keep natural posture, accurate equipment, modest skin warmth, and real contrast; avoid flexing, impossible motion, filters, and exaggerated physique.",
    "locations": {
      "urban": "a riverside running route",
      "outdoorsy": "a golden-hour trail path",
      "homebody": "a familiar park loop"
    },
    "outfits": {
      "casual": "a muted blue running tee with black shorts",
      "sharp": "a charcoal long-sleeve running top",
      "street": "a black lightweight running layer with grey shorts"
    }
  },
  {
    "id": "active-11-a",
    "version": 3,
    "bucket": "active",
    "slot": 11,
    "variant": "a",
    "aspectRatio": "9:16",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He tests one secure handhold on the easy boulder, shifts his foot carefully, and concentrates on the next move. Compose a 9:16 full-body action frame from sideline height. Sony A1, 50mm, f/2.8, 1/1000, auto ISO. The fast shutter freezes his face and core movement while daylight keeps color believable. Keep joints, hands, feet, equipment, and ground contact credible. Allow mild warmth, never fake sweat, sculpted muscles, or smoothing.",
    "locations": {
      "urban": "a riverside running route",
      "outdoorsy": "a golden-hour trail path",
      "homebody": "a familiar park loop"
    },
    "outfits": {
      "casual": "a muted blue running tee with black shorts",
      "sharp": "a charcoal long-sleeve running top",
      "street": "a black lightweight running layer with grey shorts"
    }
  },
  {
    "id": "active-11-b",
    "version": 3,
    "bucket": "active",
    "slot": 11,
    "variant": "b",
    "aspectRatio": "9:16",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He steps down from the low route, brushes chalk from his hands, and smiles toward his climbing partner. Use a 9:16 friend-taken full-body frame from a safe practical distance. Friend-taken iPhone 15 Pro burst, 35mm equivalent, no Portrait Mode. His face stays coherent while clothing and extremities retain small movement. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture without athletic-ad polish.",
    "locations": {
      "urban": "a riverside running route",
      "outdoorsy": "a golden-hour trail path",
      "homebody": "a familiar park loop"
    },
    "outfits": {
      "casual": "a muted blue running tee with black shorts",
      "sharp": "a charcoal long-sleeve running top",
      "street": "a black lightweight running layer with grey shorts"
    }
  },
  {
    "id": "active-11-c",
    "version": 3,
    "bucket": "active",
    "slot": 11,
    "variant": "c",
    "aspectRatio": "9:16",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He pauses in a stable position on the wall, checks his balance, and looks toward the photographer without posing. Frame a 9:16 full-body documentary photograph with balanced ground contact. Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Natural contrast and modest depth create a grounded recreational documentary look. Keep natural posture, accurate equipment, modest skin warmth, and real contrast; avoid flexing, impossible motion, filters, and exaggerated physique.",
    "locations": {
      "urban": "a riverside running route",
      "outdoorsy": "a golden-hour trail path",
      "homebody": "a familiar park loop"
    },
    "outfits": {
      "casual": "a muted blue running tee with black shorts",
      "sharp": "a charcoal long-sleeve running top",
      "street": "a black lightweight running layer with grey shorts"
    }
  },
  {
    "id": "active-12-a",
    "version": 3,
    "bucket": "active",
    "slot": 12,
    "variant": "a",
    "aspectRatio": "9:16",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He walks through the tall grass at an easy pace, lets one hand brush the seed heads, and looks toward his companion. Compose a 9:16 three-quarter action frame with the face fully visible. Sony A1, 50mm, f/2.8, 1/1000, auto ISO. The fast shutter freezes his face and core movement while daylight keeps color believable. Keep joints, hands, feet, equipment, and ground contact credible. Allow mild warmth, never fake sweat, sculpted muscles, or smoothing.",
    "locations": {
      "urban": "a riverside running route",
      "outdoorsy": "a golden-hour trail path",
      "homebody": "a familiar park loop"
    },
    "outfits": {
      "casual": "a muted blue running tee with black shorts",
      "sharp": "a charcoal long-sleeve running top",
      "street": "a black lightweight running layer with grey shorts"
    }
  },
  {
    "id": "active-12-b",
    "version": 3,
    "bucket": "active",
    "slot": 12,
    "variant": "b",
    "aspectRatio": "9:16",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He stops where the path opens, turns into the warm light, and smiles before continuing. Use a 9:16 three-quarter burst photograph with ordinary perspective. Friend-taken iPhone 15 Pro burst, 35mm equivalent, no Portrait Mode. His face stays coherent while clothing and extremities retain small movement. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture without athletic-ad polish.",
    "locations": {
      "urban": "a riverside running route",
      "outdoorsy": "a golden-hour trail path",
      "homebody": "a familiar park loop"
    },
    "outfits": {
      "casual": "a muted blue running tee with black shorts",
      "sharp": "a charcoal long-sleeve running top",
      "street": "a black lightweight running layer with grey shorts"
    }
  },
  {
    "id": "active-12-c",
    "version": 3,
    "bucket": "active",
    "slot": 12,
    "variant": "c",
    "aspectRatio": "9:16",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He follows the narrow field path, steps around a rough patch, and looks back to share the view. Frame a 9:16 three-quarter photograph with activity context behind him. Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Natural contrast and modest depth create a grounded recreational documentary look. Keep natural posture, accurate equipment, modest skin warmth, and real contrast; avoid flexing, impossible motion, filters, and exaggerated physique.",
    "locations": {
      "urban": "a riverside running route",
      "outdoorsy": "a golden-hour trail path",
      "homebody": "a familiar park loop"
    },
    "outfits": {
      "casual": "a muted blue running tee with black shorts",
      "sharp": "a charcoal long-sleeve running top",
      "street": "a black lightweight running layer with grey shorts"
    }
  },
  {
    "id": "active-13-a",
    "version": 3,
    "bucket": "active",
    "slot": 13,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He refills one water bottle at the trail fountain, closes it securely, and looks up while placing it in his pack. Compose a 4:3 environmental action frame that clearly explains the activity. Sony A1, 50mm, f/2.8, 1/1000, auto ISO. The fast shutter freezes his face and core movement while daylight keeps color believable. Keep joints, hands, feet, equipment, and ground contact credible. Allow mild warmth, never fake sweat, sculpted muscles, or smoothing.",
    "locations": {
      "urban": "a shaded city-park bench",
      "outdoorsy": "a trailhead rest bench",
      "homebody": "a neighborhood park bench"
    },
    "outfits": {
      "casual": "a navy training tee with tapered joggers",
      "sharp": "a grey performance henley with dark athletic pants",
      "street": "a plain black tee with olive technical trousers"
    }
  },
  {
    "id": "active-13-b",
    "version": 3,
    "bucket": "active",
    "slot": 13,
    "variant": "b",
    "aspectRatio": "4:3",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He waits for the bottle to fill, checks the route marker beside him, and smiles toward the photographer. Use a 4:3 environmental snapshot that includes the path or playing area. Friend-taken iPhone 15 Pro burst, 35mm equivalent, no Portrait Mode. His face stays coherent while clothing and extremities retain small movement. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture without athletic-ad polish.",
    "locations": {
      "urban": "a shaded city-park bench",
      "outdoorsy": "a trailhead rest bench",
      "homebody": "a neighborhood park bench"
    },
    "outfits": {
      "casual": "a navy training tee with tapered joggers",
      "sharp": "a grey performance henley with dark athletic pants",
      "street": "a plain black tee with olive technical trousers"
    }
  },
  {
    "id": "active-13-c",
    "version": 3,
    "bucket": "active",
    "slot": 13,
    "variant": "c",
    "aspectRatio": "4:3",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He finishes drinking away from the fountain, replaces the cap, and returns to the path. Frame a 4:3 environmental portrait with natural outdoor depth. Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Natural contrast and modest depth create a grounded recreational documentary look. Keep natural posture, accurate equipment, modest skin warmth, and real contrast; avoid flexing, impossible motion, filters, and exaggerated physique.",
    "locations": {
      "urban": "a shaded city-park bench",
      "outdoorsy": "a trailhead rest bench",
      "homebody": "a neighborhood park bench"
    },
    "outfits": {
      "casual": "a navy training tee with tapered joggers",
      "sharp": "a grey performance henley with dark athletic pants",
      "street": "a plain black tee with olive technical trousers"
    }
  },
  {
    "id": "active-14-a",
    "version": 3,
    "bucket": "active",
    "slot": 14,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He sits on the trail log after the effort, rests both forearms loosely on his thighs, and looks toward his companion. Compose a 3:4 knee-up frame with hands and equipment inside the image. Sony A1, 50mm, f/2.8, 1/1000, auto ISO. The fast shutter freezes his face and core movement while daylight keeps color believable. Keep joints, hands, feet, equipment, and ground contact credible. Allow mild warmth, never fake sweat, sculpted muscles, or smoothing.",
    "locations": {
      "urban": "a shaded city-park bench",
      "outdoorsy": "a trailhead rest bench",
      "homebody": "a neighborhood park bench"
    },
    "outfits": {
      "casual": "a navy training tee with tapered joggers",
      "sharp": "a grey performance henley with dark athletic pants",
      "street": "a plain black tee with olive technical trousers"
    }
  },
  {
    "id": "active-14-b",
    "version": 3,
    "bucket": "active",
    "slot": 14,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He drapes a small towel around his neck, catches his breath, and smiles as the conversation resumes. Use a 3:4 knee-up candid with small natural movement at the frame edges. Friend-taken iPhone 15 Pro burst, 35mm equivalent, no Portrait Mode. His face stays coherent while clothing and extremities retain small movement. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture without athletic-ad polish.",
    "locations": {
      "urban": "a shaded city-park bench",
      "outdoorsy": "a trailhead rest bench",
      "homebody": "a neighborhood park bench"
    },
    "outfits": {
      "casual": "a navy training tee with tapered joggers",
      "sharp": "a grey performance henley with dark athletic pants",
      "street": "a plain black tee with olive technical trousers"
    }
  },
  {
    "id": "active-14-c",
    "version": 3,
    "bucket": "active",
    "slot": 14,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He shifts along the log to make room, sets the bottle beside him, and relaxes into the pause. Frame a 3:4 knee-up photograph that keeps props and hands coherent. Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Natural contrast and modest depth create a grounded recreational documentary look. Keep natural posture, accurate equipment, modest skin warmth, and real contrast; avoid flexing, impossible motion, filters, and exaggerated physique.",
    "locations": {
      "urban": "a shaded city-park bench",
      "outdoorsy": "a trailhead rest bench",
      "homebody": "a neighborhood park bench"
    },
    "outfits": {
      "casual": "a navy training tee with tapered joggers",
      "sharp": "a grey performance henley with dark athletic pants",
      "street": "a plain black tee with olive technical trousers"
    }
  },
  {
    "id": "active-15-a",
    "version": 3,
    "bucket": "active",
    "slot": 15,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He pedals past at a controlled pace, notices the photographer beside the path, and smiles while keeping both hands on the bars. Compose a 3:4 medium action frame without cropping active joints. Sony A1, 50mm, f/2.8, 1/1000, auto ISO. The fast shutter freezes his face and core movement while daylight keeps color believable. Keep joints, hands, feet, equipment, and ground contact credible. Allow mild warmth, never fake sweat, sculpted muscles, or smoothing.",
    "locations": {
      "urban": "a shaded city-park bench",
      "outdoorsy": "a trailhead rest bench",
      "homebody": "a neighborhood park bench"
    },
    "outfits": {
      "casual": "a navy training tee with tapered joggers",
      "sharp": "a grey performance henley with dark athletic pants",
      "street": "a plain black tee with olive technical trousers"
    }
  },
  {
    "id": "active-15-b",
    "version": 3,
    "bucket": "active",
    "slot": 15,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He slows near the stopping point, places one foot down, and looks toward his companion after the ride. Use a 3:4 medium snapshot that keeps the face identifiable. Friend-taken iPhone 15 Pro burst, 35mm equivalent, no Portrait Mode. His face stays coherent while clothing and extremities retain small movement. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture without athletic-ad polish.",
    "locations": {
      "urban": "a shaded city-park bench",
      "outdoorsy": "a trailhead rest bench",
      "homebody": "a neighborhood park bench"
    },
    "outfits": {
      "casual": "a navy training tee with tapered joggers",
      "sharp": "a grey performance henley with dark athletic pants",
      "street": "a plain black tee with olive technical trousers"
    }
  },
  {
    "id": "active-15-c",
    "version": 3,
    "bucket": "active",
    "slot": 15,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He rolls the bicycle beside him after dismounting, keeps one hand on the handlebar, and smiles at the route behind. Frame a 3:4 medium portrait taken during the activity rather than after posing. Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Natural contrast and modest depth create a grounded recreational documentary look. Keep natural posture, accurate equipment, modest skin warmth, and real contrast; avoid flexing, impossible motion, filters, and exaggerated physique.",
    "locations": {
      "urban": "a shaded city-park bench",
      "outdoorsy": "a trailhead rest bench",
      "homebody": "a neighborhood park bench"
    },
    "outfits": {
      "casual": "a navy training tee with tapered joggers",
      "sharp": "a grey performance henley with dark athletic pants",
      "street": "a plain black tee with olive technical trousers"
    }
  },
  {
    "id": "active-16-a",
    "version": 3,
    "bucket": "active",
    "slot": 16,
    "variant": "a",
    "aspectRatio": "9:16",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He completes a casual pass to a friend outside the frame, regains his balance, and laughs at the return. Compose a 9:16 full-body action frame from sideline height. Sony A1, 50mm, f/2.8, 1/1000, auto ISO. The fast shutter freezes his face and core movement while daylight keeps color believable. Keep joints, hands, feet, equipment, and ground contact credible. Allow mild warmth, never fake sweat, sculpted muscles, or smoothing.",
    "locations": {
      "urban": "a landscaped hill path",
      "outdoorsy": "a moderate mountain trail",
      "homebody": "a sloped local greenway"
    },
    "outfits": {
      "casual": "an olive overshirt over a breathable tee",
      "sharp": "a navy technical jacket over a grey layer",
      "street": "a black windbreaker over a plain tee"
    }
  },
  {
    "id": "active-16-b",
    "version": 3,
    "bucket": "active",
    "slot": 16,
    "variant": "b",
    "aspectRatio": "9:16",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He receives one ball at chest height, lowers it securely, and looks toward a teammate with an engaged expression. Use a 9:16 friend-taken full-body frame from a safe practical distance. Friend-taken iPhone 15 Pro burst, 35mm equivalent, no Portrait Mode. His face stays coherent while clothing and extremities retain small movement. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture without athletic-ad polish.",
    "locations": {
      "urban": "a landscaped hill path",
      "outdoorsy": "a moderate mountain trail",
      "homebody": "a sloped local greenway"
    },
    "outfits": {
      "casual": "an olive overshirt over a breathable tee",
      "sharp": "a navy technical jacket over a grey layer",
      "street": "a black windbreaker over a plain tee"
    }
  },
  {
    "id": "active-16-c",
    "version": 3,
    "bucket": "active",
    "slot": 16,
    "variant": "c",
    "aspectRatio": "9:16",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He moves into open space during the recreational game, turns toward the next pass, and remains relaxed rather than competitive. Frame a 9:16 full-body documentary photograph with balanced ground contact. Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Natural contrast and modest depth create a grounded recreational documentary look. Keep natural posture, accurate equipment, modest skin warmth, and real contrast; avoid flexing, impossible motion, filters, and exaggerated physique.",
    "locations": {
      "urban": "a landscaped hill path",
      "outdoorsy": "a moderate mountain trail",
      "homebody": "a sloped local greenway"
    },
    "outfits": {
      "casual": "an olive overshirt over a breathable tee",
      "sharp": "a navy technical jacket over a grey layer",
      "street": "a black windbreaker over a plain tee"
    }
  },
  {
    "id": "active-17-a",
    "version": 3,
    "bucket": "active",
    "slot": 17,
    "variant": "a",
    "aspectRatio": "9:16",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He walks one dog through the last warm light, shortens the leash near the crossing, and looks down with a soft expression. Compose a 9:16 three-quarter action frame with the face fully visible. Sony A1, 50mm, f/2.8, 1/1000, auto ISO. The fast shutter freezes his face and core movement while daylight keeps color believable. Keep joints, hands, feet, equipment, and ground contact credible. Allow mild warmth, never fake sweat, sculpted muscles, or smoothing.",
    "hobbyPromptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At a plausible real-world venue, he concentrates on {{hobby}}, completes one recognizable step, and looks toward his companion with quiet satisfaction. Compose a 9:16 three-quarter action frame with the face fully visible. Sony A1, 50mm, f/2.8, 1/1000, auto ISO. The fast shutter freezes his face and core movement while daylight keeps color believable. Keep joints, hands, feet, equipment, and ground contact credible. Allow mild warmth, never fake sweat, sculpted muscles, or smoothing.",
    "locations": {
      "urban": "a landscaped hill path",
      "outdoorsy": "a moderate mountain trail",
      "homebody": "a sloped local greenway"
    },
    "outfits": {
      "casual": "an olive overshirt over a breathable tee",
      "sharp": "a navy technical jacket over a grey layer",
      "street": "a black windbreaker over a plain tee"
    }
  },
  {
    "id": "active-17-b",
    "version": 3,
    "bucket": "active",
    "slot": 17,
    "variant": "b",
    "aspectRatio": "9:16",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He pauses while the dog drinks from a bowl, waits patiently, and smiles toward the photographer. Use a 9:16 three-quarter burst photograph with ordinary perspective. Friend-taken iPhone 15 Pro burst, 35mm equivalent, no Portrait Mode. His face stays coherent while clothing and extremities retain small movement. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture without athletic-ad polish.",
    "hobbyPromptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. A friend photographs him naturally participating in {{hobby}}; he finishes a small action, checks the result, and reacts without posing. Use a 9:16 three-quarter burst photograph with ordinary perspective. Friend-taken iPhone 15 Pro burst, 35mm equivalent, no Portrait Mode. His face stays coherent while clothing and extremities retain small movement. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture without athletic-ad polish.",
    "locations": {
      "urban": "a landscaped hill path",
      "outdoorsy": "a moderate mountain trail",
      "homebody": "a sloped local greenway"
    },
    "outfits": {
      "casual": "an olive overshirt over a breathable tee",
      "sharp": "a navy technical jacket over a grey layer",
      "street": "a black windbreaker over a plain tee"
    }
  },
  {
    "id": "active-17-c",
    "version": 3,
    "bucket": "active",
    "slot": 17,
    "variant": "c",
    "aspectRatio": "9:16",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He resumes the path beside the dog, lets the leash settle loose, and looks toward his companion. Frame a 9:16 three-quarter photograph with activity context behind him. Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Natural contrast and modest depth create a grounded recreational documentary look. Keep natural posture, accurate equipment, modest skin warmth, and real contrast; avoid flexing, impossible motion, filters, and exaggerated physique.",
    "hobbyPromptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. During an ordinary session of {{hobby}}, he uses only necessary equipment, pauses at a natural transition, and acknowledges the photographer. Frame a 9:16 three-quarter photograph with activity context behind him. Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Natural contrast and modest depth create a grounded recreational documentary look. Keep natural posture, accurate equipment, modest skin warmth, and real contrast; avoid flexing, impossible motion, filters, and exaggerated physique.",
    "locations": {
      "urban": "a landscaped hill path",
      "outdoorsy": "a moderate mountain trail",
      "homebody": "a sloped local greenway"
    },
    "outfits": {
      "casual": "an olive overshirt over a breathable tee",
      "sharp": "a navy technical jacket over a grey layer",
      "street": "a black windbreaker over a plain tee"
    }
  },
  {
    "id": "active-18-a",
    "version": 3,
    "bucket": "active",
    "slot": 18,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He braces one foot against the tree for a calf stretch, releases it after a breath, and looks toward the photographer. Compose a 4:3 environmental action frame that clearly explains the activity. Sony A1, 50mm, f/2.8, 1/1000, auto ISO. The fast shutter freezes his face and core movement while daylight keeps color believable. Keep joints, hands, feet, equipment, and ground contact credible. Allow mild warmth, never fake sweat, sculpted muscles, or smoothing.",
    "hobbyPromptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At a plausible real-world venue, he concentrates on {{hobby}}, completes one recognizable step, and looks toward his companion with quiet satisfaction. Compose a 4:3 environmental action frame that clearly explains the activity. Sony A1, 50mm, f/2.8, 1/1000, auto ISO. The fast shutter freezes his face and core movement while daylight keeps color believable. Keep joints, hands, feet, equipment, and ground contact credible. Allow mild warmth, never fake sweat, sculpted muscles, or smoothing.",
    "locations": {
      "urban": "a landscaped hill path",
      "outdoorsy": "a moderate mountain trail",
      "homebody": "a sloped local greenway"
    },
    "outfits": {
      "casual": "an olive overshirt over a breathable tee",
      "sharp": "a navy technical jacket over a grey layer",
      "street": "a black windbreaker over a plain tee"
    }
  },
  {
    "id": "active-18-b",
    "version": 3,
    "bucket": "active",
    "slot": 18,
    "variant": "b",
    "aspectRatio": "4:3",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He finishes a simple wall stretch, lowers both arms, and smiles while stepping back onto the path. Use a 4:3 environmental snapshot that includes the path or playing area. Friend-taken iPhone 15 Pro burst, 35mm equivalent, no Portrait Mode. His face stays coherent while clothing and extremities retain small movement. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture without athletic-ad polish.",
    "hobbyPromptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. A friend photographs him naturally participating in {{hobby}}; he finishes a small action, checks the result, and reacts without posing. Use a 4:3 environmental snapshot that includes the path or playing area. Friend-taken iPhone 15 Pro burst, 35mm equivalent, no Portrait Mode. His face stays coherent while clothing and extremities retain small movement. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture without athletic-ad polish.",
    "locations": {
      "urban": "a landscaped hill path",
      "outdoorsy": "a moderate mountain trail",
      "homebody": "a sloped local greenway"
    },
    "outfits": {
      "casual": "an olive overshirt over a breathable tee",
      "sharp": "a navy technical jacket over a grey layer",
      "street": "a black windbreaker over a plain tee"
    }
  },
  {
    "id": "active-18-c",
    "version": 3,
    "bucket": "active",
    "slot": 18,
    "variant": "c",
    "aspectRatio": "4:3",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He extends one leg beside the bench after the walk, checks his footing, and relaxes from the stretch naturally. Frame a 4:3 environmental portrait with natural outdoor depth. Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Natural contrast and modest depth create a grounded recreational documentary look. Keep natural posture, accurate equipment, modest skin warmth, and real contrast; avoid flexing, impossible motion, filters, and exaggerated physique.",
    "hobbyPromptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. During an ordinary session of {{hobby}}, he uses only necessary equipment, pauses at a natural transition, and acknowledges the photographer. Frame a 4:3 environmental portrait with natural outdoor depth. Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Natural contrast and modest depth create a grounded recreational documentary look. Keep natural posture, accurate equipment, modest skin warmth, and real contrast; avoid flexing, impossible motion, filters, and exaggerated physique.",
    "locations": {
      "urban": "a landscaped hill path",
      "outdoorsy": "a moderate mountain trail",
      "homebody": "a sloped local greenway"
    },
    "outfits": {
      "casual": "an olive overshirt over a breathable tee",
      "sharp": "a navy technical jacket over a grey layer",
      "street": "a black windbreaker over a plain tee"
    }
  },
  {
    "id": "active-19-a",
    "version": 3,
    "bucket": "active",
    "slot": 19,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He carries a modest grocery tote home after the walk, shifts it to the other hand, and looks toward his companion. Compose a 3:4 knee-up frame with hands and equipment inside the image. Sony A1, 50mm, f/2.8, 1/1000, auto ISO. The fast shutter freezes his face and core movement while daylight keeps color believable. Keep joints, hands, feet, equipment, and ground contact credible. Allow mild warmth, never fake sweat, sculpted muscles, or smoothing.",
    "hobbyPromptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At a plausible real-world venue, he concentrates on {{hobby}}, completes one recognizable step, and looks toward his companion with quiet satisfaction. Compose a 3:4 knee-up frame with hands and equipment inside the image. Sony A1, 50mm, f/2.8, 1/1000, auto ISO. The fast shutter freezes his face and core movement while daylight keeps color believable. Keep joints, hands, feet, equipment, and ground contact credible. Allow mild warmth, never fake sweat, sculpted muscles, or smoothing.",
    "locations": {
      "urban": "an open city-park lawn",
      "outdoorsy": "a meadow near a lodge",
      "homebody": "a broad neighborhood recreation field"
    },
    "outfits": {
      "casual": "a breathable navy tee with tapered joggers",
      "sharp": "a fitted charcoal quarter-zip with technical trousers",
      "street": "a dark windbreaker over a plain tee"
    }
  },
  {
    "id": "active-19-b",
    "version": 3,
    "bucket": "active",
    "slot": 19,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He leaves the market with one reusable bag, steps around another shopper, and smiles while continuing down the path. Use a 3:4 knee-up candid with small natural movement at the frame edges. Friend-taken iPhone 15 Pro burst, 35mm equivalent, no Portrait Mode. His face stays coherent while clothing and extremities retain small movement. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture without athletic-ad polish.",
    "hobbyPromptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. A friend photographs him naturally participating in {{hobby}}; he finishes a small action, checks the result, and reacts without posing. Use a 3:4 knee-up candid with small natural movement at the frame edges. Friend-taken iPhone 15 Pro burst, 35mm equivalent, no Portrait Mode. His face stays coherent while clothing and extremities retain small movement. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture without athletic-ad polish.",
    "locations": {
      "urban": "an open city-park lawn",
      "outdoorsy": "a meadow near a lodge",
      "homebody": "a broad neighborhood recreation field"
    },
    "outfits": {
      "casual": "a breathable navy tee with tapered joggers",
      "sharp": "a fitted charcoal quarter-zip with technical trousers",
      "street": "a dark windbreaker over a plain tee"
    }
  },
  {
    "id": "active-19-c",
    "version": 3,
    "bucket": "active",
    "slot": 19,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He pauses near the corner to settle the tote handles, then resumes walking with an easy neighborhood rhythm. Frame a 3:4 knee-up photograph that keeps props and hands coherent. Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Natural contrast and modest depth create a grounded recreational documentary look. Keep natural posture, accurate equipment, modest skin warmth, and real contrast; avoid flexing, impossible motion, filters, and exaggerated physique.",
    "hobbyPromptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. During an ordinary session of {{hobby}}, he uses only necessary equipment, pauses at a natural transition, and acknowledges the photographer. Frame a 3:4 knee-up photograph that keeps props and hands coherent. Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Natural contrast and modest depth create a grounded recreational documentary look. Keep natural posture, accurate equipment, modest skin warmth, and real contrast; avoid flexing, impossible motion, filters, and exaggerated physique.",
    "locations": {
      "urban": "an open city-park lawn",
      "outdoorsy": "a meadow near a lodge",
      "homebody": "a broad neighborhood recreation field"
    },
    "outfits": {
      "casual": "a breathable navy tee with tapered joggers",
      "sharp": "a fitted charcoal quarter-zip with technical trousers",
      "street": "a dark windbreaker over a plain tee"
    }
  },
  {
    "id": "active-20-a",
    "version": 3,
    "bucket": "active",
    "slot": 20,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He reaches the overlook, lets both arms rest at his sides, and looks across the view while the wind moves his hair. Compose a 3:4 medium action frame without cropping active joints. Sony A1, 50mm, f/2.8, 1/1000, auto ISO. The fast shutter freezes his face and core movement while daylight keeps color believable. Keep joints, hands, feet, equipment, and ground contact credible. Allow mild warmth, never fake sweat, sculpted muscles, or smoothing.",
    "hobbyPromptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At a plausible real-world venue, he concentrates on {{hobby}}, completes one recognizable step, and looks toward his companion with quiet satisfaction. Compose a 3:4 medium action frame without cropping active joints. Sony A1, 50mm, f/2.8, 1/1000, auto ISO. The fast shutter freezes his face and core movement while daylight keeps color believable. Keep joints, hands, feet, equipment, and ground contact credible. Allow mild warmth, never fake sweat, sculpted muscles, or smoothing.",
    "locations": {
      "urban": "an open city-park lawn",
      "outdoorsy": "a meadow near a lodge",
      "homebody": "a broad neighborhood recreation field"
    },
    "outfits": {
      "casual": "a breathable navy tee with tapered joggers",
      "sharp": "a fitted charcoal quarter-zip with technical trousers",
      "street": "a dark windbreaker over a plain tee"
    }
  },
  {
    "id": "active-20-b",
    "version": 3,
    "bucket": "active",
    "slot": 20,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He sets the backpack down safely beside him, takes in the route below, and smiles toward his companion. Use a 3:4 medium snapshot that keeps the face identifiable. Friend-taken iPhone 15 Pro burst, 35mm equivalent, no Portrait Mode. His face stays coherent while clothing and extremities retain small movement. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture without athletic-ad polish.",
    "hobbyPromptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. A friend photographs him naturally participating in {{hobby}}; he finishes a small action, checks the result, and reacts without posing. Use a 3:4 medium snapshot that keeps the face identifiable. Friend-taken iPhone 15 Pro burst, 35mm equivalent, no Portrait Mode. His face stays coherent while clothing and extremities retain small movement. Preserve believable mechanics, movement outside the face, distance-appropriate skin, and ordinary phone texture without athletic-ad polish.",
    "locations": {
      "urban": "an open city-park lawn",
      "outdoorsy": "a meadow near a lodge",
      "homebody": "a broad neighborhood recreation field"
    },
    "outfits": {
      "casual": "a breathable navy tee with tapered joggers",
      "sharp": "a fitted charcoal quarter-zip with technical trousers",
      "street": "a dark windbreaker over a plain tee"
    }
  },
  {
    "id": "active-20-c",
    "version": 3,
    "bucket": "active",
    "slot": 20,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He walks the final steps to the viewpoint, stops without raising his arms, and shares a quiet satisfied expression. Frame a 3:4 medium portrait taken during the activity rather than after posing. Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Natural contrast and modest depth create a grounded recreational documentary look. Keep natural posture, accurate equipment, modest skin warmth, and real contrast; avoid flexing, impossible motion, filters, and exaggerated physique.",
    "hobbyPromptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. During an ordinary session of {{hobby}}, he uses only necessary equipment, pauses at a natural transition, and acknowledges the photographer. Frame a 3:4 medium portrait taken during the activity rather than after posing. Fujifilm X-T5, 33mm, f/2.8, 1/500, ISO 400. Natural contrast and modest depth create a grounded recreational documentary look. Keep natural posture, accurate equipment, modest skin warmth, and real contrast; avoid flexing, impossible motion, filters, and exaggerated physique.",
    "locations": {
      "urban": "an open city-park lawn",
      "outdoorsy": "a meadow near a lodge",
      "homebody": "a broad neighborhood recreation field"
    },
    "outfits": {
      "casual": "a breathable navy tee with tapered joggers",
      "sharp": "a fitted charcoal quarter-zip with technical trousers",
      "street": "a dark windbreaker over a plain tee"
    }
  },
  {
    "id": "street-01-a",
    "version": 3,
    "bucket": "street",
    "slot": 1,
    "variant": "a",
    "aspectRatio": "9:16",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He enters the crosswalk with the signal, notices the photographer across the street, and looks up while maintaining his pace. Compose a 9:16 full-body street frame with straight surrounding lines. Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Documentary framing retains street context, natural perspective, and available-light color. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light color without smoothing or teal-orange grading.",
    "locations": {
      "urban": "a calm downtown crosswalk",
      "outdoorsy": "a scenic-town crossing",
      "homebody": "a leafy neighborhood crossing"
    },
    "outfits": {
      "casual": "a navy overshirt over a white tee with dark jeans",
      "sharp": "a charcoal blazer over a black crew-neck tee",
      "street": "a vintage bomber over a grey tee"
    }
  },
  {
    "id": "street-01-b",
    "version": 3,
    "bucket": "street",
    "slot": 1,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He waits at the curb with his phone already pocketed, steps forward as traffic stops, and smiles toward his companion. Frame a 3:4 waist-up night portrait with available street context. Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. Spread grain through shadows and background as well as skin. Keep mixed color, natural highlights, and no waxy smoothing.",
    "locations": {
      "urban": "a calm downtown crosswalk",
      "outdoorsy": "a scenic-town crossing",
      "homebody": "a leafy neighborhood crossing"
    },
    "outfits": {
      "casual": "a navy overshirt over a white tee with dark jeans",
      "sharp": "a charcoal blazer over a black crew-neck tee",
      "street": "a vintage bomber over a grey tee"
    }
  },
  {
    "id": "street-01-c",
    "version": 3,
    "bucket": "street",
    "slot": 1,
    "variant": "c",
    "aspectRatio": "9:16",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He reaches the far side of the crossing, turns at a comment from behind him, and continues toward the sidewalk. Use a 9:16 full-body flash snapshot with believable street distance. Compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. His face freezes cleanly while ambient light and slight background movement remain. Flash reveals honest texture, modest shine, fabric creases, and a natural shadow. Avoid porcelain skin, clipped detail, and tabloid styling.",
    "locations": {
      "urban": "a calm downtown crosswalk",
      "outdoorsy": "a scenic-town crossing",
      "homebody": "a leafy neighborhood crossing"
    },
    "outfits": {
      "casual": "a navy overshirt over a white tee with dark jeans",
      "sharp": "a charcoal blazer over a black crew-neck tee",
      "street": "a vintage bomber over a grey tee"
    }
  },
  {
    "id": "street-02-a",
    "version": 3,
    "bucket": "street",
    "slot": 2,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. A breeze catches his jacket as he walks, so he settles the collar below his jaw and keeps moving toward the photographer. Compose a 3:4 knee-up documentary frame from across the sidewalk. Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Documentary framing retains street context, natural perspective, and available-light color. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light color without smoothing or teal-orange grading.",
    "locations": {
      "urban": "a calm downtown crosswalk",
      "outdoorsy": "a scenic-town crossing",
      "homebody": "a leafy neighborhood crossing"
    },
    "outfits": {
      "casual": "a navy overshirt over a white tee with dark jeans",
      "sharp": "a charcoal blazer over a black crew-neck tee",
      "street": "a vintage bomber over a grey tee"
    }
  },
  {
    "id": "street-02-b",
    "version": 3,
    "bucket": "street",
    "slot": 2,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He steps from the sheltered doorway into the wind, closes the front of his coat once, and looks down the street. Frame a 3:4 three-quarter portrait through a small amount of foreground light. Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. Spread grain through shadows and background as well as skin. Keep mixed color, natural highlights, and no waxy smoothing.",
    "locations": {
      "urban": "a calm downtown crosswalk",
      "outdoorsy": "a scenic-town crossing",
      "homebody": "a leafy neighborhood crossing"
    },
    "outfits": {
      "casual": "a navy overshirt over a white tee with dark jeans",
      "sharp": "a charcoal blazer over a black crew-neck tee",
      "street": "a vintage bomber over a grey tee"
    }
  },
  {
    "id": "street-02-c",
    "version": 3,
    "bucket": "street",
    "slot": 2,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He rounds the corner, frees one hand from his pocket to steady the jacket, and smiles at the weather. Use a 3:4 knee-up flash photograph with a clean shadow behind him. Compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. His face freezes cleanly while ambient light and slight background movement remain. Flash reveals honest texture, modest shine, fabric creases, and a natural shadow. Avoid porcelain skin, clipped detail, and tabloid styling.",
    "locations": {
      "urban": "a calm downtown crosswalk",
      "outdoorsy": "a scenic-town crossing",
      "homebody": "a leafy neighborhood crossing"
    },
    "outfits": {
      "casual": "a navy overshirt over a white tee with dark jeans",
      "sharp": "a charcoal blazer over a black crew-neck tee",
      "street": "a vintage bomber over a grey tee"
    }
  },
  {
    "id": "street-03-a",
    "version": 3,
    "bucket": "street",
    "slot": 3,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He waits beside the shelter glass, watches the approaching route, and turns toward the photographer when the display changes. Compose a 4:3 environmental portrait with reflections kept secondary. Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Documentary framing retains street context, natural perspective, and available-light color. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light color without smoothing or teal-orange grading.",
    "locations": {
      "urban": "a calm downtown crosswalk",
      "outdoorsy": "a scenic-town crossing",
      "homebody": "a leafy neighborhood crossing"
    },
    "outfits": {
      "casual": "a navy overshirt over a white tee with dark jeans",
      "sharp": "a charcoal blazer over a black crew-neck tee",
      "street": "a vintage bomber over a grey tee"
    }
  },
  {
    "id": "street-03-b",
    "version": 3,
    "bucket": "street",
    "slot": 3,
    "variant": "b",
    "aspectRatio": "9:16",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He steps aside for another passenger, checks the street beyond the shelter, and returns to his relaxed position. Frame a 9:16 full-body night photograph with the face remaining readable. Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. Spread grain through shadows and background as well as skin. Keep mixed color, natural highlights, and no waxy smoothing.",
    "locations": {
      "urban": "a calm downtown crosswalk",
      "outdoorsy": "a scenic-town crossing",
      "homebody": "a leafy neighborhood crossing"
    },
    "outfits": {
      "casual": "a navy overshirt over a white tee with dark jeans",
      "sharp": "a charcoal blazer over a black crew-neck tee",
      "street": "a vintage bomber over a grey tee"
    }
  },
  {
    "id": "street-03-c",
    "version": 3,
    "bucket": "street",
    "slot": 3,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He notices the bus in the distance, pockets the ticket, and looks toward his companion before it arrives. Use a 3:4 waist-up compact-camera frame with direct eye-level perspective. Compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. His face freezes cleanly while ambient light and slight background movement remain. Flash reveals honest texture, modest shine, fabric creases, and a natural shadow. Avoid porcelain skin, clipped detail, and tabloid styling.",
    "locations": {
      "urban": "a calm downtown crosswalk",
      "outdoorsy": "a scenic-town crossing",
      "homebody": "a leafy neighborhood crossing"
    },
    "outfits": {
      "casual": "a navy overshirt over a white tee with dark jeans",
      "sharp": "a charcoal blazer over a black crew-neck tee",
      "street": "a vintage bomber over a grey tee"
    }
  },
  {
    "id": "street-04-a",
    "version": 3,
    "bucket": "street",
    "slot": 4,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He sits on the broad step to retie one sneaker, pulls the knot firm, and looks up before standing. Compose a 3:4 waist-up frame from an ordinary pedestrian distance. Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Documentary framing retains street context, natural perspective, and available-light color. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light color without smoothing or teal-orange grading.",
    "locations": {
      "urban": "a glass-and-stone city sidewalk",
      "outdoorsy": "a breezy trail-town street",
      "homebody": "a residential high street"
    },
    "outfits": {
      "casual": "a cream sweatshirt and dark jeans",
      "sharp": "a camel coat over a fine navy knit",
      "street": "a black denim jacket over a plain white tee"
    }
  },
  {
    "id": "street-04-b",
    "version": 3,
    "bucket": "street",
    "slot": 4,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He rests on the step after walking, places both hands beside him, and reacts to something the photographer says. Frame a 3:4 chest-up portrait with mixed light falling naturally across the face. Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. Spread grain through shadows and background as well as skin. Keep mixed color, natural highlights, and no waxy smoothing.",
    "locations": {
      "urban": "a glass-and-stone city sidewalk",
      "outdoorsy": "a breezy trail-town street",
      "homebody": "a residential high street"
    },
    "outfits": {
      "casual": "a cream sweatshirt and dark jeans",
      "sharp": "a camel coat over a fine navy knit",
      "street": "a black denim jacket over a plain white tee"
    }
  },
  {
    "id": "street-04-c",
    "version": 3,
    "bucket": "street",
    "slot": 4,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He shifts along the step to make room for a passerby, then turns back toward the conversation with a small smile. Use a 3:4 three-quarter snapshot with slight ambient movement behind him. Compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. His face freezes cleanly while ambient light and slight background movement remain. Flash reveals honest texture, modest shine, fabric creases, and a natural shadow. Avoid porcelain skin, clipped detail, and tabloid styling.",
    "locations": {
      "urban": "a glass-and-stone city sidewalk",
      "outdoorsy": "a breezy trail-town street",
      "homebody": "a residential high street"
    },
    "outfits": {
      "casual": "a cream sweatshirt and dark jeans",
      "sharp": "a camel coat over a fine navy knit",
      "street": "a black denim jacket over a plain white tee"
    }
  },
  {
    "id": "street-05-a",
    "version": 3,
    "bucket": "street",
    "slot": 5,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He crosses the plaza at a brisk ordinary pace, clears windblown hair from his eyes once, and looks toward the photographer. Compose a 4:3 three-quarter frame that preserves pavement and storefront context. Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Documentary framing retains street context, natural perspective, and available-light color. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light color without smoothing or teal-orange grading.",
    "locations": {
      "urban": "a glass-and-stone city sidewalk",
      "outdoorsy": "a breezy trail-town street",
      "homebody": "a residential high street"
    },
    "outfits": {
      "casual": "a cream sweatshirt and dark jeans",
      "sharp": "a camel coat over a fine navy knit",
      "street": "a black denim jacket over a plain white tee"
    }
  },
  {
    "id": "street-05-b",
    "version": 3,
    "bucket": "street",
    "slot": 5,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He slows near the center to let a cyclist pass, resumes walking, and smiles at his companion. Frame a 3:4 knee-up photograph with background lights softly present. Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. Spread grain through shadows and background as well as skin. Keep mixed color, natural highlights, and no waxy smoothing.",
    "locations": {
      "urban": "a glass-and-stone city sidewalk",
      "outdoorsy": "a breezy trail-town street",
      "homebody": "a residential high street"
    },
    "outfits": {
      "casual": "a cream sweatshirt and dark jeans",
      "sharp": "a camel coat over a fine navy knit",
      "street": "a black denim jacket over a plain white tee"
    }
  },
  {
    "id": "street-05-c",
    "version": 3,
    "bucket": "street",
    "slot": 5,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He leaves the market square with one hand in a pocket, notices the photographer waiting, and changes direction toward them. Use a 3:4 medium flash frame with ordinary edge falloff. Compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. His face freezes cleanly while ambient light and slight background movement remain. Flash reveals honest texture, modest shine, fabric creases, and a natural shadow. Avoid porcelain skin, clipped detail, and tabloid styling.",
    "locations": {
      "urban": "a glass-and-stone city sidewalk",
      "outdoorsy": "a breezy trail-town street",
      "homebody": "a residential high street"
    },
    "outfits": {
      "casual": "a cream sweatshirt and dark jeans",
      "sharp": "a camel coat over a fine navy knit",
      "street": "a black denim jacket over a plain white tee"
    }
  },
  {
    "id": "street-06-a",
    "version": 3,
    "bucket": "street",
    "slot": 6,
    "variant": "a",
    "aspectRatio": "9:16",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He waits behind the platform line as the train arrives, steadies himself naturally, and looks toward his companion. Compose a 9:16 full-body street frame with straight surrounding lines. Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Documentary framing retains street context, natural perspective, and available-light color. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light color without smoothing or teal-orange grading.",
    "locations": {
      "urban": "a glass-and-stone city sidewalk",
      "outdoorsy": "a breezy trail-town street",
      "homebody": "a residential high street"
    },
    "outfits": {
      "casual": "a cream sweatshirt and dark jeans",
      "sharp": "a camel coat over a fine navy knit",
      "street": "a black denim jacket over a plain white tee"
    }
  },
  {
    "id": "street-06-b",
    "version": 3,
    "bucket": "street",
    "slot": 6,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He steps away from the carriage doors to let passengers exit, then turns back when the route is announced. Frame a 3:4 waist-up night portrait with available street context. Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. Spread grain through shadows and background as well as skin. Keep mixed color, natural highlights, and no waxy smoothing.",
    "locations": {
      "urban": "a glass-and-stone city sidewalk",
      "outdoorsy": "a breezy trail-town street",
      "homebody": "a residential high street"
    },
    "outfits": {
      "casual": "a cream sweatshirt and dark jeans",
      "sharp": "a camel coat over a fine navy knit",
      "street": "a black denim jacket over a plain white tee"
    }
  },
  {
    "id": "street-06-c",
    "version": 3,
    "bucket": "street",
    "slot": 6,
    "variant": "c",
    "aspectRatio": "9:16",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He stands near the platform column, watches the train pass, and meets the photographer's gaze after it clears. Use a 9:16 full-body flash snapshot with believable street distance. Compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. His face freezes cleanly while ambient light and slight background movement remain. Flash reveals honest texture, modest shine, fabric creases, and a natural shadow. Avoid porcelain skin, clipped detail, and tabloid styling.",
    "locations": {
      "urban": "a glass-and-stone city sidewalk",
      "outdoorsy": "a breezy trail-town street",
      "homebody": "a residential high street"
    },
    "outfits": {
      "casual": "a cream sweatshirt and dark jeans",
      "sharp": "a camel coat over a fine navy knit",
      "street": "a black denim jacket over a plain white tee"
    }
  },
  {
    "id": "street-07-a",
    "version": 3,
    "bucket": "street",
    "slot": 7,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He lowers the street-food tray after a bite, looks toward his companion's reaction, and shares a tired late-night grin. Compose a 3:4 knee-up documentary frame from across the sidewalk. Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Documentary framing retains street context, natural perspective, and available-light color. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light color without smoothing or teal-orange grading.",
    "locations": {
      "urban": "a clean tram shelter",
      "outdoorsy": "a timber shuttle shelter",
      "homebody": "a neighborhood bus shelter"
    },
    "outfits": {
      "casual": "an olive overshirt over a charcoal tee",
      "sharp": "a navy knit polo beneath a light jacket",
      "street": "a worn black bomber over a cream tee"
    }
  },
  {
    "id": "street-07-b",
    "version": 3,
    "bucket": "street",
    "slot": 7,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He waits at the curb while the vendor finishes the order, accepts one small bag, and turns toward the photographer. Frame a 3:4 three-quarter portrait through a small amount of foreground light. Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. Spread grain through shadows and background as well as skin. Keep mixed color, natural highlights, and no waxy smoothing.",
    "locations": {
      "urban": "a clean tram shelter",
      "outdoorsy": "a timber shuttle shelter",
      "homebody": "a neighborhood bus shelter"
    },
    "outfits": {
      "casual": "an olive overshirt over a charcoal tee",
      "sharp": "a navy knit polo beneath a light jacket",
      "street": "a worn black bomber over a cream tee"
    }
  },
  {
    "id": "street-07-c",
    "version": 3,
    "bucket": "street",
    "slot": 7,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He offers the next bite to a friend outside the frame, draws the tray back carefully, and laughs at the refusal. Use a 3:4 knee-up flash photograph with a clean shadow behind him. Compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. His face freezes cleanly while ambient light and slight background movement remain. Flash reveals honest texture, modest shine, fabric creases, and a natural shadow. Avoid porcelain skin, clipped detail, and tabloid styling.",
    "locations": {
      "urban": "a clean tram shelter",
      "outdoorsy": "a timber shuttle shelter",
      "homebody": "a neighborhood bus shelter"
    },
    "outfits": {
      "casual": "an olive overshirt over a charcoal tee",
      "sharp": "a navy knit polo beneath a light jacket",
      "street": "a worn black bomber over a cream tee"
    }
  },
  {
    "id": "street-08-a",
    "version": 3,
    "bucket": "street",
    "slot": 8,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He rests in the passenger seat of the parked car, turns from the window, and gives his friend a sleepy amused smile. Compose a 4:3 environmental portrait with reflections kept secondary. Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Documentary framing retains street context, natural perspective, and available-light color. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light color without smoothing or teal-orange grading.",
    "locations": {
      "urban": "a clean tram shelter",
      "outdoorsy": "a timber shuttle shelter",
      "homebody": "a neighborhood bus shelter"
    },
    "outfits": {
      "casual": "an olive overshirt over a charcoal tee",
      "sharp": "a navy knit polo beneath a light jacket",
      "street": "a worn black bomber over a cream tee"
    }
  },
  {
    "id": "street-08-b",
    "version": 3,
    "bucket": "street",
    "slot": 8,
    "variant": "b",
    "aspectRatio": "9:16",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He reaches to lower the quiet radio, settles back against the headrest, and looks toward the photographer beside the car. Frame a 9:16 full-body night photograph with the face remaining readable. Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. Spread grain through shadows and background as well as skin. Keep mixed color, natural highlights, and no waxy smoothing.",
    "locations": {
      "urban": "a clean tram shelter",
      "outdoorsy": "a timber shuttle shelter",
      "homebody": "a neighborhood bus shelter"
    },
    "outfits": {
      "casual": "an olive overshirt over a charcoal tee",
      "sharp": "a navy knit polo beneath a light jacket",
      "street": "a worn black bomber over a cream tee"
    }
  },
  {
    "id": "street-08-c",
    "version": 3,
    "bucket": "street",
    "slot": 8,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He waits in the parked car before going inside, checks the entrance, and smiles when his companion arrives. Use a 3:4 waist-up compact-camera frame with direct eye-level perspective. Compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. His face freezes cleanly while ambient light and slight background movement remain. Flash reveals honest texture, modest shine, fabric creases, and a natural shadow. Avoid porcelain skin, clipped detail, and tabloid styling.",
    "locations": {
      "urban": "a clean tram shelter",
      "outdoorsy": "a timber shuttle shelter",
      "homebody": "a neighborhood bus shelter"
    },
    "outfits": {
      "casual": "an olive overshirt over a charcoal tee",
      "sharp": "a navy knit polo beneath a light jacket",
      "street": "a worn black bomber over a cream tee"
    }
  },
  {
    "id": "street-09-a",
    "version": 3,
    "bucket": "street",
    "slot": 9,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He reaches the apartment door, checks one jacket pocket for the keys, finds them, and looks back with mild relief. Compose a 3:4 waist-up frame from an ordinary pedestrian distance. Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Documentary framing retains street context, natural perspective, and available-light color. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light color without smoothing or teal-orange grading.",
    "locations": {
      "urban": "a clean tram shelter",
      "outdoorsy": "a timber shuttle shelter",
      "homebody": "a neighborhood bus shelter"
    },
    "outfits": {
      "casual": "an olive overshirt over a charcoal tee",
      "sharp": "a navy knit polo beneath a light jacket",
      "street": "a worn black bomber over a cream tee"
    }
  },
  {
    "id": "street-09-b",
    "version": 3,
    "bucket": "street",
    "slot": 9,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He holds the key near the lock, pauses when his companion says something, and turns with an amused expression. Frame a 3:4 chest-up portrait with mixed light falling naturally across the face. Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. Spread grain through shadows and background as well as skin. Keep mixed color, natural highlights, and no waxy smoothing.",
    "locations": {
      "urban": "a clean tram shelter",
      "outdoorsy": "a timber shuttle shelter",
      "homebody": "a neighborhood bus shelter"
    },
    "outfits": {
      "casual": "an olive overshirt over a charcoal tee",
      "sharp": "a navy knit polo beneath a light jacket",
      "street": "a worn black bomber over a cream tee"
    }
  },
  {
    "id": "street-09-c",
    "version": 3,
    "bucket": "street",
    "slot": 9,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He steps beneath the doorway light, shifts a small bag to one hand, and unlocks the door without posing. Use a 3:4 three-quarter snapshot with slight ambient movement behind him. Compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. His face freezes cleanly while ambient light and slight background movement remain. Flash reveals honest texture, modest shine, fabric creases, and a natural shadow. Avoid porcelain skin, clipped detail, and tabloid styling.",
    "locations": {
      "urban": "a clean tram shelter",
      "outdoorsy": "a timber shuttle shelter",
      "homebody": "a neighborhood bus shelter"
    },
    "outfits": {
      "casual": "an olive overshirt over a charcoal tee",
      "sharp": "a navy knit polo beneath a light jacket",
      "street": "a worn black bomber over a cream tee"
    }
  },
  {
    "id": "street-10-a",
    "version": 3,
    "bucket": "street",
    "slot": 10,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He walks across the wet pavement, hears his companion behind him, and looks back while his leading foot continues forward. Compose a 4:3 three-quarter frame that preserves pavement and storefront context. Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Documentary framing retains street context, natural perspective, and available-light color. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light color without smoothing or teal-orange grading.",
    "locations": {
      "urban": "a broad civic-building step",
      "outdoorsy": "a visitor-center stair",
      "homebody": "a low brownstone step"
    },
    "outfits": {
      "casual": "a charcoal henley with dark chinos",
      "sharp": "a light-grey blazer over a navy tee",
      "street": "a black chore coat over a washed white tee"
    }
  },
  {
    "id": "street-10-b",
    "version": 3,
    "bucket": "street",
    "slot": 10,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He steps around a shallow puddle, regains his stride, and smiles at the photographer's timing. Frame a 3:4 knee-up photograph with background lights softly present. Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. Spread grain through shadows and background as well as skin. Keep mixed color, natural highlights, and no waxy smoothing.",
    "locations": {
      "urban": "a broad civic-building step",
      "outdoorsy": "a visitor-center stair",
      "homebody": "a low brownstone step"
    },
    "outfits": {
      "casual": "a charcoal henley with dark chinos",
      "sharp": "a light-grey blazer over a navy tee",
      "street": "a black chore coat over a washed white tee"
    }
  },
  {
    "id": "street-10-c",
    "version": 3,
    "bucket": "street",
    "slot": 10,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He leaves the awning after the rain eases, checks the sidewalk, and continues toward the camera. Use a 3:4 medium flash frame with ordinary edge falloff. Compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. His face freezes cleanly while ambient light and slight background movement remain. Flash reveals honest texture, modest shine, fabric creases, and a natural shadow. Avoid porcelain skin, clipped detail, and tabloid styling.",
    "locations": {
      "urban": "a broad civic-building step",
      "outdoorsy": "a visitor-center stair",
      "homebody": "a low brownstone step"
    },
    "outfits": {
      "casual": "a charcoal henley with dark chinos",
      "sharp": "a light-grey blazer over a navy tee",
      "street": "a black chore coat over a washed white tee"
    }
  },
  {
    "id": "street-11-a",
    "version": 3,
    "bucket": "street",
    "slot": 11,
    "variant": "a",
    "aspectRatio": "9:16",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He crosses the morning street with one coffee held low, looks toward the photographer, and keeps the commute moving. Compose a 9:16 full-body street frame with straight surrounding lines. Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Documentary framing retains street context, natural perspective, and available-light color. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light color without smoothing or teal-orange grading.",
    "locations": {
      "urban": "a broad civic-building step",
      "outdoorsy": "a visitor-center stair",
      "homebody": "a low brownstone step"
    },
    "outfits": {
      "casual": "a charcoal henley with dark chinos",
      "sharp": "a light-grey blazer over a navy tee",
      "street": "a black chore coat over a washed white tee"
    }
  },
  {
    "id": "street-11-b",
    "version": 3,
    "bucket": "street",
    "slot": 11,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He waits for the signal with the cup below his face, turns at a familiar voice, and smiles before crossing. Frame a 3:4 waist-up night portrait with available street context. Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. Spread grain through shadows and background as well as skin. Keep mixed color, natural highlights, and no waxy smoothing.",
    "locations": {
      "urban": "a broad civic-building step",
      "outdoorsy": "a visitor-center stair",
      "homebody": "a low brownstone step"
    },
    "outfits": {
      "casual": "a charcoal henley with dark chinos",
      "sharp": "a light-grey blazer over a navy tee",
      "street": "a black chore coat over a washed white tee"
    }
  },
  {
    "id": "street-11-c",
    "version": 3,
    "bucket": "street",
    "slot": 11,
    "variant": "c",
    "aspectRatio": "9:16",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He reaches the opposite curb, adjusts his grip on the cup, and looks back toward his companion. Use a 9:16 full-body flash snapshot with believable street distance. Compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. His face freezes cleanly while ambient light and slight background movement remain. Flash reveals honest texture, modest shine, fabric creases, and a natural shadow. Avoid porcelain skin, clipped detail, and tabloid styling.",
    "locations": {
      "urban": "a broad civic-building step",
      "outdoorsy": "a visitor-center stair",
      "homebody": "a low brownstone step"
    },
    "outfits": {
      "casual": "a charcoal henley with dark chinos",
      "sharp": "a light-grey blazer over a navy tee",
      "street": "a black chore coat over a washed white tee"
    }
  },
  {
    "id": "street-12-a",
    "version": 3,
    "bucket": "street",
    "slot": 12,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He waits in the doorway for a friend, stops scrolling before they arrive, and looks up with an expectant smile. Compose a 3:4 knee-up documentary frame from across the sidewalk. Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Documentary framing retains street context, natural perspective, and available-light color. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light color without smoothing or teal-orange grading.",
    "locations": {
      "urban": "a broad civic-building step",
      "outdoorsy": "a visitor-center stair",
      "homebody": "a low brownstone step"
    },
    "outfits": {
      "casual": "a charcoal henley with dark chinos",
      "sharp": "a light-grey blazer over a navy tee",
      "street": "a black chore coat over a washed white tee"
    }
  },
  {
    "id": "street-12-b",
    "version": 3,
    "bucket": "street",
    "slot": 12,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He steps aside to hold the door for someone leaving, returns to his place, and spots the photographer approaching. Frame a 3:4 three-quarter portrait through a small amount of foreground light. Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. Spread grain through shadows and background as well as skin. Keep mixed color, natural highlights, and no waxy smoothing.",
    "locations": {
      "urban": "a broad civic-building step",
      "outdoorsy": "a visitor-center stair",
      "homebody": "a low brownstone step"
    },
    "outfits": {
      "casual": "a charcoal henley with dark chinos",
      "sharp": "a light-grey blazer over a navy tee",
      "street": "a black chore coat over a washed white tee"
    }
  },
  {
    "id": "street-12-c",
    "version": 3,
    "bucket": "street",
    "slot": 12,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He leans only long enough to check the street, pushes away from the doorway, and greets his companion. Use a 3:4 knee-up flash photograph with a clean shadow behind him. Compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. His face freezes cleanly while ambient light and slight background movement remain. Flash reveals honest texture, modest shine, fabric creases, and a natural shadow. Avoid porcelain skin, clipped detail, and tabloid styling.",
    "locations": {
      "urban": "a broad civic-building step",
      "outdoorsy": "a visitor-center stair",
      "homebody": "a low brownstone step"
    },
    "outfits": {
      "casual": "a charcoal henley with dark chinos",
      "sharp": "a light-grey blazer over a navy tee",
      "street": "a black chore coat over a washed white tee"
    }
  },
  {
    "id": "street-13-a",
    "version": 3,
    "bucket": "street",
    "slot": 13,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He walks past the storefront, notices a small object in the display, and turns his head without stopping. Compose a 4:3 environmental portrait with reflections kept secondary. Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Documentary framing retains street context, natural perspective, and available-light color. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light color without smoothing or teal-orange grading.",
    "locations": {
      "urban": "a modern pedestrian plaza",
      "outdoorsy": "a small-town market square",
      "homebody": "a neighborhood shopping lane"
    },
    "outfits": {
      "casual": "a grey crewneck with dark jeans",
      "sharp": "a navy overshirt with tailored chinos",
      "street": "a bomber jacket over a black tee"
    }
  },
  {
    "id": "street-13-b",
    "version": 3,
    "bucket": "street",
    "slot": 13,
    "variant": "b",
    "aspectRatio": "9:16",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He pauses beside the glass to point out one detail, lowers his hand, and continues the conversation. Frame a 9:16 full-body night photograph with the face remaining readable. Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. Spread grain through shadows and background as well as skin. Keep mixed color, natural highlights, and no waxy smoothing.",
    "locations": {
      "urban": "a modern pedestrian plaza",
      "outdoorsy": "a small-town market square",
      "homebody": "a neighborhood shopping lane"
    },
    "outfits": {
      "casual": "a grey crewneck with dark jeans",
      "sharp": "a navy overshirt with tailored chinos",
      "street": "a bomber jacket over a black tee"
    }
  },
  {
    "id": "street-13-c",
    "version": 3,
    "bucket": "street",
    "slot": 13,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He catches a faint reflection of his companion, looks toward the real person, and smiles at the coincidence. Use a 3:4 waist-up compact-camera frame with direct eye-level perspective. Compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. His face freezes cleanly while ambient light and slight background movement remain. Flash reveals honest texture, modest shine, fabric creases, and a natural shadow. Avoid porcelain skin, clipped detail, and tabloid styling.",
    "locations": {
      "urban": "a modern pedestrian plaza",
      "outdoorsy": "a small-town market square",
      "homebody": "a neighborhood shopping lane"
    },
    "outfits": {
      "casual": "a grey crewneck with dark jeans",
      "sharp": "a navy overshirt with tailored chinos",
      "street": "a bomber jacket over a black tee"
    }
  },
  {
    "id": "street-14-a",
    "version": 3,
    "bucket": "street",
    "slot": 14,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He sits on the low wall with headphones resting around his neck, watches the square, and turns toward the photographer. Compose a 3:4 waist-up frame from an ordinary pedestrian distance. Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Documentary framing retains street context, natural perspective, and available-light color. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light color without smoothing or teal-orange grading.",
    "locations": {
      "urban": "a modern pedestrian plaza",
      "outdoorsy": "a small-town market square",
      "homebody": "a neighborhood shopping lane"
    },
    "outfits": {
      "casual": "a grey crewneck with dark jeans",
      "sharp": "a navy overshirt with tailored chinos",
      "street": "a bomber jacket over a black tee"
    }
  },
  {
    "id": "street-14-b",
    "version": 3,
    "bucket": "street",
    "slot": 14,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He removes one earbud before the conversation begins, pockets it, and looks up with an attentive expression. Frame a 3:4 chest-up portrait with mixed light falling naturally across the face. Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. Spread grain through shadows and background as well as skin. Keep mixed color, natural highlights, and no waxy smoothing.",
    "locations": {
      "urban": "a modern pedestrian plaza",
      "outdoorsy": "a small-town market square",
      "homebody": "a neighborhood shopping lane"
    },
    "outfits": {
      "casual": "a grey crewneck with dark jeans",
      "sharp": "a navy overshirt with tailored chinos",
      "street": "a bomber jacket over a black tee"
    }
  },
  {
    "id": "street-14-c",
    "version": 3,
    "bucket": "street",
    "slot": 14,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He shifts along the wall to make space, rests both hands beside him, and smiles at the passing scene. Use a 3:4 three-quarter snapshot with slight ambient movement behind him. Compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. His face freezes cleanly while ambient light and slight background movement remain. Flash reveals honest texture, modest shine, fabric creases, and a natural shadow. Avoid porcelain skin, clipped detail, and tabloid styling.",
    "locations": {
      "urban": "a modern pedestrian plaza",
      "outdoorsy": "a small-town market square",
      "homebody": "a neighborhood shopping lane"
    },
    "outfits": {
      "casual": "a grey crewneck with dark jeans",
      "sharp": "a navy overshirt with tailored chinos",
      "street": "a bomber jacket over a black tee"
    }
  },
  {
    "id": "street-15-a",
    "version": 3,
    "bucket": "street",
    "slot": 15,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He walks through the open lane while settling the hem of his jacket, lets both arms fall naturally, and looks ahead. Compose a 4:3 three-quarter frame that preserves pavement and storefront context. Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Documentary framing retains street context, natural perspective, and available-light color. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light color without smoothing or teal-orange grading.",
    "locations": {
      "urban": "a modern pedestrian plaza",
      "outdoorsy": "a small-town market square",
      "homebody": "a neighborhood shopping lane"
    },
    "outfits": {
      "casual": "a grey crewneck with dark jeans",
      "sharp": "a navy overshirt with tailored chinos",
      "street": "a bomber jacket over a black tee"
    }
  },
  {
    "id": "street-15-b",
    "version": 3,
    "bucket": "street",
    "slot": 15,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He steps into a cooler patch of shade, closes the jacket halfway, and glances toward his companion. Frame a 3:4 knee-up photograph with background lights softly present. Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. Spread grain through shadows and background as well as skin. Keep mixed color, natural highlights, and no waxy smoothing.",
    "locations": {
      "urban": "a modern pedestrian plaza",
      "outdoorsy": "a small-town market square",
      "homebody": "a neighborhood shopping lane"
    },
    "outfits": {
      "casual": "a grey crewneck with dark jeans",
      "sharp": "a navy overshirt with tailored chinos",
      "street": "a bomber jacket over a black tee"
    }
  },
  {
    "id": "street-15-c",
    "version": 3,
    "bucket": "street",
    "slot": 15,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He leaves the sheltered walkway, adjusts one cuff against the breeze, and continues at an easy pace. Use a 3:4 medium flash frame with ordinary edge falloff. Compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. His face freezes cleanly while ambient light and slight background movement remain. Flash reveals honest texture, modest shine, fabric creases, and a natural shadow. Avoid porcelain skin, clipped detail, and tabloid styling.",
    "locations": {
      "urban": "a modern pedestrian plaza",
      "outdoorsy": "a small-town market square",
      "homebody": "a neighborhood shopping lane"
    },
    "outfits": {
      "casual": "a grey crewneck with dark jeans",
      "sharp": "a navy overshirt with tailored chinos",
      "street": "a bomber jacket over a black tee"
    }
  },
  {
    "id": "street-16-a",
    "version": 3,
    "bucket": "street",
    "slot": 16,
    "variant": "a",
    "aspectRatio": "9:16",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He waits at the evening crossing with both hands in his pockets, rocks forward when the signal changes, and steps out calmly. Compose a 9:16 full-body street frame with straight surrounding lines. Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Documentary framing retains street context, natural perspective, and available-light color. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light color without smoothing or teal-orange grading.",
    "locations": {
      "urban": "a clean metro platform",
      "outdoorsy": "a regional rail platform",
      "homebody": "a local light-rail station"
    },
    "outfits": {
      "casual": "a navy field jacket over a grey knit",
      "sharp": "a camel overcoat over a black turtleneck",
      "street": "a dark leather jacket over a cream tee"
    }
  },
  {
    "id": "street-16-b",
    "version": 3,
    "bucket": "street",
    "slot": 16,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He watches the traffic clear, turns toward the photographer for one beat, and begins crossing. Frame a 3:4 waist-up night portrait with available street context. Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. Spread grain through shadows and background as well as skin. Keep mixed color, natural highlights, and no waxy smoothing.",
    "locations": {
      "urban": "a clean metro platform",
      "outdoorsy": "a regional rail platform",
      "homebody": "a local light-rail station"
    },
    "outfits": {
      "casual": "a navy field jacket over a grey knit",
      "sharp": "a camel overcoat over a black turtleneck",
      "street": "a dark leather jacket over a cream tee"
    }
  },
  {
    "id": "street-16-c",
    "version": 3,
    "bucket": "street",
    "slot": 16,
    "variant": "c",
    "aspectRatio": "9:16",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He reaches the corner a moment early, slows rather than stopping abruptly, and smiles toward his companion. Use a 9:16 full-body flash snapshot with believable street distance. Compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. His face freezes cleanly while ambient light and slight background movement remain. Flash reveals honest texture, modest shine, fabric creases, and a natural shadow. Avoid porcelain skin, clipped detail, and tabloid styling.",
    "locations": {
      "urban": "a clean metro platform",
      "outdoorsy": "a regional rail platform",
      "homebody": "a local light-rail station"
    },
    "outfits": {
      "casual": "a navy field jacket over a grey knit",
      "sharp": "a camel overcoat over a black turtleneck",
      "street": "a dark leather jacket over a cream tee"
    }
  },
  {
    "id": "street-17-a",
    "version": 3,
    "bucket": "street",
    "slot": 17,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He exits the corner store with one small paper bag, checks the street, and looks toward the photographer before walking on. Compose a 3:4 knee-up documentary frame from across the sidewalk. Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Documentary framing retains street context, natural perspective, and available-light color. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light color without smoothing or teal-orange grading.",
    "locations": {
      "urban": "a clean metro platform",
      "outdoorsy": "a regional rail platform",
      "homebody": "a local light-rail station"
    },
    "outfits": {
      "casual": "a navy field jacket over a grey knit",
      "sharp": "a camel overcoat over a black turtleneck",
      "street": "a dark leather jacket over a cream tee"
    }
  },
  {
    "id": "street-17-b",
    "version": 3,
    "bucket": "street",
    "slot": 17,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He holds the door for another customer, releases it, and adjusts the bag under one arm. Frame a 3:4 three-quarter portrait through a small amount of foreground light. Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. Spread grain through shadows and background as well as skin. Keep mixed color, natural highlights, and no waxy smoothing.",
    "locations": {
      "urban": "a clean metro platform",
      "outdoorsy": "a regional rail platform",
      "homebody": "a local light-rail station"
    },
    "outfits": {
      "casual": "a navy field jacket over a grey knit",
      "sharp": "a camel overcoat over a black turtleneck",
      "street": "a dark leather jacket over a cream tee"
    }
  },
  {
    "id": "street-17-c",
    "version": 3,
    "bucket": "street",
    "slot": 17,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He steps from the fluorescent doorway into daylight, lets his eyes adjust, and smiles at his waiting companion. Use a 3:4 knee-up flash photograph with a clean shadow behind him. Compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. His face freezes cleanly while ambient light and slight background movement remain. Flash reveals honest texture, modest shine, fabric creases, and a natural shadow. Avoid porcelain skin, clipped detail, and tabloid styling.",
    "locations": {
      "urban": "a clean metro platform",
      "outdoorsy": "a regional rail platform",
      "homebody": "a local light-rail station"
    },
    "outfits": {
      "casual": "a navy field jacket over a grey knit",
      "sharp": "a camel overcoat over a black turtleneck",
      "street": "a dark leather jacket over a cream tee"
    }
  },
  {
    "id": "street-18-a",
    "version": 3,
    "bucket": "street",
    "slot": 18,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He stands beside the bicycle with one foot grounded, finishes a conversation, and rolls it forward by the handlebar. Compose a 4:3 environmental portrait with reflections kept secondary. Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Documentary framing retains street context, natural perspective, and available-light color. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light color without smoothing or teal-orange grading.",
    "locations": {
      "urban": "a clean metro platform",
      "outdoorsy": "a regional rail platform",
      "homebody": "a local light-rail station"
    },
    "outfits": {
      "casual": "a navy field jacket over a grey knit",
      "sharp": "a camel overcoat over a black turtleneck",
      "street": "a dark leather jacket over a cream tee"
    }
  },
  {
    "id": "street-18-b",
    "version": 3,
    "bucket": "street",
    "slot": 18,
    "variant": "b",
    "aspectRatio": "9:16",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He returns the lock to a small bag, checks the wheel once, and looks toward the photographer. Frame a 9:16 full-body night photograph with the face remaining readable. Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. Spread grain through shadows and background as well as skin. Keep mixed color, natural highlights, and no waxy smoothing.",
    "locations": {
      "urban": "a clean metro platform",
      "outdoorsy": "a regional rail platform",
      "homebody": "a local light-rail station"
    },
    "outfits": {
      "casual": "a navy field jacket over a grey knit",
      "sharp": "a camel overcoat over a black turtleneck",
      "street": "a dark leather jacket over a cream tee"
    }
  },
  {
    "id": "street-18-c",
    "version": 3,
    "bucket": "street",
    "slot": 18,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He pauses at the bike rack while a friend speaks, keeps one hand on the saddle, and smiles at the comment. Use a 3:4 waist-up compact-camera frame with direct eye-level perspective. Compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. His face freezes cleanly while ambient light and slight background movement remain. Flash reveals honest texture, modest shine, fabric creases, and a natural shadow. Avoid porcelain skin, clipped detail, and tabloid styling.",
    "locations": {
      "urban": "a clean metro platform",
      "outdoorsy": "a regional rail platform",
      "homebody": "a local light-rail station"
    },
    "outfits": {
      "casual": "a navy field jacket over a grey knit",
      "sharp": "a camel overcoat over a black turtleneck",
      "street": "a dark leather jacket over a cream tee"
    }
  },
  {
    "id": "street-19-a",
    "version": 3,
    "bucket": "street",
    "slot": 19,
    "variant": "a",
    "aspectRatio": "3:4",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He walks beneath the awning while the rain continues beyond it, shakes a few drops from one sleeve, and looks up. Compose a 3:4 waist-up frame from an ordinary pedestrian distance. Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Documentary framing retains street context, natural perspective, and available-light color. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light color without smoothing or teal-orange grading.",
    "locations": {
      "urban": "a late-night food-market curb",
      "outdoorsy": "a mountain-town evening stall",
      "homebody": "a neighborhood night-market edge"
    },
    "outfits": {
      "casual": "a navy overshirt over a white tee with dark jeans",
      "sharp": "a charcoal blazer over a black crew-neck tee",
      "street": "a vintage bomber over a grey tee"
    }
  },
  {
    "id": "street-19-b",
    "version": 3,
    "bucket": "street",
    "slot": 19,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He waits for the shower to ease, checks the pavement, and smiles at his companion's impatience. Frame a 3:4 chest-up portrait with mixed light falling naturally across the face. Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. Spread grain through shadows and background as well as skin. Keep mixed color, natural highlights, and no waxy smoothing.",
    "locations": {
      "urban": "a late-night food-market curb",
      "outdoorsy": "a mountain-town evening stall",
      "homebody": "a neighborhood night-market edge"
    },
    "outfits": {
      "casual": "a navy overshirt over a white tee with dark jeans",
      "sharp": "a charcoal blazer over a black crew-neck tee",
      "street": "a vintage bomber over a grey tee"
    }
  },
  {
    "id": "street-19-c",
    "version": 3,
    "bucket": "street",
    "slot": 19,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He steps from one covered storefront to the next, keeps his shoulders naturally drawn in, and looks toward the photographer. Use a 3:4 three-quarter snapshot with slight ambient movement behind him. Compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. His face freezes cleanly while ambient light and slight background movement remain. Flash reveals honest texture, modest shine, fabric creases, and a natural shadow. Avoid porcelain skin, clipped detail, and tabloid styling.",
    "locations": {
      "urban": "a late-night food-market curb",
      "outdoorsy": "a mountain-town evening stall",
      "homebody": "a neighborhood night-market edge"
    },
    "outfits": {
      "casual": "a navy overshirt over a white tee with dark jeans",
      "sharp": "a charcoal blazer over a black crew-neck tee",
      "street": "a vintage bomber over a grey tee"
    }
  },
  {
    "id": "street-20-a",
    "version": 3,
    "bucket": "street",
    "slot": 20,
    "variant": "a",
    "aspectRatio": "4:3",
    "promptTemplate": "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age, and natural asymmetry. At {{location}}, wearing {{outfit}}. He walks through the night sidewalk traffic, notices the photographer beside a storefront, and turns with easy confidence. Compose a 4:3 three-quarter frame that preserves pavement and storefront context. Leica Q2, 28mm, f/2.8, 1/250, auto ISO 800-3200. Documentary framing retains street context, natural perspective, and available-light color. Retain distance-appropriate facial detail, fabric wear, true reflections, and available-light color without smoothing or teal-orange grading.",
    "locations": {
      "urban": "a late-night food-market curb",
      "outdoorsy": "a mountain-town evening stall",
      "homebody": "a neighborhood night-market edge"
    },
    "outfits": {
      "casual": "a navy overshirt over a white tee with dark jeans",
      "sharp": "a charcoal blazer over a black crew-neck tee",
      "street": "a vintage bomber over a grey tee"
    }
  },
  {
    "id": "street-20-b",
    "version": 3,
    "bucket": "street",
    "slot": 20,
    "variant": "b",
    "aspectRatio": "3:4",
    "promptTemplate": "Create a new photograph of the referenced man. Keep his recognizable features, complexion, hair, grooming, age, and real asymmetries unchanged. At {{location}}, wearing {{outfit}}. He leaves the restaurant lane with his companion, slows near the corner, and looks back at the last comment. Frame a 3:4 knee-up photograph with background lights softly present. Sony A7S III, 35mm, f/2, 1/125, ISO 3200. Mixed practical light, fine grain, and soft shadow noise create an authentic night photograph. Spread grain through shadows and background as well as skin. Keep mixed color, natural highlights, and no waxy smoothing.",
    "locations": {
      "urban": "a late-night food-market curb",
      "outdoorsy": "a mountain-town evening stall",
      "homebody": "a neighborhood night-market edge"
    },
    "outfits": {
      "casual": "a navy overshirt over a white tee with dark jeans",
      "sharp": "a charcoal blazer over a black crew-neck tee",
      "street": "a vintage bomber over a grey tee"
    }
  },
  {
    "id": "street-20-c",
    "version": 3,
    "bucket": "street",
    "slot": 20,
    "variant": "c",
    "aspectRatio": "3:4",
    "promptTemplate": "Use the supplied photographs only for identity. Do not alter his face shape, skin tone, hair, beard pattern, age, or asymmetry. At {{location}}, wearing {{outfit}}. He crosses through a pool of street light, continues into the darker block, and smiles toward the photographer without stopping. Use a 3:4 medium flash frame with ordinary edge falloff. Compact 35mm camera, f/4, 1/60, ISO 800, restrained direct flash. His face freezes cleanly while ambient light and slight background movement remain. Flash reveals honest texture, modest shine, fabric creases, and a natural shadow. Avoid porcelain skin, clipped detail, and tabloid styling.",
    "locations": {
      "urban": "a late-night food-market curb",
      "outdoorsy": "a mountain-town evening stall",
      "homebody": "a neighborhood night-market edge"
    },
    "outfits": {
      "casual": "a navy overshirt over a white tee with dark jeans",
      "sharp": "a charcoal blazer over a black crew-neck tee",
      "street": "a vintage bomber over a grey tee"
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

export function assertLibraryComplete(): void {
  if (DATING_PROMPTS.length !== 300) {
    throw new Error(
      `Prompt library has ${DATING_PROMPTS.length} entries; expected 300`
    );
  }

  const ids = new Set<string>();
  const promptTexts = new Set<string>();
  const allowedTokens = new Set(["location", "outfit", "hobby"]);
  let hobbyPromptCount = 0;
  const aspectRatioCounts: Record<DatingAspectRatio, number> = {
    "9:16": 0,
    "3:4": 0,
    "4:3": 0,
  };
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
        aspectRatioCounts[prompt.aspectRatio] += 1;

        const templates = [
          prompt.promptTemplate,
          prompt.hobbyPromptTemplate,
        ].filter((template): template is string => Boolean(template));
        for (const template of templates) {
          const aspectRatios = [
            ...template.matchAll(/\b(?:9:16|3:4|4:3)\b/g),
          ].map((match) => match[0]);
          if (
            aspectRatios.length !== 1 ||
            aspectRatios[0] !== prompt.aspectRatio
          ) {
            throw new Error(
              `Prompt ${prompt.id} must contain exactly one ${prompt.aspectRatio} composition`
            );
          }

          const tokens = [
            ...template.matchAll(/\{\{([^}]+)\}\}/g),
          ].map((match) => match[1]);
          for (const token of tokens) {
            if (!allowedTokens.has(token)) {
              throw new Error(
                `Unknown token {{${token}}} in ${prompt.id}`
              );
            }
          }
          for (const phrase of bannedPhrases) {
            if (template.toLowerCase().includes(phrase.toLowerCase())) {
              throw new Error(
                `Banned phrase "${phrase}" in ${prompt.id}`
              );
            }
          }
        }
      }
    }
  }

  if (hobbyPromptCount !== 12) {
    throw new Error(
      `Prompt library has ${hobbyPromptCount} hobby alternatives; expected 12`
    );
  }

  if (
    aspectRatioCounts["9:16"] !== 60 ||
    aspectRatioCounts["3:4"] !== 160 ||
    aspectRatioCounts["4:3"] !== 80
  ) {
    throw new Error(
      `Unexpected aspect-ratio distribution: ${JSON.stringify(aspectRatioCounts)}`
    );
  }
}
