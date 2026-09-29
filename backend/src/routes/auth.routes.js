import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { requireDB } from '../middleware/dbCheck.middleware.js';

const router = Router();

router.use(requireDB);

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

export default router;
