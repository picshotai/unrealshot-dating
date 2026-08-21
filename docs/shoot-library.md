# The shoot library — how it works and what is still open

**For:** anyone picking up work on the dating photoshoot prompts or the pipeline
that sends them.

**Read this before writing a prompt.** Every rule below was paid for by a
photograph that came back wrong, and the reasoning is recorded so you can tell
which rules are evidence and which are inference.

Current state, verifiable with `npm run check:shoots`:

| | |
|---|---|
| Shoots | **70 total: 68 active, 2 quarantined** |
| Prompts | **280** (272 currently eligible for delivery) |
| One delivery | 15 shoots = 60 photos, $39 |
| Hand-written | 28 |
| LLM-drafted, human-checked, kept | 42 |
| Interest chips served | 22 of 22 |
| Catalog entries approved from rendering | **1** — see [Evidence status](#evidence-status) |

---

## 1. What a shoot is

A **shoot** is one location, one outfit, one light, photographed four ways. It is
the unit of everything: authoring, selection, generation, delivery, reshoots.

```ts
type Shoot = {
  id: string;            // "kitchen-window-morning"
  title: string;         // "Kitchen, morning" — shown to the customer
  kind: ShootKind;       // portrait | home | outdoors | social | activity
  register: StylePref;   // casual | sharp | street — the wardrobe lean
  interests?: InterestId[];   // which chips this shoot answers
  tags?: ExcludableTag[];     // alcohol | dog | bicycle | teamSport
  frames: ShootFrame[];       // exactly 4
  conceptFamily: string;      // semantic identity; near-duplicates share this
  settingFamily: string;      // caps repeated visual environments
  lightFamily: "window" | "open-door" | "overcast" | "flash";
  availability: "active" | "quarantined";
  evidence: "rendered-approved" | "prompt-reviewed" | "quarantined";
};

type ShootFrame = {
  framing: "close" | "medium" | "threeQuarter" | "expression";
  imageSize: { width: number; height: number };
  prompt: string;        // complete. no tokens. sent to fal verbatim
};
```

**Exactly one frame of each framing.** Two frames at the same distance is where
the model rendered one as the other with a small edit.

**The `close` frame is the anchor.** It is generated first and its output is
passed back as an extra reference for the other three. See §4.

### Why it is not composed

The previous system assembled each prompt at generation time from independent
`{{location}}`, `{{backdrop}}`, `{{outfit}}` and `{{hobby}}` values. Nothing ever
read the assembled result. **147 of 1,170 combinations were incoherent** — a navy
topcoat and leather dress shoes running up a forest trail — and live testing
returned 5 usable photos out of 20.

Nothing in this system substitutes anything at runtime. If you find yourself
adding a token, you are rebuilding the thing that failed.

---

## 2. Where everything lives

```
lib/dating/
  shoots.ts            the library. 70 shoots, 280 prompts. the product
  shoot-catalog.ts     semantic families, setting/light families, quarantine and evidence
  authoring/rules.ts   the 13 craft rules + validateShoot(). enforced on build
  authoring/briefs.ts  the brief format and the 53 briefs the library came from
  select-shoots.ts     which 15 shoots a given customer receives
  selection-history.ts prior-customer history and recent global concept usage
  plan-order-delivery.ts reserves a globally unique semantic lineup
  reference-image.ts   strips metadata and crops the unsafe watermark edge
  types.ts             FRAMES_PER_SHOOT, SHOOTS_PER_DELIVERY, prices, env knobs
  roles.ts             opener / full body / what you do — a filter over shoots
  interests.ts         the 22 chips and the 3 wardrobe registers
  deterministic-id.ts  {orderId}_{shootId}_{frameIndex} and the R2 key
  test-mode.ts         mock / sample / off
trigger/dating-shoot.ts   the two-wave orchestrator and the child worker
scripts/check-shoots.ts   npm run check:shoots  — the gate
scripts/check-variety.ts  npm run check:variety — overlap between customers
scripts/test-anchor-chain.ts  npm run test:anchor — costs money, see §8
docs/shoot-test-01.md     the first format test, with results and 15 rules
docs/shoot-test-02.md     the first generated batch, with rendered results
docs/shoot-test-03.md     the corrected batch — prompts written, never rendered
```

---

## 3. The 13 rules

All enforced by `validateShoot()` in `lib/dating/authoring/rules.ts` and run over
every prompt by `npm run check:shoots`. **A rule failing is a build failure.**

| rule | what it forbids or requires | the photograph that bought it |
|---|---|---|
| `negation` | no "no", "not", "without", "avoid", "instead of", contractions | the model reads a forbidden noun as a requested one — "no watermark" asks for a watermark |
| `second person` | no people, someone, friends, guests, diners, crowds, photographer | an undescribed person gets rendered **with his face** |
| `text objects` | no sign, menu, label, poster, newspaper | text renders as gibberish |
| `gaze target` | every frame names "lens" or "camera" | a frame with no stated gaze drifts |
| `hands placed` | every frame places the hands | unplaced hands are where anatomy fails |
| `subject distance` | every frame states a distance in metres | without it the background competes with him |
| `skin texture` | pores / stubble / creases / grain / texture | plastic skin is what makes a photo read as generated |
| `one light source placed` | at most one sentence *places* the light | C5 placed it three times; the model invented three suns |
| `frame-relative light` | never "a window to his left" | rendered on frame-left, which is his right |
| `no bilateral pose` | no symmetrical hands/shoulders | symmetry is on the model's weak list; produced a floating pose |
| `no tipped-back head` | never "head tipped back" | foreshortens the face; identity drifted twice |
| `body-relative side` | never "his left" / "his right", of anything | the model resolves it as frame-left and mirrors the pose |
| `no repeated phrase` | no 6-word sequence twice in one prompt | restating the location produced broken English |

Plus, per shoot: exactly 4 frames, one of each framing, the outfit clause
**byte-identical in all four**, a gaze mix (some meet the lens, some do not), the
aspect ratio in words matching `imageSize`, a unique id, a unique outfit, and a
unique *top layer* (the first two words — two shoots in "navy lambswool" read as
one shoot even though the strings differ).

### The rule that is not a rule

`sceneDensity()` counts the **movable objects** a prompt names. It is reported,
never enforced. It is the strongest predictor of failure in the render data:

```
8 objects named -> 0 of 3 usable   a sofa replaced a bookshelf; a table landed
                                   where a man has to stand to reach the shelves
3 objects named -> 2 of 3 usable
1 object named  -> 2 of 2 usable   the best frames of the batch
```

**Aim for one or two. Everything else is "soft shapes".** It is not a hard
failure because it rests on eight renders, and a threshold tuned to eight data
points would fail hand-written shoots nobody has rendered.

Three shoots currently exceed 3 objects, all written before this was understood:
`living-room-window-afternoon` (4), `roof-terrace-breakfast` (4),
`wine-bar-late-afternoon` (4). Treat them as suspects.

---

## 4. Generation: two waves, and what the anchor actually does

`trigger/dating-shoot.ts`.

```
wave 1   the close frame of every shoot            batchTriggerAndWait
         ↓  re-read anchor rows FROM THE DATABASE
            (not from batchResult — a parent crash between waves loses it)
wave 2   the other three frames of every shoot,
         each with its anchor's image_url appended to image_urls
```

### What the anchor carries — and what it does not

Measured on real renders, with the anchor chained:

| carried | **not** carried |
|---|---|
| identity (excellent) | **spatial geometry** |
| the outfit | where the furniture is |
| light direction and quality | which side of the frame things sit on |
| the general kind of room | the camera's position in the room |

The model is performing an *edit*. A follower asks for a different framing and a
different pose, so it must re-render the room from a viewpoint it has never seen.
It has no 3D model of the place.

This is why the earliest anchor test looked perfect: those frames were nearly
identical, so nothing had to be re-derived.

**Consequences you must design around:**

- A counter can change sides between two frames of one shoot. On a dating
  profile this is close to invisible — nobody cross-references the geometry of
  two photographs. Do not spend effort fighting it.
- A table landing in the gap a man needs to stand in *is* visible, inside one
  photograph. Fewer named objects is the only lever that works.
- Never write copy promising a spatially continuous walk around one room. The
  honest claim is: same place, same clothes, same light, same person.

### Other things that will bite

- **Seedream is not reproducible in edit mode**, even with a fixed seed. Seeds
  are not sent; they can provide neither consistency nor retry idempotency.
- **The anchor amplifies its own mistakes.** One test shoot's close frame had the
  wrong clothes and a stiff pose, and both followers inherited them. The close
  frame is the highest-leverage frame in a shoot.
- **Mock frames never anchor.** A placeholder SVG is garbage as a scene
  reference. Sample mode renders **whole shoots**, because one frame cannot tell
  you whether a shoot holds together.
- **A follower whose anchor failed is held back**, not dispatched un-anchored.
  The child's fast path treats a completed row as final, so a frame written once
  without its anchor is frozen that way forever.
- **Completion is counted in whole shoots** (`MIN_COMPLETE_SHOOTS = 10`), not
  photos. 55 photos as 11 broken shoots is a worse delivery than 50 as 12 whole
  ones.

---

## 5. Selection: which 15 of the 68 active shoots

`lib/dating/select-shoots.ts` is history-aware and treats novelty as a hard
priority, not a small score bonus. It fills a delivery in this order:

1. semantic concepts the customer has never received;
2. exact shoots the customer has never received;
3. least-recently-used shoots when the finite catalog is exhausted.

Within each tier, interests and wardrobe still shape the ranking. Recent global
concept usage is penalized so popular answers do not make one visual pattern
dominate all customers.

The delivery also enforces:

- one shoot per semantic `conceptFamily`;
- at most two shoots per `settingFamily`;
- portfolio bounds across portrait, home, outdoors, social and activity;
- minimum representation from window, open-door, overcast and flash light;
- at most two activity/outdoor shoots for any one selected interest;
- excluded content tags are dropped whole;
- quarantined shoots can never be selected.

Two superficially different IDs are therefore not enough to count as variety.
The garage and workshop motorcycle shoots from the bad deliveries are both
quarantined. Any future near-duplicates must share a concept family and cannot
coexist in one order.

Before photo rows are created, `plan-order-delivery.ts` reserves a semantic
fingerprint in a database unique index. Concurrent customers cannot receive the
same 15-concept lineup. A collision is re-planned up to 32 times.

### Variety, measured

`npm run check:variety` currently proves the operational guarantees:

- the same customer receives **0 exact shoot repeats** on each of the first three
  sequential purchases;
- purchase two receives **0 repeated semantic concepts**;
- all 68 active shoots are reachable and neither quarantined shoot is selected.

The catalog has 68 active shoots and 37 semantic concept families. Different
customers can still share individual concepts; the guarantee is that their full
15-concept lineups differ. Current simulation averages **6.0 shared concepts**
for both strangers and customers with identical answers; the checker fails if
either mean rises above 7. More high-quality, rendered-approved concepts are
required to lower that mathematical overlap further.

---

## 6. Adding a shoot

1. Add a brief to `lib/dating/authoring/briefs.ts` if there is not one — it names
   the interests served, the register, the kind and the **light family**
   (`window` / `overcast` / `flash` / `openDoor`).
2. Open `lib/dating/shoots.ts` and copy the nearest shoot **in the same light
   family**. The craft differs by light: under flat overcast, light *fills* and
   never catches or strikes anything, because flat light has no direction. Under
   a window it may lay across a face.
3. Write four frames. Keep the identity sentence character-identical. Repeat the
   outfit clause verbatim in all four. Vary the degrees, the metres and the
   exposure between frames — if every prompt says "thirty degrees" and "four
   metres", every photo has the same head angle.
4. Give each frame a **reason**, not just a shape. "Still catching his breath",
   "having lost the thread of it". A described shape renders as a pose; a
   described reason renders as a photograph. A rendered frame came back as
   *"like someone forcefully told me to stand there"* because it only had a
   shape.
5. **"Sharp" means well made, not corporate.** A blazer to read a book reads as
   a man going to the office. Enforced: tailoring outside a `social` shoot fails
   the build.
6. `npm run check:shoots` until green, then `npm run check:variety`.

Prefer sparse locations: a wall, a parapet, a shoreline, a doorway, a long empty
counter. Locations must also signal that he is doing well — "a damp narrow street
outside a small restaurant" came back as an alley.

---

## 7. Evidence status — read this before trusting anything

**The catalog is still under-rendered. Only one shoot is currently marked
`rendered-approved`; the rest are prompt-reviewed or quarantined.**

| | |
|---|---|
| Proven by rendering | the format itself; anchoring carries wardrobe/light/identity; anchoring does *not* carry geometry; object count predicts failure; seeds are useless; watermarks in references reproduce |
| Verified mechanically only | all 280 prompts pass all 13 rules, unique outfits, gaze mix, ratios |
| **Not verified at all** | whether any given location reads as somewhere a man wants to be photographed; whether the poses are physically plausible; whether 60 photos from one delivery hold together |

The rules encode what 8 renders taught. Everything downstream of that is
inference. Do not describe the library as tested.

**Cheapest way to get real evidence:** set `DATING_TEST_MODE=sample` (on the
Trigger.dev environment, not just `.env.local` — the orchestrator and child both
run there). That renders `DATING_SAMPLE_SHOOTS` whole shoots for real and mocks
the rest: 2 shoots ≈ 8 generations ≈ $0.32, and it exercises the full two-wave
anchoring path. It still charges the customer's credits.

Score with the six criteria in `docs/shoot-test-01.md` — 0 or 1 each, usable only
at 6/6.

---

## 8. Open obstacles

**R2 is on a development endpoint.** `R2_PUBLIC_URL` points at a
`pub-….r2.dev` address. That is Cloudflare's development public endpoint:
heavily rate-limited and explicitly not for production. Anchoring adds one fetch
per follower, so a 60-photo delivery is **+45 origin pulls, bunched into wave 2**,
on top of what the gallery serves. Objects are also written with no
`Cache-Control` (`lib/r2.ts`), so each is an origin hit. **This is the most
likely thing to break under load.** Move to a custom domain and set
`Cache-Control` on anchor objects.

**The 12-slot child queue is global.** With three concurrent orders, one order's
anchor wave competes with another's followers, and anchors have no priority — so
a busy period stalls every order's critical path. Anchors want their own queue or
a raised limit.

**Watermarked legacy references cannot be reused.** A "SHOT ON REDMI K20" stamp
in a selfie gets copied into outputs as garbled lettering. New dating references
are rotated, stripped of metadata, normalized to JPEG and have the bottom 8%
removed deterministically before storage. Existing samples are marked unsafe by
default in the migration; creating or regenerating a dating shoot refuses them
before charging and asks for a re-upload. This intentionally replaces the old
detector, which did not fire on real stamped photos. Text outside the cropped
bottom edge remains a limitation.

**Some interests are still thin.** The selector caps activity/outdoor delivery
at two shoots per interest, but thin categories still have limited visual range.
Motorcycles currently has one active concept because the two incoherent garage
variants are quarantined.

**Three shoots exceed the object budget** — listed in §3.

**Cross-customer concept overlap remains.** A unique complete lineup does not
mean every individual scene is globally exclusive. Growing the curated,
rendered-approved concept library is the lever; inventing synonyms for an old
scene is not.

---

## 9. Things that were tried and should not be retried

- **A compositional prompt system.** Assembling prompts from independent parts.
  147 of 1,170 combinations incoherent; nothing ever read the output. This whole
  architecture exists because that failed.
- **Seeds for consistency or idempotency.** Not reproducible in edit mode.
  Verified three ways, including re-running the original seed with the original
  anchor and prompt.
- **A watermark detector at upload.** Removed; see §8.
- **An LLM writing prompts at scale.** It worked — 42 of the 70 shoots came from
  it and all passed the rules — but it cost roughly $4 for output that still had
  to be read and corrected by a person, and the generator was deleted at the
  owner's instruction. `lib/dating/authoring/rules.ts` is what survived, and it
  is the valuable part. **Do not reintroduce an API-calling generator without
  asking first.**

## 10. Commands

```bash
npm run check:shoots     # the gate: 13 rules over every prompt, plus structure
npm run check:variety    # overlap between customers; run after changing the library
npm run build            # the app must compile
```

`npm run test:anchor` exists and calls fal. **It costs money. Do not run it
without asking.**
