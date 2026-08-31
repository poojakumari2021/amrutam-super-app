import NetInfo from '@react-native-community/netinfo';
import { logger } from '@/core/logger/logger';
import { offlineQueue } from '@/core/sync/offlineQueue';

type SyncHandler = (type: string, payload: unknown) => Promise<void>;

let syncHandler: SyncHandler | null = null;
let isSyncing = false;

export function registerSyncHandler(handler: SyncHandler): void {
  syncHandler = handler;
}

export async function processOfflineQueue(): Promise<void> {
  if (isSyncing || !syncHandler) {
    return;
  }

  const queue = offlineQueue.getAll();
  if (queue.length === 0) {
    return;
  }

  isSyncing = true;
  logger.info('Processing offline queue', { count: queue.length });

  for (const action of queue) {
    try {
      await syncHandler(action.type, action.payload);
      offlineQueue.remove(action.id);
    } catch (error) {
      logger.error('Failed to sync offline action', { action, error });
    }
  }

  isSyncing = false;
}

export function startSyncListener(): () => void {
  const unsubscribe = NetInfo.addEventListener(state => {
    if (state.isConnected) {
      processOfflineQueue();
    }
  });
  return unsubscribe;
}
