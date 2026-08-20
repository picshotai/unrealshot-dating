import { GoogleGenAI, Type } from "@google/genai";
import { SHOOTS, FRAMINGS, type Shoot } from "../shoots";
import { FRAMES_PER_SHOOT } from "../types";
import { LIGHT_GUIDANCE, type LightFamily, type ShootBrief } from "./briefs";
import {
  leadGarment,
  outfitOf,
  validateShoot,
  type CandidateShoot,
  type ValidationContext,
} from "./rules";

/**
 * Writes a new shoot by showing the model one that already works.
 *
 * The craft rules could be listed and nothing else, but a proven shoot teaches
 * them far better than any description does: the reference demonstrates the
 * sentence order, the level of physical detail, the way a pose is bounded with
 * a quantity, and the tone. So every call carries one.
 *
 * The reference is chosen by LIGHT, not at random, because that is the axis the
 * rules actually split on — "let the daylight catch the underside of his chin"
 * is correct under a window and produces an invented sun under flat overcast.
 * Showing an overcast shoot when writing overcast transfers the right pattern.
 *
 * Nothing here reaches a customer unread: every candidate goes through
 * `validateShoot` before it is returned, and a failure is fed back as a retry.
 * That gate is what separates this from the compositional library, whose fatal
 * flaw was that no one and nothing ever looked at its output.
 */

/** Which committed shoots are safe to imitate, by the light they were shot in. */
const REFERENCE_BY_LIGHT: Record<LightFamily, string[]> = {
  window: ["kitchen-window-morning", "living-room-window-afternoon", "wine-bar-late-afternoon"],
  overcast: ["marina-pontoon-overcast", "coast-path-hike-overcast", "golf-fairway-overcast"],
  flash: ["hotel-forecourt-evening"],
  openDoor: ["garage-motorcycle-daylight", "gym-glass-wall-morning"],
};

/**
 * Rotates through the references for a light family rather than always using
 * the first, so a batch does not come back smelling of one shoot.
 */
export function pickReference(light: LightFamily, index: number): Shoot {
  const ids = REFERENCE_BY_LIGHT[light];
  const wanted = ids[index % ids.length];
  const shoot = SHOOTS.find((s) => s.id === wanted);
  if (!shoot) {
    throw new Error(
      `Reference shoot "${wanted}" is no longer in the library; update REFERENCE_BY_LIGHT.`
    );
  }
  return shoot;
}

