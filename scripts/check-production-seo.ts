import assert from "node:assert/strict"
const serverOrigin = (process.env.SEO_BASE_URL || "http://localhost:3200").replace(/\/$/, "")
let metadataOrigin = process.env.SEO_METADATA_ORIGIN?.replace(/\/$/, "") || ""

const englishArticle = "/blog/7-common-dating-profile-photo-mistakes-and-how-ai-fixes-them"
const frenchArticle = "/fr/blog/7-erreurs-frequentes-sur-les-photos-de-profil-de-rencontre-et-comment-lia-peut-les-corriger"

function attribute(tag: string, name: string): string | undefined {
  return new RegExp(`${name}=["']([^"']+)["']`, "i").exec(tag)?.[1]
}

function canonical(html: string): string | undefined {
  const tag = html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/i)?.[0]
  return tag ? attribute(tag, "href") : undefined
}

function alternates(html: string): Record<string, string> {
  const result: Record<string, string> = {}
  for (const match of html.matchAll(/<link\b[^>]*\brel=["']alternate["'][^>]*>/gi)) {
    const language = attribute(match[0], "hreflang")
    const href = attribute(match[0], "href")
    if (language && href) result[language] = href
  }
  return result
}

async function request(pathname: string, redirect: RequestRedirect = "follow") {
  return fetch(`${serverOrigin}${pathname}`, { redirect })
}

async function expectPage(pathname: string, language: string, canonicalPath = pathname) {
  const response = await request(pathname)
  assert.equal(response.status, 200, `${pathname} should return 200`)
  const html = await response.text()
  assert.match(html, new RegExp(`<html[^>]+lang=["']${language}["']`, "i"), `${pathname} has wrong html lang`)
  assert.equal(canonical(html), `${metadataOrigin}${canonicalPath}`, `${pathname} has wrong canonical`)
  assert.equal(html.includes("/fr/fr/"), false, `${pathname} contains a repeated French prefix`)
  return html
}

async function main() {
  if (!metadataOrigin) {
    const rootResponse = await request("/")
    assert.equal(rootResponse.status, 200)
    const rootCanonical = canonical(await rootResponse.text())
    assert.ok(rootCanonical, "Root canonical is missing")
    metadataOrigin = new URL(rootCanonical).origin
  }

  await expectPage("/", "en-US", "/")
  await expectPage("/fr", "fr-FR", "/fr")
  await expectPage("/es/pricing", "es-ES", "/es/pricing")
  await expectPage("/de/use-case/dating-photos", "de-DE", "/de/use-case/dating-photos")
  await expectPage("/pt-br/about", "pt-BR", "/pt-br/about")
  await expectPage("/blog", "en-US", "/blog")
  await expectPage("/fr/blog", "fr-FR", "/fr/blog")

  for (const pathname of ["/es/blog", "/de/blog", "/pt-br/blog"]) {
    const response = await request(pathname)
    const html = await response.text()
    assert.equal(response.status, 404, `${pathname} must remain unpublished`)
    assert.ok(
      /<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html) ||
      response.headers.get("x-robots-tag")?.includes("noindex"),
      `${pathname} must be noindex`,
    )
  }

  const englishHtml = await expectPage(englishArticle, "en-US", englishArticle)
  const frenchHtml = await expectPage(frenchArticle, "fr-FR", frenchArticle)
  const expectedEnglishUrl = `${metadataOrigin}${englishArticle}`
  const expectedFrenchUrl = `${metadataOrigin}${frenchArticle}`
  for (const html of [englishHtml, frenchHtml]) {
    const links = alternates(html)
    assert.equal(links.en, expectedEnglishUrl)
    assert.equal(links.fr, expectedFrenchUrl)
    assert.equal(links["x-default"], expectedEnglishUrl)
  }

  for (const [pathname, expectedLocation] of [["/en/about", "/about"], ["/pt-BR/about", "/pt-br/about"]] as const) {
    const response = await request(pathname, "manual")
    assert.ok([301, 307, 308].includes(response.status), `${pathname} should redirect canonically`)
    assert.equal(new URL(response.headers.get("location")!, serverOrigin).pathname, expectedLocation)
  }

  for (const asset of ["/site-logo.png", "/og-image.png"]) {
    assert.equal((await request(asset)).status, 200, `${asset} is missing`)
  }

  const jsonLdScripts = [...englishHtml.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
  assert.ok(jsonLdScripts.length >= 3, "Article should include organization, website and article JSON-LD")
  for (const script of jsonLdScripts) JSON.parse(script[1])

  const sitemapResponse = await request("/sitemap.xml")
  assert.equal(sitemapResponse.status, 200)
  const sitemap = await sitemapResponse.text()
  assert.ok(sitemap.includes(`<loc>${metadataOrigin}/blog</loc>`), "English blog archive missing from sitemap")
  assert.ok(sitemap.includes(`<loc>${metadataOrigin}/fr/blog</loc>`), "French blog archive missing from sitemap")
  assert.ok(sitemap.includes(`<loc>${metadataOrigin}/es/blog</loc>`), "Spanish blog archive missing from sitemap")
  assert.ok(sitemap.includes(`<loc>${metadataOrigin}/de/blog</loc>`), "German blog archive missing from sitemap")
  assert.ok(sitemap.includes(`<loc>${metadataOrigin}/pt-br/blog</loc>`), "Portuguese blog archive missing from sitemap")
  assert.ok(sitemap.includes(`<loc>${expectedEnglishUrl}</loc>`), "English article missing from sitemap")
  assert.ok(sitemap.includes(`<loc>${expectedFrenchUrl}</loc>`), "French article missing from sitemap")

  const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
  for (const sitemapUrl of sitemapUrls) {
    const parsed = new URL(sitemapUrl)
    const response = await request(`${parsed.pathname}${parsed.search}`)
    assert.equal(response.status, 200, `Sitemap URL does not return 200: ${sitemapUrl}`)
    const html = await response.text()
    assert.equal(canonical(html), sitemapUrl, `Sitemap URL is not self-canonical: ${sitemapUrl}`)
  }

  console.log(`Production SEO smoke checks passed for ${sitemapUrls.length} sitemap URLs`)
}

void main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
