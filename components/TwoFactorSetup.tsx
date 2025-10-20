'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuthLazy } from '@/hooks/useAuthLazy'
import {
  get2FASettings,
  enable2FAPIN,
  enable2FABiometric,
  enable2FABoth,
  disable2FA,
  isBiometricAvailable,
  registerBiometric
} from '@/lib/auth2FA'

export default function TwoFactorSetup() {
  const { user } = useAuthLazy()
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [biometricAvailable, setBiometricAvailable] = useState(false)
  const [showPINSetup, setShowPINSetup] = useState(false)
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [selectedMethod, setSelectedMethod] = useState<'pin' | 'biometric' | 'both'>('pin')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadSettings = useCallback(async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const { data, error } = await get2FASettings(user.id)
      
      if (!error && data) {
        setSettings(data)
      }
    } catch (err) {
      console.error('Error loading 2FA settings:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  const checkBiometric = useCallback(async () => {
    const available = await isBiometricAvailable()
    setBiometricAvailable(available)
  }, [])

  useEffect(() => {
    if (user) {
      loadSettings()
      checkBiometric()
    }
  }, [user, loadSettings, checkBiometric])

  const handleEnable2FA = async () => {
    if (!user) return
    
    setError('')
    setSuccess('')
    
    // Validate PIN if needed
    if ((selectedMethod === 'pin' || selectedMethod === 'both') && pin.length !== 4) {
      setError('رمز PIN يجب أن يكون 4 أرقام')
      return
    }
    
    if ((selectedMethod === 'pin' || selectedMethod === 'both') && pin !== confirmPin) {
      setError('رمز PIN غير متطابق')
      return
    }
    
    setIsProcessing(true)
    
    try {
      let result
      
      if (selectedMethod === 'pin') {
        result = await enable2FAPIN(user.id, pin)
      } else if (selectedMethod === 'biometric') {
        // Register biometric first
        const registered = await registerBiometric(user.id)
        if (!registered) {
          setError('فشل تسجيل البصمة. تأكد من تفعيل البصمة على جهازك.')
          setIsProcessing(false)
          return
        }
        result = await enable2FABiometric(user.id)
      } else if (selectedMethod === 'both') {
        // Register biometric first
        const registered = await registerBiometric(user.id)
        if (!registered) {
          setError('فشل تسجيل البصمة. تأكد من تفعيل البصمة على جهازك.')
          setIsProcessing(false)
          return
        }
        result = await enable2FABoth(user.id, pin)
      }
      
      if (result?.error) {
        setError('فشل تفعيل المصادقة الثنائية')
      } else {
        setSuccess('تم تفعيل المصادقة الثنائية بنجاح')
        setShowPINSetup(false)
        setPin('')
        setConfirmPin('')
        await loadSettings()
      }
    } catch (err) {
      console.error('Error enabling 2FA:', err)
      setError('حدث خطأ أثناء تفعيل المصادقة الثنائية')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDisable2FA = async () => {
    if (!user) return
    
    if (!confirm('هل أنت متأكد من تعطيل المصادقة الثنائية؟')) return
    
    setIsProcessing(true)
    setError('')
    setSuccess('')
    
    try {
      const { error } = await disable2FA(user.id)
      
      if (error) {
        setError('فشل تعطيل المصادقة الثنائية')
      } else {
        setSuccess('تم تعطيل المصادقة الثنائية')
        await loadSettings()
      }
    } catch (err) {
      console.error('Error disabling 2FA:', err)
      setError('حدث خطأ أثناء تعطيل المصادقة الثنائية')
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500 mx-auto mb-2"></div>
        <p className="text-secondary-500 text-sm">جاري التحميل...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <div className="bg-white rounded-xl p-6 border border-secondary-200 shadow-lg">
        <h3 className="text-primary-500 font-semibold text-lg mb-4">
          المصادقة الثنائية (2FA)
        </h3>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-primary-500 font-medium">الحالة</p>
            <p className="text-secondary-500 text-sm">
              {settings?.enabled ? 'مفعلة' : 'غير مفعلة'}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-lg ${settings?.enabled ? 'bg-success-500/20 text-success-500' : 'bg-secondary-200 text-secondary-500'}`}>
            {settings?.enabled ? '✓ مفعل' : '✗ معطل'}
          </div>
        </div>
        
        {settings?.enabled && (
          <div className="mb-4">
            <p className="text-primary-500 font-medium">الطريقة</p>
            <p className="text-secondary-500 text-sm">
              {settings.method === 'pin' && '🔢 رمز PIN'}
              {settings.method === 'biometric' && '👆 البصمة'}
              {settings.method === 'both' && '🔢 رمز PIN + 👆 البصمة'}
            </p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-success-500/10 border border-success-500 text-success-500 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}
      </div>

      {/* Setup Options */}
      {!settings?.enabled && !showPINSetup && (
        <div className="space-y-3">
          <h4 className="text-primary-500 font-semibold">اختر طريقة المصادقة</h4>
          
          {/* PIN Option */}
          <button
            onClick={() => {
              setSelectedMethod('pin')
              setShowPINSetup(true)
            }}
            className="w-full bg-white hover:bg-secondary-100 border border-secondary-200 rounded-xl p-4 text-left transition-colors shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-500 font-semibold">🔢 رمز PIN</p>
                <p className="text-secondary-500 text-sm">استخدم رمز مكون من 4 أرقام</p>
              </div>
              <span className="text-accent-500">←</span>
            </div>
          </button>
          
          {/* Biometric Option */}
          {biometricAvailable && (
            <button
              onClick={() => {
                setSelectedMethod('biometric')
                setShowPINSetup(true)
              }}
              className="w-full bg-white hover:bg-secondary-100 border border-secondary-200 rounded-xl p-4 text-left transition-colors shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-500 font-semibold">👆 البصمة</p>
                  <p className="text-secondary-500 text-sm">استخدم بصمة الإصبع أو التعرف على الوجه</p>
                </div>
                <span className="text-accent-500">←</span>
              </div>
            </button>
          )}
          
          {/* Both Option */}
          {biometricAvailable && (
            <button
              onClick={() => {
                setSelectedMethod('both')
                setShowPINSetup(true)
              }}
              className="w-full bg-white hover:bg-secondary-100 border border-secondary-200 rounded-xl p-4 text-left transition-colors shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-500 font-semibold">🔢 + 👆 كلاهما</p>
                  <p className="text-secondary-500 text-sm">رمز PIN والبصمة معاً</p>
                </div>
                <span className="text-accent-500">←</span>
              </div>
            </button>
          )}
          
          {!biometricAvailable && (
            <div className="bg-secondary-100 rounded-xl p-4">
              <p className="text-secondary-500 text-sm">
                ℹ️ البصمة غير متوفرة على هذا الجهاز
              </p>
            </div>
          )}
        </div>
      )}

      {/* PIN Setup Form */}
      {showPINSetup && (selectedMethod === 'pin' || selectedMethod === 'both') && (
        <div className="bg-white rounded-xl p-6 border border-secondary-200 shadow-lg">
          <h4 className="text-primary-500 font-semibold mb-4">
            {selectedMethod === 'both' ? 'إعداد رمز PIN والبصمة' : 'إعداد رمز PIN'}
          </h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary-500 mb-2">
                رمز PIN (4 أرقام)
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 bg-white border border-secondary-200 rounded-xl text-primary-500 text-center text-2xl font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-accent-500 shadow-lg"
                placeholder="••••"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-primary-500 mb-2">
                تأكيد رمز PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 bg-white border border-secondary-200 rounded-xl text-primary-500 text-center text-2xl font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-accent-500 shadow-lg"
                placeholder="••••"
              />
            </div>
            
            {selectedMethod === 'both' && (
              <div className="bg-secondary-100 rounded-lg p-3">
                <p className="text-secondary-500 text-sm">
                  ℹ️ سيتم طلب تسجيل البصمة في الخطوة التالية
                </p>
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPINSetup(false)
                  setPin('')
                  setConfirmPin('')
                  setError('')
                }}
                className="flex-1 bg-secondary-200 hover:bg-secondary-300 text-primary-500 font-semibold py-3 rounded-xl transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleEnable2FA}
                disabled={isProcessing || pin.length !== 4 || confirmPin.length !== 4}
                className="flex-1 bg-accent-500 hover:bg-accent-600 disabled:bg-accent-500/50 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg"
              >
                {isProcessing ? 'جاري التفعيل...' : 'تفعيل'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Biometric Only Setup */}
      {showPINSetup && selectedMethod === 'biometric' && (
        <div className="bg-white rounded-xl p-6 border border-secondary-200 shadow-lg">
          <h4 className="text-primary-500 font-semibold mb-4">إعداد البصمة</h4>
          
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">👆</span>
            </div>
            <p className="text-primary-500 mb-6">
              اضغط على &quot;تفعيل&quot; لتسجيل بصمتك
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPINSetup(false)
                  setError('')
                }}
                className="flex-1 bg-secondary-200 hover:bg-secondary-300 text-primary-500 font-semibold py-3 rounded-xl transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleEnable2FA}
                disabled={isProcessing}
                className="flex-1 bg-accent-500 hover:bg-accent-600 disabled:bg-accent-500/50 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg"
              >
                {isProcessing ? 'جاري التفعيل...' : 'تفعيل'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disable Button */}
      {settings?.enabled && (
        <button
          onClick={handleDisable2FA}
          disabled={isProcessing}
          className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg"
        >
          {isProcessing ? 'جاري التعطيل...' : 'تعطيل المصادقة الثنائية'}
        </button>
      )}
    </div>
  )
}

