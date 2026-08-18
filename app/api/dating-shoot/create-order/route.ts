import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createDatingShootOrder } from "@/lib/dating/create-order";
import { isInterestId, type InterestId } from "@/lib/dating/interests";
import type { StylePref, Vibe } from "@/lib/dating/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const VIBES: Vibe[] = ["urban", "outdoorsy", "homebody"];
const STYLES: StylePref[] = ["casual", "sharp", "street"];

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { modelId, interests, dress, hobbyText, vibe, style } = body;

    if (!modelId || typeof modelId !== "number") {
      return NextResponse.json({ error: "modelId is required" }, { status: 400 });
    }

    // The screen now sends interests + dress. vibe/style are still accepted so
    // a client mid-session keeps working; both are treated as a lean, and
    // neither locks the delivery any more.
    const cleanInterests: InterestId[] = Array.isArray(interests)
      ? interests.filter(isInterestId)
      : [];

    if (dress !== undefined && !STYLES.includes(dress)) {
      return NextResponse.json(
        { error: "dress must be casual | sharp | street" },
        { status: 400 }
      );
    }
    if (vibe !== undefined && !VIBES.includes(vibe)) {
      return NextResponse.json(
        { error: "vibe must be urban | outdoorsy | homebody" },
        { status: 400 }
      );
    }
    if (style !== undefined && !STYLES.includes(style)) {
      return NextResponse.json(
        { error: "style must be casual | sharp | street" },
        { status: 400 }
      );
    }
    if (dress === undefined && style === undefined) {
      return NextResponse.json(
        { error: "dress is required" },
        { status: 400 }
      );
    }

    const result = await createDatingShootOrder({
      userId: user.id,
      modelId,
      interests: cleanInterests,
      dress: (dress as StylePref | undefined) ?? undefined,
      vibe: (vibe as Vibe | undefined) ?? undefined,
      style: (style as StylePref | undefined) ?? undefined,
      hobbyText: hobbyText || null,
    });

    return NextResponse.json({ success: true, ...result }, { status: 201 });
  } catch (error) {
    console.error("create-order failed:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create order",
      },
      { status: 500 }
    );
  }
}
