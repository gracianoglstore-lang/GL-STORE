import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  savedItems: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  saveForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  removeSavedItem: (productId: string) => void;
  clearCart: () => void;
  removeSelectedItems: () => void;
  selectedItems: string[];
  toggleSelectItem: (productId: string) => void;
  toggleSelectAll: (selected: boolean) => void;
  discount: number;
  applyDiscount: (code: string) => boolean;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      savedItems: [],
      addItem: (product) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === product.id);
        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ),
          });
        } else {
          set({ 
            items: [...items, { ...product, quantity: 1 }],
            selectedItems: [...get().selectedItems, product.id] // Auto select new items
          });
        }
      },
      removeItem: (productId) => {
        set({ 
          items: get().items.filter((item) => item.id !== productId),
          selectedItems: get().selectedItems.filter(id => id !== productId)
        });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        });
      },
      saveForLater: (productId) => {
        const item = get().items.find(i => i.id === productId);
        if (item) {
          set({
            items: get().items.filter(i => i.id !== productId),
            savedItems: [...get().savedItems, item]
          });
        }
      },
      moveToCart: (productId) => {
        const item = get().savedItems.find(i => i.id === productId);
        if (item) {
          set({
            savedItems: get().savedItems.filter(i => i.id !== productId),
            items: [...get().items, item]
          });
        }
      },
      removeSavedItem: (productId) => {
        set({ savedItems: get().savedItems.filter(i => i.id !== productId) });
      },
      clearCart: () => set({ items: [], selectedItems: [] }),
      removeSelectedItems: () => {
        const selected = get().selectedItems;
        set({
          items: get().items.filter(item => !selected.includes(item.id)),
          selectedItems: []
        });
      },
      selectedItems: [],
      toggleSelectItem: (productId) => {
        const selected = get().selectedItems;
        if (selected.includes(productId)) {
          set({ selectedItems: selected.filter(id => id !== productId) });
        } else {
          set({ selectedItems: [...selected, productId] });
        }
      },
      toggleSelectAll: (selected) => {
        if (selected) {
          set({ selectedItems: get().items.map(i => i.id) });
        } else {
          set({ selectedItems: [] });
        }
      },
      discount: 0,
      applyDiscount: (code: string) => {
        if (code.toUpperCase() === 'SITE10') {
          set({ discount: 0.1 }); // 10% discount
          return true;
        }
        return false;
      },
      total: () => {
        const selectedIds = get().selectedItems;
        const subtotal = get().items
          .filter(item => selectedIds.includes(item.id))
          .reduce((acc, item) => acc + item.price * item.quantity, 0);
        return subtotal * (1 - get().discount);
      },
    }),
    {
      name: 'site-cart-storage',
    }
  )
);
