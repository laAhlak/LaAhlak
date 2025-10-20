import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Transaction = {
  id: string
  user_id: string
  sendAmountJOD: number
  totalEUR: number
  feeJOD: number
  exchangeRate: number
  status: 'pending' | 'completed' | 'failed' | 'expired'
  created_at: string
  stripe_session_id?: string
  stripe_payment_intent_id?: string
}
