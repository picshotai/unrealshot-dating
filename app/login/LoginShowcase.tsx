"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

const slides = [
  {
    src: "/new-landing/training-floor-morning-2.png",
    alt: "A natural lifestyle portrait in a sunlit training space",
  },
  {
    src: "/new-landing/mountain-layby-motorcycle_4.png",
    alt: "A candid portrait beside a motorcycle in the mountains",
  },
  {
    src: "/new-landing/ZvwZd8Jx-PREBesBKZF38_aa31a675ef8c43bcbc372bc78c2e2712.jpg",
    alt: "A relaxed portrait by a bright kitchen window",
  },
]

export function LoginShowcase() {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (reduceMotion.matches) return

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length)
    }, 5200)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <aside className="relative hidden min-h-[560px] overflow-hidden bg-[#171717] md:block">
      {slides.map((slide, index) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          priority={index === 0}
          sizes="(min-width: 1024px) 520px, 50vw"
          className={`object-cover object-center transition-opacity duration-1000 ease-out motion-reduce:transition-none ${
            activeSlide === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,12,12,0.06)_25%,rgba(12,12,12,0.22)_58%,rgba(12,12,12,0.92)_100%)]" />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-7 text-white">
        <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] backdrop-blur-md">
          UnrealShot result
        </span>
        <span className="font-mono text-[11px] text-white/70">
          0{activeSlide + 1} / 0{slides.length}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-7 text-white lg:p-9">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#ff9a4d]">
          Your face. Better photos.
        </p>
        <h2 className="max-w-md font-[family-name:var(--font-space-grotesk)] text-3xl font-semibold leading-[1.04] tracking-[-0.035em] lg:text-[2.55rem]">
          Look like yourself. On your best day.
        </h2>
        <p className="mt-3 max-w-sm text-sm leading-6 text-white/75">
          Natural, cohesive photos made for profiles that deserve a second look.
        </p>

        <div className="mt-7 flex gap-1.5" aria-label={`Image ${activeSlide + 1} of ${slides.length}`}>
          {slides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setActiveSlide(index)}
              aria-label={`Show image ${index + 1}`}
              aria-current={activeSlide === index ? "true" : undefined}
              className={`h-1 rounded-full transition-all duration-300 ${
                activeSlide === index ? "w-8 bg-[#ff6f00]" : "w-3 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </aside>
  )
}
