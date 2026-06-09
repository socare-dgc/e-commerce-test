import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { productFormSchema, type ProductFormValues } from '@/features/products/types'
import { useCreateProduct, useUpdateProduct } from '@/features/products/queries'
import { useProductsUIStore } from '@/features/products/store'

const DEFAULTS: ProductFormValues = {
  title: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
  brand: '',
  thumbnail: '',
}

export function ProductFormDialog() {
  const dialogMode = useProductsUIStore((s) => s.dialogMode)
  const editingProduct = useProductsUIStore((s) => s.editingProduct)
  const closeForm = useProductsUIStore((s) => s.closeForm)
  const create = useCreateProduct()
  const update = useUpdateProduct()

  const isOpen = dialogMode !== 'closed'
  const isEdit = dialogMode === 'edit'

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: DEFAULTS,
  })

  useEffect(() => {
    if (!isOpen) return
    if (isEdit && editingProduct) {
      reset({
        title: editingProduct.title,
        description: editingProduct.description,
        price: editingProduct.price,
        stock: editingProduct.stock,
        category: editingProduct.category,
        brand: editingProduct.brand ?? '',
        thumbnail: editingProduct.thumbnail ?? '',
      })
    } else {
      reset(DEFAULTS)
    }
  }, [isOpen, isEdit, editingProduct, reset])

  const onSubmit = handleSubmit(async (values) => {
    if (isEdit && editingProduct) {
      await update.mutateAsync(
        { id: editingProduct.id, values },
        {
          onSuccess: () => closeForm(),
        },
      )
    } else {
      await create.mutateAsync(values, {
        onSuccess: () => closeForm(),
      })
    }
  })

  const busy = isSubmitting || create.isPending || update.isPending

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(next) => {
        if (!next && !busy) closeForm()
      }}
    >
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit product' : 'Create product'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the product details below.' : 'Add a new product to your catalog.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <Field id="title" label="Title" error={errors.title?.message} required>
            <Input
              id="title"
              placeholder="Wireless headphones"
              {...register('title')}
              aria-invalid={!!errors.title}
            />
          </Field>

          <Field id="description" label="Description" error={errors.description?.message} required>
            <Textarea
              id="description"
              placeholder="Short description of the product…"
              rows={4}
              {...register('description')}
              aria-invalid={!!errors.description}
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field id="price" label="Price (USD)" error={errors.price?.message} required>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                inputMode="decimal"
                placeholder="49.99"
                {...register('price')}
                aria-invalid={!!errors.price}
              />
            </Field>

            <Field id="stock" label="Stock" error={errors.stock?.message} required>
              <Input
                id="stock"
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                placeholder="100"
                {...register('stock')}
                aria-invalid={!!errors.stock}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field id="category" label="Category" error={errors.category?.message} required>
              <Input
                id="category"
                placeholder="electronics"
                {...register('category')}
                aria-invalid={!!errors.category}
              />
            </Field>

            <Field id="brand" label="Brand" error={errors.brand?.message}>
              <Input id="brand" placeholder="Acme (optional)" {...register('brand')} />
            </Field>
          </div>

          <Field id="thumbnail" label="Thumbnail URL" error={errors.thumbnail?.message}>
            <Input
              id="thumbnail"
              type="url"
              placeholder="https://example.com/image.jpg (optional)"
              {...register('thumbnail')}
              aria-invalid={!!errors.thumbnail}
            />
          </Field>

          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" onClick={closeForm} disabled={busy}>
              Cancel
            </Button>
            <Button type="submit" disabled={busy}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? 'Save changes' : 'Create product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface FieldProps {
  id: string
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

function Field({ id, label, error, required, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className={cn(error && 'text-destructive')}>
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-xs font-medium text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
