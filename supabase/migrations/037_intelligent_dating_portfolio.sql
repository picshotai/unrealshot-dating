-- 037: free-form portfolio direction and context-led four-frame prompt writing.
--
-- Earlier migrations are already deployed and remain immutable. Their finite
-- recipe columns stay readable for historical orders, while all new dynamic
-- rows store the director's complete free-form intent and semantic fingerprint.

create schema if not exists extensions;
create extension if not exists pg_trgm with schema extensions;
create extension if not exists vector with schema extensions;

alter table public.dating_order_shoots
  drop constraint if exists dating_order_shoots_kind_check,
  drop constraint if exists dating_order_shoots_light_family_check,
  drop constraint if exists dating_order_shoots_dating_signal_check;

alter table public.dating_order_shoots
  add column if not exists planner_attempt_id uuid,
  add column if not exists canonical_summary text,
  add column if not exists novelty_fingerprint text,
  add column if not exists novelty_embedding extensions.vector(768),
  add column if not exists represented_interests jsonb not null default '[]'::jsonb,
  add column if not exists provenance jsonb,
  add column if not exists scene_bible jsonb,
  add column if not exists creative_direction jsonb;

create index if not exists dating_order_shoots_novelty_trgm_idx
  on public.dating_order_shoots
  using gin (novelty_fingerprint extensions.gin_trgm_ops)
  where status in ('reserved', 'generating', 'passed', 'replanning');
create index if not exists dating_order_shoots_novelty_vector_idx
  on public.dating_order_shoots
  using hnsw (novelty_embedding extensions.vector_cosine_ops)
  where status in ('reserved', 'generating', 'passed', 'replanning');

create table if not exists public.dating_portfolio_attempts (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.user_shoot_orders(id) on delete cascade,
  attempt_number smallint not null check (attempt_number > 0),
  status text not null check (status in ('running', 'passed', 'failed_validation', 'api_error')),
  model text not null,
  thinking_level text not null,
  planner_system_version text not null,
  requested_slots smallint not null check (requested_slots between 1 and 30),
  candidate_count smallint not null check (candidate_count between 1 and 40),
  request_snapshot jsonb not null,
  raw_output jsonb,
  validation_errors jsonb not null default '[]'::jsonb,
  reserved_count smallint not null default 0 check (reserved_count >= 0),
  input_tokens integer not null default 0 check (input_tokens >= 0),
  output_tokens integer not null default 0 check (output_tokens >= 0),
  reasoning_tokens integer not null default 0 check (reasoning_tokens >= 0),
  total_tokens integer not null default 0 check (total_tokens >= 0),
  estimated_cost_usd numeric(14, 8) not null default 0 check (estimated_cost_usd >= 0),
  pricing_snapshot jsonb not null default '{}'::jsonb,
  embedding_model text,
  embedding_dimensions smallint,
  embedding_billable_characters integer not null default 0 check (embedding_billable_characters >= 0),
  api_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(order_id, attempt_number)
);

alter table public.dating_order_shoots
  drop constraint if exists dating_order_shoots_planner_attempt_id_fkey;
alter table public.dating_order_shoots
  add constraint dating_order_shoots_planner_attempt_id_fkey
  foreign key (planner_attempt_id) references public.dating_portfolio_attempts(id) on delete set null;

create index if not exists dating_portfolio_attempts_order_idx
  on public.dating_portfolio_attempts(order_id, attempt_number desc);
create unique index if not exists dating_portfolio_attempts_one_running_idx
  on public.dating_portfolio_attempts(order_id)
  where status = 'running';

alter table public.dating_portfolio_attempts enable row level security;
revoke all on table public.dating_portfolio_attempts from anon, authenticated;

alter table public.order_photos
  drop constraint if exists order_photos_framing_check;
alter table public.order_photos
  add column if not exists role_label text,
  add column if not exists moment_summary text,
  add column if not exists is_profile_candidate boolean not null default false;

create or replace function public.reserve_intelligent_dating_shoots(
  p_order_id uuid,
  p_planner_attempt_id uuid,
  p_candidates jsonb,
  p_similarity_threshold real default 0.68
)
returns integer
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
  v_fingerprint text;
  v_idea_key text;
  v_embedding extensions.vector(768);
