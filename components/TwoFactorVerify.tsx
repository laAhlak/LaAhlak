'use client'

import { useState, useEffect } from 'react'
import { verifyPIN, verifyBiometric, get2FASettings } from '@/lib/auth2FA'

interface TwoFactorVerifyProps {
  userId: string
  onVerified: () => void
  onCancel?: () => void
}

export default function TwoFactorVerify({ userId, onVerified, onCancel }: TwoFactorVerifyProps) {
  const [settings, setSettings] = useState<any>(null)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [userId])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const { data } = await get2FASettings(userId)
      setSettings(data)
      
      // Auto-trigger biometric if available
      if (data?.method === 'biometric') {
        handleBiometricVerify()
      }
    } catch (err) {
      console.error('Error loading 2FA settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePINVerify = async () => {
    if (pin.length !== 4) {
      setError('رمز PIN يجب أن يكون 4 أرقام')
      return
    }

    setIsVerifying(true)
    setError('')

    try {
      const isValid = await verifyPIN(userId, pin)
      
      if (isValid) {
        onVerified()
      } else {
        setError('رمز PIN غير صحيح')
        setPin('')
      }
    } catch (err) {
      console.error('Error verifying PIN:', err)
      setError('حدث خطأ أثناء التحقق')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleBiometricVerify = async () => {
    setIsVerifying(true)
    setError('')

    try {
      const isValid = await verifyBiometric(userId)
      
      if (isValid) {
        onVerified()
      } else {
        setError('فشل التحقق من البصمة')
      }
    } catch (err) {
      console.error('Error verifying biometric:', err)
      setError('حدث خطأ أثناء التحقق من البصمة')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && pin.length === 4) {
      handlePINVerify()
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-background-500 rounded-2xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto mb-4"></div>
            <p className="text-secondary-500">جاري التحميل...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-background-500 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">
              {settings?.method === 'biometric' ? '👆' : '🔒'}
            </span>
          </div>
          <h2 className="text-primary-500 text-xl font-bold mb-2">
            التحقق من الهوية
          </h2>
          <p className="text-secondary-500 text-sm">
            {settings?.method === 'pin' && 'أدخل رمز PIN الخاص بك'}
            {settings?.method === 'biometric' && 'استخدم البصمة للتحقق'}
            {settings?.method === 'both' && 'أدخل رمز PIN أو استخدم البصمة'}
          </p>
        </div>

        {/* PIN Input */}
        {(settings?.method === 'pin' || settings?.method === 'both') && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary-500 mb-2 text-center">
                رمز PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                onKeyPress={handleKeyPress}
                autoFocus
                className="w-full px-4 py-4 bg-white border border-secondary-200 rounded-xl text-primary-500 text-center text-3xl font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-accent-500 shadow-lg"
                placeholder="••••"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <button
              onClick={handlePINVerify}
              disabled={isVerifying || pin.length !== 4}
              className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-accent-500/50 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg"
            >
              {isVerifying ? 'جاري التحقق...' : 'تحقق'}
            </button>
          </div>
        )}

        {/* Biometric Button */}
        {settings?.method === 'both' && (
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-secondary-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background-500 text-secondary-500">أو</span>
              </div>
            </div>

            <button
              onClick={handleBiometricVerify}
              disabled={isVerifying}
              className="w-full mt-4 bg-white hover:bg-secondary-100 border border-secondary-200 text-primary-500 font-semibold py-3 rounded-xl transition-colors shadow-lg"
            >
              👆 استخدم البصمة
            </button>
          </div>
        )}

        {/* Biometric Only */}
        {settings?.method === 'biometric' && (
          <div className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <button
              onClick={handleBiometricVerify}
              disabled={isVerifying}
              className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-accent-500/50 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg"
            >
              {isVerifying ? 'جاري التحقق...' : '👆 التحقق بالبصمة'}
            </button>
          </div>
        )}

        {/* Cancel Button */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="w-full mt-4 text-secondary-500 hover:text-primary-500 font-medium py-2 transition-colors"
          >
            إلغاء
          </button>
        )}
      </div>
    </div>
  )
}

