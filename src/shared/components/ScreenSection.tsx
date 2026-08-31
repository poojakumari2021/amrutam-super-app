import React, { memo } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { useTheme } from '@/core/theme/ThemeProvider';
import { AppText } from '@/shared/components/AppText';

type Props = ViewProps & {
  title?: string;
  children: React.ReactNode;
  /** Tighter spacing for grouped filter cards. */
  compact?: boolean;
};

export const ScreenSection = memo(function ScreenSection({
  title,
  children,
  compact = false,
  style,
  ...rest
}: Props) {
  const { colors, spacing } = useTheme();
  const labelGap = compact ? spacing.sm : spacing.md;
  const contentGap = compact ? spacing.sm : spacing.md;

  return (
    <View style={[styles.section, style]} {...rest}>
      {title ? (
        <AppText
          variant="label"
          color={colors.textSecondary}
          style={{ marginBottom: labelGap }}>
          {title}
        </AppText>
      ) : null}
      <View style={{ gap: contentGap }}>{children}</View>
    </View>
  );
});

const styles = StyleSheet.create({
  section: {
    width: '100%',
  },
});
