import React, { memo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type PressableProps,
} from 'react-native';
import { useTheme } from '@/core/theme/ThemeProvider';
import { AppText } from '@/shared/components/AppText';

type Props = PressableProps & {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
};

export const Button = memo(function Button({
  title,
  variant = 'primary',
  loading = false,
  disabled,
  style,
  ...rest
}: Props) {
  const { colors, spacing, borderRadius } = useTheme();

  const backgroundColor =
    variant === 'primary'
      ? colors.primary
      : variant === 'secondary'
        ? colors.secondary
        : 'transparent';

  const textColor =
    variant === 'outline' ? colors.primary : '#FFFFFF';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor,
          borderColor: colors.primary,
          borderWidth: variant === 'outline' ? 1 : 0,
          borderRadius: borderRadius.md,
          paddingVertical: spacing.sm + 4,
          paddingHorizontal: spacing.lg,
          opacity: pressed ? 0.85 : 1,
        },
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <AppText variant="label" style={{ color: textColor, textAlign: 'center' }}>
          {title}
        </AppText>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
});
