import type { NextRequest, NextResponse } from "next/server";

/**
 * Where a signed-in user belongs, cached at the edge.
 *
 * Gating used to live in page-level server components: the browser committed a
 * navigation, the page ran a query, and only then redirected. That is visible as
 * a flash and a wasted round trip, and it stacked — login went to /dashboard,
 * which redirected again.
 *
 * The proxy needs the answer before any page renders, but it should not pay for
 * a database round trip on every request. So the answer is cached in a cookie
 * and the database is consulted only when the cookie is missing. The database
 * stays the source of truth; this is a hint that the proxy can act on instantly.
 */

export const STAGE_COOKIE = "us_stage";

/** `new` — no usable model yet, belongs in onboarding. `ready` — belongs in the studio. */
export type OnboardingStage = "new" | "ready";

/** Samples required before a model can be shot with. */
export const REQUIRED_SAMPLES = 4;

const MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

function isStage(value: unknown): value is OnboardingStage {
  return value === "new" || value === "ready";
}

export function readStage(request: NextRequest): OnboardingStage | null {
  const raw = request.cookies.get(STAGE_COOKIE)?.value;
  return isStage(raw) ? raw : null;
}

export function setStage(response: NextResponse, stage: OnboardingStage): void {
  response.cookies.set({
    name: STAGE_COOKIE,
    value: stage,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE_SECONDS,
  });
}

/**
 * Drop the hint. Used when the truth behind it changes in a way the caller
 * cannot cheaply recompute — the next request re-resolves it from the database.
 */
export function clearStage(response: NextResponse): void {
  response.cookies.set({
    name: STAGE_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
