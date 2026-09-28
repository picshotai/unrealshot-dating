
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

export function UnrealLandingPage() {
  return (
    <div className="unreal-landing relative min-h-screen cursor-auto overflow-clip bg-white font-[family-name:var(--font-inter)] text-black selection:bg-[#ff6f00]/25">
      <div className="min-h-screen bg-white">
      <PublicHeader />
      <main>
        <HeroSection />
        <PainSection />
        <ShootsShowcase />
        <PremiumComparison />
        <FeaturesSection />
        <NewHowItWorks />
        <PricingCards />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
    </div>
  );
}
