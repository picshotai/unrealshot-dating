"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { shootCards } from "./data";

type ShootCard = (typeof shootCards)[number];

function ImageFrame({ card, priority = false }: { card: ShootCard; priority?: boolean }) {
  return (
    <div className="relative aspect-[3/4] w-full border border-white/30 bg-black lg:h-full lg:w-auto lg:max-w-full">
      <span className="absolute -left-1.5 -top-1.5 z-20 h-3 w-3 border border-black bg-white" />
      <span className="absolute -right-1.5 -top-1.5 z-20 h-3 w-3 border border-black bg-white" />
      <span className="absolute -bottom-1.5 -left-1.5 z-20 h-3 w-3 border border-black bg-white" />
      <span className="absolute -bottom-1.5 -right-1.5 z-20 h-3 w-3 border border-black bg-white" />
      <span className="absolute right-3 top-3 z-20 bg-white px-2 py-1 font-mono text-[9px] font-bold tracking-[0.12em] text-black">
        ◫ FRAME.JPG
      </span>
      <Image
        src={card.image}
        alt={card.title}
        fill
        priority={priority}
        className="object-cover object-center"
        sizes="(max-width: 1024px) 92vw, 650px"
      />
    </div>
  );
}

function CardContent({ card, index, mobile = false }: { card: ShootCard; index: number; mobile?: boolean }) {
  return (
    <div
      className={`relative flex h-full flex-col gap-7 p-6 sm:p-8 ${mobile ? "" : "lg:grid lg:grid-cols-12 lg:gap-10 lg:p-11"}`}
      style={{ backgroundColor: card.bg, color: card.ink }}
    >
      <div className={`${mobile ? "" : "lg:col-span-5"} flex min-w-0 flex-col justify-between`}>
        <div>
          <div className="mb-5 flex items-center gap-2.5 font-mono text-[10px] font-bold tracking-[0.13em] opacity-75 sm:text-[11px]">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: card.ink }} />
            {card.index} · UNREALSHOT SYSTEM
          </div>
          <h3 className="max-w-lg font-oxanium text-[clamp(2.25rem,4.5vw,4.25rem)] font-medium leading-[0.96] tracking-[-0.06em]">
            {card.title}
          </h3>
          <p className="mt-5 max-w-md text-[14px] leading-6 opacity-75 sm:text-base sm:leading-7">{card.copy}</p>
          <Link
            href="/login"
            className="mt-7 inline-flex border-b-2 pb-1 font-mono text-[10px] font-bold tracking-[0.13em] transition-opacity hover:opacity-60 sm:text-[11px]"
            style={{ borderColor: card.ink }}
          >
            START MY 15 SHOOTS ↗
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-2 lg:mt-auto">
          {card.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-2 font-mono text-[9px] font-bold tracking-[0.11em] sm:text-[10px]"
              style={{ backgroundColor: card.ink, color: card.bg }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className={`${mobile ? "" : "lg:col-span-7 lg:flex lg:items-center lg:justify-center"} min-h-0`}>
        <ImageFrame card={card} priority={!mobile && index === 0} />
      </div>

      {index === 3 && (
        <div className={`absolute ${mobile ? "right-4 top-1/2" : "left-[38%] top-[43%]"} flex items-center`}>
          <span className="h-3.5 w-3.5 rounded-full bg-[#00e699]" />
          <span className="-ml-1 mt-4 rounded-full bg-[#00e699] px-2 py-0.5 font-mono text-[9px] font-bold text-black">YOU</span>
        </div>
      )}
    </div>
  );
}

