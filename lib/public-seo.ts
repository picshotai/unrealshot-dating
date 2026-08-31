import type { Metadata } from "next"
import { defaultSEO, organizationSchema, socialConfig } from "@/config/seo"
import {
  localeDefinitions,
  localizePublicPathname,
  publishedPublicLocales,
  splitLocalePathname,
  type PublishedPublicLocale,
} from "@/i18n/config"

export function publicUrl(pathname: string, locale: PublishedPublicLocale): string {
  const parsed = splitLocalePathname(pathname)
  if (parsed.hadLocalePrefix) {
    throw new Error(`publicUrl expected an unprefixed public pathname, received: ${pathname}`)
  }
  return `${defaultSEO.siteUrl}${localizePublicPathname(pathname, locale)}`
}

export type LocalizedPathMap = Partial<Record<PublishedPublicLocale, string>>

export function getPublicAlternates(
  pathname: string,
  alternatePaths?: LocalizedPathMap,
  locales: readonly PublishedPublicLocale[] = publishedPublicLocales,
) {
  const paths = alternatePaths ?? Object.fromEntries(
    locales.map((locale) => [locale, pathname]),
  ) as LocalizedPathMap

  const languageAlternates = Object.fromEntries(
    locales
      .filter((locale) => paths[locale])
      .map((locale) => [localeDefinitions[locale].hrefLang, publicUrl(paths[locale]!, locale)]),
  )

  return {
    canonical: publicUrl(paths.en ?? pathname, "en"),
    languages: {
      ...languageAlternates,
      ...(paths.en ? { "x-default": publicUrl(paths.en, "en") } : {}),
    },
  }
}

export function getLocalizedMetadata({
  locale,
  pathname,
  title,
  description,
  keywords = [],
  image = `${defaultSEO.siteUrl}/new-landing/29ecda7f13764ee595abe3c9be049ddb.jpg`,
  alternatePaths,
}: {
  locale: PublishedPublicLocale
  pathname: string
  title: string
  description: string
  keywords?: string[]
  image?: string
  alternatePaths?: LocalizedPathMap
}): Metadata {
  const canonical = publicUrl(pathname, locale)
  const resolvedAlternatePaths = alternatePaths ?? Object.fromEntries(
    publishedPublicLocales.map((candidate) => [candidate, pathname]),
  ) as LocalizedPathMap
  const alternates = getPublicAlternates(pathname, resolvedAlternatePaths)
  const alternateLocale = publishedPublicLocales
    .filter((candidate) => candidate !== locale && Boolean(resolvedAlternatePaths[candidate]))
    .map((candidate) => localeDefinitions[candidate].openGraphLocale)

  return {
    title,
    description,
    ...(keywords.length ? { keywords } : {}),
    authors: [{ name: defaultSEO.author }],
    creator: defaultSEO.author,
    publisher: defaultSEO.author,
    alternates: {
      ...alternates,
      canonical,
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      siteName: defaultSEO.siteName,
      locale: localeDefinitions[locale].openGraphLocale,
      alternateLocale,
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: socialConfig.twitter.cardType,
      site: socialConfig.twitter.site,
      creator: socialConfig.twitter.handle,
      title,
      description,
      images: [image],
    },
    robots: { index: true, follow: true },
  }
}

export function makeBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function makeWebPageJsonLd({
  name,
  description,
  url,
  locale,
  breadcrumbs,
}: {
  name: string
  description: string
  url: string
  locale: PublishedPublicLocale
  breadcrumbs?: Array<{ name: string; url: string }>
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url,
    name,
    description,
    url,
    inLanguage: localeDefinitions[locale].htmlLang,
    isPartOf: { "@type": "WebSite", "@id": `${publicUrl("/", locale)}#website`, name: defaultSEO.siteName, url: publicUrl("/", locale) },
    publisher: organizationSchema,
    ...(breadcrumbs ? { breadcrumb: makeBreadcrumbJsonLd(breadcrumbs) } : {}),
  }
}

export function makeWebsiteJsonLd({
  name,
  description,
  locale,
}: {
  name: string
  description: string
  locale: PublishedPublicLocale
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${publicUrl("/", locale)}#website`,
    name,
    description,
    url: publicUrl("/", locale),
    inLanguage: localeDefinitions[locale].htmlLang,
    publisher: organizationSchema,
  }
}

export function makeFaqJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  }
}

export function makeBlogPostingJsonLd({
  url,
  blogUrl,
  blogName,
  locale,
  headline,
  description,
  image,
  datePublished,
  dateModified,
  authorName,
  category,
  wordCount,
  readingMinutes,
}: {
  url: string
  blogUrl: string
  blogName: string
  locale: PublishedPublicLocale
  headline: string
  description: string
  image: string
  datePublished: string
  dateModified: string
  authorName: string
  category: string
  wordCount: number
  readingMinutes: number
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": url,
    headline,
    description,
    image,
    datePublished,
    dateModified,
    author: {
      "@type": "Person",
      "@id": `${defaultSEO.siteUrl}/about#founder`,
      name: authorName,
      url: `${defaultSEO.siteUrl}/about`,
    },
    publisher: organizationSchema,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    articleSection: category,
    wordCount,
    timeRequired: `PT${readingMinutes}M`,
    inLanguage: localeDefinitions[locale].htmlLang,
    isPartOf: { "@type": "Blog", "@id": blogUrl, name: blogName, url: blogUrl },
  }
}

export function makeSoftwareApplicationJsonLd({
  description,
  url,
  locale,
  features,
}: {
  description: string
  url: string
  locale: PublishedPublicLocale
  features: string[]
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${defaultSEO.siteUrl}/#software`,
    name: "UnrealShot",
    description,
    url,
    inLanguage: localeDefinitions[locale].htmlLang,
    applicationCategory: "PhotographyApplication",
    operatingSystem: "Web Browser",
    featureList: features,
    author: organizationSchema,
    publisher: organizationSchema,
    offers: {
      "@type": "Offer",
      name: "UnrealShot Dating Profile",
      price: "39.00",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${defaultSEO.siteUrl}/login`,
    },
  }
}
