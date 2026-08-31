// Deterministic pseudo-random for consistent mock data generation
export function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

export function pick<T>(items: T[], rand: () => number): T {
  return items[Math.floor(rand() * items.length)]!;
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function groupByMonthYear<T extends { date: string }>(
  items: T[],
): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const date = new Date(item.date);
    const key = `${date.toLocaleString('en-US', { month: 'long' })} ${date.getFullYear()}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
}

export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  waitMs: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => fn(...args), waitMs);
  };
}

export function uniqueId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
