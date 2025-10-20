# Development Setup Guide

## Overview
This project supports both Turbopack and Webpack for development, with different configurations optimized for each bundler.

## Development Options

### 🚀 **Turbopack (Recommended)**
Faster development builds with Next.js 15:

```bash
npm run dev
```

**Features:**
- ⚡ Faster hot reloads
- 🔥 Better development performance
- 📦 Optimized bundling
- 🎯 Built-in React Compiler support

**Limitations:**
- Some advanced Babel plugins not supported
- Limited custom webpack configuration

### 🔧 **Webpack (Fallback)**
Traditional webpack bundling with full customization:

```bash
npm run dev:webpack
```

**Features:**
- 🔌 Full Babel plugin support
- ⚙️ Complete webpack customization
- 🛠️ Advanced debugging tools
- 📚 Extensive plugin ecosystem

## Configuration Files

### `next.config.js`
- **Turbopack config**: `turbopack` property
- **Webpack config**: `webpack` function
- **React Compiler**: Built-in support (no Babel needed)

### React Compiler
The React Compiler is enabled by default in both modes:
- **Turbopack**: Uses built-in compiler
- **Webpack**: Uses Next.js built-in compiler

## Troubleshooting

### If Turbopack has issues:
1. Switch to Webpack: `npm run dev:webpack`
2. Check for unsupported plugins
3. Review Turbopack documentation

### If Webpack is slow:
1. Switch to Turbopack: `npm run dev`
2. Clear `.next` cache: `rm -rf .next`
3. Restart development server

## Performance Comparison

| Feature | Turbopack | Webpack |
|---------|-----------|---------|
| Initial Build | ⚡ Faster | 🐌 Slower |
| Hot Reload | ⚡ Faster | 🐌 Slower |
| Plugin Support | 🔶 Limited | ✅ Full |
| Customization | 🔶 Limited | ✅ Full |
| Stability | 🔶 Beta | ✅ Stable |

## Recommendations

### Use Turbopack when:
- ✅ You want faster development
- ✅ You don't need complex Babel plugins
- ✅ You're using standard Next.js features

### Use Webpack when:
- ✅ You need custom Babel plugins
- ✅ You have complex webpack configurations
- ✅ You need maximum compatibility

## Current Setup

This project is configured to use:
- **Default**: Turbopack (`npm run dev`)
- **Fallback**: Webpack (`npm run dev:webpack`)
- **React Compiler**: Enabled in both modes
- **PWA**: Works with both bundlers
- **Splash Screen**: Compatible with both

## Environment Variables

Make sure you have these in your `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
