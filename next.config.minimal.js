// Minimal Next.js configuration for stable builds
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// PWA configuration - only load in production
const withPWA = process.env.NODE_ENV === 'production' 
  ? require('next-pwa')({
      dest: 'public',
      register: true,
      skipWaiting: true,
      buildExcludes: [/middleware-manifest\.json$/, /build-manifest\.json$/],
      reloadOnOnline: true,
      disable: process.env.NODE_ENV === 'development',
    })
  : (config) => config

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  
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
  
  // Caching headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: process.env.NODE_ENV === 'production' 
              ? 'public, max-age=31536000, immutable'
              : 'no-cache, no-store, must-revalidate'
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate'
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
        ],
      },
    ]
  }
}

module.exports = withBundleAnalyzer(withPWA(nextConfig))
