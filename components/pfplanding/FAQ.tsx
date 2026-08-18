"use client"
import type React from "react"
import { useState } from "react"
import { faqData } from "./faq-data"

export const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    return (
        <section className="grid md:grid-cols-12 border-b border-foreground/10 min-h-[50vh]">
            <div className="col-span-12 md:col-span-4 p-8 md:p-12 border-b md:border-b-0 md:border-r border-foreground/10 flex flex-col justify-between">
                <div>
                    <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">
                        KNOWLEDGE BASE // FAQ
                    </div>
                    <h2 className="font-display text-4xl md:text-5xl font-bold uppercase mb-4 leading-tight">
                        Frequently Asked Questions
                    </h2>
                    <p className="font-mono text-xs sm:text-sm text-foreground/50 leading-relaxed">
                        Everything you need to know about the Unrealshot AI Dating Photoshoot.
                    </p>
                </div>
                <div className="font-mono text-xs text-foreground/30 mt-8 hidden md:block">
                    GEO_SCHEMA // INDEXED
                </div>
            </div>

            <div className="col-span-12 md:col-span-8">
                {faqData.map((item, i) => (
                    <div key={i} className="border-b border-foreground/10 last:border-b-0">
                        <button
                            className="w-full text-left p-6 sm:p-8 flex justify-between items-start hover:bg-white/5 transition-colors group cursor-pointer"
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                        >
                            <span className="font-display text-base sm:text-lg font-bold uppercase pr-6 group-hover:text-accent transition-colors">
                                {item.q}
                            </span>
                            <span className="font-mono text-xl text-accent shrink-0">{openIndex === i ? "−" : "+"}</span>
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === i ? "max-h-96 opacity-100 pb-6 sm:pb-8" : "max-h-0 opacity-0 pb-0"}`}
                        >
                            <p className="font-mono text-xs sm:text-sm text-foreground/70 px-6 sm:px-8 leading-relaxed max-w-2xl">{item.a}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}