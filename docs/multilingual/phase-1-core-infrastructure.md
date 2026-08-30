# Phase 1 — Core translation infrastructure

## Objective

Create a production-safe multilingual foundation while preserving every current English public URL and leaving all non-English public routes unpublished.

## Entry conditions

- WordPress exposes `languages`, post `language`, and `translations` through GraphQL.
- Existing WordPress posts are assigned to English.
- The application route and authentication proxy boundaries are known.

## Deliverables

### Locale contract

- Central typed locale registry for display names, BCP 47 values, public prefixes, Open Graph locale values, and WordPress GraphQL codes.
- Separate `supportedLocales` and `publishedPublicLocales` values.
- Pure helpers for locale validation, prefix stripping, public-route detection, and public URL generation.

### Next.js integration

- Install `next-intl` and connect its Next.js plugin.
- Use `localePrefix: as-needed` so English remains unprefixed.
- Disable automatic locale detection.
- Add request-scoped message loading and typed navigation wrappers.
- Use the route locale for the server-rendered `<html lang>` value.
- Move the existing `(public)` route group under `[locale]` without changing public English URLs.

### Safe proxy composition

- Run locale rewrites only for public routes.
- Preserve Supabase session-refresh cookies on localized public rewrites.
- Leave `/login`, product pages, protected routes, `/api`, and `/auth` unprefixed.
- Preserve all current onboarding and signed-in redirect behavior.

### Translation baseline

- Add the English default message catalog and type augmentation.
- Define shared formats for dates and numbers without translating visible pages yet.
- Add empty translation-catalog scaffolding only when Phase 2 begins; do not publish placeholders.

### Rollout protection

- Publish only `en` in Phase 1.
- Direct requests to `/fr`, `/es`, `/de`, and `/pt-br` must not render English content.
- Keep current sitemap output English-only until Phase 2.

## Verification

- `/`, `/about`, `/pricing`, `/blog`, and an English blog article keep their current URLs and return successfully.
- `/en` and `/en/about` normalize to `/` and `/about`.
- Non-English public routes do not return indexable English pages.
- `/login` is not rewritten to `/en/login`.
- `/dashboard` retains its unauthenticated redirect to `/login`.
- API routes are not locale-rewritten.
- Locale mappings are unique and the Portuguese mapping remains `pt-BR` → `/pt-br` → WordPress `PT`.
- Production build completes without route collisions.

## Exit gate

Phase 1 is complete only when the English site and product routing behave exactly as before, the locale foundation is type-safe, and unpublished locale URLs cannot leak duplicate English content.

## Completion record

Completed on 2026-08-30. The locale contract check and production build pass. The verified route matrix covers English public pages, canonical `/en` redirects, hard `404` responses with `noindex` for unpublished locales, unprefixed login and APIs, and the existing unauthenticated dashboard redirect. The repository still has pre-existing TypeScript diagnostics outside this phase; none point to the locale infrastructure, locale route tree, message catalog, Next.js integration, or composed proxy.

Phase 1 intentionally does not make the WordPress queries language-aware. Until Phase 3, a newly published WordPress translation can still be returned by the current unfiltered English blog query. Translated WordPress posts must not be considered frontend-live until the Phase 3 data contract and filtering are complete.

## Deferred to Phase 2

- Language switcher UI.
- Extracting hardcoded page and navigation copy.
- Non-English message catalogs.
- Localized page metadata, alternate links, and sitemap entries.
