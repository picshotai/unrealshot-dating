"use client"
import React from 'react';
import { Target, Scan, Crosshair, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const ConsistencySection: React.FC = () => {
    return (
        <section className="min-h-screen bg-black text-white relative border-b border-[#333] overflow-hidden flex flex-col justify-center">
            
            {/* Header: Left Aligned Badge/Heading, Right Aligned Desc */}
            <div className="w-full mx-auto px-6 md:px-12 py-16 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-12">
                    {/* Left Side: Badge & Heading */}
                    <div className="max-w-2xl">
                      
                        <div className="inline-flex items-center gap-3 border border-[#CCFF00] text-[#CCFF00] px-3 py-1.5 font-mono text-[10px] md:text-xs uppercase w-fit mb-8 shadow-[0_0_15px_rgba(204,255,0,0.15)] bg-[#CCFF00]/5">
            <span className="w-2 h-2 bg-[#CCFF00] animate-pulse"></span>
             The 3 Essential Photos</div>
                        <h2 className="font-display text-5xl md:text-7xl font-bold uppercase leading-[0.9]">
                            The Algorithm <br/>
                            <span className="text-transparent stroke-text-lime">Isn't Rigged.</span>
                        </h2>
                    </div>

                    {/* Right Side: Description */}
                    <div className="max-w-md text-left md:text-left">
                        <p className="font-mono text-[#a4a4a4] text-sm md:text-base leading-relaxed">
                            You aren't "shadowbanned." You're just feeding the algorithm bad data. 
                            We replace the 3 biggest red flags in your profile with green flags.
                        </p>
                    </div>
                </div>
            </div>

            {/* Full Width Columns - 3:4 Aspect Ratio Forced */}
            <div className="flex-grow grid grid-cols-1 md:grid-cols-3 w-full border-t border-[#333]">
                {[
                    { 
                        id: "01",
                        title: "The 'Social Proof' Shot", 
                        problem: "PROBLEM: \"HE LOOKS LONELY\"", 
                        desc: "Candid shots that imply you have a fun social circle.",
                        img: '/images/candid-solo.webp',
                    },
                    { 
                        id: "02",
                        title: "The 'High Status' Shot", 
                        problem: "PROBLEM: \"LOW EFFORT\"", 
                        desc: "Full body shots that show confidence and style.",
                        img: '/images/full-body-photo.webp',
                    },
                    { 
                        id: "03",
                        title: "The 'Vibe' Shot", 
                        problem: "PROBLEM: \"TRY-HARD\"", 
                        desc: "Cinematic lighting that looks accidental but perfect.",
                        img: '/images/cinematic-photo.webp',
                    }
                ].map((item, i) => (
                    <div key={i} className="group relative border-r border-[#333] bg-black hover:bg-[#050505] transition-colors flex flex-col overflow-hidden aspect-[3/4] md:aspect-auto md:h-[80vh]">
                        
                        {/* Image Area (Full Bleed) */}
                        <div className="absolute inset-0 w-full h-full">
                            <img
                                src={item.img}
                                alt={item.title}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-500"></div>
                        </div>

                        {/* Content Overlay (Bottom aligned) */}
                        <div className="relative z-10 mt-auto p-8 md:p-12 flex flex-col justify-end h-full pointer-events-none">
                            <div className="mb-auto opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-y-4 group-hover:translate-y-0">
                                <div className="font-mono text-6xl font-bold text-white/10">{item.id}</div>
                            </div>

                            <div className="border-l-2 border-[#CCFF00] pl-6 transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-500">
                                <div className="font-mono text-[10px] text-red-500 mb-2 uppercase tracking-widest bg-black/50 w-fit px-2 py-1 backdrop-blur-sm">
                                    {item.problem}
                                </div>
                                <h3 className="font-display text-3xl md:text-4xl font-bold text-white uppercase mb-4 leading-none drop-shadow-lg">
                                    {item.title}
                                </h3>
                                <p className="font-sans text-sm md:text-base text-white/80 max-w-xs leading-relaxed opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};