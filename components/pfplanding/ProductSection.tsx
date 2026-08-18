'use client';

import React, { useRef, useState } from 'react';

const cases = [
    {
        title: 'The "Candid" Solo',
        desc: 'Natural daylight, relaxed linen shirt, outdoor cafe seating.',
        img: '/images/candid-solo.webp'
    },
    {
        title: 'The "Sharp" Evening',
        desc: 'Low-angle golden hour light, tailored overcoat, city architecture.',
        img: '/showcase10.png'
    },
    {
        title: 'The "Active" Weekend',
        desc: 'Trail and climbing settings, athletic fit, natural body posture.',
        img: '/images/vintage-roll.webp'
    },
    {
        title: 'The "Hinge" Lead',
        desc: 'Clear eye contact, warm natural expression, 35mm depth of field.',
        img: '/images/hinge.webp'
    },
];

export const ProductSection: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.5; // Scroll speed multiplier
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <section className="py-24 border-b border-foreground/10 overflow-hidden relative">

            <div className="flex flex-col md:flex-row justify-between items-end gap-8 p-8 md:px-24">
                <div>
                    <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">
                        DELIVERY ARCHIVE // ZERO DUPLICATES
                    </div>
                    <h2 className="font-display text-4xl md:text-6xl font-bold uppercase mb-4">
                        THE COMPLETE PROFILE OVERHAUL
                    </h2>
                    <p className="font-mono text-foreground/60 max-w-2xl text-xs sm:text-sm leading-relaxed">
                        100 distinct photos spanning casual daytime, sharp evening, and relaxed weekend settings. Download high-resolution files formatted specifically for Hinge prompts, Bumble grids, and Tinder carousels — no duplicate outfits, no fake extras.
                    </p>
                </div>
                <div className="text-right hidden md:block">
                    <div className="font-mono text-accent text-xs mb-2 animate-pulse">● 100 UNIQUE SHOTS</div>
                    <div className="h-[1px] w-32 bg-accent ml-auto"></div>
                </div>

            </div>

            {/* Film Strip Container */}
            <div
                ref={scrollRef}
                className={`w-full overflow-x-auto pb-12 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
            >
                <style jsx>{`
                    div::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
                <div className="flex gap-0 w-max pl-12 md:pl-24">
                    {cases.map((item, index) => (
                        <div key={index} className="relative group w-[300px] md:w-[380px] flex-shrink-0 mr-10">
                            {/* Film Sprockets Top */}
                            <div className="h-6 w-full bg-black border-y border-foreground/20 flex justify-between items-center px-2 mb-2">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <div key={i} className="w-3 h-4 bg-[#1a1a1a] rounded-[2px]"></div>
                                ))}
                            </div>

                            {/* Image Frame */}
                            <div className="relative aspect-[2/3] overflow-hidden bg-[#111] border border-foreground/10">
                                <div className="absolute top-2 right-2 z-10 font-mono text-[9px] text-white/70 bg-black/70 px-1.5 py-0.5 rounded">
                                    0{index + 1} // 100
                                </div>
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    className="w-full h-full object-cover opacity-100 group-hover:opacity-85 transition-all duration-200 pointer-events-none"
                                    draggable={false}
                                />
                            </div>

                            {/* Film Sprockets Bottom */}
                            <div className="h-6 w-full bg-black border-y border-foreground/20 flex justify-between items-center px-2 mt-2">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <div key={i} className="w-3 h-4 bg-[#1a1a1a] rounded-[2px]"></div>
                                ))}
                            </div>

                            {/* Caption */}
                            <div className="mt-4">
                                <h3 className="font-display text-xl font-bold uppercase">{item.title}</h3>
                                <p className="font-mono text-xs text-foreground/50 mt-1">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};