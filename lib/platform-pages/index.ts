import { tinderGuide, tinderLanding } from "./tinder"
import { hingeGuide, hingeLanding } from "./hinge"
import { bumbleGuide, bumbleLanding } from "./bumble"
import { frPlatformPages } from "./fr"
import { esPlatformPages } from "./es"
import { dePlatformPages } from "./de"
import { ptBRPlatformPages } from "./pt-BR"
import type { PublishedPublicLocale } from "@/i18n/config"
import type { PlatformGuideContent, PlatformLandingContent } from "./types"

export const platformLandings: Record<string, PlatformLandingContent> = {
  [tinderLanding.path]: tinderLanding,
  [hingeLanding.path]: hingeLanding,
  [bumbleLanding.path]: bumbleLanding,
}

export const platformGuides: Record<string, PlatformGuideContent> = {
  [tinderGuide.path]: tinderGuide,
  [hingeGuide.path]: hingeGuide,
  [bumbleGuide.path]: bumbleGuide,
}

export const localizedPlatformPages: Record<
  Exclude<PublishedPublicLocale, "en">,
  { landings: Record<string, PlatformLandingContent>; guides: Record<string, PlatformGuideContent> }
> = {
  fr: frPlatformPages,
  es: esPlatformPages,
  de: dePlatformPages,
  "pt-BR": ptBRPlatformPages,
}

export function getPlatformLanding(path: string, locale: PublishedPublicLocale) {
  return locale === "en" ? platformLandings[path] : localizedPlatformPages[locale].landings[path]
}

export function getPlatformGuide(path: string, locale: PublishedPublicLocale) {
  return locale === "en" ? platformGuides[path] : localizedPlatformPages[locale].guides[path]
}

export type { PlatformGuideContent, PlatformLandingContent } from "./types"
