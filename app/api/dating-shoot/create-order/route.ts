import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createDatingShootOrder } from "@/lib/dating/create-order";
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
    const { modelId, vibe, style, hobbyText } = body;

    if (!modelId || typeof modelId !== "number") {
      return NextResponse.json({ error: "modelId is required" }, { status: 400 });
    }
    if (!VIBES.includes(vibe)) {
      return NextResponse.json(
        { error: "vibe must be urban | outdoorsy | homebody" },
        { status: 400 }
      );
    }
    if (!STYLES.includes(style)) {
      return NextResponse.json(
        { error: "style must be casual | sharp | street" },
        { status: 400 }
      );
    }

    const result = await createDatingShootOrder({
      userId: user.id,
      modelId,
      vibe,
      style,
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
