"use client"
import type React from "react"
import { useEffect, useState } from "react"

const COLUMN_1_IMAGES = [
    { src: "/images/demo14.jpg", aspect: "aspect-[3/4]" },
    { src: "/images/demo12.jpg", aspect: "aspect-[3/4]" },
    { src: "/images/demo10.jpg", aspect: "aspect-[3/4]" },
    { src: "/images/demo8.jpg", aspect: "aspect-[3/4]" },
    { src: "/images/demo6.jpg", aspect: "aspect-[3/4]" },
]

const COLUMN_2_IMAGES = [
    { src: "/images/demo13.jpg", aspect: "aspect-[3/4]" },
    { src: "/images/demo11.jpg", aspect: "aspect-[3/4]" },
    { src: "/images/demo9.jpg", aspect: "aspect-[3/4]" },
    { src: "/images/demo7.jpg", aspect: "aspect-[3/4]" },
    { src: "/images/demo5.jpg", aspect: "aspect-[3/4]" },
]

export const FullFrameSection: React.FC = () => {
    return (
        <section className="min-h-screen md:h-screen grid md:grid-cols-2 border-b border-[#333] bg-black overflow-hidden">
            {/* Copy Side (Left) */}
            <div className="flex flex-col justify-center p-8 md:p-20 border-r border-[#333] relative z-10 bg-black">
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 border border-[#CCFF00] text-[#CCFF00] px-3 py-1.5 font-mono text-[10px] uppercase w-fit mb-6 shadow-[0_0_15px_rgba(204,255,0,0.15)] bg-[#CCFF00]/5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-[#CCFF00] animate-pulse rounded-full"></span>
                        Social Proof // Verified
                    </div>
                    <h2 className="font-display text-5xl md:text-7xl font-bold uppercase leading-[0.9]">
                        Stop Being Ghosted. <br/>
                        <span className="text-transparent stroke-text-lime">Start Getting Matches.</span>
                    </h2>
                </div>

                <p className="font-mono text-[#a4a4a4] mb-12 text-sm md:text-base max-w-md leading-relaxed border-l-2 border-[#333] pl-6">
                   Stop losing matches to bad selfies and awkward angles. We generate candid, lifestyle photos that look like <strong className="text-white">your best friend took them on a night out.</strong>
                </p>

                <div className="space-y-6">
                    {[
                        "More Matches, Less Effort.",
                        "Pass the \"Vibe Check\" Instantly.",
                        "Photos that don't look like \"AI\".",
                        "Optimized for Hinge, Tinder & Bumble."
                    ].map((text, i) => (
                        <div key={i} className="flex items-center gap-4 group cursor-default">
                            <div className="w-8 h-8 flex items-center justify-center border border-[#333] font-mono text-xs text-[#666] group-hover:border-[#CCFF00] group-hover:text-[#CCFF00] transition-colors">
                                0{i + 1}
                            </div>
                            <div className="font-mono text-sm uppercase text-[#666] group-hover:text-white transition-colors">
                                {text}
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* Visual Side (Right) - Vertical Masonry */}
            <div className="relative bg-[#050505] overflow-hidden h-[50vh] min-h-[400px] md:h-full md:min-h-0 border-t md:border-t-0 md:border-l border-[#333]">
               

                {/* Gradient Masks (Top/Bottom) */}
                <div className="absolute left-0 top-0 right-0 h-32 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none"></div>
                <div className="absolute left-0 bottom-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none"></div>

                <div className="grid grid-cols-2 gap-4 h-[150%] -mt-[10%] px-4 opacity-60 hover:opacity-100 transition-opacity duration-700">
                    {/* Column 1 - Scrolls Up */}
                    <div className="flex flex-col gap-4 animate-scroll-up hover:[animation-play-state:paused]">
                        {[...COLUMN_1_IMAGES, ...COLUMN_1_IMAGES, ...COLUMN_1_IMAGES].map((img, i) => (
                            <div
                                key={`col1-${i}`}
                                className={`relative group w-full ${img.aspect} bg-[#111] border border-[#333] overflow-hidden grayscale hover:grayscale-0 transition-all duration-500`}
                            >
                                <img src={img.src} className="w-full h-full object-cover" alt={`Result Col 1 ${i}`} />
                                <div className="absolute top-2 left-2 font-mono text-[9px] text-[#CCFF00] bg-black/80 px-1 border border-[#CCFF00]/20">
                                    {i < 9 ? `0${i + 1}` : i + 1}A
                                </div>
                                {/* Selection Marker */}
                                <div className="absolute inset-0 border-2 border-[#CCFF00] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            </div>
                        ))}
                    </div>

                    {/* Column 2 - Scrolls Down */}
                    <div className="flex flex-col gap-4 animate-scroll-down hover:[animation-play-state:paused]">
                        {[...COLUMN_2_IMAGES, ...COLUMN_2_IMAGES, ...COLUMN_2_IMAGES].map((img, i) => (
                            <div
                                key={`col2-${i}`}
                                className={`relative group w-full ${img.aspect} bg-[#111] border border-[#333] overflow-hidden grayscale hover:grayscale-0 transition-all duration-500`}
                            >
                                <img src={img.src} className="w-full h-full object-cover" alt={`Result Col 2 ${i}`} />
                                <div className="absolute bottom-2 right-2 font-mono text-[9px] text-[#CCFF00] bg-black/80 px-1 border border-[#CCFF00]/20">
                                    {i + 1}B
                                </div>
                                {/* Selection Marker */}
                                <div className="absolute inset-0 border-2 border-[#CCFF00] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes scroll-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(calc(-33.33% - 1rem)); }
        }
        @keyframes scroll-down {
          0% { transform: translateY(calc(-33.33% - 1rem)); }
          100% { transform: translateY(0); }
        }
        .animate-scroll-up {
          animation: scroll-up 30s linear infinite;
        }
        .animate-scroll-down {
          animation: scroll-down 35s linear infinite;
        }
      `}</style>
        </section>
    )
}
