import assert from "node:assert/strict"
import { localeDefinitions } from "../i18n/config"
import { publicUrl } from "../lib/public-seo"

// Run against `next start` after building, or supply the deployed site URL.
// Build success alone does not exercise articles first rendered at runtime.
const baseUrl = process.argv[2] ?? "http://localhost:3100"
const articles = [
  { locale: "en", path: "/blog/7-common-dating-profile-photo-mistakes-and-how-ai-fixes-them" },
  { locale: "fr", path: "/blog/7-erreurs-frequentes-sur-les-photos-de-profil-de-rencontre-et-comment-lia-peut-les-corriger" },
] as const

async function main() {
  await Promise.all(articles.map(async ({ locale, path }) => {
    const route = locale === "en" ? path : `/${locale}${path}`
    const response = await fetch(new URL(route, baseUrl), { signal: AbortSignal.timeout(45000) })
    assert.equal(response.status, 200, `${route} must render successfully`)
    const html = await response.text()
    assert(html.includes(`rel="canonical" href="${publicUrl(path, locale)}"`), `${route} canonical`)
    assert(html.includes(`lang="${localeDefinitions[locale].htmlLang}"`), `${route} document language`)
    assert(html.includes(`"inLanguage":"${localeDefinitions[locale].htmlLang}"`), `${route} structured data language`)
    assert(html.includes('hrefLang="en"') || html.includes('hreflang="en"'), `${route} English alternate`)
    assert(html.includes('hrefLang="fr"') || html.includes('hreflang="fr"'), `${route} French alternate`)
    console.log(`${route}: rendered with localized SEO`)
  }))
  const sitemap = await fetch(new URL("/sitemap.xml", baseUrl), { signal: AbortSignal.timeout(45000) })
  assert.equal(sitemap.status, 200, "Sitemap must render successfully")
  const xml = await sitemap.text()
  for (const { locale, path } of articles) assert(xml.includes(`<loc>${publicUrl(path, locale)}</loc>`))
  console.log("Sitemap includes both linked article translations")
}

main().catch((error) => { console.error(error); process.exitCode = 1 })
