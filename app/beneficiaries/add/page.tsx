'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuthLazy } from '@/hooks/useAuthLazy'
import { addBeneficiary } from '@/lib/beneficiariesLazy'
import { Beneficiary } from '@/lib/supabaseLazy'

export default function AddBeneficiaryPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    familyName: '',
    email: '',
    phoneNumber: '',
    iban: '',
    cliqId: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const { user, loading: authLoading, requireAuth } = useAuthLazy()

  useEffect(() => {
    if (!authLoading && !user) {
      requireAuth()
    }
  }, [user, authLoading, requireAuth])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('الاسم الأول مطلوب')
      return false
    }
    if (!formData.familyName.trim()) {
      setError('اسم العائلة مطلوب')
      return false
    }
    if (!formData.email.trim()) {
      setError('البريد الإلكتروني مطلوب')
      return false
    }
    if (!formData.phoneNumber.trim()) {
      setError('رقم الهاتف مطلوب')
      return false
    }
    if (!formData.cliqId.trim()) {
      setError('معرف CliQ مطلوب')
      return false
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('البريد الإلكتروني غير صحيح')
      return false
    }

    // Validate phone number (Jordan format)
    const cleanPhone = formData.phoneNumber.replace(/\s/g, '')
    const phoneRegex = /^(\+962|0)?7[789]\d{7}$/
    if (!phoneRegex.test(cleanPhone)) {
      setError('رقم الهاتف غير صحيح (يجب أن يكون رقم أردني مثل: 07XXXXXXXX)')
      return false
    }

    // Validate IBAN if provided
    if (formData.iban) {
      const cleanIban = formData.iban.replace(/\s/g, '').toUpperCase()
      if (cleanIban.length < 15 || cleanIban.length > 34) {
        setError('رقم IBAN غير صحيح (يجب أن يكون بين 15-34 حرف)')
        return false
      }
      // Basic IBAN format check (starts with 2 letters, then 2 digits, then alphanumeric)
      const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/
      if (!ibanRegex.test(cleanIban)) {
        setError('رقم IBAN غير صحيح (يجب أن يبدأ بحرفين ثم رقمين)')
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    if (!user) {
      setError('يجب تسجيل الدخول أولاً')
      return
    }

    setLoading(true)

    try {
      const beneficiaryData: Omit<Beneficiary, 'id' | 'user_id' | 'created_at'> = {
        name: `${formData.firstName.trim()} ${formData.familyName.trim()}`,
        email: formData.email.trim(),
        phone_number: formData.phoneNumber.replace(/\s/g, ''),
        country: 'Jordan',
        iban: formData.iban ? formData.iban.replace(/\s/g, '').toUpperCase() : undefined,
        cliq_id: formData.cliqId.trim()
      }

      const { data, error } = await addBeneficiary(user.id, beneficiaryData)

      if (error) {
        console.error('Error adding beneficiary:', error)
        setError('فشل في إضافة المستفيد. يرجى المحاولة مرة أخرى.')
      } else {
        setSuccess(true)
        // Reset form
        setFormData({
          firstName: '',
          familyName: '',
          email: '',
          phoneNumber: '',
          iban: '',
          cliqId: ''
        })
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('حدث خطأ غير متوقع')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <main className="min-h-screen bg-background-500 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto mb-4"></div>
          <p className="text-secondary-500">جاري التحميل...</p>
        </div>
      </main>
    )
  }

  if (success) {
    return (
      <main className="min-h-screen bg-background-500">
        {/* Header */}
        <div className="bg-primary-500 px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/beneficiaries" className="text-white text-xl">
              ← العودة
            </Link>
            <h1 className="text-white text-lg font-semibold">تم إضافة المستفيد</h1>
            <div className="w-8"></div>
          </div>
        </div>

        {/* Success Message */}
        <div className="px-6 py-20">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-green-500 text-3xl">✅</span>
            </div>
            <h2 className="text-white text-xl font-semibold mb-4">تم إضافة المستفيد بنجاح!</h2>
            <p className="text-secondary-500 mb-8">يمكنك الآن إرسال الأموال إلى هذا المستفيد</p>
            <div className="space-y-4">
              <Link
                href="/beneficiaries"
                className="block bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
              >
                عرض جميع المستفيدين
              </Link>
              <Link
                href="/send"
                className="block border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
              >
                إرسال أموال
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background-500">
      {/* Header */}
      <div className="bg-primary-500 px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/beneficiaries" className="text-white text-xl">
            ← العودة
          </Link>
          <h1 className="text-white text-lg font-semibold">إضافة مستفيد جديد</h1>
          <div className="w-8"></div>
        </div>
      </div>

      {/* Form */}
      <div className="px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* First Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              الاسم الأول *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-4 bg-white border border-secondary-200 rounded-xl text-primary-500 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent shadow-lg"
              placeholder="أدخل الاسم الأول"
              required
            />
          </div>

          {/* Family Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              اسم العائلة *
            </label>
            <input
              type="text"
              name="familyName"
              value={formData.familyName}
              onChange={handleChange}
              className="w-full px-4 py-4 bg-white border border-secondary-200 rounded-xl text-primary-500 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent shadow-lg"
              placeholder="أدخل اسم العائلة"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              البريد الإلكتروني *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-4 bg-white border border-secondary-200 rounded-xl text-primary-500 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent shadow-lg"
              placeholder="example@email.com"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              رقم الهاتف *
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-4 bg-white border border-secondary-200 rounded-xl text-primary-500 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent shadow-lg"
              placeholder="0791234567"
              required
            />
            <p className="text-xs text-secondary-500">رقم هاتف أردني (07XXXXXXXX)</p>
          </div>

          {/* CliQ ID */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              معرف CliQ *
            </label>
            <input
              type="text"
              name="cliqId"
              value={formData.cliqId}
              onChange={handleChange}
              className="w-full px-4 py-4 bg-white border border-secondary-200 rounded-xl text-primary-500 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent shadow-lg"
              placeholder="أدخل معرف CliQ"
              required
            />
            <p className="text-xs text-secondary-500">معرف CliQ للاستقبال السريع</p>
          </div>

          {/* IBAN (Optional) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              رقم IBAN (اختياري)
            </label>
            <input
              type="text"
              name="iban"
              value={formData.iban}
              onChange={handleChange}
              className="w-full px-4 py-4 bg-white border border-secondary-200 rounded-xl text-primary-500 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent shadow-lg"
              placeholder="JO94CBJO0010000000000131000302"
            />
            <p className="text-xs text-secondary-500">رقم IBAN للتحويل البنكي (اختياري)</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-500/50 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200"
          >
            {loading ? 'جاري الإضافة...' : 'إضافة المستفيد'}
          </button>
        </form>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-secondary-200 px-6 py-3 shadow-lg">
        <div className="flex items-center justify-around">
          <Link href="/dashboard" className="text-center space-y-1">
            <div className="w-6 h-6 rounded flex items-center justify-center mx-auto">
              <span className="text-secondary-500 text-xs">🏠</span>
            </div>
            <p className="text-secondary-500 text-xs">الرئيسية</p>
          </Link>
          <Link href="/send" className="text-center space-y-1">
            <div className="w-6 h-6 rounded flex items-center justify-center mx-auto">
              <span className="text-secondary-500 text-xs">💸</span>
            </div>
            <p className="text-secondary-500 text-xs">إرسال</p>
          </Link>
          <Link href="/beneficiaries" className="text-center space-y-1">
            <div className="w-6 h-6 bg-accent-500 rounded flex items-center justify-center mx-auto">
              <span className="text-white text-xs">👥</span>
            </div>
            <p className="text-accent-500 text-xs">المستفيدون</p>
          </Link>
          <Link href="/settings" className="text-center space-y-1">
            <div className="w-6 h-6 rounded flex items-center justify-center mx-auto">
              <span className="text-secondary-500 text-xs">⚙️</span>
            </div>
            <p className="text-secondary-500 text-xs">الإعدادات</p>
          </Link>
        </div>
      </div>
    </main>
  )
}
