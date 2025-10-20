# 🚀 Production Deployment Guide

## 📋 Overview

This guide covers deploying your LaAhlak app to production with proper configuration for:
- ✅ Next.js 15
- ✅ PWA functionality
- ✅ Supabase database
- ✅ Stripe payments
- ✅ HTTPS/SSL
- ✅ Custom domain

---

## 🎯 Recommended Platforms

### **Option 1: Vercel (Easiest for Next.js) ⭐ RECOMMENDED**

**Why Vercel:**
- Built for Next.js (same company)
- Zero config deployment
- Automatic HTTPS
- Edge network (fast globally)
- Free SSL certificates
- Environment variables UI
- Preview deployments
- **Free tier available**

### **Option 2: Netlify**

**Why Netlify:**
- Great for static + serverless
- Easy GitHub integration
- Good CDN
- Free SSL
- **Free tier available**

### **Option 3: Cloudflare Pages**

**Why Cloudflare:**
- Fast global CDN
- DDoS protection
- Analytics included
- Free SSL
- **Free tier available**

### **Option 4: Self-Hosted (VPS/Docker)**

**Why Self-Hosted:**
- Full control
- Custom configuration
- Can use your own server
- More complex setup

---

## 🚀 Option 1: Deploy to Vercel (RECOMMENDED)

### **Step 1: Prepare Your Repository**

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Ready for production deployment"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/laahlak.git
git branch -M main
git push -u origin main
```

### **Step 2: Deploy to Vercel**

1. **Go to Vercel:**
   - Visit: https://vercel.com
   - Sign up/login with GitHub

2. **Import Project:**
   - Click "Add New" → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Build Settings:**
   - **Framework Preset:** Next.js ✅ (auto-detected)
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` ✅ (auto-detected)
   - **Output Directory:** `.next` ✅ (auto-detected)
   - **Install Command:** `npm install` ✅ (auto-detected)

4. **Add Environment Variables:**

   Click "Environment Variables" and add:

   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   # Stripe
   STRIPE_SECRET_KEY=sk_live_xxxxxx  ← Use LIVE keys for production!
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxx
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxx  ← Will update after deployment

   # App Configuration
   NEXT_PUBLIC_APP_URL=https://laahlak.vercel.app  ← Will get this after deployment
   NEXT_PUBLIC_APP_NAME=LaAhlak
   NEXT_PUBLIC_APP_DESCRIPTION=Europe → Jordan Remittance PWA

   # Environment
   NODE_ENV=production
   ```

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - You'll get: `https://laahlak.vercel.app` (or similar)

6. **Update App URL:**
   - Go to Vercel → Settings → Environment Variables
   - Update `NEXT_PUBLIC_APP_URL` to your actual Vercel URL
   - Redeploy

### **Step 3: Configure Custom Domain (Optional)**

1. **In Vercel:**
   - Go to Settings → Domains
   - Add your domain: `laahlak.com`

2. **In Your Domain Registrar:**
   - Add CNAME record:
     ```
     Type: CNAME
     Name: @  (or www)
     Value: cname.vercel-dns.com
     ```

3. **Wait for DNS Propagation** (5-60 minutes)

4. **Update Environment Variables:**
   ```env
   NEXT_PUBLIC_APP_URL=https://laahlak.com
   ```

5. **Redeploy**

### **Step 4: Configure Stripe Production Webhook**

1. **Go to Stripe Dashboard:**
   - Switch to LIVE mode (toggle in top right)
   - Go to: Developers → Webhooks

2. **Add Production Endpoint:**
   - Click "+ Add endpoint"
   - URL: `https://laahlak.com/api/stripe/webhook`
   - Description: "Production webhook"

3. **Select Events:**
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.payment_failed`

4. **Copy Webhook Secret:**
   - Reveal signing secret
   - Copy the `whsec_...` value

5. **Update Vercel Environment Variable:**
   - Go to Vercel → Settings → Environment Variables
   - Update `STRIPE_WEBHOOK_SECRET` with production value
   - Redeploy

### **Step 5: Test Production App**

1. **Visit your production URL**
2. **Test signup/login**
3. **Test adding beneficiary**
4. **Test payment with real card** (Stripe test mode first!)
5. **Verify webhook in Stripe Dashboard**

---

## 🎯 Option 2: Deploy to Netlify

### **Quick Steps:**

1. **Push to GitHub** (same as Vercel)

2. **Go to Netlify:**
   - Visit: https://netlify.com
   - Click "Add new site" → "Import an existing project"

3. **Connect GitHub:**
   - Select repository
   - Build settings:
     ```
     Build command: npm run build
     Publish directory: .next
     ```

4. **Add Environment Variables:**
   - Site settings → Environment variables
   - Add same variables as Vercel

5. **Deploy:**
   - Click "Deploy site"
   - Get URL: `https://laahlak.netlify.app`

6. **Configure Stripe webhook** with Netlify URL

---

## 🎯 Option 3: Self-Hosted with Docker

### **Prerequisites:**
- VPS/Server with Ubuntu
- Docker installed
- Domain pointed to server

### **Step 1: Create Dockerfile**

Already exists in your project (if not, create it):

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### **Step 2: Create docker-compose.yml**

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
      - STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}
      - NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
    restart: unless-stopped
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

### **Step 3: Deploy**

```bash
# On your server
git clone https://github.com/yourusername/laahlak.git
cd laahlak

# Create .env.production
nano .env.production
# Add your production environment variables

# Build and start
docker-compose up -d

# View logs
docker-compose logs -f
```

---

## 📋 Production Checklist

### **Before Deployment:**

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database schema up to date
- [ ] Stripe keys switched to LIVE mode
- [ ] Domain purchased (if using custom domain)
- [ ] SSL certificate ready (or using platform SSL)

