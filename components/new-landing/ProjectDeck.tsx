'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Image from 'next/image';

interface Project {
  id: string;
  tabNumber: string;
  date: string;
  title: string;
  tagline: string;
  link: string;
  tags: string[];
  image: string;
  bgColor: string;
  textColor: string;
  badgeBg: string;
  badgeText: string;
  imageBadgeText: string;
  hasUserCursor?: boolean;
}

const projects: Project[] = [
  {
    id: 'meridian-health',
    tabNumber: 'PROJECT 01',
    date: 'MAR 19, 2026',
    title: 'Meridian Health',
    tagline: 'When therapists spend less time clicking, they have more time for patients.',
    link: '#meridian-health',
    tags: ['HEALTHCARE', 'WORKFLOW DESIGN'],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80',
    bgColor: '#24bcf0',
    textColor: 'text-black',
    badgeBg: 'bg-black',
    badgeText: 'text-[#24bcf0]',
    imageBadgeText: 'text-black',
  },
  {
    id: 'stylebook',
    tabNumber: 'PROJECT 02',
    date: 'MAR 2, 2026',
    title: 'StyleBook',
    tagline: "From 'I hate this system' to 'Can we show other salons?'",
    link: '#stylebook',
    tags: ['SAAS', 'TRANSFORMATION'],
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=80',
    bgColor: '#111111',
    textColor: 'text-white',
    badgeBg: 'bg-white',
    badgeText: 'text-black',
    imageBadgeText: 'text-black',
  },
  {
    id: 'homestead',
    tabNumber: 'PROJECT 03',
    date: 'JAN 2, 2025',
    title: 'Homestead',
    tagline: "Helping first-time homebuyers actually understand what they're looking at.",
    link: '#homestead',
    tags: ['PROPTECH', '0 -> 1'],
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80',
    bgColor: '#ebaf2e',
    textColor: 'text-black',
    badgeBg: 'bg-black',
    badgeText: 'text-[#ebaf2e]',
    imageBadgeText: 'text-black',
  },
  {
    id: 'north-light',
    tabNumber: 'PROJECT 04',
    date: 'MAR 19, 2026',
    title: 'North Light',
    tagline: "Getting seven stakeholders to agree on what they're actually building.",
    link: '#north-light',
    tags: ['STRATEGY', 'ENTERPRISE'],
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1400&q=80',
    bgColor: '#d61858',
    textColor: 'text-white',
    badgeBg: 'bg-white',
    badgeText: 'text-[#d61858]',
    imageBadgeText: 'text-[#d61858]',
    hasUserCursor: true,
  },
];

