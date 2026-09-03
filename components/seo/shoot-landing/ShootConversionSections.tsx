import Image from "next/image"
import Link from "next/link"
import { Link as PublicLink } from "@/i18n/navigation"
import { ArrowRight, Check, ShieldCheck } from "lucide-react"
import { datingShoots, type DatingShoot } from "@/lib/dating-shoot-content"
import type { ShootLandingCopy, ShootLandingFaq } from "@/lib/dating-shoot-landing-content"
import { commonShootFaqs as localizedCommonShootFaqs, getLocalizedShootLandingContent, getLocalizedShootPage, type ShootPageUiCopy } from "@/lib/dating-shoot-pages"

export const commonShootFaqs: ShootLandingFaq[] = [
  { question: "Are the 15 photoshoots selected from a small fixed gallery?", answer: "No. UnrealShot creates 15 varied photoshoot ideas from your reference selfies and intake. The examples on these pages show part of the creative range, not the full set of ideas the product can produce." },
  { question: "What if one photo does not look enough like me?", answer: "Reference-guided generation can miss an individual likeness or composition. The package includes 15 individual Photo Retakes so you can retry specific weak frames." },
  { question: "How quickly are the dating photos delivered?", answer: "The complete package is delivered within 30 minutes after you finish the reference upload and intake process." },
]