begin
  perform pg_advisory_xact_lock(1796437012);
  perform set_config('pg_trgm.similarity_threshold', p_similarity_threshold::text, true);
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

    v_fingerprint := nullif(btrim(v_candidate->>'noveltyFingerprint'), '');
    v_idea_key := nullif(btrim(v_candidate->>'ideaKey'), '');
    begin
      v_embedding := (v_candidate->>'embedding')::extensions.vector;
    exception when others then
      v_embedding := null;
    end;
    if v_fingerprint is null or v_idea_key is null or v_embedding is null
       or extensions.vector_dims(v_embedding) <> 768 then continue; end if;

    if exists (
      select 1 from public.dating_order_shoots claimed
       where claimed.status in ('reserved', 'generating', 'passed', 'replanning')
         and (v_replan_id is null or claimed.id <> v_replan_id)
         and (
           claimed.idea_key = v_idea_key
           or (
             claimed.novelty_fingerprint is not null
             and claimed.novelty_fingerprint % v_fingerprint
             and extensions.similarity(claimed.novelty_fingerprint, v_fingerprint) >= p_similarity_threshold
           )
         )
    ) then continue; end if;

    -- One delivery needs broader semantic range than the global registry: two
    -- concepts can be technically different yet still make a 15-shoot pack
    -- feel repetitive. Repeat buyers get an intermediate threshold, while
    -- unrelated customers share only the near-duplicate complete-idea gate.
    if exists (
      select 1
        from public.dating_order_shoots claimed
       where claimed.order_id = p_order_id
         and claimed.status in ('reserved', 'generating', 'passed', 'replanning')
         and claimed.novelty_embedding is not null
         and (v_replan_id is null or claimed.id <> v_replan_id)
         and (
           jsonb_array_length(coalesce(v_candidate->'brief'->'representedInterests', '[]'::jsonb)) = 0
           or jsonb_array_length(claimed.represented_interests) = 0
           or exists (
             select 1
               from jsonb_array_elements_text(v_candidate->'brief'->'representedInterests') candidate_interest
               join jsonb_array_elements_text(claimed.represented_interests) claimed_interest
                 on claimed_interest.value = candidate_interest.value
           )
         )
         and 1 - (claimed.novelty_embedding <=> v_embedding) >= 0.82
    ) then continue; end if;

    if exists (
      select 1
        from public.dating_order_shoots claimed
        join public.user_shoot_orders owner_order on owner_order.id = claimed.order_id
       where owner_order.user_id = v_user_id
         and claimed.order_id <> p_order_id
         and claimed.status in ('reserved', 'generating', 'passed', 'replanning')
         and claimed.novelty_embedding is not null
         and (v_replan_id is null or claimed.id <> v_replan_id)
         and 1 - (claimed.novelty_embedding <=> v_embedding) >= 0.86
    ) then continue; end if;

    if exists (
      select 1 from (
        select 1 - (claimed.novelty_embedding <=> v_embedding) as semantic_similarity
          from public.dating_order_shoots claimed
         where claimed.status in ('reserved', 'generating', 'passed', 'replanning')
           and claimed.novelty_embedding is not null
           and (v_replan_id is null or claimed.id <> v_replan_id)
         order by claimed.novelty_embedding <=> v_embedding
         limit 1
      ) nearest
      where nearest.semantic_similarity >= 0.90
    ) then continue; end if;

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
      v_replan_id := null;
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
    v_slot := null;
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
  return v_reserved;
end;
$$;

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
  select shoots_target, prompt_system_version into v_target, v_prompt_version
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
     where order_id = p_order_id and status = 'passed'
       and (jsonb_typeof(accepted_output->'frames') <> 'array'
            or jsonb_array_length(accepted_output->'frames') <> 4
            or ((v_prompt_version = 'dating-shoot-writer-v6'
                 or exists (select 1 from jsonb_array_elements(accepted_output->'frames') f
                            where f ? 'isAnchor'))
                and (select count(*) from jsonb_array_elements(accepted_output->'frames') f
                      where coalesce((f->>'isAnchor')::boolean, false)) <> 1))
  ) then
    raise exception 'every accepted shoot must contain four frames and exactly one anchor';
  end if;

  insert into public.order_photos (
    order_id, order_shoot_id, shoot_id, frame_index, framing, role_label, moment_summary,
    is_profile_candidate, is_anchor, prompt_template, image_width, image_height,
    status, deterministic_id
  )
  select p_order_id, shoot.id, shoot.id::text, frame.ordinality::int, null,
         coalesce(frame.value->>'roleLabel', frame.value->>'framing'),
         frame.value->>'moment',
         case when frame.value ? 'isProfileCandidate'
           then coalesce((frame.value->>'isProfileCandidate')::boolean, false)
           else frame.value->>'framing' = 'close'
         end,
         case when frame.value ? 'isAnchor'
           then coalesce((frame.value->>'isAnchor')::boolean, false)
           when v_prompt_version in ('dating-scene-v3', 'dating-scene-v4', 'dating-scene-v5')
             then frame.value->>'framing' = 'threeQuarter'
           else frame.value->>'framing' = 'close'
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
  select count(*) into v_allocated from public.order_photos where order_id = p_order_id;
  if v_allocated <> v_target * 4 then raise exception 'dynamic photo allocation is incomplete'; end if;

  update public.user_shoot_orders
     set status = 'developing', pipeline_stage = 'rendering_anchors', updated_at = now()
   where id = p_order_id;
  return v_inserted;
end;
$$;

revoke all on function public.reserve_intelligent_dating_shoots(uuid, uuid, jsonb, real) from public, anon, authenticated;
revoke all on function public.materialize_dynamic_order_photos(uuid) from public, anon, authenticated;
grant execute on function public.reserve_intelligent_dating_shoots(uuid, uuid, jsonb, real) to service_role;
grant execute on function public.materialize_dynamic_order_photos(uuid) to service_role;

-- Existing customer read policy remains valid; expose only delivery-safe fields.
grant select (
  id, order_id, slot_index, concept_family, setting_family, kind, light_family,
  dating_signal, title, status, represented_interests, created_at, updated_at
) on table public.dating_order_shoots to authenticated;
