import { secureStorage, STORAGE_KEYS } from '@/core/storage/storage';

export type FeatureFlag =
  | 'enhanced_filters'
  | 'wishlist_v2'
  | 'health_attachments'
  | 'offline_sync_v2';

const DEFAULT_FLAGS: Record<FeatureFlag, boolean> = {
  enhanced_filters: true,
  wishlist_v2: true,
  health_attachments: true,
  offline_sync_v2: true,
};

const STORAGE_KEY = 'feature-flags';

export function getFeatureFlags(): Record<FeatureFlag, boolean> {
  return secureStorage.getObject<Record<FeatureFlag, boolean>>(STORAGE_KEY) ?? DEFAULT_FLAGS;
}

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return getFeatureFlags()[flag] ?? DEFAULT_FLAGS[flag];
}

export function setFeatureFlag(flag: FeatureFlag, enabled: boolean): void {
  const flags = getFeatureFlags();
  flags[flag] = enabled;
  secureStorage.setObject(STORAGE_KEY, flags);
}

export function resetFeatureFlags(): void {
  secureStorage.setObject(STORAGE_KEY, DEFAULT_FLAGS);
}
