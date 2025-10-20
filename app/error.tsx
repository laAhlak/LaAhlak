'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <main className="min-h-screen bg-background-500 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-accent-500 text-3xl">⚠️</span>
      </div>
      <h1 className="text-3xl font-bold text-primary-500 mb-3">حدث خطأ غير متوقع</h1>
      <p className="text-secondary-500 text-lg mb-8 max-w-md">
        نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى أو العودة إلى الصفحة الرئيسية.
      </p>
      <div className="space-y-4 w-full max-w-xs">
        <button
          onClick={reset}
          className="block w-full bg-accent-500 hover:bg-accent-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200"
        >
          إعادة المحاولة
        </button>
        <Link
          href="/dashboard"
          className="block w-full border border-secondary-200 hover:border-secondary-100 text-primary-500 hover:text-primary-600 font-semibold py-4 px-6 rounded-xl transition-colors duration-200"
        >
          العودة إلى لوحة التحكم
        </Link>
      </div>
    </main>
  )
}
