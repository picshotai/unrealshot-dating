-- 039: transactional dating-order credit lifecycle and provider diagnostics.
-- Earlier migrations are deployed and intentionally remain unchanged.

alter table public.user_shoot_orders
  add column if not exists credit_state text not null default 'legacy',
  add column if not exists credit_amount integer not null default 0,
  add column if not exists failure_code text,
  add column if not exists failure_phase text,
  add column if not exists failure_message text,
  add column if not exists failed_at timestamptz,
  add column if not exists next_retry_at timestamptz,
  add column if not exists provider_retry_count smallint not null default 0;

alter table public.user_shoot_orders
  drop constraint if exists user_shoot_orders_credit_state_check,
  drop constraint if exists user_shoot_orders_credit_amount_check,
  drop constraint if exists user_shoot_orders_provider_retry_count_check,
  drop constraint if exists user_shoot_orders_pipeline_stage_check;
alter table public.user_shoot_orders
  add constraint user_shoot_orders_credit_state_check
    check (credit_state in ('legacy', 'reserved', 'captured', 'released')),
  add constraint user_shoot_orders_credit_amount_check check (credit_amount >= 0),
  add constraint user_shoot_orders_provider_retry_count_check check (provider_retry_count >= 0),
  add constraint user_shoot_orders_pipeline_stage_check
    check (pipeline_stage in (
      'planning', 'writing_prompts', 'rendering_anchors', 'rendering_photos',
      'attention_required', 'failed', 'ready'
    ));

alter table public.dating_portfolio_attempts
  add column if not exists provider_phase text,
  add column if not exists provider_http_status integer,
  add column if not exists provider_interaction_id text,
  add column if not exists provider_request_version text;

alter table public.dating_prompt_attempts
  add column if not exists provider_phase text,
  add column if not exists provider_http_status integer,
  add column if not exists provider_interaction_id text,
  add column if not exists provider_request_version text;

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
begin
  if p_credit_amount <= 0 then
    raise exception 'credit amount must be positive';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(p_user_id::text, 0));

  select * into v_existing
    from public.user_shoot_orders
   where user_id = p_user_id and client_request_id = p_client_request_id
   limit 1;
  if found then
    return jsonb_build_object(
      'result', 'existing', 'orderId', v_existing.id,
      'balance', null, 'reused', true
    );
  end if;

  select * into v_existing
    from public.user_shoot_orders
   where user_id = p_user_id and status in ('queued', 'developing')
   order by created_at desc
   limit 1;
  if found then
    return jsonb_build_object(
      'result', 'order_in_progress', 'orderId', v_existing.id,
      'balance', null, 'reused', true
    );
  end if;

  update public.credits
     set credits = credits - p_credit_amount
   where user_id = p_user_id and credits >= p_credit_amount
  returning credits into v_balance;
  if v_balance is null then
    select coalesce(credits, 0) into v_balance
      from public.credits where user_id = p_user_id;
    return jsonb_build_object(
      'result', 'insufficient', 'orderId', null,
      'balance', coalesce(v_balance, 0), 'reused', false
    );
  end if;

  insert into public.user_shoot_orders (
    user_id, model_id, preferences_id, status, custom_credits_remaining,
    photos_target, shoots_target, client_request_id, creative_input,
    pipeline_mode, pipeline_stage, planner_version, prompt_system_version,
    credit_state, credit_amount
  ) values (
    p_user_id,
    (p_order->>'modelId')::bigint,
    nullif(p_order->>'preferencesId', '')::uuid,
    'queued',
    (p_order->>'customCreditsRemaining')::integer,
    (p_order->>'photosTarget')::integer,
    (p_order->>'shootsTarget')::smallint,
    p_client_request_id,
    p_order->'creativeInput',
    'dynamic', 'planning',
    p_order->>'plannerVersion',
    p_order->>'promptSystemVersion',
    'reserved', p_credit_amount
  ) returning id into v_order_id;

  return jsonb_build_object(
    'result', 'created', 'orderId', v_order_id,
    'balance', v_balance, 'reused', false
  );
end;
$$;

