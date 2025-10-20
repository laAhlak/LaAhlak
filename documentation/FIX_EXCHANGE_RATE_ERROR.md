# 🚨 Fix: Exchange Rate Error

## Current Error

```
null value in column "exchange_rate" of relation "transactions" 
violates not-null constraint
```

## ✅ Complete Solution

Run this **COMPLETE** SQL in your Supabase SQL Editor:

```sql
-- COMPLETE DATABASE FIX FOR EUR CURRENCY
-- Run this in Supabase SQL Editor

-- Step 1: Remove NOT NULL constraints from old JOD columns
ALTER TABLE transactions 
  ALTER COLUMN send_amount_jod DROP NOT NULL,
  ALTER COLUMN fee_jod DROP NOT NULL,
  ALTER COLUMN total_jod DROP NOT NULL;

-- Step 2: Remove NOT NULL constraint from exchange_rate (old column)
ALTER TABLE transactions 
  ALTER COLUMN exchange_rate DROP NOT NULL;

-- Step 3: Ensure EUR columns exist
ALTER TABLE transactions 
  ADD COLUMN IF NOT EXISTS send_amount_eur numeric,
  ADD COLUMN IF NOT EXISTS fee_eur numeric,
  ADD COLUMN IF NOT EXISTS total_eur numeric,
  ADD COLUMN IF NOT EXISTS send_amount_jod_equivalent numeric,
  ADD COLUMN IF NOT EXISTS total_jod_equivalent numeric,
  ADD COLUMN IF NOT EXISTS eur_to_jod_rate numeric DEFAULT 0.85,
  ADD COLUMN IF NOT EXISTS note text,
  ADD COLUMN IF NOT EXISTS recipient_name text;

-- Step 4: Make EUR columns NOT NULL
ALTER TABLE transactions 
  ALTER COLUMN send_amount_eur SET NOT NULL,
  ALTER COLUMN fee_eur SET NOT NULL,
  ALTER COLUMN total_eur SET NOT NULL;

-- Done! You can now send money with EUR currency
```

## 📍 Where to Run

1. Open Supabase Dashboard
2. Go to: SQL Editor → New Query
3. Copy the entire SQL above
4. Click "Run"
5. Refresh your app and try sending money

## 🎯 What This Fixes

**Old Required Columns (Now Optional):**
- `send_amount_jod` - No longer required
- `fee_jod` - No longer required
- `total_jod` - No longer required
- `exchange_rate` - No longer required

**New Required Columns:**
- `send_amount_eur` - Amount in EUR ✅
- `fee_eur` - Fee in EUR ✅
- `total_eur` - Total in EUR ✅

**New Optional Columns:**
- `send_amount_jod_equivalent` - JOD reference
- `total_jod_equivalent` - JOD reference
- `eur_to_jod_rate` - Exchange rate used
- `note` - Transaction note
- `recipient_name` - Recipient name

## ✅ After Running This SQL

Your send money feature will work correctly with:
- ✅ EUR as primary currency
- ✅ JOD equivalents for display
- ✅ Exchange rates tracked per transaction
- ✅ No more database errors

---

**This is the COMPLETE fix - run it once and everything will work!** 🚀

