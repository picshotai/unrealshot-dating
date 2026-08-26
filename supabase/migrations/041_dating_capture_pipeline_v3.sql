-- 041: lean real-life planner + authored-craft capture writer.
-- Applied migrations 033-040 remain immutable and their RPCs remain readable.

alter table public.user_shoot_orders
  add column if not exists test_mode_snapshot text not null default 'off',
  add column if not exists real_shoots_target smallint not null default 15;

alter table public.user_shoot_orders
  drop constraint if exists user_shoot_orders_test_mode_snapshot_check,
  drop constraint if exists user_shoot_orders_real_shoots_target_check;
alter table public.user_shoot_orders
  add constraint user_shoot_orders_test_mode_snapshot_check
    check (test_mode_snapshot in ('off', 'sample', 'mock')),
  add constraint user_shoot_orders_real_shoots_target_check
    check (real_shoots_target between 0 and 30 and real_shoots_target <= shoots_target);

alter table public.dating_order_shoots
  add column if not exists render_mode text not null default 'real',
  add column if not exists prompt_source text not null default 'gemini',
  add column if not exists contract_version text;

alter table public.dating_order_shoots
  drop constraint if exists dating_order_shoots_render_mode_check,
  drop constraint if exists dating_order_shoots_prompt_source_check;
alter table public.dating_order_shoots
  add constraint dating_order_shoots_render_mode_check check (render_mode in ('real', 'mock')),
  add constraint dating_order_shoots_prompt_source_check check (prompt_source in ('gemini', 'local_mock'));

alter table public.order_photos
  add column if not exists render_mode text not null default 'real';
alter table public.order_photos
  drop constraint if exists order_photos_render_mode_check;
alter table public.order_photos
  add constraint order_photos_render_mode_check check (render_mode in ('real', 'mock'));

create or replace function public.protect_dating_order_snapshot()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.client_request_id is distinct from old.client_request_id
     or new.shoots_target is distinct from old.shoots_target
     or new.photos_target is distinct from old.photos_target
     or new.creative_input is distinct from old.creative_input
     or new.pipeline_mode is distinct from old.pipeline_mode
     or new.planner_version is distinct from old.planner_version
     or new.prompt_system_version is distinct from old.prompt_system_version
     or new.test_mode_snapshot is distinct from old.test_mode_snapshot
     or new.real_shoots_target is distinct from old.real_shoots_target then
    raise exception 'dating order configuration is immutable after creation';
  end if;
  return new;
end;
$$;

