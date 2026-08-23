import { EditorChrome } from "./EditorChrome";
import { LandingHero } from "./LandingHero";
import { ShootStory } from "./ShootStory";
import ProjectDeck from "./ProjectDeck";
import { HowItWorks } from "./HowItWorks";
import { OfferFaq } from "./OfferFaq";
import { FloatingCta, LandingFooter } from "./LandingFooter";

export function UnrealLandingPage() {
  return (
    <div className="unreal-landing relative min-h-screen cursor-auto overflow-clip bg-white font-[family-name:var(--font-inter)] text-black selection:bg-[#45c4f9]/35">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,.045) 1px, transparent 1px)",
          backgroundSize: "100px 100px",
        }}
      />
      <div className="relative z-10">
        <EditorChrome />
        <main>
          <LandingHero />
          <div aria-hidden="true" className="h-16 w-full overflow-hidden">
            <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="h-full w-[200%] -translate-x-1/4 stroke-black/15 stroke-[0.15]">
              <path d="M0 10 Q50 -5 100 10" fill="none" />
            </svg>
          </div>
          <ShootStory />
          <ProjectDeck />
          <HowItWorks />
          <OfferFaq />
        </main>
        <LandingFooter />
        <FloatingCta />
      </div>
    </div>
  );
}

