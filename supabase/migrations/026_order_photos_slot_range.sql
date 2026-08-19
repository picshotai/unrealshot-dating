-- 026: allow the full 26-slot library range on delivered photos.
--
-- order_photos.slot was constrained to 1..20 when a bucket had exactly 20 shots
-- and a delivery used all of them. The library has since grown to 26 slots per
-- bucket (SLOTS_PER_BUCKET) and a delivery now *selects* 20 of those 26 — which
-- is what gives two customers different sets.
--
-- The constraint was never widened to match. Consequences:
--   * createDatingShootOrder inserts 100 rows in one statement, so a single
--     planned slot above 20 rejects the whole delivery;
--   * planReplacement draws from all 26 slots, so a reshoot could write a slot
--     the check refuses. That UPDATE's error was discarded, leaving the row
--     'completed' — the child then skipped the GPU and the user lost a reshoot
--     for nothing.
--
-- Drops by definition rather than by name: this database may have been altered
-- out of band, so the constraint is not guaranteed to still be called
-- order_photos_slot_check.

do $$
declare
  c record;
begin
  for c in
    select con.conname
      from pg_constraint con
     where con.conrelid = 'public.order_photos'::regclass
       and con.contype = 'c'
       and pg_get_constraintdef(con.oid) ilike '%slot%'
  loop
    execute format('alter table public.order_photos drop constraint %I', c.conname);
  end loop;

  execute 'alter table public.order_photos
             add constraint order_photos_slot_check
             check (slot >= 1 and slot <= 26)';
end $$;

-- public.prompt_library carries the same stale 1..20 check. Nothing reads or
-- writes that table — the prompt library lives in code (lib/dating/prompt-library.ts)
-- and each order snapshots its compiled prompt onto order_photos — so it is left
-- alone here rather than quietly widened to imply it is still in use.
