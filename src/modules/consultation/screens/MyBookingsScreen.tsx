import React, { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  cancelBooking,
  fetchUpcomingBookings,
} from '@/modules/consultation/api/consultationApi';
import type { ConsultationStackParamList } from '@/app/navigation/types';
import type { Booking } from '@/modules/consultation/types';
import { useTheme } from '@/core/theme/ThemeProvider';
import { useI18n } from '@/core/i18n/I18nProvider';
import { AppText } from '@/shared/components/AppText';
import { Button } from '@/shared/components/Button';
import { Card } from '@/shared/components/Card';
import { EmptyState } from '@/shared/components/EmptyState';
import { LoadingState } from '@/shared/components/LoadingState';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { useToast } from '@/shared/components/ToastProvider';

type Props = NativeStackScreenProps<ConsultationStackParamList, 'MyBookings'>;

export function MyBookingsScreen({ navigation }: Props) {
  const { colors, spacing } = useTheme();
  const { t } = useI18n();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: fetchUpcomingBookings,
  });

  const activeBookings = useMemo(
    () => bookings.filter(b => b.status !== 'cancelled'),
    [bookings],
  );

  const cancelMutation = useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      showToast('Booking cancelled', 'success');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: () => showToast('Failed to cancel booking', 'error'),
  });

  const goToDoctors = useCallback(() => {
    navigation.navigate('DoctorList');
  }, [navigation]);

  const renderBooking = useCallback(
    ({ item }: { item: Booking }) => {
      const date = new Date(item.startTime).toLocaleString();
      return (
        <Card elevated>
          <AppText variant="h3">{item.doctorName}</AppText>
          <AppText variant="body" color={colors.textSecondary} style={{ marginTop: spacing.xs }}>
            {date}
          </AppText>
          <AppText variant="caption" style={{ marginTop: spacing.xs }}>
            Status: {item.status}
          </AppText>
          {item.status !== 'cancelled' ? (
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => cancelMutation.mutate(item.id)}
              style={{ marginTop: spacing.md }}
            />
          ) : null}
        </Card>
      );
    },
    [cancelMutation, colors.textSecondary, spacing.md, spacing.xs],
  );

  const bookCta = (
    <View style={{ marginTop: spacing.lg, marginBottom: spacing.md }}>
      <Button
        title={
          activeBookings.length === 0
            ? t('consult.bookConsultation')
            : t('consult.bookAnother')
        }
        onPress={goToDoctors}
      />
    </View>
  );

  if (isLoading) {
    return (
      <ScreenContainer edges={[]}>
        <LoadingState />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={[]}>
      <FlatList
        data={bookings}
        keyExtractor={item => item.id}
        renderItem={renderBooking}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListHeaderComponent={
          activeBookings.length > 0 ? (
            <AppText
              variant="caption"
              color={colors.textSecondary}
              style={{ marginBottom: spacing.md }}>
              {activeBookings.length} upcoming visit
              {activeBookings.length === 1 ? '' : 's'}
            </AppText>
          ) : undefined
        }
        ListEmptyComponent={
          <View>
            <EmptyState
              title="No upcoming bookings"
              description="Find a doctor and pick a time slot to get started."
              icon="calendar-outline"
            />
            {bookCta}
          </View>
        }
        ListFooterComponent={bookings.length > 0 ? bookCta : undefined}
        contentContainerStyle={[
          styles.list,
          { paddingTop: spacing.sm, paddingBottom: spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
  },
});
