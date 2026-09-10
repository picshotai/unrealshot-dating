"use client"

import { Suspense, useActionState, useEffect, useRef, useState } from "react"
import { useFormStatus } from "react-dom"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, LockKeyhole } from "lucide-react"
import { signInWithMagicLink, signInWithGoogle } from "./actions"
import { LoginShowcase } from "./LoginShowcase"
import { CSRFProvider, CSRFInput } from "@/components/csrf-provider"
import { FolioLogo } from "@/components/icons/FolioLogo"
import { trackEvent } from "@/lib/analytics/open-analytics"

type AuthState = {
  error?: string
  success?: string
}

function MagicLinkSubmit() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="group flex h-13 w-full cursor-pointer items-center justify-between rounded-[14px] bg-[#ff6f00] p-1.5 pl-5 text-sm font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-[#e86400] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-55"
    >
      <span>{pending ? "Sending your link…" : "Email me a sign-in link"}</span>
      <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white text-[#e86400] transition-transform duration-200 group-hover:translate-x-0.5">
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
      </span>
    </button>
  )
}

function GoogleSignInButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-13 w-full cursor-pointer items-center justify-center gap-3 rounded-[14px] border border-[#dedbd7] bg-white px-4 text-sm font-semibold text-[#242220] transition-[background-color,border-color,transform] duration-200 hover:border-[#c9c4bf] hover:bg-[#faf9f8] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-55"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Connecting…
        </>
      ) : (
        <>
          <svg className="h-[18px] w-[18px]" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <g fill="none" fillRule="evenodd">
              <path d="M9.827 24c0-1.524.253-2.986.705-4.356l-7.909-6.04A23.404 23.404 0 0 0 .214 24c0 3.737.867 7.26 2.406 10.388l7.905-6.051A13.85 13.85 0 0 1 9.827 24" fill="#FBBC05" />
              <path d="M23.714 10.133c3.311 0 6.302 1.174 8.652 3.094L39.202 6.4C35.036 2.773 29.695.533 23.714.533c-9.287 0-17.269 5.311-21.091 13.071l7.909 6.04c1.823-5.532 7.017-9.511 13.182-9.511" fill="#EB4335" />
              <path d="M23.714 37.867c-6.165 0-11.36-3.979-13.182-9.51l-7.909 6.038c3.822 7.761 11.804 13.072 21.091 13.072 5.731 0 11.204-2.036 15.311-5.849l-7.507-5.804c-2.118 1.335-4.786 2.053-7.804 2.053" fill="#34A853" />
              <path d="M46.145 24c0-1.387-.213-2.88-.534-4.267H23.714V28.8h12.604c-.63 3.091-2.346 5.468-4.8 7.014l7.507 5.804C43.34 37.614 46.145 31.65 46.145 24" fill="#4285F4" />
            </g>
          </svg>
          Continue with Google
        </>
      )}
    </button>
  )
}

