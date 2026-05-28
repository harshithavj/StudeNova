# Deployment Guide

## Supabase

1. Create a Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`.
3. Copy the project database connection string.
4. Create or verify the public `event-posters` storage bucket.
5. Copy `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and database URL into backend environment variables.

## Backend on Render or Railway

Root directory: `backend`

Build command:

```bash
pip install -r requirements.txt
```

Start command:

```bash
gunicorn run:app
```

Required environment variables:

- `SECRET_KEY`
- `JWT_SECRET_KEY`
- `DATABASE_URL`
- `FRONTEND_ORIGIN`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`

## Frontend on Vercel or Netlify

Root directory: `frontend`

Build command:

```bash
npm run build
```

Publish directory:

```bash
dist
```

Required environment variables:

- `VITE_API_BASE_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
