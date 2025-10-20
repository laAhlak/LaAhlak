# 🚨 URGENT: Database Column Fix Required

## Problem

The database is trying to insert into old `send_amount_jod` columns which have NOT NULL constraints, but the code is now using new `send_amount_eur` columns.

**Error:**
```
null value in column "send_amount_jod" violates not-null constraint
```

---

## ⚡ Quick Fix (Run Immediately)

### **Step 1: Open Supabase SQL Editor**

Go to: `https://app.supabase.com/project/YOUR_PROJECT/sql`

### **Step 2: Copy and Paste This SQL**

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

### **Step 3: Click "Run"**

### **Step 4: Verify**

Check that it worked:

```sql
SELECT column_name, is_nullable, data_type
FROM information_schema.columns
WHERE table_name = 'transactions'
  AND column_name LIKE '%amount%' OR column_name LIKE '%fee%' OR column_name LIKE '%total%'
ORDER BY column_name;
```

Expected results:
```
send_amount_jod          YES  numeric  ← Now nullable
fee_jod                  YES  numeric  ← Now nullable
total_jod                YES  numeric  ← Now nullable
send_amount_eur          NO   numeric  ← NOT NULL
fee_eur                  NO   numeric  ← NOT NULL
total_eur                NO   numeric  ← NOT NULL
```

---

## 📝 What This Does

1. **Makes old columns optional** - Old JOD columns (`send_amount_jod`, `fee_jod`, `total_jod`) are now nullable
2. **Adds new EUR columns** - Creates new EUR columns if they don't exist
3. **Makes EUR columns required** - New EUR columns are NOT NULL

---

## 🧪 Test After Fix

1. **Try creating a transaction again:**
   ```bash
   # In your app at localhost:3000
   1. Go to /dashboard
   2. Click "Send"
   3. Select a beneficiary
   4. Enter amount: 10
   5. Click "إرسال الآن"
   ```

2. **Should work now!** ✅

3. **Check database:**
   ```sql
   SELECT 
     send_amount_eur,
     fee_eur,
     total_eur,
     total_jod_equivalent,
     send_amount_jod,  -- Should be NULL
     created_at
   FROM transactions
   ORDER BY created_at DESC
   LIMIT 1;
   ```

   Expected:
   ```
   send_amount_eur: 10.00
   fee_eur: 0.40
   total_eur: 10.40
   total_jod_equivalent: 8.84
   send_amount_jod: NULL  ← Old column now empty
   ```

---

## 🔧 Alternative: Use File

The SQL is also saved in: **`URGENT_FIX.sql`**

You can:
1. Open that file
2. Copy all content
3. Paste in Supabase SQL Editor
4. Run

---

## ⚠️ Important Notes

- **This fix is safe** - It doesn't delete any data
- **Old columns remain** - They're just made optional
- **New columns are primary** - App now uses EUR columns
- **Backward compatible** - Old data remains intact

---

## 📊 What Happened?

The original database schema had:
```sql
send_amount_jod numeric NOT NULL  ← Required field
```

But the code now inserts into:
```sql
send_amount_eur numeric  ← New field
```

This migration makes old fields optional and new fields required.

---

## ✅ After Running Fix

You should be able to:
- ✅ Create new transactions
- ✅ Send money through the app
- ✅ View transactions on dashboard
- ✅ See EUR amounts in Stripe
- ✅ See JOD equivalents in app

---

**Run the SQL fix now and the error will be resolved!** 🚀

