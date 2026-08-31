import React, { memo } from 'react';
import {
  Text,
  type TextProps,
  type TextStyle,
} from 'react-native';
import { useTheme } from '@/core/theme/ThemeProvider';
import { typography } from '@/core/theme/tokens';

type Variant = keyof typeof typography;

type Props = TextProps & {
  variant?: Variant;
  color?: string;
};

export const AppText = memo(function AppText({
  variant = 'body',
  color,
  style,
  children,
  ...rest
}: Props) {
  const { colors } = useTheme();
  const variantStyle = typography[variant] as TextStyle;

  return (
    <Text
      style={[{ color: color ?? colors.text }, variantStyle, style]}
      accessibilityRole={variant.startsWith('h') ? 'header' : 'text'}
      {...rest}>
      {children}
    </Text>
  );
});
