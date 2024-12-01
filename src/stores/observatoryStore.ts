import { create } from 'zustand';
import type { ObservatoryItem, ObservatoryFilters, ImportError } from '../types/observatory';

interface ObservatoryState {
  items: ObservatoryItem[];
  filters: ObservatoryFilters;
  importErrors: ImportError[];
  setItems: (items: ObservatoryItem[]) => void;
  addItem: (item: Omit<ObservatoryItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: string, item: Partial<ObservatoryItem>) => void;
  deleteItem: (id: string) => void;
  setFilters: (filters: ObservatoryFilters) => void;
  setImportErrors: (errors: ImportError[]) => void;
  clearImportErrors: () => void;
}

export const useObservatoryStore = create<ObservatoryState>((set) => ({
  items: [],
  filters: {},
  importErrors: [],
  setItems: (items) => set({ items }),
  addItem: (itemData) => set((state) => ({
    items: [...state.items, {
      ...itemData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }],
  })),
  updateItem: (id, itemData) => set((state) => ({
    items: state.items.map((item) =>
      item.id === id
        ? { ...item, ...itemData, updatedAt: new Date().toISOString() }
        : item
    ),
  })),
  deleteItem: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id),
  })),
  setFilters: (filters) => set({ filters }),
  setImportErrors: (errors) => set({ importErrors: errors }),
  clearImportErrors: () => set({ importErrors: [] }),
}));