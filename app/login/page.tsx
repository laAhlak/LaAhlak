'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Lazy load the login form component
const LoginForm = dynamic(() => import('@/components/lazy/LoginForm'), {
  loading: () => (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto mb-4"></div>
        <p className="text-primary-500">جاري تحميل صفحة تسجيل الدخول...</p>
      </div>
    </div>
  ),
  ssr: false
})

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto mb-4"></div>
          <p className="text-primary-500">جاري تحميل الصفحة...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}