const SYSTEM_INSTRUCTION = `
You write prompts for an image-editing model (Seedream v4.5 edit) that turns a
man's reference selfies into dating-profile photographs. You are writing for a
paying customer, and the prompts are sent to the model verbatim.

A SHOOT is one location, one outfit, one light, photographed ${FRAMES_PER_SHOOT} ways:
${FRAMINGS.join(", ")}. Exactly one frame of each. The four frames are one
session on one day — same room, same clothes, same light — differing only in
distance and in what he is doing.

You will be shown one shoot that already works. Match its craft exactly: the
same sentence order, the same level of physical specificity, the same way a
pose is bounded with a quantity. Then write a DIFFERENT shoot — different
place, different clothes, different actions, different beats.

═══ RULES. Every one was paid for by a photograph that failed. ═══

1. NEVER use a negative. The model reads a forbidden noun as a requested one, so
   "no watermark" asks for a watermark. Say only what IS in the picture. No "no",
   "not", "without", "avoid", "instead of", "rather than", or contractions of them.

2. NEVER mention another person, in any form — no people, someone, friends,
   guests, diners, crowds, passers-by, figures, photographer. An undescribed
   person gets rendered with HIS face.

3. NEVER include an object that carries writing — sign, menu, label, poster,
   newspaper, timetable, noticeboard. Text renders as gibberish.

4. Name the gaze in every frame, always relative to "the lens". Two of the four
   frames meet the lens; the other two look away, and those two carry the
   involuntary expressions. Use these phrasings exactly for the ones that meet
   it: "his eyes are on the lens", "he looks up to the lens", "he looks straight
   to the lens".

5. Place both hands in every frame. Say what each one is touching, holding or
   resting on. Unplaced hands are where anatomy fails.

6. Bound every pose with a quantity — "about thirty degrees", "a few degrees".
   Unbounded, "head turned back before his shoulders follow" maxes out into a
   neck that reads broken. VARY these numbers between frames and between shoots.

7. State how far the background is, in metres, and that it is soft. Vary the
   distance frame to frame.

8. Anchor every physical object to what owns it. "A low stone step" became a
   kerb floating in a road. Say the step belongs to a doorway.

9. NEVER a symmetrical pose. One shoulder lower, one hand doing something the
   other is not. Symmetry is on this model's weak list.

10. NEVER "head tipped back" — it foreshortens the face and identity drifts.

11. ONE sentence places the light, and only one. Describing it three times made
    the model invent three sources. Light position is stated relative to the
    FRAME ("filling the left edge of the frame"), never to his body — "a window
    to his left" rendered on frame-left, which is his right.

12. Under FLAT light (overcast), light "fills". It never catches, strikes,
    rakes or falls across anything, because flat light has no direction.

13. Name garments so exactly one object satisfies the words. "A waxed cotton
    jacket" rendered as a field coat, a rain shell and a bomber across one
    shoot. "A waxed cotton field jacket with a corduroy collar" has one referent.

14. Repeat the outfit VERBATIM in all ${FRAMES_PER_SHOOT} frames — the identical
    clause, in one sentence of the form "wearing X, Y, Z and a steel watch."
    ending in a full stop, with no full stop inside it. Every generation stands
    alone; the two frames in testing that abbreviated the outfit are the two
    where the model invented the missing garment.

15. End every frame with a texture instruction — pores, stubble, creases, grain,
    the weave of a fabric. Plastic skin is what makes a photo read as generated.

16. The location must signal that he is doing well. "A damp narrow street
    outside a small restaurant" came back as an alley.

17. NEVER write "his left" or "his right" — not of a shoulder, a hand, a wrist
    or anything else. The model resolves "his left shoulder" as the shoulder on
    frame-left, which is his RIGHT, and the pose comes out mirrored. Write "one
    shoulder sits lower than the other", "one hand … the other hand".

18. Name the location ONCE, in sentence b. Never restate it later in the same
    prompt. Doing so produced "he leans against the parapet of the bridge with
    his weight on one hip on a stone bridge over a wide slow river".

19. OBJECT BUDGET: name at most TWO physical objects in the whole prompt — the
    one he is touching, and at most one more. Everything else is "soft shapes",
    "soft pale bands", "soft dark shapes".

    This is the strongest signal in the render data. Every object you name is an
    object the model must decide where to put, and it decides again from scratch
    in every frame. A shoot naming eight pieces of furniture scored 0 of 3: a
    sofa appeared where a bookshelf had been, and a table landed in the gap a
    man needs to stand in to reach the shelves. The shoot naming one object — a
    parapet — scored 2 of 2 and was the best of the batch.

    Prefer locations that are naturally sparse. A bridge, a shoreline, a lawn, a
    plain wall, a long counter. Avoid rooms full of furniture.

20. "Sharp" means well made, NOT corporate. A blazer, a suit, a tie or a
    business shirt makes him look like he is going to the office, which is the
    opposite of a dating photograph. Sharp is a heavy knit, wool trousers, a
    good overcoat, leather boots. Only a bar, a hotel or an evening venue may
    put him in tailoring.

    The outfit must suit the ACTIVITY, not only the register. A man reading for
    pleasure wears a jumper. Ask what he would actually have put on that
    morning.

21. Every frame needs a REASON he is in that position, not only a description of
    the shape. "Like someone forcefully told me to stand there" is what a
    described shape looks like when it renders. Give the beat: "still catching
    his breath", "having just set the cup down", "checking the line before he
    starts", "having lost the thread of it". The hand-written shoots that worked
    all do this; the ones that read as stiff do not.

═══ THE SHAPE OF EACH PROMPT ═══

Follow the reference sentence for sentence:

  a. The identity sentence, copied EXACTLY, character for character.
  b. Where he is and what he is wearing — the full outfit clause.
  c. What his head, face and gaze are doing, with quantities.
  d. What both hands are doing, and which shoulder sits lower.
  e. How far the background is, in metres, and that it is soft.
  f. The one light sentence.
  g. The technical line: ratio, framing, "iPhone 15 Pro", focal length, aperture,
     shutter, ISO. Vary the aperture and shutter plausibly for the light.
  h. "Keep …" — three texture details specific to this scene.

Aspect ratio: use 1728x2304 (which is 3:4) for most frames. Use 2304x1728
(4:3) for at most one frame, usually the three-quarter. The prompt text must
name that ratio exactly once, and it must match the imageSize you give.

Write British English. Write plain declarative sentences. No adjective stacking,
no "stunning", no "breathtaking", no mood words. A prompt is roughly 150-190
words.
`.trim();

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    id: {
      type: Type.STRING,
      description: 'lowercase-hyphenated, e.g. "bakery-counter-morning"',
    },
    title: {
      type: Type.STRING,
      description: 'shown to the customer, e.g. "Bakery, morning"',
    },
    kind: {
      type: Type.STRING,
      enum: ["portrait", "home", "outdoors", "social", "activity"],
    },
    register: { type: Type.STRING, enum: ["casual", "sharp", "street"] },
    frames: {
      type: Type.ARRAY,
      minItems: String(FRAMES_PER_SHOOT),
      maxItems: String(FRAMES_PER_SHOOT),
      items: {
        type: Type.OBJECT,
        properties: {
          framing: {
            type: Type.STRING,
            enum: ["close", "medium", "threeQuarter", "expression"],
          },
          width: { type: Type.INTEGER },
          height: { type: Type.INTEGER },
          prompt: { type: Type.STRING },
        },
        required: ["framing", "width", "height", "prompt"],
      },
    },
  },
  required: ["id", "title", "kind", "register", "frames"],
};

