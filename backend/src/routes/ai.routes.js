import express from 'express';
import { chatWithAI, getChatHistory, clearChatHistory } from '../controllers/ai.controller.js';
import { optionalAuth, requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Chat is accessible in both guest (optionalAuth) and authenticated modes
router.post('/chat', optionalAuth, chatWithAI);

// History operations
router.get('/history', optionalAuth, getChatHistory);
router.delete('/history', optionalAuth, clearChatHistory);

export default router;
