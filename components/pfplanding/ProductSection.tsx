'use client';

import React, { useRef, useState } from 'react';

const cases = [
    {
        title: 'The "Candid" Solo',
        desc: 'Laughing at a cafe, messy hair, waiting for subway.',
        img: '/images/candid-solo.webp'
    },
    {
        title: 'The "Power Couple"',
        desc: 'Chemistry engine included. Night out, holding hands.',
        img: '/power-couple.jpg'
    },
    {
        title: 'The "Vintage" Roll',
        desc: 'Kodak Portra simulation. Nostalgic soul.',
        img: '/images/vintage-roll.webp'
    },
    {
        title: 'The "Hinge" Fix',
        desc: 'Not staged. Not corporate. Just vibes.',
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
                    <h2 className="font-display text-4xl md:text-6xl font-bold uppercase mb-4">
                        THE ULTIMATE PHOTO DUMP
                    </h2>
                    <p className="font-mono text-foreground/60 max-w-2xl">
                        Stop posting stiff, staged selfies. We generate the kind of candid, "caught-in-the-moment" shots that belong in your monthly carousel. From harsh flash to soft motion blur, get the photos that make people ask, "Who took this?"                        </p>
                </div>
                <div className="text-right hidden md:block">
                    <div className="font-mono text-accent text-xs mb-2 animate-pulse">● LIVE PREVIEW</div>
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
                        <div key={index} className="relative group w-[300px] md:w-[400px] flex-shrink-0 mr-12">
                            {/* Film Sprockets Top */}
                            <div className="h-6 w-full bg-black border-y border-foreground/20 flex justify-between items-center px-2 mb-2">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <div key={i} className="w-3 h-4 bg-[#1a1a1a] rounded-[2px]"></div>
                                ))}
                            </div>

                            {/* Image Frame */}
                            <div className="relative aspect-[2/3] overflow-hidden bg-[#111]">
                                <div className="absolute top-2 right-2 z-10 font-mono text-[9px] text-white/50 bg-black/50 px-1">
                                    {index + 1}A
                                </div>
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    className="w-full h-full object-cover opacity-100 group-hover:grayscale-80 group-hover:opacity-80 transition-all duration-100 ease-out hover:brightness-110 pointer-events-none"
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
                                <h3 className="font-display text-2xl font-bold uppercase">{item.title}</h3>
                                <p className="font-mono text-xs text-foreground/50 mt-1">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};