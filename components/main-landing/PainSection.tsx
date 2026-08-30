"use client";

import React from "react";

interface PainCard {
  num: string;
  tag: string;
  title: string;
  description: string;
  footnote: string;
}

const painCards: PainCard[] = [
  {
    num: "01",
    tag: "Mismatch",
    title: "You look better in person",
    description:
      "Your profile doesn't show what people actually see when they meet you.",
    footnote: "Bad lighting & stiff angles understate you",
  },
  {
    num: "02",
    tag: "Constraint",
    title: "Nobody takes good photos of you",
    description:
      "So you keep choosing from the same weak camera roll.",
    footnote: "Forced to reuse 2–3 year old pictures",
  },
  {
    num: "03",
    tag: "Context",
    title: "Your photos say nothing about your life",
    description:
      "A face alone gives someone very little reason to become curious.",
    footnote: "Zero conversation hooks or personality",
  },
];

export function PainSection() {
  return (
    <section
      id="the-problem"
      className="relative mx-auto py-20 sm:py-28 overflow-hidden bg-[#0D0D0E] text-white border-t border-b border-zinc-800/80"
    >
      {/* Background ambient lighting and grid pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 0%, rgba(255, 111, 0, 0.12) 0%, transparent 60%), linear-gradient(to right, rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.03) 1px, transparent 1px)`,
          backgroundSize: "100% 100%, 64px 64px, 64px 64px",
        }}
      />

      <div className="relative z-10 px-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ff6f00]/10 border border-[#ff6f00]/25 text-[#ff6f00] text-xs font-mono tracking-wider uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6f00] animate-pulse" />
            The Dating App Reality
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.14]">
            People aren&apos;t rejecting the version of you they&apos;d meet.{" "}
            <span className="text-[#ff6f00] block sm:inline">
              They&apos;re judging your photos first.
            </span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed">
            You can be funny, confident, interesting and look great in person. None
            of that matters if your profile is five bad selfies, an old group photo
            and the one picture of yourself you&apos;ve been recycling for three
            years.
          </p>
        </div>

        {/* 3 Simple Pain Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {painCards.map((card) => (
            <div
              key={card.num}
              className="relative rounded-2xl bg-zinc-900/80 border border-zinc-800/90 p-7 sm:p-8 flex flex-col justify-between hover:border-zinc-700 transition-all duration-300 group shadow-lg shadow-black/40"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono tracking-widest text-[#ff6f00] font-semibold">
                    {card.num}
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 bg-zinc-950/90 px-2.5 py-1 rounded-md border border-zinc-800">
                    {card.tag}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug group-hover:text-orange-100 transition-colors">
                  {card.title}
                </h3>

                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center gap-2 text-xs text-zinc-500 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400/80" />
                {card.footnote}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Psychological Punch */}
        <div className="mt-12 sm:mt-16 text-center max-w-3xl mx-auto">
          <div className="relative p-px rounded-2xl bg-gradient-to-r from-transparent via-[#ff6f00]/40 to-transparent">
            <div className="bg-zinc-950/90 border border-zinc-800 rounded-2xl px-6 sm:px-12 py-7 sm:py-8 backdrop-blur-md shadow-2xl">
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug">
                You don&apos;t need to become more attractive.{" "}
                <span className="text-[#ff6f00] block sm:inline">
                  You need better evidence.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
