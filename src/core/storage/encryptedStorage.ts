import { createMMKV } from 'react-native-mmkv';

// session + bookings — encrypted at rest
export const encryptedMmkv = createMMKV({
  id: 'amrutam-secure',
  encryptionKey: 'amrutam-assignment-secure-key-v1',
});

export const encryptedStorage = {
  getString: (key: string): string | undefined => encryptedMmkv.getString(key),
  set: (key: string, value: string) => encryptedMmkv.set(key, value),
  delete: (key: string) => encryptedMmkv.remove(key),
  getObject: <T>(key: string): T | null => {
    const raw = encryptedMmkv.getString(key);
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
    encryptedMmkv.set(key, JSON.stringify(value));
  },
};
