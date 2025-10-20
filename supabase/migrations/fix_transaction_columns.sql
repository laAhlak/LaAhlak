-- Migration: Fix transaction columns for EUR currency
-- Make old JOD columns nullable and new EUR columns NOT NULL

-- Step 1: Make old JOD columns nullable (remove NOT NULL constraint)
ALTER TABLE transactions 
  ALTER COLUMN send_amount_jod DROP NOT NULL,
  ALTER COLUMN fee_jod DROP NOT NULL,
  ALTER COLUMN total_jod DROP NOT NULL;

-- Step 2: Ensure new EUR columns exist and are NOT NULL
-- First add them as nullable if they don't exist
ALTER TABLE transactions 
  ADD COLUMN IF NOT EXISTS send_amount_eur numeric,
  ADD COLUMN IF NOT EXISTS fee_eur numeric,
  ADD COLUMN IF NOT EXISTS total_eur numeric,
  ADD COLUMN IF NOT EXISTS send_amount_jod_equivalent numeric,
  ADD COLUMN IF NOT EXISTS total_jod_equivalent numeric,
  ADD COLUMN IF NOT EXISTS eur_to_jod_rate numeric DEFAULT 0.85;

-- Step 3: Add note and recipient_name if they don't exist
ALTER TABLE transactions 
  ADD COLUMN IF NOT EXISTS note text,
  ADD COLUMN IF NOT EXISTS recipient_name text;

-- Step 4: Make EUR columns NOT NULL (but only after ensuring they have values)
-- For existing records, copy JOD values to EUR if EUR is null
UPDATE transactions 
SET 
  send_amount_eur = COALESCE(send_amount_eur, send_amount_jod),
  fee_eur = COALESCE(fee_eur, fee_jod),
  total_eur = COALESCE(total_eur, total_jod)
WHERE send_amount_eur IS NULL OR fee_eur IS NULL OR total_eur IS NULL;

-- Now make EUR columns NOT NULL
ALTER TABLE transactions 
  ALTER COLUMN send_amount_eur SET NOT NULL,
  ALTER COLUMN fee_eur SET NOT NULL,
  ALTER COLUMN total_eur SET NOT NULL;

-- Step 5: Add comments for clarity
COMMENT ON COLUMN transactions.send_amount_eur IS 'Amount to send in EUR (primary currency)';
COMMENT ON COLUMN transactions.fee_eur IS 'Service fee in EUR (4%)';
COMMENT ON COLUMN transactions.total_eur IS 'Total amount in EUR (send_amount + fee)';
COMMENT ON COLUMN transactions.send_amount_jod_equivalent IS 'Equivalent amount in JOD for reference';
COMMENT ON COLUMN transactions.total_jod_equivalent IS 'Total equivalent in JOD for reference';
COMMENT ON COLUMN transactions.eur_to_jod_rate IS 'Exchange rate used (1 EUR = X JOD)';
COMMENT ON COLUMN transactions.send_amount_jod IS 'DEPRECATED: Old JOD column, kept for backward compatibility';
COMMENT ON COLUMN transactions.fee_jod IS 'DEPRECATED: Old JOD column, kept for backward compatibility';
COMMENT ON COLUMN transactions.total_jod IS 'DEPRECATED: Old JOD column, kept for backward compatibility';

