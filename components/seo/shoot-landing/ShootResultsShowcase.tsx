import Image from "next/image"
import { Check } from "lucide-react"
import type { DatingShoot } from "@/lib/dating-shoot-content"
import type { ShootLandingCopy } from "@/lib/dating-shoot-landing-content"

export default function ShootResultsShowcase({ copy }: { shoot: DatingShoot; copy: ShootLandingCopy }) {
  return (
    <>
      <section id="photos" className="scroll-mt-24 bg-[#f7f5f3] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mx-auto max-w-4xl text-center"><p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">AI dating-photo examples</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{copy.showcaseTitle}</h2><p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-600">{copy.showcaseDescription}</p></div>
          <div className={`mt-12 grid gap-5 sm:grid-cols-2 ${copy.gallery.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>{copy.gallery.map((image) => <figure key={image.src} className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm"><div className="relative aspect-[4/5]"><Image src={image.src} alt={image.alt} fill sizes="(max-width: 640px) 100vw, 25vw" className="object-cover" /></div><figcaption className="p-5"><strong className="text-xs uppercase tracking-wide text-[#ff6f00]">Created with UnrealShot</strong><p className="mt-3 text-sm leading-6 text-zinc-600">{image.caption}</p></figcaption></figure>)}</div>
          <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-[#ff6f00]/20 bg-[#fff7f0] px-6 py-5 text-center text-sm leading-6 text-zinc-700"><strong>Your delivery goes beyond the photos shown here.</strong> UnrealShot creates 15 original photoshoot ideas from your current selfies and intake, with four connected photos for every idea.</div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5"><div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-center"><div><p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">What this solves</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{copy.benefitsTitle}</h2><p className="mt-6 text-lg leading-8 text-zinc-600">The purpose is not to add more filler. It is to replace a weak or missing part of your camera roll with a photo that reveals something useful about you.</p></div><div className="space-y-4">{copy.benefits.map((benefit) => <article key={benefit.title} className="grid grid-cols-[44px_1fr] gap-4 rounded-3xl border border-zinc-200 bg-[#f7f5f3] p-6"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff6f00] text-white"><Check className="h-5 w-5" /></span><div><h3 className="text-xl font-black">{benefit.title}</h3><p className="mt-2 leading-7 text-zinc-600">{benefit.body}</p></div></article>)}</div></div></div>
      </section>
    </>
  )
}
