-- ====================================================================
-- HOSPITAL MANAGEMENT SYSTEM (HMS) - PL/SQL SETUP SCRIPT
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. VIEWS
-- --------------------------------------------------------------------

-- View for Patient details including active admission info (Inpatients)
CREATE OR REPLACE VIEW patient_details_v AS
SELECT p.patient_id, 
       p.full_name, 
       p.dob, 
       p.gender, 
       p.blood_group, 
       p.phone, 
       p.email, 
       p.address, 
       p.emergency_contact,
       a.admission_id,
       a.status as admission_status, 
       a.ward, 
       a.bed_number, 
       d.full_name as doctor_name, 
       dep.dept_name, 
       p.created_at
FROM patients p
LEFT JOIN admissions a ON p.patient_id = a.patient_id AND a.discharge_date IS NULL
LEFT JOIN staff d ON a.doctor_id = d.staff_id
LEFT JOIN departments dep ON a.dept_id = dep.dept_id;
/

-- View for Appointment details
CREATE OR REPLACE VIEW appointment_details_v AS
SELECT a.appt_id, 
       a.appt_date, 
       a.appt_time, 
       a.reason, 
       a.status, 
       a.notes,
       a.patient_id, 
       p.full_name as patient_name, 
       p.phone as patient_phone,
       a.doctor_id, 
       s.full_name as doctor_name, 
       a.dept_id, 
       d.dept_name, 
       a.created_at
FROM appointments a
JOIN patients p ON a.patient_id = p.patient_id
JOIN staff s ON a.doctor_id = s.staff_id
JOIN departments d ON a.dept_id = d.dept_id;
/

-- View for Billing summaries
CREATE OR REPLACE VIEW billing_summary_v AS
SELECT b.bill_id, 
       b.patient_id, 
       b.admission_id, 
       b.total_amount, 
       b.paid_amount, 
       b.payment_mode, 
       b.status, 
       b.bill_date, 
       b.notes,
       p.full_name as patient_name, 
       p.phone as patient_phone, 
       p.address as patient_address,
       (b.total_amount - b.paid_amount) as balance
FROM billing b
JOIN patients p ON b.patient_id = p.patient_id;
/

-- View for Medicine Stock status details
CREATE OR REPLACE VIEW medicine_inventory_v AS
SELECT medicine_id, 
       name, 
       category, 
       unit, 
       quantity, 
       min_quantity, 
       price, 
       expiry_date, 
       supplier, 
       created_at,
       CASE 
         WHEN quantity = 0 THEN 'out_of_stock'
         WHEN quantity <= min_quantity THEN 'low'
         ELSE 'ok' 
       END as stock_status
FROM medicines;
/


-- --------------------------------------------------------------------
-- 2. TRIGGERS
-- --------------------------------------------------------------------

-- Before Insert or Update Trigger on Billing table to set payment status
CREATE OR REPLACE TRIGGER trg_update_billing_status
BEFORE INSERT OR UPDATE ON billing
FOR EACH ROW
BEGIN
  IF :NEW.paid_amount >= :NEW.total_amount THEN
    :NEW.status := 'paid';
  ELSIF :NEW.paid_amount > 0 THEN
    :NEW.status := 'partial';
  ELSE
    :NEW.status := 'pending';
  END IF;
END;
/


-- --------------------------------------------------------------------
-- 3. STORED PROCEDURES WITH CURSORS & EXCEPTION HANDLING
-- --------------------------------------------------------------------

-- Procedure to safely add a prescription and deduct inventory
CREATE OR REPLACE PROCEDURE sp_add_prescription (
    p_patient_id IN NUMBER,
    p_doctor_id IN NUMBER,
    p_medicine_id IN NUMBER,
    p_quantity IN NUMBER,
    p_dosage IN VARCHAR2,
    p_duration IN VARCHAR2
) AS
    v_current_stock NUMBER;
    v_med_name VARCHAR2(100);
    v_patient_count NUMBER;
    v_doctor_count NUMBER;
    
    -- Custom PL/SQL Exceptions
    insufficient_stock EXCEPTION;
    invalid_patient EXCEPTION;
    invalid_doctor EXCEPTION;
    invalid_medicine EXCEPTION;
BEGIN
    -- 1. Validate Patient Existence
    SELECT COUNT(*) INTO v_patient_count FROM patients WHERE patient_id = p_patient_id;
    IF v_patient_count = 0 THEN
        RAISE invalid_patient;
    END IF;

    -- 2. Validate Doctor Existence and Active status
    SELECT COUNT(*) INTO v_doctor_count FROM staff WHERE staff_id = p_doctor_id AND role = 'doctor' AND status = 'active';
    IF v_doctor_count = 0 THEN
        RAISE invalid_doctor;
    END IF;

    -- 3. Retrieve Medicine Details and Stock Level
    BEGIN
        SELECT quantity, name INTO v_current_stock, v_med_name FROM medicines WHERE medicine_id = p_medicine_id;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE invalid_medicine;
    END;

    -- 4. Check Stock Availability
    IF v_current_stock < p_quantity THEN
        RAISE insufficient_stock;
    END IF;

    -- 5. Record the Prescription (defaulting dispensed to 1 for direct pharmacy additions)
    INSERT INTO prescriptions (patient_id, doctor_id, medicine_id, quantity, dosage, duration, dispensed, prescribed_at)
    VALUES (p_patient_id, p_doctor_id, p_medicine_id, p_quantity, p_dosage, p_duration, 1, SYSDATE);

    -- 6. Deduct from Inventory Stock
    UPDATE medicines 
    SET quantity = quantity - p_quantity 
    WHERE medicine_id = p_medicine_id;

