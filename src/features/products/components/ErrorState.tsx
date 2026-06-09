import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We couldn’t load this view. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="grid place-items-center rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center">
      <div className="max-w-sm space-y-3">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry} className="mt-2">
            Try again
          </Button>
        )}
      </div>
    </div>
  )
}
