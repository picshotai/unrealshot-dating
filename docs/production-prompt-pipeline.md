# Production dating prompt pipeline

Every new order uses the same production path:

1. Gemini directs a portfolio of free-form, real-life shoot intents.
2. The server atomically rejects globally repeated semantic fingerprints and reserves only new intents.
3. Gemini expands each accepted intent into four context-led prompts.
4. Fal renders the writer-selected scene anchor first, then receives that image for the other three frames.

There is no authored/dynamic rollout switch and no finite recipe catalogue for new orders. Historical orders retain their stored prompts so they remain resumable. Existing databases apply the new `037_intelligent_dating_portfolio.sql` migration after previously applied migrations; never edit or rerun an applied migration.

## Configuration

```dotenv
GEMINI_API_KEY=...
DATING_SHOOTS_PER_DELIVERY=15
DATING_TEST_MODE=off
DATING_SAMPLE_SHOOTS=2
DATING_GEMINI_CONCURRENCY=4
DATING_PROMPT_ATTEMPTS_PER_IDEA=3
GEMINI_37_FLASH_INPUT_USD_PER_MILLION=0.75
GEMINI_37_FLASH_OUTPUT_USD_PER_MILLION=3.75
```

`GEMINI_API_KEY` and the existing Fal/R2 credentials must be present in the Trigger.dev environment. The delivery/test configuration belongs in both the web deployment and Trigger.dev so order snapshots, progress and workers agree.

- `mock`: local structured fixtures and image placeholders; no Gemini or Fal calls.
- `sample`: Gemini directs and writes the complete portfolio; Fal renders only the configured number of whole shoots.
- `off`: real Gemini and real Fal behavior.

The shoot count is snapshotted onto an order, so later environment changes cannot shrink an active delivery.

## Creative contract

The portfolio director is governed by one literal provenance test: “This looks like a desirable moment from his real life, captured by someone who naturally belonged there.” It receives the exact customer interest meanings, exclusions, current portfolio, customer history and recent global scene memory. It invents concepts in free-form text and must prove provenance, dating desirability, non-staging, wardrobe logic, continuity and four-frame distinctness for every candidate. Rich intents are planned in bounded batches of no more than eight candidates so structured responses stay inside the model's 8192-token output budget; every later batch sees the intents already accepted for the order. After each creative call, `gemini-embedding-001` converts only the normalized novelty fingerprints into 768-dimensional vectors; PostgreSQL atomically checks both vector meaning and lexical similarity across the complete registry before reserving a scene.

Clothing is not a customer input. The director chooses it separately from each occasion, activity, weather, location and social context. Selected interests are delivery promises: every selected interest must be visibly represented before prompt writing can complete. Exclusions are absolute and conflicting activity/exclusion combinations are rejected by both the UI and API.

The writer receives one locked intent containing the occasion, human reason, photographer relationship, small shooting zone, outfit, light, immutable scene facts and portable props. It chooses four moments, compositions and the single anchor without a pose, expression, lens or framing menu. Only the anchor can render without a scene image; all followers receive its persisted Fal image.

## Local verification

```text
npm run check:production-prompts
npm run check:production-types
npm run check:prompt-lab
npm run check:shoots
npm run check:variety
npm run build
```

Automated checks use fixtures and make no Gemini or Fal request.
