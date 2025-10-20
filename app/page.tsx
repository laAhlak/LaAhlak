import Link from 'next/link'
import Image from 'next/image'
import SplashScreen from '@/components/SplashScreen'

export default function Home() {
  return (
    <>
      <SplashScreen />
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
        <div className="text-center space-y-8 max-w-md w-full">
          {/* Logo */}
          <div className="space-y-4">
            <div className="w-32 h-32 mx-auto flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="LaAhlak Logo"
                width={128}
                height={128}
                priority
              />
            </div>
            <h1 className="text-3xl font-bold text-primary-500 font-arabic">لِأهلك</h1>
            <p className="text-secondary-500 text-lg font-arabic">حول بثقة… وصل بمحبة</p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4">
            <Link 
              href="/login"
              className="block w-full bg-accent-500 hover:bg-accent-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 text-center font-arabic shadow-lg"
            >
              تسجيل الدخول
            </Link>
            
            <Link 
              href="/signup"
              className="block w-full border-2 border-accent-500 hover:bg-accent-50 text-accent-500 font-semibold py-4 px-6 rounded-xl transition-colors duration-200 text-center font-arabic"
            >
              إنشاء حساب جديد
            </Link>
          </div>

        </div>
      </main>
    </>
  )
}
