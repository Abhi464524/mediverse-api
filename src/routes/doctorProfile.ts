import { Router } from 'express';
import { upsertDoctorProfile, getDoctorProfile } from '../controllers/doctorController';

const router = Router();

router.post('/', upsertDoctorProfile);
router.get('/:doctorId', getDoctorProfile);

export default router;
