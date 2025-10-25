'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabaseLazy'

export default function PaymentSuccessPage() {
  const [loading, setLoading] = useState(true)
  const [transaction, setTransaction] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (sessionId) {
      fetchTransactionDetails()
    } else {
      setError('No session ID provided')
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  const fetchTransactionDetails = async () => {
    try {
      const supabase = getSupabaseClient()
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('stripe_session_id', sessionId)
        .single()

      if (error) {
        console.error('Error fetching transaction:', error)
        setError('Transaction not found')
      } else {
        setTransaction(data)
      }
    } catch (err) {
      console.error('Error:', err)
      setError('Failed to fetch transaction details')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-secondary-200 border-t-accent-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary-500">جاري التحقق من الدفع...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-500 text-3xl">❌</span>
          </div>
          <h1 className="text-primary-500 text-2xl font-bold mb-4">خطأ في الدفع</h1>
          <p className="text-secondary-500 mb-8">{error}</p>
          <Link
            href="/dashboard"
            className="bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
          >
            العودة إلى لوحة التحكم
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-20 h-20 bg-success-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-success-500 text-3xl">✅</span>
        </div>
        
        <h1 className="text-primary-500 text-2xl font-bold mb-4">تم الدفع بنجاح!</h1>
        <p className="text-secondary-500 mb-8">شكراً لك على استخدام لِأهلك</p>

        {transaction && (
          <div className="bg-white border border-secondary-200 shadow-lg rounded-2xl p-6 mb-8 text-right">
            <h2 className="text-primary-500 text-lg font-semibold mb-4">تفاصيل المعاملة</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-secondary-500">المستفيد:</span>
                <span className="text-primary-500 font-semibold">{transaction.recipient_name}</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="block w-full bg-accent-500 hover:bg-accent-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 shadow-lg"
          >
            العودة إلى لوحة التحكم
          </Link>
          <Link
            href="/dashboard"
            className="block w-full border-2 border-secondary-200 hover:border-accent-500 text-secondary-500 hover:text-accent-500 font-semibold py-4 px-6 rounded-xl transition-colors duration-200"
          >
            إرسال مبلغ آخر
          </Link>
        </div>
      </div>
    </main>
  )
}
