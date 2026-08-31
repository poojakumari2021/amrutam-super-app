export type Environment = 'development' | 'staging' | 'production' | 'test';

const ENV: Environment =
  ((globalThis as { process?: { env?: Record<string, string> } }).process?.env
    ?.APP_ENV as Environment) ?? (__DEV__ ? 'development' : 'production');

export const config = {
  env: ENV,
  api: {
    baseUrl: 'https://api.amrutam.mock',
    timeoutMs: 10_000,
    // Simulated latency/failures only in dev — release APK was still using these.
    failureRate: __DEV__ ? 0.05 : 0,
    slowNetworkMs: __DEV__ ? 800 : 0,
  },
  data: {
    doctorCount: 5_000,
    productCount: 20_000,
    healthRecordCount: 10_000,
    pageSize: 20,
  },
  cache: {
    staleTimeMs: 5 * 60 * 1000,
    gcTimeMs: 30 * 60 * 1000,
  },
} as const;
