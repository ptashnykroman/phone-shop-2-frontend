# Phone Shop Frontend

Frontend for the diploma mobile phone store. Built on top of the existing NestJS + Prisma backend without changing its API contracts.

## Stack

- Next.js App Router
- TypeScript
- TanStack Query
- Axios
- Tailwind CSS
- shadcn-style UI primitives
- React Hook Form + Zod
- Zustand
- Lucide React
- Recharts
- Sonner
- next-themes
- Vitest + React Testing Library

## Backend compatibility

This frontend is aligned with the current backend implementation in `../backend`:

- auth uses `accessToken` + `refreshToken` in response body
- token refresh uses `POST /api/auth/refresh`
- guest cart uses `x-session-id`
- compare, alternatives, performance, and explained specifications are rendered from backend responses only
- order, payment, delivery, and role values match backend enums
- mock payment uses `POST /api/payments/orders/:orderId/mock-success`

Important: the backend does not expose a dedicated mock fail endpoint. Because of that, the `/payment/failed` screen is a frontend fallback scenario and does not mutate order state.

## Environment

Create `.env.local` from `.env.example`.

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Install

```bash
cd frontend
npm install
```

## Run frontend

```bash
cd frontend
npm run dev
```

Frontend default URL:

- `http://localhost:3001` if port `3000` is already occupied by backend
- otherwise `http://localhost:3000`

## Run backend

From the backend folder:

```bash
cd backend
pnpm install
pnpm prisma:deploy
pnpm prisma:seed
pnpm start:dev
```

Swagger is available at:

- `http://localhost:3000/docs`

## Main pages

- `/` home page
- `/products` product catalog with filters, sorting, search, and pagination
- `/products/[slug]` product details with explanations, performance, alternatives, reviews
- `/cart`
- `/checkout`
- `/payment/mock`
- `/payment/success`
- `/payment/failed`
- `/orders`
- `/orders/[id]`
- `/favorites`
- `/compare`
- `/auth/login`
- `/auth/register`
- `/admin`
- `/admin/products`
- `/admin/orders`
- `/admin/characteristics`
- `/admin/explanations`

## Diploma features

### 1. Explained specifications

Uses:

- `GET /api/products/:id/specifications/explained`

Frontend behavior:

- groups characteristics by `groupName`
- shows important items more prominently
- keeps explanations concise and practical

### 2. Performance in real tasks

Uses:

- `GET /api/products/:id/performance-score`

Frontend behavior:

- displays backend scores on a visual scale
- highlights `overallScore`
- does not calculate scores on the client

### 3. Better alternatives widget

Uses:

- `GET /api/products/:id/alternatives`

Frontend behavior:

- renders backend recommendation groups:
  - `cheaperSimilar`
  - `slightlyMoreExpensiveBetter`
  - `betterCamera`
  - `betterBattery`
  - `betterPerformance`
  - `bestValue`

### 4. Honest comparison

Uses:

- `POST /api/products/compare`

Frontend behavior:

- keeps 2-4 compared product ids in Zustand
- renders `highlightedDifferences`, `winnerByCategory`, and `summary`
- can hide identical specifications

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run typecheck
npm test
```

## Verified locally

- `npm run typecheck` passes
- `npm run build` passes
- `npm test` passes

## Note about pnpm

The frontend can also be used with `pnpm`, but on this machine `pnpm` required an additional `approve-builds` step for `sharp`. The documented `npm` flow avoids that extra interactive step.
