"use client"
import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, Heart, Sparkles, Zap, Flame } from "lucide-react"

export const MoatSection: React.FC = () => {
    const [sliderPosition, setSliderPosition] = useState(50)
    const [isDragging, setIsDragging] = useState(false)

    // Handle slider drag
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return
        const rect = e.currentTarget.getBoundingClientRect()
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
        const percent = Math.max(0, Math.min((x / rect.width) * 100, 100))
        setSliderPosition(percent)
    }

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!isDragging) return
        const rect = e.currentTarget.getBoundingClientRect()
        const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width))
        const percent = Math.max(0, Math.min((x / rect.width) * 100, 100))
        setSliderPosition(percent)
    }

    // Auto-animate slider when not interacting
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (!isDragging) {
            interval = setInterval(() => {
                setSliderPosition((prev) => {
                    // Simple oscillation for demo purposes
                    const time = Date.now() / 1000
                    return 50 + Math.sin(time) * 30
                })
            }, 50)
        }
        return () => clearInterval(interval)
    }, [isDragging])

    return (
        <section className="relative min-h-screen bg-black overflow-hidden flex flex-col md:grid md:grid-cols-12 border-b border-[#333]">
            
            {/* --- Left Panel: The Problem (Before Image) --- */}
            <div className="md:col-span-4 h-[50vh] md:h-full relative border-r border-[#333] overflow-hidden group">
                 {/* Image */}
                <img 
                    src="/images/demo10.jpg" 
                    alt="Standard Selfie Before" 
                    className="w-full h-full object-cover object-center filter grayscale contrast-125 brightness-75 transition-transform duration-700 group-hover:scale-105" 
                />
                
                {/* Overlay Content */}
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8">
                    <div className="inline-flex items-center gap-2 bg-red-900/80 border border-red-500/30 text-white px-3 py-1 mb-4 w-fit backdrop-blur-md">
                        <X className="w-3 h-3" />
                        <span className="font-mono text-[10px] uppercase tracking-widest">Low Visibility</span>
                    </div>
                    <h3 className="font-display text-4xl md:text-5xl font-bold text-white/50 mb-4 line-through decoration-red-500/50 decoration-4">
                        Friend<br/>Zone
                    </h3>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-red-200/60 font-mono text-xs">
                            <X className="w-3 h-3 text-red-500" /> 0 Matches/Week
                        </div>
                        <div className="flex items-center gap-2 text-red-200/60 font-mono text-xs">
                            <X className="w-3 h-3 text-red-500" /> "He looks boring"
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Center Panel: Content & CTA --- */}
            <div className="md:col-span-4 h-auto md:h-full bg-black flex flex-col justify-center items-start p-8 md:p-16 text-left relative z-20 border-r border-[#333]">
                <div className="mb-12 w-full">
                    <div className="inline-flex items-center gap-2 border border-[#CCFF00] text-[#CCFF00] px-3 py-1.5 font-mono text-[10px] uppercase w-fit mb-6 shadow-[0_0_15px_rgba(204,255,0,0.15)] bg-[#CCFF00]/5">
                        <span className="w-1.5 h-1.5 bg-[#CCFF00] animate-pulse"></span>
                        Reality Check
                    </div>
                    <h2 className="font-display text-5xl md:text-7xl font-bold uppercase leading-[0.9]">
                        Stop Being <span className="text-transparent stroke-text-lime">Ignored.</span>

                    </h2>
                    <p className="font-mono text-[#a4a4a4] text-sm leading-relaxed max-w-md">
                        The dating app algorithm is simple: <strong>Better Photos = More Matches.</strong> <br/><br/>
                        Right now, your selfies are signaling "low effort." You need photos that signal "high value" without looking like you hired a wedding photographer.
                    </p>
                </div>

                {/* Arrow Graphic */}
                <div className="hidden md:flex items-center gap-4 text-[#333] mb-12 w-full">
                    <div className="h-[1px] flex-grow bg-current"></div>
                    <div className="font-mono text-[10px] whitespace-nowrap">THE UNREALSHOT AI UPGRADE</div>
                    <div className="h-[1px] flex-grow bg-current"></div>
                </div>

                 {/* Features List */}
                 <div className="space-y-4 w-full">
                    {[
                        { 
                            title: "Instant Trust", 
                            desc: "High-quality photos subconsciously signal that you take care of yourself. It's the ultimate green flag." 
                        },
                        { 
                            title: "The 'Vibe' Check", 
                            desc: "We don't just generate a face; we generate a lifestyle. Travel, fitness, social proof—all in one click." 
                        },
                        { 
                            title: "Algorithm Hack", 
                            desc: "Apps push profiles with high engagement. Better photos stop the scroll, boosting your ELO score instantly." 
                        },
                        {
                            title: "Looks Like A Phone Took It",
                            desc: "Real grain, real lighting, real skin. Not the plastic AI sheen everyone recognises instantly."
                        }
                    ].map((item, i) => {
                        const isHighlight = item.title === "Looks Like A Phone Took It";
                        return (
                            <div key={i} className={`group border-l-2 pl-6 py-2 transition-colors ${isHighlight ? 'border-[#CCFF00] bg-[#CCFF00]/5' : 'border-[#333] hover:border-[#CCFF00]'}`}>
                                <h4 className={`font-display text-lg uppercase mb-2 transition-colors ${isHighlight ? 'text-[#CCFF00]' : 'text-white group-hover:text-[#CCFF00]'}`}>
                                    {item.title}
                                </h4>
                                <p className={`font-mono text-xs leading-relaxed transition-colors ${isHighlight ? 'text-[#CCFF00]/80' : 'text-[#666] group-hover:text-[#a4a4a4]'}`}>{item.desc}</p>
                            </div>
                        );
                    })}
                 </div>
            </div>

            {/* --- Right Panel: The Solution (After Image) --- */}
            <div className="md:col-span-4 h-[50vh] md:h-full relative overflow-hidden group">
                 {/* Image */}
                <img 
                    src="/images/demo14.jpg" 
                    alt="UnrealShot AI After" 
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" 
                />
                
                {/* Overlay Content */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8 text-right">
                    <div className="flex justify-end">
                        <div className="inline-flex items-center gap-2 bg-[#CCFF00] text-black border border-[#CCFF00] px-3 py-1 mb-4 w-fit font-bold">
                            <Flame className="w-3 h-3 fill-black animate-pulse" />
                            <span className="font-mono text-[10px] uppercase tracking-widest">High ELO Score</span>
                        </div>
                    </div>
                    <h3 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                        Match<br/>Magnet
                    </h3>
                    <div className="space-y-2 flex flex-col items-end">
                        <div className="flex items-center gap-2 text-[#CCFF00] font-mono text-xs bg-black/50 px-2 py-1 backdrop-blur-sm border border-[#CCFF00]/20">
                            <Check className="w-3 h-3" /> 99+ Likes/Week
                        </div>
                        <div className="flex items-center gap-2 text-[#CCFF00] font-mono text-xs bg-black/50 px-2 py-1 backdrop-blur-sm border border-[#CCFF00]/20">
                            <Check className="w-3 h-3" /> "You look fun!" DMs
                        </div>
                    </div>
                </div>
            </div>

        </section>
    )
}