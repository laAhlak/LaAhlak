import { NextRequest, NextResponse } from 'next/server'
import { getUserTransactions, createTransaction, getTransactionStats } from '@/lib/transactions'
import { supabase } from '@/lib/supabaseClient'

export async function GET(req: NextRequest) {
  try {
    // Get user from Authorization header or session
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const limit = searchParams.get('limit')
    const stats = searchParams.get('stats')

    if (stats === 'true') {
      const { data, error } = await getTransactionStats(user.id)
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
      return NextResponse.json({ stats: data })
    }

    const { data, error } = await getUserTransactions(
      user.id, 
      limit ? parseInt(limit) : undefined
    )
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ transactions: data })
  } catch (error) {
    console.error('Transactions API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await req.json()
    const transactionData = {
      ...body,
      user_id: user.id
    }

    const { data, error } = await createTransaction(transactionData)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ transaction: data?.[0] })
  } catch (error) {
    console.error('Create transaction error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
