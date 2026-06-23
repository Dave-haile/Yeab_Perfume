import { Router } from "express";
import * as UsersController from "../controllers/users";
import { requireAuth, requireAdmin } from "../middleware/auth";

/**
 * All routes here require: logged in AND admin role.
 * requireAuth runs first, then requireAdmin.
 *
 * GET    /api/admin/users      → list all users
 * POST   /api/admin/users      → create a user
 * DELETE /api/admin/users/:id  → delete a user
 */
const router = Router();

// Apply both guards to every route in this router at once
router.use(requireAuth, requireAdmin);

router.get("/users", UsersController.getAll);
router.post("/users", UsersController.create);
router.delete("/users/:id", UsersController.remove);

export default router;
