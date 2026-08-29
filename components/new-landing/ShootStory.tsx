"use client";

import Image from "next/image";
import { motion } from "motion/react";

const facts = [
  { label: "15 shoots", color: "#f7b733", symbol: "✣", borderStyle: "border-dashed", borderColor: "border-black" },
  { label: "4 frames each", color: "#25a882", symbol: "◎", borderStyle: "border-solid", borderColor: "border-black" },
  { label: "60 photos", color: "#ec2578", symbol: "✦", light: true, borderStyle: "border-solid", borderColor: "border-white" },
  { label: "30 re-shoots", color: "#45c4f9", symbol: "↻", borderStyle: "border-solid", borderColor: "border-white" },
];

export function ShootStory() {
  return (
    <section id="why" className="relative scroll-mt-10 overflow-hidden px-4 py-20 sm:px-6 lg:py-32 bg-[#fafafa]">
      {/* Grid Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      <div className="relative z-10 mx-auto max-w-[1400px] flex flex-col items-center">
        {/* Top Badge */}
        <div className="relative mx-auto w-fit border border-black bg-white px-3 py-1">
          <span className="absolute -left-1 -top-1 h-1.5 w-1.5 border border-black bg-white" />
          <span className="absolute -right-1 -top-1 h-1.5 w-1.5 border border-black bg-white" />
          <span className="absolute -bottom-1 -left-1 h-1.5 w-1.5 border border-black bg-white" />
          <span className="absolute -bottom-1 -right-1 h-1.5 w-1.5 border border-black bg-white" />
          <p className="font-inter text-sm tracking-tight text-black">why the shoot is the product</p>
        </div>

        {/* Floating handwritten note */}
        <div className="absolute top-12 left-[10%] md:left-[22%] -rotate-[15deg] hidden sm:block">
           <span className="font-serif italic text-xl text-black/80">here's the difference</span>
        </div>

        <div className="relative mt-20 w-full flex flex-col items-center justify-center min-h-[400px]">
          
          <div className="relative z-10 mx-auto max-w-[1000px] px-4 text-center leading-tight">
            <h2 className="font-inter text-[clamp(2.8rem,5.5vw,5rem)] font-medium leading-[1.05] tracking-[-0.03em] text-black text-balance">
              Sixty unrelated photos look generated. <span className="text-[#25a882]">A few real days look like you.</span>
            </h2>
            <p className="mx-auto mt-8 max-w-[700px] text-[17px] leading-relaxed text-black/70 sm:text-[19px] font-inter text-pretty">
              So UnrealShot does not assemble every image from random pieces. Each shoot is written as a whole, and every frame is generated against the first. Same scene. Same outfit. Same light. Four genuinely different photographs.
            </p>
          </div>

          {/* Polaroids - positioned out wide */}
          <motion.div
            initial={{ opacity: 0, rotate: -25, x: -60 }}
            whileInView={{ opacity: 1, rotate: -6, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="absolute left-0 md:left-4 xl:left-12 top-4 hidden w-[190px] bg-white p-2.5 pb-12 shadow-[0_8px_30px_rgb(0,0,0,0.12)] md:block lg:w-[230px] z-20"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image src="/new-landing/training-floor-morning-2.png" alt="Second frame" fill className="object-cover" sizes="230px" />
            </div>
            <span className="absolute bottom-2.5 left-0 w-full text-center font-serif text-[1.1rem] italic text-black/90">same morning</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, rotate: 25, x: 60 }}
            whileInView={{ opacity: 1, rotate: 8, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="absolute right-0 md:right-4 xl:right-12 top-20 hidden w-[190px] bg-white p-2.5 pb-12 shadow-[0_8px_30px_rgb(0,0,0,0.12)] md:block lg:w-[230px] z-20"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image src="/new-landing/training-floor-morning-1.png" alt="Full-length frame" fill className="object-cover" sizes="230px" />
            </div>
            <span className="absolute bottom-2.5 left-0 w-full text-center font-serif text-[1.1rem] italic text-black/90">same clothes</span>
          </motion.div>
        </div>

        {/* Facts Tags */}
        <div className="mt-20 flex flex-col items-center gap-3 relative z-10">
          <div className="flex flex-wrap justify-center gap-3">
            {facts.slice(0, 2).map((fact, index) => (
              <motion.div
                key={fact.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="flex shadow-sm"
              >
                <span
                  className={`flex h-11 sm:h-12 items-center px-4 sm:px-5 font-inter text-[15px] sm:text-[17px] font-medium tracking-tight ${fact.light ? "text-white" : "text-black"}`}
                  style={{ backgroundColor: fact.color }}
                >
                  {fact.label}
                </span>
                <span className={`grid h-11 sm:h-12 w-11 sm:w-12 place-items-center border-l-2 ${fact.borderStyle} ${fact.borderColor} text-xl sm:text-2xl ${fact.light ? "text-white" : "text-black"}`} style={{ backgroundColor: fact.color }}>
                  {fact.symbol}
                </span>
              </motion.div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {facts.slice(2, 4).map((fact, index) => (
              <motion.div
                key={fact.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index + 2) * 0.08 }}
                className="flex shadow-sm"
              >
                <span
                  className={`flex h-11 sm:h-12 items-center px-4 sm:px-5 font-inter text-[15px] sm:text-[17px] font-medium tracking-tight ${fact.light ? "text-white" : "text-black"}`}
                  style={{ backgroundColor: fact.color }}
                >
                  {fact.label}
                </span>
                <span className={`grid h-11 sm:h-12 w-11 sm:w-12 place-items-center border-l-2 ${fact.borderStyle} ${fact.borderColor} text-xl sm:text-2xl ${fact.light ? "text-white" : "text-black"}`} style={{ backgroundColor: fact.color }}>
                  {fact.symbol}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

