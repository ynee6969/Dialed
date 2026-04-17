interface CacheValue<T> {
  expiresAt: number;
  value: T;
}

declare global {
  // eslint-disable-next-line no-var
  var appCacheStore: Map<string, CacheValue<unknown>> | undefined;
}

const store = global.appCacheStore ?? new Map<string, CacheValue<unknown>>();

if (!global.appCacheStore) {
  global.appCacheStore = store;
}

export function getCachedValue<T>(key: string) {
  const entry = store.get(key);
  if (!entry) {
    return null;
  }

  if (entry.expiresAt < Date.now()) {
    store.delete(key);
    return null;
  }

  return entry.value as T;
}

export function setCachedValue<T>(key: string, value: T, ttlMs: number) {
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlMs
  });
}
