'use client';

import React from 'react';
import Image from 'next/image';
import { Camera, MapPin, Sun, Layers, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const SHOOTS = [
  {
    id: 'coffee',
    label: 'Weekend Coffee',
    location: 'Cafe De Flore',
    lighting: 'Overcast Morning',
    vibe: 'Casual, approachable',
    frames: [
      { url: '/images/demo14.jpg' },
      { url: '/images/aimodel2.jpg' },
      { url: '/images/aimodel5.jpg' },
      { url: '/images/aimodel8.jpg' },
    ]
  },
  {
    id: 'motorcycle',
    label: 'Mountain Layby',
    location: 'Pacific Highway',
    lighting: 'Golden Hour',
    vibe: 'Adventurous, bold',
    frames: [
      { url: '/new-landing/mountain-layby-motorcycle_2.png' },
      { url: '/new-landing/mountain-layby-motorcycle_4.png' },
      { url: '/images/demo3.jpg' },
      { url: '/images/demo4.jpg' },
    ]
  },
  {
    id: 'social',
    label: 'Evening Out',
    location: 'Downtown Bar',
    lighting: 'Low Ambient',
    vibe: 'Social, confident',
    frames: [
      { url: '/images/demo10.jpg' },
      { url: '/images/demo11.jpg' },
      { url: '/images/demo12.jpg' },
      { url: '/images/demo13.jpg' },
    ]
  }
];

export default function ShootsShowcase() {
  return (
    <section id="style-packs" className="py-20 md:py-32 bg-[#111111] relative overflow-hidden">
      <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="mb-16 md:mb-24 max-w-4xl">
          <p className="text-[#ff6f00] font-bold uppercase tracking-wider text-xs sm:text-sm mb-4 block font-mono">
            UnrealShot Lineup Blueprint
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl text-white font-bold tracking-tight leading-[1.08] font-[family-name:var(--font-inter-tight)] mb-6">
            A dating profile doesn&apos;t need more photos. <br className="hidden md:block" />
            <span className="text-[#ff6f00]">It needs the right photos.</span>
          </h2>
          <p className="text-gray-400 text-lg sm:text-xl leading-relaxed max-w-2xl">
            We don&apos;t just generate random faces. We engineer <strong className="text-white">15 highly cohesive shoots</strong>. Same face, same outfit, different angles—perfect continuity for Tinder and Hinge.
          </p>
        </div>

        {/* The Masonry-style Clusters */}
        <div className="space-y-16 md:space-y-32">
          {SHOOTS.map((shoot, index) => {
            const isEven = index % 2 === 0;
            
            return (
              <div key={shoot.id} className="relative group">
                
                {/* Background ambient glow for the cluster */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-3xl bg-[#ff6f00]/5 blur-[120px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 relative z-10">
                  
                  {/* Item 1: Hero Image (Spans 2 cols, 2 rows) */}
                  <div className={`relative rounded-2xl sm:rounded-[24px] overflow-hidden aspect-[3/4] border border-white/10 col-span-2 row-span-2 ${isEven ? 'md:col-start-1' : 'md:col-start-3 md:row-start-1'}`}>
                    <Image 
                      src={shoot.frames[0].url}
                      alt={shoot.label}
                      fill
                      className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {/* Subtle vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Overlaid minimal title for Hero */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white text-xs font-semibold mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#ff6f00]" /> Shoot {index + 1}
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{shoot.label}</h3>
                    </div>
                  </div>

                  {/* Item 2: Small Photo 1 */}
                  <div className={`relative rounded-2xl sm:rounded-[24px] overflow-hidden aspect-[3/4] border border-white/10 col-span-1 row-span-1 ${isEven ? 'md:col-start-3' : 'md:col-start-1 md:row-start-1'}`}>
                    <Image src={shoot.frames[1].url} alt="Detail" fill className="object-cover" sizes="25vw" />
                  </div>

                  {/* Item 3: Small Photo 2 */}
                  <div className={`relative rounded-2xl sm:rounded-[24px] overflow-hidden aspect-[3/4] border border-white/10 col-span-1 row-span-1 ${isEven ? 'md:col-start-4' : 'md:col-start-2 md:row-start-1'}`}>
                    <Image src={shoot.frames[2].url} alt="Detail" fill className="object-cover" sizes="25vw" />
                  </div>

                  {/* Item 4: Small Photo 3 */}
                  <div className={`relative rounded-2xl sm:rounded-[24px] overflow-hidden aspect-[3/4] border border-white/10 col-span-1 row-span-1 ${isEven ? 'md:col-start-3' : 'md:col-start-1 md:row-start-2'}`}>
                    <Image src={shoot.frames[3].url} alt="Detail" fill className="object-cover" sizes="25vw" />
                  </div>

                  {/* Item 5: Meta Information Block */}
                  <div className={`relative rounded-2xl sm:rounded-[24px] overflow-hidden aspect-[3/4] border border-white/5 bg-[#161616] flex flex-col justify-between p-6 col-span-1 row-span-1 ${isEven ? 'md:col-start-4' : 'md:col-start-2 md:row-start-2'}`}>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">Lighting</p>
                        <p className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                          <Sun className="w-4 h-4 text-[#ff6f00]" /> {shoot.lighting}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">Location</p>
                        <p className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#ff6f00]" /> {shoot.location}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">Vibe</p>
                        <p className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                          <Camera className="w-4 h-4 text-[#ff6f00]" /> {shoot.vibe}
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-white/10 mt-auto">
                      <p className="text-[10px] text-gray-500 font-mono leading-tight">
                        4 cohesive frames. Zero AI artifacts. Flawless identity match.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Global Footer CTA */}
        <div className="mt-24 md:mt-32 max-w-4xl mx-auto bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-3xl p-8 md:p-12 border border-gray-800 text-center shadow-2xl relative overflow-hidden">
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
              <Button className="w-full sm:w-auto bg-[#ff6f00] hover:bg-orange-500 text-black font-bold text-base h-14 px-8 rounded-xl transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_30px_rgba(255,111,0,0.3)]">
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
