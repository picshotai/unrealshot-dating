import type { Metadata } from "next"
import PublicHeader from "@/components/Header"
import Footer from "@/components/main-landing/Footer"
import BlogCard from "@/components/blog-card"
import { OfflineBanner } from "@/components/network-status"
import { getAllPosts, formatDate, calculateReadingTime, cleanWordPressExcerpt, type WordPressPost } from "@/lib/wordpress"
import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const dynamic = 'force-static'
export const revalidate = 600 // 10 minutes

export const metadata: Metadata = {
  title: "Dating Photo Guides & Insights | UnrealShot AI Blog",
  description:
    "Actionable guides on optimizing your dating profile photos for Tinder, Hinge, and Bumble. Tips on lighting, wardrobe, angles, and realistic AI photography.",
  robots: "index, follow",
  alternates: {
    canonical: "https://www.unrealshot.com/blog",
  },
  openGraph: {
    title: "Dating Photo Guides & Insights | UnrealShot AI Blog",
    description: "Actionable guides on optimizing your dating profile photos for Tinder, Hinge, and Bumble.",
    type: "website",
    url: "https://www.unrealshot.com/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dating Photo Guides & Insights | UnrealShot AI Blog",
    description: "Actionable guides on optimizing your dating profile photos for Tinder, Hinge, and Bumble.",
  },
}

// Transform WordPress post to blog card format
function transformWordPressPost(post: WordPressPost, index: number) {
  const excerpt = cleanWordPressExcerpt(post.excerpt || '')

  return {
    title: post.title,
    excerpt,
    slug: post.slug,
    publishedAt: formatDate(post.date),
    readTime: calculateReadingTime(post.content),
    category: post.categories?.nodes?.[0]?.name || "Dating Guides",
    image: post.featuredImage?.node?.sourceUrl || "/placeholder.svg?height=400&width=600&text=Blog+Post",
    featured: index === 0,
    author: post.author?.node?.name || "UnrealShot Team",
  }
}

async function BlogContent() {
  try {
    const { posts } = await getAllPosts(20)
    const blogPosts = posts.map(transformWordPressPost)

    return (
      <BlogPageContent blogPosts={blogPosts} />
    )
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return (
      <BlogPageContent blogPosts={[]} />
    )
  }
}

function BlogPageContent({ blogPosts }: { blogPosts: any[] }) {
  return (
    <div className="min-h-screen bg-[#F7F5F3] font-[family-name:var(--font-inter)] text-gray-900 flex flex-col">
      <PublicHeader />

      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Offline Banner */}
          <OfflineBanner />

          {/* Header Section */}
          <div className="py-12 sm:py-16 text-center max-w-3xl mx-auto">
            <p className="text-orange-500 font-bold uppercase tracking-wider text-xs sm:text-sm mb-3 block">
              THE UNREALSHOT AI JOURNAL
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-[var(--font-inter-tight)] tracking-tight leading-[1.08] text-gray-900 mb-5">
              Dating Photo Guides <br className="hidden sm:block" />
              <span className="text-[#ff6f00]">&amp; Profile Strategy</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Actionable advice on styling, facial angles, lighting, and how to build a high-performing dating profile that converts matches into real dates.
            </p>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {blogPosts.length > 0 ? (
              blogPosts.map((post) => (
                <BlogCard
                  key={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  slug={post.slug}
                  publishedAt={post.publishedAt}
                  readTime={post.readTime}
                  category={post.category}
                  image={post.image}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-gray-200/80 shadow-sm">
                <p className="text-gray-900 font-semibold text-lg">No guides found at this time.</p>
                <p className="text-gray-500 text-sm mt-1">Please check back soon for fresh profile strategy tips.</p>
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 max-w-5xl mx-auto px-4">
          <div className="bg-[#111111] rounded-3xl p-8 sm:p-12 text-white text-center border-2 border-dashed border-zinc-800 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-[var(--font-inter-tight)]">
              Fix Your Entire Camera Roll Today
            </h2>
            <p className="text-gray-300 text-base sm:text-lg max-w-xl mx-auto mb-8">
              Get 15 cohesive shoots, 60 natural photos, and 15 Photo Retakes delivered in under 30 minutes.
            </p>
            <div className="inline-block relative">
              <Link href="/dashboard">
                <Button className="group relative bg-[#ff6f00] hover:bg-[#ff6f00]/90 text-white rounded-md overflow-hidden cursor-pointer px-8 pr-16 py-6 font-semibold text-base shadow-lg shadow-orange-500/20">
                  Start Your Shoot — $39
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

export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F7F5F3] flex flex-col font-[family-name:var(--font-inter)]">
        <PublicHeader />
        <main className="flex-1 pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-12 animate-pulse">
            <div className="h-4 w-32 bg-gray-200 mx-auto rounded mb-4"></div>
            <div className="h-12 w-96 bg-gray-200 mx-auto rounded mb-4"></div>
            <div className="h-4 w-80 bg-gray-200 mx-auto rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4 aspect-[4/3] animate-pulse"></div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    }>
      <BlogContent />
    </Suspense>
  )
}