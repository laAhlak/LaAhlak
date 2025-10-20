-- URGENT FIX: Remove NOT NULL constraints from old JOD columns
-- Run this immediately in Supabase SQL Editor

-- Make old JOD columns nullable
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

