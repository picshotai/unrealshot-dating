"use client"
import type React from "react"

const COLUMN_1_IMAGES = [
    { src: "/showcase10.png", aspect: "aspect-[3/4]" },
    { src: "/showcase8.png", aspect: "aspect-[16/9]" },
    { src: "/showcase3.png", aspect: "aspect-[9/16]" },
    { src: "/showcase5.png", aspect: "aspect-[4/3]" },
    { src: "/showcase1.png", aspect: "aspect-[3/4]" },
]

const COLUMN_2_IMAGES = [
    { src: "/showcase4.png", aspect: "aspect-[3/4]" },
    { src: "/showcase7.png", aspect: "aspect-[16/9]" },
    { src: "/showcase9.png", aspect: "aspect-[9/16]" },
    { src: "/showcase2.png", aspect: "aspect-[4/3]" },
    { src: "/showcase6.png", aspect: "aspect-[3/4]" },
]

export const FullFrameSection: React.FC = () => {
    return (
        <section className="h-screen min-h-[800px] grid md:grid-cols-2 border-b border-foreground/10 bg-[#080808] overflow-hidden">
            {/* Copy Side (Left) */}
            <div className="flex flex-col justify-center p-8 md:p-20 border-r border-foreground/10 relative z-10 bg-[#080808]">
                <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">
                    SWIPING PSYCHOLOGY // APP OPTIMIZED
                </div>
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase mb-6 leading-tight">
                    BUILT FOR HINGE, <br />
                    <span className="text-foreground/40">BUMBLE & TINDER.</span>
                </h2>

                <p className="font-mono text-foreground/70 mb-8 text-xs sm:text-sm max-w-md leading-relaxed">
                    Dating app swipers penalize low-effort selfies and stiff corporate headshots. Unrealshot produces the exact visual signals modern dating profiles reward:
                </p>

                <div className="space-y-4">
                    <div className="flex items-center gap-4 group">
                        <div className="w-8 h-8 flex items-center justify-center border border-foreground/20 font-mono text-xs text-accent">
                            01
                        </div>
                        <div className="font-mono text-xs sm:text-sm uppercase text-foreground/70 group-hover:text-foreground transition-colors">
                            Native dating app crops (tall portrait & full vertical).
                        </div>
                    </div>
                    <div className="flex items-center gap-4 group">
                        <div className="w-8 h-8 flex items-center justify-center border border-foreground/20 font-mono text-xs text-accent">
                            02
                        </div>
                        <div className="font-mono text-xs sm:text-sm uppercase text-foreground/70 group-hover:text-foreground transition-colors">
                            Real-world plausibility with natural phone-grade lighting.
                        </div>
                    </div>
                    <div className="flex items-center gap-4 group">
                        <div className="w-8 h-8 flex items-center justify-center border border-foreground/20 font-mono text-xs text-accent">
                            03
                        </div>
                        <div className="font-mono text-xs sm:text-sm uppercase text-foreground/70 group-hover:text-foreground transition-colors">
                            100 unique outfits — shows range across every photo.
                        </div>
                    </div>
                    <div className="flex items-center gap-4 group">
                        <div className="w-8 h-8 flex items-center justify-center border border-foreground/20 font-mono text-xs text-accent">
                            04
                        </div>
                        <div className="font-mono text-xs sm:text-sm uppercase text-foreground/70 group-hover:text-foreground transition-colors">
                            Zero fake background extras — clean focus on you alone.
                        </div>
                    </div>
                </div>

            </div>

            {/* Visual Side (Right) - Vertical Masonry */}
            <div className="relative bg-black/50 overflow-hidden h-full">
                {/* Context Overlay */}
                <div className="absolute top-4 right-4 z-20 font-mono text-[10px] text-foreground/30 text-right mix-blend-difference">
                    SCROLL_AXIS: Y-VERTICAL <br />
                    APP_CROPS: 4:5 / 9:16
                </div>

                {/* Gradient Masks (Top/Bottom) */}
                <div className="absolute left-0 top-0 right-0 h-32 bg-gradient-to-b from-[#080808] to-transparent z-10 pointer-events-none"></div>
                <div className="absolute left-0 bottom-0 right-0 h-32 bg-gradient-to-t from-[#080808] to-transparent z-10 pointer-events-none"></div>

                <div className="grid grid-cols-2 gap-4 h-[150%] -mt-[10%] px-4">
                    {/* Column 1 - Scrolls Up */}
                    <div className="flex flex-col gap-4 animate-scroll-up hover:[animation-play-state:paused]">
                        {[...COLUMN_1_IMAGES, ...COLUMN_1_IMAGES, ...COLUMN_1_IMAGES].map((img, i) => (
                            <div
                                key={`col1-${i}`}
                                className={`relative group w-full ${img.aspect} bg-foreground/5 border border-foreground/10 overflow-hidden hover:grayscale-80 transition-all duration-500`}
                            >
                                <img src={img.src} className="w-full h-full object-cover" alt={`Result Col 1 ${i}`} />
                                <div className="absolute top-2 left-2 font-mono text-[9px] text-white/50 bg-black/50 px-1">
                                    {i < 9 ? `0${i + 1}` : i + 1}A
                                </div>
                                {/* Selection Marker */}
                                <div className="absolute inset-0 border-4 border-accent/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none mix-blend-screen"></div>
                            </div>
                        ))}
                    </div>

                    {/* Column 2 - Scrolls Down */}
                    <div className="flex flex-col gap-4 animate-scroll-down hover:[animation-play-state:paused]">
                        {[...COLUMN_2_IMAGES, ...COLUMN_2_IMAGES, ...COLUMN_2_IMAGES].map((img, i) => (
                            <div
                                key={`col2-${i}`}
                                className={`relative group w-full ${img.aspect} bg-foreground/5 border border-foreground/10 overflow-hidden hover:grayscale-80 transition-all duration-500`}
                            >
                                <img src={img.src} className="w-full h-full object-cover" alt={`Result Col 2 ${i}`} />
                                <div className="absolute bottom-2 right-2 font-mono text-[9px] text-white/50 bg-black/50 px-1">
                                    {i + 1}B
                                </div>
                                {/* Selection Marker */}
                                <div className="absolute inset-0 border-4 border-accent/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none mix-blend-screen"></div>
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