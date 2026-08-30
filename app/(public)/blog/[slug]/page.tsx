import type { Metadata } from "next"
import PublicHeader from "@/components/Header"
import Footer from "@/components/main-landing/Footer"
import BlogContentRenderer from "@/components/blog-content-renderer"
import ShareButton from "@/components/share-button"
import { Calendar, Clock, ArrowLeft, User } from "lucide-react"
import Link from "next/link"
import { getPostBySlug, getAllPostSlugs, formatDate, calculateReadingTime, type WordPressPost } from "@/lib/wordpress"
import { notFound, redirect } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"

// Ensure static generation with ISR for crawler stability
export const dynamic = 'force-static'
export const revalidate = 600 // 10 minutes

// Generate static paths for all blog posts
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const slugs = await getAllPostSlugs()
    return slugs.map((slug) => ({
      slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const canonicalSlug = slug.replace(/[\s,]+$/g, '')
  try {
    const post = await getPostBySlug(canonicalSlug)

    if (!post) {
      return {
        title: "Post Not Found - UnrealShot Blog",
        description: "The requested dating guide could not be found.",
      }
    }

    const seoTitle = post.title
    const seoDescription = post.excerpt ? post.excerpt.replace(/<[^>]*>/g, '') : "Read this dating photography guide on UnrealShot Blog"
    const ogImage = post.featuredImage?.node?.sourceUrl || "/placeholder.svg"

    return {
      title: `${seoTitle} | UnrealShot AI Dating Guides`,
      description: seoDescription,
      openGraph: {
        title: seoTitle,
        description: seoDescription,
        type: "article",
        publishedTime: post.date,
        modifiedTime: post.modified,
        authors: [post.author?.node?.name || "UnrealShot Team"],
        images: [{
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.featuredImage?.node?.altText || post.title,
        }],
        url: `https://www.unrealshot.com/blog/${post.slug}`,
      },
      twitter: {
        card: "summary_large_image",
        title: seoTitle,
        description: seoDescription,
        images: [ogImage],
      },
      alternates: {
        canonical: `https://www.unrealshot.com/blog/${post.slug}`,
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: "Dating Photo Guide | UnrealShot AI",
      description: "Actionable advice on styling, lighting, and AI photography for Tinder, Hinge, and Bumble profiles.",
    }
  }
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const canonicalSlug = slug.replace(/[\s,]+$/g, '')
  if (canonicalSlug !== slug) {
    redirect(`/blog/${canonicalSlug}`)
  }
  try {
    const post = await getPostBySlug(canonicalSlug)

    if (!post) {
      notFound()
    }

    return <BlogPostContent post={post} />
  } catch (error) {
    console.error('Error fetching blog post:', error)
    notFound()
  }
}

function BlogPostContent({ post }: { post: WordPressPost }) {
  const readTime = calculateReadingTime(post.content)
  const displayDate = formatDate(post.modified || post.date)
  const category = post.categories?.nodes?.[0]?.name || "Dating Guides"

  const formatDateWithTimezone = (dateString: string) => {
    const date = new Date(dateString)
    return date.toISOString()
  }

  const blogPostJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `https://www.unrealshot.com/blog/${post.slug}`,
    headline: post.title,
    description: post.excerpt ? post.excerpt.replace(/<[^>]*>/g, '') : post.title,
    image: post.featuredImage?.node?.sourceUrl || 'https://www.unrealshot.com/placeholder.svg',
    datePublished: formatDateWithTimezone(post.date),
    dateModified: formatDateWithTimezone(post.modified || post.date),
    author: {
      '@type': 'Organization',
      name: post.author?.node?.name || 'UnrealShot Team',
      url: 'https://www.unrealshot.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'UnrealShot AI',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.unrealshot.com/site-logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.unrealshot.com/blog/${post.slug}`
    },
    articleSection: category,
    wordCount: post.content.split(' ').length,
    timeRequired: `PT${readTime}M`,
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'Blog',
      '@id': 'https://www.unrealshot.com/blog',
      name: 'The UnrealShot AI Blog'
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F5F3] font-[family-name:var(--font-inter)] text-gray-900 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostJsonLd) }}
      />

      <PublicHeader />

      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <div className="mb-6">
            <Link
              href="/blog"
              className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-[#ff6f00] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              Back to All Guides
            </Link>
          </div>

          {/* Article Header */}
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm p-6 sm:p-10 mb-8">
            <div className="flex flex-wrap items-center gap-3 text-xs mb-4">
              <span className="bg-[#ff6f00]/10 text-[#ff6f00] font-bold px-3 py-1 rounded-full">
                {category}
              </span>
              <div className="flex items-center gap-1.5 text-gray-500">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>{displayDate}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-500">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>{readTime} min read</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-[var(--font-inter-tight)] tracking-tight leading-[1.12] text-gray-900 mb-6">
              {post.title}
            </h1>

            {post.excerpt && (
              <div
                className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6 border-l-2 border-[#ff6f00] pl-4 italic"
                dangerouslySetInnerHTML={{ __html: post.excerpt }}
                suppressHydrationWarning
              />
            )}

            {/* Author & Share */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                {post.author?.node?.avatar?.url ? (
                  <Image
                    src={post.author.node.avatar.url}
                    alt={post.author.node.name}
                    width={40}
                    height={40}
                    className="rounded-full border border-gray-200"
                  />
                ) : (
                  <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-[#ff6f00]">
                    <User className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-900">{post.author?.node?.name || "UnrealShot Team"}</p>
                  <p className="text-xs text-gray-500">Dating Profile Strategist</p>
                </div>
              </div>

              <ShareButton
                title={post.title}
                url={`https://www.unrealshot.com/blog/${post.slug}`}
                text={post.excerpt || `Check out this dating guide: ${post.title}`}
              />
            </div>
          </div>

          {/* Featured Image */}
          {post.featuredImage?.node?.sourceUrl && (
            <div className="mb-10 rounded-3xl overflow-hidden shadow-md border border-gray-200/80 bg-gray-100">
              <Image
                src={post.featuredImage.node.sourceUrl}
                alt={post.featuredImage.node.altText || post.title}
                width={1200}
                height={675}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          )}

          {/* Article Body */}
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm p-6 sm:p-12 mb-12">
            <article className="prose prose-neutral prose-lg max-w-none 
              prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-a:text-[#ff6f00] prose-a:font-medium hover:prose-a:underline
              prose-strong:text-gray-900
              prose-ul:text-gray-700
              prose-ol:text-gray-700
              prose-li:marker:text-[#ff6f00]
              prose-blockquote:border-l-[#ff6f00] prose-blockquote:bg-orange-50/50 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:text-gray-800
              prose-img:rounded-2xl prose-img:shadow-sm prose-img:border prose-img:border-gray-100
            ">
              <BlogContentRenderer content={post.content} />
            </article>
          </div>

          {/* Bottom CTA Card */}
          <div className="bg-[#111111] rounded-3xl p-8 sm:p-12 text-white text-center border-2 border-dashed border-zinc-800 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 font-[var(--font-inter-tight)]">
              Upgrade Your Dating Profile Today
            </h2>
            <p className="text-gray-300 text-sm sm:text-base max-w-md mx-auto mb-6">
              15 complete shoots · 60 candid dating photos · 15 Photo Retakes · $39 one-time.
            </p>
            <div className="inline-block relative">
              <Link href="/dashboard">
                <Button className="group relative bg-[#ff6f00] hover:bg-[#ff6f00]/90 text-white rounded-md overflow-hidden cursor-pointer px-8 pr-16 py-6 font-semibold text-base shadow-lg shadow-orange-500/20">
                  Build My Dating Profile — $39
                  <div className="bg-white rounded-sm p-3 absolute right-1 top-1/2 -translate-y-1/2">
                    <img
                      src="/arrow.svg"
                      alt="arrow-right"
                      className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </div>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}