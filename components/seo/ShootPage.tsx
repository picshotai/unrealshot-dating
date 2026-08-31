import Image from "next/image"
import Link from "next/link"
import PublicHeader from "@/components/Header"
import Footer from "@/components/main-landing/Footer"
import { MultipleStructuredData } from "@/components/seo/StructuredData"
import { datingShoots, type DatingShoot } from "@/lib/dating-shoot-content"
import { makeBreadcrumbJsonLd, makeWebPageJsonLd, publicUrl } from "@/lib/public-seo"

export default function ShootPage({ shoot }: { shoot: DatingShoot }) {
  const path = `/dating-photos/shoots/${shoot.slug}`
  const related = datingShoots.find((item) => item.slug === shoot.relatedSlug)!
  const breadcrumbs = [{ name: "Home", url: publicUrl("/", "en") }, { name: "Examples", url: publicUrl("/dating-photos/examples", "en") }, { name: shoot.name, url: publicUrl(path, "en") }]
  return <div className="min-h-screen bg-[#f7f5f3] text-zinc-900"><PublicHeader /><main className="pt-24 pb-20"><article>
    <header className="mx-auto max-w-4xl px-5 py-14 text-center"><p className="mb-4 text-xs font-bold uppercase tracking-[.22em] text-[#e85d2a]">AI-generated product example</p><h1 className="text-4xl font-bold tracking-tight sm:text-6xl">{shoot.title}</h1><p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-zinc-600">{shoot.answer}</p></header>
    <section aria-label="Four frames in this shoot" className="mx-auto grid max-w-7xl gap-6 px-5 md:grid-cols-2">{shoot.frames.map((frame) => <figure key={frame.role} className="overflow-hidden rounded-3xl border border-zinc-200 bg-white"><div className="relative aspect-[4/5]"><Image src={frame.src} alt={frame.alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" /></div><figcaption className="p-5"><strong className="block text-sm uppercase tracking-wider text-[#c94e24]">{frame.role}</strong><span className="mt-2 block leading-7 text-zinc-600">{frame.caption}</span></figcaption></figure>)}</section>
    <div className="mx-auto mt-16 max-w-3xl space-y-12 px-5">
      <section><h2 className="text-3xl font-bold">How the shoot stays coherent</h2><dl className="mt-6 grid gap-4 rounded-3xl border border-zinc-200 bg-white p-7 sm:grid-cols-2"><div><dt className="text-sm text-zinc-500">Location</dt><dd className="mt-1">{shoot.location}</dd></div><div><dt className="text-sm text-zinc-500">Clothing</dt><dd className="mt-1">{shoot.clothing}</dd></div><div><dt className="text-sm text-zinc-500">Lighting</dt><dd className="mt-1">{shoot.lighting}</dd></div><div><dt className="text-sm text-zinc-500">Action</dt><dd className="mt-1">{shoot.action}</dd></div></dl><p className="mt-5 leading-8 text-zinc-700"><strong>Intake interest:</strong> {shoot.interest}. Select this only when it reflects something true about you.</p></section>
      <section><h2 className="text-3xl font-bold">Where it fits in a dating profile</h2><p className="mt-4 leading-8 text-zinc-700">{shoot.profileFit}</p><p className="mt-4 leading-8 text-zinc-700">{shoot.pairing}</p></section>
      <section><h2 className="text-3xl font-bold">Using this shoot on {shoot.appName}</h2><p className="mt-4 leading-8 text-zinc-700">{shoot.appUse}</p><p className="mt-4 text-sm text-zinc-500">UnrealShot is not affiliated with {shoot.appName} and does not guarantee verification, matches or app outcomes.</p></section>
      <nav aria-label="Related shoot pages" className="rounded-3xl bg-zinc-950 p-8 text-white"><h2 className="text-2xl font-bold">Build the rest of the lineup</h2><div className="mt-5 flex flex-wrap gap-3"><Link href="/dating-photos/examples" className="rounded-full border border-zinc-700 px-4 py-2">All examples</Link><Link href={`/dating-photos/${shoot.appName.toLowerCase()}`} className="rounded-full border border-zinc-700 px-4 py-2">{shoot.appName} guide</Link><Link href={`/dating-photos/shoots/${related.slug}`} className="rounded-full border border-zinc-700 px-4 py-2">Related: {related.name}</Link></div><Link href="/dashboard" className="mt-8 inline-block rounded-lg bg-[#ff6f00] px-6 py-3 font-semibold">Create 15 shoots — $39</Link></nav>
    </div>
  </article></main><Footer /><MultipleStructuredData schemas={[{ id: "shoot-page", data: makeWebPageJsonLd({ name: shoot.title, description: shoot.description, url: publicUrl(path, "en"), locale: "en", breadcrumbs }) }, { id: "shoot-breadcrumb", data: makeBreadcrumbJsonLd(breadcrumbs) }]} /></div>
}
