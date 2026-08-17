# Dating Photoshoot Pivot — Setup

## 1. Supabase migration

Run `supabase/migrations/017_dating_shoot.sql` in the Supabase SQL editor.

## 2. Validate the code-owned prompt library

```bash
npm run validate:dating-prompts
```

The V3 production library lives in `lib/dating/prompt-library.ts`: 300 complete
prompts, with three deterministic variants for every delivered slot and 12
complete hobby alternatives. New orders select their stable per-order variant,
compile only the controlled preference tokens, and snapshot the exact result;
no database seed or prompt migration is required. Review representative exact
compiled strings in `docs/DATING_PROMPT_V3_REVIEW.md`.

Each prompt also owns its composition-led output ratio. The worker maps authored
`9:16`, `3:4`, and `4:3` directions to fal's `portrait_16_9`,
`portrait_4_3`, and `landscape_4_3` sizes. Since the ratio is inside the
snapshotted prompt, resumes and paid regenerations preserve it without a new
database column. Legacy prompts without a ratio continue to use 9:16.

## 3. Trigger.dev

1. Create a project at https://cloud.trigger.dev
2. Copy project ref into `trigger.config.ts` (`project: "proj_..."`) **or** set `TRIGGER_PROJECT_REF`
3. Add to `.env.local`:
   ```
   TRIGGER_SECRET_KEY=tr_dev_...
   TRIGGER_PROJECT_REF=proj_...
   ```
4. Also add these env vars in Trigger.dev dashboard (for the worker):
   - `FAL_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`

5. Run worker locally:
   ```bash
   npm run trigger:dev
   ```

6. Deploy worker (production):
   ```bash
   npm run trigger:deploy
   ```

Vercel only hosts the Next.js app. All pipeline compute runs on Trigger.dev.

## 4. App flow

1. `/models/create` — men-only, 4–6 photos, guide gate
2. `/dating-shoot` — intake (vibe/style/hobby) → create order → 100 photos
3. Progress polls every 5s; gallery by 5 buckets
4. Retry failed photos; regenerate uses custom credits

## 5. Two-task resilient pipeline

Exactly **two** Trigger.dev task definitions:

| Task | ID | Role |
|---|---|---|
| Child | `generate-single-dating-image` | One photo. Retries 3× (2s→15s backoff). Deterministic ID upsert. |
| Parent | `dating-photoshoot-orchestrator` | Audits DB → `batchTriggerAndWait` incomplete children only. |

### Deterministic ID
`{batchId}_{bucket}_{index}` where index is 0–19.  
Example: `a1b2c3_social_4`

### Crash recovery
1. **Child crash mid-GPU** → Trigger retries child (max 3). Upsert overwrites same `deterministic_id` — zero duplicates.
2. **Parent crash mid-batch** → Parent retries. Re-audits Supabase: skips rows with `status=completed` + `image_url`, only re-dispatches incomplete.
3. **Manual retry** → `POST /api/dating-shoot/retry` re-triggers **parent only** (not a third task). Resets `failed`/`in_progress` → `pending`, parent audits again.

### Run migrations
1. `017_dating_shoot.sql`
2. `018_dating_shoot_resilient.sql` (deterministic_id, aesthetic_score, statuses)

## 6. Payment

Create-order currently starts the pipeline without charging (dev). Wire DodoPayments `$59` product before production and only call `createDatingShootOrder` from the payment webhook.
