// Importing necessary libraries and components
import { Router } from 'express';
import { handleChat, exportChatHistory } from '../controllers/chatController.js';
import authMiddleware from "../middleware/authMiddleware.js";

// Creating a new router instance
const router = Router();

// --- Chat Routes ---

// Apply authentication middleware to all routes in this file.
router.use(authMiddleware);

// Route to handle incoming chat messages.
router.post('/', handleChat);

// Route to export the user's chat history.
router.get('/export', exportChatHistory);

// Exporting the router to be used in the main server file
export default router;