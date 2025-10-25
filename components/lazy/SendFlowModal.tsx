'use client'

import { useState, useEffect } from 'react'
import { getBeneficiaries } from '@/lib/beneficiariesLazy'
import { Beneficiary } from '@/lib/supabaseLazy'
import { useAuthLazy } from '@/hooks/useAuthLazy'
import Link from 'next/link'

interface SendFlowModalProps {
  isOpen: boolean
  onClose: () => void
  preSelectedBeneficiary?: any | null
}

export default function SendFlowModal({ isOpen, onClose, preSelectedBeneficiary }: SendFlowModalProps) {
  const [step, setStep] = useState<'select' | 'amount'>('select')
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([])
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const { user } = useAuthLazy()

  // Handle pre-selected beneficiary
  useEffect(() => {
    if (preSelectedBeneficiary) {
      setSelectedBeneficiary(preSelectedBeneficiary)
      setStep('amount')
      setLoading(false)
    }
  }, [preSelectedBeneficiary])

  // Fetch beneficiaries when modal opens (only if no pre-selected)
  useEffect(() => {
    if (isOpen && user && !preSelectedBeneficiary) {
      fetchBeneficiaries()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, user, preSelectedBeneficiary])

  const fetchBeneficiaries = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const { data, error } = await getBeneficiaries(user.id)
      
      if (!error && data) {
        setBeneficiaries(data)
      }
    } catch (err) {
      console.error('Error fetching beneficiaries:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleBeneficiarySelect = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary)
    setStep('amount')
  }

  const handleBack = () => {
    if (step === 'amount') {
      setStep('select')
      setAmount('')
    } else {
      onClose()
    }
  }

  const handleSubmit = async () => {
    if (!selectedBeneficiary || !amount || !user) return

    const amountNum = parseFloat(amount)
    if (amountNum < 5 || amountNum > 100) {
      alert('المبلغ يجب أن يكون بين 5 و 100 دينار أردني')
      return
    }

    setIsProcessing(true)

    try {
      // Create Stripe payment link
      const response = await fetch('/api/stripe/create-payment-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountNum,
          recipient: selectedBeneficiary.name,
          note: `تحويل إلى ${selectedBeneficiary.name}`,
          userId: user.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment link')
      }

      // Redirect to Stripe payment page
      window.location.href = data.paymentLink
    } catch (error) {
      console.error('Error creating payment link:', error)
      alert('حدث خطأ في إنشاء رابط الدفع. يرجى المحاولة مرة أخرى.')
      setIsProcessing(false)
    }
  }

  const calculateTotal = () => {
    if (!amount) return { fee: 0, total: 0, jodAmount: 0 }
    const amountNum = parseFloat(amount)
    const fee = amountNum * 0.04
    const total = amountNum + fee
    // EUR to JOD exchange rate (approximate: 1 EUR = 0.85 JOD)
    const EUR_TO_JOD = 0.85
    const jodAmount = total * EUR_TO_JOD
    return { fee, total, jodAmount }
  }

  if (!isOpen) return null

  const { fee, total, jodAmount } = calculateTotal()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-background-500 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-primary-500 px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="text-white text-xl hover:text-secondary-200"
          >
            ← {step === 'amount' ? 'العودة' : 'إغلاق'}
          </button>
          <h2 className="text-white text-lg font-semibold">
            {step === 'select' ? 'اختر المستفيد' : 'أدخل المبلغ'}
          </h2>
          <div className="w-8"></div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {step === 'select' && (
            <>
              {loading ? (
                <div className="text-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto mb-4"></div>
                  <p className="text-secondary-500">جاري تحميل المستفيدين...</p>
                </div>
              ) : beneficiaries.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-secondary-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-secondary-500 text-xs font-bold">LIST</span>
                  </div>
                  <h3 className="text-primary-500 text-lg font-semibold mb-2">
                    لا يوجد مستفيدون
                  </h3>
                  <p className="text-secondary-500 mb-6">
                    أضف مستفيداً جديداً لبدء إرسال الأموال
                  </p>
                  <Link
                    href="/beneficiaries/add"
                    onClick={onClose}
                    className="inline-block bg-success-500 hover:bg-success-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 shadow-lg"
                  >
                    إضافة مستفيد جديد
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {beneficiaries.map((beneficiary) => (
                    <button
                      key={beneficiary.id}
                      onClick={() => handleBeneficiarySelect(beneficiary)}
                      className="w-full bg-white rounded-xl p-4 border border-secondary-200 hover:border-accent-500 transition-colors duration-200 shadow-lg text-left"
                    >
                      <h3 className="text-primary-500 font-semibold text-lg mb-1">
                        {beneficiary.name}
                      </h3>
                      {beneficiary.email && (
                        <p className="text-secondary-500 text-sm mb-1">
                          {beneficiary.email}
                        </p>
                      )}
                      {beneficiary.phone_number && (
                        <p className="text-secondary-500 text-sm">
                          {beneficiary.phone_number}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {step === 'amount' && selectedBeneficiary && (
            <div className="space-y-6">
              {/* Selected Beneficiary */}
              <div className="bg-white rounded-xl p-4 border border-secondary-200 shadow-lg">
                <p className="text-secondary-500 text-sm mb-1">المستفيد:</p>
                <h3 className="text-primary-500 font-semibold text-lg">
                  {selectedBeneficiary.name}
                </h3>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-primary-500">
                  المبلغ المراد إرساله (يورو)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-500 text-lg">
                    €
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-secondary-200 rounded-xl text-primary-500 text-2xl font-semibold placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent shadow-lg"
                    placeholder="5.00"
                    min="5"
                    max="100"
                    step="0.01"
                    required
                  />
                </div>
                <p className="text-xs text-secondary-500">
                  الحد الأدنى: 5 يورو • الحد الأقصى: 100 يورو
                </p>
              </div>

              {/* Payment Summary */}
              {amount && (
                <div className="bg-white rounded-2xl p-6 space-y-4 shadow-lg">
                  <h3 className="text-primary-500 font-semibold">ملخص الدفع</h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-secondary-500">المجموع (يورو):</span>
                      <span className="text-accent-500 font-bold text-lg">
                        €{total.toFixed(2)}
                      </span>
                    </div>
                    <div className="bg-secondary-100 rounded-lg p-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-secondary-500 text-sm">المبلغ بالدينار الأردني:</span>
                        <span className="text-primary-500 font-semibold text-sm">
                          {jodAmount.toFixed(2)} د.أ
                        </span>
                      </div>
                      <p className="text-xs text-secondary-500 mt-1 text-center">
                        سعر الصرف: 1€ = 0.85 د.أ
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isProcessing || !amount || parseFloat(amount) < 5 || parseFloat(amount) > 100}
                className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-accent-500/50 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 shadow-lg"
              >
                {isProcessing ? 'جاري المعالجة...' : 'إرسال'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

