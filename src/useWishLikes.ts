import { useCallback, useEffect, useRef, useState } from 'react';
import { loadWishLikes, setWishLike, type WishLikeState } from './supabase';

export function useWishLikes(wishIds: string[]) {
  const key = [...wishIds].sort().join(',');
  const [states, setStates] = useState<Record<string, WishLikeState>>({});
  const [pending, setPending] = useState<Record<string, boolean>>({});
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const locks = useRef(new Set<string>());
  const version = useRef(0);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!key) {
      setStates({});
      setError('');
      return;
    }
    let alive = true;
    let sequence = 0;
    const refresh = async () => {
      if (document.hidden || locks.current.size) return;
      const epoch = version.current;
      const request = ++sequence;
      try {
        const rows = await loadWishLikes(key.split(','));
        if (alive && epoch === version.current && request === sequence) {
          setStates(Object.fromEntries(rows.map((row) => [row.wish_id, row])));
          setError('');
        }
      } catch {
        if (alive && epoch === version.current && request === sequence)
          setError('Chưa tải được lượt tim. Vui lòng thử lại.');
      }
    };
    void refresh();
    const timer = setInterval(refresh, 15000);
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      alive = false;
      clearInterval(timer);
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, [key, retry]);

  const toggle = useCallback(
    async (id: string) => {
      if (locks.current.has(id) || !states[id]) return;
      locks.current.add(id);
      version.current++;
      setPending((current) => ({ ...current, [id]: true }));
      setError('');
      try {
        const row = await setWishLike(id, !states[id].liked);
        if (mounted.current) setStates((current) => ({ ...current, [id]: row }));
      } catch {
        if (mounted.current) setError('Chưa lưu được lượt tim. Vui lòng thử lại.');
      } finally {
        locks.current.delete(id);
        version.current++;
        if (mounted.current) setPending((current) => ({ ...current, [id]: false }));
      }
    },
    [states],
  );

  return { states, pending, error, toggle, retry: () => setRetry((value) => value + 1) };
}
