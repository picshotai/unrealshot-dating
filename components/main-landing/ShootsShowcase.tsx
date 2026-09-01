'use client';

import React from 'react';
import { Layers, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Carousal from '@/components/Carousal';

const row1Images = [
  '/images/demo14.jpg',
  '/images/aimodel2.jpg',
  '/images/aimodel5.jpg',
  '/images/aimodel8.jpg',
  '/new-landing/mountain-layby-motorcycle_2.png',
  '/new-landing/mountain-layby-motorcycle_4.png',
  '/images/demo3.jpg',
  '/images/demo4.jpg',
  '/images/demo10.jpg',
  '/images/demo11.jpg',
  '/images/demo12.jpg',
  '/images/demo13.jpg',
  '/images/full-body-photo.webp',
  '/images/candid-solo.webp'
];

const row2Images = [
  '/new-landing/training-floor-morning-2.png',
  '/new-landing/training-floor-morning-1.png',
  '/images/demo6.jpg',
  '/images/demo8.jpg',
  '/images/aimodel1.jpg',
  '/images/aimodel3.jpg',
  '/images/aimodel4.jpg',
  '/images/aimodel6.jpg',
  '/images/aimodel7.jpg',
  '/images/hero4.webp',
  '/images/cinematic-photo.webp',
  '/images/golden-photo.webp',
  '/images/gritty-photo.webp',
  '/images/vintage-roll.webp'
];

export default function ShootsShowcase() {
  return (
    <section id="style-packs" className="py-20 md:py-28 bg-[#111111] relative overflow-hidden">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-16 text-center">
        <p className="text-[#ff6f00] font-bold uppercase tracking-wider text-xs sm:text-sm mb-4 block font-mono">
          UnrealShot Lineup Blueprint
        </p>
        <h2 className="text-4xl sm:text-5xl md:text-6xl text-white font-bold tracking-tight leading-[1.08] font-[family-name:var(--font-inter-tight)] mb-6 max-w-4xl mx-auto">
          A dating profile doesn&apos;t need more photos. <br className="hidden md:block" />
          <span className="text-[#ff6f00]">It needs the right photos.</span>
        </h2>
        <p className="text-gray-400 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
          We don&apos;t just generate random faces. We engineer <strong className="text-white">15 highly cohesive shoots</strong>. Same face, same outfit, different angles—perfect continuity for Tinder and Hinge.
        </p>
      </div>

      {/* Marquee Gallery - Full Width */}
      <div className="w-full">
        <Carousal 
          images={row1Images} 
          imageAlt="UnrealShot Example Shoot" 
          overlayLabel="Exact Face Identity"
          fromColor="from-[#111111]"
        />
        <Carousal 
          images={row2Images} 
          reverse={true} 
          imageAlt="UnrealShot Example Shoot" 
          overlayLabel="Natural Micro-texture"
          fromColor="from-[#111111]"
        />
      </div>

      {/* Global Footer CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mt-16 max-w-4xl mx-auto bg-[#1a1a1a] rounded-3xl p-8 md:p-12 border border-white/10 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
             <Layers className="w-32 h-32 text-[#ff6f00]" />
          </div>
          
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 relative z-10 font-[family-name:var(--font-inter-tight)]">
            Get 15 complete shoots. 60 distinct photos.
          </h3>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto relative z-10 text-sm sm:text-base">
            Skip the disjointed AI generator look. UnrealShot gives you a full arsenal of natural, highly-coordinated shoots so you can rotate photos without breaking the illusion.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link href="/dashboard">
              <Button className="w-full sm:w-auto bg-[#ff6f00] hover:bg-orange-500 text-black font-bold text-base h-14 px-8 rounded-xl transition-all duration-300 shadow-[0_10px_30px_rgba(255,111,0,0.3)]">
                Create Your Profile — $39
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Check className="w-4 h-4 text-green-500" /> One-time payment
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
