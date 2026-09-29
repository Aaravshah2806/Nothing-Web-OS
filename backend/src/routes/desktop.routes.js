import { Router } from 'express';
import { getDesktopState, updateDesktopState } from '../controllers/desktop.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { requireDB } from '../middleware/dbCheck.middleware.js';

const router = Router();

router.use(requireDB);

router.route('/state')
  .get(protect, getDesktopState)
  .put(protect, updateDesktopState);

export default router;
