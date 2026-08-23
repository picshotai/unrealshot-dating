-- 035: keep the wide scene-anchor topology for prompt-system v4.
--
-- Migration 033 is already deployed and remains immutable. Migration 034
-- introduced the three-quarter anchor for v3. The scene-driven expression
-- contract increments the prompt version to v4 without changing that topology.

create or replace function public.materialize_dynamic_order_photos(p_order_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_target integer;
  v_passed integer;
  v_inserted integer;
  v_allocated integer;
  v_prompt_version text;
begin
  select shoots_target, prompt_system_version
    into v_target, v_prompt_version
    from public.user_shoot_orders
   where id = p_order_id and pipeline_mode = 'dynamic'
   for update;
  if v_target is null then raise exception 'dynamic order not found'; end if;

  select count(*) into v_passed
    from public.dating_order_shoots
   where order_id = p_order_id and status = 'passed' and accepted_output is not null;
  if v_passed <> v_target then
    raise exception 'expected % accepted shoots, got %', v_target, v_passed;
  end if;
  if exists (
    select 1 from public.dating_order_shoots
     where order_id = p_order_id
       and status = 'passed'
       and case
         when jsonb_typeof(accepted_output->'frames') = 'array'
           then jsonb_array_length(accepted_output->'frames') <> 4
         else true
       end
  ) then
    raise exception 'every accepted shoot must contain exactly four frames';
  end if;

  insert into public.order_photos (
    order_id, order_shoot_id, shoot_id, frame_index, framing, is_anchor,
    prompt_template, image_width, image_height, status, deterministic_id
  )
  select p_order_id, shoot.id, shoot.id::text, frame.ordinality::int,
         frame.value->>'framing',
         (frame.value->>'framing') = case
           when v_prompt_version in ('dating-scene-v3', 'dating-scene-v4')
             then 'threeQuarter'
           else 'close'
         end,
         frame.value->>'prompt', (frame.value->>'width')::int,
         (frame.value->>'height')::int, 'pending',
         p_order_id::text || '_' || shoot.id::text || '_' || frame.ordinality::text
    from public.dating_order_shoots shoot
    cross join lateral jsonb_array_elements(shoot.accepted_output->'frames')
      with ordinality as frame(value, ordinality)
   where shoot.order_id = p_order_id and shoot.status = 'passed'
  on conflict (order_id, shoot_id, frame_index) do nothing;

  get diagnostics v_inserted = row_count;
  select count(*) into v_allocated
    from public.order_photos
   where order_id = p_order_id;
  if v_allocated <> v_target * 4 then
    raise exception 'dynamic photo allocation is incomplete';
  end if;

  update public.user_shoot_orders
     set status = 'developing', pipeline_stage = 'rendering_anchors', updated_at = now()
   where id = p_order_id;
  return v_inserted;
end;
$$;

revoke all on function public.materialize_dynamic_order_photos(uuid) from public, anon, authenticated;
grant execute on function public.materialize_dynamic_order_photos(uuid) to service_role;
