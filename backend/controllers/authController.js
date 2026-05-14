const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getConnection } = require('../db/connection');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT staff_id, full_name, email, password, role FROM staff WHERE email = :email`,
      { email }
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: 'User not found' });

    const [staff_id, full_name, userEmail, hashedPwd, role] = result.rows[0];
    const valid = await bcrypt.compare(password, hashedPwd);
    if (!valid) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ staff_id, full_name, role }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { staff_id, full_name, email: userEmail, role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

exports.register = async (req, res) => {
  const { full_name, email, password, role, phone, designation, dept_id, shift } = req.body;
  let conn;
  try {
    conn = await getConnection();
    const hashed = await bcrypt.hash(password, 10);
    await conn.execute(
      `INSERT INTO staff (full_name, email, password, role, phone, designation, dept_id, shift)
       VALUES (:full_name, :email, :password, :role, :phone, :designation, :dept_id, :shift)`,
      { full_name, email, password: hashed, role, phone, designation, dept_id, shift },
      { autoCommit: true }
    );
    res.status(201).json({ message: 'Staff registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
};
