import type { AppLocale } from "@/i18n/config"
import type { PlatformFaq, PlatformLandingContent, PlatformGuideContent, PlatformSection } from "./types"

export type LocalizedPlatformApp = "Tinder" | "Hinge" | "Bumble"

export type LocalizedLandingFields = Omit<
  PlatformLandingContent,
  "app" | "copy" | "path" | "reviewed" | "sources" | "guidePath" | "guideLabel"
>

export type LocalizedGuideFields = Omit<
  PlatformGuideContent,
  "app" | "copy" | "path" | "reviewed" | "sources" | "productPath" | "productLabel"
>

export type PlatformVariant = {
  focus: string
  requirement: string
  firstPhoto: string
  specialFeature: string
  trustNote: string
}

export type PlatformLocalePack = {
  locale: Exclude<AppLocale, "en">
  reviewed: string
  sourceLabels: Record<LocalizedPlatformApp, string[]>
  variants: Record<LocalizedPlatformApp, PlatformVariant>
  landing: (app: LocalizedPlatformApp, variant: PlatformVariant) => LocalizedLandingFields
  guide: (app: LocalizedPlatformApp, variant: PlatformVariant) => LocalizedGuideFields
  guideLabel: (app: LocalizedPlatformApp) => string
  productLabel: (app: LocalizedPlatformApp) => string
}

export type { PlatformFaq, PlatformSection }