export default function ProjectDeck() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Staggered slide-in animations for cards 2, 3, and 4
  const card2Y = useTransform(scrollYProgress, [0.10, 0.32], ['100vh', '0vh']);
  const card3Y = useTransform(scrollYProgress, [0.42, 0.64], ['100vh', '0vh']);
  const card4Y = useTransform(scrollYProgress, [0.74, 0.96], ['100vh', '0vh']);

  const cardTransforms = [null, card2Y, card3Y, card4Y];

  // Specific geometry for each card's solitary tab
  const getTabStyle = (index: number) => {
    if (index === 0) {
      return {
        left: '0%',
        width: 'calc(25% + 16px)',
        clipPath: 'polygon(0 0, calc(100% - 28px) 0, 100% 100%, 0 100%)',
      };
    }
    if (index === 1) {
      return {
        left: 'calc(25% - 12px)',
        width: 'calc(25% + 16px)',
        clipPath: 'polygon(0 100%, 28px 0, calc(100% - 28px) 0, 100% 100%)',
      };
    }
    if (index === 2) {
      return {
        left: 'calc(50% - 24px)',
        width: 'calc(25% + 16px)',
        clipPath: 'polygon(0 100%, 28px 0, calc(100% - 28px) 0, 100% 100%)',
      };
    }
    return {
      left: 'calc(75% - 36px)',
      width: 'calc(25% + 36px)',
      clipPath: 'polygon(0 100%, 28px 0, calc(100% - 28px) 0, 100% 100%)',
    };
  };

  return (
    <div className="w-full">
      {/* =========================================================================
          MOBILE LAYOUT: Vertical List (hidden on lg+ screens)
          ========================================================================= */}
      <div className="flex lg:hidden flex-col gap-16 px-4 sm:px-6 py-12 w-full max-w-2xl mx-auto">
        {projects.map((proj, index) => (
          <div key={`mobile-card-${proj.id}`} className="relative w-full flex flex-col">
            {/* Mobile Tab (Simplified geometry for narrow screens) */}
            <div
              className={`h-[44px] flex items-center px-4 sm:px-5 z-20 ${proj.textColor} w-fit pr-10`}
              style={{
                backgroundColor: proj.bgColor,
                clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 100%, 0 100%)',
              }}
            >
              <div className="flex items-center space-x-2">
                <svg width="14" height="14" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                  <path d="M1 14V8H6V2H14V14H1Z" fill="currentColor" />
                </svg>
                <span className="font-mono text-[13px] font-bold tracking-wider uppercase">
                  {proj.tabNumber}
                </span>
              </div>
            </div>

            {/* Mobile Card Body */}
            <div 
              className={`w-full ${proj.textColor} p-6 sm:p-8 flex flex-col justify-between`}
              style={{ backgroundColor: proj.bgColor }}
            >
              <div className="flex flex-col gap-8">
                {/* Text Content */}
                <div>
                  <div className="flex items-center space-x-2.5 mb-3 sm:mb-4">
                    <span className={`w-2.5 h-2.5 rounded-full inline-block ${index === 0 || index === 2 ? 'bg-black' : 'bg-white'}`}></span>
                    <span className="font-mono text-xs font-semibold tracking-wider uppercase opacity-90">
                      {proj.date}
                    </span>
                  </div>

                  <h3 className="font-sans text-3xl sm:text-4xl font-normal tracking-tight leading-[1.05]">
                    {proj.title}
                  </h3>

                  <p className="font-sans text-base sm:text-[17px] leading-snug mt-3 sm:mt-4 font-normal opacity-90">
                    {proj.tagline}
                  </p>

                  <div className="mt-6">
                    <a
                      href={proj.link}
                      className={`inline-flex items-center space-x-1.5 font-mono text-xs font-bold tracking-wider uppercase border-b-2 ${index === 0 || index === 2 ? 'border-black text-black' : 'border-white text-white'} pb-0.5`}
                    >
                      <span>VIEW PROJECT</span>
                      <span className="text-sm leading-none">↗</span>
                    </a>
                  </div>
                </div>

                {/* Hero Image */}
                <div className="relative w-full aspect-[4/3] bg-black border border-white/20">
                  {/* Corners */}
                  <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-black z-30 pointer-events-none"></div>
                  <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-black z-30 pointer-events-none"></div>
                  <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-black z-30 pointer-events-none"></div>
                  <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-black z-30 pointer-events-none"></div>

                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white text-black font-mono text-[10px] sm:text-[11px] font-bold px-2 py-1 flex items-center space-x-1.5 z-20 select-none">
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="1" y="1" width="10" height="10" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M1 8L4 5L8 9" stroke="currentColor" strokeWidth="1.2" />
                      <circle cx="8.5" cy="4" r="1" fill="currentColor" />
                    </svg>
                    <span className={proj.imageBadgeText}>IMAGE.JPG</span>
                  </div>

                  <div className="relative w-full h-full overflow-hidden">
                    <Image
                      src={proj.image}
                      alt={`${proj.title} Showcase`}
                      fill
                      className="object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-end gap-2 mt-8 pt-2">
                {proj.tags.map((tag, tIdx) => (
                  <div
                    key={`tag-${tIdx}`}
                    className={`${proj.badgeBg} ${proj.badgeText} font-mono text-[10px] sm:text-[11px] font-bold tracking-wider px-3 sm:px-4 pt-2.5 pb-2 select-none`}
                    style={{
                      clipPath: tIdx === 0 
                        ? 'polygon(0 6px, 10px 0, calc(100% - 10px) 0, 100% 6px, 100% 100%, 0 100%)'
                        : 'polygon(0 6px, 10px 6px, 16px 0, calc(100% - 10px) 0, 100% 6px, 100% 100%, 0 100%)'
                    }}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* =========================================================================
          DESKTOP LAYOUT: Sticky Scroll Deck (hidden on mobile)
          ========================================================================= */}
      <div ref={containerRef} className="hidden lg:block relative h-[360vh] w-full">
        {/* Sticky viewport frame that locks in the center of the screen */}
        <div className="sticky top-0 h-screen w-full flex items-center justify-center z-20 px-4 sm:px-6 lg:px-8 py-6">
          <div className="relative w-full max-w-[1240px] h-[580px] sm:h-[540px] md:h-[560px]">
          
          {projects.map((proj, index) => {
            const yTransform = cardTransforms[index];
            const tabStyle = getTabStyle(index);

            const cardNode = (
              <div className="w-full h-full relative select-none">
                {/* Each card holds ONLY its OWN individual tab at the top */}
                <div
                  className={`absolute top-0 h-[48px] flex items-center px-4 sm:px-6 z-20 ${proj.textColor}`}
                  style={{
                    ...tabStyle,
                    backgroundColor: proj.bgColor,
                  }}
                >
                  <div className={`flex items-center space-x-2 ${index > 0 ? 'pl-3 sm:pl-4' : ''}`}>
                    <svg width="14" height="14" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                      <path d="M1 14V8H6V2H14V14H1Z" fill="currentColor" />
                    </svg>
                    <span className="font-mono text-xs sm:text-[13px] font-bold tracking-wider uppercase truncate">
                      {proj.tabNumber}
                    </span>
                  </div>
                </div>

                {/* Main Card Body - Perfectly aligned at top: 48px */}
                <div 
                  className={`absolute top-[48px] inset-x-0 bottom-0 ${proj.textColor} p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-between`}
                  style={{ backgroundColor: proj.bgColor }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 h-full items-stretch">
                    
                    {/* Left Column */}
                    <div className="lg:col-span-5 flex flex-col justify-between z-20 relative">
                      <div>
                        {/* Date Tag */}
                        <div className="flex items-center space-x-2.5 mb-4">
                          <span className={`w-2.5 h-2.5 rounded-full inline-block ${index === 0 || index === 2 ? 'bg-black' : 'bg-white'}`}></span>
                          <span className="font-mono text-xs font-semibold tracking-wider uppercase opacity-90">
                            {proj.date}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-normal tracking-tight leading-[1.05]">
                          {proj.title}
                        </h3>

                        {/* Tagline */}
                        <p className="font-sans text-base sm:text-[17px] md:text-lg leading-snug mt-4 sm:mt-5 font-normal opacity-90 max-w-md">
                          {proj.tagline}
                        </p>

                        {/* CTA Link */}
                        <div className="mt-6 sm:mt-8">
                          <a
                            href={proj.link}
                            className={`inline-flex items-center space-x-1.5 font-mono text-xs sm:text-sm font-bold tracking-wider uppercase border-b-2 ${index === 0 || index === 2 ? 'border-black text-black' : 'border-white text-white'} pb-0.5 hover:opacity-75 transition-opacity`}
                          >
                            <span>VIEW PROJECT</span>
                            <span className="text-base leading-none">↗</span>
                          </a>
                        </div>
                      </div>

                      {/* Mint-Green "YOU" cursor indicator on Card 4 */}
                      {proj.hasUserCursor && (
                        <div className="hidden sm:flex absolute right-0 top-[45%] items-center select-none pointer-events-none z-30">
                          <div className="w-3.5 h-3.5 bg-[#00e699] rounded-full"></div>
                          <div className="bg-[#00e699] text-black text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full -ml-1 mt-4">
                            YOU
                          </div>
                        </div>
                      )}

                      {/* Chamfered Badges */}
                      <div className="flex flex-wrap items-end gap-2.5 mt-8 lg:mt-auto pt-2">
                        {proj.tags.map((tag, tIdx) => (
                          <div
                            key={`tag-${tIdx}`}
                            className={`${proj.badgeBg} ${proj.badgeText} font-mono text-[11px] sm:text-xs font-bold tracking-wider px-4 pt-2.5 pb-2 select-none`}
                            style={{
                              clipPath: tIdx === 0 
                                ? 'polygon(0 6px, 10px 0, 36px 0, 44px 6px, 100% 6px, 100% 100%, 0 100%)'
                                : 'polygon(0 6px, 10px 6px, 16px 0, 48px 0, 54px 6px, 100% 6px, 100% 100%, 0 100%)'
                            }}
                          >
                            {tag}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Column: Framed Image with Technical Corner Nodes */}
                    <div className="lg:col-span-7 flex items-center justify-center relative my-auto h-full max-h-[380px]">
                      <div className="relative w-full h-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[16/10] bg-black border border-white/20 overflow-visible">
                        {/* 4 Corner Square Handles */}
                        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-black z-30 pointer-events-none"></div>
                        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-black z-30 pointer-events-none"></div>
                        <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-black z-30 pointer-events-none"></div>
                        <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-black z-30 pointer-events-none"></div>

                        {/* Top-right Image Metadata Badge */}
                        <div className="absolute top-3 right-3 bg-white text-black font-mono text-[10.5px] sm:text-[11.5px] font-bold px-2.5 py-1 flex items-center space-x-1.5 z-20 select-none">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="1" y="1" width="10" height="10" stroke="currentColor" strokeWidth="1.2" />
                            <path d="M1 8L4 5L8 9" stroke="currentColor" strokeWidth="1.2" />
                            <circle cx="8.5" cy="4" r="1" fill="currentColor" />
                          </svg>
                          <span className={proj.imageBadgeText}>IMAGE.JPG</span>
                        </div>

                        {/* Image */}
                        <div className="relative w-full h-full overflow-hidden">
                          <Image
                            src={proj.image}
                            alt={`${proj.title} Showcase`}
                            fill
                            className="object-cover object-center"
                            referrerPolicy="no-referrer"
                            priority={index === 0}
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );

            if (index === 0) {
              return (
                <div
                  key={`card-${proj.id}`}
                  className="absolute inset-0 z-10"
                >
                  {cardNode}
                </div>
              );
            }

            return (
              <motion.div
                key={`card-${proj.id}`}
                style={{ y: yTransform ?? '0vh', zIndex: 10 + index * 10 }}
                className="absolute inset-0"
              >
                {cardNode}
              </motion.div>
            );
          })}

        </div>
      </div>
    </div>
    </div>
  );
}
