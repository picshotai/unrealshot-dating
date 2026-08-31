import Link from "next/link"
import PublicHeader from "@/components/Header"
import Footer from "@/components/main-landing/Footer"
import { MultipleStructuredData } from "@/components/seo/StructuredData"
import type { AuthorityPageContent } from "@/lib/dating-authority-content"
import { makeBreadcrumbJsonLd, makeWebPageJsonLd, publicUrl } from "@/lib/public-seo"

export default function AuthorityContentPage({ content }: { content: AuthorityPageContent }) {
  const breadcrumbs = [
    { name: "Home", url: publicUrl("/", "en") },
    ...(content.path.startsWith("/dating-photos/") ? [{ name: "Dating Photos", url: publicUrl("/dating-photos", "en") }] : []),
    { name: content.title, url: publicUrl(content.path, "en") },
  ]

  return (
    <div className="min-h-screen bg-[#f7f5f3] text-zinc-900">
      <PublicHeader />
      <main className="pt-24 pb-20">
        <article>
          <header className="mx-auto max-w-4xl px-5 py-14 text-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-[.22em] text-[#e85d2a]">{content.eyebrow}</p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">{content.title}</h1>
            <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-zinc-600">{content.answer}</p>
            {content.reviewed && <p className="mt-5 text-sm text-zinc-500">Reviewed against official app guidance: {content.reviewed}</p>}
          </header>

          {content.facts && (
            <section aria-labelledby="facts-heading" className="mx-auto max-w-5xl px-5 pb-16">
              <h2 id="facts-heading" className="mb-5 text-center text-2xl font-bold">UnrealShot at a glance</h2>
              <dl className="grid overflow-hidden rounded-3xl border border-zinc-200 bg-white sm:grid-cols-2 lg:grid-cols-3">
                {content.facts.map(([label, value]) => <div key={label} className="border-b border-zinc-200 p-5 last:border-b-0 sm:border-r"><dt className="text-sm text-zinc-500">{label}</dt><dd className="mt-1 font-semibold">{value}</dd></div>)}
              </dl>
            </section>
          )}

          <div className="mx-auto max-w-3xl space-y-14 px-5">
            {content.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{section.heading}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 text-base leading-8 text-zinc-700">{paragraph}</p>)}
                {section.bullets && <ul className="mt-5 space-y-3 pl-6 text-zinc-700">{section.bullets.map((item) => <li key={item} className="list-disc pl-1 leading-7">{item}</li>)}</ul>}
              </section>
            ))}

            {content.sources && <section className="rounded-3xl border border-zinc-200 bg-white p-7"><h2 className="text-xl font-bold">Official sources</h2><p className="mt-2 text-sm leading-6 text-zinc-600">App rules can change. These primary sources were checked on the reviewed date above.</p><ul className="mt-4 space-y-2">{content.sources.map((source) => <li key={source.href}><a className="font-medium text-[#c94e24] underline underline-offset-4" href={source.href} target="_blank" rel="noreferrer">{source.label}</a></li>)}</ul></section>}

            <nav aria-label="Related pages" className="rounded-3xl bg-zinc-950 p-8 text-white">
              <h2 className="text-2xl font-bold">Continue exploring</h2>
              <div className="mt-5 flex flex-wrap gap-3">{content.related.map((item) => <Link key={item.href} href={item.href} className="rounded-full border border-zinc-700 px-4 py-2 text-sm hover:border-[#ff805d]">{item.label}</Link>)}</div>
              <Link href="/dashboard" className="mt-8 inline-block rounded-lg bg-[#ff6f00] px-6 py-3 font-semibold text-white">Create your 15 dating shoots — $39</Link>
            </nav>
          </div>
        </article>
      </main>
      <Footer />
      <MultipleStructuredData schemas={[
        { id: "authority-webpage", data: makeWebPageJsonLd({ name: content.title, description: content.description, url: publicUrl(content.path, "en"), locale: "en", breadcrumbs }) },
        { id: "authority-breadcrumb", data: makeBreadcrumbJsonLd(breadcrumbs) },
      ]} />
    </div>
  )
}
