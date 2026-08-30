The multilingual foundation is good, but Phase 3 is not SEO-safe enough to deploy unchanged. I found two launch blockers and several important hardening issues.

## Launch blockers

1. **Translated article `hreflang` URLs are broken.**

The article creates already-localized paths such as `/fr/blog/...` at [page.tsx](<D:/tutorial/2026/aug2026/unrealshotai/app/[locale]/(public)/blog/[slug]/page.tsx:47>), then [public-seo.ts](D:/tutorial/2026/aug2026/unrealshotai/lib/public-seo.ts:16) localizes them again.

Production-rendered result:

```text
/fr/fr/blog/7-erreurs-frequentes...
```

Both English and French articles output that invalid French alternate. Google requires self-referencing and reciprocal valid URLs in each `hreflang` group. [Google’s hreflang documentation](https://developers.google.com/search/docs/advanced/crawling/localized-versions?hl=en)

Use two separate maps:

- Unprefixed internal paths for SEO: `/blog/french-slug`
- Fully localized browser paths for the language switcher: `/fr/blog/french-slug`

Do not pass the switcher map into `getPublicAlternates()`.

2. **Empty blog locales are indexable and included in `hreflang`.**

Current WordPress content:

- English: 7 posts
- French: 1 post
- Spanish: 0
- German: 0
- Portuguese: 0

Nevertheless, `/es/blog`, `/de/blog`, and `/pt-br/blog` return:

```text
200
robots: index, follow
self-canonical
```

The metadata is created unconditionally at [blog/page.tsx](<D:/tutorial/2026/aug2026/unrealshotai/app/[locale]/(public)/blog/page.tsx:33>), while empty content is rendered at [blog/page.tsx](<D:/tutorial/2026/aug2026/unrealshotai/app/[locale]/(public)/blog/page.tsx:132>).

Create a separate `publishedBlogLocales` policy. Until a language has meaningful published content:

- Exclude its archive from blog `hreflang`
- Exclude it from blog switching
- Return `noindex` or 404 for that archive
- Don’t include it in the blog sitemap

Core Spanish/German/Portuguese pages can remain published independently.

## Important fixes

3. **Blog archives are absent from the sitemap.**

The sitemap’s public route list at [sitemap.ts](D:/tutorial/2026/aug2026/unrealshotai/app/sitemap.ts:14) does not contain `/blog`.

The generated sitemap had 43 URLs—35 static pages plus 8 articles—but neither `/blog` nor `/fr/blog`.

4. **Static sitemap dates are misleading.**

Every static URL receives `new Date()` whenever the sitemap regenerates at [sitemap.ts](D:/tutorial/2026/aug2026/unrealshotai/app/sitemap.ts:63). That falsely tells Google all 35 pages changed every ten minutes.

Omit `lastModified` until you have a real content/deployment modification date. Google says it uses `lastmod` only when it is consistently accurate. [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap?hl=en)

5. **A WordPress outage becomes a translated-article 404.**

On localized fetch failure, [wordpress-cms.ts](D:/tutorial/2026/aug2026/unrealshotai/lib/wordpress-cms.ts:290) returns `null`; the article then executes `notFound()` at [page.tsx](<D:/tutorial/2026/aug2026/unrealshotai/app/[locale]/(public)/blog/[slug]/page.tsx:121>).

That incorrectly treats “WordPress unavailable” as “article does not exist.” It can generate crawlable 404s during an outage. Distinguish:

- Actual empty GraphQL result → 404
- Timeout/HTTP/GraphQL failure → 503 or error boundary

Archive failures similarly return an indexable 200 error page.

6. **Sitemap publishing is vulnerable to stale/partial WordPress cache.**

The source-level sitemap function currently calculates the correct French URL, but the production artifact generated from the existing Next cache listed the French slug without `/fr` and without alternates.

Add an authenticated WordPress publish webhook that revalidates:

- Locale archive
- Original and translated articles
- Sitemap/cache tags

At minimum, make sitemap generation fail safely rather than silently emitting partial data at [wordpress-cms.ts](D:/tutorial/2026/aug2026/unrealshotai/lib/wordpress-cms.ts:338).

7. **Organization logo points to a missing file.**

[seo.ts](D:/tutorial/2026/aug2026/unrealshotai/config/seo.ts:106) references `/logo.png`, but that file does not exist. The real asset is `/site-logo.png`. The same broken reference appears in the Open Graph logo configuration.

8. **Cursor pages canonicalize to the first archive page.**

`/blog?after=...` renders different posts, but metadata ignores `searchParams` and always canonicalizes to `/blog`. Use stable page-number URLs with self-canonicals, or deliberately `noindex` cursor pages while ensuring every article remains discoverable through the sitemap.

## Lower-priority cleanup

- Article fallback social images produce `//placeholder.svg` at [page.tsx](<D:/tutorial/2026/aug2026/unrealshotai/app/[locale]/(public)/blog/[slug]/page.tsx:80>). Use a proper raster social image.
- Shared structured data uses `next/script` and is absent as ordinary JSON-LD in the initial HTML. Next.js recommends a native `<script type="application/ld+json">` in the page/layout. [Next.js JSON-LD guidance](https://nextjs.org/docs/app/guides/json-ld)
- JSON-LD serialization should replace `<` with `\u003c`, especially for WordPress-provided titles and excerpts.
- The footer still contains English `"All rights reserved"` in every locale at [Footer.tsx](D:/tutorial/2026/aug2026/unrealshotai/components/main-landing/Footer.tsx:136).
- `NEXT_PUBLIC_APP_URL` currently equals `http://localhost:3000`. That is correct locally, but production must explicitly use `https://www.unrealshot.com`; otherwise canonicals, sitemap URLs and structured data will be poisoned.
- Spanish and French are currently region-targeted as `es-ES` and `fr-FR`. If the content targets all Spanish/French speakers rather than Spain/France specifically, consider language-only `es` and `fr`.
- Legal-page catalog completeness passed, but translation accuracy and legal validity still require native/legal review.

## What passed

- Phase 1 locale routing and canonical redirects are sound.
- English remains unprefixed.
- `/en/...` and `/pt-BR/...` redirect to canonical forms.
- Product, authentication and API routes remain unprefixed.
- Static pages have correct localized `lang`, canonicals and alternate links.
- WordPress archive filtering works by locale.
- English/French article relationships and the article language switcher work.
- All five message catalogs pass the structural contract.
- Production build passed and generated 83 pages.
- No multilingual-specific TypeScript errors appeared.

The repository-wide TypeScript check still fails in unrelated existing modules, while [next.config.mjs](D:/tutorial/2026/aug2026/unrealshotai/next.config.mjs:13) suppresses those errors during builds.

My recommendation: publish the static multilingual pages after language/legal review, but hold the multilingual blog release until items 1–6 are fixed and production-rendered output is retested. I did not modify any files during this audit.

::code-comment{title="[P1] Double-localized article hreflang" body="alternatePathMap returns browser paths that already contain locale prefixes, but getPublicAlternates passes them through publicUrl and localizes them again. The rendered French alternate becomes /fr/fr/blog/..., invalidating the reciprocal hreflang set." file="D:/tutorial/2026/aug2026/unrealshotai/app/[locale]/(public)/blog/[slug]/page.tsx" start=47 end=53 priority=1}

::code-comment{title="[P1] Empty archives remain indexable" body="Metadata is generated as indexable for every published public locale without checking whether that locale has any WordPress posts. Spanish, German, and Portuguese archives currently return indexable 200 empty pages and are advertised as hreflang equivalents." file="D:/tutorial/2026/aug2026/unrealshotai/app/[locale]/(public)/blog/page.tsx" start=33 end=44 priority=1}

::code-comment{title="[P2] Blog archives missing from sitemap" body="The localized public path list omits /blog, so neither the English nor localized archive routes appear in sitemap.xml even though article URLs are included." file="D:/tutorial/2026/aug2026/unrealshotai/app/sitemap.ts" start=14 end=22 priority=2}

::code-comment{title="[P2] Upstream failure becomes a 404" body="Localized WordPress request failures return null, which the article page interprets as a missing post. Distinguish a successful empty result from an upstream failure and return a retryable error/503 for the latter." file="D:/tutorial/2026/aug2026/unrealshotai/lib/wordpress-cms.ts" start=290 end=297 priority=2}