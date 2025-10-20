-- Migration: Update currency columns from JOD to EUR
-- This migration renames the transaction columns to reflect EUR as the primary currency

-- Add new EUR columns if they don't exist
ALTER TABLE transactions 
  ADD COLUMN IF NOT EXISTS send_amount_eur numeric,
  ADD COLUMN IF NOT EXISTS fee_eur numeric,
  ADD COLUMN IF NOT EXISTS total_eur numeric;

-- Add JOD columns for reference
ALTER TABLE transactions 
  ADD COLUMN IF NOT EXISTS send_amount_jod_equivalent numeric,
  ADD COLUMN IF NOT EXISTS total_jod_equivalent numeric;

-- Add exchange rate column
ALTER TABLE transactions 
  ADD COLUMN IF NOT EXISTS eur_to_jod_rate numeric DEFAULT 0.85;

-- Add note and recipient_name if they don't exist
ALTER TABLE transactions 
  ADD COLUMN IF NOT EXISTS note text,
  ADD COLUMN IF NOT EXISTS recipient_name text;

-- Copy data from old columns to new EUR columns (if old columns exist)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'transactions' AND column_name = 'send_amount_jod'
  ) THEN
    -- If old JOD columns exist, we're treating them as EUR now
    UPDATE transactions 
    SET 
      send_amount_eur = COALESCE(send_amount_eur, send_amount_jod),
      fee_eur = COALESCE(fee_eur, fee_jod),
      total_eur = COALESCE(total_eur, total_jod);
  END IF;
END $$;

-- Create a view for backward compatibility
CREATE OR REPLACE VIEW transactions_with_currency AS
SELECT 
  id,
  user_id,
  beneficiary_id,
  send_amount_eur as send_amount,
  fee_eur as fee,
  total_eur as total,
  send_amount_jod_equivalent,
  total_jod_equivalent,
  eur_to_jod_rate,
  status,
  stripe_session_id,
  recipient_name,
  note,
  created_at,
  updated_at
FROM transactions;

-- Add comment to clarify
COMMENT ON COLUMN transactions.send_amount_eur IS 'Amount to send in EUR';
COMMENT ON COLUMN transactions.fee_eur IS 'Service fee in EUR (4%)';
COMMENT ON COLUMN transactions.total_eur IS 'Total amount in EUR (send_amount + fee)';
COMMENT ON COLUMN transactions.send_amount_jod_equivalent IS 'Equivalent amount in JOD for reference';
COMMENT ON COLUMN transactions.total_jod_equivalent IS 'Total equivalent in JOD for reference';
COMMENT ON COLUMN transactions.eur_to_jod_rate IS 'Exchange rate used (1 EUR = X JOD)';

