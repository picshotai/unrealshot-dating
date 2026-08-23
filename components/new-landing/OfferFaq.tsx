"use client";

import Link from "next/link";
import { useState } from "react";
import { landingFaq } from "./data";

export function OfferFaq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <>
      <section className="px-4 py-20 sm:px-6 lg:py-28">
        <div className="mx-auto grid max-w-[1240px] overflow-hidden border border-black bg-[#25a882] shadow-[12px_12px_0_#f7b733] lg:grid-cols-[1fr_0.9fr]">
          <div className="border-b border-black p-7 sm:p-10 lg:border-b-0 lg:border-r lg:p-14">
            <span className="inline-flex bg-black px-3 py-2 font-mono text-[9px] font-bold tracking-[0.13em] text-[#25a882]">THE COMPLETE PROFILE</span>
            <h2 className="mt-7 font-[family-name:var(--font-space-grotesk)] text-[clamp(3.2rem,7vw,7rem)] font-medium leading-[0.84] tracking-[-0.08em] text-black">
              15 shoots.<br />$39 once.
            </h2>
            <p className="mt-7 max-w-xl text-[15px] leading-7 text-black/65 sm:text-[17px]">
              Not credits to decipher. Not a monthly plan. One complete camera roll built for one finished dating profile.
            </p>
          </div>

          <div className="flex flex-col justify-between bg-white p-7 sm:p-10 lg:p-14">
            <div>
              <div className="flex items-end justify-between border-b border-black/15 pb-6">
                <span className="font-mono text-[10px] font-bold tracking-[0.13em] text-black/45">UNREALSHOT / DATING</span>
                <span className="font-[family-name:var(--font-space-grotesk)] text-6xl font-medium tracking-[-0.08em] text-black">$39</span>
              </div>
              <ul className="mt-7 space-y-4">
                {["15 different photoshoots", "60 photos in tall + wide crops", "4 frames from every shoot", "30 individual re-shoots", "Profile filters + ZIP download"].map((item, index) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-black sm:text-base">
                    <span className="grid h-6 w-6 place-items-center font-mono text-[9px] font-bold text-black" style={{ backgroundColor: ["#45c4f9", "#f7b733", "#ec2578", "#25a882", "#45c4f9"][index] }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/login" className="mt-10 flex h-16 items-center justify-between bg-black px-5 font-mono text-[11px] font-bold tracking-[0.12em] text-white transition-colors hover:bg-[#ec2578]">
              BUILD MY PROFILE <span className="text-xl">↗</span>
            </Link>
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-8 border-y border-black/10 bg-white px-4 py-20 sm:px-6 lg:py-28">
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
          <div>
            <span className="font-serif text-2xl italic text-black">the honest answers</span>
            <h2 className="mt-2 font-[family-name:var(--font-space-grotesk)] text-[clamp(3rem,6vw,6rem)] font-medium leading-[0.9] tracking-[-0.07em] text-black">Before you upload anything.</h2>
            <p className="mt-6 max-w-sm text-[15px] leading-7 text-black/55">No outcome promises. No “indistinguishable from real” theatre. Just what the system does and where the re-shoots help.</p>
          </div>

          <div className="border-t border-black">
            {landingFaq.map((item, index) => {
              const open = openIndex === index;
              return (
                <div key={item.question} className="border-b border-black">
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenIndex(open ? -1 : index)}
                    className="flex w-full items-start justify-between gap-6 py-6 text-left sm:py-7"
                  >
                    <span className="flex gap-4 sm:gap-6">
                      <span className="pt-1 font-mono text-[9px] font-bold tracking-[0.1em] text-black/35">0{index + 1}</span>
                      <span className="font-[family-name:var(--font-space-grotesk)] text-xl font-medium leading-tight tracking-[-0.035em] text-black sm:text-2xl">{item.question}</span>
                    </span>
                    <span className={`grid h-8 w-8 shrink-0 place-items-center border border-black font-mono text-lg transition-colors ${open ? "bg-[#f7b733]" : "bg-white"}`}>{open ? "−" : "+"}</span>
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <p className="max-w-2xl pb-7 pl-9 pr-12 text-sm leading-7 text-black/58 sm:pl-[54px] sm:text-[15px]">{item.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

