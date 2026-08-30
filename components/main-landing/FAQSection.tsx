"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "Will these photos actually look like me in real life?",
      answer:
        "Yes. UnrealShot AI maps your real facial geometry and bone structure from 4–6 normal selfies. It generates natural lighting, authentic wardrobe, and genuine candid moments that match what you look like on your best days — not an over-airbrushed avatar or a stranger.",
    },
    {
      question: "Why are there four photos from every shoot?",
      answer:
        "Because believable dating profiles feature authentic scenes, not 60 disconnected photos from 60 random places. Generating 4 cohesive frames from each moment (laughing candid, looking up, coffee in hand, wide angle) creates realistic photo bursts that look like a friend naturally took them.",
    },
    {
      question: "How does UnrealShot compare to hiring a dating photographer?",
      answer:
        "A local dating photographer typically charges between $400 to $800, requires hours of awkward posing, limited outfit changes, and takes 1–2 weeks for delivery. UnrealShot gives you 15 diverse shoots (60 total photos across coffee shops, rooftops, outdoors, and smart casual settings) delivered in 30 minutes for just $39.",
    },
    {
      question: "What kind of selfies should I upload for the best results?",
      answer:
        "Just 4 to 6 clear, everyday selfies taken in decent lighting with different facial angles and natural expressions. Avoid heavy sunglasses, hats, or extreme filters. Standard camera roll selfies taken on your phone work best.",
    },
    {
      question: "Can I use these photos on Tinder, Hinge, Bumble, and Feeld?",
      answer:
        "Absolutely. Every image is exported in high resolution with native 3:4 portrait ratios tailored specifically for modern dating app algorithms (Hinge prompts, Tinder lead photos, Bumble verification).",
    },
    {
      question: "What if one photo or expression doesn't look right?",
      answer:
        "Every order includes 15 individual Photo Retakes at zero extra cost. If a specific frame misses the mark, simply click Retake with your feedback to generate a fresh variation while preserving the scene.",
    },
    {
      question: "Won't people on dating apps know these are AI photos?",
      answer:
        "Unlike generic AI headshot tools that produce glossy studio lighting and plastic skin, UnrealShot AI is specifically tuned for dating optics: authentic texture, natural ambient lighting, believable background depth, and genuine micro-expressions that pass the human eye test seamlessly.",
    },
    {
      question: "How long does generation take?",
      answer:
        "Your complete dating camera roll of 15 shoots (60 photos) is typically ready in under 30 minutes. You'll receive an email notification the moment your gallery is ready to review and download.",
    },
    {
      question: "Is this a recurring subscription or a one-time fee?",
      answer:
        "It is strictly a one-time payment of $39. There are no recurring monthly charges, hidden subscriptions, or upgrade traps. You own all 60 high-resolution photos permanently.",
    },
    {
      question: "What happens to my uploaded selfies and privacy?",
      answer:
        "Your privacy is strictly protected. We never sell your photos or facial data to third parties. Your uploaded selfies and generated images remain private to your account and can be permanently deleted anytime with one click.",
    },
    {
      question: "Do I need to write complicated AI prompts?",
      answer:
        "Not at all. Our Creative Director engine handles all scene composition, wardrobe styling, camera lenses, and lighting automatically based on proven dating profile photography rules. You just upload your selfies and let the engine work.",
    },
    {
      question: "Is using AI photos on dating apps considered catfishing?",
      answer:
        "No. Catfishing is pretending to be someone you're not. UnrealShot AI acts like a skilled photographer capturing you on your best day — showcasing your real face and physique in flattering lighting, stylish outfits, and attractive settings that accurately represent you when meeting in real life.",
    },
  ]

  const halfLength = Math.ceil(faqs.length / 2)
  const leftColFaqs = faqs.slice(0, halfLength)
  const rightColFaqs = faqs.slice(halfLength)

  return (
    <section id="faq" className="w-full relative bg-[#F7F5F3] py-16 sm:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-orange-500 font-bold uppercase tracking-wider text-xs sm:text-sm mb-3 block">
            FREQUENTLY ASKED QUESTIONS
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl max-w-4xl mx-auto font-bold mb-4 font-[var(--font-inter-tight)] tracking-tight leading-[1.08] text-gray-900">
            Frequently asked <span className="text-[#ff6f00]">dating shoot questions</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-normal mb-1 font-medium">
            Everything you need to know about UnrealShot AI dating photos, retakes, and profile results.
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