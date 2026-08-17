"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { signInWithMagicLink, signInWithGoogle } from "./actions"
import { CSRFProvider, CSRFInput } from "@/components/csrf-provider"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/pfplanding/Navbar"


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
      className="cursor-pointer w-full font-mono uppercase tracking-wider text-sm py-4 bg-accent text-background hover:bg-white hover:text-black font-bold transition-all duration-200 border border-transparent active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          SENDING LINK...
        </span>
      ) : (
        "SEND MAGIC LINK →"
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
      className="cursor-pointer w-full font-mono uppercase tracking-wider text-sm py-4 border border-foreground/30 text-foreground hover:border-accent hover:text-accent bg-transparent transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          SIGNING IN...
        </span>
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
          CONTINUE WITH GOOGLE
        </>
      )}
    </button>
  )
}

// Separate component for search params logic
function LoginFormWithSearchParams() {
  const [state, formAction] = useActionState<AuthState, FormData>(signInWithMagicLink, {} as AuthState)
  const searchParams = useSearchParams()
  const router = useRouter()
  const [urlError, setUrlError] = useState<string | null>(null)

  // Check for error messages in URL parameters (from callback redirects)
  useEffect(() => {
    const error = searchParams.get('error')
    if (error) {
      setUrlError(error)
      // Clear the error from URL to prevent it from showing again on refresh
      const url = new URL(window.location.href)
      url.searchParams.delete('error')
      window.history.replaceState({}, '', url.toString())
    }
  }, [searchParams])

  // Combine form state errors with URL errors
  const displayError = state?.error || urlError

  return (
    <CSRFProvider>
      <div className="theme-public min-h-screen flex flex-col text-foreground selection:bg-accent selection:text-foreground">
        {/* Film Grain Overlay */}
        <div className="grain"></div>

        {/* Grid Background */}
        <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(#EBEBEB 1px, transparent 1px), linear-gradient(90deg, #EBEBEB 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        <Navbar />

        {/* Main Content - pt-16 accounts for fixed navbar height */}
        <main className="flex-1 grid md:grid-cols-12 relative z-10 pt-16">
          {/* Left: Form Section */}
          <div className="md:col-span-5 flex flex-col justify-center p-6 md:p-12 lg:p-16 border-r border-foreground/10">
            <div className="font-mono text-xs text-foreground/40 mb-8">
              FRAME: LOGIN // MODE: SECURE
            </div>

            <h1 className="font-display text-4xl md:text-5xl font-bold leading-[0.95] tracking-tighter uppercase mb-4">
              Enter The<br />
              <span className="text-foreground/30">Frame.</span>
            </h1>

            <p className="font-mono text-foreground/60 text-sm max-w-sm mb-10 leading-relaxed">
              Sign in to generate <strong className="text-foreground">hyper-realistic</strong>, candid photos that actually look like you on a great day.
            </p>

            {/* Error & success messages */}
            {displayError && (
              <div className="mb-6 px-4 py-3 border border-red-500/30 bg-red-500/10 text-red-400 font-mono text-xs">
                <span className="text-red-500 mr-2">[!]</span>
                {displayError}
                {displayError.includes('expired') && (
                  <p className="mt-2 text-red-400/70">
                    Request a new authentication link below.
                  </p>
                )}
              </div>
            )}
            {state?.success && (
              <div className="mb-6 px-4 py-3 border border-green-500/30 bg-green-500/10 text-green-400 font-mono text-xs">
                <span className="text-green-500 mr-2">[✓]</span>
                {state.success}
              </div>
            )}

            {/* Magic link form */}
            <form action={formAction} className="space-y-4">
              <CSRFInput />
              <div className="space-y-2">
                <label htmlFor="email" className="block font-mono text-xs uppercase tracking-widest text-foreground/50">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full bg-[#0a0a0a] border border-foreground/20 text-foreground placeholder:text-foreground/30 px-4 py-3 font-mono text-sm focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              <MagicLinkSubmit />
            </form>

            {/* Divider & Google sign-in */}
            <div className="mt-8 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-foreground/10" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-[#080808] px-4 font-mono text-xs text-foreground/40 uppercase">Or</span>
                </div>
              </div>

              <form action={signInWithGoogle}>
                <CSRFInput />
                <GoogleSignInButton />
              </form>
            </div>

            {/* Terms */}
            <p className="mt-8 font-mono text-[10px] text-foreground/40 leading-relaxed">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="text-foreground/60 hover:text-accent transition-colors">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy-policy" className="text-foreground/60 hover:text-accent transition-colors">Privacy Policy</Link>
            </p>
          </div>

          {/* Right: Visual Section */}
          <div className="hidden md:block md:col-span-7 relative bg-[#050505] overflow-hidden">
            <LoginShowcase />
          </div>
        </main>

      </div>
    </CSRFProvider>
  )
}

function LoginShowcase() {
  const images = [
    "/hero2.png",
    "/hero1.png",
    "/hero3.png",
    "/showcase14.png",
  ]

  // Static images: first 2 for top section, next 2 for bottom section
  const topImages = [images[0], images[1]]
  const bottomImages = [images[2], images[3]]

  return (
    <div className="absolute inset-0 grid grid-rows-2">
      {/* Top Panel - 2 images side by side */}
      <div className="relative overflow-hidden border-b border-foreground/10 grid grid-cols-2">
        {topImages.map((src, i) => (
          <div key={src} className={`relative overflow-hidden ${i === 0 ? 'border-r border-foreground/10' : ''}`}>
            <img
              src={src}
              alt="AI Generated Portrait"
              className="absolute inset-0 h-full w-full object-cover opacity-90 hover:opacity-100 transition-opacity"
            />
          </div>
        ))}
        <div className="absolute bottom-4 left-4 bg-[#080808]/80 backdrop-blur border border-foreground/20 px-2 py-1 text-[10px] font-mono uppercase text-foreground/70 z-10">
          // 35mm film, high grain
        </div>

        {/* Film Sprocket Right Edge */}
        <div className="absolute right-0 top-0 bottom-0 w-6 bg-black border-l border-foreground/20 flex flex-col justify-between items-center py-2 z-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-3 h-4 bg-[#1a1a1a] rounded-[2px]"></div>
          ))}
        </div>
      </div>

      {/* Bottom Panel - 2 images side by side */}
      <div className="relative overflow-hidden grid grid-cols-2">
        {bottomImages.map((src, i) => (
          <div key={src} className={`relative overflow-hidden ${i === 0 ? 'border-r border-foreground/10' : ''}`}>
            <img
              src={src}
              alt="AI Generated Portrait"
              className="absolute inset-0 h-full w-full object-cover opacity-90 hover:opacity-100 transition-opacity"
            />
          </div>
        ))}
        <div className="absolute bottom-4 left-4 bg-[#080808]/80 backdrop-blur border border-foreground/20 px-2 py-1 text-[10px] font-mono uppercase text-foreground/70 z-10">
          // raw mode, natural light
        </div>

        {/* Film Sprocket Right Edge */}
        <div className="absolute right-0 top-0 bottom-0 w-6 bg-black border-l border-foreground/20 flex flex-col justify-between items-center py-2 z-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-3 h-4 bg-[#1a1a1a] rounded-[2px]"></div>
          ))}
        </div>
      </div>

      {/* Center "AI GENERATED" label */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-background font-mono text-xs font-bold px-3 py-1 uppercase tracking-widest z-10 pointer-events-none">
        AI GENERATED
      </div>
    </div>
  )
}

export default function LoginClient() {
  return (
    <Suspense fallback={
      <div className="theme-public min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-1.5 h-1.5 bg-accent animate-pulse shadow-[0_0_8px_rgba(255,77,0,0.5)]"></div>
          <span className="font-mono text-xs text-foreground/40 uppercase">Loading...</span>
        </div>
      </div>
    }>
      <LoginFormWithSearchParams />
    </Suspense>
  )
}