import type React from "react"
import { Button } from "./ui/Button"
import Link from "next/link"

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex flex-col md:grid md:grid-cols-12 border-b border-foreground/10">
      {/* Left Content */}
      <div className="md:col-span-7 flex flex-col justify-center p-6 md:p-12 lg:p-20 border-r border-foreground/10 relative">
        <div className="mb-6 font-mono text-xs text-foreground/40">
          // THE DATING PROFILE <span className="text-accent font-bold">PHOTOSHOOT</span>
        </div>

        <h1 className="font-display text-4xl sm:text-7xl lg:text-8xl font-bold sm:leading-[0.9] sm:tracking-tighter uppercase mb-8">
          100 DATING PHOTOS. <br />
          <span className="text-transparent stroke-text">NO REPEATS.</span>
        </h1>

        <p className="font-mono text-foreground/70 text-sm md:text-base max-w-xl mb-10 leading-relaxed">
          Stop uploading awkward selfies and stiff corporate headshots. Unrealshot delivers 100 candid, natural photos pre-sorted into the 5 lineup roles dating apps ask you to fill — 100 distinct outfits, 100 distinct locations, and zero repeats.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-auto font-oxanium tracking-wide">
              Build Your 100-Photo Pack ($59)
            </Button>
          </Link>

          <span className="font-mono text-xs text-foreground/50 sm:max-w-[220px] max-w-full">
            [!] 100 unique outfits · 100 unique locations · 30 free re-shoots
          </span>
        </div>
      </div>

      {/* Right Visuals */}
      <div className="md:col-span-5 relative bg-[#050505] overflow-hidden group border-t md:border-t-0 border-foreground/10 aspect-[2/3] md:aspect-auto md:h-auto">
        <div className="absolute inset-0 grid grid-rows-2">
          {/* Image 1 */}
          <div className="relative overflow-hidden border-b border-foreground/10 h-full w-full">
            <img
              src="/hero2.png"
              alt="Dating Profile Opener Shot"
              className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-all duration-200 ease-linear"
            />
            <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur border border-foreground/20 px-2.5 py-1 text-[10px] font-mono uppercase text-foreground/80">
              // Natural daylight · Casual lead · 35mm focal length
            </div>
          </div>

          {/* Image 2 */}
          <div className="relative overflow-hidden h-full w-full">
            <img
              src="/images/hero4.webp"
              alt="Golden Hour Dating Photo"
              className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-all duration-200 ease-linear"
            />
            <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur border border-foreground/20 px-2.5 py-1 text-[10px] font-mono uppercase text-foreground/80">
              // Golden hour · Full body shot · Raw texture
            </div>
          </div>
        </div>

        {/* Center label */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-background font-mono text-xs font-bold px-3.5 py-1.5 uppercase tracking-widest rotate-90 md:rotate-0 z-10 pointer-events-none mix-blend-hard-light shadow-lg">
          100% UNIQUE FRAMES
        </div>
      </div>
    </section>
  )
}