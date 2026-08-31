import React, { memo } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { useTheme } from '@/core/theme/ThemeProvider';
import { AppText } from '@/shared/components/AppText';

type Props = ViewProps & {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
};

export const ScreenHeader = memo(function ScreenHeader({
  title,
  subtitle,
  right,
  style,
  ...rest
}: Props) {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.row, { marginBottom: spacing.block }, style]} {...rest}>
      <View style={styles.textBlock}>
        <AppText variant="h1">{title}</AppText>
        {subtitle ? (
          <AppText
            variant="body"
            color={colors.textSecondary}
            style={{ marginTop: spacing.xs }}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {right ? <View style={[styles.right, { gap: spacing.md }]}>{right}</View> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  textBlock: {
    flex: 1,
    paddingRight: 8,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 2,
  },
});
