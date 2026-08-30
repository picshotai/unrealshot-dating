"use client";

import {
  UserCheck,
  Compass,
  Sparkles,
  Layers,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { FeatureCard } from "@/components/ui/grid-feature-cards";

const features = [
  {
    title: "You stop apologizing for your profile",
    icon: UserCheck,
    description:
      'No more saying, "I look better in person." You finally have photos you actually want people to see.',
  },
  {
    title: "Your profile shows more than your face",
    icon: Compass,
    description:
      "Different moments, places and interests give someone a sense of your life before the conversation even starts.",
  },
  {
    title: "You stop waiting for good photos to happen",
    icon: Sparkles,
    description:
      "No more hoping a friend takes one decent picture of you sometime this year. You already have a camera roll built for dating.",
  },
  {
    title: "Your photos finally feel connected",
    icon: Layers,
    description:
      "Your profile looks like one person living one real life, not a random mix of selfies, old photos and unrelated AI generations.",
  },
  {
    title: "You give people something to respond to",
    icon: MessageCircle,
    description:
      "A good profile creates openings. A place, an activity, a moment or a detail can make starting a conversation much easier.",
  },
  {
    title: "You feel more confident sending people to your profile",
    icon: ShieldCheck,
    description:
      "Because the photos finally represent you the way you wanted them to.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-28 bg-[#111111] text-white">
      <div className="mx-auto w-full max-w-6xl space-y-12 px-4">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ff6f00]/10 border border-[#ff6f00]/25 text-[#ff6f00] text-xs font-mono tracking-wider uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6f00] animate-pulse" />
            WHEN YOUR PHOTOS FINALLY WORK
          </div>

          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-[1.12]">
            Your profile starts <span className="text-[#ff6f00]">feeling like you.</span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Better dating photos do more than make you look good. They make your
            whole profile easier to believe, easier to understand, and easier to
            say yes to.
          </p>
        </div>

        {/* 6-Card Grid */}
        <div className="grid grid-cols-1 divide-x divide-y divide-dashed border border-dashed border-gray-600/30 sm:grid-cols-2 md:grid-cols-3">
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} />
          ))}
        </div>

        {/* Bottom Line Box */}
        <div className="pt-4 text-center max-w-3xl mx-auto">
          <div className="relative p-px rounded-2xl bg-gradient-to-r from-transparent via-[#ff6f00]/40 to-transparent">
            <div className="bg-zinc-950/90 border border-zinc-800 rounded-2xl px-6 sm:px-10 py-6 sm:py-8 backdrop-blur-md shadow-2xl">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
                The goal is not to make you look like someone else.{" "}
                <span className="text-[#ff6f00] block sm:inline">
                  It is to make your profile stop underselling you.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
