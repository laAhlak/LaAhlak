'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabaseLazy'
import { createTransaction } from '@/lib/transactionsLazy'

interface TransactionData {
  jodAmount: number
  recipient: string
  note?: string
  quote: {
    totalEUR: number
    feeJOD: number
    exchangeRate: number
  }
}

interface TransactionProcessorProps {
  transactionData: TransactionData
  onSuccess: () => void
  onError: (error: string) => void
}

export default function TransactionProcessor({ transactionData, onSuccess, onError }: TransactionProcessorProps) {
  const [step, setStep] = useState<'processing' | 'payment' | 'confirming' | 'success' | 'error'>('processing')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    processTransaction()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const processTransaction = async () => {
    try {
      setLoading(true)
      setStep('processing')

      const supabase = getSupabaseClient()
      
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error('User not authenticated')
      }

      // Create transaction record
      // Convert JOD to EUR (EUR is primary currency now)
      const EUR_TO_JOD = 0.85
      const eurAmount = transactionData.jodAmount / EUR_TO_JOD
      const feeEUR = transactionData.quote.feeJOD / EUR_TO_JOD
      const totalEUR = eurAmount + feeEUR
      
      const { data: transaction, error: transactionError } = await createTransaction({
        user_id: user.id,
        send_amount_eur: eurAmount,
        fee_eur: feeEUR,
        total_eur: totalEUR,
        send_amount_jod_equivalent: transactionData.jodAmount,
        total_jod_equivalent: transactionData.jodAmount + transactionData.quote.feeJOD,
        eur_to_jod_rate: EUR_TO_JOD,
        status: 'pending',
        recipient_name: transactionData.recipient,
        note: transactionData.note || ''
      })

      if (transactionError) {
        throw new Error('Failed to create transaction')
      }

      if (transaction && transaction[0]) {
        setTransactionId(transaction[0].id)
        setStep('payment')
        
        // Simulate payment processing
        setTimeout(() => {
          setStep('confirming')
          
          // Simulate payment confirmation
          setTimeout(() => {
            setStep('success')
            setTimeout(() => {
              onSuccess()
            }, 2000)
          }, 3000)
        }, 2000)
      }
    } catch (err: any) {
      console.error('Transaction processing error:', err)
      setError(err.message || 'Failed to process transaction')
      setStep('error')
      onError(err.message || 'Failed to process transaction')
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 'processing':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto">
              <div className="w-12 h-12 border-4 border-accent-500/30 border-t-accent-500 rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-semibold text-white">جاري معالجة المعاملة</h2>
            <p className="text-gray-400">يرجى الانتظار...</p>
          </div>
        )

      case 'payment':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto">
              <span className="text-yellow-500 text-3xl">💳</span>
            </div>
            <h2 className="text-xl font-semibold text-white">جاري معالجة الدفع</h2>
            <p className="text-gray-400">تتم معالجة الدفع بأمان...</p>
          </div>
        )

      case 'confirming':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
              <div className="animate-pulse">
                <span className="text-blue-500 text-3xl">⏳</span>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-white">جاري تأكيد المعاملة</h2>
            <p className="text-gray-400">تأكيد المعاملة مع البنك...</p>
          </div>
        )

      case 'success':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <span className="text-green-500 text-3xl">✅</span>
            </div>
            <h2 className="text-xl font-semibold text-white">تم إرسال الأموال بنجاح!</h2>
            <p className="text-gray-400">ستصل الأموال خلال دقائق</p>
            <div className="bg-dark-800 rounded-xl p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">المبلغ:</span>
                <span className="text-white font-semibold">{transactionData.jodAmount} د.أ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">الرسوم:</span>
                <span className="text-white font-semibold">{transactionData.quote.feeJOD} د.أ</span>
              </div>
              <div className="flex justify-between border-t border-gray-600 pt-2">
                <span className="text-gray-400">المجموع:</span>
                <span className="text-primary-500 font-bold">{transactionData.quote.totalEUR} €</span>
              </div>
            </div>
          </div>
        )

      case 'error':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <span className="text-red-500 text-3xl">❌</span>
            </div>
            <h2 className="text-xl font-semibold text-white">فشل في المعاملة</h2>
            <p className="text-gray-400">{error}</p>
            <button
              onClick={() => router.push('/send')}
              className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              المحاولة مرة أخرى
            </button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-dark-800 rounded-2xl p-8">
          {renderStep()}
        </div>
      </div>
    </div>
  )
}
