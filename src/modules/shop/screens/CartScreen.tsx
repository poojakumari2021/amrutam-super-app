import React, { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ShopStackParamList } from '@/app/navigation/types';
import { useCart } from '@/shared/hooks/useCart';
import type { CartItem } from '@/modules/shop/store/shopStore';
import { useTheme } from '@/core/theme/ThemeProvider';
import { useI18n } from '@/core/i18n/I18nProvider';
import { formatCurrency } from '@/core/utils/helpers';
import { AppText } from '@/shared/components/AppText';
import { Button } from '@/shared/components/Button';
import { Card } from '@/shared/components/Card';
import { EmptyState } from '@/shared/components/EmptyState';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { ScreenHeader } from '@/shared/components/ScreenHeader';

type Props = NativeStackScreenProps<ShopStackParamList, 'Cart'>;

export function CartScreen({ navigation }: Props) {
  const { colors, spacing } = useTheme();
  const { t } = useI18n();
  const { cart, total, increment, decrement } = useCart();

  const renderItem = useCallback(
    ({ item }: { item: CartItem }) => (
      <Card elevated style={{ marginBottom: spacing.sm }}>
        <AppText variant="h3">{item.name}</AppText>
        <AppText variant="body" color={colors.textSecondary}>
          {formatCurrency(item.price)} each
        </AppText>
        <View style={styles.qtyRow}>
          <Button
            title="−"
            variant="outline"
            onPress={() => decrement(item.productId)}
            accessibilityLabel="Decrease quantity"
            style={styles.qtyButton}
          />
          <AppText variant="body" style={{ marginHorizontal: spacing.md }}>
            {item.quantity}
          </AppText>
          <Button
            title="+"
            variant="outline"
            onPress={() => increment(item.productId)}
            accessibilityLabel="Increase quantity"
            style={styles.qtyButton}
          />
          <AppText variant="label" style={{ marginLeft: 'auto' }}>
            {formatCurrency(item.price * item.quantity)}
          </AppText>
        </View>
      </Card>
    ),
    [colors.textSecondary, decrement, increment, spacing.md, spacing.sm],
  );

  return (
    <ScreenContainer>
      <ScreenHeader title={t('shop.cart')} style={{ marginTop: spacing.md }} />
      <FlatList
        data={cart}
        keyExtractor={item => item.productId}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        ListEmptyComponent={
          <EmptyState
            title="Your cart is empty"
            description="Browse the shop and add items you like."
            icon="cart-outline"
          />
        }
        contentContainerStyle={{ paddingBottom: spacing.md }}
        showsVerticalScrollIndicator={false}
      />
      {cart.length > 0 ? (
        <View style={[styles.footer, { paddingVertical: spacing.md, gap: spacing.sm }]}>
          <AppText variant="h2">Total: {formatCurrency(total)}</AppText>
          <Button
            title={t('shop.checkout')}
            onPress={() => navigation.navigate('Checkout')}
          />
        </View>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  qtyButton: {
    minWidth: 44,
    paddingHorizontal: 8,
  },
  footer: {
    paddingVertical: 16,
    gap: 12,
  },
});
