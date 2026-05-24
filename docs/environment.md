# Environment setup

## Backend (`backend/.env`)

```bash
cp backend/.env.example backend/.env
```

| Variable       | Description                                 | Required in prod |
| -------------- | ------------------------------------------- | ---------------- |
| `NODE_ENV`     | `development` or `production`               | Yes              |
| `PORT`         | API port (default `5000`)                   | No               |
| `DATABASE_URL` | PostgreSQL connection string                | Yes              |
| `CORS_ORIGIN`  | Allowed frontend origin(s), comma-separated | No               |

In production, the server exits on startup if `DATABASE_URL` is missing.

## Frontend (`frontend/.env`)

```bash
cp frontend/.env.example frontend/.env
```

| Variable       | Description                                                                   |
| -------------- | ----------------------------------------------------------------------------- |
| `VITE_API_URL` | API base URL; leave empty in dev (Vite proxy) or prod when API serves the SPA |

## Local PostgreSQL

```bash
npm run db:up
npm run db:migrate
```

Default connection string:

```
postgresql://postgres:postgres@localhost:5432/her_time
```
