"use client"

import { Shield } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"

export default function PricingCards() {
  const t = useTranslations("Home.pricing")
  const pricingT = useTranslations("Pricing")
  const DarkCheckIcon = ({ className }: { className?: string }) => (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="8" cy="8" r="7.5" fill="#27272a" stroke="#ff6f00" strokeWidth="1" />
      <path d="M5.5 8.5L7 10L11 6" stroke="#ff6f00" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

  const features = t.raw("features") as string[]

  const sampleShootImages = [
    { src: "/new-landing/5cc8c2fbbd9a4e8b92ebbe72530d367e.jpg", alt: t("sampleFrameAlt", { index: 1 }) },
    { src: "/new-landing/4436e4eadfa843ab94ad12db98a8664b.jpg", alt: t("sampleFrameAlt", { index: 2 }) },
    { src: "/new-landing/519170ac2c004900af87f015bf5a1771.jpg", alt: t("sampleFrameAlt", { index: 3 }) },
    { src: "/new-landing/cf26ce46ee2b4559b3074b6df276b578.jpg", alt: t("sampleFrameAlt", { index: 4 }) },
  ]

  return (
    <section id="pricing" className="relative mx-auto py-16 sm:py-24 overflow-hidden bg-[#111111] px-4">
      <div className="w-full max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-orange-500 font-bold uppercase tracking-wider text-xs sm:text-sm mb-3 block">
            {t("eyebrow")}
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl max-w-4xl mx-auto font-bold mb-4 font-[var(--font-inter-tight)] tracking-tight leading-[1.08] text-white">
            {t("title")} <br />
            <span className="text-[#ff6f00]">{t("titleAccent")}</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-normal mb-1 font-medium">
            {t("description")}
          </p>
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-tight">
            {t("descriptionAccent")}
          </p>
        </div>

        {/* Master Split Card with Left and Right Panes */}
        <div className="max-w-6xl mx-auto bg-[#161616] rounded-3xl border-2 border-dashed border-zinc-800 shadow-2xl p-2.5 sm:p-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
            {/* Left Pane: What's Included */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between border border-dashed border-zinc-700/60 rounded-2xl bg-[#1c1c1c]">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#ff6f00]/15 text-[#ff6f00] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {t("packageLabel")}
                  </span>
                  <span className="bg-zinc-800 text-zinc-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-zinc-700">
                    {t("popular")}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
                  {t("heading")}
                </h3>
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-6">
                  {t("packageDescription")}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-4 mb-6">
                  {features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2.5">
                      <DarkCheckIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span className="text-zinc-200 text-sm font-medium leading-snug">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-zinc-400 font-mono uppercase">{t("deliverableLabel")}</span>
                  <span className="font-bold text-white">{t("deliverable")}</span>
                </div>
              </div>
            </div>

            {/* Right Pane: Dark Checkout & Shoot Preview */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-black border border-dashed border-zinc-800 rounded-2xl shadow-xl flex flex-col justify-between text-center">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-[#ff6f00] mb-2 font-semibold">
                  {t("investment")}
                </p>
                <div className="flex items-baseline justify-center mb-1">
                  <span className="text-5xl sm:text-6xl font-bold text-white tracking-tighter">{pricingT("package.price")}</span>
                  <span className="text-zinc-400 text-base sm:text-lg ml-2 font-medium">{t("priceSuffix")}</span>
                </div>
                <p className="text-zinc-400 text-xs sm:text-sm mb-4">
                  {t("vsPhotographer")}
                </p>

                {/* 4 Photos of 1 Shoot Preview */}
                <div className="bg-zinc-900/90 rounded-xl p-3 border border-dashed border-zinc-800 my-4 text-left">
                  <div className="flex items-center justify-between mb-2.5 px-1">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-300 font-medium">
                      {t("sampleShoot")}
                    </span>
                    <span className="text-[10px] bg-orange-500/20 text-orange-400 font-semibold px-2 py-0.5 rounded">
                      {t("sampleCount")}
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
                    {t("cta")}
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
                    {t("delivery")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security / Trust Footer */}
        <p className="text-center text-zinc-400 text-sm sm:text-base leading-relaxed mt-8 flex items-center justify-center gap-1.5">
          <Shield className="w-4 h-4 text-[#ff6f00] inline-block mr-1" />
          {t("secure")}
          <Image src="/dodo-logo.png" alt="dodopayments" width={96} height={96} className="inline-block ml-1 bg-black px-1.5 py-0.5 rounded border border-zinc-800" />
        </p>
      </div>
    </section>
  )
}
