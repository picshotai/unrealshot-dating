import { Metadata } from 'next'
import PublicHeader from '@/components/Header'
import Footer from '@/components/main-landing/Footer'
import { commonPageMetadata, generateWebPageJsonLd, generateFAQJsonLd } from '@/lib/seo'
import { MultipleStructuredData } from '@/components/seo/StructuredData'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkles, Check, AlertCircle, Camera, Flame, Eye, Compass, ShieldCheck } from 'lucide-react'
import Image from 'next/image'

export const metadata: Metadata = {
  ...commonPageMetadata.home(),
  title: "Best AI Photos for Hinge, Tinder & Bumble | Candid Dating Profile Generator",
  description: "Dating apps are allergic to stiff LinkedIn headshots. Generate 15 cohesive lifestyle shoots (60 natural photos) engineered to maximize matches on Hinge and Tinder.",
  alternates: {
    canonical: "https://www.unrealshot.com/use-case/dating-photos",
  },
}

const photoTypes = [
  {
    title: "1. The High-Converting Lead Shot",
    desc: "Clear eye contact, warm natural smile, waist-up framing, and soft natural daylight. Never sunglasses, hats, or awkward angles.",
    vibe: "Warm, approachable, confident",
    tag: "Essential for 1st Photo",
  },
  {
    title: "2. The Candid Social / Cafe Shot",
    desc: "Laughing mid-conversation at a coffee shop or patio table. Looks 100% like a friend snapped a candid photo while you were hanging out.",
    vibe: "Relaxed, social, unposed",
    tag: "Essential for 2nd/3rd Photo",
  },
  {
    title: "3. The Smart-Casual Evening Shot",
    desc: "Rooftop lounge, cocktail bar, or dinner setting with stylish layered clothing. Shows social proof and date-night readiness.",
    vibe: "Sharp, mature, stylish",
    tag: "Essential for 4th Photo",
  },
  {
    title: "4. The Active Lifestyle & Hobby Shot",
    desc: "City walking, park bench reading, bouldering, or outdoors. Shows you have passions and interests outside of your screen.",
    vibe: "Dynamic, adventurous, fit",
    tag: "Essential for 5th/6th Photo",
  },
]

const datingUseCaseFaqs = [
  {
    question: "Why do regular AI headshots fail on dating apps like Hinge and Tinder?",
    answer: "Traditional AI headshots produce stiff studio lighting, blurred grey backgrounds, and plastic skin smoothing. On dating apps, women swipe left on 'LinkedIn energy' because it feels corporate or catfished. UnrealShot AI specifically generates messy, candid, ambient photos with film-grade grain and natural daylight."
  },
  {
    question: "How do 15 cohesive shoots improve my match rate?",
    answer: "When a potential match scrolls through your profile, seeing 4 matching frames from a single scene creates subconscious trust. It proves your face and body look consistent across different expressions, eliminating the fear of meeting a catfish."
  },
  {
    question: "Should I mix these with real phone photos?",
    answer: "Yes! The ideal 6-photo Hinge profile consists of 4–5 UnrealShot lifestyle shoots (lead portrait, cafe candid, evening dinner, active outdoor) alongside 1–2 authentic travel or pet photos from your camera roll."
  },
  {
    question: "How does the $39 one-time package work?",
    answer: "You upload 4–6 everyday phone selfies. In 30 minutes, you receive 15 full lifestyle shoots (60 total high-res photos). You also get 15 free individual Photo Retakes to fine-tune any single frame with custom prompts."
  }
]

