-- =============================================
-- HOSPITAL MANAGEMENT SYSTEM - ORACLE SCHEMA
-- Run this in SQL Developer
-- =============================================

-- 1. DEPARTMENTS
CREATE TABLE departments (
  dept_id     NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  dept_name   VARCHAR2(100) NOT NULL,
  description VARCHAR2(255),
  created_at  DATE DEFAULT SYSDATE
);

-- 2. STAFF / DOCTORS
CREATE TABLE staff (
  staff_id    NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name   VARCHAR2(100) NOT NULL,
  email       VARCHAR2(100) UNIQUE NOT NULL,
  password    VARCHAR2(255) NOT NULL,
  phone       VARCHAR2(20),
  role        VARCHAR2(30) CHECK (role IN ('doctor','nurse','admin','pharmacist')),
  designation VARCHAR2(100),
  dept_id     NUMBER REFERENCES departments(dept_id),
  shift       VARCHAR2(20) CHECK (shift IN ('morning','evening','night')),
  status      VARCHAR2(20) DEFAULT 'active',
  created_at  DATE DEFAULT SYSDATE
);

-- 3. PATIENTS
CREATE TABLE patients (
  patient_id  NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name   VARCHAR2(100) NOT NULL,
  dob         DATE,
  gender      VARCHAR2(10) CHECK (gender IN ('male','female','other')),
  blood_group VARCHAR2(5),
  phone       VARCHAR2(20),
  email       VARCHAR2(100),
  address     VARCHAR2(255),
  emergency_contact VARCHAR2(100),
  created_at  DATE DEFAULT SYSDATE
);

-- 4. ADMISSIONS
CREATE TABLE admissions (
  admission_id   NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  patient_id     NUMBER REFERENCES patients(patient_id),
  doctor_id      NUMBER REFERENCES staff(staff_id),
  dept_id        NUMBER REFERENCES departments(dept_id),
  ward           VARCHAR2(50),
  bed_number     VARCHAR2(10),
  admission_date DATE DEFAULT SYSDATE,
  discharge_date DATE,
  condition      VARCHAR2(255),
  status         VARCHAR2(20) DEFAULT 'admitted' CHECK (status IN ('admitted','discharged','critical','stable','monitoring'))
);

-- 5. APPOINTMENTS
CREATE TABLE appointments (
  appt_id      NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  patient_id   NUMBER REFERENCES patients(patient_id),
  doctor_id    NUMBER REFERENCES staff(staff_id),
  dept_id      NUMBER REFERENCES departments(dept_id),
  appt_date    DATE NOT NULL,
  appt_time    VARCHAR2(10),
  reason       VARCHAR2(255),
  status       VARCHAR2(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled','confirmed','completed','cancelled','missed')),
  notes        VARCHAR2(500),
  created_at   DATE DEFAULT SYSDATE
);

-- 6. MEDICINES
CREATE TABLE medicines (
  medicine_id  NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name         VARCHAR2(100) NOT NULL,
  category     VARCHAR2(50),
  unit         VARCHAR2(20),
  quantity     NUMBER DEFAULT 0,
  min_quantity NUMBER DEFAULT 10,
  price        NUMBER(10,2),
  expiry_date  DATE,
  supplier     VARCHAR2(100),
  created_at   DATE DEFAULT SYSDATE
);

-- 7. PRESCRIPTIONS
CREATE TABLE prescriptions (
  prescription_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  patient_id      NUMBER REFERENCES patients(patient_id),
  doctor_id       NUMBER REFERENCES staff(staff_id),
  medicine_id     NUMBER REFERENCES medicines(medicine_id),
  quantity        NUMBER,
  dosage          VARCHAR2(100),
  duration        VARCHAR2(50),
  dispensed       NUMBER(1) DEFAULT 0,
  prescribed_at   DATE DEFAULT SYSDATE
);

-- 8. BILLING
CREATE TABLE billing (
  bill_id       NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  patient_id    NUMBER REFERENCES patients(patient_id),
  admission_id  NUMBER REFERENCES admissions(admission_id),
  total_amount  NUMBER(12,2),
  paid_amount   NUMBER(12,2) DEFAULT 0,
  payment_mode  VARCHAR2(30) CHECK (payment_mode IN ('cash','card','insurance','online')),
  status        VARCHAR2(20) DEFAULT 'pending' CHECK (status IN ('pending','paid','partial','overdue')),
  bill_date     DATE DEFAULT SYSDATE,
  notes         VARCHAR2(255)
);

-- =============================================
-- SEED DATA - Sample departments
-- =============================================
INSERT INTO departments (dept_name, description) VALUES ('Cardiology', 'Heart related treatments');
INSERT INTO departments (dept_name, description) VALUES ('General', 'General medicine and OPD');
INSERT INTO departments (dept_name, description) VALUES ('Orthopedics', 'Bone and joint treatments');
INSERT INTO departments (dept_name, description) VALUES ('Pediatrics', 'Child healthcare');
INSERT INTO departments (dept_name, description) VALUES ('Neurology', 'Brain and nervous system');
INSERT INTO departments (dept_name, description) VALUES ('ICU', 'Intensive Care Unit');

COMMIT;
