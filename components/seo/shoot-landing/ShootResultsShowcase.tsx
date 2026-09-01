import Image from "next/image"
import type { DatingShoot } from "@/lib/dating-shoot-content"
import type { ShootLandingCopy } from "@/lib/dating-shoot-landing-content"

export default function ShootResultsShowcase({ shoot, copy }: { shoot: DatingShoot; copy: ShootLandingCopy }) {
  return (
    <>
      <section id="photos" className="scroll-mt-24 bg-[#f7f5f3] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mx-auto max-w-4xl text-center"><p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">What you can receive</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{copy.showcaseTitle}</h2><p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-600">{copy.showcaseDescription}</p></div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{shoot.frames.map((frame, index) => <figure key={frame.role} className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm"><div className="relative aspect-[4/5]"><Image src={frame.src} alt={frame.alt} fill sizes="(max-width: 640px) 100vw, 25vw" className="object-cover" /></div><figcaption className="p-5"><span className="font-mono text-xs font-black text-[#ff6f00]">0{index + 1}</span><strong className="ml-2 text-sm uppercase tracking-wide">{frame.role}</strong><p className="mt-3 text-sm leading-6 text-zinc-600">{frame.caption}</p></figcaption></figure>)}</div>
          <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6 text-zinc-500">These frames are alternatives from one shoot. Choose the most accurate option for your profile rather than using four near-identical photos together.</p>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5"><div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-center"><div><p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">Why this scene earns a place</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{copy.benefitsTitle}</h2><p className="mt-6 text-lg leading-8 text-zinc-600">The goal is not to collect more images. It is to fill a missing role in your profile with a scene that looks plausible for your actual life.</p></div><div className="space-y-4">{copy.benefits.map((benefit, index) => <article key={benefit.title} className="grid grid-cols-[52px_1fr] gap-4 rounded-3xl border border-zinc-200 bg-[#f7f5f3] p-6"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ff6f00] font-mono font-black text-white">0{index + 1}</span><div><h3 className="text-xl font-black">{benefit.title}</h3><p className="mt-2 leading-7 text-zinc-600">{benefit.body}</p></div></article>)}</div></div></div>
      </section>
    </>
  )
}
