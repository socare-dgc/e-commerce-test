import { api } from '@/lib/api'
import {
  productListSchema,
  productSchema,
  type Product,
  type ProductFormValues,
  type ProductList,
} from './types'

export interface ListParams {
  limit: number
  skip: number
}

export const productsApi = {
  async list({ limit, skip }: ListParams): Promise<ProductList> {
    const { data } = await api.get('/products', {
      params: { limit, skip },
    })
    return productListSchema.parse(data)
  },

  async get(id: number): Promise<Product> {
    const { data } = await api.get(`/products/${id}`)
    return productSchema.parse(data)
  },

  async create(values: ProductFormValues): Promise<Product> {
    const { data } = await api.post('/products/add', values)
    // DummyJSON returns the new record (with a synthetic ID). Validate shape.
    return productSchema.parse({ ...values, ...data })
  },

  async update(id: number, values: ProductFormValues): Promise<Product> {
    const { data } = await api.put(`/products/${id}`, values)
    return productSchema.parse({ ...values, ...data, id })
  },

  async remove(id: number): Promise<{ id: number }> {
    const { data } = await api.delete(`/products/${id}`)
    return { id: data?.id ?? id }
  },
}
