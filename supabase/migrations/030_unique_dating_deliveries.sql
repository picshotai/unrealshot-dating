-- 030: reserve every 15-concept combination exactly once across all orders.
--
-- Per-user novelty is enforced from order_photos history in application code.
-- This fingerprint closes the separate global loophole: two concurrent users
-- may not receive the same semantic lineup through differently named variants.

alter table public.user_shoot_orders
  add column if not exists selection_fingerprint text,
  add column if not exists selection_concepts text[];

create unique index if not exists user_shoot_orders_unique_selection_fingerprint
  on public.user_shoot_orders (selection_fingerprint)
  where selection_fingerprint is not null;
