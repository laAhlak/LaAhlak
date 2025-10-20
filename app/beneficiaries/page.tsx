'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Lazy load the heavy beneficiaries list component
const BeneficiariesList = dynamic(() => import('@/components/lazy/BeneficiariesList'), {
  loading: () => (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p className="text-gray-400">جاري تحميل قائمة المستفيدين...</p>
      </div>
    </div>
  ),
  ssr: false
})

export default function BeneficiariesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400">جاري تحميل الصفحة...</p>
        </div>
      </div>
    }>
      <BeneficiariesList />
    </Suspense>
  )
}