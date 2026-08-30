import { defineRouting } from "next-intl/routing"
import { appLocales, defaultLocale } from "./config"

export const routing = defineRouting({
  locales: appLocales,
  defaultLocale,
  localePrefix: {
    mode: "as-needed",
    prefixes: {
      "pt-BR": "/pt-br",
    },
  },
  localeDetection: false,
  localeCookie: false,
  // Phase 2 owns complete page-level hreflang output. Advertising every
  // configured locale here would expose unpublished URLs during Phase 1.
  alternateLinks: false,
})
