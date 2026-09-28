"use client"

import { useTranslations } from "next-intl"
import { FilmPlayer, type FilmCopy } from "@/components/main-landing/FilmPlayer"

export function HeroVideoPlayer() {
  const t = useTranslations("Home.hero.video")
  const hero = useTranslations("Home.hero")

  return (
    <FilmPlayer
      className="mt-14 max-w-5xl sm:mt-16"
      copy={{ label: t("label"), watch: t("watch"), meta: t("meta"), play: t("play"), chapters: t.raw("chapters") as FilmCopy["chapters"] }}
      sources={{ desktop: "/videos/unrealshot-film-1080.mp4", mobile: "/videos/unrealshot-film-720.mp4" }}
      poster="/videos/unrealshot-film-poster.webp"
      chapterStarts={[0, 5.75, 14.75, 19.75, 22.75, 28.75, 35.25, 41.5, 45.25]}
      fallbackDuration={49.75}
      ctaLabel={hero("primaryCta")}
      ambient
      previewLoop={[0, 5.7]}
      tabsLabel={t("tabsLabel")}
      tabs={(t.raw("tabs") as string[]).map((label, i) => ({ label, start: [0, 19.75, 22.75, 28.75, 35.25, 41.5][i] }))}
    />
  )
}
