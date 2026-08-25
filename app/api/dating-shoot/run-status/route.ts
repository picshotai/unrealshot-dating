import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { SHOOT_BY_ID } from "@/lib/dating/shoots";
import { lineupRoleFor, LINEUP_HINTS, LINEUP_LABELS } from "@/lib/dating/roles";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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

  let { data: order, error: orderErr } = await supabase
    .from("user_shoot_orders")
    .select(
      "id, status, model_id, custom_credits_remaining, photos_target, shoots_target, pipeline_mode, pipeline_stage, provider_blocked, credit_state, credit_amount, failure_code, failure_phase, failure_message, failed_at, next_retry_at, trigger_run_id, created_at, ready_at"
    )
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

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
      } as typeof order;
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
        } as typeof order)
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
  const { data: dynamicShoots } = order.pipeline_mode === "dynamic"
    ? await supabase
        .from("dating_order_shoots" as any)
        .select("id, slot_index, title, kind, status")
        .eq("order_id", orderId)
        .neq("status", "abandoned")
        .order("slot_index")
    : { data: null };
  const promptRows = (dynamicShoots ?? []) as unknown as Array<{
    id: string;
    slot_index: number;
    title: string | null;
    kind: string;
    status: string;
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
    reserved: promptRows.filter((row) => row.status === "reserved").length,
    generating: promptRows.filter((row) => row.status === "generating").length,
    passed: promptRows.filter((row) => row.status === "passed").length,
    replanning: promptRows.filter((row) => row.status === "replanning").length,
    total: Number(order.shoots_target ?? 0),
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
  const orderedShootIds = isTerminalFailure
    ? []
    : order.pipeline_mode === "dynamic"
    ? promptRows.filter((row) => row.status === "passed").map((row) => row.id)
    : [...byShoot.keys()];
  const shoots = orderedShootIds.map((shootId) => {
    const rows = byShoot.get(shootId) ?? [];
    const shoot = SHOOT_BY_ID.get(shootId);
    const dynamicShoot = dynamicById.get(shootId);
    const shootKind = dynamicShoot?.kind ?? shoot?.kind ?? null;
    return {
      shootId,
      // A delivered order keeps its photos even if the shoot later leaves the
      // library, so the id is the fallback rather than an error.
      title: dynamicShoot?.title ?? shoot?.title ?? `Shoot ${dynamicShoot?.slot_index ?? ""}`.trim(),
      kind: shootKind,
      completed: rows.filter((p) => p.status === "completed").length,
      total: dynamicShoot ? 4 : rows.length,
      // Every photo is returned, not just finished ones.
      //
      // This used to filter to `completed && image_url`, which meant a photo
      // being reshot disappeared from the grid and reappeared a minute later —
      // indistinguishable from a photo that never existed. The client needs the
      // in-flight rows to hold their place and show progress.
      photos: rows.map((p) => {
        const role = dynamicShoot
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
        ? 5 + Math.round(20 * promptCounts.passed / Math.max(1, promptCounts.total))
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
      (order.credit_state === "released" || order.credit_state === "legacy"),
    failure: isTerminalFailure
      ? {
          code: order.failure_code ?? "shoot_failed",
          phase: order.failure_phase ?? "unknown",
          message: order.failure_message ?? "The shoot could not be completed.",
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
