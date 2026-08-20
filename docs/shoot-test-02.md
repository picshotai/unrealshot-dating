# Shoot format test 02 — the first generated batch

**What this answers:** are LLM-written shoots as good as the hand-written ones?
If yes, the library stops being hand-authored and starts being generated and
reviewed, which is the only version of this that scales past one customer.

These five were written by `npm run generate:shoots` from five one-line briefs,
each shown one proven shoot as a reference. All five passed the 13 mechanical
craft rules; two needed one retry. Nothing here has been touched by hand.

---

## How to run each shoot

Model: `fal-ai/bytedance/seedream/v4.5/edit`. No seed — it is not reproducible
in edit mode, so a seed buys nothing.

**Run the `close` frame FIRST.** Then for the other three, put that output image
into `image_urls` *alongside* your selfies, as the last entry. That is exactly
what production does, and it is what carries the room, the clothes and the light
direction across the set. Testing a follower without its anchor is testing a
different pipeline.

Set `image_size` to the width and height given for each frame.

---

## SHOOT A — Bakery, morning

`bakery-counter-morning` · home · casual · serves cooking, dining

### A1 — close · 1728×2304 · **ANCHOR — run this one first**

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands at the timber counter of a bright neighbourhood bakery, wearing a navy blue cotton sweatshirt over a white crewneck t-shirt, light grey chinos and a steel watch. He has turned his head about fifteen degrees toward the lens ahead of his shoulders, and his eyes are on the lens. One hand rests on the edge of the timber counter, fingers curled over the wood, and the other is flat on the surface beside him, so one shoulder sits slightly lower. The room runs two metres back behind him, reduced to soft warm shapes. A large window filling the right edge of the frame lays broad soft daylight across him, and the room falls about a stop darker away from it. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/200, ISO 100. Keep pore structure across the nose, the faint shadow of stubble along the jaw, and the tight weave of the sweatshirt.
```

### A2 — medium · 1728×2304 · add the anchor output to image_urls

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands at the timber counter of a bright neighbourhood bakery, wearing a navy blue cotton sweatshirt over a white crewneck t-shirt, light grey chinos and a steel watch. His head is tilted about ten degrees and his eyes look away from the lens toward a stack of loaves on the counter. One hand holds a plain brown paper bag and the other hand is tucked into a pocket, making one shoulder sit higher than the other. The far wall is four metres behind him, soft and out of focus. A large window filling the right edge of the frame lays broad soft daylight across him, and the room falls about a stop darker away from it. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/2.0, 1/200, ISO 100. Keep visible pores on the forehead, creases in the cotton of the chinos, and the grain of the timber counter.
```

### A3 — threeQuarter · 2304×1728 · add the anchor output to image_urls

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands at the timber counter of a bright neighbourhood bakery, wearing a navy blue cotton sweatshirt over a white crewneck t-shirt, light grey chinos and a steel watch. His body is angled about forty-five degrees to the counter and he looks straight to the lens with a relaxed expression. One hand leans on the edge of a glass display case and the other hand rests on a hip, so one shoulder drops lower than the other. The room continues six metres behind him, its shapes soft and muted. A large window filling the right edge of the frame lays broad soft daylight across him, and the room falls about a stop darker away from it. A 4:3 three-quarter frame from the knees up, iPhone 15 Pro, 24mm, f/2.8, 1/160, ISO 125. Keep visible pores, individual hairs of the eyebrows, and the texture of the steel watch strap.
```

### A4 — expression · 1728×2304 · add the anchor output to image_urls

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands at the timber counter of a bright neighbourhood bakery, wearing a navy blue cotton sweatshirt over a white crewneck t-shirt, light grey chinos and a steel watch. He laughs with his eyes creased and his gaze dropping past the lens to the counter about twenty degrees down. One hand touches the back of his own neck with the elbow out and the other hand grips the edge of the timber counter, which lifts one shoulder higher. The back of the shop is three metres behind him and remains soft. A large window filling the right edge of the frame lays broad soft daylight across him, and the room falls about a stop darker away from it. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 100. Keep laugh lines at the corners of the eyes, pore structure on the cheeks, and the fine stitching of the sweatshirt neckline.
```

---

## SHOOT B — Reading room, library

`reading-room-library` · social · sharp · serves reading, coffee

