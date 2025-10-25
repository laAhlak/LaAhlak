// Next.js configuration for Capacitor static export
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  compress: true,
  poweredByHeader: false,
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Disable trailing slashes
  trailingSlash: true,
  
  // Asset prefix for proper paths in native apps
  assetPrefix: '',
  
  // Experimental optimizations
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js', 'stripe'],
  },
};

module.exports = nextConfig;

