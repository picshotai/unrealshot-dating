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
import { useTranslations } from "next-intl";

export function FeaturesSection() {
  const t = useTranslations("Home.features");
  const copy = t.raw("cards") as Array<{ title: string; description: string }>;
  const icons = [UserCheck, Compass, Sparkles, Layers, MessageCircle, ShieldCheck];
  const features = copy.map((feature, index) => ({ ...feature, icon: icons[index] }));

  return (
    <section id="features" className="py-16 md:py-20 bg-[#111111] text-white">
      <div className="mx-auto w-full max-w-7xl space-y-10 px-4">
        {/* Header */}
        <div className="mx-auto max-w-4xl text-center mb-10">
          <p className="text-orange-500 font-bold uppercase tracking-wider text-xs sm:text-sm mb-3 block">
            {t("eyebrow")}
          </p>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-4 tracking-tight leading-[1.08]">
            {t("title")} <span className="text-[#ff6f00]">{t("titleAccent")}</span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t("description")}
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
            {t("goal")} {" "}
            <span className="text-[#ff6f00]">
              {t("goalAccent")}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
