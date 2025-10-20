// Lightweight Next.js configuration for fast development
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic optimizations
  compress: true,
  poweredByHeader: false,
  
  // Disable PWA in development for lighter builds
  // Disable image optimization for faster dev
  images: {
    unoptimized: true,
  },
  
  // Turbopack for fast dev
  turbopack: {},

  // Minimal experimental features
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js', 'stripe'],
  },
}

module.exports = nextConfig

