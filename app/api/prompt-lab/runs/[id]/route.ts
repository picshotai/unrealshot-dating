import { NextResponse } from "next/server";

import type { Json } from "@/types/supabase";
import { isAdminEmail } from "@/lib/auth/admin-access";
import { mapPromptLabRow } from "@/lib/dating/prompt-lab/supabase-repository";
import { promptLabFeedbackSchema } from "@/lib/dating/prompt-lab/schemas";
import { createClient } from "@/utils/supabase/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
  const parsed = promptLabFeedbackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid review.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const { id } = await params;
  const { data, error } = await supabase.from("prompt_lab_runs").update({
    feedback: parsed.data as unknown as Json,
    updated_at: new Date().toISOString(),
  }).eq("id", id).eq("user_id", user.id).select("*").maybeSingle();

  if (error) {
    console.error("prompt-lab feedback save failed", error);
    return NextResponse.json({ error: "Unable to save the review." }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: "Prompt run not found." }, { status: 404 });
  return NextResponse.json({ run: mapPromptLabRow(data as Record<string, unknown>) });
}
