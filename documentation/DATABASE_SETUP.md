# Database Setup Guide for LaAhlak

## 🗄️ Supabase Database Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Choose a region close to your users
4. Set a strong database password

### 2. Run Database Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase/schema.sql`
4. Click **Run** to execute the schema

### 3. Configure Environment Variables

Update your `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Enable Authentication

1. Go to **Authentication** → **Settings**
2. Configure your authentication providers (Email, Google, etc.)
3. Set up email templates if needed
4. Configure redirect URLs for your app

## 📊 Database Schema Overview

### Tables Created:

1. **`users`** - User profiles linked to Supabase Auth
2. **`beneficiaries`** - Saved recipients for quick transfers
3. **`transactions`** - Core payment/transfer data
4. **`fx_rates`** - Exchange rate history (optional)
5. **`webhook_logs`** - Audit trail for webhook events

### Key Features:

- **Row Level Security (RLS)** - Users can only access their own data
- **Automatic Timestamps** - Created/updated timestamps
- **Foreign Key Constraints** - Data integrity
- **Indexes** - Optimized for common queries
- **Triggers** - Auto-create user profiles on signup

## 🔐 Security Features

### Row Level Security Policies:

- Users can only view/edit their own data
- Beneficiaries are scoped to user
- Transactions are scoped to user
- Webhook logs are service-role only

### Data Protection:

- All sensitive data is encrypted at rest
- API keys are environment variables
- User authentication via Supabase Auth
- Stripe handles payment data securely

## 🚀 API Endpoints

### Transactions:
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions?stats=true` - Get transaction statistics

### Beneficiaries:
- `GET /api/beneficiaries` - Get user beneficiaries
- `POST /api/beneficiaries` - Add new beneficiary
- `GET /api/beneficiaries/[id]` - Get specific beneficiary
- `PUT /api/beneficiaries/[id]` - Update beneficiary
- `DELETE /api/beneficiaries/[id]` - Delete beneficiary

## 📈 Performance Optimizations

### Indexes:
- `idx_transactions_user_id` - Fast user transaction queries
- `idx_transactions_status` - Filter by status
- `idx_transactions_created_at` - Sort by date
- `idx_beneficiaries_user_id` - Fast beneficiary queries

### Query Optimization:
- Use `select()` to limit returned fields
- Use `limit()` for pagination
- Use `order()` for consistent sorting
- Use `eq()` for exact matches

## 🔄 Webhook Integration

### Stripe Webhooks:
- `checkout.session.completed` - Creates completed transaction
- `checkout.session.expired` - Updates transaction status
- All webhook events are logged for audit

### Webhook Setup:
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhook`
3. Select events: `checkout.session.completed`, `checkout.session.expired`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

## 🧪 Testing

### Local Development:
1. Use Supabase local development (optional)
2. Test with Stripe test mode
3. Use test webhook endpoints

### Production:
1. Use production Supabase project
2. Use Stripe live mode
3. Configure production webhooks

## 📝 Data Migration

If you need to migrate existing data:

1. Export from old system
2. Transform data to match new schema
3. Use Supabase SQL editor or API
4. Verify data integrity

## 🛠️ Maintenance

### Regular Tasks:
- Monitor database performance
- Check webhook logs for errors
- Update exchange rates regularly
- Clean up old webhook logs

### Backup:
- Supabase handles automatic backups
- Export critical data regularly
- Test restore procedures

## 🚨 Troubleshooting

### Common Issues:

1. **RLS Policy Errors**: Check user authentication
2. **Foreign Key Violations**: Ensure referenced records exist
3. **Webhook Failures**: Check Stripe webhook configuration
4. **Performance Issues**: Check indexes and query patterns

### Debug Tools:
- Supabase Dashboard → Logs
- Stripe Dashboard → Webhooks
- Browser DevTools → Network
- Next.js API routes logs
