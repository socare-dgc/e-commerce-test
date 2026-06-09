import { PackageOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  onCreate: () => void
}

export function EmptyState({ onCreate }: EmptyStateProps) {
  return (
    <div className="grid place-items-center rounded-xl border border-dashed bg-background/50 px-6 py-16 text-center">
      <div className="max-w-sm space-y-3">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
          <PackageOpen className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold">No products yet</h3>
        <p className="text-sm text-muted-foreground">
          Your catalog is empty. Add your first product to get started.
        </p>
        <Button onClick={onCreate} className="mt-2">
          Add your first product
        </Button>
      </div>
    </div>
  )
}
