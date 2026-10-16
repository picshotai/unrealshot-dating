import "server-only";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { isAdminUser } from "@/lib/auth/admin-access";

export type AdminActor = { id: string; email: string };

/**
 * Pages: unauthenticated → /login, non-admin → 404 (the route stays invisible).
 * Called by the layout AND every page, because Next renders them in parallel,
 * so a layout-only check would not stop a page from loading its data.
 */
export async function requireAdminPage(): Promise<AdminActor> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (!isAdminUser(user)) notFound();
  return { id: user.id, email: user.email! };
}

/** Server actions: every action re-checks, since actions are public POST endpoints. */
export async function requireAdminAction(): Promise<AdminActor> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAdminUser(user)) {
    throw new Error("Not authorized");
  }
  return { id: user!.id, email: user!.email! };
}
