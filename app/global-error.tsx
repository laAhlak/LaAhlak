'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global application error:', error)
  }, [error])

  return (
    <html>
      <body>
        <main className="min-h-screen bg-background-500 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-accent-500 text-3xl">🚨</span>
          </div>
          <h1 className="text-3xl font-bold text-primary-500 mb-3">خطأ في التطبيق</h1>
          <p className="text-secondary-500 text-lg mb-8 max-w-md">
            حدث خطأ خطير في التطبيق. يرجى إعادة تحميل الصفحة أو المحاولة لاحقاً.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-accent-500 hover:bg-accent-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200"
          >
            إعادة تحميل الصفحة
          </button>
        </main>
      </body>
    </html>
  )
}
