import assert from "node:assert/strict"
const serverOrigin = (process.env.SEO_BASE_URL || "http://localhost:3200").replace(/\/$/, "")
let metadataOrigin = process.env.SEO_METADATA_ORIGIN?.replace(/\/$/, "") || ""

const englishArticle = "/blog/7-common-dating-profile-photo-mistakes-and-how-ai-fixes-them"
const englishOnlyPages = ["/how-it-works", "/dating-photos/examples", "/realistic-ai-dating-photos", "/dating-photos/activity", "/dating-photos/tinder", "/dating-photos/hinge", "/dating-photos/bumble", "/contact"]

function attribute(tag: string, name: string): string | undefined {
  return new RegExp(`${name}=["']([^"']+)["']`, "i").exec(tag)?.[1]
}

function canonical(html: string): string | undefined {
  const tag = html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/i)?.[0]
  return tag ? attribute(tag, "href") : undefined
}

function normalizedUrl(value: string | undefined): string | undefined {
  return value?.replace(/\/$/, "")
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
  assert.equal(
    normalizedUrl(canonical(html)),
    normalizedUrl(`${metadataOrigin}${canonicalPath}`),
    `${pathname} has wrong canonical`,
  )
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
  await expectPage("/de/dating-photos", "de-DE", "/de/dating-photos")
  await expectPage("/pt-br/about", "pt-BR", "/pt-br/about")
  await expectPage("/blog", "en-US", "/blog")
  for (const pathname of englishOnlyPages) await expectPage(pathname, "en-US", pathname)

  for (const pathname of ["/fr/blog", "/es/blog", "/de/blog", "/pt-br/blog", "/fr/how-it-works", "/de/dating-photos/examples"]) {
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
  const expectedEnglishUrl = `${metadataOrigin}${englishArticle}`
  const links = alternates(englishHtml)
  assert.equal(links.en, expectedEnglishUrl)
  assert.equal(links.fr, undefined)
  assert.equal(links["x-default"], expectedEnglishUrl)

  for (const [pathname, expectedLocation] of [["/en/about", "/about"], ["/pt-BR/about", "/pt-br/about"]] as const) {
    const response = await request(pathname, "manual")
    assert.ok([301, 307, 308].includes(response.status), `${pathname} should redirect canonically`)
    assert.equal(new URL(response.headers.get("location")!, serverOrigin).pathname, expectedLocation)
  }

  for (const asset of ["/site-logo.png", "/og-image.png"]) {
    assert.equal((await request(asset)).status, 200, `${asset} is missing`)
  }

  for (const [pathname, expectedLocation] of [["/use-case/dating-photos", "/dating-photos"], ["/fr/use-case/dating-photos", "/fr/dating-photos"], ["/ai-dating-photoshoot", "/"], ["/contact-us", "/contact"], ["/faqs", "/how-it-works"]] as const) {
    const response = await request(pathname, "manual")
    assert.equal(response.status, 308, `${pathname} should redirect permanently`)
    assert.equal(new URL(response.headers.get("location")!, serverOrigin).pathname, expectedLocation)
  }

  for (const pathname of ["/professional-headshots", "/fr/linkedin-headshots", "/blog/best-ai-headshot-generators-in-2026"]) {
    const response = await request(pathname, "manual")
    assert.equal(response.status, 410, `${pathname} should return Gone`)
    assert.match(response.headers.get("x-robots-tag") ?? "", /noindex, follow/)
  }
  assert.equal((await request("/this-url-never-existed", "manual")).status, 404)

  const jsonLdScripts = [...englishHtml.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
  assert.ok(jsonLdScripts.length >= 2, "Article should include organization and article JSON-LD")
  for (const script of jsonLdScripts) JSON.parse(script[1])

  const sitemapResponse = await request("/sitemap.xml")
  assert.equal(sitemapResponse.status, 200)
  const sitemap = await sitemapResponse.text()
  assert.ok(sitemap.includes(`<loc>${metadataOrigin}/blog</loc>`), "English blog archive missing from sitemap")
  assert.equal(sitemap.includes(`/fr/blog`), false, "Unreviewed localized blog must not enter sitemap")
  for (const pathname of englishOnlyPages) assert.ok(sitemap.includes(`<loc>${metadataOrigin}${pathname}</loc>`), `${pathname} missing from sitemap`)
  assert.ok(sitemap.includes(`<loc>${expectedEnglishUrl}</loc>`), "English article missing from sitemap")
  assert.equal(sitemap.includes("/use-case/dating-photos"), false)
  assert.equal(sitemap.includes("/professional-headshots"), false)

  const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
  for (const sitemapUrl of sitemapUrls) {
    const parsed = new URL(sitemapUrl)
    const response = await request(`${parsed.pathname}${parsed.search}`)
    assert.equal(response.status, 200, `Sitemap URL does not return 200: ${sitemapUrl}`)
    const html = await response.text()
    assert.equal(normalizedUrl(canonical(html)), normalizedUrl(sitemapUrl), `Sitemap URL is not self-canonical: ${sitemapUrl}`)
  }

  console.log(`Production SEO smoke checks passed for ${sitemapUrls.length} sitemap URLs`)
}

void main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
