# 🎓 StudeNova

A comprehensive student-industry collaboration platform that connects students, colleges, industries, and administrators through a unified digital ecosystem.

---

## 📖 About

Studenova is designed to bridge the gap between academia and industry by providing a centralized platform for students to discover opportunities, participate in events, showcase skills, and connect with industry professionals.

The platform consists of four major modules:

- **Student Portal** – Access events, internships, opportunities, and career resources.
- **College Organizer Portal** – Manage college events and student participation.
- **Industry Organizer Portal** – Create opportunities, host events, and recruit talent.
- **Super Admin Portal** – Monitor the entire platform, verify organizers, and manage users.

---

## 🚀 Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript (ES6+)
- Tailwind CSS

### Backend
- Python
- Flask

### Database
- Supabase

### Authentication
- JWT Authentication
- Role-Based Access Control (RBAC)

### Tools & Deployment
- Git
- GitHub
- VS Code

---

## 📂 Project Structure

```text
STUDENOVA/
│
├── admin-website/
│   ├── index.html
│   ├── app.js
│   ├── styles.css
│   └── assets/
│
├── studenova-website/
│   │
│   ├── backend/
│   │   ├── app/
│   │   │   ├── routes/
│   │   │   ├── models/
│   │   │   ├── services/
│   │   │   ├── utils/
│   │   │   └── __init__.py
│   │   │
│   │   ├── instance/
│   │   ├── .venv/
│   │   ├── .env
│   │   ├── requirements.txt
│   │   ├── backend-server.py
│   │   └── run.py
│   │
│   ├── frontend/
│   │   ├── student/
│   │   ├── college-organizer/
│   │   ├── industry-organizer/
│   │   ├── assets/
│   │   └── components/
│   │
│   ├── supabase/
│   │   ├── migrations/
│   │   └── config/
│   │
│   └── docs/
│       ├── API.md
│       └── DEPLOYMENT.md
│
├── .gitignore
├── LICENSE
└── README.md
```
## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/your-username/studenova.git
cd studenova
```

### Backend Setup

```bash
cd studenova-website/backend

python -m venv .venv

# Windows
.venv\Scripts\activate

# Linux/Mac
source .venv/bin/activate

pip install -r requirements.txt

python run.py
```

### Frontend Setup

```bash
cd studenova-website/frontend
```

Open `index.html` or start your preferred development server.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit changes

```bash
git commit -m "feat: add new feature"
```

4. Push changes

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

## 👨‍💻 Developed For
Studenova – Empowering students, colleges, and industries through a connected digital ecosystem.