### B1 — close · 1728×2304 · **ANCHOR — run this one first**

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands before a floor-to-ceiling dark oak bookshelf in a tall-windowed reading room, wearing a navy unstructured blazer over a light blue poplin shirt, charcoal wool chinos, dark brown leather oxfords and a steel watch. He has turned his head about twenty-five degrees toward the lens ahead of his shoulders, which stay angled to the shelf, so the turn shows in his neck. His mouth is closed and his eyes are on the lens. One hand rests on the edge of a timber shelf and the other hand holds a small plain leather-bound volume at his side, so one shoulder sits slightly higher than the other. The room runs two metres back behind him, reduced to soft dark shapes. A large window filling the right edge of the frame lays broad soft daylight across him. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/125, ISO 100. Keep pore structure across the nose, the fine weave of the blazer fabric, and the sharp line of the shirt collar.
```

### B2 — medium · 1728×2304 · add the anchor output to image_urls

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits at a heavy timber desk beside a lit green-shaded banker's lamp in a tall-windowed reading room, wearing a navy unstructured blazer over a light blue poplin shirt, charcoal wool chinos, dark brown leather oxfords and a steel watch. His chin is tilted down about twelve degrees and his gaze goes past the lens toward the bookshelves, caught in thought. One hand is wrapped around a ceramic cup held just above the desk surface and the other hand rests flat on the timber, so one shoulder sits lower than the other. The room carries on four metres behind him, the far shelving soft and dark. A large window filling the right edge of the frame lays broad soft daylight across him. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/125, ISO 100. Keep visible pores, the smooth ceramic texture of the cup, and skin texture on the back of the hand.
```

### B3 — threeQuarter · 2304×1728 · add the anchor output to image_urls

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits in a deep leather armchair beside a dark timber side table in a tall-windowed reading room, wearing a navy unstructured blazer over a light blue poplin shirt, charcoal wool chinos, dark brown leather oxfords and a steel watch. His shoulders are angled about forty degrees away from the lens and he looks straight to the lens with his lips just parted. One hand rests on the leather armrest and the other hand holds a pair of spectacles by one arm, so one shoulder is raised slightly higher than the other. The room runs five metres behind him, the leather and timber shapes soft. A large window filling the right edge of the frame lays broad soft daylight across him. A 4:3 three-quarter frame at seated eye level, iPhone 15 Pro, 24mm, f/2.2, 1/100, ISO 160. Keep skin pores on the chin, the grain of the leather chair, and the polished finish of the steel watch.
```

### B4 — expression · 1728×2304 · add the anchor output to image_urls

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits in a deep leather armchair beside a dark timber side table in a tall-windowed reading room, wearing a navy unstructured blazer over a light blue poplin shirt, charcoal wool chinos, dark brown leather oxfords and a steel watch. He smiles with his eyes creased and his gaze dropping away from the lens to a plain paper folio on his lap. One hand rests on the open folio and the other hand holds the edge of the chair, while his shoulders have risen slightly with his breath. The room stays soft three metres behind him. A large window filling the right edge of the frame lays broad soft daylight across him. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/125, ISO 100. Keep the creases at the corners of his eyes, skin pores across the forehead, and the soft texture of the blazer lapel.
```

---

## SHOOT C — Stone bridge, overcast

`river-bridge-hiking` · outdoors · casual · serves travel, hiking

### C1 — close · 1728×2304 · **ANCHOR — run this one first**

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on a stone bridge over a wide slow river with bare hills beyond under a flat bright overcast sky, wearing a charcoal down-filled gilet over a mustard yellow merino wool crewneck sweater, dark olive technical hiking trousers, tan suede hiking boots and a steel watch. He has turned his head about fifteen degrees toward the lens, chin slightly tucked, mouth closed in a soft line, and his eyes are on the lens. One hand grips the nylon strap of a backpack resting on his shoulder, the other hand rests on the stone parapet, and one shoulder is slightly rolled forward. The riverbank sits ten metres behind him and is soft. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/500, ISO 100. Keep pore structure across the bridge of the nose, the fine knit of the mustard wool, and the matte texture of the gilet fabric.
```

### C2 — medium · 1728×2304 · add the anchor output to image_urls

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on a stone bridge over a wide slow river with bare hills beyond under a flat bright overcast sky, wearing a charcoal down-filled gilet over a mustard yellow merino wool crewneck sweater, dark olive technical hiking trousers, tan suede hiking boots and a steel watch. He angles his body about forty-five degrees from the lens while his gaze goes past the lens down to the water, his mouth slightly open as if catching a breath. One hand holds a brushed metal water bottle by its neck, the other hand is tucked into a trouser pocket with the thumb visible, and one shoulder sits lower than the other. The hills rise eighteen metres back in soft brown shapes. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/2.2, 1/640, ISO 80. Keep visible pores, the brushed metal texture of the bottle, and the weave of the technical trousers.
```

