-- ==============================================================================
-- 024: remember what the user asked us to leave out
-- ==============================================================================
-- Safe to run on a live database, and safe to run more than once.
--
-- Why: exclusions shape the whole delivery, and regeneration has to honour them
-- too. Without storing them, a man who excluded dogs could redo a photo and be
-- handed a dog, because the replacement is planned fresh at regeneration time
-- and would have nothing to filter on.
--
-- Nullable on purpose. Rows written before this shipped keep NULL, which reads
-- as "nothing excluded" — the same behaviour they had.

alter table public.user_preferences
  add column if not exists exclude_tags text[];

comment on column public.user_preferences.exclude_tags is
  'Content the user asked to keep out: alcohol, dog, bicycle, teamSport. NULL means nothing excluded.';
