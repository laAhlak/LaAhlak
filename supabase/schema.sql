
-- LaAhlak Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Users table (linked to Supabase Auth)
create table if not exists users (
    id uuid primary key references auth.users(id),
    email text not null,
    full_name text,
    phone_number text,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

-- Beneficiaries table (repeat recipients)
create table if not exists beneficiaries (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references users(id) on delete cascade,
    name text not null,
    email text,
    phone_number text,
    country text default 'Jordan',
    iban text,
    cliq_id text,
    created_at timestamp with time zone default now() not null
);

-- Transactions table (core payment data)
create table if not exists transactions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references users(id) on delete cascade,
    beneficiary_id uuid references beneficiaries(id) on delete set null,
    send_amount_jod numeric not null,
    fee_jod numeric not null,
    total_jod numeric not null,
    total_eur numeric not null,
    exchange_rate numeric not null,
    status text default 'pending' not null,
    stripe_session_id text,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

-- Optional FX rates table
create table if not exists fx_rates (
    id uuid primary key default gen_random_uuid(),
    base_currency text not null default 'EUR',
    target_currency text not null default 'JOD',
    rate numeric not null,
    fetched_at timestamp with time zone default now() not null
);

-- Webhook / audit log table
create table if not exists webhook_logs (
    id uuid primary key default gen_random_uuid(),
    transaction_id uuid references transactions(id) on delete cascade,
    event_type text not null,
    payload jsonb,
    created_at timestamp with time zone default now() not null
);

-- Indexes for performance
create index if not exists idx_transactions_user_id on transactions(user_id);
create index if not exists idx_transactions_status on transactions(status);
create index if not exists idx_transactions_created_at on transactions(created_at);
create index if not exists idx_beneficiaries_user_id on beneficiaries(user_id);
create index if not exists idx_webhook_transaction_id on webhook_logs(transaction_id);
create index if not exists idx_webhook_event_type on webhook_logs(event_type);

-- Row Level Security (RLS) policies
alter table users enable row level security;
alter table beneficiaries enable row level security;
alter table transactions enable row level security;
alter table webhook_logs enable row level security;

-- Users can only see their own data
create policy "Users can view own profile" on users
    for select using (auth.uid() = id);

create policy "Users can update own profile" on users
    for update using (auth.uid() = id);

-- Beneficiaries policies
create policy "Users can view own beneficiaries" on beneficiaries
    for select using (auth.uid() = user_id);

create policy "Users can insert own beneficiaries" on beneficiaries
    for insert with check (auth.uid() = user_id);

create policy "Users can update own beneficiaries" on beneficiaries
    for update using (auth.uid() = user_id);

create policy "Users can delete own beneficiaries" on beneficiaries
    for delete using (auth.uid() = user_id);

-- Transactions policies
create policy "Users can view own transactions" on transactions
    for select using (auth.uid() = user_id);

create policy "Users can insert own transactions" on transactions
    for insert with check (auth.uid() = user_id);

create policy "Users can update own transactions" on transactions
    for update using (auth.uid() = user_id);

-- Webhook logs policies (admin only for now)
create policy "Webhook logs are viewable by service role" on webhook_logs
    for select using (true);

create policy "Webhook logs are insertable by service role" on webhook_logs
    for insert with check (true);

-- Functions for automatic timestamp updates
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Triggers for automatic timestamp updates
create trigger update_users_updated_at before update on users
    for each row execute function update_updated_at_column();

create trigger update_transactions_updated_at before update on transactions
    for each row execute function update_updated_at_column();

-- Function to create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.users (id, email, full_name)
    values (new.id, new.email, new.raw_user_meta_data->>'full_name');
    return new;
end;
$$ language plpgsql security definer;

-- Trigger to create user profile on signup
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();
