const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const ctrl = require('../controllers/billingController');

router.get('/', protect, ctrl.getAllBills);
router.get('/stats', protect, ctrl.getDashboardStats);
router.get('/auto-calculate/:patient_id', protect, ctrl.autoCalculateBill);
router.get('/:id', protect, ctrl.getBillById);
router.post('/', protect, ctrl.createBill);
router.put('/:id', protect, ctrl.updateBill);
router.put('/:id/payment', protect, ctrl.updatePayment);
router.delete('/:id', protect, ctrl.deleteBill);

module.exports = router;
