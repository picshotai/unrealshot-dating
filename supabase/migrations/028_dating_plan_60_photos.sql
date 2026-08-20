-- 028: the pack becomes 60 photos at $39, and the credit grant follows it.
--
-- The delivery is now 15 authored shoots of 4 frames rather than 100 composed
-- photos. That is a smaller number and a better product: a shoot fixes one
-- location, one outfit and one light, and every frame inside it is generated
-- against the first frame's output, which is what stops the room, the clothes
-- and the light changing between photos.
--
-- The grant must equal SHOOT_CREDIT_COST (60) exactly, for the reason 025
-- documents: checkout copies dodo_pricing_plans.credits onto the payment, the
-- webhook adds it to public.credits, and createDatingShootOrder spends
-- SHOOT_CREDIT_COST. A grant below the cost means a paying customer cannot
-- start. The 30 reshoots are still unrelated — they live on the order row and
-- never touch the global balance.
--
-- The "no two alike" claim goes with this. A shoot deliberately repeats its
-- outfit across four frames; that repetition is the feature, and the guarantee
-- it replaces was only ever true of the compositional library.

update public.dodo_pricing_plans
   set price = 39.00,
       credits = 60,
       description = '60 dating photos from 15 shoots. Every shoot a different place, outfit and light. Includes 30 free reshoots.',
       metadata = '{"features": ["15 Shoots", "60 Photos", "4 Frames Per Shoot", "30 Free Reshoots", "ZIP Download"]}'::jsonb
 where is_active = true;

-- New rows default to one full pack rather than 025's 100.
alter table public.dodo_pricing_plans
  alter column credits set default 60;
