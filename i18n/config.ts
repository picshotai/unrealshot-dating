export const appLocales = ["en", "fr", "es", "de", "pt-BR"] as const

export type AppLocale = (typeof appLocales)[number]

export const defaultLocale: AppLocale = "en"

/**
 * A locale is added here only when its public pages, metadata and SEO links are
 * complete. Keeping this separate from `appLocales` prevents unfinished
 * locales from publishing English fallback content at localized URLs.
 */
export const publishedPublicLocales = ["en", "fr", "es", "de", "pt-BR"] as const satisfies readonly AppLocale[]

export type PublishedPublicLocale = (typeof publishedPublicLocales)[number]

/**
 * Blog locales are promoted independently from the translated marketing site.
 * A locale belongs here only after its archive has reviewed, published posts.
 */
export const publishedBlogLocales = ["en"] as const satisfies readonly PublishedPublicLocale[]

export type PublishedBlogLocale = (typeof publishedBlogLocales)[number]

type LocaleDefinition = {
  htmlLang: string
  hrefLang: string
  nativeName: string
  openGraphLocale: string
  pathnamePrefix: string
  wordpressCode: string
  wordpressLocale: string
}

export const localeDefinitions = {
  en: {
    htmlLang: "en-US",
    hrefLang: "en",
    nativeName: "English",
    openGraphLocale: "en_US",
    pathnamePrefix: "",
    wordpressCode: "EN",
    wordpressLocale: "en_US",
  },
  fr: {
    htmlLang: "fr-FR",
    hrefLang: "fr",
    nativeName: "Français",
    openGraphLocale: "fr_FR",
    pathnamePrefix: "/fr",
    wordpressCode: "FR",
    wordpressLocale: "fr_FR",
  },
  es: {
    htmlLang: "es-ES",
    hrefLang: "es",
    nativeName: "Español",
    openGraphLocale: "es_ES",
    pathnamePrefix: "/es",
    wordpressCode: "ES",
    wordpressLocale: "es_ES",
  },
  de: {
    htmlLang: "de-DE",
    hrefLang: "de",
    nativeName: "Deutsch",
    openGraphLocale: "de_DE",
    pathnamePrefix: "/de",
    wordpressCode: "DE",
    wordpressLocale: "de_DE",
  },
  "pt-BR": {
    htmlLang: "pt-BR",
    hrefLang: "pt-BR",
    nativeName: "Português (Brasil)",
    openGraphLocale: "pt_BR",
    pathnamePrefix: "/pt-br",
    wordpressCode: "PT",
    wordpressLocale: "pt_BR",
  },
} as const satisfies Record<AppLocale, LocaleDefinition>

export type PublicRouteDefinition = {
  path: string
  locales: readonly PublishedPublicLocale[]
  indexable: boolean
  sitemap: boolean
}

const englishOnly = ["en"] as const satisfies readonly PublishedPublicLocale[]

/** The single source of truth for public pages, locale support and sitemap output. */
export const publicRoutes = [
  { path: "/", locales: publishedPublicLocales, indexable: true, sitemap: true },
  { path: "/about", locales: publishedPublicLocales, indexable: true, sitemap: true },
  { path: "/pricing", locales: publishedPublicLocales, indexable: true, sitemap: true },
  { path: "/privacy-policy", locales: publishedPublicLocales, indexable: true, sitemap: true },
  { path: "/refund-policy", locales: publishedPublicLocales, indexable: true, sitemap: true },
  { path: "/terms", locales: publishedPublicLocales, indexable: true, sitemap: true },
  { path: "/dating-photos", locales: publishedPublicLocales, indexable: true, sitemap: true },
  { path: "/blog", locales: englishOnly, indexable: true, sitemap: true },
  { path: "/how-it-works", locales: englishOnly, indexable: true, sitemap: true },
  { path: "/realistic-ai-dating-photos", locales: englishOnly, indexable: true, sitemap: true },
  { path: "/contact", locales: englishOnly, indexable: true, sitemap: true },
  { path: "/dating-photos/examples", locales: englishOnly, indexable: true, sitemap: true },
  { path: "/dating-photos/activity", locales: englishOnly, indexable: true, sitemap: true },
  { path: "/dating-photos/tinder", locales: englishOnly, indexable: true, sitemap: true },
  { path: "/dating-photos/hinge", locales: englishOnly, indexable: true, sitemap: true },
  { path: "/dating-photos/bumble", locales: englishOnly, indexable: true, sitemap: true },
  { path: "/dating-photos/shoots/gym-training", locales: englishOnly, indexable: true, sitemap: true },
  { path: "/dating-photos/shoots/outdoor-coffee", locales: englishOnly, indexable: true, sitemap: true },
  { path: "/dating-photos/shoots/dinner", locales: englishOnly, indexable: true, sitemap: true },
  { path: "/dating-photos/shoots/city-walk", locales: englishOnly, indexable: true, sitemap: true },
  { path: "/dating-photos/shoots/coastal-travel", locales: englishOnly, indexable: true, sitemap: true },
  { path: "/dating-photos/shoots/home-cooking", locales: englishOnly, indexable: true, sitemap: true },
  { path: "/dating-photos/shoots/rooftop", locales: englishOnly, indexable: true, sitemap: true },
] as const satisfies readonly PublicRouteDefinition[]

