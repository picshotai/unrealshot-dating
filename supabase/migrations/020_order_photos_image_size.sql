-- ==============================================================================
-- 020: per-photo output dimensions
-- ==============================================================================
-- v4 dating prompts author their own output size per shot type (a close portrait
-- and a full-length frame want different pixel budgets), so the size is
-- snapshotted alongside the compiled prompt at allocation time.
--
-- Nullable on purpose: rows allocated before this shipped fall back to the
-- aspect ratio parsed out of their stored prompt text, which keeps historical
-- orders, retries and paid regenerations resumable.

alter table public.order_photos
  add column if not exists image_width int,
  add column if not exists image_height int;
