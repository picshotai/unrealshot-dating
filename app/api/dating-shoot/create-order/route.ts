import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import {
  createDatingShootOrder,
  DatingOrderError,
} from "@/lib/dating/create-order";
import {
  conflictingExclusion,
  isInterestId,
  type InterestId,
} from "@/lib/dating/interests";
import {
  EXCLUDABLE_TAGS,
  type ExcludableTag,
} from "@/lib/dating/types";
import { getDatingProductConfig } from "@/lib/dating/config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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
    const { modelId, interests, excludeTags, clientRequestId } = body;

    if (!Number.isInteger(modelId) || modelId <= 0) {
      return NextResponse.json({ error: "modelId is required" }, { status: 400 });
    }
    if (
      typeof clientRequestId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(clientRequestId)
    ) {
      return NextResponse.json({ error: "clientRequestId must be a UUID" }, { status: 400 });
    }

    // Interests are literal delivery promises. Wardrobe is deliberately absent:
    // the director resolves it independently from each real-life occasion.
    if (!Array.isArray(interests) || interests.some((value) => !isInterestId(value))) {
      return NextResponse.json({ error: "interests contains an unsupported value" }, { status: 400 });
    }
    const cleanInterests: InterestId[] = [...new Set(interests as InterestId[])];
    const interestLimit = Math.min(6, getDatingProductConfig().shootsPerDelivery);
    if (cleanInterests.length < 1 || cleanInterests.length > interestLimit) {
      return NextResponse.json(
        { error: `Choose between 1 and ${interestLimit} interests` },
        { status: 400 }
      );
    }

    if (excludeTags !== undefined && (
      !Array.isArray(excludeTags) ||
      excludeTags.some((tag: unknown) => !(EXCLUDABLE_TAGS as readonly unknown[]).includes(tag))
    )) {
      return NextResponse.json({ error: "excludeTags contains an unsupported value" }, { status: 400 });
    }
    const cleanExclusions: ExcludableTag[] = [
      ...new Set((excludeTags ?? []) as ExcludableTag[]),
    ];

    const conflict = cleanExclusions.find((tag) =>
      conflictingExclusion(cleanInterests, tag)
    );
    if (conflict) {
      return NextResponse.json(
        { error: `Your selected activities conflict with the ${conflict} exclusion.` },
        { status: 400 }
      );
    }

    const result = await createDatingShootOrder({
      userId: user.id,
      clientRequestId,
      modelId,
      interests: cleanInterests,
      excludeTags: cleanExclusions,
    });

    return NextResponse.json({ success: true, ...result }, { status: 201 });
  } catch (error) {
    // A refusal is not a fault. Insufficient credits and an already-running
    // shoot are expected answers the client renders directly, so they get their
    // own status codes rather than a 500 the user cannot act on.
    if (error instanceof DatingOrderError) {
      const status =
        error.code === "invalid_input"
          ? 400
          : error.code === "insufficient_credits"
          ? 402
          : error.code === "references_need_reupload"
            ? 422
            : 409;
      return NextResponse.json(
        { error: error.message, code: error.code, ...error.detail },
        { status }
      );
    }

    console.error("create-order failed:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create order",
      },
      { status: 500 }
    );
  }
}
