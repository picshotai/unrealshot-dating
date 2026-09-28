"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Caveat } from 'next/font/google';
import { useTranslations } from 'next-intl';
import { HeroVideoPlayer } from "@/components/main-landing/HeroVideoPlayer";

// Configure the Caveat font
const caveat = Caveat({
  subsets: ['latin'],
  weight: '500',
});





export function HeroSection() {
  const t = useTranslations('Home.hero');
  const [isCopied, setIsCopied] = useState(false)
  const couponCode = "WELCOME15"

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode)
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 2000) // Revert back to the original text after 2 seconds
  }
  return (
    <section className="relative mx-auto pb-16 sm:pb-24 overflow-hidden min-h-screen bg-[#0b0b0b]">
      {/* Paper Texture */}
      <div
        className="absolute inset-0 z-2 -pt-8"
        style={{
          backgroundImage: `url('/bg-pattern.svg')`,
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'auto'
        }}
      />
      {/* Starfield from the top of the texture, faded out so the stage stays one continuous dark */}
      <div
        className="absolute inset-x-0 top-0 z-0 h-[1131px]"
        style={{
          backgroundImage: `url('/bg-image.webp')`,
          backgroundPosition: 'top center',
          backgroundRepeat: 'repeat-x',
          maskImage: 'linear-gradient(to bottom, black 0%, black 30%, transparent 52%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 30%, transparent 52%)',
        }}
      />
      <div className="px-4 pt-[150px] max-w-6xl mx-auto text-center flex flex-col justify-center">
        <div className="relative z-10 space-y-6">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase leading-none tracking-[0.12em] text-[#ff6f00]">
              {t('badge')}
            </p>
            <h1 className="text-4xl sm:text-6xl max-w-4xl mx-auto font-semibold leading-[1.1] mb-4 font-[var(--font-inter-tight)]">
              <span className="text-white">
                {t('title')}
              </span>
              <span className="text-[#ff6f00] block mt-2">
                {t('titleAccent')}
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-[38rem] text-base leading-normal text-[#b4b4bb] sm:text-lg">
              {t('description')}
            </p>
          </div>
          <div className="flex sm:flex-row gap-2 justify-center items-center w-full relative">

            <Link href="/login">
              <Button
                className="text-sm sm:text-md font-semibold py-5 sm:py-6 group relative bg-white hover:bg-white/90 text-black rounded-md overflow-hidden cursor-pointer pr-12"
              >
                {t('primaryCta')}
                <div className="bg-[#ff6f00] text-white rounded-sm p-2 sm:p-3 absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center">
                  <img
                    src="/arrow.svg"
                    alt="arrow-right"
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 brightness-0 invert"
                  />
                </div>
              </Button>
            </Link>
            <Link href="/login" className="hidden sm:inline-block">
              <Button
                className="text-sm sm:text-md font-semibold py-5 sm:py-6 group relative bg-[#ff6f00] hover:bg-[#ff6f00]/90 text-white rounded-md overflow-hidden cursor-pointer pr-12"
              >
                {t('signIn')}
                <div className="bg-white rounded-sm p-2 sm:p-3 absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 transition-transform duration-200 group-hover:scale-110"
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <g fill="none" fillRule="evenodd">
                      <path
                        d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
                        fill="#FBBC05"
                      />
                      <path
                        d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
                        fill="#EB4335"
                      />
                      <path
                        d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667"
                        fill="#34A853"
                      />
                      <path
                        d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24"
                        fill="#4285F4"
                      />
                    </g>
                  </svg>
                </div>
              </Button>
            </Link>

            {/* Whirl Arrow pointing to floating text */}
            <div className="hidden md:block absolute right-82 top-16 mt-4 -translate-y-1/2 w-16 h-20 pointer-events-none">
              <svg
                viewBox="0 0 59 42"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full text-orange-500 opacity-70 transform rotate-50"
              >
                <path
                  d="M7.66614 22.083C8.61245 23.967 9.50382 25.809 10.5502 27.8855C9.46822 27.9516 8.62906 27.273 8.11869 26.4189C6.58755 23.8566 5.08123 21.2357 3.75924 18.5229C2.99812 16.9739 3.65927 15.9282 5.04612 16.172C7.36079 16.5421 9.68076 17.0712 12.0256 17.5417C12.1602 17.5669 12.3348 17.5838 12.4048 17.6759C12.7097 17.9858 12.9498 18.3626 13.2298 18.7311C12.9958 18.9402 12.8221 19.3502 12.5678 19.35C11.6851 19.3744 10.8123 19.29 9.95444 19.2559C9.48565 19.2471 9.04169 19.1798 8.47894 19.5644C9.09834 20.0754 9.7328 20.6367 10.3522 21.1477C23.4279 31.1179 38.4176 30.6525 47.7967 20.0973C48.9958 18.7256 50.015 17.178 51.1441 15.7141C51.5421 15.2039 51.955 14.7439 52.353 14.2337C52.5027 14.3091 52.6277 14.4431 52.7774 14.5186C52.7934 14.9956 52.9342 15.6067 52.7454 15.9665C52.1844 17.2048 51.6234 18.443 50.8975 19.5556C43.7187 30.665 30.0661 33.8934 16.8279 27.4803C14.2971 26.248 11.87 24.5135 9.42336 22.9967C8.90409 22.6783 8.44951 22.2929 7.95505 21.9159C7.86023 21.8823 7.75566 21.9576 7.66614 22.083Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </svg>
            </div>

            {/* Floating text */}
            <p className={`hidden md:block text-gray-300 text-lg font-semibold leading-none md:absolute md:transform md:rotate-6 md:right-40 md:top-full md:mt-8 md:w-48 sm:static sm:mt-2 sm:transform-none sm:rotate-0 sm:text-center sm:w-auto pointer-events-none ${caveat.className}`}>
              {t('floatingNote')}
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 pt-2">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                <img
                  src="/content/sachin.webp"
                  alt={t('userPhotoAlt')}
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
                <img
                  src="/content/sumesh.webp"
                  alt={t('userPhotoAlt')}
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
                <img
                  src="/content/manoj.jpg"
                  alt={t('userPhotoAlt')}
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
                <img
                  src="/content/emma-thopmson.jpg"
                  alt={t('userPhotoAlt')}
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
                <div className="w-8 h-8 rounded-full bg-gray-900 border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">{t('proof')}</span>
                </div>
              </div>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-lg">
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p className="text-sm leading-normal text-[#b4b4bb]">{t('summary')}</p>
            {/* Launch discount: a quiet, tap-to-copy code instead of a badge */}
            <button
              type="button"
              onClick={handleCopy}
              title={t('discountLabel')}
              className="inline-flex cursor-pointer items-center gap-2 pt-1 text-sm leading-normal text-[#b4b4bb] transition-colors hover:text-white"
            >
              <span className="rounded-md border border-dashed border-white/25 px-2 py-0.5 font-mono text-xs font-medium tracking-wider text-white">
                {couponCode}
              </span>
              {isCopied ? (
                <span className="inline-flex items-center gap-1 text-green-400">
                  <Check size={14} aria-hidden="true" />
                  {t('discountCopied')}
                </span>
              ) : (
                <span>{t('discount', { discount: 15 })}</span>
              )}
            </button>
          </div>

          {/* The dark stage ends partway down the film; the next section's light starts behind it */}
          <div className="relative">
            <div aria-hidden="true" className="absolute -bottom-[40rem] left-1/2 top-[62%] w-[300vw] -translate-x-1/2 bg-[#F7F5F3]" />
            <HeroVideoPlayer />
          </div>
        </div>
      </div>

    </section>
  )
}
