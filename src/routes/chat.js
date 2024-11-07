// src/routes/chat.js
import { Router } from 'express';
import * as chatController from '@/controllers/chat';
import { validateChatRequest } from '@/routes/validations/chat';
import { isAuthenticated } from '@/middleware';

const router = Router();

// Route to start a chat session
router.route('/start')
  .post(isAuthenticated, chatController.startChatSession); // Assuming you have this controller

router.route('/')
  .post(isAuthenticated, validateChatRequest, chatController.handleChat)
  .get(isAuthenticated, chatController.getChats);

// router.route('/session/:id')
//   .get(isAuthenticated, chatController.getChatHistoryBySessionId);

router.route('/:id')
  .get(isAuthenticated, chatController.getChatById)
  .delete(isAuthenticated, chatController.deleteChatById);

export default router;
