"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useAnimation } from "motion/react";
import { useEffect, useState } from "react";

function SelectionHandle({ className }: { className: string }) {
  return <span className={`absolute h-2 w-2 border border-white bg-black ${className}`} />;
}

const backgroundImages = [
  "/new-landing/01616e3c4bb24641b1f623e80cea9e12.jpg",
  "/new-landing/29ecda7f13764ee595abe3c9be049ddb.jpg",
  "/new-landing/2ba004de6cf9475b82150b7bd1ff4807.jpg",
  "/new-landing/3TZbYnm-kqNBZfoXDdx7W_f7197f805cd34f84b2252dcacd65ee49.jpg",
  "/new-landing/40fcfc106da3473496cb7bde4a9e9c61 (1).jpg",
  "/new-landing/4436e4eadfa843ab94ad12db98a8664b.jpg",
  "/new-landing/49f810cc6e4344b480aadb5df98f6d7d.jpg",
  "/new-landing/519170ac2c004900af87f015bf5a1771.jpg",
  "/new-landing/5cc8c2fbbd9a4e8b92ebbe72530d367e.jpg",
  "/new-landing/7545cc16b7a94c059fb42bba5aa0ec03.jpg",
  "/new-landing/758bff1bb9d64242badcae3db5b9da54.jpg",
  "/new-landing/8cf00013ec6f459f986d903e2c55b6bd.jpg",
  "/new-landing/98d351a9c32544b6a6cf67f849b3709d.jpg",
  "/new-landing/9f8c395288d14566a2082aa1f97f1a8d.jpg",
  "/new-landing/SHnKUu0hqzogDc12-W8eP_24713af628db4f8b95aba0dc06caf9a6.jpg",
  "/new-landing/ZvwZd8Jx-PREBesBKZF38_aa31a675ef8c43bcbc372bc78c2e2712.jpg",
  "/new-landing/b0e37df119704fc3a10d49b8eb3d3e05.jpg",
  "/new-landing/cf26ce46ee2b4559b3074b6df276b578.jpg",
  "/new-landing/d46441e7fade4496ac0415207e1bd999.jpg",
  "/new-landing/d8800712954d45639eb5caa2ab54f3e4.jpg",
  "/new-landing/e6dc622a63504a7bab9846e0c904750b.jpg",
  "/new-landing/ed0d2abb04e84ccca0af74ac8c4b4838.jpg",
  "/new-landing/fa9c4cc3f3a3413c8ae0e898869f1f49.jpg",
  "/new-landing/jzimL01q4n-HYR3LGOpNd_edd9c15406384b23a4881168a98275d2.jpg",
  "/new-landing/qypjwusLmXPBiDK6QDNwN_185eda5c96bc4c2ba32d238a42ba51a9.jpg",
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
