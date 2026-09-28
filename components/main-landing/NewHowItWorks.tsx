"use client"

import Image from "next/image"
import { UploadCloud } from "lucide-react"
import Carousal from "@/components/Carousal"
import { useTranslations } from "next-intl"
import { FilmPlayer, type FilmCopy } from "@/components/main-landing/FilmPlayer"
import typography from "./landing-system.module.css"

// Using your specific image requests
const leftInputImages = ["/landing/selfie-a1.webp", "/landing/selfie-a2.webp", "/landing/selfie-a3.webp"];
const rightInputImages = ["/landing/selfie-b1.webp", "/landing/selfie-b2.webp", "/landing/selfie-b3.webp"];
// Strategically curated Step 3 results from authentic generated shoots
// Row 1: High-impact openers and stylish half-body portraits
const resultsRow1 = [
  "/pages/outdoor_coffee_closeup.webp",
  "/pages/dating_gym_photo.webp",
  "/pages/city_walk_closeup.webp",
  "/pages/dinner_closeup.webp",
  "/pages/coastal_walk_closeup.webp",
  "/pages/kitchen_shot_cooking.webp",
  "/pages/rooftop3.webp",
  "/pages/hinge_closeup.webp",
  "/pages/tinder_closeup.webp",
  "/pages/dating_photos_hero_closeup.webp",
  "/pages/outdoor_coffee_half_body.webp",
  "/pages/dating_gym_photo2.webp",
  "/pages/city_walk_candid.webp",
  "/pages/dinner_candid_half_body.webp",
  "/pages/rooftop2.webp",
  "/pages/kitchen_shot_chopping.webp",
  "/pages/coastal_walk_mid_action.webp",
  "/pages/hinge_half_body.webp",
];

// Row 2: Full-length body context and candid expressions with natural movement
const resultsRow2 = [
  "/pages/city_walk_mid_action.webp",
  "/pages/outdoor_coffee_full_body.webp",
  "/pages/dating_gym_photo3.webp",
  "/pages/dinner_candid_full_body.webp",
  "/pages/coastal_walks_full_body.webp",
  "/pages/kitchen_shot_moving_out.webp",
  "/pages/rooftop4.webp",
  "/pages/hinge_full_body.webp",
  "/pages/tinder_full_body.webp",
  "/pages/city_walk_looking_back.webp",
  "/pages/outdoor_coffee_expression.webp",
  "/pages/dating_gym_photo4.webp",
  "/pages/dinner_candid_expression.webp",
  "/pages/coastal_walk_candid.webp",
  "/pages/kitchen_shot_food_testing.webp",
  "/pages/rooftop.webp",
  "/pages/hinge_expression.webp",
  "/pages/tinder_expression_shoot.webp",
];

