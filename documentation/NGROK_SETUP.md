# 🌐 ngrok Setup Guide - Dynamic Domain

## ✅ Your Current ngrok Session

From your terminal:
```
Forwarding: https://loreta-palmiest-glady.ngrok-free.dev -> http://localhost:3000
```

**Your Public URL:** `https://loreta-palmiest-glady.ngrok-free.dev`

---

## 🚀 Quick Setup (3 Steps)

### **Step 1: Update Your `.env.local`**

Update your environment file with the ngrok URL:

```bash
# Copy from env.template if you don't have .env.local yet
cp env.template .env.local
```

Then edit `.env.local`:

```env
# Change this line:
NEXT_PUBLIC_APP_URL=http://localhost:3000

# To your ngrok URL:
NEXT_PUBLIC_APP_URL=https://loreta-palmiest-glady.ngrok-free.dev
```

### **Step 2: Configure Stripe Webhook**

1. **Go to Stripe Dashboard:**
   - https://dashboard.stripe.com/test/webhooks

2. **Add Endpoint:**
   - Click "+ Add endpoint"
   - URL: `https://loreta-palmiest-glady.ngrok-free.dev/api/stripe/webhook`
   - Description: "ngrok development webhook"

3. **Select Events:**
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.payment_failed`

4. **Copy Webhook Secret:**
   - After creating, click to reveal signing secret
   - Copy the `whsec_...` value
   - Add to `.env.local`:
     ```env
     STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
     ```

### **Step 3: Restart Your Dev Server**

```bash
# Stop current server (Ctrl+C)
# Start again to load new environment variables
npm run dev
```

**That's it!** ✅

---

## 📋 Complete `.env.local` Example

Here's what your `.env.local` should look like:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_51XXXXXXX...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51XXXXXXX...
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXX...  ← Updated for ngrok

# App Configuration
NEXT_PUBLIC_APP_URL=https://loreta-palmiest-glady.ngrok-free.dev  ← Your ngrok URL
NEXT_PUBLIC_APP_NAME=LaAhlak
NEXT_PUBLIC_APP_DESCRIPTION=Europe → Jordan Remittance PWA

# Environment
NODE_ENV=development
```

---

## 🔄 What This Changes

### **Before (localhost only):**
```
Payment Success URL: http://localhost:3000/payment-success?session_id=xxx
Cancel URL:          http://localhost:3000/send
Webhook URL:         ❌ Not accessible from Stripe
```

### **After (ngrok - public access):**
```
Payment Success URL: https://loreta-palmiest-glady.ngrok-free.dev/payment-success?session_id=xxx
Cancel URL:          https://loreta-palmiest-glady.ngrok-free.dev/send
Webhook URL:         ✅ https://loreta-palmiest-glady.ngrok-free.dev/api/stripe/webhook
```

---

## 🎯 How It Works

### **Dynamic URL Usage:**

Your code already uses `process.env.NEXT_PUBLIC_APP_URL` in:

1. **Stripe Checkout Success URL:**
   ```typescript
   success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`
   ```

2. **Stripe Checkout Cancel URL:**
   ```typescript
   cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/send`
   ```

3. **App Metadata:**
   ```typescript
   metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
   ```

By changing `NEXT_PUBLIC_APP_URL`, everything automatically points to your ngrok URL! 🎉

---

## 🔥 Benefits of Using ngrok

### **✅ What You Get:**

1. **HTTPS Everywhere**
   - Stripe requires HTTPS for webhooks
   - PWA works better with HTTPS
   - Secure payment testing

2. **Real Webhook Testing**
   - Stripe can send events to your local app
   - Test payment success/failure flows
   - Debug webhook handling

3. **Mobile Testing**
   - Access from any device, anywhere
   - Share with team members
   - Test on real mobile devices

4. **Production-Like Environment**
   - Test with real URLs
   - Test redirects properly
   - Test OAuth flows (if added later)

---

## 🔄 Switching Between Environments

### **Development (Local):**
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
- Use for quick local testing
- No Stripe webhooks
- Localhost only

### **Development (ngrok):**
```env
NEXT_PUBLIC_APP_URL=https://your-subdomain.ngrok-free.dev
```
- Public HTTPS access
- Stripe webhooks work
- Access from anywhere

### **Production:**
```env
NEXT_PUBLIC_APP_URL=https://laahlak.com
```
- Your real domain
- Production Stripe webhooks
- Real users

---

## 🚨 Important Notes

### **⚠️ ngrok URL Changes Every Time**

When you restart ngrok, you get a **new URL**:
```
https://loreta-palmiest-glady.ngrok-free.dev  ← Current
https://different-random-url.ngrok-free.dev   ← Next time
```

**Every time you restart ngrok, you need to:**
1. Update `NEXT_PUBLIC_APP_URL` in `.env.local`
2. Update Stripe webhook URL in dashboard
3. Restart `npm run dev`

