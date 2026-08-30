const FALLBACK_SITE_URL = "https://www.unrealshot.com"

function isProductionDeployment(): boolean {
  return (
    process.env.VERCEL_ENV === "production" ||
    process.env.DEPLOYMENT_ENV === "production" ||
    (process.env.CI === "true" && process.env.NODE_ENV === "production")
  )
}

/**
 * Return the single trusted public origin used by canonicals, sitemaps and
 * structured data. Localhost is allowed for local production smoke tests, but
 * never on a hosted production build.
 */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim() || FALLBACK_SITE_URL

  let url: URL
  try {
    url = new URL(configured)
  } catch {
    throw new Error("NEXT_PUBLIC_APP_URL must be an absolute HTTP(S) URL")
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_APP_URL must use HTTP or HTTPS")
  }

  if (isProductionDeployment() && (url.hostname === "localhost" || url.hostname === "127.0.0.1")) {
    throw new Error("NEXT_PUBLIC_APP_URL cannot use localhost in a production deployment")
  }

  url.hash = ""
  url.search = ""
  return url.toString().replace(/\/$/, "")
}

export function absoluteSiteUrl(pathname = "/"): string {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`
  return `${getSiteUrl()}${normalized === "/" ? "" : normalized}`
}

