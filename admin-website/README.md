# STUDENOVA Admin Website

This is a separate admin website for managing the main STUDENOVA app.

## Structure

```text
admin-website/
  backend/
    run.py
    requirements.txt
  frontend/
    index.html
    app.js
    styles.css
```

## Run locally

Start the admin backend first:

```powershell
cd "c:\Users\j\OneDrive\Documents\StudeNova 2\admin-website\backend"
..\..\studenova-website\backend\.venv\Scripts\python.exe run.py
```

The admin API runs on `http://localhost:5100/api`.

Serve this admin website on port `5174`:

```powershell
cd "c:\Users\j\OneDrive\Documents\StudeNova 2"
python -m http.server 5174 -d admin-website\frontend
```

Open:

```text
http://localhost:5174
```

The backend allows this origin through `ADMIN_FRONTEND_ORIGIN`, which defaults to `http://localhost:5174`.

The admin website talks to its own admin backend at:

```text
http://localhost:5100/api/admin
```

This admin backend reuses the StudeNova database and backend models, so admin-only endpoints manage organizer approvals, notifications, user account status, event status, activity monitoring, top events, analytics, achievements, audit logs, and settings for the main website.

## Login

Use an account whose `users.role` value is `admin`. Non-admin accounts are rejected by the admin website.

## Admin signup

Use **Create admin account** on the login page. The flow sends an OTP to the email address, then creates the admin account after the OTP is entered.

The backend must have SMTP settings configured for OTP email delivery.
