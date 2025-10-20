# 💶 Database Migration: EUR Currency Update

## Overview

This migration updates the database schema to properly reflect EUR as the primary currency instead of JOD.

---

## 🗄️ Database Changes

### **New Column Structure:**

**Before:**
```sql
transactions (
  send_amount_jod numeric,
  fee_jod numeric,
  total_jod numeric,
  total_eur numeric,
  exchange_rate numeric
)
```

**After:**
```sql
transactions (
  send_amount_eur numeric,          -- Amount to send in EUR
  fee_eur numeric,                  -- Service fee in EUR (4%)
  total_eur numeric,                -- Total in EUR (send + fee)
  send_amount_jod_equivalent numeric, -- JOD equivalent for reference
  total_jod_equivalent numeric,      -- Total JOD equivalent
  eur_to_jod_rate numeric            -- Exchange rate (1 EUR = X JOD)
)
```

---

## 📋 Migration Steps

### **Step 1: Apply the Migration**

Run this SQL in your Supabase SQL Editor:

```bash
# Option 1: Using Supabase CLI
supabase db push

# Option 2: Using psql
psql -U postgres -d laahlak -f supabase/migrations/update_currency_to_eur.sql

# Option 3: Copy and paste into Supabase SQL Editor
# Open: https://app.supabase.com/project/YOUR_PROJECT/sql
# Paste contents of: supabase/migrations/update_currency_to_eur.sql
```

### **Step 2: Verify Migration**

Check that new columns exist:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'transactions' 
ORDER BY ordinal_position;
```

Expected output should include:
```
send_amount_eur          | numeric
fee_eur                  | numeric
total_eur                | numeric
send_amount_jod_equivalent | numeric
total_jod_equivalent     | numeric
eur_to_jod_rate          | numeric
```

### **Step 3: Test Transaction Creation**

Create a test transaction through the app:

```
1. Go to /dashboard
2. Click "Send"
3. Select a beneficiary
4. Enter amount: 10 EUR
5. Complete payment
```

Then verify in database:

```sql
SELECT 
  id,
  send_amount_eur,
  fee_eur,
  total_eur,
  total_jod_equivalent,
  eur_to_jod_rate,
  created_at
FROM transactions
ORDER BY created_at DESC
LIMIT 1;
```

Expected result:
```
send_amount_eur: 10.00
fee_eur: 0.40
total_eur: 10.40
total_jod_equivalent: 8.84
eur_to_jod_rate: 0.85
```

---

## 🔧 Code Changes Summary

### **1. API Route (Stripe)**
**File:** `app/api/stripe/create-payment-link/route.ts`

**Changed:**
```typescript
// Before
{
  send_amount_jod: amount,
  fee_jod: feeAmount,
  total_jod: totalAmount,
}

// After
{
  send_amount_eur: amount,
  fee_eur: feeAmount,
  total_eur: totalAmount,
  send_amount_jod_equivalent: amount * EUR_TO_JOD,
  total_jod_equivalent: jodAmount,
  eur_to_jod_rate: EUR_TO_JOD,
}
```

### **2. TypeScript Types**
**File:** `lib/supabaseLazy.ts`

**Changed:**
```typescript
// Before
export interface Transaction {
  send_amount_jod: number
  fee_jod: number
  total_jod: number
  total_eur: number
  exchange_rate: number
}

// After
export interface Transaction {
  send_amount_eur: number
  fee_eur: number
  total_eur: number
  send_amount_jod_equivalent?: number
  total_jod_equivalent?: number
  eur_to_jod_rate?: number
}
```

### **3. Dashboard**
**File:** `components/lazy/DashboardWithCharts.tsx`

**Changed:**
```typescript
// Query
.select(`
  send_amount_eur,    // was: send_amount_jod
  total_eur,
  fee_eur,            // was: fee_jod
  total_jod_equivalent,
  ...
`)

// Display
<p>€{stats.totalFees.toFixed(2)}</p>  // was: د.أ
```

---

## 📊 Data Compatibility

### **Backward Compatibility**

The migration is designed to:
1. ✅ Add new EUR columns without removing old ones
2. ✅ Copy data from old columns to new ones
3. ✅ Create a view for backward compatibility
4. ✅ Allow gradual transition

### **Old Data Migration**

If you have existing transactions with JOD values:

```sql
-- The migration automatically copies old JOD values to new EUR columns
-- treating old JOD values as if they were EUR

-- If you want to convert actual JOD to EUR (e.g., 1 JOD = 1.18 EUR)
UPDATE transactions
SET 
  send_amount_eur = send_amount_jod * 1.18,
  fee_eur = fee_jod * 1.18,
  total_eur = total_jod * 1.18
