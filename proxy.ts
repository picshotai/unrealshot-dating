import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import {
  readStage,
  setStage,
  REQUIRED_SAMPLES,
  type OnboardingStage,
} from '@/lib/auth/stage'

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
  '/gallery',
]

const ONBOARDING_ROUTE = '/models/create'
const STUDIO_ROUTE = '/dating-shoot'

function matches(pathname: string, routes: string[]) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`))
}

export async function proxy(request: NextRequest) {
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
