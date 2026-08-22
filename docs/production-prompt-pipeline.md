# Production dating prompt pipeline

New orders can use the recipe-first production path without changing legacy
authored orders. Apply `supabase/migrations/033_dynamic_dating_prompt_pipeline.sql`
before enabling it.

## Configuration

```dotenv
DATING_PROMPT_PIPELINE_MODE=off
DATING_PROMPT_PIPELINE_USER_IDS=
DATING_SHOOTS_PER_DELIVERY=15
DATING_TEST_MODE=mock
DATING_SAMPLE_SHOOTS=2
DATING_GEMINI_CONCURRENCY=4
DATING_PROMPT_ATTEMPTS_PER_IDEA=3
```

- `off`: new orders keep using authored prompts.
- `owner`: only `ADMIN_EMAILS` owners and explicitly listed user IDs use dynamic prompts.
- `all`: every new order uses dynamic prompts.
- `mock`: local prompt fixtures and image placeholders; no Gemini or Fal calls.
- `sample`: Gemini writes every shoot, Fal renders only the configured number of complete shoots.
- `off` test mode: real Gemini and real Fal behavior.

The shoot count is copied onto each order. Later environment changes do not
change an active order's target, dashboard progress, or ready notification.

## Safe rollout

1. Deploy the migration and code with pipeline mode `off`.
2. Set mode to `owner` and test a full order in `mock` mode.
3. Test complete anchored shoots in `sample` mode.
4. Test one owner order with test mode `off`.
5. Review prompt validation/replan counts, Gemini costs, Fal failures, and scene continuity.
6. Set pipeline mode to `all`.

Switching pipeline mode back to `off` affects new orders only. Persisted dynamic
orders continue from their stored recipe, prompts, attempts, and photo rows.

## Local verification

```text
npm run check:recipes
npm run check:prompt-lab
npm run check:production-prompts
npm run check:production-types
npm run check:shoots
npm run check:variety
npm run build
```

All automated checks use fixtures or static contracts. They make no Gemini or
Fal request.
