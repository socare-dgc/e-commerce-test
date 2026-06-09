import { create } from 'zustand'
import type { Product } from './types'

type DialogMode = 'closed' | 'create' | 'edit'

interface ProductsUIState {
  dialogMode: DialogMode
  editingProduct: Product | null
  deletingProduct: Product | null
  openCreate: () => void
  openEdit: (product: Product) => void
  closeForm: () => void
  openDelete: (product: Product) => void
  closeDelete: () => void
}

export const useProductsUIStore = create<ProductsUIState>((set) => ({
  dialogMode: 'closed',
  editingProduct: null,
  deletingProduct: null,
  openCreate: () => set({ dialogMode: 'create', editingProduct: null }),
  openEdit: (product) => set({ dialogMode: 'edit', editingProduct: product }),
  closeForm: () => set({ dialogMode: 'closed', editingProduct: null }),
  openDelete: (product) => set({ deletingProduct: product }),
  closeDelete: () => set({ deletingProduct: null }),
}))
