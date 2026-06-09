# ROADMAP

## Phase 1: Foundation
**Goal:** Working Vite + React + TS + Tailwind + Shadcn project that starts and builds.
**Requirements:** OPS-foundation
**Success Criteria:**
1. `pnpm dev` serves a styled "Hello" page
2. `pnpm build` succeeds
3. Shadcn `Button` renders with theme tokens
4. Path alias `@/*` resolves

## Phase 2: API + Data Layer
**Goal:** Type-safe DummyJSON client + TanStack Query hooks for products.
**Requirements:** Underpins PROD-01..06
**Success Criteria:**
1. `productsApi` exposes list/get/create/update/delete
2. `useProducts`, `useProduct`, `useCreateProduct`, `useUpdateProduct`, `useDeleteProduct` hooks defined
3. Query invalidation strategy documented in code
4. Zod schemas validate API responses

## Phase 3: Product List + Pagination
**Goal:** Production-ready browseable catalog.
**Requirements:** PROD-01, PROD-02, PROD-03, UX-01, RES-01
**Success Criteria:**
1. Grid of product cards renders from API
2. Pagination control works (prev/next + page numbers)
3. Skeleton loading state during fetch
4. Empty state ("No products yet")
5. Error state with retry
6. Responsive: 1 col mobile, 2 col tablet, 3-4 col desktop

## Phase 4: CRUD Flows
**Goal:** User can create, edit, delete products from the list.
**Requirements:** PROD-04, PROD-05, PROD-06, UX-02
**Success Criteria:**
1. "Add Product" button opens `ProductFormDialog` in create mode
2. Edit action on card opens same dialog pre-filled
3. Delete shows AlertDialog confirmation
4. Toast on success + error for every mutation
5. Form validation surfaces inline errors
6. Optimistic UI on create/update/delete

## Phase 5: Polish + Ship
**Goal:** Project is reviewer-ready.
**Requirements:** RES-01, OPS-01, OPS-02
**Success Criteria:**
1. Responsive sweep at 320, 768, 1024, 1440px — no overflow, no awkward wrap
2. ESLint + Prettier configured; codebase passes both
3. `README.md` covers: prerequisites, install, dev, build, structure, env, CI badge
4. `.github/workflows/ci.yml` runs install → lint → typecheck → build on push/PR
5. Initial commit and ready-to-push state
