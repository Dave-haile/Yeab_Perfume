import { Router } from "express";
import * as ConfigController from "../controllers/config";
import { requireAuth } from "../middleware/auth";

const router = Router();

// Public routes (no auth required)
router.get("/colors", ConfigController.getColors);
router.get("/logo", ConfigController.getLogo);

// Protected routes (require auth)
router.post("/colors", requireAuth, ConfigController.saveColors);
router.post("/logo", requireAuth, ConfigController.saveLogo);

export default router;
