import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import type { DatingShoot } from "@/lib/dating-shoot-content"
import type { ShootLandingCopy } from "@/lib/dating-shoot-landing-content"

export default function ShootLandingHero({ shoot, copy }: { shoot: DatingShoot; copy: ShootLandingCopy }) {
  return (
    <section className="relative overflow-hidden bg-black pb-16 pt-16 text-white sm:pb-24 sm:pt-20">
      <div aria-hidden="true" className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(to right, rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.08) 1px, transparent 1px)", backgroundSize: "100px 100px" }} />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[.9fr_1.1fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[.22em] text-[#ff6f00]">{copy.eyebrow}</p>
          <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">{copy.heroTitle} <span className="text-[#ff6f00]">{copy.heroAccent}</span></h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-300">{copy.heroDescription}</p>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-zinc-200">
            {["Four related photo options", "15 different shoots in every delivery", "Delivered within 30 minutes", "$39 once · no subscription"].map((item) => <span key={item} className="flex items-center gap-2"><Check className="h-4 w-4 text-[#ff6f00]" />{item}</span>)}
          </div>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-md bg-[#ff6f00] px-7 py-4 font-bold text-white shadow-[0_4px_25px_-5px_rgba(255,111,0,.45)] transition hover:bg-[#e96500]">Create my dating photos <ArrowRight className="h-4 w-4" /></Link>
            <a href="#photos" className="font-bold text-white underline decoration-zinc-600 underline-offset-4">See the photos</a>
          </div>
          <p className="mt-4 text-xs leading-5 text-zinc-500">Illustrative AI-generated concept—not a selectable preset or guaranteed scene. Your intake guides varied ideas created for your delivery.</p>
        </div>

        <div className="rounded-3xl border border-white/15 bg-[#141414] p-3 shadow-2xl">
          <div className="grid grid-cols-2 gap-3">
            {shoot.frames.map((frame, index) => <figure key={frame.role} className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900"><div className="relative aspect-[4/5]"><Image src={frame.src} alt={frame.alt} fill priority sizes="(max-width: 1024px) 50vw, 27vw" className="object-cover transition duration-300 hover:scale-[1.02]" /></div><figcaption className="absolute inset-x-2 bottom-2 rounded-lg bg-black/80 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-white backdrop-blur"><span className="text-[#ff6f00]">0{index + 1}</span> · {frame.role}</figcaption></figure>)}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 px-2 pb-1 pt-4 text-xs"><span className="font-mono uppercase tracking-wider text-zinc-300">{shoot.name} · one coherent scene</span><span className="text-zinc-500">Same setting · outfit · light</span></div>
        </div>
      </div>
    </section>
  )
}
