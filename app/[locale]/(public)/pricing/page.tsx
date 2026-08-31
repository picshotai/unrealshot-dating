import type { Metadata } from "next"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { Check, HelpCircle, Lock, Sparkles } from "lucide-react"
import PublicHeader from "@/components/Header"
import Footer from "@/components/main-landing/Footer"
import { Button } from "@/components/ui/button"
import { MultipleStructuredData } from "@/components/seo/StructuredData"
import { getLocalizedMetadata, makeBreadcrumbJsonLd, makeFaqJsonLd, makeSoftwareApplicationJsonLd, makeWebPageJsonLd, publicUrl } from "@/lib/public-seo"
import type { PublishedPublicLocale } from "@/i18n/config"

type Params = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = (await params).locale as PublishedPublicLocale
  const t = await getTranslations({ locale, namespace: "Pricing" })
  return getLocalizedMetadata({ locale, pathname: "/pricing", title: t("meta.title"), description: t("meta.description") })
}

export default async function PricingPage({ params }: Params) {
  const locale = (await params).locale as PublishedPublicLocale
  const t = await getTranslations({ locale, namespace: "Pricing" })
  const packageFeatures = t.raw("package.features") as string[]
  const checkoutFeatures = t.raw("package.checkoutFeatures") as string[]
  const stats = t.raw("package.stats") as Array<{ value: string; label: string }>
  const workflowItems = t.raw("workflow.items") as string[][]
  const pricingFaqs = t.raw("faq.items") as Array<{ question: string; answer: string }>
  const breadcrumbs = [
    { name: t("breadcrumbHome"), url: publicUrl("/", locale) },
    { name: t("hero.eyebrow"), url: publicUrl("/pricing", locale) },
  ]

  return (
    <div className="min-h-screen bg-[#F7F5F3] font-[family-name:var(--font-inter)] text-gray-900">
      <PublicHeader />
      <main className="pt-20 md:pt-24 pb-20">
        <section className="px-4 py-12 sm:py-16 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 text-[#ff6f00] text-xs font-bold uppercase tracking-wider mb-4 border border-orange-500/20"><Sparkles className="w-3.5 h-3.5" /><span>{t("hero.eyebrow")}</span></div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-[var(--font-inter-tight)] tracking-tight leading-[1.08] text-gray-900 mb-5 max-w-4xl mx-auto">{t("hero.title")} <br className="hidden sm:block" /><span className="text-[#ff6f00]">{t("hero.titleAccent")}</span></h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">{t("hero.description")}</p>
        </section>

        <section className="max-w-6xl mx-auto px-4 pb-20">
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_12px_50px_-15px_rgba(0,0,0,0.08)] overflow-hidden grid lg:grid-cols-12">
            <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-100">
              <div>
                <div className="flex items-center justify-between gap-4 mb-6"><span className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff6f00]">{t("package.label")}</span><span className="text-xs font-semibold px-2.5 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">{t("package.popular")}</span></div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 font-[var(--font-inter-tight)]">{t("package.heading")}</h2>
                <p className="text-gray-600 text-sm mb-8 leading-relaxed">{t("package.description")}</p>
                <div className="space-y-4">{packageFeatures.map((feature) => <div key={feature} className="flex items-start gap-3"><div className="w-5 h-5 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-[#ff6f00]"><Check className="w-3.5 h-3.5 stroke-[3]" /></div><span className="text-sm text-gray-700 leading-snug">{feature}</span></div>)}</div>
              </div>
              <div className="mt-10 pt-6 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">{stats.map((stat) => <div key={stat.label} className="p-3 bg-gray-50 rounded-2xl border border-gray-100"><div className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</div><div className="text-[11px] text-gray-500 font-medium">{stat.label}</div></div>)}</div>
            </div>

            <div className="lg:col-span-5 bg-gradient-to-br from-[#111111] to-[#181818] p-8 sm:p-12 flex flex-col justify-between text-white relative">
              <div>
                <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-orange-400 mb-6">{t("package.instant")}</div>
                <div className="mb-6"><div className="flex items-baseline gap-2"><span className="text-5xl sm:text-6xl font-bold tracking-tight text-white">{t("package.price")}</span><span className="text-gray-400 text-sm">{t("package.priceSuffix")}</span></div><p className="text-gray-400 text-xs mt-2">{t("package.priceNote")}</p></div>
                <div className="space-y-3.5 my-8">{checkoutFeatures.map((feature) => <div key={feature} className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-[#ff6f00] flex-shrink-0" /><span>{feature}</span></div>)}</div>
              </div>
              <div><Link href="/dashboard" className="block w-full"><Button className="w-full group relative bg-[#ff6f00] hover:bg-[#ff6f00]/90 text-white rounded-xl overflow-hidden cursor-pointer py-6 font-bold text-base shadow-xl shadow-orange-500/20 active:scale-[0.99] transition-all">{t("package.cta")}</Button></Link><div className="mt-6 flex flex-col items-center gap-2 text-center text-xs text-gray-400"><div className="flex items-center justify-center gap-2 text-gray-300"><Lock className="w-3.5 h-3.5 text-green-400" /><span>{t("package.secure")}</span></div><p className="text-[11px] text-gray-500">{t("package.guarantee")}</p></div></div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 pb-20"><div className="text-center max-w-3xl mx-auto mb-12"><p className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff6f00] mb-2">{t("workflow.eyebrow")}</p><h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight font-[var(--font-inter-tight)]">{t("workflow.heading")}</h2></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{workflowItems.map((item, index) => <div key={item[0]} className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm"><div className="w-10 h-10 rounded-xl bg-orange-50 text-[#ff6f00] flex items-center justify-center font-bold text-sm mb-4 border border-orange-100">{String(index + 1).padStart(2, "0")}</div><h3 className="font-bold text-gray-900 text-base mb-2">{item[0]}</h3><p className="text-gray-600 text-xs leading-relaxed">{item[1]}</p></div>)}</div></section>

        <section className="max-w-4xl mx-auto px-4 pb-20"><div className="text-center mb-12"><p className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff6f00] mb-2">{t("faq.eyebrow")}</p><h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight font-[var(--font-inter-tight)]">{t("faq.heading")}</h2></div><div className="space-y-4">{pricingFaqs.map((faq) => <div key={faq.question} className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm hover:border-gray-300 transition-colors"><h3 className="text-base font-bold text-gray-900 mb-2.5 flex items-start gap-2.5"><HelpCircle className="w-4 h-4 text-[#ff6f00] mt-1 flex-shrink-0" /><span>{faq.question}</span></h3><p className="text-gray-600 text-sm leading-relaxed pl-6.5">{faq.answer}</p></div>)}</div></section>

        <section className="max-w-5xl mx-auto px-4"><div className="bg-[#111111] rounded-3xl p-8 sm:p-12 text-white text-center border-2 border-dashed border-zinc-800 shadow-2xl"><h2 className="text-3xl sm:text-4xl font-bold mb-3 font-[var(--font-inter-tight)]">{t("cta.heading")}</h2><p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">{t("cta.description")}</p><Link href="/dashboard"><Button className="group relative bg-[#ff6f00] hover:bg-[#ff6f00]/90 text-white rounded-md overflow-hidden cursor-pointer px-8 pr-16 py-6 font-semibold text-base shadow-lg shadow-orange-500/20">{t("cta.button")}</Button></Link></div></section>
      </main>
      <Footer />
      <MultipleStructuredData schemas={[{ id: "pricing-webpage", data: makeWebPageJsonLd({ name: t("hero.title"), description: t("meta.description"), url: publicUrl("/pricing", locale), locale, breadcrumbs }) }, { id: "pricing-breadcrumb", data: makeBreadcrumbJsonLd(breadcrumbs) }, { id: "pricing-application", data: makeSoftwareApplicationJsonLd({ description: t("schema.description"), url: publicUrl("/pricing", locale), locale, features: packageFeatures }) }, { id: "pricing-faq", data: makeFaqJsonLd(pricingFaqs) }]} />
    </div>
  )
}
