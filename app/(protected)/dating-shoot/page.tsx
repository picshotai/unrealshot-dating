import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { DatingShootClient } from "./DatingShootClient";
import { getDatingProductConfig } from "@/lib/dating/config";
import { isAdminEmail } from "@/lib/auth/admin-access";

export function generateMetadata(): Metadata {
  const config = getDatingProductConfig();
  return {
    title: "Dating Photoshoot | Unrealshot AI",
    description: `${config.photosPerDelivery} dating photos across ${config.shootsPerDelivery} distinct shoot concepts`,
  };
}

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
  const productConfig = getDatingProductConfig();

  // Fetch all trained models for this user
  const { data: models, error: modelsError } = await supabase
    .from("models")
    .select("id, name, status, samples(uri)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Backstop only — proxy.ts is what normally keeps model-less users out.
  //
  // A failed query is NOT evidence that the user has no models. Treating the two
  // the same is what used to strand people with a trained model in onboarding,
  // so an error is logged and the page renders rather than redirecting.
  if (modelsError) {
    console.error("dating-shoot: models lookup failed:", modelsError.message);
  } else if (!models || models.length === 0) {
    redirect("/models/create");
  }

  // Fetch previous shoot orders
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
      deliveryConfig={{
        shoots: productConfig.shootsPerDelivery,
        photos: productConfig.photosPerDelivery,
      }}
      ownerDiagnostics={isAdminEmail(user.email) ? {
        testMode: productConfig.testMode,
        sampleShoots: productConfig.sampleShoots,
      } : null}
    />
  );
}
