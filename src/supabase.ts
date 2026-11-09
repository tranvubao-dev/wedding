import { createClient } from '@supabase/supabase-js';
import { localStore } from './storage';
import type { Guest } from './types';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const supabase =
  url && key
    ? createClient(url, key, {
        auth: { storage: localStore, detectSessionInUrl: false },
      })
    : null;

export function requireSupabase() {
  if (!supabase) throw new Error('Chưa cấu hình kết nối Supabase. Vui lòng liên hệ cô dâu/chú rể.');
  return supabase;
}

export async function loadGuests(admin: boolean): Promise<Guest[]> {
  const client = requireSupabase();
  if (admin) {
    const { data, error } = await client
      .from('wedding_guests')
      .select('*')
      .order('updatedAt', { ascending: false })
      .limit(1000);
    if (error) throw error;
    return data as Guest[];
  }
  const { data, error } = await client.rpc('wedding_public_wishes');
  if (error) throw error;
  return (data ?? []).map((row) => ({
    ...row,
    group: '',
    status: 'CONFIRMED',
    rsvpStatus: 'PENDING',
    guestsCount: 0,
    relation: 'NONE',
  })) as Guest[];
}

// Inserts only: matching by name would let strangers overwrite another guest's response.
export async function submitGuest(guest: Guest) {
  const { error } = await requireSupabase().rpc('wedding_submit', { payload: guest });
  if (error) throw error;
}

export async function checkAdmin() {
  const { data, error } = await requireSupabase().rpc('wedding_is_admin');
  if (error) throw error;
  return data === true;
}

export interface WishLikeState {
  wish_id: string;
  total: number;
  liked: boolean;
}
let visitorId: string | undefined;
function getLikeVisitorId() {
  if (!visitorId) {
    const stored = localStore.getItem('wedding_like_visitor_id');
    visitorId =
      stored &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(stored)
        ? stored
        : crypto.randomUUID();
    localStore.setItem('wedding_like_visitor_id', visitorId);
  }
  return visitorId;
}

export async function loadWishLikes(ids: string[]): Promise<WishLikeState[]> {
  const { data, error } = await requireSupabase().rpc('wedding_wish_like_states', {
    p_visitor_id: getLikeVisitorId(),
    p_wish_ids: ids,
  });
  if (error) throw error;
  return (data ?? []).map((row) => ({ ...row, total: Number(row.total) }));
}

export async function setWishLike(id: string, liked: boolean): Promise<WishLikeState> {
  const { data, error } = await requireSupabase().rpc('wedding_set_wish_like', {
    p_wish_id: id,
    p_visitor_id: getLikeVisitorId(),
    p_liked: liked,
  });
  if (error) throw error;
  if (!data?.[0]) throw new Error('Missing like confirmation');
  return { ...data[0], total: Number(data[0].total) };
}

export async function ensureInvitationCode(id: string): Promise<string> {
  const { data, error } = await requireSupabase().rpc('wedding_ensure_invitation_code', {
    p_guest_id: id,
  });
  if (error) throw error;
  if (typeof data !== 'string' || !/^[A-Za-z0-9_-]{8}$/.test(data))
    throw new Error('Invalid invitation code');
  return data;
}

export async function resolveInvitation(code: string): Promise<{ name: string; group: string }> {
  if (!/^[A-Za-z0-9_-]{8}$/.test(code)) throw new Error('Invalid invitation code');
  const { data, error } = await requireSupabase().rpc('wedding_resolve_invitation', {
    p_code: code,
  });
  if (error) throw error;
  if (!data?.[0]) throw new Error('Invitation not found');
  return data[0];
}
