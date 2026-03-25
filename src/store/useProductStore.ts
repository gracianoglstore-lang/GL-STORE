import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';
import { PRODUCTS } from '../constants';

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewsCount' | 'brand'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProduct: (id: string) => Product | undefined;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: PRODUCTS,
      isLoading: false,
      error: null,

      fetchProducts: async () => {
        set({ isLoading: true });
        try {
          const response = await fetch('/api/products');
          if (!response.ok) throw new Error('Failed to fetch products');
          const data = await response.json();
          
          // Migration/Sync logic: if server is empty but we have local products, re-upload them
          const localProducts = get().products;
          if (data.length === 0 && localProducts.length > 0 && JSON.stringify(localProducts) !== JSON.stringify(PRODUCTS)) {
            console.log(`Restoring ${localProducts.length} products to server...`);
            for (const p of localProducts) {
              // Skip default products if they are already in the constants
              if (PRODUCTS.some(cp => cp.id === p.id)) continue;
              
              await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(p),
              });
            }
            // Fetch again after restoration
            const finalResponse = await fetch('/api/products');
            const finalData = await finalResponse.json();
            set({ products: finalData.length > 0 ? finalData : PRODUCTS, error: null });
            return;
          }
          
          set({ products: data.length > 0 ? data : PRODUCTS, error: null });
        } catch (error) {
          console.error('Fetch error:', error);
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      addProduct: async (newProduct) => {
        const tempId = 'temp-' + Math.random().toString(36).substr(2, 9);
        const optimisticProduct = { 
          ...newProduct, 
          id: tempId, 
          rating: 5.0, 
          reviewsCount: 0, 
          brand: 'Site Brand',
          featured: !!newProduct.featured,
          createdAt: new Date().toISOString()
        } as Product;

        const previousProducts = get().products;
        set((state) => ({ 
          products: [optimisticProduct, ...state.products],
          error: null 
        }));

        try {
          const response = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct),
          });
          if (!response.ok) throw new Error('Failed to add product');
          const product = await response.json();
          
          set((state) => ({ 
            products: state.products.map(p => p.id === tempId ? product : p),
            error: null 
          }));
        } catch (error) {
          set({ products: previousProducts, error: (error as Error).message });
          throw error;
        }
      },

      updateProduct: async (id, updatedProduct) => {
        const previousProducts = get().products;
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p)),
          error: null
        }));

        try {
          const response = await fetch(`/api/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProduct),
          });
          if (!response.ok) throw new Error('Failed to update product');
          const product = await response.json();
          
          set((state) => ({
            products: state.products.map((p) => (p.id === id ? { ...p, ...product } : p)),
            error: null
          }));
        } catch (error) {
          set({ products: previousProducts, error: (error as Error).message });
          throw error;
        }
      },

      deleteProduct: async (id) => {
        const previousProducts = get().products;
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
          error: null
        }));

        try {
          const response = await fetch(`/api/products/${id}`, {
            method: 'DELETE',
          });
          if (!response.ok) throw new Error('Failed to delete product');
        } catch (error) {
          set({ products: previousProducts, error: (error as Error).message });
          throw error;
        }
      },

      getProduct: (id) => {
        return get().products.find((p) => p.id === id);
      },
    }),
    {
      name: 'site-products-storage',
      partialize: (state) => ({ products: state.products }),
    }
  )
);
