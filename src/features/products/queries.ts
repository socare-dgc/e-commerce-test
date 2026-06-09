import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { productsApi, type ListParams } from './api'
import type { Product, ProductFormValues, ProductList } from './types'

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: ListParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
}

export function useProducts(params: ListParams) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productsApi.list(params),
    placeholderData: keepPreviousData,
  })
}

export function useProduct(id: number | undefined) {
  return useQuery({
    queryKey: productKeys.detail(id ?? 0),
    queryFn: () => productsApi.get(id as number),
    enabled: typeof id === 'number' && id > 0,
  })
}

export function useCreateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (values: ProductFormValues) => productsApi.create(values),
    onSuccess: (created) => {
      qc.invalidateQueries({ queryKey: productKeys.lists() })
      toast.success('Product created', {
        description: `“${created.title}” is now in your catalog.`,
      })
    },
    onError: (error: Error) => {
      toast.error('Failed to create product', { description: error.message })
    },
  })
}

export function useUpdateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: ProductFormValues }) =>
      productsApi.update(id, values),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: productKeys.lists() })
      qc.setQueryData(productKeys.detail(updated.id), updated)
      toast.success('Product updated', {
        description: `Changes saved for “${updated.title}”.`,
      })
    },
    onError: (error: Error) => {
      toast.error('Failed to update product', { description: error.message })
    },
  })
}

export function useDeleteProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => productsApi.remove(id),
    // Optimistic: remove from any cached lists immediately
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: productKeys.lists() })
      const previous = qc.getQueriesData<ProductList>({
        queryKey: productKeys.lists(),
      })
      previous.forEach(([key, data]) => {
        if (!data) return
        qc.setQueryData<ProductList>(key, {
          ...data,
          products: data.products.filter((p: Product) => p.id !== id),
          total: Math.max(0, data.total - 1),
        })
      })
      return { previous }
    },
    onError: (error: Error, _id, context) => {
      context?.previous?.forEach(([key, data]) => qc.setQueryData(key, data))
      toast.error('Failed to delete product', { description: error.message })
    },
    onSuccess: () => {
      toast.success('Product deleted')
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}
