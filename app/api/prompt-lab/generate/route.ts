import { NextResponse } from "next/server";

import { isAdminEmail } from "@/lib/auth/admin-access";
import { executePromptLabGeneration, PromptLabServiceError } from "@/lib/dating/prompt-lab/service";
import { promptLabInputSchema } from "@/lib/dating/prompt-lab/schemas";
import { SupabasePromptLabRepository } from "@/lib/dating/prompt-lab/supabase-repository";
import { apiRateLimit, checkRateLimit } from "@/utils/rate-limit";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdminEmail(user.email)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }
  const parsed = promptLabInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid prompt-lab input.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const repository = new SupabasePromptLabRepository(supabase);
    const existing = await repository.findByRequest(user.id, parsed.data.clientRequestId);
    if (existing) return NextResponse.json({ run: existing, reused: true });

    const rate = await checkRateLimit(`prompt-lab:${user.id}`, apiRateLimit);
    if (!rate.success) {
      return NextResponse.json({ error: "Too many prompt requests. Please wait and try again." }, { status: 429 });
    }

    const result = await executePromptLabGeneration({
      userId: user.id,
      input: parsed.data,
      repository,
    });
    return NextResponse.json(result, { status: result.run.status === "running" ? 202 : 200 });
  } catch (error) {
    if (error instanceof PromptLabServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("prompt-lab generation failed before model execution", error);
    return NextResponse.json({ error: "Unable to start the prompt run." }, { status: 500 });
  }
}
