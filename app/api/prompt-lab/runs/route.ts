import { NextResponse } from "next/server";

import { isAdminEmail } from "@/lib/auth/admin-access";
import { mapPromptLabRow } from "@/lib/dating/prompt-lab/supabase-repository";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdminEmail(user.email)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const url = new URL(request.url);
  const limit = Math.min(30, Math.max(1, Number(url.searchParams.get("limit")) || 15));
  const before = url.searchParams.get("before");
  if (before && Number.isNaN(Date.parse(before))) {
    return NextResponse.json({ error: "Invalid history cursor." }, { status: 400 });
  }

  let query = supabase.from("prompt_lab_runs").select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit + 1);
  if (before) query = query.lt("created_at", before);

  const { data, error } = await query;
  if (error) {
    console.error("prompt-lab history lookup failed", error);
    return NextResponse.json({ error: "Unable to load prompt history." }, { status: 500 });
  }

  const rows = data ?? [];
  const hasMore = rows.length > limit;
  const visible = rows.slice(0, limit).map((row) => mapPromptLabRow(row as Record<string, unknown>));
  return NextResponse.json({
    runs: visible,
    nextCursor: hasMore ? visible.at(-1)?.createdAt ?? null : null,
  });
}
