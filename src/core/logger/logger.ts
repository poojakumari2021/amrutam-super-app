import { config } from '@/core/config/env';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const minLevel: LogLevel = config.env === 'production' ? 'warn' : 'debug';

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[minLevel];
}

function formatMessage(level: LogLevel, message: string, meta?: unknown): string {
  const timestamp = new Date().toISOString();
  const metaStr = meta !== undefined ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
}

export const logger = {
  debug: (message: string, meta?: unknown) => {
    if (shouldLog('debug')) {
      console.debug(formatMessage('debug', message, meta));
    }
  },
  info: (message: string, meta?: unknown) => {
    if (shouldLog('info')) {
      console.info(formatMessage('info', message, meta));
    }
  },
  warn: (message: string, meta?: unknown) => {
    if (shouldLog('warn')) {
      console.warn(formatMessage('warn', message, meta));
    }
  },
  error: (message: string, meta?: unknown) => {
    if (shouldLog('error')) {
      console.error(formatMessage('error', message, meta));
    }
  },
};