### C3 — threeQuarter · 2304×1728 · add the anchor output to image_urls

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He leans against the stone bridge over a wide slow river with bare hills beyond under a flat bright overcast sky, wearing a charcoal down-filled gilet over a mustard yellow merino wool crewneck sweater, dark olive technical hiking trousers, tan suede hiking boots and a steel watch. He has turned his head about twenty degrees and looks straight to the lens with a neutral expression. One hand rests flat on the weathered stone of the bridge cap, the other hand holds a pair of black binoculars by the strap, so his shoulders sit at different heights. The far side of the river is thirty metres away and very soft. A 4:3 three-quarter frame showing him from the knees up, iPhone 15 Pro, 24mm, f/2.8, 1/400, ISO 125. Broad overcast daylight fills his face evenly from above and slightly in front. Keep pores on the forehead, the suede grain of the boots, and the individual stones of the bridge.
```

### C4 — expression · 1728×2304 · add the anchor output to image_urls

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on a stone bridge over a wide slow river with bare hills beyond under a flat bright overcast sky, wearing a charcoal down-filled gilet over a mustard yellow merino wool crewneck sweater, dark olive technical hiking trousers, tan suede hiking boots and a steel watch. He smiles at a thought with his head tilted about ten degrees and his gaze falls away from the lens toward the distant riverbank, eyes narrowed to creases. One hand brushes the hair at his temple, the other hand rests on the stone ledge of the bridge, and his shoulders have risen with the smile. The water surface stretches twelve metres behind him into a soft grey blur. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/2.0, 1/800, ISO 64. Keep the creases at the corners of his eyes, real pore structure on the cheeks, and the fine grain of the watch face.
```

---

## SHOOT D — Music venue, night

`music-venue-night` · social · street · serves nightlife, music

### D1 — close · 1728×2304 · **ANCHOR — run this one first**

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands under the black metal awning of a live-music venue at night, wearing a black denim trucker jacket over a charcoal grey t-shirt with a geometric circle motif, slim black jeans, white leather trainers and a steel watch. His chin is turned about ten degrees away from the lens and his eyes are on the lens. One hand is adjusting the collar of the denim jacket while the other hand rests on the opposite forearm, and one shoulder sits slightly higher than the other. The brick wall is two metres behind him and soft. Direct on-camera flash reaches him frontally, metered for his face so the skin holds detail and the fall-off happens behind him. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/125, ISO 400. Keep skin pores, the heavy twill of the denim jacket, and fine stubble.
```

### D2 — medium · 1728×2304 · add the anchor output to image_urls

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands beside the brick wall of a live-music venue at night, wearing a black denim trucker jacket over a charcoal grey t-shirt with a geometric circle motif, slim black jeans, white leather trainers and a steel watch. His head is tilted about five degrees to one side and his eyes go off to one side toward the street. One hand is tucked into a front jeans pocket while the other hand holds a small plastic guitar pick against one thigh, one shoulder dipping lower than the other. The dark entrance is three metres behind him and soft. Direct on-camera flash reaches him frontally, metered for his face so the skin holds detail and the fall-off happens behind him. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/1.8, 1/120, ISO 400. Keep fabric weave of the t-shirt, individual hairs lifting at the crown, and leather grain on the trainers.
```

### D3 — threeQuarter · 2304×1728 · add the anchor output to image_urls

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He leans against a brick pillar outside a live-music venue, wearing a black denim trucker jacket over a charcoal grey t-shirt with a geometric circle motif, slim black jeans, white leather trainers and a steel watch. He looks straight to the lens with his head turned about five degrees toward the pillar. One palm is pressed against the masonry at waist height while the other hand rests on the buckle of his belt, and one shoulder sits lower than the other. The pavement extends eight metres past him into a soft dark blur. Direct on-camera flash reaches him frontally, metered for his face so the skin holds detail and the fall-off happens behind him. A 4:3 three-quarter frame taken from standing height, iPhone 15 Pro, 24mm, f/2.0, 1/100, ISO 500. Keep visible skin texture, the rough surface of the brick, and the metallic shine of the watch.
```

### D4 — expression · 1728×2304 · add the anchor output to image_urls

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands under the metal canopy of a live-music venue at night, wearing a black denim trucker jacket over a charcoal grey t-shirt with a geometric circle motif, slim black jeans, white leather trainers and a steel watch. He is mid-laugh with his chin dropped about fifteen degrees, eyes creased and teeth showing, his gaze looking away from the lens toward the ground. One hand is scratching the back of his neck while the other hand rests flat on the denim of his jacket at the stomach, one shoulder raised toward his ear. The wall behind him is four metres away and soft. Direct on-camera flash reaches him frontally, metered for his face so the laugh lines read sharply. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/125, ISO 400. Keep real pore structure, forehead creases, and the coarse texture of the denim.
```

---

## SHOOT E — Ceramics studio, afternoon

`ceramics-studio-afternoon` · activity · sharp · serves art, travel

