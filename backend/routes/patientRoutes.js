const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const ctrl = require('../controllers/patientController');

router.get('/', protect, ctrl.getAllPatients);
router.get('/:id', protect, ctrl.getPatientById);
router.post('/', protect, ctrl.createPatient);
router.put('/:id', protect, ctrl.updatePatient);
router.delete('/:id', protect, ctrl.deletePatient);

module.exports = router;
