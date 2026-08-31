import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ShopStackParamList } from '@/app/navigation/types';
import {
  selectCartTotal,
  useShopStore,
} from '@/modules/shop/store/shopStore';
import { useTheme } from '@/core/theme/ThemeProvider';
import { useI18n } from '@/core/i18n/I18nProvider';
import { formatCurrency } from '@/core/utils/helpers';
import { AppText } from '@/shared/components/AppText';
import { Button } from '@/shared/components/Button';
import { Card } from '@/shared/components/Card';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { useToast } from '@/shared/components/ToastProvider';

type Props = NativeStackScreenProps<ShopStackParamList, 'Checkout'>;

export function CheckoutScreen({ navigation }: Props) {
  const { spacing, colors } = useTheme();
  const { showToast } = useToast();
  const { t } = useI18n();
  const cart = useShopStore(state => state.cart);
  const clearCart = useShopStore(state => state.clearCart);
  const subtotal = selectCartTotal(cart);
  const delivery = subtotal > 500 ? 0 : 49;
  const total = subtotal + delivery;

  const handlePlaceOrder = () => {
    clearCart();
    showToast('Done — we\'ll confirm by SMS', 'success');
    navigation.popToTop();
  };

  return (
    <ScreenContainer>
      <AppText variant="h1" style={{ marginVertical: spacing.md }}>
        Review order
      </AppText>
      <Card elevated>
        <AppText variant="body">{cart.length} item{cart.length === 1 ? '' : 's'}</AppText>
        <AppText variant="body" style={{ marginTop: spacing.sm }}>
          Subtotal {formatCurrency(subtotal)}
        </AppText>
        <AppText variant="body" color={colors.textSecondary}>
          Delivery {delivery === 0 ? 'Free' : formatCurrency(delivery)}
          {subtotal <= 500 ? ' (free over ₹500)' : ''}
        </AppText>
        <AppText variant="h2" style={{ marginTop: spacing.md }}>
          {formatCurrency(total)}
        </AppText>
      </Card>
      <View style={styles.footer}>
        <Button title={t('shop.checkout')} onPress={handlePlaceOrder} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: 24,
  },
});
