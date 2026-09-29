import { Router } from 'express';
import {
  getMemos,
  getMemoAudio,
  saveMemo,
  deleteMemo,
} from '../controllers/recorder.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { requireDB } from '../middleware/dbCheck.middleware.js';

const router = Router();

router.use(requireDB);

router.use(protect);

router.route('/')
  .get(getMemos)
  .post(saveMemo);

router.route('/:id')
  .get(getMemoAudio)
  .delete(deleteMemo);

export default router;
