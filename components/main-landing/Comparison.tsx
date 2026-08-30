"use client"

import type React from "react"
import { XCircle, CheckCircle } from "lucide-react"
import { useTranslations } from "next-intl"

export default function TheVerdictFinal() {
  const t = useTranslations("Home.comparison");
  const traditionalPainPoints = t.raw("randomPoints") as string[];
  const unrealshotSolutions = t.raw("solutions") as string[];

  return (
    <section className="relative mx-auto py-16 sm:py-24 overflow-hidden bg-[#F7F5F3]">
      <div className="px-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl max-w-5xl mx-auto font-bold mb-4 font-[var(--font-inter-tight)] tracking-tight leading-[1.08] text-gray-900">
            {t("title")} <span className="text-[#ff6f00]">{t("titleAccent")}</span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t("description")}
          </p>
        </div>

        {/* --- The Definitive Comparison Card with Nested Dashed Borders --- */}
        <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 shadow-2xl shadow-gray-200/60 p-2 sm:p-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-stretch">
            {/* --- Left Pane: The Pain --- */}
            <div className="p-4 sm:p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl text-center font-bold text-gray-500 mb-6">
                  {t("randomTitle")}
                </h3>
                <div className="p-4 sm:p-6 border border-dashed border-gray-300 rounded-2xl bg-gray-50/50">
                  <ul className="space-y-3.5">
                    {traditionalPainPoints.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 text-sm sm:text-base font-medium leading-snug">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-1">
                      {t("outcomeLabel")}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-700">
                      {t("randomOutcome")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Right Pane: The Solution --- */}
            <div className="p-4 sm:p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-center text-xl font-bold text-[#ff6f00] mb-6">
                  {t("unrealshotTitle")}
                </h3>
                <div className="p-4 sm:p-6 bg-zinc-950 border border-dashed border-zinc-700 rounded-2xl shadow-xl">
                  <ul className="space-y-3.5">
                    {unrealshotSolutions.map((solution) => (
                      <li key={solution} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-zinc-200 text-sm sm:text-base font-medium leading-snug">
                          {solution}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 pt-6 border-t border-zinc-800">
                    <p className="text-xs font-mono uppercase tracking-wider text-[#ff6f00] mb-1">
                      {t("outcomeLabel")}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-white">
                      {t("unrealshotOutcome")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
