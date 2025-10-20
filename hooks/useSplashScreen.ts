'use client'

import { useState, useEffect } from 'react'

export function useSplashScreen() {
  const [showSplash, setShowSplash] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if splash screen was already shown in this session
    const splashShown = sessionStorage.getItem('splash-shown')
    
    if (splashShown) {
      setShowSplash(false)
      setIsLoading(false)
      return
    }

    // Show splash screen for first-time visitors
    const timer = setTimeout(() => {
      setShowSplash(false)
      setIsLoading(false)
      sessionStorage.setItem('splash-shown', 'true')
    }, 3000) // 3 seconds total

    return () => clearTimeout(timer)
  }, [])

  const completeSplash = () => {
    setShowSplash(false)
    setIsLoading(false)
    sessionStorage.setItem('splash-shown', 'true')
  }

  return {
    showSplash,
    isLoading,
    completeSplash
  }
}
