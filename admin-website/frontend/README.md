# STUDENOVA Admin Frontend

Static frontend for the separate STUDENOVA admin website.

## Run Locally

Start the admin backend first:

```powershell
cd "c:\Users\j\OneDrive\Documents\StudeNova 2\admin-website\backend"
..\..\studenova-website\backend\.venv\Scripts\python.exe run.py
```

Serve the frontend on port `5174`:

```powershell
cd "c:\Users\j\OneDrive\Documents\StudeNova 2"
python -m http.server 5174 -d admin-website\frontend
```

Open:

```text
http://localhost:5174
```

The frontend uses `http://localhost:5100/api` by default.
