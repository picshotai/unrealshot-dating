# Phase 2 — Core public pages

## Objective

Translate and localize the complete public marketing surface, then publish each locale only after its route set is complete and reviewed.

## Dependency

Phase 1 must be complete. This phase uses its locale registry, navigation wrappers, published-locale gate, and URL helpers. It must not introduce a second locale mapping.

## Route inventory

| Priority | Route | Notes |
| --- | --- | --- |
| 1 | `/` | Homepage, product schema, FAQ schema, primary conversion page |
| 1 | `/pricing` | Pricing copy, currency presentation, FAQ/schema |
| 1 | `/use-case/dating-photos` | Primary SEO landing page |
| 2 | `/about` | Brand and trust content |
| 3 | `/privacy-policy` | Requires legal review per language |
| 3 | `/terms` | Requires legal review per language |
| 3 | `/refund-policy` | Requires legal review per language |

The blog routes remain structurally localized but their content work belongs to Phase 3.

## Workstreams

### Shared chrome

- Extract header, navigation, footer, CTA, error, empty-state, and accessibility strings into stable namespaces.
- Replace hardcoded internal public links with locale-aware navigation.
- Keep login and product CTAs unprefixed.
- Add an accessible language switcher that stays on the equivalent page.

### Page content

- Split large page copy into page-specific message namespaces rather than one global file.
- Translate full sentences and ICU messages; do not concatenate grammatical fragments.
- Localize image alt text, headings, buttons, FAQ content, structured-data text, and validation/error copy.
- Keep product facts synchronized across catalogs using a review checklist.

### SEO

- Generate localized title, description, canonical, Open Graph locale, and Twitter metadata per route.
- Add reciprocal `hreflang` plus `x-default` for complete equivalents.
- Localize JSON-LD while keeping stable organization identity and offer facts.
- Extend the sitemap with localized page entries and alternates.
- Remove sitemap or navigation references to routes that do not exist.

### Publication sequence

Recommended order: French, Spanish, German, Brazilian Portuguese. A locale is published atomically only after all routes above are ready.

## Translation workflow

1. Freeze the English source namespace for the batch.
2. Produce a translation draft using the approved glossary.
3. Review search intent, titles, CTAs, product terminology, and cultural phrasing.
4. Review legal pages separately.
5. Run key-parity validation against English.
6. Perform responsive visual review and metadata inspection.
7. Add the locale to the published-locale gate and sitemap.

## Verification

- Every published locale has all required routes and no English fallback copy.
- Header/footer links preserve the active locale; product CTAs intentionally leave it.
- Page switching is reciprocal and does not send users to the homepage unexpectedly.
- Canonicals and alternate links resolve with 200 responses.
- No missing message keys, clipped CTA text, broken structured data, or stale English metadata.
- English rankings remain protected by unchanged English URLs.
- No actual content is to be deleted, every bit of content is to be preserved exactly while transiting in multiple languages.

## Exit gate

Phase 2 is complete when every selected public-page locale passes content, SEO, accessibility, responsive, and legal review. Phase 3 may then expose translated blog routes using the same published locale set.

