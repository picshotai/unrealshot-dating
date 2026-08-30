/**
 * @deprecated The canonical WordPress client is `lib/wordpress-cms.ts`.
 * This compatibility surface is kept for older imports while all blog routes
 * use the locale-aware client directly.
 */
export {
  getAllPosts,
  getPostBySlug,
  getAllPostSlugs,
  getPostsByLocale,
  getPostBySlugAndLocale,
  getAllPublishedPostPaths,
} from "@/lib/wordpress-cms"
export type { WordPressPost as Post, WordPressPostPage as PostsResponse } from "@/lib/wordpress-cms"
