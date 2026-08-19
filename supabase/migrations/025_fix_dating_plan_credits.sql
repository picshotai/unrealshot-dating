-- 025: the $59 pack must grant enough credits to actually run a shoot.
--
-- 019 seeded the plan with credits = 30. That 30 was written to describe the
-- *regeneration* allowance (see the seeded description string), but the value is
-- consumed as the shoot wallet grant: checkout copies it onto dodo_payments,
-- and the webhook adds it to public.credits. A shoot costs SHOOT_CREDIT_COST
-- (100), so every paying customer landed on
-- "This shoot costs 100 credits and you have 30." and could not start.
--
-- The 30 reshoots are unrelated to this number. They are set on the order row
-- at creation (user_shoot_orders.custom_credits_remaining, default 30) and never
-- draw on the global balance, which is why the correct grant is 100 and not 130.
--
-- 019's seed uses `on conflict do nothing`, so re-running it cannot repair an
-- existing row. This migration updates in place.

-- Correct any active dating plan, not just the seeded product id, so a manually
-- created row is fixed too.
update public.dodo_pricing_plans
   set credits = 100,
       description = '100 dating photos, no two alike. Includes 30 free reshoots.'
 where credits < 100;

-- New rows should default to a full pack rather than the old regeneration count.
alter table public.dodo_pricing_plans
  alter column credits set default 100;
