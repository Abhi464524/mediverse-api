import { Router } from 'express';
import { createPrescription, getPrescriptions } from '../controllers/prescriptionController';

const router = Router();

router.post('/', createPrescription);
router.get('/', getPrescriptions);

export default router;
