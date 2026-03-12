import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const since = searchParams.get("since");

  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // SECURITY FIX: First get user's model IDs, then filter images by those IDs
    const { data: userModels, error: modelsError } = await (await supabase)
      .from("models")
      .select("id")
      .eq("user_id", user.id);

    if (modelsError) {
      console.error("Models fetch error:", modelsError);
      return NextResponse.json({ error: "Failed to fetch models" }, { status: 500 });
    }

    // Get array of model IDs that belong to this user
    const userModelIds = userModels?.map(m => m.id) || [];

    // If user has no models, return empty images array
    if (userModelIds.length === 0) {
      return NextResponse.json({ images: [] });
    }

    // Fetch images only for user's models
    let imagesQuery = (await supabase)
      .from("images")
      .select("id, modelId, uri, created_at")
      .in("modelId", userModelIds); // Only get images for user's models

    if (since) {
      imagesQuery = imagesQuery.gt("created_at", since);
    }

    const { data: imagesData, error: imagesError } = await imagesQuery;

    if (imagesError) {
      console.error("Images fetch error:", imagesError);
      return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
    }

    // Map images data
    const imagesImages = (imagesData || []).map((image) => ({
      id: image.id,
      image_url: image.uri,
      promptId: image.id.toString(),
      user_id: user.id,
      created_at: image.created_at,
      source: "images",
    }));

    // Sort by created_at descending
    const sortedImages = imagesImages.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json({ images: sortedImages });
  } catch (error) {
    console.error("Unexpected error in get-user-images:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
