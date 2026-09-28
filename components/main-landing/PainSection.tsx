"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { LandingCta, LandingHeading, LandingSection, landingStyles } from "./LandingSection";

// The camera roll we're replacing: one real "before" photo per point, in the same order as Home.pain.cards.
const EVIDENCE = [
  { src: "/landing/problem-blurry.webp", file: "IMG_2019.JPG" }, //  you look better in person
  { src: "/landing/problem-far.webp", file: "IMG_0847.JPG" }, //     nobody takes good photos of you
  { src: "/landing/problem-flash.webp", file: "IMG_1123.JPG" }, //   your photos say nothing about your life
];

export function PainSection() {
  const t = useTranslations("Home.pain");
  const points = t.raw("cards") as Array<{ title: string; description: string }>;

  return (
    <LandingSection>
      <LandingHeading eyebrow={t("eyebrow")} title={t("title")} accent={t("titleAccent")} description={t("description")} />

      {/* Phones: photo beside text in compact rows. Desktop: three columns, photo above text. */}
      <ul className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3 md:gap-8">
        {points.map((point, i) => (
          <li key={point.title} className="flex items-start gap-5 md:block">
            <div className="relative aspect-[4/5] w-28 shrink-0 overflow-hidden rounded-xl bg-zinc-200 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_12px_28px_-14px_rgba(0,0,0,0.35)] sm:w-32 md:w-full md:rounded-2xl">
              <Image
                src={EVIDENCE[i].src}
                alt=""
                fill
                sizes="(min-width: 768px) 300px, 128px"
                className="object-cover saturate-[.85]"
              />
              <span className="absolute bottom-2 left-2 rounded-md bg-black/55 px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-wide text-white/90 backdrop-blur-sm md:bottom-3 md:left-3 md:text-[11px]">
                {EVIDENCE[i].file}
              </span>
            </div>
            <div className="min-w-0 pt-1 md:pt-6">
              <h3 className={landingStyles.h3}>{point.title}</h3>
              <p className={`${landingStyles.body} mt-2`}>{point.description}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-14 flex flex-col items-center gap-6 sm:mt-16">
        <p className={landingStyles.statement}>{t("note")}</p>
        <LandingCta>{t("cta")}</LandingCta>
      </div>
    </LandingSection>
  );
}
