'use client'

import Link from 'next/link'
import Image from 'next/image'
import SplashScreen from '@/components/SplashScreen'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Home() {
  const { language, toggleLanguage } = useLanguage()
  
  const t = {
    ar: {
      tagline: 'حول بثقة… وصل بمحبة',
      login: 'تسجيل الدخول',
      signup: 'إنشاء حساب جديد'
    },
    en: {
      tagline: 'Transfer with confidence… Connect with love',
      login: 'Login',
      signup: 'Create New Account'
    }
  }

  const currentLang = t[language]
  const appName = 'لِأهلك' // Always in Arabic

  return (
    <>
      <SplashScreen />
      <main className="min-h-screen flex flex-col p-6 bg-white">
        {/* Language Toggle - Top Right */}
        <div className="flex justify-end mb-8">
          <div className="inline-flex bg-secondary-100 rounded-lg p-1">
            <button
              onClick={toggleLanguage}
              className={`px-4 py-2 rounded-md font-semibold transition-all duration-200 ${
                language === 'ar'
                  ? 'bg-accent-500 text-white shadow-md'
                  : 'text-secondary-500 hover:text-primary-500'
              }`}
            >
              عربي
            </button>
            <button
              onClick={toggleLanguage}
              className={`px-4 py-2 rounded-md font-semibold transition-all duration-200 ${
                language === 'en'
                  ? 'bg-accent-500 text-white shadow-md'
                  : 'text-secondary-500 hover:text-primary-500'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center">
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
              <h1 className="text-3xl font-bold text-primary-500 font-arabic">{appName}</h1>
              <p className="text-secondary-500 text-lg font-arabic">{currentLang.tagline}</p>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-4">
              <Link 
                href="/login"
                className="block w-full bg-accent-500 hover:bg-accent-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 text-center font-arabic shadow-lg"
              >
                {currentLang.login}
              </Link>
              
              <Link 
                href="/signup"
                className="block w-full border-2 border-accent-500 hover:bg-accent-50 text-accent-500 font-semibold py-4 px-6 rounded-xl transition-colors duration-200 text-center font-arabic"
              >
                {currentLang.signup}
              </Link>
            </div>

          </div>
        </div>
      </main>
    </>
  )
}
