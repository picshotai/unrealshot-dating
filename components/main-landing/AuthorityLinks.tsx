"use client"

import Link from "next/link"
import { useLocale } from "next-intl"

const pages = [
  { href: "/dating-photos", title: "Dating profile photo guide", text: "Build a complete lineup with a clear opener, full-length, activity and candid roles." },
  { href: "/dating-photos/examples", title: "Complete shoot examples", text: "Inspect seven AI-generated four-frame shoots with individual captions." },
  { href: "/how-it-works", title: "How UnrealShot works", text: "From 4–6 reference selfies and three questions to 15 coherent shoots." },
  { href: "/realistic-ai-dating-photos", title: "How realistic photos are made", text: "See how reference-guided likeness, consistent scenes and retakes support a friend-taken look." },
]

export default function AuthorityLinks() {
  if (useLocale() !== "en") return null
  return <section className="bg-[#f7f5f3] px-5 py-20"><div className="mx-auto max-w-6xl"><p className="text-xs font-bold uppercase tracking-[.22em] text-[#e85d2a]">Dating photo resources</p><h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">Everything you need to build an honest, varied dating profile</h2><div className="mt-10 grid gap-5 md:grid-cols-2">{pages.map((page) => <Link key={page.href} href={page.href} className="rounded-3xl border border-zinc-200 bg-white p-7 transition hover:border-[#ff805d]"><h3 className="text-xl font-bold">{page.title}</h3><p className="mt-3 leading-7 text-zinc-600">{page.text}</p><span className="mt-5 inline-block font-semibold text-[#c94e24]">Read the guide →</span></Link>)}</div></div></section>
}
