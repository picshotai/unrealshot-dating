"use client"

import { useEffect, useState } from "react"
import PublicHeader from "@/components/Header"
import Footer from "@/components/main-landing/Footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from "lucide-react"

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [isOnline, setIsOnline] = useState(true)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Blog page error:', error)

    // Check network status
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [error])

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    reset()
  }

  return (
    <div className="min-h-screen bg-[#F7F5F3] flex flex-col font-[family-name:var(--font-inter)] text-gray-900">
      <PublicHeader />
      <main className="flex-1 flex items-center justify-center pt-28 pb-16">
        <div className="max-w-md mx-auto text-center px-4 bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
          <div className="mb-8">
            {!isOnline ? (
              <WifiOff className="w-16 h-16 text-[#ff6f00] mx-auto mb-4" />
            ) : (
              <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            )}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {!isOnline ? 'You\'re offline' : 'Something went wrong'}
            </h1>
            <p className="text-gray-600 text-sm">
              {!isOnline
                ? 'Please check back later.'
                : 'We\'re having trouble loading the blog content. This might be a temporary issue.'
              }
            </p>
            {retryCount > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                Retry attempts: {retryCount}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleRetry}
              className="w-full bg-[#ff6f00] hover:bg-[#ff6f00]/90 text-white font-semibold"
              disabled={!isOnline}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {!isOnline ? 'Waiting for connection...' : 'Try Again'}
            </Button>

            <Link href="/" className="block">
              <Button variant="outline" className="w-full border-gray-200">
                Go to Homepage
              </Button>
            </Link>

            {!isOnline && (
              <div className="flex items-center justify-center text-xs text-gray-500 mt-4">
                <Wifi className="w-4 h-4 mr-2" />
                <span>Waiting for internet connection...</span>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}