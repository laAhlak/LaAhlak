# 🚀 Quick Start: Production Deployment

## ⚡ Fastest Way to Production (5 Minutes)

### **Prerequisites:**
- GitHub account
- Vercel account (free)
- Stripe account (live mode keys)
- Supabase account (production project)

---

## 🎯 Step-by-Step

### **1. Push to GitHub (1 min)**

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/laahlak.git
git push -u origin main
```

### **2. Deploy to Vercel (2 min)**

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Click "Deploy" (don't add env vars yet)
5. Wait for deployment
6. Copy your URL: `https://laahlak-xxxxx.vercel.app`

### **3. Add Environment Variables (1 min)**

In Vercel Dashboard → Settings → Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_APP_URL=https://laahlak-xxxxx.vercel.app
NODE_ENV=production
```

**Redeploy** after adding variables!

### **4. Configure Stripe Webhook (1 min)**

1. Go to https://dashboard.stripe.com/webhooks
2. Click "+ Add endpoint"
3. URL: `https://laahlak-xxxxx.vercel.app/api/stripe/webhook`
4. Events: `checkout.session.completed`, `checkout.session.expired`
5. Copy webhook secret
6. Add to Vercel: `STRIPE_WEBHOOK_SECRET=whsec_...`
7. Redeploy

### **5. Test! (30 sec)**

Visit your Vercel URL and test:
- ✅ Login works
- ✅ Can add beneficiary
- ✅ Can send money
- ✅ Payment redirects correctly
- ✅ PWA installable

---

## 🎊 You're Live!

**Your production app:** `https://laahlak-xxxxx.vercel.app`

### **Next Steps:**

1. **Add Custom Domain** (optional)
   - Vercel → Settings → Domains
   - Add: `laahlak.com`
   - Update DNS CNAME

2. **Monitor:**
   - Vercel Dashboard → Analytics
   - Stripe Dashboard → Payments
   - Supabase Dashboard → Logs

3. **Share:**
   - Test on mobile
   - Install as PWA
   - Share with users!

---

## 📋 Environment Variables Checklist

```env
# Required:
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
✅ SUPABASE_SERVICE_ROLE_KEY
✅ STRIPE_SECRET_KEY (LIVE key!)
✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (LIVE key!)
✅ STRIPE_WEBHOOK_SECRET (production webhook)
✅ NEXT_PUBLIC_APP_URL (your Vercel URL)
✅ NODE_ENV=production

# Optional:
⚪ NEXT_PUBLIC_PLAUSIBLE_DOMAIN
⚪ NEXT_PUBLIC_EXCHANGE_API_KEY
```

---

## 🔄 How to Update Production

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main
```

**Vercel automatically deploys!** ✨

---

## 🚨 Common Issues

### **Build Failed**

**Check:**
1. Environment variables are set
2. Supabase credentials are correct
3. `npm run build` works locally

### **Payments Not Working**

**Check:**
1. Using LIVE Stripe keys (not test)
2. Webhook URL is correct
3. Webhook secret is set
4. NEXT_PUBLIC_APP_URL is correct

### **App Not Loading**

**Check:**
1. Deployment succeeded (green checkmark)
2. Environment variables saved
3. Redeployed after adding variables
4. Check Vercel logs for errors

---

## 🎯 Production URLs

```
App URL:     https://laahlak-xxxxx.vercel.app
Webhook:     https://laahlak-xxxxx.vercel.app/api/stripe/webhook
Success:     https://laahlak-xxxxx.vercel.app/payment-success
Dashboard:   https://laahlak-xxxxx.vercel.app/dashboard
```

---

## ✅ Success Checklist

- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Environment variables set
- [ ] Stripe webhook configured
- [ ] Test payment completed
- [ ] PWA installable
- [ ] Mobile tested
- [ ] 🎉 **LIVE!**

---

**Full guide:** `documentation/PRODUCTION_DEPLOYMENT.md`

**Need help?** Check troubleshooting section in full guide.

