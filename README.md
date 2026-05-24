# Her Time

Production-ready PERN marketplace foundation (monorepo).

## Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** PostgreSQL

## Prerequisites

- Node.js 20+
- Docker (optional, for local PostgreSQL)

## Quick start

```bash
# Install dependencies
npm install

# Environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start PostgreSQL
npm run db:up

# Run migrations
npm run db:migrate

# Start frontend + API (dev)
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:5000
- Health: http://localhost:5000/api/health

## Scripts

| Command              | Description                                    |
| -------------------- | ---------------------------------------------- |
| `npm run dev`        | Run API + frontend together                    |
| `npm run build`      | Build frontend for production                  |
| `npm run start:prod` | Run API in production (serves `frontend/dist`) |
| `npm run db:up`      | Start Postgres via Docker                      |
| `npm run db:migrate` | Apply SQL migrations                           |
| `npm run lint`       | Lint all workspaces                            |
| `npm run format`     | Format with Prettier                           |
| `npm run validate`   | format:check + lint + build                    |

## Production

```bash
npm run build
NODE_ENV=production npm run start:prod
```

Serve the app on port `5000` (API + static frontend). Set `DATABASE_URL` and other vars in `backend/.env`.

## Project layout

See [docs/architecture.md](docs/architecture.md) and [docs/environment.md](docs/environment.md).
