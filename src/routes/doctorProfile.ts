import { Router } from 'express';
import { upsertDoctorProfile, getDoctorProfile } from '../controllers/doctorController';

const router = Router();

router.post('/', upsertDoctorProfile);
router.get('/', getDoctorProfile); // Added this for query params like ?doctorId=6
router.get('/:doctorId', getDoctorProfile);

export default router;
