import { Link } from "@/i18n/navigation"
import { Calendar, Clock, ArrowRight } from "lucide-react"

interface BlogCardProps {
  title: string
  excerpt: string
  slug: string
  publishedAt: string
  readTime: string
  category: string
  image: string
  imageAlt?: string
  readGuide: string
  featured?: boolean
}

export default function BlogCard({
  title,
  excerpt,
  slug,
  publishedAt,
  readTime,
  category,
  image,
  imageAlt,
  readGuide,
  featured = false,
}: BlogCardProps) {
  return (
    <article className="group h-full">
      <Link href={`/blog/${slug}`} className="block h-full">
        <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300 flex flex-col h-full">
          {/* Image */}
          <div className="relative overflow-hidden aspect-[16/10] bg-gray-100">
            <img
              src={image || "/placeholder.svg"}
              alt={imageAlt || title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="bg-white/90 backdrop-blur-md text-[#ff6f00] font-bold px-3 py-1 text-xs rounded-full shadow-sm border border-gray-100">
                {category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col flex-1">
            {/* Metadata */}
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>{publishedAt}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>{readTime}</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-lg font-bold text-gray-900 group-hover:text-[#ff6f00] transition-colors mb-2.5 leading-snug line-clamp-2">
              {title}
            </h2>

            {/* Excerpt */}
            {excerpt && (
              <p className="text-sm text-gray-600 mb-5 leading-relaxed line-clamp-2 flex-1">
                {excerpt}
              </p>
            )}

            {/* Read More */}
            <div className="flex items-center text-xs font-bold text-[#ff6f00] group-hover:translate-x-0.5 transition-transform mt-auto pt-2">
              <span>{readGuide}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}
