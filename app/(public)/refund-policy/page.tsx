import { Metadata } from 'next'
import PublicHeader from '@/components/Header'
import Footer from '@/components/main-landing/Footer'
import { generateBreadcrumbJsonLd, generateMetadata } from '@/lib/seo'
import { MultipleStructuredData } from '@/components/seo/StructuredData'
import { seoUtils } from '@/config/seo'

export const metadata: Metadata = generateMetadata({
  title: 'Refund Policy | UnrealShot AI Dating Photography',
  description:
    'Read about our refund policy, 15 photo retakes guarantee, and customer satisfaction commitments at UnrealShot AI.',
  canonical: '/refund-policy',
})

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-[#F7F5F3] font-[family-name:var(--font-inter)] text-gray-900">
      <PublicHeader />
      <main className="pt-20 md:pt-24 pb-16">
        {/* Hero */}
        <section className="px-4 py-16 sm:py-20 max-w-5xl mx-auto text-center">
          <p className="text-orange-500 font-bold uppercase tracking-wider text-xs sm:text-sm mb-3 block">
            CUSTOMER GUARANTEE
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-[var(--font-inter-tight)] tracking-tight leading-[1.08] text-gray-900 mb-4 max-w-4xl mx-auto">
            Refund &amp; Retake Policy
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            We are committed to delivering believable, high-performing dating photos you feel proud to use.
          </p>
        </section>

        {/* Content */}
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_12px_50px_-15px_rgba(0,0,0,0.08)] p-8 sm:p-12 space-y-8">
            <p className="text-gray-500 text-xs font-mono">Last Updated: January 1, 2025</p>

            <div>
              <p className="text-gray-700 text-base leading-relaxed">
                Thank you for choosing <strong className="text-gray-900">UnrealShot AI</strong>. Generating high-quality AI dating photos requires significant GPU computational resources, but our primary mission is making sure you get authentic photos that accurately represent your real-life likeness.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">1. Built-In 15 Photo Retakes</h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-3">
                Every purchase of the $39 dating package includes <strong>15 free individual Photo Retakes</strong>. If a specific frame has an awkward pose, angle, or facial expression, click &ldquo;Retake Photo&rdquo; directly on that image to regenerate a fresh version without having to restart your entire photoshoot.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">2. Eligible Refund Scenarios</h2>
              <ul className="space-y-3 text-sm text-gray-700 list-disc list-inside">
                <li><strong className="text-gray-900">Technical System Failures:</strong> If an unforeseen server error prevents your 15 shoots from completing generation or rendering, you are eligible for an immediate full refund.</li>
                <li><strong className="text-gray-900">Duplicate Billing:</strong> If you were accidentally charged more than once for a single order, the duplicate transaction will be refunded immediately.</li>
                <li><strong className="text-gray-900">Non-Delivery:</strong> If your order does not complete processing within 24 hours of valid selfie submission and our support team cannot deliver your photos, a full refund will be granted.</li>
              </ul>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">3. Request Timeframe &amp; Processing</h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-3">
                Refund requests must be submitted within <strong>7 days</strong> of the initial purchase date. Approved refunds are credited directly back to the original payment method through Dodo Payments within 3–7 business days.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">4. How to Request Assistance or a Refund</h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                If you encounter any issues or need assistance, simply send your order email and details to <a href="mailto:support@unrealshot.com" className="text-[#ff6f00] font-semibold hover:underline">support@unrealshot.com</a>. Our support team typically resolves inquiries within 24 hours.
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
            id: 'breadcrumb',
            data: JSON.parse(
              generateBreadcrumbJsonLd([
                { name: 'Home', url: seoUtils.generateCanonicalUrl('/') },
                { name: 'Refund Policy', url: seoUtils.generateCanonicalUrl('/refund-policy') },
              ])
            ),
          },
        ]}
      />
    </div>
  )
}
