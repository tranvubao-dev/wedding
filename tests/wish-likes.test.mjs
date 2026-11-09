import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

const wish = '11111111-1111-4111-8111-111111111111';
const noWish = '22222222-2222-4222-8222-222222222222';
const first = '33333333-3333-4333-8333-333333333333';
const second = '44444444-4444-4444-8444-444444444444';

async function database(legacy = false) {
  const db = new PGlite();
  await db.exec(`create role anon; create role authenticated; create schema auth;
    create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema auth to anon, authenticated;
    grant execute on function auth.uid() to anon, authenticated;`);
  const schema = await readFile(new URL('../supabase/schema.sql', import.meta.url), 'utf8');
  if (legacy) await db.exec(schema.slice(0, schema.indexOf('-- Shared hearts.')) + 'commit;');
  else await db.exec(schema);
  const migration = await readFile(
    new URL('../supabase/migrations/20261109_wish_likes.sql', import.meta.url),
    'utf8',
  );
  await db.exec(migration);
  await db.exec(migration);
  await db.query(
    `insert into public.wedding_guests(id,name,"group",status,"rsvpStatus","guestsCount",relation,blessing)
    values($1,'Guest','NHÀ TRAI','CONFIRMED','ATTENDING',1,'GROOM','Congratulations'),
    ($2,'Private RSVP','NHÀ GÁI','CONFIRMED','ATTENDING',1,'BRIDE',null)`,
    [wish, noWish],
  );
  await db.exec('set role anon');
  return db;
}
async function setLike(db, visitor, liked, id = wish) {
  return (
    await db.query('select * from public.wedding_set_wish_like($1,$2,$3)', [id, visitor, liked])
  ).rows[0];
}
async function states(db, visitor) {
  return (
    await db.query('select * from public.wedding_wish_like_states($1,$2::uuid[])', [
      visitor,
      [wish, noWish],
    ])
  ).rows;
}

test('global hearts persist across visitors and retries; unlike is idempotent', async () => {
  const db = await database();
  try {
    assert.equal((await states(db, first))[0].total, 0);
    assert.deepEqual(await setLike(db, first, true), { wish_id: wish, total: 1, liked: true });
    assert.equal((await setLike(db, first, true)).total, 1);
    assert.equal((await setLike(db, second, true)).total, 2);
    assert.deepEqual(await states(db, first), [{ wish_id: wish, total: 2, liked: true }]);
    assert.equal((await setLike(db, first, false)).total, 1);
    assert.equal((await setLike(db, first, false)).total, 1);
    assert.equal((await states(db, first))[0].liked, false);
    assert.equal((await states(db, second))[0].liked, true);
  } finally {
    await db.close();
  }
});

test('visitor identities and private RSVP stay inaccessible; invalid targets are rejected', async () => {
  const db = await database();
  try {
    for (const query of [
      'select * from public.wedding_wish_likes',
      'delete from public.wedding_wish_likes',
      'select * from public.wedding_guests',
    ]) {
      await assert.rejects(db.query(query));
    }
    await assert.rejects(setLike(db, first, true, noWish));
    await assert.rejects(setLike(db, null, true));
    await assert.rejects(setLike(db, first, null));
    await db.exec('reset role; set role authenticated');
    await assert.rejects(db.query('select * from public.wedding_wish_likes'));
    assert.equal((await setLike(db, first, true)).total, 1);
    await db.exec('reset role');
    await db.query('delete from public.wedding_guests where id=$1', [wish]);
    assert.equal(
      (await db.query('select count(*)::int as count from public.wedding_wish_likes')).rows[0]
        .count,
      0,
    );
  } finally {
    await db.close();
  }
});

test('migration upgrades the previous schema without losing wishes', async () => {
  const db = await database(true);
  try {
    assert.equal((await setLike(db, first, true)).total, 1);
    const wishes = await db.query('select * from public.wedding_public_wishes()');
    assert.equal(wishes.rows[0].id, wish);
    assert.equal(wishes.rows[0].name, 'Guest');
  } finally {
    await db.close();
  }
});

test('short invitation codes are stable, private to admins and expose only invitation fields', async () => {
  const db = await database();
  try {
    await assert.rejects(db.query('select public.wedding_ensure_invitation_code($1)', [wish]));
    await assert.rejects(db.query('select * from public.wedding_invitation_links'));
    await db.exec('reset role; set role authenticated');
    await assert.rejects(db.query('select public.wedding_ensure_invitation_code($1)', [wish]));
    await db.exec('reset role');
    await db.query('insert into auth.users(id) values($1)', [first]);
    await db.query('insert into public.wedding_admins(user_id) values($1)', [first]);
    await db.query("select set_config('request.jwt.claim.sub', $1, false)", [first]);
    await db.exec('set role authenticated');
    const code = (
      await db.query('select public.wedding_ensure_invitation_code($1) as code', [wish])
    ).rows[0].code;
    assert.match(code, /^[A-Za-z0-9_-]{8}$/);
    assert.equal(
      (await db.query('select public.wedding_ensure_invitation_code($1) as code', [wish])).rows[0]
        .code,
      code,
    );
    const other = (
      await db.query('select public.wedding_ensure_invitation_code($1) as code', [noWish])
    ).rows[0].code;
    assert.notEqual(other, code);
    await db.exec('reset role; set role anon');
    assert.deepEqual(
      (await db.query('select * from public.wedding_resolve_invitation($1)', [code])).rows,
      [{ name: 'Guest', group: 'NHÀ TRAI' }],
    );
    assert.deepEqual(
      (await db.query('select * from public.wedding_resolve_invitation($1)', ['invalid!'])).rows,
      [],
    );
    await db.exec('reset role');
    await db.query('delete from public.wedding_guests where id=$1', [wish]);
    await db.exec('set role anon');
    assert.deepEqual(
      (await db.query('select * from public.wedding_resolve_invitation($1)', [code])).rows,
      [],
    );
  } finally {
    await db.close();
  }
});

test('short-link migration is repeatable on the previous database', async () => {
  const db = await database(true);
  try {
    await db.exec('reset role');
    const migration = await readFile(
      new URL('../supabase/migrations/20261109_short_invitations.sql', import.meta.url),
      'utf8',
    );
    await db.exec(migration);
    await db.exec(migration);
    await db.exec('set role anon');
    assert.equal(
      (await db.query('select * from public.wedding_public_wishes()')).rows[0].name,
      'Guest',
    );
    assert.deepEqual(
      (await db.query('select * from public.wedding_resolve_invitation($1)', ['abcdefgh'])).rows,
      [],
    );
  } finally {
    await db.close();
  }
});
