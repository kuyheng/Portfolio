"use client";

import { useCallback, useSyncExternalStore } from "react";

type StorageOptions<T> = {
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
};

const STORAGE_EVENT = "local-storage";

const subscribe = (callback: () => void) => {
  if (typeof window === "undefined") {
    return () => null;
  }
  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener(STORAGE_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(STORAGE_EVENT, handler);
  };
};

const defaultSerialize = (value: unknown) => JSON.stringify(value);
const defaultDeserialize = <T,>(value: string) => JSON.parse(value) as T;

export function useLocalStorageState<T>(
  key: string,
  fallback: T,
  options: StorageOptions<T> = {}
) {
  const serialize = options.serialize ?? defaultSerialize;
  const deserialize = options.deserialize ?? defaultDeserialize;

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") return fallback;
    const stored = window.localStorage.getItem(key);
    if (stored === null) return fallback;
    try {
      return deserialize(stored);
    } catch {
      return fallback;
    }
  }, [deserialize, fallback, key]);

  const getServerSnapshot = useCallback(() => fallback, [fallback]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      if (typeof window === "undefined") return;
      const current = getSnapshot();
      const resolved = typeof next === "function" ? (next as (prev: T) => T)(current) : next;
      window.localStorage.setItem(key, serialize(resolved));
      window.dispatchEvent(new Event(STORAGE_EVENT));
    },
    [getSnapshot, key, serialize]
  );

  return [value, setValue] as const;
}
