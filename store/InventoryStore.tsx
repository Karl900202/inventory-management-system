// store/inventoryStore.ts
"use client";
import { create } from "zustand";
import { Product } from "@/app/(main)/inventory/page";

interface InventoryState {
  products: Product[];
  totalProductCount: number;
  query: string;
  page: number;
  setProducts: (items: Product[]) => void;
  setTotalProductCount: (count: number) => void;
  setQuery: (q: string) => void;
  setPage: (p: number) => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  products: [],
  totalProductCount: 0,
  query: "",
  page: 1,
  setProducts: (items) => set({ products: items }),
  setTotalProductCount: (count) => set({ totalProductCount: count }),
  setQuery: (q) => set({ query: q }),
  setPage: (p) => set({ page: p }),
}));