create or replace function public.release_dating_order_credit(
  p_order_id uuid,
  p_failure_code text,
  p_failure_phase text,
  p_failure_message text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.user_shoot_orders%rowtype;
  v_balance integer;
  v_released boolean := false;
begin
  select * into v_order from public.user_shoot_orders
   where id = p_order_id for update;
  if not found then raise exception 'dating order not found'; end if;

  -- A late child/error callback can arrive after the delivery transaction.
  -- Captured/Ready is terminal and must never be downgraded or credited back.
  if v_order.credit_state = 'captured' or v_order.status = 'ready' then
    select coalesce(credits, 0) into v_balance
      from public.credits where user_id = v_order.user_id;
    return jsonb_build_object(
      'released', false, 'creditState', v_order.credit_state,
      'balance', coalesce(v_balance, 0)
    );
  end if;

  if v_order.credit_state = 'reserved' then
    insert into public.credits(user_id, credits)
    values (v_order.user_id, v_order.credit_amount)
    on conflict (user_id) do update
      set credits = public.credits.credits + excluded.credits
    returning credits into v_balance;
    v_released := true;
  else
    select coalesce(credits, 0) into v_balance
      from public.credits where user_id = v_order.user_id;
  end if;

  update public.user_shoot_orders
     set credit_state = case when credit_state = 'reserved' then 'released' else credit_state end,
         status = 'failed', pipeline_stage = 'failed', provider_blocked = true,
         failure_code = p_failure_code, failure_phase = p_failure_phase,
         failure_message = left(p_failure_message, 500), failed_at = coalesce(failed_at, now()),
         next_retry_at = null, updated_at = now()
   where id = p_order_id;

  return jsonb_build_object(
    'released', v_released, 'creditState',
    case when v_order.credit_state = 'reserved' then 'released' else v_order.credit_state end,
    'balance', coalesce(v_balance, 0)
  );
end;
$$;

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
  elsif v_order.credit_state = 'reserved' then
    select coalesce(credits, 0) into v_balance from public.credits where user_id = p_user_id;
  elsif v_order.credit_state = 'legacy' then
    select coalesce(credits, 0) into v_balance from public.credits where user_id = p_user_id;
  else
    return jsonb_build_object('result', 'not_retryable', 'balance', null);
  end if;

  v_stage := case
    when exists (select 1 from public.order_photos where order_id = p_order_id)
      then 'rendering_photos'
    when exists (select 1 from public.dating_order_shoots where order_id = p_order_id)
      then 'writing_prompts'
    else 'planning'
  end;

  update public.user_shoot_orders
     set status = 'queued', pipeline_stage = v_stage, provider_blocked = false,
         failure_code = null, failure_phase = null, failure_message = null,
         failed_at = null, next_retry_at = null, provider_retry_count = 0,
         updated_at = now()
   where id = p_order_id;

  return jsonb_build_object('result', 'reserved', 'balance', coalesce(v_balance, 0));
end;
$$;

create or replace function public.capture_dating_order_credit(p_order_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.user_shoot_orders%rowtype;
  v_complete_photos integer;
  v_complete_shoots integer;
begin
  select * into v_order from public.user_shoot_orders
   where id = p_order_id for update;
  if not found then raise exception 'dating order not found'; end if;
  if v_order.credit_state = 'released' then
    raise exception 'released dating order cannot become ready';
  end if;

  if v_order.pipeline_mode = 'dynamic' then
    select count(*) into v_complete_photos
      from public.order_photos
     where order_id = p_order_id
       and status = 'completed'
       and image_url is not null;
    select count(*) into v_complete_shoots
      from (
        select s.id
          from public.dating_order_shoots s
          join public.order_photos p on p.order_shoot_id = s.id
         where s.order_id = p_order_id and s.status = 'passed'
         group by s.id
        having count(*) = 4
           and count(*) filter (where p.status = 'completed' and p.image_url is not null) = 4
      ) complete;
    if v_complete_photos <> v_order.photos_target
       or v_complete_shoots <> v_order.shoots_target then
      raise exception 'dynamic dating order is not a complete delivery';
    end if;
  end if;

  update public.user_shoot_orders
     set credit_state = case when credit_state = 'reserved' then 'captured' else credit_state end,
         status = 'ready', pipeline_stage = 'ready', ready_at = coalesce(ready_at, now()),
         provider_blocked = false, failure_code = null, failure_phase = null,
         failure_message = null, failed_at = null, next_retry_at = null,
         updated_at = now()
   where id = p_order_id;
  return case when v_order.credit_state = 'reserved' then 'captured' else v_order.credit_state end;
end;
$$;

revoke all on function public.create_reserved_dating_order(uuid, uuid, integer, jsonb) from public, anon, authenticated;
revoke all on function public.release_dating_order_credit(uuid, text, text, text) from public, anon, authenticated;
revoke all on function public.reserve_dating_order_retry(uuid, uuid) from public, anon, authenticated;
revoke all on function public.capture_dating_order_credit(uuid) from public, anon, authenticated;
grant execute on function public.create_reserved_dating_order(uuid, uuid, integer, jsonb) to service_role;
grant execute on function public.release_dating_order_credit(uuid, text, text, text) to service_role;
grant execute on function public.reserve_dating_order_retry(uuid, uuid) to service_role;
grant execute on function public.capture_dating_order_credit(uuid) to service_role;
