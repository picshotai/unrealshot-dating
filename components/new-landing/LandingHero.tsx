"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useAnimation } from "motion/react";
import { useEffect, useState } from "react";

function SelectionHandle({ className }: { className: string }) {
  return <span className={`absolute h-2 w-2 border border-white bg-black ${className}`} />;
}

const backgroundImages = [
  "/pages/dating_gym_photo.webp",
  "/pages/dating_gym_photo2.webp",
  "/pages/dating_gym_photo3.webp",
  "/pages/dating_gym_photo4.webp",
  "/pages/outdoor_coffee_closeup.webp",
  "/pages/outdoor_coffee_half_body.webp",
  "/pages/outdoor_coffee_full_body.webp",
  "/pages/outdoor_coffee_expression.webp",
  "/pages/dinner_closeup.webp",
  "/pages/dinner_candid_half_body.webp",
  "/pages/dinner_candid_full_body.webp",
  "/pages/dinner_candid_expression.webp",
  "/pages/city_walk_closeup.webp",
  "/pages/city_walk_candid.webp",
  "/pages/city_walk_mid_action.webp",
  "/pages/city_walk_looking_back.webp",
  "/pages/coastal_walk_closeup.webp",
  "/pages/coastal_walk_mid_action.webp",
  "/pages/coastal_walks_full_body.webp",
  "/pages/coastal_walk_candid.webp",
  "/pages/kitchen_shot_cooking.webp",
  "/pages/kitchen_shot_chopping.webp",
  "/pages/kitchen_shot_moving_out.webp",
  "/pages/kitchen_shot_food_testing.webp",
  "/pages/rooftop.webp",
  "/pages/rooftop2.webp",
  "/pages/rooftop3.webp",
  "/pages/rooftop4.webp",
  "/pages/hinge_closeup.webp",
  "/pages/hinge_half_body.webp",
  "/pages/hinge_full_body.webp",
  "/pages/hinge_expression.webp",
];

function AnimatedGridImage({ src, index }: { src: string; index: number }) {
  const controls = useAnimation();
  const [isPixelated, setIsPixelated] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const triggerRandomEffect = async () => {
      // Base delay so they don't all start at once, plus random interval between 2s and 12s
      const delay = Math.random() * 10000 + 2000;

      timeoutId = setTimeout(async () => {
        setIsPixelated(true);

        // This combination creates a cool glitchy/pixelated loading effect
        await controls.start({
          filter: ["blur(0px) contrast(1)", "blur(10px) contrast(1.5)", "blur(0px) contrast(1)"],
          scale: [1, 1.05, 1],
          opacity: [1, 0.7, 1],
          transition: { duration: 3, ease: "easeInOut" }
        });

        setIsPixelated(false);
        triggerRandomEffect();
      }, delay);
    };

    triggerRandomEffect();

    return () => clearTimeout(timeoutId);
  }, [controls]);

  return (
    <motion.div
      className="relative aspect-[3/4] w-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05, duration: 0.8 }}
    >
      <motion.div
        animate={controls}
        className="h-full w-full"
      >
        <Image
          src={src}
          alt="Studio photography"
          fill
          sizes="(max-width: 768px) 33vw, 20vw"
          className="object-cover"
        />
        {/* Adds an extra layer of structural 'blockiness' when animating */}
        {isPixelated && (
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[4px]" style={{ mixBlendMode: 'overlay' }} />
        )}
      </motion.div>
    </motion.div>
  );
}

export function LandingHero() {
  // Shuffle array for random placement (only on client to avoid hydration mismatch)
  const [shuffledImages, setShuffledImages] = useState<string[]>([]);

  useEffect(() => {
    setShuffledImages([...backgroundImages].sort(() => 0.5 - Math.random()));
  }, []);

  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-black py-20 lg:min-h-screen">

      {/* Background Image Grid */}
      <div className="absolute -inset-4 z-0 grid grid-cols-3 gap-2 opacity-100 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 lg:gap-4">
        {shuffledImages.slice(0, 28).map((src, index) => (
          <AnimatedGridImage key={src + index} src={src} index={index} />
        ))}
      </div>

      {/* Very light overlay just to take the edge off pure white images, completely removing the heavy black gradient */}
      <div className="absolute inset-0 z-0 bg-black/10" />

      {/* Center Content Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 mx-4 flex max-w-[680px] flex-col items-center border border-white/20 bg-black/30 p-6 pt-8 text-center shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:p-8 lg:p-10"
      >
        <SelectionHandle className="-left-1 -top-1" />
        <SelectionHandle className="-right-1 -top-1" />
        <SelectionHandle className="-bottom-1 -left-1" />
        <SelectionHandle className="-bottom-1 -right-1" />

        <div className="mb-5 flex items-center gap-2 border border-white/20 px-3 py-1 font-mono text-[9px] font-bold tracking-[0.2em] text-white/70 sm:text-[10px]">
          <span className="h-1.5 w-1.5 bg-[#ec2578] shadow-[0_0_8px_#ec2578]" />
          DATING PROFILE STUDIO
        </div>

        <h1 className="font-oxanium text-[clamp(1.5rem,4vw,3rem)] font-semibold leading-[1.05] tracking-tight text-white">
          Your camera roll should look like a life, <br />
          <span className="text-white/80">not a stock library.</span>
        </h1>

        <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-white/80 sm:text-[16px]">
          We build fifteen coherent photoshoots from 4–6 selfies. Different places, outfits, and light—without turning you into a different person.
        </p>

        <div className="mt-8 flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="group flex h-12 w-full items-center shadow-sm transition-transform hover:-translate-y-1 sm:h-14 sm:w-auto"
          >
            <span className="flex h-full w-full items-center justify-center bg-white px-5 font-mono text-[11px] font-bold tracking-[0.12em] text-black sm:w-auto sm:px-6">
              BUILD MY PROFILE — $39
            </span>
            <span className="grid h-full w-14 shrink-0 place-items-center border-l-2 border-dashed border-black bg-[#45c4f9] text-lg text-black transition-colors group-hover:bg-[#f7b733]">
              ↗
            </span>
          </Link>

          <a
            href="#shoots"
            className="group flex h-12 w-full items-center border border-white/30 bg-black/20 shadow-sm transition-transform hover:-translate-y-1 sm:h-14 sm:w-auto"
          >
            <span className="flex h-full w-full items-center justify-center px-5 font-mono text-[11px] font-bold tracking-[0.12em] text-white sm:w-auto sm:px-6">
              SEE THE SYSTEM
            </span>
            <span className="grid h-full w-14 shrink-0 place-items-center border-l-2 border-dashed border-white/30 text-lg text-white transition-colors group-hover:bg-white/10">
              ↓
            </span>
          </a>
        </div>

        <p className="mt-8 font-mono text-[9px] font-semibold tracking-[0.15em] text-white/40">
          ONE-TIME PURCHASE · 15 PHOTO RETAKES INCLUDED
        </p>
      </motion.div>
    </section>
  );
}
