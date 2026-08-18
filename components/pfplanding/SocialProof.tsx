import React from 'react';

export const SocialProof: React.FC = () => {
    return (
        <section className="grid md:grid-cols-2 border-b border-foreground/10">
            <div className="p-10 md:p-20 border-b md:border-b-0 md:border-r border-foreground/10 flex items-center bg-[#0a0a0a]">
                <blockquote className="relative">
                    <span className="absolute -top-7 -left-7 text-6xl text-foreground/10 font-display">"</span>
                    <p className="font-display text-xl md:text-2xl font-medium leading-snug mb-6 text-foreground/90">
                        The photos look completely natural — not a single plastic smile or weird uncanny glow. Swapped my Hinge opener and full-body shot, and my profile conversations completely turned around within days.
                    </p>
                    <footer className="font-mono text-xs sm:text-sm">
                        <span className="text-accent font-bold block mb-0.5">LIAM R.</span>
                        <span className="text-foreground/50 text-[11px] uppercase tracking-wider">Hinge & Bumble User · London</span>
                    </footer>
                </blockquote>
            </div>

            <div className="p-10 md:p-20 flex items-center bg-[#070707]">
                <blockquote className="relative">
                    <span className="absolute -top-7 -left-7 text-6xl text-foreground/10 font-display">"</span>
                    <p className="font-display text-xl md:text-2xl font-medium leading-snug mb-6 text-foreground/90">
                        Other tools sell scene counts where you end up with 3 repeat photos in the same shirt. Unrealshot actually delivered 100 distinct outfits and places. Having the pack pre-sorted into profile slots saved me days of overthinking.
                    </p>
                    <footer className="font-mono text-xs sm:text-sm">
                        <span className="text-accent font-bold block mb-0.5">MARK S.</span>
                        <span className="text-foreground/50 text-[11px] uppercase tracking-wider">Verified Customer · New York</span>
                    </footer>
                </blockquote>
            </div>
        </section>
    );
};