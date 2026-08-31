import type { PaginatedResponse } from '@/core/api/types';

/**
 * Scans indices without materializing the full dataset.
 * Pass 1: collect matching indices. Pass 2: sort (optional). Pass 3: slice page.
 */
export function paginateByIndex<T>(options: {
  totalCount: number;
  page: number;
  pageSize: number;
  matches: (index: number) => boolean;
  generate: (index: number) => T;
  compare?: (a: T, b: T) => number;
}): PaginatedResponse<T> {
  const { totalCount, page, pageSize, matches, generate, compare } = options;
  const matchingIndices: number[] = [];

  for (let i = 0; i < totalCount; i++) {
    if (matches(i)) {
      matchingIndices.push(i);
    }
  }

  if (compare) {
    matchingIndices.sort((a, b) => compare(generate(a), generate(b)));
  }

  const start = (page - 1) * pageSize;
  const pageIndices = matchingIndices.slice(start, start + pageSize);
  const items = pageIndices.map(generate);

  return {
    items,
    page,
    pageSize,
    total: matchingIndices.length,
    hasMore: start + pageSize < matchingIndices.length,
  };
}
