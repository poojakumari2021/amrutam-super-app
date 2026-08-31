import { apiRequest } from '@/core/api/client';
import { config } from '@/core/config/env';
import {
  generateHealthRecord,
  type HealthRecord,
  type HealthRecordType,
} from '@/data/generators/healthRecordGenerator';
import type { PaginatedResponse } from '@/core/api/types';
import { paginateByIndex } from '@/core/utils/paginatedScan';

export type HealthRecordFilters = {
  types?: HealthRecordType[];
  tags?: string[];
  search?: string;
};

function recordMatches(index: number, filters: HealthRecordFilters): boolean {
  const record = generateHealthRecord(index);
  const matchesType =
    !filters.types?.length || filters.types.includes(record.type);
  const matchesTags =
    !filters.tags?.length ||
    filters.tags.some(tag => record.tags.includes(tag));
  const search = filters.search ?? '';
  const matchesSearch =
    !search ||
    record.title.toLowerCase().includes(search.toLowerCase()) ||
    record.summary.toLowerCase().includes(search.toLowerCase()) ||
    record.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));

  return matchesType && matchesTags && matchesSearch;
}

export async function fetchHealthRecords(params: {
  page: number;
  pageSize?: number;
  filters?: HealthRecordFilters;
}): Promise<PaginatedResponse<HealthRecord>> {
  const pageSize = params.pageSize ?? config.data.pageSize;
  const filters = params.filters ?? {};
  const cacheKey = `health-records:${params.page}:${JSON.stringify(filters)}`;

  return apiRequest(
    cacheKey,
    async () =>
      paginateByIndex({
        totalCount: config.data.healthRecordCount,
        page: params.page,
        pageSize,
        matches: index => recordMatches(index, filters),
        generate: generateHealthRecord,
        compare: (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime(),
      }),
    { cacheKey },
  );
}

export async function fetchHealthRecordById(id: string): Promise<HealthRecord> {
  const index = Number(id.replace('rec_', ''));
  return apiRequest(`health-record:${id}`, async () =>
    generateHealthRecord(index),
  );
}

export const HEALTH_TAGS = [
  'routine',
  'urgent',
  'follow-up',
  'chronic',
  'preventive',
  'ayurveda',
] as const;
