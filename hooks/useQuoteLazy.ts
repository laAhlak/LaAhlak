import { useState, useEffect, useCallback } from 'react'
import { calculateQuote, QuoteResult } from '@/lib/fees'

export function useQuoteLazy(jodAmount: number) {
  const [quote, setQuote] = useState<QuoteResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchQuote = useCallback(async () => {
    if (jodAmount <= 0) {
      setQuote(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await calculateQuote(jodAmount)
      setQuote(result)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Error fetching quote:', err)
      setError('Failed to fetch exchange rate')
    } finally {
      setLoading(false)
    }
  }, [jodAmount])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchQuote()
    }, 500) // Debounce by 500ms

    return () => clearTimeout(timeoutId)
  }, [fetchQuote])

  const refreshQuote = useCallback(() => {
    fetchQuote()
  }, [fetchQuote])

  return {
    quote,
    loading,
    error,
    lastUpdated,
    refreshQuote
  }
}
