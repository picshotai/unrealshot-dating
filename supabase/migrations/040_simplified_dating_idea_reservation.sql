-- 040: make semantic novelty advisory so a valid portfolio cannot deadlock.
-- Migration 037 remains immutable; the v1 RPC stays available during rollout.

alter table public.dating_portfolio_attempts
  add column if not exists reservation_report jsonb not null default
    '{"acceptedCount":0,"acceptedCandidateIds":[],"rejected":[],"semanticWarnings":[]}'::jsonb;

create or replace function public.reserve_intelligent_dating_shoots_v2(
  p_order_id uuid,
  p_planner_attempt_id uuid,
  p_candidates jsonb,
  p_within_order_threshold real default 0.92
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_target integer;
  v_user_id uuid;
  v_active integer;
  v_reserved integer := 0;
  v_slot integer;
  v_replan_id uuid;
  v_candidate jsonb;
  v_candidate_id text;
  v_fingerprint text;
  v_idea_key text;
  v_embedding extensions.vector(768);
  v_conflict_id uuid;
  v_similarity real;
  v_accepted jsonb := '[]'::jsonb;
  v_rejected jsonb := '[]'::jsonb;
  v_warnings jsonb := '[]'::jsonb;
begin
  if p_within_order_threshold < 0.90 or p_within_order_threshold > 1 then
    raise exception 'within-order threshold must be between 0.90 and 1';
  end if;

  perform pg_advisory_xact_lock(1796437012);
  select shoots_target, user_id into v_target, v_user_id
    from public.user_shoot_orders
   where id = p_order_id and pipeline_mode = 'dynamic'
   for update;
  if v_target is null then raise exception 'dynamic order not found'; end if;

  select count(*) into v_active
    from public.dating_order_shoots
   where order_id = p_order_id and status <> 'abandoned';

  for v_candidate in select value from jsonb_array_elements(p_candidates)
  loop
    exit when v_active >= v_target and not exists (
      select 1 from public.dating_order_shoots
       where order_id = p_order_id and status = 'replanning'
    );

    v_slot := null;
    v_replan_id := null;
    v_conflict_id := null;
    v_similarity := null;
    v_candidate_id := coalesce(
      nullif(btrim(v_candidate->'brief'->>'candidateId'), ''),
      nullif(btrim(v_candidate->>'ideaKey'), ''),
      'unknown-candidate'
    );
    v_fingerprint := nullif(btrim(v_candidate->>'noveltyFingerprint'), '');
    v_idea_key := nullif(btrim(v_candidate->>'ideaKey'), '');
    begin
      v_embedding := (v_candidate->>'embedding')::extensions.vector;
    exception when others then
      v_embedding := null;
    end;

    if v_fingerprint is null or v_idea_key is null or v_embedding is null
       or extensions.vector_dims(v_embedding) <> 768 then
      v_rejected := v_rejected || jsonb_build_array(jsonb_build_object(
        'candidateId', v_candidate_id,
        'fingerprint', v_fingerprint,
        'reason', 'invalid_candidate',
        'conflictingShootId', null
      ));
      continue;
    end if;

    select id into v_conflict_id
      from public.dating_order_shoots
     where status in ('reserved', 'generating', 'passed', 'replanning')
       and idea_key = v_idea_key
     limit 1;
    if v_conflict_id is not null then
      v_rejected := v_rejected || jsonb_build_array(jsonb_build_object(
        'candidateId', v_candidate_id,
        'fingerprint', v_fingerprint,
        'reason', 'exact_complete_idea',
        'conflictingShootId', v_conflict_id
      ));
      continue;
    end if;

    select id, extensions.similarity(novelty_fingerprint, v_fingerprint)
      into v_conflict_id, v_similarity
      from public.dating_order_shoots
     where order_id = p_order_id
       and status in ('reserved', 'generating', 'passed', 'replanning')
       and novelty_fingerprint is not null
       and extensions.similarity(novelty_fingerprint, v_fingerprint) >= p_within_order_threshold
     order by extensions.similarity(novelty_fingerprint, v_fingerprint) desc
     limit 1;
    if v_conflict_id is not null then
      v_rejected := v_rejected || jsonb_build_array(jsonb_build_object(
        'candidateId', v_candidate_id,
        'fingerprint', v_fingerprint,
        'reason', 'within_order_near_duplicate',
        'conflictingShootId', v_conflict_id,
        'similarity', v_similarity
      ));
      continue;
    end if;

    -- Embedding similarity is diagnostic feedback only. It never rejects.
    select id, 1 - (novelty_embedding <=> v_embedding)
      into v_conflict_id, v_similarity
      from public.dating_order_shoots
     where order_id = p_order_id
       and status in ('reserved', 'generating', 'passed', 'replanning')
       and novelty_embedding is not null
     order by novelty_embedding <=> v_embedding
     limit 1;
    if v_conflict_id is not null and v_similarity >= 0.82 then
      v_warnings := v_warnings || jsonb_build_array(jsonb_build_object(
        'candidateId', v_candidate_id, 'scope', 'same_order',
        'nearestShootId', v_conflict_id, 'similarity', v_similarity
      ));
    end if;

    v_conflict_id := null;
    v_similarity := null;
    select claimed.id, 1 - (claimed.novelty_embedding <=> v_embedding)
      into v_conflict_id, v_similarity
      from public.dating_order_shoots claimed
      join public.user_shoot_orders owner_order on owner_order.id = claimed.order_id
     where owner_order.user_id = v_user_id
       and claimed.order_id <> p_order_id
       and claimed.status in ('reserved', 'generating', 'passed', 'replanning')
       and claimed.novelty_embedding is not null
     order by claimed.novelty_embedding <=> v_embedding
     limit 1;
    if v_conflict_id is not null and v_similarity >= 0.86 then
      v_warnings := v_warnings || jsonb_build_array(jsonb_build_object(
        'candidateId', v_candidate_id, 'scope', 'repeat_customer',
        'nearestShootId', v_conflict_id, 'similarity', v_similarity
      ));
    end if;

    v_conflict_id := null;
    v_similarity := null;
    select claimed.id, 1 - (claimed.novelty_embedding <=> v_embedding)
      into v_conflict_id, v_similarity
      from public.dating_order_shoots claimed
      join public.user_shoot_orders owner_order on owner_order.id = claimed.order_id
     where owner_order.user_id <> v_user_id
       and claimed.status in ('reserved', 'generating', 'passed', 'replanning')
       and claimed.novelty_embedding is not null
     order by claimed.novelty_embedding <=> v_embedding
     limit 1;
    if v_conflict_id is not null and v_similarity >= 0.90 then
      v_warnings := v_warnings || jsonb_build_array(jsonb_build_object(
        'candidateId', v_candidate_id, 'scope', 'global',
        'nearestShootId', v_conflict_id, 'similarity', v_similarity
      ));
    end if;

    select id, slot_index into v_replan_id, v_slot
      from public.dating_order_shoots
     where order_id = p_order_id and status = 'replanning'
     order by slot_index
     limit 1
     for update;
    if v_replan_id is null then
      select slot into v_slot
        from generate_series(1, v_target) as slot
       where not exists (
         select 1 from public.dating_order_shoots existing
          where existing.order_id = p_order_id and existing.slot_index = slot
       )
       order by slot
       limit 1;
    end if;
    if v_slot is null then exit; end if;

    if v_replan_id is not null then
      update public.dating_order_shoots
         set idea_key = v_idea_key,
             planner_version = v_candidate->>'plannerVersion',
             planner_attempt_id = p_planner_attempt_id,
             brief = v_candidate->'brief',
             concept_family = v_candidate->>'canonicalSummary',
             setting_family = v_candidate->'brief'->'sceneBible'->>'location',
             kind = 'life-moment',
             light_family = v_candidate->'brief'->'sceneBible'->>'light',
             dating_signal = v_candidate->'brief'->'creativeDirection'->>'datingValue',
             canonical_summary = v_candidate->>'canonicalSummary',
             novelty_fingerprint = v_fingerprint,
             novelty_embedding = v_embedding,
             represented_interests = coalesce(v_candidate->'brief'->'representedInterests', '[]'::jsonb),
             provenance = v_candidate->'brief'->'provenance',
             scene_bible = v_candidate->'brief'->'sceneBible',
             creative_direction = v_candidate->'brief'->'creativeDirection',
             title = null,
             accepted_output = null,
             accepted_attempt_id = null,
             status = 'reserved',
             updated_at = now()
       where id = v_replan_id;
    else
      insert into public.dating_order_shoots (
        order_id, slot_index, idea_key, planner_version, planner_attempt_id, brief,
        concept_family, setting_family, kind, light_family, dating_signal,
        canonical_summary, novelty_fingerprint, represented_interests,
        novelty_embedding, provenance, scene_bible, creative_direction
      ) values (
        p_order_id, v_slot, v_idea_key, v_candidate->>'plannerVersion',
        p_planner_attempt_id, v_candidate->'brief', v_candidate->>'canonicalSummary',
        v_candidate->'brief'->'sceneBible'->>'location', 'life-moment',
        v_candidate->'brief'->'sceneBible'->>'light',
        v_candidate->'brief'->'creativeDirection'->>'datingValue',
        v_candidate->>'canonicalSummary', v_fingerprint,
        coalesce(v_candidate->'brief'->'representedInterests', '[]'::jsonb),
        v_embedding, v_candidate->'brief'->'provenance', v_candidate->'brief'->'sceneBible',
        v_candidate->'brief'->'creativeDirection'
      );
      v_active := v_active + 1;
    end if;
    v_reserved := v_reserved + 1;
    v_accepted := v_accepted || jsonb_build_array(to_jsonb(v_candidate_id));
  end loop;

  update public.user_shoot_orders
     set pipeline_stage = case
       when (select count(*) from public.dating_order_shoots
              where order_id = p_order_id and status <> 'abandoned') = v_target
         and not exists (select 1 from public.dating_order_shoots
                          where order_id = p_order_id and status = 'replanning')
       then 'writing_prompts'
       else 'planning'
     end,
     updated_at = now()
   where id = p_order_id;

  return jsonb_build_object(
    'acceptedCount', v_reserved,
    'acceptedCandidateIds', v_accepted,
    'rejected', v_rejected,
    'semanticWarnings', v_warnings
  );
end;
$$;

-- Retry must resume the persisted stage. Ten reserved ideas are still planning,
-- not prompt writing, when an order targets fifteen.
create or replace function public.reserve_dating_order_retry(
  p_order_id uuid,
  p_user_id uuid
)
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

  if v_order.credit_state = 'released' then
    update public.credits
       set credits = credits - v_order.credit_amount
     where user_id = p_user_id and credits >= v_order.credit_amount
    returning credits into v_balance;
    if v_balance is null then
      select coalesce(credits, 0) into v_balance
        from public.credits where user_id = p_user_id;
      return jsonb_build_object('result', 'insufficient', 'balance', coalesce(v_balance, 0));
    end if;
    update public.user_shoot_orders set credit_state = 'reserved' where id = p_order_id;
  elsif v_order.credit_state in ('reserved', 'legacy') then
    select coalesce(credits, 0) into v_balance from public.credits where user_id = p_user_id;
  else
    return jsonb_build_object('result', 'not_retryable', 'balance', null);
  end if;

  v_stage := case
    when exists (select 1 from public.order_photos where order_id = p_order_id)
      then 'rendering_photos'
    when v_order.pipeline_mode = 'dynamic' and (
      (select count(*) from public.dating_order_shoots
        where order_id = p_order_id and status <> 'abandoned') < v_order.shoots_target
      or exists (select 1 from public.dating_order_shoots
                  where order_id = p_order_id and status = 'replanning')
    ) then 'planning'
    when v_order.pipeline_mode = 'dynamic' then 'writing_prompts'
    else 'rendering_photos'
  end;

  update public.user_shoot_orders
     set status = 'queued', pipeline_stage = v_stage, provider_blocked = false,
         failure_code = null, failure_phase = null, failure_message = null,
         failed_at = null, next_retry_at = null, provider_retry_count = 0,
         updated_at = now()
   where id = p_order_id;

  return jsonb_build_object(
    'result', 'reserved',
    'balance', coalesce(v_balance, 0),
    'stage', v_stage
  );
end;
$$;

revoke all on function public.reserve_intelligent_dating_shoots_v2(uuid, uuid, jsonb, real)
  from public, anon, authenticated;
grant execute on function public.reserve_intelligent_dating_shoots_v2(uuid, uuid, jsonb, real)
  to service_role;
revoke all on function public.reserve_dating_order_retry(uuid, uuid)
  from public, anon, authenticated;
grant execute on function public.reserve_dating_order_retry(uuid, uuid)
  to service_role;
