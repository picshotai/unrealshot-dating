import { notFound } from "next/navigation"
import { getRequestConfig } from "next-intl/server"
import {
  defaultLocale,
  isAppLocale,
  isPublishedPublicLocale,
  type PublishedPublicLocale,
} from "./config"
import { formats } from "./formats"

const messageLoaders = {
  en: () => import("../messages/en.json").then((module) => module.default),
  fr: () => import("../messages/fr.json").then((module) => module.default),
  es: () => import("../messages/es.json").then((module) => module.default),
  de: () => import("../messages/de.json").then((module) => module.default),
  "pt-BR": () => import("../messages/pt-BR.json").then((module) => module.default),
} satisfies Record<PublishedPublicLocale, () => Promise<Record<string, unknown>>>

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale
  const locale = requestedLocale ?? defaultLocale

  if (!isAppLocale(locale) || !isPublishedPublicLocale(locale)) {
    notFound()
  }

  return {
    formats,
    locale,
    messages: await messageLoaders[locale](),
  }
})
