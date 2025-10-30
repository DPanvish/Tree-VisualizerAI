import { Router } from 'express';
import authMiddleware from "../middleware/auth.js";

import {getSessionById, getAllSessions, saveNewSession, deleteSession} from "../controllers/sessionsController.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getAllSessions);
router.get("/:id", getSessionById);
router.post("/", saveNewSession);
router.delete("/:id", deleteSession);

export default router;