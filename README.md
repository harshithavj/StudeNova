# StudeNova Project

This workspace is split into two separate website folders:

```text
admin-website/
  Standalone admin portal

studenova-website/
  Main StudeNova website, backend API, docs, and Supabase schema
```

## Admin Portal

Start the admin backend API:

```powershell
cd "c:\Users\j\OneDrive\Documents\StudeNova 2\admin-website\backend"
..\..\studenova-website\backend\.venv\Scripts\python.exe run.py
```

The admin API runs at `http://localhost:5100/api`.

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

## Admin Management API

The admin website has its own backend at:

```text
http://localhost:5100/api/admin
```

That API powers organizer approval, user notifications, event monitoring, top events, user account status, achievement review, analytics, audit logs, and dashboard activity while reusing the main StudeNova database.
