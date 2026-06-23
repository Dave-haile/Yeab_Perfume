import { Router } from "express";
import * as AuthController from "../controllers/auth";
import { requireAuth } from "../middleware/auth";

/**
 * POST /api/auth/login  → get a token
 * GET  /api/auth/me     → verify token + get current user (protected)
 */
const router = Router();

router.post("/login", AuthController.login);
router.get("/me", requireAuth, AuthController.me);

export default router;
