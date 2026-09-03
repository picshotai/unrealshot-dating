import Image from "next/image"
import Link from "next/link"
import { Link as PublicLink } from "@/i18n/navigation"
import PublicHeader from "@/components/Header"
import Footer from "@/components/main-landing/Footer"
import { MultipleStructuredData } from "@/components/seo/StructuredData"
import { getDatingShoot } from "@/lib/dating-shoot-content"
import type { PlatformLandingContent } from "@/lib/platform-pages"
import { makeBreadcrumbJsonLd, makeFaqJsonLd, makeWebPageJsonLd, publicUrl } from "@/lib/public-seo"

const ctaClass = "inline-flex items-center justify-center rounded-xl bg-[#ff6f00] px-6 py-3.5 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-[#e96500]"

export default function PlatformLandingPage({ content, locale }: { content: PlatformLandingContent; locale: "en" | "fr" | "es" | "de" | "pt-BR" }) {
  const examples = content.exampleSlugs.map(getDatingShoot).filter(Boolean)
  const copy = content.copy.landing
  const breadcrumbs = [
    { name: copy.home, url: publicUrl("/", locale) },
    { name: copy.datingPhotos, url: publicUrl("/dating-photos", locale) },
    { name: `${content.app} ${copy.datingPhotos}`, url: publicUrl(content.path, locale) },
  ]

  return (
    <div className="min-h-screen bg-[#f7f5f3] text-zinc-950">
      <PublicHeader />
      <main className="overflow-hidden pt-24">
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.02fr_.98fr] lg:py-24">
          <div>
            <p className="text-xs font-black uppercase tracking-[.22em] text-[#ff6f00]">{content.eyebrow}</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.04] tracking-tight sm:text-6xl">{content.title}</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-600">{content.answer}</p>
            <ul className="mt-7 grid gap-3 text-sm font-semibold text-zinc-700 sm:grid-cols-2">
              {content.heroBullets.map((item) => <li key={item} className="flex gap-2"><span aria-hidden="true" className="text-[#ff6f00]">✓</span>{item}</li>)}
            </ul>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/dashboard" className={ctaClass}>{copy.createPhotos}</Link>
              <PublicLink href="/dating-photos/examples" className="font-bold text-zinc-700 underline decoration-zinc-300 underline-offset-4">{copy.seeExamples}</PublicLink>
            </div>
          </div>
          <figure className="relative grid grid-cols-2 gap-3 rounded-[2rem] bg-zinc-950 p-3 pb-12 shadow-2xl">
            {examples.slice(0, 4).map((shoot, index) => shoot && (
              <div key={shoot.slug} className={`relative overflow-hidden rounded-2xl bg-zinc-800 ${index % 2 ? "translate-y-3" : "-translate-y-1"}`}>
                <div className="relative aspect-[4/5]"><Image src={shoot.frames[0].src} alt={shoot.frames[0].alt} fill priority={index < 2} sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" /></div>
              </div>
            ))}
            <figcaption className="absolute inset-x-4 bottom-3 text-center text-xs font-bold uppercase tracking-wide text-white">{copy.sampleCaption}</figcaption>
          </figure>
        </section>

        <section className="border-y border-zinc-200 bg-white py-20">
          <div className="mx-auto max-w-7xl px-5">
            <p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">{copy.profileProblem}</p>
            <h2 className="mt-3 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl">{copy.profileProblemHeading}</h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-600">{content.problemIntro}</p>
            <div className="mt-12 grid gap-5 md:grid-cols-3">{content.problems.map((problem, index) => <article key={problem.title} className="rounded-3xl border border-zinc-200 bg-[#f7f5f3] p-7"><span className="text-sm font-black text-[#ff6f00]">0{index + 1}</span><h3 className="mt-3 text-xl font-black">{problem.title}</h3><p className="mt-3 leading-7 text-zinc-600">{problem.body}</p></article>)}</div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20">
          <p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">{copy.solution}</p>
          <h2 className="mt-3 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl">{copy.solutionHeading}</h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-600">{content.solutionIntro}</p>
          <div className="mt-12 grid gap-6 md:grid-cols-2">{content.differentiators.map((item) => <article key={item.title} className="rounded-3xl bg-zinc-950 p-8 text-white"><h3 className="text-2xl font-black">{item.title}</h3><p className="mt-4 leading-7 text-zinc-300">{item.body}</p></article>)}</div>
        </section>

        <section className="bg-[#1b1816] py-20 text-white">
          <div className="mx-auto max-w-6xl px-5">
            <p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">{copy.deliveryEyebrow}</p>
            <h2 className="mt-3 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl">{copy.deliveryHeading}</h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">{content.solutionIntro}</p>
            <div className="mt-12 divide-y divide-zinc-800 border-y border-zinc-800">{content.deliveryPoints.map((item) => <article key={item.title} className="grid gap-3 py-7 sm:grid-cols-[300px_1fr]"><h3 className="text-lg font-bold">{item.title}</h3><p className="leading-7 text-zinc-300">{item.body}</p></article>)}</div>
          </div>
        </section>

        <section className="border-b border-zinc-200 bg-[#f0ece8] py-20">
          <div className="mx-auto max-w-7xl px-5">
            <p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">{copy.builtFor}</p>
            <h2 className="mt-3 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl">{copy.builtHeading}</h2>
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {content.sections.map((section, index) => <article key={section.heading} className={`rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm sm:p-10 ${content.sections.length % 2 === 1 && index === content.sections.length - 1 ? "lg:col-span-2" : ""}`}><h3 className="text-2xl font-black tracking-tight sm:text-3xl">{section.heading}</h3>{section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-5 leading-7 text-zinc-600">{paragraph}</p>)}{section.bullets && <ul className="mt-7 grid gap-3 border-t border-zinc-200 pt-6 sm:grid-cols-2">{section.bullets.map((item) => <li key={item} className="flex gap-2 leading-6 text-zinc-700"><span className="text-[#ff6f00]">✓</span>{item}</li>)}</ul>}</article>)}
            </div>
          </div>
        </section>

        <section className="border-y border-zinc-200 bg-white py-20">
          <div className="mx-auto max-w-7xl px-5"><h2 className="text-3xl font-black tracking-tight sm:text-5xl">{copy.examplesHeading}</h2><p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600">{copy.examplesDescription}</p><div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{examples.map((shoot) => shoot && <PublicLink href={`/dating-photos/shoots/${shoot.slug}`} key={shoot.slug} className="group overflow-hidden rounded-3xl border border-zinc-200 bg-[#f7f5f3]"><div className="relative aspect-[4/5]"><Image src={shoot.frames[0].src} alt={shoot.frames[0].alt} fill sizes="(max-width: 640px) 100vw, 25vw" className="object-cover transition duration-300 group-hover:scale-[1.02]" /></div><div className="p-5"><p className="text-xs font-bold uppercase text-[#ff6f00]">{copy.generatedLabel}</p><h3 className="mt-2 text-xl font-black">{shoot.name} example</h3><span className="mt-3 inline-block font-semibold">{copy.exploreExample}</span></div></PublicLink>)}</div></div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-8 px-5 py-20 lg:grid-cols-[1fr_.75fr]">
          <div><h2 className="text-3xl font-black tracking-tight sm:text-4xl">{copy.requirementsHeading}</h2>{content.policy.map((paragraph) => <p key={paragraph} className="mt-5 text-lg leading-8 text-zinc-600">{paragraph}</p>)}</div>
          <aside className="rounded-3xl border border-zinc-200 bg-white p-7"><h3 className="text-xl font-black">{copy.primarySources}</h3><p className="mt-2 text-sm leading-6 text-zinc-500">{copy.sourcesChecked} {content.reviewed}.</p><ul className="mt-5 space-y-4">{content.sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer" className="font-bold text-[#ff6f00] underline underline-offset-4">{source.label}</a></li>)}</ul><PublicLink href={content.guidePath} className="mt-7 inline-block font-black text-zinc-900 underline decoration-[#ff6f00] decoration-2 underline-offset-4">{content.guideLabel} →</PublicLink></aside>
        </section>

        <section className="bg-white py-20"><div className="mx-auto max-w-4xl px-5"><h2 className="text-3xl font-black tracking-tight sm:text-4xl">{copy.faqHeading}</h2><div className="mt-8 divide-y divide-zinc-200 border-y border-zinc-200">{content.faqs.map((faq) => <article key={faq.question} className="py-7"><h3 className="text-xl font-black">{faq.question}</h3><p className="mt-3 leading-7 text-zinc-600">{faq.answer}</p></article>)}</div></div></section>

        <section className="mx-auto max-w-5xl px-5 py-20 text-center"><div className="rounded-[2rem] bg-zinc-950 px-6 py-14 text-white sm:px-12"><p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">{copy.ctaEyebrow}</p><h2 className="mt-3 text-3xl font-black sm:text-5xl">{copy.ctaHeading}</h2><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-300">{copy.ctaDescription}</p><Link href="/dashboard" className={ctaClass + " mt-8"}>{copy.createPhotos}</Link></div></section>
      </main>
      <Footer />
      <MultipleStructuredData schemas={[
        { id: `${content.app.toLowerCase()}-landing-page-${locale}`, data: makeWebPageJsonLd({ name: content.title, description: content.description, url: publicUrl(content.path, locale), locale, breadcrumbs }) },
        { id: `${content.app.toLowerCase()}-landing-breadcrumbs-${locale}`, data: makeBreadcrumbJsonLd(breadcrumbs) },
        { id: `${content.app.toLowerCase()}-landing-faq-${locale}`, data: makeFaqJsonLd(content.faqs) },
      ]} />
    </div>
  )
}
