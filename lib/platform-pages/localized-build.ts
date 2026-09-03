import { publishedPublicLocales, type PublishedPublicLocale } from "@/i18n/config"
import { bumbleGuide, bumbleLanding } from "./bumble"
import { getPlatformPageCopy } from "./copy"
import { hingeGuide, hingeLanding } from "./hinge"
import { tinderGuide, tinderLanding } from "./tinder"
import type { PlatformGuideContent, PlatformLandingContent } from "./types"
import type { LocalizedPlatformApp, PlatformLocalePack } from "./localized-types"

const baseLandings: Record<LocalizedPlatformApp, PlatformLandingContent> = {
  Tinder: tinderLanding,
  Hinge: hingeLanding,
  Bumble: bumbleLanding,
}

const baseGuides: Record<LocalizedPlatformApp, PlatformGuideContent> = {
  Tinder: tinderGuide,
  Hinge: hingeGuide,
  Bumble: bumbleGuide,
}

const sourceHrefs: Record<LocalizedPlatformApp, string[]> = {
  Tinder: tinderLanding.sources.map((source) => source.href),
  Hinge: hingeLanding.sources.map((source) => source.href),
  Bumble: bumbleLanding.sources.map((source) => source.href),
}

function localizedSources(pack: PlatformLocalePack, app: LocalizedPlatformApp) {
  return sourceHrefs[app].map((href, index) => ({
    href,
    label: pack.sourceLabels[app][index] ?? pack.sourceLabels[app][0],
  }))
}

export function buildLocalizedPlatformPages(pack: PlatformLocalePack) {
  const landings = {} as Record<string, PlatformLandingContent>
  const guides = {} as Record<string, PlatformGuideContent>

  for (const app of Object.keys(baseLandings) as LocalizedPlatformApp[]) {
    const baseLanding = baseLandings[app]
    const baseGuide = baseGuides[app]
    const variant = pack.variants[app]
    const path = baseLanding.path

    landings[path] = {
      app,
      copy: getPlatformPageCopy(pack.locale, app),
      path,
      reviewed: pack.reviewed,
      sources: localizedSources(pack, app),
      guidePath: baseLanding.guidePath,
      guideLabel: pack.guideLabel(app),
      ...pack.landing(app, variant),
    }

    guides[baseGuide.path] = {
      app,
      copy: getPlatformPageCopy(pack.locale, app),
      path: baseGuide.path,
      reviewed: pack.reviewed,
      sources: localizedSources(pack, app),
      productPath: baseGuide.productPath,
      productLabel: pack.productLabel(app),
      ...pack.guide(app, variant),
    }
  }

  return { landings, guides }
}

export type LocalizedPlatformPages = ReturnType<typeof buildLocalizedPlatformPages>

export function emptyLocalizedPlatformPages(): Record<
  Exclude<PublishedPublicLocale, "en">,
  LocalizedPlatformPages
> {
  return {} as Record<Exclude<PublishedPublicLocale, "en">, LocalizedPlatformPages>
}

export { publishedPublicLocales }
