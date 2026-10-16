-- ==============================================================================
-- SUPER PANEL: admin email log + admin audit log
--
-- Both tables are written and read only by the service role from /superpanel.
-- RLS is enabled with no policies, so anon/authenticated clients see nothing.
-- ==============================================================================

create table if not exists public.admin_email_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  to_email text not null,
  from_email text not null,
  reply_to text,
  subject text not null,
  body_text text not null,
  template_key text,
  batch_id uuid,
  resend_id text,
  status text not null default 'sent' check (status in ('sent', 'failed')),
  error text,
  sent_by text not null,
  created_at timestamptz not null default now()
);

create index if not exists admin_email_logs_user_id_idx on public.admin_email_logs (user_id, created_at desc);
create index if not exists admin_email_logs_created_at_idx on public.admin_email_logs (created_at desc);
create index if not exists admin_email_logs_batch_id_idx on public.admin_email_logs (batch_id);
alter table public.admin_email_logs enable row level security;

create table if not exists public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_email text not null,
  action text not null,
  target_user_id uuid references auth.users(id) on delete set null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_audit_log_created_at_idx on public.admin_audit_log (created_at desc);
create index if not exists admin_audit_log_target_idx on public.admin_audit_log (target_user_id, created_at desc);
alter table public.admin_audit_log enable row level security;
