'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabaseLazy'

export default function SendForm() {
  const [jodAmount, setJodAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [note, setNote] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [recentContacts, setRecentContacts] = useState<any[]>([])
  const [loadingContacts, setLoadingContacts] = useState(true)
  const searchParams = useSearchParams()


  // Handle URL parameters to pre-fill recipient details
  useEffect(() => {
    const recipientParam = searchParams.get('recipient')
    const emailParam = searchParams.get('email')
    const phoneParam = searchParams.get('phone')

    if (recipientParam) {
      // Pre-fill recipient field with beneficiary details
      let recipientText = recipientParam
      if (emailParam) {
        recipientText += ` (${emailParam})`
      } else if (phoneParam) {
        recipientText += ` (${phoneParam})`
      }
      setRecipient(recipientText)
    }
  }, [searchParams])

  // Fetch recent contacts from transactions
  useEffect(() => {
    const fetchRecentContacts = async () => {
      try {
        setLoadingContacts(true)
        
        // Get current authenticated user
        const supabase = getSupabaseClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
          console.error('User not authenticated')
          return
        }

        // Get recent transactions to extract contacts
        const { data: transactions, error } = await supabase
          .from('transactions')
          .select(`
            recipient_name,
            recipient_email,
            recipient_phone,
            created_at
          `)
          .eq('user_id', user.id)
          .not('recipient_name', 'is', null)
          .order('created_at', { ascending: false })
          .limit(5)

        if (error) {
          console.error('Error fetching recent contacts:', error)
        } else {
          // Extract unique contacts
          const contacts = transactions?.map(tx => ({
            name: tx.recipient_name,
            email: tx.recipient_email,
            phone: tx.recipient_phone,
            lastUsed: tx.created_at
          })) || []
          
          setRecentContacts(contacts)
        }
      } catch (err) {
        console.error('Error fetching contacts:', err)
      } finally {
        setLoadingContacts(false)
      }
    }

    fetchRecentContacts()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!jodAmount || parseFloat(jodAmount) < 5 || parseFloat(jodAmount) > 100) {
      alert('المبلغ يجب أن يكون بين 5 و 100 دينار أردني')
      return
    }

    if (!recipient.trim()) {
      alert('يرجى إدخال اسم المستفيد')
      return
    }

    if (!user) {
      alert('يرجى تسجيل الدخول أولاً')
      return
    }

    setIsLoading(true)

    try {
      // Create Stripe payment link
      const response = await fetch('/api/stripe/create-payment-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(jodAmount),
          recipient: recipient.trim(),
          note: note.trim(),
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
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <main className="min-h-screen bg-background-500">
      {/* Header */}
      <div className="bg-primary-500 px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="text-white text-xl">
            ← العودة
          </Link>
          <h1 className="text-white text-lg font-semibold">إرسال الأموال</h1>
          <div className="w-8"></div>
        </div>
      </div>

      {/* Recent Contacts */}
      {recentContacts.length > 0 && (
        <div className="px-6 py-4">
          <h2 className="text-white text-sm font-medium mb-3">جهات الاتصال الأخيرة</h2>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {recentContacts.map((contact, index) => (
              <button
                key={index}
                onClick={() => setRecipient(contact.name)}
                className="flex-shrink-0 bg-dark-800 text-white px-4 py-2 rounded-xl text-sm border border-gray-600 hover:border-primary-500 transition-colors"
              >
                {contact.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Send Form */}
      <div className="px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
                 {/* JOD Amount Input */}
                 <div className="space-y-2">
                   <label className="block text-sm font-medium text-primary-500">
                     المبلغ المراد إرساله (دينار أردني)
                   </label>
                   <div className="relative">
                     <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-500 text-lg">د.أ</span>
                     <input
                       type="number"
                       value={jodAmount}
                       onChange={(e) => setJodAmount(e.target.value)}
                       className="w-full pl-12 pr-4 py-4 bg-white border border-secondary-200 rounded-xl text-primary-500 text-2xl font-semibold placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent shadow-lg"
                       placeholder="5.00"
                       min="5"
                       max="100"
                       step="0.01"
                       required
                     />
                   </div>
                   <p className="text-xs text-secondary-500">الحد الأدنى: 5 دينار • الحد الأقصى: 100 دينار</p>
                 </div>

          {/* Payment Summary */}
          {jodAmount && (
            <div className="bg-white rounded-2xl p-6 space-y-4 shadow-lg">
              <h3 className="text-primary-500 font-semibold">ملخص الدفع</h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-secondary-500">المبلغ المرسل:</span>
                  <span className="text-primary-500 font-semibold">{jodAmount} د.أ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary-500">رسوم الخدمة (4%):</span>
                  <span className="text-primary-500 font-semibold">{(parseFloat(jodAmount) * 0.04).toFixed(2)} د.أ</span>
                </div>
                <div className="border-t border-secondary-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-secondary-500">المجموع:</span>
                    <span className="text-accent-500 font-bold text-lg">{(parseFloat(jodAmount) * 1.04).toFixed(2)} د.أ</span>
                  </div>
                </div>
                <div className="text-xs text-secondary-500 text-center">
                  سيتم التحويل بشكل آمن
                </div>
              </div>
            </div>
          )}

          {/* Recipient Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary-500">
              اسم المستفيد
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full px-4 py-4 bg-white border border-secondary-200 rounded-xl text-primary-500 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent shadow-lg"
              placeholder="أدخل اسم المستفيد"
              required
            />
          </div>

          {/* Note Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary-500">
              ملاحظة (اختياري)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-4 bg-white border border-secondary-200 rounded-xl text-primary-500 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent resize-none shadow-lg"
              placeholder="أضف ملاحظة للمعاملة"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !jodAmount || !recipient}
            className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-accent-500/50 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 shadow-lg"
          >
            {isLoading ? 'جاري المعالجة...' : 'تحويل'}
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
            <div className="w-6 h-6 bg-accent-500 rounded flex items-center justify-center mx-auto">
              <span className="text-white text-xs">💸</span>
            </div>
            <p className="text-accent-500 text-xs">إرسال</p>
          </Link>
          <Link href="/beneficiaries" className="text-center space-y-1">
            <div className="w-6 h-6 rounded flex items-center justify-center mx-auto">
              <span className="text-secondary-500 text-xs">👥</span>
            </div>
            <p className="text-secondary-500 text-xs">المستفيدون</p>
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
