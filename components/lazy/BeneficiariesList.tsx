'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { getBeneficiaries } from '@/lib/beneficiariesLazy'
import { Beneficiary } from '@/lib/supabaseLazy'
import { useAuthLazy } from '@/hooks/useAuthLazy'

const SendFlowModal = dynamic(() => import('./SendFlowModal'), {
  ssr: false
})

export default function BeneficiariesList() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null)
  const [isSendModalOpen, setIsSendModalOpen] = useState(false)

  const { user, loading: authLoading } = useAuthLazy()
  const router = useRouter()

  const refreshList = async () => {
    if (!user) {
      console.log('No user available for refresh')
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await getBeneficiaries(user.id)
      
      if (error) {
        setError('فشل في تحميل المستفيدين')
        console.error('Error fetching beneficiaries:', error)
      } else {
        setBeneficiaries(data || [])
      }
    } catch (err) {
      setError('حدث خطأ غير متوقع')
      console.error('Unexpected error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Only fetch once when user is available
  useEffect(() => {
    let mounted = true

    const fetchData = async () => {
      if (user && !hasLoaded && mounted) {
        try {
          setLoading(true)
          setError(null)
          
          const { data, error } = await getBeneficiaries(user.id)
          
          if (mounted) {
            if (error) {
              setError('فشل في تحميل المستفيدين')
              console.error('Error fetching beneficiaries:', error)
            } else {
              setBeneficiaries(data || [])
            }
            setLoading(false)
            setHasLoaded(true)
          }
        } catch (err) {
          if (mounted) {
            setError('حدث خطأ غير متوقع')
            console.error('Unexpected error:', err)
            setLoading(false)
            setHasLoaded(true)
          }
        }
      } else if (!authLoading && !user && mounted) {
        // User is not authenticated, redirect to login
        console.log('User not authenticated, redirecting to login')
        router.push('/login')
        setLoading(false)
        setHasLoaded(true)
      }
    }

    fetchData()

    return () => {
      mounted = false
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, hasLoaded])

  // Show loading only if we're actually loading data and haven't loaded yet
  if (authLoading || (loading && user && !hasLoaded)) {
    return (
      <main className="min-h-screen bg-background-500">
        {/* Header */}
        <div className="bg-primary-500 px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="text-white text-xl">
              ← العودة
            </Link>
            <h1 className="text-white text-lg font-semibold">المستفيدون</h1>
            <div className="w-8"></div>
          </div>
        </div>

        {/* Loading State */}
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-secondary-200 border-t-accent-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-secondary-500">جاري تحميل المستفيدين...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background-500">
        {/* Header */}
        <div className="bg-primary-500 px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="text-white text-xl">
              ← العودة
            </Link>
            <h1 className="text-white text-lg font-semibold">المستفيدون</h1>
            <div className="w-8"></div>
          </div>
        </div>

        {/* Error State */}
        <div className="px-6 py-20">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">⚠️</span>
            </div>
            <h2 className="text-primary-500 text-lg font-semibold mb-2">خطأ في التحميل</h2>
            <p className="text-secondary-500 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 shadow-lg"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background-500 flex flex-col">
      {/* Header - Fixed */}
      <div className="bg-primary-500 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="text-white text-xl">
            ← العودة
          </Link>
          <h1 className="text-white text-lg font-semibold">المستفيدون</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={refreshList}
              className="text-white hover:text-secondary-200 text-sm py-2 px-3 rounded-lg hover:bg-primary-600 transition-colors duration-200"
              title="تحديث القائمة"
            >
              تحديث
            </button>
            <Link
              href="/beneficiaries/add"
              className="bg-success-500 hover:bg-success-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-lg"
            >
              + إضافة
            </Link>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Beneficiaries List */}
        <div className="px-6 py-6">
        {beneficiaries.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-secondary-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-secondary-500 text-xs font-bold">LIST</span>
            </div>
            <h2 className="text-primary-500 text-lg font-semibold mb-2">لا يوجد مستفيدون</h2>
            <p className="text-secondary-500 mb-6">أضف مستفيداً جديداً لبدء إرسال الأموال</p>
            <Link
              href="/beneficiaries/add"
              className="bg-success-500 hover:bg-success-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 inline-block shadow-lg"
            >
              إضافة مستفيد جديد
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {beneficiaries.map((beneficiary) => (
              <div
                key={beneficiary.id}
                className="bg-white rounded-2xl p-6 border border-secondary-200 hover:border-accent-500 transition-colors duration-200 shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-primary-500 font-semibold text-lg mb-1">
                      {beneficiary.name}
                    </h3>
                    {beneficiary.email && (
                      <p className="text-secondary-500 text-sm mb-1">
                        {beneficiary.email}
                      </p>
                    )}
                    {beneficiary.phone_number && (
                      <p className="text-secondary-500 text-sm mb-2">
                        {beneficiary.phone_number}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 text-xs text-secondary-500">
                      <span>{beneficiary.country}</span>
                      {beneficiary.iban && <span>{beneficiary.iban}</span>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedBeneficiary(beneficiary)
                        setIsSendModalOpen(true)
                      }}
                      className="bg-accent-500 hover:bg-accent-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
                    >
                      إرسال
                    </button>
                    <button className="bg-secondary-200 hover:bg-secondary-300 text-primary-500 text-sm py-2 px-3 rounded-lg transition-colors duration-200">
                      تعديل
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>

      {/* Send Flow Modal */}
      {isSendModalOpen && (
        <SendFlowModal
          isOpen={isSendModalOpen}
          onClose={() => {
            setIsSendModalOpen(false)
            setSelectedBeneficiary(null)
          }}
          preSelectedBeneficiary={selectedBeneficiary}
        />
      )}
    </main>
  )
}
