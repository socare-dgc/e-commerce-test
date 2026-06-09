import { z } from 'zod'

export const productSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().default(''),
  price: z.number().nonnegative(),
  discountPercentage: z.number().nullable().optional().default(0),
  rating: z.number().nullable().optional().default(0),
  stock: z.number().nonnegative().default(0),
  brand: z.string().nullable().optional(),
  category: z.string().default('uncategorized'),
  thumbnail: z.string().url().or(z.literal('')).default(''),
  images: z.array(z.string()).default([]),
})

export type Product = z.infer<typeof productSchema>

export const productListSchema = z.object({
  products: z.array(productSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
})

export type ProductList = z.infer<typeof productListSchema>

export const productFormSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(120, 'Title is too long'),
  description: z
    .string()
    .min(5, 'Description must be at least 5 characters')
    .max(2000, 'Description is too long'),
  price: z.coerce
    .number({ invalid_type_error: 'Price is required' })
    .positive('Price must be greater than 0'),
  stock: z.coerce
    .number({ invalid_type_error: 'Stock is required' })
    .int('Stock must be an integer')
    .nonnegative('Stock cannot be negative'),
  category: z.string().min(2, 'Category is required'),
  brand: z.string().optional().default(''),
  thumbnail: z.string().url('Must be a valid URL').or(z.literal('')).optional().default(''),
})

export type ProductFormValues = z.infer<typeof productFormSchema>
