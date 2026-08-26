import {
  AbortTaskRunError,
  idempotencyKeys,
  logger,
  task,
  wait,
} from "@trigger.dev/sdk";
import { fal } from "@fal-ai/client";
import { putR2Object } from "@/lib/r2";
import {
  resolveDatingAspectRatio,
  resolveDatingImageDimensions,
} from "@/lib/dating/aspect-ratio";
import { getServiceDb } from "@/lib/dating/db";
import {
  makeDeterministicPhotoId,
  makePhotoStorageKey,
} from "@/lib/dating/deterministic-id";
import {
  getDatingTestMode,
  getMockPlaceholderImageUrl,
  shouldUseMock,
} from "@/lib/dating/test-mode";
import { sendDatingShootReadyNotification } from "@/lib/dating/notifications";
import {
  FRAMES_PER_SHOOT,
  MIN_COMPLETE_SHOOTS,
} from "@/lib/dating/types";
import { SHOOT_BY_ID } from "@/lib/dating/shoots";
import {
  loadProductionShoots,
  type ProductionShootRow,
} from "@/lib/dating/production-prompts/store";
import { releaseDatingOrderCredit } from "@/lib/dating/credits-gate";
import {
  DynamicPromptPipelineFailure,
  prepareDynamicOrder,
  type DynamicPipelineOrder,
} from "@/trigger/dating-prompt-orchestration";

function configureFal() {
  const key = process.env.FAL_KEY;
  if (!key) throw new Error("Missing FAL_KEY");
  fal.config({ credentials: key });
}

// ═══════════════════════════════════════════════════════════
// TASK 1 — CHILD WORKER (single image run)
// One run per frame. Dispatched in two waves by the parent.
// ═══════════════════════════════════════════════════════════

export type GenerateSingleImagePayload = {
  userId: string;
  batchId: string; // = orderId
  modelId: number;
  /** Which authored shoot this frame belongs to. */
  shootId: string;
  /** 1-based position within the shoot, 1..FRAMES_PER_SHOOT. */
  frameIndex: number;
  /**
   * Set by the orchestrator in sample mode. Sample mode renders whole shoots,
   * so this is decided per shoot rather than per frame.
   */
  useMock?: boolean;
  prompt: string;
  referenceImageUrls: string[];
  /**
   * The output of this shoot's anchor frame, passed as an extra reference.
   *
   * This is what carries the location, the wardrobe and the light direction
   * across a shoot. Testing showed it holds across roughly seven generations
   * where a written description of the same scene drifted every time. Absent on
   * the anchor itself, and on any mocked frame — a placeholder SVG is garbage as
   * a scene reference.
   */
  anchorImageUrl?: string | null;
  /** Authored output size. */
  imageWidth?: number | null;
  imageHeight?: number | null;
  shootTitle?: string | null;
  shootKind?: "portrait" | "home" | "outdoors" | "social" | "activity" | null;
  /**
   * Makes the R2 object path unique for this run. The key is otherwise derived
   * from (shootId, frameIndex), so a regenerated photo overwrote the original
   * object and every cache in front of it kept serving the old image. Omitted
   * for the initial delivery, where a stable path is what makes retries
   * idempotent.
   */
  variantKey?: string;
};

export type GenerateSingleImageResult = {
  deterministicId: string;
  status: "completed" | "skipped";
  imageUrl?: string;
  /** So the parent can confirm anchoring actually reached fal. */
  anchored?: boolean;
};

/**
 * Isolated execution unit for one frame.
 * - Deterministic ID: {batchId}_{shootId}_{frameIndex}
 * - Retries: 3 attempts, exponential backoff 2s → 15s
 * - Idempotent upsert: never duplicates on retry/crash
 * - Supports DATING_TEST_MODE='mock' and 'sample'
 */
