"use client"

import type React from "react"
import { XCircle, CheckCircle } from "lucide-react"

export default function TheVerdictFinal() {

  const traditionalPainPoints = [
    "Different face from photo to photo",
    "Random outfits and locations",
    "Every image looks staged",
    "No connection between shots",
    "Hundreds of pictures to dig through",
  ];

  const unrealshotSolutions = [
    "One identity across the set",
    "4 photos from the same shoot",
    "Same clothes, place and lighting",
    "Different framing and natural moments",
    "15 shoots designed to build one profile",
  ];

  return (
    <section className="relative mx-auto py-16 sm:py-24 overflow-hidden bg-[#F7F5F3]">
      <div className="px-4 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="leading-tight text-4xl sm:text-5xl md:text-6xl max-w-4xl mx-auto font-bold mb-4 font-[var(--font-inter-tight)] text-gray-900">
            60 random AI pictures still look like <span className="text-[#ff6f00]">60 random AI pictures.</span>
          </h2>
        
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Because your camera roll shouldn&apos;t look like you lived 60 different lives in one afternoon.
          </p>
        </div>

        {/* --- The Definitive Comparison Card with Nested Dashed Borders --- */}
        <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 shadow-2xl shadow-gray-200/60 p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
<div className="p-4 sm:p-6">
                <h3 className="text-xl text-center font-bold text-gray-500 mb-6">Most AI Photo Generators</h3>

            {/* --- Left Pane: The Pain --- */}
            <div className="p-4 sm:p-6 border border-dashed border-gray-300 rounded-2xl">
              <ul className="space-y-3">
                {traditionalPainPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 font-medium">{point}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-400 mb-1">THE OUTCOME</p>
                <p className="text-2xl font-bold text-gray-500">Folder of Unrelated Pics</p>
              </div>
            </div>
</div>
<div className="p-4 sm:p-6 ">
                 <h3 className="text-center text-xl font-bold text-[#ff6f00] mb-6">UnrealShot</h3>

            {/* --- Right Pane: The Solution --- */}
            <div className="p-4 sm:p-6 bg-black border border-dashed border-gray-700 rounded-2xl">
               <ul className="space-y-3">
                {unrealshotSolutions.map((solution) => (
                  <li key={solution} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-200 font-medium">{solution}</span>
                  </li>
                ))}
              </ul>
               <div className="mt-8 pt-6 border-t border-gray-700">
                <p className="text-sm font-medium text-[#ff6f00]/80 mb-1">THE OUTCOME</p>
                <p className="text-2xl font-bold text-white">15 Coherent Shoots (60 Photos)</p>
              </div>
            </div>
</div>
          </div>
        </div>
      </div>
    </section>
  );
}