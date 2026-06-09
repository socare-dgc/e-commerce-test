# PROJECT: E-Commerce Product Management Frontend

## What This Is

A responsive React SPA for managing products in an e-commerce catalog. CRUD over products with pagination — list, create, edit, delete. Built as a take-home assessment exercise.

## Core Value

A clean, friendly, responsive product-management UI that a non-technical user can operate confidently in under 10 seconds per action.

## Tech Stack (locked)

| Concern | Choice | Reason |
|---|---|---|
| Bundler / Framework | **Vite + React 18 + TypeScript** | Fast HMR, minimal config; SPA fits the scope better than Next.js |
| Styling | **TailwindCSS + Shadcn/ui** | Required by brief; gives us accessible primitives with full design control |
| Server state | **TanStack Query v5** | Cache, refetch, optimistic updates out-of-box — perfect for CRUD |
| Client state | **Zustand** | Lightweight UI state (dialog open, selected product) without Redux ceremony |
| Forms | **react-hook-form + zod** | Best-in-class DX, schema-derived types |
| Routing | **react-router-dom v6** | Standard SPA routing |
| API | **DummyJSON** (`https://dummyjson.com/products`) | Free, supports CRUD, has pagination via `limit`/`skip` |
| Toasts | **sonner** (via Shadcn) | Polished notifications |
| Package manager | **pnpm** | Fast, disk-efficient |
| Node | **20.x** | LTS |

## Requirements

### Active (v1)
- [ ] PROD-01: User can view a paginated grid of products (12 per page)
- [ ] PROD-02: User can navigate pages using a pagination control
- [ ] PROD-03: User can open a product detail view
- [ ] PROD-04: User can create a new product via a modal/dialog form
- [ ] PROD-05: User can edit an existing product
- [ ] PROD-06: User can delete a product with a confirmation step
- [ ] UX-01: Loading, empty, and error states for every async surface
- [ ] UX-02: Toast feedback on every mutation (success + failure)
- [ ] RES-01: Layout adapts at `md` breakpoint (768px) — single column below, grid above`
- [ ] OPS-01: `README.md` with run/build instructions, Node version, pnpm version
- [ ] OPS-02: GitHub Actions CI runs lint + typecheck + build on push/PR

### Out of Scope
- Search, sort, filter — explicitly excluded by brief
- Authentication — not required, dummy API needs no auth
- Cart / checkout — product management only
- Real persistence — DummyJSON simulates writes but doesn't persist; we'll handle this with optimistic updates that survive within the session

## Key Decisions

| Decision | Rationale |
|---|---|
| Vite over Next.js | Pure SPA; no SSR needed; faster dev loop for assessment |
| TanStack Query + Zustand (not Redux) | Server state ≠ client state. Query owns API cache; Zustand owns minimal UI flags |
| Modal forms (not separate routes) | Faster UX; user keeps list context. Edit and Create share the same `ProductFormDialog` |
| DummyJSON over MSW mock | Real network round-trips look more honest in a demo; DummyJSON's CRUD endpoints simulate persistence |
| Optimistic updates | Mutations feel instant; rollback on failure. Critical for the "friendly UX" eval criterion |

---
*Last updated: 2026-06-09 at initialization*
