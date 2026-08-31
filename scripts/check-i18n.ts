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
  splitLocalePathname,
} from "../i18n/config"

assert.deepEqual(appLocales, ["en", "fr", "es", "de", "pt-BR"])
assert.deepEqual(publishedPublicLocales, ["en", "fr", "es", "de", "pt-BR"])
assert.deepEqual(publishedBlogLocales, ["en"])

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
assert.equal(isPublishedPublicPathname("/how-it-works", "fr"), false)
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
  assert.notEqual(
    catalogs[locale].Blog.archive.meta.title,
    catalogs.en.Blog.archive.meta.title,
    `${locale} blog archive metadata is still English fallback copy`,
  )
}

console.log("i18n contract checks passed")
