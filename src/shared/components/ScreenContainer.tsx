import React, { memo } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SCREEN_HORIZONTAL_PADDING } from '@/core/theme/layout';
import { useTheme } from '@/core/theme/ThemeProvider';

type Props = ViewProps & {
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
};

export const ScreenContainer = memo(function ScreenContainer({
  children,
  style,
  edges = ['top'],
  ...rest
}: Props) {
  const insets = useSafeAreaInsets();
  const { colors, spacing } = useTheme();

  const paddingLeft =
    SCREEN_HORIZONTAL_PADDING + (edges.includes('left') ? insets.left : 0);
  const paddingRight =
    SCREEN_HORIZONTAL_PADDING + (edges.includes('right') ? insets.right : 0);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: edges.includes('top') ? insets.top + spacing.sm : 0,
          paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
          paddingLeft,
          paddingRight,
        },
        style,
      ]}
      {...rest}>
      {children}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
