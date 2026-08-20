# Shoot format test 03 — the same five briefs, after the fixes

Test 02 scored 4 of 8. Every loss traced to something specific, and three of
the causes are now rules in the generator. These are the same five briefs run
again against the corrected system prompt.

**What changed**

| fix | test 02 | now |
|---|---|---|
| objects named per shoot | 8 / 3 / 4 / 1 / 1 | **1 / 0 / 1 / 0 / 3** |
| corporate tailoring | blazer to read a book, blazer in a pottery studio | banned outside bars and hotels, enforced |
| pose | a described shape | a described *reason* — rule 21 |
| the reading brief | `sharp` in a furniture-heavy reading room | `casual`, a bare window seat |
| batch self-collision | two shoots in navy cashmere | batches accumulate against themselves |

**What has not changed, because it cannot be fixed in a prompt:** the anchor
carries wardrobe, light and identity but not geometry. Expect the room to be
re-imagined between frames. Judge whether each photograph is believable on its
own, and whether the four read as the same day — not whether the furniture is
in the same place.

---

## How to run each shoot

Model: `fal-ai/bytedance/seedream/v4.5/edit`. No seed.

**Run the `close` frame first**, then pass its output into `image_urls`
alongside your selfies for the other three, exactly as you did last time.

---

## SHOOT A — Deli counter, morning

`deli-counter-morning` · home · casual · serves cooking, dining

Objects named: **1** (counter)

### A1 — close · 1728×2304 · **ANCHOR — run first**

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands at a bright neighbourhood deli counter, wearing a navy blue fine-knit cotton crewneck jumper, tan chino trousers and a steel watch. He has turned his head about twenty-five degrees toward the lens having just looked up from the timber counter, so the turn shows in his neck. His eyes are on the lens with a faint smile. One hand rests on the edge of the timber counter and the other hand hangs at his side, so one shoulder sits lower than the other. The room falls away four metres behind him into soft pale shapes. A large window filling the right edge of the frame lays broad soft daylight across him. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 100. Keep pore structure across the nose, the faint shadow of stubble along the jaw, and the soft weave of the navy cotton jumper.
```

### A2 — medium · 1728×2304 · add the anchor output to image_urls

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands at a bright neighbourhood deli counter, wearing a navy blue fine-knit cotton crewneck jumper, tan chino trousers and a steel watch. He looks past the lens about fifteen degrees as if deciding on a choice from the display. One hand hovers just above the timber counter and the other hand rests on one hip, so that shoulder sits higher than the other. The space behind him stretches five metres and stays soft. A large window filling the right edge of the frame lays broad soft daylight across him. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 100. Keep visible pores, the fine grain of the skin, and the crisp edge of the watch face.
```

### A3 — threeQuarter · 2304×1728 · add the anchor output to image_urls

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He leans against a bright neighbourhood deli counter, wearing a navy blue fine-knit cotton crewneck jumper, tan chino trousers and a steel watch. He looks straight to the lens with an easy expression while waiting for his selection to be wrapped. One hand is flat on the surface of the timber counter and the other hand holds a small brown paper bag, with the weight shifted so one shoulder is lower. The shop interior goes six metres back and is very soft. A large window filling the right edge of the frame lays broad soft daylight across him. A 4:3 three-quarter frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/200, ISO 100. Keep skin pores, the matte texture of the brown paper bag, and the weave of the tan chino trousers.
```

### A4 — expression · 1728×2304 · add the anchor output to image_urls

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands at a bright neighbourhood deli counter, wearing a navy blue fine-knit cotton crewneck jumper, tan chino trousers and a steel watch. He laughs with his eyes narrowing and his gaze dropping past the lens as if reacting to a joke. One hand holds a small brown paper bag while the other hand is raised to touch the back of his neck, with that shoulder lifted about ten degrees. The background is four metres away and soft. A large window filling the right edge of the frame lays broad soft daylight across him. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 100. Keep the creases at the outer corners of the eyes, real pores across the cheeks, and the soft tension in the jumper where the arm is raised.
```

---

## SHOOT B — Window seat, afternoon

`window-seat-reading-afternoon` · home · casual · serves reading, coffee

Objects named: **0**

