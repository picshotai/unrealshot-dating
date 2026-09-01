import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { GalleryClient } from "./GalleryClient";
import { shootTitle } from "@/lib/dating/shoots";
import { lineupRoleFor, LINEUP_LABELS, LINEUP_HINTS } from "@/lib/dating/roles";

export const metadata: Metadata = {
  title: "My Gallery | Unrealshot AI",
  description: "Browse and download all your AI-generated dating photos.",
};

export default async function GalleryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch all completed orders for this user
  const { data: orders } = await supabase
    .from("user_shoot_orders")
    .select("id, status, model_id, custom_credits_remaining, created_at, ready_at")
    .eq("user_id", user.id)
    .in("status", ["ready", "developing", "partial_failed", "failed_components_present"])
    .order("created_at", { ascending: false });

  if (!orders || orders.length === 0) {
    return <GalleryClient orders={[]} />;
  }

  // Fetch all completed photos across all orders in one query
  const orderIds = orders.map((o) => o.id);
  const { data: photos } = await supabase
    .from("order_photos")
    .select(
      "id, order_id, shoot_id, frame_index, is_anchor, status, image_url, image_width, image_height"
    )
    .in("order_id", orderIds)
    .eq("status", "completed")
    .order("shoot_id")
    .order("frame_index");

  // Shape photo data for the client, grouped by order
  const orderMap = new Map(
    orders.map((o) => [
      o.id,
      {
        orderId: o.id,
        createdAt: o.created_at,
        readyAt: o.ready_at,
        customCreditsRemaining: o.custom_credits_remaining,
        photos: [] as Array<{
          id: string;
          shootId: string;
          shootTitle: string;
          frameIndex: number;
          isAnchor: boolean;
          imageUrl: string | null;
          imageWidth: number | null;
          imageHeight: number | null;
          role: string;
          roleLabel: string;
          roleHint: string;
        }>,
      },
    ])
  );

  for (const photo of photos ?? []) {
    const entry = orderMap.get(photo.order_id);
    if (!entry) continue;

    const role = lineupRoleFor({
      shootId: photo.shoot_id,
      frameIndex: photo.frame_index,
    });

    entry.photos.push({
      id: photo.id,
      shootId: photo.shoot_id,
      shootTitle: shootTitle(photo.shoot_id),
      frameIndex: photo.frame_index,
      isAnchor: photo.is_anchor ?? false,
      imageUrl: photo.image_url,
      imageWidth: photo.image_width,
      imageHeight: photo.image_height,
      role,
      roleLabel: LINEUP_LABELS[role] ?? "Dating Photo",
      roleHint: LINEUP_HINTS[role] ?? "A context-led dating profile photo.",
    });
  }

  const ordersWithPhotos = Array.from(orderMap.values()).filter(
    (o) => o.photos.length > 0
  );

  return <GalleryClient orders={ordersWithPhotos} />;
}
