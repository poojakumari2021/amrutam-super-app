import React, { memo } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { useTheme } from '@/core/theme/ThemeProvider';
import { AppIcon } from '@/shared/components/AppIcon';

type Props = TextInputProps & {
  label?: string;
};

export const SearchBar = memo(function SearchBar({
  style,
  placeholder = 'Search...',
  ...rest
}: Props) {
  const { colors, spacing, borderRadius } = useTheme();

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
          paddingHorizontal: spacing.sm,
        },
        style,
      ]}>
      <AppIcon name="search-outline" size={20} color={colors.textSecondary} />
      <TextInput
        accessibilityLabel={rest.accessibilityLabel ?? placeholder}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        style={[
          styles.input,
          {
            color: colors.text,
            paddingVertical: spacing.sm + 2,
            paddingHorizontal: spacing.sm,
          },
        ]}
        returnKeyType="search"
        clearButtonMode="while-editing"
        {...rest}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    minHeight: 44,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
});
