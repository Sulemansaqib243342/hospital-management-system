const oracledb = require('oracledb');
const { getConnection } = require('../db/connection');
const paymentUtils = require('../utils/paymentMethods');

exports.getAllBills = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT bill_id, total_amount, paid_amount, payment_mode, status, bill_date, notes,
              patient_name, patient_phone, balance
       FROM billing_summary_v
       ORDER BY bill_date DESC`,
      [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    // Attempt fallback using a fresh connection if original connection failed
    try {
      if (!conn) conn = await getConnection();
      const fallback = await conn.execute(
        `SELECT b.bill_id, b.total_amount, b.paid_amount, b.payment_mode, b.status, b.bill_date, b.notes,
                p.full_name as patient_name, p.phone as patient_phone,
                (b.total_amount - NVL(b.paid_amount,0)) as balance
         FROM billing b
         JOIN patients p ON b.patient_id = p.patient_id
         ORDER BY b.bill_date DESC`,
        [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      res.json(fallback.rows);
    } catch (fallbackErr) {
      res.status(500).json({ message: fallbackErr.message });
    }
  } finally {
    if (conn) await conn.close();
  }
};

exports.getBillById = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT b.*, p.full_name as patient_name, p.phone, p.address
       FROM billing b JOIN patients p ON b.patient_id = p.patient_id
       WHERE b.bill_id = :id`,
      { id: req.params.id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Bill not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

exports.createBill = async (req, res) => {
  const { patient_id, admission_id, total_amount, paid_amount, payment_mode, notes } = req.body;
  let conn;
  try {
    conn = await getConnection();
    await conn.execute(
      `INSERT INTO billing (patient_id, admission_id, total_amount, paid_amount, payment_mode, notes)
       VALUES (:patient_id, :admission_id, :total_amount, :paid_amount, :payment_mode, :notes)`,
      { patient_id, admission_id, total_amount, paid_amount, payment_mode, notes },
      { autoCommit: true }
    );
    res.status(201).json({ message: 'Bill created successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

// Deprecated duplicate updatePayment removed - use the consolidated version below

exports.getDashboardStats = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const revenue = await conn.execute(
      `SELECT NVL(SUM(paid_amount),0) as total_revenue,
              NVL(SUM(total_amount - paid_amount),0) as pending_amount,
              COUNT(*) as total_bills
       FROM billing WHERE TRUNC(bill_date,'MM') = TRUNC(SYSDATE,'MM')`,
      [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const patients = await conn.execute(
      `SELECT COUNT(*) as total FROM patients`, [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const admissions = await conn.execute(
      `SELECT COUNT(*) as inpatients FROM admissions WHERE discharge_date IS NULL`,
      [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const todayAppts = await conn.execute(
      `SELECT COUNT(*) as today_appts FROM appointments WHERE TRUNC(appt_date) = TRUNC(SYSDATE)`,
      [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json({
      revenue: revenue.rows[0],
      totalPatients: patients.rows[0].TOTAL,
      inpatients: admissions.rows[0].INPATIENTS,
      todayAppointments: todayAppts.rows[0].TODAY_APPTS
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

exports.autoCalculateBill = async (req, res) => {
  const patient_id = req.params.patient_id;
  let conn;
  try {
    conn = await getConnection();
    
    // 1. Calculate Appointments Cost (Assume $50 per appointment)
    const appts = await conn.execute(
      `SELECT COUNT(*) as count FROM appointments WHERE patient_id = :patient_id`,
      { patient_id }, { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const apptsCount = appts.rows[0].COUNT;
    const apptsCost = apptsCount * 50;

    // 2. Calculate Pharmacy Cost
    const rx = await conn.execute(
      `SELECT SUM(p.quantity * m.price) as total_med_cost, COUNT(p.prescription_id) as med_count
       FROM prescriptions p
       JOIN medicines m ON p.medicine_id = m.medicine_id
       WHERE p.patient_id = :patient_id`,
      { patient_id }, { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const medCost = rx.rows[0].TOTAL_MED_COST || 0;
    const medCount = rx.rows[0].MED_COUNT || 0;

    // 3. Find past billing to offset? (Optional, skipping for simple generation)

    const total = apptsCost + medCost;
    const notes = `Auto-calculated: ${apptsCount} Appointments ($${apptsCost}) + ${medCount} Prescriptions ($${medCost}).`;

    res.json({ suggested_total: total, suggested_notes: notes });

  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

exports.updateBill = async (req, res) => {
  const { total_amount, paid_amount, payment_mode, notes } = req.body;
  let conn;
  try {
    conn = await getConnection();
    await conn.execute(
      `UPDATE billing SET total_amount=:total_amount, paid_amount=:paid_amount, payment_mode=:payment_mode, notes=:notes
       WHERE bill_id=:id`,
      { total_amount, paid_amount, payment_mode, notes, id: req.params.id },
      { autoCommit: true }
    );
    res.json({ message: 'Bill updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

exports.deleteBill = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    await conn.execute(
      `DELETE FROM billing WHERE bill_id = :id`,
      { id: req.params.id },
      { autoCommit: true }
    );
    res.json({ message: 'Bill deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

exports.updatePayment = async (req, res) => {
  const { amount, payment_mode } = req.body;
  const bill_id = req.params.id;
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT total_amount, paid_amount FROM billing WHERE bill_id = :bill_id`,
      { bill_id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    
    const currentBill = result.rows[0];
    const total_amount = Number(currentBill.TOTAL_AMOUNT || 0);
    const new_paid_amount = Number(currentBill.PAID_AMOUNT || 0) + Number(amount);
    
    const status = new_paid_amount >= total_amount ? 'paid' : (new_paid_amount > 0 ? 'partial' : 'pending');
    
    await conn.execute(
      `UPDATE billing SET paid_amount = :paid_amount, payment_mode = :payment_mode, status = :status WHERE bill_id = :bill_id`,
      { paid_amount: new_paid_amount, payment_mode, status, bill_id },
      { autoCommit: true }
    );
    
    res.json({ message: 'Payment added successfully', new_paid_amount, status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
};
