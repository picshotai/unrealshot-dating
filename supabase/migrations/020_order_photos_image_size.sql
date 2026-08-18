-- ==============================================================================
-- 020: per-photo output dimensions on order_photos
-- ==============================================================================
-- Safe to run on a live database, and safe to run more than once: every
-- statement below is idempotent, so re-applying this file is a no-op rather
-- than an error.
--
-- Why: v4 dating prompts author their own output size per shot type — a close
-- portrait and a full-length frame want different pixel budgets — so the size
-- is snapshotted alongside the compiled prompt when the order is allocated.
--
-- Nullable on purpose. Rows allocated before this shipped keep NULL here and
-- fall back to the aspect ratio parsed out of their stored prompt_template,
-- which keeps historical orders, retries and paid regenerations resumable.

alter table public.order_photos
  add column if not exists image_width int,
  add column if not exists image_height int;

comment on column public.order_photos.image_width is
  'Authored output width in pixels. NULL on pre-v4 rows; resolved from prompt_template instead.';

comment on column public.order_photos.image_height is
  'Authored output height in pixels. NULL on pre-v4 rows; resolved from prompt_template instead.';
