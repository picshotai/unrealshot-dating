import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { gonePaths, permanentRedirects } from '@/config/legacy-urls'
import {
  readStage,
  setStage,
  REQUIRED_SAMPLES,
  type OnboardingStage,
} from '@/lib/auth/stage'
import {
  isPublicPathname,
  isBlogPathname,
  isLocaleRoutedPublicPathname,
  isPublishedBlogLocale,
  isPublishedPublicPathname,
  isPublishedPublicLocale,
  localizePublicPathname,
  splitLocalePathname,
} from '@/i18n/config'
import { routing } from '@/i18n/routing'

const handleI18nRouting = createMiddleware(routing)

function goneResponse() {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>Page removed | UnrealShot</title></head><body style="margin:0;background:#070707;color:#f5f5f5;font-family:system-ui,sans-serif"><main style="max-width:720px;margin:0 auto;padding:12vh 24px"><a href="/" style="color:#f5f5f5;text-decoration:none;font-weight:700">UnrealShot</a><p style="margin-top:64px;color:#a3a3a3">410 Gone</p><h1 style="font-size:clamp(2.5rem,8vw,5rem);line-height:1;margin:.25em 0">This page has been retired.</h1><p style="font-size:1.2rem;line-height:1.7;color:#d4d4d4">UnrealShot now focuses on realistic AI dating photos for men. This old page has no equivalent replacement.</p><p><a href="/dating-photos" style="color:#ff805d">Explore dating profile photos</a> · <a href="/" style="color:#ff805d">Go home</a></p></main></body></html>`
  return new NextResponse(html, {
    status: 410,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'x-robots-tag': 'noindex, follow',
      'cache-control': 'public, max-age=0, s-maxage=86400',
    },
  })
}

function legacyResponse(request: NextRequest): NextResponse | undefined {
  const localePath = splitLocalePathname(request.nextUrl.pathname)

  if (gonePaths.has(localePath.pathname)) return goneResponse()

  const replacement = permanentRedirects.get(localePath.pathname)
  if (replacement) {
    const target = request.nextUrl.clone()
    target.pathname =
      localePath.pathname === '/use-case/dating-photos'
        ? localizePublicPathname(replacement, localePath.locale)
        : replacement
    target.search = ''
    return NextResponse.redirect(target, 308)
  }

  if (localePath.pathname === '/blog' && request.nextUrl.searchParams.has('page')) {
    const target = request.nextUrl.clone()
    target.pathname = '/blog'
    target.searchParams.delete('page')
    return NextResponse.redirect(target, 308)
  }
}

/** Signed-in users have no business here; they belong in the studio or onboarding. */
const ENTRY_ROUTES = ['/login', '/dashboard']

/** Requires a usable model. */
const STUDIO_ROUTES = ['/dating-shoot', '/gallery']

/** Requires a session, whatever stage the user is at. */
const PROTECTED_ROUTES = [
  '/dashboard',
  '/account',
  '/settings',
  '/models',
  '/buy-credits',
  '/dating-shoot',
  '/prompt-lab',
  '/gallery',
]

const ONBOARDING_ROUTE = '/models/create'
const STUDIO_ROUTE = '/dating-shoot'

/** Non-localized application and framework routes that are intentionally outside the public SEO registry. */
const NON_LOCALIZED_ROUTE_PREFIXES = [
  '/account',
  '/api',
  '/auth',
  '/buy-credits',
  '/dashboard',
  '/dating-shoot',
  '/error',
  '/gallery',
  '/login',
  '/models',
  '/new-landing',
  '/payment-success',
  '/photo-upload-guide',
  '/preview',
  '/prompt-lab',
  '/settings',
  '/superpanel',
]

const PUBLIC_FILE_PATHS = new Set([
  '/llms.txt',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml',
  '/browserconfig.xml',
])

function matches(pathname: string, routes: string[]) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`))
}

