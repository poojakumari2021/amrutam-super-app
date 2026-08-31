import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fetchProductById } from '@/modules/shop/api/shopApi';
import type { ShopStackParamList } from '@/app/navigation/types';
import { useTheme } from '@/core/theme/ThemeProvider';
import { formatCurrency } from '@/core/utils/helpers';
import { AppText } from '@/shared/components/AppText';
import { Button } from '@/shared/components/Button';
import { Card } from '@/shared/components/Card';
import { LoadingState } from '@/shared/components/LoadingState';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { useToast } from '@/shared/components/ToastProvider';
import { useShopStore } from '@/modules/shop/store/shopStore';

type Props = NativeStackScreenProps<ShopStackParamList, 'ProductDetail'>;

export function ProductDetailScreen({ route, navigation }: Props) {
  const { productId } = route.params;
  const { colors, spacing } = useTheme();
  const { showToast } = useToast();
  const addToCart = useShopStore(state => state.addToCart);
  const toggleWishlist = useShopStore(state => state.toggleWishlist);
  const isInWishlist = useShopStore(state => state.isInWishlist(productId));

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProductById(productId),
  });

  if (isLoading || !product) {
    return (
      <ScreenContainer>
        <LoadingState />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Card elevated style={{ marginTop: spacing.md }}>
        <AppText variant="h2">{product.name}</AppText>
        <AppText variant="body" color={colors.textSecondary}>
          {product.category}
        </AppText>
        <AppText variant="h1" style={{ marginVertical: spacing.md }}>
          {formatCurrency(product.price)}
        </AppText>
        <AppText variant="body">{product.description}</AppText>
        <AppText variant="caption" style={{ marginTop: spacing.sm }}>
          ★ {product.rating} ({product.reviewCount} reviews)
        </AppText>
      </Card>

      <View style={styles.actions}>
        <Button
          title={isInWishlist ? 'In Wishlist ♥' : 'Add to Wishlist'}
          variant="outline"
          onPress={() => {
            toggleWishlist(productId);
            showToast(
              isInWishlist ? 'Removed from wishlist' : 'Added to wishlist',
              'success',
            );
          }}
        />
        <Button
          title="Add to Cart"
          disabled={!product.inStock}
          onPress={() => {
            addToCart({
              productId: product.id,
              name: product.name,
              price: product.price,
            });
            showToast('Added to cart', 'success');
          }}
        />
        <Button
          title="View Cart"
          variant="secondary"
          onPress={() => navigation.navigate('Cart')}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  actions: {
    marginTop: 24,
    gap: 12,
  },
});
