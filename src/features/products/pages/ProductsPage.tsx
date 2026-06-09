import { useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/features/products/components/ProductCard'
import { ProductCardSkeleton } from '@/features/products/components/ProductCardSkeleton'
import { Pagination } from '@/features/products/components/Pagination'
import { EmptyState } from '@/features/products/components/EmptyState'
import { ErrorState } from '@/features/products/components/ErrorState'
import { ProductFormDialog } from '@/features/products/components/ProductFormDialog'
import { DeleteProductDialog } from '@/features/products/components/DeleteProductDialog'
import { useProducts } from '@/features/products/queries'
import { useProductsUIStore } from '@/features/products/store'
import { PAGE_SIZE } from '@/features/products/constants'
import { usePageParam } from '@/hooks/usePageParam'

export function ProductsPage() {
  const [page, setPage] = usePageParam(1)
  const openCreate = useProductsUIStore((s) => s.openCreate)
  const openEdit = useProductsUIStore((s) => s.openEdit)
  const openDelete = useProductsUIStore((s) => s.openDelete)

  const skip = (page - 1) * PAGE_SIZE
  const query = useProducts({ limit: PAGE_SIZE, skip })

  // Reset to page 1 if the current page becomes empty (e.g. last item deleted)
  useEffect(() => {
    if (!query.isLoading && query.data && query.data.products.length === 0 && page > 1) {
      setPage(1)
    }
  }, [query.isLoading, query.data, page, setPage])

  const pageCount = query.data ? Math.max(1, Math.ceil(query.data.total / PAGE_SIZE)) : 1
  const total = query.data?.total ?? 0
  const rangeStart = total === 0 ? 0 : skip + 1
  const rangeEnd = Math.min(skip + PAGE_SIZE, total)

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Products</h1>
          <p className="text-sm text-muted-foreground">
            Manage your catalog — create, edit, and remove products.
          </p>
        </div>
        <Button onClick={openCreate} className="sm:w-auto">
          <Plus className="h-4 w-4" aria-hidden />
          Add product
        </Button>
      </header>

      {query.isError ? (
        <ErrorState message={query.error?.message} onRetry={() => query.refetch()} />
      ) : query.isLoading ? (
        <ProductsGrid>
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </ProductsGrid>
      ) : query.data && query.data.products.length === 0 ? (
        <EmptyState onCreate={openCreate} />
      ) : (
        <>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing <span className="font-medium text-foreground">{rangeStart}</span>–
              <span className="font-medium text-foreground">{rangeEnd}</span> of{' '}
              <span className="font-medium text-foreground">{total}</span>
            </span>
            {query.isFetching && !query.isLoading && <span className="text-xs">Refreshing…</span>}
          </div>

          <ProductsGrid>
            {query.data!.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={openEdit}
                onDelete={openDelete}
              />
            ))}
          </ProductsGrid>

          <Pagination
            page={page}
            pageCount={pageCount}
            onPageChange={(next) => {
              setPage(next)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        </>
      )}

      <ProductFormDialog />
      <DeleteProductDialog />
    </div>
  )
}

function ProductsGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {children}
    </div>
  )
}
