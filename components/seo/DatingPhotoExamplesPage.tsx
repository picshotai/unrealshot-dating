import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import PublicHeader from "@/components/Header"
import Footer from "@/components/main-landing/Footer"
import { MultipleStructuredData } from "@/components/seo/StructuredData"
import { datingShoots, getDatingShoot } from "@/lib/dating-shoot-content"
import { makeBreadcrumbJsonLd, makeWebPageJsonLd, publicUrl } from "@/lib/public-seo"

const profileGaps = [
  {
    problem: "I need a clear, approachable first photo",
    solution: "Start with an everyday setting where your face remains the focus.",
    label: "See an approachable-output example",
    href: "#outdoor-coffee",
  },
  {
    problem: "My profile has no useful full-length photo",
    solution: "Use movement and an ordinary outfit instead of a stiff standing pose.",
    label: "See a full-length-output example",
    href: "#city-walk",
  },
  {
    problem: "My photos do not show what I actually enjoy",
    solution: "Choose an activity you genuinely do, then use one frame as a conversation starter.",
    label: "See an activity-output example",
    href: "#home-cooking",
  },
  {
    problem: "Everything in my camera roll looks too casual",
    solution: "Add one polished evening photo without turning the whole profile into a formal shoot.",
    label: "See a dressed-up-output example",
    href: "#dinner",
  },
]

const opener = getDatingShoot("outdoor-coffee")

