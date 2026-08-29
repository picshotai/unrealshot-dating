"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "Will these actually look like me?",
      answer:
        "That's what your reference selfies are for. UnrealShot keeps the same identity across your shoots. Individual generations can occasionally miss, which is also why 30 re-shoots are included.",
    },
    {
      question: "Won't AI photos look fake?",
      answer:
        "That's exactly what we're trying to avoid. The shoots use believable locations, lighting, framing and repeated environments instead of making every photo look like a polished advertising campaign.",
    },
    {
      question: "Why are there four photos from every shoot?",
      answer:
        "Because real photos come in sets. A friend doesn't take exactly one perfect photograph of you and teleport you somewhere else. You get different frames from the same moment.",
    },
    {
      question: "Do I have to write prompts?",
      answer:
        "No. Pick your look, choose things you actually do and tell us what to avoid. We plan the shoots.",
    },
    {
      question: "What if one photo looks wrong?",
      answer:
        "Re-shoot that individual frame. You get 30 re-shoots with your order.",
    },
    {
      question: "Is this a subscription?",
      answer:
        "No. $39 is a one-time purchase for the complete profile shoot.",
    },
    {
      question: "Can I use these on Tinder, Hinge and Bumble?",
      answer:
        "They're created specifically for dating profiles, so you can choose photos that fit the style of whichever dating apps you use.",
    },
    {
      question: "Is this catfishing?",
      answer:
        "The product is designed to represent you more effectively, not turn you into someone else. Your strongest photos should still look like the person somebody will meet in real life.",
    },
  ]

  return (
    <section className="px-4 py-24 bg-[#111111]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          
          <h2 className="text-white text-4xl sm:text-6xl max-w-4xl mx-auto font-bold leading-[1.1] mb-4 font-[var(--font-inter-tight)]">
            Frequently asked <span className="text-[#ff6f00]">dating shoot questions</span> 
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-tight">
            Everything you need to know about UnrealShot AI dating photos.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* First Column */}
          <div className="space-y-4">
            {faqs.slice(0, 4).map((faq, index) => (
              <div
              key={index}
              className="bg-[#1a1a1a] rounded-2xl border border-[rgba(255,255,255,0.1)] overflow-hidden transition-all duration-200"
            >
              <button
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-[#222222] transition-colors duration-200"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>

              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
                )}
              >
                <div className="px-8 pb-6">
                  <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
            ))}
          </div>
          
          {/* Second Column */}
          <div className="space-y-4">
            {faqs.slice(4).map((faq, index) => {
              const actualIndex = index + 4;
              return (
                <div
                  key={actualIndex}
                  className="bg-[#1a1a1a] rounded-2xl border border-[rgba(255,255,255,0.1)] overflow-hidden transition-all duration-200"
                >
                  <button
                    className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-[#222222] transition-colors duration-200"
                    onClick={() => setOpenIndex(openIndex === actualIndex ? null : actualIndex)}
                  >
                    <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                    <div className="flex-shrink-0">
                      {openIndex === actualIndex ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out",
                      openIndex === actualIndex ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
                    )}
                  >
                    <div className="px-8 pb-6">
                      <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        
      </div>
    </section>
  )
}