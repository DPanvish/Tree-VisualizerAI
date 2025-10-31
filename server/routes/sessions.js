import { Router } from 'express';
import authMiddleware from "../middleware/authMiddleware.js";

import { getSessionById, getAllSessions, saveNewSession, deleteSession, getLatestSession } from "../controllers/sessionsController.js";

const router = Router();

router.use(authMiddleware);

router.get("/latest", getLatestSession);
router.get("/", getAllSessions);
router.get("/:id", getSessionById);
router.post("/", saveNewSession);
router.delete("/:id", deleteSession);

export default router;