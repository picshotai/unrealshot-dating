"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2, Sparkles, CheckCircle2 } from "lucide-react"
import { signInWithMagicLink, signInWithGoogle } from "./actions"
import { CSRFProvider, CSRFInput } from "@/components/csrf-provider"
import Image from "next/image"
import Link from "next/link"
import PublicHeader from "@/components/Header"
import Footer from "@/components/main-landing/Footer"

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
      className="cursor-pointer w-full font-semibold text-sm py-3.5 px-4 bg-[#ff6f00] hover:bg-[#ff6f00]/90 text-white rounded-xl transition-all duration-200 shadow-md shadow-orange-500/20 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Sending Magic Link...
        </>
      ) : (
        "Send Magic Link →"
      )}
    </button>
  )
}

function GoogleSignInButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="cursor-pointer w-full text-sm font-semibold py-3.5 px-4 border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 rounded-xl transition-all duration-200 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-sm"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        <>
          <svg className="h-5 w-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <g fill="none" fillRule="evenodd">
              <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" fill="#FBBC05" />
              <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" fill="#EB4335" />
              <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" fill="#34A853" />
              <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" fill="#4285F4" />
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
  const [urlError, setUrlError] = useState<string | null>(null)

  useEffect(() => {
    const error = searchParams.get('error')
    if (error) {
      setUrlError(error)
      const url = new URL(window.location.href)
      url.searchParams.delete('error')
      window.history.replaceState({}, '', url.toString())
    }
  }, [searchParams])

  const displayError = state?.error || urlError

  return (
    <CSRFProvider>
      <div className="min-h-screen bg-[#F7F5F3] flex flex-col font-[family-name:var(--font-inter)] text-gray-900 selection:bg-[#ff6f00]/20 selection:text-gray-900">
        <PublicHeader />

        <main className="flex-1 flex items-center justify-center pt-24 pb-16 px-4 sm:px-6">
          <div className="w-full max-w-5xl grid md:grid-cols-12 bg-white rounded-3xl border border-gray-200/80 shadow-[0_12px_50px_-15px_rgba(0,0,0,0.08)] overflow-hidden">
            {/* Left: Form Section */}
            <div className="md:col-span-6 lg:col-span-6 flex flex-col justify-center p-8 sm:p-12">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[#ff6f00] text-xs font-semibold mb-4 border border-orange-100">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Dating Photoshoot Platform</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold font-[var(--font-inter-tight)] tracking-tight text-gray-900 mb-2">
                  Welcome to UnrealShot
                </h1>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Sign in or create your account to access your 15 cohesive dating shoots and 15 Photo Retakes.
                </p>
              </div>

              {/* Error & success messages */}
              {displayError && (
                <div className="mb-6 px-4 py-3 border border-red-200 bg-red-50 text-red-700 text-xs rounded-xl">
                  {displayError}
                  {displayError.includes('expired') && (
                    <p className="mt-1 text-red-600">
                      Request a new authentication link below.
                    </p>
                  )}
                </div>
              )}
              {state?.success && (
                <div className="mb-6 px-4 py-3 border border-green-200 bg-green-50 text-green-700 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>{state.success}</span>
                </div>
              )}

              {/* Google sign-in */}
              <form action={signInWithGoogle} className="mb-6">
                <CSRFInput />
                <GoogleSignInButton />
              </form>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-xs text-gray-400 font-medium">Or continue with email</span>
                </div>
              </div>

              {/* Magic link form */}
              <form action={formAction} className="space-y-4">
                <CSRFInput />
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6f00] focus:border-transparent transition-all"
                  />
                </div>

                <MagicLinkSubmit />
              </form>

              {/* Terms */}
              <p className="mt-8 text-xs text-gray-500 text-center leading-relaxed">
                By continuing, you agree to our{' '}
                <Link href="/terms" className="text-gray-700 font-medium hover:text-[#ff6f00] transition-colors underline">Terms</Link>
                {' '}and{' '}
                <Link href="/privacy-policy" className="text-gray-700 font-medium hover:text-[#ff6f00] transition-colors underline">Privacy Policy</Link>.
              </p>
            </div>

            {/* Right: Visual Section */}
            <div className="hidden md:flex md:col-span-6 lg:col-span-6 bg-gradient-to-br from-[#111111] to-[#1a1a1a] p-8 sm:p-12 flex-col justify-between text-white relative">
              <div>
                <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-orange-400 mb-6">
                  ✨ What You Get
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-[var(--font-inter-tight)] tracking-tight mb-4">
                  15 Believable Shoots. <br />
                  60 Candid Photos.
                </h2>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#ff6f00] flex-shrink-0" />
                    <span>4 unique angles &amp; expressions per setting</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#ff6f00] flex-shrink-0" />
                    <span>15 individual Photo Retakes included</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#ff6f00] flex-shrink-0" />
                    <span>Engineered for Tinder, Hinge &amp; Bumble</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#ff6f00] flex-shrink-0" />
                    <span>100% private with permanent deletion control</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-800 flex items-center justify-between text-xs text-gray-400">
                <span>One-time purchase · No subscription</span>
                <span className="text-white font-bold">$39 USD</span>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </CSRFProvider>
  )
}

export default function LoginClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F7F5F3] flex items-center justify-center font-[family-name:var(--font-inter)]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#ff6f00]" />
          <span className="text-sm font-medium text-gray-600">Loading...</span>
        </div>
      </div>
    }>
      <LoginFormWithSearchParams />
    </Suspense>
  )
}