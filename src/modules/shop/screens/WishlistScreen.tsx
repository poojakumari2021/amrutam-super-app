import React, { useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ShopStackParamList } from '@/app/navigation/types';
import { fetchProductsByIds } from '@/modules/shop/api/shopApi';
import { useShopStore } from '@/modules/shop/store/shopStore';
import { useTheme } from '@/core/theme/ThemeProvider';
import { useI18n } from '@/core/i18n/I18nProvider';
import { formatCurrency } from '@/core/utils/helpers';
import { AppText } from '@/shared/components/AppText';
import { Button } from '@/shared/components/Button';
import { Card } from '@/shared/components/Card';
import { EmptyState } from '@/shared/components/EmptyState';
import { LoadingState } from '@/shared/components/LoadingState';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import type { Product } from '@/data/generators/productGenerator';

type Props = NativeStackScreenProps<ShopStackParamList, 'Wishlist'>;

export function WishlistScreen({ navigation }: Props) {
  const { colors, spacing } = useTheme();
  const { t } = useI18n();
  const wishlist = useShopStore(state => state.wishlist);
  const toggleWishlist = useShopStore(state => state.toggleWishlist);
  const addToCart = useShopStore(state => state.addToCart);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['wishlist-products', wishlist],
    queryFn: () => fetchProductsByIds(wishlist),
    enabled: wishlist.length > 0,
  });

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <Card elevated style={{ marginBottom: spacing.sm }}>
        <AppText variant="h3">{item.name}</AppText>
        <AppText variant="body" color={colors.textSecondary}>
          {formatCurrency(item.price)}
        </AppText>
        <Button
          title="Add to Cart"
          variant="outline"
          onPress={() =>
            addToCart({
              productId: item.id,
              name: item.name,
              price: item.price,
            })
          }
          style={{ marginTop: spacing.sm }}
        />
        <Button
          title="Remove"
          variant="secondary"
          onPress={() => toggleWishlist(item.id)}
          style={{ marginTop: spacing.sm }}
        />
      </Card>
    ),
    [addToCart, colors.textSecondary, spacing.sm, toggleWishlist],
  );

  if (isLoading && wishlist.length > 0) {
    return (
      <ScreenContainer>
        <LoadingState />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <AppText variant="h1" style={{ marginVertical: spacing.md }}>
        {t('shop.wishlist')}
      </AppText>
      <FlatList
        data={products}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <EmptyState title="Wishlist is empty" description="Save products you like." />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({});
