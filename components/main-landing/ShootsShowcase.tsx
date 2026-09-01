'use client';

import React from 'react';
import Carousal from '@/components/Carousal';

const row1Images = [
  '/images/demo14.jpg',
  '/images/aimodel2.jpg',
  '/images/aimodel5.jpg',
  '/images/aimodel8.jpg',
  '/new-landing/mountain-layby-motorcycle_2.png',
  '/images/demo3.jpg',
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
  '/images/golden-photo.webp'
];

const row3Images = [
  '/new-landing/01616e3c4bb24641b1f623e80cea9e12.jpg',
  '/new-landing/29ecda7f13764ee595abe3c9be049ddb.jpg',
  '/new-landing/2ba004de6cf9475b82150b7bd1ff4807.jpg',
  '/new-landing/4436e4eadfa843ab94ad12db98a8664b.jpg',
  '/new-landing/49f810cc6e4344b480aadb5df98f6d7d.jpg',
  '/new-landing/519170ac2c004900af87f015bf5a1771.jpg',
  '/new-landing/7545cc16b7a94c059fb42bba5aa0ec03.jpg',
  '/new-landing/758bff1bb9d64242badcae3db5b9da54.jpg',
  '/new-landing/8cf00013ec6f459f986d903e2c55b6bd.jpg',
  '/new-landing/98d351a9c32544b6a6cf67f849b3709d.jpg',
  '/new-landing/9f8c395288d14566a2082aa1f97f1a8d.jpg',
  '/new-landing/b0e37df119704fc3a10d49b8eb3d3e05.jpg'
];

const row4Images = [
  '/new-landing/d46441e7fade4496ac0415207e1bd999.jpg',
  '/new-landing/d8800712954d45639eb5caa2ab54f3e4.jpg',
  '/new-landing/e6dc622a63504a7bab9846e0c904750b.jpg',
  '/new-landing/ed0d2abb04e84ccca0af74ac8c4b4838.jpg',
  '/new-landing/fa9c4cc3f3a3413c8ae0e898869f1f49.jpg',
  '/new-landing/jzimL01q4n-HYR3LGOpNd_edd9c15406384b23a4881168a98275d2.jpg',
  '/new-landing/mountain-layby-motorcycle_4.png',
  '/new-landing/qypjwusLmXPBiDK6QDNwN_185eda5c96bc4c2ba32d238a42ba51a9.jpg',
  '/new-landing/SHnKUu0hqzogDc12-W8eP_24713af628db4f8b95aba0dc06caf9a6.jpg',
  '/images/demo1.jpg',
  '/images/demo2.jpg',
  '/images/demo5.jpg'
];

export default function ShootsShowcase() {
  return (
    <section id="style-packs" className="py-20 md:py-28 bg-[#111111] relative overflow-hidden">
      
      {/* Marquee Gallery - Full Width */}
      <div className="w-full space-y-4">
        <Carousal 
          images={row1Images} 
          imageAlt="UnrealShot AI Photo Gallery" 
          overlayLabel="Exact Face Identity"
          fromColor="from-[#111111]"
        />
        <Carousal 
          images={row2Images} 
          reverse={true} 
          imageAlt="UnrealShot AI Photo Gallery" 
          overlayLabel="Natural Micro-texture"
          fromColor="from-[#111111]"
        />
        <Carousal 
          images={row3Images} 
          imageAlt="UnrealShot AI Photo Gallery" 
          overlayLabel="Perfect Composition"
          fromColor="from-[#111111]"
        />
        <Carousal 
          images={row4Images} 
          reverse={true} 
          imageAlt="UnrealShot AI Photo Gallery" 
          overlayLabel="Consistent Wardrobe"
          fromColor="from-[#111111]"
        />
      </div>

    </section>
  );
}
