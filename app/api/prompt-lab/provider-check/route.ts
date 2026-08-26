import { NextResponse } from "next/server";

import { isAdminEmail } from "@/lib/auth/admin-access";
import {
  classifyCreativeProviderError,
  generatePortfolioCandidate,
  generateShootCandidate,
  selectCraftReferences,
} from "@/lib/dating/creative-director";
import { apiRateLimit, checkRateLimit } from "@/utils/rate-limit";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** One explicit v3 planner + v7 writer preview. No embedding, Fal, order or credit. */
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
    const brief = generation.output?.shoots[0];
    if (!generation.validation.passed || !brief) {
      return NextResponse.json({
        passed: false,
        interactionId: generation.interactionId,
        usage: generation.usage,
        estimatedCostUsd: generation.estimatedCostUsd,
        problems: generation.validation.problems,
        candidateTitle: brief?.title ?? null,
        brief: brief ?? null,
        references: [],
        captureOutput: null,
        compiledOutput: null,
        warnings: generation.validation.warnings,
      });
    }
    const capture = await generateShootCandidate({
      brief,
      input: { interests: ["coffee"], exclusions: [] },
    });
    const references = selectCraftReferences(brief);
    return NextResponse.json({
      passed: generation.validation.passed && capture.validation.passed,
      interactionId: capture.interactionId ?? generation.interactionId,
      usage: {
        inputTokens: generation.usage.inputTokens + capture.usage.inputTokens,
        outputTokens: generation.usage.outputTokens + capture.usage.outputTokens,
        reasoningTokens: generation.usage.reasoningTokens + capture.usage.reasoningTokens,
        totalTokens: generation.usage.totalTokens + capture.usage.totalTokens,
      },
      estimatedCostUsd: generation.estimatedCostUsd + capture.estimatedCostUsd,
      problems: [...generation.validation.problems, ...capture.validation.problems],
      warnings: [...generation.validation.warnings, ...capture.validation.warnings],
      candidateTitle: brief.title,
      brief,
      references: references.map((reference) => ({
        id: `${reference.shootId}:${reference.framing}`,
        prompt: reference.prompt,
      })),
      captureOutput: capture.rawOutput,
      compiledOutput: capture.output,
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