export default function DatingPhotosPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F3] font-[family-name:var(--font-inter)] text-gray-900">
      <PublicHeader />

      <main className="pt-20 md:pt-24 pb-20">
        {/* Hero Section */}
        <section className="px-4 py-12 sm:py-16 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 text-[#ff6f00] text-xs font-bold uppercase tracking-wider mb-4 border border-orange-500/20">
            <Flame className="w-3.5 h-3.5" />
            <span>THE DATING PROFILE BLUEPRINT</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-[var(--font-inter-tight)] tracking-tight leading-[1.08] text-gray-900 mb-5 max-w-4xl mx-auto">
            Dating Apps Are Allergic to <br className="hidden sm:block" />
            <span className="text-[#ff6f00]">&quot;LinkedIn Headshots.&quot;</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
            Stiff suits, grey studio backdrops, and airbrushed plastic skin kill your swipe rate. UnrealShot AI creates candid, messy, &quot;friend-took-this&quot; lifestyle photos that pass the vibe check.
          </p>

          <div className="inline-block relative">
            <Link href="/dashboard">
              <Button className="group relative bg-[#ff6f00] hover:bg-[#ff6f00]/90 text-white rounded-md overflow-hidden cursor-pointer px-8 pr-16 py-6 font-semibold text-base shadow-lg shadow-orange-500/20">
                Fix Your Dating Camera Roll — $39
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

          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-600" /> 15 Complete Lifestyle Shoots</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-600" /> 60 High-Res Candid Photos</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-600" /> 15 Free Photo Retakes</span>
          </div>
        </section>

        {/* Visual Comparison: Stiff Headshots vs Candid Shoots */}
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Bad approach */}
            <div className="bg-white rounded-3xl p-8 border border-red-200/80 shadow-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold mb-4 border border-red-100">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>What Fails on Hinge &amp; Tinder</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 font-[var(--font-inter-tight)]">
                Corporate Headshots &amp; Over-Polished Avatars
              </h2>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold">✕</span>
                  <span><strong>Stiff Posture:</strong> Posing rigidly in front of a fake grey studio or sterile office.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold">✕</span>
                  <span><strong>AI Plastic Glow:</strong> Over-smoothed skin and hyper-neon lighting that shouts &quot;fake AI&quot;.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold">✕</span>
                  <span><strong>Disconnected Faces:</strong> Different face shapes across every picture that look like a catfish.</span>
                </li>
              </ul>
            </div>

            {/* Good approach */}
            <div className="bg-white rounded-3xl p-8 border border-green-200/80 shadow-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold mb-4 border border-green-100">
                <Check className="w-3.5 h-3.5" />
                <span>The UnrealShot AI Approach</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 font-[var(--font-inter-tight)]">
                Authentic, Coherent Candid Shoots
              </h2>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2.5">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Natural Environments:</strong> Coffee shops, city sidewalks, rooftop lounges, and parks.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Real Skin Texture:</strong> Preserves your genuine facial bone structure, skin pores, and natural grain.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>4 Cohesive Frames / Shoot:</strong> Matching angles and expressions that prove authenticity.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* The 4 Must-Have Dating Photo Types */}
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff6f00] mb-2">
              THE 4 ESSENTIAL SLOTS
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight font-[var(--font-inter-tight)]">
              The 4 Photo Types Every Top Dating Profile Needs
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-3">
              UnrealShot delivers dedicated variations for every slot in your dating profile to maximize attraction and inbound conversation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {photoTypes.map((pt, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-[#ff6f00] uppercase tracking-wider">{pt.tag}</span>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">{pt.vibe}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-[var(--font-inter-tight)]">{pt.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{pt.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dedicated FAQs for Dating Use Case */}
        <section className="max-w-4xl mx-auto px-4 pb-20">
          <div className="text-center mb-12">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff6f00] mb-2">
              DATING APP STRATEGY &amp; FAQS
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight font-[var(--font-inter-tight)]">
              Dating Profile Questions Answered
            </h2>
          </div>

          <div className="space-y-4">
            {datingUseCaseFaqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm"
              >
                <h3 className="text-base font-bold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA Card */}
        <section className="max-w-5xl mx-auto px-4">
          <div className="bg-[#111111] rounded-3xl p-8 sm:p-12 text-white text-center border-2 border-dashed border-zinc-800 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 font-[var(--font-inter-tight)]">
              Start Matching with Higher-Quality Dates
            </h2>
            <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
              15 complete shoots · 60 candid photos · 15 Photo Retakes · $39 one-time investment.
            </p>
            <div className="inline-block relative">
              <Link href="/dashboard">
                <Button className="group relative bg-[#ff6f00] hover:bg-[#ff6f00]/90 text-white rounded-md overflow-hidden cursor-pointer px-8 pr-16 py-6 font-semibold text-base shadow-lg shadow-orange-500/20">
                  Generate My Dating Profile — $39
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
            id: 'webpage-dating-photos',
            data: JSON.parse(generateWebPageJsonLd({
              name: 'Best AI Photos for Hinge & Tinder | Candid Dating Profile Generator',
              description: "Dating apps are allergic to 'LinkedIn energy.' Stop using stiff headshots. Use Unrealshot AI to generate 15 complete shoots with 60 candid, natural photos.",
              url: 'https://www.unrealshot.com/use-case/dating-photos',
              breadcrumbs: [
                { name: 'Home', url: 'https://www.unrealshot.com' },
                { name: 'Dating Photos', url: 'https://www.unrealshot.com/use-case/dating-photos' }
              ]
            }))
          },
          {
            id: 'faq-dating-photos',
            data: JSON.parse(generateFAQJsonLd(datingUseCaseFaqs))
          }
        ]}
      />
    </div>
  )
}

