# MedCore HMS — Hospital Management System
### Final Year Project | Full Stack | React + Node.js + Oracle 19c

---

## Project Structure
```
hospital-hms/
├── backend/              ← Node.js + Express API
│   ├── controllers/      ← Business logic
│   ├── db/               ← Oracle connection + schema.sql
│   ├── middleware/        ← JWT auth middleware
│   ├── routes/           ← API endpoints
│   ├── .env              ← Environment variables
│   └── server.js         ← Main server file
└── frontend/             ← React app (Vite + Tailwind)
    └── src/
        ├── context/      ← Auth context
        ├── pages/        ← All 7 pages
        ├── components/   ← Layout/Sidebar
        └── services/     ← Axios API client
```

---

## SETUP STEPS

### Step 1 — Oracle Database Setup
1. Open **SQL Developer**
2. Connect to your Oracle 19c database
3. Open the file: `backend/db/schema.sql`
4. Run the entire script — this creates all tables + sample departments

### Step 2 — Create Oracle User
Run this in SQL Developer as SYSDBA:
```sql
CREATE USER hms_user IDENTIFIED BY hms_password;
GRANT CONNECT, RESOURCE, DBA TO hms_user;
```

### Step 3 — Backend Setup
Open terminal in VS Code:
```bash
cd backend
npm install
```
Edit `.env` file — update your Oracle credentials:
```
DB_USER=hms_user
DB_PASSWORD=hms_password
DB_CONNECT=localhost:1521/ORCL
JWT_SECRET=hms_super_secret_jwt_key_2024
```

Start the backend:
```bash
npm run dev
```
✅ You should see: `HMS Server running on http://localhost:5000`

### Step 4 — Create First Admin User
In SQL Developer, run:
```sql
-- Password will be 'admin123' (hashed)
INSERT INTO staff (full_name, email, password, role)
VALUES ('Admin User', 'admin@hospital.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
  'admin');
COMMIT;
```
Login: `admin@hospital.com` / `admin123`

### Step 5 — Frontend Setup
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
✅ Open browser: `http://localhost:5173`

---

## API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Login |
| POST | /api/auth/register | Register staff |
| GET | /api/patients | All patients |
| POST | /api/patients | Register patient |
| GET | /api/appointments | All appointments |
| GET | /api/appointments/today | Today's schedule |
| POST | /api/appointments | Book appointment |
| PUT | /api/appointments/:id/status | Update status |
| GET | /api/staff | All staff |
| GET | /api/staff/doctors | Doctors only |
| GET | /api/pharmacy/medicines | All medicines |
| POST | /api/pharmacy/medicines | Add medicine |
| GET | /api/pharmacy/low-stock | Low stock alert |
| POST | /api/pharmacy/prescriptions | Add prescription |
| GET | /api/billing | All bills |
| POST | /api/billing | Create bill |
| GET | /api/billing/stats | Dashboard stats |

---

## Tech Stack
- **Frontend:** React 18, Vite, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** Oracle 19c
- **Auth:** JWT + bcryptjs
- **Icons:** Tabler Icons

---

## Features
- ✅ JWT Authentication (Login / Logout)
- ✅ Dashboard with live stats
- ✅ Patient registration & management
- ✅ Doctor & staff directory
- ✅ Appointment booking & scheduling
- ✅ Pharmacy inventory & prescriptions
- ✅ Billing & invoice management
- ✅ Analytics & KPI reports

---

Made for Final Year Project — City General Hospital
