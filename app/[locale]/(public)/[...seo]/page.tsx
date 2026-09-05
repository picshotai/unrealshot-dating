import type { Metadata } from "next"
import { notFound } from "next/navigation"
import AuthorityContentPage from "@/components/seo/AuthorityContentPage"
import DatingActivityPage from "@/components/seo/DatingActivityPage"
import DatingPhotoExamplesPage from "@/components/seo/DatingPhotoExamplesPage"
import ShootPage from "@/components/seo/ShootPage"
import PlatformLandingPage from "@/components/seo/PlatformLandingPage"
import PlatformGuidePage from "@/components/seo/PlatformGuidePage"
import { authorityPages } from "@/lib/dating-authority-content"
import { datingShoots, getDatingShoot } from "@/lib/dating-shoot-content"
import { getShootLandingContent } from "@/lib/dating-shoot-landing-content"
import { getLocalizedShootPage } from "@/lib/dating-shoot-pages"
import { getPlatformGuide, getPlatformLanding, platformGuides, platformLandings } from "@/lib/platform-pages"
import { getLocalizedMetadata } from "@/lib/public-seo"
import { isPublishedPublicLocale, publishedPublicLocales, type PublishedPublicLocale } from "@/i18n/config"
import { getLocalizedAuthorityPage } from "@/lib/seo-pages/authority-localized"
import { getLocalizedActivityPageData } from "@/lib/seo-pages/activity-localized"
import { examplesPageCopy } from "@/lib/seo-pages/examples-localized"
import { authorityPageUi } from "@/lib/seo-pages/public-page-ui"

type Params = { params: Promise<{ locale: string; seo: string[] }> }

function getPath(segments: string[]) {
  return `/${segments.join("/")}`
}

export function generateStaticParams() {
  const paths = new Set([
    ...Object.keys(authorityPages),
    ...Object.keys(platformLandings),
    ...Object.keys(platformGuides),
    "/dating-photos/activity",
    "/dating-photos/examples",
    ...datingShoots.map((shoot) => `/dating-photos/shoots/${shoot.slug}`),
  ])
  const localizedPublicPaths = new Set([...Object.keys(platformLandings), ...Object.keys(platformGuides), ...Object.keys(authorityPages), "/dating-photos/activity", "/dating-photos/examples", ...datingShoots.map((shoot) => `/dating-photos/shoots/${shoot.slug}`)])
  return [...paths].flatMap((path) => {
    const locales: readonly PublishedPublicLocale[] = localizedPublicPaths.has(path) ? publishedPublicLocales : ["en"]
    return locales.map((locale) => ({ locale, seo: path.slice(1).split("/") }))
  })
}

function platformAlternatePaths(path: string) {
  return Object.fromEntries(
    publishedPublicLocales.map((candidate) => [candidate, path]),
  ) as Partial<Record<PublishedPublicLocale, string>>
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, seo } = await params
  if (!isPublishedPublicLocale(locale)) return { robots: { index: false, follow: false } }
  const path = getPath(seo)
  const localizedLanding = getPlatformLanding(path, locale)
  const localizedGuide = getPlatformGuide(path, locale)
  if (localizedLanding || localizedGuide) {
    const page = localizedLanding ?? localizedGuide
    return getLocalizedMetadata({
      locale,
      pathname: path,
      title: page.title,
      description: page.description,
      alternatePaths: platformAlternatePaths(path),
    })
  }
  const localizedShoot = path.startsWith("/dating-photos/shoots/") ? getLocalizedShootPage(seo.at(-1) ?? "", locale) : undefined
  if (localizedShoot) {
    return getLocalizedMetadata({
      locale,
      pathname: path,
      title: localizedShoot.copy.seoTitle,
      description: localizedShoot.copy.seoDescription,
      alternatePaths: platformAlternatePaths(path),
    })
  }
  if (path === "/dating-photos/activity") {
    const content = getLocalizedActivityPageData(locale)
    return getLocalizedMetadata({ locale, pathname: path, title: content.title, description: content.description, alternatePaths: platformAlternatePaths(path) })
  }
  if (path === "/dating-photos/examples") {
    const content = examplesPageCopy[locale]
    return getLocalizedMetadata({ locale, pathname: path, title: content.title, description: content.description, alternatePaths: platformAlternatePaths(path) })
  }
  const localizedAuthority = getLocalizedAuthorityPage(path, locale)
  if (localizedAuthority) {
    return getLocalizedMetadata({
      locale,
      pathname: path,
      title: localizedAuthority.title,
      description: localizedAuthority.description,
      alternatePaths: platformAlternatePaths(path),
    })
  }
  if (locale !== "en") return { robots: { index: false, follow: false } }
  const platformLanding = platformLandings[path]
  const platformGuide = platformGuides[path]
  const content = authorityPages[path]
  const shoot = path.startsWith("/dating-photos/shoots/") ? getDatingShoot(seo.at(-1) ?? "") : undefined
  const shootLanding = shoot ? getShootLandingContent(shoot.slug) : undefined
  if (!platformLanding && !platformGuide && !content && !shoot && path !== "/dating-photos/examples") return {}
  const title = platformLanding?.title ?? platformGuide?.title ?? content?.title ?? shootLanding?.seoTitle ?? shoot?.title ?? "AI Dating Photo Examples for a Complete Profile"
  const description = platformLanding?.description ?? platformGuide?.description ?? content?.description ?? shootLanding?.seoDescription ?? shoot?.description ?? "Compare realistic AI dating photo examples by profile need, setting and framing, including clear portraits, full-length photos, activities and candids."
  return getLocalizedMetadata({ locale: "en", pathname: path, title, description, alternatePaths: { en: path } })
}

export default async function SeoPage({ params }: Params) {
  const { locale, seo } = await params
  if (!isPublishedPublicLocale(locale)) notFound()
  const path = getPath(seo)
  const localizedLanding = getPlatformLanding(path, locale)
  if (localizedLanding) return <PlatformLandingPage content={localizedLanding} locale={locale} />
  const localizedGuide = getPlatformGuide(path, locale)
  if (localizedGuide) return <PlatformGuidePage content={localizedGuide} locale={locale} />
  const localizedShoot = path.startsWith("/dating-photos/shoots/") ? getLocalizedShootPage(seo.at(-1) ?? "", locale) : undefined
  if (localizedShoot) return <ShootPage slug={seo.at(-1) ?? ""} locale={locale} />
  if (path === "/dating-photos/activity") return <DatingActivityPage locale={locale} />
  if (path === "/dating-photos/examples") return <DatingPhotoExamplesPage locale={locale} />
  const localizedAuthority = getLocalizedAuthorityPage(path, locale)
  if (localizedAuthority) return <AuthorityContentPage content={localizedAuthority} locale={locale} ui={authorityPageUi[locale]} />
  if (locale !== "en") notFound()
  const shoot = path.startsWith("/dating-photos/shoots/") ? getDatingShoot(seo.at(-1) ?? "") : undefined
  if (shoot) return <ShootPage slug={shoot.slug} locale="en" />
  const content = authorityPages[path]
  if (content) return <AuthorityContentPage content={content} locale="en" ui={authorityPageUi.en} />
  notFound()
}