function LoginFormWithSearchParams() {
  const [state, formAction] = useActionState<AuthState, FormData>(signInWithMagicLink, {} as AuthState)
  const searchParams = useSearchParams()
  const [urlError] = useState<string | null>(() => searchParams.get("error"))
  const trackedSuccess = useRef<string | null>(null)

  useEffect(() => {
    const error = searchParams.get("error")
    if (error) {
      const url = new URL(window.location.href)
      url.searchParams.delete("error")
      window.history.replaceState({}, "", url.toString())
    }
  }, [searchParams])

  useEffect(() => {
    if (state?.success && trackedSuccess.current !== state.success) {
      trackedSuccess.current = state.success
      trackEvent("auth_link_sent", { method: "magic_link" })
    }
  }, [state?.success])

  const displayError = state?.error || urlError

  return (
    <CSRFProvider>
      <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#f5f3f0] font-[family-name:var(--font-inter)] text-[#1b1a19] selection:bg-[#ff6f00]/20">
        <div className="pointer-events-none absolute -left-40 -top-48 h-[480px] w-[480px] rounded-full bg-[#ff6f00]/[0.055] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-64 -right-32 h-[520px] w-[520px] rounded-full bg-white/80 blur-3xl" />

        <header className="relative z-10 mx-auto flex h-18 w-full max-w-[1240px] items-center justify-between px-5 sm:px-8">
          <Link href="/" aria-label="UnrealShot home" className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6f00] focus-visible:ring-offset-4">
            <FolioLogo className="h-8 w-32" />
          </Link>
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-xs font-semibold text-[#77716b] transition-colors hover:text-[#1b1a19] sm:text-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to home
          </Link>
        </header>

        <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-5 sm:px-8 sm:py-8">
          <div className="grid w-full max-w-[1080px] overflow-hidden rounded-[28px] border border-black/[0.07] bg-white md:grid-cols-[0.95fr_1.05fr]">
            <section className="flex min-h-[560px] flex-col justify-center px-7 py-10 sm:px-12 lg:px-16" aria-labelledby="login-title">
              <div className="mx-auto w-full max-w-[390px]">
                <div className="mb-8">
                  <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#e86400]">
                    Your studio is waiting
                  </p>
                  <h1 id="login-title" className="font-[family-name:var(--font-space-grotesk)] text-[2.15rem] font-semibold leading-[1.05] tracking-[-0.045em] text-[#191817] sm:text-[2.55rem]">
                    Welcome back.
                  </h1>
                  <p className="mt-3 text-[15px] leading-6 text-[#706b66]">
                    Sign in to create, manage, and download your dating shoots.
                  </p>
                </div>

                {displayError && (
                  <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-700">
                    {displayError}
                    {displayError.includes("expired") && <p className="mt-1 text-red-600">Request a fresh sign-in link below.</p>}
                  </div>
                )}

                {state?.success && (
                  <div role="status" className="mb-5 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs leading-5 text-emerald-800">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{state.success}</span>
                  </div>
                )}

                <form
                  action={formAction}
                  className="space-y-4"
                  data-oa-event="auth_started"
                  data-oa-prop-method="magic_link"
                >
                  <CSRFInput />
                  <div>
                    <label htmlFor="email" className="mb-2 block text-xs font-semibold text-[#4f4b47]">
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      required
                      className="h-13 w-full rounded-[14px] border border-[#dedbd7] bg-[#fbfaf9] px-4 text-sm text-[#1b1a19] outline-none transition-[background-color,border-color,box-shadow] placeholder:text-[#aaa49e] hover:border-[#cbc6c1] focus:border-[#ff6f00] focus:bg-white focus:ring-4 focus:ring-[#ff6f00]/10"
                    />
                  </div>
                  <MagicLinkSubmit />
                </form>

                <div className="my-5 flex items-center gap-3" aria-hidden="true">
                  <div className="h-px flex-1 bg-[#e8e4e0]" />
                  <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#aaa39c]">or</span>
                  <div className="h-px flex-1 bg-[#e8e4e0]" />
                </div>

                <form
                  action={signInWithGoogle}
                  data-oa-event="auth_started"
                  data-oa-prop-method="google"
                >
                  <CSRFInput />
                  <GoogleSignInButton />
                </form>

                <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-[#928c86]">
                  <LockKeyhole className="h-3.5 w-3.5 text-[#aaa49e]" />
                  Password-free and securely encrypted
                </div>

                <p className="mt-7 text-center text-[11px] leading-5 text-[#918b85]">
                  By continuing, you agree to our{" "}
                  <Link href="/terms" className="font-medium text-[#57524d] underline decoration-[#c8c2bc] underline-offset-2 transition-colors hover:text-[#e86400]">Terms</Link>
                  {" "}and{" "}
                  <Link href="/privacy-policy" className="font-medium text-[#57524d] underline decoration-[#c8c2bc] underline-offset-2 transition-colors hover:text-[#e86400]">Privacy Policy</Link>.
                </p>
              </div>
            </section>

            <LoginShowcase />
          </div>
        </main>

        <footer className="relative z-10 mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-center gap-x-5 gap-y-2 px-5 py-5 text-[11px] text-[#8c8680] sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} UnrealShot</p>
          <nav aria-label="Legal" className="flex items-center gap-4">
            <Link href="/privacy-policy" className="transition-colors hover:text-[#292623]">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-[#292623]">Terms</Link>
            <Link href="/contact" className="transition-colors hover:text-[#292623]">Contact</Link>
          </nav>
        </footer>
      </div>
    </CSRFProvider>
  )
}

export default function LoginClient() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f5f3f0] font-[family-name:var(--font-inter)]">
          <Loader2 className="h-6 w-6 animate-spin text-[#ff6f00]" aria-label="Loading sign in" />
        </div>
      }
    >
      <LoginFormWithSearchParams />
    </Suspense>
  )
}
