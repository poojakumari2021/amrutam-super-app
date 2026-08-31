import React, { useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  SectionList,
  StyleSheet,
  View,
} from 'react-native';
import { useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';
import {
  fetchHealthRecords,
  HEALTH_TAGS,
} from '@/modules/health-records/api/healthRecordsApi';
import type { HealthRecord, HealthRecordType } from '@/data/generators/healthRecordGenerator';
import { useTheme } from '@/core/theme/ThemeProvider';
import { useI18n } from '@/core/i18n/I18nProvider';
import { groupByMonthYear } from '@/core/utils/helpers';
import { useDebouncedSearch } from '@/shared/hooks/useDebouncedSearch';
import { AppText } from '@/shared/components/AppText';
import { AttachmentPreview } from '@/shared/components/AttachmentPreview';
import { Card } from '@/shared/components/Card';
import { EmptyState } from '@/shared/components/EmptyState';
import { FilterChips } from '@/shared/components/FilterChips';
import { ListFetchIndicator } from '@/shared/components/ListFetchIndicator';
import { LoadingState } from '@/shared/components/LoadingState';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { ScreenSection } from '@/shared/components/ScreenSection';
import { SearchBar } from '@/shared/components/SearchBar';
import { SectionDivider } from '@/shared/components/SectionDivider';
import { SectionLabel } from '@/shared/components/SectionLabel';
import { isFeatureEnabled } from '@/core/featureFlags/featureFlags';

const RECORD_TYPE_LABELS: Record<HealthRecordType, string> = {
  lab_report: 'Lab Report',
  prescription: 'Prescription',
  consultation: 'Consultation',
  vaccination: 'Vaccination',
  allergy: 'Allergy',
};

const FILTER_TYPES: HealthRecordType[] = [
  'lab_report',
  'prescription',
  'consultation',
  'vaccination',
  'allergy',
];

export function HealthTimelineScreen() {
  const { colors, spacing, borderRadius } = useTheme();
  const { t } = useI18n();
  const [localSearch, debouncedSearch, setLocalSearch] = useDebouncedSearch();
  const [selectedTypes, setSelectedTypes] = useState<HealthRecordType[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ['health-records', debouncedSearch, selectedTypes, selectedTags],
    queryFn: ({ pageParam }) =>
      fetchHealthRecords({
        page: pageParam,
        filters: {
          search: debouncedSearch,
          types: selectedTypes.length ? selectedTypes : undefined,
          tags: selectedTags.length ? selectedTags : undefined,
        },
      }),
    initialPageParam: 1,
    getNextPageParam: lastPage =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    placeholderData: keepPreviousData,
  });

  const records = useMemo(
    () => data?.pages.flatMap(page => page.items) ?? [],
    [data],
  );
  const isInitialLoading = isLoading && records.length === 0;
  const isUpdatingResults = isFetching && !isFetchingNextPage && !isInitialLoading;

  const sections = useMemo(() => {
    const grouped = groupByMonthYear(records);
    return Object.entries(grouped).map(([title, sectionData]) => ({
      title,
      data: sectionData,
    }));
  }, [records]);

  const toggleType = useCallback((type: HealthRecordType) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type],
    );
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag],
    );
  }, []);

  const renderRecord = useCallback(
    ({ item }: { item: HealthRecord }) => (
      <Card elevated style={{ marginBottom: spacing.md }}>
        <AppText variant="label" color={colors.primary}>
          {RECORD_TYPE_LABELS[item.type]}
        </AppText>
        <AppText variant="h3" style={{ marginTop: spacing.sm }}>
          {item.title}
        </AppText>
        <AppText variant="caption" color={colors.textSecondary} style={{ marginTop: spacing.sm }}>
          {new Date(item.date).toLocaleDateString()}
          {item.doctorName ? ` · ${item.doctorName}` : ''}
        </AppText>
        <AppText variant="body" style={{ marginTop: spacing.md }}>
          {item.summary}
        </AppText>
        <View style={[styles.tags, { marginTop: spacing.md, gap: spacing.gutter }]}>
          {item.tags.map(tag => (
            <Pressable key={tag} onPress={() => toggleTag(tag)}>
              <AppText
                variant="caption"
                style={[
                  styles.tag,
                  {
                    backgroundColor: selectedTags.includes(tag)
                      ? colors.primary
                      : colors.border,
                    color: selectedTags.includes(tag) ? '#FFF' : colors.text,
                    borderRadius: borderRadius.sm,
                  },
                ]}>
                {tag}
              </AppText>
            </Pressable>
          ))}
        </View>
        {item.attachmentLabel && isFeatureEnabled('health_attachments') ? (
          <View style={{ marginTop: spacing.md }}>
            <AttachmentPreview
              type={item.attachmentType ?? 'pdf'}
              label={item.attachmentLabel}
            />
          </View>
        ) : null}
      </Card>
    ),
    [borderRadius.sm, colors, selectedTags, spacing.gutter, spacing.md, spacing.sm, toggleTag],
  );

  const listHeader = (
    <View style={{ paddingBottom: spacing.sm }}>
      <ScreenHeader title={t('health.title')} />

      <ScreenSection style={{ marginBottom: spacing.block }}>
        <SearchBar
          value={localSearch}
          onChangeText={setLocalSearch}
          placeholder={t('health.search')}
        />
        <ListFetchIndicator visible={isUpdatingResults} />
      </ScreenSection>

      <Card elevated style={{ marginBottom: spacing.block }}>
        <ScreenSection title={t('health.recordTypes')} compact>
          <FilterChips
            options={FILTER_TYPES}
            selected={selectedTypes}
            onToggle={toggleType}
            getLabel={type => RECORD_TYPE_LABELS[type]}
          />
        </ScreenSection>

        <SectionDivider />

        <ScreenSection title={t('health.popularTags')} compact>
          <FilterChips
            options={HEALTH_TAGS}
            selected={selectedTags}
            onToggle={toggleTag}
          />
        </ScreenSection>
      </Card>

      <SectionLabel title={t('health.results')} count={records.length} />
    </View>
  );

  if (isInitialLoading) {
    return (
      <ScreenContainer>
        <LoadingState message={t('common.loading')} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderItem={renderRecord}
        ListHeaderComponent={listHeader}
        renderSectionHeader={({ section: { title } }) => (
          <View
            style={[
              styles.monthHeader,
              {
                backgroundColor: colors.background,
                marginTop: spacing.sm,
                marginBottom: spacing.sm,
                paddingVertical: spacing.xs,
              },
            ]}>
            <AppText variant="label" color={colors.textSecondary}>
              {title}
            </AppText>
          </View>
        )}
        stickySectionHeadersEnabled={false}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.4}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={7}
        removeClippedSubviews
        ListEmptyComponent={
          <EmptyState
            title="No health records found"
            description="Try another filter or search term."
            icon="document-text-outline"
          />
        }
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />
        }
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  monthHeader: {
    width: '100%',
  },
});
