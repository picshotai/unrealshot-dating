import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { LocalizedLegalPage, type LocalizedLegalCopy } from "@/components/LocalizedLegalPage"
import { makeBreadcrumbJsonLd, makeWebPageJsonLd, getLocalizedMetadata, publicUrl } from "@/lib/public-seo"
import { MultipleStructuredData } from "@/components/seo/StructuredData"
import type { PublishedPublicLocale } from "@/i18n/config"

type Params = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = (await params).locale as PublishedPublicLocale
  const t = await getTranslations({ locale, namespace: "Legal.privacy" })
  return getLocalizedMetadata({ locale, pathname: "/privacy-policy", title: t("meta.title"), description: t("meta.description") })
}

export default async function PrivacyPolicy({ params }: Params) {
  const locale = (await params).locale as PublishedPublicLocale
  const t = await getTranslations({ locale, namespace: "Legal.privacy" })
  const copy = {
    eyebrow: t("eyebrow"),
    heading: t("heading"),
    description: t("description"),
    dateLabel: t("dateLabel"),
    intro: t("intro"),
    sections: t.raw("sections") as Array<Record<string, unknown>>,
  }

  return (
    <>
      <LocalizedLegalPage copy={copy as LocalizedLegalCopy} />
      <MultipleStructuredData schemas={[{
        id: "privacy-webpage",
        data: makeWebPageJsonLd({
          name: t("heading"),
          description: t("description"),
          url: publicUrl("/privacy-policy", locale),
          locale,
          breadcrumbs: [
            { name: t("breadcrumbHome"), url: publicUrl("/", locale) },
            { name: t("heading"), url: publicUrl("/privacy-policy", locale) },
          ],
        }),
      }, {
        id: "privacy-breadcrumb",
        data: makeBreadcrumbJsonLd([
          { name: t("breadcrumbHome"), url: publicUrl("/", locale) },
          { name: t("heading"), url: publicUrl("/privacy-policy", locale) },
        ]),
      }]} />
    </>
  )
}
