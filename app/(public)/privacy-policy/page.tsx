import { Metadata } from 'next'
import PublicHeader from '@/components/Header'
import Footer from '@/components/main-landing/Footer'
import { generateBreadcrumbJsonLd, generateMetadata } from '@/lib/seo'
import { MultipleStructuredData } from '@/components/seo/StructuredData'
import { seoUtils } from '@/config/seo'

export const metadata: Metadata = generateMetadata({
  title: 'Privacy Policy | UnrealShot AI Dating Photography',
  description: 'Learn how UnrealShot AI collects, uses, and protects your personal selfies and dating photoshoot data.',
  canonical: '/privacy-policy',
})

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#F7F5F3] font-[family-name:var(--font-inter)] text-gray-900">
      <PublicHeader />
      <main className="pt-20 md:pt-24 pb-16">
        {/* Hero */}
        <section className="px-4 py-16 sm:py-20 max-w-5xl mx-auto text-center">
          <p className="text-orange-500 font-bold uppercase tracking-wider text-xs sm:text-sm mb-3 block">
            LEGAL &amp; PRIVACY
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-[var(--font-inter-tight)] tracking-tight leading-[1.08] text-gray-900 mb-4 max-w-4xl mx-auto">
            Privacy Policy
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            How UnrealShot AI safeguards your personal information, reference selfies, and generated photos.
          </p>
        </section>

        {/* Content */}
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_12px_50px_-15px_rgba(0,0,0,0.08)] p-8 sm:p-12 space-y-8">
            <p className="text-gray-500 text-xs font-mono">Effective Date: January 1, 2025</p>

            <div>
              <p className="text-gray-700 text-base leading-relaxed">
                At <strong className="text-gray-900">UnrealShot AI</strong> (&ldquo;unrealshot.com&rdquo;), we are deeply committed to protecting your privacy. This Privacy Policy explains what information we collect, how we process user data, and your rights under applicable privacy laws, including the General Data Protection Regulation (GDPR). By using our dating photoshoot services, you agree to the practices described in this policy.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">We collect and process the following categories of data:</p>

              <h3 className="text-gray-900 font-bold text-sm mb-2">1.1 Personal Information Provided by You</h3>
              <ul className="space-y-2 text-sm text-gray-700 mb-4 list-disc list-inside">
                <li><strong className="text-gray-900">Email Address:</strong> Used for account creation, login, and deliverable notification.</li>
                <li><strong className="text-gray-900">Uploaded Selfies:</strong> 4–6 reference photos used exclusively to train your temporary model and generate your dating shoots.</li>
                <li><strong className="text-gray-900">Payment Information:</strong> Processed securely via our merchant of record, Dodo Payments. We do not store raw card numbers.</li>
              </ul>

              <h3 className="text-gray-900 font-bold text-sm mb-2">1.2 Automatically Collected Technical Data</h3>
              <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
                <li>Device, browser type, and operating system info.</li>
                <li>IP address and anonymized diagnostic logs for security and fraud prevention.</li>
              </ul>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">2. How We Use Your Data</h2>
              <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
                <li><strong className="text-gray-900">Service Generation:</strong> To generate your 15 dating shoots and power the 15 included Photo Retakes.</li>
                <li><strong className="text-gray-900">Zero Facial Data Selling:</strong> We never sell, lease, or distribute your facial data, uploaded selfies, or generated photos to third-party brokers or advertisers.</li>
                <li><strong className="text-gray-900">Security &amp; Abuse Prevention:</strong> To safeguard our infrastructure against fraudulent activity.</li>
              </ul>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">3. Data Retention &amp; Permanent Deletion</h2>
              <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
                <li><strong className="text-gray-900">Uploaded Selfies:</strong> Retained temporarily to facilitate your generation and retakes, then scheduled for permanent deletion.</li>
                <li><strong className="text-gray-900">On-Demand Deletion:</strong> You have the right at any time to request complete and permanent erasure of your account, selfies, and generated rolls from your dashboard or by emailing support.</li>
              </ul>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">4. GDPR &amp; Global Privacy Rights</h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-3">
                If you are an EU/EEA or UK resident, you hold full GDPR rights:
              </p>
              <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside mb-3">
                <li>Right of access and copy of your personal data.</li>
                <li>Right to rectification and erasure (&ldquo;Right to be Forgotten&rdquo;).</li>
                <li>Right to data portability and restriction of processing.</li>
              </ul>
              <p className="text-gray-700 text-sm leading-relaxed">
                To exercise any rights, email us at <a href="mailto:support@unrealshot.com" className="text-[#ff6f00] font-semibold hover:underline">support@unrealshot.com</a>. Requests are honored within 14 business days.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">5. Data Processors &amp; Security</h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-3">
                We work only with vetted cloud and payment infrastructure providers:
              </p>
              <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
                <li><strong className="text-gray-900">Payment Processor:</strong> Dodo Payments (PCI-DSS compliant).</li>
                <li><strong className="text-gray-900">Secure Database:</strong> Supabase (encrypted in transit and at rest).</li>
                <li><strong className="text-gray-900">Cloud Storage:</strong> Cloudflare R2 with encrypted object storage.</li>
              </ul>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">6. Contact Information</h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                For questions regarding this policy, please reach out to us directly:<br />
                <strong className="text-gray-900">Email:</strong> <a href="mailto:support@unrealshot.com" className="text-[#ff6f00] font-semibold hover:underline">support@unrealshot.com</a><br />
                <strong className="text-gray-900">Website:</strong> <a href="https://www.unrealshot.com" className="text-[#ff6f00] font-semibold hover:underline">unrealshot.com</a>
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
                { name: 'Privacy Policy', url: seoUtils.generateCanonicalUrl('/privacy-policy') },
              ])
            ),
          },
        ]}
      />
    </div>
  )
}