### B1 — close · 1728×2304 · **ANCHOR — run first**

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on a deep oak window seat built into a plain white plaster wall wearing a navy lambswool crewneck jumper, light grey brushed cotton trousers and a steel watch. He has turned his head about twenty-five degrees toward the lens so the muscles of his neck are slightly visible, and his eyes are on the lens. One hand rests flat on the oak seat and the other is curled around the base of a stoneware mug, with one shoulder held slightly higher than the other. The room extends four metres behind him into soft dark shapes. A large window filling the right edge of the frame lays broad soft daylight across him. A 3:4 close frame from the chest up, iPhone 15 Pro, 35mm, f/1.8, 1/200, ISO 100. Keep visible pore structure on the cheeks, the fine fuzzy texture of the lambswool, and the metallic sheen of the watch face.
```

### B2 — medium · 1728×2304 · add the anchor output to image_urls

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on a deep oak window seat built into a plain white plaster wall wearing a navy lambswool crewneck jumper, light grey brushed cotton trousers and a steel watch. His face is turned about ten degrees away from the lens as he looks out toward the daylight, having just set his mug down. One hand rests on the edge of the oak seat and the other is wrapped around the stoneware mug, so one shoulder sits lower than the other. The background is five metres deep and entirely soft. A large window filling the right edge of the frame lays broad soft daylight across him. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/160, ISO 100. Keep the faint shadow of stubble along the jawline, the weave of the cotton trousers at the thigh, and the grain of the oak wood.
```

### B3 — threeQuarter · 2304×1728 · add the anchor output to image_urls

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on a deep oak window seat built into a plain white plaster wall wearing a navy lambswool crewneck jumper, light grey brushed cotton trousers and a steel watch. He looks up to the lens with his head tilted about five degrees, pausing his movement. One foot is tucked up onto the seat, one hand is resting on his raised knee and the other hand is flat on the timber beside his hip. The room falls away six metres behind him into soft pale bands. A large window filling the right edge of the frame lays broad soft daylight across him. A 4:3 three-quarter frame, iPhone 15 Pro, 24mm, f/2.0, 1/125, ISO 100. Keep individual hairs at the brow, the soft texture of the lambswool at the shoulder, and the crease of the trousers at the knee.
```

### B4 — expression · 1728×2304 · add the anchor output to image_urls

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on a deep oak window seat built into a plain white plaster wall wearing a navy lambswool crewneck jumper, light grey brushed cotton trousers and a steel watch. He is laughing with his head turned about fifteen degrees and his gaze dropping away from the lens toward the floor. One hand has come up to touch his own collarbone with the fingers slightly spread, and the other hand remains wrapped around the stoneware mug. The room behind him is four metres deep and soft. A large window filling the right edge of the frame lays broad soft daylight across him. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/200, ISO 100. Keep the deep creases at the corners of the eyes, the matte texture of the stoneware mug, and the visible pores across the bridge of the nose.
```

---

## SHOOT C — Stone bridge, hills

`stone-bridge-hills-overcast` · outdoors · casual · serves travel, hiking

Objects named: **1** (parapet)

### C1 — close · 1728×2304 · **ANCHOR — run first**

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on a stone bridge over a wide slow river with bare hills beyond, wearing a mustard yellow fleece pullover over a charcoal base layer, olive green cargo trousers, dark hiking boots and a steel watch. Having just reached the midpoint of the crossing, he turns his head about twenty degrees toward the lens with his chin level and his eyes are on the lens. One hand holds the nylon strap of a backpack on one shoulder while the other hand rests on a stone parapet, and one shoulder sits slightly higher than the other. The bare hills sit four hundred metres behind him in soft grey-green shapes. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/2.0, 1/800, ISO 64. Keep skin pores, the fuzzy pile of the fleece, and the fine metal links of the watch.
```

### C2 — medium · 1728×2304 · add the anchor output to image_urls

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on a stone bridge over a wide slow river with bare hills beyond, wearing a mustard yellow fleece pullover over a charcoal base layer, olive green cargo trousers, dark hiking boots and a steel watch. He is checking his position, his head turned about forty-five degrees away from the lens to look down the river, and his weight has shifted so one hip is higher. One hand holds a small brass compass and the other hand is flat against a stone parapet, and his shoulders sit at different heights. The hills are about five hundred metres in the distance and are soft. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/2.0, 1/800, ISO 64. Keep visible pores, the knurled edge of the compass, and the weave of the cargo trousers.
```

