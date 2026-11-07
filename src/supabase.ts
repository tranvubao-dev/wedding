import { createClient } from '@supabase/supabase-js';
import { localStore } from './storage';
import type { Guest } from './types';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const supabase = url && key ? createClient(url, key, {
  auth: { storage: localStore, detectSessionInUrl: false },
}) : null;

export function requireSupabase() {
  if (!supabase) throw new Error('Chưa cấu hình kết nối Supabase. Vui lòng liên hệ cô dâu/chú rể.');
  return supabase;
}

export async function loadGuests(admin: boolean): Promise<Guest[]> {
  const client = requireSupabase();
  if (admin) {
    const { data, error } = await client.from('wedding_guests').select('*').order('updatedAt', { ascending: false }).limit(1000);
    if (error) throw error;
    return data as Guest[];
  }
  const { data, error } = await client.rpc('wedding_public_wishes');
  if (error) throw error;
  return (data ?? []).map(row => ({ ...row, group: '', status: 'CONFIRMED', rsvpStatus: 'PENDING', guestsCount: 0, relation: 'NONE' })) as Guest[];
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
