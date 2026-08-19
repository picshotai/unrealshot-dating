/**
 * Tests whether an anchor frame can carry scene state across a shoot.
 *
 * The problem: five frames of one shoot came back with different objects on the
 * counter, different room dimensions and — in shoot B — three different jackets.
 * A seed cannot fix this. A seed fixes the noise a generation starts from, not
 * what is in the scene; change the prompt and the whole path changes.
 *
 * What can fix it is already in the call. `fal.subscribe` takes an array of
 * reference images and today receives only the selfies. This generates frame 1
 * first, then passes *its output* as an extra reference for the rest, so the
 * model has an actual photograph of the room, its objects, the window position
 * and the clothes.
 *
 * Every follower anchors to frame 1, never to the frame before it. A chain
 * propagates a flaw forward and compounds it; a star keeps each frame one step
 * from a known-good image.
 *
 *   FAL_KEY=... npx tsx scripts/test-anchor-chain.ts --refs "url1,url2,url3,url4"
 *
 * Optional:
 *   --no-anchor   generate all five WITHOUT chaining, for an A/B against a run
 *                 that used it. Same prompts, same references, one variable.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fal } from "@fal-ai/client";

const MODEL = "fal-ai/bytedance/seedream/v4.5/edit";
const OUT = resolve(process.cwd(), "docs/generated/anchor-test");

/** Shoot C, which scored 4/5 and is the strongest configuration found so far. */
const SHOOT = {
  id: "kitchen-window",
  size: { width: 1728, height: 2304 },
  frames: [
    {
      id: "C1",
      role: "anchor",
      prompt:
        "All references show the same man. Preserve his face, skin tone, hair, beard pattern, age and natural asymmetry; this identity belongs to him alone. At the kitchen counter in the white oxford shirt with the sleeves rolled to the forearm, he has turned his head toward the lens ahead of his shoulders, which stay angled to the counter, so the turn shows clearly in his neck. His mouth is closed with one corner lifted. One hand is braced on the counter edge, fingers over the lip of the stone. The room runs four metres back behind him, reduced to soft pale shapes. A large window filling the left edge of the frame lays broad soft daylight across his face, brightest on the near cheekbone. A 3:4 close frame from the shoulders up, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 100. Keep pore structure across the nose, the faint shadow of stubble along the jaw, and the shirt's collar edge catching a hard line of light.",
    },
    {
      id: "C2",
      role: "follower",
      prompt:
        "All references show the same man in the same kitchen as the scene reference, with the same counter, the same objects on it and the same window. He stands at the stone kitchen counter wearing the white oxford shirt with the sleeves rolled to the forearm. One hand rests around a coffee cup on the counter and the other is flat on the stone beside it, taking a little of his weight so that shoulder sits lower. He looks up to the lens with his chin slightly turned. The kitchen carries on five metres behind him, its far cabinets soft and a stop darker. A large window filling the left edge of the frame throws broad soft daylight across his face. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 100. Keep visible pores, forearm hair catching the window light, and the crisp weave of the oxford cotton.",
    },
    {
      id: "C3",
      role: "follower",
      prompt:
        "All references show the same man in the same kitchen as the scene reference, with the same counter, the same objects on it and the same window. He stands at the counter wearing the white oxford shirt with the sleeves rolled to the forearm, one palm flat on the stone taking his weight while the other hand hangs at his side, so one shoulder drops lower than the other. His head is up and turned about thirty degrees to the lens, mouth closed. The kitchen carries on five metres behind him into soft, slightly darker shapes. A large window filling the left edge of the frame lays broad soft daylight along the near arm and across the cheekbone. A 3:4 half-body frame at chest height, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 100. Keep tendon detail on the back of the resting hand, pore texture across the face, and the counter's cool matte surface.",
    },
    {
      id: "C4",
      role: "follower",
      prompt:
        "All references show the same man in the same kitchen as the scene reference, with the same counter, the same objects on it and the same window. Sitting on a stool at the kitchen counter in the white oxford shirt with the sleeves rolled to the forearm, he rests one forearm along the stone and lets the other hand hang between his knees. His shoulders are square, his back is easy, and he looks to the lens with his lips just parted. The kitchen runs five metres behind him, cabinets soft and darker. A large window filling the left edge of the frame puts broad soft daylight down his face and along the top of his forearm. A 3:4 three-quarter frame at seated eye level, iPhone 15 Pro, 24mm, f/1.8, 1/200, ISO 100. Keep visible pores, individual hairs at his hairline, and the soft folds where the rolled sleeve gathers at the elbow.",
    },
    {
      id: "C5",
      role: "follower",
      prompt:
        "All references show the same man in the same kitchen as the scene reference, with the same counter, the same objects on it and the same window. At the counter in the white oxford shirt with the sleeves rolled to the forearm, he laughs with his eyes creased and his gaze falling to the counter, one hand lifted to rest at the back of his own neck with the elbow out. His shoulders have risen with it. The kitchen sits four metres behind him and stays soft. A large window filling the left edge of the frame throws broad daylight across his face. A 3:4 chest-up frame at eye level, iPhone 15 Pro, 24mm, f/1.8, 1/250, ISO 100. Keep the creases at the outer corners of the eyes, real pores across the cheeks, and the fine texture of the shirt where it pulls at the shoulder.",
    },
  ],
};

