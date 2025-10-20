import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface User {
  id: string
  email: string
  full_name?: string
  phone_number?: string
  created_at: string
  updated_at: string
}

export interface Beneficiary {
  id: string
  user_id: string
  name: string
  email?: string
  phone_number?: string
  country: string
  iban?: string
  cliq_id?: string
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  beneficiary_id?: string
  send_amount_jod: number
  fee_jod: number
  total_jod: number
  total_eur: number
  exchange_rate: number
  status: 'pending' | 'completed' | 'failed' | 'expired'
  stripe_session_id?: string
  created_at: string
  updated_at: string
}

export interface FxRate {
  id: string
  base_currency: string
  target_currency: string
  rate: number
  fetched_at: string
}

export interface WebhookLog {
  id: string
  transaction_id?: string
  event_type: string
  payload: any
  created_at: string
}
