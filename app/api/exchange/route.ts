import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch('https://api.exchangerate.host/latest?base=EUR&symbols=JOD', {
      next: { revalidate: 60 } // Cache for 60 seconds
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rate')
    }
    
    const data = await response.json()
    
    if (!data.success || !data.rates?.JOD) {
      throw new Error('Invalid exchange rate data')
    }
    
    return NextResponse.json({
      success: true,
      rate: data.rates.JOD,
      timestamp: data.timestamp,
      base: data.base,
      date: data.date
    })
  } catch (error) {
    console.error('Exchange rate API error:', error)
    
    // Return fallback rate
    return NextResponse.json({
      success: false,
      rate: 0.75, // Fallback EUR to JOD rate
      timestamp: Math.floor(Date.now() / 1000),
      base: 'EUR',
      date: new Date().toISOString().split('T')[0],
      error: 'Using fallback rate'
    })
  }
}
