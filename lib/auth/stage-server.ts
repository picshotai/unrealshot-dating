import { cookies } from "next/headers";
import { STAGE_COOKIE, type OnboardingStage } from "./stage";

/**
 * Server Action / Route Handler side of the stage hint.
 *
 * Kept apart from `./stage` on purpose: that module is imported by proxy.ts,
 * which runs in the edge runtime, and `next/headers` does not belong there.
 */

export async function writeStageCookie(stage: OnboardingStage): Promise<void> {
  const store = await cookies();
  store.set({
    name: STAGE_COOKIE,
    value: stage,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 180,
  });
}

/**
 * Forget where the user belongs. The next request re-resolves it from the
 * database, so this is the safe move whenever models change underneath us.
 */
export async function clearStageCookie(): Promise<void> {
  const store = await cookies();
  store.set({
    name: STAGE_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
