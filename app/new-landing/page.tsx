import type { Metadata } from "next";
import { UnrealLandingPage } from "@/components/new-landing/UnrealLandingPage";

export const metadata: Metadata = {
  title: "UnrealShot Landing Preview",
  robots: { index: false, follow: false },
};

export default function NewLandingPreview() {
  return <UnrealLandingPage />;
}
