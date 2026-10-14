# GamersAssemble Frontend

Next.js 15 forum UI for browsing and posting game feedback.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- TanStack Query
- React Hook Form + Zod
- Zustand (auth session)
- Lucide React

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

App: http://localhost:3000  
API (NestJS): `NEXT_PUBLIC_API_URL` defaults to `http://localhost:3001/api`

## Auth model

- Browsing posts/comments is public
- Creating posts/comments requires login (JWT stored client-side via Zustand)
