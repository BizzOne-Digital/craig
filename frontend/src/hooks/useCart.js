import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MAX_QUANTITY = 20;

function computeItemCount(items) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

function computeSubtotal(items) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

function itemKey(productId, size, color) {
  return `${productId}::${size || ''}::${color || ''}`;
}

export const useCart = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (item) => {
        const quantity = Math.min(Math.max(1, item.quantity || 1), MAX_QUANTITY);
        const key = itemKey(item.productId, item.size, item.color);

        set((state) => {
          const existing = state.items.find(
            (entry) => itemKey(entry.productId, entry.size, entry.color) === key
          );

          if (existing) {
            return {
              items: state.items.map((entry) =>
                itemKey(entry.productId, entry.size, entry.color) === key
                  ? {
                      ...entry,
                      quantity: Math.min(entry.quantity + quantity, MAX_QUANTITY),
                    }
                  : entry
              ),
              isOpen: true,
            };
          }

          return {
            items: [
              ...state.items,
              {
                productId: item.productId,
                slug: item.slug,
                name: item.name,
                price: item.price,
                image: item.image || null,
                size: item.size || null,
                color: item.color || null,
                quantity,
              },
            ],
            isOpen: true,
          };
        });
      },

      removeItem: (productId, size = null, color = null) => {
        const key = itemKey(productId, size, color);
        set((state) => ({
          items: state.items.filter(
            (entry) => itemKey(entry.productId, entry.size, entry.color) !== key
          ),
        }));
      },

      updateQuantity: (productId, quantity, size = null, color = null) => {
        const key = itemKey(productId, size, color);
        const nextQuantity = Math.min(Math.max(0, quantity), MAX_QUANTITY);

        set((state) => {
          if (nextQuantity <= 0) {
            return {
              items: state.items.filter(
                (entry) => itemKey(entry.productId, entry.size, entry.color) !== key
              ),
            };
          }

          return {
            items: state.items.map((entry) =>
              itemKey(entry.productId, entry.size, entry.color) === key
                ? { ...entry, quantity: nextQuantity }
                : entry
            ),
          };
        });
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => computeItemCount(get().items),
      getSubtotal: () => computeSubtotal(get().items),
    }),
    {
      name: 'jlf-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export default useCart;
