import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/core/theme/ThemeProvider';
import { AppIcon } from '@/shared/components/AppIcon';
import { AppText } from '@/shared/components/AppText';

type Props = {
  title?: string;
  description?: string;
  icon?: React.ComponentProps<typeof AppIcon>['name'];
};

export const EmptyState = memo(function EmptyState({
  title = 'Nothing here yet',
  description,
  icon = 'leaf-outline',
}: Props) {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { padding: spacing.xl }]} accessibilityRole="text">
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: colors.primary + '14',
            marginBottom: spacing.md,
          },
        ]}>
        <AppIcon name={icon} size={32} color={colors.primary} />
      </View>
      <AppText variant="h3" style={{ textAlign: 'center' }}>
        {title}
      </AppText>
      {description ? (
        <AppText
          variant="body"
          color={colors.textSecondary}
          style={{ marginTop: spacing.sm, textAlign: 'center' }}>
          {description}
        </AppText>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
