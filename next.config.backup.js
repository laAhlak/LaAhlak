// Bundle analyzer
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
      workboxOptions: {
        disableDevLogs: true,
      },
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts',
            expiration: {
              maxEntries: 4,
              maxAgeSeconds: 365 * 24 * 60 * 60 // 365 days
            }
          }
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-stylesheets',
            expiration: {
              maxEntries: 4,
              maxAgeSeconds: 365 * 24 * 60 * 60 // 365 days
            }
          }
        },
        {
          urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'static-font-assets',
            expiration: {
              maxEntries: 4,
              maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
            }
          }
        },
        {
          urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'static-image-assets',
            expiration: {
              maxEntries: 64,
              maxAgeSeconds: 24 * 60 * 60 // 24 hours
            }
          }
        },
        {
          urlPattern: /\/_next\/image\?url=.+$/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'next-image',
            expiration: {
              maxEntries: 64,
              maxAgeSeconds: 24 * 60 * 60 // 24 hours
            }
          }
        },
        {
          urlPattern: /\.(?:mp3|wav|ogg)$/i,
          handler: 'CacheFirst',
          options: {
            rangeRequests: true,
            cacheName: 'static-audio-assets',
            expiration: {
              maxEntries: 32,
              maxAgeSeconds: 24 * 60 * 60 // 24 hours
            }
          }
        },
        {
          urlPattern: /\.(?:mp4)$/i,
          handler: 'CacheFirst',
          options: {
            rangeRequests: true,
            cacheName: 'static-video-assets',
            expiration: {
              maxEntries: 32,
              maxAgeSeconds: 24 * 60 * 60 // 24 hours
            }
          }
        },
        {
          urlPattern: /\.(?:js)$/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'static-js-assets',
            expiration: {
              maxEntries: 32,
              maxAgeSeconds: 24 * 60 * 60 // 24 hours
            }
          }
        },
        {
          urlPattern: /\.(?:css|less)$/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'static-style-assets',
            expiration: {
              maxEntries: 32,
              maxAgeSeconds: 24 * 60 * 60 // 24 hours
            }
          }
        },
        {
          urlPattern: /^https:\/\/api\.exchangerate\.host\/.*/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'exchange-rates',
            expiration: {
              maxEntries: 16,
              maxAgeSeconds: 60 // 1 minute
            }
          }
        }
      ]
    })
  : (config) => config

/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is enabled by default in Next.js 15
  compress: true,
  poweredByHeader: false,
  generateEtags: true, // Enable ETags for better caching
  
  // Server components external packages
  serverComponentsExternalPackages: ['@supabase/supabase-js'],
  
  // Caching optimizations
  ...(process.env.NODE_ENV === 'production' && {
    // Enable static optimization
    trailingSlash: false,
    // Enable image optimization caching
    images: {
      unoptimized: false,
      domains: [],
      formats: ['image/webp', 'image/avif'],
    },
  }),
  
  // Development optimizations
  productionBrowserSourceMaps: false,
  
  // Hot reloading and caching optimizations
  ...(process.env.NODE_ENV === 'development' && {
    // Enable faster hot reloading
    onDemandEntries: {
      // Period (in ms) where the server will keep pages in the buffer
      maxInactiveAge: 25 * 1000,
      // Number of pages that should be kept simultaneously without being disposed
      pagesBufferLength: 2,
    },
    // Enable webpack caching for faster rebuilds
    webpack: (config, { dev, isServer }) => {
      if (dev && !isServer) {
        // Enable persistent caching for faster hot reloads
        config.cache = {
          type: 'filesystem',
          buildDependencies: {
            config: [__filename],
          },
        }
        
        // Optimize module resolution
        config.resolve.symlinks = false
        
        // Enable faster rebuilds
        config.watchOptions = {
          poll: 1000,
          aggregateTimeout: 300,
        }
      }
      return config
    },
  }),
  
  // Turbopack configuration (moved from experimental)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  experimental: {
    // Next.js 15 experimental features
    optimizePackageImports: ['@supabase/supabase-js', 'stripe'],
  },
  
  // Additional caching headers
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
