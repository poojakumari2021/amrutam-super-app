import React, { memo } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { useTheme } from '@/core/theme/ThemeProvider';

type Props = ViewProps & {
  elevated?: boolean;
};

export const Card = memo(function Card({
  children,
  style,
  elevated = false,
  ...rest
}: Props) {
  const { colors, spacing, borderRadius } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: borderRadius.md,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.md,
        },
        elevated && styles.elevated,
        style,
      ]}
      {...rest}>
      {children}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
});