EXCEPTION
    WHEN insufficient_stock THEN
        raise_application_error(-20001, 'Insufficient stock for medicine: ' || v_med_name || '. Available: ' || v_current_stock || ', Requested: ' || p_quantity);
    WHEN invalid_patient THEN
        raise_application_error(-20002, 'Invalid or non-existent Patient ID: ' || p_patient_id);
    WHEN invalid_doctor THEN
        raise_application_error(-20003, 'Invalid or inactive Doctor ID: ' || p_doctor_id);
    WHEN invalid_medicine THEN
        raise_application_error(-20004, 'Invalid or non-existent Medicine ID: ' || p_medicine_id);
    WHEN OTHERS THEN
        raise_application_error(-20099, 'Database error in sp_add_prescription: ' || SQLERRM);
END;
/

-- Procedure to discharge inpatient, compute bills dynamically, using Cursor and Exceptions
CREATE OR REPLACE PROCEDURE sp_discharge_patient (
    p_admission_id IN NUMBER,
    p_payment_mode IN VARCHAR2,
    p_notes IN VARCHAR2
) AS
    v_patient_id NUMBER;
    v_admission_date DATE;
    v_days NUMBER;
    v_room_cost NUMBER;
    v_appt_cost NUMBER := 0;
    v_med_cost NUMBER := 0;
    v_total_cost NUMBER := 0;
    v_status VARCHAR2(20);
    
    -- Cursors
    -- Cursor to count doctor appointments since admission
    CURSOR c_appts IS
        SELECT COUNT(*) as count 
        FROM appointments 
        WHERE patient_id = v_patient_id 
          AND appt_date BETWEEN v_admission_date AND SYSDATE;
          
    -- Cursor to sum up all undispensed/pending prescriptions for this patient
    CURSOR c_meds IS
        SELECT NVL(SUM(pr.quantity * med.price), 0) as cost
        FROM prescriptions pr
        JOIN medicines med ON pr.medicine_id = med.medicine_id
        WHERE pr.patient_id = v_patient_id 
          AND pr.dispensed = 1; -- dispensed/billed medicines
          
    v_appt_count NUMBER := 0;
    v_med_sum NUMBER := 0;
    
    invalid_admission EXCEPTION;
    already_discharged EXCEPTION;
BEGIN
    -- 1. Validate Admission and Status
    BEGIN
        SELECT patient_id, admission_date, status 
        INTO v_patient_id, v_admission_date, v_status
        FROM admissions 
        WHERE admission_id = p_admission_id;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE invalid_admission;
    END;
    
    IF v_status = 'discharged' THEN
        RAISE already_discharged;
    END IF;
    
    -- 2. Update Admission status and discharge date
    UPDATE admissions 
    SET discharge_date = SYSDATE, 
        status = 'discharged' 
    WHERE admission_id = p_admission_id;
    
    -- 3. Calculate Ward Room stay cost (Assume $100 per day, minimum of 1 day)
    v_days := CEIL(SYSDATE - v_admission_date);
    IF v_days <= 0 THEN
        v_days := 1;
    END IF;
    v_room_cost := v_days * 100;
    
    -- 4. Open and process Cursors to aggregate other expenses
    OPEN c_appts;
    FETCH c_appts INTO v_appt_count;
    CLOSE c_appts;
    v_appt_cost := NVL(v_appt_count, 0) * 50; -- Standard $50 per consultation
    
    OPEN c_meds;
    FETCH c_meds INTO v_med_sum;
    CLOSE c_meds;
    v_med_cost := v_med_sum;
    
    v_total_cost := v_room_cost + v_appt_cost + v_med_cost;
    
    -- 5. Insert billing record (will trigger trg_update_billing_status)
    INSERT INTO billing (patient_id, admission_id, total_amount, paid_amount, payment_mode, notes, bill_date)
    VALUES (v_patient_id, p_admission_id, v_total_cost, 0, p_payment_mode, 
            'Discharge Bill: Ward Stay (' || v_days || ' days) $' || v_room_cost || 
            ', Appointments $' || v_appt_cost || ', Pharmacy $' || v_med_cost || '. Notes: ' || p_notes, SYSDATE);
            
EXCEPTION
    WHEN invalid_admission THEN
        raise_application_error(-20010, 'Invalid or non-existent Admission ID: ' || p_admission_id);
    WHEN already_discharged THEN
        raise_application_error(-20011, 'Admission ID ' || p_admission_id || ' has already been discharged.');
    WHEN OTHERS THEN
        raise_application_error(-20099, 'Database error in sp_discharge_patient: ' || SQLERRM);
END;
/
