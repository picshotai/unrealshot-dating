-- 042: expose the delivery-safe V3 shoot metadata added by migration 041.
--
-- Migration 033 deliberately uses column-level grants for this table. Adding
-- columns in 041 did not automatically add them to the authenticated grant,
-- so selecting the V3 metadata failed even though the ownership RLS policy
-- allowed the row. Internal briefs and prompts remain service-role-only.

grant select (
  render_mode,
  prompt_source,
  contract_version
) on table public.dating_order_shoots to authenticated;
