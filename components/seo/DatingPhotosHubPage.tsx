import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Check, X } from "lucide-react"
import PublicHeader from "@/components/Header"
import Footer from "@/components/main-landing/Footer"
import { MultipleStructuredData } from "@/components/seo/StructuredData"
import { datingShoots, getDatingShoot } from "@/lib/dating-shoot-content"
import { datingHubHeroPhotos, datingHubSpokes } from "@/lib/dating-hub-content"
import { datingHubCopy, type DatingHubLocale } from "@/lib/dating-hub-copy"
import { makeBreadcrumbJsonLd, makeFaqJsonLd, makeWebPageJsonLd, publicUrl } from "@/lib/public-seo"

const ctaClass = "inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff6f00] px-6 py-3.5 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-[#e96500]"

export default function DatingPhotosHubPage({ locale = "en" }: { locale?: DatingHubLocale }) {
  const copy = datingHubCopy[locale]
  const path = "/dating-photos"
  const breadcrumbs = [
    { name: copy.breadcrumbHome, url: publicUrl("/", locale) },
    { name: copy.breadcrumbLabel, url: publicUrl(path, locale) },
  ]
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${publicUrl(path, locale)}#service`,
    name: copy.meta.title,
    serviceType: "Reference-guided AI dating photo shoots",
    description: copy.meta.description,
    url: publicUrl(path, locale),
    provider: { "@id": `${publicUrl("/", locale)}/#organization` },
    offers: { "@type": "Offer", price: "39", priceCurrency: "USD", availability: "https://schema.org/InStock", url: publicUrl("/pricing", locale) },
  }

  return (
    <div className="min-h-screen bg-[#f7f5f3] text-zinc-950">
      <PublicHeader />
      <main className="overflow-hidden pt-24">
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.04fr_.96fr] lg:py-24">
          <div>
            <p className="text-xs font-black uppercase tracking-[.22em] text-[#ff6f00]">{copy.hero.eyebrow}</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.04] tracking-tight sm:text-6xl">{copy.hero.title}</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-600">{copy.hero.description}</p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-zinc-700">
              {copy.hero.stats.map((item) => <span key={item} className="flex items-center gap-2"><Check className="h-4 w-4 text-[#ff6f00]" />{item}</span>)}
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/login" className={ctaClass}>{copy.hero.primaryCta} <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/dating-photos/examples" className="font-bold underline decoration-zinc-300 underline-offset-4">{copy.hero.examplesCta}</Link>
            </div>
          </div>

          <div className="relative rounded-[2rem] bg-zinc-950 p-3 shadow-2xl">
            <div className="grid grid-cols-2 gap-3">
              {datingHubHeroPhotos.map((photo, index) => {
                const localized = copy.heroPhotos?.[index]
                const altText = localized ? `${copy.imageAltPrefix} ${localized.alt}` : `${copy.imageAltPrefix} ${photo.alt}`
                return (
                  <figure key={photo.src} className="relative overflow-hidden rounded-2xl bg-zinc-800">
                    <div className="relative aspect-[4/5]">
                      <Image
                        src={photo.src}
                        alt={altText}
                        fill
                        priority={index < 2}
                        sizes="(max-width: 1024px) 50vw, 24vw"
                        className="object-cover"
                      />
                    </div>
                  </figure>
                )
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-zinc-200 bg-white py-20">
          <div className="mx-auto max-w-7xl px-5">
            <p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">{copy.problems.eyebrow}</p>
            <h2 className="mt-3 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl">{copy.problems.heading}</h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-600">{copy.problems.description}</p>
            <div className="mt-12 grid gap-5 md:grid-cols-3">{copy.problems.items.map((problem, index) => <article key={problem.title} className="rounded-3xl border border-zinc-200 bg-[#f7f5f3] p-7"><span className="font-mono text-sm font-black text-[#ff6f00]">0{index + 1}</span><h3 className="mt-3 text-xl font-black">{problem.title}</h3><p className="mt-3 leading-7 text-zinc-600">{problem.body}</p></article>)}</div>
            <div className="mt-10 grid gap-5 rounded-3xl bg-zinc-950 p-7 text-white md:grid-cols-2 md:p-10">
              <div><p className="text-xs font-black uppercase tracking-[.18em] text-red-300">{copy.comparison.weakLabel}</p><ul className="mt-5 space-y-3 text-zinc-300">{copy.comparison.weakItems.map((item) => <li key={item} className="flex gap-3"><X className="mt-1 h-4 w-4 shrink-0 text-red-400" />{item}</li>)}</ul></div>
              <div><p className="text-xs font-black uppercase tracking-[.18em] text-emerald-300">{copy.comparison.approachLabel}</p><ul className="mt-5 space-y-3 text-zinc-300">{copy.comparison.approachItems.map((item) => <li key={item} className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />{item}</li>)}</ul></div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20">
          <p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">{copy.spokes.eyebrow}</p>
          <h2 className="mt-3 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl">{copy.spokes.heading}</h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-600">{copy.spokes.description}</p>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{datingHubSpokes.map((spoke, index) => { const shoot = getDatingShoot(spoke.shoot); const translated = copy.spokes.items[index]; return <Link key={spoke.href} href={spoke.href} className="group flex flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white transition duration-300 hover:shadow-lg"><div className="relative aspect-[4/5] bg-zinc-100">{shoot && <Image src={shoot.frames[1].src} alt={`${copy.imageAltPrefix} ${copy.shootNames[shoot.slug] ?? shoot.name}`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-300 group-hover:scale-[1.02]" />}</div><div className="flex flex-1 flex-col justify-between p-6"><h3 className="text-xl font-black">{translated.title}</h3><p className="mt-3 leading-7 text-zinc-600">{translated.description}</p><span className="mt-5 inline-flex items-center gap-1 font-bold text-[#ff6f00]">{copy.spokes.explore} <ArrowRight className="h-4 w-4" /></span></div></Link> })}</div>
          <div className="mt-8 flex flex-wrap gap-3">{copy.spokes.links.map((item) => <Link key={item.href} href={item.href} className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-bold hover:border-[#ff6f00]">{item.label} →</Link>)}</div>
        </section>

        <section className="bg-[#1b1816] py-20 text-white">
          <div className="mx-auto max-w-6xl px-5"><p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">{copy.roles.eyebrow}</p><h2 className="mt-3 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl">{copy.roles.heading}</h2><p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">{copy.roles.description}</p><div className="mt-12 divide-y divide-zinc-800 border-y border-zinc-800">{copy.roles.items.map((role, index) => <article key={role.title} className="grid gap-3 py-7 md:grid-cols-[70px_240px_230px_1fr]"><span className="font-mono text-sm text-[#ff6f00]">0{index + 1}</span><h3 className="text-lg font-black">{role.title}</h3><p className="font-semibold text-zinc-400">{role.answer}</p><p className="leading-7 text-zinc-300">{role.body}</p></article>)}</div></div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20"><p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">{copy.method.eyebrow}</p><h2 className="mt-3 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl">{copy.method.heading}</h2><p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-600">{copy.method.description}</p><div className="mt-10 overflow-x-auto rounded-3xl border border-zinc-200 bg-white"><table className="w-full min-w-[760px] border-collapse text-left"><thead className="bg-zinc-950 text-white"><tr><th className="p-5 text-sm">{locale === "en" ? "Element" : locale === "fr" ? "Élément" : locale === "es" ? "Elemento" : locale === "de" ? "Element" : "Elemento"}</th><th className="p-5 text-sm">{locale === "en" ? "What weak lineups do" : locale === "fr" ? "Ce que font les profils faibles" : locale === "es" ? "Qué hacen los perfiles débiles" : locale === "de" ? "Was schwache Profile tun" : "O que perfis fracos fazem"}</th><th className="p-5 text-sm">{locale === "en" ? "UnrealShot’s approach" : locale === "fr" ? "L’approche UnrealShot" : locale === "es" ? "El enfoque de UnrealShot" : locale === "de" ? "Der UnrealShot-Ansatz" : "A abordagem da UnrealShot"}</th></tr></thead><tbody>{copy.method.items.map((row) => <tr key={row.element} className="border-t border-zinc-200 align-top"><th className="p-5 font-black">{row.element}</th><td className="p-5 leading-7 text-zinc-600">{row.weak}</td><td className="p-5 leading-7 text-zinc-700">{row.unrealshot}</td></tr>)}</tbody></table></div></section>

        <section className="border-y border-zinc-200 bg-white py-20"><div className="mx-auto max-w-7xl px-5"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">{copy.examples.eyebrow}</p><h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">{copy.examples.heading}</h2><p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600">{copy.examples.description}</p></div><Link href="/dating-photos/examples" className="font-black text-[#ff6f00] underline decoration-2 underline-offset-4">{copy.examples.link}</Link></div><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{datingShoots.map((shoot) => <Link key={shoot.slug} href={`/dating-photos/shoots/${shoot.slug}`} className="group flex flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-[#f7f5f3] transition duration-300 hover:shadow-lg"><div className="relative aspect-[4/5] bg-zinc-100"><Image src={shoot.frames[1].src} alt={`${copy.imageAltPrefix} ${copy.shootNames[shoot.slug] ?? shoot.name}`} fill sizes="(max-width: 640px) 100vw, 25vw" className="object-cover transition duration-300 group-hover:scale-[1.02]" /></div><div className="flex flex-1 flex-col justify-between p-5"><h3 className="mt-2 text-lg font-black">{copy.shootNames[shoot.slug] ?? shoot.name} {copy.examples.cardSuffix}</h3><span className="mt-3 inline-block text-sm font-bold text-[#ff6f00]">{copy.examples.cardLink}</span></div></Link>)}</div></div></section>

        <section className="mx-auto max-w-6xl px-5 py-20"><div className="grid gap-10 rounded-[2rem] bg-zinc-950 p-8 text-white lg:grid-cols-[1fr_.8fr] lg:p-12"><div><p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">{copy.process.eyebrow}</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{copy.process.heading}</h2><p className="mt-5 text-lg leading-8 text-zinc-300">{copy.process.descriptionOne}</p><p className="mt-5 text-lg leading-8 text-zinc-300">{copy.process.descriptionTwo}</p><div className="mt-8 flex flex-wrap gap-4"><Link href="/login" className={ctaClass}>{copy.process.cta}</Link><Link href="/how-it-works" className="rounded-xl border border-zinc-700 px-6 py-3.5 font-bold">{copy.process.processLink}</Link></div></div><dl className="grid grid-cols-2 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">{copy.process.stats.map(([label, value]) => <div key={label} className="border-b border-r border-zinc-800 p-5"><dt className="text-xs uppercase tracking-wide text-zinc-500">{label}</dt><dd className="mt-2 font-black">{value}</dd></div>)}</dl></div></section>

        <section className="bg-white py-20"><div className="mx-auto max-w-5xl px-5"><p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">{copy.faq.eyebrow}</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{copy.faq.heading}</h2><div className="mt-10 divide-y divide-zinc-200 border-y border-zinc-200">{copy.faq.items.map((faq) => <article key={faq.question} className="py-7"><h3 className="text-xl font-black">{faq.question}</h3><p className="mt-3 max-w-4xl leading-7 text-zinc-600">{faq.answer}</p></article>)}</div><aside className="mt-10 rounded-3xl border border-zinc-200 bg-[#f7f5f3] p-7"><h2 className="text-xl font-black">{copy.faq.sourcesHeading}</h2><p className="mt-2 text-sm leading-6 text-zinc-500">{copy.faq.sourcesDescription}</p><div className="mt-5 flex flex-wrap gap-4 text-sm font-bold text-[#ff6f00]">{copy.faq.sources.map(([label, href]) => <a key={href} href={href} target="_blank" rel="noreferrer" className="underline underline-offset-4">{label}</a>)}</div></aside></div></section>

        <section className="mx-auto max-w-5xl px-5 py-20 text-center"><div className="rounded-[2rem] bg-[#ff6f00] px-7 py-14 text-white"><p className="text-xs font-black uppercase tracking-[.2em] text-orange-100">{copy.finalCta.eyebrow}</p><h2 className="mt-3 text-3xl font-black sm:text-5xl">{copy.finalCta.heading}</h2><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-orange-50">{copy.finalCta.description}</p><Link href="/login" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-7 py-4 font-black">{copy.finalCta.button} <ArrowRight className="h-4 w-4" /></Link></div></section>
      </main>
      <Footer />
      <MultipleStructuredData schemas={[{ id: "dating-hub-page", data: makeWebPageJsonLd({ name: copy.meta.title, description: copy.meta.description, url: publicUrl(path, locale), locale, breadcrumbs }) }, { id: "dating-hub-breadcrumbs", data: makeBreadcrumbJsonLd(breadcrumbs) }, { id: "dating-hub-service", data: serviceSchema }, { id: "dating-hub-faq", data: makeFaqJsonLd(copy.faq.items) }]} />
    </div>
  )
}
