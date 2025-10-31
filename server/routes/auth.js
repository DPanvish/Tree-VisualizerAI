// Importing necessary libraries and components
import { Router } from 'express';
import { signup, login, getProfile } from '../controllers/authController.js';
import authMiddleware from "../middleware/authMiddleware.js";

// Creating a new router instance
const router = Router();

// --- Authentication Routes ---

// Route for user signup.
router.post('/signup', signup);

// Route for user login.
router.post('/login', login);

// Route to get the profile of the currently authenticated user.
// This route is protected by the authMiddleware.
router.get("/profile", authMiddleware, getProfile);

// Exporting the router to be used in the main server file
export default router;