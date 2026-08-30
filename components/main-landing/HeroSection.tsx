"use client"

import { Button } from "@/components/ui/button"
import { Check, Sparkles } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Caveat } from 'next/font/google';
import { useTranslations } from 'next-intl';

// Configure the Caveat font
const caveat = Caveat({
  subsets: ['latin'],
  weight: '500',
});

interface ShootMarqueeItem {
  id: string;
  shootNumber: string;
  theme: string;
  mainImage: { src: string; alt: string };
  thumbnails: [
    { src: string; alt: string },
    { src: string; alt: string },
    { src: string; alt: string }
  ];
}

const marqueeShoots: ShootMarqueeItem[] = [
  {
    id: "shoot-01",
    shootNumber: "SHOOT 01",
    theme: "GYM / TRAINING",
    mainImage: {
      src: "/new-landing/training-floor-morning-2.png",
      alt: "UnrealShot Gym Shoot - Frame 1: Mid-workout portrait with gym rack lighting"
    },
    thumbnails: [
      {
        src: "/new-landing/training-floor-morning-1.png",
        alt: "UnrealShot Gym Shoot - Frame 2: Full-length floor perspective"
      },
      {
        src: "/new-landing/fa9c4cc3f3a3413c8ae0e898869f1f49.jpg",
        alt: "UnrealShot Gym Shoot - Frame 3: Equipment training candid"
      },
      {
        src: "/new-landing/01616e3c4bb24641b1f623e80cea9e12.jpg",
        alt: "UnrealShot Gym Shoot - Frame 4: Rest interval water break"
      }
    ]
  },
  {
    id: "shoot-02",
    shootNumber: "SHOOT 02",
    theme: "MOTORCYCLE / ROAD TRIP",
    mainImage: {
      src: "/new-landing/mountain-layby-motorcycle_4.png",
      alt: "UnrealShot Motorcycle Shoot - Frame 1: Highway layby portrait"
    },
    thumbnails: [
      {
        src: "/new-landing/mountain-layby-motorcycle_2.png",
        alt: "UnrealShot Motorcycle Shoot - Frame 2: Leaning against bike candid"
      },
      {
        src: "/new-landing/3TZbYnm-kqNBZfoXDdx7W_f7197f805cd34f84b2252dcacd65ee49.jpg",
        alt: "UnrealShot Motorcycle Shoot - Frame 3: Helmet off landscape"
      },
      {
        src: "/new-landing/ZvwZd8Jx-PREBesBKZF38_aa31a675ef8c43bcbc372bc78c2e2712.jpg",
        alt: "UnrealShot Motorcycle Shoot - Frame 4: Mountain ridge scenic view"
      }
    ]
  },
  {
    id: "shoot-03",
    shootNumber: "SHOOT 03",
    theme: "OUTDOOR COFFEE",
    mainImage: {
      src: "/new-landing/2ba004de6cf9475b82150b7bd1ff4807.jpg",
      alt: "UnrealShot Outdoor Coffee Shoot - Frame 1: Espresso terrace opener"
    },
    thumbnails: [
      {
        src: "/new-landing/49f810cc6e4344b480aadb5df98f6d7d.jpg",
        alt: "UnrealShot Outdoor Coffee Shoot - Frame 2: Relaxed table candid"
      },
      {
        src: "/new-landing/519170ac2c004900af87f015bf5a1771.jpg",
        alt: "UnrealShot Outdoor Coffee Shoot - Frame 3: Morning sunlight angle"
      },
      {
        src: "/new-landing/5cc8c2fbbd9a4e8b92ebbe72530d367e.jpg",
        alt: "UnrealShot Outdoor Coffee Shoot - Frame 4: Laughing natural candid"
      }
    ]
  },
  {
    id: "shoot-04",
    shootNumber: "SHOOT 04",
    theme: "DINNER / DRESSED UP",
    mainImage: {
      src: "/new-landing/29ecda7f13764ee595abe3c9be049ddb.jpg",
      alt: "UnrealShot Evening Shoot - Frame 1: Cocktail lounge sharp opener"
    },
    thumbnails: [
      {
        src: "/new-landing/4436e4eadfa843ab94ad12db98a8664b.jpg",
        alt: "UnrealShot Evening Shoot - Frame 2: Smart tailored jacket candid"
      },
      {
        src: "/new-landing/7545cc16b7a94c059fb42bba5aa0ec03.jpg",
        alt: "UnrealShot Evening Shoot - Frame 3: Ambient bar counter framing"
      },
      {
        src: "/new-landing/758bff1bb9d64242badcae3db5b9da54.jpg",
        alt: "UnrealShot Evening Shoot - Frame 4: Low warm evening light portrait"
      }
    ]
  },
  {
    id: "shoot-05",
    shootNumber: "SHOOT 05",
    theme: "CITY WALK",
    mainImage: {
      src: "/new-landing/8cf00013ec6f459f986d903e2c55b6bd.jpg",
      alt: "UnrealShot City Walk Shoot - Frame 1: Street crosswalk candid"
    },
    thumbnails: [
      {
        src: "/new-landing/98d351a9c32544b6a6cf67f849b3709d.jpg",
        alt: "UnrealShot City Walk Shoot - Frame 2: Downtown golden hour framing"
      },
      {
        src: "/new-landing/9f8c395288d14566a2082aa1f97f1a8d.jpg",
        alt: "UnrealShot City Walk Shoot - Frame 3: Brick wall half-body"
      },
      {
        src: "/new-landing/b0e37df119704fc3a10d49b8eb3d3e05.jpg",
        alt: "UnrealShot City Walk Shoot - Frame 4: Walking movement perspective"
      }
    ]
  },
  {
    id: "shoot-06",
    shootNumber: "SHOOT 06",
    theme: "TRAVEL / COASTLINE",
    mainImage: {
      src: "/new-landing/cf26ce46ee2b4559b3074b6df276b578.jpg",
      alt: "UnrealShot Coastal Shoot - Frame 1: Ocean cliff portrait"
    },
    thumbnails: [
      {
        src: "/new-landing/d46441e7fade4496ac0415207e1bd999.jpg",
        alt: "UnrealShot Coastal Shoot - Frame 2: Sea breeze half-body"
      },
      {
        src: "/new-landing/d8800712954d45639eb5caa2ab54f3e4.jpg",
        alt: "UnrealShot Coastal Shoot - Frame 3: Boardwalk shoreline candid"
      },
      {
        src: "/new-landing/e6dc622a63504a7bab9846e0c904750b.jpg",
        alt: "UnrealShot Coastal Shoot - Frame 4: Sunset beach walk"
      }
    ]
  },
  {
    id: "shoot-07",
    shootNumber: "SHOOT 07",
    theme: "HOME / COOKING",
    mainImage: {
      src: "/new-landing/ed0d2abb04e84ccca0af74ac8c4b4838.jpg",
      alt: "UnrealShot Home Shoot - Frame 1: Sunlit kitchen casual opener"
    },
    thumbnails: [
      {
        src: "/new-landing/jzimL01q4n-HYR3LGOpNd_edd9c15406384b23a4881168a98275d2.jpg",
        alt: "UnrealShot Home Shoot - Frame 2: Window sofa coffee moment"
      },
      {
        src: "/new-landing/qypjwusLmXPBiDK6QDNwN_185eda5c96bc4c2ba32d238a42ba51a9.jpg",
        alt: "UnrealShot Home Shoot - Frame 3: Cooking prep natural laugh"
      },
      {
        src: "/new-landing/SHnKUu0hqzogDc12-W8eP_24713af628db4f8b95aba0dc06caf9a6.jpg",
        alt: "UnrealShot Home Shoot - Frame 4: Relaxed indoor smile"
      }
    ]
  },
  {
    id: "shoot-08",
    shootNumber: "SHOOT 08",
    theme: "SUNSET / ROOFTOP",
    mainImage: {
      src: "/showcase1.png",
      alt: "UnrealShot Rooftop Shoot - Frame 1: Skyline golden hour opener"
    },
    thumbnails: [
      {
        src: "/showcase2.png",
        alt: "UnrealShot Rooftop Shoot - Frame 2: Balcony railing half-body"
      },
      {
        src: "/showcase3.png",
        alt: "UnrealShot Rooftop Shoot - Frame 3: Natural laughing candid"
      },
      {
        src: "/showcase4.png",
        alt: "UnrealShot Rooftop Shoot - Frame 4: City overlook sunset view"
      }
    ]
  }
];

