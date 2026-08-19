import { logger, task } from "@trigger.dev/sdk";
import { fal } from "@fal-ai/client";
import { putR2Object } from "@/lib/r2";
import {
  resolveDatingAspectRatio,
  resolveDatingImageDimensions,
} from "@/lib/dating/aspect-ratio";
import { getServiceDb } from "@/lib/dating/db";
import {
  makeDeterministicPhotoId,
  slotToIndex,
} from "@/lib/dating/deterministic-id";
import {
  getDatingTestMode,
  getMockPlaceholderImageUrl,
  shouldUseMockForSlot,
} from "@/lib/dating/test-mode";
import { sendDatingShootReadyNotification } from "@/lib/dating/notifications";
import {
  DATING_BUCKETS,
  MIN_COMPLETE_THRESHOLD,
  SLOTS_PER_BUCKET,
  type DatingBucket,
} from "@/lib/dating/types";

function configureFal() {
  const key = process.env.FAL_KEY;
  if (!key) throw new Error("Missing FAL_KEY");
  fal.config({ credentials: key });
}

// ═══════════════════════════════════════════════════════════
// TASK 1 — CHILD WORKER (single image run)
// Invoked up to 100 times as parallel runs of THIS definition.
// ═══════════════════════════════════════════════════════════

export type GenerateSingleImagePayload = {
  userId: string;
  batchId: string; // = orderId
  modelId: number;
  bucket: DatingBucket;
  index: number; // 0-based slot index, 0..SLOTS_PER_BUCKET-1
  /**
   * Set by the orchestrator in sample mode. Sample mode used to key off "slot
   * 1", which stopped being reliable once a delivery drew 20 of 26 slots and
   * slot 1 could simply not be selected.
   */
  useMock?: boolean;
  prompt: string;
  referenceImageUrls: string[];
  /** Authored output size. Omitted on legacy rows; resolved from the prompt. */
  imageWidth?: number | null;
  imageHeight?: number | null;
  /**
   * Makes the R2 object path unique for this run. The key is otherwise derived
   * from (bucket, index), so a regenerated photo overwrote the original object
   * and every cache in front of it kept serving the old image. Omitted for the
   * initial delivery, where a stable path is what makes retries idempotent.
   */
  variantKey?: string;
};

export type GenerateSingleImageResult = {
  deterministicId: string;
  status: "completed" | "skipped";
  imageUrl?: string;
  aestheticScore?: number;
};

