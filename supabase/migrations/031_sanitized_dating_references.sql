-- 031: distinguish references that passed through deterministic edge sanitation.
-- Existing samples remain false and must be re-uploaded before another paid run;
-- otherwise the old burned-in phone watermark can keep contaminating outputs.

alter table public.samples
  add column if not exists reference_sanitized boolean not null default false;