### C3 — threeQuarter · 2304×1728 · add the anchor output to image_urls

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on a stone bridge over a wide slow river with bare hills beyond, wearing a mustard yellow fleece pullover over a charcoal base layer, olive green cargo trousers, dark hiking boots and a steel watch. Having stopped to rest, he looks up to the lens with a slight smile and his head tilted about ten degrees. One hand is braced on the stone parapet behind him and the other hand rests on his knee, so his shoulders are at different heights. The far bank of the river is seventy metres away and remains soft. Broad overcast daylight fills his face evenly from above and slightly in front. A 4:3 three-quarter frame, iPhone 15 Pro, 24mm, f/1.8, 1/1000, ISO 64. Keep pore structure, the grain of the masonry, and the heavy leather texture of the boots.
```

### C4 — expression · 1728×2304 · add the anchor output to image_urls

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands on a stone bridge over a wide slow river with bare hills beyond, wearing a mustard yellow fleece pullover over a charcoal base layer, olive green cargo trousers, dark hiking boots and a steel watch. He has been caught mid-thought and his gaze falls away from the lens toward the water, his mouth slightly open and eyes narrowed as he thinks. One hand is tucked into a trouser pocket and the other hand rests on the stone parapet, with one shoulder slumped lower than the other. The hills are six hundred metres back and show as soft shapes. Broad overcast daylight fills his face evenly from above and slightly in front. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/2.0, 1/800, ISO 64. Keep the skin grain, the fine hairs of his beard, and the zip detail at his neck.
```

---

## SHOOT D — Venue entrance, evening

`venue-entrance-evening` · social · street · serves nightlife, music

Objects named: **0**

### D1 — close · 1728×2304 · **ANCHOR — run first**

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in the recessed doorway of a small music venue at night, wearing a black oversized denim jacket over a white cotton t-shirt, baggy charcoal cargo trousers, white high-top trainers and a steel watch. His chin is tucked down about ten degrees and his eyes are on the lens, with a subtle smirk lifting one side of his mouth as he checks his look in the glass. One hand is adjusting the collar of the jacket while the other rests against the metal door frame, with one shoulder held higher than the other. The dark floor runs two metres back behind him into soft dark shapes. Direct on-camera flash reaches him frontally, metered for his face so the skin holds detail and the fall-off happens behind him. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/125, ISO 500. Keep visible pores on the nose, the heavy grain of the denim, and individual stubble hairs.
```

### D2 — medium · 1728×2304 · add the anchor output to image_urls

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in the recessed doorway of a small music venue at night, wearing a black oversized denim jacket over a white cotton t-shirt, baggy charcoal cargo trousers, white high-top trainers and a steel watch. He has one hand buried deep in a jacket pocket while the other hand grips the edge of the metal door frame, with his weight shifted so one shoulder sits lower than the other while he waits for the bass to drop. His head is turned about fifteen degrees and his eyes go off to the side, caught by movement on the street. The doorway interior carries four metres behind him as soft dark shapes. Direct on-camera flash reaches him frontally, metered for his face so the skin holds detail and the fall-off happens behind him. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/1.8, 1/120, ISO 500. Keep the crisp cotton of the t-shirt, the metallic shine of the door frame, and natural skin texture.
```

### D3 — threeQuarter · 2304×1728 · add the anchor output to image_urls

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on a low concrete ledge outside a small music venue at night, wearing a black oversized denim jacket over a white cotton t-shirt, baggy charcoal cargo trousers, white high-top trainers and a steel watch. One hand rests on his knee while the other is planted on the concrete surface behind his hip, taking his weight so his shoulders sit at different heights as he takes a breather from the loud music. He looks up to the lens with his brow slightly raised. The pavement stretches six metres past him into soft dark bands. Direct on-camera flash reaches him frontally, metered for his face so the skin holds detail and the fall-off happens behind him. A 4:3 three-quarter frame taken from standing height, iPhone 15 Pro, 24mm, f/1.8, 1/120, ISO 450. Keep the grain of the concrete, the canvas of the trainers, and the fine lines at the corners of his eyes.
```

### D4 — expression · 1728×2304 · add the anchor output to image_urls

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in the recessed doorway of a small music venue at night, wearing a black oversized denim jacket over a white cotton t-shirt, baggy charcoal cargo trousers, white high-top trainers and a steel watch. He laughs with his head tilted about twenty degrees toward one shoulder, eyes squinting and teeth visible, his gaze falling away from the lens after hearing a funny remark. One hand is pressed flat against the denim of his chest while the other hand rests on the metal door, with one shoulder higher than the other. The entrance blurs into soft dark shapes three metres behind him. Direct on-camera flash reaches him frontally, metered for his face so the laugh lines read sharply. A 3:4 close frame from the shoulders up, framed low so there is headroom above him, iPhone 15 Pro, 24mm, f/1.8, 1/125, ISO 500. Keep the wetness of the eyes, the weave of the denim fabric, and real skin pores.
```

