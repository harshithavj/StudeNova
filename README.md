# 🎓 Studenova

A comprehensive student-industry collaboration platform that connects students, colleges, industries, and administrators through a unified digital ecosystem.

---

## 📖 About

Studenova is designed to bridge the gap between academia and industry by providing a centralized platform for students to discover opportunities, participate in events, showcase skills, and connect with industry professionals.

The platform consists of four major modules:

* **Student Portal** – Access events, internships, opportunities, and career resources.
* **College Organizer Portal** – Manage college events and student participation.
* **Industry Organizer Portal** – Create opportunities, host events, and recruit talent.
* **Super Admin Portal** – Monitor the entire platform, verify organizers, and manage users.

---

## 🚀 Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript (ES6+)
* Tailwind CSS

### Backend

* Python
* Flask

### Database

* SQLite
* Supabase

### Authentication

* JWT Authentication
* Role-Based Access Control (RBAC)

### Tools & Development

* Git
* GitHub
* VS Code

---

## 📂 Project Structure

```text
STUDENOVA/
|
|-- admin-website/
|   |-- backend/
|   |   |-- requirements.txt
|   |   `-- run.py
|   `-- frontend/
|       |-- index.html
|       |-- app.js
|       `-- styles.css
|
|-- studenova-website/
|   |-- backend/
|   |   |-- app/
|   |   |-- instance/
|   |   |-- requirements.txt
|   |   `-- run.py
|   |
|   |-- frontend/
|   |-- supabase/
|   `-- docs/
|
|-- .gitignore
|-- LICENSE
`-- README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/harshithavj/StudeNova.git
cd StudeNova
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

```bash
git checkout -b feature/new-feature
git commit -m "feat: add new feature"
git push origin feature/new-feature
```

---

## 👨‍💻 Developed For

**Studenova – Empowering students, colleges, and industries through a connected digital ecosystem.**
