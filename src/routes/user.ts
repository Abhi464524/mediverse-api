import { Router } from 'express';
import { registerUser, loginUser, loginByPhone } from '../controllers/userController';

const router = Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/login-phone', loginByPhone);

export default router;