create or replace function public.create_reserved_dating_order(
  p_user_id uuid,
  p_client_request_id uuid,
  p_credit_amount integer,
  p_order jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing public.user_shoot_orders%rowtype;
  v_order_id uuid;
  v_balance integer;
  v_test_mode text;
  v_shoots_target smallint;
  v_real_target smallint;
begin
  if p_credit_amount <= 0 then raise exception 'credit amount must be positive'; end if;
  v_test_mode := coalesce(nullif(p_order->>'testMode', ''), 'off');
  v_shoots_target := (p_order->>'shootsTarget')::smallint;
  v_real_target := coalesce((p_order->>'realShootsTarget')::smallint, v_shoots_target);
  if v_test_mode not in ('off', 'sample', 'mock') then raise exception 'invalid dating test mode'; end if;
  if v_real_target < 0 or v_real_target > v_shoots_target then raise exception 'invalid real shoot target'; end if;

  perform pg_advisory_xact_lock(hashtextextended(p_user_id::text, 0));
  select * into v_existing from public.user_shoot_orders
   where user_id = p_user_id and client_request_id = p_client_request_id limit 1;
  if found then
    return jsonb_build_object('result', 'existing', 'orderId', v_existing.id,
      'balance', null, 'reused', true);
  end if;

  select * into v_existing from public.user_shoot_orders
   where user_id = p_user_id and status in ('queued', 'developing')
   order by created_at desc limit 1;
  if found then
    return jsonb_build_object('result', 'order_in_progress', 'orderId', v_existing.id,
      'balance', null, 'reused', true);
  end if;

  update public.credits set credits = credits - p_credit_amount
   where user_id = p_user_id and credits >= p_credit_amount
  returning credits into v_balance;
  if v_balance is null then
    select coalesce(credits, 0) into v_balance from public.credits where user_id = p_user_id;
    return jsonb_build_object('result', 'insufficient', 'orderId', null,
      'balance', coalesce(v_balance, 0), 'reused', false);
  end if;

  insert into public.user_shoot_orders (
    user_id, model_id, preferences_id, status, custom_credits_remaining,
    photos_target, shoots_target, client_request_id, creative_input,
    pipeline_mode, pipeline_stage, planner_version, prompt_system_version,
    credit_state, credit_amount, test_mode_snapshot, real_shoots_target
  ) values (
    p_user_id, (p_order->>'modelId')::bigint,
    nullif(p_order->>'preferencesId', '')::uuid, 'queued',
    (p_order->>'customCreditsRemaining')::integer,
    (p_order->>'photosTarget')::integer, v_shoots_target,
    p_client_request_id, p_order->'creativeInput', 'dynamic', 'planning',
    p_order->>'plannerVersion', p_order->>'promptSystemVersion',
    'reserved', p_credit_amount, v_test_mode, v_real_target
  ) returning id into v_order_id;

  return jsonb_build_object('result', 'created', 'orderId', v_order_id,
    'balance', v_balance, 'reused', false);
end;
$$;

create or replace function public.reserve_intelligent_dating_shoots_v3(
  p_order_id uuid,
  p_planner_attempt_id uuid,
  p_candidates jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_target integer;
  v_active integer;
  v_reserved integer := 0;
  v_slot integer;
  v_candidate jsonb;
  v_brief jsonb;
  v_candidate_id text;
  v_fingerprint text;
  v_idea_key text;
  v_conflict_id uuid;
  v_accepted jsonb := '[]'::jsonb;
  v_rejected jsonb := '[]'::jsonb;
begin
  perform pg_advisory_xact_lock(1796437012);
  select shoots_target into v_target from public.user_shoot_orders
   where id = p_order_id and pipeline_mode = 'dynamic'
     and planner_version = 'dating-portfolio-director-v3'
   for update;
  if v_target is null then raise exception 'v3 dynamic order not found'; end if;

  select count(*) into v_active from public.dating_order_shoots
   where order_id = p_order_id and status <> 'abandoned';

  for v_candidate in select value from jsonb_array_elements(p_candidates)
  loop
    exit when v_active >= v_target;
    v_brief := v_candidate->'brief';
    v_candidate_id := nullif(btrim(v_brief->>'candidateId'), '');
    v_fingerprint := nullif(btrim(v_candidate->>'noveltyFingerprint'), '');
    v_idea_key := nullif(btrim(v_candidate->>'ideaKey'), '');
    v_conflict_id := null;

    if v_candidate_id is null or v_fingerprint is null or v_idea_key is null
       or jsonb_typeof(v_brief) <> 'object' then
      v_rejected := v_rejected || jsonb_build_array(jsonb_build_object(
        'candidateId', coalesce(v_candidate_id, 'unknown-candidate'),
        'fingerprint', v_fingerprint, 'reason', 'invalid_candidate',
        'conflictingShootId', null));
      continue;
    end if;

    select id into v_conflict_id from public.dating_order_shoots
     where status in ('reserved', 'generating', 'passed', 'replanning')
       and idea_key = v_idea_key limit 1;
    if v_conflict_id is not null then
      v_rejected := v_rejected || jsonb_build_array(jsonb_build_object(
        'candidateId', v_candidate_id, 'fingerprint', v_fingerprint,
        'reason', 'exact_complete_idea', 'conflictingShootId', v_conflict_id));
      continue;
    end if;

    select slot into v_slot from generate_series(1, v_target) as slot
     where not exists (
       select 1 from public.dating_order_shoots existing
        where existing.order_id = p_order_id and existing.slot_index = slot
          and existing.status <> 'abandoned')
     order by slot limit 1;
    if v_slot is null then exit; end if;

    insert into public.dating_order_shoots (
      order_id, slot_index, idea_key, planner_version, planner_attempt_id, brief,
      concept_family, setting_family, kind, light_family, dating_signal,
      canonical_summary, novelty_fingerprint, represented_interests,
      provenance, creative_direction, render_mode, prompt_source, contract_version
    ) values (
      p_order_id, v_slot, v_idea_key, v_candidate->>'plannerVersion',
      p_planner_attempt_id, v_brief, v_candidate->>'canonicalSummary',
      v_brief->>'location', 'life-moment', v_brief->>'light',
      v_brief->>'datingValue', v_candidate->>'canonicalSummary', v_fingerprint,
      coalesce(v_brief->'representedInterests', '[]'::jsonb),
      jsonb_build_object(
        'occasion', v_brief->>'occasion',
        'whyHeIsThere', v_brief->>'whyHeIsThere',
        'photographerRelationship', v_brief->>'photographerRelationship',
        'whyPhotoTaken', v_brief->>'whyPhotoTaken'),
      jsonb_build_object(
        'centralMoment', v_brief->>'centralMoment',
        'datingValue', v_brief->>'datingValue',
        'fourFrameOpportunity', v_brief->>'fourFrameOpportunity'),
      'real', 'gemini', 'dating-capture-v3'
    );
    v_active := v_active + 1;
    v_reserved := v_reserved + 1;
    v_accepted := v_accepted || jsonb_build_array(to_jsonb(v_candidate_id));
  end loop;

  update public.user_shoot_orders
     set pipeline_stage = case when v_active = v_target then 'writing_prompts' else 'planning' end,
         updated_at = now()
   where id = p_order_id;

  return jsonb_build_object(
    'acceptedCount', v_reserved,
    'acceptedCandidateIds', v_accepted,
    'rejected', v_rejected,
    'semanticWarnings', '[]'::jsonb);
end;
$$;

create or replace function public.materialize_dynamic_order_photos_v3(p_order_id uuid)
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
begin
  select shoots_target into v_target from public.user_shoot_orders
   where id = p_order_id and pipeline_mode = 'dynamic'
     and prompt_system_version = 'dating-shoot-writer-v7'
   for update;
  if v_target is null then raise exception 'v3 dynamic order not found'; end if;

  select count(*) into v_passed from public.dating_order_shoots
   where order_id = p_order_id and status = 'passed' and accepted_output is not null;
  if v_passed <> v_target then raise exception 'expected % completed shoots, got %', v_target, v_passed; end if;
  if exists (
    select 1 from public.dating_order_shoots
     where order_id = p_order_id and status = 'passed'
       and (jsonb_typeof(accepted_output->'frames') <> 'array'
         or jsonb_array_length(accepted_output->'frames') <> 4
         or (select count(*) from jsonb_array_elements(accepted_output->'frames') frame
              where coalesce((frame->>'isAnchor')::boolean, false)) <> 1)
  ) then raise exception 'every completed shoot must contain four frames and one anchor'; end if;

  insert into public.order_photos (
    order_id, order_shoot_id, shoot_id, frame_index, framing, role_label,
    moment_summary, is_profile_candidate, is_anchor, prompt_template,
    image_width, image_height, status, deterministic_id, render_mode
  )
  select p_order_id, shoot.id, shoot.id::text, frame.ordinality::int,
         frame.value->>'cameraDistance', frame.value->>'roleLabel',
         frame.value->>'moment', coalesce((frame.value->>'isProfileCandidate')::boolean, false),
         coalesce((frame.value->>'isAnchor')::boolean, false), frame.value->>'prompt',
         (frame.value->>'width')::int, (frame.value->>'height')::int, 'pending',
         p_order_id::text || '_' || shoot.id::text || '_' || frame.ordinality::text,
         shoot.render_mode
    from public.dating_order_shoots shoot
    cross join lateral jsonb_array_elements(shoot.accepted_output->'frames')
      with ordinality as frame(value, ordinality)
   where shoot.order_id = p_order_id and shoot.status = 'passed'
  on conflict (order_id, shoot_id, frame_index) do nothing;

  get diagnostics v_inserted = row_count;
  select count(*) into v_allocated from public.order_photos where order_id = p_order_id;
  if v_allocated <> v_target * 4 then raise exception 'dynamic photo allocation is incomplete'; end if;

  update public.user_shoot_orders
     set status = 'developing', pipeline_stage = 'rendering_anchors', updated_at = now()
   where id = p_order_id;
  return v_inserted;
end;
$$;

-- A refunded pre-v7 order cannot be resumed into a mixed prompt contract.
create or replace function public.reserve_dating_order_retry(p_order_id uuid, p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.user_shoot_orders%rowtype;
  v_balance integer;
  v_stage text;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_user_id::text, 0));
  select * into v_order from public.user_shoot_orders
   where id = p_order_id and user_id = p_user_id for update;
  if not found then raise exception 'dating order not found'; end if;
  if v_order.prompt_system_version is distinct from 'dating-shoot-writer-v7' then
    return jsonb_build_object('result', 'legacy_incompatible', 'balance', null);
  end if;

  -- A second browser request arriving after the first transaction has already
  -- re-queued the order must reuse that run instead of dispatching a new root.
  if v_order.status in ('queued', 'developing') and v_order.credit_state = 'reserved' then
    return jsonb_build_object(
      'result', 'already_running',
      'balance', null,
      'stage', v_order.pipeline_stage,
      'triggerRunId', v_order.trigger_run_id
    );
  end if;

  if v_order.credit_state = 'released' then
    update public.credits set credits = credits - v_order.credit_amount
     where user_id = p_user_id and credits >= v_order.credit_amount
    returning credits into v_balance;
    if v_balance is null then
      select coalesce(credits, 0) into v_balance from public.credits where user_id = p_user_id;
      return jsonb_build_object('result', 'insufficient', 'balance', coalesce(v_balance, 0));
    end if;
    update public.user_shoot_orders set credit_state = 'reserved' where id = p_order_id;
  elsif v_order.credit_state in ('reserved', 'legacy') then
    select coalesce(credits, 0) into v_balance from public.credits where user_id = p_user_id;
  else
    return jsonb_build_object('result', 'not_retryable', 'balance', null);
  end if;

  v_stage := case
    when exists (select 1 from public.order_photos where order_id = p_order_id) then 'rendering_photos'
    when (select count(*) from public.dating_order_shoots
           where order_id = p_order_id and status <> 'abandoned') < v_order.shoots_target then 'planning'
    else 'writing_prompts'
  end;
  update public.user_shoot_orders
     set status = 'queued', pipeline_stage = v_stage, provider_blocked = false,
         failure_code = null, failure_phase = null, failure_message = null,
         failed_at = null, next_retry_at = null, provider_retry_count = 0,
         updated_at = now()
   where id = p_order_id;
  return jsonb_build_object('result', 'reserved', 'balance', coalesce(v_balance, 0), 'stage', v_stage);
end;
$$;

revoke all on function public.reserve_intelligent_dating_shoots_v3(uuid, uuid, jsonb)
  from public, anon, authenticated;
revoke all on function public.materialize_dynamic_order_photos_v3(uuid)
  from public, anon, authenticated;
grant execute on function public.reserve_intelligent_dating_shoots_v3(uuid, uuid, jsonb)
  to service_role;
grant execute on function public.materialize_dynamic_order_photos_v3(uuid)
  to service_role;
