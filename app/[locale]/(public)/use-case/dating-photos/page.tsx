import type { Metadata } from "next"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { AlertCircle, Check, Flame } from "lucide-react"
import PublicHeader from "@/components/Header"
import Footer from "@/components/main-landing/Footer"
import { Button } from "@/components/ui/button"
import { MultipleStructuredData } from "@/components/seo/StructuredData"
import { getLocalizedMetadata, makeBreadcrumbJsonLd, makeFaqJsonLd, makeWebPageJsonLd, publicUrl } from "@/lib/public-seo"
import type { PublishedPublicLocale } from "@/i18n/config"

type Params = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = (await params).locale as PublishedPublicLocale
  const t = await getTranslations({ locale, namespace: "DatingPhotos" })
  return getLocalizedMetadata({ locale, pathname: "/dating-photos", title: t("meta.title"), description: t("meta.description") })
}

export default async function DatingPhotosPage({ params }: Params) {
  const locale = (await params).locale as PublishedPublicLocale
  const t = await getTranslations({ locale, namespace: "DatingPhotos" })
  const proof = t.raw("hero.proof") as string[]
  const failItems = t.raw("comparison.failItems") as string[]
  const approachItems = t.raw("comparison.approachItems") as string[]
  const photoTypes = t.raw("slots.items") as Array<{ title: string; description: string; vibe: string; tag: string }>
  const faqs = t.raw("faq.items") as Array<{ question: string; answer: string }>
  const breadcrumbs = [
    { name: t("breadcrumbHome"), url: publicUrl("/", locale) },
    { name: t("hero.eyebrow"), url: publicUrl("/dating-photos", locale) },
  ]

  return (
    <div className="min-h-screen bg-[#F7F5F3] font-[family-name:var(--font-inter)] text-gray-900">
      <PublicHeader />
      <main className="pt-20 md:pt-24 pb-20">
        <section className="px-4 py-12 sm:py-16 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 text-[#ff6f00] text-xs font-bold uppercase tracking-wider mb-4 border border-orange-500/20"><Flame className="w-3.5 h-3.5" /><span>{t("hero.eyebrow")}</span></div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-[var(--font-inter-tight)] tracking-tight leading-[1.08] text-gray-900 mb-5 max-w-4xl mx-auto">{t("hero.title")} <br className="hidden sm:block" /><span className="text-[#ff6f00]">{t("hero.titleAccent")}</span></h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">{t("hero.description")}</p>
          <Link href="/dashboard"><Button className="group relative bg-[#ff6f00] hover:bg-[#ff6f00]/90 text-white rounded-md overflow-hidden cursor-pointer px-8 pr-16 py-6 font-semibold text-base shadow-lg shadow-orange-500/20">{t("hero.button")}</Button></Link>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">{proof.map((item) => <span key={item} className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-600" />{item}</span>)}</div>
        </section>

        <section className="max-w-6xl mx-auto px-4 pb-20"><div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-red-200/80 shadow-sm"><div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold mb-4 border border-red-100"><AlertCircle className="w-3.5 h-3.5" /><span>{t("comparison.failLabel")}</span></div><h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 font-[var(--font-inter-tight)]">{t("comparison.failHeading")}</h2><ul className="space-y-3 text-sm text-gray-600">{failItems.map((item) => <li key={item} className="flex items-start gap-2.5"><span className="text-red-500 font-bold">✕</span><span>{item}</span></li>)}</ul></div>
          <div className="bg-white rounded-3xl p-8 border border-green-200/80 shadow-sm"><div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold mb-4 border border-green-100"><Check className="w-3.5 h-3.5" /><span>{t("comparison.approachLabel")}</span></div><h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 font-[var(--font-inter-tight)]">{t("comparison.approachHeading")}</h2><ul className="space-y-3 text-sm text-gray-600">{approachItems.map((item) => <li key={item} className="flex items-start gap-2.5"><span className="text-green-600 font-bold">✓</span><span>{item}</span></li>)}</ul></div>
        </div></section>

        <section className="max-w-6xl mx-auto px-4 pb-20"><div className="text-center max-w-3xl mx-auto mb-12"><p className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff6f00] mb-2">{t("slots.eyebrow")}</p><h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight font-[var(--font-inter-tight)]">{t("slots.heading")}</h2><p className="text-gray-600 text-sm sm:text-base mt-3">{t("slots.description")}</p></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{photoTypes.map((item) => <div key={item.title} className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-sm flex flex-col justify-between"><div><div className="flex items-center justify-between mb-4"><span className="text-xs font-bold text-[#ff6f00] uppercase tracking-wider">{item.tag}</span><span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">{item.vibe}</span></div><h3 className="text-xl font-bold text-gray-900 mb-2 font-[var(--font-inter-tight)]">{item.title}</h3><p className="text-gray-600 text-sm leading-relaxed">{item.description}</p></div></div>)}</div></section>

        {locale === "en" && <section className="max-w-6xl mx-auto px-4 pb-20"><div className="rounded-3xl border border-gray-200 bg-white p-8 sm:p-10"><h2 className="text-3xl font-bold">Build the lineup for your app and real life</h2><p className="mt-4 max-w-3xl leading-7 text-gray-600">Start with clear identity, then add range. Use these guides to adapt crops and ordering without pretending that any photo is optimized for an app algorithm.</p><div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[{ href: "/dating-photos/tinder", label: "Tinder photo guide" }, { href: "/dating-photos/hinge", label: "Hinge photo guide" }, { href: "/dating-photos/bumble", label: "Bumble photo guide" }, { href: "/dating-photos/activity", label: "Real-interest photos" }].map((item) => <Link key={item.href} href={item.href} className="rounded-2xl border border-gray-200 p-5 font-semibold text-[#c94e24] hover:border-[#ff805d]">{item.label} →</Link>)}</div><div className="mt-6 flex flex-wrap gap-5 text-sm"><Link className="underline underline-offset-4" href="/dating-photos/examples">See seven complete examples</Link><Link className="underline underline-offset-4" href="/realistic-ai-dating-photos">Read the realism methodology</Link><Link className="underline underline-offset-4" href="/how-it-works">See how UnrealShot works</Link></div></div></section>}

        <section className="max-w-4xl mx-auto px-4 pb-20"><div className="text-center mb-12"><p className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff6f00] mb-2">{t("faq.eyebrow")}</p><h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight font-[var(--font-inter-tight)]">{t("faq.heading")}</h2></div><div className="space-y-4">{faqs.map((faq) => <div key={faq.question} className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm"><h3 className="text-base font-bold text-gray-900 mb-2">{faq.question}</h3><p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p></div>)}</div></section>

        <section className="max-w-5xl mx-auto px-4"><div className="bg-[#111111] rounded-3xl p-8 sm:p-12 text-white text-center border-2 border-dashed border-zinc-800 shadow-2xl"><h2 className="text-3xl sm:text-4xl font-bold mb-3 font-[var(--font-inter-tight)]">{t("cta.heading")}</h2><p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">{t("cta.description")}</p><Link href="/dashboard"><Button className="group relative bg-[#ff6f00] hover:bg-[#ff6f00]/90 text-white rounded-md overflow-hidden cursor-pointer px-8 pr-16 py-6 font-semibold text-base shadow-lg shadow-orange-500/20">{t("cta.button")}</Button></Link></div></section>
      </main>
      <Footer />
      <MultipleStructuredData schemas={[{ id: "dating-webpage", data: makeWebPageJsonLd({ name: t("schema.name"), description: t("schema.description"), url: publicUrl("/dating-photos", locale), locale, breadcrumbs }) }, { id: "dating-breadcrumb", data: makeBreadcrumbJsonLd(breadcrumbs) }, { id: "dating-faq", data: makeFaqJsonLd(faqs) }]} />
    </div>
  )
}
