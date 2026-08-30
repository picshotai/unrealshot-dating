"use client"

import { usePathname } from "@/i18n/navigation"
import {
  isBlogArchivePathname,
  isPhase2LocalizedPathname,
  localeDefinitions,
  localizePublicPathname,
  publishedBlogLocales,
  publishedPublicLocales,
  splitLocalePathname,
  type AppLocale,
  type PublishedPublicLocale,
} from "@/i18n/config"
import { useLocale, useTranslations } from "next-intl"
import type { ChangeEvent } from "react"

export interface LocaleSwitcherProps {
  availableLocales?: readonly PublishedPublicLocale[]
  localizedPaths?: Partial<Record<PublishedPublicLocale, string>>
}

export function LocaleSwitcher({ availableLocales: requestedLocales, localizedPaths }: LocaleSwitcherProps = {}) {
  const pathname = usePathname()
  const currentLocale = useLocale() as AppLocale
  const t = useTranslations("Common")
  const publicPathname = splitLocalePathname(pathname).pathname
  const availableLocales = requestedLocales ?? (
    isBlogArchivePathname(pathname)
      ? publishedBlogLocales
      : isPhase2LocalizedPathname(pathname)
      ? publishedPublicLocales
      : (["en"] as const)
  )

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value as AppLocale
    const localizedPathname = localizedPaths?.[nextLocale]
      ?? localizePublicPathname(publicPathname, nextLocale)
    window.location.assign(`${localizedPathname}${window.location.search}${window.location.hash}`)
  }

  return (
    <label className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600">
      <span className="sr-only">{t("language")}</span>
      <span aria-hidden="true">◎</span>
      <select
        value={currentLocale}
        onChange={handleChange}
        className="cursor-pointer bg-transparent py-2 outline-none"
        aria-label={t("language")}
      >
        {availableLocales.map((locale) => (
          <option key={locale} value={locale}>
            {localeDefinitions[locale].nativeName}
          </option>
        ))}
      </select>
    </label>
  )
}
