export interface QuoteResult {
  sendAmountJOD: number;
  feeJOD: number;
  totalJOD: number;
  totalEUR: number;
  exchangeRate: number;
  updatedAt: string;
}

export async function calculateQuote(jodAmount: number): Promise<QuoteResult> {
  try {
    const res = await fetch('/api/exchange');
    const data = await res.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch exchange rate');
    }
    
    const rate = data.rate;
    const fee = jodAmount * 0.04; // 4% fee
    const totalJOD = jodAmount + fee;
    const totalEUR = totalJOD / rate;
    
    return {
      sendAmountJOD: jodAmount,
      feeJOD: fee,
      totalJOD,
      totalEUR,
      exchangeRate: rate,
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error calculating quote:', error);
    // Fallback to a default rate if API fails
    const fallbackRate = 0.75; // Approximate EUR to JOD rate
    const fee = jodAmount * 0.04;
    const totalJOD = jodAmount + fee;
    const totalEUR = totalJOD / fallbackRate;
    
    return {
      sendAmountJOD: jodAmount,
      feeJOD: fee,
      totalJOD,
      totalEUR,
      exchangeRate: fallbackRate,
      updatedAt: new Date().toISOString()
    };
  }
}

export function formatCurrency(amount: number, currency: 'EUR' | 'JOD'): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(amount);
}

export function validateJODAmount(amount: number): { isValid: boolean; error?: string } {
  if (amount < 5) {
    return { isValid: false, error: 'Minimum amount is 5 JOD' };
  }
  if (amount > 100) {
    return { isValid: false, error: 'Maximum amount is 100 JOD' };
  }
  return { isValid: true };
}