function renderReference(shoot: Shoot): string {
  const frames = shoot.frames
    .map((frame) => `--- ${frame.framing} (${frame.imageSize.width}x${frame.imageSize.height})\n${frame.prompt}`)
    .join("\n\n");
  return `SHOOT "${shoot.title}" (${shoot.kind}, ${shoot.register})\n\n${frames}`;
}

export function buildUserPrompt(
  brief: ShootBrief,
  reference: Shoot,
  taken: { locations: string[]; outfits: string[] }
): string {
  return `
Here is a shoot that works. Study its craft, then write a completely different one.

${renderReference(reference)}

═══ WRITE A NEW SHOOT ═══

It must serve these interests: ${brief.serves.join(", ")}.
Wardrobe register: ${brief.register}.
Kind: ${brief.kind}.
${brief.hint ? `Direction: ${brief.hint}.` : ""}

Light for this shoot: ${LIGHT_GUIDANCE[brief.light]}

Everything else must differ from the reference — the location, every garment,
what he is doing in each frame, and the beats. The four frames stay one session
in one place in one outfit.

These places are already used in the library. Choose somewhere else entirely:
${taken.locations.map((l) => `  - ${l}`).join("\n")}

These outfits are already used. Choose different garments:
${taken.outfits.map((o) => `  - ${o}`).join("\n")}
`.trim();
}

/**
 * The location, for the "already used" list that stops the model converging.
 *
 * Every prompt puts the place between the standing verb and ", wearing", which
 * is the only reliable boundary — matching on commas alone returns the outfit,
 * since the outfit clause is full of them.
 */
function locationOf(shoot: Shoot): string {
  const prompt = shoot.frames[0].prompt;
  const match = prompt.match(
    /\b(?:stands|sits|crouches|leans)\s+([^.]*?),\s*wearing\b/i
  );
  return match ? match[1].trim() : shoot.title;
}

export function libraryContext(): {
  locations: string[];
  outfits: string[];
  validation: ValidationContext;
} {
  const outfits = SHOOTS.map((s) => outfitOf(s.frames[0].prompt)).filter(
    (o): o is string => Boolean(o)
  );
  return {
    locations: SHOOTS.map(locationOf),
    outfits,
    validation: {
      takenPrompts: new Set(SHOOTS.flatMap((s) => s.frames.map((f) => f.prompt))),
      takenOutfits: new Set(outfits.map((o) => o.toLowerCase())),
      takenLeadGarments: new Set(outfits.map((o) => leadGarment(o.toLowerCase()))),
      takenIds: new Set(SHOOTS.map((s) => s.id)),
    },
  };
}

