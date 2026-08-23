'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import ProjectDeck from '@/components/new-landing/ProjectDeck';

export default function HeroSection() {
  const [time, setTime] = useState<string>("11:46:14 PM");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' }).toUpperCase());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-white flex flex-col font-sans selection:bg-[#00d4ff]/30">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }}
      />

      {/* Navigation Bar */}
      <nav className="relative z-50 flex items-center justify-between w-full h-[60px] bg-white px-4">
        <div className="flex items-center h-full">
          {/* Logo icon (3 concentric arcs) */}
          <div className="mr-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round">
              <path d="M4 20 A8 8 0 0 1 20 20" />
              <path d="M7 20 A5 5 0 0 1 17 20" />
              <path d="M10 20 A2 2 0 0 1 14 20" />
            </svg>
          </div>
          {/* Vertical Divider */}
          <div className="h-10 w-px bg-gray-200" />
        </div>

        <div className="flex items-center">
          <button className="flex items-center space-x-2 border border-black px-3 py-1.5 hover:bg-gray-50 transition-colors">
            <span className="font-mono text-[11px] font-bold">MENU</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
              <path d="M3 8h18M3 16h18" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Editor Ruler */}
      <div className="relative z-40 w-full h-6 border-y border-gray-200 bg-white flex items-end overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex-none flex items-end w-[100px] h-full relative border-l border-gray-200 first:border-l-0">
            <span className="absolute top-0.5 left-1 text-[9px] text-gray-400 font-mono select-none">
              {i === 0 ? '' : i * 100}
            </span>
            {/* intermediate ticks */}
            <div className="absolute bottom-0 left-1/2 w-px h-1.5 bg-gray-200" />
            <div className="absolute bottom-0 left-1/4 w-px h-1 bg-gray-200" />
            <div className="absolute bottom-0 left-[75%] w-px h-1 bg-gray-200" />
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <main className="relative flex-1 w-full flex flex-col items-center pt-6 z-10 pb-24">
        
        {/* Clock */}
        <div className="font-mono text-[11px] sm:text-xs font-medium tracking-widest text-black mb-8">
          {time}
        </div>

        {/* Hero Section */}
        <div className="relative flex flex-col items-center w-full px-4 mb-12">
          
          {/* "my name is" handwritten script */}
          <div className="flex flex-col items-center mb-1">
            <span className="font-handwriting text-2xl text-black">my name is</span>
            <div className="flex flex-col items-center -mt-1 space-y-[2px]">
              <svg width="50" height="4" viewBox="0 0 50 4" fill="none" stroke="black" strokeWidth="1">
                <path d="M1 2 Q 25 0 49 2" />
              </svg>
              <svg width="45" height="4" viewBox="0 0 45 4" fill="none" stroke="black" strokeWidth="1">
                <path d="M1 2 Q 22 0 44 2" />
              </svg>
              <svg width="40" height="4" viewBox="0 0 40 4" fill="none" stroke="black" strokeWidth="1">
                <path d="M1 2 Q 20 0 39 2" />
              </svg>
            </div>
          </div>

          {/* Main Title with Selection Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative border-[1.5px] border-[#00c5ff] z-20 px-2 lg:px-4 py-1 md:py-2 bg-white/50 backdrop-blur-[2px]"
          >
            {/* Selection nodes */}
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-[#00c5ff] border border-black"></div>
            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[#00c5ff] border border-black"></div>
            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-[#00c5ff] border border-black"></div>
            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-[#00c5ff] border border-black"></div>

            <h1 className="font-bungee text-[3.5rem] sm:text-[4rem] md:text-[5.5rem] lg:text-[7rem] leading-[0.9] tracking-tighter text-black select-none pointer-events-none mt-2">
              BEJAMAN
            </h1>
          </motion.div>

          {/* Blue dot and Available text */}
          <div className="flex items-center justify-center space-x-2 mt-4">
            <div className="w-3 h-3 bg-[#45c4f9] rounded-full" />
            <span className="font-mono text-[9px] sm:text-[10px] font-bold tracking-widest text-black">
              AVAILABLE FOR THOUGHTFUL PROJECTS
            </span>
          </div>
        </div>

        {/* Copy & CTA Section */}
        <div className="w-full flex flex-col items-center justify-center px-4 mb-16">
          <div className="font-sans font-medium text-[1.6rem] leading-[1.2] flex flex-col items-center max-w-lg tracking-tight">
            <div className="flex flex-wrap items-center justify-center gap-x-1.5">
              <span>I design</span>
              <div className="inline-flex w-[1.1em] h-[1.1em] relative">
                {/* Concentric green circles */}
                <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="#25a882" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="12" cy="12" r="1.5" fill="#25a882" />
                </svg>
              </div>
              <span>outstanding</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-1">
              <span>digital products</span>
              <div className="inline-flex w-[1.1em] h-[1.1em] text-[#ec2578]">
                {/* Pink asterisk / flower */}
                <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                   <circle cx="12" cy="12" r="2.5" />
                   <circle cx="12" cy="5" r="2.5" />
                   <circle cx="12" cy="19" r="2.5" />
                   <circle cx="6" cy="8.5" r="2.5" />
                   <circle cx="18" cy="15.5" r="2.5" />
                   <circle cx="6" cy="15.5" r="2.5" />
                   <circle cx="18" cy="8.5" r="2.5" />
                </svg>
              </div>
              <span>.</span>
            </div>
          </div>

          {/* Contact Button */}
          <button className="bg-[#111] hover:bg-black transition-colors text-white text-[11px] font-mono font-bold tracking-widest flex items-center pr-4 overflow-hidden mt-8">
             <div className="relative mr-4 w-[50px] h-[50px]">
                {/* Pink square peeking */}
                <div className="absolute left-0 bottom-0 w-[42px] h-[42px] bg-[#ec2578]" />
                {/* Cyan square with icon */}
                <div className="absolute right-0 top-0 w-[42px] h-[42px] bg-[#45c4f9] flex items-center justify-center">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                     <path d="m13 17 5-5-5-5"/>
                     <path d="m6 17 5-5-5-5"/>
                   </svg>
                </div>
             </div>
             CONTACT ME
          </button>
        </div>

        {/* Arched divider line */}
        <div className="w-full relative h-[60px] overflow-hidden flex justify-center -mt-8 mb-4 pointer-events-none">
          <svg width="200%" height="100%" viewBox="0 0 100 10" preserveAspectRatio="none" className="text-gray-200 stroke-current stroke-[0.2]">
            <path d="M0 10 Q 50 -5 100 10" fill="none" />
          </svg>
        </div>

        {/* About Section intro */}
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 md:mt-8 flex flex-col items-center">
          
          {/* "about me!" handwriting text */}
          <div className="w-full max-w-4xl relative">
            <span className="absolute -top-4 md:-top-6 left-2 sm:left-6 md:left-8 font-handwriting text-xl sm:text-2xl md:text-3xl text-black rotate-[-10deg] select-none pointer-events-none">
              about me!
            </span>
          </div>
          
          {/* "what's up" with Framer selection box */}
          <div className="relative inline-block border-[1.5px] border-black px-3 py-1.5 bg-white/60 backdrop-blur-[1px] select-none mb-6 sm:mb-8 md:mb-12">
            <h2 className="font-sans text-xl sm:text-2xl md:text-[28px] font-medium tracking-tight text-black px-1">
              what&apos;s up
            </h2>
            
            {/* Corner Handles */}
            <div className="absolute -top-[4px] -left-[4px] w-[7px] h-[7px] bg-white border border-black"></div>
            <div className="absolute -top-[4px] -right-[4px] w-[7px] h-[7px] bg-white border border-black"></div>
            <div className="absolute -bottom-[4px] -left-[4px] w-[7px] h-[7px] bg-white border border-black"></div>
            <div className="absolute -bottom-[4px] -right-[4px] w-[7px] h-[7px] bg-white border border-black"></div>
          </div>

          {/* Statement & Flanking Desktop Polaroids Container */}
          <div className="relative w-full flex items-center justify-center min-h-[220px] md:min-h-[300px]">
            
            {/* Left Polaroid - Desktop */}
            <motion.div
              initial={{ opacity: 0, rotate: -22, x: -50 }}
              whileInView={{ opacity: 1, rotate: -11, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ type: "spring", bounce: 0.35, duration: 0.8 }}
              className="hidden md:block absolute left-0 lg:left-4 xl:left-10 top-2 lg:top-4 w-[165px] lg:w-[195px] xl:w-[215px] bg-white p-2.5 lg:p-3 pb-8 lg:pb-10 shadow-[0_14px_40px_rgba(0,0,0,0.12)] border border-gray-100 z-10 hover:rotate-0 hover:scale-105 transition-all duration-300 pointer-events-auto"
            >
              <div className="w-full aspect-[4/5] bg-gray-100 relative overflow-hidden">
                <Image
                  src="https://picsum.photos/seed/portrait1/400/500"
                  fill
                  alt="2026 Portrait"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute bottom-2 lg:bottom-2.5 left-0 w-full text-center font-handwriting text-xl lg:text-2xl text-black">
                2026
              </div>
            </motion.div>

            {/* Center Main Text */}
            <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto text-center px-4 relative z-10">
              
              {/* Desktop "YOU" cursor indicator */}
              <div className="absolute -top-3 sm:-top-4 left-1 sm:left-4 md:-left-3 lg:-left-6 flex items-center select-none pointer-events-none z-20">
                {/* Black cursor dot */}
                <div className="w-3.5 h-3.5 bg-black rounded-full shadow-sm"></div>
                {/* "YOU" tag bubble */}
                <div className="bg-black text-white text-[8.5px] md:text-[9.5px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded-full -ml-1 mt-3.5 shadow-sm">
                  YOU
                </div>
              </div>

              <div className="font-sans text-[26px] sm:text-[34px] md:text-[42px] lg:text-[50px] xl:text-[54px] font-medium text-center leading-[1.14] tracking-tight text-black">
                I&apos;m Bejaman{' '}
                <span className="inline-block align-middle mx-1 md:mx-1.5 w-[28px] h-[28px] sm:w-[36px] sm:h-[36px] md:w-[44px] md:h-[44px] lg:w-[48px] lg:h-[48px] rounded-md overflow-hidden border border-gray-200 shadow-sm">
                  <Image
                    src="https://picsum.photos/seed/face1/100/100"
                    width={48}
                    height={48}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </span>{' '}
                a product designer in Chicago who gets excited{' '}
                <span className="inline-flex items-center justify-center align-middle mx-1 md:mx-1.5 w-[26px] h-[26px] sm:w-[34px] sm:h-[34px] md:w-[42px] md:h-[42px] lg:w-[46px] lg:h-[46px] text-[#f7b733]">
                  <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5Z" />
                  </svg>
                </span>{' '}
                about making complicated things simple{' '}
                <span className="inline-flex items-center justify-center align-middle mx-0.5 md:mx-1 w-[24px] h-[24px] sm:w-[32px] sm:h-[32px] md:w-[38px] md:h-[38px] lg:w-[42px] lg:h-[42px] text-[#ec2578]">
                  <svg viewBox="0 0 24 24" className="w-[85%] h-[85%] fill-current">
                    <path d="M4 3 L20 3 L14 12 L20 21 L4 21 L10 12 Z" />
                  </svg>
                </span>.
              </div>
            </div>

            {/* Right Polaroid - Desktop */}
            <motion.div
              initial={{ opacity: 0, rotate: 22, x: 50 }}
              whileInView={{ opacity: 1, rotate: 12, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ type: "spring", bounce: 0.35, duration: 0.8, delay: 0.1 }}
              className="hidden md:block absolute right-0 lg:right-4 xl:right-10 top-4 lg:top-8 w-[165px] lg:w-[195px] xl:w-[215px] bg-white p-2.5 lg:p-3 pb-8 lg:pb-10 shadow-[0_14px_40px_rgba(0,0,0,0.15)] border border-gray-100 z-10 hover:rotate-0 hover:scale-105 transition-all duration-300 pointer-events-auto"
            >
              <div className="w-full aspect-[4/5] bg-gray-100 relative overflow-hidden">
                <Image
                  src="https://picsum.photos/seed/desk/400/500"
                  fill
                  alt="Workspace"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute bottom-2 lg:bottom-2.5 left-0 w-full text-center font-handwriting text-xl lg:text-2xl text-black">
                my workspace
              </div>
            </motion.div>
          </div>

          {/* Mobile Polaroids Section (Stacked on small screens) */}
          <div className="relative md:hidden w-full max-w-[340px] mx-auto mt-10 h-[320px] pointer-events-none">
            {/* Left Photo - Portrait */}
            <motion.div
              initial={{ opacity: 0, rotate: -25, x: -50, y: 20 }}
              whileInView={{ opacity: 1, rotate: -12, x: -25, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
              className="absolute left-[6%] top-4 bg-white p-2.5 pb-9 shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-gray-100 z-10 w-[165px] pointer-events-auto"
            >
              <div className="w-full aspect-[4/5] bg-gray-200 relative overflow-hidden">
                <Image
                  src="https://picsum.photos/seed/portrait1/400/500"
                  fill
                  alt="Portrait 2026"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute bottom-2 left-0 w-full text-center font-handwriting text-xl text-black">
                2026
              </div>
            </motion.div>

            {/* Right Photo - Workspace */}
            <motion.div
              initial={{ opacity: 0, rotate: 25, x: 50, y: 40 }}
              whileInView={{ opacity: 1, rotate: 14, x: 35, y: 15 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ type: "spring", bounce: 0.4, duration: 0.8, delay: 0.1 }}
              className="absolute right-[6%] top-10 bg-white p-2.5 pb-9 shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-gray-100 z-20 w-[165px] pointer-events-auto"
            >
              <div className="w-full aspect-[4/5] bg-gray-200 relative overflow-hidden">
                <Image
                  src="https://picsum.photos/seed/desk/400/500"
                  fill
                  alt="Workspace"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute bottom-2 left-0 w-full text-center font-handwriting text-xl text-black">
                my workspace
              </div>
            </motion.div>
          </div>

          {/* Skills Pills Section (2x2 Grid Centered on Desktop) */}
          <div className="w-full flex flex-col items-center mt-10 md:mt-14 mb-20 pointer-events-auto px-4 z-20">
            <div className="flex flex-col items-center space-y-2.5 md:space-y-3 w-full max-w-3xl">
              
              {/* Row 1 */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 md:gap-3"
              >
                {/* Interaction Design Pill */}
                <div className="flex items-center space-x-[2px] shadow-sm">
                  <div className="bg-[#f7b733] text-black font-sans text-[18px] sm:text-[21px] md:text-[23px] px-3 sm:px-4 py-1 font-medium tracking-tight h-[42px] sm:h-[46px] md:h-[48px] flex items-center">
                    Interaction Design
                  </div>
                  <div className="w-[42px] h-[42px] sm:w-[46px] sm:h-[46px] md:w-[48px] md:h-[48px] bg-[#f7b733] border-2 border-dashed border-black flex items-center justify-center shrink-0">
                    <div className="grid grid-cols-2 gap-[2px] rotate-45 w-[16px] sm:w-[18px] h-[16px] sm:h-[18px]">
                      <div className="bg-black w-full h-full"></div>
                      <div className="bg-black w-full h-full"></div>
                      <div className="bg-black w-full h-full"></div>
                      <div className="bg-black w-full h-full"></div>
                    </div>
                  </div>
                </div>

                {/* Prototyping Pill */}
                <div className="flex items-center space-x-[2px] shadow-sm">
                  <div className="bg-[#25a882] text-black font-sans text-[18px] sm:text-[21px] md:text-[23px] px-3 sm:px-4 py-1 font-medium tracking-tight h-[42px] sm:h-[46px] md:h-[48px] flex items-center">
                    Prototyping
                  </div>
                  <div className="w-[42px] h-[42px] sm:w-[46px] sm:h-[46px] md:w-[48px] md:h-[48px] bg-[#25a882] flex items-center justify-center shrink-0 relative overflow-hidden">
                    <div className="absolute w-[60px] h-[2px] bg-black rotate-0"></div>
                    <div className="absolute w-[60px] h-[2px] bg-black rotate-45"></div>
                    <div className="absolute w-[60px] h-[2px] bg-black rotate-90"></div>
                    <div className="absolute w-[60px] h-[2px] bg-black rotate-[135deg]"></div>
                    <div className="absolute w-3.5 h-3.5 sm:w-4 sm:h-4 bg-[#ec2578] rounded-full border-[2px] border-black z-10"></div>
                  </div>
                </div>
              </motion.div>

              {/* Row 2 */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 md:gap-3"
              >
                {/* User Research Pill */}
                <div className="flex items-center space-x-[2px] shadow-sm">
                  <div className="bg-[#ec2578] text-white font-sans text-[18px] sm:text-[21px] md:text-[23px] px-3 sm:px-4 py-1 font-medium tracking-tight h-[42px] sm:h-[46px] md:h-[48px] flex items-center">
                    User Research
                  </div>
                  <div className="w-[42px] h-[42px] sm:w-[46px] sm:h-[46px] md:w-[48px] md:h-[48px] bg-[#ec2578] flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7">
                      <path d="M12 5.5C7 5.5 2.73 8.61 1 13c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5z" fill="white" />
                      <path d="M12 8.5 L13.5 11.5 L16.5 13 L13.5 14.5 L12 17.5 L10.5 14.5 L7.5 13 L10.5 11.5 Z" fill="#f7b733" />
                    </svg>
                  </div>
                </div>

                {/* Motion Design Pill */}
                <div className="flex items-center space-x-[2px] shadow-sm">
                  <div className="bg-[#45c4f9] text-black font-sans text-[18px] sm:text-[21px] md:text-[23px] px-3 sm:px-4 py-1 font-medium tracking-tight h-[42px] sm:h-[46px] md:h-[48px] flex items-center">
                    Motion Design
                  </div>
                  <div className="w-[42px] h-[42px] sm:w-[46px] sm:h-[46px] md:w-[48px] md:h-[48px] bg-[#45c4f9] flex items-center justify-center shrink-0 relative">
                    <div className="w-2.5 h-2.5 bg-[#ec2578] rounded-full absolute top-2 left-2"></div>
                    <div className="w-2 h-2 bg-[#ec2578] rounded-full absolute bottom-2 right-2"></div>
                    <div className="w-1.5 h-1.5 bg-black/40 rounded-full absolute bottom-2 left-3"></div>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>

          {/* Projects Showcase - Scroll-Driven Stacked Deck System */}
          <div className="w-full z-20 mt-12 md:mt-20 mb-20">
            <ProjectDeck />
          </div>
        </div>

      </main>

      {/* Buy Nudge Floating Banner */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center">
        <div className="bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.1)] px-4 py-2.5 rounded-full text-[10px] font-sans font-medium tracking-widest text-black/60 flex items-center space-x-2 mr-2">
          <span>BUY</span>
          <span className="text-black font-bold">NUDGE</span>
        </div>
        <div className="flex flex-col space-y-1">
          <div className="w-2 h-2 bg-[#45c4f9] rounded-full border border-black/10"></div>
          <div className="w-2 h-2 bg-[#ec2578] rounded-full border border-black/10"></div>
        </div>
      </div>

    </div>
  );
}

