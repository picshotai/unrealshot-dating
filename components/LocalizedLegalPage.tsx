import PublicHeader from "@/components/Header"
import Footer from "@/components/main-landing/Footer"

export type LegalSubsection = { heading: string; items?: string[] }
export type LegalSection = {
  heading: string
  paragraphs?: string[]
  items?: string[]
  contact?: string
  subsections?: LegalSubsection[]
}

export function LocalizedLegalPage({
  copy,
}: { copy: LocalizedLegalCopy }) {
  return (
    <div className="min-h-screen bg-[#F7F5F3] font-[family-name:var(--font-inter)] text-gray-900">
      <PublicHeader />
      <main className="pt-20 md:pt-24 pb-16">
        <section className="px-4 py-16 sm:py-20 max-w-5xl mx-auto text-center">
          <p className="text-orange-500 font-bold uppercase tracking-wider text-xs sm:text-sm mb-3 block">{copy.eyebrow}</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-[var(--font-inter-tight)] tracking-tight leading-[1.08] text-gray-900 mb-4 max-w-4xl mx-auto">{copy.heading}</h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">{copy.description}</p>
        </section>

        <section className="max-w-5xl mx-auto px-4 pb-16">
          <article className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_12px_50px_-15px_rgba(0,0,0,0.08)] p-8 sm:p-12 space-y-8">
            <p className="text-gray-500 text-xs font-mono">{copy.dateLabel}</p>
            {copy.intro && <p className="text-gray-700 text-base leading-relaxed">{copy.intro}</p>}
            {copy.sections.map((section) => (
              <section key={section.heading} className="border-t border-gray-100 pt-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{section.heading}</h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="text-gray-700 text-sm sm:text-base leading-relaxed mb-3">{paragraph}</p>
                ))}
                {section.subsections?.map((subsection) => (
                  <div key={subsection.heading} className="mb-4">
                    <h3 className="text-gray-900 font-bold text-sm mb-2">{subsection.heading}</h3>
                    <LegalList items={subsection.items ?? []} />
                  </div>
                ))}
                <LegalList items={section.items ?? []} />
                {section.contact && <p className="text-gray-700 text-sm sm:text-base leading-relaxed mt-3">{section.contact}</p>}
              </section>
            ))}
          </article>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export type LocalizedLegalCopy = {
  eyebrow: string
  heading: string
  description: string
  dateLabel: string
  intro?: string
  sections: LegalSection[]
}

function LegalList({ items }: { items: string[] }) {
  if (!items.length) return null
  return (
    <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  )
}
