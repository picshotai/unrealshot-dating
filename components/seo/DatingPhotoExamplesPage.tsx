import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import PublicHeader from "@/components/Header"
import Footer from "@/components/main-landing/Footer"
import { MultipleStructuredData } from "@/components/seo/StructuredData"
import { datingShoots } from "@/lib/dating-shoot-content"
import { getLocalizedShootPage } from "@/lib/dating-shoot-pages"
import { examplesPageCopy } from "@/lib/seo-pages/examples-localized"
import { authorityPageUi } from "@/lib/seo-pages/public-page-ui"
import type { PublishedPublicLocale } from "@/i18n/config"
import { Link as PublicLink } from "@/i18n/navigation"
import { makeBreadcrumbJsonLd, makeWebPageJsonLd, publicUrl } from "@/lib/public-seo"

export default function DatingPhotoExamplesPage({ locale }: { locale: PublishedPublicLocale }) {
  const copy = examplesPageCopy[locale]
  const path = "/dating-photos/examples"
  const opener = getLocalizedShootPage("outdoor-coffee", locale)?.shoot
  const shoots = datingShoots
    .map((shoot) => getLocalizedShootPage(shoot.slug, locale)?.shoot)
    .filter((shoot): shoot is NonNullable<typeof shoot> => Boolean(shoot))
  const breadcrumbs = [
    { name: authorityPageUi[locale].home, url: publicUrl("/", locale) },
    { name: authorityPageUi[locale].datingPhotos, url: publicUrl("/dating-photos", locale) },
    { name: copy.eyebrow, url: publicUrl(path, locale) },
  ]

  return (
    <div className="min-h-screen bg-[#f7f5f3] text-zinc-950">
      <PublicHeader />
      <main className="overflow-hidden pb-20 pt-24">
        <header className="mx-auto max-w-7xl px-5 py-14 text-center lg:py-20">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[.22em] text-[#ff6f00]">{copy.eyebrow}</p>
            <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">{copy.title}</h1>
            <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-zinc-600">{copy.description}</p>
            <ul className="mx-auto mt-7 w-fit space-y-3 text-left text-sm font-semibold text-zinc-700">
              {copy.bullets.map((item) => <li key={item} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#ff6f00]" />{item}</li>)}
            </ul>
            <a href="#choose-by-need" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#ff6f00] px-6 py-3.5 font-bold text-white shadow-lg shadow-orange-500/20">{copy.seeStructure} <ArrowRight className="h-4 w-4" /></a>
          </div>

          {opener && <div className="mx-auto mt-12 max-w-5xl rounded-[2rem] bg-zinc-950 p-3 shadow-2xl"><div className="grid grid-cols-2 gap-3">{opener.frames.map((frame, index) => <figure key={frame.role} className="overflow-hidden rounded-2xl bg-zinc-900"><div className="relative aspect-[4/5]"><Image src={frame.src} alt={frame.alt} fill priority={index < 2} sizes="(max-width: 1024px) 50vw, 24vw" className="object-cover" /></div><figcaption className="px-3 py-2 text-xs font-bold text-white">{frame.role}</figcaption></figure>)}</div><p className="px-2 pb-1 pt-4 text-center text-xs leading-5 text-zinc-400">{copy.openerCaption}</p></div>}
        </header>

        <section id="choose-by-need" className="border-y border-zinc-200 bg-white py-20">
          <div className="mx-auto max-w-7xl px-5">
            <p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">{copy.profileEyebrow}</p>
            <h2 className="mt-3 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl">{copy.profileHeading}</h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-600">{copy.profileDescription}</p>
            <div className="mt-10 grid gap-5 md:grid-cols-2">{copy.profileGaps.map((gap) => <a key={gap.problem} href={gap.href} className="rounded-3xl border border-zinc-200 bg-[#f7f5f3] p-7 transition hover:border-[#ff6f00]"><h3 className="text-xl font-black">{gap.problem}</h3><p className="mt-3 leading-7 text-zinc-600">{gap.solution}</p><span className="mt-5 inline-flex items-center gap-1 font-bold text-[#ff6f00]">{gap.label} <ArrowRight className="h-4 w-4" /></span></a>)}</div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20">
          <p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">{copy.outputsEyebrow}</p>
          <h2 className="mt-3 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl">{copy.outputsHeading}</h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-600">{copy.outputsDescription}</p>

          <div className="mt-12 space-y-12">
            {shoots.map((shoot) => {
              const details = copy.shoots[shoot.slug]
              if (!details) return null
              return (
                <article id={shoot.slug} key={shoot.slug} className="scroll-mt-28 overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
                  <div className="grid grid-cols-2 gap-px bg-zinc-200 sm:grid-cols-4">
                    {shoot.frames.map((frame) => <figure key={frame.role} className="bg-white"><div className="relative aspect-[4/5]"><Image src={frame.src} alt={frame.alt} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" /></div><figcaption className="border-t border-zinc-100 px-4 py-3"><strong className="block text-sm">{frame.role}</strong><span className="mt-1 block text-xs leading-5 text-zinc-500">{copy.bullets[0]}</span></figcaption></figure>)}
                  </div>
                  <div className="grid gap-7 p-7 lg:grid-cols-[1fr_.85fr] lg:p-10">
                    <div><p className="text-xs font-black uppercase tracking-[.18em] text-[#ff6f00]">{copy.directionLabel}</p><h3 className="mt-2 text-3xl font-black">{details.name} {copy.exampleSuffix}</h3><p className="mt-4 max-w-3xl leading-7 text-zinc-600">{details.answer}</p></div>
                    <dl className="space-y-4 rounded-2xl bg-[#f7f5f3] p-6"><div><dt className="text-xs font-black uppercase tracking-wide text-zinc-500">{copy.whereFits}</dt><dd className="mt-1 leading-6 text-zinc-700">{details.profileFit}</dd></div><div><dt className="text-xs font-black uppercase tracking-wide text-zinc-500">{copy.besideIt}</dt><dd className="mt-1 leading-6 text-zinc-700">{details.pairing}</dd></div></dl>
                  </div>
                  <div className="border-t border-zinc-200 px-7 py-5 lg:px-10"><PublicLink href={`/dating-photos/shoots/${shoot.slug}`} className="inline-flex items-center gap-2 font-bold text-[#ff6f00]">{copy.seeStructureFor} <ArrowRight className="h-4 w-4" /></PublicLink></div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5">
          <div className="rounded-[2rem] bg-zinc-950 p-8 text-white sm:p-12">
            <p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">{copy.beforeEyebrow}</p>
            <h2 className="mt-3 text-3xl font-black">{copy.beforeHeading}</h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">{copy.beforeDescription}</p>
            <div className="mt-8 flex flex-wrap gap-4"><PublicLink href="/how-it-works" className="rounded-xl border border-zinc-700 px-5 py-3 font-bold">{copy.howGenerationWorks}</PublicLink><Link href="/dashboard" className="rounded-xl bg-[#ff6f00] px-5 py-3 font-bold">{copy.createPhotos}</Link></div>
          </div>
        </section>
      </main>
      <Footer />
      <MultipleStructuredData schemas={[{ id: `examples-page-${locale}`, data: makeWebPageJsonLd({ name: copy.title, description: copy.description, url: publicUrl(path, locale), locale, breadcrumbs }) }, { id: `examples-breadcrumb-${locale}`, data: makeBreadcrumbJsonLd(breadcrumbs) }]} />
    </div>
  )
}
