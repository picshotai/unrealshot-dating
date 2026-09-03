import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import type { DatingShoot } from "@/lib/dating-shoot-content"
import type { ShootLandingCopy } from "@/lib/dating-shoot-landing-content"
import type { ShootPageUiCopy } from "@/lib/dating-shoot-localized"

export default function ShootLandingHero({ shoot, copy, ui }: { shoot: DatingShoot; copy: ShootLandingCopy; ui: ShootPageUiCopy }) {
  const [primary, secondary, tertiary] = copy.gallery

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fffaf6_0%,#f7f5f3_55%,#ffffff_100%)] pb-16 pt-32 text-zinc-950 sm:pb-24 sm:pt-36">
      <div aria-hidden="true" className="absolute -right-24 top-20 h-96 w-96 rounded-full bg-[#ff6f00]/10 blur-3xl" />
      <div aria-hidden="true" className="absolute inset-0 opacity-50" style={{ backgroundImage: "linear-gradient(to right, rgba(24,24,27,.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(24,24,27,.045) 1px, transparent 1px)", backgroundSize: "88px 88px" }} />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[.9fr_1.1fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[.22em] text-[#ff6f00]">{copy.eyebrow}</p>
          <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
            {copy.heroTitle}
            <span className="mt-2 block text-[#ff6f00]">{copy.heroAccent}</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-600">{copy.heroDescription}</p>
          <div className="mt-8 grid gap-3 text-sm font-semibold text-zinc-700 sm:grid-cols-2">
            {ui.heroBullets.map((item) => <span key={item} className="flex items-center gap-2"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ff6f00]/10"><Check className="h-3.5 w-3.5 text-[#ff6f00]" /></span>{item}</span>)}
          </div>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-md bg-[#ff6f00] px-7 py-4 font-bold text-white shadow-[0_4px_25px_-5px_rgba(255,111,0,.45)] transition hover:bg-[#e96500]">{ui.createPhotos} <ArrowRight className="h-4 w-4" /></Link>
            <a href="#photos" className="font-bold text-zinc-950 underline decoration-[#ff6f00] decoration-2 underline-offset-4">{ui.seeExamples}</a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-2xl pb-9 sm:pb-12">
          <div className="grid grid-cols-[1.15fr_.85fr] gap-3 rounded-[2rem] border border-zinc-200 bg-white p-3 shadow-[0_30px_80px_-36px_rgba(24,24,27,.35)] sm:gap-4 sm:p-4">
            <figure className="relative row-span-2 overflow-hidden rounded-2xl bg-zinc-100"><div className="relative min-h-[430px] h-full"><Image src={primary.src} alt={primary.alt} fill priority sizes="(max-width: 1024px) 58vw, 33vw" className="object-cover" /></div></figure>
            {secondary && <figure className="relative overflow-hidden rounded-2xl bg-zinc-100"><div className="relative aspect-[4/5]"><Image src={secondary.src} alt={secondary.alt} fill priority sizes="(max-width: 1024px) 38vw, 22vw" className="object-cover" /></div></figure>}
            {tertiary && <figure className="relative overflow-hidden rounded-2xl bg-zinc-100"><div className="relative aspect-[4/5]"><Image src={tertiary.src} alt={tertiary.alt} fill sizes="(max-width: 1024px) 38vw, 22vw" className="object-cover" /></div></figure>}
          </div>
          <div className="absolute -bottom-1 left-4 right-4 rounded-2xl bg-zinc-950 px-5 py-4 text-white shadow-xl sm:left-8 sm:right-8">
            <p className="text-xs font-black uppercase tracking-[.16em] text-[#ff6f00]">{ui.heroPanelLabel}</p>
            <p className="mt-1 text-sm text-zinc-300">{ui.heroPanelDescription(shoot.name)}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
