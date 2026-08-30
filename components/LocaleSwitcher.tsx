"use client"

import { usePathname, useRouter } from "@/i18n/navigation"
import { useTransition } from "react"
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
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
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
    const localizedPathname =
      localizedPaths?.[nextLocale] ??
      localizePublicPathname(publicPathname, nextLocale)

    startTransition(() => {
      router.replace(localizedPathname, { scroll: false })
    })
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
          className="group inline-flex items-center gap-1.5 rounded-full border border-gray-200/90 bg-white/90 px-2.5 py-1.5 text-xs font-semibold text-gray-700 shadow-2xs backdrop-blur-md transition-all hover:border-gray-300 hover:bg-gray-50/90 hover:text-gray-950 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#ff6f00]/30 cursor-pointer select-none"
          aria-label={t("language")}
        >
          <Globe className="h-3.5 w-3.5 text-gray-500 transition-colors group-hover:text-gray-700" />
          <span className="hidden sm:inline font-medium">{currentBadge.flag}</span>
          <span className="font-semibold text-gray-800">{currentBadge.code}</span>
          <ChevronDown className="h-3 w-3 text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="min-w-[190px] rounded-xl border border-gray-200/80 bg-white/98 p-1.5 shadow-xl backdrop-blur-xl z-70 animate-in fade-in-0 zoom-in-95"
        >
          <div className="px-2.5 py-1.5 text-[11px] font-medium tracking-wide text-gray-400 uppercase">
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
                  "flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium cursor-pointer transition-colors outline-hidden",
                  isCurrent
                    ? "bg-orange-50/80 font-semibold text-[#ff6f00]"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-950"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">{badge?.flag || "🌐"}</span>
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