### **💡 Solution: Static ngrok Domain (Optional)**

Upgrade to ngrok paid plan for a static domain:
```
https://laahlak.ngrok.app  ← Same URL every time
```

Then you only need to configure once!

---

## 🛠️ Troubleshooting

### **Issue 1: Stripe Redirects to Localhost**

**Problem:** After payment, redirects to `http://localhost:3000/payment-success`

**Solution:**
1. Check `.env.local` has ngrok URL
2. Restart `npm run dev` (must restart to load new env vars)
3. Test by checking browser network tab

**Verify:**
```bash
# In your running app, this should show your ngrok URL:
echo $NEXT_PUBLIC_APP_URL
```

### **Issue 2: Webhook Not Receiving Events**

**Problem:** Stripe payments complete but webhook never fires

**Checklist:**
- [ ] ngrok is running (`ngrok http 3000`)
- [ ] Webhook URL in Stripe matches ngrok URL exactly
- [ ] Webhook events selected (checkout.session.completed, etc.)
- [ ] Webhook secret copied to `.env.local`
- [ ] Dev server restarted after changing `.env.local`

**Test Webhook:**
```bash
# In Stripe Dashboard → Webhooks → Your endpoint
# Click "Send test webhook"
# Should see 200 OK response
```

### **Issue 3: ngrok "Visit Site" Button Required**

**Problem:** First visit shows ngrok warning page

**Solution:**
- This is normal on ngrok free plan
- Click "Visit Site" button
- Only happens once per session
- Upgrade to paid plan to remove

### **Issue 4: Environment Variables Not Updating**

**Problem:** Changed `.env.local` but app still uses old URL

**Solution:**
```bash
# Stop dev server (Ctrl+C)
# Clear Next.js cache
rm -rf .next

# Start fresh
npm run dev
```

---

## 🎯 Testing Checklist

After setup, test these flows:

### **✅ Basic Flow:**
- [ ] Open ngrok URL in browser
- [ ] App loads correctly
- [ ] Can log in
- [ ] Can navigate pages

### **✅ Payment Flow:**
- [ ] Create a test payment
- [ ] Redirects to Stripe checkout
- [ ] Stripe checkout URL starts with `https://checkout.stripe.com`
- [ ] After payment, redirects to `https://your-ngrok-url/payment-success`
- [ ] Success page shows correct beneficiary

### **✅ Webhook Flow:**
- [ ] Complete a payment
- [ ] Check Stripe Dashboard → Webhooks → Recent deliveries
- [ ] Should see successful delivery (200 OK)
- [ ] Transaction status updates in your database
- [ ] Dashboard shows updated transaction

### **✅ Mobile Testing:**
- [ ] Open ngrok URL on mobile
- [ ] Can install as PWA
- [ ] Payment flow works
- [ ] Redirects work correctly

---

## 📱 Share Your App

With ngrok, you can share your development app:

```
Share this URL with team/testers:
https://loreta-palmiest-glady.ngrok-free.dev

They can:
✅ Test the full app
✅ Make test payments
✅ Install as PWA
✅ Access from anywhere
```

---

## 🚀 Production Deployment

When ready for production:

1. **Deploy to Vercel/Netlify/Cloudflare**
2. **Get your production domain:**
   ```
   https://laahlak.com
   ```

3. **Update `.env.local` (or production env vars):**
   ```env
   NEXT_PUBLIC_APP_URL=https://laahlak.com
   ```

4. **Create production Stripe webhook:**
   - URL: `https://laahlak.com/api/stripe/webhook`
   - Use production webhook secret

5. **Done!** Your app is live! 🎉

---

## 📋 Quick Reference

### **Your Current Setup:**
```
ngrok URL:     https://loreta-palmiest-glady.ngrok-free.dev
Local URL:     http://localhost:3000
Webhook Path:  /api/stripe/webhook
```

### **Commands:**
```bash
# Start ngrok
ngrok http 3000

# Copy .env template
cp env.template .env.local

# Edit environment
nano .env.local  # or use your editor

# Restart dev server
npm run dev
```

### **Stripe Webhook Events:**
- `checkout.session.completed` ✅
- `checkout.session.expired` ✅
- `payment_intent.payment_failed` ✅

---

## 🎊 Summary

**To use ngrok with dynamic domains:**

1. ✅ Set `NEXT_PUBLIC_APP_URL` in `.env.local` to your ngrok URL
2. ✅ Configure Stripe webhook with ngrok URL
3. ✅ Copy webhook secret to `.env.local`
4. ✅ Restart `npm run dev`
5. 🎉 Everything now points to ngrok!

**Your app will automatically:**
- Redirect to ngrok URL after payment ✅
- Send webhooks to ngrok URL ✅
- Use HTTPS everywhere ✅
- Work from any device ✅

---

**Need help? All your URLs are configured dynamically via `NEXT_PUBLIC_APP_URL`!** 🚀

