import { create } from 'zustand';
import { persistentStorage, STORAGE_KEYS } from '@/core/storage/storage';

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

type ShopState = {
  cart: CartItem[];
  wishlist: string[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
};

async function persistCart(cart: CartItem[]) {
  // fire-and-forget — cart will re-hydrate on next launch if this fails
  await persistentStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
}

async function persistWishlist(wishlist: string[]) {
  await persistentStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(wishlist));
}

export const useShopStore = create<ShopState>((set, get) => ({
  cart: [],
  wishlist: [],
  hydrated: false,

  hydrate: async () => {
    const [cartRaw, wishlistRaw] = await Promise.all([
      persistentStorage.getItem(STORAGE_KEYS.cart),
      persistentStorage.getItem(STORAGE_KEYS.wishlist),
    ]);
    set({
      cart: cartRaw ? (JSON.parse(cartRaw) as CartItem[]) : [],
      wishlist: wishlistRaw ? (JSON.parse(wishlistRaw) as string[]) : [],
      hydrated: true,
    });
  },

  addToCart: (item, quantity = 1) => {
    const cart = [...get().cart];
    const existing = cart.find(c => c.productId === item.productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ ...item, quantity });
    }
    set({ cart });
    persistCart(cart);
  },

  updateQuantity: (productId, quantity) => {
    const cart =
      quantity <= 0
        ? get().cart.filter(c => c.productId !== productId)
        : get().cart.map(c =>
            c.productId === productId ? { ...c, quantity } : c,
          );
    set({ cart });
    persistCart(cart);
  },

  removeFromCart: productId => {
    const cart = get().cart.filter(c => c.productId !== productId);
    set({ cart });
    persistCart(cart);
  },

  clearCart: () => {
    set({ cart: [] });
    persistCart([]);
  },

  toggleWishlist: productId => {
    const wishlist = get().wishlist.includes(productId)
      ? get().wishlist.filter(id => id !== productId)
      : [...get().wishlist, productId];
    set({ wishlist });
    persistWishlist(wishlist);
  },

  isInWishlist: productId => get().wishlist.includes(productId),
}));

export const selectCartTotal = (cart: CartItem[]) =>
  cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const selectCartCount = (cart: CartItem[]) =>
  cart.reduce((sum, item) => sum + item.quantity, 0);
