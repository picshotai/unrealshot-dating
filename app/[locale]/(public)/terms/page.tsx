import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import PublicHeader from '@/components/Header'
import Footer from '@/components/main-landing/Footer'
import { MultipleStructuredData } from '@/components/seo/StructuredData'
import { Link as PublicLink } from '@/i18n/navigation'
import { getLocalizedMetadata, makeBreadcrumbJsonLd, makeWebPageJsonLd, publicUrl } from '@/lib/public-seo'
import type { PublishedPublicLocale } from '@/i18n/config'

type Params = { params: Promise<{ locale: string }> }

function linkLastOccurrence(text: string, label: string) {
  const index = text.lastIndexOf(label)
  if (index < 0) return text

  return (
    <>
      {text.slice(0, index)}
      <PublicLink href="/refund-policy" className="text-[#ff6f00] font-semibold hover:underline">
        {label}
      </PublicLink>
      {text.slice(index + label.length)}
    </>
  )
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = (await params).locale as PublishedPublicLocale
  const t = await getTranslations({ locale, namespace: 'Legal.terms' })
  return getLocalizedMetadata({ locale, pathname: '/terms', title: t('meta.title'), description: t('meta.description') })
}

export default async function TermsOfService({ params }: Params) {
  const locale = (await params).locale as PublishedPublicLocale
  const t = await getTranslations({ locale, namespace: 'Legal.terms' })
  return (
    <div className="min-h-screen bg-[#F7F5F3] font-[family-name:var(--font-inter)] text-gray-900">
      <PublicHeader />
      <main className="pt-20 md:pt-24 pb-16">
        {/* Hero */}
        <section className="px-4 py-16 sm:py-20 max-w-5xl mx-auto text-center">
          <p className="text-orange-500 font-bold uppercase tracking-wider text-xs sm:text-sm mb-3 block">
            {t('eyebrow')}
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-[var(--font-inter-tight)] tracking-tight leading-[1.08] text-gray-900 mb-4 max-w-4xl mx-auto">
            {t('heading')}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            {t('description')}
          </p>
        </section>

        {/* Content */}
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_12px_50px_-15px_rgba(0,0,0,0.08)] p-8 sm:p-12 space-y-8">
            <p className="text-gray-500 text-xs font-mono">{t('dateLabel')}</p>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{t('sections.0.heading')}</h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                {t('sections.0.paragraphs.0')}
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{t('sections.1.heading')}</h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                {t('sections.1.paragraphs.0')}
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{t('sections.2.heading')}</h2>
              <ul className="space-y-3 text-sm text-gray-700 list-disc list-inside">
                <li>{t('sections.2.items.0')}</li>
                <li>{t('sections.2.items.1')}</li>
                <li>{linkLastOccurrence(t('sections.2.items.2'), t('refundLink'))}</li>
              </ul>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{t('sections.3.heading')}</h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-3">
                {t('sections.3.paragraphs.0')}
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{t('sections.4.heading')}</h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-3">
                {t('sections.4.paragraphs.0')}
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{t('sections.5.heading')}</h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                {t('sections.5.paragraphs.0')}
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{t('sections.6.heading')}</h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                {t('sections.6.paragraphs.0')}
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{t('sections.7.heading')}</h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                {t('sections.7.contact')}
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Structured Data */}
      <MultipleStructuredData
        schemas={[
          {
            id: 'terms-webpage',
            data: makeWebPageJsonLd({
              name: t('heading'),
              description: t('description'),
              url: publicUrl('/terms', locale),
              locale,
              breadcrumbs: [
                { name: t('breadcrumbHome'), url: publicUrl('/', locale) },
                { name: t('heading'), url: publicUrl('/terms', locale) },
              ],
            }),
          },
          {
            id: 'terms-breadcrumb',
            data: makeBreadcrumbJsonLd([
              { name: t('breadcrumbHome'), url: publicUrl('/', locale) },
              { name: t('heading'), url: publicUrl('/terms', locale) },
            ]),
          },
        ]}
      />
    </div>
  )
}
