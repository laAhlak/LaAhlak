'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabaseLazy'
import { useLanguage } from '@/contexts/LanguageContext'

export default function SignupForm() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError(t('signup.passwordMismatch'))
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError(t('signup.passwordTooShort'))
      setLoading(false)
      return
    }

    try {
      const supabase = getSupabaseClient()
      
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone_number: formData.phoneNumber
          }
        }
      })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      if (authData.user) {
        // Create user profile in database
        const { error: profileError } = await supabase
          .from('users')
          .insert([{
            id: authData.user.id,
            email: formData.email,
            full_name: formData.fullName,
            phone_number: formData.phoneNumber,
            created_at: new Date().toISOString()
          }])

        if (profileError) {
          console.error('Error creating user profile:', profileError)
          // Don't show error to user as auth was successful
        }

        setSuccess(true)
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      }
    } catch (err: any) {
      setError(t('common.error'))
      console.error('Signup error:', err)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen flex flex-col p-6 bg-white">
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full text-center">
          <div className="space-y-6">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <span className="text-green-500 text-xs font-bold">SUCCESS</span>
            </div>
            <h1 className="text-2xl font-bold text-primary-500">{t('signup.success')}</h1>
            <p className="text-secondary-500">{t('signup.checkEmail')}</p>
            <Link 
              href="/login"
              className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              {t('login.button')}
            </Link>
          </div>
        </div>
      </main>
    )
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

      {/* Signup Form */}
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-primary-500">{t('signup.title')}</h1>
            <p className="text-secondary-500">{t('signup.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-primary-500 mb-2">
                  {t('signup.fullName')}
                </label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-secondary-200 rounded-xl text-primary-500 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent shadow-lg"
                  placeholder={t('signup.fullNamePlaceholder')}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-primary-500 mb-2">
                  {t('login.email')}
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-secondary-200 rounded-xl text-primary-500 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent shadow-lg"
                  placeholder={t('login.emailPlaceholder')}
                  required
                />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-primary-500 mb-2">
                  {t('signup.phone')}
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-secondary-200 rounded-xl text-primary-500 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent shadow-lg"
                  placeholder={t('signup.phonePlaceholder')}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-primary-500 mb-2">
                  {t('login.password')}
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-secondary-200 rounded-xl text-primary-500 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent shadow-lg"
                  placeholder={t('login.passwordPlaceholder')}
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-primary-500 mb-2">
                  {t('signup.confirmPassword')}
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-secondary-200 rounded-xl text-primary-500 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent shadow-lg"
                  placeholder={t('signup.confirmPasswordPlaceholder')}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-accent-500/50 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 shadow-lg"
            >
              {loading ? t('signup.creating') : t('signup.button')}
            </button>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-secondary-500 text-sm">
                {t('signup.haveAccount')}{' '}
                <Link href="/login" className="text-accent-500 hover:text-accent-600 font-medium">
                  {t('login.button')}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
