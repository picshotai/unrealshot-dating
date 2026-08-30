# Phase 3 — Multilingual WordPress blog

## Objective

Render WordPress posts by locale, connect equivalent article URLs, and generate complete multilingual article SEO without changing WordPress's role as the CMS.

## Dependency

Phases 1 and 2 must be complete. This phase reuses their locale registry, published-locale gate, language switcher, SEO URL helpers, and shared blog-interface messages.

## CMS contract

WordPress provides:

- Post `language { code locale }`.
- Published `translations` with localized slugs.
- Localized title, excerpt, content, featured media, author, categories, and dates.

Next.js must map application locale `pt-BR` to WordPress code `PT`; it must not infer GraphQL enum values by uppercasing route strings.

## Data-layer changes

- Replace the hard-coded endpoint with a validated `WORDPRESS_API_URL` fallback configuration.
- Consolidate or remove the unused duplicate WordPress client under `app/lib`.
- Extend WordPress types with language and translation summaries.
- Implement locale-aware archive, article, and static-param queries.
- Fetch an article by both localized slug and locale; never rely on a potentially ambiguous slug alone.
- Return published translations only.
- Do not render synthetic fallback posts on any SEO-facing route. Upstream failures must throw; only a successful empty lookup is a genuine 404.

## Archive behavior

- Render `/blog` from English posts and locale-prefixed archives from the matching WordPress language.
- Replace the current nonfunctional Load More control with real cursor pagination or numbered archive pages.
- Localize archive headings, empty/error states, categories, dates, reading time, and card links.

## Article behavior

- Resolve the requested slug within the requested language.
- Use the WordPress translation relationship for the language switcher.
- Disable or omit languages without a published equivalent instead of sending users to a generic homepage.
- Localize back links, author labels, share text, CTAs, and reading-time formatting.

## Article SEO

- Self-canonicalize every localized article.
- Generate reciprocal alternate links from real translation relationships plus English `x-default`.
- Set Open Graph locale and alternate locales.
- Set JSON-LD `inLanguage`, localized headline/description, correct URL IDs, and localized article/blog relationships.
- Generate sitemap entries from all published post translations, using WordPress modified dates and alternates.

## Cache and publication

- Retain ISR as the baseline and define a single cache-tag strategy for archives, articles, and sitemap data.
- Use the authenticated, timestamped HMAC WordPress revalidation webhook for publish-time consistency.
- A new WordPress translation is not considered live until the Next.js route, metadata, switcher, and sitemap all resolve.

## Verification fixture

Use the existing linked pair:

- English: `7-common-dating-profile-photo-mistakes-and-how-ai-fixes-them`
- French: `7-erreurs-frequentes-sur-les-photos-de-profil-de-rencontre-et-comment-lia-peut-les-corriger`

Verify archive filtering, both article directions, switcher targets, canonicals, alternates, JSON-LD, and sitemap output.

## Exit gate

Phase 3 is complete when published translations are discoverable only at their intended locale URLs, every equivalent article links reciprocally, missing translations fail safely, and WordPress publishing reliably updates the frontend without duplicate or fallback content.
