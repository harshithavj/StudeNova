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
studenova-website/
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

```powershell
cd "c:\Users\j\OneDrive\Documents\StudeNova 2\studenova-website\frontend"
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`.

## Run Backend

```powershell
cd "c:\Users\j\OneDrive\Documents\StudeNova 2\studenova-website\backend"
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python run.py
```

The API runs on `http://localhost:5000/api`.

Admin management routes run under `http://localhost:5000/api/admin` and are consumed by the separate `admin-website` folder.

## Connect Supabase

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Set `DATABASE_URL` in `backend/.env` using Supabase's PostgreSQL connection string.
4. Set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `SUPABASE_STORAGE_BUCKET`.
5. Set `VITE_API_BASE_URL=http://localhost:5000/api` in `frontend/.env`.

