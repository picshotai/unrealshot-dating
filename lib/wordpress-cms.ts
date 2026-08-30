import {
  getLocaleForWordPressCode,
  localeDefinitions,
  publishedBlogLocales,
  type PublishedBlogLocale,
  type PublishedPublicLocale,
} from "@/i18n/config"

export const BLOG_REVALIDATE_SECONDS = 600
export const WORDPRESS_DEFAULT_API_URL = "https://blog.unrealshot.com/graphql"

export const blogCacheTags = {
  all: "wordpress:blog",
  archive: (locale: PublishedBlogLocale) => `wordpress:blog:archive:${locale}`,
  article: (locale: PublishedBlogLocale, slug: string) =>
    `wordpress:blog:article:${locale}:${slug}`,
  sitemap: "wordpress:blog:sitemap",
} as const

export interface WordPressLanguage {
  code: string
  locale: string
}

export interface WordPressTranslationSummary {
  id?: string | null
  slug: string
  modified?: string | null
  status?: string | null
  language: WordPressLanguage | null
}

export interface WordPressPost {
  id: string
  title: string
  excerpt: string
  content: string
  slug: string
  date: string
  modified: string
  status?: string | null
  language?: WordPressLanguage | null
  author: {
    node: {
      name: string
      avatar: { url: string }
    }
  } | null
  featuredImage: {
    node: {
      sourceUrl: string
      altText: string
    }
  } | null
  categories: {
    nodes: Array<{ name: string; slug: string }>
  }
  translations?: WordPressTranslationSummary[] | null
}

export interface WordPressPageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor: string | null
  endCursor: string | null
}

export interface WordPressPostPage {
  posts: WordPressPost[]
  pageInfo: WordPressPageInfo
}

export interface PublishedPostPath {
  locale: PublishedBlogLocale
  slug: string
  modified: string
  alternatePaths?: Partial<Record<PublishedBlogLocale, string>>
}

interface WordPressResponse {
  data?: {
    posts?: {
      nodes?: WordPressPost[]
      pageInfo?: WordPressPageInfo
    }
  }
}

interface WordPressSinglePostResponse {
  data?: { posts?: { nodes?: WordPressPost[] } }
}

function getWordPressApiUrl(): string {
  const configuredUrl = process.env.WORDPRESS_API_URL?.trim()
  if (!configuredUrl) return WORDPRESS_DEFAULT_API_URL

  let parsedUrl: URL
  try {
    parsedUrl = new URL(configuredUrl)
  } catch {
    throw new Error("WORDPRESS_API_URL must be an absolute HTTP(S) URL")
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    throw new Error("WORDPRESS_API_URL must use HTTP or HTTPS")
  }

  return parsedUrl.toString().replace(/\/$/, "")
}

export const WORDPRESS_API_URL = getWordPressApiUrl()

function getWordPressLanguageCode(locale: PublishedBlogLocale): string {
  const code = localeDefinitions[locale].wordpressCode
  if (!/^[A-Z][A-Z0-9_]*$/.test(code)) {
    throw new Error(`Invalid WordPress language code configured for ${locale}`)
  }
  return code
}

const POST_FIELDS = `
  id
  title
  excerpt
  content
  slug
  date
  modified
  status
  language { code locale }
  author {
    node { name avatar { url } }
  }
  featuredImage {
    node { sourceUrl altText }
  }
  categories {
    nodes { name slug }
  }
  translations {
    id
    slug
    modified
    status
    language { code locale }
  }
`

function getPostsQuery(languageCode: string): string {
  return `
    query GetPostsByLanguage($first: Int!, $after: String) {
      posts(
        first: $first
        after: $after
        where: { status: PUBLISH, language: ${languageCode} }
      ) {
        nodes { ${POST_FIELDS} }
        pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
      }
    }
  `
}

function getPostBySlugQuery(languageCode: string): string {
  return `
    query GetPostByLocalizedSlug($first: Int!, $slug: String!) {
      posts(
        first: $first
        where: { status: PUBLISH, language: ${languageCode}, name: $slug }
      ) {
        nodes { ${POST_FIELDS} }
      }
    }
  `
}

