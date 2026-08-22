-- Isolated prompt experiment history. No production shoot, order or credit table is changed.
create table if not exists public.prompt_lab_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_request_id uuid not null,
  parent_run_id uuid references public.prompt_lab_runs(id) on delete set null,
  status text not null check (status in ('running', 'passed', 'failed_validation', 'api_error')),
  model text not null,
  thinking_level text not null,
  prompt_system_version text not null,
  reference_shoot_id text not null,
  reference_evidence text not null,
  input jsonb not null,
  output jsonb,
  validation_errors jsonb not null default '[]'::jsonb,
  scene_density jsonb not null default '[]'::jsonb,
  input_tokens integer not null default 0 check (input_tokens >= 0),
  output_tokens integer not null default 0 check (output_tokens >= 0),
  reasoning_tokens integer not null default 0 check (reasoning_tokens >= 0),
  total_tokens integer not null default 0 check (total_tokens >= 0),
  estimated_cost_usd numeric(14, 8) not null default 0 check (estimated_cost_usd >= 0),
  pricing_snapshot jsonb not null,
  feedback jsonb not null default '{"rating":null,"decision":"unreviewed","issueTags":[],"notes":"","frameNotes":{"close":"","medium":"","threeQuarter":"","expression":""}}'::jsonb,
  api_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, client_request_id)
);

create index if not exists prompt_lab_runs_user_created_idx
  on public.prompt_lab_runs(user_id, created_at desc);
create index if not exists prompt_lab_runs_parent_idx
  on public.prompt_lab_runs(parent_run_id, created_at asc);

alter table public.prompt_lab_runs enable row level security;

create policy "prompt lab users select own runs"
  on public.prompt_lab_runs for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "prompt lab users insert own runs"
  on public.prompt_lab_runs for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "prompt lab users update own runs"
  on public.prompt_lab_runs for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

