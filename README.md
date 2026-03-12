# DearDiary

Full-stack Reddit-style application using React, TypeScript, MUI, LESS, Express, Node.js, PostgreSQL, and JWT authentication.

## Apps

- `client`: Vite + React + TypeScript + MUI frontend
- `server`: Express + TypeScript + PostgreSQL API

## Features

- JWT sign up and sign in
- Protected routes
- Users, posts, likes, favourites
- Modular controllers, routes, middleware, and models
- LESS-based styling layered with MUI

## Quick Start

1. Install dependencies:

```bash
cmd /c npm install --workspaces
```

2. Copy `server/.env.example` to `server/.env` and update values.

3. Start PostgreSQL and create a database named `reddit_clone`.

If PostgreSQL is not running on `localhost:5432`, update `DATABASE_URL` in `server/.env` before starting the API.

4. Create the database schema:

```bash
psql -U postgres -d reddit_clone -f server/database/schema.sql
```

5. Run the apps:

```bash
cmd /c npm --workspace server run dev
cmd /c npm --workspace client run dev
```

## Troubleshooting

- If sign up or sign in returns `Database unavailable. Start PostgreSQL and try again.`, the API cannot reach the Postgres server defined by `DATABASE_URL`.
- The health endpoint at `http://localhost:5000/health` now reports both API and database status.
