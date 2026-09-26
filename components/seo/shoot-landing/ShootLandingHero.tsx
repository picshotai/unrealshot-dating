import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import type { DatingShoot } from "@/lib/dating-shoot-content"
import type { ShootLandingCopy } from "@/lib/dating-shoot-landing-content"
import type { ShootPageUiCopy } from "@/lib/dating-shoot-localized"

export default function ShootLandingHero({ shoot, copy, ui }: { shoot: DatingShoot; copy: ShootLandingCopy; ui: ShootPageUiCopy }) {
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
            <Link href="/login" className="inline-flex items-center gap-2 rounded-md bg-[#ff6f00] px-7 py-4 font-bold text-white shadow-[0_4px_25px_-5px_rgba(255,111,0,.45)] transition hover:bg-[#e96500]">{ui.createPhotos} <ArrowRight className="h-4 w-4" /></Link>
            <a href="#photos" className="font-bold text-zinc-950 underline decoration-[#ff6f00] decoration-2 underline-offset-4">{ui.seeExamples}</a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-2xl">
          <figure className="relative grid grid-cols-2 gap-3 rounded-[2rem] bg-zinc-950 p-3 shadow-2xl">
            {copy.gallery.slice(0, 4).map((photo, index) => (
              <div
                key={photo.src}
                className={`relative overflow-hidden rounded-2xl bg-zinc-800 ${index % 2 ? "translate-y-3" : "-translate-y-1"}`}
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    priority={index < 2}
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </figure>
        </div>
      </div>
    </section>
  )
}
