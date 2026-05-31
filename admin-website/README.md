# STUDENOVA Admin Website

This is a separate admin website for managing the main STUDENOVA app.

## Run locally

Start the backend first:

```powershell
cd "c:\Users\j\OneDrive\Documents\StudeNova 2\backend"
python run.py
```

Serve this admin website on port `5174`:

```powershell
cd "c:\Users\j\OneDrive\Documents\StudeNova 2"
python -m http.server 5174 -d admin-website
```

Open:

```text
http://localhost:5174
```

The backend allows this origin through `ADMIN_FRONTEND_ORIGIN`, which defaults to `http://localhost:5174`.

## Login

Use an account whose `users.role` value is `admin`. Non-admin accounts are rejected by the admin website.

## Admin signup

Use **Create admin account** on the login page. The flow sends an OTP to the email address, then creates the admin account after the OTP is entered.

The backend must have SMTP settings configured for OTP email delivery.
