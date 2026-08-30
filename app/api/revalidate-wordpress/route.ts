import { createHmac, timingSafeEqual } from "node:crypto"
import { revalidatePath, revalidateTag } from "next/cache"
import { NextResponse } from "next/server"
import { z } from "zod"
import {
  isPublishedBlogLocale,
  localizePublicPathname,
  publishedBlogLocales,
  type PublishedBlogLocale,
} from "@/i18n/config"
import { blogCacheTags } from "@/lib/wordpress-cms"

export const runtime = "nodejs"

const MAX_CLOCK_SKEW_SECONDS = 300

const postSchema = z.object({
  locale: z.string(),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
})

const payloadSchema = z.object({
  event: z.enum(["post.published", "post.updated", "post.unpublished", "post.trashed", "post.restored"]),
  locales: z.array(z.string()).max(publishedBlogLocales.length).default([]),
  posts: z.array(postSchema).max(20).default([]),
})

function isValidSignature(rawBody: string, timestamp: string, suppliedSignature: string, secret: string): boolean {
  if (!/^\d{10}$/.test(timestamp)) return false
  const timestampSeconds = Number(timestamp)
  if (Math.abs(Math.floor(Date.now() / 1000) - timestampSeconds) > MAX_CLOCK_SKEW_SECONDS) return false

  const supplied = suppliedSignature.replace(/^sha256=/, "").toLowerCase()
  if (!/^[a-f0-9]{64}$/.test(supplied)) return false

  const expected = createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex")
  return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(supplied, "hex"))
}

export async function POST(request: Request) {
  const secret = process.env.WORDPRESS_REVALIDATION_SECRET?.trim()
  if (!secret || secret.length < 32) {
    console.error("WORDPRESS_REVALIDATION_SECRET is missing or too short")
    return NextResponse.json({ error: "Revalidation is unavailable" }, { status: 503 })
  }

  const rawBody = await request.text()
  if (Buffer.byteLength(rawBody, "utf8") > 64 * 1024) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 })
  }

  const timestamp = request.headers.get("x-wordpress-timestamp") ?? ""
  const signature = request.headers.get("x-wordpress-signature") ?? ""
  if (!isValidSignature(rawBody, timestamp, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  let json: unknown
  try {
    json = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = payloadSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const requestedLocales = new Set<PublishedBlogLocale>()
  for (const locale of parsed.data.locales) {
    if (!isPublishedBlogLocale(locale)) {
      return NextResponse.json({ error: `Unsupported blog locale: ${locale}` }, { status: 400 })
    }
    requestedLocales.add(locale)
  }

  for (const post of parsed.data.posts) {
    if (!isPublishedBlogLocale(post.locale)) {
      return NextResponse.json({ error: `Unsupported blog locale: ${post.locale}` }, { status: 400 })
    }
    requestedLocales.add(post.locale)
  }

  const locales = requestedLocales.size > 0 ? [...requestedLocales] : [...publishedBlogLocales]

  revalidateTag(blogCacheTags.all, "max")
  revalidateTag(blogCacheTags.sitemap, "max")
  revalidatePath("/sitemap.xml")

  for (const locale of locales) {
    revalidateTag(blogCacheTags.archive(locale), "max")
    revalidatePath(localizePublicPathname("/blog", locale))
  }

  for (const post of parsed.data.posts) {
    const locale = post.locale as PublishedBlogLocale
    revalidateTag(blogCacheTags.article(locale, post.slug), "max")
    revalidatePath(localizePublicPathname(`/blog/${post.slug}`, locale))
  }

  return NextResponse.json({
    revalidated: true,
    event: parsed.data.event,
    locales,
    posts: parsed.data.posts.length,
  })
}

