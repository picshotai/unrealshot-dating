
import PublicHeader from '@/components/Header'
import { HeroSection } from '@/components/main-landing/HeroSection'
import { PainSection } from '@/components/main-landing/PainSection'
import NewHowItWorks from '@/components/main-landing/NewHowItWorks'
import { FeaturesSection } from '@/components/main-landing/FeaturesSection'
import PremiumComparison from "@/components/main-landing/Comparison";
import ShootsShowcase from '@/components/main-landing/ShootsShowcase';
import PricingCards from '@/components/main-landing/pricing-cards'
import FAQSection from '@/components/main-landing/FAQSection'
import { CTASection } from '@/components/main-landing/CTASection'
import  Footer  from '@/components/main-landing/Footer'
import PrivacySection from "@/components/main-landing/PrivacySection";
import AuthorityLinks from "@/components/main-landing/AuthorityLinks";

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
      <div className="min-h-screen bg-white">
      <PublicHeader />
      <main>
        <HeroSection />
        <PainSection />
        <ShootsShowcase />
        <PremiumComparison />
        <FeaturesSection />
        <NewHowItWorks />
        <AuthorityLinks />
        <PrivacySection />
        <PricingCards />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
    </div>
  );
}
