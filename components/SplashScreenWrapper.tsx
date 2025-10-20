'use client'

import { useSplashScreen } from '@/hooks/useSplashScreen'
import SplashScreen from './SplashScreen'

interface SplashScreenWrapperProps {
  children: React.ReactNode
}

export default function SplashScreenWrapper({ children }: SplashScreenWrapperProps) {
  const { showSplash, completeSplash } = useSplashScreen()

  return (
    <>
      {showSplash && <SplashScreen onComplete={completeSplash} />}
      {children}
    </>
  )
}
