import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { Doctor } from '@/data/generators/doctorGenerator';
import { useTheme } from '@/core/theme/ThemeProvider';
import { formatCurrency } from '@/core/utils/helpers';
import { AppText } from '@/shared/components/AppText';
import { Card } from '@/shared/components/Card';

type Props = {
  doctor: Doctor;
  onPress: (doctor: Doctor) => void;
};

function initials(name: string) {
  const parts = name.replace('Dr. ', '').split(' ');
  return parts
    .slice(0, 2)
    .map(p => p[0])
    .join('')
    .toUpperCase();
}

export const DoctorCard = memo(function DoctorCard({ doctor, onPress }: Props) {
  const { colors, spacing, borderRadius } = useTheme();

  const handlePress = useCallback(() => onPress(doctor), [doctor, onPress]);

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`${doctor.name}, ${doctor.specialization}`}>
      <Card elevated style={styles.card}>
        <View style={styles.row}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: colors.primaryLight, borderRadius: borderRadius.full },
            ]}>
            <AppText variant="label" style={{ color: '#fff' }}>
              {initials(doctor.name)}
            </AppText>
          </View>
          <View style={styles.info}>
            <AppText variant="h3">{doctor.name}</AppText>
            <AppText variant="body" color={colors.textSecondary} style={{ marginTop: spacing.xs }}>
              {doctor.specialization} · {doctor.city}
            </AppText>
            <AppText variant="caption" style={{ marginTop: spacing.sm }}>
              {doctor.experienceYears} yrs exp · ★ {doctor.rating} ·{' '}
              {formatCurrency(doctor.consultationFee)}
            </AppText>
          </View>
        </View>
        {doctor.availableToday ? (
          <AppText variant="caption" color={colors.success} style={{ marginTop: spacing.xs }}>
            Slots open today
          </AppText>
        ) : null}
      </Card>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    marginBottom: 0,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
});
