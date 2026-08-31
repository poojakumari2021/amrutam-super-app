import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ShopStackParamList } from '@/app/navigation/types';
import { ProductListScreen } from '@/modules/shop/screens/ProductListScreen';
import { ProductDetailScreen } from '@/modules/shop/screens/ProductDetailScreen';
import { CartScreen } from '@/modules/shop/screens/CartScreen';
import { CheckoutScreen } from '@/modules/shop/screens/CheckoutScreen';
import { WishlistScreen } from '@/modules/shop/screens/WishlistScreen';
import { useTheme } from '@/core/theme/ThemeProvider';

const Stack = createNativeStackNavigator<ShopStackParamList>();

export function ShopNavigator() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}>
      <Stack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Product' }}
      />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="Wishlist" component={WishlistScreen} />
    </Stack.Navigator>
  );
}
