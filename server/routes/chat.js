import { Router } from 'express';
import { handleChat, exportChatHistory } from '../controllers/chatController.js';
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.post('/', handleChat);

router.get('/export', exportChatHistory);

export default router;