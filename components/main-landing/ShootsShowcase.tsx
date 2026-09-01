'use client';

import React from 'react';
import Image from 'next/image';

const baseImages = [
  '/images/demo14.jpg', '/images/aimodel2.jpg', '/images/aimodel5.jpg', '/images/aimodel8.jpg',
  '/new-landing/mountain-layby-motorcycle_2.png', '/images/demo3.jpg', '/images/demo10.jpg', '/images/demo11.jpg',
  '/images/demo12.jpg', '/images/demo13.jpg', '/images/full-body-photo.webp', '/images/candid-solo.webp',
  '/new-landing/training-floor-morning-2.png', '/new-landing/training-floor-morning-1.png', '/images/demo6.jpg', '/images/demo8.jpg',
  '/images/aimodel1.jpg', '/images/aimodel3.jpg', '/images/aimodel4.jpg', '/images/aimodel6.jpg',
  '/images/aimodel7.jpg', '/images/hero4.webp', '/images/cinematic-photo.webp', '/images/golden-photo.webp',
  '/new-landing/01616e3c4bb24641b1f623e80cea9e12.jpg', '/new-landing/29ecda7f13764ee595abe3c9be049ddb.jpg', '/new-landing/2ba004de6cf9475b82150b7bd1ff4807.jpg', '/new-landing/4436e4eadfa843ab94ad12db98a8664b.jpg',
  '/new-landing/49f810cc6e4344b480aadb5df98f6d7d.jpg', '/new-landing/519170ac2c004900af87f015bf5a1771.jpg', '/new-landing/7545cc16b7a94c059fb42bba5aa0ec03.jpg', '/new-landing/758bff1bb9d64242badcae3db5b9da54.jpg',
  '/new-landing/8cf00013ec6f459f986d903e2c55b6bd.jpg', '/new-landing/98d351a9c32544b6a6cf67f849b3709d.jpg', '/new-landing/9f8c395288d14566a2082aa1f97f1a8d.jpg', '/new-landing/b0e37df119704fc3a10d49b8eb3d3e05.jpg',
  '/new-landing/d46441e7fade4496ac0415207e1bd999.jpg', '/new-landing/d8800712954d45639eb5caa2ab54f3e4.jpg', '/new-landing/e6dc622a63504a7bab9846e0c904750b.jpg', '/new-landing/ed0d2abb04e84ccca0af74ac8c4b4838.jpg',
  '/new-landing/fa9c4cc3f3a3413c8ae0e898869f1f49.jpg', '/new-landing/jzimL01q4n-HYR3LGOpNd_edd9c15406384b23a4881168a98275d2.jpg', '/new-landing/mountain-layby-motorcycle_4.png', '/new-landing/qypjwusLmXPBiDK6QDNwN_185eda5c96bc4c2ba32d238a42ba51a9.jpg',
  '/new-landing/SHnKUu0hqzogDc12-W8eP_24713af628db4f8b95aba0dc06caf9a6.jpg', '/images/demo1.jpg', '/images/demo2.jpg', '/images/demo5.jpg',
  '/images/demo7.jpg', '/images/demo9.jpg'
];

// Duplicate the array to ensure we have enough images for ultra-wide screens (100 images)
const allImages = [...baseImages, ...baseImages];

export default function ShootsShowcase() {
  const columns = 20;
  const rows = 5;

  return (
    <section id="style-packs" className="relative w-full h-screen min-h-[700px] max-h-[1200px] bg-[#111111] overflow-hidden flex items-center justify-center">
      
      {/* 
        Explicit vh-based sizing ensures 5 rows fit perfectly vertically 
        on EVERY screen, and prevents browser flex collapse bugs. 
      */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-3 sm:gap-4">
        {[...Array(columns)].map((_, colIndex) => {
          const columnImages = allImages.slice(colIndex * rows, (colIndex + 1) * rows);
          
          return (
            <div 
              key={colIndex} 
              className={`flex flex-col gap-3 sm:gap-4 transition-transform duration-500 ${colIndex % 2 === 0 ? 'translate-y-[5%]' : '-translate-y-[5%]'}`}
            >
              {columnImages.map((img, i) => (
                <div 
                  key={i} 
                  className="relative h-[16vh] lg:h-[18vh] aspect-[3/4] rounded-lg sm:rounded-2xl overflow-hidden opacity-60 hover:opacity-100 transition-opacity duration-300 shadow-lg shrink-0"
                >
                  <Image 
                    src={img} 
                    alt="UnrealShot AI Photo Gallery" 
                    fill 
                    className="object-cover"
                    sizes="(max-width: 640px) 200px, 300px"
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Deep vignette overlay to blend edges seamlessly into the #111111 background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#111111_90%)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#111111] via-transparent to-[#111111] pointer-events-none opacity-95" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-transparent to-[#111111] pointer-events-none opacity-90" />
      
    </section>
  );
}
