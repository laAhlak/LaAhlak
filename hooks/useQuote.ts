import { useState, useEffect, useCallback } from 'react';
import { calculateQuote, QuoteResult, validateJODAmount } from '@/lib/fees';

export function useQuote(jodAmount: number) {
  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchQuote = useCallback(async () => {
    if (!jodAmount) {
      setQuote(null);
      return;
    }

    const validation = validateJODAmount(jodAmount);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid amount');
      setQuote(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await calculateQuote(jodAmount);
      setQuote(result);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to calculate quote. Please try again.');
      console.error('Quote calculation error:', err);
    } finally {
      setLoading(false);
    }
  }, [jodAmount]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    if (!jodAmount) return;

    fetchQuote();

    const interval = setInterval(() => {
      fetchQuote();
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [jodAmount, fetchQuote]);

  // Initial fetch when amount changes
  useEffect(() => {
    if (jodAmount) {
      fetchQuote();
    }
  }, [jodAmount, fetchQuote]);

  return {
    quote,
    loading,
    error,
    lastUpdated,
    refreshQuote: fetchQuote,
  };
}
