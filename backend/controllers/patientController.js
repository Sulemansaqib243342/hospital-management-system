const { getConnection } = require('../db/connection');

exports.getAllPatients = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    let result;
    try {
      result = await conn.execute(
        `SELECT patient_id, full_name, dob, gender, blood_group, phone, email,
                admission_status as status, ward, doctor_name, dept_name
         FROM patient_details_v ORDER BY created_at DESC`,
        [], { outFormat: require('oracledb').OUT_FORMAT_OBJECT }
      );
    } catch (viewErr) {
      console.warn('patient_details_v not found, falling back to patients table:', viewErr.message);
      result = await conn.execute(
        `SELECT patient_id, full_name, dob, gender, blood_group, phone, email,
                address, emergency_contact, created_at
         FROM patients ORDER BY created_at DESC`,
        [], { outFormat: require('oracledb').OUT_FORMAT_OBJECT }
      );
    }
    res.json(result.rows);
  } catch (err) {
    console.error('getAllPatients error:', err.message);
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
  const { full_name, dob, gender, blood_group, phone, email, address, emergency_contact } = req.body;
  let conn;
  try {
    conn = await getConnection();
    await conn.execute(
  `UPDATE patients SET 
    full_name = NVL(:full_name, full_name),
    dob = CASE WHEN :dob IS NOT NULL THEN TO_DATE(:dob, 'YYYY-MM-DD') ELSE dob END,
    gender = NVL(:gender, gender),
    blood_group = NVL(:blood_group, blood_group),
    phone = NVL(:phone, phone),
    email = NVL(:email, email),
    address = NVL(:address, address),
    emergency_contact = NVL(:emergency_contact, emergency_contact)
   WHERE patient_id = :id`,
  {
    full_name,
    dob,
    gender,
    blood_group,
    phone,
    email,
    address,
    emergency_contact,
    id: req.params.id
  },
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
