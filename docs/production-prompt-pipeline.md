# Production dating prompt pipeline

New orders can use the recipe-first production path without changing legacy
authored orders. Fresh databases apply migrations `033_dynamic_dating_prompt_pipeline.sql`,
`034_wide_dynamic_scene_anchor.sql` and `035_dynamic_prompt_v4_anchor.sql` in order.
Applied migrations stay immutable; existing databases run only the later files they
have not already recorded.

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

Sample selection maximises coverage of the customer's selected interests before
filling spare real-render slots. Because the default sample is two shoots, it can
prove at most two distinct selected interests in one paid test.

The clothing answer is a customer-style preference, not an order-wide outfit
lock. Every recipe resolves its own scene register and wardrobe contract. Sport,
home and outdoor requirements outrank the preference; only compatible social or
evening scenes may use tailoring.

Prompt systems v3 and v4 render the three-quarter frame first as the scene anchor. It
shows the widest environment and full wardrobe. The close dating-app opener and
the other two frames are then edited inside that established view.

Prompt system v4 also reserves a scene-derived moment arc. Activity, reason and
dating signal determine facial energy and gaze; the fourth frame is a character
beat rather than an automatic laughing photo.

## Safe rollout

1. On a fresh database, deploy migrations 033, 034 and 035. On an existing database,
   deploy only the unapplied later migrations. Keep pipeline mode `off` during deployment.
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
