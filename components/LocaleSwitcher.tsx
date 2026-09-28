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
import { Globe, ChevronDown, Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export interface LocaleSwitcherProps {
  availableLocales?: readonly PublishedPublicLocale[]
  localizedPaths?: Partial<Record<PublishedPublicLocale, string>>
  className?: string
}

const localeBadges: Record<AppLocale, { flag: string; label: string; code: string }> = {
  en: { flag: "🇺🇸", label: "English", code: "EN" },
  fr: { flag: "🇫🇷", label: "Français", code: "FR" },
  es: { flag: "🇪🇸", label: "Español", code: "ES" },
  de: { flag: "🇩🇪", label: "Deutsch", code: "DE" },
  "pt-BR": { flag: "🇧🇷", label: "Português (BR)", code: "PT" },
}

export function LocaleSwitcher({
  availableLocales: requestedLocales,
  localizedPaths,
  className,
}: LocaleSwitcherProps = {}) {
  const pathname = usePathname()
  const currentLocale = (useLocale() as AppLocale) || "en"
  const t = useTranslations("Common")
  const publicPathname = splitLocalePathname(pathname).pathname

  const availableLocales = requestedLocales ?? (
    isBlogArchivePathname(pathname)
      ? publishedBlogLocales
      : isPhase2LocalizedPathname(pathname)
      ? publishedPublicLocales
      : (["en"] as const)
  )

  const handleSelect = (nextLocale: AppLocale) => {
    if (nextLocale === currentLocale) return

    if (localizedPaths?.[nextLocale]) {
      const search = typeof window !== "undefined" ? window.location.search : ""
      const hash = typeof window !== "undefined" ? window.location.hash : ""
      window.location.assign(`${localizedPaths[nextLocale]}${search}${hash}`)
      return
    }

    const currentBrowserPath = typeof window !== "undefined" ? window.location.pathname : pathname
    const cleanPath = splitLocalePathname(currentBrowserPath).pathname
    const targetUrl = localizePublicPathname(cleanPath, nextLocale)
    const search = typeof window !== "undefined" ? window.location.search : ""
    const hash = typeof window !== "undefined" ? window.location.hash : ""

    window.location.assign(`${targetUrl}${search}${hash}`)
  }

  const currentBadge = localeBadges[currentLocale] || {
    flag: "🌐",
    label: localeDefinitions[currentLocale]?.nativeName || currentLocale,
    code: currentLocale.toUpperCase(),
  }

  return (
    <div className={cn("relative inline-flex items-center", className)}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          className="group inline-flex h-10 cursor-pointer select-none items-center gap-1.5 rounded-full px-3 text-[13px] font-medium text-white/65 transition-colors hover:bg-white/[0.07] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6f00] data-[state=open]:bg-white/[0.07] data-[state=open]:text-white"
          aria-label={t("language")}
        >
          <Globe className="size-4" aria-hidden="true" />
          <span>{currentBadge.code}</span>
          <ChevronDown className="size-3 opacity-60 transition-transform duration-200 group-data-[state=open]:rotate-180" aria-hidden="true" />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="z-70 min-w-[180px] rounded-2xl border border-white/10 bg-[#141414]/95 p-1.5 text-zinc-300 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl"
        >
          <div className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40">
            {t("language")}
          </div>
          {availableLocales.map((locale) => {
            const badge = localeBadges[locale]
            const isCurrent = locale === currentLocale
            return (
              <DropdownMenuItem
                key={locale}
                onClick={() => handleSelect(locale)}
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded-xl px-2.5 py-2 text-[13px] outline-hidden transition-colors focus:bg-white/[0.06] focus:text-white",
                  isCurrent ? "font-medium text-white" : "text-zinc-300"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 font-mono text-[11px] text-white/40">{badge?.code}</span>
                  <span>{badge?.label || localeDefinitions[locale]?.nativeName}</span>
                </div>
                {isCurrent && <Check className="h-3.5 w-3.5 text-[#ff6f00]" />}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

