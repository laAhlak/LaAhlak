import { supabase, Beneficiary } from './supabaseClient'

export async function getBeneficiaries(userId: string) {
  const { data, error } = await supabase
    .from('beneficiaries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export async function getBeneficiary(beneficiaryId: string, userId: string) {
  const { data, error } = await supabase
    .from('beneficiaries')
    .select('*')
    .eq('id', beneficiaryId)
    .eq('user_id', userId)
    .single()
  
  return { data, error }
}

export async function addBeneficiary(userId: string, beneficiary: Omit<Beneficiary, 'id' | 'user_id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('beneficiaries')
    .insert([{ ...beneficiary, user_id: userId }])
    .select()
  
  return { data, error }
}

export async function updateBeneficiary(beneficiaryId: string, userId: string, updates: Partial<Omit<Beneficiary, 'id' | 'user_id' | 'created_at'>>) {
  const { data, error } = await supabase
    .from('beneficiaries')
    .update(updates)
    .eq('id', beneficiaryId)
    .eq('user_id', userId)
    .select()
  
  return { data, error }
}

export async function deleteBeneficiary(beneficiaryId: string, userId: string) {
  const { error } = await supabase
    .from('beneficiaries')
    .delete()
    .eq('id', beneficiaryId)
    .eq('user_id', userId)
  
  return { error }
}

export async function searchBeneficiaries(userId: string, searchTerm: string) {
  const { data, error } = await supabase
    .from('beneficiaries')
    .select('*')
    .eq('user_id', userId)
    .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone_number.ilike.%${searchTerm}%`)
    .order('created_at', { ascending: false })
  
  return { data, error }
}
