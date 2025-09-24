# Next.js Todo App ✅

A fullstack **Next.js 15** application with **PostgreSQL + Prisma** backend and **TanStack Query** for data fetching and caching.  
Deployed on **Vercel**.

---

## 🚀 Live Demo
🔗 [next-todo-rho-one.vercel.app](http://next-todo-rho-one.vercel.app/)

---

## Scripts
- `npm run dev` – dev server
- `npm run build` – prisma migrate deploy && next build
- `npm run start` – prod server
- `npm run prisma:generate` – generate client
- `npm run prisma:migrate` – create/apply migration (dev)
- `npm run db:reset` – destructive reset

## React Query
- Keys: `['todos']`, `['todos','list']`, `['todos','list',{ filters }]`
- queryFn via `queryOptions` in `lib/query-keys.ts`
- Mutations invalidate `todoKeys.lists()`; toggle/delete are optimistic with rollback

## Deploy (Vercel)
- Used a hosted Postgres (Prisma/Postgrs)
- Set `DATABASE_URL`  in Project → Settings → Environment Variables
- Build uses `prisma migrate deploy && next build`
