import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { GalleryClient } from "./GalleryClient";

export const metadata: Metadata = {
  title: "My Gallery | Unrealshot AI",
  description: "Browse and download all your AI-generated photos.",
};

export default async function GalleryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 1. Fetch completed photos from dating shoot orders
  const { data: orders } = await supabase
    .from("user_shoot_orders")
    .select("id")
    .eq("user_id", user.id);

  const orderIds = (orders ?? []).map((o) => o.id);

  let shootPhotos: Array<{
    id: string;
    imageUrl: string;
    imageWidth?: number | null;
    imageHeight?: number | null;
    createdAt: string;
  }> = [];

  if (orderIds.length > 0) {
    const { data: photos } = await supabase
      .from("order_photos")
      .select("id, image_url, image_width, image_height, created_at")
      .in("order_id", orderIds)
      .eq("status", "completed")
      .not("image_url", "is", null)
      .order("created_at", { ascending: false });

    shootPhotos = (photos ?? [])
      .filter((p) => Boolean(p.image_url))
      .map((p) => ({
        id: String(p.id),
        imageUrl: p.image_url!,
        imageWidth: p.image_width,
        imageHeight: p.image_height,
        createdAt: p.created_at || new Date().toISOString(),
      }));
  }

  // 2. Fetch images from images table for user's models
  const { data: userModels } = await supabase
    .from("models")
    .select("id")
    .eq("user_id", user.id);

  const modelIds = (userModels ?? []).map((m) => m.id);

  let generalPhotos: Array<{
    id: string;
    imageUrl: string;
    imageWidth?: number | null;
    imageHeight?: number | null;
    createdAt: string;
  }> = [];

  if (modelIds.length > 0) {
    const { data: genImages } = await supabase
      .from("images")
      .select("id, uri, created_at")
      .in("modelId", modelIds)
      .not("uri", "is", null)
      .order("created_at", { ascending: false });

    generalPhotos = (genImages ?? [])
      .filter((img) => Boolean(img.uri))
      .map((img) => ({
        id: String(img.id),
        imageUrl: img.uri,
        createdAt: img.created_at || new Date().toISOString(),
      }));
  }

  // 3. Combine and sort newest first
  const allPhotos = [...shootPhotos, ...generalPhotos].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return <GalleryClient photos={allPhotos} />;
}
