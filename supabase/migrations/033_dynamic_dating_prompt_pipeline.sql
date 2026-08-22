-- 033: recipe-first production dating prompts.
-- Existing authored orders remain valid; new dynamic orders snapshot their own
-- scene reservations and prompts before any Fal work starts.

alter table public.user_shoot_orders
  add column if not exists client_request_id uuid,
  add column if not exists shoots_target smallint not null default 15,
  add column if not exists creative_input jsonb,
  add column if not exists pipeline_mode text not null default 'authored',
  add column if not exists pipeline_stage text not null default 'rendering_photos',
  add column if not exists planner_version text,
  add column if not exists prompt_system_version text;

alter table public.user_shoot_orders
  drop constraint if exists user_shoot_orders_shoots_target_check;
alter table public.user_shoot_orders
  add constraint user_shoot_orders_shoots_target_check
  check (shoots_target between 1 and 30);

alter table public.user_shoot_orders
  drop constraint if exists user_shoot_orders_pipeline_mode_check;
alter table public.user_shoot_orders
  add constraint user_shoot_orders_pipeline_mode_check
  check (pipeline_mode in ('authored', 'dynamic'));

alter table public.user_shoot_orders
  drop constraint if exists user_shoot_orders_pipeline_stage_check;
alter table public.user_shoot_orders
  add constraint user_shoot_orders_pipeline_stage_check
  check (pipeline_stage in (
    'planning', 'writing_prompts', 'rendering_anchors', 'rendering_photos',
    'attention_required', 'ready'
  ));

create unique index if not exists user_shoot_orders_client_request_unique
  on public.user_shoot_orders(user_id, client_request_id)
  where client_request_id is not null;

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
     or new.prompt_system_version is distinct from old.prompt_system_version then
    raise exception 'dating order configuration is immutable after creation';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_dating_order_snapshot on public.user_shoot_orders;
create trigger protect_dating_order_snapshot
before update on public.user_shoot_orders
for each row execute function public.protect_dating_order_snapshot();

