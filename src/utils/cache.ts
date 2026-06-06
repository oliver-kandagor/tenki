import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export async function setCache<T>(key: string, data: T, ttlMs: number): Promise<void> {
  const entry: CacheEntry<T> = { data, expiresAt: Date.now() + ttlMs };
  await AsyncStorage.setItem(key, JSON.stringify(entry));
}

export async function getCache<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;

  const entry: CacheEntry<T> = JSON.parse(raw);
  if (Date.now() > entry.expiresAt) {
    await AsyncStorage.removeItem(key);
    return null;
  }

  return entry.data;
}

export async function removeCache(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}
