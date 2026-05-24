# Architecture

## Monorepo layout

```
her-time/
├── frontend/          # React + Vite + Tailwind
├── backend/           # Express + PostgreSQL
├── docs/              # Project documentation
├── docker-compose.yml # Local PostgreSQL
└── package.json       # npm workspaces root
```

## Backend layers

| Layer       | Path               | Responsibility              |
| ----------- | ------------------ | --------------------------- |
| Routes      | `src/routes/`      | HTTP endpoints              |
| Controllers | `src/controllers/` | Request/response handling   |
| Services    | `src/services/`    | Business logic              |
| Config      | `src/config/`      | Env and database            |
| Middleware  | `src/middleware/`  | CORS, errors, auth (future) |

## API

- `GET /` — API metadata (development only)
- `GET /api/health` — Health check (includes DB status)

In production, the Express server also serves the built React app from `frontend/dist`.

## Database

- `backend/db/init.sql` — Docker Postgres first-boot init
- `backend/db/migrations/` — Versioned SQL migrations (`npm run db:migrate`)

## Frontend layers

| Layer      | Path              | Responsibility     |
| ---------- | ----------------- | ------------------ |
| Pages      | `src/pages/`      | Route-level views  |
| Components | `src/components/` | Reusable UI        |
| Layouts    | `src/layouts/`    | Page shells        |
| Services   | `src/services/`   | API client         |
| Hooks      | `src/hooks/`      | Shared React hooks |
| Utils      | `src/utils/`      | Helpers            |