/**
 * Isolated execution unit for one dating photo.
 * - Deterministic ID: {batchId}_{bucket}_{index}
 * - Retries: 3 attempts, exponential backoff 2s → 15s
 * - Idempotent upsert: never duplicates on retry/crash
 * - Supports DATING_TEST_MODE='mock' ($0.00) and 'sample' ($0.20 for 5 real photos)
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
      bucket,
      index,
      prompt,
      referenceImageUrls,
      imageWidth,
      imageHeight,
    } = payload;

    // Bounds follow the library, not the delivery size. A delivery is 20 photos
    // per bucket but it draws them from 26 slots, so indexes run to 25 and this
    // check rejected roughly a quarter of every order while it read
    // PHOTOS_PER_BUCKET.
    if (index < 0 || index >= SLOTS_PER_BUCKET) {
      throw new Error(`Invalid index ${index}; expected 0..${SLOTS_PER_BUCKET - 1}`);
    }

    const deterministicId = makeDeterministicPhotoId(batchId, bucket, index);
    const slot = index + 1;

    // Check test mode (mock / sample / off)
    const testMode = getDatingTestMode();
    const useMock = payload.useMock ?? shouldUseMockForSlot(testMode, slot);

    // Fast path: already successfully completed → zero GPU cost
    const { data: existing } = await db
      .from("order_photos")
      .select("id, status, image_url, aesthetic_score")
      .eq("deterministic_id", deterministicId)
      .maybeSingle();

    // A regeneration carries a variantKey and is always paid for, so it must
    // reach the GPU even if the row still looks finished — otherwise a failed
    // row reset upstream turns into "you paid and got the same photo".
    const isRegeneration = Boolean(payload.variantKey);

    if (
      !isRegeneration &&
      existing &&
      (existing.status === "completed" || existing.status === "pending_verification") &&
      existing.image_url
    ) {
      logger.info("Already completed — skip GPU", { deterministicId });
      return {
        deterministicId,
        status: "skipped",
        imageUrl: existing.image_url,
        aestheticScore: existing.aesthetic_score ?? undefined,
      };
    }

    // Mark in_progress (upsert by deterministic_id)
    const now = new Date().toISOString();
    const nextAttempt = ((existing as { attempt_count?: number } | null)?.attempt_count ?? 0) + 1;
    await db.from("order_photos").upsert(
      {
        deterministic_id: deterministicId,
        order_id: batchId,
        bucket,
        slot,
        prompt_template: prompt,
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
        bucket,
        slot,
        deterministicId,
      });

      // Brief simulated delay (150-350ms) to allow realistic UI progress rendering
      await new Promise((r) => setTimeout(r, 150 + Math.random() * 200));

      const aspectRatio = resolveDatingAspectRatio(prompt);
      const mockImageUrl = getMockPlaceholderImageUrl(bucket, slot, aspectRatio);
      // No quality score is written. It used to be a random number, which is
      // noise presented as a signal — anything ranking on it ranked randomly.
      const aestheticScore = undefined;

      const { error: upsertErr } = await db.from("order_photos").upsert(
        {
          deterministic_id: deterministicId,
          order_id: batchId,
          bucket,
          slot,
          prompt_template: prompt,
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
        aestheticScore,
      };
    }

    // ── PRODUCTION PATH: REAL FAL AI GPU GENERATION ───────
    configureFal();

    try {
      if (!referenceImageUrls?.length) {
        throw new Error("No reference image URLs");
      }

      const imageSize = resolveDatingImageDimensions(prompt, {
        width: imageWidth,
        height: imageHeight,
      });
      const result = await fal.subscribe(
        "fal-ai/bytedance/seedream/v4.5/edit",
        {
          input: {
            prompt,
            image_urls: referenceImageUrls,
            image_size: imageSize,
            num_images: 1,
            enable_safety_checker: true,
          },
          logs: false,
        }
      );

      const requestId =
        (result as any)?.requestId ||
        (result as any)?.request_id ||
        null;

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
      // Deterministic R2 key so retries overwrite the same object path. A
      // regeneration passes variantKey to break that determinism on purpose —
      // without it the new photo lands on the old path and the CDN keeps
      // serving the image the user just paid to replace.
      const variantSuffix = payload.variantKey ? `_${payload.variantKey}` : "";
      const key = `dating/${userId}/${batchId}/${bucket}_${index}${variantSuffix}.png`;
      await putR2Object(key, imageBuffer, "image/png");

      const r2BaseUrl = process.env.R2_PUBLIC_URL || "";
      const publicUri = `${r2BaseUrl}/${key}`;

      // No quality score is written. It used to be a random number, which is
      // noise presented as a signal — anything ranking on it ranked randomly.
      const aestheticScore = undefined;

      // Idempotent upsert: insert or overwrite — never duplicate
      const { error: upsertErr } = await db.from("order_photos").upsert(
        {
          deterministic_id: deterministicId,
          order_id: batchId,
          bucket,
          slot,
          prompt_template: prompt,
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

      logger.info("Image completed", { deterministicId, aestheticScore });
      return {
        deterministicId,
        status: "completed",
        imageUrl: publicUri,
        aestheticScore,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      logger.error("Image generation failed", { deterministicId, message });

      await db.from("order_photos").upsert(
        {
          deterministic_id: deterministicId,
          order_id: batchId,
          bucket,
          slot,
          prompt_template: prompt,
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
// Builds 100 child payloads, batchTriggerAndWait, resume-safe.
// ═══════════════════════════════════════════════════════════

export type PhotoshootOrchestratorPayload = {
  userId: string;
  batchId: string; // orderId
  modelId: number;
  referenceImageUrls: string[];
};

/**
 * Central state controller for a 100-photo dating shoot.
 *
 * Resume moat:
 * - On start (or parent retry after crash), audit Supabase for completed
 *   deterministic IDs and ONLY batch-trigger incomplete children.
 * - batchTriggerAndWait checkpoints the parent while children run
 *   horizontally — parent crash mid-wait recovers by re-auditing DB.
 */
