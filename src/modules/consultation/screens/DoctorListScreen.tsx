import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, RefreshControl, View } from 'react-native';
import { useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fetchDoctors } from '@/modules/consultation/api/consultationApi';
import { DoctorCard } from '@/modules/consultation/components/DoctorCard';
import { useConsultationStore } from '@/modules/consultation/store/consultationStore';
import type { ConsultationStackParamList } from '@/app/navigation/types';
import type { Doctor } from '@/data/generators/doctorGenerator';
import { useTheme } from '@/core/theme/ThemeProvider';
import { useI18n } from '@/core/i18n/I18nProvider';
import { useDebouncedSearch } from '@/shared/hooks/useDebouncedSearch';
import { AppIcon } from '@/shared/components/AppIcon';
import { Card } from '@/shared/components/Card';
import { EmptyState } from '@/shared/components/EmptyState';
import { FilterChips } from '@/shared/components/FilterChips';
import { ListFetchIndicator } from '@/shared/components/ListFetchIndicator';
import { LoadingState } from '@/shared/components/LoadingState';
import { OptionPills } from '@/shared/components/OptionPills';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { ScreenSection } from '@/shared/components/ScreenSection';
import { SearchBar } from '@/shared/components/SearchBar';
import { SectionDivider } from '@/shared/components/SectionDivider';
import { SectionLabel } from '@/shared/components/SectionLabel';
import { ToggleRow } from '@/shared/components/ToggleRow';

type Props = NativeStackScreenProps<ConsultationStackParamList, 'DoctorList'>;

const SPECIALIZATIONS = [
  'Ayurveda',
  'Panchakarma',
  'Yoga Therapy',
  'Naturopathy',
  'Herbal Medicine',
] as const;

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Jaipur'] as const;

const RATING_OPTIONS = [
  { label: '★ 4+', value: 4 },
  { label: '★ 4.5+', value: 4.5 },
] as const;

export function DoctorListScreen({ navigation }: Props) {
  const { colors, spacing } = useTheme();
  const { t } = useI18n();
  const { filters, setFilters } = useConsultationStore();
  const [localSearch, debouncedSearch, setLocalSearch] = useDebouncedSearch();
  const [minRating, setMinRating] = useState<number | undefined>(undefined);

  const { data, isLoading, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage, refetch, isRefetching } =
    useInfiniteQuery({
      queryKey: ['doctors', debouncedSearch, filters, minRating],
      queryFn: ({ pageParam }) =>
        fetchDoctors({
          page: pageParam,
          search: debouncedSearch,
          filters: { ...filters, minRating },
        }),
      initialPageParam: 1,
      getNextPageParam: lastPage =>
        lastPage.hasMore ? lastPage.page + 1 : undefined,
      placeholderData: keepPreviousData,
    });

  const doctors = data?.pages.flatMap(page => page.items) ?? [];
  const isInitialLoading = isLoading && doctors.length === 0;
  const isUpdatingResults = isFetching && !isFetchingNextPage && !isInitialLoading;

  const handleDoctorPress = useCallback(
    (doctor: Doctor) => navigation.navigate('DoctorDetail', { doctorId: doctor.id }),
    [navigation],
  );

  const listHeader = (
    <View style={{ paddingBottom: spacing.sm }}>
      <ScreenHeader
        title={t('consult.title')}
        subtitle={t('consult.subtitle')}
        right={
          <Pressable
            onPress={() => navigation.navigate('MyBookings')}
            accessibilityRole="button"
            accessibilityLabel={t('consult.bookings')}
            hitSlop={8}>
            <AppIcon name="calendar-outline" size={24} color={colors.primary} />
          </Pressable>
        }
      />

      <ScreenSection style={{ marginBottom: spacing.block }}>
        <SearchBar
          value={localSearch}
          onChangeText={setLocalSearch}
          placeholder={t('consult.search')}
        />
        <ListFetchIndicator visible={isUpdatingResults} />
      </ScreenSection>

      <Card elevated style={{ marginBottom: spacing.block }}>
        <ScreenSection title={t('consult.specialty')} compact>
          <FilterChips
            options={SPECIALIZATIONS}
            selected={filters.specialization ? [filters.specialization] : []}
            onToggle={spec =>
              setFilters({
                ...filters,
                specialization: filters.specialization === spec ? undefined : spec,
              })
            }
          />
        </ScreenSection>

        <SectionDivider />

        <ScreenSection title={t('consult.location')} compact>
          <FilterChips
            options={CITIES}
            selected={filters.city ? [filters.city] : []}
            onToggle={city =>
              setFilters({
                ...filters,
                city: filters.city === city ? undefined : city,
              })
            }
          />
        </ScreenSection>

        <SectionDivider />

        <ScreenSection title={t('consult.preferences')} compact>
          <ToggleRow
            label={t('consult.availableToday')}
            value={filters.availableToday ?? false}
            onValueChange={value =>
              setFilters({ ...filters, availableToday: value || undefined })
            }
          />
          <OptionPills
            options={[...RATING_OPTIONS]}
            value={minRating}
            onChange={setMinRating}
          />
        </ScreenSection>
      </Card>

      <SectionLabel title={t('consult.results')} count={doctors.length} />
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
      <FlatList
        data={doctors}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <DoctorCard doctor={item} onPress={handleDoctorPress} />
        )}
        ListHeaderComponent={listHeader}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        initialNumToRender={12}
        maxToRenderPerBatch={10}
        windowSize={7}
        removeClippedSubviews
        ListEmptyComponent={
          <EmptyState
            title="No doctors found"
            description="Try a different specialty or city."
            icon="medkit-outline"
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