async function fetchGraphQL<T>(
  query: string,
  variables: Record<string, unknown> = {},
  options: { tags?: string[] } = {},
  retries = 2,
): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 8000)

  try {
    const response = await fetch(WORDPRESS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
      next: {
        revalidate: BLOG_REVALIDATE_SECONDS,
        tags: [blogCacheTags.all, ...(options.tags ?? [])],
      },
    })

    if (!response.ok) {
      if (response.status >= 500 && retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, 400))
        return fetchGraphQL<T>(query, variables, options, retries - 1)
      }
      throw new Error(`WordPress returned HTTP ${response.status}`)
    }

    const json = (await response.json()) as { errors?: Array<{ message?: string }> } & T
    if (json.errors?.length) {
      const message = json.errors.map((error) => error.message).filter(Boolean).join("; ")
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, 400))
        return fetchGraphQL<T>(query, variables, options, retries - 1)
      }
      throw new Error(message || "WordPress GraphQL query failed")
    }

    return json
  } catch (error) {
    if (retries > 0 && error instanceof Error && (error.name === "AbortError" || error.name === "TypeError")) {
      await new Promise((resolve) => setTimeout(resolve, 400))
      return fetchGraphQL<T>(query, variables, options, retries - 1)
    }
    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}

function isPublishedTranslation(translation: WordPressTranslationSummary): boolean {
  return !translation.status || translation.status.toUpperCase() === "PUBLISH"
}

function isPostInLocale(post: WordPressPost, locale: PublishedBlogLocale): boolean {
  return post.language?.code === getWordPressLanguageCode(locale)
}

/** Fetch one published archive page for the requested WordPress language. */
export async function getPostsByLocale(
  locale: PublishedBlogLocale,
  options: { first?: number; after?: string | null; tags?: string[] } = {},
): Promise<WordPressPostPage> {
  const first = Math.min(Math.max(options.first ?? 12, 1), 100)

  const response = await fetchGraphQL<WordPressResponse>(
    getPostsQuery(getWordPressLanguageCode(locale)),
    { first, after: options.after || null },
    { tags: [blogCacheTags.archive(locale), ...(options.tags ?? [])] },
  )
  const page = response.data?.posts
  if (!page?.pageInfo) throw new Error("WordPress returned an invalid posts page")
  return {
    posts: (page.nodes ?? []).filter((post) => isPostInLocale(post, locale)),
    pageInfo: page.pageInfo,
  }
}

/** Fetch an exact published slug within the requested WordPress language. */
export async function getPostBySlugAndLocale(
  slug: string,
  locale: PublishedBlogLocale,
): Promise<WordPressPost | null> {
  const normalizedSlug = slug.trim()
  if (!normalizedSlug) return null

  const response = await fetchGraphQL<WordPressSinglePostResponse>(
    getPostBySlugQuery(getWordPressLanguageCode(locale)),
    { first: 1, slug: normalizedSlug },
    { tags: [blogCacheTags.archive(locale), blogCacheTags.article(locale, normalizedSlug)] },
  )
  const post = response.data?.posts?.nodes?.[0] ?? null
  return post && post.slug === normalizedSlug && isPostInLocale(post, locale) ? post : null
}

/** Return only published translation summaries with a locale known to the app. */
export function getPublishedTranslations(post: WordPressPost): WordPressTranslationSummary[] {
  return (post.translations ?? []).filter(
    (translation) => (
      Boolean(translation.slug) &&
      Boolean(translation.language) &&
      isPublishedTranslation(translation) &&
      Boolean(getLocaleForWordPressCode(translation.language?.code))
    ),
  )
}

export function getPostLocale(post: WordPressPost): PublishedBlogLocale | null {
  return post.language ? getLocaleForWordPressCode(post.language.code) ?? null : null
}

export function getPostTranslationPaths(post: WordPressPost): PublishedPostPath[] {
  const paths: PublishedPostPath[] = []
  const postLocale = getPostLocale(post)
  if (postLocale && post.slug) paths.push({ locale: postLocale, slug: post.slug, modified: post.modified || post.date })

  for (const translation of getPublishedTranslations(post)) {
    const locale = translation.language ? getLocaleForWordPressCode(translation.language.code) : undefined
    if (!locale || !translation.slug) continue
    paths.push({ locale, slug: translation.slug, modified: translation.modified || post.modified || post.date })
  }
  return paths
}

