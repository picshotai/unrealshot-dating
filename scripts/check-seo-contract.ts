import assert from "node:assert/strict"
import { existsSync } from "node:fs"
import { resolve } from "node:path"
import { defaultSEO, organizationSchema } from "../config/seo"
import {
  localeDefinitions,
  localizePublicPathname,
  publishedBlogLocales,
} from "../i18n/config"
import { serializeJsonLd } from "../lib/json-ld"
import { getPublicAlternates, publicUrl } from "../lib/public-seo"
import { getSiteUrl } from "../lib/site-url"

const englishSlug = "english-article"
const frenchSlug = "article-francais"
const paths = {
  en: `/blog/${englishSlug}`,
  fr: `/blog/${frenchSlug}`,
} as const

const alternates = getPublicAlternates(paths.en, paths, publishedBlogLocales)
const languages = alternates.languages as Record<string, string>
assert.equal(alternates.canonical, publicUrl(paths.en, "en"))
assert.equal(languages.en, publicUrl(paths.en, "en"))
assert.equal(languages.fr, publicUrl(paths.fr, "fr"))
assert.equal(languages["x-default"], publicUrl(paths.en, "en"))
assert.equal(languages.fr.includes("/fr/fr/"), false)
assert.equal(localeDefinitions.fr.hrefLang, "fr")
assert.equal(localeDefinitions["pt-BR"].hrefLang, "pt-BR")

assert.throws(
  () => publicUrl(localizePublicPathname(paths.fr, "fr"), "fr"),
  /unprefixed public pathname/,
)

assert.equal(defaultSEO.siteUrl.endsWith("/"), false)
assert.equal(organizationSchema.logo, `${defaultSEO.siteUrl}/site-logo.png`)
assert.equal(existsSync(resolve(process.cwd(), "public/site-logo.png")), true)
assert.equal(existsSync(resolve(process.cwd(), "public/og-image.png")), true)

const malicious = "</script><script>alert(1)</script>"
const serialized = serializeJsonLd({ headline: malicious })
assert.equal(serialized.includes("</script>"), false)
assert.equal(serialized.includes("\\u003c/script>"), true)

const originalCi = process.env.CI
const originalNodeEnv = process.env.NODE_ENV
const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL
try {
  Reflect.set(process.env, "CI", "true")
  Reflect.set(process.env, "NODE_ENV", "production")
  Reflect.set(process.env, "NEXT_PUBLIC_APP_URL", "http://localhost:3000/")
  assert.throws(() => getSiteUrl(), /cannot use localhost/)
} finally {
  if (originalCi === undefined) Reflect.deleteProperty(process.env, "CI")
  else Reflect.set(process.env, "CI", originalCi)
  if (originalNodeEnv === undefined) Reflect.deleteProperty(process.env, "NODE_ENV")
  else Reflect.set(process.env, "NODE_ENV", originalNodeEnv)
  if (originalAppUrl === undefined) Reflect.deleteProperty(process.env, "NEXT_PUBLIC_APP_URL")
  else Reflect.set(process.env, "NEXT_PUBLIC_APP_URL", originalAppUrl)
}

console.log("SEO contract checks passed")
