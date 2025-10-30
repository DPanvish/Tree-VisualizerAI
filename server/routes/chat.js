import { Router } from 'express';
import authMiddleware from "../middleware/auth.js";
import { handleChat } from '../controllers/chatController.js';

const router = Router();

router.use(authMiddleware);

router.post('/', handleChat);

export default router;