WHERE send_amount_eur IS NULL;
```

---

## ⚠️ Important Notes

### **1. Old Column Names**

The old columns (`send_amount_jod`, `fee_jod`, `total_jod`) are NOT dropped by this migration for safety. They remain in the database but are no longer used by the application.

To remove them after confirming everything works:

```sql
-- ONLY run this after verifying new columns work correctly!
ALTER TABLE transactions 
  DROP COLUMN IF EXISTS send_amount_jod,
  DROP COLUMN IF EXISTS fee_jod,
  DROP COLUMN IF EXISTS total_jod,
  DROP COLUMN IF EXISTS exchange_rate;
```

### **2. Exchange Rate Updates**

The exchange rate is now stored per transaction:

```sql
-- View historical exchange rates used
SELECT 
  DATE(created_at) as date,
  AVG(eur_to_jod_rate) as avg_rate,
  MIN(eur_to_jod_rate) as min_rate,
  MAX(eur_to_jod_rate) as max_rate,
  COUNT(*) as transaction_count
FROM transactions
WHERE eur_to_jod_rate IS NOT NULL
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### **3. Reporting Queries**

Update any custom queries or reports:

**Before:**
```sql
SELECT 
  SUM(total_jod) as total,
  SUM(fee_jod) as fees
FROM transactions
```

**After:**
```sql
SELECT 
  SUM(total_eur) as total_eur,
  SUM(fee_eur) as fees_eur,
  SUM(total_jod_equivalent) as total_jod
FROM transactions
```

---

## 🧪 Testing Checklist

After applying migration:

- [ ] **Database Structure**
  - [ ] New EUR columns exist
  - [ ] JOD equivalent columns exist
  - [ ] Exchange rate column exists
  - [ ] Old columns still exist (for safety)

- [ ] **Application Functionality**
  - [ ] Send money flow works
  - [ ] Transactions save correctly
  - [ ] Dashboard displays EUR amounts
  - [ ] JOD equivalents display correctly
  - [ ] Stripe receives EUR

- [ ] **Data Integrity**
  - [ ] Test transaction has all EUR values
  - [ ] JOD equivalents calculate correctly
  - [ ] Exchange rate is stored
  - [ ] No null values in required fields

- [ ] **Display Verification**
  - [ ] Dashboard shows € symbol
  - [ ] Fees show € symbol
  - [ ] Transaction list shows EUR
  - [ ] JOD equivalents show د.أ symbol

---

## 🔄 Rollback Procedure

If you need to rollback:

**Step 1: Switch code back to old column names**

```typescript
// In app/api/stripe/create-payment-link/route.ts
{
  send_amount_jod: amount,
  fee_jod: feeAmount,
  total_jod: totalAmount,
}
```

**Step 2: Drop new columns (if needed)**

```sql
ALTER TABLE transactions 
  DROP COLUMN IF EXISTS send_amount_eur,
  DROP COLUMN IF EXISTS fee_eur,
  DROP COLUMN IF EXISTS send_amount_jod_equivalent,
  DROP COLUMN IF EXISTS total_jod_equivalent,
  DROP COLUMN IF EXISTS eur_to_jod_rate;
```

**Step 3: Restart application**

```bash
npm run dev
```

---

## 📈 Benefits of This Migration

1. **Clarity**: Column names match actual currency (EUR)
2. **Flexibility**: JOD equivalents stored for reference
3. **History**: Exchange rates saved per transaction
4. **Safety**: Old columns retained during transition
5. **Compatibility**: View created for backward compatibility

---

## ✅ Migration Checklist

Complete these steps in order:

1. [ ] **Backup Database**
   ```bash
   pg_dump laahlak > backup_before_eur_migration.sql
   ```

2. [ ] **Apply Migration**
   ```bash
   psql -U postgres -d laahlak -f supabase/migrations/update_currency_to_eur.sql
   ```

3. [ ] **Verify Schema**
   ```sql
   \d transactions
   ```

4. [ ] **Test Application**
   - Send test transaction
   - View on dashboard
   - Check database values

5. [ ] **Monitor Logs**
   - Check for errors
   - Verify calculations
   - Confirm Stripe integration

6. [ ] **Update Documentation**
   - API documentation
   - User guides
   - Admin procedures

---

## 🎯 Success Criteria

Migration is successful when:

✅ New EUR columns exist and populated  
✅ Test transaction creates EUR values  
✅ Dashboard displays EUR correctly  
✅ JOD equivalents display correctly  
✅ Stripe receives EUR payments  
✅ No application errors  
✅ All tests passing  

---

**Ready to migrate!** Follow the steps above to update your database. 💶✅

