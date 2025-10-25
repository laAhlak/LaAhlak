'use client'

import { useEffect, useState } from 'react'

interface SplashScreenProps {
  onComplete?: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Hide splash screen after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(false)
      onComplete?.()
    }, 2000)

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-secondary-200 border-t-accent-500 rounded-full animate-spin"></div>
          </div>
        </div>
        <h1 className="text-primary-500 text-3xl font-bold mb-2">لِأهلك</h1>
        <p className="text-secondary-500">حَوّل بسهولة وأمان</p>
      </div>
    </div>
  )
}
