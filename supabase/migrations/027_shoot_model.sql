-- 027: order_photos moves from (bucket, slot) to (shoot_id, frame_index).
--
-- The compositional library is replaced by authored shoots: one location, one
-- outfit, one light, four frames of it. `bucket` named one of five archetypes
-- and `slot` indexed into a per-bucket prompt table; neither exists any more.
--
-- Clean slate — there are no orders to preserve, so the columns are dropped
-- rather than carried alongside the new ones.
--
-- Two latent bugs disappear with them:
--   * the regenerate route wrote a replacement's slot while the child wrote the
--     original one back from its payload index, leaving a new prompt on an old
--     slot and corrupting the "already used" set for the next reshoot;
--   * 018 backfilled a 1-based deterministic_id while deterministic-id.ts
--     computed a 0-based one, so any backfilled row had an id the code could
--     never recompute.
-- Regenerating a frame in place, with shoot identity fixed, makes both
-- impossible to reintroduce.

-- 026 dropped CHECK constraints by definition but deliberately left this one.
alter table public.order_photos
  drop constraint if exists order_photos_order_id_bucket_slot_key;

do $$
declare
  c record;
begin
  for c in
    select con.conname
      from pg_constraint con
     where con.conrelid = 'public.order_photos'::regclass
       and con.contype = 'c'
       and (pg_get_constraintdef(con.oid) ilike '%slot%'
            or pg_get_constraintdef(con.oid) ilike '%bucket%')
  loop
    execute format('alter table public.order_photos drop constraint %I', c.conname);
  end loop;
end $$;

alter table public.order_photos
  add column if not exists shoot_id text,
  add column if not exists frame_index int,
  add column if not exists is_anchor boolean not null default false,
  -- The frame whose output was passed as this frame's scene reference. Stored
  -- rather than recomputed so a reshoot reuses the same anchor, and so
  -- reshooting an anchor cannot silently invalidate its siblings.
  add column if not exists anchor_photo_id uuid references public.order_photos(id);

-- Clean slate: nothing worth migrating, and the new columns are NOT NULL.
delete from public.order_photos;
delete from public.user_shoot_orders;

alter table public.order_photos
  alter column shoot_id set not null,
  alter column frame_index set not null;

alter table public.order_photos
  drop column if exists bucket,
  drop column if exists slot;

alter table public.order_photos
  add constraint order_photos_frame_index_check
  check (frame_index >= 1 and frame_index <= 4);

alter table public.order_photos
  add constraint order_photos_order_shoot_frame_key
  unique (order_id, shoot_id, frame_index);

create index if not exists idx_order_photos_order_shoot
  on public.order_photos(order_id, shoot_id, frame_index);

-- A delivery is 15 shoots of 4.
alter table public.user_shoot_orders
  alter column photos_target set default 60;

-- Dead since the library moved into code: nothing reads or writes it, and it
-- still carries a stale slot check of its own.
drop table if exists public.prompt_library;
