"use client"

import type React from "react"
import { XCircle, CheckCircle } from "lucide-react"

export default function TheVerdictFinal() {
  const traditionalPainPoints = [
    "Different version of you in every photo",
    "Random lifestyles you do not actually live",
    "Outfits that make no sense together",
    "Every image feels deliberately generated",
    "Too many polished portraits and not enough real moments",
    "Photos look like they came from different people, places and days",
    "Nothing gives someone a feel for what being around you is actually like",
    "You still have to figure out which six photos make a good profile",
    "Hundreds of images to sort through",
    "The final profile can still feel fake even when individual photos look good",
  ];

  const unrealshotSolutions = [
    "One recognizable version of you throughout",
    "Shoots based around things that actually fit your life",
    "4 photos from the same place, outfit and moment",
    "A mix of close-ups, full-body shots, candids and lifestyle photos",
    "Photos that look like someone was actually there taking them",
    "Different moods and situations without looking like different people",
    "Enough variety to show more than just your face",
    "Photos that naturally give people things to ask you about",
    "15 complete shoots instead of hundreds of unrelated generations",
    "Enough strong options to build a believable six-photo profile",
    "15 Photo Retakes if an individual image misses",
  ];

  return (
    <section className="relative mx-auto py-16 sm:py-24 overflow-hidden bg-[#F7F5F3]">
      <div className="px-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl max-w-5xl mx-auto font-bold mb-4 font-[var(--font-inter-tight)] tracking-tight leading-[1.08] text-gray-900">
            Good photos still need to <span className="text-[#ff6f00]">belong together.</span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            They should look like the same person, living the same life, across different real moments. Not like a stack of unrelated AI generations.
          </p>
        </div>

        {/* --- The Definitive Comparison Card with Nested Dashed Borders --- */}
        <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 shadow-2xl shadow-gray-200/60 p-2 sm:p-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-stretch">
            {/* --- Left Pane: The Pain --- */}
            <div className="p-4 sm:p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl text-center font-bold text-gray-500 mb-6">
                  Random AI Photo Packs
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
                      THE OUTCOME
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-700">
                      Looks like an AI folder.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Right Pane: The Solution --- */}
            <div className="p-4 sm:p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-center text-xl font-bold text-[#ff6f00] mb-6">
                  UnrealShot AI
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
                      THE OUTCOME
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-white">
                      Looks like your camera roll finally got good.
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