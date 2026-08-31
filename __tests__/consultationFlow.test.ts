import { fetchDoctors } from '@/modules/consultation/api/consultationApi';

describe('consultation e2e flow (integration)', () => {
  it('loads doctors, supports search, and paginates', async () => {
    const page1 = await fetchDoctors({ page: 1, pageSize: 20 });
    expect(page1.items.length).toBe(20);
    expect(page1.total).toBeGreaterThan(0);
    expect(page1.hasMore).toBe(true);

    const filtered = await fetchDoctors({
      page: 1,
      search: 'Ayurveda',
      filters: { specialization: 'Ayurveda' },
    });
    expect(filtered.items.every(d => d.specialization === 'Ayurveda')).toBe(true);

    const page2 = await fetchDoctors({ page: 2, pageSize: 20 });
    expect(page2.page).toBe(2);
    expect(page2.items[0]?.id).not.toBe(page1.items[0]?.id);
  });
});
