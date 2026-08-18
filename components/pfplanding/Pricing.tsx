"use client"
import type React from "react"
import { Button } from "./ui/Button"
import Link from "next/link"
import { Check, X, Info, ArrowRight, Zap, Star } from "lucide-react"

const plans = [
    {
        name: "STARTER PACK",
        subtitle: "For the 'Just Curious'",
        price: "$19",
        priceNote: "/ month",
        features: [
            { text: "20 Match-Ready Photos", included: true },
            { text: "Optimized for Dating Apps", included: true },
            { text: "100% Undetectable", included: true },
            { text: "Priority Queue", included: false },
            { text: "Anti-Ban Protection", included: false },
        ],
        cta: "Start Basic",
        isPopular: false,
    },
    {
        name: "PREMIUM PACK",
        subtitle: "For the 'Serious Dater'",
        price: "$150",
        priceNote: "/ month",
        badge: "RECOMMENDED",
        features: [
            { text: "500 Match-Ready Photos", included: true },
            { text: "Optimized for Dating Apps", included: true },
            { text: "100% Undetectable", included: true },
            { text: "Priority Queue", included: true },
            { text: "Anti-Ban Protection", included: true },
        ],
        cta: "Get Premium",
        isPopular: true,
    },
]

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
                        Cheaper than a bad date. Cancel anytime. <br/>
                        <strong className="text-white">100% Money-Back Guarantee.</strong>
                    </p>
                </div>
            </div>

            {/* --- Column 2: Starter Plan --- */}
            <div className="border-r border-[#333] relative flex flex-col justify-between p-8 md:p-12 lg:p-16 bg-[#050505]">
                {/* Starter Plan Details */}
                <div className="mt-auto w-full">
                     <div className="mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <Star className="w-4 h-4 text-[#555]" />
                            <h3 className="font-display text-2xl font-bold uppercase text-white">{plans[0].name}</h3>
                        </div>
                        <p className="font-mono text-xs text-[#555] mb-6">{plans[0].subtitle}</p>

                        <div className="flex items-baseline gap-2 mb-8">
                            <span className="font-display text-6xl font-bold text-white tracking-tighter">{plans[0].price}</span>
                            <span className="font-mono text-xs text-[#555]">{plans[0].priceNote}</span>
                        </div>
                        
                        <ul className="space-y-3 font-mono text-sm text-[#a4a4a4] mb-12">
                             {plans[0].features.map((feature, i) => (
                                <li key={i} className={`flex items-center gap-3 ${feature.included ? '' : 'opacity-30 line-through'}`}>
                                    {feature.included ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                    {feature.text}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Link href="/login" className="block w-full">
                        <button className="w-full py-4 border border-[#333] font-mono text-xs uppercase tracking-widest text-[#a4a4a4] hover:bg-white hover:text-black hover:border-white transition-all flex items-center justify-center gap-2 group">
                            <span>{plans[0].cta}</span>
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </Link>
                </div>
            </div>

            {/* --- Column 3: Premium Plan --- */}
            <div className="relative bg-[#050505] flex flex-col justify-between p-8 md:p-12 lg:p-16 overflow-hidden">
                {/* Background FX */}
                <div className="absolute inset-0 pointer-events-none opacity-20" 
                    style={{ backgroundImage: 'linear-gradient(#CCFF00 1px, transparent 1px), linear-gradient(90deg, #CCFF00 1px, transparent 1px)', backgroundSize: '60px 60px' }}>
                </div>
            

                {/* Premium Plan Details */}
                <div className="relative z-10 mt-auto w-full">
                     <div className="mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-4 h-4 text-[#CCFF00]" />
                            <h3 className="font-display text-2xl font-bold uppercase text-[#CCFF00]">{plans[1].name}</h3>
                        </div>
                        <p className="font-mono text-xs text-[#CCFF00] mb-6">{plans[1].subtitle}</p>

                         <div className="flex items-baseline gap-2 mb-8">
                            <span className="font-display text-6xl font-bold text-white tracking-tighter">{plans[1].price}</span>
                            <span className="font-mono text-xs text-[#a4a4a4]">{plans[1].priceNote}</span>
                        </div>
                        
                        <ul className="space-y-3 font-mono text-sm text-white mb-12">
                             {plans[1].features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <Check className="w-4 h-4 text-[#CCFF00]" />
                                    {feature.text}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Link href="/login" className="block w-full">
                        <button className="w-full py-4 bg-[#CCFF00] text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#b3e600] transition-colors shadow-[0_0_20px_rgba(204,255,0,0.3)] flex items-center justify-center gap-2 group border border-[#CCFF00]">
                             <span>{plans[1].cta}</span>
                             <ArrowRight className="w-4 h-4" />
                        </button>
                    </Link>
                </div>
            </div>

        </section>
    )
}