async function generate(prompt: string, imageUrls: string[]) {
  const result: any = await fal.subscribe(MODEL, {
    input: {
      prompt,
      image_urls: imageUrls,
      image_size: SHOOT.size,
      num_images: 1,
      enable_safety_checker: true,
    },
    logs: false,
  });
  const url = result?.data?.images?.[0]?.url ?? result?.images?.[0]?.url;
  if (!url) throw new Error(`no image returned: ${JSON.stringify(result).slice(0, 200)}`);
  return url as string;
}

async function main() {
  const key = process.env.FAL_KEY;
  if (!key) throw new Error("FAL_KEY is required");
  fal.config({ credentials: key });

  const refsArg = process.argv.indexOf("--refs");
  if (refsArg === -1) throw new Error('pass --refs "url1,url2,..." with your sample photos');
  const selfies = process.argv[refsArg + 1].split(",").map((s) => s.trim()).filter(Boolean);
  const useAnchor = !process.argv.includes("--no-anchor");

  console.log(`\n${selfies.length} reference selfies · anchoring ${useAnchor ? "ON" : "OFF"}\n`);

  const anchor = SHOOT.frames[0];
  console.log(`  ${anchor.id} (anchor) generating...`);
  const anchorUrl = await generate(anchor.prompt, selfies);
  console.log(`  ${anchor.id} -> ${anchorUrl}`);

  // Followers run together once the anchor exists. This is the only place the
  // pipeline has to wait: one extra wave, not one extra image per frame, so a
  // twelve-shoot delivery costs two waves rather than twelve sequential runs.
  const followerRefs = useAnchor ? [...selfies, anchorUrl] : selfies;
  const followers = await Promise.all(
    SHOOT.frames.slice(1).map(async (frame) => {
      const url = await generate(frame.prompt, followerRefs);
      console.log(`  ${frame.id} -> ${url}`);
      return { id: frame.id, url };
    })
  );

  await mkdir(OUT, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const file = resolve(OUT, `${useAnchor ? "anchored" : "unanchored"}-${stamp}.json`);
  await writeFile(
    file,
    JSON.stringify(
      { shoot: SHOOT.id, anchored: useAnchor, selfies, anchor: { id: anchor.id, url: anchorUrl }, followers },
      null,
      2
    )
  );

  console.log(`\nwrote ${file}`);
  console.log(`
Judge only these, in order:
  1. Do the objects on the counter stay the same across C2-C5?
  2. Does the window stay on the left edge in every frame?
  3. Is it the same shirt, with the same sleeve roll?
  4. Did identity survive the extra non-face reference?
  5. Did any follower copy the ANCHOR'S POSE instead of its room? That is the
     failure mode to watch for, and the reason to keep the frames' actions
     described in explicit physical detail.
`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
