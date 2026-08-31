import { selectCartCount, selectCartTotal } from '@/modules/shop/store/shopStore';
import type { CartItem } from '@/modules/shop/store/shopStore';

describe('cart business logic', () => {
  const cart: CartItem[] = [
    { productId: 'p1', name: 'Ashwagandha', price: 299, quantity: 2 },
    { productId: 'p2', name: 'Triphala', price: 199, quantity: 1 },
  ];

  it('calculates cart total', () => {
    expect(selectCartTotal(cart)).toBe(797);
  });

  it('calculates cart item count', () => {
    expect(selectCartCount(cart)).toBe(3);
  });
});
