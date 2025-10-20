-- Create user_2fa_settings table
create table if not exists user_2fa_settings (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade not null unique,
    enabled boolean default false,
    method text check (method in ('pin', 'biometric', 'both')),
    pin_hash text,
    biometric_enabled boolean default false,
    last_verified timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Enable RLS
alter table user_2fa_settings enable row level security;

-- Policies
create policy "Users can view own 2FA settings"
    on user_2fa_settings
    for select
    using (auth.uid() = user_id);

create policy "Users can update own 2FA settings"
    on user_2fa_settings
    for update
    using (auth.uid() = user_id);

create policy "Users can insert own 2FA settings"
    on user_2fa_settings
    for insert
    with check (auth.uid() = user_id);

-- Create index
create index idx_user_2fa_settings_user_id on user_2fa_settings(user_id);

-- Add trigger to update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_user_2fa_settings_updated_at
    before update on user_2fa_settings
    for each row
    execute function update_updated_at_column();