create table if not exists public.dating_order_shoots (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.user_shoot_orders(id) on delete cascade,
  slot_index smallint not null check (slot_index between 1 and 30),
  idea_key text not null,
  planner_version text not null,
  brief jsonb not null,
  concept_family text not null,
  setting_family text not null,
  kind text not null check (kind in ('portrait', 'home', 'outdoors', 'social', 'activity')),
  light_family text not null check (light_family in ('window', 'open-door', 'overcast', 'flash')),
  dating_signal text not null check (dating_signal in ('warmth', 'competence', 'adventure', 'social-ease')),
  title text,
  accepted_output jsonb,
  accepted_attempt_id uuid,
  status text not null default 'reserved'
    check (status in ('reserved', 'generating', 'passed', 'replanning', 'abandoned')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(order_id, slot_index)
);

-- A reservation blocks the full canonical scene globally. Abandoning a scene
-- that was never delivered releases only that idea, while its attempts remain.
create unique index if not exists dating_order_shoots_active_idea_unique
  on public.dating_order_shoots(idea_key)
  where status in ('reserved', 'generating', 'passed', 'replanning');
create index if not exists dating_order_shoots_order_status_idx
  on public.dating_order_shoots(order_id, status, slot_index);

create table if not exists public.dating_prompt_attempts (
  id uuid primary key default gen_random_uuid(),
  order_shoot_id uuid not null references public.dating_order_shoots(id) on delete cascade,
  attempt_number smallint not null check (attempt_number > 0),
  status text not null check (status in ('running', 'passed', 'failed_validation', 'api_error')),
  model text not null,
  thinking_level text not null,
  prompt_system_version text not null,
  reference_shoot_id text,
  request_snapshot jsonb not null,
  raw_output jsonb,
  validation_errors jsonb not null default '[]'::jsonb,
  scene_density jsonb not null default '[]'::jsonb,
  input_tokens integer not null default 0 check (input_tokens >= 0),
  output_tokens integer not null default 0 check (output_tokens >= 0),
  reasoning_tokens integer not null default 0 check (reasoning_tokens >= 0),
  total_tokens integer not null default 0 check (total_tokens >= 0),
  estimated_cost_usd numeric(14, 8) not null default 0 check (estimated_cost_usd >= 0),
  pricing_snapshot jsonb not null,
  api_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(order_shoot_id, attempt_number)
);

alter table public.dating_order_shoots
  drop constraint if exists dating_order_shoots_accepted_attempt_id_fkey;
alter table public.dating_order_shoots
  add constraint dating_order_shoots_accepted_attempt_id_fkey
  foreign key (accepted_attempt_id) references public.dating_prompt_attempts(id) on delete set null;

create index if not exists dating_prompt_attempts_shoot_idx
  on public.dating_prompt_attempts(order_shoot_id, attempt_number desc);

alter table public.order_photos
  add column if not exists order_shoot_id uuid references public.dating_order_shoots(id) on delete cascade,
  add column if not exists framing text;

update public.order_photos
   set framing = case frame_index
     when 1 then 'close'
     when 2 then 'medium'
     when 3 then 'threeQuarter'
     when 4 then 'expression'
   end
 where framing is null;

alter table public.order_photos
  drop constraint if exists order_photos_framing_check;
alter table public.order_photos
  add constraint order_photos_framing_check
  check (framing is null or framing in ('close', 'medium', 'threeQuarter', 'expression'));

create index if not exists order_photos_order_shoot_id_idx
  on public.order_photos(order_shoot_id, frame_index);

alter table public.dating_order_shoots enable row level security;
alter table public.dating_prompt_attempts enable row level security;

create policy "users select own dating order shoots"
  on public.dating_order_shoots for select
  to authenticated
  using (exists (
    select 1 from public.user_shoot_orders orders
     where orders.id = dating_order_shoots.order_id
       and orders.user_id = (select auth.uid())
  ));

-- Attempts contain internal validator/provider diagnostics. They deliberately
-- have no authenticated policy; service_role owns all production writes/reads.
revoke all on table public.dating_prompt_attempts from anon, authenticated;
revoke all on table public.dating_order_shoots from anon, authenticated;
grant select (
  id, order_id, slot_index, concept_family, setting_family, kind,
  light_family, dating_signal, title, status, created_at, updated_at
) on table public.dating_order_shoots to authenticated;

create or replace function public.reserve_dating_order_shoots(
  p_order_id uuid,
  p_rows jsonb
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_target integer;
  v_existing integer;
  v_slot integer;
  v_max_setting integer;
  v_candidate record;
begin
  -- Portfolio reservations are short and infrequent. Serializing them avoids
  -- two concurrent orders selecting the same free candidate before either
  -- insert becomes visible to the other transaction.
  perform pg_advisory_xact_lock(1796437011);
  select shoots_target into v_target
    from public.user_shoot_orders
   where id = p_order_id
     and pipeline_mode = 'dynamic'
   for update;
  if v_target is null then raise exception 'dynamic order not found'; end if;

  select count(*) into v_existing
    from public.dating_order_shoots
   where order_id = p_order_id and status <> 'abandoned';
  if v_existing = v_target then return v_existing; end if;
  if v_existing <> 0 then raise exception 'partial scene reservation requires repair'; end if;
  if jsonb_array_length(p_rows) < v_target then
    raise exception 'expected at least % scene candidates, got %', v_target, jsonb_array_length(p_rows);
  end if;
  v_max_setting := greatest(1, ceil(v_target::numeric / 8)::integer);

  for v_slot in 1..v_target loop
    select row.* into v_candidate
      from jsonb_to_recordset(p_rows) as row(
        candidate_rank integer, slot_index smallint, idea_key text,
        planner_version text, brief jsonb, concept_family text,
        setting_family text, kind text, light_family text, dating_signal text
      )
     where row.slot_index = v_slot
       and not exists (
         select 1 from public.dating_order_shoots claimed
          where claimed.idea_key = row.idea_key
            and claimed.status in ('reserved', 'generating', 'passed', 'replanning')
       )
       and not exists (
         select 1 from public.dating_order_shoots chosen
          where chosen.order_id = p_order_id
            and chosen.status <> 'abandoned'
            and chosen.concept_family = row.concept_family
       )
       and (
         select count(*) from public.dating_order_shoots chosen
          where chosen.order_id = p_order_id
            and chosen.status <> 'abandoned'
            and chosen.setting_family = row.setting_family
       ) < v_max_setting
     order by row.candidate_rank
     limit 1;

    if v_candidate.idea_key is null then
      raise exception 'candidate pool cannot fill slot %', v_slot;
    end if;
    insert into public.dating_order_shoots (
      order_id, slot_index, idea_key, planner_version, brief,
      concept_family, setting_family, kind, light_family, dating_signal
    ) values (
      p_order_id, v_candidate.slot_index, v_candidate.idea_key,
      v_candidate.planner_version, v_candidate.brief,
      v_candidate.concept_family, v_candidate.setting_family,
      v_candidate.kind, v_candidate.light_family, v_candidate.dating_signal
    );
  end loop;

  update public.user_shoot_orders
     set pipeline_stage = 'writing_prompts', updated_at = now()
   where id = p_order_id;
  return v_target;
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
begin
  select shoots_target into v_target
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
         frame.value->>'framing', (frame.value->>'framing') = 'close',
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

create or replace function public.complete_dating_prompt_attempt(
  p_attempt_id uuid,
  p_attempt_status text,
  p_shoot_status text,
  p_raw_output jsonb,
  p_validation_errors jsonb,
  p_scene_density jsonb,
  p_input_tokens integer,
  p_output_tokens integer,
  p_reasoning_tokens integer,
  p_total_tokens integer,
  p_estimated_cost_usd numeric,
  p_pricing_snapshot jsonb,
  p_api_error text default null,
  p_accepted_output jsonb default null,
  p_title text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_shoot_id uuid;
  v_current_status text;
begin
  if p_attempt_status not in ('passed', 'failed_validation', 'api_error') then
    raise exception 'invalid attempt completion status';
  end if;
  if p_shoot_status not in ('reserved', 'passed', 'replanning') then
    raise exception 'invalid shoot completion status';
  end if;

  select order_shoot_id, status into v_order_shoot_id, v_current_status
    from public.dating_prompt_attempts
   where id = p_attempt_id
   for update;
  if v_order_shoot_id is null then raise exception 'prompt attempt not found'; end if;
  if v_current_status <> 'running' then return; end if;

  update public.dating_prompt_attempts
     set status = p_attempt_status,
         raw_output = p_raw_output,
         validation_errors = coalesce(p_validation_errors, '[]'::jsonb),
         scene_density = coalesce(p_scene_density, '[]'::jsonb),
         input_tokens = coalesce(p_input_tokens, 0),
         output_tokens = coalesce(p_output_tokens, 0),
         reasoning_tokens = coalesce(p_reasoning_tokens, 0),
         total_tokens = coalesce(p_total_tokens, 0),
         estimated_cost_usd = coalesce(p_estimated_cost_usd, 0),
         pricing_snapshot = coalesce(p_pricing_snapshot, pricing_snapshot),
         api_error = p_api_error,
         updated_at = now()
   where id = p_attempt_id;

  update public.dating_order_shoots
     set status = p_shoot_status,
         title = case when p_shoot_status = 'passed' then p_title else title end,
         accepted_output = case when p_shoot_status = 'passed' then p_accepted_output else accepted_output end,
         accepted_attempt_id = case when p_shoot_status = 'passed' then p_attempt_id else accepted_attempt_id end,
         updated_at = now()
   where id = v_order_shoot_id;
end;
$$;

revoke all on function public.reserve_dating_order_shoots(uuid, jsonb) from public, anon, authenticated;
revoke all on function public.materialize_dynamic_order_photos(uuid) from public, anon, authenticated;
revoke all on function public.complete_dating_prompt_attempt(uuid, text, text, jsonb, jsonb, jsonb, integer, integer, integer, integer, numeric, jsonb, text, jsonb, text) from public, anon, authenticated;
grant execute on function public.reserve_dating_order_shoots(uuid, jsonb) to service_role;
grant execute on function public.materialize_dynamic_order_photos(uuid) to service_role;
grant execute on function public.complete_dating_prompt_attempt(uuid, text, text, jsonb, jsonb, jsonb, integer, integer, integer, integer, numeric, jsonb, text, jsonb, text) to service_role;
