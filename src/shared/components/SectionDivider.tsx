import React, { memo } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { useTheme } from '@/core/theme/ThemeProvider';

type Props = ViewProps;

export const SectionDivider = memo(function SectionDivider({ style, ...rest }: Props) {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.wrapper, { marginVertical: spacing.sm }, style]} {...rest}>
      <View style={[styles.line, { backgroundColor: colors.border }]} />
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  line: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
});
