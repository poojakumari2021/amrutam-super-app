import { logger } from '@/core/logger/logger';

const marks = new Map<string, number>();

export const perfMonitor = {
  start: (label: string) => {
    marks.set(label, Date.now());
  },
  end: (label: string) => {
    const start = marks.get(label);
    if (start) {
      const duration = Date.now() - start;
      logger.debug(`Perf: ${label}`, { durationMs: duration });
      marks.delete(label);
      return duration;
    }
    return 0;
  },
};