export function HeroSection() {
  const t = useTranslations('Home.hero');
  const common = useTranslations('Common');
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
    <section className="relative mx-auto pb-12 overflow-hidden min-h-screen bg-black">
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
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/bg-image.webp')`,
        }}
      />

      <div className="px-4 pt-[150px] max-w-6xl mx-auto text-center flex flex-col justify-center">
        <div className="relative z-10 space-y-6">
          <div className="space-y-6">
            <div className="inline-flex p-[3px] rounded-full bg-gradient-to-r from-[#ff6f00] via-orange-400 to-[#ff6f00] shadow-[0_0_15px_rgba(255,111,0,0.3)] animate-pulse-subtle">
              <div className="flex items-center bg-black rounded-full p-[2px]">

                {/* Left Side: The Hook (High Contrast Orange) */}
                <div className="bg-[#ff6f00] text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Sparkles size={12} className="text-white" />
                  <span className="tracking-wide uppercase">{t('badge')}</span>
                </div>

                {/* --- The NEW Interactive Right Side --- */}
                <div
                  className="flex items-center px-3 cursor-pointer"
                  onClick={handleCopy}
                  title={t('discountLabel')}
                >
                  <span className="text-gray-300 text-xs font-medium mr-1 transition-all duration-300">
                    {isCopied ? (
                      <span className="text-green-400 font-bold">{t('discountCopied')}</span>
                    ) : (
                      <>
                        {t('discount', { discount: 15 })}
                      </>
                    )}
                  </span>

                  {/* The icon now changes based on the state */}
                  {isCopied ? (
                    <Check size={14} className="text-green-400" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#ff6f00] opacity-80"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                  )}
                </div>


              </div>
            </div>
            <h1 className="text-4xl sm:text-6xl max-w-4xl mx-auto font-bold leading-[1.1] mb-4 font-[var(--font-inter-tight)]">
              <span className="text-white">
                {t('title')}
              </span>
              <span className="text-[#ff6f00] block mt-2">
                {t('titleAccent')}
              </span>
            </h1>

            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
              {t('description')}
            </p>
          </div>
          <div className="flex sm:flex-row gap-2 justify-center items-center w-full relative">

            <Link href="/dashboard">
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
                  <span className="text-white text-xs font-bold">{t('proof')}</span>
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
            <p className="text-gray-400 text-md">{t('summary')}</p>
          </div>
        </div>
      </div>

      {/* Slider Section with Right-to-Left Animation */}
      <div className="w-full pt-4 sm:pt-12 overflow-hidden">
        <div className="hidden md:flex w-full">
          <div className="flex animate-slide-rtl">
            {/* Duplicate shoots for seamless loop */}
            {[...marqueeShoots, ...marqueeShoots].map((shoot, index) => (
              <div
                key={`${shoot.id}-${index}`}
                className="min-w-[200px] p-2 relative flex-shrink-0"
                style={{ padding: "0 10px" }}
              >
                {/* 1 Moving Card = 1 Shoot = 4 Photos (200 x 280 footprint) */}
                <div className="relative w-[200px] h-[280px] rounded-xl overflow-hidden bg-[#141414] border border-white/15 shadow-2xl flex flex-col p-1.5 gap-1.5 group">
                  {/* Top Main Photo (~65%) */}
                  <div className="relative w-full h-[180px] rounded-lg overflow-hidden bg-neutral-900">
                    <Image
                      src={shoot.mainImage.src}
                       alt={t('showcaseAlt')}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="200px"
                    />
                    {/* Subtle Shoot Badge with Logo */}
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded border border-white/15">
                      <Image
                        src="/site-logo.png"
                         alt={common('footer.logoAlt')}
                        width={14}
                        height={14}
                        className="w-3.5 h-3.5 rounded"
                      />
                      <span className="font-mono text-[9px] font-bold tracking-wider text-white uppercase">
                         {shoot.shootNumber} · {t('photoCount')}
                      </span>
                    </div>
                  </div>

                  {/* Bottom 3 Frames (~35%, 3:4 each) */}
                  <div className="grid grid-cols-3 gap-1.5 h-[84px] w-full">
                    {shoot.thumbnails.map((thumb, tIdx) => (
                      <div key={tIdx} className="relative w-full h-full rounded-md overflow-hidden bg-neutral-900 border border-white/10">
                        <Image
                          src={thumb.src}
                           alt={t('showcaseAlt')}
                          fill
                          className="object-cover"
                          sizes="60px"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Image Slider - Infinite loop with no gaps */}
        <div className="block md:hidden w-full overflow-hidden">
          <div
            className="flex animate-slide-rtl-mobile"
            style={{
              width: `${marqueeShoots.length * 2 * 220}px` // Double width for seamless loop
            }}
          >
            {/* First set of shoots */}
            {marqueeShoots.map((shoot, index) => (
              <div
                key={`mobile-first-${shoot.id}-${index}`}
                className="w-[200px] p-2 relative flex-shrink-0"
              >
                <div className="relative w-[200px] h-[280px] rounded-xl overflow-hidden bg-[#141414] border border-white/15 shadow-2xl flex flex-col p-1.5 gap-1.5">
                  {/* Top Main Photo (~65%) */}
                  <div className="relative w-full h-[180px] rounded-lg overflow-hidden bg-neutral-900">
                    <Image
                      src={shoot.mainImage.src}
                       alt={t('showcaseAlt')}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded border border-white/15">
                      <Image
                        src="/site-logo.png"
                         alt={common('footer.logoAlt')}
                        width={14}
                        height={14}
                        className="w-3.5 h-3.5 rounded"
                      />
                      <span className="font-mono text-[9px] font-bold tracking-wider text-white uppercase">
                         {shoot.shootNumber} · {t('photoCount')}
                      </span>
                    </div>
                  </div>

                  {/* Bottom 3 Frames */}
                  <div className="grid grid-cols-3 gap-1.5 h-[84px] w-full">
                    {shoot.thumbnails.map((thumb, tIdx) => (
                      <div key={tIdx} className="relative w-full h-full rounded-md overflow-hidden bg-neutral-900 border border-white/10">
                        <Image
                          src={thumb.src}
                           alt={t('showcaseAlt')}
                          fill
                          className="object-cover"
                          sizes="60px"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {/* Second set of shoots for seamless loop */}
            {marqueeShoots.map((shoot, index) => (
              <div
                key={`mobile-second-${shoot.id}-${index}`}
                className="w-[200px] p-2 relative flex-shrink-0"
              >
                <div className="relative w-[200px] h-[280px] rounded-xl overflow-hidden bg-[#141414] border border-white/15 shadow-2xl flex flex-col p-1.5 gap-1.5">
                  {/* Top Main Photo (~65%) */}
                  <div className="relative w-full h-[180px] rounded-lg overflow-hidden bg-neutral-900">
                    <Image
                      src={shoot.mainImage.src}
                       alt={t('showcaseAlt')}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded border border-white/15">
                      <Image
                        src="/site-logo.png"
                         alt={common('footer.logoAlt')}
                        width={14}
                        height={14}
                        className="w-3.5 h-3.5 rounded"
                      />
                      <span className="font-mono text-[9px] font-bold tracking-wider text-white uppercase">
                         {shoot.shootNumber} · {t('photoCount')}
                      </span>
                    </div>
                  </div>

                  {/* Bottom 3 Frames */}
                  <div className="grid grid-cols-3 gap-1.5 h-[84px] w-full">
                    {shoot.thumbnails.map((thumb, tIdx) => (
                      <div key={tIdx} className="relative w-full h-full rounded-md overflow-hidden bg-neutral-900 border border-white/10">
                        <Image
                          src={thumb.src}
                           alt={t('showcaseAlt')}
                          fill
                          className="object-cover"
                          sizes="60px"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-rtl {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-slide-rtl {
          animation: slide-rtl 60s linear infinite;
        }
        
        .animate-slide-rtl-mobile {
          animation: slide-rtl-mobile 38s linear infinite;
        }
        
        @keyframes slide-rtl-mobile {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>

      
    </section>
  )
}
