import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import {
  appLocales,
  getLocaleForWordPressCode,
  isBlogArchivePathname,
  isBlogPathname,
  isAppLocale,
  isPhase2LocalizedPathname,
  isLocaleRoutedPublicPathname,
  isPublishedPublicLocale,
  isPublishedBlogLocale,
  isPublishedPublicPathname,
  localeDefinitions,
  localizePublicPathname,
  publishedPublicLocales,
  publishedBlogLocales,
  publicRoutes,
  splitLocalePathname,
} from "../i18n/config"
import { authorityPages } from "../lib/dating-authority-content"
import { getLocalizedShootPage } from "../lib/dating-shoot-pages"
import { datingShoots } from "../lib/dating-shoot-content"
import { getLocalizedActivityPageData } from "../lib/seo-pages/activity-localized"
import { examplesPageCopy } from "../lib/seo-pages/examples-localized"
import { getLocalizedAuthorityPage } from "../lib/seo-pages/authority-localized"
import { authorityLinksCopy } from "../lib/authority-links-copy"

assert.deepEqual(appLocales, ["en", "fr", "es", "de", "pt-BR"])
assert.deepEqual(publishedPublicLocales, ["en", "fr", "es", "de", "pt-BR"])
assert.deepEqual(publishedBlogLocales, ["en"])
assert.equal(
  new Set(publicRoutes.map((route) => route.path)).size,
  publicRoutes.length,
  "Public route registry contains duplicate paths",
)

assert.equal(isAppLocale("pt-BR"), true)
assert.equal(isAppLocale("pt-br"), false)
assert.equal(isPublishedPublicLocale("en"), true)
assert.equal(isPublishedPublicLocale("fr"), true)
assert.equal(isPublishedBlogLocale("fr"), false)
assert.equal(isPublishedBlogLocale("es"), false)
assert.equal(isPublishedBlogLocale("de"), false)
assert.equal(isPublishedBlogLocale("pt-BR"), false)
assert.equal(localeDefinitions["pt-BR"].wordpressCode, "PT")
assert.equal(localeDefinitions["pt-BR"].pathnamePrefix, "/pt-br")
assert.equal(getLocaleForWordPressCode("FR"), undefined)
assert.equal(getLocaleForWordPressCode("ES"), undefined)
assert.equal(getLocaleForWordPressCode("DE"), undefined)
assert.equal(getLocaleForWordPressCode("PT"), undefined)
assert.equal(getLocaleForWordPressCode("pt-BR"), undefined)
assert.equal(localeDefinitions.fr.hrefLang, "fr")
assert.equal(localeDefinitions.es.hrefLang, "es")

assert.deepEqual(splitLocalePathname("/fr/blog/article"), {
  hadLocalePrefix: true,
  locale: "fr",
  pathname: "/blog/article",
})
assert.deepEqual(splitLocalePathname("/pt-br/about/"), {
  hadLocalePrefix: true,
  locale: "pt-BR",
  pathname: "/about",
})
assert.deepEqual(splitLocalePathname("/about"), {
  hadLocalePrefix: false,
  locale: "en",
  pathname: "/about",
})

assert.equal(isLocaleRoutedPublicPathname("/"), true)
assert.equal(isLocaleRoutedPublicPathname("/en"), true)
assert.equal(isLocaleRoutedPublicPathname("/de/dating-photos"), true)
assert.equal(isLocaleRoutedPublicPathname("/pt-br/blog/a-post"), true)
assert.equal(isBlogPathname("/fr/blog/a-post"), true)
assert.equal(isBlogArchivePathname("/de/blog"), true)
assert.equal(isPhase2LocalizedPathname("/fr/pricing"), true)
assert.equal(isPhase2LocalizedPathname("/fr/dating-photos"), true)
assert.equal(isPublishedPublicPathname("/how-it-works", "en"), true)
assert.equal(isPublishedPublicPathname("/how-it-works", "fr"), true)
assert.equal(isPublishedPublicPathname("/guides/tinder-photos", "en"), true)
assert.equal(isPublishedPublicPathname("/guides/tinder-photos", "fr"), true)
assert.equal(isPublishedPublicPathname("/dating-photos/shoots/gym-training", "fr"), true)
assert.equal(isPublishedPublicPathname("/dating-photos/shoots/rooftop", "pt-BR"), true)
assert.equal(isPublishedPublicPathname("/dating-photos/activity", "de"), true)
assert.equal(isPublishedPublicPathname("/dating-photos/examples", "pt-BR"), true)
assert.equal(isPublishedPublicPathname("/blog", "fr"), false)
assert.equal(isPhase2LocalizedPathname("/de/blog/a-post"), false)
assert.equal(isLocaleRoutedPublicPathname("/login"), false)
assert.equal(isLocaleRoutedPublicPathname("/fr/login"), false)
assert.equal(isLocaleRoutedPublicPathname("/api/pricing-plans"), false)

