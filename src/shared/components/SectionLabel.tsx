import React, { memo } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { useTheme } from '@/core/theme/ThemeProvider';
import { AppText } from '@/shared/components/AppText';

type Props = ViewProps & {
  title: string;
  count?: number;
};

export const SectionLabel = memo(function SectionLabel({
  title,
  count,
  style,
  ...rest
}: Props) {
  const { colors, spacing } = useTheme();

  return (
    <View
      style={[
        styles.row,
        { marginTop: spacing.sm, marginBottom: spacing.md },
        style,
      ]}
      {...rest}>
      <AppText variant="h3">{title}</AppText>
      {count !== undefined ? (
        <AppText variant="caption" color={colors.textSecondary}>
          {count}
        </AppText>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
