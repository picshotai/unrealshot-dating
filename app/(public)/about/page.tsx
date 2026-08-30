import { Metadata } from 'next'
import PublicHeader from '@/components/Header'
import Footer from '@/components/main-landing/Footer'
import { generateBreadcrumbJsonLd, generateMetadata } from '@/lib/seo'
import { MultipleStructuredData } from '@/components/seo/StructuredData'
import { seoUtils } from '@/config/seo'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Camera, ShieldCheck, Heart, RotateCcw, Sparkles } from 'lucide-react'

export const metadata: Metadata = generateMetadata({
  title: 'About Us | UnrealShot AI Dating Photography',
  description:
    'Learn how UnrealShot AI is helping men replace weak selfies with 60 realistic, candid dating photos across 15 believable shoots.',
  canonical: '/about',
})

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#F7F5F3] font-[family-name:var(--font-inter)] text-gray-900">
      <PublicHeader />
      <main className="pt-20 md:pt-24 pb-16">
        {/* Hero Section */}
        <section className="px-4 py-16 sm:py-20 max-w-5xl mx-auto text-center">
          <p className="text-orange-500 font-bold uppercase tracking-wider text-xs sm:text-sm mb-3 block">
            ABOUT UNREALSHOT AI
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-[var(--font-inter-tight)] tracking-tight leading-[1.08] text-gray-900 mb-6 max-w-4xl mx-auto">
            We built UnrealShot AI to solve one problem: <br />
            <span className="text-[#ff6f00]">Bad dating photos.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            You don&apos;t need to become taller, richer, or mysteriously turn into a male model. You just need believable evidence of what you look like on a great day.
          </p>
        </section>

        {/* Narrative Section */}
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_12px_50px_-15px_rgba(0,0,0,0.08)] p-8 sm:p-12 space-y-10">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#ff6f00] font-bold block mb-2">
                01 // THE PROBLEM
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-4">
                The Dating Camera Roll Paradox
              </h2>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                Most men have thousands of photos on their phones, but when they sit down to build a Tinder, Hinge, or Bumble profile, almost none of them work. They have blurry cropped group shots from three years ago, awkward bathroom selfies, or stiff corporate headshots with heavy &ldquo;LinkedIn energy&rdquo; that kill dating momentum.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-8">
              <span className="text-xs font-mono uppercase tracking-wider text-[#ff6f00] font-bold block mb-2">
                02 // WHY GENERIC AI FAILED
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-4">
                Why Glossy AI Filters &amp; $600 Studios Miss the Mark
              </h2>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                Traditional dating photographers charge $400–$800 for two hours of awkward public posing in one or two outfits. Meanwhile, first-generation AI generators produced airbrushed, plastic-skinned avatars that look robotic and scream &ldquo;fake&rdquo; on dating apps.
              </p>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed mt-4">
                Dating apps reward natural lighting, authentic skin texture, realistic clothing wrinkles, and candid unposed moments. That required a completely new engine architecture.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-8">
              <span className="text-xs font-mono uppercase tracking-wider text-[#ff6f00] font-bold block mb-2">
                03 // OUR SOLUTION
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-4">
                The 15-Shoot Coherent Camera Roll
              </h2>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                Instead of giving you 100 disconnected random pictures, UnrealShot AI generates <strong>15 complete cohesive shoots with 4 frames each (60 total photos)</strong>. Each shoot captures 4 natural angles and expressions from the same setting and outfit—just like a friend took multiple candid snaps over coffee, on a rooftop lounge, or walking downtown.
              </p>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed mt-4">
                Plus, we included <strong>15 individual Photo Retakes</strong> with every order so you can replace any single frame without rebuilding your entire camera roll.
              </p>
            </div>
          </div>
        </section>

        {/* Core Principles Grid */}
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Our Core Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#ff6f00]/10 flex items-center justify-center mb-4 text-[#ff6f00]">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Authenticity Above All</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We strictly preserve your facial geometry and real bone structure. You look like the person someone meets on date night—just captured in ideal lighting with great style.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#ff6f00]/10 flex items-center justify-center mb-4 text-[#ff6f00]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Coherent Camera Rolls</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Real camera rolls have photo bursts from the same day. Our 4-frames-per-shoot system gives you authentic narrative sets that feel 100% natural on dating profiles.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#ff6f00]/10 flex items-center justify-center mb-4 text-[#ff6f00]">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">15 Retakes Included</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                If a single generation misses the mark, click Retake with your feedback to generate an updated version at zero extra cost.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#ff6f00]/10 flex items-center justify-center mb-4 text-[#ff6f00]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Privacy &amp; One-Time Pricing</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Strictly $39 one-time. We never sell your facial data, and your uploaded selfies and generated shoots can be permanently wiped from our servers at any time.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-5xl mx-auto px-4 text-center">
          <div className="bg-[#111111] rounded-3xl p-8 sm:p-12 text-white border-2 border-dashed border-zinc-800 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-[var(--font-inter-tight)]">
              Ready to fix your dating camera roll?
            </h2>
            <p className="text-gray-300 text-base sm:text-lg max-w-xl mx-auto mb-8">
              Get 15 complete shoots (60 high-resolution photos) and 15 Photo Retakes delivered in 30 minutes.
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
                { name: 'About', url: seoUtils.generateCanonicalUrl('/about') },
              ])
            ),
          },
        ]}
      />
    </div>
  )
}
