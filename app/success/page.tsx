'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)
  const [transaction, setTransaction] = useState<any>(null)

  useEffect(() => {
    if (sessionId) {
      // In a real app, you'd fetch transaction details from your API
      // For now, we'll simulate a successful transaction
      setTimeout(() => {
        setTransaction({
          id: sessionId,
          amount: '150.00',
          jodAmount: '200',
          recipient: 'Ahmad Al-Rashid',
          status: 'completed'
        })
        setLoading(false)
      }, 2000)
    } else {
      setLoading(false)
    }
  }, [sessionId])

  if (loading) {
    return (
      <main className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-white">Processing your payment...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="bg-dark-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="text-white text-xl">
            ← Back
          </Link>
          <h1 className="text-white text-lg font-semibold">Payment Success</h1>
          <div className="w-8"></div>
        </div>
      </div>

      {/* Success Content */}
      <div className="px-6 py-8">
        <div className="text-center space-y-6">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <span className="text-green-500 text-4xl">✓</span>
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Payment Successful!</h2>
            <p className="text-gray-400">Your money transfer has been processed</p>
          </div>

          {/* Transaction Details */}
          {transaction && (
            <div className="bg-dark-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-white font-semibold text-lg">Transaction Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Recipient</span>
                  <span className="text-white font-medium">{transaction.recipient}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Amount Sent</span>
                  <span className="text-white font-medium">€{transaction.amount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Amount Received</span>
                  <span className="text-white font-medium">{transaction.jodAmount} JOD</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Status</span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                    {transaction.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Transaction ID</span>
                  <span className="text-gray-300 text-sm font-mono">{transaction.id}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              href="/dashboard"
              className="block w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 text-center"
            >
              Back to Dashboard
            </Link>
            
            <Link
              href="/send"
              className="block w-full border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 text-center"
            >
              Send Another Transfer
            </Link>
          </div>

          {/* Additional Info */}
          <div className="text-center space-y-2">
            <p className="text-gray-400 text-sm">
              You will receive a confirmation email shortly
            </p>
            <p className="text-gray-500 text-xs">
              Transfer typically arrives within 1-2 business days
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
