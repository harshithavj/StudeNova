# StudeNova Project

This workspace is split into two separate website folders:

```text
admin-website/
  Standalone admin portal

studenova-website/
  Main StudeNova website, backend API, docs, and Supabase schema
```

## Admin Portal

Start the backend API:

```powershell
cd "c:\Users\j\OneDrive\Documents\StudeNova 2\studenova-website\backend"
python run.py
```

In another terminal, start the admin website:

```powershell
cd "c:\Users\j\OneDrive\Documents\StudeNova 2"
python -m http.server 5174 -d admin-website
```

Open `http://localhost:5174`.

## Main StudeNova Website

Start the frontend:

```powershell
cd "c:\Users\j\OneDrive\Documents\StudeNova 2\studenova-website\frontend"
npm run dev
```

Open `http://localhost:5173`.

The backend API runs at `http://localhost:5000/api`.
