const { getConnection } = require('../db/connection');

exports.getAllPatients = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT p.patient_id, p.full_name, p.dob, p.gender, p.blood_group, p.phone, p.email,
              a.status, a.ward, d.full_name as doctor_name, dep.dept_name
       FROM patients p
       LEFT JOIN admissions a ON p.patient_id = a.patient_id AND a.discharge_date IS NULL
       LEFT JOIN staff d ON a.doctor_id = d.staff_id
       LEFT JOIN departments dep ON a.dept_id = dep.dept_id
       ORDER BY p.created_at DESC`,
      [], { outFormat: require('oracledb').OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

exports.getPatientById = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT * FROM patients WHERE patient_id = :id`,
      { id: req.params.id },
      { outFormat: require('oracledb').OUT_FORMAT_OBJECT }
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Patient not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

exports.createPatient = async (req, res) => {
  const { full_name, dob, gender, blood_group, phone, email, address, emergency_contact } = req.body;
  let conn;
  try {
    conn = await getConnection();
    await conn.execute(
      `INSERT INTO patients (full_name, dob, gender, blood_group, phone, email, address, emergency_contact)
       VALUES (:full_name, TO_DATE(:dob,'YYYY-MM-DD'), :gender, :blood_group, :phone, :email, :address, :emergency_contact)`,
      { full_name, dob, gender, blood_group, phone, email, address, emergency_contact },
      { autoCommit: true }
    );
    res.status(201).json({ message: 'Patient registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

exports.updatePatient = async (req, res) => {
  const { full_name, phone, email, address } = req.body;
  let conn;
  try {
    conn = await getConnection();
    await conn.execute(
      `UPDATE patients SET full_name=:full_name, phone=:phone, email=:email, address=:address
       WHERE patient_id=:id`,
      { full_name, phone, email, address, id: req.params.id },
      { autoCommit: true }
    );
    res.json({ message: 'Patient updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

exports.deletePatient = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    await conn.execute(
      `DELETE FROM patients WHERE patient_id = :id`,
      { id: req.params.id },
      { autoCommit: true }
    );
    res.json({ message: 'Patient deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
};
