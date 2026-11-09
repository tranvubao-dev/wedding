begin;
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
