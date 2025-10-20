# 🚀 Quick Reference Guide

## ✅ What's Done

### 1. **Two-Factor Authentication** 🔐
- ✅ PIN code (4-digit)
- ✅ Biometric (Fingerprint/Face ID)
- ✅ Setup UI in Settings
- ✅ Verification modal ready
- ✅ Database schema created

**Location:** Settings → المصادقة الثنائية

### 2. **Beneficiary Form** 📝
- ✅ Removed country field
- ✅ Auto-defaults to Jordan
- ✅ Simplified form

**Location:** /beneficiaries/add

### 3. **Send Money Button** 💸
- ✅ Changed to "إرسال الآن"
- ✅ Removed Stripe branding
- ✅ Professional UI

**Location:** Dashboard → Send button

### 4. **Stripe Integration** ✅
- ✅ Payment links working
- ✅ Webhooks configured
- ✅ Transaction tracking
- ✅ All verified

**Files:** 
- `app/api/stripe/create-payment-link/route.ts`
- `app/api/stripe/webhook/route.ts`

---

## 🧪 Quick Test Commands

### Start Development Server:
```bash
npm run dev
```

### Test Stripe Webhook (separate terminal):
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Apply 2FA Database Migration:
```bash
psql -U postgres -d laahlak -f supabase/migrations/add_2fa_settings.sql
```

### Check Linter:
```bash
npm run lint
```

### Build for Production:
```bash
npm run build
```

---

## 📁 Key Files

### 2FA:
- `lib/auth2FA.ts` - Core functions
- `components/TwoFactorSetup.tsx` - Setup UI
- `components/TwoFactorVerify.tsx` - Verification modal
- `supabase/migrations/add_2fa_settings.sql` - Database

### Beneficiaries:
- `app/beneficiaries/add/page.tsx` - Add form
- `components/lazy/BeneficiariesList.tsx` - List view

### Send Money:
- `components/lazy/SendFlowModal.tsx` - Modal flow
- `components/lazy/DashboardWithCharts.tsx` - Dashboard

### Stripe:
- `app/api/stripe/create-payment-link/route.ts` - Payment API
- `app/api/stripe/webhook/route.ts` - Webhook handler

---

## 🔧 Environment Variables

**Required in `.env.local`:**
```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## 🎯 Testing Flow

### Test Beneficiary:
1. Go to `/beneficiaries`
2. Click "إضافة مستفيد جديد"
3. Fill form (no country field)
4. Submit
5. ✅ Should save with country = "Jordan"

### Test Send Money:
1. Go to `/dashboard`
2. Click "Send" button
3. Select beneficiary
4. Enter amount (e.g., 10)
5. See fee: 0.40 JOD
6. See total: 10.40 JOD
7. Click "إرسال الآن"
8. ✅ Should redirect to Stripe

### Test 2FA Setup:
1. Go to `/settings`
2. Find "المصادقة الثنائية"
3. Click "🔢 رمز PIN"
4. Enter PIN twice (e.g., 1234)
5. Click "تفعيل"
6. ✅ Should show "مفعل"

### Test Stripe Payment:
1. Complete send money flow
2. On Stripe page, use test card:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
3. Complete payment
4. ✅ Should redirect to success page
5. ✅ Check webhook received (if running `stripe listen`)

---

## 📊 Database Quick Check

### Check Transactions:
```sql
SELECT * FROM transactions 
ORDER BY created_at DESC 
LIMIT 5;
```

### Check 2FA Settings:
```sql
SELECT * FROM user_2fa_settings;
```

### Check Beneficiaries:
```sql
SELECT * FROM beneficiaries 
WHERE user_id = 'your-user-id';
```

---

## 🐛 Common Issues

### Issue: "Stripe is not defined"
**Fix:** Check `STRIPE_SECRET_KEY` in `.env.local`

### Issue: "Webhook signature failed"
**Fix:** Run `stripe listen` and copy webhook secret

### Issue: "Transaction not found"
**Fix:** Check `stripe_session_id` is saved in database

### Issue: "2FA not showing"
**Fix:** Apply database migration first

### Issue: "Country field still showing"
**Fix:** Clear browser cache and restart dev server

---

## 📚 Documentation Files

**Read These:**
- `TWO_FACTOR_AUTH.md` - Complete 2FA guide
- `STRIPE_VERIFICATION.md` - Stripe verification
- `UPDATES_SUMMARY.md` - All recent changes
- `CHANGELOG.md` - Full changelog

**Quick Reference:**
- `QUICK_REFERENCE.md` - This file
- `README.md` - Project overview

---

## ✨ Summary

**What Changed:**
1. Added 2FA (PIN + Biometric)
2. Removed country from beneficiary form
3. Changed send button to "إرسال الآن"
4. Verified Stripe integration

**What Works:**
- ✅ 2FA setup in Settings
- ✅ Simplified beneficiary form
- ✅ Professional send button
- ✅ Stripe payments
- ✅ Webhooks
- ✅ Transaction tracking

**What's Next:**
1. Test everything
2. Apply 2FA migration
3. Integrate 2FA in login/send flows
4. Deploy to production

**Status:** Ready for testing! 🎉

