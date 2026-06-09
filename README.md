# Catalog — Product Manager

A clean, responsive React SPA for managing an e‑commerce product catalog. Built as a focused front‑end engineering exercise.

![CI](https://github.com/USER/REPO/actions/workflows/ci.yml/badge.svg)

## Highlights

- **Browse**: paginated product grid with skeleton, empty, and error states
- **Create / Edit / Delete** products from polished dialogs
- **Optimistic deletes** with toast feedback and rollback on failure
- **Validation** powered by Zod + React Hook Form (inline field errors)
- **Server‑state cache** via TanStack Query (auto refetch / invalidation)
- **Responsive** from 320 px → 1440 px (1 / 2 / 3 / 4 column grid)
- **Accessible** Radix‑based dialogs, alert dialog, labels, and focus management
- **Type‑safe** end‑to‑end (TS strict mode, schema‑validated API responses)

## Tech Stack

| Layer            | Choice                                |
| ---------------- | ------------------------------------- |
| Build            | **Vite 5** + React 18 + TypeScript    |
| Styling          | **TailwindCSS** + **Shadcn/ui** (Radix primitives) |
| Server state     | **TanStack Query v5**                 |
| Client state     | **Zustand** (lightweight UI flags)    |
| Forms            | **react-hook-form** + **zod**         |
| Routing          | **react-router-dom v6**               |
| HTTP             | **axios**                             |
| Toasts           | **sonner**                            |
| Icons            | **lucide-react**                      |
| Linting / Format | **ESLint 9** (flat config) + **Prettier** |
| API              | [DummyJSON](https://dummyjson.com/docs/products) (public mock API) |

## Prerequisites

- **Node.js 20.x** (LTS) — verify with `node -v`
- **pnpm 10.x** — install with `npm i -g pnpm` (or use Corepack)

> Other package managers (npm/yarn) will work, but this repo pins `packageManager` to `pnpm@10.34.1` and CI uses pnpm with a frozen lockfile.

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Start the dev server (http://localhost:5173)
pnpm dev

# 3. Build for production (outputs to dist/)
pnpm build

# 4. Preview the production build locally
pnpm preview
```

## Available Scripts

| Script               | Purpose                                |
| -------------------- | -------------------------------------- |
| `pnpm dev`           | Vite dev server with HMR               |
| `pnpm build`         | Type‑check (`tsc -b`) and bundle       |
| `pnpm preview`       | Serve the production bundle locally   |
| `pnpm lint`          | Run ESLint on all source files         |
| `pnpm typecheck`     | Run the TypeScript compiler (no emit)  |
| `pnpm format`        | Format `src/` with Prettier            |
| `pnpm format:check`  | Verify formatting (used in CI)         |

## Configuration

The API base URL can be overridden via an environment variable. Create a `.env.local` to override:

```bash
# .env.local (optional)
VITE_API_URL=https://dummyjson.com
```

The default points at the public DummyJSON instance, which supports the full CRUD shape this app expects.

## Project Structure

```
src/
├── app/                       # App shell, layout, top-level routes
│   ├── App.tsx                # Router + route definitions
│   ├── AppLayout.tsx          # Sticky header + main + footer
│   └── NotFoundPage.tsx
├── components/
│   └── ui/                    # Shadcn primitives (button, dialog, card, ...)
├── features/
│   └── products/              # Self-contained product feature
│       ├── api.ts             # Typed API client (axios + zod)
│       ├── queries.ts         # TanStack Query hooks + query keys
│       ├── store.ts           # Zustand UI state (dialog flags)
│       ├── types.ts           # Zod schemas + inferred types
│       ├── constants.ts       # PAGE_SIZE, etc.
│       ├── components/
│       │   ├── ProductCard.tsx
│       │   ├── ProductCardSkeleton.tsx
│       │   ├── Pagination.tsx
│       │   ├── EmptyState.tsx
│       │   ├── ErrorState.tsx
│       │   ├── ProductFormDialog.tsx
│       │   └── DeleteProductDialog.tsx
│       └── pages/
│           ├── ProductsPage.tsx       # Paginated grid
│           └── ProductDetailPage.tsx  # Detail view
├── hooks/
│   └── usePageParam.ts        # Pagination state synced with URL ?page=
├── lib/
│   ├── api.ts                 # Axios instance + error normalization
│   └── utils.ts               # cn(), formatPrice()
├── index.css                  # Tailwind layers + design tokens
└── main.tsx                   # App bootstrap (QueryClient, Router, Toaster)
```

### Why this structure?

- **Feature‑first** keeps everything for a feature (`products/`) in one place: API, queries, store, UI, pages. Easy to grow into orders/users/etc. without churn.
- **`components/ui/`** holds primitive, reusable design‑system pieces (Shadcn). Application‑specific composition lives inside features.
- **Server state vs UI state are deliberately separated**: TanStack Query owns API cache; Zustand owns only ephemeral dialog flags.

## Architectural Notes

### Server state
- TanStack Query manages caching, refetching, and invalidation.
- Query keys are namespaced (`['products', 'list', { limit, skip }]`) and exposed from `queries.ts` for safe invalidation.
- `keepPreviousData` keeps the previous page visible during page transitions for a smoother UX.
- Zod schemas validate API responses defensively — bad data fails loudly rather than silently propagating.

### Optimistic updates
- **Delete** removes the product from every cached list immediately, then settles with the server response. On failure, the previous cache is rolled back and a toast is shown.

### Responsive design
- Grid breakpoints: `1` (mobile) → `2` (sm 640) → `3` (lg 1024) → `4` (xl 1280).
- Pagination collapses to a compact "Page X of Y" display below `sm`.
- Detail view stacks vertically below `md`.

### Forms
- A single `ProductFormDialog` handles **create** and **edit** modes — the only difference is whether `editingProduct` is set.
- Zod schema is the single source of truth: types are inferred from it, runtime validation is shared with the API client.

## Continuous Integration

`.github/workflows/ci.yml` runs on every push to `main` and on every PR:

1. Setup Node 20 + pnpm 10 (with pnpm store cache)
2. `pnpm install --frozen-lockfile`
3. `pnpm format:check`
4. `pnpm lint`
5. `pnpm typecheck`
6. `pnpm build`

## Notes on DummyJSON

DummyJSON simulates CRUD: `POST /products/add`, `PUT /products/:id`, and `DELETE /products/:id` return realistic responses but do **not** persist the changes server‑side. The app handles this by invalidating queries and refetching — created/edited records will appear briefly and then revert on the next refetch, which is the expected behavior for a public mock API.

For a fully‑persistent demo, swap the base URL to a real backend or wire up MSW for a deterministic in‑memory mock.

## License

MIT — see [LICENSE](./LICENSE) (or remove this section if you don't intend to publish).
