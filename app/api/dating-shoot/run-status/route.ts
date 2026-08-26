import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { SHOOT_BY_ID } from "@/lib/dating/shoots";
import { lineupRoleFor, LINEUP_HINTS, LINEUP_LABELS } from "@/lib/dating/roles";
import { releaseDatingOrderCredit } from "@/lib/dating/credits-gate";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const RETRY_WAKE_GRACE_MS = 5 * 60 * 1000;

type DatingOrderStatusRow = {
  id: string;
  status: string;
  model_id: number;
  custom_credits_remaining: number;
  photos_target: number;
  shoots_target: number;
  pipeline_mode: string;
  pipeline_stage: string;
  provider_blocked: boolean;
  credit_state: string;
  credit_amount: number;
  failure_code: string | null;
  failure_phase: string | null;
  failure_message: string | null;
  failed_at: string | null;
  next_retry_at: string | null;
  trigger_run_id: string | null;
  created_at: string;
  ready_at: string | null;
  planner_version: string | null;
  prompt_system_version: string | null;
  test_mode_snapshot: "off" | "sample" | "mock";
  real_shoots_target: number;
};

function isMissingPipelineColumn(error: { code?: string; message?: string } | null) {
  return error?.code === "42703" ||
    error?.code === "PGRST204" ||
    /column .* does not exist|could not find .* column/i.test(error?.message ?? "");
}

/**
 * Maps a row's pipeline status onto the vocabulary the studio's loader speaks.
 * `pending_verification` means the image exists but has not been accepted yet,
 * which reads to a user as final polishing rather than a separate stage.
 */
function toGenerationStatus(status: string | null) {
  switch (status) {
    case "completed":
      return "complete";
    case "in_progress":
      return "generating";
    case "pending_verification":
      return "refining";
    case "failed":
      return "error";
    default:
      return "queued";
  }
}

/** Never expose provider identity, credentials, quota, or our billing state. */
function customerSafeFailureMessage(message: string | null | undefined, creditReturned: boolean) {
  const fallback = creditReturned
    ? "We couldn't start this shoot. Your reserved pack was returned."
    : "We couldn't complete this shoot. Please try again later.";
  if (!message) return fallback;
  if (/gemini|provider|api(?:\s+key)?|billing|prepay|quota|rate.?limit|credit balance|invalid.?argument|configuration/i.test(message)) {
    return fallback;
  }
  return message;
}