assert.equal(localizePublicPathname("/about", "en"), "/about")
assert.equal(localizePublicPathname("/about", "fr"), "/fr/about")
assert.equal(localizePublicPathname("/blog/article", "fr"), "/fr/blog/article")
assert.equal(localizePublicPathname("/", "pt-BR"), "/pt-br")

const configuredPrefixes = appLocales
  .filter((locale) => locale !== "en")
  .map((locale) => localeDefinitions[locale].pathnamePrefix)
assert.equal(new Set(configuredPrefixes).size, configuredPrefixes.length)
assert.ok(configuredPrefixes.every((prefix) => prefix.startsWith("/")))

const messageFiles = ["en", "fr", "es", "de", "pt-BR"]
const messagesDirectory = resolve(process.cwd(), "messages")
const catalogs = Object.fromEntries(
  messageFiles.map((locale) => [
    locale,
    JSON.parse(readFileSync(resolve(messagesDirectory, `${locale}.json`), "utf8")),
  ]),
)

function messageShape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(messageShape)
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, child]) => [key, messageShape(child)]),
    )
  }
  return typeof value
}

for (const locale of messageFiles.slice(1)) {
  assert.deepEqual(messageShape(catalogs[locale]), messageShape(catalogs.en), `${locale} catalog shape differs from en`)
  assert.notEqual(
    catalogs[locale].Home.meta.title,
    catalogs.en.Home.meta.title,
    `${locale} homepage metadata is still English fallback copy`,
  )
}

const localizedPricing = { fr: "39 $", es: "39 $", de: "39 $", "pt-BR": "US$ 39" } as const
for (const [locale, expectedPrice] of Object.entries(localizedPricing)) {
  assert.equal(catalogs[locale].Pricing.package.price, expectedPrice, `${locale} pricing card still uses the English price format`)
}

const localizedHeroProof = { fr: "15 séances", es: "15 sesiones", de: "15 Shootings", "pt-BR": "15 sessões" } as const
for (const [locale, expectedProof] of Object.entries(localizedHeroProof)) {
  assert.equal(catalogs[locale].Home.hero.proof, expectedProof, `${locale} homepage proof badge is not localized`)
}

// WordPress blog routes are intentionally excluded from this app localization audit.
assert.deepEqual(publicRoutes.find((route) => route.path === "/blog")?.locales, ["en"])
assert.equal(isBlogArchivePathname("/fr/blog"), true)

const localizedMarketingPaths = publicRoutes
  .filter((route) => route.path !== "/blog")
  .map((route) => route.path)
for (const path of localizedMarketingPaths) {
  const route = publicRoutes.find((candidate) => candidate.path === path)
  assert.deepEqual(route?.locales, publishedPublicLocales, `${path} is missing a published marketing locale`)
  for (const locale of publishedPublicLocales) {
    assert.equal(isPublishedPublicPathname(path, locale), true, `${locale}${path} is not published`)
  }
}

for (const locale of publishedPublicLocales) {
  assert.equal(authorityLinksCopy[locale].pages.length, 4, `${locale} homepage authority links are incomplete`)
  if (locale !== "en") assert.notEqual(authorityLinksCopy[locale].heading, authorityLinksCopy.en.heading, `${locale} homepage authority links are still English`)
  if (locale === "en") continue
  for (const path of Object.keys(authorityPages)) {
    const localized = getLocalizedAuthorityPage(path, locale)
    assert.ok(localized, `${locale}${path} is missing localized authority content`)
    assert.notEqual(localized?.title, authorityPages[path].title, `${locale}${path} title is still English`)
    assert.notEqual(localized?.description, authorityPages[path].description, `${locale}${path} description is still English`)
  }

  const activity = getLocalizedActivityPageData(locale)
  assert.notEqual(activity.title, getLocalizedActivityPageData("en").title, `${locale} activity title is still English`)
  assert.notEqual(activity.categories[0].title, getLocalizedActivityPageData("en").categories[0].title, `${locale} activity category is still English`)
  assert.notEqual(activity.faqs[0].question, getLocalizedActivityPageData("en").faqs[0].question, `${locale} activity FAQ is still English`)
  assert.notEqual(examplesPageCopy[locale].title, examplesPageCopy.en.title, `${locale} examples title is still English`)
  assert.equal(examplesPageCopy[locale].profileGaps.length, 4, `${locale} examples profile-gap copy is incomplete`)
  assert.equal(Object.keys(examplesPageCopy[locale].shoots).length, datingShoots.length, `${locale} examples shoot copy is incomplete`)
  for (const shoot of datingShoots) {
    assert.ok(examplesPageCopy[locale].shoots[shoot.slug], `${locale} examples are missing ${shoot.slug}`)
    assert.ok(getLocalizedShootPage(shoot.slug, locale), `${locale} shoot page is missing ${shoot.slug}`)
  }
}

console.log("i18n contract checks passed")
