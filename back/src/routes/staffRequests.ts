import { Router } from "express";
import * as StaffRequestsController from "../controllers/staffRequests";

/**
 * GET    /api/staff-requests                  → list pending (or all)
 * POST   /api/staff-requests                  → customer flags a perfume
 * PATCH  /api/staff-requests/:id/resolve      → staff marks done
 * DELETE /api/staff-requests/:id              → remove a request
 */
const router = Router();

router.get("/", StaffRequestsController.getAll);
router.post("/", StaffRequestsController.create);
router.patch("/:id/resolve", StaffRequestsController.resolve);
router.delete("/:id", StaffRequestsController.remove);

export default router;
