import type { Metadata } from "next"
import { notFound } from "next/navigation"
import AuthorityContentPage from "@/components/seo/AuthorityContentPage"
import DatingActivityPage from "@/components/seo/DatingActivityPage"
import DatingPhotoExamplesPage from "@/components/seo/DatingPhotoExamplesPage"
import ShootPage from "@/components/seo/ShootPage"
import PlatformLandingPage from "@/components/seo/PlatformLandingPage"
import PlatformGuidePage from "@/components/seo/PlatformGuidePage"
import { activityPageData } from "@/lib/dating-activity-content"
import { authorityPages } from "@/lib/dating-authority-content"
import { datingShoots, getDatingShoot } from "@/lib/dating-shoot-content"
import { getShootLandingContent } from "@/lib/dating-shoot-landing-content"
import { getPlatformGuide, getPlatformLanding, platformGuides, platformLandings } from "@/lib/platform-pages"
import { getLocalizedMetadata } from "@/lib/public-seo"
import { isPublishedPublicLocale, publishedPublicLocales, type PublishedPublicLocale } from "@/i18n/config"

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
  const localizedPlatformPaths = new Set([...Object.keys(platformLandings), ...Object.keys(platformGuides)])
  return [...paths].flatMap((path) => {
    const locales: readonly PublishedPublicLocale[] = localizedPlatformPaths.has(path) ? publishedPublicLocales : ["en"]
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
  if (locale !== "en") return { robots: { index: false, follow: false } }
  const platformLanding = platformLandings[path]
  const platformGuide = platformGuides[path]
  if (path === "/dating-photos/activity") {
    return getLocalizedMetadata({
      locale: "en",
      pathname: path,
      title: activityPageData.title,
      description: activityPageData.description,
      alternatePaths: { en: path },
    })
  }
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
  if (locale !== "en") notFound()
  if (path === "/dating-photos/activity") return <DatingActivityPage />
  if (path === "/dating-photos/examples") return <DatingPhotoExamplesPage />
  const shoot = path.startsWith("/dating-photos/shoots/") ? getDatingShoot(seo.at(-1) ?? "") : undefined
  if (shoot) return <ShootPage shoot={shoot} />
  const content = authorityPages[path]
  if (content) return <AuthorityContentPage content={content} />
  notFound()
}
