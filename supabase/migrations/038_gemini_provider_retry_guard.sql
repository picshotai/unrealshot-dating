-- 038: distinguish temporary Gemini outages from permanent request/configuration
-- errors. Migration 037 is already deployed and remains unchanged.

alter table public.user_shoot_orders
  add column if not exists provider_blocked boolean not null default false;

alter table public.dating_portfolio_attempts
  add column if not exists error_retryable boolean;

alter table public.dating_prompt_attempts
  add column if not exists error_retryable boolean;

create index if not exists user_shoot_orders_dynamic_reconcile_idx
  on public.user_shoot_orders(updated_at)
  where pipeline_mode = 'dynamic'
    and status in ('queued', 'developing')
    and provider_blocked = false;
