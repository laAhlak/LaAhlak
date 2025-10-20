# 🚨 URGENT: Database Fix Required

## ⚠️ Current Error

You're seeing this error when trying to send money:

```
Error creating transaction: {
  message: 'null value in column "send_amount_jod" violates not-null constraint'
}
```

## ✅ Quick Fix

**Run this SQL in your Supabase SQL Editor NOW:**

```sql
-- Remove NOT NULL constraints from old JOD columns
ALTER TABLE transactions 
  ALTER COLUMN send_amount_jod DROP NOT NULL,
  ALTER COLUMN fee_jod DROP NOT NULL,
  ALTER COLUMN total_jod DROP NOT NULL;

-- Ensure EUR columns exist
ALTER TABLE transactions 
  ADD COLUMN IF NOT EXISTS send_amount_eur numeric,
  ADD COLUMN IF NOT EXISTS fee_eur numeric,
  ADD COLUMN IF NOT EXISTS total_eur numeric,
  ADD COLUMN IF NOT EXISTS send_amount_jod_equivalent numeric,
  ADD COLUMN IF NOT EXISTS total_jod_equivalent numeric,
  ADD COLUMN IF NOT EXISTS eur_to_jod_rate numeric DEFAULT 0.85,
  ADD COLUMN IF NOT EXISTS note text,
  ADD COLUMN IF NOT EXISTS recipient_name text;

-- Make EUR columns NOT NULL
ALTER TABLE transactions 
  ALTER COLUMN send_amount_eur SET NOT NULL,
  ALTER COLUMN fee_eur SET NOT NULL,
  ALTER COLUMN total_eur SET NOT NULL;
```

## 📍 Where to Run

1. Go to: `https://app.supabase.com/project/YOUR_PROJECT/sql`
2. Paste the SQL above
3. Click "Run"
4. Try sending money again

## 🎯 What This Does

- Makes old JOD columns optional (no longer required)
- Creates new EUR columns (required)
- Allows the app to work with EUR currency

**After running this SQL, the send money feature will work!** 🚀

---

## ✅ Text Updates Complete

I've also updated the text:
- ❌ "الدفع عبر Stripe" → ✅ "تحويل" (Transfer)
- ❌ "سيتم الدفع عبر Stripe بشكل آمن" → ✅ "سيتم التحويل بشكل آمن"

**File Updated:** `components/lazy/SendForm.tsx`