/** Folds this run's accepted shoots into the library context. */
function mergeContext(
  base: ReturnType<typeof libraryContext>,
  generated: readonly CandidateShoot[]
): ReturnType<typeof libraryContext> {
  if (generated.length === 0) return base;

  const outfits = generated
    .map((s) => outfitOf(s.frames[0]?.prompt ?? ""))
    .filter((o): o is string => Boolean(o));

  const locations = generated.map((s) => {
    const match = s.frames[0]?.prompt.match(
      /(?:stands|sits|crouches|leans)\s+([^.]*?),\s*wearing/i
    );
    return match ? match[1].trim() : s.title;
  });

  return {
    locations: [...base.locations, ...locations],
    outfits: [...base.outfits, ...outfits],
    validation: {
      takenPrompts: new Set([
        ...(base.validation.takenPrompts ?? []),
        ...generated.flatMap((s) => s.frames.map((f) => f.prompt)),
      ]),
      takenOutfits: new Set([
        ...(base.validation.takenOutfits ?? []),
        ...outfits.map((o) => o.toLowerCase()),
      ]),
      takenLeadGarments: new Set([
        ...(base.validation.takenLeadGarments ?? []),
        ...outfits.map((o) => leadGarment(o.toLowerCase())),
      ]),
      takenIds: new Set([
        ...(base.validation.takenIds ?? []),
        ...generated.map((s) => s.id),
      ]),
    },
  };
}

export type GenerateResult = {
  shoot: CandidateShoot | null;
  attempts: number;
  problems: string[];
};

/** Model output arrives flat; the library wants imageSize nested. */
function toCandidate(raw: any, brief: ShootBrief): CandidateShoot {
  return {
    id: String(raw?.id ?? ""),
    title: String(raw?.title ?? ""),
    kind: raw?.kind,
    register: raw?.register,
    interests: brief.serves,
    ...(brief.tags ? { tags: brief.tags } : {}),
    frames: (raw?.frames ?? []).map((f: any) => ({
      framing: f?.framing,
      imageSize: { width: Number(f?.width), height: Number(f?.height) },
      prompt: String(f?.prompt ?? ""),
    })),
  };
}

export async function generateShoot(
  brief: ShootBrief,
  options: {
    referenceIndex?: number;
    maxAttempts?: number;
    model?: string;
    /**
     * Shoots produced earlier in this same run.
     *
     * Without these, the library is the only thing a candidate is compared
     * against, so two shoots generated minutes apart can both come back in a
     * navy cashmere jumper — which is exactly what happened. A batch has to
     * accumulate against itself.
     */
    alreadyGenerated?: readonly CandidateShoot[];
    onAttempt?: (attempt: number, problems: string[]) => void;
  } = {}
): Promise<GenerateResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

  const ai = new GoogleGenAI({ apiKey });
  const model = options.model ?? "gemini-3-flash-preview";
  const maxAttempts = options.maxAttempts ?? 3;

  const reference = pickReference(brief.light, options.referenceIndex ?? 0);
  const context = mergeContext(libraryContext(), options.alreadyGenerated ?? []);
  const basePrompt = buildUserPrompt(brief, reference, context);

  let problems: string[] = [];

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    // A retry carries the failures forward as instructions. They are phrased as
    // what to do, so the model can act on them directly.
    const contents =
      problems.length === 0
        ? basePrompt
        : `${basePrompt}

═══ YOUR PREVIOUS ATTEMPT FAILED THESE CHECKS ═══
${problems.map((p) => `  - ${p}`).join("\n")}

Write the shoot again, fixing every one of them.`;

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA as any,
        temperature: 1.0,
      },
    });

    let candidate: CandidateShoot;
    try {
      candidate = toCandidate(JSON.parse(response.text ?? "{}"), brief);
    } catch (error) {
      problems = [
        `the response was not valid JSON (${error instanceof Error ? error.message : String(error)})`,
      ];
      options.onAttempt?.(attempt, problems);
      continue;
    }

    problems = validateShoot(candidate, context.validation);
    options.onAttempt?.(attempt, problems);

    if (problems.length === 0) {
      return { shoot: candidate, attempts: attempt, problems: [] };
    }
  }

  return { shoot: null, attempts: maxAttempts, problems };
}
