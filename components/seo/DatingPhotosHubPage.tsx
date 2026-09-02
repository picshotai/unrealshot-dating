import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Check, X } from "lucide-react"
import PublicHeader from "@/components/Header"
import Footer from "@/components/main-landing/Footer"
import { MultipleStructuredData } from "@/components/seo/StructuredData"
import { datingShoots, getDatingShoot } from "@/lib/dating-shoot-content"
import { datingHubFaqs, datingHubMethod, datingHubProblems, datingHubRoles, datingHubSpokes } from "@/lib/dating-hub-content"
import { makeBreadcrumbJsonLd, makeFaqJsonLd, makeWebPageJsonLd, publicUrl } from "@/lib/public-seo"

const ctaClass = "inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff6f00] px-6 py-3.5 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-[#e96500]"

const heroShoots = ["outdoor-coffee", "city-walk", "home-cooking", "dinner"]
  .map(getDatingShoot)
  .filter(Boolean)

export default function DatingPhotosHubPage() {
  const path = "/dating-photos"
  const title = "Dating profile photos for men that build a complete, believable lineup"
  const description = "Learn the six photo roles a dating profile needs and create 15 coherent AI dating shoots with 60 photos, 15 retakes and 30-minute delivery for $39."
  const breadcrumbs = [
    { name: "Home", url: publicUrl("/", "en") },
    { name: "Dating Photos", url: publicUrl(path, "en") },
  ]
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${publicUrl(path, "en")}#service`,
    name: "AI dating photography for men",
    serviceType: "Reference-guided AI dating photo shoots",
    description,
    url: publicUrl(path, "en"),
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
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.04fr_.96fr] lg:py-24">
          <div>
            <p className="text-xs font-black uppercase tracking-[.22em] text-[#ff6f00]">The dating profile photo hub</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.04] tracking-tight sm:text-6xl">Dating profile photos for men that look like one real life</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-600">Stop trying to build an entire dating profile from one decent selfie. UnrealShot turns 4–6 current references into 15 coherent four-photo shoots: clear openers, full-length choices, real-interest activities, relaxed candids and dressed-up context delivered within 30 minutes.</p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-zinc-700">
              {["15 complete shoots", "60 total photos", "15 Photo Retakes", "$39 once · no subscription"].map((item) => <span key={item} className="flex items-center gap-2"><Check className="h-4 w-4 text-[#ff6f00]" />{item}</span>)}
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/dashboard" className={ctaClass}>Create my dating photos <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/dating-photos/examples" className="font-bold underline decoration-zinc-300 underline-offset-4">See dating photo examples</Link>
            </div>
            <p className="mt-4 text-xs leading-5 text-zinc-500">No algorithm tailoring, match guarantee or verification promise. Every generated example is labeled.</p>
          </div>

          <div className="relative rounded-[2rem] bg-zinc-950 p-3 shadow-2xl">
            <div className="grid grid-cols-2 gap-3">
              {heroShoots.map((shoot, index) => shoot && (
                <figure key={shoot.slug} className="relative overflow-hidden rounded-2xl bg-zinc-800">
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={shoot.frames[index].src}
                      alt={shoot.frames[index].alt}
                      fill
                      priority={index < 2}
                      sizes="(max-width: 1024px) 50vw, 24vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="absolute inset-x-2 bottom-2 rounded-lg bg-black/75 px-2 py-1.5 text-[10px] font-black uppercase tracking-wide text-white backdrop-blur">
                    AI-generated · {shoot.frames[index].role}
                  </figcaption>
                </figure>
              ))}
            </div>

          </div>
        </section>

        <section className="border-y border-zinc-200 bg-white py-20">
          <div className="mx-auto max-w-7xl px-5">
            <p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">Why the camera roll fails</p>
            <h2 className="mt-3 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl">Your profile is not missing one perfect photo. It is missing a complete visual answer.</h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-600">Someone looking at a dating profile is trying to understand one current person: face, build, style, expression, interests and everyday context. Weak profiles leave those questions unanswered or repeat the same answer several times.</p>
            <div className="mt-12 grid gap-5 md:grid-cols-3">{datingHubProblems.map((problem, index) => <article key={problem.title} className="rounded-3xl border border-zinc-200 bg-[#f7f5f3] p-7"><span className="font-mono text-sm font-black text-[#ff6f00]">0{index + 1}</span><h3 className="mt-3 text-xl font-black">{problem.title}</h3><p className="mt-3 leading-7 text-zinc-600">{problem.body}</p></article>)}</div>
            <div className="mt-10 grid gap-5 rounded-3xl bg-zinc-950 p-7 text-white md:grid-cols-2 md:p-10"><div><p className="text-xs font-black uppercase tracking-[.18em] text-red-300">What weakens the lineup</p><ul className="mt-5 space-y-3 text-zinc-300">{["Six similar selfies add no new information", "Outdated or heavily edited photos blur current identity", "Invented activities make later conversations harder"].map((item) => <li key={item} className="flex gap-3"><X className="mt-1 h-4 w-4 shrink-0 text-red-400" />{item}</li>)}</ul></div><div><p className="text-xs font-black uppercase tracking-[.18em] text-emerald-300">The UnrealShot approach</p><ul className="mt-5 space-y-3 text-zinc-300">{["Every selected image performs a different role", "Fifteen scenes create real setting and wardrobe range", "Four related frames let you choose the most accurate crop"].map((item) => <li key={item} className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />{item}</li>)}</ul></div></div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20">
          <p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">App guides & photo styles</p>
          <h2 className="mt-3 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl">Dating photos for every app, role and real interest</h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-600">Every dating app rewards a slightly different lineup. Explore our platform-specific photo strategies, deep-dive guides, and example shoots to build a profile that feels authentic and gets genuine matches.</p>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{datingHubSpokes.map((spoke) => { const shoot = getDatingShoot(spoke.shoot); return <Link key={spoke.href} href={spoke.href} className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white"><div className="relative aspect-[16/10] bg-zinc-100">{shoot && <Image src={shoot.frames[0].src} alt={shoot.frames[0].alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-300 group-hover:scale-[1.02]" />}</div><div className="p-6"><h3 className="text-xl font-black">{spoke.title}</h3><p className="mt-3 leading-7 text-zinc-600">{spoke.description}</p><span className="mt-5 inline-flex items-center gap-1 font-bold text-[#ff6f00]">Explore guide <ArrowRight className="h-4 w-4" /></span></div></Link>})}</div>
          <div className="mt-8 flex flex-wrap gap-3">{[{ label: "Tinder photo guide", href: "/guides/tinder-photos" }, { label: "Hinge photo guide", href: "/guides/hinge-photos" }, { label: "Bumble photo guide", href: "/guides/bumble-photos" }, { label: "How UnrealShot works", href: "/how-it-works" }].map((item) => <Link key={item.href} href={item.href} className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-bold hover:border-[#ff6f00]">{item.label} →</Link>)}</div>
        </section>

        <section className="bg-[#1b1816] py-20 text-white">
          <div className="mx-auto max-w-6xl px-5">
            <p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">The complete lineup</p>
            <h2 className="mt-3 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl">Six dating photo roles to cover before adding extras</h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">The exact order can change by app and by the strength of your available images. The important rule is that every photo should answer a different question.</p>
            <div className="mt-12 divide-y divide-zinc-800 border-y border-zinc-800">{datingHubRoles.map((role) => <article key={role.number} className="grid gap-3 py-7 md:grid-cols-[70px_240px_230px_1fr]"><span className="font-mono text-sm text-[#ff6f00]">{role.number}</span><h3 className="text-lg font-black">{role.title}</h3><p className="font-semibold text-zinc-400">{role.answer}</p><p className="leading-7 text-zinc-300">{role.body}</p></article>)}</div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20">
          <p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">The methodology</p>
          <h2 className="mt-3 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl">The anatomy of a believable AI dating photo lineup</h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-600">UnrealShot does not manipulate an app algorithm or engineer matches. Its methodology focuses on photographic and identity problems it can actually control: clarity, variety, scene consistency, truthful interests, useful crops and a correction path.</p>
          <div className="mt-10 overflow-x-auto rounded-3xl border border-zinc-200 bg-white"><table className="w-full min-w-[760px] border-collapse text-left"><thead className="bg-zinc-950 text-white"><tr><th className="p-5 text-sm">Element</th><th className="p-5 text-sm">What weak lineups do</th><th className="p-5 text-sm">UnrealShot’s approach</th></tr></thead><tbody>{datingHubMethod.map((row) => <tr key={row.element} className="border-t border-zinc-200 align-top"><th className="p-5 font-black">{row.element}</th><td className="p-5 leading-7 text-zinc-600">{row.weak}</td><td className="p-5 leading-7 text-zinc-700">{row.unrealshot}</td></tr>)}</tbody></table></div>
        </section>

        <section className="border-y border-zinc-200 bg-white py-20">
          <div className="mx-auto max-w-7xl px-5">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">Illustrative generated results</p><h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">See how one generated idea becomes four related options</h2><p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600">Each example demonstrates the four-frame structure: related setting, outfit and lighting with different crops and expressions. These named concepts are not a fixed menu, and purchasing does not guarantee or let you select the exact examples shown.</p></div><Link href="/dating-photos/examples" className="font-black text-[#ff6f00] underline decoration-2 underline-offset-4">See possible UnrealShot results →</Link></div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{datingShoots.map((shoot) => <Link key={shoot.slug} href={`/dating-photos/shoots/${shoot.slug}`} className="group overflow-hidden rounded-3xl border border-zinc-200 bg-[#f7f5f3]"><div className="relative aspect-[4/3]"><Image src={shoot.frames[0].src} alt={shoot.frames[0].alt} fill sizes="(max-width: 640px) 100vw, 25vw" className="object-cover transition duration-300 group-hover:scale-[1.02]" /></div><div className="p-5"><p className="text-xs font-bold uppercase text-[#ff6f00]">Illustrative output · 4 related frames</p><h3 className="mt-2 text-lg font-black">{shoot.name} example</h3><span className="mt-3 inline-block text-sm font-bold">See how this example works →</span></div></Link>)}</div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-20">
          <div className="grid gap-10 rounded-[2rem] bg-zinc-950 p-8 text-white lg:grid-cols-[1fr_.8fr] lg:p-12"><div><p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">From selfies to a complete set</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">15 shoots delivered within 30 minutes</h2><p className="mt-5 text-lg leading-8 text-zinc-300">Upload 4–6 recent solo selfies and answer three practical questions about your preferred look and genuine interests. UnrealShot uses those references to guide likeness; it does not train a custom model.</p><p className="mt-5 text-lg leading-8 text-zinc-300">The $39 one-time package contains 60 photos and 15 individual Photo Retakes. Use retakes when a useful scene contains one weak likeness, expression or composition.</p><div className="mt-8 flex flex-wrap gap-4"><Link href="/dashboard" className={ctaClass}>Create my 15 shoots</Link><Link href="/how-it-works" className="rounded-xl border border-zinc-700 px-6 py-3.5 font-bold">See the full process</Link></div></div><dl className="grid grid-cols-2 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">{[["References", "4–6 selfies"], ["Scenes", "15 shoots"], ["Output", "60 photos"], ["Retakes", "15 frames"], ["Delivery", "Within 30 min"], ["Price", "$39 once"]].map(([label, value]) => <div key={label} className="border-b border-r border-zinc-800 p-5"><dt className="text-xs uppercase tracking-wide text-zinc-500">{label}</dt><dd className="mt-2 font-black">{value}</dd></div>)}</dl></div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-5xl px-5">
            <p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">Dating photography questions</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Dating profile photo FAQ</h2>
            <div className="mt-10 divide-y divide-zinc-200 border-y border-zinc-200">{datingHubFaqs.map((faq) => <article key={faq.question} className="py-7"><h3 className="text-xl font-black">{faq.question}</h3><p className="mt-3 max-w-4xl leading-7 text-zinc-600">{faq.answer}</p></article>)}</div>
            <aside className="mt-10 rounded-3xl border border-zinc-200 bg-[#f7f5f3] p-7"><h2 className="text-xl font-black">Current app-policy sources</h2><p className="mt-2 text-sm leading-6 text-zinc-500">Platform requirements change. Review first-party guidance before updating your profile.</p><div className="mt-5 flex flex-wrap gap-4 text-sm font-bold text-[#ff6f00]">{[{ label: "Tinder Photo Verification", href: "https://www.help.tinder.com/hc/en-us/articles/360034941812-Photo-Verification" }, { label: "Hinge Prohibited Content", href: "https://help.hinge.co/hc/en-us/articles/42464295207187-Prohibited-Content-Behavior" }, { label: "Bumble Photo Guidance", href: "https://support.bumble.com/hc/en-us/articles/28523708029341-Uploading-profile-photos-and-videos" }].map((source) => <a key={source.href} href={source.href} target="_blank" rel="noreferrer" className="underline underline-offset-4">{source.label}</a>)}</div></aside>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 py-20 text-center"><div className="rounded-[2rem] bg-[#ff6f00] px-7 py-14 text-white"><p className="text-xs font-black uppercase tracking-[.2em] text-orange-100">Your camera roll does not need another random image</p><h2 className="mt-3 text-3xl font-black sm:text-5xl">Build the complete dating photo lineup</h2><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-orange-50">15 coherent shoots · 60 photos · 15 individual Photo Retakes · delivered within 30 minutes · $39 once.</p><Link href="/dashboard" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-7 py-4 font-black">Generate my dating photos <ArrowRight className="h-4 w-4" /></Link></div></section>
      </main>
      <Footer />
      <MultipleStructuredData schemas={[
        { id: "dating-hub-page", data: makeWebPageJsonLd({ name: title, description, url: publicUrl(path, "en"), locale: "en", breadcrumbs }) },
        { id: "dating-hub-breadcrumbs", data: makeBreadcrumbJsonLd(breadcrumbs) },
        { id: "dating-hub-service", data: serviceSchema },
        { id: "dating-hub-faq", data: makeFaqJsonLd(datingHubFaqs) },
      ]} />
    </div>
  )
}
