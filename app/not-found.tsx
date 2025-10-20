import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background-500 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-secondary-200 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-secondary-500 text-3xl">🔍</span>
      </div>
      <h1 className="text-3xl font-bold text-primary-500 mb-3">الصفحة غير موجودة</h1>
      <p className="text-secondary-500 text-lg mb-8 max-w-md">
        عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
      </p>
      <div className="space-y-4 w-full max-w-xs">
        <Link
          href="/dashboard"
          className="block w-full bg-accent-500 hover:bg-accent-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200"
        >
          العودة إلى لوحة التحكم
        </Link>
        <Link
          href="/"
          className="block w-full border border-secondary-200 hover:border-secondary-100 text-primary-500 hover:text-primary-600 font-semibold py-4 px-6 rounded-xl transition-colors duration-200"
        >
          الصفحة الرئيسية
        </Link>
      </div>
    </main>
  )
}
