"use client";

import Image from "next/image";
import { motion } from "motion/react";

const facts = [
  { label: "15 shoots", color: "#f7b733", symbol: "✣" },
  { label: "4 frames each", color: "#25a882", symbol: "◎" },
  { label: "60 photos", color: "#ec2578", symbol: "✦", light: true },
  { label: "30 re-shoots", color: "#45c4f9", symbol: "↻" },
];

export function ShootStory() {
  return (
    <section id="why" className="relative scroll-mt-10 overflow-hidden px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-[1240px]">
        <div className="relative mx-auto w-fit border border-black bg-white px-4 py-2">
          <span className="absolute -left-1 -top-1 h-2 w-2 border border-black bg-white" />
          <span className="absolute -right-1 -top-1 h-2 w-2 border border-black bg-white" />
          <span className="absolute -bottom-1 -left-1 h-2 w-2 border border-black bg-white" />
          <span className="absolute -bottom-1 -right-1 h-2 w-2 border border-black bg-white" />
          <p className="font-mono text-[10px] font-bold tracking-[0.15em] text-black">WHY THE SHOOT IS THE PRODUCT</p>
        </div>

        <div className="relative mt-14 flex min-h-[360px] items-center justify-center lg:min-h-[480px]">
          <motion.div
            initial={{ opacity: 0, rotate: -15, x: -60 }}
            whileInView={{ opacity: 1, rotate: -9, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="absolute left-0 top-12 hidden w-[210px] border border-black/10 bg-white p-3 pb-12 shadow-[0_18px_50px_rgba(0,0,0,0.14)] md:block lg:left-8 lg:w-[235px]"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image src="/new-landing/training-floor-morning-2.png" alt="Second frame from one coherent UnrealShot gym shoot" fill className="object-cover" sizes="235px" />
            </div>
            <span className="absolute bottom-3 left-0 w-full text-center font-serif text-xl italic">same morning</span>
          </motion.div>

          <div className="relative z-10 mx-auto max-w-[840px] px-2 text-center md:px-28 lg:px-24">
            <span className="mb-5 inline-block font-serif text-2xl italic text-black">here&apos;s the difference</span>
            <h2 className="font-oxanium text-[clamp(2.4rem,6vw,5.8rem)] font-medium leading-[0.98] tracking-[-0.065em] text-black">
              Sixty unrelated photos look generated. <span className="text-[#25a882]">A few real days look like you.</span>
            </h2>
            <p className="mx-auto mt-7 max-w-2xl text-[15px] leading-7 text-black/58 sm:text-[17px]">
              So UnrealShot does not assemble every image from random pieces. Each shoot is written as a whole, and every frame is generated against the first. Same scene. Same outfit. Same light. Four genuinely different photographs.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, rotate: 15, x: 60 }}
            whileInView={{ opacity: 1, rotate: 9, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="absolute right-0 top-20 hidden w-[210px] border border-black/10 bg-white p-3 pb-12 shadow-[0_18px_50px_rgba(0,0,0,0.14)] md:block lg:right-8 lg:w-[235px]"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image src="/new-landing/training-floor-morning-1.png" alt="Full-length frame from the same coherent UnrealShot gym shoot" fill className="object-cover" sizes="235px" />
            </div>
            <span className="absolute bottom-3 left-0 w-full text-center font-serif text-xl italic">same clothes</span>
          </motion.div>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-2 sm:gap-3">
          {facts.map((fact, index) => (
            <motion.div
              key={fact.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="flex h-12 items-center shadow-sm sm:h-14"
            >
              <span
                className={`flex h-full items-center px-4 font-oxanium text-lg font-semibold sm:px-5 sm:text-xl ${fact.light ? "text-white" : "text-black"}`}
                style={{ backgroundColor: fact.color }}
              >
                {fact.label}
              </span>
              <span className="grid h-full w-12 place-items-center border-l-2 border-dashed border-black text-xl text-black sm:w-14" style={{ backgroundColor: fact.color }}>
                {fact.symbol}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

