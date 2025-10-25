'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Lazy load the heavy send form component
const SendForm = dynamic(() => import('@/components/lazy/SendForm'), {
  loading: () => (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p className="text-gray-400">جاري تحميل نموذج الإرسال...</p>
      </div>
    </div>
  ),
  ssr: false
})

export default function SendPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-secondary-200 border-t-accent-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-primary-500">جاري تحميل الصفحة...</p>
        </div>
      </div>
    }>
      <SendForm />
    </Suspense>
  )
}