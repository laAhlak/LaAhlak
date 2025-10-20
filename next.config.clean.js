// Clean Next.js configuration - minimal and stable
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// PWA configuration - only load in production
const withPWA = process.env.NODE_ENV === 'production' 
  ? require('next-pwa')({
      dest: 'public',
      register: true,
      skipWaiting: true,
      disable: process.env.NODE_ENV === 'development',
    })
  : (config) => config

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic optimizations
  compress: true,
  poweredByHeader: false,
  
  // Image optimization
  images: {
    unoptimized: false,
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Turbopack configuration
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Minimal experimental features
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js', 'stripe'],
  },
}

module.exports = withBundleAnalyzer(withPWA(nextConfig))
