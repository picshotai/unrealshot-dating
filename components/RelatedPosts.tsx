import Image from "next/image"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import type { WordPressPost } from "@/lib/wordpress-cms"

interface RelatedPostsProps {
  posts: WordPressPost[]
}

export async function RelatedPosts({ posts }: RelatedPostsProps) {
  const t = await getTranslations("Blog.article")
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold mb-4">{t("relatedHeading")}</h3>
      {posts.map((post) => (
        <Link key={post.id} href={`/blog/${post.slug}`} className="flex items-start space-x-4 group">
          {post.featuredImage && (
            <div className="relative w-36 h-24 flex-shrink-0">
              <Image
                src={post.featuredImage.node.sourceUrl || "/placeholder.svg"}
                alt={post.featuredImage.node.altText || t("imageAlt", { title: post.title })}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}
          <h3 className="text-sm font-medium group-hover:text-blue-600 transition-colors">{post.title}</h3>
        </Link>
      ))}
    </div>
  )
}