export default function DatingPhotoExamplesPage() {
  const path = "/dating-photos/examples"
  const title = "AI dating photo examples: see possible UnrealShot results"
  const description = "See illustrative AI dating photo results and how UnrealShot turns varied shoot ideas into four related framing options. Examples are not selectable presets."
  const breadcrumbs = [
    { name: "Home", url: publicUrl("/", "en") },
    { name: "Dating Photos", url: publicUrl("/dating-photos", "en") },
    { name: "Examples", url: publicUrl(path, "en") },
  ]

  return (
    <div className="min-h-screen bg-[#f7f5f3] text-zinc-950">
      <PublicHeader />
      <main className="overflow-hidden pb-20 pt-24">
        <header className="mx-auto max-w-7xl px-5 py-14 text-center lg:py-20">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[.22em] text-[#ff6f00]">Dating photo examples</p>
            <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">See the kind of dating-photo results UnrealShot can create</h1>
            <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-zinc-600">These examples demonstrate possible creative directions and the four-frame structure used inside a delivery. They are not a catalog of presets, and you cannot select or guarantee these exact scenes. UnrealShot generates varied shoot ideas from your references and intake.</p>
            <ul className="mx-auto mt-7 w-fit space-y-3 text-left text-sm font-semibold text-zinc-700">
              {["Every image is labeled AI-generated", "Each example shows four related framing options", "The concepts illustrate possible results—not scenes to order"].map((item) => <li key={item} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#ff6f00]" />{item}</li>)}
            </ul>
            <a href="#choose-by-need" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#ff6f00] px-6 py-3.5 font-bold text-white shadow-lg shadow-orange-500/20">See how the results are structured <ArrowRight className="h-4 w-4" /></a>
          </div>

          {opener && <div className="mx-auto mt-12 max-w-5xl rounded-[2rem] bg-zinc-950 p-3 shadow-2xl"><div className="grid grid-cols-2 gap-3">{opener.frames.map((frame, index) => <figure key={frame.role} className="overflow-hidden rounded-2xl bg-zinc-900"><div className="relative aspect-[4/5]"><Image src={frame.src} alt={frame.alt} fill priority={index < 2} sizes="(max-width: 1024px) 50vw, 24vw" className="object-cover" /></div><figcaption className="px-3 py-2 text-xs font-bold text-white">{frame.role}</figcaption></figure>)}</div><p className="px-2 pb-1 pt-4 text-center text-xs leading-5 text-zinc-400">AI-generated outdoor coffee example · one setting, outfit and lighting setup</p></div>}
        </header>

        <section id="choose-by-need" className="border-y border-zinc-200 bg-white py-20">
          <div className="mx-auto max-w-7xl px-5">
            <p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">Start with your current profile</p>
            <h2 className="mt-3 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl">See how different outputs can fill different profile gaps</h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-600">The examples below help you understand the roles a generated delivery can cover. They do not represent an order form or promise that the named concepts will appear in your results.</p>
            <div className="mt-10 grid gap-5 md:grid-cols-2">{profileGaps.map((gap) => <a key={gap.problem} href={gap.href} className="rounded-3xl border border-zinc-200 bg-[#f7f5f3] p-7 transition hover:border-[#ff6f00]"><h3 className="text-xl font-black">{gap.problem}</h3><p className="mt-3 leading-7 text-zinc-600">{gap.solution}</p><span className="mt-5 inline-flex items-center gap-1 font-bold text-[#ff6f00]">{gap.label} <ArrowRight className="h-4 w-4" /></span></a>)}</div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20">
          <p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">Illustrative outputs</p>
          <h2 className="mt-3 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl">See how one generated idea becomes four related options</h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-600">Each row demonstrates one possible idea and four framing alternatives from it. The named concepts are examples only. Your order receives newly generated ideas shaped by your intake, not these exact presets.</p>

          <div className="mt-12 space-y-12">
            {datingShoots.map((shoot) => (
              <article id={shoot.slug} key={shoot.slug} className="scroll-mt-28 overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
                <div className="grid grid-cols-2 gap-px bg-zinc-200 sm:grid-cols-4">
                  {shoot.frames.map((frame) => <figure key={frame.role} className="bg-white"><div className="relative aspect-[4/5]"><Image src={frame.src} alt={frame.alt} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" /></div><figcaption className="border-t border-zinc-100 px-4 py-3"><strong className="block text-sm">{frame.role}</strong><span className="mt-1 block text-xs leading-5 text-zinc-500">AI-generated example</span></figcaption></figure>)}
                </div>
                <div className="grid gap-7 p-7 lg:grid-cols-[1fr_.85fr] lg:p-10">
                  <div><p className="text-xs font-black uppercase tracking-[.18em] text-[#ff6f00]">Illustrative creative direction</p><h3 className="mt-2 text-3xl font-black">{shoot.name} example</h3><p className="mt-4 max-w-3xl leading-7 text-zinc-600">{shoot.answer}</p></div>
                  <dl className="space-y-4 rounded-2xl bg-[#f7f5f3] p-6"><div><dt className="text-xs font-black uppercase tracking-wide text-zinc-500">Where it fits</dt><dd className="mt-1 leading-6 text-zinc-700">{shoot.profileFit}</dd></div><div><dt className="text-xs font-black uppercase tracking-wide text-zinc-500">What to use beside it</dt><dd className="mt-1 leading-6 text-zinc-700">{shoot.pairing}</dd></div></dl>
                </div>
                <div className="border-t border-zinc-200 px-7 py-5 lg:px-10"><Link href={`/dating-photos/shoots/${shoot.slug}`} className="inline-flex items-center gap-2 font-bold text-[#ff6f00]">See how this illustrative example is structured <ArrowRight className="h-4 w-4" /></Link></div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5">
          <div className="rounded-[2rem] bg-zinc-950 p-8 text-white sm:p-12">
            <p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6f00]">Before you use a generated photo</p>
            <h2 className="mt-3 text-3xl font-black">Use the frame that still looks and feels like you</h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">Your results depend on your reference selfies and intake. Review the ideas UnrealShot generates and remove any frame that changes your appearance or suggests an interest you do not have. A Photo Retake can correct an individual miss, but UnrealShot does not promise perfect likeness, app verification, matches or dates.</p>
            <div className="mt-8 flex flex-wrap gap-4"><Link href="/how-it-works" className="rounded-xl border border-zinc-700 px-5 py-3 font-bold">See how generation works</Link><Link href="/dashboard" className="rounded-xl bg-[#ff6f00] px-5 py-3 font-bold">Create photos for my profile</Link></div>
          </div>
        </section>
      </main>
      <Footer />
      <MultipleStructuredData schemas={[
        { id: "examples-page", data: makeWebPageJsonLd({ name: title, description, url: publicUrl(path, "en"), locale: "en", breadcrumbs }) },
        { id: "examples-breadcrumb", data: makeBreadcrumbJsonLd(breadcrumbs) },
      ]} />
    </div>
  )
}
