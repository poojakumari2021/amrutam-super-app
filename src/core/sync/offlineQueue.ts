import { secureStorage, STORAGE_KEYS } from '@/core/storage/storage';
import { logger } from '@/core/logger/logger';

export type OfflineActionType = 'CREATE_BOOKING' | 'CANCEL_BOOKING' | 'UPDATE_CART';

export type OfflineAction = {
  id: string;
  type: OfflineActionType;
  payload: unknown;
  createdAt: number;
  retries: number;
};

function getQueue(): OfflineAction[] {
  return secureStorage.getObject<OfflineAction[]>(STORAGE_KEYS.offlineQueue) ?? [];
}

function saveQueue(queue: OfflineAction[]): void {
  secureStorage.setObject(STORAGE_KEYS.offlineQueue, queue);
}

export const offlineQueue = {
  enqueue: (action: Omit<OfflineAction, 'id' | 'createdAt' | 'retries'>) => {
    const queue = getQueue();
    const entry: OfflineAction = {
      ...action,
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      createdAt: Date.now(),
      retries: 0,
    };
    queue.push(entry);
    saveQueue(queue);
    logger.info('Queued offline action', { type: action.type });
    return entry.id;
  },

  getAll: () => getQueue(),

  remove: (id: string) => {
    saveQueue(getQueue().filter(item => item.id !== id));
  },

  clear: () => saveQueue([]),
};
