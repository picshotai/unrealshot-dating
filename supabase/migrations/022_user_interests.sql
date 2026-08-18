-- ==============================================================================
-- 022: store what the user actually does
-- ==============================================================================
-- Safe to run on a live database, and safe to run more than once: every
-- statement is idempotent, so re-applying this file is a no-op rather than an
-- error.
--
-- Why: the shoot screen no longer asks for a "vibe" and a "style". It asks what
-- he does and how he dresses, and the delivery weighting is derived from that.
-- The derived dominant vibe and style still go in the existing NOT NULL columns;
-- this keeps the raw answers so the weighting can be recomputed or tuned later.
--
-- Nullable on purpose. Rows written before this shipped keep NULL and fall back
-- to an even weighting, which produces a perfectly good delivery.

alter table public.user_preferences
  add column if not exists interests text[];

comment on column public.user_preferences.interests is
  'Interest chip ids tapped on the shoot screen. NULL on rows predating the change; selection falls back to an even vibe weighting.';
