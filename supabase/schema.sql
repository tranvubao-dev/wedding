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
commit;
