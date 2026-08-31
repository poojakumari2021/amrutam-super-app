import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '@/core/theme/ThemeProvider';
import { AppText } from '@/shared/components/AppText';

type Option<T extends string | number> = {
  label: string;
  value: T;
};

type Props<T extends string | number> = {
  options: Option<T>[];
  value?: T;
  onChange: (value: T | undefined) => void;
};

function OptionPillsInner<T extends string | number>({
  options,
  value,
  onChange,
}: Props<T>) {
  const { colors, spacing, borderRadius } = useTheme();

  return (
    <View style={[styles.row, { gap: spacing.gutter, rowGap: spacing.gutter }]}>
      {options.map(option => {
        const active = value === option.value;
        return (
          <Pressable
            key={String(option.value)}
            onPress={() => onChange(active ? undefined : option.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[
              styles.pill,
              {
                backgroundColor: active ? colors.primary : colors.surface,
                borderColor: active ? colors.primary : colors.border,
                borderRadius: borderRadius.full,
              },
            ]}>
            <AppText
              variant="caption"
              color={active ? '#FFF' : colors.textSecondary}>
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

export const OptionPills = memo(OptionPillsInner) as typeof OptionPillsInner;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
  },
});
