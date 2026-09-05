"use client"

import { useLocale } from "next-intl"
import { Link as PublicLink } from "@/i18n/navigation"
import { authorityLinksCopy } from "@/lib/authority-links-copy"

export default function AuthorityLinks() {
  const copy = authorityLinksCopy[useLocale() as keyof typeof authorityLinksCopy]
  return <section className="bg-[#f7f5f3] px-5 py-20"><div className="mx-auto max-w-6xl"><p className="text-xs font-bold uppercase tracking-[.22em] text-[#e85d2a]">{copy.eyebrow}</p><h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">{copy.heading}</h2><div className="mt-10 grid gap-5 md:grid-cols-2">{copy.pages.map((page) => <PublicLink key={page.href} href={page.href} className="rounded-3xl border border-zinc-200 bg-white p-7 transition hover:border-[#ff805d]"><h3 className="text-xl font-bold">{page.title}</h3><p className="mt-3 leading-7 text-zinc-600">{page.text}</p><span className="mt-5 inline-block font-semibold text-[#c94e24]">{copy.readGuide}</span></PublicLink>)}</div></div></section>
}