export const generateSingleDatingImage = task({
  id: "generate-single-dating-image",
  retry: {
    maxAttempts: 3,
    factor: 2,
    minTimeoutInMs: 2_000,
    maxTimeoutInMs: 15_000,
    randomize: true,
  },
  // Horizontal fan-out, but cap concurrent fal calls globally
  queue: {
    concurrencyLimit: 12,
  },
  maxDuration: 300,
  run: async (
    payload: GenerateSingleImagePayload
  ): Promise<GenerateSingleImageResult> => {
    const db = getServiceDb();

    const {
      userId,
      batchId,
      modelId,
      shootId,
      frameIndex,
      prompt,
      referenceImageUrls,
      anchorImageUrl,
      imageWidth,
      imageHeight,
    } = payload;

    if (frameIndex < 1 || frameIndex > FRAMES_PER_SHOOT) {
      throw new Error(
        `Invalid frameIndex ${frameIndex}; expected 1..${FRAMES_PER_SHOOT}`
      );
    }

    const deterministicId = makeDeterministicPhotoId(
      batchId,
      shootId,
      frameIndex
    );

    const testMode = getDatingTestMode();
    const useMock = payload.useMock ?? shouldUseMock(testMode);

    // Fast path: already successfully completed → zero GPU cost
    const { data: existing } = await db
      .from("order_photos")
      .select("id, status, image_url, attempt_count")
      .eq("deterministic_id", deterministicId)
      .maybeSingle();

    // A regeneration carries a variantKey and is always paid for, so it must
    // reach the GPU even if the row still looks finished — otherwise a failed
    // row reset upstream turns into "you paid and got the same photo".
    const isRegeneration = Boolean(payload.variantKey);

    if (
      !isRegeneration &&
      existing &&
      (existing.status === "completed" ||
        existing.status === "pending_verification") &&
      existing.image_url
    ) {
      logger.info("Already completed — skip GPU", { deterministicId });
      return {
        deterministicId,
        status: "skipped",
        imageUrl: existing.image_url,
      };
    }

    // The row identity a child writes. shoot_id and frame_index are set at order
    // time and never change; repeating them here keeps the upsert able to
    // recreate a row that was deleted underneath it.
    const identity = {
      deterministic_id: deterministicId,
      order_id: batchId,
      shoot_id: shootId,
      frame_index: frameIndex,
      prompt_template: prompt,
    };

    const now = new Date().toISOString();
    const nextAttempt = (existing?.attempt_count ?? 0) + 1;
    await db.from("order_photos").upsert(
      {
        ...identity,
        status: "in_progress",
        attempt_count: nextAttempt,
        updated_at: now,
      },
      { onConflict: "deterministic_id" }
    );

    // ── FAST PATH: TEST MODE (MOCK PLACEHOLDER) ───────────
    if (useMock) {
      logger.info("Generating mock test photo (zero GPU cost)", {
        testMode,
        shootId,
        frameIndex,
        deterministicId,
      });

      // Brief simulated delay (150-350ms) to allow realistic UI progress rendering
      await new Promise((r) => setTimeout(r, 150 + Math.random() * 200));

      const aspectRatio = resolveDatingAspectRatio(prompt);
      const mockImageUrl = getMockPlaceholderImageUrl(
        shootId,
        frameIndex,
        aspectRatio,
        { title: payload.shootTitle, kind: payload.shootKind }
      );

      const { error: upsertErr } = await db.from("order_photos").upsert(
        {
          ...identity,
          status: "completed",
          image_url: mockImageUrl,
          fal_request_id: `mock_${deterministicId}`,
          aesthetic_score: null,
          failed_reason: null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "deterministic_id" }
      );

      if (upsertErr) {
        throw new Error(`Mock upsert failed: ${upsertErr.message}`);
      }

      return {
        deterministicId,
        status: "completed",
        imageUrl: mockImageUrl,
        anchored: false,
      };
    }

    // ── PRODUCTION PATH: REAL FAL AI GPU GENERATION ───────
    configureFal();

    try {
      if (!referenceImageUrls?.length) {
        throw new Error("No reference image URLs");
      }

      // The anchor goes last. Its job is the scene, and the selfies before it
      // are what hold the face — an order the model reads as "this person, in
      // that place" rather than the reverse.
      const anchored =
        Boolean(anchorImageUrl) && !anchorImageUrl!.startsWith("data:");
      const imageUrls = anchored
        ? [...referenceImageUrls, anchorImageUrl as string]
        : referenceImageUrls;

      const imageSize = resolveDatingImageDimensions(prompt, {
        width: imageWidth,
        height: imageHeight,
      });

      const result = await fal.subscribe(
        "fal-ai/bytedance/seedream/v4.5/edit",
        {
          input: {
            prompt,
            image_urls: imageUrls,
            image_size: imageSize,
            num_images: 1,
            enable_safety_checker: true,
          },
          logs: false,
        }
      );

      const requestId =
        (result as any)?.requestId || (result as any)?.request_id || null;

      const falImageUrl =
        (result as any)?.data?.images?.[0]?.url ||
        (result as any)?.images?.[0]?.url;

      if (!falImageUrl) {
        throw new Error("No image URL in fal response");
      }

      const imageResponse = await fetch(falImageUrl);
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch fal image: ${imageResponse.status}`);
      }

      const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
      const key = makePhotoStorageKey(
        userId,
        batchId,
        shootId,
        frameIndex,
        payload.variantKey
      );
      await putR2Object(key, imageBuffer, "image/png");

      const r2BaseUrl = process.env.R2_PUBLIC_URL || "";
      const publicUri = `${r2BaseUrl}/${key}`;

      // Idempotent upsert: insert or overwrite — never duplicate
      const { error: upsertErr } = await db.from("order_photos").upsert(
        {
          ...identity,
          status: "completed",
          image_url: publicUri,
          fal_request_id: requestId,
          aesthetic_score: null,
          failed_reason: null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "deterministic_id" }
      );

      if (upsertErr) {
        throw new Error(`Upsert failed: ${upsertErr.message}`);
      }

      // Gallery copy (best-effort; not source of truth)
      try {
        await db.from("images").insert({ uri: publicUri, modelId });
      } catch (e) {
        logger.warn("images insert skipped", { e: String(e) });
      }

      logger.info("Image completed", { deterministicId, anchored });
      return {
        deterministicId,
        status: "completed",
        imageUrl: publicUri,
        anchored,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      logger.error("Image generation failed", { deterministicId, message });

      await db.from("order_photos").upsert(
        {
          ...identity,
          status: "failed",
          failed_reason: message,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "deterministic_id" }
      );

      // Throw so Trigger.dev retry engine fires
      throw err;
    }
  },
});

// ═══════════════════════════════════════════════════════════
// TASK 2 — PARENT ORCHESTRATOR
// Two waves: anchors, then the frames that reference them.
// ═══════════════════════════════════════════════════════════

export type PhotoshootOrchestratorPayload = {
  userId: string;
  batchId: string; // orderId
  modelId: number;
  referenceImageUrls: string[];
};

type PhotoRow = {
  id: string;
  shoot_id: string;
  frame_index: number;
  is_anchor: boolean;
  prompt_template: string;
  image_width: number | null;
  image_height: number | null;
  status: string;
  image_url: string | null;
  deterministic_id: string | null;
  attempt_count: number | null;
  render_mode: "real" | "mock";
};

const PROVIDER_RETRY_DELAYS_MINUTES = [1, 5, 15] as const;

/**
 * Central state controller for one delivery.
 *
 * Resume moat:
 * - On start (or parent retry after crash), audit Supabase for completed
 *   deterministic IDs and ONLY batch-trigger incomplete children.
 * - batchTriggerAndWait checkpoints the parent while children run
 *   horizontally — parent crash mid-wait recovers by re-auditing the database.
 *
 * Two waves, because a shoot's frames reference their own anchor's output. The
 * parent releases its concurrency slot at each wait, so waiting twice does not
 * consume two of the three parent slots.
 */
export const datingPhotoshootOrchestrator = task({
  id: "dating-photoshoot-orchestrator",
  retry: {
    // Provider backoff is checkpointed below. Task retries are only for
    // infrastructure/persistence crashes that never reached that boundary.
    maxAttempts: 3,
    factor: 2,
    minTimeoutInMs: 5_000,
    maxTimeoutInMs: 60_000,
    randomize: true,
  },
  queue: {
    // Max concurrent full shoots
    concurrencyLimit: 3,
  },
  maxDuration: 3600,
  run: async (payload: PhotoshootOrchestratorPayload) => {
    const db = getServiceDb();
    const { userId, batchId, modelId, referenceImageUrls } = payload;

    const { data: pipelineOrder, error: pipelineOrderError } = await (db as any)
      .from("user_shoot_orders")
      .select("id, status, pipeline_mode, pipeline_stage, shoots_target, creative_input, credit_state, prompt_system_version, test_mode_snapshot, real_shoots_target")
      .eq("id", batchId)
      .single();
    if (pipelineOrderError || !pipelineOrder) {
      throw new Error(`Order ${batchId} is unavailable: ${pipelineOrderError?.message}`);
    }
    if (pipelineOrder.status === "failed" || pipelineOrder.credit_state === "released") {
      throw new AbortTaskRunError(`Order ${batchId} is terminal and cannot continue.`);
    }

    if (!referenceImageUrls?.length) {
      if (pipelineOrder.pipeline_mode === "dynamic") {
        await releaseDatingOrderCredit({
          orderId: batchId,
          failureCode: "missing_references",
          failurePhase: "identity_references",
          failureMessage: "The identity references are unavailable. The reserved pack was returned.",
        });
        throw new AbortTaskRunError("No usable identity references.");
      }
      await markOrder(db, batchId, "failed");
      throw new AbortTaskRunError("No reference images");
    }

    if (pipelineOrder.pipeline_mode === "dynamic") {
      let promptsReady = false;
      for (let providerAttempt = 0; providerAttempt <= PROVIDER_RETRY_DELAYS_MINUTES.length; providerAttempt += 1) {
        try {
          promptsReady = await prepareDynamicOrder({
            db,
            order: pipelineOrder as DynamicPipelineOrder,
            userId,
          });
          await (db as any).from("user_shoot_orders").update({
            provider_blocked: false,
            provider_retry_count: 0,
            next_retry_at: null,
            updated_at: new Date().toISOString(),
          }).eq("id", batchId);
          break;
        } catch (error) {
          if (!(error instanceof DynamicPromptPipelineFailure)) throw error;
          const exhausted = providerAttempt >= PROVIDER_RETRY_DELAYS_MINUTES.length;
          if (!error.retryable || exhausted) {
            const failureCode = error.kind === "internal"
              ? error.failureCode ?? "internal_prompt_pipeline"
              : error.retryable
                ? "provider_retry_exhausted"
                : error.failureCode ?? "provider_request_rejected";
            await releaseDatingOrderCredit({
              orderId: batchId,
              failureCode,
              failurePhase: error.phase,
              failureMessage: `${error.safeMessage} The reserved pack was returned.`,
            });
            logger.error("Dating prompt pipeline stopped", {
              orderId: batchId,
              phase: error.phase,
              kind: error.kind,
              failureCode,
              retryable: error.retryable,
              exhausted,
            });
            throw new AbortTaskRunError(error.safeMessage);
          }

          const minutes = PROVIDER_RETRY_DELAYS_MINUTES[providerAttempt];
          const nextRetryAt = new Date(Date.now() + minutes * 60_000).toISOString();
          await (db as any).from("user_shoot_orders").update({
            pipeline_stage: "attention_required",
            provider_blocked: false,
            provider_retry_count: providerAttempt + 1,
            next_retry_at: nextRetryAt,
            updated_at: new Date().toISOString(),
          }).eq("id", batchId);
          await wait.for({
            minutes,
            idempotencyKey: `dating-provider-wait:${batchId}:${providerAttempt + 1}`,
            idempotencyKeyTTL: "30d",
          });
        }
      }
      if (!promptsReady) throw new Error(`Prompt preparation did not complete for ${batchId}.`);
    }

    let photoRows = await loadPhotoRows(db, batchId);
    const dynamicShootMetadata = pipelineOrder.pipeline_mode === "dynamic"
      ? new Map((await loadProductionShoots(db as any, batchId)).map((shoot) => [shoot.id, shoot]))
      : new Map();
    if (pipelineOrder.pipeline_mode === "dynamic") {
      await completeLocalMockPhotos(db, photoRows, dynamicShootMetadata);
      photoRows = await loadPhotoRows(db, batchId);
    }
    await markOrder(db, batchId, "developing");

    // ── RESUME AUDIT ──────────────────────────────────────
    const incomplete = photoRows.filter((row) => !isDelivered(row));
    const alreadyDone = photoRows.length - incomplete.length;

    logger.info("Orchestrator audit", {
      batchId,
      total: photoRows.length,
      alreadyDone,
      toRun: incomplete.length,
    });

    if (incomplete.length === 0) {
      return finalizeBatch(
        db,
        userId,
        batchId,
        photoRows,
        pipelineOrder.pipeline_mode
      );
    }

    // Ensure deterministic_id is set on incomplete rows
    for (const row of incomplete) {
      if (row.deterministic_id) continue;
      await db
        .from("order_photos")
        .update({
          deterministic_id: makeDeterministicPhotoId(
            batchId,
            row.shoot_id,
            row.frame_index
          ),
          updated_at: new Date().toISOString(),
        })
        .eq("id", row.id);
    }

    const isMocked = (row: PhotoRow) => row.render_mode === "mock";

    const toPayload = (
      row: PhotoRow,
      anchorImageUrl?: string | null
    ): GenerateSingleImagePayload => ({
      userId,
      batchId,
      modelId,
      shootId: row.shoot_id,
      frameIndex: row.frame_index,
      prompt: row.prompt_template,
      referenceImageUrls,
      anchorImageUrl: anchorImageUrl ?? null,
      imageWidth: row.image_width,
      imageHeight: row.image_height,
      shootTitle: dynamicShootMetadata.get(row.shoot_id)?.title ?? null,
      shootKind: SHOOT_BY_ID.get(row.shoot_id)?.kind ?? null,
      useMock: isMocked(row),
    });

    const keyFor = (row: PhotoRow) =>
      row.deterministic_id ??
      makeDeterministicPhotoId(batchId, row.shoot_id, row.frame_index);

    // ── WAVE 1: WRITER-SELECTED SCENE ANCHORS ─────────────
    const anchorsToRun = incomplete.filter((row) => row.is_anchor);

    if (anchorsToRun.length > 0) {
      if (pipelineOrder.pipeline_mode === "dynamic") {
        await (db as any).from("user_shoot_orders").update({
          pipeline_stage: "rendering_anchors",
          updated_at: new Date().toISOString(),
        }).eq("id", batchId);
      }
      logger.info("wave 1 — anchors", { batchId, count: anchorsToRun.length });

      const anchorItems = await Promise.all(
        anchorsToRun.map(async (row) => ({
          payload: toPayload(row),
          options: {
            idempotencyKey: await idempotencyKeys.create(
              `dating-image:${keyFor(row)}:anchor:attempt:${row.attempt_count ?? 0}`,
              { scope: "global" }
            ),
            idempotencyKeyTTL: "30d" as const,
          },
        }))
      );
      await generateSingleDatingImage.batchTriggerAndWait(anchorItems);
    }

    // ── ANCHOR STATE, RE-READ FROM THE DATABASE ───────────
    // Not from batchResult.runs[].output: that is lost if the parent crashes
    // between waves, and this orchestrator's whole resume design rests on
    // auditing Supabase rather than trusting in-memory state.
    const afterWaveOne = await loadPhotoRows(db, batchId);
    const anchorByShoot = new Map<string, PhotoRow>();
    for (const row of afterWaveOne) {
      if (row.is_anchor) anchorByShoot.set(row.shoot_id, row);
    }

    // ── WAVE 2: THE FRAMES THAT REFERENCE THEM ────────────
    const followers = afterWaveOne.filter(
      (row) => !row.is_anchor && !isDelivered(row)
    );

    const dispatchable: { row: PhotoRow; anchor: PhotoRow | null }[] = [];
    const orphaned: PhotoRow[] = [];

    for (const row of followers) {
      const anchor = anchorByShoot.get(row.shoot_id) ?? null;

      // A mocked frame never anchors — feeding a placeholder SVG to fal as a
      // scene reference is garbage in — so it does not wait on one either.
      if (isMocked(row)) {
        dispatchable.push({ row, anchor: null });
        continue;
      }

      if (!anchor || !isDelivered(anchor)) {
        // Deliberately NOT dispatched un-anchored. The child's fast path treats
        // a completed row as final, so a frame written once without its anchor
        // is frozen that way and no later run will upgrade it. Leaving it
        // undelivered is recoverable; delivering it wrong is not.
        orphaned.push(row);
        continue;
      }

      dispatchable.push({ row, anchor });
    }

    if (orphaned.length > 0) {
      logger.warn("Anchor missing — followers held back", {
        batchId,
        count: orphaned.length,
        shoots: [...new Set(orphaned.map((row) => row.shoot_id))],
      });
    }

    if (dispatchable.length > 0) {
      if (pipelineOrder.pipeline_mode === "dynamic") {
        await (db as any).from("user_shoot_orders").update({
          pipeline_stage: "rendering_photos",
          updated_at: new Date().toISOString(),
        }).eq("id", batchId);
      }
      // Record which frame each follower was anchored on, before dispatch.
      // Stored rather than recomputed so a reshoot reuses the same anchor, and
      // so reshooting an anchor cannot silently invalidate its siblings.
      await Promise.all(
        dispatchable
          .filter((item) => item.anchor)
          .map((item) =>
            db
              .from("order_photos")
              .update({
                anchor_photo_id: item.anchor!.id,
                updated_at: new Date().toISOString(),
              })
              .eq("id", item.row.id)
          )
      );

      logger.info("wave 2 — followers", {
        batchId,
        count: dispatchable.length,
        anchored: dispatchable.filter((item) => item.anchor).length,
      });

      const followerItems = await Promise.all(
        dispatchable.map(async ({ row, anchor }) => ({
          payload: toPayload(row, anchor?.image_url ?? null),
          options: {
            idempotencyKey: await idempotencyKeys.create(
              `dating-image:${keyFor(row)}:follower:attempt:${row.attempt_count ?? 0}`,
              { scope: "global" }
            ),
            idempotencyKeyTTL: "30d" as const,
          },
        }))
      );
      await generateSingleDatingImage.batchTriggerAndWait(followerItems);
    }

    // A held-back follower is marked failed rather than left pending, so the
    // delivery screen stops waiting on it. resumeDatingShootOrder resets failed
    // rows to pending, so a retry re-anchors them properly.
    if (orphaned.length > 0) {
      await db
        .from("order_photos")
        .update({
          status: "failed",
          failed_reason: "Anchor frame for this shoot did not complete",
          updated_at: new Date().toISOString(),
        })
        .in(
          "id",
          orphaned.map((row) => row.id)
        );
    }

    const finalRows = await loadPhotoRows(db, batchId);
    return finalizeBatch(
      db,
      userId,
      batchId,
      finalRows,
      pipelineOrder.pipeline_mode
    );
  },
});

/** A row a user can actually see. Written once here, read everywhere. */
function isDelivered(row: PhotoRow): boolean {
  return (
    (row.status === "completed" || row.status === "pending_verification") &&
    !!row.image_url
  );
}

async function completeLocalMockPhotos(
  db: ReturnType<typeof getServiceDb>,
  rows: PhotoRow[],
  metadata: Map<string, ProductionShootRow>
) {
  const mocks = rows.filter((row) => row.render_mode === "mock" && !isDelivered(row));
  if (mocks.length === 0) return;
  await Promise.all(mocks.map(async (row) => {
    const ratio = resolveDatingAspectRatio(row.prompt_template);
    const shoot = metadata.get(row.shoot_id);
    const imageUrl = getMockPlaceholderImageUrl(row.shoot_id, row.frame_index, ratio, {
      title: shoot?.title ?? shoot?.brief.title ?? null,
      kind: null,
    });
    const { error } = await db.from("order_photos").update({
      status: "completed",
      image_url: imageUrl,
      fal_request_id: `mock_${row.deterministic_id ?? row.id}`,
      aesthetic_score: null,
      failed_reason: null,
      updated_at: new Date().toISOString(),
    }).eq("id", row.id).eq("render_mode", "mock");
    if (error) throw new Error(`Local mock completion failed: ${error.message}`);
  }));
  logger.info("Local sample previews completed without child tasks", {
    count: mocks.length,
    shoots: new Set(mocks.map((row) => row.shoot_id)).size,
  });
}

async function loadPhotoRows(
  db: ReturnType<typeof getServiceDb>,
  batchId: string
): Promise<PhotoRow[]> {
  const { data, error } = await db
    .from("order_photos")
    .select(
      "id, shoot_id, frame_index, is_anchor, prompt_template, image_width, image_height, status, image_url, deterministic_id, attempt_count"
        + ", render_mode"
    )
    .eq("order_id", batchId)
    .order("shoot_id", { ascending: true })
    .order("frame_index", { ascending: true });

  if (error || !data?.length) {
    throw new Error(
      `No order_photos for batch ${batchId}: ${error?.message || "empty"}`
    );
  }

  return data as unknown as PhotoRow[];
}

async function markOrder(
  db: ReturnType<typeof getServiceDb>,
  batchId: string,
  status: string
) {
  await db
    .from("user_shoot_orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", batchId);
}

/**
 * Whether the delivery is good enough to hand over, counted in whole shoots.
 *
 * The old threshold was a flat photo count of 85, which at 60 photos is
 * unreachable — completed < 85 was true of every possible delivery, so one
 * failure anywhere sent the order to failed_components_present. Whole shoots is
 * also the more honest measure: 55 photos as 11 broken shoots is a worse
 * delivery than 50 photos as 12 complete ones.
 */
function countWholeShoots(rows: PhotoRow[]): number {
  const byShoot = new Map<string, number>();
  for (const row of rows) {
    if (!isDelivered(row)) continue;
    byShoot.set(row.shoot_id, (byShoot.get(row.shoot_id) ?? 0) + 1);
  }
  let whole = 0;
  for (const count of byShoot.values()) {
    if (count >= FRAMES_PER_SHOOT) whole += 1;
  }
  return whole;
}

async function finalizeBatch(
  db: ReturnType<typeof getServiceDb>,
  userId: string,
  batchId: string,
  rows: PhotoRow[],
  pipelineMode: "authored" | "dynamic" = "authored"
) {
  const completed = rows.filter(isDelivered).length;
  const undelivered = rows.length - completed;
  const wholeShoots = countWholeShoots(rows);

  logger.info("Batch resolved", {
    batchId,
    completed,
    undelivered,
    wholeShoots,
  });

  if (pipelineMode === "dynamic" && undelivered > 0) {
    await releaseDatingOrderCredit({
      orderId: batchId,
      failureCode: "image_delivery_incomplete",
      failurePhase: "fal_rendering",
      failureMessage: "The complete shoot could not be delivered. The reserved pack was returned.",
    });
    throw new AbortTaskRunError(
      `Dynamic batch ${batchId} is incomplete (${completed}/${rows.length}).`
    );
  }

  // Defect routing
  if (undelivered > 0 && wholeShoots < MIN_COMPLETE_SHOOTS) {
    await db
      .from("user_shoot_orders")
      .update({
        status: "failed_components_present",
        updated_at: new Date().toISOString(),
      })
      .eq("id", batchId);

    logger.error("failed_components_present", {
      batchId,
      completed,
      undelivered,
      wholeShoots,
    });
    // Surface to the Trigger.dev dashboard; the parent retries from the audit,
    // which re-dispatches only what is still missing.
    throw new Error(
      `Batch ${batchId}: only ${wholeShoots} whole shoots completed ` +
        `(${completed}/${rows.length} frames); need ${MIN_COMPLETE_SHOOTS}`
    );
  }

  if (undelivered > 0) {
    // Enough shoots delivered; mark partial but usable
    await db
      .from("user_shoot_orders")
      .update({
        status: "partial_failed",
        ready_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", batchId);

    logger.warn("partial_failed but above threshold", {
      batchId,
      completed,
      undelivered,
      wholeShoots,
    });

    try {
      await sendDatingShootReadyNotification(userId, batchId);
    } catch (e) {
      logger.warn("Ready notification failed", { error: String(e) });
    }

    return {
      batchId,
      status: "partial_failed" as const,
      completed,
      failed: undelivered,
      wholeShoots,
    };
  }

  // All children OK
  if (pipelineMode === "dynamic") {
    await (db as any).rpc("capture_dating_order_credit", { p_order_id: batchId });
  } else {
    await db
      .from("user_shoot_orders")
      .update({
        status: "ready",
        ready_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", batchId);
  }

  logger.info("Batch complete — ready for delivery", { batchId, completed });

  try {
    await sendDatingShootReadyNotification(userId, batchId);
  } catch (e) {
    logger.warn("Ready notification failed", { error: String(e) });
  }

  return {
    batchId,
    status: "ready" as const,
    completed,
    failed: 0,
    wholeShoots,
  };
}

// ── Back-compat aliases (API imports) ─────────────────────
/** @deprecated use datingPhotoshootOrchestrator */
export const datingShootPipeline = datingPhotoshootOrchestrator;
/** @deprecated use generateSingleDatingImage */
export const generateOneDatingPhoto = generateSingleDatingImage;
