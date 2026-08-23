"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

function SelectionHandle({ className }: { className: string }) {
  return <span className={`absolute h-3 w-3 border border-black bg-[#45c4f9] ${className}`} />;
}

export function LandingHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-12 sm:px-6 sm:pt-16 lg:pb-32 lg:pt-20">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center">
        <div className="mb-3 flex flex-col items-center">
          <span className="font-serif text-2xl italic tracking-tight text-black sm:text-3xl">your profile, finished</span>
          <svg aria-hidden="true" width="158" height="8" viewBox="0 0 158 8" fill="none" className="mt-[-2px] text-black">
            <path d="M2 5C39 1 114 1 156 4" stroke="currentColor" strokeWidth="1.2" />
            <path d="M21 7C63 4 106 4 137 6" stroke="currentColor" strokeWidth="0.8" />
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative border-2 border-[#45c4f9] bg-white/80 px-3 py-2 backdrop-blur-sm sm:px-5 lg:px-7"
        >
          <SelectionHandle className="-left-1.5 -top-1.5" />
          <SelectionHandle className="-right-1.5 -top-1.5" />
          <SelectionHandle className="-bottom-1.5 -left-1.5" />
          <SelectionHandle className="-bottom-1.5 -right-1.5" />
          <h1 className="text-center font-[family-name:var(--font-space-grotesk)] text-[clamp(3.05rem,10vw,8.5rem)] font-black uppercase leading-[0.82] tracking-[-0.085em] text-black">
            UnrealShot
          </h1>
        </motion.div>

        <div className="mt-5 flex items-center gap-2 font-mono text-[9px] font-bold tracking-[0.15em] text-black sm:text-[10px]">
          <span className="h-3 w-3 rounded-full border border-black/10 bg-[#25a882]" />
          15 SHOOTS · 60 PHOTOS · ONE FINISHED DATING PROFILE
        </div>

        <div className="mt-10 grid w-full items-center gap-10 lg:mt-14 lg:grid-cols-[minmax(0,0.86fr)_minmax(500px,1.14fr)] lg:gap-16">
          <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
            <p className="font-[family-name:var(--font-space-grotesk)] text-[clamp(2rem,4vw,4.2rem)] font-medium leading-[0.98] tracking-[-0.055em] text-black">
              Your camera roll should look like a life, <span className="text-[#ec2578]">not a stock library.</span>
            </p>
            <p className="mx-auto mt-6 max-w-lg text-[15px] leading-7 text-black/62 lg:mx-0 lg:text-[17px]">
              We build fifteen coherent photoshoots from 4–6 selfies. Four frames from each. Different places, outfits, and light—without turning you into a different person in every photo.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
              <Link
                href="/login"
                className="group flex h-[56px] w-full items-center bg-black pr-5 font-mono text-[11px] font-bold tracking-[0.12em] text-white shadow-[6px_6px_0_#ec2578] transition-transform hover:-translate-y-1 sm:w-auto"
              >
                <span className="mr-5 grid h-[56px] w-[56px] place-items-center bg-[#45c4f9] text-xl text-black transition-colors group-hover:bg-[#f7b733]">↗</span>
                BUILD MY PROFILE — $39
              </Link>
              <a
                href="#shoots"
                className="flex h-[56px] w-full items-center justify-center border border-black px-5 font-mono text-[10px] font-bold tracking-[0.12em] text-black transition-colors hover:bg-[#f7b733] sm:w-auto"
              >
                SEE THE SYSTEM ↓
              </a>
            </div>
            <p className="mt-5 font-mono text-[9px] font-semibold tracking-[0.12em] text-black/38">
              ONE-TIME PURCHASE · 30 RE-SHOOTS INCLUDED
            </p>
          </div>

          <div className="relative mx-auto h-[470px] w-full max-w-[680px] sm:h-[580px]">
            <motion.div
              initial={{ opacity: 0, rotate: -13, x: -40 }}
              animate={{ opacity: 1, rotate: -7, x: 0 }}
              transition={{ delay: 0.2, duration: 0.65 }}
              className="absolute left-[2%] top-[8%] z-10 w-[38%] border border-black/10 bg-white p-2 pb-10 shadow-[0_22px_60px_rgba(0,0,0,0.16)] sm:p-3 sm:pb-12"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#ececec]">
                <Image src="/new-landing/training-floor-morning-1.png" alt="UnrealShot full-length gym shoot frame" fill priority className="object-cover" sizes="(max-width: 768px) 40vw, 260px" />
              </div>
              <span className="absolute bottom-2 left-0 w-full text-center font-serif text-base italic text-black sm:text-xl">full length</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7 }}
              className="absolute left-[28%] top-0 z-20 w-[43%] border border-black/10 bg-white p-2 pb-11 shadow-[0_24px_70px_rgba(0,0,0,0.18)] sm:p-3 sm:pb-12"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#ececec]">
                <Image src="/new-landing/29ecda7f13764ee595abe3c9be049ddb.jpg" alt="UnrealShot dating profile opener" fill priority className="object-cover" sizes="(max-width: 768px) 45vw, 300px" />
                <span className="absolute right-2 top-2 bg-white px-2 py-1 font-mono text-[8px] font-bold tracking-[0.1em] text-black">OPENER.JPG</span>
              </div>
              <span className="absolute bottom-2 left-0 w-full text-center font-serif text-base italic text-black sm:text-xl">your opener</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, rotate: 14, x: 40 }}
              animate={{ opacity: 1, rotate: 8, x: 0 }}
              transition={{ delay: 0.3, duration: 0.65 }}
              className="absolute right-[1%] top-[14%] z-10 w-[37%] border border-black/10 bg-white p-2 pb-10 shadow-[0_22px_60px_rgba(0,0,0,0.16)] sm:p-3 sm:pb-12"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#ececec]">
                <Image src="/new-landing/mountain-layby-motorcycle_2.png" alt="UnrealShot candid activity shoot frame" fill className="object-cover" sizes="(max-width: 768px) 40vw, 260px" />
              </div>
              <span className="absolute bottom-2 left-0 w-full text-center font-serif text-base italic text-black sm:text-xl">what you do</span>
            </motion.div>

            <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center">
              <span className="h-4 w-4 rounded-full border-2 border-white bg-black shadow" />
              <span className="-ml-1 mt-5 rounded-full bg-black px-2 py-1 font-mono text-[8px] font-bold tracking-[0.1em] text-white">YOU</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

