import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy-loaded Supabase client
let supabaseInstance: SupabaseClient | null = null

export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        storageKey: 'laahlak-auth-token'
      }
    })
  }
  
  return supabaseInstance
}

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
  send_amount_eur: number
  fee_eur: number
  total_eur: number
  send_amount_jod_equivalent?: number
  total_jod_equivalent?: number
  eur_to_jod_rate?: number
  status: 'pending' | 'completed' | 'failed' | 'expired'
  stripe_session_id?: string
  recipient_name?: string
  note?: string
  created_at: string
  updated_at: string
}

export interface TransactionWithBeneficiary extends Transaction {
  beneficiaries?: Beneficiary | null
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

// Lazy-loaded functions
export const lazySupabase = {
  async auth() {
    return getSupabaseClient().auth
  },
  
  async from(table: string) {
    return getSupabaseClient().from(table)
  },
  
  async storage() {
    return getSupabaseClient().storage
  },
  
  async realtime() {
    return getSupabaseClient().realtime
  }
}