/** Enumerate every published localized article path for static params and sitemap generation. */
export async function getAllPublishedPostPaths(): Promise<PublishedPostPath[]> {
  const pages = await Promise.all(
    publishedBlogLocales.map(async (locale) => {
      const posts: WordPressPost[] = []
      let after: string | null = null

      for (let pageNumber = 0; pageNumber < 100; pageNumber += 1) {
        const page = await getPostsByLocale(locale, { first: 100, after, tags: [blogCacheTags.sitemap] })
        posts.push(...page.posts)
        if (!page.pageInfo.hasNextPage) return posts
        if (!page.pageInfo.endCursor) {
          throw new Error(`WordPress pagination for ${locale} has no end cursor`)
        }
        after = page.pageInfo.endCursor
      }
      throw new Error(`WordPress pagination for ${locale} exceeded 100 pages`)
    }),
  )

  const uniquePaths = new Map<string, PublishedPostPath>()
  for (const post of pages.flat()) {
    const relatedPaths = getPostTranslationPaths(post)
    const alternatePaths = Object.fromEntries(
      relatedPaths.map((path) => [path.locale, `/blog/${path.slug}`]),
    ) as Partial<Record<PublishedBlogLocale, string>>
    for (const path of relatedPaths) {
      const key = `${path.locale}:${path.slug}`
      const existing = uniquePaths.get(key)
      uniquePaths.set(key, {
        ...path,
        alternatePaths: {
          ...(existing?.alternatePaths ?? {}),
          ...alternatePaths,
        },
      })
    }
  }

  return [...uniquePaths.values()].sort((left, right) =>
    `${left.locale}:${left.slug}`.localeCompare(`${right.locale}:${right.slug}`),
  )
}

// Backwards-compatible English helpers for legacy consumers.
export async function getAllPosts(first = 10, after?: string): Promise<WordPressPostPage> {
  return getPostsByLocale("en", { first, after })
}

export async function getPostBySlug(slug: string): Promise<WordPressPost | null> {
  return getPostBySlugAndLocale(slug, "en")
}

export async function getAllPostSlugs(): Promise<string[]> {
  const paths = await getAllPublishedPostPaths()
  return paths.filter((path) => path.locale === "en").map((path) => path.slug)
}

export function formatDate(dateString: string, locale: PublishedPublicLocale = "en"): string {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return ""
  return new Intl.DateTimeFormat(localeDefinitions[locale].htmlLang, {
    year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
  }).format(date)
}

export function calculateReadingMinutes(content: string): number {
  if (!content) return 1
  const textContent = content.replace(/<[^>]*>/g, "").trim()
  return Math.max(1, Math.ceil((textContent ? textContent.split(/\s+/).length : 0) / 200))
}

export function calculateReadingTime(content: string): string {
  return `${calculateReadingMinutes(content)} min read`
}

export function extractExcerpt(content: string, length = 160): string {
  if (!content) return ""
  const textContent = content
    .replace(/<[^>]*>/g, "")
    .replace(/Read more\.?\.?\.?$/i, "")
    .replace(/Continue reading\.?\.?\.?$/i, "")
    .replace(/\[\.\.\.\.?\]$/g, "")
    .replace(/\.\.\.$/g, "")
    .replace(/…$/g, "")
    .trim()
  if (!textContent) return ""
  return textContent.length > length ? `${textContent.substring(0, length).trim()}...` : textContent
}

export function cleanWordPressExcerpt(excerpt: string): string {
  if (!excerpt) return ""
  const text = excerpt
    .replace(/<[^>]*>/g, "")
    .replace(/Read more\.?\.?\.?$/i, "")
    .replace(/Continue reading\.?\.?\.?$/i, "")
    .replace(/\[\.\.\.\.?\]$/g, "")
    .replace(/\.\.\.$/g, "")
    .replace(/…$/g, "")
    .replace(/&hellip;$/g, "")
    .replace(/&#8230;$/g, "")
    .trim()
  return text.length >= 20 ? text : ""
}

export function hasNativeExcerpt(post: WordPressPost): boolean {
  return cleanWordPressExcerpt(post.excerpt) !== ""
}
