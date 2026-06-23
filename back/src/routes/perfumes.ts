import { Router } from "express";
import * as PerfumesController from "../controllers/perfumes";
import { requireAuth } from "../middleware/auth";

/**
 * All routes are prefixed with /api/perfumes (set in index.ts).
 *
 * GET    /api/perfumes           → list all (with optional filters)
 * GET    /api/perfumes/:id       → get one by ID
 * POST   /api/perfumes           → create new
 * PATCH  /api/perfumes/:id       → partial update
 * DELETE /api/perfumes/:id       → delete
 */
const router = Router();

router.get("/", PerfumesController.getAll);
router.get("/:id", PerfumesController.getOne);
router.post("/", requireAuth, PerfumesController.create);
router.patch("/:id", requireAuth, PerfumesController.update);
router.delete("/:id", requireAuth, PerfumesController.remove);

export default router;
