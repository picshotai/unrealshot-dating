import type { MetadataRoute } from "next"
import { defaultSEO } from "@/config/seo"
import {
  localizePublicPathname,
  localeDefinitions,
  publishedBlogLocales,
  publishedPublicLocales,
  type PublishedBlogLocale,
  type PublishedPublicLocale,
} from "@/i18n/config"
import { getAllPublishedPostPaths } from "@/lib/wordpress-cms"
import { publicUrl } from "@/lib/public-seo"

export const revalidate = 600

const localizedPublicPaths = [
  "/",
  "/about",
  "/pricing",
  "/privacy-policy",
  "/refund-policy",
  "/terms",
  "/use-case/dating-photos",
] as const

function localizedAlternates(pathname: string) {
  return Object.fromEntries(
    [
      ...publishedPublicLocales.map((locale) => [
        localeDefinitions[locale].hrefLang,
        `${defaultSEO.siteUrl}${localizePublicPathname(pathname, locale)}`,
      ]),
      ["x-default", `${defaultSEO.siteUrl}${localizePublicPathname(pathname, "en")}`],
    ],
  )
}

function articleAlternates(alternatePaths?: Partial<Record<PublishedPublicLocale, string>>) {
  const paths = alternatePaths ?? {}
  return Object.fromEntries([
    ...publishedBlogLocales
      .filter((locale) => paths[locale])
      .map((locale) => [localeDefinitions[locale].hrefLang, publicUrl(paths[locale]!, locale)]),
    ...(paths.en ? [["x-default", publicUrl(paths.en, "en")]] : []),
  ])
}

function publicEntry(pathname: string, locale: PublishedPublicLocale) {
  const isPolicy = ["/privacy-policy", "/terms", "/refund-policy"].includes(pathname)
  return {
    url: `${defaultSEO.siteUrl}${localizePublicPathname(pathname, locale)}`,
    changeFrequency: isPolicy ? ("monthly" as const) : ("weekly" as const),
    priority: pathname === "/" ? 1 : isPolicy ? 0.5 : 0.7,
    alternates: { languages: localizedAlternates(pathname) },
  }
}

function safeDate(value: string): Date | undefined {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

function blogArchiveAlternates() {
  return Object.fromEntries([
    ...publishedBlogLocales.map((locale) => [
      localeDefinitions[locale].hrefLang,
      publicUrl("/blog", locale),
    ]),
    ["x-default", publicUrl("/blog", "en")],
  ])
}

function blogArchiveEntry(locale: PublishedBlogLocale): MetadataRoute.Sitemap[number] {
  return {
    url: publicUrl("/blog", locale),
    changeFrequency: "weekly",
    priority: 0.7,
    alternates: { languages: blogArchiveAlternates() },
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = publishedPublicLocales.flatMap((locale) =>
    localizedPublicPaths.map((pathname) => publicEntry(pathname, locale)),
  )

  const blogArchives = publishedBlogLocales.map(blogArchiveEntry)
  const blogPaths = await getAllPublishedPostPaths()
  const blogEntries: MetadataRoute.Sitemap = blogPaths.map((path) => ({
    url: publicUrl(`/blog/${path.slug}`, path.locale),
    lastModified: safeDate(path.modified),
    changeFrequency: "weekly" as const,
    priority: 0.6,
    alternates: { languages: articleAlternates(path.alternatePaths) },
  }))

  return [...staticEntries, ...blogArchives, ...blogEntries]
}
