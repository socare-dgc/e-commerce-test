import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/features/products/components/ErrorState'
import { ProductFormDialog } from '@/features/products/components/ProductFormDialog'
import { DeleteProductDialog } from '@/features/products/components/DeleteProductDialog'
import { useProduct } from '@/features/products/queries'
import { useProductsUIStore } from '@/features/products/store'
import { formatPrice } from '@/lib/utils'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const numericId = id ? Number.parseInt(id, 10) : undefined
  const query = useProduct(Number.isFinite(numericId) ? (numericId as number) : undefined)
  const openEdit = useProductsUIStore((s) => s.openEdit)
  const openDelete = useProductsUIStore((s) => s.openDelete)

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link to="/products">
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>
      </Button>

      {query.isLoading ? (
        <DetailSkeleton />
      ) : query.isError || !query.data ? (
        <ErrorState
          title="Product not found"
          message={query.error?.message ?? 'This product does not exist or was removed.'}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="grid gap-0 md:grid-cols-2">
            <div className="relative aspect-square bg-muted md:aspect-auto">
              {query.data.thumbnail ? (
                <img
                  src={query.data.thumbnail}
                  alt={query.data.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center text-muted-foreground">
                  <ImageIcon className="h-12 w-12" />
                </div>
              )}
            </div>

            <CardContent className="space-y-5 p-6 md:p-8">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  {query.data.category && (
                    <Badge variant="secondary" className="capitalize">
                      {query.data.category.replace(/-/g, ' ')}
                    </Badge>
                  )}
                  {query.data.brand && <Badge variant="outline">{query.data.brand}</Badge>}
                </div>
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  {query.data.title}
                </h1>
                <p className="text-3xl font-bold tracking-tight">{formatPrice(query.data.price)}</p>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {query.data.description}
              </p>

              <dl className="grid grid-cols-2 gap-4 border-t pt-5 text-sm">
                <div>
                  <dt className="text-muted-foreground">Stock</dt>
                  <dd className="font-medium">{query.data.stock}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Rating</dt>
                  <dd className="font-medium">{query.data.rating?.toFixed(1) ?? '—'}</dd>
                </div>
              </dl>

              <div className="flex gap-2 border-t pt-5">
                <Button onClick={() => openEdit(query.data!)} className="flex-1">
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => openDelete(query.data!)}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      )}

      <ProductFormDialog />
      <DeleteProductDialog />
    </div>
  )
}

function DetailSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="grid gap-0 md:grid-cols-2">
        <Skeleton className="aspect-square rounded-none md:aspect-auto" />
        <CardContent className="space-y-4 p-6 md:p-8">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <div className="flex gap-2 pt-3">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