const publicExactPathnames = new Set<string>(publicRoutes.map((route) => route.path))

const publicDynamicPathnamePrefixes = ["/blog/"] as const

const phase2LocalizedExactPathnames = new Set<string>(
  publicRoutes.filter((route) => route.locales.length > 1).map((route) => route.path),
)

const acceptedLocalePrefixes = appLocales
  .map((locale) => {
    const prefix = locale === defaultLocale ? `/${defaultLocale}` : localeDefinitions[locale].pathnamePrefix
    return [prefix, locale] as const
  })
  .sort(([left], [right]) => right.length - left.length)

export function isAppLocale(value: unknown): value is AppLocale {
  return typeof value === "string" && (appLocales as readonly string[]).includes(value)
}

export function isPublishedPublicLocale(value: unknown): value is PublishedPublicLocale {
  return (
    typeof value === "string" &&
    (publishedPublicLocales as readonly string[]).includes(value)
  )
}

export function isPublishedBlogLocale(value: unknown): value is PublishedBlogLocale {
  return (
    typeof value === "string" &&
    (publishedBlogLocales as readonly string[]).includes(value)
  )
}

export function getLocaleForWordPressCode(code: string | null | undefined): PublishedBlogLocale | undefined {
  if (!code) return undefined
  return publishedBlogLocales.find((locale) => localeDefinitions[locale].wordpressCode === code)
}

export function getHtmlLang(locale: unknown): string {
  return isAppLocale(locale) ? localeDefinitions[locale].htmlLang : localeDefinitions[defaultLocale].htmlLang
}

export function normalizePathname(pathname: string): string {
  const withLeadingSlash = pathname.startsWith("/") ? pathname : `/${pathname}`
  if (withLeadingSlash === "/") return withLeadingSlash
  return withLeadingSlash.replace(/\/+$/, "")
}

export function splitLocalePathname(pathname: string): {
  hadLocalePrefix: boolean
  locale: AppLocale
  pathname: string
} {
  const normalizedPathname = normalizePathname(pathname)

  for (const [prefix, locale] of acceptedLocalePrefixes) {
    if (normalizedPathname === prefix) {
      return { hadLocalePrefix: true, locale, pathname: "/" }
    }

    if (normalizedPathname.startsWith(`${prefix}/`)) {
      return {
        hadLocalePrefix: true,
        locale,
        pathname: normalizedPathname.slice(prefix.length),
      }
    }
  }

  return {
    hadLocalePrefix: false,
    locale: defaultLocale,
    pathname: normalizedPathname,
  }
}

export function isPublicPathname(pathname: string): boolean {
  const normalizedPathname = normalizePathname(pathname)

  return (
    publicExactPathnames.has(normalizedPathname) ||
    publicDynamicPathnamePrefixes.some((prefix) => normalizedPathname.startsWith(prefix))
  )
}

export function getPublicRoute(pathname: string): PublicRouteDefinition | undefined {
  const normalizedPathname = normalizePathname(pathname)
  return publicRoutes.find((route) => route.path === normalizedPathname)
}

export function isPublishedPublicPathname(pathname: string, locale: AppLocale): boolean {
  const normalizedPathname = normalizePathname(pathname)
  if (normalizedPathname === "/blog" || normalizedPathname.startsWith("/blog/")) {
    return isPublishedBlogLocale(locale)
  }
  const route = getPublicRoute(normalizedPathname)
  return Boolean(route && (route.locales as readonly string[]).includes(locale))
}

export function isLocaleRoutedPublicPathname(pathname: string): boolean {
  return isPublicPathname(splitLocalePathname(pathname).pathname)
}

/** Returns true only for page routes whose copy and metadata are complete in every published locale. */
export function isPhase2LocalizedPathname(pathname: string): boolean {
  return phase2LocalizedExactPathnames.has(splitLocalePathname(pathname).pathname)
}

export function isBlogPathname(pathname: string): boolean {
  const publicPathname = splitLocalePathname(pathname).pathname
  return publicPathname === "/blog" || publicPathname.startsWith("/blog/")
}

export function isBlogArchivePathname(pathname: string): boolean {
  return splitLocalePathname(pathname).pathname === "/blog"
}

export function localizePublicPathname(pathname: string, locale: AppLocale): string {
  const normalizedPathname = normalizePathname(pathname)
  const prefix = localeDefinitions[locale].pathnamePrefix

  if (!prefix) return normalizedPathname
  if (normalizedPathname === "/") return prefix
  return `${prefix}${normalizedPathname}`
}
