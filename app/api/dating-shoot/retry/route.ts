import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { resumeDatingShootOrder } from "@/lib/dating/create-order";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Re-triggers the PARENT orchestrator only.
 * Parent audits completed deterministic IDs and only re-runs incomplete children.
 * No third task definition.
 */
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
    const { orderId } = await request.json();
    if (!orderId) {
      return NextResponse.json({ error: "orderId required" }, { status: 400 });
    }

    const result = await resumeDatingShootOrder(orderId, user.id);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("retry failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Retry failed" },
      { status: 500 }
    );
  }
}
