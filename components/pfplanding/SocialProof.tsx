import React from 'react';

const testimonials = [
    {
        id: "LOG_01",
        user: "josh_k",
        platform: "HINGE",
        content: "my friends roasted me for having only car selfies. used this to generate some travel pics and now I look like I actually go outside lol. 12 matches in 2 days.",
        rating: 5
    },
    {
        id: "LOG_02",
        user: "sarah_m",
        platform: "BUMBLE",
        content: "i hate asking ppl to take pics of me so this saved my life. the 'golden hour' photoshoot style is insane, looks totally natural.",
        rating: 5
    },
    {
        id: "LOG_03",
        user: "mike_t",
        platform: "TINDER",
        content: "was about to delete the app then tried this photoshoot pack. photos look exactly like me but on a good day. finally getting replies.",
        rating: 5
    },
    {
        id: "LOG_04",
        user: "alex_r",
        platform: "HINGE",
        content: "actually looks real. not that smooth plastic AI look everyone else has on dating apps. added to my profile and nobody noticed its ai.",
        rating: 5
    },
    {
        id: "LOG_05",
        user: "chris_p",
        platform: "OKCUPID",
        content: "saved me so much time. needed new pics for my profile and didn't want to pay a photographer $500. results are worth every penny.",
        rating: 4
    },
    {
        id: "LOG_06",
        user: "tyler_b",
        platform: "TINDER",
        content: "quality is nuts. better than the professional headshots i got last year. lighting is perfect for a dating profile main pic.",
        rating: 5
    }
];

export const SocialProof: React.FC = () => {
    return (
        <section className="w-full bg-black border-b border-[#333]">
            {/* Header */}
            <div className="p-8 md:p-12 border-b border-[#333] flex flex-col md:flex-row justify-between items-end bg-black">
                <div className="max-w-2xl">
                    <h2 className="font-display text-5xl md:text-7xl font-bold uppercase leading-[0.9]">
                        Real People. <br/>
                        <span className="text-transparent stroke-text-lime">Real Results.</span>
                    </h2>
                    <p className="font-mono text-[#a4a4a4] text-sm leading-relaxed mt-6">
                        No fake reviews. Just people getting more matches.
                        <br className="hidden md:block" />
                        See what happens when your photos match your vibe.
                    </p>
                </div>
            </div>

            {/* Grid - Using gap for borders */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-[#333] gap-[1px] border-b border-[#333]">
                {testimonials.map((t, i) => (
                    <div 
                        key={i} 
                        className="bg-black p-8 md:p-10 hover:bg-[#050505] transition-colors group flex flex-col justify-between h-full"
                    >
                        {/* Platform Badge */}
                        <div className="flex justify-end items-start mb-8 font-mono text-[10px] uppercase tracking-wider">
                            <div className="text-[#CCFF00] bg-[#CCFF00]/5 px-2 py-1 rounded-sm border border-[#CCFF00]/20">
                                {t.platform}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="mb-8">
                            <span className="text-[#333] font-display text-4xl leading-none -ml-1">"</span>
                            <p className="font-display text-lg md:text-xl text-[#ddd] leading-relaxed -mt-4">
                                {t.content}
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-between items-end pt-6 border-t border-[#333]/50 mt-auto">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-[#111] border border-[#333] flex items-center justify-center text-[10px] text-[#666] font-bold">
                                    {t.user.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-mono text-xs text-[#a4a4a4] font-bold">@{t.user}</span>
                            </div>
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, starIndex) => (
                                    <span 
                                        key={starIndex} 
                                        className={`text-sm ${starIndex < t.rating ? 'text-[#CCFF00]' : 'text-[#333]'}`}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

