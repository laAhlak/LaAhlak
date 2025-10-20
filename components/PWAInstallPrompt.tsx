'use client'

import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setShowInstallPrompt(false)
    }
    
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
  }

  if (!showInstallPrompt) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50">
      <div className="bg-primary-500 text-white p-4 rounded-xl shadow-lg">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-lg">📱</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">Install LaAhlak</h3>
            <p className="text-primary-100 text-xs mt-1">
              Add to home screen for quick access
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white/80 hover:text-white text-lg"
          >
            ×
          </button>
        </div>
        <div className="flex space-x-2 mt-3">
          <button
            onClick={handleInstallClick}
            className="flex-1 bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors duration-200"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="flex-1 border border-white/30 hover:border-white/50 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors duration-200"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}
