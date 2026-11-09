-- Run in the Supabase SQL Editor. No demo guests or credentials are inserted.
begin;
create table if not exists public.wedding_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.wedding_admins enable row level security;
revoke all on public.wedding_admins from anon, authenticated;

create or replace function public.wedding_is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.wedding_admins where user_id = auth.uid());
$$;
revoke all on function public.wedding_is_admin() from public;
grant execute on function public.wedding_is_admin() to anon, authenticated;

create table if not exists public.wedding_guests (
  id uuid primary key,
  name text not null check (char_length(btrim(name)) between 1 and 150),
  "group" text not null check ("group" in ('NHÀ TRAI', 'NHÀ GÁI')),
  status text not null check (status in ('DRAFT', 'SENT', 'CONFIRMED', 'DECLINED')),
  "rsvpStatus" text not null check ("rsvpStatus" in ('ATTENDING', 'DECLINED', 'PENDING')),
  "guestsCount" integer not null check ("guestsCount" between 0 and 20),
  relation text not null check (relation in ('BRIDE', 'GROOM', 'NONE')),
  blessing text check (char_length(blessing) <= 2000),
  "updatedAt" timestamptz not null default now()
);
alter table public.wedding_guests enable row level security;
revoke all on public.wedding_guests from anon, authenticated;
grant select, insert, update, delete on public.wedding_guests to authenticated;
drop policy if exists wedding_admin_access on public.wedding_guests;
create policy wedding_admin_access on public.wedding_guests for all to authenticated
using (public.wedding_is_admin()) with check (public.wedding_is_admin());

-- Only these public columns leave the database; attendance stays private.
create or replace function public.wedding_public_wishes()
returns table(id uuid, name text, blessing text, "updatedAt" timestamptz)
language sql stable security definer set search_path = '' as $$
  select id, name, blessing, "updatedAt" from public.wedding_guests
  where nullif(btrim(blessing), '') is not null
  order by "updatedAt" desc limit 200;
$$;
revoke all on function public.wedding_public_wishes() from public;
grant execute on function public.wedding_public_wishes() to anon, authenticated;

-- No public read/update/delete access to RSVP records. UUID makes a retry idempotent.
create or replace function public.wedding_submit(payload jsonb) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if coalesce(payload->>'status', '') <> 'CONFIRMED' then
    raise exception 'Invalid submission';
  end if;
  insert into public.wedding_guests(id, name, "group", status, "rsvpStatus", "guestsCount", relation, blessing)
  values ((payload->>'id')::uuid, btrim(payload->>'name'), payload->>'group', 'CONFIRMED',
    payload->>'rsvpStatus', (payload->>'guestsCount')::integer, payload->>'relation',
    nullif(btrim(payload->>'blessing'), ''))
  on conflict (id) do nothing;
end;
$$;
revoke all on function public.wedding_submit(jsonb) from public;
grant execute on function public.wedding_submit(jsonb) to anon, authenticated;
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
-- Stable, eight-character links. Only an administrator can create a code.
create table if not exists public.wedding_invitation_links (
  guest_id uuid primary key references public.wedding_guests(id) on delete cascade,
  code text not null unique check (code ~ '^[A-Za-z0-9_-]{8}$'),
  created_at timestamptz not null default now()
);
alter table public.wedding_invitation_links enable row level security;
revoke all on public.wedding_invitation_links from anon, authenticated;

create or replace function public.wedding_ensure_invitation_code(p_guest_id uuid)
returns text language plpgsql security definer set search_path = '' as $$
declare v_code text;
begin
  if not public.wedding_is_admin() then raise exception 'Admin required'; end if;
  perform 1 from public.wedding_guests g where g.id = p_guest_id for update;
  if not found then raise exception 'Guest not found'; end if;
  select l.code into v_code from public.wedding_invitation_links l where l.guest_id = p_guest_id;
  if v_code is not null then return v_code; end if;
  for attempt in 1..10 loop
    -- First six random UUID bytes yield 48 bits, encoded as eight URL-safe characters.
    v_code := translate(substr(encode(uuid_send(gen_random_uuid()), 'base64'), 1, 8), '+/', '-_');
    begin
      insert into public.wedding_invitation_links(guest_id, code) values(p_guest_id, v_code);
      return v_code;
    exception when unique_violation then null;
    end;
  end loop;
  raise exception 'Could not allocate invitation code';
end;
$$;
revoke all on function public.wedding_ensure_invitation_code(uuid) from public;
grant execute on function public.wedding_ensure_invitation_code(uuid) to authenticated;

-- Possession of a code reveals the invitation's name/group, never RSVP or other private fields.
create or replace function public.wedding_resolve_invitation(p_code text)
returns table(name text, "group" text)
language sql stable security definer set search_path = '' as $$
  select g.name, g."group" from public.wedding_invitation_links l
  join public.wedding_guests g on g.id = l.guest_id
  where p_code ~ '^[A-Za-z0-9_-]{8}$' and l.code = p_code limit 1;
$$;
revoke all on function public.wedding_resolve_invitation(text) from public;
grant execute on function public.wedding_resolve_invitation(text) to anon, authenticated;
commit;
