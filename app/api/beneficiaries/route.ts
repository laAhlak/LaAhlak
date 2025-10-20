import { NextRequest, NextResponse } from 'next/server'
import { getBeneficiaries, addBeneficiary, searchBeneficiaries } from '@/lib/beneficiaries'
import { supabase } from '@/lib/supabaseClient'

export async function GET(req: NextRequest) {
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

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')

    let data, error
    if (search) {
      const result = await searchBeneficiaries(user.id, search)
      data = result.data
      error = result.error
    } else {
      const result = await getBeneficiaries(user.id)
      data = result.data
      error = result.error
    }
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ beneficiaries: data })
  } catch (error) {
    console.error('Beneficiaries API error:', error)
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
    const { data, error } = await addBeneficiary(user.id, body)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ beneficiary: data?.[0] })
  } catch (error) {
    console.error('Create beneficiary error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
