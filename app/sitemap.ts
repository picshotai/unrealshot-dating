import type { MetadataRoute } from "next"
import { defaultSEO } from "@/config/seo"
import {
  localizePublicPathname,
  localeDefinitions,
  publicRoutes,
  type PublishedPublicLocale,
} from "@/i18n/config"
import { getAllPublishedPostPaths } from "@/lib/wordpress-cms"
import { publicUrl } from "@/lib/public-seo"
import { editorialPosts } from "@/lib/editorial-content"
import { gonePaths } from "@/config/legacy-urls"

export const revalidate = 600

function localizedAlternates(pathname: string, locales: readonly PublishedPublicLocale[]) {
  if (locales.length < 2) return undefined
  return Object.fromEntries(
    [
      ...locales.map((locale) => [
        localeDefinitions[locale].hrefLang,
        `${defaultSEO.siteUrl}${localizePublicPathname(pathname, locale)}`,
      ]),
      ["x-default", `${defaultSEO.siteUrl}${localizePublicPathname(pathname, "en")}`],
    ],
  )
}

function publicEntry(pathname: string, locale: PublishedPublicLocale, locales: readonly PublishedPublicLocale[]) {
  const isPolicy = ["/privacy-policy", "/terms", "/refund-policy"].includes(pathname)
  const languages = localizedAlternates(pathname, locales)
  return {
    url: `${defaultSEO.siteUrl}${localizePublicPathname(pathname, locale)}`,
    changeFrequency: isPolicy ? ("monthly" as const) : ("weekly" as const),
    priority: pathname === "/" ? 1 : isPolicy ? 0.5 : 0.7,
    ...(languages ? { alternates: { languages } } : {}),
  }
}

function safeDate(value: string): Date | undefined {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = publicRoutes
    .filter((route) => route.indexable && route.sitemap)
    .flatMap((route) => route.locales.map((locale) => publicEntry(route.path, locale, route.locales)))

  const blogPaths = await getAllPublishedPostPaths()
  const localBlogEntries: MetadataRoute.Sitemap = editorialPosts.map((post) => ({
    url: publicUrl(`/blog/${post.slug}`, "en"),
    lastModified: safeDate(post.modified),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))
  const localSlugs = new Set(editorialPosts.map((post) => post.slug))
  const blogEntries: MetadataRoute.Sitemap = blogPaths
    .filter((path) => path.locale === "en")
    .filter((path) => !localSlugs.has(path.slug))
    .filter((path) => !gonePaths.has(`/blog/${path.slug}`))
    .map((path) => ({
      url: publicUrl(`/blog/${path.slug}`, "en"),
      lastModified: safeDate(path.modified),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))

  return [...staticEntries, ...localBlogEntries, ...blogEntries]
}
