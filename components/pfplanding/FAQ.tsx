"use client"
import type React from "react"
import { useState } from "react"
import { faqData } from "./faq-data"

export const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    return (
        <section className="grid md:grid-cols-12 border-b border-[#333] bg-black text-white min-h-[50vh]">
            <div className="col-span-12 md:col-span-4 p-8 md:p-12 border-b md:border-b-0 md:border-r border-[#333] flex flex-col justify-between">
                <div>
                    <h2 className="font-display text-5xl md:text-7xl font-bold uppercase leading-[1]">
                        FAQs about <span className="text-transparent stroke-text-lime">PFPfor.ME</span>
                    </h2>
                    <p className="font-mono text-xs text-[#a4a4a4] mb-8">
                        Straight answers. No marketing fluff. <br/>
                    </p>
                </div>
                
              
            </div>

            <div className="col-span-12 md:col-span-8">
                {faqData.map((item, i) => (
                    <div key={i} className="border-b border-[#333] last:border-b-0">
                        <button
                            className={`w-full text-left p-8 flex justify-between items-start hover:bg-[#CCFF00]/5 transition-all duration-300 group ${openIndex === i ? 'bg-[#CCFF00]/5' : ''}`}
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                        >
                            <div className="flex items-start gap-4 pr-8">
                                <span className={`font-mono text-xs mt-1 transition-colors ${openIndex === i ? 'text-[#CCFF00]' : 'text-[#444] group-hover:text-[#a4a4a4]'}`}>
                                    {i < 9 ? `0${i + 1}` : i + 1}
                                </span>
                                <span className={`font-display text-lg md:text-xl font-bold uppercase transition-colors ${openIndex === i ? 'text-[#CCFF00]' : 'text-white group-hover:text-[#CCFF00]'}`}>
                                    {item.q}
                                </span>
                            </div>
                            <span className={`font-mono text-xl transition-transform duration-300 ${openIndex === i ? 'text-[#CCFF00] rotate-45' : 'text-[#444] group-hover:text-white'}`}>
                                +
                            </span>
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === i ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
                        >
                            <div className="p-8 pt-0 pl-16">
                                <p className="font-mono text-sm text-[#a4a4a4] leading-relaxed max-w-2xl border-l border-[#333] pl-4">
                                    {item.a}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
