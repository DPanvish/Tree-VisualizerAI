// Importing necessary libraries and components
import { Router } from 'express';
import authMiddleware from "../middleware/authMiddleware.js";
import {
    getSessionById,
    getAllSessions,
    saveNewSession,
    deleteSession,
    getLatestSession
} from "../controllers/sessionsController.js";

// Creating a new router instance
const router = Router();

// --- Session Routes ---

// Apply authentication middleware to all routes in this file.
router.use(authMiddleware);

// Route to get the most recent session for the authenticated user.
router.get("/latest", getLatestSession);

// Route to get all sessions for the authenticated user.
router.get("/", getAllSessions);

// Route to get a specific session by its ID.
router.get("/:id", getSessionById);

// Route to save a new session.
router.post("/", saveNewSession);

// Route to delete a specific session by its ID.
router.delete("/:id", deleteSession);

// Exporting the router to be used in the main server file
export default router;