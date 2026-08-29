import React from 'react';

export const HowItWorks: React.FC = () => {
    return (
        <section className="grid md:grid-cols-12 border-b border-foreground/10">
            <div className="col-span-12 md:col-span-4 p-8 md:p-12 border-b md:border-b-0 md:border-r border-foreground/10 flex flex-col justify-between">
                <div>
                    <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">
                        THE INTAKE // 3 MINUTES
                    </div>
                    <h2 className="font-display text-4xl md:text-5xl font-bold uppercase mb-4 leading-none">
                        Three Questions.<br />
                        <span className="text-foreground/30">Zero Guesswork.</span>
                    </h2>
                    <p className="font-mono text-foreground/60 text-xs sm:text-sm mt-4 leading-relaxed">
                        You answer three simple preferences. We handle the other hundred creative decisions — outfits, lighting, locations, and crops.
                    </p>
                </div>
                <div className="font-mono text-xs text-foreground/40 mt-8">
                    INTAKE_ID: STUDIO_V2
                </div>
            </div>

            <div className="col-span-12 md:col-span-8 grid md:grid-cols-3">
                {[
                    {
                        step: '01',
                        title: 'Upload 4–6 Photos',
                        desc: 'Upload 4–6 clear everyday photos. Our system maps your facial geometry and natural skin tone without needing a studio session.',
                        meta: 'FACE_ANCHOR'
                    },
                    {
                        step: '02',
                        title: 'Answer 3 Preferences',
                        desc: 'Choose which wardrobe to lead with, pick what you actually do from 16 interests, and exclude any content you do not want (drinks, dogs, bikes).',
                        meta: 'PROFILE_TAILOR'
                    },
                    {
                        step: '03',
                        title: 'Download 60 Photos',
                        desc: 'Fifteen shoots, four photos from each — a close portrait, a half-body, a full-length and a candid. Plus 15 free Photo Retakes for any photo you do not love.',
                        meta: 'SORTED_LINEUP'
                    }
                ].map((item, i) => (
                    <div key={i} className={`p-8 border-b md:border-b-0 border-foreground/10 flex flex-col justify-between hover:bg-white/5 transition-colors group ${i !== 2 ? 'md:border-r' : ''}`}>
                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <span className="font-display text-5xl md:text-6xl text-foreground/30 group-hover:text-accent/30 transition-colors font-bold">
                                    {item.step}
                                </span>
                                <span className="font-mono text-[9px] border border-foreground/20 px-1.5 py-0.5 text-foreground/50">
                                    {item.meta}
                                </span>
                            </div>
                            <h3 className="font-display text-xl font-bold uppercase mb-2 group-hover:text-accent transition-colors">
                                {item.title}
                            </h3>
                            <p className="font-mono text-xs sm:text-sm text-foreground/60 leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};