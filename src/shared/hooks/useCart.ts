import { useCallback, useMemo } from 'react';
import {
  selectCartCount,
  selectCartTotal,
  useShopStore,
} from '@/modules/shop/store/shopStore';

export function useCart() {
  const cart = useShopStore(state => state.cart);
  const addToCart = useShopStore(state => state.addToCart);
  const updateQuantity = useShopStore(state => state.updateQuantity);
  const removeFromCart = useShopStore(state => state.removeFromCart);
  const clearCart = useShopStore(state => state.clearCart);

  const total = useMemo(() => selectCartTotal(cart), [cart]);
  const count = useMemo(() => selectCartCount(cart), [cart]);

  const increment = useCallback(
    (productId: string) => {
      const item = cart.find(c => c.productId === productId);
      if (item) {
        updateQuantity(productId, item.quantity + 1);
      }
    },
    [cart, updateQuantity],
  );

  const decrement = useCallback(
    (productId: string) => {
      const item = cart.find(c => c.productId === productId);
      if (item) {
        updateQuantity(productId, item.quantity - 1);
      }
    },
    [cart, updateQuantity],
  );

  return {
    cart,
    total,
    count,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    increment,
    decrement,
  };
}
