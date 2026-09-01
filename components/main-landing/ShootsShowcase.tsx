'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CheckCircle2, Focus, Layers, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const SHOOTS = [
  {
    id: 'coffee',
    label: '☕ Weekend Coffee',
    location: 'Cafe De Flore, Paris',
    lighting: 'Overcast Morning Light',
    heroImage: '/images/demo14.jpg',
    frames: [
      { url: '/images/demo14.jpg', role: 'The Opener Portrait' },
      { url: '/images/aimodel2.jpg', role: 'Unstaged Candid' },
      { url: '/images/aimodel5.jpg', role: 'Full-Body Context' },
      { url: '/images/aimodel8.jpg', role: 'In-Action Detail' },
    ]
  },
  {
    id: 'motorcycle',
    label: '🏍️ Mountain Layby',
    location: 'Pacific Coast Highway',
    lighting: 'Golden Hour / Sunset',
    heroImage: '/new-landing/mountain-layby-motorcycle_2.png',
    frames: [
      { url: '/new-landing/mountain-layby-motorcycle_2.png', role: 'The Opener Portrait' },
      { url: '/new-landing/mountain-layby-motorcycle_4.png', role: 'Unstaged Candid' },
      { url: '/images/demo3.jpg', role: 'Full-Body Context' },
      { url: '/images/demo4.jpg', role: 'In-Action Detail' },
    ]
  },
  {
    id: 'training',
    label: '🏋️ Morning Training',
    location: 'IronWorks Barbell Club',
    lighting: 'Harsh Overhead Fluorescent',
    heroImage: '/new-landing/training-floor-morning-2.png',
    frames: [
      { url: '/new-landing/training-floor-morning-2.png', role: 'The Opener Portrait' },
      { url: '/new-landing/training-floor-morning-1.png', role: 'Unstaged Candid' },
      { url: '/images/demo6.jpg', role: 'Full-Body Context' },
      { url: '/images/demo8.jpg', role: 'In-Action Detail' },
    ]
  },
  {
    id: 'social',
    label: '🥂 Evening Out',
    location: 'Downtown Speakeasy',
    lighting: 'Low Ambient Warm',
    heroImage: '/images/demo10.jpg',
    frames: [
      { url: '/images/demo10.jpg', role: 'The Opener Portrait' },
      { url: '/images/demo11.jpg', role: 'Unstaged Candid' },
      { url: '/images/demo12.jpg', role: 'Full-Body Context' },
      { url: '/images/demo13.jpg', role: 'In-Action Detail' },
    ]
  }
];

export default function ShootsShowcase() {
  const [activeShootId, setActiveShootId] = useState(SHOOTS[0].id);
  const activeShoot = SHOOTS.find(s => s.id === activeShootId) || SHOOTS[0];

  return (
    <section id="style-packs" className="py-20 md:py-32 bg-[#0a0a0a] border-y border-white/5 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-[20%] w-[50%] h-[50%] bg-[#ff6f00]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-[#ff6f00]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#ff6f00] text-xs sm:text-sm font-semibold uppercase tracking-widest font-[family-name:var(--font-inter)]">
            <Sparkles className="w-4 h-4" />
            The UnrealShot Lineup Blueprint
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl text-white font-bold tracking-tight leading-[1.08] font-[family-name:var(--font-inter-tight)]">
            A dating profile doesn&apos;t need more photos. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6f00] to-orange-400">It needs the right photos.</span>
          </h2>
          <p className="text-gray-400 text-lg sm:text-xl leading-relaxed">
            Competitors generate random, disconnected AI faces. UnrealShot engineers 
            <strong className="text-white font-semibold"> 15 cohesive shoots</strong>—giving you perfect continuity across every required slot on Hinge and Tinder.
          </p>
        </div>

        {/* Interactive Shoot Explorer */}
        <div className="bg-[#111111] border border-white/10 rounded-2xl sm:rounded-[32px] p-4 sm:p-8 lg:p-12 shadow-2xl">
          
          {/* Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
            {SHOOTS.map((shoot) => {
              const isActive = activeShootId === shoot.id;
              return (
                <button
                  key={shoot.id}
                  onClick={() => setActiveShootId(shoot.id)}
                  className={\`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 \${
                    isActive 
                      ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
                  }\`}
                >
                  {shoot.label}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeShoot.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
            >
              
              {/* Left Column: Hero Frame */}
              <div className="lg:col-span-5 space-y-6">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                  <Image 
                    src={activeShoot.heroImage} 
                    alt={activeShoot.label}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Overlay Meta */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
                        <Focus className="w-4 h-4 text-[#ff6f00]" />
                        {activeShoot.lighting}
                      </div>
                      <h3 className="text-2xl font-bold text-white">{activeShoot.label.split(' ')[1]} {activeShoot.label.split(' ')[2] || ''}</h3>
                      <p className="text-gray-300 text-sm font-mono">{activeShoot.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: The 4-Frame Coherence Strip */}
              <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
                
                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">4-Frame Occasion Continuity</h3>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    Notice how the outfit, lighting, and facial identity remain flawlessly consistent across different angles. This is what makes a profile believable.
                  </p>
                </div>

                {/* Frames Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {activeShoot.frames.map((frame, idx) => (
                    <div key={idx} className="space-y-2 group cursor-crosshair">
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/10 group-hover:border-[#ff6f00]/50 transition-colors bg-[#1a1a1a]">
                        <Image 
                          src={frame.url}
                          alt={frame.role}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="text-xs text-gray-500 font-mono uppercase tracking-wider group-hover:text-gray-300 transition-colors">
                        <span className="text-[#ff6f00] mr-1">[{idx + 1}]</span>
                        {frame.role}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Proof Tags */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-sm text-gray-300 bg-black/50 px-3 py-1.5 rounded-lg border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Exact Face Identity
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300 bg-black/50 px-3 py-1.5 rounded-lg border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Context-Aware Wardrobe
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300 bg-black/50 px-3 py-1.5 rounded-lg border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Natural Skin Texture
                  </div>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Global Stats Footer */}
        <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/10 pt-10">
          <div className="flex items-center gap-4 text-gray-400">
            <Layers className="w-6 h-6 text-[#ff6f00] shrink-0" />
            <p className="text-base sm:text-lg">
              <strong className="text-white">15 Complete Shoots. 60 Photos.</strong> Enough range to build the perfect 6-photo profile.
            </p>
          </div>
          <Link href="/dashboard">
            <Button className="bg-[#ff6f00] hover:bg-orange-500 text-black font-bold text-base h-12 px-8 rounded-full transition-transform hover:scale-105 active:scale-95 whitespace-nowrap">
              Build My Lineup — $39
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
