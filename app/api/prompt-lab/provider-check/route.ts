import { NextResponse } from "next/server";

import { isAdminEmail } from "@/lib/auth/admin-access";
import {
  classifyCreativeProviderError,
  generatePortfolioCandidate,
} from "@/lib/dating/creative-director";
import { apiRateLimit, checkRateLimit } from "@/utils/rate-limit";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** One explicit production-planner call. No embedding, Fal, order or credit. */
export async function POST() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdminEmail(user.email)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const rate = await checkRateLimit(`prompt-lab-provider-check:${user.id}`, apiRateLimit);
  if (!rate.success) {
    return NextResponse.json({ error: "Please wait before checking the provider again." }, { status: 429 });
  }

  try {
    const generation = await generatePortfolioCandidate({
      input: { interests: ["coffee"], exclusions: [] },
      targetCount: 1,
      candidateCount: 1,
      interestsStillNeeded: ["coffee"],
      currentOrder: [],
      customerHistory: [],
      globalHistory: [],
    });
    return NextResponse.json({
      passed: generation.validation.passed,
      interactionId: generation.interactionId,
      usage: generation.usage,
      estimatedCostUsd: generation.estimatedCostUsd,
      problems: generation.validation.problems,
      candidateTitle: generation.output?.shoots[0]?.title ?? null,
    });
  } catch (error) {
    const failure = classifyCreativeProviderError(error);
    console.error("production planner provider check failed", failure.diagnostic);
    return NextResponse.json(
      { error: failure.safeMessage, status: failure.status, retryable: failure.retryable },
      { status: failure.status && failure.status >= 400 && failure.status < 600 ? failure.status : 502 }
    );
  }
}
