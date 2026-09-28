'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import landing from './landing-system.module.css';

const baseImages = [
  // Col 1: Coffee, Gym, City, Dinner
  '/pages/outdoor_coffee_closeup.webp',
  '/pages/dating_gym_photo2.webp',
  '/pages/city_walk_mid_action.webp',
  '/pages/dinner_candid_expression.webp',

  // Col 2: Rooftop, Kitchen, Coastal, Hinge
  '/pages/rooftop3.webp',
  '/pages/kitchen_shot_chopping.webp',
  '/pages/coastal_walks_full_body.webp',
  '/pages/hinge_expression.webp',

  // Col 3: Gym, Coffee, City, Rooftop
  '/pages/dating_gym_photo.webp',
  '/pages/outdoor_coffee_half_body.webp',
  '/pages/city_walk_candid.webp',
  '/pages/rooftop.webp',

  // Col 4: Dinner, Coastal, Kitchen, Tinder
  '/pages/dinner_closeup.webp',
  '/pages/coastal_walk_mid_action.webp',
  '/pages/kitchen_shot_moving_out.webp',
  '/pages/tinder_expression_shoot.webp',

  // Col 5: City, Rooftop, Gym, Coffee
  '/pages/city_walk_closeup.webp',
  '/pages/rooftop2.webp',
  '/pages/dating_gym_photo3.webp',
  '/pages/outdoor_coffee_expression.webp',

  // Col 6: Coastal, Kitchen, Dinner, City
  '/pages/coastal_walk_closeup.webp',
  '/pages/kitchen_shot_cooking.webp',
  '/pages/dinner_candid_half_body.webp',
  '/pages/city_walk_looking_back.webp',

  // Col 7: Hinge, Tinder, Dating Profile, Coastal
  '/pages/hinge_closeup.webp',
  '/pages/tinder_half_body.webp',
  '/pages/dating_photos_candid.webp',
  '/pages/coastal_walk_candid.webp',

  // Col 8: Tinder, Kitchen, Rooftop, Gym
  '/pages/tinder_closeup.webp',
  '/pages/kitchen_shot_food_testing.webp',
  '/pages/rooftop4.webp',
  '/pages/dating_gym_photo4.webp',

  // Col 9: Dating Anchor, Hinge, Outdoor Coffee, Dinner
  '/pages/dating_photos_hero_closeup.webp',
  '/pages/hinge_half_body.webp',
  '/pages/outdoor_coffee_full_body.webp',
  '/pages/dinner_candid_full_body.webp',

  // Col 10: Hinge Full, Tinder Full, City Back, Dating Profile
  '/pages/hinge_full_body.webp',
  '/pages/tinder_full_body.webp',
  '/pages/city_walk_candid_back.webp',
  '/pages/dating_photos_expression.webp',
  '/pages/dating_photos_half_body.webp',
];

// Duplicate the array to ensure we have enough images for ultra-wide screens (100+ images)
const allImages = [...baseImages, ...baseImages, ...baseImages];

export default function ShootsShowcase() {
  const t = useTranslations('Home.hero');
  const showcase = useTranslations('Home.showcase');
  const columns = 25; // increased columns slightly to ensure we still fill wide screens since photos are fewer
  const rows = 4;

  return (
    <section id="style-packs" className="relative w-full h-screen min-h-[700px] max-h-[1200px] bg-[#111111] overflow-hidden flex items-center justify-center">

      {/* 
        Explicit vh-based sizing ensures 4 rows fit perfectly vertically 
        on EVERY screen, making photos beautifully large. 
      */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-3 sm:gap-4">
        {[...Array(columns)].map((_, colIndex) => {
          const columnImages = allImages.slice((colIndex * rows) % allImages.length, ((colIndex * rows) % allImages.length) + rows);

          return (
            <div
              key={colIndex}
              className={`flex flex-col gap-3 sm:gap-4 transition-transform duration-500 ${colIndex % 2 === 0 ? 'translate-y-[6%]' : '-translate-y-[6%]'}`}
            >
              {columnImages.map((img, i) => (
                <div
                  key={i}
                  className="relative h-[20vh] lg:h-[23vh] aspect-[3/4] rounded-lg sm:rounded-2xl overflow-hidden opacity-75 hover:opacity-100 transition-opacity duration-300 shadow-xl shrink-0"
                >
                  <Image
                    src={img}
                    alt={t('showcaseAlt')}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 250px, 400px"
                  />
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {/* Much lighter fade overlay just on the top and bottom to blend with the page */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#111111] via-transparent to-[#111111] pointer-events-none opacity-80" style={{ backgroundImage: 'linear-gradient(to bottom, #111111 0%, transparent 15%, transparent 85%, #111111 100%)' }} />
      <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-transparent to-[#111111] pointer-events-none opacity-40" style={{ backgroundImage: 'linear-gradient(to right, #111111 0%, transparent 5%, transparent 95%, #111111 100%)' }} />

      {/* Headline over the wall: a soft radial scrim keeps the photos visible at the edges */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_62%_48%_at_center,rgba(10,10,10,0.9)_0%,rgba(10,10,10,0.7)_45%,rgba(10,10,10,0)_78%)] sm:bg-[radial-gradient(ellipse_46%_44%_at_center,rgba(10,10,10,0.9)_0%,rgba(10,10,10,0.68)_50%,rgba(10,10,10,0)_80%)]" />
      <div className={`${landing.onDark} relative z-10 mx-auto max-w-2xl px-6 text-center`}>
        <p className={landing.eyebrow}>{showcase('eyebrow')}</p>
        <h2 className={landing.title}>
          {showcase('title')} <span className={landing.accent}>{showcase('titleAccent')}</span>
        </h2>
        <p className={landing.lead}>{showcase('description')}</p>
      </div>

    </section>
  );
}
