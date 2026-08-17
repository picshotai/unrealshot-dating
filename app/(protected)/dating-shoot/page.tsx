import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { DatingShootClient } from "./DatingShootClient";

export const metadata: Metadata = {
  title: "Dating Photoshoot | Unrealshot AI",
  description: "100 dating photos across 5 high-converting styles",
};

export default async function DatingShootPage({
  searchParams,
}: {
  searchParams: Promise<{ modelId?: string; orderId?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const params = await searchParams;

  const { data: models } = await supabase
    .from("models")
    .select("id, name, status, samples(uri)")
    .eq("user_id", user.id)
    .eq("type", "Male")
    .order("created_at", { ascending: false });

  const { data: orders } = await supabase
    .from("user_shoot_orders")
    .select("id, status, model_id, custom_credits_remaining, created_at, ready_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <DatingShootClient
      userId={user.id}
      models={models || []}
      orders={orders || []}
      initialModelId={params.modelId ? Number(params.modelId) : null}
      initialOrderId={params.orderId || null}
    />
  );
}