function hasExpiredRetryLease(order: {
  status?: string | null;
  pipeline_mode?: string | null;
  pipeline_stage?: string | null;
  credit_state?: string | null;
  next_retry_at?: string | null;
}) {
  if (
    order.status !== "queued" ||
    order.pipeline_mode !== "dynamic" ||
    order.pipeline_stage !== "attention_required" ||
    order.credit_state !== "reserved" ||
    !order.next_retry_at
  ) return false;
  const retryAt = Date.parse(order.next_retry_at);
  return Number.isFinite(retryAt) && Date.now() > retryAt + RETRY_WAKE_GRACE_MS;
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orderId = request.nextUrl.searchParams.get("orderId");
  if (!orderId) {
    return NextResponse.json({ error: "orderId required" }, { status: 400 });
  }

  const primaryOrderResult = await supabase
    .from("user_shoot_orders")
    .select(
      "id, status, model_id, custom_credits_remaining, photos_target, shoots_target, pipeline_mode, pipeline_stage, provider_blocked, credit_state, credit_amount, failure_code, failure_phase, failure_message, failed_at, next_retry_at, trigger_run_id, created_at, ready_at"
        + ", planner_version, prompt_system_version, test_mode_snapshot, real_shoots_target"
    )
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();
  let order = primaryOrderResult.data as unknown as DatingOrderStatusRow | null;
  let orderErr = primaryOrderResult.error;

  // Migration 039 can be deployed independently from the application. Keep
  // authored and already-running orders viewable during that rollout window.
  if (isMissingPipelineColumn(orderErr)) {
    const compatible = await supabase
      .from("user_shoot_orders")
      .select(
        "id, status, model_id, custom_credits_remaining, photos_target, shoots_target, pipeline_mode, pipeline_stage, provider_blocked, trigger_run_id, created_at, ready_at"
      )
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single();
    if (!compatible.error && compatible.data) {
      orderErr = null;
      order = {
        ...compatible.data,
        credit_state: "legacy",
        credit_amount: 0,
        failure_code: null,
        failure_phase: null,
        failure_message: null,
        failed_at: null,
        next_retry_at: null,
        planner_version: null,
        prompt_system_version: null,
        test_mode_snapshot: "off",
        real_shoots_target: compatible.data.shoots_target,
      } as unknown as DatingOrderStatusRow;
    } else {
      // Migration 033 is deliberately deployed before the dynamic rollout flag.
      // Older databases and authored orders must remain viewable.
      const legacy = await supabase
        .from("user_shoot_orders")
        .select(
          "id, status, model_id, custom_credits_remaining, photos_target, trigger_run_id, created_at, ready_at"
        )
        .eq("id", orderId)
        .eq("user_id", user.id)
        .single();
      orderErr = legacy.error;
      order = legacy.data
      ? ({
          ...legacy.data,
          shoots_target: Math.max(
            1,
            Math.ceil(Number(legacy.data.photos_target ?? 0) / 4)
          ),
          pipeline_mode: "authored",
          pipeline_stage:
            legacy.data.status === "ready" ? "ready" : "rendering_photos",
          provider_blocked: false,
          credit_state: "legacy",
          credit_amount: 0,
          failure_code: null,
          failure_phase: null,
          failure_message: null,
          failed_at: null,
          next_retry_at: null,
          planner_version: null,
          prompt_system_version: null,
          test_mode_snapshot: "off",
          real_shoots_target: Math.max(1, Math.ceil(Number(legacy.data.photos_target ?? 0) / 4)),
        } as unknown as DatingOrderStatusRow)
      : null;
    }
  }

  if (orderErr || !order) {
    if (orderErr?.code !== "PGRST116") {
      console.error("dating run status: order lookup failed", {
        orderId,
        code: orderErr?.code,
        message: orderErr?.message,
      });
    }
    return NextResponse.json(
      { error: orderErr?.code === "PGRST116" ? "Order not found" : "Failed to load order" },
      { status: orderErr?.code === "PGRST116" ? 404 : 500 }
    );
  }

  // A retry timestamp is a short lease, not proof that a Trigger run still
  // exists. If the worker never clears it after its wake deadline, fail the
  // orphaned order and release the pack instead of animating forever.
  if (hasExpiredRetryLease(order)) {
    try {
      const released = await releaseDatingOrderCredit({
        orderId,
        failureCode: "orphaned_provider_retry",
        failurePhase: "prompt_generation",
        failureMessage: "We couldn't start this shoot. Your reserved pack was returned.",
      });
      order = {
        ...order,
        status: "failed",
        pipeline_stage: "failed",
        provider_blocked: true,
        credit_state: released.creditState,
        failure_code: "orphaned_provider_retry",
        failure_phase: "prompt_generation",
        failure_message: "We couldn't start this shoot. Your reserved pack was returned.",
        failed_at: new Date().toISOString(),
        next_retry_at: null,
      };
    } catch (releaseError) {
      console.error("dating run status: stale retry cleanup failed", {
        orderId,
        message: releaseError instanceof Error ? releaseError.message : String(releaseError),
      });
    }
  }

  let { data: photos, error: photosError } = await supabase
    .from("order_photos")
    .select(
      "id, order_shoot_id, shoot_id, frame_index, framing, is_anchor, role_label, moment_summary, is_profile_candidate, status, image_url, image_width, image_height"
    )
    .eq("order_id", orderId)
    .order("shoot_id")
    .order("frame_index");

  if (isMissingPipelineColumn(photosError)) {
    const legacyPhotos = await supabase
      .from("order_photos")
      .select(
        "id, shoot_id, frame_index, is_anchor, status, image_url, image_width, image_height"
      )
      .eq("order_id", orderId)
      .order("shoot_id")
      .order("frame_index");
    photosError = legacyPhotos.error;
    photos = (legacyPhotos.data ?? []).map((photo) => ({
      ...photo,
      order_shoot_id: null,
      role_label: null,
      moment_summary: null,
      is_profile_candidate: photo.frame_index === 1,
      framing:
        photo.frame_index === 1 ? "close"
        : photo.frame_index === 2 ? "medium"
        : photo.frame_index === 3 ? "threeQuarter"
        : "expression",
    })) as typeof photos;
  }
  if (photosError) {
    console.error("dating run status: photo lookup failed", {
      orderId,
      code: photosError.code,
      message: photosError.message,
    });
    return NextResponse.json({ error: "Failed to load photos" }, { status: 500 });
  }

  const isTerminalFailure = order.status === "failed" || order.pipeline_stage === "failed";
  // Failed dynamic-order rows are operational diagnostics, not a partial paid
  // delivery. Do not expose them as a gallery after the reservation is released.
  const all = isTerminalFailure && order.pipeline_mode === "dynamic" ? [] : photos || [];
  let dynamicShoots: unknown[] | null = null;
  if (order.pipeline_mode === "dynamic") {
    const shootResult = await supabase
      .from("dating_order_shoots" as any)
      .select("id, slot_index, title, kind, status, render_mode, prompt_source, contract_version")
      .eq("order_id", orderId)
      .neq("status", "abandoned")
      .order("slot_index");

    if (shootResult.error) {
      // New delivery columns can be deployed before their authenticated column
      // grants. Keep completed photos visible using the long-standing public
      // shoot fields instead of silently turning a successful order into an
      // empty gallery.
      console.error("dating run status: extended shoot metadata lookup failed", {
        orderId,
        code: shootResult.error.code,
        message: shootResult.error.message,
      });
      const compatibleShootResult = await supabase
        .from("dating_order_shoots" as any)
        .select("id, slot_index, title, kind, status")
        .eq("order_id", orderId)
        .neq("status", "abandoned")
        .order("slot_index");
      if (compatibleShootResult.error) {
        console.error("dating run status: compatible shoot metadata lookup failed", {
          orderId,
          code: compatibleShootResult.error.code,
          message: compatibleShootResult.error.message,
        });
      } else {
        dynamicShoots = compatibleShootResult.data;
      }
    } else {
      dynamicShoots = shootResult.data;
    }
  }
  const promptRows = (dynamicShoots ?? []) as unknown as Array<{
    id: string;
    slot_index: number;
    title: string | null;
    kind: string;
    status: string;
    render_mode?: "real" | "mock";
    prompt_source?: "gemini" | "local_mock";
    contract_version?: string | null;
  }>;
  const photosTarget = Number(order.photos_target ?? all.length);
  const counts = {
    pending: Math.max(
      0,
      photosTarget - all.filter((p) => p.status !== "pending").length
    ),
    in_progress: all.filter((p) => p.status === "in_progress").length,
    completed: all.filter((p) => p.status === "completed").length,
    failed: all.filter((p) => p.status === "failed").length,
    total: photosTarget,
  };
  const promptCounts = {
    planned: promptRows.length,
    reserved: promptRows.filter((row) => row.render_mode === "real" && row.status === "reserved").length,
    generating: promptRows.filter((row) => row.render_mode === "real" && row.status === "generating").length,
    passed: promptRows.filter((row) => row.render_mode === "real" && row.status === "passed").length,
    replanning: 0,
    mock: promptRows.filter((row) => row.render_mode === "mock").length,
    realTarget: Number(order.real_shoots_target ?? order.shoots_target ?? 0),
    total: Number(order.real_shoots_target ?? order.shoots_target ?? 0),
  };

  // Grouped by shoot, because that is what the delivery *is*: this place, these
  // clothes, this light, four ways. The old response grouped by bucket, which
  // was internal architecture leaking into the client — and the buckets no
  // longer exist.
  const byShoot = new Map<string, typeof all>();
  for (const photo of all) {
    const list = byShoot.get(photo.shoot_id) ?? [];
    list.push(photo);
    byShoot.set(photo.shoot_id, list);
  }

  const dynamicById = new Map(promptRows.map((row) => [row.id, row]));
  const photoShootIds = [...byShoot.keys()];
  const passedShootIds = promptRows
    .filter((row) => row.status === "passed")
    .map((row) => row.id);
  const passedShootIdSet = new Set(passedShootIds);
  const orderedShootIds = isTerminalFailure
    ? []
    : order.pipeline_mode === "dynamic"
    ? [
        ...passedShootIds,
        ...photoShootIds.filter((shootId) => !passedShootIdSet.has(shootId)),
      ]
    : photoShootIds;
  const shoots = orderedShootIds.map((shootId, shootIndex) => {
    const rows = byShoot.get(shootId) ?? [];
    const shoot = SHOOT_BY_ID.get(shootId);
    const dynamicShoot = dynamicById.get(shootId);
    const shootKind = dynamicShoot?.kind ?? shoot?.kind ?? null;
    return {
      shootId,
      // A delivered order keeps its photos even if the shoot later leaves the
      // library, so the id is the fallback rather than an error.
      title: dynamicShoot?.title ?? shoot?.title ?? `Shoot ${shootIndex + 1}`,
      kind: shootKind,
      completed: rows.filter((p) => p.status === "completed").length,
      total: order.pipeline_mode === "dynamic" ? 4 : rows.length,
      // Every photo is returned, not just finished ones.
      //
      // This used to filter to `completed && image_url`, which meant a photo
      // being reshot disappeared from the grid and reappeared a minute later —
      // indistinguishable from a photo that never existed. The client needs the
      // in-flight rows to hold their place and show progress.
      photos: rows.map((p) => {
        const role = order.pipeline_mode === "dynamic"
          ? p.is_profile_candidate ? "opener" : "more"
          : lineupRoleFor({
              shootId,
              frameIndex: p.frame_index,
              framing: p.framing as any,
              kind: shootKind as any,
            });
        return {
          id: p.id,
          frameIndex: p.frame_index,
          isAnchor: p.is_anchor,
          imageUrl: p.status === "completed" ? p.image_url : null,
          status: toGenerationStatus(p.status),
          imageWidth: p.image_width,
          imageHeight: p.image_height,
          role,
          roleLabel: p.role_label || LINEUP_LABELS[role],
          roleHint: p.moment_summary || LINEUP_HINTS[role],
        };
      }),
    };
  });

  const stage = String(order.pipeline_stage ?? "rendering_photos");
  const retryScheduled =
    stage === "attention_required" &&
    order.status !== "failed" &&
    Boolean(order.next_retry_at);
  const completedShoots = shoots.filter((shoot) => shoot.completed >= 4).length;
  const completedSceneAnchors = all.filter(
    (row) => row.is_anchor && row.status === "completed"
  ).length;
  const progressPercent = order.status === "ready"
    ? 100
    : stage === "planning"
      ? 2
      : stage === "writing_prompts" || (stage === "attention_required" && all.length === 0)
        ? 5 + Math.round(20 * promptCounts.passed / Math.max(1, promptCounts.realTarget))
        : stage === "rendering_anchors"
          ? 25 + Math.round(20 * all.filter((row) => row.is_anchor && row.status === "completed").length / Math.max(1, Number(order.shoots_target)))
          : 45 + Math.round(55 * counts.completed / Math.max(1, counts.total));

  return NextResponse.json({
    order,
    counts,
    promptCounts,
    shoots,
    progressPercent: order.status === "ready" ? 100 : Math.min(99, progressPercent),
    stage,
    creditState: order.credit_state ?? "legacy",
    retryScheduled,
    retryAvailable:
      isTerminalFailure &&
      order.prompt_system_version === "dating-shoot-writer-v7" &&
      (order.credit_state === "released" || order.credit_state === "legacy"),
    failure: isTerminalFailure
      ? {
          code: order.failure_code ?? "shoot_failed",
          phase: order.failure_phase ?? "unknown",
          message: customerSafeFailureMessage(
            order.failure_message,
            order.credit_state === "released"
          ),
        }
      : null,
    stageLabel:
      stage === "failed" && order.credit_state === "released"
        ? "Shoot stopped — your pack was returned"
      : stage === "failed" ? "Shoot stopped"
      : stage === "planning" ? "Planning your shoots"
      : stage === "writing_prompts" ? `Writing shoot prompts — ${promptCounts.passed}/${promptCounts.total}`
      : stage === "rendering_anchors" ? `Establishing your scenes — ${completedSceneAnchors}/${promptCounts.total || order.shoots_target}`
      : stage === "rendering_photos" ? `Completing your shoots — ${completedShoots}/${order.shoots_target}`
      : stage === "attention_required" && order.provider_blocked
        ? "Prompt generation stopped — setup error"
      : retryScheduled ? "Temporary prompt-provider issue — retrying automatically"
      : stage === "attention_required" ? "Last attempt ended — retry required"
      : stage === "ready" ? "Ready"
      : "Preparing your shoot",
  });
}
