import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Check, X, Camera, Sparkles, MessageCircle, AlertCircle } from "lucide-react"
import PublicHeader from "@/components/Header"
import Footer from "@/components/main-landing/Footer"
import { MultipleStructuredData } from "@/components/seo/StructuredData"
import { getDatingShoot } from "@/lib/dating-shoot-content"
import { activityPageData } from "@/lib/dating-activity-content"
import { makeBreadcrumbJsonLd, makeFaqJsonLd, makeWebPageJsonLd, publicUrl } from "@/lib/public-seo"

const ctaClass = "inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff6f00] px-6 py-3.5 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-[#e96500]"

const heroShoots = ["home-cooking", "gym-training", "outdoor-coffee", "city-walk"]
  .map(getDatingShoot)
  .filter(Boolean)

export default function DatingActivityPage() {
  const content = activityPageData
  const breadcrumbs = [
    { name: "Home", url: publicUrl("/", "en") },
    { name: "Dating Photos", url: publicUrl("/dating-photos", "en") },
    { name: "Activity & Hobby Photos", url: publicUrl(content.path, "en") },
  ]

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${publicUrl(content.path, "en")}#service`,
    name: "AI Activity & Hobby Dating Photography for Men",
    serviceType: "Reference-guided AI lifestyle dating photo shoots",
    description: content.description,
    url: publicUrl(content.path, "en"),
    provider: { "@id": `${publicUrl("/", "en")}/#organization` },
    offers: {
      "@type": "Offer",
      price: "39",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: publicUrl("/pricing", "en"),
    },
  }

  return (
    <div className="min-h-screen bg-[#f7f5f3] text-zinc-950">
      <PublicHeader />
      <main className="overflow-hidden pt-24">
        {/* HERO SECTION */}
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.04fr_.96fr] lg:py-24">
          <div>
            <p className="text-xs font-black uppercase tracking-[.22em] text-[#ff6f00]">{content.eyebrow}</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.04] tracking-tight sm:text-6xl">{content.title}</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-600">{content.answer}</p>
            
            <ul className="mt-8 grid gap-3 text-sm font-semibold text-zinc-700 sm:grid-cols-2">
              {content.heroBullets.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-[#ff6f00]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/dashboard" className={ctaClass}>
                Create my activity photos <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#categories" className="font-bold text-zinc-700 underline decoration-zinc-300 underline-offset-4 hover:text-[#ff6f00]">
                Explore top 5 hobby styles ↓
              </Link>
            </div>
            <p className="mt-4 text-xs leading-5 text-zinc-500">
              Generated with reference-guided likeness · 15 shoots · 60 photos delivered in 30 minutes.
            </p>
          </div>

          <div className="relative rounded-[2rem] bg-zinc-950 p-3 shadow-2xl">
            <div className="grid grid-cols-2 gap-3">
              {heroShoots.map((shoot, index) => shoot && (
                <figure key={shoot.slug} className={`relative overflow-hidden rounded-2xl bg-zinc-800 ${index % 2 ? "translate-y-4" : "-translate-y-1"}`}>
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={shoot.frames[1].src}
                      alt={shoot.frames[1].alt}
                      fill
                      priority={index < 2}
                      sizes="(max-width: 1024px) 50vw, 24vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="absolute inset-x-2 bottom-2 rounded-lg bg-black/75 px-2 py-1.5 text-[10px] font-black uppercase tracking-wide text-white backdrop-blur">
                    {shoot.interest} · {shoot.name}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <section className="border-y border-zinc-200 bg-white py-10">
          <div className="mx-auto max-w-7xl px-5">
            <dl className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              {content.stats.map(([label, value]) => (
                <div key={label} className="border-l-2 border-[#ff6f00] pl-4">
                  <dt className="text-xs font-bold uppercase tracking-wider text-zinc-500">{label}</dt>
                  <dd className="mt-1 text-2xl font-black text-zinc-900 sm:text-3xl">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* WHY ACTIVITY PHOTOS FAIL (PAIN POINTS) */}
        <section className="border-b border-zinc-200 bg-white py-20">
          <div className="mx-auto max-w-7xl px-5">
            <p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">The camera roll trap</p>
            <h2 className="mt-3 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl">
              Why most men’s hobby photos fail on dating apps
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-600">
              When women swipe through a profile, they look for clues about your real-world lifestyle and personality. Weak activity photos either obscure your appearance or send the wrong social signals.
            </p>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {content.painPoints.map((point) => (
                <article key={point.title} className="rounded-3xl border border-zinc-200 bg-[#f7f5f3] p-7 transition hover:border-[#ff6f00]">
                  <span className="font-mono text-sm font-black text-[#ff6f00]">{point.number}</span>
                  <h3 className="mt-3 text-xl font-black">{point.title}</h3>
                  <div className="mt-4 space-y-3 text-sm leading-6">
                    <p className="text-red-700 flex gap-2">
                      <X className="h-4 w-4 shrink-0 mt-1 text-red-500" />
                      <span><strong>The Mistake:</strong> {point.problem}</span>
                    </p>
                    <p className="text-emerald-800 flex gap-2">
                      <Check className="h-4 w-4 shrink-0 mt-1 text-emerald-600" />
                      <span><strong>The Fix:</strong> {point.fix}</span>
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* THE 5 HIGH-IMPACT CATEGORIES */}
        <section id="categories" className="mx-auto max-w-7xl px-5 py-20">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">What actually works</p>
              <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">
                The 5 best hobby photo styles for men
              </h2>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600">
                These categories consistently generate the highest message response rates because they balance natural attractiveness, approachable warmth, and effortless conversation hooks.
              </p>
            </div>
            <Link href="/dating-photos/examples" className="font-black text-[#ff6f00] underline decoration-2 underline-offset-4">
              See full photo gallery →
            </Link>
          </div>

          <div className="mt-12 space-y-8">
            {content.categories.map((cat, idx) => {
              const shoot = getDatingShoot(cat.shootSlug)
              return (
                <article key={cat.title} className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm transition hover:shadow-md">
                  <div className="grid lg:grid-cols-[1.1fr_.9fr]">
                    <div className="p-8 sm:p-10 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-black text-[#ff6f00]">CATEGORY 0{idx + 1}</span>
                          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-700">{cat.vibe}</span>
                        </div>
                        <h3 className="mt-3 text-2xl font-black sm:text-3xl">{cat.title}</h3>
                        <p className="mt-4 leading-7 text-zinc-600">{cat.whyItWorks}</p>
                        
                        <div className="mt-6 rounded-2xl bg-[#f7f5f3] p-5 space-y-3 text-sm">
                          <p className="text-zinc-800 flex gap-2">
                            <Camera className="h-4 w-4 shrink-0 mt-0.5 text-[#ff6f00]" />
                            <span><strong>Framing & Photo Tip:</strong> {cat.photoTip}</span>
                          </p>
                          <p className="text-zinc-800 flex gap-2">
                            <MessageCircle className="h-4 w-4 shrink-0 mt-0.5 text-[#ff6f00]" />
                            <span><strong>Best Prompt Pairing:</strong> {cat.promptPairing}</span>
                          </p>
                        </div>
                      </div>

                      {shoot && (
                        <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
                          <Link href={`/dating-photos/shoots/${shoot.slug}`} className="inline-flex items-center gap-1.5 font-bold text-[#ff6f00] hover:underline">
                            View all 4 frames of this {shoot.name} shoot <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      )}
                    </div>

                    {shoot && (
                      <div className="grid grid-cols-2 gap-1 bg-zinc-100 p-2 sm:p-3">
                        <figure className="relative aspect-[4/5] overflow-hidden rounded-xl bg-zinc-200">
                          <Image src={shoot.frames[0].src} alt={shoot.frames[0].alt} fill sizes="(max-width: 1024px) 50vw, 22vw" className="object-cover" />
                          <figcaption className="absolute inset-x-1.5 bottom-1.5 rounded bg-black/70 px-2 py-1 text-[9px] font-bold text-white uppercase">{shoot.frames[0].role}</figcaption>
                        </figure>
                        <figure className="relative aspect-[4/5] overflow-hidden rounded-xl bg-zinc-200">
                          <Image src={shoot.frames[1].src} alt={shoot.frames[1].alt} fill sizes="(max-width: 1024px) 50vw, 22vw" className="object-cover" />
                          <figcaption className="absolute inset-x-1.5 bottom-1.5 rounded bg-black/70 px-2 py-1 text-[9px] font-bold text-white uppercase">{shoot.frames[1].role}</figcaption>
                        </figure>
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* 4 UNBREAKABLE PHOTOGRAPHY RULES */}
        <section className="bg-[#1b1816] py-20 text-white">
          <div className="mx-auto max-w-6xl px-5">
            <p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">Photography blueprint</p>
            <h2 className="mt-3 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl">
              4 rules for capturing believable lifestyle photos
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
              Whether you take these photos yourself or generate them with UnrealShot, adhere to these photographic principles to ensure your lineup looks natural, friend-taken, and authentic.
            </p>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {content.rules.map((rule) => (
                <article key={rule.rule} className="rounded-3xl border border-zinc-800 bg-zinc-900 p-7 sm:p-8 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-sm font-black text-[#ff6f00]">RULE {rule.rule}</span>
                    <h3 className="mt-2 text-2xl font-black">{rule.headline}</h3>
                    <p className="mt-4 leading-7 text-zinc-300">{rule.explanation}</p>
                  </div>
                  <div className="mt-6 space-y-2.5 rounded-2xl bg-zinc-950 p-4 text-xs leading-5">
                    <div className="flex gap-2 text-emerald-300">
                      <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                      <span><strong>DO:</strong> {rule.doExample}</span>
                    </div>
                    <div className="flex gap-2 text-red-300">
                      <X className="h-4 w-4 shrink-0 text-red-400" />
                      <span><strong>DON’T:</strong> {rule.dontExample}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* PLATFORM STRATEGY: HINGE, TINDER, BUMBLE */}
        <section className="mx-auto max-w-7xl px-5 py-20">
          <p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">App placement guide</p>
          <h2 className="mt-3 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl">
            Where to place activity photos on Hinge, Tinder & Bumble
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-600">
            Each app has a unique user psychology. Here is how to structure your activity photos for maximum engagement on each major dating app.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {content.platformStrategies.map((strat) => (
              <article key={strat.app} className="rounded-3xl border border-zinc-200 bg-white p-7 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black">{strat.app}</h3>
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-[#ff6f00]">{strat.idealSlot}</span>
                  </div>
                  <p className="mt-4 leading-7 text-zinc-600">{strat.strategy}</p>
                </div>
                <div className="mt-6 rounded-2xl bg-[#f7f5f3] p-4 text-xs leading-5 text-zinc-700">
                  <strong className="block text-zinc-900 font-bold mb-1">Prompt Tip:</strong>
                  {strat.promptAdvice}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { label: "Tinder photo guide", href: "/guides/tinder-photos" },
              { label: "Hinge photo guide", href: "/guides/hinge-photos" },
              { label: "Bumble photo guide", href: "/guides/bumble-photos" },
              { label: "Dating photos pillar", href: "/dating-photos" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-bold hover:border-[#ff6f00]">
                {item.label} →
              </Link>
            ))}
          </div>
        </section>

        {/* 4-PHOTO SHOOT SHOWCASE */}
        <section className="border-y border-zinc-200 bg-white py-20">
          <div className="mx-auto max-w-7xl px-5">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">Consistent 4-frame shoots</p>
                <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">
                  See how UnrealShot builds complete lifestyle scenes
                </h2>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600">
                  Each generated shoot delivers 4 coordinated frames: opener, half-body, full-length, and candid. Explore these real lifestyle examples to see how the lighting, wardrobe, and environment remain cohesive.
                </p>
              </div>
              <Link href="/dating-photos/examples" className="font-black text-[#ff6f00] underline decoration-2 underline-offset-4">
                Explore all examples →
              </Link>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {heroShoots.map((shoot) => shoot && (
                <Link key={shoot.slug} href={`/dating-photos/shoots/${shoot.slug}`} className="group overflow-hidden rounded-3xl border border-zinc-200 bg-[#f7f5f3] transition hover:border-[#ff6f00]">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={shoot.frames[0].src}
                      alt={shoot.frames[0].alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-bold uppercase text-[#ff6f00]">4 related frames</p>
                    <h3 className="mt-2 text-lg font-black">{shoot.name} shoot</h3>
                    <span className="mt-3 inline-block text-sm font-bold text-zinc-900 group-hover:text-[#ff6f00]">
                      View shoot details →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* COMPREHENSIVE AEO FAQ */}
        <section className="bg-[#f7f5f3] py-20">
          <div className="mx-auto max-w-4xl px-5">
            <p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">Frequently asked questions</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
              Activity & lifestyle photo FAQ
            </h2>
            <p className="mt-4 text-lg text-zinc-600">
              Expert advice on selecting, positioning, and generating natural activity photos for modern dating apps.
            </p>

            <div className="mt-10 divide-y divide-zinc-200 border-y border-zinc-200 bg-white rounded-3xl p-6 sm:p-8 shadow-sm">
              {content.faqs.map((faq) => (
                <article key={faq.question} className="py-6 first:pt-2 last:pb-2">
                  <h3 className="text-xl font-black text-zinc-900">{faq.question}</h3>
                  <p className="mt-3 text-base leading-7 text-zinc-600">{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* BOTTOM CTA BANNER */}
        <section className="mx-auto max-w-5xl px-5 py-20 text-center">
          <div className="rounded-[2rem] bg-zinc-950 px-7 py-14 text-white sm:px-12">
            <p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">
              $39 once · No subscription · 30-min delivery
            </p>
            <h2 className="mt-3 text-3xl font-black sm:text-5xl">
              Build your complete dating photo lineup today
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-300">
              Turn 4–6 reference selfies into 15 varied lifestyle shoots and 60 high-resolution photos, complete with 15 individual Photo Retakes.
            </p>
            <Link href="/dashboard" className={`${ctaClass} mt-8 px-8 py-4 text-lg`}>
              Create my dating photos <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />

      <MultipleStructuredData schemas={[
        { id: "activity-page", data: makeWebPageJsonLd({ name: content.title, description: content.description, url: publicUrl(content.path, "en"), locale: "en", breadcrumbs }) },
        { id: "activity-breadcrumbs", data: makeBreadcrumbJsonLd(breadcrumbs) },
        { id: "activity-service", data: serviceSchema },
        { id: "activity-faq", data: makeFaqJsonLd(content.faqs) },
      ]} />
    </div>
  )
}
