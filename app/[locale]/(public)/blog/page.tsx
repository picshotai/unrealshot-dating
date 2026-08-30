import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { getTranslations } from "next-intl/server"
import PublicHeader from "@/components/Header"
import Footer from "@/components/main-landing/Footer"
import BlogCard from "@/components/blog-card"
import { OfflineBanner } from "@/components/network-status"
import { Button } from "@/components/ui/button"
import {
  calculateReadingMinutes,
  cleanWordPressExcerpt,
  formatDate,
  getPostsByLocale,
  type WordPressPost,
} from "@/lib/wordpress-cms"
import { getLocalizedMetadata } from "@/lib/public-seo"
import { publicUrl } from "@/lib/public-seo"
import {
  isPublishedBlogLocale,
  localizePublicPathname,
  publishedBlogLocales,
  type PublishedBlogLocale,
} from "@/i18n/config"

export const revalidate = 600

type BlogPageProps = {
  params: Promise<{ locale: string }>
  searchParams?: Promise<{ after?: string | string[] }>
}

function getCursor(value: string | string[] | undefined): string | undefined {
  const cursor = Array.isArray(value) ? value[0] : value
  return cursor && cursor.length <= 512 ? cursor : undefined
}

export async function generateMetadata({ params, searchParams }: BlogPageProps): Promise<Metadata> {
  const { locale: routeLocale } = await params
  if (!isPublishedBlogLocale(routeLocale)) return { robots: { index: false, follow: false } }
  const locale = routeLocale as PublishedBlogLocale
  const query = searchParams ? await searchParams : undefined
  const after = getCursor(query?.after)
  const t = await getTranslations({ locale, namespace: "Blog.archive" })
  const metadata = getLocalizedMetadata({
    locale,
    pathname: "/blog",
    title: t("meta.title"),
    description: t("meta.description"),
    keywords: t.raw("meta.keywords") as string[],
    alternatePaths: Object.fromEntries(publishedBlogLocales.map((candidate) => [candidate, "/blog"])),
  })

  if (!after) return metadata

  const canonical = `${publicUrl("/blog", locale)}?after=${encodeURIComponent(after)}`
  return {
    ...metadata,
    alternates: { canonical },
    openGraph: metadata.openGraph ? { ...metadata.openGraph, url: canonical } : undefined,
    robots: { index: false, follow: true },
  }
}

function transformPost(post: WordPressPost, locale: PublishedBlogLocale, t: ReturnType<typeof getTranslations> extends Promise<infer T> ? T : never) {
  const title = post.title
  return {
    title,
    excerpt: cleanWordPressExcerpt(post.excerpt),
    slug: post.slug,
    publishedAt: formatDate(post.date, locale),
    readTime: t("readTime", { minutes: calculateReadingMinutes(post.content) }),
    category: post.categories?.nodes?.[0]?.name || t("categoryFallback"),
    image: post.featuredImage?.node?.sourceUrl || "/og-image.png",
    imageAlt: post.featuredImage?.node?.altText || t("imageAlt", { title }),
    readGuide: t("readGuide"),
  }
}

async function BlogContent({ locale, after }: { locale: PublishedBlogLocale; after?: string }) {
  const t = await getTranslations({ locale, namespace: "Blog.archive" })
  const page = await getPostsByLocale(locale, { first: 12, after })
  if (page.posts.length === 0) notFound()

  return (
    <BlogPageContent
      locale={locale}
      posts={page.posts.map((post) => transformPost(post, locale, t))}
      hasNextPage={page.pageInfo.hasNextPage}
      nextCursor={page.pageInfo.endCursor}
      isPaginated={Boolean(after)}
      t={t}
    />
  )
}

function BlogPageContent({
  locale,
  posts,
  hasNextPage,
  nextCursor,
  isPaginated,
  t,
}: {
  locale: PublishedBlogLocale
  posts: ReturnType<typeof transformPost>[]
  hasNextPage: boolean
  nextCursor: string | null
  isPaginated: boolean
  t: Awaited<ReturnType<typeof getTranslations>>
}) {
  const nextPageHref = hasNextPage && nextCursor
    ? `${localizePublicPathname("/blog", locale)}?after=${encodeURIComponent(nextCursor)}`
    : null

  return (
    <div className="min-h-screen bg-[#F7F5F3] font-[family-name:var(--font-inter)] text-gray-900 flex flex-col">
      <PublicHeader localeSwitcher={{ availableLocales: publishedBlogLocales }} />
      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <OfflineBanner />
          <div className="py-12 sm:py-16 text-center max-w-3xl mx-auto">
            <p className="text-orange-500 font-bold uppercase tracking-wider text-xs sm:text-sm mb-3 block">{t("eyebrow")}</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-[var(--font-inter-tight)] tracking-tight leading-[1.08] text-gray-900 mb-5">
              {t("title")} <br className="hidden sm:block" />
              <span className="text-[#ff6f00]">{t("titleAccent")}</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">{t("description")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((post) => <BlogCard key={post.slug} {...post} />)}
          </div>

          {(isPaginated || nextPageHref) && (
            <nav className="mt-10 flex justify-center gap-3" aria-label={t("paginationLabel")}>
              {isPaginated && (
                <Link href={localizePublicPathname("/blog", locale)} className="inline-flex items-center rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-800 shadow-sm hover:border-[#ff6f00] hover:text-[#ff6f00]">
                  {t("backToFirstPage")}
                </Link>
              )}
              {nextPageHref && (
              <Link href={nextPageHref} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-800 shadow-sm hover:border-[#ff6f00] hover:text-[#ff6f00]">
                {t("nextPage")} <ArrowRight className="h-4 w-4" />
              </Link>
              )}
            </nav>
          )}
        </div>

        <div className="mt-24 max-w-5xl mx-auto px-4">
          <div className="bg-[#111111] rounded-3xl p-8 sm:p-12 text-white text-center border-2 border-dashed border-zinc-800 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-[var(--font-inter-tight)]">{t("cta.heading")}</h2>
            <p className="text-gray-300 text-base sm:text-lg max-w-xl mx-auto mb-8">{t("cta.description")}</p>
            <Link href="/dashboard">
              <Button className="group relative bg-[#ff6f00] hover:bg-[#ff6f00]/90 text-white rounded-md overflow-hidden cursor-pointer px-8 pr-16 py-6 font-semibold text-base shadow-lg shadow-orange-500/20">
                {t("cta.button")}
                <span className="bg-white rounded-sm p-3 absolute right-1 top-1/2 -translate-y-1/2"><img src="/arrow.svg" alt="" className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" /></span>
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const { locale: routeLocale } = await params
  if (!isPublishedBlogLocale(routeLocale)) notFound()
  const query = searchParams ? await searchParams : undefined
  return <BlogContent locale={routeLocale} after={getCursor(query?.after)} />
}
