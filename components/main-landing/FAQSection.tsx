"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const t = useTranslations("Home.faq")
  const faqs = t.raw("items") as Array<{ question: string; answer: string }>

  const halfLength = Math.ceil(faqs.length / 2)
  const leftColFaqs = faqs.slice(0, halfLength)
  const rightColFaqs = faqs.slice(halfLength)

  return (
    <section id="faq" className="w-full relative bg-[#F7F5F3] py-16 sm:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-orange-500 font-bold uppercase tracking-wider text-xs sm:text-sm mb-3 block">
            {t("eyebrow")}
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl max-w-4xl mx-auto font-bold mb-4 font-[var(--font-inter-tight)] tracking-tight leading-[1.08] text-gray-900">
            {t("title")} <span className="text-[#ff6f00]">{t("titleAccent")}</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-normal mb-1 font-medium">
            {t("description")}
          </p>
        </div>

        {/* FAQ Accordion Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {/* First Column */}
          <div className="space-y-4">
            {leftColFaqs.map((faq, index) => {
              const isOpen = openIndex === index
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-200"
                >
                  <button
                    className="w-full px-6 sm:px-8 py-5 sm:py-6 text-left flex items-center justify-between hover:bg-gray-50/80 transition-colors duration-200 cursor-pointer"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 pr-4 leading-snug">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0 ml-2">
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5 text-[#ff6f00]" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out",
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="px-6 sm:px-8 pb-6 pt-1">
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Second Column */}
          <div className="space-y-4">
            {rightColFaqs.map((faq, index) => {
              const actualIndex = index + halfLength
              const isOpen = openIndex === actualIndex
              return (
                <div
                  key={actualIndex}
                  className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-200"
                >
                  <button
                    className="w-full px-6 sm:px-8 py-5 sm:py-6 text-left flex items-center justify-between hover:bg-gray-50/80 transition-colors duration-200 cursor-pointer"
                    onClick={() => setOpenIndex(isOpen ? null : actualIndex)}
                    aria-expanded={isOpen}
                  >
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 pr-4 leading-snug">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0 ml-2">
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5 text-[#ff6f00]" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out",
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="px-6 sm:px-8 pb-6 pt-1">
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
