-- Resilient pipeline: deterministic photo IDs + aesthetic score + order status

-- Deterministic primary key for idempotent upserts: {orderId}_{bucket}_{slot}
alter table public.order_photos
  add column if not exists deterministic_id text;

alter table public.order_photos
  add column if not exists aesthetic_score real;

-- Backfill existing rows if any
update public.order_photos
set deterministic_id = order_id::text || '_' || bucket || '_' || slot::text
where deterministic_id is null;

-- Enforce uniqueness (idempotent upserts)
create unique index if not exists idx_order_photos_deterministic_id
  on public.order_photos (deterministic_id);

-- Allow new order status from parent finalizer
alter table public.user_shoot_orders
  drop constraint if exists user_shoot_orders_status_check;

alter table public.user_shoot_orders
  add constraint user_shoot_orders_status_check
  check (status in (
    'queued',
    'developing',
    'ready',
    'partial_failed',
    'failed',
    'failed_components_present'
  ));

-- Photo status: allow pending_verification intermediate if needed
alter table public.order_photos
  drop constraint if exists order_photos_status_check;

alter table public.order_photos
  add constraint order_photos_status_check
  check (status in (
    'pending',
    'in_progress',
    'pending_verification',
    'completed',
    'failed'
  ));
