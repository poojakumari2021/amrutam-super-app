import React, { memo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTheme } from '@/core/theme/ThemeProvider';
import { AppText } from '@/shared/components/AppText';

type Props = {
  message?: string;
};

export const LoadingState = memo(function LoadingState({
  message = 'Loading...',
}: Props) {
  const { colors, spacing } = useTheme();

  return (
    <View style={styles.container} accessibilityRole="progressbar">
      <ActivityIndicator size="large" color={colors.primary} />
      <AppText variant="body" color={colors.textSecondary} style={{ marginTop: spacing.md }}>
        {message}
      </AppText>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});