async function runAuthProxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  /**
   * Supabase may rotate the auth token while handling this request, writing the
   * new cookies onto `response`. Returning a bare NextResponse.redirect() would
   * discard them and silently drop the refreshed session, so every redirect is
   * built through here.
   */
  const redirectTo = (pathname: string) => {
    const target = NextResponse.redirect(new URL(pathname, request.url))
    for (const cookie of response.cookies.getAll()) {
      target.cookies.set(cookie)
    }
    return target
  }

  // Check if the user is authenticated
  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (error) {
    console.error('Proxy Auth Error:', error)
    // Treat as unauthenticated on error to prevent crashing
  }

  const { pathname } = request.nextUrl

  // Route handlers authenticate themselves and answer with JSON. Redirecting one
  // would hand a fetch() an HTML login page instead of the 401 it expects. They
  // still pass through above so a rotated session cookie is written back.
  if (pathname.startsWith('/api')) {
    return response
  }

  if (!user) {
    if (matches(pathname, PROTECTED_ROUTES) || pathname === ONBOARDING_ROUTE) {
      return redirectTo('/login')
    }
    return response
  }

  // ── Signed in. Work out where they belong, cheaply. ──────────────────────
  //
  // The cookie answers this for free. Only when it is absent do we pay for a
  // query — once per device — and then cache the answer.
  // Only a 'ready' hint is trusted from the cookie.
  //
  // 'new' is a fact with an expiry date: the moment a user finishes onboarding
  // it is wrong, and it was cached for 180 days. A user whose model predates
  // this cookie, or whose cookie was written before their fourth upload, was
  // sent back to /models/create on every single login with no way out. A
  // positive is stable and worth caching; a negative has to be re-checked.
  let stage: OnboardingStage | null = readStage(request)
  let resolvedThisRequest = false

  if (stage !== 'ready') {
    const { data: models, error } = await supabase
      .from('models')
      .select('id, samples(uri)')
      .eq('user_id', user.id)

    if (error) {
      // A failed lookup is not evidence that the user is new. Sending them to
      // onboarding on an error is exactly the bug this replaces: it strands a
      // user who already has a model. Let the request through untouched and
      // try again next time.
      console.error('Proxy stage lookup failed:', error.message)
      return response
    }

    // Sample count decides this, not models.status.
    //
    // The query used to require status === 'ready', which is set only by the
    // sample upload route when the fourth file lands. A model created before
    // that logic shipped — or by any other path — keeps status 'processing'
    // forever, so a user with a perfectly good model was classed as new.
    // createDatingShootOrder itself requires four samples and never looks at
    // status, so four samples is the honest test.
    const hasUsableModel = (models ?? []).some(
      (model) => ((model as { samples?: unknown[] }).samples?.length ?? 0) >= REQUIRED_SAMPLES
    )
    stage = hasUsableModel ? 'ready' : 'new'
    resolvedThisRequest = true
    // Cache the positive only; see above.
    if (stage === 'ready') setStage(response, stage)
  }

  const send = (pathname: string) => {
    const target = redirectTo(pathname)
    if (resolvedThisRequest && stage === 'ready') setStage(target, stage)
    return target
  }

  if (stage === 'ready') {
    // Entry points resolve straight to the studio, so a returning user lands
    // there in one navigation.
    //
    // /models/create is deliberately NOT redirected. Two reasons: a user with a
    // model may legitimately want to add another, and the studio page keeps its
    // own backstop check — if that check ever disagrees with this cookie (models
    // deleted in another tab, say) it sends the user here, and bouncing them
    // back would be an infinite loop.
    if (matches(pathname, ENTRY_ROUTES)) {
      return send(STUDIO_ROUTE)
    }
    return response
  }

  // stage === 'new': the studio cannot work without a model, so never let the
  // browser commit to it and bounce back.
  if (matches(pathname, ENTRY_ROUTES) || matches(pathname, STUDIO_ROUTES)) {
    return send(ONBOARDING_ROUTE)
  }

  return response
}

function isRedirectResponse(response: NextResponse) {
  return response.status >= 300 && response.status < 400 && response.headers.has('location')
}

function copyResponseCookies(source: NextResponse, target: NextResponse) {
  for (const cookie of source.cookies.getAll()) {
    target.cookies.set(cookie)
  }
}

function notFoundResponse(request: NextRequest, authResponse: NextResponse) {
  const notFoundUrl = request.nextUrl.clone()
  notFoundUrl.pathname = '/_not-found'
  notFoundUrl.search = ''
  const response = NextResponse.rewrite(notFoundUrl, { status: 404 })
  response.headers.set('x-robots-tag', 'noindex, nofollow')
  copyResponseCookies(authResponse, response)
  return response
}

/**
 * Compose locale routing with the existing Supabase session proxy. Auth owns
 * redirects and cookie rotation; next-intl owns only the explicitly public
 * route surface. Product, auth and API URLs therefore remain unprefixed.
 */
export async function proxy(request: NextRequest) {
  const migratedResponse = legacyResponse(request)
  if (migratedResponse) return migratedResponse

  const authResponse = await runAuthProxy(request)

  if (isRedirectResponse(authResponse)) {
    return authResponse
  }

  // The application locale is `pt-BR`, but its public URL prefix is the
  // canonical lowercase `/pt-br`. Because `[locale]` is a dynamic segment,
  // protect the non-canonical casing before Next can serve it directly.
  const nonCanonicalPtBrPrefix = '/pt-BR'
  if (
    request.nextUrl.pathname === nonCanonicalPtBrPrefix ||
    request.nextUrl.pathname.startsWith(`${nonCanonicalPtBrPrefix}/`)
  ) {
    const publicPathname = request.nextUrl.pathname.slice(nonCanonicalPtBrPrefix.length) || '/'
    if (isPublicPathname(publicPathname)) {
      const canonicalUrl = request.nextUrl.clone()
      canonicalUrl.pathname = localizePublicPathname(publicPathname, 'pt-BR')
      const canonicalResponse = NextResponse.redirect(canonicalUrl, 308)
      copyResponseCookies(authResponse, canonicalResponse)
      return canonicalResponse
    }
  }

  if (!isLocaleRoutedPublicPathname(request.nextUrl.pathname)) {
    if (
      PUBLIC_FILE_PATHS.has(request.nextUrl.pathname) ||
      matches(request.nextUrl.pathname, NON_LOCALIZED_ROUTE_PREFIXES)
    ) {
      return authResponse
    }
    return notFoundResponse(request, authResponse)
  }

  const localePath = splitLocalePathname(request.nextUrl.pathname)

  if (
    (localePath.hadLocalePrefix && !isPublishedPublicLocale(localePath.locale)) ||
    (isBlogPathname(localePath.pathname) && !isPublishedBlogLocale(localePath.locale)) ||
    !isPublishedPublicPathname(localePath.pathname, localePath.locale)
  ) {
    return notFoundResponse(request, authResponse)
  }

  const i18nResponse = handleI18nRouting(request)
  copyResponseCookies(authResponse, i18nResponse)
  return i18nResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     *
     * /api is still matched so session refresh reaches route handlers; the
     * handler above returns early for it rather than ever redirecting.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
