import type { Metadata } from "next"

function privatePage(title: string, description: string): Metadata {
  return { title, description, robots: { index: false, follow: false } }
}

export const commonPageMetadata = {
  login: () => privatePage("Sign in | UnrealShot", "Sign in to your UnrealShot account."),
  dashboard: () => privatePage("Dashboard | UnrealShot", "Manage your private UnrealShot dating-photo orders."),
  buyCredits: () => privatePage("Start your dating shoots | UnrealShot", "Purchase the one-time UnrealShot dating-photo package."),
}