### E1 — close · 1728×2304 · **ANCHOR — run this one first**

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in a ceramics studio with high ceilings and heavy timber loading doors open to a cobbled yard, wearing a navy cotton twill chore jacket over a light blue chambray shirt, charcoal chinos, dark leather boots and a steel watch. He has turned his head about fifteen degrees toward the lens, mouth closed with a slight smile, and his eyes are on the lens. One hand is raised to adjust the collar of his jacket while the other rests against a heavy wooden workbench, and one shoulder sits slightly lower than the other. The studio wall sits three metres behind him in soft dark shapes. Broad daylight through the open loading doors fills his face evenly from the front and slightly above. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/320, ISO 160. Keep pore structure on his nose, the fine weave of the chambray, and the grain of the wooden workbench.
```

### E2 — medium · 1728×2304 · add the anchor output to image_urls

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands at a tall wooden workbench in a ceramics studio with high ceilings and heavy timber loading doors open to a cobbled yard, wearing a navy cotton twill chore jacket over a light blue chambray shirt, charcoal chinos, dark leather boots and a steel watch. His head is turned about twenty degrees away from the lens as he looks down at a damp clay vessel, his gaze falling away from the lens. One hand holds a wire cutter by the workbench while the other palm rests on the wood beside the pot, and his shoulders are angled away from the camera. The far shelves of the studio are five metres back in soft dark shapes. Broad daylight through the open loading doors fills his face evenly from the front and slightly above. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/1.8, 1/320, ISO 160. Keep visible pores, the matte texture of the wet clay, and the crisp seam of the chore jacket.
```

### E3 — threeQuarter · 2304×1728 · add the anchor output to image_urls

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He leans against the frame of the open loading doors in a ceramics studio with high ceilings and heavy timber loading doors open to a cobbled yard, wearing a navy cotton twill chore jacket over a light blue chambray shirt, charcoal chinos, dark leather boots and a steel watch. He looks up to the lens with a calm expression, his head tilted about five degrees. One hand is tucked into his jacket pocket while the other rests on the door frame, and his weight is shifted to one hip so one shoulder sits lower. The cobbled yard outside is seven metres past him in soft pale light. Broad daylight through the open loading doors fills his face evenly from the front and slightly above. A 4:3 three-quarter frame, iPhone 15 Pro, 35mm, f/2.2, 1/400, ISO 100. Keep pore structure, the rough grain of the timber door frame, and the polished steel of the watch.
```

### E4 — expression · 1728×2304 · add the anchor output to image_urls

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands near a pottery wheel in a ceramics studio with high ceilings and heavy timber loading doors open to a cobbled yard, wearing a navy cotton twill chore jacket over a light blue chambray shirt, charcoal chinos, dark leather boots and a steel watch. He looks away from the lens with a genuine smile as if reacting to something, his head turned about forty degrees and his eyes squinting slightly. One hand is raised to his neck while the other rests on a wooden stool, and his shoulders are slightly hunched with the expression. Shelves of drying pots are four metres behind him in soft dark shapes. Broad daylight through the open loading doors fills his face evenly from the front and slightly above. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/320, ISO 160. Keep skin pores, the crinkle at the corners of his eyes, and a light dusting of dried clay on his jacket cuff.
```

---

## Scoring

Score each frame 0 or 1 on all six. A frame is **usable** only at 6/6 — anything
less is a photo you would hesitate to put on a profile, which means it is filler.

| # | identity | physics | scene logic | wardrobe fits scene | candid, not posed | you'd actually use it | usable |
|---|---|---|---|---|---|---|---|
| A1 | | | | | | | |
| A2 | | | | | | | |
| A3 | | | | | | | |
| A4 | | | | | | | |
| B1 | | | | | | | |
| B2 | | | | | | | |
| B3 | | | | | | | |
| B4 | | | | | | | |
| C1 | | | | | | | |
| C2 | | | | | | | |
| C3 | | | | | | | |
| C4 | | | | | | | |
| D1 | | | | | | | |
| D2 | | | | | | | |
| D3 | | | | | | | |
| D4 | | | | | | | |
| E1 | | | | | | | |
| E2 | | | | | | | |
| E3 | | | | | | | |
| E4 | | | | | | | |

**The bar: 16 of 20.** That is the same 80% rate the hand-written shoots were
held to. At or above it, generation replaces hand-authoring and the library
grows to 200+ shoots, which ends the overlap problem entirely.

**Then answer three things the totals will not tell you:**

1. Do the four frames of one shoot read as *one session, or four days*? The
   anchor is supposed to make them one.
2. Are these visibly worse than the hand-written kitchen and marina shoots, or
   just different? If just different, the hand-authoring stops.
3. Which locations read as somewhere a man would want to be photographed, and
   which read like a stock library? No rule can catch that — it is the one
   judgement the generator cannot make for itself.
