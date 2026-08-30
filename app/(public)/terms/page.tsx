import { Metadata } from 'next'
import PublicHeader from '@/components/Header'
import Footer from '@/components/main-landing/Footer'
import { generateBreadcrumbJsonLd, generateMetadata } from '@/lib/seo'
import { MultipleStructuredData } from '@/components/seo/StructuredData'
import { seoUtils } from '@/config/seo'
import Link from 'next/link'

export const metadata: Metadata = generateMetadata({
  title: 'Terms of Service | UnrealShot AI Dating Photography',
  description: 'Review the terms and conditions for using UnrealShot AI dating photoshoot generator services.',
  canonical: '/terms',
})

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#F7F5F3] font-[family-name:var(--font-inter)] text-gray-900">
      <PublicHeader />
      <main className="pt-20 md:pt-24 pb-16">
        {/* Hero */}
        <section className="px-4 py-16 sm:py-20 max-w-5xl mx-auto text-center">
          <p className="text-orange-500 font-bold uppercase tracking-wider text-xs sm:text-sm mb-3 block">
            LEGAL &amp; COMPLIANCE
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-[var(--font-inter-tight)] tracking-tight leading-[1.08] text-gray-900 mb-4 max-w-4xl mx-auto">
            Terms of Service
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Please read these Terms of Service carefully before purchasing or using UnrealShot AI services.
          </p>
        </section>

        {/* Content */}
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_12px_50px_-15px_rgba(0,0,0,0.08)] p-8 sm:p-12 space-y-8">
            <p className="text-gray-500 text-xs font-mono">Last Updated: January 1, 2025</p>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">1. Introduction &amp; Acceptance</h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                Welcome to <strong className="text-gray-900">UnrealShot AI</strong> (&ldquo;we,&rdquo; &ldquo;our,&rdquo; &ldquo;us&rdquo;). By accessing our website (<a href="https://www.unrealshot.com" className="text-[#ff6f00] font-semibold hover:underline">unrealshot.com</a>) and purchasing our AI dating photoshoot services, you agree to comply with and be bound by these Terms of Service. If you disagree with any part of these terms, please do not use our services.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">2. Description of Service</h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                UnrealShot AI provides an advanced AI photography engine designed specifically for personal dating profiles (Tinder, Hinge, Bumble, Feeld, and similar platforms). Users upload 4–6 clear reference selfies to generate 15 distinct, high-resolution dating shoots (totaling 60 photos, with 4 cohesive angles and crops per shoot).
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">3. Pricing, Payments &amp; Photo Retakes</h2>
              <ul className="space-y-3 text-sm text-gray-700 list-disc list-inside">
                <li><strong className="text-gray-900">One-Time Pricing:</strong> The full dating package is a one-time payment of $39. We do not charge recurring subscriptions or hidden membership fees.</li>
                <li><strong className="text-gray-900">15 Photo Retakes Included:</strong> Every package includes 15 single-photo retakes to replace any frame with adjusted prompts and pose directions.</li>
                <li><strong className="text-gray-900">Refund Policy:</strong> In the event of system errors or unrecoverable generation failures, purchases are covered under our <Link href="/refund-policy" className="text-[#ff6f00] font-semibold hover:underline">Refund Policy</Link>.</li>
              </ul>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">4. Intellectual Property &amp; Commercial Ownership</h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-3">
                You retain all rights to the reference photos you upload. Upon generation and delivery, you receive full, perpetual, worldwide ownership and commercial license to use, publish, crop, and display your generated dating photos anywhere online or in print.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">5. User Conduct &amp; Prohibited Content</h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-3">
                You agree not to upload photos of minors, photos of third parties without their explicit legal consent, or content depicting illegal acts, non-consensual material, or severe harm. Violation of this rule results in immediate permanent account termination and forfeiture of access.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">6. Digital Delivery &amp; Turnaround</h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                UnrealShot AI is 100% digital. No physical prints or items are shipped. Generated photos are delivered directly to your secure user dashboard within 30–60 minutes following selfie submission.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">7. Limitation of Liability</h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                To the maximum extent permitted by applicable law, UnrealShot AI and its operators shall not be liable for any indirect, incidental, or consequential damages arising out of your use of our platform or results obtained on dating applications.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">8. Contact Us</h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                If you have questions about these Terms, please contact our support team at <a href="mailto:support@unrealshot.com" className="text-[#ff6f00] font-semibold hover:underline">support@unrealshot.com</a>.
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
                { name: 'Terms', url: seoUtils.generateCanonicalUrl('/terms') },
              ])
            ),
          },
        ]}
      />
    </div>
  )
}