function Tab({ card, index, desktop = false }: { card: ShootCard; index: number; desktop?: boolean }) {
  if (desktop) {
    const tabStyle = index === 0
      ? {
          left: "0%",
          width: "calc(25% + 16px)",
          clipPath: "polygon(0 0, calc(100% - 28px) 0, 100% 100%, 0 100%)",
        }
      : index === 1
        ? {
            left: "calc(25% - 12px)",
            width: "calc(25% + 16px)",
            clipPath: "polygon(0 100%, 28px 0, calc(100% - 28px) 0, 100% 100%)",
          }
        : index === 2
          ? {
              left: "calc(50% - 24px)",
              width: "calc(25% + 16px)",
              clipPath: "polygon(0 100%, 28px 0, calc(100% - 28px) 0, 100% 100%)",
            }
          : {
              left: "calc(75% - 36px)",
              width: "calc(25% + 36px)",
              clipPath: "polygon(0 100%, 28px 0, calc(100% - 28px) 0, 100% 100%)",
            };

    return (
      <div
        className="absolute top-0 z-20 flex h-[76px] items-center px-6"
        style={{ ...tabStyle, backgroundColor: card.bg, color: card.ink }}
      >
        <div className={`flex items-center gap-2.5 whitespace-nowrap ${index > 0 ? "pl-4" : ""} font-mono text-[13px] font-bold tracking-[0.04em] xl:text-[15px]`}>
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 15 15" fill="none" className="shrink-0">
            <path d="M1 14V8H6V2H14V14H1Z" fill="currentColor" />
          </svg>
          <span>{card.tab}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="z-20 flex h-12 w-fit items-center px-4 pr-10 font-mono text-[10px] font-bold tracking-[0.12em] sm:text-[11px]"
      style={{
        clipPath: "polygon(0 0, calc(100% - 22px) 0, 100% 100%, 0 100%)",
        backgroundColor: card.bg,
        color: card.ink,
      }}
    >
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 15 15" fill="none" className="mr-2 shrink-0">
        <path d="M1 14V8H6V2H14V14H1Z" fill="currentColor" />
      </svg>
      {card.tab}
    </div>
  );
}

export default function ProjectDeck() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  const card2Y = useTransform(scrollYProgress, [0.1, 0.32], ["105vh", "0vh"]);
  const card3Y = useTransform(scrollYProgress, [0.42, 0.64], ["105vh", "0vh"]);
  const card4Y = useTransform(scrollYProgress, [0.74, 0.96], ["105vh", "0vh"]);
  const transforms = [null, card2Y, card3Y, card4Y];

  return (
    <section id="shoots" className="scroll-mt-8 py-16 lg:py-0">
      <div className="mx-auto mb-8 max-w-4xl px-4 text-center sm:px-6 lg:mb-0 lg:pb-16">
        <span className="font-serif text-2xl italic text-black">inside the system</span>
        <h2 className="mt-2 font-oxanium text-[clamp(2.5rem,6vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.065em] text-black">
          The profile is built <span className="text-[#ec2578]">as a whole.</span>
        </h2>
      </div>

      <div className="mx-auto flex max-w-2xl flex-col gap-14 px-4 sm:px-6 lg:hidden">
        {shootCards.map((card, index) => (
          <article key={card.id} className="relative">
            <Tab card={card} index={index} />
            <div className="relative min-h-[660px] sm:min-h-[720px]">
              <CardContent card={card} index={index} mobile />
            </div>
          </article>
        ))}
      </div>

      <div ref={containerRef} className="relative hidden h-[360vh] w-full lg:block">
        <div className="sticky top-0 flex h-screen items-center justify-center px-8 py-6">
          <div className="relative h-[clamp(650px,calc(100vh-48px),1034px)] w-full max-w-[1240px]">
            {shootCards.map((card, index) => {
              const node = (
                <article className="relative h-full w-full select-none">
                  <Tab card={card} index={index} desktop />
                  <div className="absolute inset-x-0 bottom-0 top-[76px]">
                    <CardContent card={card} index={index} />
                  </div>
                </article>
              );

              if (index === 0) {
                return <div key={card.id} className="absolute inset-0 z-10">{node}</div>;
              }

              return (
                <motion.div
                  key={card.id}
                  className="absolute inset-0"
                  style={{ y: transforms[index] ?? "0vh", zIndex: 10 + index * 10 }}
                >
                  {node}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
