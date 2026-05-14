const oracledb = require('oracledb');
const { getConnection } = require('../db/connection');

exports.getAllAppointments = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT a.appt_id, a.appt_date, a.appt_time, a.reason, a.status, a.notes,
              p.full_name as patient_name, p.phone as patient_phone,
              s.full_name as doctor_name, d.dept_name
       FROM appointments a
       JOIN patients p ON a.patient_id = p.patient_id
       JOIN staff s ON a.doctor_id = s.staff_id
       JOIN departments d ON a.dept_id = d.dept_id
       ORDER BY a.appt_date DESC, a.appt_time ASC`,
      [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

exports.getTodayAppointments = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT a.appt_id, a.appt_time, a.reason, a.status,
              p.full_name as patient_name,
              s.full_name as doctor_name, d.dept_name
       FROM appointments a
       JOIN patients p ON a.patient_id = p.patient_id
       JOIN staff s ON a.doctor_id = s.staff_id
       JOIN departments d ON a.dept_id = d.dept_id
       WHERE TRUNC(a.appt_date) = TRUNC(SYSDATE)
       ORDER BY a.appt_time ASC`,
      [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

exports.createAppointment = async (req, res) => {
  const { patient_id, doctor_id, dept_id, appt_date, appt_time, reason, notes } = req.body;
  let conn;
  try {
    conn = await getConnection();
    await conn.execute(
      `INSERT INTO appointments (patient_id, doctor_id, dept_id, appt_date, appt_time, reason, notes)
       VALUES (:patient_id, :doctor_id, :dept_id, TO_DATE(:appt_date,'YYYY-MM-DD'), :appt_time, :reason, :notes)`,
      { patient_id, doctor_id, dept_id, appt_date, appt_time, reason, notes },
      { autoCommit: true }
    );
    res.status(201).json({ message: 'Appointment booked successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  const { status } = req.body;
  let conn;
  try {
    conn = await getConnection();
    await conn.execute(
      `UPDATE appointments SET status = :status WHERE appt_id = :id`,
      { status, id: req.params.id },
      { autoCommit: true }
    );
    res.json({ message: 'Appointment status updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

exports.deleteAppointment = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    await conn.execute(
      `DELETE FROM appointments WHERE appt_id = :id`,
      { id: req.params.id },
      { autoCommit: true }
    );
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

exports.attendPatient = async (req, res) => {
  const { notes, prescriptions } = req.body;
  const appt_id = req.params.id;
  let conn;
  
  try {
    conn = await getConnection();
    
    // 1. Get patient_id and doctor_id from appointment
    const result = await conn.execute(
      `SELECT patient_id, doctor_id FROM appointments WHERE appt_id = :appt_id`,
      { appt_id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    const { PATIENT_ID, DOCTOR_ID } = result.rows[0];

    // 2. Update appointment notes and status
    await conn.execute(
      `UPDATE appointments SET notes = :notes, status = 'completed' WHERE appt_id = :appt_id`,
      { notes, appt_id },
      { autoCommit: false }
    );

    // 3. Insert prescriptions if any
    if (prescriptions && prescriptions.length > 0) {
      for (const p of prescriptions) {
        await conn.execute(
          `INSERT INTO prescriptions (patient_id, doctor_id, medicine_id, quantity, dosage, duration)
           VALUES (:patient_id, :doctor_id, :medicine_id, :quantity, :dosage, :duration)`,
          {
            patient_id: PATIENT_ID,
            doctor_id: DOCTOR_ID,
            medicine_id: p.medicine_id,
            quantity: p.quantity,
            dosage: p.dosage,
            duration: p.duration
          },
          { autoCommit: false }
        );
      }
    }

    // Commit transaction
    await conn.commit();
    res.json({ message: 'Patient attended successfully' });
    
  } catch (err) {
    if (conn) await conn.rollback();
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

