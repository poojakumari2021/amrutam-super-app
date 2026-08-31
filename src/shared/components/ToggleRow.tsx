import React, { memo } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { useTheme } from '@/core/theme/ThemeProvider';
import { AppText } from '@/shared/components/AppText';

type Props = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel?: string;
};

export const ToggleRow = memo(function ToggleRow({
  label,
  value,
  onValueChange,
  accessibilityLabel,
}: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <AppText variant="body">{label}</AppText>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.primaryLight }}
        thumbColor={value ? colors.primary : colors.surface}
        accessibilityLabel={accessibilityLabel ?? label}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
});
