import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ZoomState {
  zoom: number;
  setZoom: (zoom: number) => void;
  increaseZoom: () => void;
  decreaseZoom: () => void;
  resetZoom: () => void;
}

export const useZoomStore = create<ZoomState>()(
  persist(
    (set) => ({
      zoom: 1,
      setZoom: (zoom) => set({ zoom: Math.min(Math.max(zoom, 0.8), 1.5) }),
      increaseZoom: () => set((state) => ({ zoom: Math.min(state.zoom + 0.1, 1.5) })),
      decreaseZoom: () => set((state) => ({ zoom: Math.max(state.zoom - 0.1, 0.8) })),
      resetZoom: () => set({ zoom: 1 }),
    }),
    {
      name: 'site-zoom-storage',
    }
  )
);