export default function ShootConversionSections({ shoot, copy, ui, locale }: { shoot: DatingShoot; copy: ShootLandingCopy; ui: ShootPageUiCopy; locale: "en" | "fr" | "es" | "de" | "pt-BR" }) {
  const related = datingShoots.filter((item) => item.slug !== shoot.slug).slice(0, 3)
  const faqs = [...copy.faqs, ...(getLocalizedShootPage(shoot.slug, locale)?.commonFaqs ?? localizedCommonShootFaqs)]

  return (
    <>
      <section className="bg-[#111111] py-20 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid gap-8 rounded-3xl border-2 border-dashed border-zinc-800 bg-[#161616] p-3 lg:grid-cols-2">
            <div className="rounded-2xl border border-dashed border-zinc-700/70 bg-[#1c1c1c] p-7 sm:p-10"><p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">{ui.storyEyebrow}</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{ui.storyHeading}</h2><p className="mt-5 text-lg leading-8 text-zinc-300">{ui.storyDescription}</p><dl className="mt-8 grid gap-4 sm:grid-cols-2">{ui.storyFacts.map(([label, value]) => <div key={label} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"><dt className="text-xs font-black uppercase tracking-wide text-[#ff6f00]">{label}</dt><dd className="mt-2 text-sm leading-6 text-zinc-300">{value}</dd></div>)}</dl></div>
            <div className="flex flex-col justify-between rounded-2xl border border-dashed border-zinc-800 bg-black p-7 sm:p-10"><div><p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">{ui.detailsEyebrow}</p><h3 className="mt-3 text-3xl font-black">{ui.detailsHeading}</h3><p className="mt-5 text-lg leading-8 text-zinc-300">{copy.selectionNote}</p><div className="mt-7 space-y-3">{ui.detailsBullets.map((item) => <div key={item} className="flex gap-3 text-sm text-zinc-300"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#ff6f00]" />{item}</div>)}</div></div><Link href="/dating-photos/activity" className="mt-8 inline-flex items-center gap-2 font-bold text-[#ff6f00]">{ui.detailsLink} <ArrowRight className="h-4 w-4" /></Link></div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5"><div className="mx-auto max-w-4xl text-center"><p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">{ui.processEyebrow}</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{ui.processHeading}</h2><p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-600">{ui.processDescription}</p></div><div className="mt-12 grid gap-5 md:grid-cols-3">{ui.processSteps.map(([title, body], index) => <article key={title} className="rounded-3xl border border-zinc-200 bg-[#f7f5f3] p-7"><span className="font-mono text-sm font-black text-[#ff6f00]">0{index + 1}</span><h3 className="mt-4 text-xl font-black">{title}</h3><p className="mt-3 leading-7 text-zinc-600">{body}</p></article>)}</div></div>
      </section>

      <section className="bg-[#111111] px-5 py-20 text-white sm:py-24">
        <div className="mx-auto max-w-6xl rounded-3xl border-2 border-dashed border-zinc-800 bg-[#161616] p-3 shadow-2xl"><div className="grid gap-3 lg:grid-cols-[1.2fr_.8fr]"><div className="rounded-2xl border border-dashed border-zinc-700/70 bg-[#1c1c1c] p-7 sm:p-10"><span className="rounded-full bg-[#ff6f00]/15 px-3 py-1 text-xs font-black uppercase tracking-wide text-[#ff6f00]">{ui.packageBadge}</span><h2 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">{ui.packageHeading}</h2><p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-300">{ui.packageDescription}</p><div className="mt-8 grid gap-4 sm:grid-cols-2">{ui.packageBullets.map((item) => <div key={item} className="flex gap-3 text-sm font-semibold text-zinc-200"><Check className="h-4 w-4 shrink-0 text-[#ff6f00]" />{item}</div>)}</div></div><div className="flex flex-col justify-between rounded-2xl border border-dashed border-zinc-800 bg-black p-7 text-center sm:p-10"><div><p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">{ui.paymentEyebrow}</p><p className="mt-4 text-6xl font-black tracking-tighter">$39</p><p className="mt-2 text-zinc-400">{ui.paymentSubtext}</p><div className={`mx-auto my-7 grid max-w-sm gap-2 ${copy.gallery.length > 2 ? "grid-cols-3" : "grid-cols-2"}`}>{copy.gallery.slice(0, 3).map((image) => <div key={image.src} className="relative aspect-[3/4] overflow-hidden rounded-lg border border-zinc-700"><Image src={image.src} alt="" fill sizes="100px" className="object-cover" /></div>)}</div></div><div><Link href="/dashboard" className="flex w-full items-center justify-center gap-2 rounded-md bg-[#ff6f00] px-6 py-4 font-bold text-white transition hover:bg-[#e96500]">{ui.startCta} <ArrowRight className="h-4 w-4" /></Link><p className="mt-5 flex items-center justify-center gap-2 text-xs text-zinc-500"><ShieldCheck className="h-4 w-4 text-[#ff6f00]" />{ui.secureText}</p></div></div></div></div>
      </section>

      <section className="bg-[#f7f5f3] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5"><div className="mx-auto max-w-4xl text-center"><p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">{ui.moreEyebrow}</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{ui.moreHeading}</h2><p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-zinc-600">{ui.moreDescription}</p></div><div className="mt-12 grid gap-6 md:grid-cols-3">{related.map((item) => { const relatedCopy = getLocalizedShootLandingContent(item.slug, locale); const relatedPage = getLocalizedShootPage(item.slug, locale); const cover = relatedCopy?.gallery[0]; return cover && <PublicLink key={item.slug} href={`/dating-photos/shoots/${item.slug}`} className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white"><div className="relative aspect-[4/3]"><Image src={cover.src} alt={cover.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-300 group-hover:scale-[1.02]" /></div><div className="p-6"><p className="text-xs font-black uppercase tracking-wide text-[#ff6f00]">{ui.relatedLabel}</p><h3 className="mt-2 text-2xl font-black">{relatedPage?.shoot.name} · {ui.examplesEyebrow}</h3><p className="mt-3 line-clamp-3 leading-7 text-zinc-600">{relatedCopy.heroDescription}</p><span className="mt-5 inline-flex items-center gap-2 font-bold text-[#ff6f00]">{ui.exploreRelated} <ArrowRight className="h-4 w-4" /></span></div></PublicLink> })}</div><div className="mt-8 text-center"><Link href="/dating-photos/examples" className="font-bold text-[#ff6f00] underline decoration-2 underline-offset-4">{ui.moreLink}</Link></div></div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-5"><div className="text-center"><p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">{ui.faqEyebrow}</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{ui.faqTitle(shoot.name)}</h2></div><div className="mt-10 divide-y divide-zinc-200 border-y border-zinc-200">{faqs.map((faq) => <article key={faq.question} className="py-7"><h3 className="text-xl font-black">{faq.question}</h3><p className="mt-3 leading-7 text-zinc-600">{faq.answer}</p></article>)}</div></div>
      </section>

      <section className="bg-[#111111] px-5 py-20 text-center text-white"><div className="mx-auto max-w-5xl rounded-3xl border-2 border-dashed border-zinc-800 bg-[#161616] p-8 sm:p-14"><p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">{ui.finalEyebrow}</p><h2 className="mx-auto mt-3 max-w-4xl text-3xl font-black tracking-tight sm:text-6xl">{ui.finalHeading}</h2><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-300">{ui.finalDescription}</p><Link href="/dashboard" className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#ff6f00] px-8 py-4 font-bold text-white">{ui.finalCta} <ArrowRight className="h-4 w-4" /></Link></div></section>
    </>
  )
}
