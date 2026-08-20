import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { SHOOT_BY_ID } from "@/lib/dating/shoots";
import { lineupRoleFor, LINEUP_LABELS } from "@/lib/dating/roles";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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

  const { data: order, error: orderErr } = await supabase
    .from("user_shoot_orders")
    .select(
      "id, status, model_id, custom_credits_remaining, photos_target, trigger_run_id, created_at, ready_at"
    )
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (orderErr || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const { data: photos } = await supabase
    .from("order_photos")
    .select(
      "id, shoot_id, frame_index, is_anchor, status, image_url, image_width, image_height"
    )
    .eq("order_id", orderId)
    .order("shoot_id")
    .order("frame_index");

  const all = photos || [];
  const counts = {
    pending: all.filter((p) => p.status === "pending").length,
    in_progress: all.filter((p) => p.status === "in_progress").length,
    completed: all.filter((p) => p.status === "completed").length,
    failed: all.filter((p) => p.status === "failed").length,
    total: all.length,
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

  const shoots = [...byShoot.entries()].map(([shootId, rows]) => {
    const shoot = SHOOT_BY_ID.get(shootId);
    return {
      shootId,
      // A delivered order keeps its photos even if the shoot later leaves the
      // library, so the id is the fallback rather than an error.
      title: shoot?.title ?? shootId,
      kind: shoot?.kind ?? null,
      completed: rows.filter((p) => p.status === "completed").length,
      total: rows.length,
      // Every photo is returned, not just finished ones.
      //
      // This used to filter to `completed && image_url`, which meant a photo
      // being reshot disappeared from the grid and reappeared a minute later —
      // indistinguishable from a photo that never existed. The client needs the
      // in-flight rows to hold their place and show progress.
      photos: rows.map((p) => {
        const role = lineupRoleFor({
          shootId,
          frameIndex: p.frame_index,
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
          roleLabel: LINEUP_LABELS[role],
        };
      }),
    };
  });

  return NextResponse.json({
    order,
    counts,
    shoots,
    progressPercent:
      counts.total > 0
        ? Math.round((counts.completed / counts.total) * 100)
        : 0,
  });
}
