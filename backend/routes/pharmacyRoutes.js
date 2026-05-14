const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const ctrl = require('../controllers/pharmacyController');

router.get('/medicines', protect, ctrl.getAllMedicines);
router.get('/medicines/low-stock', protect, ctrl.getLowStock);
router.post('/medicines', protect, ctrl.addMedicine);
router.put('/medicines/:id', protect, ctrl.updateMedicine);
router.put('/medicines/:id/stock', protect, ctrl.updateStock);
router.delete('/medicines/:id', protect, ctrl.deleteMedicine);
router.get('/prescriptions', protect, ctrl.getPrescriptions);
router.post('/prescriptions', protect, ctrl.addPrescription);

module.exports = router;
