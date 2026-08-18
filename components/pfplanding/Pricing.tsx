"use client"
import type React from "react"
import { Button } from "./ui/Button"
import Link from "next/link"
import { Check, ArrowRight, Zap } from "lucide-react"

const plan = {
    name: "COMPLETE DATING PACK",
    subtitle: "For men done with bad photos",
    price: "$59",
    priceNote: "one-time",
    features: [
        { text: "100 photos, no two alike" },
        { text: "A different outfit and setting in every shot" },
        { text: "Optimized for Dating Apps" },
        { text: "Photos of what you actually do" },
        { text: "30 free re-shoots — hate one, replace it" },
    ],
    cta: "Get My 100 Photos",
}

interface PricingProps {
    asH1?: boolean; // When true, renders main heading as H1 (for dedicated pricing page)
}

export const Pricing: React.FC<PricingProps> = ({ asH1 = false }) => {
    const HeadingTag = asH1 ? 'h1' : 'h2';
    
    return (
        <section className="border-b border-[#333] bg-black text-white grid md:grid-cols-2 lg:grid-cols-3 overflow-hidden">
            
            {/* --- Column 1: Header / Context --- */}
            <div className="border-r border-[#333] relative flex flex-col justify-center p-8 md:p-12 lg:p-16">
                 {/* Header Area */}
                <div>
                    <div className="inline-flex items-center gap-2 border border-[#CCFF00] text-[#CCFF00] px-3 py-1.5 font-mono text-[10px] uppercase w-fit mb-6 shadow-[0_0_15px_rgba(204,255,0,0.15)] bg-[#CCFF00]/5">
                        <span className="w-1.5 h-1.5 bg-[#CCFF00] animate-pulse rounded-full"></span>
                        // Transparent Pricing
                    </div>
                    <HeadingTag className="font-display text-5xl md:text-7xl font-bold uppercase leading-[0.9]">
                        Invest in <br/>
                        <span className="text-transparent stroke-text-lime">Yourself.</span>
                    </HeadingTag>
                    <p className="font-mono text-[#a4a4a4] text-sm max-w-sm mb-8 border-l-2 border-[#333] pl-4">
                        Cheaper than a bad date. One payment, no subscription. <br/>
                        <strong className="text-white">7-Day Money-Back Guarantee.</strong>
                    </p>
                </div>
            </div>

            {/* --- Column 2: The Pack (single plan, spans the remaining grid) --- */}
            <div className="relative bg-[#050505] flex flex-col justify-between p-8 md:p-12 lg:p-16 overflow-hidden lg:col-span-2">
                {/* Background FX */}
                <div className="absolute inset-0 pointer-events-none opacity-20"
                    style={{ backgroundImage: 'linear-gradient(#CCFF00 1px, transparent 1px), linear-gradient(90deg, #CCFF00 1px, transparent 1px)', backgroundSize: '60px 60px' }}>
                </div>


                {/* Plan Details */}
                <div className="relative z-10 mt-auto w-full">
                     <div className="mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-4 h-4 text-[#CCFF00]" />
                            <h3 className="font-display text-2xl font-bold uppercase text-[#CCFF00]">{plan.name}</h3>
                        </div>
                        <p className="font-mono text-xs text-[#CCFF00] mb-6">{plan.subtitle}</p>

                         <div className="flex items-baseline gap-2 mb-8">
                            <span className="font-display text-6xl font-bold text-white tracking-tighter">{plan.price}</span>
                            <span className="font-mono text-xs text-[#a4a4a4]">{plan.priceNote}</span>
                        </div>

                        <ul className="space-y-3 font-mono text-sm text-white mb-12">
                             {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <Check className="w-4 h-4 text-[#CCFF00] shrink-0" />
                                    {feature.text}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Link href="/login" className="block w-full max-w-md">
                        <button className="w-full py-4 bg-[#CCFF00] text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#b3e600] transition-colors shadow-[0_0_20px_rgba(204,255,0,0.3)] flex items-center justify-center gap-2 group border border-[#CCFF00]">
                             <span>{plan.cta}</span>
                             <ArrowRight className="w-4 h-4" />
                        </button>
                    </Link>
                </div>
            </div>

        </section>
    )
}
