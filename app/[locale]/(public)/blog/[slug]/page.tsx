import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { ArrowLeft, Calendar, Clock, User } from "lucide-react"
import { Link as PublicLink } from "@/i18n/navigation"
import PublicHeader from "@/components/Header"
import Footer from "@/components/main-landing/Footer"
import BlogContentRenderer from "@/components/blog-content-renderer"
import ShareButton from "@/components/share-button"
import { Button } from "@/components/ui/button"
import {
  calculateReadingMinutes,
  cleanWordPressExcerpt,
  formatDate,
  getAllPublishedPostPaths,
  getPostBySlugAndLocale,
  getPostTranslationPaths,
  type WordPressPost,
  type PublishedPostPath,
} from "@/lib/wordpress-cms"
import { getPublicAlternates, publicUrl, makeBlogPostingJsonLd } from "@/lib/public-seo"
import { serializeJsonLd } from "@/lib/json-ld"
import { defaultSEO } from "@/config/seo"
import {
  isPublishedBlogLocale,
  localizePublicPathname,
  localeDefinitions,
  publishedBlogLocales,
  type PublishedBlogLocale,
} from "@/i18n/config"

export const revalidate = 600

type ArticlePageProps = { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams(): Promise<Array<{ locale: PublishedBlogLocale; slug: string }>> {
  return (await getAllPublishedPostPaths()).map(({ locale, slug }) => ({ locale, slug }))
}

function articlePaths(post: WordPressPost): PublishedPostPath[] {
  const unique = new Map<string, PublishedPostPath>()
  for (const path of getPostTranslationPaths(post)) unique.set(path.locale, path)
  return [...unique.values()]
}

function seoAlternatePathMap(paths: PublishedPostPath[]) {
  return Object.fromEntries(
    paths.map((path) => [path.locale, `/blog/${path.slug}`]),
  ) as Partial<Record<PublishedBlogLocale, string>>
}

function switcherPathMap(paths: PublishedPostPath[]) {
  return Object.fromEntries(
    paths.map((path) => [path.locale, localizePublicPathname(`/blog/${path.slug}`, path.locale)]),
  ) as Partial<Record<PublishedBlogLocale, string>>
}

function isoDate(dateString: string): string {
  const date = new Date(dateString)
  return Number.isNaN(date.getTime()) ? new Date(0).toISOString() : date.toISOString()
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { locale: routeLocale, slug } = await params
  if (!isPublishedBlogLocale(routeLocale)) return { robots: { index: false, follow: false } }
  const locale = routeLocale as PublishedBlogLocale
  const t = await getTranslations({ locale, namespace: "Blog.article" })
  const post = await getPostBySlugAndLocale(slug, locale)

  if (!post) {
    return {
      title: t("notFoundTitle"),
      description: t("notFoundDescription"),
      robots: { index: false, follow: false },
    }
  }

  const paths = articlePaths(post)
  const alternatePaths = seoAlternatePathMap(paths)
  const canonical = publicUrl(`/blog/${post.slug}`, locale)
  const description = cleanWordPressExcerpt(post.excerpt) || post.title
  const image = post.featuredImage?.node?.sourceUrl || `${defaultSEO.siteUrl}/og-image.png`
  const alternateLocale = paths
    .filter((path) => path.locale !== locale)
    .map((path) => localeDefinitions[path.locale].openGraphLocale)

  return {
    title: t("metaTitle", { title: post.title }),
    description,
    keywords: t.raw("keywords") as string[],
    authors: [{ name: post.author?.node?.name || t("authorFallback") }],
    alternates: { ...getPublicAlternates(`/blog/${post.slug}`, alternatePaths, publishedBlogLocales), canonical },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: canonical,
      siteName: defaultSEO.siteName,
      locale: localeDefinitions[locale].openGraphLocale,
      alternateLocale,
      publishedTime: isoDate(post.date),
      modifiedTime: isoDate(post.modified || post.date),
      authors: [post.author?.node?.name || t("authorFallback")],
      images: [{
        url: image,
        width: 1200,
        height: 630,
        alt: post.featuredImage?.node?.altText || t("imageAlt", { title: post.title }),
      }],
    },
    twitter: { card: "summary_large_image", title: post.title, description, images: [image] },
    robots: { index: true, follow: true },
  }
}

export default async function BlogArticlePage({ params }: ArticlePageProps) {
  const { locale: routeLocale, slug } = await params
  if (!isPublishedBlogLocale(routeLocale)) notFound()
  const locale = routeLocale as PublishedBlogLocale
  const canonicalSlug = slug.replace(/[\s,]+$/g, "")
  if (canonicalSlug !== slug) redirect(localizePublicPathname(`/blog/${canonicalSlug}`, locale))

  const post = await getPostBySlugAndLocale(canonicalSlug, locale)
  if (!post) notFound()

  const t = await getTranslations({ locale, namespace: "Blog.article" })
  return <BlogPostContent post={post} locale={locale} paths={articlePaths(post)} t={t} />
}

