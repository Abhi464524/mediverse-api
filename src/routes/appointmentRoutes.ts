import { Router } from 'express';
import { getAppointments, getEmergencyAppointments } from '../controllers/appointmentController';

const router = Router();

router.get('/appointments', getAppointments);
router.get('/emergency-appointments', getEmergencyAppointments);

export default router;
