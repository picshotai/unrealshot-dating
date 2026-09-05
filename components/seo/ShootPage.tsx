import PublicHeader from "@/components/Header"
import Footer from "@/components/main-landing/Footer"
import { MultipleStructuredData } from "@/components/seo/StructuredData"
import ShootLandingHero from "@/components/seo/shoot-landing/ShootLandingHero"
import ShootPainSolution from "@/components/seo/shoot-landing/ShootPainSolution"
import ShootResultsShowcase from "@/components/seo/shoot-landing/ShootResultsShowcase"
import ShootConversionSections from "@/components/seo/shoot-landing/ShootConversionSections"
import { getLocalizedShootPage } from "@/lib/dating-shoot-pages"
import { makeBreadcrumbJsonLd, makeFaqJsonLd, makeWebPageJsonLd, publicUrl } from "@/lib/public-seo"
import type { PublishedPublicLocale } from "@/i18n/config"

export default function ShootPage({ slug, locale }: { slug: string; locale: PublishedPublicLocale }) {
  const page = getLocalizedShootPage(slug, locale)
  if (!page) throw new Error(`Missing commercial landing content for ${slug}`)
  const { shoot, copy, ui, commonFaqs } = page

  const path = `/dating-photos/shoots/${shoot.slug}`
  const breadcrumbLabels = {
    en: ["Home", "Dating Photos", "Examples"],
    fr: ["Accueil", "Photos de rencontre", "Exemples"],
    es: ["Inicio", "Fotos para citas", "Ejemplos"],
    de: ["Startseite", "Dating-Fotos", "Beispiele"],
    "pt-BR": ["Início", "Fotos para namoro", "Exemplos"],
  }[locale]
  const breadcrumbs = [
    { name: breadcrumbLabels[0], url: publicUrl("/", locale) },
    { name: breadcrumbLabels[1], url: publicUrl("/dating-photos", locale) },
    { name: breadcrumbLabels[2], url: publicUrl("/dating-photos/examples", locale) },
    { name: shoot.name, url: publicUrl(path, locale) },
  ]
  const faqs = [...copy.faqs, ...commonFaqs]

  return (
    <div className="min-h-screen bg-white font-[family-name:var(--font-inter)] text-zinc-950">
      <PublicHeader />
      <main>
        <ShootLandingHero shoot={shoot} copy={copy} ui={ui} />
        <ShootPainSolution shoot={shoot} copy={copy} ui={ui} />
        <ShootResultsShowcase shoot={shoot} copy={copy} ui={ui} />
        <ShootConversionSections shoot={shoot} copy={copy} ui={ui} locale={locale} />
      </main>
      <Footer />
      <MultipleStructuredData schemas={[
        { id: `shoot-page-${locale}`, data: makeWebPageJsonLd({ name: copy.seoTitle, description: copy.seoDescription, url: publicUrl(path, locale), locale, breadcrumbs }) },
        { id: "shoot-breadcrumb", data: makeBreadcrumbJsonLd(breadcrumbs) },
        { id: "shoot-faq", data: makeFaqJsonLd(faqs) },
      ]} />
    </div>
  )
}
