import Link from "next/link"
import PublicHeader from "@/components/Header"
import Footer from "@/components/main-landing/Footer"
import { MultipleStructuredData } from "@/components/seo/StructuredData"
import type { PlatformGuideContent } from "@/lib/platform-pages"
import { makeBreadcrumbJsonLd, makeFaqJsonLd, makeWebPageJsonLd, publicUrl } from "@/lib/public-seo"

export default function PlatformGuidePage({ content }: { content: PlatformGuideContent }) {
  const breadcrumbs = [
    { name: "Home", url: publicUrl("/", "en") },
    { name: "Guides", url: publicUrl("/blog", "en") },
    { name: `${content.app} Photo Guide`, url: publicUrl(content.path, "en") },
  ]

  return (
    <div className="min-h-screen bg-[#f7f5f3] text-zinc-950">
      <PublicHeader />
      <main className="pt-24">
        <article>
          <header className="border-b border-zinc-200 bg-white">
            <div className="mx-auto max-w-4xl px-5 py-16 sm:py-24">
              <p className="text-xs font-black uppercase tracking-[.22em] text-[#d45125]">{content.eyebrow}</p>
              <h1 className="mt-5 text-4xl font-black leading-[1.08] tracking-tight sm:text-6xl">{content.title}</h1>
              <p className="mt-7 text-xl leading-9 text-zinc-600">{content.answer}</p>
              <p className="mt-6 text-sm text-zinc-500">Written and reviewed by <Link className="font-semibold underline" href="/about#founder">Harvansh Chaudhary</Link> · Sources checked {content.reviewed}</p>
            </div>
          </header>

          <section className="mx-auto max-w-5xl px-5 py-12" aria-labelledby="quick-facts">
            <h2 id="quick-facts" className="mb-5 text-center text-2xl font-black">{content.app} photos at a glance</h2>
            <dl className="grid overflow-hidden rounded-3xl border border-zinc-200 bg-white sm:grid-cols-2 lg:grid-cols-4">{content.quickFacts.map(([label, value]) => <div key={label} className="border-b border-zinc-200 p-5 last:border-0 sm:border-r"><dt className="text-sm text-zinc-500">{label}</dt><dd className="mt-1 font-black">{value}</dd></div>)}</dl>
          </section>

          <div className="mx-auto grid max-w-6xl gap-12 px-5 pb-20 lg:grid-cols-[220px_minmax(0,720px)]">
            <aside className="lg:sticky lg:top-28 lg:self-start"><p className="text-xs font-black uppercase tracking-[.18em] text-zinc-500">In this guide</p><nav className="mt-4 space-y-3">{content.sections.map((section, index) => <a key={section.heading} href={`#section-${index + 1}`} className="block text-sm font-semibold leading-5 text-zinc-600 hover:text-[#d45125]">{section.heading}</a>)}</nav><Link href={content.productPath} className="mt-8 block rounded-2xl bg-zinc-950 p-5 text-sm font-bold leading-6 text-white">{content.productLabel}<span className="mt-2 block text-orange-400">See product details →</span></Link></aside>
            <div className="space-y-16">{content.sections.map((section, index) => <section id={`section-${index + 1}`} key={section.heading} className="scroll-mt-28"><p className="font-mono text-xs font-bold text-[#d45125]">{String(index + 1).padStart(2, "0")}</p><h2 className="mt-2 text-3xl font-black tracking-tight">{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-5 text-lg leading-8 text-zinc-600">{paragraph}</p>)}{section.bullets && <ul className="mt-6 space-y-3 rounded-3xl border border-zinc-200 bg-white p-7">{section.bullets.map((item) => <li key={item} className="flex gap-3 leading-7 text-zinc-700"><span className="font-bold text-[#d45125]">✓</span>{item}</li>)}</ul>}</section>)}</div>
          </div>

          <section className="border-y border-zinc-200 bg-white py-16"><div className="mx-auto max-w-4xl px-5"><h2 className="text-3xl font-black">Final {content.app} photo checklist</h2><div className="mt-8 grid gap-3 sm:grid-cols-2">{content.checklist.map((item) => <div key={item} className="flex gap-3 rounded-2xl bg-[#f7f5f3] p-4 leading-6"><span className="font-black text-[#d45125]">□</span>{item}</div>)}</div></div></section>

          <section className="mx-auto grid max-w-5xl gap-10 px-5 py-16 lg:grid-cols-[1fr_.65fr]"><div><h2 className="text-3xl font-black">Frequently asked questions</h2><div className="mt-7 divide-y divide-zinc-200 border-y border-zinc-200">{content.faqs.map((faq) => <section key={faq.question} className="py-6"><h3 className="text-xl font-black">{faq.question}</h3><p className="mt-3 leading-7 text-zinc-600">{faq.answer}</p></section>)}</div></div><aside className="rounded-3xl bg-zinc-950 p-7 text-white lg:self-start"><h2 className="text-2xl font-black">Official sources</h2><p className="mt-3 text-sm leading-6 text-zinc-400">Platform guidance changes. These first-party sources were checked on {content.reviewed}.</p><ul className="mt-6 space-y-4">{content.sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer" className="font-semibold text-orange-300 underline underline-offset-4">{source.label}</a></li>)}</ul></aside></section>

          <section className="mx-auto max-w-5xl px-5 pb-20"><div className="rounded-[2rem] bg-[#ff6f00] px-7 py-12 text-center text-white"><h2 className="text-3xl font-black">Missing the photo roles this guide describes?</h2><p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-orange-50">UnrealShot creates 15 coherent shoots and 60 photos from 4–6 selfies, with 15 individual Photo Retakes and delivery within 30 minutes.</p><Link href={content.productPath} className="mt-7 inline-flex rounded-xl bg-zinc-950 px-6 py-3.5 font-bold">{content.productLabel}</Link></div></section>
        </article>
      </main>
      <Footer />
      <MultipleStructuredData schemas={[
        { id: `${content.app.toLowerCase()}-guide-page`, data: makeWebPageJsonLd({ name: content.title, description: content.description, url: publicUrl(content.path, "en"), locale: "en", breadcrumbs }) },
        { id: `${content.app.toLowerCase()}-guide-breadcrumbs`, data: makeBreadcrumbJsonLd(breadcrumbs) },
        { id: `${content.app.toLowerCase()}-guide-faq`, data: makeFaqJsonLd(content.faqs) },
      ]} />
    </div>
  )
}
