const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const ctrl = require('../controllers/appointmentController');

router.get('/', ctrl.getAllAppointments);
router.get('/today', ctrl.getTodayAppointments);
router.post('/', ctrl.createAppointment);
router.put('/:id/status', ctrl.updateAppointmentStatus);
router.post('/:id/attend', ctrl.attendPatient);
router.delete('/:id', ctrl.deleteAppointment);

module.exports = router;
