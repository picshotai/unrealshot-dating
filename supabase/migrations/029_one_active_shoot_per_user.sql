-- 029: a user may have exactly one shoot in flight, enforced by the database.
--
-- createDatingShootOrder already refuses a second shoot: it selects the user's
-- orders with status in ('queued','developing') and throws before charging, so
-- an ordinary second attempt is turned away and nothing is double-spent.
--
-- That check is a read followed by a write with no lock between them, so two
-- requests arriving together both see zero active orders, both charge, and both
-- dispatch. It is the same shape as the credit bug 023 fixed with spend_credits:
-- a check-then-act that only holds when callers arrive one at a time. A double
-- tap on a phone, or a retried request, is enough.
--
-- A partial unique index makes the second insert fail instead. The route catches
-- the violation and reports it as "a shoot is already running", and the refund
-- path it already has gives the credits back.

-- Collapse any pre-existing duplicates first, keeping the newest. 027 deletes
-- every order, so this is normally a no-op; it matters only if 029 is applied to
-- a database where 027 has not run.
update public.user_shoot_orders o
   set status = 'failed',
       updated_at = now()
 where o.status in ('queued', 'developing')
   and exists (
     select 1
       from public.user_shoot_orders newer
      where newer.user_id = o.user_id
        and newer.status in ('queued', 'developing')
        and newer.created_at > o.created_at
   );

create unique index if not exists user_shoot_orders_one_active_per_user
  on public.user_shoot_orders (user_id)
  where status in ('queued', 'developing');
