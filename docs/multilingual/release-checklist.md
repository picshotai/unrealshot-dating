# Multilingual release checklist

No locale is promoted merely because a message catalog or WordPress translation exists.

## Public-page locale promotion

- All seven public routes return 200 in the locale.
- Copy, metadata, image alternatives, navigation, validation messages, and structured data are translated.
- A native reviewer has signed off search intent, terminology, grammar, and cultural phrasing.
- Privacy policy, terms, and refund policy have separate legal sign-off for the locale.
- Canonical, `hreflang`, Open Graph, JSON-LD, sitemap, responsive, and accessibility checks pass.

## Blog-locale promotion

- A useful initial set of reviewed posts is published; an empty archive is never promoted.
- WordPress titles, excerpts, bodies, categories, media alternatives, and slugs are localized.
- Every translated post is linked to its source through Polylang.
- Archive filtering, article lookup, switcher targets, reciprocal alternates, JSON-LD, and sitemap entries pass.
- The companion plugin ZIP is installed and its Tools > Unrealshot Revalidation test reports success.
- The signed webhook is verified for publish, update, slug change, unpublish, trash, restore, and force-delete events.
- Only then add the locale to `publishedBlogLocales` in `i18n/config.ts`.

## Automated release gate

Run:

```text
npm run check:i18n
npm run check:seo
npm run check:wordpress-plugin
npx tsc --noEmit
npm run build
```

After starting the production build locally, run the production SEO smoke test. All sitemap URLs must return 200 and self-canonicalize, no alternate may repeat a locale prefix, non-published blog locales must return 404/noindex, and JSON-LD assets must return 200.
