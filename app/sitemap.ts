import type { MetadataRoute } from "next"
import { defaultSEO } from "@/config/seo"
import {
  localizePublicPathname,
  localeDefinitions,
  publicRoutes,
  type PublishedBlogLocale,
  type PublishedPublicLocale,
} from "@/i18n/config"
import { getAllPublishedPostPaths } from "@/lib/wordpress-cms"
import { publicUrl } from "@/lib/public-seo"
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
  const blogEntries: MetadataRoute.Sitemap = blogPaths
    .filter((path) => !gonePaths.has(`/blog/${path.slug}`))
    .map((path) => {
      const languages = Object.fromEntries(
        Object.entries(path.alternatePaths ?? {}).map(([locale, pathname]) => {
          const typedLocale = locale as PublishedBlogLocale
          return [localeDefinitions[typedLocale].hrefLang, publicUrl(pathname, typedLocale)]
        }),
      )
      return {
        url: publicUrl(`/blog/${path.slug}`, path.locale),
        lastModified: safeDate(path.modified),
        changeFrequency: "weekly" as const,
        priority: 0.6,
        ...(Object.keys(languages).length ? { alternates: { languages } } : {}),
      }
    })

  return [...staticEntries, ...blogEntries]
}