export const datingPhotoshootOrchestrator = task({
  id: "dating-photoshoot-orchestrator",
  retry: {
    maxAttempts: 5,
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

    if (!referenceImageUrls?.length) {
      await markOrder(db, batchId, "failed");
      throw new Error("No reference images");
    }

    // Load pre-allocated photo rows (created at order time with prompts filled)
    const { data: photoRows, error: photosErr } = await db
      .from("order_photos")
      .select(
        "id, bucket, slot, prompt_template, image_width, image_height, status, image_url, deterministic_id"
      )
      .eq("order_id", batchId)
      .order("bucket", { ascending: true })
      .order("slot", { ascending: true });

    if (photosErr || !photoRows?.length) {
      throw new Error(
        `No order_photos for batch ${batchId}: ${photosErr?.message || "empty"}`
      );
    }

    await markOrder(db, batchId, "developing");

    // ── RESUME AUDIT ──────────────────────────────────────
    // Skip children already completed (or pending_verification with URL)
    const incomplete = photoRows.filter((row) => {
      const done =
        (row.status === "completed" || row.status === "pending_verification") &&
        !!row.image_url;
      return !done;
    });

    const alreadyDone = photoRows.length - incomplete.length;
    logger.info("Orchestrator audit", {
      batchId,
      total: photoRows.length,
      alreadyDone,
      toRun: incomplete.length,
    });

    // If everything already done (parent retried after full success)
    if (incomplete.length === 0) {
      return finalizeBatch(db, userId, batchId, photoRows.length, 0);
    }

    // Ensure deterministic_id is set on incomplete rows
    for (const row of incomplete) {
      const index = slotToIndex(row.slot);
      const detId =
        row.deterministic_id ||
        makeDeterministicPhotoId(batchId, row.bucket, index);
      if (!row.deterministic_id) {
        await db
          .from("order_photos")
          .update({ deterministic_id: detId, updated_at: new Date().toISOString() })
          .eq("id", row.id);
      }
    }

    // Sample mode renders one real photo per bucket. It used to be "slot 1",
    // which broke silently once a delivery drew 20 of 26 slots and slot 1 might
    // not be among them — a sample run could produce no real photos at all.
    // The orchestrator can see the whole order, so it picks the first row of
    // each bucket that this delivery actually contains.
    const orchestratorTestMode = getDatingTestMode();
    const realIds = new Set<string>();
    if (orchestratorTestMode === "sample") {
      for (const bucket of DATING_BUCKETS) {
        const first = incomplete
          .filter((row) => row.bucket === bucket)
          .sort((a, b) => a.slot - b.slot)[0];
        if (first) realIds.add(String(first.id));
      }
    }

    // Build child payloads — only incomplete
    const childPayloads = incomplete.map((row) => {
      const index = slotToIndex(row.slot);
      const detId = makeDeterministicPhotoId(batchId, row.bucket, index);
      return {
        payload: {
          userId,
          batchId,
          modelId,
          bucket: row.bucket as DatingBucket,
          index,
          prompt: row.prompt_template,
          referenceImageUrls,
          imageWidth: row.image_width,
          imageHeight: row.image_height,
          useMock:
            orchestratorTestMode === "mock"
              ? true
              : orchestratorTestMode === "sample"
                ? !realIds.has(String(row.id))
                : false,
        } satisfies GenerateSingleImagePayload,
        options: {
          // Same key → Trigger.dev will not spawn a second successful run
          idempotencyKey: detId,
        },
      };
    });

    // ── BATCH FAN-OUT ─────────────────────────────────────
    // Parent checkpoints here; children run across the grid.
    // On parent eviction, retry re-enters from audit above.
    logger.info("batchTriggerAndWait", {
      batchId,
      count: childPayloads.length,
      buckets: DATING_BUCKETS,
    });

    const batchResult = await generateSingleDatingImage.batchTriggerAndWait(
      childPayloads
    );

    // Inspect child outcomes
    const runs = batchResult.runs ?? [];
    let successCount = 0;
    let failCount = 0;

    for (const run of runs) {
      if (run.ok) {
        successCount += 1;
      } else {
        failCount += 1;
        logger.warn("Child run failed after retries", {
          id: (run as any).id,
          error: (run as any).error,
        });
      }
    }

    // Re-count from DB (source of truth — not just this batch's return)
    const { count: completedCount } = await db
      .from("order_photos")
      .select("*", { count: "exact", head: true })
      .eq("order_id", batchId)
      .in("status", ["completed", "pending_verification"]);

    const completed = completedCount ?? alreadyDone + successCount;
    const { count: failedCount } = await db
      .from("order_photos")
      .select("*", { count: "exact", head: true })
      .eq("order_id", batchId)
      .eq("status", "failed");

    const failed = failedCount ?? failCount;

    logger.info("Batch resolved", {
      batchId,
      completed,
      failed,
      childSuccess: successCount,
      childFail: failCount,
    });

    return finalizeBatch(db, userId, batchId, completed, failed);
  },
});

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

async function finalizeBatch(
  db: ReturnType<typeof getServiceDb>,
  userId: string,
  batchId: string,
  completed: number,
  failed: number
) {
  // Defect routing
  if (failed > 0 && completed < MIN_COMPLETE_THRESHOLD) {
    await db
      .from("user_shoot_orders")
      .update({
        status: "failed_components_present",
        updated_at: new Date().toISOString(),
      })
      .eq("id", batchId);

    logger.error("failed_components_present", { batchId, completed, failed });
    // Surface to Trigger.dev dashboard; parent can be retried after fixing failed rows
    throw new Error(
      `Batch ${batchId}: ${failed} components failed, only ${completed} completed`
    );
  }

  if (failed > 0) {
    // Enough photos delivered; mark partial but usable
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
      failed,
    });

    // Send ready notification asynchronously
    try {
      await sendDatingShootReadyNotification(userId, batchId);
    } catch (e) {
      logger.warn("Ready notification failed", { error: String(e) });
    }

    return {
      batchId,
      status: "partial_failed" as const,
      completed,
      failed,
    };
  }

  // All children OK
  await db
    .from("user_shoot_orders")
    .update({
      status: "ready",
      ready_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", batchId);

  logger.info("Batch complete — ready for delivery", { batchId, completed });

  // Send ready notification asynchronously
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
  };
}

// ── Back-compat aliases (API imports) ─────────────────────
/** @deprecated use datingPhotoshootOrchestrator */
export const datingShootPipeline = datingPhotoshootOrchestrator;
/** @deprecated use generateSingleDatingImage */
export const generateOneDatingPhoto = generateSingleDatingImage;
