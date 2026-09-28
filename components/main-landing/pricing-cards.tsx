"use client";

import { Check, ShieldCheck, Zap } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { LandingCta, LandingHeading, LandingSection, landingStyles } from "./LandingSection";

// Items 0 and 2 (shoots/photos, retakes) are shown as the numbers row, so the list skips them.
const LIST_ITEMS = [1, 3, 4, 5, 6, 7];

// Punched half-circles where the perforation meets the card edge.
const NOTCH = "absolute size-6 rounded-full border border-zinc-800 bg-[#0b0b0b]";

export default function PricingCards() {
  const t = useTranslations("Home.pricing");
  const pricingT = useTranslations("Pricing");
  const features = t.raw("features") as string[];
  const stats = t.raw("stats") as Array<{ value: string; label: string }>;

  return (
    <LandingSection id="pricing" dark>
      <LandingHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        accent={t("titleAccent")}
        description={<>{t("description")} {t("descriptionAccent")}</>}
      />

      {/* One product, one ticket. Phones: stub on top, tear line, details below.
          Desktop: a landscape ticket, stub (price + action) left, details right. */}
      <div className="relative mx-auto w-full max-w-md lg:max-w-[60rem]">
        <div aria-hidden="true" className="pointer-events-none absolute -inset-x-10 -top-10 h-56 rounded-full bg-[#ff6f00]/10 blur-3xl lg:-left-16 lg:right-auto lg:top-1/2 lg:h-72 lg:w-[26rem] lg:-translate-y-1/2" />
        <div className="relative rounded-3xl border border-zinc-800 bg-[#141414] lg:grid lg:grid-cols-[minmax(0,24rem)_1px_minmax(0,1fr)]">
          <div className="flex flex-col gap-6 p-6 sm:p-8 lg:justify-between lg:p-10">
            <div>
              <p className={landingStyles.eyebrow}>{t("packageLabel")}</p>
              <p className="flex items-baseline gap-3">
                <span className="font-[family-name:var(--font-inter-tight)] text-6xl font-semibold leading-none tracking-[-0.045em] sm:text-7xl">
                  {pricingT("package.price")}
                </span>
                <span className={landingStyles.note}>{t("priceSuffix")}</span>
              </p>
              <p className={`${landingStyles.note} mt-3`}>{t("vsPhotographer")}</p>
            </div>
            <LandingCta className="w-full">{t("cta")}</LandingCta>
          </div>

          {/* Perforation: horizontal on phones, vertical on desktop */}
          <div aria-hidden="true" className="relative h-px lg:h-auto lg:w-px">
            <span className="absolute inset-x-6 top-0 border-t border-dashed border-zinc-700 lg:inset-x-auto lg:inset-y-6 lg:left-0 lg:border-l lg:border-t-0" />
            <span className={`${NOTCH} -left-3 -top-3 [clip-path:inset(0_0_0_50%)] lg:[clip-path:inset(50%_0_0_0)]`} />
            <span className={`${NOTCH} -right-3 -top-3 [clip-path:inset(0_50%_0_0)] lg:-bottom-3 lg:-left-3 lg:right-auto lg:top-auto lg:[clip-path:inset(0_0_50%_0)]`} />
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <ul className="grid grid-cols-3 gap-4 sm:gap-6">
              {stats.map((stat) => (
                <li key={stat.label} className="min-w-0">
                  <span className="block font-[family-name:var(--font-inter-tight)] text-4xl font-semibold leading-none tracking-[-0.04em] text-white sm:text-5xl">
                    {stat.value}
                  </span>
                  <span className={`${landingStyles.note} mt-2 block`}>{stat.label}</span>
                </li>
              ))}
            </ul>

            <ul className="mt-7 grid gap-y-3 border-t border-zinc-800 pt-7">
              {LIST_ITEMS.map((i) => features[i]).filter(Boolean).map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-base leading-normal text-zinc-200">
                  <Check className="mt-1 size-4 shrink-0 text-[#ff6f00]" aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center text-xs leading-relaxed text-zinc-400 sm:text-sm">
          <span className="inline-flex items-center gap-1.5">
            <Zap className="size-3.5 text-[#ff6f00]" aria-hidden="true" />
            {t("deliveryTime")}
          </span>
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="size-4 shrink-0 text-[#ff6f00]" aria-hidden="true" />
            {t("secure")}
            <Image src="/dodo-logo.png" alt="Dodo Payments" width={96} height={24} className="h-auto w-20" />
          </span>
        </div>
      </div>
    </LandingSection>
  );
}
