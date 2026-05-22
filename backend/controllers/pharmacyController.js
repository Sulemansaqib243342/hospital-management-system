const oracledb = require('oracledb');
const { getConnection } = require('../db/connection');

exports.getAllMedicines = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    let result;
    try {
      // Try the optimized view first
      result = await conn.execute(
        `SELECT medicine_id, name, category, unit, quantity, min_quantity, price,
                expiry_date, supplier, stock_status
         FROM medicine_inventory_v ORDER BY name`,
        [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
    } catch (viewErr) {
      // View not created yet — fall back to base table with inline CASE
      console.warn('medicine_inventory_v not found, falling back to medicines table:', viewErr.message);
      result = await conn.execute(
        `SELECT medicine_id, name, category, unit, quantity, min_quantity, price,
                expiry_date, supplier,
                CASE
                  WHEN quantity = 0 THEN 'out_of_stock'
                  WHEN quantity <= min_quantity THEN 'low'
                  ELSE 'ok'
                END as stock_status
         FROM medicines ORDER BY name`,
        [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
    }
    res.json(result.rows);
  } catch (err) {
    console.error('getAllMedicines error:', err.message);
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

exports.getLowStock = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT medicine_id, name, category, quantity, min_quantity, expiry_date
       FROM medicines WHERE quantity <= min_quantity ORDER BY quantity ASC`,
      [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

exports.addMedicine = async (req, res) => {
  const { name, category, unit, quantity, min_quantity, price, expiry_date, supplier } = req.body;
  let conn;
  try {
    conn = await getConnection();
    await conn.execute(
      `INSERT INTO medicines (name, category, unit, quantity, min_quantity, price, expiry_date, supplier)
       VALUES (:name, :category, :unit, :quantity, :min_quantity, :price, TO_DATE(:expiry_date,'YYYY-MM-DD'), :supplier)`,
      { name, category, unit, quantity, min_quantity, price, expiry_date, supplier },
      { autoCommit: true }
    );
    res.status(201).json({ message: 'Medicine added successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

exports.updateStock = async (req, res) => {
  const { quantity } = req.body;
  let conn;
  try {
    conn = await getConnection();
    await conn.execute(
      `UPDATE medicines SET quantity = quantity + :quantity WHERE medicine_id = :id`,
      { quantity, id: req.params.id },
      { autoCommit: true }
    );
    res.json({ message: 'Stock updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

exports.getPrescriptions = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT pr.prescription_id, pr.quantity, pr.dosage, pr.duration, pr.dispensed, pr.prescribed_at,
              p.full_name as patient_name,
              s.full_name as doctor_name,
              m.name as medicine_name, m.unit
       FROM prescriptions pr
       JOIN patients p ON pr.patient_id = p.patient_id
       JOIN staff s ON pr.doctor_id = s.staff_id
       JOIN medicines m ON pr.medicine_id = m.medicine_id
       ORDER BY pr.prescribed_at DESC`,
      [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

exports.addPrescription = async (req, res) => {
  const { patient_id, doctor_id, medicine_id, quantity, dosage, duration } = req.body;
  let conn;
  try {
    conn = await getConnection();
    await conn.execute(
      `BEGIN
         sp_add_prescription(:patient_id, :doctor_id, :medicine_id, :quantity, :dosage, :duration);
       END;`,
      { patient_id, doctor_id, medicine_id, quantity, dosage, duration },
      { autoCommit: true }
    );
    res.status(201).json({ message: 'Prescription added and stock updated' });
  } catch (err) {
    const statusCode = err.message.includes('ORA-20') ? 400 : 500;
    res.status(statusCode).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

exports.updateMedicine = async (req, res) => {
  const { name, category, unit, quantity, min_quantity, price, expiry_date, supplier } = req.body;
  let conn;
  try {
    conn = await getConnection();
    await conn.execute(
      `UPDATE medicines SET name=:name, category=:category, unit=:unit, quantity=:quantity,
       min_quantity=:min_quantity, price=:price, expiry_date=TO_DATE(:expiry_date,'YYYY-MM-DD'), supplier=:supplier
       WHERE medicine_id=:id`,
      { name, category, unit, quantity, min_quantity, price, expiry_date, supplier, id: req.params.id },
      { autoCommit: true }
    );
    res.json({ message: 'Medicine updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

exports.deleteMedicine = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    await conn.execute(
      `DELETE FROM medicines WHERE medicine_id = :id`,
      { id: req.params.id },
      { autoCommit: true }
    );
    res.json({ message: 'Medicine deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
};
