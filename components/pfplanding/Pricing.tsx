import type React from "react"
import { Button } from "./ui/Button"
import Link from "next/link"
import { Check, ShieldCheck, Sparkles, Zap } from "lucide-react"

const datingPlan = {
    name: "COMPLETE DATING PHOTOSHOOT",
    subtitle: "100 Unique Photos Pre-Sorted into 5 Profile Roles.",
    price: "$59",
    priceNote: "one-time payment",
    badge: "THE COMPLETE OVERHAUL",
    features: [
        "100 Unique Photos — 100 distinct outfits, locations & lighting setups",
        "5 Pre-Sorted Lineup Slots (Opener, Full Body, What You Do, Out in World, The Rest)",
        "30 Free Custom Re-Shoots of any individual photo included",
        "Tailored to your real activities (up to 10 photos matching your hobbies)",
        "4 Content Exclusions (leave out drinks, dogs, bikes, or team sports)",
        "Native Dating App Crops (tall portrait 4:5 & vertical 9:16)",
        "Full Commercial Rights & 100% Privacy Auto-Delete after 7 days",
    ],
    cta: "Create Your Dating Pack ($59)",
}

interface PricingProps {
    asH1?: boolean; // When true, renders main heading as H1 (for dedicated pricing page)
}

export const Pricing: React.FC<PricingProps> = ({ asH1 = false }) => {
    const HeadingTag = asH1 ? 'h1' : 'h2';
    return (
        <section className="border-b border-foreground/10 py-16 px-4 md:px-8 max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto mb-12">
                <div className="font-mono text-xs text-accent uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    PRICING // SINGLE OVERHAUL PACK
                </div>
                <HeadingTag className="font-display text-4xl md:text-5xl font-bold uppercase leading-[0.95] mb-4">
                    Upgrade Your Dating Profile.<br />
                    <span className="text-foreground/40">No Subscriptions.</span>
                </HeadingTag>
                <p className="font-mono text-foreground/60 text-xs sm:text-sm md:text-base max-w-lg mx-auto leading-relaxed">
                    A complete, finished dating profile for less than the cost of a single professional photo shoot session.
                </p>
            </div>

            {/* Single Featured Plan Card */}
            <div className="max-w-2xl mx-auto bg-[#0a0a0a] border border-accent/40 rounded-2xl p-6 sm:p-10 md:p-12 relative overflow-hidden shadow-2xl">
                {/* Subtle Grid Background */}
                <div
                    className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{
                        backgroundImage:
                            "linear-gradient(#EBEBEB 1px, transparent 1px), linear-gradient(90deg, #EBEBEB 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                ></div>

                <div className="relative z-10">
                    {/* Badge */}
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div className="inline-block bg-accent text-background font-mono text-xs font-bold px-3 py-1 uppercase tracking-widest rounded font-oxanium">
                            {datingPlan.badge}
                        </div>
                        <span className="font-mono text-xs text-foreground/40 flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5 text-accent" /> ~90 Min Delivery
                        </span>
                    </div>

                    {/* Plan Name & Subtitle */}
                    <div className="mb-6">
                        <h3 className="font-display text-2xl md:text-3xl font-bold uppercase mb-1 text-white">
                            {datingPlan.name}
                        </h3>
                        <p className="font-mono text-xs sm:text-sm text-foreground/60">{datingPlan.subtitle}</p>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline mb-8 pb-6 border-b border-foreground/10">
                        <span className="font-display text-5xl md:text-6xl font-bold text-white tracking-tight font-oxanium">
                            {datingPlan.price}
                        </span>
                        <span className="font-mono text-foreground/50 ml-3 text-sm">{datingPlan.priceNote}</span>
                        <span className="ml-auto font-mono text-xs text-accent bg-accent/10 px-2.5 py-1 rounded border border-accent/20">
                            $0.59 / photo
                        </span>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-3.5 font-mono text-xs sm:text-sm mb-10">
                        {datingPlan.features.map((feature, i) => (
                            <li key={i} className="flex items-start text-foreground/90 gap-3">
                                <span className="w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0 mt-0.5">
                                    <Check className="w-3.5 h-3.5" />
                                </span>
                                <span className="leading-snug">{feature}</span>
                            </li>
                        ))}
                    </ul>

                    {/* CTA Button */}
                    <Link href="/dating-shoot" className="block w-full">
                        <Button size="lg" variant="primary" className="w-full text-sm sm:text-base py-6 font-bold uppercase tracking-wider font-oxanium">
                            {datingPlan.cta} →
                        </Button>
                    </Link>

                    <div className="flex items-center justify-center gap-2 text-center font-mono text-xs text-foreground/40 mt-5">
                        <ShieldCheck className="w-4 h-4 text-accent" />
                        <span>SECURE CHECKOUT // POWERED BY DODOPAYMENTS</span>
                    </div>
                </div>
            </div>
        </section>
    )
}