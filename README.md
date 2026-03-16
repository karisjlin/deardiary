# DearDiary

A Reddit-style journaling and community platform built with React, TypeScript, MUI, Express, Node.js, PostgreSQL, and JWT authentication.

## Apps

- `client`: Vite + React 19 + TypeScript + MUI frontend
- `server`: Express + TypeScript + PostgreSQL REST API

## Features

### Authentication
- JWT sign up and sign in
- Protected routes — unauthenticated users are redirected to the landing page
- Password reset from the account page

### Posts
- Create, edit, and delete your own posts
- Assign posts to one or more communities (comma-separated)
- Like and favourite posts (hollow icons when inactive, filled when active)
- Sort posts by Latest or Top on the homepage
- Post titles link to a dedicated post detail page

### Comments
- Add and delete comments on posts
- Comment author usernames link to their profile

### Communities
- Posts belong to one or more `d/community` communities
- Community pages show all posts for that community, sortable by Recent or Top
- Communities page lists all communities with post counts, sortable A–Z or by Most Popular
- Community names are always stored lowercase

### User Profiles
- Public profile pages at `/app/u/:username` — Posts, Likes, and Favourites tabs
- Profile owners can edit and delete their own posts from their profile
- Account page (`/app/account`) for managing email, username display, and password
- Hover over your username in the header for a dropdown to Account or Profile

### Testing
- Jest test suite for both client and server
- Server: auth middleware and post model tests
- Client: AuthForm, AuthContext, and PostCard component tests

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, TypeScript, Vite, MUI v7, React Router v7, LESS |
| Backend | Node.js, Express, TypeScript (ESM) |
| Database | PostgreSQL, `pg` |
| Auth | JWT (`jsonwebtoken`), `bcryptjs` |
| Testing | Jest, `@swc/jest`, `@testing-library/react` |
| Linting | ESLint, `typescript-eslint`, `eslint-plugin-react-hooks` |

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Copy `server/.env.example` to `server/.env` and fill in your values:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/reddit_clone
JWT_SECRET=your_secret_here
PORT=5000
```

3. Start PostgreSQL and create the database:

```bash
psql -U postgres -c "CREATE DATABASE reddit_clone;"
```

4. Run the schema migration:

```bash
psql -U postgres -d reddit_clone -f server/database/schema.sql
```

5. Start both servers:

```bash
# In separate terminals:
npm --workspace server run dev
npm --workspace client run dev
```

The client runs at `http://localhost:5173` and the API at `http://localhost:5000`.

## Running Tests

```bash
# Server tests
npm --workspace server test

# Client tests
npm --workspace client test
```

## API Overview

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/signup` | — | Create account |
| POST | `/auth/signin` | — | Sign in, returns JWT |
| GET | `/posts` | optional | List all posts (sort: recent/top) |
| POST | `/posts` | required | Create a post |
| PATCH | `/posts/:id` | required | Edit own post |
| DELETE | `/posts/:id` | required | Delete own post |
| POST | `/posts/:id/like` | required | Toggle like |
| POST | `/posts/:id/favourite` | required | Toggle favourite |
| GET | `/posts/:id/comments` | — | Get comments |
| POST | `/posts/:id/comments` | required | Add comment |
| DELETE | `/comments/:id` | required | Delete own comment |
| GET | `/communities` | — | List all communities |
| GET | `/communities/:name/posts` | optional | Posts in a community |
| GET | `/users/me` | required | Current user info |
| GET | `/users/me/posts` | required | My posts |
| GET | `/users/me/liked` | required | Posts I liked |
| GET | `/users/me/favourited` | required | Posts I favourited |
| GET | `/users/u/:username` | — | Public profile |
| GET | `/users/u/:username/posts` | optional | User's posts |
| GET | `/users/u/:username/liked` | optional | User's liked posts |
| GET | `/users/u/:username/favourited` | optional | User's favourited posts |

## Troubleshooting

- **`Database unavailable`** — the API cannot reach PostgreSQL. Check that Postgres is running and `DATABASE_URL` in `server/.env` is correct.
- **Health check** — `http://localhost:5000/health` reports both API and database status.
- **Windows: `napi-postinstall` error** — re-run `npm install` once more; it resolves on retry.
