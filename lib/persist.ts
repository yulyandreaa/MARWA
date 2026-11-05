'use client';

import {useCallback, useSyncExternalStore} from 'react';

/**
 * Tiny localStorage store shared by every tab.
 * Demo backend: everything lives in the browser until we connect a real database.
 */
const listeners = new Map<string, Set<() => void>>();
const cache = new Map<string, {raw: string | null; value: unknown}>();

function emit(key: string) {
  listeners.get(key)?.forEach(l => l());
}

if (typeof window !== 'undefined') {
  // Other tabs (e.g. the store opened in a new tab) write → refresh here.
  window.addEventListener('storage', e => {
    if (e.key) emit(e.key);
  });
}

export function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    const hit = cache.get(key);
    if (hit && hit.raw === raw) return hit.value as T;
    const value = raw ? (JSON.parse(raw) as T) : fallback;
    cache.set(key, {raw, value});
    return value;
  } catch {
    return fallback;
  }
}

export function write<T>(key: string, value: T): boolean {
  let ok = true;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    ok = false; // quota exceeded or storage blocked
  }
  emit(key);
  return ok;
}

/** `fallback` must be a stable reference (module constant). */
export function usePersisted<T>(key: string, fallback: T): T {
  const subscribe = useCallback(
    (cb: () => void) => {
      if (!listeners.has(key)) listeners.set(key, new Set());
      listeners.get(key)!.add(cb);
      return () => listeners.get(key)!.delete(cb);
    },
    [key],
  );
  return useSyncExternalStore(subscribe, () => read(key, fallback), () => fallback);
}

/** True after hydration — avoids flashing "empty cart"/"logged out" states. */
export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
