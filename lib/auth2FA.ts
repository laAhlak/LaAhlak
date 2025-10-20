import { getSupabaseClient } from './supabaseLazy'

export interface TwoFactorSettings {
  enabled: boolean
  method: 'pin' | 'biometric' | 'both' | null
  pin_hash?: string
  biometric_enabled?: boolean
  last_verified?: string
}

/**
 * Get user's 2FA settings
 */
export async function get2FASettings(userId: string) {
  const supabase = getSupabaseClient()
  
  const { data, error } = await supabase
    .from('user_2fa_settings')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  return { data, error }
}

/**
 * Enable 2FA with PIN
 */
export async function enable2FAPIN(userId: string, pin: string) {
  const supabase = getSupabaseClient()
  
  // Hash the PIN (in production, use bcrypt or similar)
  const pinHash = await hashPIN(pin)
  
  const { data, error } = await supabase
    .from('user_2fa_settings')
    .upsert({
      user_id: userId,
      enabled: true,
      method: 'pin',
      pin_hash: pinHash,
      updated_at: new Date().toISOString()
    })
    .select()
  
  return { data, error }
}

/**
 * Enable biometric authentication
 */
export async function enable2FABiometric(userId: string) {
  const supabase = getSupabaseClient()
  
  const { data, error } = await supabase
    .from('user_2fa_settings')
    .upsert({
      user_id: userId,
      enabled: true,
      method: 'biometric',
      biometric_enabled: true,
      updated_at: new Date().toISOString()
    })
    .select()
  
  return { data, error }
}

/**
 * Enable both PIN and biometric
 */
export async function enable2FABoth(userId: string, pin: string) {
  const supabase = getSupabaseClient()
  
  const pinHash = await hashPIN(pin)
  
  const { data, error } = await supabase
    .from('user_2fa_settings')
    .upsert({
      user_id: userId,
      enabled: true,
      method: 'both',
      pin_hash: pinHash,
      biometric_enabled: true,
      updated_at: new Date().toISOString()
    })
    .select()
  
  return { data, error }
}

/**
 * Verify PIN
 */
export async function verifyPIN(userId: string, pin: string): Promise<boolean> {
  const supabase = getSupabaseClient()
  
  const { data, error } = await supabase
    .from('user_2fa_settings')
    .select('pin_hash')
    .eq('user_id', userId)
    .single()
  
  if (error || !data?.pin_hash) return false
  
  const pinHash = await hashPIN(pin)
  const isValid = pinHash === data.pin_hash
  
  if (isValid) {
    // Update last verified timestamp
    await supabase
      .from('user_2fa_settings')
      .update({ last_verified: new Date().toISOString() })
      .eq('user_id', userId)
  }
  
  return isValid
}

/**
 * Disable 2FA
 */
export async function disable2FA(userId: string) {
  const supabase = getSupabaseClient()
  
  const { data, error } = await supabase
    .from('user_2fa_settings')
    .update({
      enabled: false,
      method: null,
      pin_hash: null,
      biometric_enabled: false,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
  
  return { data, error }
}

/**
 * Simple PIN hashing (use bcrypt in production)
 */
async function hashPIN(pin: string): Promise<string> {
  // Simple hash for demo - use bcrypt or similar in production
  const encoder = new TextEncoder()
  const data = encoder.encode(pin + 'salt_key_here')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Check if biometric is available
 */
export async function isBiometricAvailable(): Promise<boolean> {
  if (typeof window === 'undefined') return false
  
  // Check for Web Authentication API
  if (window.PublicKeyCredential) {
    return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
  }
  
  return false
}

/**
 * Register biometric credential
 */
export async function registerBiometric(userId: string): Promise<boolean> {
  if (typeof window === 'undefined') return false
  
  try {
    const challenge = new Uint8Array(32)
    crypto.getRandomValues(challenge)
    
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: {
          name: 'LaAhlak',
          id: window.location.hostname
        },
        user: {
          id: new TextEncoder().encode(userId),
          name: userId,
          displayName: 'User'
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },  // ES256
          { type: 'public-key', alg: -257 } // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required'
        },
        timeout: 60000
      }
    })
    
    return credential !== null
  } catch (error) {
    console.error('Biometric registration error:', error)
    return false
  }
}

/**
 * Verify biometric
 */
export async function verifyBiometric(userId: string): Promise<boolean> {
  if (typeof window === 'undefined') return false
  
  try {
    const challenge = new Uint8Array(32)
    crypto.getRandomValues(challenge)
    
    const credential = await navigator.credentials.get({
      publicKey: {
        challenge,
        timeout: 60000,
        userVerification: 'required'
      }
    })
    
    if (credential) {
      // Update last verified timestamp
      const supabase = getSupabaseClient()
      await supabase
        .from('user_2fa_settings')
        .update({ last_verified: new Date().toISOString() })
        .eq('user_id', userId)
      
      return true
    }
    
    return false
  } catch (error) {
    console.error('Biometric verification error:', error)
    return false
  }
}

