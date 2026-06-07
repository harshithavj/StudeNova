# STUDENOVA Admin Backend

This backend runs the admin API for the separate admin website.

It reuses the main StudeNova backend app, database models, authentication, and admin routes from:

```text
studenova-website/backend
```

## Run Locally

```powershell
cd "c:\Users\j\OneDrive\Documents\StudeNova 2\admin-website\backend"
..\..\studenova-website\backend\.venv\Scripts\python.exe run.py
```

Open:

```text
http://localhost:5100/api/health
```

The admin frontend uses:

```text
http://localhost:5100/api
```

The admin management routes are under:

```text
http://localhost:5100/api/admin
```
