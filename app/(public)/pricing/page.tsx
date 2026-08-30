import { Metadata } from 'next'
import PublicHeader from '@/components/Header'
import Footer from '@/components/main-landing/Footer'
import { generateBreadcrumbJsonLd, generateFAQJsonLd, generateProductJsonLd } from '@/lib/seo'
import { MultipleStructuredData } from '@/components/seo/StructuredData'
import { seoUtils } from '@/config/seo'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check, ShieldCheck, Zap, RotateCcw, Camera, Sparkles, HelpCircle, Lock, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: "Dating Profile Photoshoot Pricing & Packaging | UnrealShot AI",
  description: "Simple, transparent pricing for AI dating photos. Get 15 complete shoots (60 high-resolution photos) and 15 Photo Retakes for a flat one-time payment of $39. No subscriptions.",
  alternates: {
    canonical: "https://www.unrealshot.com/pricing",
  },
  openGraph: {
    title: "Dating Profile Photoshoot Pricing & Packaging | UnrealShot AI",
    description: "15 complete shoots, 60 natural photos, and 15 Photo Retakes for $39 one-time. Zero monthly subscriptions.",
    type: "website",
    url: "https://www.unrealshot.com/pricing",
  },
}

const datingFeatures = [
  "15 distinct lifestyle shoots (coffee shops, rooftops, parks, urban streets, casual indoor)",
  "4 cohesive frames per shoot (60 total high-resolution photos)",
  "15 individual Photo Retakes included with prompt adjustments",
  "One consistent facial identity and natural skin texture throughout",
  "Tailored specifically for Tinder, Hinge, Bumble, and Feeld algorithms",
  "No prompt engineering required — automated creative direction",
  "Requires only 4–6 casual phone selfies to start",
  "Full personal & commercial copyright ownership",
  "Complete data privacy with permanent on-demand file deletion",
  "One-time flat payment of $39 · Zero monthly subscriptions",
]

const comparisonData = [
  {
    feature: "Total Upfront Cost",
    unrealshot: "$39 one-time",
    photographer: "$450 – $1,200+",
    otherAi: "$20–$40 / month (recurring)",
  },
  {
    feature: "Total Deliverables",
    unrealshot: "60 photos (15 cohesive shoots)",
    photographer: "10 – 20 edited photos",
    otherAi: "20 – 50 random single images",
  },
  {
    feature: "Effective Cost Per Photo",
    unrealshot: "$0.65 / photo",
    photographer: "$30.00 – $60.00 / photo",
    otherAi: "$1.00+ / photo (unusable waste)",
  },
  {
    feature: "Number of Outfits & Locations",
    unrealshot: "15 distinct settings & styles",
    photographer: "1 – 2 locations max",
    otherAi: "Random, disjointed backgrounds",
  },
  {
    feature: "Photo Cohesion (4 Frames / Shoot)",
    unrealshot: "Included (4 matching angles per vibe)",
    photographer: "Limited to shoot day",
    otherAi: "Disconnected single portraits",
  },
  {
    feature: "Photo Retake Policy",
    unrealshot: "15 free individual retakes included",
    photographer: "Paid reshoot ($200+/hr)",
    otherAi: "Must burn additional paid credits",
  },
  {
    feature: "Awkward Public Posing",
    unrealshot: "None (Upload selfies in 3 minutes)",
    photographer: "2–3 hours in public spaces",
    otherAi: "None",
  },
  {
    feature: "Delivery Turnaround",
    unrealshot: "~30 minutes",
    photographer: "5 – 14 business days",
    otherAi: "1 – 3 hours",
  },
]

