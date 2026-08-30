"use client"

import { useEffect, useState } from 'react'
import { AlertTriangle, WifiOff } from 'lucide-react'
import { useNetworkStatus } from '@/hooks/use-network-status'
import { useTranslations } from 'next-intl'

export default function NetworkStatus() {
  const { isOnline, isOffline } = useNetworkStatus()
  const t = useTranslations('Blog.errors')

  if (isOnline) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-orange-500 text-white px-4 py-3 rounded-lg shadow-lg max-w-sm">
      <div className="flex items-center gap-2">
        <WifiOff className="h-4 w-4 flex-shrink-0" />
        <span className="text-sm font-medium">{t('offlineCached')}</span>
      </div>
    </div>
  )
}

// Offline banner component for pages
export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true)
  const t = useTranslations('Blog.errors')

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) {
    return null
  }

  return (
    <div className="bg-orange-100 border-l-4 border-orange-500 p-4 mb-6">
      <div className="flex items-center">
        <AlertTriangle className="w-5 h-5 text-orange-500 mr-3" />
        <div>
          <p className="text-orange-700 font-medium">{t('offlineTitle')}</p>
          <p className="text-orange-600 text-sm">{t('offlineBannerDescription')}</p>
        </div>
      </div>
    </div>
  )
}
