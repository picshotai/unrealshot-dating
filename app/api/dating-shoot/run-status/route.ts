import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { DATING_BUCKETS } from "@/lib/dating/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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
    .select("id, bucket, slot, status, image_url")
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
          photos: bucketPhotos
            .filter((p) => p.status === "completed" && p.image_url)
            .map((p) => ({
              id: p.id,
              slot: p.slot,
              imageUrl: p.image_url,
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
