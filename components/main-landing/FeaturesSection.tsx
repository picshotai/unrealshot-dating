"use client";

import { UserCheck, Compass, Sparkles, Layers, MessageCircle, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { LandingHeading, LandingSection, landingStyles } from "./LandingSection";

export function FeaturesSection() {
  const t = useTranslations("Home.features");
  const cards = t.raw("cards") as Array<{ title: string; description: string }>;
  const icons = [UserCheck, Compass, Sparkles, Layers, MessageCircle, ShieldCheck];

  return (
    <LandingSection id="features" dark>
      <LandingHeading eyebrow={t("eyebrow")} title={t("title")} accent={t("titleAccent")} description={t("description")} />

      {/* Hairline grid: 1px gaps over the line colour draw the rules between cells */}
      <div className="grid gap-px overflow-hidden rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-line)] sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => {
          const Icon = icons[index];
          return (
            <div key={card.title} className="bg-[#0b0b0b] p-5 transition-colors hover:bg-[#101010] sm:p-8">
              {/* Icon sits beside the title on phones, above it from sm up */}
              <div className="flex items-start gap-3 sm:block">
                <Icon className="mt-0.5 size-5 shrink-0 text-[var(--landing-accent)] sm:mt-0" strokeWidth={1.5} aria-hidden="true" />
                <h3 className={`${landingStyles.itemTitle} sm:mt-8`}>{card.title}</h3>
              </div>
              <p className={`${landingStyles.body} mt-2 sm:mt-2`}>{card.description}</p>
            </div>
          );
        })}
      </div>

      <p className={`${landingStyles.statement} mt-12 sm:mt-14`}>
        {t("goal")} <span className="text-[var(--landing-accent)]">{t("goalAccent")}</span>
      </p>
    </LandingSection>
  );
}