---

## SHOOT E — Ceramics studio, afternoon

`ceramics-studio-afternoon` · activity · sharp · serves art, travel

Objects named: **3** (workbench, bench, stool)

### E1 — close · 1728×2304 · **ANCHOR — run first**

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in a high-ceilinged ceramics studio beside a heavy timber workbench, wearing a charcoal grey boiled wool chore jacket over a black mock-neck jumper, navy wool trousers, black leather boots and a steel watch. He has turned his head about twenty degrees toward the lens ahead of his shoulders, mouth closed in a slight smile, and his eyes are on the lens. One hand rests on the rim of a tall ceramic vase on the bench, while the other hand is planted on the timber surface, and one shoulder sits lower than the other. The studio runs four metres back behind him into soft dark shapes. Broad daylight through a large open loading door fills his face evenly from the front and slightly above. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 160. Keep pore structure across the nose, the weave of the wool chore jacket, and the matte glaze of the vase.
```

### E2 — medium · 1728×2304 · add the anchor output to image_urls

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He leans over a heavy timber workbench in a high-ceilinged ceramics studio, wearing a charcoal grey boiled wool chore jacket over a black mock-neck jumper, navy wool trousers, black leather boots and a steel watch. His head is turned about forty degrees away from the lens as he inspects his work, having just set a tool down. One hand is braced on the workbench with the fingers splayed, the other hand is picking up a piece of wire from the wood, and one shoulder is dropped forward. The studio carries six metres behind him into soft dark shapes. Broad daylight through a large open loading door fills his face evenly from the front and slightly above. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/2.0, 1/200, ISO 125. Keep visible pores, the stubble along his jaw, and the rough grain of the timber workbench.
```

### E3 — threeQuarter · 2304×1728 · add the anchor output to image_urls

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He sits on a low timber stool in a high-ceilinged ceramics studio, wearing a charcoal grey boiled wool chore jacket over a black mock-neck jumper, navy wool trousers, black leather boots and a steel watch. One hand rests on his thigh and the other hand holds a wooden modeling tool against his knee, so his shoulders sit at different heights. He looks up to the lens with his head tilted about ten degrees. The open yard beyond the door sits eight metres past him in soft pale light. Broad daylight through a large open loading door fills his face evenly from the front and slightly above. A 4:3 three-quarter frame from a standing height looking down at him, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 100. Keep the texture of the mock-neck jumper at the neck, the grain of the boot leather, and visible pores.
```

### E4 — expression · 1728×2304 · add the anchor output to image_urls

```
All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. He stands in a high-ceilinged ceramics studio beside a heavy timber workbench, wearing a charcoal grey boiled wool chore jacket over a black mock-neck jumper, navy wool trousers, black leather boots and a steel watch. He is laughing at a sudden thought, his head turned about fifteen degrees and his gaze falling away from the lens to the workbench, eyes narrowing to creases. One hand is buried in his jacket pocket and the other hand is dusting a patch of dry clay from his own opposite forearm, and his shoulders have risen with the laugh. The studio wall lies five metres behind him in soft dark shapes. Broad daylight through a large open loading door fills his face evenly from the front and slightly above. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/320, ISO 200. Keep the creases at the corners of his eyes, the texture of the chore jacket, and a smudge of clay on one sleeve.
```

---

## Scoring

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

**The bar is 16 of 20.** If you would rather not run all twenty, the two that
answer the most are **B** (the reading shoot that scored 0 of 3 last time — it
is the direct test of the wardrobe and object-count fixes) and **E** (the
ceramics studio, which had the blazer and still names three objects, so it is
the one most likely to fail).

**E is the shoot I would cut first if it disappoints.** It names three objects
where the winners name one, and a pottery studio is inherently cluttered.
