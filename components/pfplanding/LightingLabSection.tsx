import React from 'react';
import { Eye, UserCheck, Activity, Compass, Layers } from 'lucide-react';

export const LightingLabSection: React.FC = () => {
    const roles = [
        {
            icon: Eye,
            name: "Your Opener",
            desc: "The first photo. The one that stops the scroll and decides the swipe.",
            k: "SLOT 01 // OPENER"
        },
        {
            icon: UserCheck,
            name: "Your Full Body",
            desc: "The one every app and every swiper looks for. Real posture, head-to-toe.",
            k: "SLOT 02 // FULL BODY"
        },
        {
            icon: Activity,
            name: "What You Do",
            desc: "Him doing the things he actually does. Tailored to your selected hobbies.",
            k: "SLOT 03 // ACTIVITIES"
        },
        {
            icon: Compass,
            name: "Out in the World",
            desc: "Him somewhere real, living a life. Believable daylight and city settings.",
            k: "SLOT 04 // LIFESTYLE"
        },
        {
            icon: Layers,
            name: "The Rest",
            desc: "Depth. The varied angles and candid frames that make a profile read as a person.",
            k: "SLOT 05 // DEPTH"
        },
    ];

    return (
        <section className="min-h-[80vh] border-b border-foreground/10 bg-[#080808] grid md:grid-cols-2">
            {/* Left Column: Text & Visual Menu */}
            <div className="flex flex-col justify-center p-8 md:p-16 lg:p-20 border-r border-foreground/10 h-full">
                {/* Heading */}
                <div className="mb-6">
                    <div className="font-mono text-[10px] text-accent mb-4 tracking-widest uppercase">
                        THE PROFILE BLUEPRINT // 5 ESSENTIAL ROLES
                    </div>
                    <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase leading-[0.9] mb-5">
                        Not Just 100 Files.<br />
                        <span className="text-transparent stroke-text">Your Profile, Sorted</span>.
                    </h2>
                    <p className="font-mono text-foreground/60 text-xs sm:text-sm max-w-md leading-relaxed">
                        A high-converting dating profile is not a random photo dump — it is a structured sequence. Every Unrealshot delivery arrives pre-organized into the 5 core roles dating apps ask you to fill:
                    </p>
                </div>

                {/* The 5 Roles List */}
                <div className="space-y-2 mt-2">
                    {roles.map((role, i) => (
                        <div key={i} className="group flex items-start gap-3.5 p-2.5 -mx-2.5 border border-transparent hover:border-foreground/10 hover:bg-white/5 transition-all cursor-default rounded-lg">
                            <div className="w-8 h-8 flex items-center justify-center border border-foreground/20 group-hover:border-accent/50 transition-colors shrink-0 mt-0.5">
                                <role.icon className="w-4 h-4 text-foreground/50 group-hover:text-accent transition-colors" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="font-display text-sm font-bold uppercase text-foreground group-hover:text-accent transition-colors">
                                        {role.name}
                                    </h4>
                                    <span className="font-mono text-[9px] text-foreground/40 border border-foreground/10 px-1 py-0.2">
                                        {role.k}
                                    </span>
                                </div>
                                <p className="font-mono text-[11px] text-foreground/50 leading-relaxed mt-0.5">
                                    {role.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Column: 2x2 Grid of Samples */}
            <div className="grid grid-cols-2 bg-black">
                {[
                    { title: "Your Opener", k: "OPENER", desc: "First photo eye contact · Daytime lighting", img: "/showcase18.png" },
                    { title: "Your Full Body", k: "FULL BODY", desc: "Head-to-toe context · Natural stride", img: "/images/golden-photo.webp" },
                    { title: "What You Do", k: "WHAT YOU DO", desc: "Hobbies without looking staged", img: "/images/gritty-photo.webp" },
                    { title: "Out in the World", k: "LIFESTYLE", desc: "Cafe, street, weekend living", img: "/images/cinematic-photo.webp" },
                ].map((item, i) => (
                    <div key={i} className={`group cursor-pointer relative aspect-[3/4] overflow-hidden border-foreground/10 bg-[#111]
                            ${i % 2 === 0 ? 'border-r' : ''} 
                            ${i < 2 ? 'border-b' : ''}
                        `}>
                        {/* Interactive Card */}
                        <div className="w-full h-full relative">
                            {/* Dark Overlay that vanishes on hover */}
                            <div className="absolute inset-0 z-10 transition-opacity duration-300 pointer-events-none"></div>

                            <img
                                src={item.img}
                                alt={item.title}
                                className="w-full h-full object-cover"
                            />

                            {/* Hover UI elements */}
                            <div className="absolute top-0 left-0 w-full h-full p-5 flex flex-col justify-end z-20">
                                {/* Top Corners */}
                                <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <div className="transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-black/80 p-3 rounded border border-white/10">
                                    <div className="font-mono text-[9px] text-accent mb-1 tracking-widest uppercase">
                                        {item.k}
                                    </div>
                                    <h3 className="font-display text-base font-bold uppercase text-white mb-0.5">
                                        {item.title}
                                    </h3>
                                    <p className="font-mono text-[10px] text-foreground/70">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>

                            {/* Static Label (Always visible until hover) */}
                            <div className="absolute bottom-3 left-3 z-20 transition-opacity duration-300 group-hover:opacity-0 pointer-events-none">
                                <span className="font-mono text-[10px] bg-black/70 backdrop-blur-md px-2 py-1 text-foreground/70 border border-white/10">
                                    {item.k}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};