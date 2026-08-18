import React from 'react';

export const MoatSection: React.FC = () => {
    return (
        <section className="grid md:grid-cols-2 border-b border-foreground/10">
            {/* Manifesto / Text Side */}
            <div className="p-8 md:p-16 lg:p-20 border-r border-foreground/10 bg-[#0a0a0a] flex flex-col justify-center">
                <div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-accent">
                    THE ARITHMETIC ADVANTAGE // ZERO REPEATS
                </div>
                <h2 className="font-display text-3xl md:text-5xl font-bold uppercase leading-none mb-2">
                    Counting Scenes <br /> Is A Trap.
                </h2>
                <h2 className="font-display text-3xl md:text-5xl font-bold uppercase leading-none text-foreground/40 mb-12">
                    We Count In <br /> Unique Photos.
                </h2>

                {/* Comparison Logic - Git Diff Style Layout */}
                <div className="relative pl-6 md:pl-8 border-l border-foreground/10">

                    {/* 1. The Competitors (Deprecated) */}
                    <div className="mb-10 relative transition-opacity duration-300">
                        {/* Node Dot */}
                        <div className="absolute -left-[31px] md:-left-[39px] top-0 w-3 h-3 bg-red-900/50 border border-red-500/30 rounded-full"></div>

                        <div className="flex items-center gap-3 mb-4">
                            <span className="font-mono text-[10px] uppercase tracking-widest text-red-400">Other AI Dating Generators</span>
                            <span className="h-[1px] w-8 bg-red-500/20"></span>
                        </div>

                        <ul className="space-y-3.5 font-mono text-xs sm:text-sm text-foreground/40">
                            <li className="flex items-baseline gap-3">
                                <span className="text-red-500/60 font-bold">[x]</span>
                                <span className="line-through decoration-red-500/40">40 scenes into 100 photos = 2.5 repeat photos per outfit</span>
                            </li>
                            <li className="flex items-baseline gap-3">
                                <span className="text-red-500/60 font-bold">[x]</span>
                                <span className="line-through decoration-red-500/40">Plastic skin smoothing & uncanny studio glare</span>
                            </li>
                            <li className="flex items-baseline gap-3">
                                <span className="text-red-500/60 font-bold">[x]</span>
                                <span className="line-through decoration-red-500/40">Unsorted file dump — leaves you guessing what to post</span>
                            </li>
                        </ul>
                    </div>

                    {/* 2. Unrealshot AI */}
                    <div className="relative">
                        <div className="absolute -left-[31px] md:-left-[39px] top-1 w-3 h-3 bg-accent border border-accent shadow-[0_0_10px_rgba(255,77,0,0.5)] rounded-full animate-pulse"></div>

                        <div className="flex items-center gap-3 mb-6">
                            <span className="font-mono text-[10px] uppercase tracking-widest text-accent font-bold">Unrealshot AI Dating Shoot</span>
                            <span className="h-[1px] w-8 bg-accent/50"></span>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="font-display text-lg md:text-xl text-foreground font-bold uppercase mb-1 flex items-center gap-2">
                                    <span className="text-accent text-sm">01 //</span> 100 Outfits & 100 Locations
                                </h3>
                                <p className="font-mono text-xs text-foreground/60 pl-6 border-l border-foreground/10 ml-1">
                                    Code-enforced uniqueness. No duplicate shirts, no duplicate places, no duplicate lighting across your 100 photos.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-display text-lg md:text-xl text-foreground font-bold uppercase mb-1 flex items-center gap-2">
                                    <span className="text-accent text-sm">02 //</span> Real Skin & Phone-Plausible Framing
                                </h3>
                                <p className="font-mono text-xs text-foreground/60 pl-6 border-l border-foreground/10 ml-1">
                                    Preserves natural facial geometry, authentic stubble, and believable focal lengths swipers actually trust.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-display text-lg md:text-xl text-foreground font-bold uppercase mb-1 flex items-center gap-2">
                                    <span className="text-accent text-sm">03 //</span> Pre-Sorted Profile Lineup
                                </h3>
                                <p className="font-mono text-xs text-foreground/60 pl-6 border-l border-foreground/10 ml-1">
                                    Delivered organized into the 5 core dating profile roles: Opener, Full Body, What You Do, Out in the World, and The Rest.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Visual Comparison Grid (Right Side) */}
            <div className="grid grid-cols-2 h-[50vh] md:h-auto">
                <div className="border-r border-foreground/10 relative group h-full">
                    <div className="absolute top-0 left-0 w-full p-2.5 text-center text-xs font-mono text-foreground/80 bg-black/60 backdrop-blur-sm z-10">
                        // GENERIC AI PHOTOSHOOT
                    </div>
                    <img
                        src="/comparegenericai.jpg"
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        alt="Generic AI headshot example"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="font-display text-xl md:text-3xl text-red-500/70 font-bold -rotate-12 border-2 border-red-500/40 px-3 py-1.5 bg-black/70">
                            PLASTIC GLOSS
                        </span>
                    </div>
                </div>
                <div className="relative group h-full overflow-hidden">
                    <div className="absolute top-0 left-0 w-full p-2.5 text-center text-xs font-mono text-accent bg-black/60 backdrop-blur-sm z-10 font-bold tracking-wider">
                        // UNREALSHOT DATING PACK
                    </div>
                    <img
                        src="/comparepfpforme.png"
                        className="w-full h-full object-cover opacity-95 group-hover:opacity-100 transition-all duration-500 ease-out"
                        alt="Unrealshot dating photo example"
                    />
                    <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur border border-foreground/10 p-2 text-center text-[10px] font-mono text-foreground/70">
                        100% solo frames · 35mm natural daylight
                    </div>
                </div>
            </div>
        </section>
    );
};