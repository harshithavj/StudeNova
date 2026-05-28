# STUDENOVA

STUDENOVA is a centralized student event discovery and management platform for academic, cultural, technical, and industry opportunities.

Tagline: **Never Miss an Opportunity Again**

## Stack

- Frontend: React, React Router, Axios, Tailwind CSS, Framer Motion, Recharts
- Backend: Flask, REST blueprints, JWT auth, SQLAlchemy, Marshmallow, Flask-Limiter
- Database: Supabase PostgreSQL
- Storage: Supabase Storage for event posters

## Folder Structure

```text
backend/
  app/
    blueprints/
    extensions/
    models/
    schemas/
    services/
    utils/
  run.py
  requirements.txt
frontend/
  src/
    components/
    context/
    data/
    hooks/
    pages/
    services/
    utils/
supabase/
  schema.sql
docs/
  API.md
  DEPLOYMENT.md
```

## Run Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`.

## Run Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python run.py
```

The API runs on `http://localhost:5000/api`.

## Connect Supabase

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Set `DATABASE_URL` in `backend/.env` using Supabase's PostgreSQL connection string.
4. Set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `SUPABASE_STORAGE_BUCKET`.
5. Set `VITE_API_BASE_URL=http://localhost:5000/api` in `frontend/.env`.

## Core Features Included

- Role-based signup/login with JWT and hashed passwords
- Student, college admin, and industry organizer roles
- Event CRUD API with tags, poster upload hook, filtering, sorting, and popularity score
- Registrations with QR tokens and check-in route
- Smart staged notification scheduling
- Bookmarks and saved events
- Analytics endpoints and dashboard charts
- AI-style recommendation endpoint based on student registration categories
- Responsive glassmorphism UI with dark/light mode
- Protected React routes and lazy-loaded pages
- API documentation and deployment guide

## Production Notes

- Run migrations with Flask-Migrate if you evolve models after applying the Supabase SQL.
- Use Render or Railway for Flask and Vercel or Netlify for React.
- Keep `SUPABASE_SERVICE_ROLE_KEY` only on the backend.
- Configure a transactional email provider for sending scheduled notification records.
