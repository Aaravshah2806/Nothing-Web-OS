import { Router } from 'express';
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  toggleShareNote,
  getSharedNote,
} from '../controllers/notes.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { requireDB } from '../middleware/dbCheck.middleware.js';

const router = Router();

router.use(requireDB);

// Public route for shared notes
router.get('/share/:slug', getSharedNote);

// Protected routes
router.use(protect);

router.route('/')
  .get(getNotes)
  .post(createNote);

router.route('/:id')
  .put(updateNote)
  .delete(deleteNote);

router.post('/:id/share', toggleShareNote);

export default router;