### **After Deployment:**

- [ ] App loads at production URL
- [ ] HTTPS is working
- [ ] PWA installable
- [ ] Login/signup works
- [ ] Payments work
- [ ] Stripe webhooks receiving events
- [ ] Database connections working
- [ ] All pages loading correctly

### **Production Environment Variables:**

```env
# ✅ Use LIVE/Production keys, not test keys!

# Supabase (Production project)
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...  ← Production key
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...    ← Production key

# Stripe (LIVE mode)
STRIPE_SECRET_KEY=sk_live_...          ← LIVE key!
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...  ← LIVE key!
STRIPE_WEBHOOK_SECRET=whsec_...        ← Production webhook secret

# App (Production URL)
NEXT_PUBLIC_APP_URL=https://laahlak.com  ← Your actual domain
NEXT_PUBLIC_APP_NAME=LaAhlak
NEXT_PUBLIC_APP_DESCRIPTION=Europe → Jordan Remittance PWA

# Environment
NODE_ENV=production
```

---

## 🔒 Security Best Practices

### **1. Environment Variables**

- ✅ Never commit `.env.local` or `.env.production` to git
- ✅ Use different keys for development/production
- ✅ Rotate secrets regularly
- ✅ Use platform environment variable UI (Vercel/Netlify)

### **2. Stripe**

- ✅ Use LIVE keys in production
- ✅ Enable 3D Secure for payments
- ✅ Set up webhook signing verification
- ✅ Monitor for suspicious activity
- ✅ Set up fraud detection rules

### **3. Database**

- ✅ Use Row Level Security (RLS) in Supabase
- ✅ Separate production and development databases
- ✅ Regular backups
- ✅ Audit logs enabled

### **4. Application**

- ✅ Rate limiting enabled
- ✅ CSRF protection
- ✅ Input validation on all forms
- ✅ SQL injection prevention (Supabase handles this)
- ✅ XSS protection (React handles this)

---

## 🔄 Continuous Deployment

### **Automatic Deployments (Vercel/Netlify):**

1. **Push to main branch:**
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```

2. **Automatic deployment triggered**
3. **Live in 2-3 minutes**

### **Preview Deployments:**

- Every pull request gets preview URL
- Test before merging to main
- Shared with team for review

---

## 📊 Monitoring & Analytics

### **1. Vercel Analytics (Built-in)**

- Real user monitoring
- Web Vitals tracking
- Page performance
- Free on all plans

### **2. Sentry (Error Tracking)**

```bash
npm install @sentry/nextjs
```

### **3. Plausible Analytics (Privacy-friendly)**

Already configured in your app:
```env
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=laahlak.com
```

### **4. Stripe Dashboard**

- Payment monitoring
- Webhook deliveries
- Dispute management

---

## 🚨 Troubleshooting

### **Issue: Build Fails on Vercel**

**Solution:**
```bash
# Test build locally first
npm run build

# If it works locally, check:
# 1. Node version (package.json engines)
# 2. Environment variables set in Vercel
# 3. Build logs for specific errors
```

### **Issue: Environment Variables Not Working**

**Solution:**
1. Check they're set in deployment platform
2. Redeploy after adding variables
3. Variables with `NEXT_PUBLIC_` are client-side
4. Clear `.next` cache and rebuild

### **Issue: Stripe Webhooks Not Working**

**Solution:**
1. Check webhook URL matches deployment URL
2. Verify webhook secret is production value
3. Check webhook events are selected
4. Test webhook in Stripe dashboard
5. Check server logs for errors

### **Issue: PWA Not Installing**

**Solution:**
1. Ensure HTTPS is working
2. Check manifest.json is accessible
3. Verify service worker registered
4. Check icon files exist
5. Test in Chrome DevTools → Lighthouse

---

## 🎯 Performance Optimization

### **Already Implemented:**
- ✅ Next.js 15 with Turbopack
- ✅ Image optimization
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Service worker caching
- ✅ Font optimization

### **Additional Optimizations:**

1. **Enable compression** (automatic on Vercel/Netlify)
2. **CDN caching** (automatic on Vercel/Netlify)
3. **Database indexes** (check Supabase query performance)
4. **Image CDN** (use Next.js Image component)

---

## 📋 Quick Command Reference

### **Local Production Build:**
```bash
# Build for production
npm run build

# Run production build locally
npm start

# Test production build
npm run build && npm start
```

### **Vercel CLI:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Check deployment
vercel ls
```

### **Docker:**
```bash
# Build image
docker build -t laahlak .

# Run container
docker run -p 3000:3000 --env-file .env.production laahlak

# Docker Compose
docker-compose up -d
docker-compose logs -f
docker-compose down
```

---

## 🎊 Summary

### **Recommended: Vercel Deployment**

1. ✅ Push code to GitHub
2. ✅ Connect Vercel to repository
3. ✅ Add environment variables
4. ✅ Deploy (2-3 minutes)
5. ✅ Configure Stripe webhook
6. ✅ Test production app
7. 🎉 **You're live!**

### **Production URL Structure:**
```
Development:  http://localhost:3000
ngrok:        https://xxx.ngrok-free.dev
Production:   https://laahlak.com (or laahlak.vercel.app)
```

### **Critical Steps:**
1. Use LIVE Stripe keys (not test keys)
2. Configure production webhook
3. Update NEXT_PUBLIC_APP_URL
4. Test payment flow end-to-end
5. Monitor Stripe dashboard for payments

---

**Ready to go live?** Follow the Vercel steps above! 🚀

**Need help?** Check the troubleshooting section or open an issue on GitHub.

