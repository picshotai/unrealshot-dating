// lib/actions/clearModelsAction.ts
"use server"; // Mark this file as server-only

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { clearStageCookie } from '@/lib/auth/stage-server';

export async function clearAllModels(_formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) {
    console.error("[clearAllModels] auth error:", authError);
  }
  if (!user?.id) {
    console.error("clearAllModels: No authenticated user found");
    throw new Error("Not authenticated");
  }

  // Pre-check count of models for this user
  const { count: preCount, error: preCountError } = await supabase
    .from("models")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (preCountError) {
    console.error("[clearAllModels] pre-count error:", preCountError);
  }
  console.log("[clearAllModels] models to delete (pre-count):", preCount ?? null);

  const { data: deletedRows, error: deleteError } = await supabase
    .from("models")
    .delete()
    .eq("user_id", user.id)
    .select("id");

  if (deleteError) {
    console.error("Error deleting models:", deleteError);
    throw new Error("Failed to delete models");
  }

  const deletedCount = deletedRows?.length ?? 0;

  // The edge gate caches where this user belongs. Their models just went away,
  // so drop the hint rather than leave them routed into a studio they can no
  // longer use — the next request re-resolves it from the database.
  await clearStageCookie();

  // Graceful no-op when there are no models
  if (deletedCount === 0) {
    console.warn("[clearAllModels] No models were deleted for user:", user.id, "; This likely means no matching rows found.");
    // Revalidate relevant pages to ensure UI reflects current state
    revalidatePath('/dashboard');
    revalidatePath('/trained-models');
    return; // Do not throw; treat as successful no-op
  }

  // Ensure the models page reflects the latest DB state
  revalidatePath('/dashboard');
  revalidatePath('/trained-models');
}