import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  fetchDoctorById,
  fetchDoctorSlots,
} from '@/modules/consultation/api/consultationApi';
import type { ConsultationStackParamList } from '@/app/navigation/types';
import { useTheme } from '@/core/theme/ThemeProvider';
import { useI18n } from '@/core/i18n/I18nProvider';
import { formatCurrency } from '@/core/utils/helpers';
import { useBooking } from '@/shared/hooks/useBooking';
import { AppText } from '@/shared/components/AppText';
import { Button } from '@/shared/components/Button';
import { Card } from '@/shared/components/Card';
import { LoadingState } from '@/shared/components/LoadingState';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { ScreenSection } from '@/shared/components/ScreenSection';
import { SectionDivider } from '@/shared/components/SectionDivider';
import { useToast } from '@/shared/components/ToastProvider';
import type { TimeSlot } from '@/modules/consultation/types';

type Props = NativeStackScreenProps<ConsultationStackParamList, 'DoctorDetail'>;

export function DoctorDetailScreen({ route, navigation }: Props) {
  const { doctorId } = route.params;
  const { colors, spacing, borderRadius } = useTheme();
  const { t } = useI18n();
  const { showToast } = useToast();
  const { book, isBooking, getErrorMessage } = useBooking();
  const today = new Date().toISOString().split('T')[0]!;
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const { data: doctor, isLoading } = useQuery({
    queryKey: ['doctor', doctorId],
    queryFn: () => fetchDoctorById(doctorId),
  });

  const { data: slots = [] } = useQuery({
    queryKey: ['slots', doctorId, today],
    queryFn: () => fetchDoctorSlots(doctorId, today),
    enabled: !!doctorId,
  });

  const handleBook = useCallback(async () => {
    if (!doctor || !selectedSlot) {
      return;
    }
    try {
      await book({
        doctorId: doctor.id,
        doctorName: doctor.name,
        slot: selectedSlot,
      });
      showToast('Booked!', 'success');
      navigation.navigate('MyBookings');
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    }
  }, [book, doctor, getErrorMessage, navigation, selectedSlot, showToast]);

  if (isLoading || !doctor) {
    return (
      <ScreenContainer edges={[]}>
        <LoadingState />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={[]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: spacing.xl }]}>
        <Card elevated style={{ marginTop: spacing.sm }}>
          <AppText variant="h2">{doctor.name}</AppText>
          <AppText variant="body" color={colors.textSecondary} style={{ marginTop: spacing.xs }}>
            {doctor.specialization} · {doctor.city}
          </AppText>
          <AppText variant="body" style={{ marginTop: spacing.md }}>
            {doctor.bio}
          </AppText>
          <SectionDivider />
          <AppText variant="label">
            Fee: {formatCurrency(doctor.consultationFee)} · ★ {doctor.rating}
          </AppText>
        </Card>

        <ScreenSection title={t('consult.pickSlot')} style={{ marginTop: spacing.lg }}>
          <View style={[styles.slotGrid, { gap: spacing.gutter }]}>
            {slots.map(slot => {
              const time = new Date(slot.startTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });
              const isSelected = selectedSlot?.id === slot.id;
              const isAvailable = slot.isAvailable;

              return (
                <Pressable
                  key={slot.id}
                  onPress={() => isAvailable && setSelectedSlot(slot)}
                  disabled={!isAvailable}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected, disabled: !isAvailable }}
                  style={[
                    styles.slot,
                    {
                      borderColor: isSelected ? colors.primary : colors.border,
                      backgroundColor: isSelected
                        ? colors.primary
                        : isAvailable
                          ? colors.surface
                          : colors.border,
                      borderRadius: borderRadius.md,
                      opacity: isAvailable ? 1 : 0.5,
                    },
                  ]}>
                  <AppText
                    variant="label"
                    style={{
                      color: isSelected ? '#FFF' : colors.text,
                      textAlign: 'center',
                    }}>
                    {time}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </ScreenSection>

        <View style={{ marginTop: spacing.lg }}>
          <Button
            title={t('consult.confirmBooking')}
            loading={isBooking}
            disabled={!selectedSlot}
            onPress={handleBook}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  slot: {
    width: '31%',
    minHeight: 44,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 10,
  },
});