function BlogPostContent({
  post,
  locale,
  paths,
  t,
}: {
  post: WordPressPost
  locale: PublishedBlogLocale
  paths: PublishedPostPath[]
  t: Awaited<ReturnType<typeof getTranslations>>
}) {
  const readingMinutes = calculateReadingMinutes(post.content)
  const displayDate = formatDate(post.date, locale)
  const category = post.categories?.nodes?.[0]?.name || t("categoryFallback")
  const excerpt = cleanWordPressExcerpt(post.excerpt)
  const articleUrl = publicUrl(`/blog/${post.slug}`, locale)
  const blogUrl = publicUrl("/blog", locale)
  const localizedPaths = switcherPathMap(paths)
  const blogPostJsonLd = makeBlogPostingJsonLd({
    url: articleUrl,
    blogUrl,
    blogName: t("blogName"),
    locale,
    headline: post.title,
    description: excerpt || post.title,
    image: post.featuredImage?.node?.sourceUrl || `${defaultSEO.siteUrl}/og-image.png`,
    datePublished: isoDate(post.date),
    dateModified: isoDate(post.modified || post.date),
    authorName: post.author?.node?.name || t("authorFallback"),
    category,
    wordCount: post.content.replace(/<[^>]*>/g, "").trim().split(/\s+/).filter(Boolean).length,
    readingMinutes,
  })

  return (
    <div className="min-h-screen bg-[#F7F5F3] font-[family-name:var(--font-inter)] text-gray-900 flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(blogPostJsonLd) }} />
      <PublicHeader localeSwitcher={{
        availableLocales: paths.map((path) => path.locale),
        localizedPaths,
      }} />

      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <PublicLink href="/blog" className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-[#ff6f00] transition-colors">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> {t("backToGuides")}
            </PublicLink>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm p-6 sm:p-10 mb-8">
            <div className="flex flex-wrap items-center gap-3 text-xs mb-4">
              <span className="bg-[#ff6f00]/10 text-[#ff6f00] font-bold px-3 py-1 rounded-full">{category}</span>
              <div className="flex items-center gap-1.5 text-gray-500"><Calendar className="w-3.5 h-3.5 text-gray-400" /><span>{t("published", { date: displayDate })}</span></div>
              <div className="flex items-center gap-1.5 text-gray-500"><Clock className="w-3.5 h-3.5 text-gray-400" /><span>{t("readTime", { minutes: readingMinutes })}</span></div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-[var(--font-inter-tight)] tracking-tight leading-[1.12] text-gray-900 mb-6">{post.title}</h1>
            {excerpt && <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6 border-l-2 border-[#ff6f00] pl-4 italic">{excerpt}</p>}

            <div className="flex items-center justify-between pt-6 border-t border-gray-100 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                {post.author?.node?.avatar?.url ? (
                  <Image src={post.author.node.avatar.url} alt={post.author.node.name} width={40} height={40} className="rounded-full border border-gray-200" />
                ) : (
                  <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-[#ff6f00]"><User className="w-5 h-5" /></div>
                )}
                <div><p className="text-sm font-semibold text-gray-900">{post.author?.node?.name || t("authorFallback")}</p><p className="text-xs text-gray-500">{t("authorRole")}</p></div>
              </div>
              <ShareButton title={post.title} url={articleUrl} text={t("shareText", { title: post.title })} label={t("share")} sharingLabel={t("sharing")} copiedLabel={t("copied")} />
            </div>
          </div>

          {post.featuredImage?.node?.sourceUrl && (
            <div className="mb-10 rounded-3xl overflow-hidden shadow-md border border-gray-200/80 bg-gray-100">
              <Image src={post.featuredImage.node.sourceUrl} alt={post.featuredImage.node.altText || t("imageAlt", { title: post.title })} width={1200} height={675} className="w-full h-auto object-cover" priority />
            </div>
          )}

          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm p-6 sm:p-12 mb-12">
            <article className="prose prose-neutral prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-[#ff6f00] prose-a:font-medium hover:prose-a:underline prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:marker:text-[#ff6f00] prose-blockquote:border-l-[#ff6f00] prose-blockquote:bg-orange-50/50 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:text-gray-800 prose-img:rounded-2xl prose-img:shadow-sm prose-img:border prose-img:border-gray-100">
              <BlogContentRenderer content={post.content} />
            </article>
          </div>

          <div className="bg-[#111111] rounded-3xl p-8 sm:p-12 text-white text-center border-2 border-dashed border-zinc-800 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 font-[var(--font-inter-tight)]">{t("cta.heading")}</h2>
            <p className="text-gray-300 text-sm sm:text-base max-w-md mx-auto mb-6">{t("cta.description")}</p>
            <Link href="/dashboard"><Button className="group relative bg-[#ff6f00] hover:bg-[#ff6f00]/90 text-white rounded-md overflow-hidden cursor-pointer px-8 pr-16 py-6 font-semibold text-base shadow-lg shadow-orange-500/20">
              {t("cta.button")}<span className="bg-white rounded-sm p-3 absolute right-1 top-1/2 -translate-y-1/2"><img src="/arrow.svg" alt="" className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" /></span>
            </Button></Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
