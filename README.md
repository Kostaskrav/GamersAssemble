# Game Feedback Platform

Monorepo scaffold for a platform that will connect video game players with game developers.

This repository currently contains **project setup only** — no product features yet. The Next.js frontend and NestJS backend are separate apps that will communicate over HTTP REST.

## Project structure

```
/
├── frontend/           # Next.js (App Router, TypeScript)
├── backend/            # NestJS REST API + Prisma
├── docker-compose.yml  # Local PostgreSQL
├── .env.example        # Docker Compose Postgres variables
├── README.md
└── .gitignore
```

## Required software (macOS)

- [Node.js](https://nodejs.org/) (v20 or later recommended) and npm
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for PostgreSQL)
- A code editor (e.g. Cursor / VS Code)

Verify installations:

```bash
node -v
npm -v
docker --version
docker compose version
```

## 1. Clone / open the project

```bash
cd /path/to/GamersAssemble
```

## 2. Configure environment variables

Copy the example env files (do not commit real `.env` files):

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Defaults work for local development:

| File | Variable | Default |
|------|----------|---------|
| `.env` | `POSTGRES_DB` | `gamersassemble` |
| `.env` | `POSTGRES_USER` | `postgres` |
| `.env` | `POSTGRES_PASSWORD` | `postgres` |
| `.env` | `POSTGRES_PORT` | `5432` |
| `backend/.env` | `PORT` | `3001` |
| `backend/.env` | `FRONTEND_URL` | `http://localhost:3000` |
| `backend/.env` | `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/gamersassemble?schema=public` |
| `frontend/.env.local` | `NEXT_PUBLIC_API_URL` | `http://localhost:3001/api` |

If you change Postgres credentials in `.env`, update `DATABASE_URL` in `backend/.env` to match.

## 3. Install frontend dependencies

```bash
cd frontend
npm install
```

## 4. Install backend dependencies

```bash
cd backend
npm install
```

## 5. Start PostgreSQL

From the project root (Docker Desktop must be running):

```bash
docker compose up -d
```

Check that the container is healthy:

```bash
docker compose ps
```

Stop PostgreSQL when you are done:

```bash
docker compose down
```

Data is persisted in a Docker volume named `postgres_data`. To wipe the database volume as well:

```bash
docker compose down -v
```

## 6. Prisma commands

Run these from the `backend/` directory (with PostgreSQL running and `DATABASE_URL` set):

```bash
cd backend

# Generate the Prisma Client (needed after schema changes)
npx prisma generate

# Validate the schema
npx prisma validate

# Create / apply migrations once you add models later
npx prisma migrate dev --name <migration_name>

# Optional: open Prisma Studio
npx prisma studio
```

Equivalent npm scripts:

```bash
npm run prisma:generate
npm run prisma:validate
npm run prisma:migrate
npm run prisma:studio
```

There are **no application models** yet — design `User`, `Game`, `Post`, `Comment`, etc. yourself in `backend/prisma/schema.prisma` when you are ready.

## 7. Start the NestJS backend

```bash
cd backend
npm run start:dev
```

API base URL: `http://localhost:3001/api`  
Health check: `http://localhost:3001/api/health`

## 8. Start the Next.js frontend

In a separate terminal:

```bash
cd frontend
npm run dev
```

App URL: `http://localhost:3000`

## Ports

| Service | Port | URL |
|---------|------|-----|
| Next.js frontend | `3000` | http://localhost:3000 |
| NestJS backend | `3001` | http://localhost:3001/api |
| Health endpoint | `3001` | http://localhost:3001/api/health |
| PostgreSQL | `5432` | `localhost:5432` |

Make sure ports `3000` and `3001` are free before starting the apps. If another process is using `3000`, Next.js must not be allowed to fall over onto `3001` (that would conflict with the API). The frontend `dev` script is pinned to port `3000` for that reason.

## How the pieces communicate

```
Browser → Next.js (localhost:3000)
              │
              │  HTTP REST (NEXT_PUBLIC_API_URL)
              ▼
         NestJS API (localhost:3001/api)
              │
              │  Prisma (DATABASE_URL)
              ▼
         PostgreSQL (Docker, localhost:5432)
```

- The **frontend** never talks to the database directly.
- The **backend** is the only app that uses Prisma and PostgreSQL.
- Do **not** put application business logic in Next.js API routes — use the NestJS REST API.

## Quick start (all steps)

```bash
# From project root
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

docker compose up -d

cd backend && npm install && npx prisma generate && npm run start:dev

# New terminal
cd frontend && npm install && npm run dev
```

Then open http://localhost:3000 and http://localhost:3001/api/health.
