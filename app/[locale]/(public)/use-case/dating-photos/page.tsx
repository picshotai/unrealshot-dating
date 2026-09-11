import type { Metadata } from "next"
import { notFound } from "next/navigation"
import DatingPhotosHubPage from "@/components/seo/DatingPhotosHubPage"
import { datingHubCopy, type DatingHubLocale } from "@/lib/dating-hub-copy"
import { getLocalizedMetadata } from "@/lib/public-seo"
import { isPublishedPublicLocale } from "@/i18n/config"

type Params = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = (await params).locale
  if (!isPublishedPublicLocale(locale)) return { robots: { index: false, follow: false } }
  const copy = datingHubCopy[locale]
  return getLocalizedMetadata({
    locale,
    pathname: "/dating-photos",
    title: copy.meta.title,
    description: copy.meta.description,
  })
}

export default async function DatingPhotosPage({ params }: Params) {
  const locale = (await params).locale
  if (!isPublishedPublicLocale(locale)) notFound()
  return <DatingPhotosHubPage locale={locale as DatingHubLocale} />
}
