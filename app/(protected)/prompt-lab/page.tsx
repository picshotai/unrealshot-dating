import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { isAdminEmail } from "@/lib/auth/admin-access";
import { createClient } from "@/utils/supabase/server";

import { PromptLabClient } from "./PromptLabClient";

export const metadata: Metadata = {
  title: "Prompt Lab | Unrealshot AI",
  description: "Generate and review four-frame dating shoot prompts",
};

export default async function PromptLabPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (!isAdminEmail(user.email)) notFound();
  return <PromptLabClient />;
}
