import React from 'react';

export const ConsistencySection: React.FC = () => {
    return (
        <section className="py-24 border-b border-foreground/10 bg-[#050505] relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: 'linear-gradient(#EBEBEB 1px, transparent 1px), linear-gradient(90deg, #EBEBEB 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div>
                        <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">
                            FACIAL IDENTITY // ZERO GLITCHING
                        </div>
                        <h2 className="font-display text-4xl md:text-5xl font-bold uppercase mb-4 leading-none">
                            NO SHAPESHIFTING. <span className="text-accent">ONE PERSON: YOU.</span>
                        </h2>
                        <p className="font-mono text-foreground/60 max-w-xl text-sm md:text-base leading-relaxed">
                            Generic AI generators hallucinate a different face the moment the angle or lighting shifts. Unrealshot locks your facial identity from 4–6 reference selfies across all 100 photos. <strong className="text-foreground">One person in every frame: him</strong>. No weird AI lookalikes. No awkward background extras. Just you on your best days.
                        </p>
                    </div>
                    <div className="font-mono text-[10px] md:text-xs text-accent text-right">
                        IDENTITY_LOCK: ENFORCED <br />
                        BACKGROUND_EXTRAS: 0 (SOLO FRAMES)
                    </div>
                </div>

                {/* The Matrix Grid */}
                <div className="relative">
                    {/* Connecting Line (Desktop Only) */}
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-accent/30 hidden md:block z-20"></div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: 'FRONTAL OPENER // EYE-LEVEL ENGAGEMENT', img: '/pores-visible.png' },
                            { title: 'FULL BODY // CONTEXT-AWARE POSTURE', img: '/images/full-body-photo.webp' },
                            { title: 'OFF-AXIS CANDID // NATURAL PROFILE', img: '/profile.png' }
                        ].map((item, i) => (
                            <div key={i} className="relative group">
                                {/* Image Container */}
                                <div className="relative aspect-[3/4] overflow-hidden border border-foreground/10 bg-black">
                                    <img
                                        src={item.img}
                                        alt="Identity Consistency"
                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-70 group-hover:grayscale-50 transition-all duration-300"
                                    />

                                    {/* Face Mesh Overlay */}
                                    <div className="absolute top-[20%] left-[25%] w-[50%] h-[30%] border border-accent/60 opacity-80 z-30 flex flex-col justify-between p-1 group-hover:border-accent transition-colors">
                                        <div className="flex justify-between">
                                            <div className="w-1 h-1 bg-accent"></div>
                                            <div className="w-1 h-1 bg-accent"></div>
                                        </div>

                                        {/* Center Target */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border border-accent/40 rounded-full flex items-center justify-center">
                                            <div className="w-0.5 h-0.5 bg-accent"></div>
                                        </div>

                                        <div className="flex justify-between">
                                            <div className="w-1 h-1 bg-accent"></div>
                                            <div className="w-1 h-1 bg-accent"></div>
                                        </div>
                                    </div>

                                    {/* Scanning line animation */}
                                    <div className="absolute top-0 left-0 w-full h-[1px] bg-accent/50 animate-[scan_3s_ease-in-out_infinite] z-30 shadow-[0_0_10px_rgba(255,77,0,0.5)]"></div>
                                </div>

                                {/* Meta Label */}
                                <div className="mt-3 font-mono text-[10px] text-accent/70 uppercase tracking-widest">
                                    {item.title}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
            @keyframes scan {
                0% { top: 10%; opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { top: 90%; opacity: 0; }
            }
        `}</style>
        </section>
    );
};