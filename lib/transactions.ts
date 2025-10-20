import { supabase, Transaction } from './supabaseClient'

export async function createTransaction(transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('transactions')
    .insert([transaction])
    .select()
  
  return { data, error }
}

export async function getUserTransactions(userId: string, limit?: number) {
  let query = supabase
    .from('transactions')
    .select(`
      *,
      beneficiaries (
        id,
        name,
        email,
        phone_number
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (limit) {
    query = query.limit(limit)
  }
  
  const { data, error } = await query
  
  return { data, error }
}

export async function getTransaction(transactionId: string, userId: string) {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      beneficiaries (
        id,
        name,
        email,
        phone_number
      )
    `)
    .eq('id', transactionId)
    .eq('user_id', userId)
    .single()
  
  return { data, error }
}

export async function updateTransactionStatus(transactionId: string, status: Transaction['status']) {
  const { data, error } = await supabase
    .from('transactions')
    .update({ 
      status, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', transactionId)
    .select()
  
  return { data, error }
}

export async function updateTransaction(transactionId: string, updates: Partial<Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) {
  const { data, error } = await supabase
    .from('transactions')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', transactionId)
    .select()
  
  return { data, error }
}

export async function getTransactionsByStatus(userId: string, status: Transaction['status']) {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      beneficiaries (
        id,
        name,
        email,
        phone_number
      )
    `)
    .eq('user_id', userId)
    .eq('status', status)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export async function getTransactionStats(userId: string) {
  const { data, error } = await supabase
    .from('transactions')
    .select('status, total_eur, total_jod')
    .eq('user_id', userId)
  
  if (error) return { data: null, error }
  
  const stats = {
    total_transactions: data.length,
    total_sent_eur: data.reduce((sum, tx) => sum + tx.total_eur, 0),
    total_sent_jod: data.reduce((sum, tx) => sum + tx.total_jod, 0),
    completed_transactions: data.filter(tx => tx.status === 'completed').length,
    pending_transactions: data.filter(tx => tx.status === 'pending').length,
    failed_transactions: data.filter(tx => tx.status === 'failed').length,
  }
  
  return { data: stats, error: null }
}
