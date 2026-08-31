import NetInfo from '@react-native-community/netinfo';
import { config } from '@/core/config/env';
import { logger } from '@/core/logger/logger';
import { notifySessionExpired } from '@/core/api/sessionHandler';
import { secureStorage, STORAGE_KEYS } from '@/core/storage/storage';
import { encryptedStorage } from '@/core/storage/encryptedStorage';
import {
  ApiError,
  NetworkError,
  SessionExpiredError,
} from '@/core/api/types';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  timeoutMs?: number;
  skipAuth?: boolean;
  cacheKey?: string;
  simulateIssues?: boolean;
  cache?: boolean;
};

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

async function simulateNetworkConditions(): Promise<void> {
  if (config.api.slowNetworkMs > 0) {
    await delay(config.api.slowNetworkMs);
  }
  if (Math.random() < config.api.failureRate) {
    throw new ApiError('Random server failure', 'RANDOM_FAILURE', 500);
  }
}

function simulateResponseCorruption<T>(data: T, simulateIssues: boolean): T {
  if (!simulateIssues || config.env !== 'development') {
    return data;
  }

  const roll = Math.random();
  if (roll < 0.02) {
    throw new ApiError('Invalid JSON response', 'INVALID_JSON', 500);
  }
  if (roll < 0.04 && typeof data === 'object' && data !== null) {
    throw new ApiError('Partial response received', 'PARTIAL_RESPONSE', 206);
  }
  if (roll < 0.06 && Array.isArray(data) && data.length > 0) {
    return [] as T;
  }

  return data;
}

function parseCachedJson<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    logger.warn('Invalid JSON in cache, ignoring entry');
    return null;
  }
}

function getCachedResponse<T>(cacheKey: string): T | null {
  const cache = secureStorage.getObject<Record<string, { data: T; ts: number }>>(
    STORAGE_KEYS.apiCache,
  );
  const entry = cache?.[cacheKey];
  if (!entry) {
    return null;
  }
  if (Date.now() - entry.ts > config.cache.staleTimeMs) {
    return null;
  }
  return entry.data;
}

function setCachedResponse<T>(cacheKey: string, data: T): void {
  const cache =
    secureStorage.getObject<Record<string, { data: unknown; ts: number }>>(
      STORAGE_KEYS.apiCache,
    ) ?? {};
  cache[cacheKey] = { data, ts: Date.now() };
  secureStorage.setObject(STORAGE_KEYS.apiCache, cache);
}

function getSession(): { token: string; expiresAt: number } | null {
  return encryptedStorage.getObject<{ token: string; expiresAt: number }>(
    STORAGE_KEYS.session,
  );
}

export async function apiRequest<T>(
  endpoint: string,
  handler: () => Promise<T>,
  options: RequestOptions = {},
): Promise<T> {
  const netState = await NetInfo.fetch();
  const isOnline = netState.isConnected ?? false;
  const cacheKey = options.cacheKey ?? endpoint;
  const simulateIssues = options.simulateIssues ?? true;
  const useCache = options.cache !== false;

  if (!isOnline) {
    const cached = useCache ? getCachedResponse<T>(cacheKey) : null;
    if (cached) {
      logger.info('Serving cached response (offline)', { endpoint });
      return cached;
    }
    throw new NetworkError();
  }

  if (!options.skipAuth) {
    const session = getSession();
    if (session && session.expiresAt < Date.now()) {
      notifySessionExpired();
      throw new SessionExpiredError();
    }
  }

  const timeoutMs = options.timeoutMs ?? config.api.timeoutMs;

  try {
    const result = await Promise.race([
      (async () => {
        await simulateNetworkConditions();
        const data = await handler();
        return simulateResponseCorruption(data, simulateIssues);
      })(),
      delay(timeoutMs).then(() => {
        throw new ApiError('Request timed out', 'TIMEOUT', 408);
      }),
    ]);

    if (useCache) {
      setCachedResponse(cacheKey, result);
    }
    return result;
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      notifySessionExpired();
      throw error;
    }

    if (error instanceof ApiError) {
      const cached = useCache ? getCachedResponse<T>(cacheKey) : null;
      if (cached && error.code !== 'SESSION_EXPIRED') {
        logger.warn('API failed, returning stale cache', {
          endpoint,
          error: error.message,
        });
        return cached;
      }
      throw error;
    }

    const cached = useCache ? getCachedResponse<T>(cacheKey) : null;
    if (cached) {
      return cached;
    }

    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error',
      'UNKNOWN',
    );
  }
}

export function initSession(token: string, expiresAt: number): void {
  encryptedStorage.setObject(STORAGE_KEYS.session, { token, expiresAt });
}

export function clearSession(): void {
  encryptedStorage.delete(STORAGE_KEYS.session);
}

export { parseCachedJson };