const pricingFaqs = [
  {
    question: "Is $39 really a one-time fee, or will I be billed monthly?",
    answer: "It is 100% a single one-time payment of $39. We do not have hidden subscriptions, recurring memberships, or surprise token renewals. You pay once and own your 60 photos and 15 Photo Retakes forever."
  },
  {
    question: "How do the 15 included Photo Retakes work?",
    answer: "If any single image out of your 60 photos has an awkward expression, pose, or lighting nuance, simply click 'Retake Photo' under that image on your dashboard. You can add specific guidance (e.g. 'smile more', 'adjust camera angle', 'outdoor lighting') and regenerate that specific frame at zero additional charge."
  },
  {
    question: "Which payment methods and currencies do you accept?",
    answer: "We process payments securely through Dodo Payments (our global Merchant of Record). We accept all major Credit and Debit Cards (Visa, Mastercard, American Express), Apple Pay, Google Pay, and localized payment methods across over 135 countries."
  },
  {
    question: "What happens if the generation fails due to a server error?",
    answer: "In the rare event of a technical processing error where your shoots cannot be rendered, our system automatically alerts our engineering team to re-run your job, or we issue an immediate full refund under our 7-day technical guarantee."
  },
  {
    question: "Do I retain full copyright ownership of my photos?",
    answer: "Yes. You hold 100% personal and commercial rights to all 60 generated images. You can crop, edit, publish, and post them anywhere without royalties or restrictions."
  },
  {
    question: "How long are my selfies and generated photos stored?",
    answer: "Your privacy is paramount. Your uploaded selfies and generated dating shoots are stored securely in encrypted storage. You can download your entire camera roll in high resolution and permanently delete all your data with a single click from your account dashboard."
  },
  {
    question: "Can I buy another package in the future if I change my hairstyle or beard?",
    answer: "Yes! Many clients return whenever they change their haircut, get new wardrobe pieces, or want fresh seasonal shoots (e.g. summer beach trips or winter urban looks). You can launch a brand new 15-shoot package whenever you like."
  }
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F3] font-[family-name:var(--font-inter)] text-gray-900">
      <PublicHeader />

      <main className="pt-20 md:pt-24 pb-20">
        {/* Hero Section */}
        <section className="px-4 py-12 sm:py-16 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 text-[#ff6f00] text-xs font-bold uppercase tracking-wider mb-4 border border-orange-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TRANSPARENT, ONE-TIME DATING PACKAGES</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-[var(--font-inter-tight)] tracking-tight leading-[1.08] text-gray-900 mb-5 max-w-4xl mx-auto">
            One Flat Investment. 15 Complete Shoots. <br className="hidden sm:block" />
            <span className="text-[#ff6f00]">Zero Recurring Subscriptions.</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            No monthly credit drains or confusing token meters. Get 60 natural dating photos across 15 believable settings with 15 Photo Retakes included for a flat $39.
          </p>
        </section>

        {/* Master Package Card */}
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_12px_50px_-15px_rgba(0,0,0,0.08)] overflow-hidden grid lg:grid-cols-12">
            {/* Left: Deliverables & Features */}
            <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-100">
              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff6f00]">
                    THE COMPLETE DATING CAMERA ROLL
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">
                    Most Popular Choice
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 font-[var(--font-inter-tight)]">
                  Everything You Need for a Top 1% Profile
                </h2>
                <p className="text-gray-600 text-sm mb-8 leading-relaxed">
                  Engineered specifically to give you natural, candid proof of an active lifestyle without looking like you hired a photographer or used an AI filter.
                </p>

                <div className="space-y-4">
                  {datingFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-[#ff6f00]">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-sm text-gray-700 leading-snug">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">15</div>
                  <div className="text-[11px] text-gray-500 font-medium">Distinct Shoots</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">60</div>
                  <div className="text-[11px] text-gray-500 font-medium">Candid Photos</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">15</div>
                  <div className="text-[11px] text-gray-500 font-medium">Photo Retakes</div>
                </div>
              </div>
            </div>

            {/* Right: Checkout Pane */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#111111] to-[#181818] p-8 sm:p-12 flex flex-col justify-between text-white relative">
              <div>
                <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-orange-400 mb-6">
                  ⚡ Instant Delivery (~30 mins)
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl sm:text-6xl font-bold tracking-tight text-white">$39</span>
                    <span className="text-gray-400 text-sm">USD / one-time</span>
                  </div>
                  <p className="text-gray-400 text-xs mt-2">
                    No recurring fees · No hidden credits · Instant digital access
                  </p>
                </div>

                <div className="space-y-3.5 my-8">
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-[#ff6f00] flex-shrink-0" />
                    <span>60 High-Resolution Portrait Downloads</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-[#ff6f00] flex-shrink-0" />
                    <span>15 Single-Photo Retakes Guarantee</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-[#ff6f00] flex-shrink-0" />
                    <span>Tinder, Hinge & Bumble Aspect Ratios</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-[#ff6f00] flex-shrink-0" />
                    <span>Encrypted Private Likeness Model</span>
                  </div>
                </div>
              </div>

              <div>
                <Link href="/dashboard" className="block w-full">
                  <Button className="w-full group relative bg-[#ff6f00] hover:bg-[#ff6f00]/90 text-white rounded-xl overflow-hidden cursor-pointer py-6 font-bold text-base shadow-xl shadow-orange-500/20 active:scale-[0.99] transition-all">
                    Start Your Dating Shoot — $39
                    <div className="bg-white rounded-md p-2.5 absolute right-2 top-1/2 -translate-y-1/2">
                      <img
                        src="/arrow.svg"
                        alt="arrow-right"
                        className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </div>
                  </Button>
                </Link>

                <div className="mt-6 flex flex-col items-center gap-2 text-center text-xs text-gray-400">
                  <div className="flex items-center justify-center gap-2 text-gray-300">
                    <Lock className="w-3.5 h-3.5 text-green-400" />
                    <span>256-Bit SSL Encrypted Checkout via Dodo Payments</span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Backed by our 7-Day Technical Failure & Satisfaction Guarantee
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cost & Deliverable Comparison Table */}
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff6f00] mb-2">
              COST COMPARISON &amp; VALUE
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight font-[var(--font-inter-tight)]">
              Why Men Choose UnrealShot Over Traditional Studios
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-3">
              Traditional dating photographers charge hundreds for awkward posing in 1 outfit. Here is how UnrealShot AI compares on deliverables and cost.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    <th className="p-4 sm:p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Metric / Deliverable</th>
                    <th className="p-4 sm:p-6 text-xs font-bold text-[#ff6f00] uppercase tracking-wider bg-orange-500/5">
                      UnrealShot AI ($39)
                    </th>
                    <th className="p-4 sm:p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Traditional Photographer</th>
                    <th className="p-4 sm:p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Generic AI Tools</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {comparisonData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 sm:p-6 font-semibold text-gray-900">{row.feature}</td>
                      <td className="p-4 sm:p-6 font-bold text-gray-900 bg-orange-500/5">
                        <span className="inline-flex items-center gap-1.5 text-gray-900">
                          <Check className="w-4 h-4 text-[#ff6f00] flex-shrink-0" />
                          {row.unrealshot}
                        </span>
                      </td>
                      <td className="p-4 sm:p-6 text-gray-600">{row.photographer}</td>
                      <td className="p-4 sm:p-6 text-gray-600">{row.otherAi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 4-Step Process Section */}
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff6f00] mb-2">
              SIMPLE 4-STEP WORKFLOW
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight font-[var(--font-inter-tight)]">
              How Your Photoshoot Is Generated
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#ff6f00] flex items-center justify-center font-bold text-sm mb-4 border border-orange-100">
                  01
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">Upload 4–6 Selfies</h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  Upload normal, casual phone selfies with different lighting and angles. No studio quality required.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#ff6f00] flex items-center justify-center font-bold text-sm mb-4 border border-orange-100">
                  02
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">Likeness Calibration</h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  Our private model maps your true bone structure and facial likeness while avoiding fake airbrushed skin.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#ff6f00] flex items-center justify-center font-bold text-sm mb-4 border border-orange-100">
                  03
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">15 Shoots Delivered</h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  Receive 15 distinct lifestyle shoots with 4 matching frames each (60 total high-res photos) in ~30 mins.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#ff6f00] flex items-center justify-center font-bold text-sm mb-4 border border-orange-100">
                  04
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">15 Retakes on Demand</h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  Easily swap out any single frame that needs an adjusted expression or pose using your 15 included retakes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing & Billing FAQs */}
        <section className="max-w-4xl mx-auto px-4 pb-20">
          <div className="text-center mb-12">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff6f00] mb-2">
              BILLING &amp; PURCHASE QUESTIONS
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight font-[var(--font-inter-tight)]">
              Frequently Asked Pricing Questions
            </h2>
          </div>

          <div className="space-y-4">
            {pricingFaqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-bold text-gray-900 mb-2.5 flex items-start gap-2.5">
                  <HelpCircle className="w-4 h-4 text-[#ff6f00] mt-1 flex-shrink-0" />
                  <span>{faq.question}</span>
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed pl-6.5">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="max-w-5xl mx-auto px-4">
          <div className="bg-[#111111] rounded-3xl p-8 sm:p-12 text-white text-center border-2 border-dashed border-zinc-800 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 font-[var(--font-inter-tight)]">
              Upgrade Your Dating Matches Today
            </h2>
            <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
              Join thousands of men who replaced weak selfies with 15 complete lifestyle shoots. One-time payment of $39.
            </p>
            <div className="inline-block relative">
              <Link href="/dashboard">
                <Button className="group relative bg-[#ff6f00] hover:bg-[#ff6f00]/90 text-white rounded-md overflow-hidden cursor-pointer px-8 pr-16 py-6 font-semibold text-base shadow-lg shadow-orange-500/20">
                  Build My Dating Profile — $39
                  <div className="bg-white rounded-sm p-3 absolute right-1 top-1/2 -translate-y-1/2">
                    <img
                      src="/arrow.svg"
                      alt="arrow-right"
                      className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </div>
                </Button>
              </Link>
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
                { name: 'Pricing', url: seoUtils.generateCanonicalUrl('/pricing') },
              ])
            ),
          },
          {
            id: 'product-full-shoot',
            data: JSON.parse(
              generateProductJsonLd({
                name: 'Full Dating Profile Photoshoot Package',
                description: '15 complete shoots with 60 high-resolution photos and 15 Photo Retakes for dating profiles.',
                price: 39,
                currency: 'USD',
                features: datingFeatures,
              })
            ),
          },
          {
            id: 'faq',
            data: JSON.parse(
              generateFAQJsonLd(pricingFaqs)
            ),
          },
        ]}
      />
    </div>
  )
}