import React, { memo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTheme } from '@/core/theme/ThemeProvider';
import { AppText } from '@/shared/components/AppText';

type Props = {
  visible: boolean;
  message?: string;
};

export const ListFetchIndicator = memo(function ListFetchIndicator({
  visible,
  message = 'Updating results…',
}: Props) {
  const { colors, spacing } = useTheme();

  if (!visible) {
    return null;
  }

  return (
    <View style={[styles.row, { marginTop: spacing.sm, marginBottom: spacing.xs }]}>
      <ActivityIndicator size="small" color={colors.primary} />
      <AppText variant="caption" color={colors.textSecondary}>
        {message}
      </AppText>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
