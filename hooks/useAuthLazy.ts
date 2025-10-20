import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabaseLazy'

export function useAuthLazy() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        const supabase = getSupabaseClient()
        
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (mounted) {
              setUser(session?.user || null)
              setLoading(false)
            }
          }
        )

        // Get initial session
        const { data: { session } } = await supabase.auth.getSession()
        if (mounted) {
          setUser(session?.user || null)
          setLoading(false)
        }

        return () => {
          authListener.subscription.unsubscribe()
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    const cleanup = initializeAuth()

    return () => {
      mounted = false
      cleanup.then(cleanupFn => cleanupFn?.())
    }
  }, [])

  const signOut = async () => {
    setLoading(true)
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.signOut()
      if (!error) {
        setUser(null)
        router.push('/')
      }
      return { error }
    } catch (error) {
      console.error('Error signing out:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const requireAuth = () => {
    if (!loading && !user) {
      router.push('/login')
      return false
    }
    return true
  }

  return { 
    user, 
    loading, 
    signOut, 
    requireAuth,
    isAuthenticated: !!user
  }
}
