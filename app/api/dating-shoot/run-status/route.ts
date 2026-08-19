import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { DATING_BUCKETS } from "@/lib/dating/types";

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
    .select("id, bucket, slot, status, image_url, image_width, image_height")
    .eq("order_id", orderId)
    .order("bucket")
    .order("slot");

  const all = photos || [];
  const counts = {
    pending: all.filter((p) => p.status === "pending").length,
    in_progress: all.filter((p) => p.status === "in_progress").length,
    completed: all.filter((p) => p.status === "completed").length,
    failed: all.filter((p) => p.status === "failed").length,
    total: all.length,
  };

  const byBucket = Object.fromEntries(
    DATING_BUCKETS.map((bucket) => {
      const bucketPhotos = all.filter((p) => p.bucket === bucket);
      return [
        bucket,
        {
          completed: bucketPhotos.filter((p) => p.status === "completed").length,
          total: bucketPhotos.length,
          // Every photo is returned, not just finished ones.
          //
          // This used to filter to `completed && image_url`, which meant a photo
          // being reshot disappeared from the grid and reappeared a minute later
          // — indistinguishable from a photo that never existed. The client needs
          // the in-flight rows to hold their place and show progress.
          photos: bucketPhotos.map((p) => ({
            id: p.id,
            slot: p.slot,
            imageUrl: p.status === "completed" ? p.image_url : null,
            status: toGenerationStatus(p.status),
            // the client groups the delivery by lineup role, and a 9:16 frame
            // is what identifies the full-length shots
            imageWidth: p.image_width,
            imageHeight: p.image_height,
          })),
        },
      ];
    })
  );

  return NextResponse.json({
    order,
    counts,
    byBucket,
    progressPercent:
      counts.total > 0
        ? Math.round((counts.completed / counts.total) * 100)
        : 0,
  });
}
