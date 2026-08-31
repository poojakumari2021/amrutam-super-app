import { formatCurrency, groupByMonthYear, seededRandom } from '@/core/utils/helpers';

describe('helpers', () => {
  it('formats currency in INR', () => {
    expect(formatCurrency(1500)).toBe('₹1,500');
  });

  it('groups items by month and year', () => {
    const grouped = groupByMonthYear([
      { date: '2024-01-15T00:00:00.000Z', id: '1' },
      { date: '2024-01-20T00:00:00.000Z', id: '2' },
      { date: '2023-12-01T00:00:00.000Z', id: '3' },
    ]);
    expect(Object.keys(grouped).length).toBe(2);
  });

  it('produces deterministic seeded random values', () => {
    const randA = seededRandom(42);
    const randB = seededRandom(42);
    expect(randA()).toBe(randB());
  });
});
