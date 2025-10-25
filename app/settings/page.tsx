'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { getSupabaseClient } from '@/lib/supabaseLazy'
import { useLanguage } from '@/contexts/LanguageContext'

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
  const { t } = useLanguage()
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
            {t('common.back')}
          </Link>
          <h1 className="text-white text-lg font-semibold">{t('settings.title')}</h1>
          <div className="w-8"></div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="px-6 py-6">
        <div className="bg-white rounded-2xl p-6 space-y-4 shadow-lg border border-secondary-200">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-secondary-500">{t('common.loading')}</div>
            </div>
          ) : userProfile ? (
            <>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-accent-500 rounded-2xl"></div>
                <div>
                  <h2 className="text-primary-500 text-xl font-semibold">
                    {userProfile.full_name || t('settings.profile')}
                  </h2>
                  <p className="text-secondary-500">{user?.email}</p>
                  {userProfile.phone_number && (
                    <p className="text-secondary-500 text-sm">{userProfile.phone_number}</p>
                  )}
                </div>
              </div>
              <button className="w-full bg-accent-500/20 hover:bg-accent-500/30 text-accent-500 font-medium py-3 rounded-xl transition-colors duration-200">
                {t('common.edit')} {t('settings.profile')}
              </button>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-secondary-500">{t('common.error')}</div>
            </div>
          )}
        </div>
      </div>

      {/* Settings Sections */}
      <div className="px-6 space-y-6">
        {/* Account Settings */}
        <div className="space-y-4">
          <h3 className="text-primary-500 text-lg font-semibold">{t('settings.account.title')}</h3>
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-secondary-200">
            {[
              { title: t('settings.account.personalInfo'), subtitle: t('settings.account.personalInfoSub') },
              { title: t('settings.account.security'), subtitle: t('settings.account.securitySub') },
              { title: t('settings.account.devices'), subtitle: t('settings.account.devicesSub') },
            ].map((item, index) => (
              <Link
                key={index}
                href="#"
                className="flex items-center justify-between p-4 hover:bg-secondary-100 transition-colors duration-200 border-b border-secondary-200 last:border-b-0"
              >
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
          <h3 className="text-primary-500 text-lg font-semibold">{t('settings.twoFactor')}</h3>
          <TwoFactorSetup />
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <h3 className="text-primary-500 text-lg font-semibold">{t('settings.preferences.title')}</h3>
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-secondary-200">
            <div className="p-4 flex items-center justify-between border-b border-secondary-200">
              <div>
                <p className="text-primary-500 font-medium">{t('settings.preferences.notifications')}</p>
                <p className="text-secondary-500 text-sm">{t('settings.preferences.notificationsSub')}</p>
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
              <div>
                <p className="text-primary-500 font-medium">{t('settings.preferences.biometric')}</p>
                <p className="text-secondary-500 text-sm">{t('settings.preferences.biometricSub')}</p>
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
              <div>
                <p className="text-primary-500 font-medium">{t('settings.preferences.darkMode')}</p>
                <p className="text-secondary-500 text-sm">{t('settings.preferences.darkModeSub')}</p>
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
          <h3 className="text-primary-500 text-lg font-semibold">{t('settings.support.title')}</h3>
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-secondary-200">
            {[
              { title: t('settings.support.help'), subtitle: t('settings.support.helpSub') },
              { title: t('settings.support.contact'), subtitle: t('settings.support.contactSub') },
              { title: t('settings.support.terms'), subtitle: t('settings.support.termsSub') },
              { title: t('settings.support.about'), subtitle: t('settings.support.aboutSub') },
            ].map((item, index) => (
              <Link
                key={index}
                href="#"
                className="flex items-center justify-between p-4 hover:bg-secondary-100 transition-colors duration-200 border-b border-secondary-200 last:border-b-0"
              >
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
        <div className="pb-6">
          <button 
            onClick={handleSignOut}
            className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-500 font-medium py-4 rounded-xl transition-colors duration-200 shadow-lg"
          >
            {t('settings.logout')}
          </button>
        </div>
      </div>
    </main>
  )
}
