const oracledb = require('oracledb');
const { getConnection } = require('../db/connection');

exports.getAllStaff = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT s.staff_id, s.full_name, s.email, s.phone, s.role, s.designation,
              s.shift, s.status, d.dept_name
       FROM staff s
       LEFT JOIN departments d ON s.dept_id = d.dept_id
       ORDER BY s.role, s.full_name`,
      [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

exports.getDoctors = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT s.staff_id, s.full_name, s.designation, s.shift, d.dept_name
       FROM staff s
       LEFT JOIN departments d ON s.dept_id = d.dept_id
       WHERE s.role = 'doctor' AND s.status = 'active'
       ORDER BY s.full_name`,
      [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

exports.getStaffById = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT s.*, d.dept_name FROM staff s
       LEFT JOIN departments d ON s.dept_id = d.dept_id
       WHERE s.staff_id = :id`,
      { id: req.params.id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Staff not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

exports.updateStaff = async (req, res) => {
  const { full_name, email, role, phone, designation, dept_id, shift, status, password } = req.body;
  let conn;
  try {
    conn = await getConnection();
    // If password provided, hash it (simple placeholder – real hashing should be done elsewhere)
    const pwdClause = password ? `, password = :password` : '';
    await conn.execute(
      `UPDATE staff SET 
        full_name = NVL(:full_name, full_name),
        email = NVL(:email, email),
        role = NVL(:role, role),
        phone = NVL(:phone, phone),
        designation = NVL(:designation, designation),
        dept_id = NVL(:dept_id, dept_id),
        shift = NVL(:shift, shift),
        status = NVL(:status, status)${pwdClause}
       WHERE staff_id = :id`,
      {
        full_name,
        email,
        role,
        phone,
        designation,
        dept_id,
        shift,
        status,
        ...(password ? { password } : {}),
        id: req.params.id
      },
      { autoCommit: true }
    );
    res.json({ message: 'Staff updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
};


exports.deleteStaff = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    await conn.execute(
      `DELETE FROM staff WHERE staff_id = :id`,
      { id: req.params.id },
      { autoCommit: true }
    );
    res.json({ message: 'Staff deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
};
