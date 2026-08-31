import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMMKV } from 'react-native-mmkv';

export const mmkv = createMMKV({ id: 'amrutam-app' });

export const secureStorage = {
  getString: (key: string): string | undefined => mmkv.getString(key),
  set: (key: string, value: string | number | boolean) => mmkv.set(key, value),
  delete: (key: string) => mmkv.remove(key),
  getObject: <T>(key: string): T | null => {
    const raw = mmkv.getString(key);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
  setObject: <T>(key: string, value: T) => {
    mmkv.set(key, JSON.stringify(value));
  },
};

export const persistentStorage = {
  getItem: (key: string) => AsyncStorage.getItem(key),
  setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
  removeItem: (key: string) => AsyncStorage.removeItem(key),
};

export const STORAGE_KEYS = {
  cart: 'shop:cart',
  wishlist: 'shop:wishlist',
  bookings: 'consultation:bookings',
  offlineQueue: 'sync:offline-queue',
  apiCache: 'cache:api',
  theme: 'app:theme',
  session: 'app:session',
} as const;
