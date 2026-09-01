import type { Metadata } from "next"
import { notFound } from "next/navigation"
import AuthorityContentPage from "@/components/seo/AuthorityContentPage"
import DatingPhotoExamplesPage from "@/components/seo/DatingPhotoExamplesPage"
import ShootPage from "@/components/seo/ShootPage"
import PlatformLandingPage from "@/components/seo/PlatformLandingPage"
import PlatformGuidePage from "@/components/seo/PlatformGuidePage"
import { authorityPages } from "@/lib/dating-authority-content"
import { datingShoots, getDatingShoot } from "@/lib/dating-shoot-content"
import { getShootLandingContent } from "@/lib/dating-shoot-landing-content"
import { platformGuides, platformLandings } from "@/lib/platform-pages"
import { getLocalizedMetadata } from "@/lib/public-seo"

type Params = { params: Promise<{ locale: string; seo: string[] }> }

function getPath(segments: string[]) {
  return `/${segments.join("/")}`
}

export function generateStaticParams() {
  const paths = new Set([
    ...Object.keys(authorityPages),
    ...Object.keys(platformLandings),
    ...Object.keys(platformGuides),
    "/dating-photos/examples",
    ...datingShoots.map((shoot) => `/dating-photos/shoots/${shoot.slug}`),
  ])
  return [...paths].map((path) => ({ locale: "en", seo: path.slice(1).split("/") }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, seo } = await params
  if (locale !== "en") return { robots: { index: false, follow: false } }
  const path = getPath(seo)
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
  if (locale !== "en") notFound()
  const path = getPath(seo)
  if (path === "/dating-photos/examples") return <DatingPhotoExamplesPage />
  const platformLanding = platformLandings[path]
  if (platformLanding) return <PlatformLandingPage content={platformLanding} />
  const platformGuide = platformGuides[path]
  if (platformGuide) return <PlatformGuidePage content={platformGuide} />
  const shoot = path.startsWith("/dating-photos/shoots/") ? getDatingShoot(seo.at(-1) ?? "") : undefined
  if (shoot) return <ShootPage shoot={shoot} />
  const content = authorityPages[path]
  if (content) return <AuthorityContentPage content={content} />
  notFound()
}
