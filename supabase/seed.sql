-- Seed data for LaAhlak database
-- Run this after creating the schema

-- Insert dummy users (these would normally be created by Supabase Auth)
-- Note: In real app, these would be created through authentication
INSERT INTO users (id, email, full_name, phone_number) VALUES
  ('11111111-1111-1111-1111-111111111111', 'ahmad@example.com', 'أحمد الراشد', '+962791234567'),
  ('22222222-2222-2222-2222-222222222222', 'fatima@example.com', 'فاطمة حسن', '+962792345678'),
  ('33333333-3333-3333-3333-333333333333', 'omar@example.com', 'عمر خليل', '+962793456789');

-- Insert dummy beneficiaries
INSERT INTO beneficiaries (user_id, name, email, phone_number, country, iban, cliq_id) VALUES
  -- Ahmad's beneficiaries
  ('11111111-1111-1111-1111-111111111111', 'سارة الراشد', 'sara@example.com', '+962791111111', 'Jordan', 'JO94CBJO0010000000000000001234', 'SAR123'),
  ('11111111-1111-1111-1111-111111111111', 'محمد الراشد', 'mohammed@example.com', '+962792222222', 'Jordan', 'JO94CBJO0010000000000000001235', 'MOH456'),
  ('11111111-1111-1111-1111-111111111111', 'نورا الراشد', 'nora@example.com', '+962793333333', 'Jordan', 'JO94CBJO0010000000000000001236', 'NOR789'),
  
  -- Fatima's beneficiaries
  ('22222222-2222-2222-2222-222222222222', 'علي حسن', 'ali@example.com', '+962794444444', 'Jordan', 'JO94CBJO0010000000000000001237', 'ALI123'),
  ('22222222-2222-2222-2222-222222222222', 'مريم حسن', 'mariam@example.com', '+962795555555', 'Jordan', 'JO94CBJO0010000000000000001238', 'MAR456'),
  
  -- Omar's beneficiaries
  ('33333333-3333-3333-3333-333333333333', 'خالد خليل', 'khalid@example.com', '+962796666666', 'Jordan', 'JO94CBJO0010000000000000001239', 'KHA123'),
  ('33333333-3333-3333-3333-333333333333', 'لينا خليل', 'lina@example.com', '+962797777777', 'Jordan', 'JO94CBJO0010000000000000001240', 'LIN456'),
  ('33333333-3333-3333-3333-333333333333', 'يوسف خليل', 'yousef@example.com', '+962798888888', 'Jordan', 'JO94CBJO0010000000000000001241', 'YOU789');

-- Insert dummy transactions
INSERT INTO transactions (user_id, beneficiary_id, send_amount_jod, fee_jod, total_jod, total_eur, exchange_rate, status, stripe_session_id) VALUES
  -- Ahmad's transactions
  ('11111111-1111-1111-1111-111111111111', (SELECT id FROM beneficiaries WHERE name = 'سارة الراشد' LIMIT 1), 200.00, 8.00, 208.00, 277.33, 0.75, 'completed', 'cs_test_1234567890'),
  ('11111111-1111-1111-1111-111111111111', (SELECT id FROM beneficiaries WHERE name = 'محمد الراشد' LIMIT 1), 150.00, 6.00, 156.00, 208.00, 0.75, 'completed', 'cs_test_1234567891'),
  ('11111111-1111-1111-1111-111111111111', (SELECT id FROM beneficiaries WHERE name = 'نورا الراشد' LIMIT 1), 300.00, 12.00, 312.00, 416.00, 0.75, 'pending', 'cs_test_1234567892'),
  
  -- Fatima's transactions
  ('22222222-2222-2222-2222-222222222222', (SELECT id FROM beneficiaries WHERE name = 'علي حسن' LIMIT 1), 100.00, 4.00, 104.00, 138.67, 0.75, 'completed', 'cs_test_1234567893'),
  ('22222222-2222-2222-2222-222222222222', (SELECT id FROM beneficiaries WHERE name = 'مريم حسن' LIMIT 1), 250.00, 10.00, 260.00, 346.67, 0.75, 'completed', 'cs_test_1234567894'),
  
  -- Omar's transactions
  ('33333333-3333-3333-3333-333333333333', (SELECT id FROM beneficiaries WHERE name = 'خالد خليل' LIMIT 1), 180.00, 7.20, 187.20, 249.60, 0.75, 'completed', 'cs_test_1234567895'),
  ('33333333-3333-3333-3333-333333333333', (SELECT id FROM beneficiaries WHERE name = 'لينا خليل' LIMIT 1), 120.00, 4.80, 124.80, 166.40, 0.75, 'failed', 'cs_test_1234567896'),
  ('33333333-3333-3333-3333-333333333333', (SELECT id FROM beneficiaries WHERE name = 'يوسف خليل' LIMIT 1), 350.00, 14.00, 364.00, 485.33, 0.75, 'completed', 'cs_test_1234567897');

-- Insert some FX rates for historical data
INSERT INTO fx_rates (base_currency, target_currency, rate) VALUES
  ('EUR', 'JOD', 0.75),
  ('EUR', 'JOD', 0.76),
  ('EUR', 'JOD', 0.74),
  ('EUR', 'JOD', 0.75),
  ('EUR', 'JOD', 0.77);

-- Insert some webhook logs for audit trail
INSERT INTO webhook_logs (transaction_id, event_type, payload) VALUES
  ((SELECT id FROM transactions WHERE stripe_session_id = 'cs_test_1234567890' LIMIT 1), 'checkout.session.completed', '{"id": "cs_test_1234567890", "status": "complete"}'),
  ((SELECT id FROM transactions WHERE stripe_session_id = 'cs_test_1234567891' LIMIT 1), 'checkout.session.completed', '{"id": "cs_test_1234567891", "status": "complete"}'),
  ((SELECT id FROM transactions WHERE stripe_session_id = 'cs_test_1234567896' LIMIT 1), 'checkout.session.failed', '{"id": "cs_test_1234567896", "status": "failed"}');
