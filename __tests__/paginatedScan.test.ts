import { paginateByIndex } from '@/core/utils/paginatedScan';

describe('paginateByIndex', () => {
  it('returns only the requested page without building full dataset', () => {
    const result = paginateByIndex({
      totalCount: 100,
      page: 2,
      pageSize: 10,
      matches: index => index % 2 === 0,
      generate: index => ({ id: index, value: index * 2 }),
    });

    expect(result.items).toHaveLength(10);
    expect(result.items[0]?.id).toBe(20);
    expect(result.total).toBe(50);
    expect(result.hasMore).toBe(true);
  });
});
