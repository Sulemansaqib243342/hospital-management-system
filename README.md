# 🏥 SS Pharmaceuticals HMS — Hospital Management System

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Oracle](https://img.shields.io/badge/Oracle-F80000?style=for-the-badge&logo=oracle&logoColor=white)](https://www.oracle.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A premium, full-stack Hospital Management System designed for **SS Pharmaceuticals**. This application provides a comprehensive suite of tools for healthcare providers to manage patients, appointments, pharmacy inventory, and billing through a unified, secure dashboard.

---

## 🚀 Key Features

- 🔐 **Secure Authentication** — JWT-based login/logout with role-based access control.
- 📊 **Real-time Dashboard** — Live KPIs for appointments, patient registrations, and revenue.
- 📂 **Patient Management** — Full CRUD operations for patient records and history.
- 📅 **Smart Scheduling** — Efficient appointment booking and doctor availability tracking.
- 💊 **Pharmacy Suite** — Inventory management with low-stock alerts and digital prescriptions.
- 💳 **Billing & Invoicing** — Automated invoice generation and payment status tracking.
- 🏛️ **Oracle Integration** — Powered by Oracle 19c for high-performance relational data management.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** Oracle 19c (Relational)
- **Security:** JWT + bcryptjs
- **Icons:** Tabler Icons

---

## 📂 Project Architecture

```bash
hospital-hms/
├── backend/              # Node.js + Express API
│   ├── controllers/      # Business logic
│   ├── db/               # Oracle connection + schema.sql
│   ├── middleware/       # JWT auth middleware
│   ├── routes/           # API endpoints
│   └── server.js         # Entry point
└── frontend/             # React app (Vite + Tailwind)
    └── src/
        ├── context/      # Global Auth State
        ├── pages/        # Dashboard, Patients, Pharmacy, etc.
        ├── components/   # UI Layout & Sidebar
        └── services/     # API Client (Axios)
```

---

## ⚙️ Installation & Setup

### 1. Database Setup (Oracle 19c)
1. Open **SQL Developer** and connect to your instance.
2. Run the schema script: `backend/db/schema.sql`.
3. Create the dedicated user:
```sql
CREATE USER hms_user IDENTIFIED BY hms_password;
GRANT CONNECT, RESOURCE, DBA TO hms_user;
```

### 2. Backend Configuration
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
DB_USER=hms_user
DB_PASSWORD=hms_password
DB_CONNECT=localhost:1521/ORCL
JWT_SECRET=your_secure_secret_key
```
Run the server: `npm run dev`

### 3. Frontend Configuration
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Default Credentials
- **Admin Login:** `admin@hospital.com`
- **Password:** `admin123`

---

## 👤 Author
**Suleman Saqib**  
[GitHub Profile](https://github.com/Sulemansaqib243342) | [LinkedIn](https://www.linkedin.com/in/sulemansaqib)

---
*Developed as a Final Year Project for SS Pharmaceuticals.*
