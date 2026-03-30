import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { createOrUpdateDoctorProfile, getDoctorProfile } from '../controllers/doctorController';

const router = Router();

// Get doctor profile
router.get('/profile', authenticate, getDoctorProfile);

// Create or update doctor profile
router.post('/profile', authenticate, createOrUpdateDoctorProfile);

export default router;
