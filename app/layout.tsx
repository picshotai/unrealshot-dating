import type React from "react"
import type { Metadata } from "next"
import { Inter, Space_Grotesk, JetBrains_Mono, Oxanium } from "next/font/google"
import "./globals.css"
import { Suspense } from "react"
import Script from "next/script"
import ErrorBoundary from "@/components/error-boundary"
import { generateMetadata } from "@/lib/seo"
import { StructuredData } from "@/components/seo/StructuredData"
import {
  generateOrganizationJsonLd,
  generateWebsiteJsonLd
} from "@/lib/seo"
import { Toaster } from "@/components/ui/sonner"
import { Toaster as ShadcnToaster } from "@/components/ui/toaster"


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

const oxanium = Oxanium({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oxanium",
  display: "swap",
})


export const metadata: Metadata = generateMetadata()

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${oxanium.variable} antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />

        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Additional favicon sizes for better compatibility */}
        <link rel="icon" type="image/png" sizes="16x16" href="/icon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon.svg" />
        <link rel="icon" type="image/png" sizes="48x48" href="/icon.svg" />
        <link rel="icon" type="image/png" sizes="96x96" href="/icon.svg" />


        {/* Apple-specific meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="UnrealShot" />

        {/* Microsoft tiles */}
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Theme color */}
        <meta name="theme-color" content="#000000" />

        {/* Organization Schema - Global */}
        <StructuredData
          id="organization-schema"
          data={JSON.parse(generateOrganizationJsonLd())}
        />
        {/* Website Schema - Global */}
        <StructuredData
          id="website-schema"
          data={JSON.parse(generateWebsiteJsonLd())}
        />



      </head>
      <body className="font-sans antialiased public-headings">
        <ErrorBoundary>
          <Suspense fallback={null}>
            {children}
          </Suspense>
        </ErrorBoundary>
        <Toaster richColors closeButton />
        <ShadcnToaster />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XGFT46LL3J"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XGFT46LL3J');
          `}
        </Script>
      </body>
    </html>
  )
}
