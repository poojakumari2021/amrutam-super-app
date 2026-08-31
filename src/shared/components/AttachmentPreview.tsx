import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/core/theme/ThemeProvider';
import { AppText } from '@/shared/components/AppText';

type Props = {
  type: 'image' | 'pdf';
  label: string;
};

export const AttachmentPreview = memo(function AttachmentPreview({
  type,
  label,
}: Props) {
  const { colors, spacing, borderRadius } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: colors.border,
          backgroundColor: colors.background,
          borderRadius: borderRadius.sm,
          padding: spacing.sm,
        },
      ]}
      accessibilityRole="image"
      accessibilityLabel={`${type} attachment ${label}`}>
      <View
        style={[
          styles.thumbnail,
          {
            backgroundColor: type === 'pdf' ? '#F5E6E4' : '#E4EDF5',
            borderRadius: borderRadius.sm,
          },
        ]}>
        <AppText variant="caption" style={{ fontWeight: '600' }}>
          {type === 'pdf' ? 'PDF' : 'IMG'}
        </AppText>
      </View>
      <View style={styles.meta}>
        <AppText variant="label" numberOfLines={1}>
          {label}
        </AppText>
        <AppText variant="caption" color={colors.textSecondary}>
          View attachment
        </AppText>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    marginTop: 8,
    gap: 10,
  },
  thumbnail: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: {
    flex: 1,
  },
});
