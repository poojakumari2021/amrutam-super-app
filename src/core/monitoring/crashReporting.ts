import { logger } from '@/core/logger/logger';

type CrashReporter = {
  captureException: (error: Error, context?: Record<string, unknown>) => void;
  captureMessage: (message: string, context?: Record<string, unknown>) => void;
};

const consoleReporter: CrashReporter = {
  captureException: (error, context) => {
    logger.error('Crash report', { error: error.message, stack: error.stack, context });
  },
  captureMessage: (message, context) => {
    logger.warn('Crash message', { message, context });
  },
};

let reporter: CrashReporter = consoleReporter;

export function setCrashReporter(custom: CrashReporter): void {
  reporter = custom;
}

export function reportError(error: Error, context?: Record<string, unknown>): void {
  reporter.captureException(error, context);
}

export function reportMessage(message: string, context?: Record<string, unknown>): void {
  reporter.captureMessage(message, context);
}
