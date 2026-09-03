import { Check, X } from "lucide-react"
import type { DatingShoot } from "@/lib/dating-shoot-content"
import type { ShootLandingCopy } from "@/lib/dating-shoot-landing-content"

export default function ShootPainSolution({ copy }: { shoot: DatingShoot; copy: ShootLandingCopy }) {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto max-w-4xl text-center"><p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">The profile problem</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{copy.painTitle}</h2><p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-600">{copy.painDescription}</p></div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">{copy.pains.map((pain) => <article key={pain.title} className="rounded-3xl border border-red-100 bg-red-50/40 p-7"><X className="h-6 w-6 text-red-500" /><h3 className="mt-5 text-xl font-black">{pain.title}</h3><p className="mt-3 leading-7 text-zinc-600">{pain.body}</p></article>)}</div>
        <div className="mt-6 grid gap-6 rounded-3xl bg-zinc-950 p-7 text-white shadow-2xl md:grid-cols-[.72fr_1.28fr] md:p-10"><div><p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">What UnrealShot changes</p><h3 className="mt-3 text-3xl font-black">Your camera roll no longer decides what your profile can show</h3></div><div className="grid gap-4 sm:grid-cols-2">{["4–6 current selfies guide your likeness", "Your intake adds real interests and preferences", "UnrealShot creates 15 varied photoshoot ideas", "Every idea includes four connected photos"].map((item) => <div key={item} className="flex gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-sm leading-6 text-zinc-200"><Check className="mt-1 h-4 w-4 shrink-0 text-[#ff6f00]" />{item}</div>)}</div></div>
      </div>
    </section>
  )
}
