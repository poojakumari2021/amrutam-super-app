import React, { memo } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  type ListRenderItem,
} from 'react-native';
import { useTheme } from '@/core/theme/ThemeProvider';
import { AppText } from '@/shared/components/AppText';

type Props<T extends string> = {
  options: readonly T[];
  selected: T[];
  onToggle: (value: T) => void;
  getLabel?: (value: T) => string;
};

function FilterChipsInner<T extends string>({
  options,
  selected,
  onToggle,
  getLabel,
}: Props<T>) {
  const { colors, spacing, borderRadius } = useTheme();

  const renderItem: ListRenderItem<T> = ({ item }) => {
    const active = selected.includes(item);
    return (
      <Pressable
        onPress={() => onToggle(item)}
        accessibilityRole="button"
        accessibilityState={{ selected: active }}
        accessibilityLabel={getLabel?.(item) ?? item}
        style={{ marginRight: spacing.gutter }}>
        <AppText
          variant="caption"
          style={[
            styles.chip,
            {
              backgroundColor: active ? colors.primary : colors.surface,
              color: active ? '#FFF' : colors.text,
              borderColor: active ? colors.primary : colors.border,
              borderRadius: borderRadius.full,
            },
          ]}>
          {getLabel?.(item) ?? item}
        </AppText>
      </Pressable>
    );
  };

  return (
    <FlatList
      horizontal
      data={options as T[]}
      keyExtractor={item => item}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.row, { paddingRight: spacing.md }]}
    />
  );
}

export const FilterChips = memo(FilterChipsInner) as typeof FilterChipsInner;

const styles = StyleSheet.create({
  row: {
    paddingVertical: 2,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
  },
});
