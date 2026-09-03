import PublicHeader from "@/components/Header"
import Footer from "@/components/main-landing/Footer"
import { MultipleStructuredData } from "@/components/seo/StructuredData"
import ShootLandingHero from "@/components/seo/shoot-landing/ShootLandingHero"
import ShootPainSolution from "@/components/seo/shoot-landing/ShootPainSolution"
import ShootResultsShowcase from "@/components/seo/shoot-landing/ShootResultsShowcase"
import ShootConversionSections, { commonShootFaqs } from "@/components/seo/shoot-landing/ShootConversionSections"
import type { DatingShoot } from "@/lib/dating-shoot-content"
import { getShootLandingContent } from "@/lib/dating-shoot-landing-content"
import { makeBreadcrumbJsonLd, makeFaqJsonLd, makeWebPageJsonLd, publicUrl } from "@/lib/public-seo"

export default function ShootPage({ shoot }: { shoot: DatingShoot }) {
  const copy = getShootLandingContent(shoot.slug)
  if (!copy) throw new Error(`Missing commercial landing content for ${shoot.slug}`)

  const path = `/dating-photos/shoots/${shoot.slug}`
  const breadcrumbs = [
    { name: "Home", url: publicUrl("/", "en") },
    { name: "Dating Photos", url: publicUrl("/dating-photos", "en") },
    { name: "Examples", url: publicUrl("/dating-photos/examples", "en") },
    { name: shoot.name, url: publicUrl(path, "en") },
  ]
  const faqs = [...copy.faqs, ...commonShootFaqs]

  return (
    <div className="min-h-screen bg-white font-[family-name:var(--font-inter)] text-zinc-950">
      <PublicHeader />
      <main>
        <ShootLandingHero shoot={shoot} copy={copy} />
        <ShootPainSolution shoot={shoot} copy={copy} />
        <ShootResultsShowcase shoot={shoot} copy={copy} />
        <ShootConversionSections shoot={shoot} copy={copy} />
      </main>
      <Footer />
      <MultipleStructuredData schemas={[
        { id: "shoot-page", data: makeWebPageJsonLd({ name: copy.seoTitle, description: copy.seoDescription, url: publicUrl(path, "en"), locale: "en", breadcrumbs }) },
        { id: "shoot-breadcrumb", data: makeBreadcrumbJsonLd(breadcrumbs) },
        { id: "shoot-faq", data: makeFaqJsonLd(faqs) },
      ]} />
    </div>
  )
}
