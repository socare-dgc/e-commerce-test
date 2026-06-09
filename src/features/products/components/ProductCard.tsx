import { Link } from 'react-router-dom'
import { Pencil, Trash2, Image as ImageIcon } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn, formatPrice } from '@/lib/utils'
import type { Product } from '../types'

interface ProductCardProps {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const lowStock = product.stock > 0 && product.stock <= 10
  const outOfStock = product.stock === 0

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md">
      <Link
        to={`/products/${product.id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-muted"
      >
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).style.display = 'none'
            }}
          />
        ) : (
          <div className="grid h-full place-items-center text-muted-foreground">
            <ImageIcon className="h-10 w-10" />
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1">
          {product.category && (
            <Badge variant="secondary" className="bg-background/90 capitalize backdrop-blur">
              {product.category.replace(/-/g, ' ')}
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        <Link to={`/products/${product.id}`} className="space-y-1">
          <h3 className="line-clamp-1 font-semibold leading-tight tracking-tight group-hover:text-primary">
            {product.title}
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {product.description || 'No description provided.'}
          </p>
        </Link>

        <div className="mt-auto flex items-end justify-between pt-2">
          <span className="text-lg font-semibold tracking-tight">{formatPrice(product.price)}</span>
          <span
            className={cn(
              'text-xs font-medium',
              outOfStock
                ? 'text-destructive'
                : lowStock
                  ? 'text-amber-600'
                  : 'text-muted-foreground',
            )}
          >
            {outOfStock ? 'Out of stock' : `${product.stock} in stock`}
          </span>
        </div>
      </CardContent>

      <CardFooter className="gap-2 border-t bg-muted/30 p-3">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(product)}>
          <Pencil className="h-4 w-4" aria-hidden />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onDelete(product)}
          aria-label={`Delete ${product.title}`}
        >
          <Trash2 className="h-4 w-4" aria-hidden />
        </Button>
      </CardFooter>
    </Card>
  )
}
