-- ==============================================================================
-- 023: atomic credit spend
-- ==============================================================================
-- Safe to run on a live database, and safe to run more than once.
--
-- Why: the existing deductCredits() in lib/credits.ts reads the balance, then
-- writes balance - amount as a separate statement. Two requests arriving
-- together both read the same balance, both pass the check and both write, so a
-- user with 100 credits can start two 100-credit shoots. Ordinary product code
-- can tolerate that; a path that spends GPU money cannot.
--
-- These do the check and the decrement in one statement, so the row lock
-- serialises concurrent callers. spend_credits returns the new balance, or NULL
-- when the balance was insufficient — the caller treats NULL as a refusal
-- rather than an error.

create or replace function public.spend_credits(
  p_user_id uuid,
  p_amount int
)
returns int
language sql
security definer
set search_path = public
as $$
  update public.credits
     set credits = credits - p_amount
   where user_id = p_user_id
     and credits >= p_amount
  returning credits;
$$;

-- Refund path for a start that failed after the spend. Creates the row if the
-- user somehow has none, so a refund can never silently vanish.
create or replace function public.refund_credits(
  p_user_id uuid,
  p_amount int
)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_balance int;
begin
  insert into public.credits (user_id, credits)
  values (p_user_id, p_amount)
  on conflict (user_id)
  do update set credits = public.credits.credits + p_amount
  returning credits into v_balance;

  return v_balance;
end;
$$;

revoke all on function public.spend_credits(uuid, int) from public, anon, authenticated;
revoke all on function public.refund_credits(uuid, int) from public, anon, authenticated;
grant execute on function public.spend_credits(uuid, int) to service_role;
grant execute on function public.refund_credits(uuid, int) to service_role;

comment on function public.spend_credits(uuid, int) is
  'Atomically deducts credits, returning the new balance or NULL when the balance was insufficient. Service role only.';
comment on function public.refund_credits(uuid, int) is
  'Returns credits after a failed spend. Service role only.';
