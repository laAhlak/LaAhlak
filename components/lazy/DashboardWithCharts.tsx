'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { getSupabaseClient } from '@/lib/supabaseLazy'
import { getUserTransactions } from '@/lib/transactionsLazy'
import { useAuthLazy } from '@/hooks/useAuthLazy'
import { useLanguage } from '@/contexts/LanguageContext'

// Lazy load send flow modal
const SendFlowModal = dynamic(() => import('./SendFlowModal'), {
  ssr: false
})

export default function DashboardWithCharts() {
  const { t } = useLanguage()
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [firstName, setFirstName] = useState<string>('')
  const [isSendModalOpen, setIsSendModalOpen] = useState(false)
  const [stats, setStats] = useState({
    totalSent: 0,
    totalFees: 0,
    transactionCount: 0
  })

  useEffect(() => {
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const fetchData = async () => {
    try {
      setLoading(true)
      
      const supabase = getSupabaseClient()
      
      // Get current authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        console.error('User not authenticated')
        return
      }

      setUser(user)

      // Get user profile to extract first name
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()

      if (!profileError && profile?.full_name) {
        // Extract first name from full name
        const name = profile.full_name.trim().split(' ')[0]
        setFirstName(name)
      }

      // Get user's transactions with beneficiary info
      const { data: transactionsData, error } = await supabase
        .from('transactions')
        .select(`
          id,
          send_amount_eur,
          total_eur,
          fee_eur,
          total_jod_equivalent,
          status,
          created_at,
          recipient_name,
          beneficiaries (
            name
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) {
        console.error('Error fetching transactions:', error)
        return
      }

      // Format transactions for display
      const formattedTransactions = transactionsData?.map((tx: any) => {
        // Handle beneficiaries - could be object, array, or null from Supabase join
        const beneficiary = Array.isArray(tx.beneficiaries) ? tx.beneficiaries[0] : tx.beneficiaries
        const beneficiaryName = beneficiary?.name || tx.recipient_name || 'مجهول'
        
        return {
          id: tx.id,
          name: beneficiaryName,
          amount: tx.total_eur,
          jodAmount: tx.total_jod_equivalent || (tx.total_eur * 0.85),
          fee: tx.fee_eur,
          status: tx.status,
          date: formatDate(tx.created_at)
        }
      }) || []

      setTransactions(formattedTransactions)

      // Calculate stats
      const totalSent = transactionsData?.reduce((sum, tx) => sum + tx.total_eur, 0) || 0
      const totalFees = transactionsData?.reduce((sum, tx) => sum + tx.fee_eur, 0) || 0
      const transactionCount = transactionsData?.length || 0

      setStats({ totalSent, totalFees, transactionCount })

    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'أمس'
    if (diffDays === 0) return 'اليوم'
    if (diffDays < 7) return `منذ ${diffDays} أيام`
    return date.toLocaleDateString('ar-SA')
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="flex items-center justify-center h-screen">
          <div className="w-16 h-16 border-4 border-secondary-200 border-t-accent-500 rounded-full animate-spin"></div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background-500 flex flex-col">
      {/* Header - Fixed */}
      <div className="bg-primary-500 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-xl font-bold">
              {t('greeting.morning')} {firstName && firstName}
            </h1>
            <p className="text-secondary-300 text-sm">{t('greeting.welcome')}</p>
          </div>
          <Link href="/settings" className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
            <Image
              src="/logo.png"
              alt="Settings"
              width={32}
              height={32}
              className="rounded-full"
            />
          </Link>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Stats Cards */}
        <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div>
              <p className="text-secondary-500 text-sm">{t('stats.totalSent')}</p>
              <p className="text-primary-500 text-2xl font-bold">{stats.totalSent.toFixed(2)} €</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div>
              <p className="text-secondary-500 text-sm">{t('stats.transactionCount')}</p>
              <p className="text-primary-500 text-2xl font-bold">{stats.transactionCount}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setIsSendModalOpen(true)}
            className="bg-accent-500 hover:bg-accent-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 text-center shadow-lg"
          >
            {t('send.button')}
          </button>
          <Link
            href="/beneficiaries"
            className="bg-white hover:bg-secondary-100 text-primary-500 font-semibold py-4 px-6 rounded-xl transition-colors duration-200 text-center border border-secondary-200 shadow-lg"
          >
            {t('beneficiaries.title')}
          </Link>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-primary-500 text-lg font-semibold">{t('transactions.recent')}</h3>
            <Link href="/transactions" className="text-accent-500 text-sm hover:text-accent-400">
              {t('transactions.viewAll')}
            </Link>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-secondary-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-secondary-500 text-xs font-bold">LIST</span>
              </div>
              <p className="text-secondary-500">{t('transactions.none')}</p>
              <Link
                href="/send"
                className="inline-block mt-4 bg-accent-500 hover:bg-accent-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                {t('transactions.sendFirst')}
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-secondary-200 last:border-b-0">
                  <div>
                    <p className="text-primary-500 font-medium">{transaction.name}</p>
                    <p className="text-secondary-500 text-sm">{transaction.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary-500 font-semibold">{transaction.amount.toFixed(2)} €</p>
                    <p className="text-secondary-500 text-sm">{transaction.jodAmount} د.أ</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Send Flow Modal */}
      <SendFlowModal 
        isOpen={isSendModalOpen} 
        onClose={() => setIsSendModalOpen(false)} 
      />
    </main>
  )
}
