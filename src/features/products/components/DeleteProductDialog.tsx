import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDeleteProduct } from '@/features/products/queries'
import { useProductsUIStore } from '@/features/products/store'

export function DeleteProductDialog() {
  const deletingProduct = useProductsUIStore((s) => s.deletingProduct)
  const closeDelete = useProductsUIStore((s) => s.closeDelete)
  const remove = useDeleteProduct()
  const navigate = useNavigate()

  const open = deletingProduct !== null

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!next && !remove.isPending) closeDelete()
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete product?</AlertDialogTitle>
          <AlertDialogDescription>
            “{deletingProduct?.title}” will be permanently removed from your catalog. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={remove.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={remove.isPending}
            onClick={(e) => {
              e.preventDefault()
              if (!deletingProduct) return
              remove.mutate(deletingProduct.id, {
                onSuccess: () => {
                  closeDelete()
                  // If we deleted from the detail page, return to list
                  if (window.location.pathname.startsWith('/products/')) {
                    navigate('/products', { replace: true })
                  }
                },
              })
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {remove.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
