# Multilingual program

This program adds multilingual SEO pages without translating the signed-in product. The three phases share one locale contract and route strategy. Public pages and the WordPress blog use separate publication gates so an empty translated blog can never leak from an otherwise complete marketing locale.

## Status

| Phase | Scope | Status |
| --- | --- | --- |
| 1 | Core Next.js translation infrastructure | Complete |
| 2 | Core public pages and shared site chrome | Code complete; native/legal sign-off required before deployment |
| 3 | WordPress blog, localized slugs, and article SEO | Complete for all locales (en, fr, es, de, pt-BR) |

Only one phase is executed at a time. A later phase cannot publish until the previous phase's exit gate passes.

## Shared contract

### Locales

| Application locale | Public prefix | WordPress code | WordPress locale |
| --- | --- | --- | --- |
| `en` | none | `EN` | `en_US` |
| `fr` | `/fr` | `FR` | `fr_FR` |
| `es` | `/es` | `ES` | `es_ES` |
| `de` | `/de` | `DE` | `de_DE` |
| `pt-BR` | `/pt-br` | `PT` | `pt_BR` |

English remains at its existing URLs. `/en/...` is never canonical and redirects to the unprefixed English URL.

### Route ownership

- Localized: homepage, pricing, about, policies, public use-case pages, blog archive, and blog articles.
- Never localized in this program: `/login`, protected product routes, `/api`, `/auth`, `/error`, and development-only landing drafts.
- A language prefix on a product route is invalid. CTAs from translated pages still link to the unprefixed product route.

### Publication rules

- Supporting a locale in code does not make it public.
- A locale is added to the published-locale gate only after its complete phase QA passes.
- Blog publication is enabled for all 5 locales in `publishedBlogLocales`: `en`, `fr`, `es`, `de`, `pt-BR`.
- Never render English fallback copy at an indexable translated URL.
- Canonical URLs are self-referential for every published translation.
- `hreflang` includes only real, published equivalents; `x-default` points to English.
- Locale selection is explicit. Do not redirect crawlers or users from `/` based on IP or browser language.

### Content ownership

- Next.js message catalogs own shared UI and static public-page copy.
- WordPress owns blog titles, excerpts, content, categories, media, and translation relationships.
- Next.js owns public URLs, canonicals, `hreflang`, JSON-LD, Open Graph, and sitemap output.

### Quality gates

Every phase must pass:

1. Type checking and production build.
2. English URL regression checks.
3. Protected-route and API isolation checks.
4. Canonical, language, and indexability checks for affected public routes.
5. Mobile and desktop review when the phase changes visible UI.

## Phase handoffs

- [Phase 1: core infrastructure](./phase-1-core-infrastructure.md) establishes the locale contract and safe route boundary.
- [Phase 2: public pages](./phase-2-public-pages.md) supplies real localized page content and publishes locales.
- [Phase 3: WordPress blog](./phase-3-wordpress-blog.md) consumes the same published locales and URL helpers for CMS content.
- [WordPress revalidation](./wordpress-revalidation.md) defines the signed cache-invalidation contract.
- [Release checklist](./release-checklist.md) is the mandatory editorial, legal, and technical launch gate.
