-- Dating photoshoot pivot schema
-- Run in Supabase SQL editor

-- 1. Prompt library (5 buckets x 20 slots = 100 prompts)
create table if not exists public.prompt_library (
  id uuid primary key default gen_random_uuid(),
  bucket text not null check (bucket in ('anchor', 'social', 'travel', 'active', 'street')),
  slot int not null check (slot >= 1 and slot <= 20),
  prompt_template text not null,
  style_modifiers jsonb not null default '{}'::jsonb,
  posing_cues jsonb not null default '{}'::jsonb,
  params jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  version int not null default 1,
  created_at timestamptz not null default now(),
  unique (bucket, slot, version)
);

create index if not exists idx_prompt_library_bucket on public.prompt_library(bucket);
create index if not exists idx_prompt_library_active on public.prompt_library(is_active);

-- 2. User preferences (3-question intake)
create table if not exists public.user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vibe text not null check (vibe in ('urban', 'outdoorsy', 'homebody')),
  style text not null check (style in ('casual', 'sharp', 'street')),
  hobby_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

create index if not exists idx_user_preferences_user_id on public.user_preferences(user_id);

-- 3. Shoot orders ($59 pack)
create table if not exists public.user_shoot_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  model_id bigint not null references public.models(id) on delete cascade,
  preferences_id uuid references public.user_preferences(id) on delete set null,
  status text not null default 'queued'
    check (status in ('queued', 'developing', 'ready', 'partial_failed', 'failed')),
  trigger_run_id text,
  custom_credits_remaining int not null default 30,
  photos_target int not null default 100,
  fal_cost_cents int not null default 0,
  refund_state text not null default 'none'
    check (refund_state in ('none', 'requested', 'refunded')),
  created_at timestamptz not null default now(),
  ready_at timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists idx_user_shoot_orders_user_id on public.user_shoot_orders(user_id);
create index if not exists idx_user_shoot_orders_status on public.user_shoot_orders(status);
create index if not exists idx_user_shoot_orders_model_id on public.user_shoot_orders(model_id);

-- 4. Per-photo rows (pre-allocated for resume)
create table if not exists public.order_photos (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.user_shoot_orders(id) on delete cascade,
  bucket text not null check (bucket in ('anchor', 'social', 'travel', 'active', 'street')),
  slot int not null check (slot >= 1 and slot <= 20),
  prompt_template text not null,
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'completed', 'failed')),
  fal_request_id text,
  image_url text,
  attempt_count int not null default 0,
  failed_reason text,
  fal_cost_cents int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (order_id, bucket, slot)
);

create index if not exists idx_order_photos_order_id on public.order_photos(order_id);
create index if not exists idx_order_photos_status on public.order_photos(status);
create index if not exists idx_order_photos_fal_request_id on public.order_photos(fal_request_id);
create index if not exists idx_order_photos_order_status on public.order_photos(order_id, status);

-- RLS
alter table public.prompt_library enable row level security;
alter table public.user_preferences enable row level security;
alter table public.user_shoot_orders enable row level security;
alter table public.order_photos enable row level security;

-- prompt_library: public read of active prompts (admin writes via service role)
create policy "Anyone can read active prompts"
  on public.prompt_library for select
  using (is_active = true);

-- user_preferences: own rows only
create policy "Users can view own preferences"
  on public.user_preferences for select
  using (auth.uid() = user_id);

create policy "Users can insert own preferences"
  on public.user_preferences for insert
  with check (auth.uid() = user_id);

create policy "Users can update own preferences"
  on public.user_preferences for update
  using (auth.uid() = user_id);

-- user_shoot_orders: own rows only
create policy "Users can view own orders"
  on public.user_shoot_orders for select
  using (auth.uid() = user_id);

create policy "Users can insert own orders"
  on public.user_shoot_orders for insert
  with check (auth.uid() = user_id);

-- order_photos: via order ownership
create policy "Users can view own order photos"
  on public.order_photos for select
  using (
    exists (
      select 1 from public.user_shoot_orders o
      where o.id = order_photos.order_id and o.user_id = auth.uid()
    )
  );

-- Service role bypasses RLS for trigger.dev worker writes
