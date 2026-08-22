import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function safeFilename(value: string | null, photoId: string): string {
  const fallback = `unrealshot-${photoId.slice(0, 8)}.jpg`;
  if (!value) return fallback;

  const sanitized = value
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);

  return sanitized || fallback;
}

/**
 * Streams one delivered photo through our own origin.
 *
 * The old endpoint accepted an arbitrary image URL and the gallery fetched R2
 * directly in the browser. That was both an SSRF risk and dependent on the
 * storage domain's CORS behavior. Looking the photo up by id lets RLS verify
 * ownership before this server fetches the trusted, stored URL.
 */
export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const photoId = url.searchParams.get("photoId");
  if (!photoId) {
    return NextResponse.json({ error: "photoId required" }, { status: 400 });
  }

  // order_photos RLS permits reads only when the parent order belongs to this
  // authenticated user, so another customer's id behaves like a missing photo.
  const { data: photo, error: photoError } = await supabase
    .from("order_photos")
    .select("id, status, image_url")
    .eq("id", photoId)
    .single();

  if (photoError || !photo) {
    return NextResponse.json({ error: "Photo not found" }, { status: 404 });
  }
  if (photo.status !== "completed" || !photo.image_url) {
    return NextResponse.json(
      { error: "Photo is not ready to download" },
      { status: 409 }
    );
  }

  try {
    const upstream = await fetch(photo.image_url, { cache: "no-store" });
    if (!upstream.ok || !upstream.body) {
      console.error("photo download: upstream failed", {
        photoId,
        status: upstream.status,
      });
      return NextResponse.json(
        { error: "Photo storage is temporarily unavailable" },
        { status: 502 }
      );
    }

    const filename = safeFilename(url.searchParams.get("filename"), photoId);
    const headers = new Headers({
      "Content-Type":
        upstream.headers.get("content-type") || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    });
    const contentLength = upstream.headers.get("content-length");
    if (contentLength) headers.set("Content-Length", contentLength);

    return new Response(upstream.body, { status: 200, headers });
  } catch (error) {
    console.error("photo download failed", {
      photoId,
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { error: "Failed to download photo" },
      { status: 502 }
    );
  }
}
