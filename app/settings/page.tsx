'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { getSupabaseClient } from '@/lib/supabaseLazy'

// Lazy load 2FA component
const TwoFactorSetup = dynamic(() => import('@/components/TwoFactorSetup'), {
  ssr: false,
  loading: () => (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500 mx-auto"></div>
    </div>
  )
})

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [biometric, setBiometric] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        
        // Get current authenticated user
        const supabase = getSupabaseClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
          console.error('User not authenticated')
          return
        }

        setUser(user)

        // Get user profile
        const { data: profile, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error fetching user profile:', error)
        } else {
          setUserProfile(profile)
        }
      } catch (err) {
        console.error('Error fetching user data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleSignOut = async () => {
    try {
      const supabase = getSupabaseClient()
      await supabase.auth.signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-primary-500 px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="text-white text-xl">
            ← Back
          </Link>
          <h1 className="text-white text-lg font-semibold">Settings</h1>
          <div className="w-8"></div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="px-6 py-6">
        <div className="bg-white rounded-2xl p-6 space-y-4 shadow-lg border border-secondary-200">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-secondary-500">جاري تحميل البيانات...</div>
            </div>
          ) : userProfile ? (
            <>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-accent-500 rounded-2xl flex items-center justify-center">
                  <span className="text-white text-2xl">👤</span>
                </div>
                <div>
                  <h2 className="text-primary-500 text-xl font-semibold">
                    {userProfile.full_name || 'غير محدد'}
                  </h2>
                  <p className="text-secondary-500">{user?.email}</p>
                  {userProfile.phone_number && (
                    <p className="text-secondary-500 text-sm">{userProfile.phone_number}</p>
                  )}
                </div>
              </div>
              <button className="w-full bg-accent-500/20 hover:bg-accent-500/30 text-accent-500 font-medium py-3 rounded-xl transition-colors duration-200">
                تعديل الملف الشخصي
              </button>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-secondary-500">فشل في تحميل البيانات</div>
            </div>
          )}
        </div>
      </div>

      {/* Settings Sections */}
      <div className="px-6 space-y-6">
        {/* Account Settings */}
        <div className="space-y-4">
          <h3 className="text-primary-500 text-lg font-semibold">Account</h3>
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-secondary-200">
            {[
              { icon: 'USER', title: 'Personal Information', subtitle: 'Update your details' },
              { icon: 'SECURE', title: 'Security', subtitle: 'Password, 2FA, and more' },
              { icon: 'CARD', title: 'Payment Methods', subtitle: 'Cards and bank accounts' },
              { icon: 'DEVICE', title: 'Devices', subtitle: 'Manage connected devices' },
            ].map((item, index) => (
              <Link
                key={index}
                href="#"
                className="flex items-center space-x-4 p-4 hover:bg-secondary-100 transition-colors duration-200 border-b border-secondary-200 last:border-b-0"
              >
                <div className="w-10 h-10 bg-accent-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-accent-500 text-xs font-bold">{item.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-primary-500 font-medium">{item.title}</p>
                  <p className="text-secondary-500 text-sm">{item.subtitle}</p>
                </div>
                <span className="text-secondary-500">›</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="space-y-4">
          <h3 className="text-primary-500 text-lg font-semibold">المصادقة الثنائية</h3>
          <TwoFactorSetup />
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <h3 className="text-primary-500 text-lg font-semibold">Preferences</h3>
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-secondary-200">
            <div className="p-4 flex items-center justify-between border-b border-secondary-200">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-accent-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-accent-500 text-lg">🔔</span>
                </div>
                <div>
                  <p className="text-primary-500 font-medium">Notifications</p>
                  <p className="text-secondary-500 text-sm">Push and email notifications</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-500"></div>
              </label>
            </div>
            <div className="p-4 flex items-center justify-between border-b border-secondary-200">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-accent-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-accent-500 text-lg">👆</span>
                </div>
                <div>
                  <p className="text-primary-500 font-medium">Biometric Login</p>
                  <p className="text-secondary-500 text-sm">Use fingerprint or face ID</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={biometric}
                  onChange={(e) => setBiometric(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-500"></div>
              </label>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-accent-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-accent-500 text-lg">🌙</span>
                </div>
                <div>
                  <p className="text-primary-500 font-medium">Dark Mode</p>
                  <p className="text-secondary-500 text-sm">Always use dark theme</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="space-y-4">
          <h3 className="text-primary-500 text-lg font-semibold">Support</h3>
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-secondary-200">
            {[
              { icon: '❓', title: 'Help Center', subtitle: 'Get help and support' },
              { icon: '💬', title: 'Contact Us', subtitle: 'Send us a message' },
              { icon: '📋', title: 'Terms & Privacy', subtitle: 'Legal information' },
              { icon: 'ℹ️', title: 'About', subtitle: 'App version and info' },
            ].map((item, index) => (
              <Link
                key={index}
                href="#"
                className="flex items-center space-x-4 p-4 hover:bg-secondary-100 transition-colors duration-200 border-b border-secondary-200 last:border-b-0"
              >
                <div className="w-10 h-10 bg-accent-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-accent-500 text-xs font-bold">{item.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-primary-500 font-medium">{item.title}</p>
                  <p className="text-secondary-500 text-sm">{item.subtitle}</p>
                </div>
                <span className="text-secondary-500">›</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <div className="pb-20">
          <button 
            onClick={handleSignOut}
            className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-500 font-medium py-4 rounded-xl transition-colors duration-200 shadow-lg"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-secondary-200 px-6 py-3 shadow-lg">
        <div className="flex items-center justify-around">
          <Link href="/dashboard" className="text-center space-y-1">
            <div className="w-6 h-6 rounded flex items-center justify-center mx-auto">
              <span className="text-secondary-500 text-xs">🏠</span>
            </div>
            <p className="text-secondary-500 text-xs">Home</p>
          </Link>
          <Link href="/send" className="text-center space-y-1">
            <div className="w-6 h-6 rounded flex items-center justify-center mx-auto">
              <span className="text-secondary-500 text-xs">💸</span>
            </div>
            <p className="text-secondary-500 text-xs">Send</p>
          </Link>
          <button className="text-center space-y-1">
            <div className="w-6 h-6 rounded flex items-center justify-center mx-auto">
              <span className="text-secondary-500 text-xs">📊</span>
            </div>
            <p className="text-secondary-500 text-xs">Analytics</p>
          </button>
          <Link href="/settings" className="text-center space-y-1">
            <div className="w-6 h-6 bg-accent-500 rounded flex items-center justify-center mx-auto">
              <span className="text-white text-xs">⚙️</span>
            </div>
            <p className="text-accent-500 text-xs">Settings</p>
          </Link>
        </div>
      </div>
    </main>
  )
}
