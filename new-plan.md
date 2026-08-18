I've read your current prompts (`lib/prompts.ts`) and model pipeline. Now I understand the exact quality bar. Here's the rebuilt plan with your updates.

---

## 1. Positioning (unchanged)

Wedge: sell **profile performance**, not photo count. 100 photos across 5 archetypes mapping to 5 psychological signals. Audience: men 25–40, US/UK/AU/CA.

## 2. The Offer (unchanged)

> **"100 dating photos across 5 high-converting styles. $59, delivered in ~90 minutes. 30 custom regeneration credits included."**

## 3. The 5-Bucket Matrix (unchanged — your spec, locked)

20 generations per bucket × 5 = 100. Anchor Portrait / Social Candid / Travel Lifestyle / Active Vitality / Casual Streetwear.

## 4. Core Flow — 4 Stages (rebuilt per your updates)

### Stage A — Intake & Upload Guide (BUILD, simplified)
- **Max 6 photo uploads.** Hard cap. No auto quality checker, no Google GenAI.
- Replace auto-rejection with a **strict visual upload guide** shown in the UI before the dropzone unlocks. User must check a "I've read the guide" checkbox to proceed.
- Guide content (rendered as 6 illustrated do/don't cards):
  1. Face clearly visible, no sunglasses, no hats
  2. Taken within last 2 years
  3. Daylight or well-lit room, no harsh shadows
  4. Front-facing + 2 side angles minimum
  5. One close-up (head + shoulders), one half-body
  6. No other people in frame, no group crops
- Min 4 photos required to proceed (out of 6 max).
- No ML scoring. The guide + the "I've read it" gate is your quality floor. Bad uploads → bad results → user owns that decision, not you. This protects refund logic later.

### Stage B — Model Creation (KEEP current pipeline, minor UI edits)

- **Use your existing `/api/models` POST + `/api/models/[id]/samples` upload flow as-is.** No changes to backend. Model row created with `status: 'processing'`, samples uploaded to R2, seedream uses them as `image_urls` at generation time.
- **Remove gender tabs from UI.** `models.type` is still stored (default to `'Male'` server-side since the product is men-only), but the user never sees a gender picker.
- **Remove mode picker** (no "couple" option). `mode` defaults to `'single'`.
- **No identity-lock verification.** No test generations. No face-similarity scoring. Once samples are uploaded and model row is `status: 'ready'`, the order can proceed. Trust the seedream reference-image flow you already have working.
- The "model" concept stays. One model per user for the dating shoot. They can retrain (re-upload) from dashboard if quality is bad — manual, not automated.

### Stage C — Prompt Library (BUILD — your moat, the critical work)

This is where the product lives or dies. I read `lib/prompts.ts` — your existing prompts are the quality bar. Look at what they do:

- **Specific camera bodies**: `Fujifilm GFX 100S`, `Phase One IQ4 150MP`, `Leica SL2`, `Hasselblad H6D-100c`, `Sony A7S III`
- **Specific lenses + apertures**: `Summilux-SL 50mm f/1.4`, `RF 85mm f/1.2 L USM at f/1.2`, `GF 80mm f/1.7 at f/2.0`
- **Skin texture anchoring**: `pores, stubble growth pattern, vellus hair, oil sheen on forehead, goosebumps from cool air, peach fuzz`
- **Lighting setups named**: `Rembrandt triangle, Clamshell, open shade, direct on-camera flash at 1/1 power, golden hour backlight`
- **Identity lock clause**: `Keep facial identity consistent from reference photos provided`

This is why your current output looks smartphone-real. The dating library must hit this same bar.

**The seedream stiffness problem — the fix:**

Seedream v4.5 defaults to rigid, posed-looking bodies. Your existing prompts already fight this with **micro-movement verbs** — extract this pattern and bake it into every dating prompt:

| Stiff (avoid) | Candid (use) |
|---|---|
| "standing, looking at camera" | "caught mid-stride, looking back over shoulder" |
| "sitting in chair" | "slumped in seat, head tilted against headrest" |
| "holding cup" | "lifting drink to lips, mid-sip, eyes down" |
| "smiling" | "mid-laugh, head thrown back slightly, eyes crinkled" |
| "walking" | "walking briskly, one hand reaching up to brush hair from eyes" |
| "leaning on wall" | "leaning against doorframe, patting pockets for keys, furrowed brow" |

Every dating prompt must include at least one **in-progress action** + one **micro-expression** + one **body-weight-shift cue** ("weight on one hip", "leaning slightly forward", "shoulders relaxed, not squared").

**Library structure:**

New table:
```
prompt_library (
  id uuid primary key,
  bucket enum('anchor','social','travel','active','street'),
  slot int,                    -- 1..20 within bucket
  prompt_template text,        -- full prompt, parametrized
  style_modifiers jsonb,       -- {camera, lens, aperture, lighting, iso}
  posing_cues jsonb,           -- {action, micro_expression, weight_shift}
  params jsonb,                -- {outfit_options, location_options, time_of_day_options}
  is_active bool default true,
  version int default 1
)
```

**20 prompts per bucket = 100 total.** Each prompt is a complete, production-ready string at the quality of your current `REFERENCE_PROMPTS.LIFESTYLE.MALE` entries — not a skeleton. Params (`{{outfit}}`, `{{location}}`) get filled from the 3-question intake at run time.

**Intake (3 questions, fills params):**
1. Vibe: urban / outdoorsy / homebody → drives `{{location}}` pool per bucket
2. Style: casual / sharp / street → drives `{{outfit}}` pool per bucket
3. Hobby (optional free text, 1 line): included in Active Vitality bucket prompts only

Store in `user_preferences`. At run time, expand each template: pick param values from the user's pools, rotate through slot 1–20 so no two photos in a bucket share the same (location, outfit, time) combo.

**Bucket-specific prompt engineering directives:**

| Bucket | Camera/light recipe | Posing fix |
|---|---|---|
| Anchor Portrait | Canon R5 85mm f/1.2, open shade or soft window light, shallow DOF | NOT "staring at camera" — use "looking just past lens", "slight head tilt", "breathing out, shoulders dropped" |
| Social Candid | iPhone snapshot aesthetic, mixed ambient + slight flash, 35mm equivalent | Mid-interaction: "lifting glass", "laughing at someone off-camera", "leaning back in chair mid-sentence" |
| Travel Lifestyle | Fujifilm GFX 100S, golden hour backlight, motion-frozen | Walking shots only: "mid-stride on cobblestones", "turning to look back at camera", "shielding eyes from low sun" |
| Active Vitality | Sony A1, overcast diffuse light, 50mm f/1.2 | Never gym-pose: "walking dog, leash taut", "mid-hike, one foot on rock", "stretching arms overhead on trail" |
| Casual Streetwear | Leica Q2, slight motion blur, 28mm, sodium vapor or overcast | Street-crossing candids: "mid-step at crosswalk", "adjusting jacket collar against wind", "looking down at phone mid-stride" |

**How to build the 100 prompts (workflow):**
1. Take your existing 5 MALE prompt families in `lib/prompts.ts` (FLASH, LIFESTYLE, GRITTY, CINE, PROFESSIONAL) — these are your seeds.
2. For each bucket, write 20 variants by rotating: location, outfit, time-of-day, camera body (stay in the same family for consistency), posing cue. Each variant is a full 80–120 word prompt.
3. Run every prompt through your current `enhancePrompt` Gemini pass during library build (not at runtime) to tighten phrasing. Save the enhanced output as the final `prompt_template`.
4. Test-generate 3 prompts per bucket against a real model. If output looks stiff, revise posing cues. Iterate until all 15 test shots pass a "would I believe this was taken on a phone" eye test.
5. Lock version 1. Ship.

**This is 2 weeks of writing work, not 2 days. Budget it.** The prompt library is the entire product. 100 mediocre prompts = a datingshoot.com clone. 100 prompts at your current `lib/prompts.ts` quality = a product that looks worth $59.

### Stage D — trigger.dev Orchestration with Resumable Pipeline (rebuilt)

The two new requirements: **(1) don't die on fal rate limits, (2) resume from exact failure point on restart — no duplication, no destruction.**

**The resumable design — one principle: pre-allocate all 100 slots in DB before any generation starts.**

```
user_shoot_orders (id, user_id, model_id, status, trigger_run_id, ...)
order_photos (
  id, order_id, bucket, slot,        -- bucket+slot = unique position (1..100)
  prompt_template text,              -- frozen at allocation time
  status enum('pending','in_progress','completed','failed'),
  fal_request_id text,
  image_url text,
  attempt_count int default 0,
  failed_reason text,
  created_at, updated_at
)
```

**Order creation (`/api/dating-shoot/create-order`):**
1. Create `user_shoot_orders` row, status `queued`.
2. **Pre-allocate 100 `order_photos` rows**: for each bucket (5) × slot (20), load the prompt_template from `prompt_library`, fill params from `user_preferences`, insert with status `pending`. All 100 rows exist before any fal call.
3. Invoke trigger.dev `createRun("dating-shoot-pipeline", { orderId })`.

**The trigger.dev task — idempotent by design:**

```typescript
task("dating-shoot-pipeline", async (payload) => {
  const { orderId } = payload;

  // 1. Load ONLY pending photos — this is the resume point
  const pending = await db.query(`
    SELECT * FROM order_photos 
    WHERE order_id = $1 AND status = 'pending' 
    ORDER BY bucket, slot
  `, [orderId]);

  if (pending.length === 0) {
    // All 100 done (or failed). Mark order ready. Send email. Exit.
    await markOrderReady(orderId);
    return;
  }

  // 2. Update order status to 'developing'
  await updateOrderStatus(orderId, 'developing');

  // 3. Submit in small batches — respects fal concurrency limits
  const BATCH = 5;          // conservative for seedream
  const BATCH_GAP_MS = 3000; // 3s between batches

  for (const chunk of chunkArray(pending, BATCH)) {
    await ctx.batch(
      chunk.map(photo => 
        ctx.run("generate-one-photo", 
          async () => generateSinglePhoto(photo),
          { name: `${photo.bucket}-${photo.slot}` }
        )
      )
    );
    await sleep(BATCH_GAP_MS);  // let fal breathe
  }

  // 4. After all attempted, check completion
  const completed = await db.query(`
    SELECT count(*) FROM order_photos 
    WHERE order_id = $1 AND status = 'completed'
  `, [orderId]);

  if (completed >= 85) {
    await markOrderReady(orderId);
  } else {
    // Too many failures — leave as 'developing' for manual review
    await updateOrderStatus(orderId, 'partial_failed');
  }
});

async function generateSinglePhoto(photo) {
  // Mark in-progress (idempotent — if retried, picks up here)
  await db.update(photo.id, { status: 'in_progress', attempt_count: photo.attempt_count + 1 });

  try {
    const { request_id } = await fal.queue.submit("fal-ai/bytedance/seedream/v4.5/edit", {
      input: {
        prompt: photo.prompt_template,
        image_urls: referenceImageUrls,  // from model.samples
        image_size: "portrait_16_9",
        num_images: 1,
        enable_safety_checker: true,
      },
    });

    // Wait for fal webhook, routed into trigger.dev
    const result = await ctx.waitForEvent("fal.image.ready", {
      filter: { request_id },
      timeout: "5m",
    });

    if (result.status === 'ok') {
      await db.update(photo.id, { 
        status: 'completed', 
        image_url: result.image_url,
        fal_request_id: request_id 
      });
    } else {
      await db.update(photo.id, { 
        status: 'failed', 
        failed_reason: result.error || 'unknown' 
      });
    }
  } catch (err) {
    // trigger.dev auto-retries this ctx.run up to maxAttempts
    // After final failure, mark as failed — don't block the rest
    await db.update(photo.id, { 
      status: 'failed', 
      failed_reason: err.message 
    });
  }
}
```

**Why this is resumable — the three scenarios:**

| Scenario | What happens |
|---|---|
| Task crashes at photo 40 (buckets 1+2 done) | Re-invoke trigger.dev with same `orderId`. Task queries `WHERE status = 'pending'` → finds 60 rows starting at bucket 3 slot 1 → generates from photo 41. Completed rows untouched. |
| Individual photo fails 3× | `ctx.run` exhausts retries → row marked `failed` → pipeline continues to next photo. One bad photo doesn't kill the order. |
| fal 429 rate limit mid-batch | Exponential backoff inside `ctx.run` retry. If still failing, that photo fails, pipeline moves on. The 3s gap between batches prevents most 429s. |

**Restart triggers (any of these re-invoke the same task with same orderId):**
1. trigger.dev native `maxAttempts: 3` on the parent task
2. Cron job: every 15 min, find orders where status = `developing` AND last_update > 90 min ago → re-invoke
3. Manual "Retry failed photos" button in dashboard → calls a new `/api/dating-shoot/retry` endpoint that re-invokes with same orderId. Task finds failed+pending photos, regenerates only those.

**Rate limit safety layer (specifics):**
- `BATCH = 5` concurrent fal submits (seedream edit can handle this; verify on fal dashboard)
- `BATCH_GAP_MS = 3000` between batches → ~60s per 100 photos of pure wait, negligible vs generation time
- `ctx.waitForEvent` timeout 5 min per photo → if fal silently drops a webhook, that photo fails cleanly, doesn't hang the pipeline
- Global concurrency guard: a small `order_queue` table — if >3 orders are `developing` simultaneously, new orders wait in `queued` state. Prevents fal account-level rate limits. Cron drains the queue.
- Fal cost monitor: `order_photos` row stores `fal_cost_cents` per generation. Sum on order completion. If an order exceeds $X cost (set alert at $8 — your $59 price has plenty of headroom at 100 gens × ~$0.04/gen), flag for review.

**Fal webhook change:** keep `/api/fal/webhook` route but make it a thin forwarder:
```typescript
// app/api/fal/webhook/route.ts (modified)
export async function POST(req) {
  const payload = await req.json();
  await triggerClient.invokeEvent("fal.image.ready", payload, {
    id: payload.request_id,  // dedupe key
  });
  return NextResponse.json({ ok: true });
}
```
Supabase `generation_jobs` table is no longer the orchestration source of truth. `order_photos` is. Keep `generation_jobs` as optional audit if you want, but stop reading it for state.

---

## 5. Dashboard (unchanged from previous, minus curation)

| Current | Pivot |
|---|---|
| Upload → type prompt → 1 image | Upload → guide gate → 100 photos across 5 buckets |
| Per-photo credit purchase | $59 bundle includes 30 custom credits |
| Free-text prompt box | Hidden library; scenario picker only |
| Generic gallery | 5-bucket gallery with bucket labels |

**Sections:**
1. **Your Shoot** — status: queued → developing (progress bar: "47 of 100 photos developed", fed from `order_photos` count) → ready
2. **5-Bucket Gallery** — tabbed or grid-grouped by bucket, 20 photos each, bucket label + 1-line bucket description
3. **Custom Generator** — uses 30 included credits; user picks bucket + scenario from dropdown, regenerates 1 photo via trigger.dev subtask
4. **Download Center** — per-photo 4:5 IG-ready crop, zip download (`jszip` already in deps)

**Cut:** free-text prompt box, "Primary 6" curation (removed per your call), all non-dating categories, all non-dating SEO landing pages.

---

## 6. Backend Delta (updated)

**New tables:**
- `prompt_library` (above)
- `user_shoot_orders` — `id, user_id, model_id, status enum('queued','developing','ready','partial_failed'), trigger_run_id, custom_credits_remaining int default 30, fal_cost_cents int, created_at, ready_at`
- `user_preferences` — `user_id, vibe, style, hobby_text, created_at`
- `order_photos` — `id, order_id, bucket, slot, prompt_template, status, fal_request_id, image_url, attempt_count, failed_reason, fal_cost_cents, created_at, updated_at` + unique constraint on `(order_id, bucket, slot)`

**New endpoints:**
- `POST /api/dating-shoot/create-order` — post-payment, pre-allocate 100 rows, kick off trigger.dev
- `GET /api/dating-shoot/run-status?orderId=` — reads `order_photos` count by status
- `POST /api/dating-shoot/retry` — re-invoke trigger.dev with same orderId (resume)
- `POST /api/dating-shoot/regenerate` — single photo, uses 1 custom credit
- `POST /api/fal/webhook` (modified) — thin forwarder to trigger.dev

**New dep:** `@trigger.dev/sdk` v3. Env: `TRIGGER_SECRET_KEY`, `TRIGGER_API_URL`.

**Infra spike (week 1, non-negotiable):** verify Vercel can host the trigger.dev worker long enough for a 100-photo run. If Vercel function max duration bites, run the trigger.dev task on a separate small worker (Railway/Fly.io always-on process). Find out Monday, not month 3.

---

## 7. Build Order (8 weeks)

| Week | Work |
|---|---|
| 1 | trigger.dev spike: 1 task → 10 fal submits → 10 results → kill one mid-run → verify resume picks up from photo 11. **This is the go/no-go gate.** |
| 2 | Stage A upload guide UI + 3-question intake + `user_preferences` table |
| 2–3 | Stage B UI edits: remove gender tabs, remove mode picker, default to men |
| 3–5 | **Stage C: write all 100 prompts.** This is the longest task. 20/bucket, full quality, test-generate 3/bucket against a real model, iterate posing cues until not stiff. |
| 5–6 | Stage D full pipeline: `order_photos` pre-allocation, trigger.dev task, fal webhook forwarder, rate limit batches, resume logic |
| 6–7 | Dashboard rebuild: 5-bucket gallery, progress bar from `order_photos`, download center |
| 7 | Custom generator (30 credits), retry endpoint |
| 7 | Landing page rewrite, $59 pricing, kill non-dating pages |
| 8 | Beta to 10 users free. Measure: likeness quality, stiff-pose rate, fal cost/order, time-to-ready. Iterate prompts. |

---

**What changed in this revision:**
- Stage A: 6 photos max, no ML quality checker, guide-driven
- Stage B: keep current pipeline, strip gender/mode UI, no identity verification
- Stage C: 100 prompts at `lib/prompts.ts` quality bar, with explicit anti-stiffness posing cues per bucket
- Stage D: pre-allocated `order_photos` rows + `WHERE status='pending'` query = exact-point resume, no duplication, no destruction. Rate limit safety via batch=5 + 3s gap + global concurrency guard.

**One thing to decide before week 1:** the week-1 trigger.dev spike is the single biggest risk. If resume doesn't work cleanly on Vercel, the whole pipeline architecture has to move to an always-on worker. Spike it first, build everything else after.



# Final Production Prompt Upgrade: Realism, Human Motion, and User-Level Variety

## Summary

Replace the current V2 library with a V3 library containing three complete, independently authored variants for each of the 100 photo slots: 300 base prompts plus 12 complete hobby alternatives.

No prompt will be assembled from action, pose, light, camera, or realism fragments. Every variant will describe one coherent photograph from identity through human moment, setting, wardrobe, camera behavior, lighting, skin rendering, and finish.

The rewrite will discard inherited prose instead of mechanically repairing phrases such as “he is mid-sentence gesture.” Existing orders retain their snapshotted prompts; only new orders use V3.

## Prompt Content Upgrade

- Rewrite all prompt text from scratch using complete grammatical sentences and causal moments:
  - Describe what just happened, what the subject is doing, and what naturally caused his body position.
  - Avoid mannequin directions such as “weight on one hip, shoulders dropped” unless they arise naturally from the event.
  - Ban constructions such as `he is mid-*`, `he is weight shifted`, `he is hands...`, and other inherited sentence fragments.
- Keep compiled prompts focused at roughly 65–105 words, with a hard validation ceiling of 110. Seedream’s official guidance favors concise prompts, prioritizes earlier concepts, and recommends composition, lighting, and technical camera language. [fal Seedream 4.5 prompt guide](https://fal.ai/learn/devs/seedream-v4-5-prompt-guide)
- Structure every complete prompt in this order:
  1. Concise identity/reference instruction.
  2. Specific location, wardrobe, and causal human moment.
  3. Composition and camera viewpoint.
  4. One coherent capture recipe with visible photographic consequences.
  5. Distance-appropriate skin and realism constraints.
- Give every variant one internally consistent capture grammar:
  - **Anchor:** medium-format natural portrait, full-frame editorial portrait, or friend-taken daylight portrait.
  - **Social:** high-ISO available-light documentary, compact-camera direct flash, or daylight 35mm/smartphone candid.
  - **Travel:** Leica/Fujifilm 28–35mm documentary, Canon/Sony 50mm lifestyle, or medium-format environmental portrait.
  - **Active:** Canon/Sony high-shutter action, friend-taken smartphone movement, or Fujifilm/Leica outdoor documentary.
  - **Street:** Leica 28mm documentary, Sony A7S III high-ISO night photography, or compact/disposable-style direct flash.
- Use physically coherent settings:
  - Portrait apertures generally f/2–f/2.8 rather than universal f/1.2 blur.
  - High shutter speeds freeze motion; slower shutter or flash produces background movement.
  - Direct flash instructions describe ambient exposure, shadow behavior, grain, and highlight response instead of meaningless “1/1 power.”
  - Never combine contradictory grammars such as Monochrom color, Hasselblad disposable-camera texture, or high shutter with unexplained motion blur.
- Make skin direction framing-aware:
  - Close portraits may specify subtle tonal variation, varied beard density, faint under-eye texture, restrained pores, and highlight rolloff.
  - Medium/full-body images request believable facial detail at camera distance without impossible pore visibility.
  - Flash scenes retain honest specular highlights and harder texture.
  - High-ISO scenes apply fine luminance grain across the image, not artificial texture painted onto the face.
  - Ban waxy smoothing, beauty filters, facial reshaping, uniform pore sharpening, glamour glow, and plastic highlight behavior.
- Preserve only `{{location}}`, `{{outfit}}`, and the controlled `{{hobby}}` token. Each variant owns compatible location and outfit maps; these substitutions cannot change its pose, camera grammar, light, or photographic intent.

## Variant Architecture and Selection

- Upgrade `DatingPromptDefinition` to library version 3 and add `variant: "a" | "b" | "c"`.
- Flatten the library to 300 explicit definitions:
  - 60 variants per bucket.
  - Exactly three variants for every bucket/slot pair.
  - Variants must differ in moment, composition, and capture grammar—not merely camera name or wording.
- Provide `getPromptVariants(bucket, slot)` and `selectDatingPromptVariant(batchId, bucket, slot)`.
- Select variants using a stable pure-JavaScript hash of `v3:${batchId}:${bucket}:${slot}`, modulo three:
  - Same order and slot always select the same variant.
  - A new order receives a different 100-photo combination.
  - Retries remain stable because the compiled prompt is still snapshotted into `order_photos`.
- Update order creation to select one variant per slot before calling `compileDatingPrompt()`.
- Keep fal’s seed behavior unchanged: reference identity and stochastic generation provide micro-variation, while V3 variants provide macro art-direction variation.
- Give all three variants of active slots 17–20 a complete hobby alternative, producing 12 hobby templates. Missing hobbies use each variant’s complete authored fallback.
- Do not add a database column or migration. The stored compiled prompt remains the source of truth for existing orders, resumes, and debugging.

## Validation and Acceptance

- Expand the validator to require:
  - 300 base definitions, 60 per bucket, and three variants per slot.
  - 12 hobby alternatives.
  - Unique IDs and unique complete prompt text.
  - Successful compilation of all 5,400 vibe/style/hobby combinations.
  - No unresolved placeholders, malformed whitespace, unknown tokens, or out-of-range word counts.
- Add explicit prose and contradiction checks for:
  - Known `he is ...` fragments and the complete inherited awkward-phrase list.
  - Marketing abstractions such as “high-value energy” or “catfish paranoia.”
  - Monochrom/color conflicts, high-shutter/motion-blur conflicts, disposable/medium-format conflicts, and unsupported prompt flags.
  - Missing camera/capture language or multiple conflicting capture grammars.
- Add deterministic-selection tests:
  - Same batch/slot always returns the same variant.
  - All three variants are reachable across fixture batch IDs.
  - Every generated order still produces exactly 20 photos per bucket and 100 total.
- Produce a review file containing compiled examples for every bucket and capture grammar so the complete strings can be inspected before model generation.
- If fal credentials and paid-test authorization are available, run a 45-image QA matrix: five buckets × three capture grammars × three diverse male reference sets. Reject prompts that produce waxy skin, stiff posing, identity drift, implausible hands/equipment, contradictory optics, excessive blur, or repeated-looking scenes.
- Run the prompt validator throughout authoring, then perform one final TypeScript check, lint attempt, and production build attempt after the entire V3 library is complete.

## Assumptions

- Keep the current five buckets, 20 delivered photos per bucket, 100-photo order size, preference fields, Seedream 4.5 Edit endpoint, reference-image flow, and Trigger.dev orchestration.
- Keep code as the authoritative prompt source and preserve exact compiled prompt snapshots in `order_photos`.
- Limit changes to the prompt library, compiler/selector, order-time prompt choice, validation, and prompt documentation.
- Do not change UI, database schema, pricing, ranking, curation, generation concurrency, image dimensions, or unrelated product behavior.