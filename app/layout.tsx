import type { Metadata, Viewport } from 'next'
import { Inter, Noto_Sans_Arabic } from 'next/font/google'
import './globals.css'
import PWAInstallPrompt from '@/components/PWAInstallPrompt'
import PerformanceMonitor from '@/components/PerformanceMonitor'
import SplashScreenWrapper from '@/components/SplashScreenWrapper'
import { LanguageProvider } from '@/contexts/LanguageContext'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
})

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-noto-arabic',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'لِأهلك - Europe → Jordan Remittance',
    template: '%s | لِأهلك'
  },
  description: 'حول بثقة… وصل بمحبة - Fast, secure money transfers from Europe to Jordan',
  keywords: ['remittance', 'money transfer', 'Jordan', 'Europe', 'لِأهلك', 'حوالة'],
  authors: [{ name: 'لِأهلك Team' }],
  creator: 'لِأهلك',
  publisher: 'لِأهلك',
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'لِأهلك',
  },
  openGraph: {
    type: 'website',
    locale: 'ar_JO',
    alternateLocale: ['en_US'],
    siteName: 'لِأهلك',
    title: 'لِأهلك - Europe → Jordan Remittance',
    description: 'حول بثقة… وصل بمحبة - Fast, secure money transfers from Europe to Jordan',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    images: [
      {
        url: '/icons/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'لِأهلك Logo',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'لِأهلك - Europe → Jordan Remittance',
    description: 'حول بثقة… وصل بمحبة - Fast, secure money transfers from Europe to Jordan',
    images: ['/icons/icon-512x512.png'],
    creator: '@laahlak',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

export const viewport: Viewport = {
  themeColor: '#C8102E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="LaAhlak" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#C8102E" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Plausible Analytics */}
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
          />
        )}
      </head>
      <body className={`${inter.className} ${inter.variable} ${notoSansArabic.variable}`}>
        <LanguageProvider>
          <SplashScreenWrapper>
            <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-primary-500">
              {children}
              <PWAInstallPrompt />
              <PerformanceMonitor />
            </div>
          </SplashScreenWrapper>
        </LanguageProvider>
      </body>
    </html>
  )
}
