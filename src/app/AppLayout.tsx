import { Link, NavLink, Outlet } from 'react-router-dom'
import { Package2, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AppLayout() {
  return (
    <div className="flex min-h-full flex-col bg-muted/30">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/products" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <ShoppingBag className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-base sm:text-lg">Catalog</span>
            <span className="hidden text-xs font-normal text-muted-foreground sm:inline">
              · Product Manager
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            <NavLink
              to="/products"
              className={({ isActive }) =>
                cn(
                  'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )
              }
            >
              <Package2 className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Products</span>
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="container flex-1 py-6 md:py-10">
        <Outlet />
      </main>

      <footer className="border-t bg-background/60">
        <div className="container flex h-14 items-center justify-between text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Catalog</span>
          <span className="hidden sm:inline">
            Built with React, Vite, TanStack Query, Shadcn/ui
          </span>
        </div>
      </footer>
    </div>
  )
}
