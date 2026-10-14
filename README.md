# GamersAssemble

**A community for making games better.** GamersAssemble brings players together to report bugs, share fixes, suggest improvements, and discuss the games they play. The longer-term goal is to give game developers and studios a place to engage with that feedback.

> **Status:** Early MVP / active development. The core game, post, and comment flows are implemented; voting and developer/company features are planned.

## Features

- Browse games and their supported platforms.
- Explore bug reports, fixes, and ideas for each game.
- Filter and paginate posts; view individual discussions.
- Register, sign in, and create posts and comments.
- Edit or delete your own posts and comments through authenticated API endpoints.
- Browse paginated comments.
- Populate a local database with sample games, users, posts, and comments.

Some backend capabilities may not yet have a corresponding frontend control.

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS |
| Data and forms | TanStack Query, Zustand, React Hook Form, Zod |
| Backend | NestJS 10, TypeScript, REST API, JWT authentication |
| Database | PostgreSQL 16, Prisma ORM |
| Local infrastructure | Docker Compose (PostgreSQL) |

## Project layout

```text
GamersAssemble/
├── frontend/                # Next.js application
├── backend/
│   ├── src/                 # NestJS modules and API
│   └── prisma/
│       ├── schema.prisma    # Database schema
│       ├── migrations/      # Versioned schema changes
│       └── seed.ts          # Sample data generator
├── docker-compose.yml      # PostgreSQL container
└── .env.example             # Docker Compose configuration
```

## Run locally

### Prerequisites

- Node.js 20+ and npm
- Docker Desktop (or Docker Engine with Compose)
- Available ports **3000**, **3001**, and **5432**

### 1. Clone and configure

```bash
git clone https://github.com/Kostaskrav/GamersAssemble.git
cd GamersAssemble

cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

`backend/.env.example` already includes a local-only `JWT_SECRET`, so sign-in works after you copy the file. Replace that value before you use the app anywhere other than your own machine:

```bash
openssl rand -hex 32
```

Paste the generated value into `JWT_SECRET=` in `backend/.env`. The supplied example configuration uses these local addresses:

| Service | Address |
| --- | --- |
| Frontend | `http://localhost:3000` |
| Backend API | `http://localhost:3001/api` |
| API health check | `http://localhost:3001/api/health` |
| PostgreSQL | `localhost:5432` |

If you change database credentials in the root `.env`, update `DATABASE_URL` in `backend/.env` accordingly. If you change the frontend port, also update `FRONTEND_URL` in `backend/.env` to match CORS settings.

### 2. Start the database

From the repository root:

```bash
docker compose up -d --wait
docker compose ps
```

`--wait` blocks until PostgreSQL reports healthy, so the next step does not run against a database that is still starting.

### 3. Install dependencies and apply migrations

```bash
cd backend
npm ci
npx prisma generate
npx prisma migrate deploy
```

`migrate deploy` applies the migrations committed to the repository to a new database; you do not need to create new migrations just to run the app.

### 4. Add demo data

From `backend/`:

```bash
npm run prisma:seed
```

The seed creates platforms, games, posts, and comments, plus three demo accounts. A fresh database does not need any accounts created first.

| Email | Password |
| --- | --- |
| `nova.scout@gamersassemble.dev` | `Password123!` |
| `bug.smasher@gamersassemble.dev` | `Password123!` |
| `idea.forge@gamersassemble.dev` | `Password123!` |

**Demo credentials are for local development only. Never deploy this seed or these passwords to a public production database.** Rerunning the seed replaces seed-marked posts and comments for these accounts and resets their passwords to the value above. Avoid using those accounts for data you want to preserve.

### 5. Start the API

In the `backend/` directory:

```bash
npm run start:dev
```

Check the health endpoint at `http://localhost:3001/api/health`.

### 6. Start the frontend

In a **second terminal**, from the repository root:

```bash
cd frontend
npm ci
npm run dev
```

Open `http://localhost:3000` and sign in with a demo account, or register your own account.

## Useful commands

Run from the relevant directory:

| Command | Where | Purpose |
| --- | --- | --- |
| `docker compose up -d --wait` | Root | Start PostgreSQL and wait until it is healthy |
| `docker compose down` | Root | Stop PostgreSQL, keep data |
| `docker compose down -v` | Root | **Delete local database volume and data** |
| `npx prisma studio` | Backend | Inspect database records |
| `npx prisma migrate deploy` | Backend | Apply existing migrations |
| `npm run prisma:seed` | Backend | Populate demo data |
| `npm run start:dev` | Backend | Start API in watch mode |
| `npm run dev` | Frontend | Start Next.js development server |
| `npm run build` | Frontend | Build the frontend |

## API overview

The API is served under `/api`:

| Resource | Example endpoints |
| --- | --- |
| Authentication | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Games | `GET /games`, `GET /games/:id` |
| Posts | `GET /posts`, `GET /posts/:id`, `POST /posts`, `PATCH /posts/:id`, `DELETE /posts/:id` |
| Comments | `GET /posts/:postId/comments`, `POST /posts/:postId/comments`, `PATCH /comments/:id`, `DELETE /comments/:id` |

Creating or modifying user content requires a Bearer JWT. The backend enforces ownership on edits and deletions. Post filters include game, post type, and platform; list endpoints support pagination.

## Roadmap

- [ ] Post voting and ranking
- [ ] Finish editing and pagination interactions in the frontend
- [ ] Improve production authentication/session handling
- [ ] Search and user profiles
- [ ] Developer/studio verification and game ownership
- [ ] Automated integration tests and deployment

## Development notes

- This is an evolving MVP, not a production-hardened service.
- The Next.js frontend calls the NestJS API; it does not connect to PostgreSQL directly.
- Keep `.env` files and credentials out of Git.
- The demo seed is intended for disposable local development databases.

## License

No license has been specified yet.