export default function HowItWorksShowcase() {
  const t = useTranslations("Home.howItWorks")
  const hero = useTranslations("Home.hero")

  return (
    <section id="how-it-works" className="relative mx-auto py-16 sm:py-24 overflow-hidden bg-[#F7F5F3]">
      <div className="px-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <p className="mb-4 block text-xs font-semibold uppercase leading-none tracking-[0.12em] text-[#ff6f00]">
            {t("eyebrow")}
          </p>
          <h2 className={`${typography.title} max-w-4xl mx-auto mb-4 text-[#18181b]`}>
            {t("title")} <span className="text-[#ff6f00]">{t("titleAccent")}</span>
          </h2>
          <p className="mx-auto max-w-[38rem] text-center text-base leading-normal text-[#5f5f66] sm:text-lg">
            {t("description")}
          </p>
        </div>

        {/* The Linear, Step-by-Step Flow */}
        <div className="flex flex-col justify-center items-center">

          {/* --- STEP 1: UPLOAD --- */}
          <div className="relative flex flex-col items-center">
            {/* Circle with gradient and number */}
            <div className="bg-gradient-to-l from-[#ff6f00] to-orange-400 text-white rounded-full h-12 w-12 flex items-center justify-center font-semibold z-10">
              1
            </div>
            {/* Gradient stroke line with fade out at the end */}
            <div className="w-1 h-10 rounded-lg bg-gradient-to-b from-[#ff6f00] to-transparent mt-[-2px]"></div>
          </div>

          {/* Text element */}
          <h3 className={`${typography.h3} text-center mt-2 mb-3`}>
            {t("step1Title")}
          </h3>
          <p className="mx-auto max-w-[38rem] text-center text-base leading-normal text-[#5f5f66] sm:text-lg">
            {t("step1Description")}
          </p>

          {/* Graphic element */}
          <div className="px-2 min-w-fit flex justify-center items-center mt-8">
            <div className="flex flex-row items-center">
              {/* Row with images on left, center, and right */}
              <div className="flex justify-between w-full max-w-7xl">
                {/* Left side - the first person's three reference photos (also listed in the phone) */}
                <div className="flex items-center justify-center">
                  <div className="hidden lg:flex gap-6">
                    <div className="w-[105px] h-[140px] rounded-2xl shadow-custom-shadow overflow-hidden">
                      <Image
                        src={leftInputImages[0]}
                        width={105}
                        height={140}
                        className="w-full h-full object-cover"
                        alt={t("inputImageAlt", { index: 1 })}
                      />
                    </div>
                    <div className="w-[105px] h-[140px] rounded-2xl shadow-custom-shadow overflow-hidden">
                      <Image
                        src={leftInputImages[1]}
                        width={105}
                        height={140}
                        className="w-full h-full object-cover"
                        alt={t("inputImageAlt", { index: 2 })}
                      />
                    </div>
                    <div className="w-[105px] h-[140px] rounded-2xl shadow-custom-shadow overflow-hidden">
                      <Image
                        src={leftInputImages[2]}
                        width={105}
                        height={140}
                        className="w-full h-full object-cover"
                        alt={t("inputImageAlt", { index: 3 })}
                      />
                    </div>
                  </div>
                </div>

                {/* Center image - Phone mockup */}
                <div className="relative mx-8 w-[250px] h-[480px]">
                  {/* Phone frame */}
                  <div className="w-full h-full bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
                    <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                      {/* Upload interface mockup */}
                      <div className="absolute inset-0 flex flex-col p-4 bg-white">
                        {/* Header */}
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 mt-4">{t("trainingImages")}</h3>


                        {/* Upload area - smaller since we have file list */}
                        <div className="border border-dashed border-[#ff6f00]/50 rounded-lg p-3 mb-4 bg-gray-50/50">
                          <div className="flex flex-col items-center text-center">
                            <div className="w-8 h-8 bg-[#ff6f00]/30 rounded-full flex items-center justify-center mb-2">
                              <UploadCloud className="w-4 h-4 text-gray-500" />
                            </div>
                            <p className="text-xs font-medium text-gray-700 mb-1">{t("dropImages")}</p>
                            <p className="text-xs text-gray-500">{t("fileTypes")}</p>
                          </div>
                        </div>

                        {/* File list - realistic display like TrainModelZone */}
                        <div className="space-y-2 flex-1 overflow-y-auto">
                          {leftInputImages.map((src, i) => (
                            <div key={i} className="bg-white flex items-center justify-between gap-2 rounded-lg border border-gray-200 p-2">
                              <div className="flex items-center gap-2 overflow-hidden">
                                <div className="bg-gray-100 aspect-square shrink-0 rounded w-8 h-8">
                                  <Image
                                    src={src}
                                    alt={t("inputImageAlt", { index: i + 1 })}
                                    width={32}
                                    height={32}
                                    className="w-full h-full rounded object-cover"
                                  />
                                </div>
                                <div className="flex min-w-0 flex-col">
                                  <p className="truncate text-xs font-medium text-gray-900">
                                    IMG_000{i + 1}.jpg
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    2.{i + 1}MB
                                  </p>
                                </div>
                              </div>
                              <div className="w-4 h-4 text-gray-400">
                                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Footer info */}
                        <div className="mt-3 pt-2 border-t border-gray-100">
                          <p className="text-xs text-gray-500 text-center">
                            {t("selected")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Right side - a second person's three reference photos */}
                <div className="flex items-center justify-center">
                  <div className="hidden lg:flex gap-6">
                    <div className="w-[105px] h-[140px] rounded-2xl shadow-custom-shadow overflow-hidden">
                      <Image
                        src={rightInputImages[0]}
                        width={105}
                        height={140}
                        className="w-full h-full object-cover"
                        alt={t("inputImageAlt", { index: 4 })}
                      />
                    </div>
                    <div className="w-[105px] h-[140px] rounded-2xl shadow-custom-shadow overflow-hidden">
                      <Image
                        src={rightInputImages[1]}
                        width={105}
                        height={140}
                        className="w-full h-full object-cover"
                        alt={t("inputImageAlt", { index: 5 })}
                      />
                    </div>
                    <div className="w-[105px] h-[140px] rounded-2xl shadow-custom-shadow overflow-hidden">
                      <Image
                        src={rightInputImages[2]}
                        width={105}
                        height={140}
                        className="w-full h-full object-cover"
                        alt={t("inputImageAlt", { index: 6 })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- STEP 2: AI MAGIC --- */}
          {/* Circle element */}
          <div className="relative flex flex-col items-center mt-8">
            {/* Circle with gradient and number */}
            <div className="bg-gradient-to-l from-slate-700 to-[#ff6f00] text-white rounded-full h-12 w-12 flex items-center justify-center font-semibold z-10">
              2
            </div>
            {/* Gradient stroke line with fade out at the end */}
            <div className="mt-[-75px] w-1 h-28 rounded-lg bg-gradient-to-b from-transparent via-[#ff6f00] to-transparent bg-[length:100%_100%]"></div>
          </div>

          {/* Text element */}
          <h3 className={`${typography.h3} text-center mt-2 mb-3`}>
            {t("step2Title")}
          </h3>
          <p className="mx-auto max-w-[38rem] text-center text-base leading-normal text-[#5f5f66] sm:text-lg">
            {t("step2Description")}
          </p>


          {/* Step 2 film: the mascot walks through the process */}
          <FilmPlayer
            className="mt-10 w-[95%] max-w-[1050px]"
            copy={{
              label: t("video.label"),
              watch: t("video.watch"),
              meta: t("video.meta"),
              play: t("video.play"),
              chapters: t.raw("video.chapters") as FilmCopy["chapters"],
            }}
            sources={{ desktop: "/videos/how-it-works-film-1080.mp4", mobile: "/videos/how-it-works-film-720.mp4" }}
            poster="/videos/how-it-works-film-poster.webp"
            chapterStarts={[0, 5.85, 10.32, 13.1, 17.32, 22.18, 24.92]}
            fallbackDuration={27.82}
            ctaLabel={hero("primaryCta")}
          />

          {/* --- STEP 3: GET RESULTS --- */}
          {/* Circle element */}
          <div className="relative flex flex-col items-center mt-16">
            {/* Circle with gradient and number */}
            <div className="bg-gradient-to-l from-black to-slate-100 text-white rounded-full h-12 w-12 flex items-center justify-center font-semibold z-10">
              3
            </div>
            {/* Gradient stroke line with fade out at the end */}
            <div className="mt-[-90px] w-1 h-14 rounded-lg bg-gradient-to-b from-transparent to-black"></div>
          </div>

          {/* Text element */}
          <h3 className={`${typography.h3} text-center mt-10 mb-3`}>
            {t("step3Title")}
          </h3>
          <p className="mx-auto max-w-[38rem] text-center text-base leading-normal text-[#5f5f66] sm:text-lg">
            {t("step3Description")}
          </p>
          <div className="animate-fadeIn container mx-auto pt-10">
            <Carousal images={resultsRow1} imageAlt={t("resultsAlt")} overlayLabel={t("generated")} />
            <Carousal images={resultsRow2} reverse={true} imageAlt={t("resultsAlt")} overlayLabel={t("generated")} />
          </div>
          <div className="mt-2 flex justify-center px-10 text-center text-sm leading-normal text-[#5f5f66]">
            {t("resultCaption")}
          </div>
        </div>
      </div>
    </section>
  )
}
