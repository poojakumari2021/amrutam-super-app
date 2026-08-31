import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { Product } from '@/data/generators/productGenerator';
import { useTheme } from '@/core/theme/ThemeProvider';
import { formatCurrency } from '@/core/utils/helpers';
import { AppText } from '@/shared/components/AppText';
import { Card } from '@/shared/components/Card';

type Props = {
  product: Product;
  onPress: (product: Product) => void;
};

const ACCENT = ['#E8DFD4', '#D4E8D8', '#F0E4D4', '#E4DFF0', '#DFE8F0'];

function accentFor(category: string) {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + hash;
  }
  return ACCENT[Math.abs(hash) % ACCENT.length]!;
}

export const ProductCard = memo(function ProductCard({ product, onPress }: Props) {
  const { colors, spacing } = useTheme();

  const handlePress = useCallback(() => onPress(product), [product, onPress]);

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={product.name}
      style={styles.wrapper}>
      <Card elevated style={styles.card}>
        <View
          style={[
            styles.strip,
            { backgroundColor: accentFor(product.category), marginBottom: spacing.sm },
          ]}
        />
        <AppText variant="label" numberOfLines={2}>
          {product.name}
        </AppText>
        <AppText variant="caption" color={colors.textSecondary} style={{ marginTop: spacing.xs }}>
          {product.category}
        </AppText>
        <AppText variant="h3" style={{ marginTop: spacing.sm }}>
          {formatCurrency(product.price)}
        </AppText>
        <AppText variant="caption" color={colors.textSecondary} style={{ marginTop: spacing.xs }}>
          ★ {product.rating}
          {product.reviewCount > 100 ? ' · Popular' : ''}
        </AppText>
        {!product.inStock ? (
          <AppText variant="caption" color={colors.error} style={{ marginTop: 4 }}>
            Sold out
          </AppText>
        ) : null}
      </Card>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  card: {
    overflow: 'hidden',
    paddingTop: 0,
  },
  strip: {
    height: 6,
    marginHorizontal: -16,
    marginTop: -16,
  },
});
