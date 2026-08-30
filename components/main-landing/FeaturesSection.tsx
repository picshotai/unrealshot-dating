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
    <section id="features" className="py-16 md:py-20 bg-[#111111] text-white">
      <div className="mx-auto w-full max-w-7xl space-y-10 px-4">
        {/* Header */}
        <div className="mx-auto max-w-4xl text-center mb-10">
          <p className="text-orange-500 font-bold uppercase tracking-wider text-xs sm:text-sm mb-3 block">
            WHEN YOUR PHOTOS FINALLY WORK
          </p>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-4 tracking-tight leading-[1.08]">
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

        {/* Bottom Line */}
        <div className="pt-4 text-center max-w-3xl mx-auto">
          <p className="text-xl md:text-2xl font-bold text-white leading-snug">
            The goal is not to make you look like someone else.{" "}
            <span className="text-[#ff6f00]">
              It is to make your profile stop underselling you.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
