import { Router } from 'express';
import { upsertDoctorProfile, getDoctorProfile } from '../controllers/doctorProfileController';

const router = Router();

router.post('/', upsertDoctorProfile);
router.get('/:doctorId', getDoctorProfile);

export default router;
