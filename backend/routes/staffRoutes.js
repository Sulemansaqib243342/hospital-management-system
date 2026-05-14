const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const ctrl = require('../controllers/staffController');

router.get('/', protect, ctrl.getAllStaff);
router.get('/doctors', protect, ctrl.getDoctors);
router.get('/:id', protect, ctrl.getStaffById);
router.put('/:id', protect, ctrl.updateStaff);
router.delete('/:id', protect, ctrl.deleteStaff);

module.exports = router;
