import type { Metadata } from "next"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { Camera, ShieldCheck, RotateCcw, Sparkles } from "lucide-react"
import PublicHeader from "@/components/Header"
import Footer from "@/components/main-landing/Footer"
import { Button } from "@/components/ui/button"
import { MultipleStructuredData } from "@/components/seo/StructuredData"
import { getLocalizedMetadata, makeBreadcrumbJsonLd, makeWebPageJsonLd, publicUrl } from "@/lib/public-seo"
import type { PublishedPublicLocale } from "@/i18n/config"

type Params = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = (await params).locale as PublishedPublicLocale
  const t = await getTranslations({ locale, namespace: "About" })
  return getLocalizedMetadata({ locale, pathname: "/about", title: t("meta.title"), description: t("meta.description"), keywords: t.raw("meta.keywords") as string[] })
}

export default async function AboutUs({ params }: Params) {
  const locale = (await params).locale as PublishedPublicLocale
  const t = await getTranslations({ locale, namespace: "About" })
  const narrative = t.raw("narrative") as Array<{ label: string; heading: string; paragraphs: string[] }>
  const principles = t.raw("principles") as Array<{ title: string; description: string }>
  const icons = [Camera, Sparkles, RotateCcw, ShieldCheck]
  const breadcrumbs = [
    { name: t("breadcrumbHome"), url: publicUrl("/", locale) },
    { name: t("hero.titleAccent"), url: publicUrl("/about", locale) },
  ]

  return (
    <div className="min-h-screen bg-[#F7F5F3] font-[family-name:var(--font-inter)] text-gray-900">
      <PublicHeader />
      <main className="pt-20 md:pt-24 pb-16">
        <section className="px-4 py-16 sm:py-20 max-w-5xl mx-auto text-center">
          <p className="text-orange-500 font-bold uppercase tracking-wider text-xs sm:text-sm mb-3 block">{t("hero.eyebrow")}</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-[var(--font-inter-tight)] tracking-tight leading-[1.08] text-gray-900 mb-6 max-w-4xl mx-auto">
            {t("hero.title")} <br /> <span className="text-[#ff6f00]">{t("hero.titleAccent")}</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">{t("hero.description")}</p>
        </section>

        <section className="max-w-5xl mx-auto px-4 pb-16">
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_12px_50px_-15px_rgba(0,0,0,0.08)] p-8 sm:p-12 space-y-10">
            {narrative.map((section) => (
              <div key={section.label} className={section.label === narrative[0].label ? "" : "border-t border-gray-100 pt-8"}>
                <span className="text-xs font-mono uppercase tracking-wider text-[#ff6f00] font-bold block mb-2">{section.label}</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-4">{section.heading}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph} className="text-gray-600 text-base sm:text-lg leading-relaxed mt-4 first:mt-0">{paragraph}</p>)}
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 pb-16">
          <div className="text-center mb-10"><h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">{t("principlesHeading")}</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {principles.map((principle, index) => {
              const Icon = icons[index]
              return <div key={principle.title} className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#ff6f00]/10 flex items-center justify-center mb-4 text-[#ff6f00]"><Icon className="w-5 h-5" /></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{principle.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{principle.description}</p>
              </div>
            })}
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 text-center">
          <div className="bg-[#111111] rounded-3xl p-8 sm:p-12 text-white border-2 border-dashed border-zinc-800 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-[var(--font-inter-tight)]">{t("ctaHeading")}</h2>
            <p className="text-gray-300 text-base sm:text-lg max-w-xl mx-auto mb-8">{t("ctaDescription")}</p>
            <Link href="/dashboard"><Button className="group relative bg-[#ff6f00] hover:bg-[#ff6f00]/90 text-white rounded-md overflow-hidden cursor-pointer px-8 pr-16 py-6 font-semibold text-base shadow-lg shadow-orange-500/20">{t("cta")}</Button></Link>
          </div>
        </section>
      </main>
      <Footer />
      <MultipleStructuredData schemas={[{
        id: "about-webpage",
        data: makeWebPageJsonLd({ name: t("hero.titleAccent"), description: t("hero.description"), url: publicUrl("/about", locale), locale, breadcrumbs }),
      }, { id: "about-breadcrumb", data: makeBreadcrumbJsonLd(breadcrumbs) }]} />
    </div>
  )
}

