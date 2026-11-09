begin;
-- Shared hearts. Browser identity is a random UUID, never a public counter supplied by clients.
create table if not exists public.wedding_wish_likes (
  wish_id uuid not null references public.wedding_guests(id) on delete cascade,
  visitor_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (wish_id, visitor_id)
);
alter table public.wedding_wish_likes enable row level security;
revoke all on public.wedding_wish_likes from anon, authenticated;

create or replace function public.wedding_wish_like_states(p_visitor_id uuid, p_wish_ids uuid[])
returns table(wish_id uuid, total bigint, liked boolean)
language plpgsql stable security definer set search_path = '' as $$
begin
  if p_visitor_id is null or p_wish_ids is null or cardinality(p_wish_ids) > 1000 then
    raise exception 'Invalid like query';
  end if;
  return query
    select g.id,
      (select count(*) from public.wedding_wish_likes l where l.wish_id = g.id),
      exists(select 1 from public.wedding_wish_likes l where l.wish_id = g.id and l.visitor_id = p_visitor_id)
    from public.wedding_guests g
    where g.id = any(p_wish_ids) and nullif(btrim(g.blessing), '') is not null;
end;
$$;
revoke all on function public.wedding_wish_like_states(uuid, uuid[]) from public;
grant execute on function public.wedding_wish_like_states(uuid, uuid[]) to anon, authenticated;

create or replace function public.wedding_set_wish_like(p_wish_id uuid, p_visitor_id uuid, p_liked boolean)
returns table(wish_id uuid, total bigint, liked boolean)
language plpgsql security definer set search_path = '' as $$
begin
  if p_visitor_id is null or p_liked is null then raise exception 'Invalid like'; end if;
  -- Serialize changes for the same wish to return an accurate total. Retrying is safe.
  perform 1 from public.wedding_guests g
    where g.id = p_wish_id and nullif(btrim(g.blessing), '') is not null for update;
  if not found then raise exception 'Wish not found'; end if;
  if p_liked then
    insert into public.wedding_wish_likes(wish_id, visitor_id) values(p_wish_id, p_visitor_id)
      on conflict do nothing;
  else
    delete from public.wedding_wish_likes l where l.wish_id = p_wish_id and l.visitor_id = p_visitor_id;
  end if;
  return query select p_wish_id,
    (select count(*) from public.wedding_wish_likes l where l.wish_id = p_wish_id),
    exists(select 1 from public.wedding_wish_likes l where l.wish_id = p_wish_id and l.visitor_id = p_visitor_id);
end;
$$;
revoke all on function public.wedding_set_wish_like(uuid, uuid, boolean) from public;
grant execute on function public.wedding_set_wish_like(uuid, uuid, boolean) to anon, authenticated;
commit;
