import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import PublicHeader from "@/components/Header"
import Footer from "@/components/main-landing/Footer"
import AuthorityContentPage from "@/components/seo/AuthorityContentPage"
import ShootPage from "@/components/seo/ShootPage"
import { MultipleStructuredData } from "@/components/seo/StructuredData"
import { authorityPages } from "@/lib/dating-authority-content"
import { datingShoots, getDatingShoot } from "@/lib/dating-shoot-content"
import { getLocalizedMetadata, makeBreadcrumbJsonLd, makeWebPageJsonLd, publicUrl } from "@/lib/public-seo"

type Params = { params: Promise<{ locale: string; seo: string[] }> }

function getPath(segments: string[]) {
  return `/${segments.join("/")}`
}

export function generateStaticParams() {
  return [
    ...Object.keys(authorityPages),
    "/dating-photos/examples",
    ...datingShoots.map((shoot) => `/dating-photos/shoots/${shoot.slug}`),
  ].map((path) => ({ locale: "en", seo: path.slice(1).split("/") }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, seo } = await params
  if (locale !== "en") return { robots: { index: false, follow: false } }
  const path = getPath(seo)
  const content = authorityPages[path]
  const shoot = path.startsWith("/dating-photos/shoots/") ? getDatingShoot(seo.at(-1) ?? "") : undefined
  if (!content && !shoot && path !== "/dating-photos/examples") return {}
  const title = content?.title ?? shoot?.title ?? "AI Dating Photo Examples: Seven Complete Shoots"
  const description = content?.description ?? shoot?.description ?? "See seven complete four-frame AI dating photo shoots, with captions explaining the role of every frame."
  return getLocalizedMetadata({ locale: "en", pathname: path, title, description, alternatePaths: { en: path } })
}

function ExamplesPage() {
  const path = "/dating-photos/examples"
  const title = "AI dating photo examples: seven complete shoots"
  const description = "See seven complete four-frame UnrealShot examples and learn how each frame contributes to a varied dating profile."
  const breadcrumbs = [{ name: "Home", url: publicUrl("/", "en") }, { name: "Dating Photos", url: publicUrl("/dating-photos", "en") }, { name: "Examples", url: publicUrl(path, "en") }]
  return <div className="min-h-screen bg-[#f7f5f3] text-zinc-900"><PublicHeader /><main className="pt-24 pb-20"><header className="mx-auto max-w-4xl px-5 py-14 text-center"><p className="mb-4 text-xs font-bold uppercase tracking-[.22em] text-[#e85d2a]">AI-generated product examples</p><h1 className="text-4xl font-bold tracking-tight sm:text-6xl">{title}</h1><p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-zinc-600">Each example is one coherent shoot: the same man, outfit, location and lighting across a close opener, half-body view, full-length frame and candid expression. These are product examples, not customer photos or evidence of match outcomes.</p></header>
    <section className="mx-auto max-w-7xl px-5"><div className="mb-12 grid overflow-hidden rounded-3xl border border-zinc-200 bg-white sm:grid-cols-3"><div className="p-6"><span className="text-sm text-zinc-500">Library shown</span><strong className="mt-1 block text-2xl">7 complete shoots</strong></div><div className="border-y border-zinc-200 p-6 sm:border-x sm:border-y-0"><span className="text-sm text-zinc-500">Frames explained</span><strong className="mt-1 block text-2xl">28 individual photos</strong></div><div className="p-6"><span className="text-sm text-zinc-500">Full package</span><strong className="mt-1 block text-2xl">15 shoots / 60 photos</strong></div></div>
      <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">{datingShoots.map((shoot) => <article key={shoot.slug} className="overflow-hidden rounded-3xl border border-zinc-200 bg-white"><Link href={`/dating-photos/shoots/${shoot.slug}`}><div className="relative aspect-[4/5]"><Image src={shoot.frames[0].src} alt={shoot.frames[0].alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" /></div><div className="p-6"><p className="text-xs font-bold uppercase tracking-wider text-[#c94e24]">AI-generated · four frames</p><h2 className="mt-2 text-2xl font-bold">{shoot.name}</h2><p className="mt-3 leading-7 text-zinc-600">{shoot.answer}</p><span className="mt-5 inline-block font-semibold text-[#c94e24]">View all four frames →</span></div></Link></article>)}</div>
      <div className="mx-auto mt-16 max-w-3xl rounded-3xl bg-zinc-950 p-8 text-white"><h2 className="text-2xl font-bold">What these examples can—and cannot—show</h2><p className="mt-4 leading-7 text-zinc-300">They show the intended scene coherence, framing roles and friend-taken look. Your results depend on your reference selfies and selections. A frame can miss likeness or composition, which is why the package includes 15 individual Photo Retakes. UnrealShot does not guarantee perfect likeness, app verification, matches or dates.</p><div className="mt-6 flex flex-wrap gap-3"><Link href="/how-it-works" className="rounded-full border border-zinc-700 px-4 py-2">How it works</Link><Link href="/realistic-ai-dating-photos" className="rounded-full border border-zinc-700 px-4 py-2">Realism method</Link><Link href="/dashboard" className="rounded-full bg-[#ff6f00] px-4 py-2 font-semibold">Create your shoots</Link></div></div>
    </section></main><Footer /><MultipleStructuredData schemas={[{ id: "examples-page", data: makeWebPageJsonLd({ name: title, description, url: publicUrl(path, "en"), locale: "en", breadcrumbs }) }, { id: "examples-breadcrumb", data: makeBreadcrumbJsonLd(breadcrumbs) }]} /></div>
}

export default async function SeoPage({ params }: Params) {
  const { locale, seo } = await params
  if (locale !== "en") notFound()
  const path = getPath(seo)
  if (path === "/dating-photos/examples") return <ExamplesPage />
  const shoot = path.startsWith("/dating-photos/shoots/") ? getDatingShoot(seo.at(-1) ?? "") : undefined
  if (shoot) return <ShootPage shoot={shoot} />
  const content = authorityPages[path]
  if (content) return <AuthorityContentPage content={content} />
  notFound()
}
