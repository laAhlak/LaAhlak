'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabaseLazy'
import { useLanguage } from '@/contexts/LanguageContext'

export default function LoginForm() {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const supabase = getSupabaseClient()
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      })

      if (error) {
        setError(t('login.error'))
        setIsLoading(false)
        return
      }

      if (data.user) {
        // Redirect to dashboard on successful login
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(t('common.error'))
      console.error('Login error:', err)
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col p-6 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="text-primary-500 text-xl font-bold">
          ← {t('common.back')}
        </Link>
        <Image
          src="/logo.png"
          alt="LaAhlak Logo"
          width={40}
          height={40}
          className="rounded-lg"
        />
      </div>

      {/* Login Form */}
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-primary-500">{t('login.welcomeBack')}</h1>
            <p className="text-secondary-500">{t('login.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-primary-500 mb-2">
                  {t('login.email')}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-secondary-200 rounded-xl text-primary-500 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent shadow-lg"
                  placeholder={t('login.emailPlaceholder')}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-primary-500 mb-2">
                  {t('login.password')}
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-secondary-200 rounded-xl text-primary-500 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent shadow-lg"
                  placeholder={t('login.passwordPlaceholder')}
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-accent-500 bg-white border-secondary-200 rounded focus:ring-accent-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-secondary-500">{t('login.rememberMe')}</span>
              </label>
              <Link href="#" className="text-sm text-accent-500 hover:text-accent-600">
                {t('login.forgotPassword')}
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-accent-500/50 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 shadow-lg"
            >
              {isLoading ? t('login.loggingIn') : t('login.button')}
            </button>
          </form>

          <div className="text-center">
            <p className="text-secondary-500">
              {t('login.noAccount')}{' '}
              <Link href="/signup" className="text-accent-500 hover:text-accent-600 font-medium">
                {t('login.signupLink')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
