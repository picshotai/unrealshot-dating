"use client"

import { Shield } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PricingCards() {
  const LightCheckIcon = ({ className }: { className?: string }) => (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="8" cy="8" r="8" fill="#111827" />
      <path d="M5.5 8.5L7 10L11 6" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

  const features = [
    "15 complete shoots (60 photos total)",
    "4 unique photos per shoot",
    "15 individual Photo Retakes included",
    "One coherent identity throughout",
    "Optimized for Tinder, Hinge & Bumble",
    "No prompt engineering needed",
    "4–6 normal selfies needed",
    "One-time purchase · No subscription",
  ]

  const sampleShootImages = [
    { src: "/new-landing/5cc8c2fbbd9a4e8b92ebbe72530d367e.jpg", alt: "Shoot Frame 1" },
    { src: "/new-landing/4436e4eadfa843ab94ad12db98a8664b.jpg", alt: "Shoot Frame 2" },
    { src: "/new-landing/519170ac2c004900af87f015bf5a1771.jpg", alt: "Shoot Frame 3" },
    { src: "/new-landing/cf26ce46ee2b4559b3074b6df276b578.jpg", alt: "Shoot Frame 4" },
  ]

  return (
    <section id="pricing" className="relative mx-auto py-16 sm:py-24 overflow-hidden bg-[#F7F5F3] px-4">
      <div className="w-full max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-orange-500 font-bold uppercase tracking-wider text-xs sm:text-sm mb-3 block">
            SIMPLE, TRANSPARENT PRICING
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl max-w-4xl mx-auto font-bold mb-4 font-[var(--font-inter-tight)] tracking-tight leading-[1.08] text-gray-900">
            Your entire dating profile shoot. <br />
            <span className="text-[#ff6f00]">$39 once.</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-normal mb-1 font-medium">
            You don&apos;t need 200 photos. You need six good ones that belong together.
          </p>
          <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto leading-tight">
            We&apos;re giving you 60 so you can choose them.
          </p>
        </div>

        {/* Master Split Card with Left and Right Panes */}
        <div className="max-w-6xl mx-auto bg-white rounded-3xl border-2 border-dashed border-gray-200 shadow-2xl shadow-gray-200/60 p-2.5 sm:p-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
            {/* Left Pane: What's Included */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between border border-dashed border-gray-300 rounded-2xl bg-gray-50/50">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#ff6f00]/10 text-[#ff6f00] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Full Profile Shoot
                  </span>
                  <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2">
                  Everything You Need for a Winning Profile
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                  15 believable shoots with 4 frames each, designed to build a complete dating profile from scratch, plus 15 Photo Retakes included so you never settle.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-4 mb-6">
                  {features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2.5">
                      <LightCheckIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm font-medium leading-snug">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-gray-500 font-mono uppercase">THE DELIVERABLE:</span>
                  <span className="font-bold text-gray-900">60 Photos (15 Shoots) · 15 Retakes</span>
                </div>
              </div>
            </div>

            {/* Right Pane: Dark Checkout & Shoot Preview */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-zinc-950 border border-dashed border-zinc-700 rounded-2xl shadow-xl flex flex-col justify-between text-center">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-[#ff6f00] mb-2 font-semibold">
                  ONE-TIME INVESTMENT
                </p>
                <div className="flex items-baseline justify-center mb-1">
                  <span className="text-5xl sm:text-6xl font-bold text-white tracking-tighter">$39</span>
                  <span className="text-zinc-400 text-base sm:text-lg ml-2 font-medium">one-time</span>
                </div>
                <p className="text-zinc-400 text-xs sm:text-sm mb-4">
                  vs $400–$800 for a traditional dating photographer
                </p>

                {/* 4 Photos of 1 Shoot Preview */}
                <div className="bg-zinc-900/90 rounded-xl p-3 border border-dashed border-zinc-800 my-4 text-left">
                  <div className="flex items-center justify-between mb-2.5 px-1">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-300 font-medium">
                      Sample Shoot (4 Frames)
                    </span>
                    <span className="text-[10px] bg-orange-500/20 text-orange-400 font-semibold px-2 py-0.5 rounded">
                      1 of 15 Shoots
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {sampleShootImages.map((img, i) => (
                      <div key={i} className="aspect-[3/4] rounded-lg overflow-hidden border border-zinc-700/60 shadow-sm relative">
                        <Image
                          src={img.src}
                          alt={img.alt}
                          fill
                          sizes="(max-width: 768px) 25vw, 100px"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Link href="/dashboard" className="w-full block">
                  <Button className="w-full group relative bg-[#ff6f00] hover:bg-[#ff6f00]/90 text-white rounded-md overflow-hidden cursor-pointer pr-12 py-6 font-semibold text-base shadow-[0_4px_20px_-5px_rgba(0,0,0,0.2)]">
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

                <div className="pt-3 border-t border-zinc-800">
                  <p className="text-xs text-zinc-400 font-medium">
                    ⚡ 30 Minutes Delivery · 15 Photo Retakes Included
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security / Trust Footer */}
        <p className="text-center text-gray-600 text-sm sm:text-base leading-relaxed mt-8 flex items-center justify-center gap-1.5">
          <Shield className="w-4 h-4 text-[#ff6f00] inline-block mr-1" />
          Payments are processed securely with
          <Image src="/dodo-logo.png" alt="dodopayments" width={96} height={96} className="inline-block ml-1 bg-black px-1.5 py-0.5 rounded" />
        </p>
      </div>
    </section>
  )
}
